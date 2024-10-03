const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const NodeRSA = require('node-rsa');
const cors = require('cors');
const { gostCrypto, gostEngine } = require('node-gost-crypto');
const app = express();

app.use(cors({
    origin: ['https://reyesrivera11.github.io', 'http://localhost:5173'],
    credentials: true
}));

app.use(bodyParser.json());

// Función para derivar una clave segura a partir de la clave de 16 caracteres del usuario
function deriveKeyFromUserInput(userKey) {
    return crypto.createHash('sha256').update(userKey).digest().slice(0, 16); // Derivar la clave y tomar los primeros 16 bytes
}

// Función para cifrar datos usando un cifrado personalizado tipo Serpent
function serpentEncrypt(data, key) {
    const dataBuffer = Buffer.from(data, 'utf8');
    const keyBuffer = Buffer.from(key, 'utf8');
    const encryptedBuffer = Buffer.alloc(dataBuffer.length);

    for (let i = 0; i < dataBuffer.length; i++) {
        encryptedBuffer[i] = dataBuffer[i] ^ keyBuffer[i % keyBuffer.length]; // Operación XOR con la clave
        encryptedBuffer[i] = (encryptedBuffer[i] << 1) | (encryptedBuffer[i] >> 7); // Rotar bits a la izquierda
    }

    return { iv: 'manual_iv', encryptedData: encryptedBuffer.toString('base64') }; // Retornar los datos cifrados
}

// Función para descifrar datos usando un cifrado personalizado tipo Serpent
function serpentDecrypt(encryptedData, key) {
    const encryptedBuffer = Buffer.from(encryptedData.encryptedData, 'base64');
    const keyBuffer = Buffer.from(key, 'utf8');
    const decryptedBuffer = Buffer.alloc(encryptedBuffer.length);

    for (let i = 0; i < encryptedBuffer.length; i++) {
        encryptedBuffer[i] = (encryptedBuffer[i] >> 1) | ((encryptedBuffer[i] & 1) << 7); // Rotar bits a la derecha
        decryptedBuffer[i] = encryptedBuffer[i] ^ keyBuffer[i % keyBuffer.length]; // Operación XOR con la clave
    }

    return decryptedBuffer.toString('utf8'); // Retornar los datos descifrados como string
}

// Generar par de llaves RSA
const rsaKey = new NodeRSA({ b: 2048 });
const publicKey = rsaKey.exportKey('public'); // Clave pública en formato PEM
const privateKey = rsaKey.exportKey('private'); // Clave privada en formato PEM

// Crear instancias separadas para la clave pública y privada
const rsaPublicKey = new NodeRSA(publicKey); // Instancia con la clave pública
const rsaPrivateKey = new NodeRSA(privateKey); // Instancia con la clave privada

// Función para hacer hash utilizando GOST R 34.11-94
const hashGOST = async (text) => {
    const buffer = Buffer.from(text);
    const digestEngine = gostEngine.getGostDigest({ name: 'GOST R 34.11', length: 256, version: 1994 });
    const digestResult = Buffer.from(digestEngine.digest(buffer)).toString('hex');
    const arrayBuffer = await gostCrypto.subtle.digest('GOST R 34.11-94-256', buffer);
    const digestCrypto = Buffer.from(arrayBuffer).toString('hex');
    return { digestEngine, digestCrypto };
};

// Ruta para cifrar datos
app.post('/submit', async (req, res) => {
    const { userKey, name, email, phone, address, creditCard, password } = req.body;

    // Validar que el usuario ingrese una clave de 16 caracteres
    if (userKey.length !== 16) {
        return res.status(400).json({ error: 'La clave debe ser de exactamente 16 caracteres' });
    }

    // Derivar una clave de 16 bytes (128 bits) a partir de la clave del usuario
    const symmetricKey = deriveKeyFromUserInput(userKey);

    // Cifrado simétrico con nuestro cifrado Serpent simplificado para nombre, dirección y correo
    const encryptedName = serpentEncrypt(name, symmetricKey);
    const encryptedAddress = serpentEncrypt(address, symmetricKey);
    const encryptedEmail = serpentEncrypt(email, symmetricKey);

    // Cifrado asimétrico (RSA) para teléfono y tarjeta de crédito usando la clave pública
    const encryptedPhone = rsaPublicKey.encrypt(phone, 'base64');
    const encryptedCreditCard = rsaPublicKey.encrypt(creditCard, 'base64');

    // Hash con GOST R 34.11-94 para la contraseña
    const { digestEngine, digestCrypto } = await hashGOST(password);

    // Responder con los datos cifrados y el hash de la contraseña
    res.json({
        encryptedData: {
            encryptedName,
            encryptedAddress,
            encryptedPhone,
            encryptedCreditCard,
            encryptedEmail,
            digestCrypto
        }
    });
});

// Ruta para descifrar los datos cifrados con nuestro cifrado Serpent simplificado
app.post('/decrypt', (req, res) => {
    const { userKey, encryptedEmail, encryptedName, encryptedAddress, encryptedPhone, encryptedCreditCard } = req.body;

    // Derivar la misma clave simétrica usada para el cifrado
    const symmetricKey = deriveKeyFromUserInput(userKey);

    try {
        // Descifrar nombre, dirección y correo usando nuestro cifrado Serpent simplificado
        const decryptedName = serpentDecrypt(encryptedName, symmetricKey);
        const decryptedAddress = serpentDecrypt(encryptedAddress, symmetricKey);
        const decryptedEmail = serpentDecrypt(encryptedEmail, symmetricKey);

        // Descifrar teléfono y tarjeta de crédito usando la clave privada RSA
        const decryptedPhone = rsaPrivateKey.decrypt(encryptedPhone, 'utf8');
        const decryptedCreditCard = rsaPrivateKey.decrypt(encryptedCreditCard, 'utf8');

        // Responder con los datos descifrados
        res.json({
            decryptedData: {
                decryptedName,
                decryptedAddress,
                decryptedPhone,
                decryptedCreditCard,
                decryptedEmail
            }
        });
    } catch (error) {
        res.status(400).json({ error: 'Error al descifrar los datos, la clave no coincide.' });
    }
});

// Iniciar el servidor
app.listen(3001, () => {
    console.log('Server running on port 3001');
});

module.exports = app;

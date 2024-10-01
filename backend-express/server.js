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
    return crypto.createHash('sha256').update(userKey).digest();
}

// Función para cifrar datos usando AES
function encryptData(data, key) {
    const iv = crypto.randomBytes(16); // Generar un IV aleatorio
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv); // Cifrado AES
    let encrypted = cipher.update(data, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return { iv: iv.toString('base64'), encryptedData: encrypted }; // Devolver IV y datos cifrados
}

// Función para descifrar datos usando AES
function decryptData(encryptedData, key) {
    const iv = Buffer.from(encryptedData.iv, 'base64'); // IV usado en el cifrado
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv); // Descifrado AES
    let decrypted = decipher.update(encryptedData.encryptedData, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted; // Retornar los datos descifrados
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

    // Usando GOST engine
    const digestEngine = gostEngine.getGostDigest({ name: 'GOST R 34.11', length: 256, version: 1994 });
    const digestResult = Buffer.from(digestEngine.digest(buffer)).toString('hex');

    // Alternativamente, usando crypto
    const arrayBuffer = await gostCrypto.subtle.digest('GOST R 34.11-94-256', buffer);
    const digestCrypto = Buffer.from(arrayBuffer).toString('hex');

    return { digestEngine, digestCrypto }; // Devolver ambos resultados
};

// Ruta para cifrar datos
app.post('/submit', async (req, res) => {
    const { userKey, name, email, phone, address, creditCard, password } = req.body;

    // Validar que el usuario ingrese una clave de 16 caracteres
    if (userKey.length !== 16) {
        return res.status(400).json({ error: 'La clave debe ser de exactamente 16 caracteres' });
    }

    // Derivar una clave de 32 bytes (256 bits) a partir de la clave del usuario
    const symmetricKey = deriveKeyFromUserInput(userKey);

    // Cifrado simétrico (AES) para nombre, dirección y correo
    const encryptedName = encryptData(name, symmetricKey);
    const encryptedAddress = encryptData(address, symmetricKey);
    const encryptedEmail = encryptData(email, symmetricKey);

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

// Ruta para descifrar los datos simétricos (AES)
app.post('/decrypt', (req, res) => {
    const { userKey, encryptedEmail, encryptedName, encryptedAddress, encryptedPhone, encryptedCreditCard } = req.body;

    // Derivar la misma clave simétrica usada para el cifrado
    const symmetricKey = deriveKeyFromUserInput(userKey);

    try {
        // Descifrar nombre, dirección y correo usando AES
        const decryptedName = decryptData(encryptedName, symmetricKey);
        const decryptedAddress = decryptData(encryptedAddress, symmetricKey);
        const decryptedEmail = decryptData(encryptedEmail, symmetricKey);

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
        // Si ocurre un error (como clave incorrecta), devolver mensaje de error
        res.status(400).json({ error: 'Error al descifrar los datos, la clave no coincide.' });
    }
});

// Ruta de prueba
app.get('/helloworld', (req, res) => {
    res.send('¡Hola desde Express en Vercel!');
});

// Iniciar el servidor
app.listen(3001, () => {
    console.log('Server running on port 3001');
});

module.exports = app;

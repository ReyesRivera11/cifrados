from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_OAEP
from base64 import b64encode, b64decode
import hashlib
import json

# Tamaño de bloque para Serpent simplificado (16 bytes, 128 bits)
BLOCK_SIZE = 16

# Generar un par de llaves RSA
rsa_key = RSA.generate(2048)
public_key = rsa_key.publickey().export_key()
private_key = rsa_key.export_key()

# Derivar clave segura a partir de la clave de usuario (primero 16 bytes de SHA-256)
def derive_key(user_key):
    return hashlib.sha256(user_key.encode()).digest()[:16]

# Función para cifrar datos usando Serpent simplificado
def serpent_encrypt(data, key):
    data_bytes = data.encode('utf-8')
    key_bytes = key
    encrypted_bytes = bytearray(len(data_bytes))

    for i in range(len(data_bytes)):
        # Operación XOR con la clave
        encrypted_bytes[i] = data_bytes[i] ^ key_bytes[i % len(key_bytes)]
        # Rotar bits a la izquierda
        encrypted_bytes[i] = ((encrypted_bytes[i] << 1) & 0xFF) | (encrypted_bytes[i] >> 7)

    return b64encode(encrypted_bytes).decode('utf-8')

# Función para descifrar datos usando Serpent simplificado
def serpent_decrypt(encrypted_data, key):
    encrypted_bytes = b64decode(encrypted_data)
    key_bytes = key
    decrypted_bytes = bytearray(len(encrypted_bytes))

    for i in range(len(encrypted_bytes)):
        # Rotar bits a la derecha
        temp_byte = (encrypted_bytes[i] >> 1) | ((encrypted_bytes[i] & 0x01) << 7)
        # Operación XOR con la clave
        decrypted_bytes[i] = temp_byte ^ key_bytes[i % len(key_bytes)]

    return decrypted_bytes.decode('utf-8')

@csrf_exempt
def encrypt_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user_key = data.get('userKey')
            name = data.get('name')
            email = data.get('email')
            phone = data.get('phone')
            address = data.get('address')
            credit_card = data.get('creditCard')
            password = data.get('password')

            if not all([user_key, name, email, phone, address, credit_card, password]):
                return JsonResponse({'error': 'Todos los campos son requeridos.'}, status=400)

            if len(user_key) != 16:
                return JsonResponse({'error': 'La clave debe ser de exactamente 16 caracteres'}, status=400)

            # Derivar la clave simétrica usando SHA-256
            symmetric_key = derive_key(user_key)

            # Cifrado simétrico usando Serpent simplificado
            encrypted_name = serpent_encrypt(name, symmetric_key)
            encrypted_address = serpent_encrypt(address, symmetric_key)
            encrypted_email = serpent_encrypt(email, symmetric_key)
            encrypted_credit_card = serpent_encrypt(credit_card, symmetric_key)

            # Cifrado asimétrico usando RSA para el teléfono
            rsa_cipher = PKCS1_OAEP.new(RSA.import_key(public_key))
            encrypted_phone = b64encode(rsa_cipher.encrypt(phone.encode())).decode()

            # Hash de la contraseña usando SHA-256
            hash_password = hashlib.sha256(password.encode()).hexdigest()

            return JsonResponse({
                'encryptedName': encrypted_name,
                'encryptedAddress': encrypted_address,
                'encryptedEmail': encrypted_email,
                'encryptedCreditCard': encrypted_credit_card,
                'encryptedPhone': encrypted_phone,
                'hashPassword': hash_password
            })
        except Exception as e:
            return JsonResponse({'error': f'Error durante el cifrado: {str(e)}'}, status=500)

@csrf_exempt
def decrypt_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user_key = data.get('userKey')
            encrypted_name = data.get('encryptedName')
            encrypted_address = data.get('encryptedAddress')
            encrypted_email = data.get('encryptedEmail')
            encrypted_credit_card = data.get('encryptedCreditCard')
            encrypted_phone = data.get('encryptedPhone')

            if not all([user_key, encrypted_name, encrypted_address, encrypted_email, encrypted_phone]):
                return JsonResponse({'error': 'Todos los campos para descifrado son requeridos.'}, status=400)

            symmetric_key = derive_key(user_key)

            # Descifrado simétrico usando Serpent simplificado
            decrypted_name = serpent_decrypt(encrypted_name, symmetric_key)
            decrypted_address = serpent_decrypt(encrypted_address, symmetric_key)
            decrypted_email = serpent_decrypt(encrypted_email, symmetric_key)
            decrypted_credit_card = serpent_decrypt(encrypted_credit_card, symmetric_key)

            # Descifrado asimétrico usando RSA para el teléfono
            rsa_cipher = PKCS1_OAEP.new(RSA.import_key(private_key))
            decrypted_phone = rsa_cipher.decrypt(b64decode(encrypted_phone)).decode()

            return JsonResponse({
                'decryptedName': decrypted_name,
                'decryptedAddress': decrypted_address,
                'decryptedEmail': decrypted_email,
                'decryptedPhone': decrypted_phone,
                'decryptedCreditCard': decrypted_credit_card
            })
        except Exception as e:
            return JsonResponse({'error': f'Error durante el descifrado: {str(e)}'}, status=500)

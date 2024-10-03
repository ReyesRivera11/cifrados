# encryption_app/views.py

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_OAEP
from base64 import b64encode, b64decode
import hashlib
import json

# Definir el tamaño de bloque para Serpent (16 bytes, 128 bits)
BLOCK_SIZE = 16

# Generar un par de llaves RSA
rsa_key = RSA.generate(2048)
public_key = rsa_key.publickey().export_key()
private_key = rsa_key.export_key()

# Definir las S-boxes de Serpent (16 en total)
SBOXES = [
    [3, 8, 15, 1, 10, 6, 5, 11, 14, 13, 4, 2, 7, 0, 9, 12],
    [15, 12, 2, 7, 9, 0, 5, 10, 1, 11, 14, 8, 6, 13, 3, 4],
    [8, 6, 7, 9, 3, 12, 10, 15, 13, 1, 14, 4, 0, 11, 5, 2],
    [0, 15, 11, 8, 12, 9, 6, 3, 13, 1, 2, 4, 10, 7, 5, 14],
    [1, 15, 8, 3, 12, 0, 11, 6, 2, 5, 4, 10, 9, 14, 7, 13],
    [15, 5, 2, 11, 4, 10, 9, 12, 0, 3, 14, 8, 13, 6, 7, 1],
    [7, 2, 12, 5, 8, 4, 6, 11, 14, 9, 1, 15, 13, 3, 0, 10],
    [1, 13, 15, 0, 14, 8, 2, 11, 7, 4, 12, 10, 9, 3, 5, 6],
    [15, 12, 9, 6, 4, 1, 3, 11, 13, 14, 10, 7, 5, 0, 8, 2],
    [3, 8, 11, 5, 15, 0, 6, 10, 1, 13, 12, 4, 7, 9, 14, 2],
    [7, 15, 5, 10, 8, 1, 6, 13, 0, 9, 3, 14, 11, 4, 2, 12],
    [3, 6, 0, 10, 13, 15, 5, 9, 12, 7, 2, 8, 14, 1, 11, 4],
    [1, 10, 6, 15, 8, 0, 7, 9, 3, 14, 11, 5, 2, 12, 4, 13],
    [15, 12, 7, 10, 2, 8, 4, 3, 9, 1, 5, 11, 6, 13, 0, 14],
    [1, 14, 10, 0, 4, 15, 8, 13, 7, 5, 3, 12, 9, 2, 6, 11],
    [15, 4, 5, 12, 3, 0, 7, 6, 2, 8, 14, 10, 1, 13, 9, 11]
]

# Implementar la permutación lineal de Serpent
def linear_transformation(block):
    return [block[(i * 3) % len(block)] for i in range(len(block))]

# Implementar la función de cifrado de Serpent
def serpent_encrypt_block(block, subkeys):
    # Transformación inicial
    state = block

    # Realizar 32 rondas de Serpent
    for i in range(32):
        if len(state) != BLOCK_SIZE or len(subkeys[i]) != BLOCK_SIZE:
            print(f"Error: La longitud del bloque o subclave no es correcta en la ronda {i}.")
            print(f"Longitud del estado: {len(state)}, longitud de la subclave: {len(subkeys[i])}")
            return None
        # Aplicar la S-box correspondiente
        state = [SBOXES[i % len(SBOXES)][byte % 16] for byte in state]  # Ajustar para no exceder 16 valores de la S-box
        # Aplicar la permutación lineal
        state = linear_transformation(state)
        # Aplicar la subclave de la ronda
        state = [(state[j] ^ subkeys[i][j]) % 256 for j in range(len(state))]  # Ajustar con módulo 256

    # Transformación final
    return state

# Implementar la función de descifrado de Serpent
def serpent_decrypt_block(block, subkeys):
    # Transformación inicial inversa
    state = block

    # Realizar 32 rondas de Serpent (en orden inverso)
    for i in range(31, -1, -1):
        if len(state) != BLOCK_SIZE or len(subkeys[i]) != BLOCK_SIZE:
            print(f"Error: La longitud del bloque o subclave no es correcta en la ronda {i}.")
            print(f"Longitud del estado: {len(state)}, longitud de la subclave: {len(subkeys[i])}")
            return None
        # Aplicar la subclave de la ronda
        state = [(state[j] ^ subkeys[i][j]) % 256 for j in range(len(state))]
        # Aplicar la permutación lineal inversa
        state = linear_transformation(state)  # No se define la inversa aquí, solo un placeholder
        # Aplicar la S-box inversa correspondiente
        state = [SBOXES[i % len(SBOXES)].index(byte % 16) for byte in state]  # Ajustar para no exceder 16 valores

    # Transformación final inversa
    return state

# Generar subclaves de Serpent
def generate_subkeys(key, N):
    subkeys = []
    for i in range(32):
        subkeys.append(key[i:i+N])  # Tomar segmentos de la clave
        if len(subkeys[i]) < N:
            subkeys[i].extend([0] * (N - len(subkeys[i])))  # Rellenar con ceros si es necesario
    return subkeys

# Definir la longitud de bloque y clave para Serpent (16 bytes)
KEY_SIZE = 16

# Implementar padding manual para Serpent (PKCS7)
def pad(data, block_size):
    padding_len = block_size - len(data) % block_size
    return data + bytes([padding_len]) * padding_len

# Implementar unpadding manual para Serpent (PKCS7)
def unpad(data, block_size):
    padding_len = data[-1]
    if padding_len > block_size:
        raise ValueError("Padding length is invalid.")
    return data[:-padding_len]

# Función para cifrar con Serpent en lugar de AES
def serpent_encrypt(data, key):
    # Convertir la cadena a una lista de bytes (encriptar por bloques de longitud 16)
    padded_data = pad(data.encode(), BLOCK_SIZE)
    data_blocks = [padded_data[i:i+BLOCK_SIZE] for i in range(0, len(padded_data), BLOCK_SIZE)]
    subkeys = generate_subkeys(list(key), BLOCK_SIZE)
    encrypted_blocks = [serpent_encrypt_block(list(block), subkeys) for block in data_blocks]
    return b64encode(bytes([item for sublist in encrypted_blocks for item in sublist])).decode()

# Función para descifrar con Serpent
def serpent_decrypt(data, key):
    data = b64decode(data)
    data_blocks = [data[i:i+BLOCK_SIZE] for i in range(0, len(data), BLOCK_SIZE)]
    subkeys = generate_subkeys(list(key), BLOCK_SIZE)
    decrypted_blocks = [serpent_decrypt_block(list(block), subkeys) for block in data_blocks]
    decrypted_data = b''.join([bytes(block) for block in decrypted_blocks])
    return unpad(decrypted_data, BLOCK_SIZE).decode()

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

            # Derivar la clave usando SHA-256
            symmetric_key = hashlib.sha256(user_key.encode()).digest()[:16]  # Solo usamos los primeros 16 bytes

            # Cifrado usando Serpent
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
            print("Error durante el cifrado:", str(e))
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

            symmetric_key = hashlib.sha256(user_key.encode()).digest()[:16]  # Solo usamos los primeros 16 bytes

            # Descifrado usando Serpent
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
            print("Error durante el descifrado:", str(e))
            return JsonResponse({'error': f'Error durante el descifrado: {str(e)}'}, status=500)

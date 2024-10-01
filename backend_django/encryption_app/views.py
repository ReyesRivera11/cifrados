# encryption_app/views.py

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from Crypto.Cipher import AES
from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_OAEP
from Crypto.Util.Padding import pad, unpad  # Importar funciones de relleno y eliminación de relleno
from base64 import b64encode, b64decode
import hashlib
import json

# Definir el tamaño de bloque para AES (16 bytes)
BLOCK_SIZE = 16

# Generar un par de llaves RSA
rsa_key = RSA.generate(2048)
public_key = rsa_key.publickey().export_key()
private_key = rsa_key.export_key()

# Función para agregar relleno (padding)
def pad_data(data):
    """Añadir relleno a los datos para que sean múltiplos de BLOCK_SIZE bytes."""
    return pad(data.encode(), BLOCK_SIZE)

# Función para eliminar el relleno (unpadding)
def unpad_data(data):
    """Eliminar relleno de los datos."""
    return unpad(data, BLOCK_SIZE).decode('utf-8')

@csrf_exempt
def encrypt_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print("Datos recibidos para cifrado:", data)

            user_key = data.get('userKey')
            name = data.get('name')
            email = data.get('email')
            phone = data.get('phone')
            address = data.get('address')
            credit_card = data.get('creditCard')
            password = data.get('password')

            # Validar que todos los campos estén presentes
            if not all([user_key, name, email, phone, address, credit_card, password]):
                return JsonResponse({'error': 'Todos los campos son requeridos.'}, status=400)

            if len(user_key) != 16:
                return JsonResponse({'error': 'La clave debe ser de exactamente 16 caracteres'}, status=400)

            # Derivar la clave usando SHA-256
            symmetric_key = hashlib.sha256(user_key.encode()).digest()

            # Cifrado usando AES
            cipher_aes = AES.new(symmetric_key, AES.MODE_CBC)
            iv = cipher_aes.iv

            # Agregar relleno a los datos antes de cifrar
            encrypted_name = b64encode(cipher_aes.encrypt(pad_data(name))).decode()
            encrypted_address = b64encode(cipher_aes.encrypt(pad_data(address))).decode()
            encrypted_email = b64encode(cipher_aes.encrypt(pad_data(email))).decode()
            encrypted_credit_card = b64encode(cipher_aes.encrypt(pad_data(credit_card))).decode()

            # Cifrado asimétrico usando RSA
            rsa_cipher = PKCS1_OAEP.new(RSA.import_key(public_key))
            encrypted_phone = b64encode(rsa_cipher.encrypt(phone.encode())).decode()

            # Hash usando SHA-256 (en lugar de GOST)
            hash_password = hashlib.sha256(password.encode()).hexdigest()

            return JsonResponse({
                'encryptedName': encrypted_name,
                'encryptedAddress': encrypted_address,
                'encryptedEmail': encrypted_email,
                'encryptedCreditCard': encrypted_credit_card,
                'encryptedPhone': encrypted_phone,
                'hashPassword': hash_password,
                'iv': b64encode(iv).decode()  # Devuelve el IV para usar en el descifrado
            })
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Formato JSON no válido en la solicitud.'}, status=400)
        except Exception as e:
            print("Error durante el cifrado:", str(e))  # Imprimir el error en la consola de Django
            return JsonResponse({'error': f'Error durante el cifrado: {str(e)}'}, status=500)

@csrf_exempt
def decrypt_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            # print("Datos recibidos para descifrado:", data)

            user_key = data.get('userKey')
            encrypted_name = data.get('encryptedName')
            encrypted_address = data.get('encryptedAddress')
            encrypted_email = data.get('encryptedEmail')
            encrypted_credit_card = data.get('encryptedCreditCard')
            encrypted_phone = data.get('encryptedPhone')
            iv = data.get('iv')  # Asegúrate de recibir el IV desde la solicitud

            # Validar que todos los campos estén presentes
            if not all([user_key, encrypted_name, encrypted_address, encrypted_email, encrypted_phone, iv]):
                return JsonResponse({'error': 'Todos los campos para descifrado son requeridos.'}, status=400)

            symmetric_key = hashlib.sha256(user_key.encode()).digest()

            # Descifrado usando AES
            cipher_aes = AES.new(symmetric_key, AES.MODE_CBC, iv=b64decode(iv))
            decrypted_name = unpad_data(cipher_aes.decrypt(b64decode(encrypted_name)))
            decrypted_address = unpad_data(cipher_aes.decrypt(b64decode(encrypted_address)))
            decrypted_email = unpad_data(cipher_aes.decrypt(b64decode(encrypted_email)))
            decrypted_credit_card = unpad_data(cipher_aes.decrypt(b64decode(encrypted_credit_card)))

            # Descifrado asimétrico usando RSA
            rsa_cipher = PKCS1_OAEP.new(RSA.import_key(private_key))
            decrypted_phone = rsa_cipher.decrypt(b64decode(encrypted_phone)).decode()

            return JsonResponse({
                'decryptedName': decrypted_name,
                'decryptedAddress': decrypted_address,
                'decryptedEmail': decrypted_email,
                'decryptedPhone': decrypted_phone,
                'decryptedCreditCard': decrypted_credit_card
            })
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Formato JSON no válido en la solicitud.'}, status=400)
        except Exception as e:
            print("Error durante el descifrado:", str(e))  # Imprimir el error en la consola de Django
            return JsonResponse({'error': f'Error durante el descifrado: {str(e)}'}, status=500)

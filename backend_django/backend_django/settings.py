# settings.py completo

import os
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv('SECRET_KEY', 'django-insecure-ejce(pqmd@bh_dwa1&51c1ayct*lc)(b-ut3rdw8n$-*_$r0r-')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.getenv('DEBUG', 'True') == 'True'  # Cambiar a 'False' para producción

# Hosts permitidos, incluye el dominio de Render cuando despliegues la aplicación
ALLOWED_HOSTS = ['reyesrivera11.github.io', 'localhost', '127.0.0.1', '.onrender.com']

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.contenttypes',
    'django.contrib.staticfiles',
    'encryption_app',  # Aplicación de cifrado
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',  # WhiteNoise para servir archivos estáticos en producción
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'backend_django.urls'

# Configuración para CORS (Cross-Origin Resource Sharing)
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_METHODS = ['DELETE', 'GET', 'OPTIONS', 'PATCH', 'POST', 'PUT']
CORS_ALLOW_HEADERS = ['accept', 'authorization', 'content-type', 'X-CSRFToken']

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend_django.wsgi.application'

# Si no usas base de datos, desactiva completamente la configuración de `DATABASES`
DATABASES = {}  # Eliminando la configuración de bases de datos para no usar ninguna.

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')  # Directorio donde se almacenarán los archivos estáticos

# Configuración de archivos estáticos para Render
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Configuración de media files (si tienes subida de archivos)
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Seguridad para despliegue en Render 
CSRF_TRUSTED_ORIGINS = ['https://*.onrender.com']
SECURE_SSL_REDIRECT = os.getenv('SECURE_SSL_REDIRECT', 'False') == 'True'

# encryption_app/urls.py

from django.urls import path
from .views import encrypt_view, decrypt_view

urlpatterns = [
    path('submit/', encrypt_view, name='encrypt_view'),
    path('decrypt/', decrypt_view, name='decrypt_view'),
]

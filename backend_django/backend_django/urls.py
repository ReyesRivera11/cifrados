# backend_django/urls.py

from django.contrib import admin
from django.urls import path, include  # Asegúrate de importar 'include'

urlpatterns = [
    path('admin/', admin.site.urls),
    path('encryption/', include('encryption_app.urls')),  # Incluir las rutas de encryption_app
]

"""
Encorely — URL Configuration
=============================
Punto de entrada principal de URLs del proyecto.
Conecta las rutas de todas las apps y la documentación Swagger.
"""

from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView,
)

urlpatterns = [
    # ── Admin ──────────────────────────────────────────
    path('admin/', admin.site.urls),

    # ── API Endpoints ──────────────────────────────────
    path('api/auth/', include('apps.users.urls')),         # Auth: registro, login, perfil
    path('api/', include('apps.music.urls')),               # Songs & Swipes
    path('api/', include('apps.matches.urls')),             # Matches & Radar
    path('api/', include('apps.chat.urls')),                # Chat & Messages
    path('api/', include('apps.events.urls')),              # Events & Attendance

    # ── API Documentation (Swagger) ────────────────────
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]

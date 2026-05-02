"""
Users — Modelos
================
Modelo de usuario personalizado para Encorely.
Extiende AbstractUser de Django para soportar campos adicionales
requeridos por la plataforma de matchmaking musical.

Patrón POO: Herencia (AbstractUser → User)
Se completará en el Commit 2 con campos extendidos y MusicVibeVector.
"""

from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    Modelo de usuario extendido para Encorely.

    Hereda de AbstractUser para mantener compatibilidad con el sistema
    de autenticación de Django mientras permite campos personalizados.

    Campos adicionales se agregarán en Commit 2:
    - display_name, concert_mood, city, swipe_count, is_premium, bio
    """

    class Meta:
        db_table = 'encorely_users'
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'

    def __str__(self):
        return f'{self.username} ({self.email})'

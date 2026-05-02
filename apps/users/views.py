from rest_framework.generics import CreateAPIView, RetrieveUpdateAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model

from .serializers import (
    UserRegistrationSerializer,
    UserProfileSerializer,
    UserUpdateSerializer,
    CustomTokenObtainPairSerializer
)

User = get_user_model()


class RegisterView(CreateAPIView):
    """
    Vista para el registro de nuevos usuarios.
    Endpoint: POST /api/auth/register/
    """
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = UserRegistrationSerializer


class MeView(RetrieveUpdateAPIView):
    """
    Vista para obtener o actualizar el perfil del usuario autenticado.
    Endpoint: GET, PUT, PATCH /api/auth/me/
    Requiere token JWT en el header: Authorization: Bearer <token>
    """
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        # Siempre retorna el usuario que hace la petición
        return self.request.user

    def get_serializer_class(self):
        # Diferente serializer si es lectura o escritura
        if self.request.method in ['PUT', 'PATCH']:
            return UserUpdateSerializer
        return UserProfileSerializer


class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Vista para login JWT que devuelve token + info del usuario.
    Endpoint: POST /api/auth/login/
    """
    serializer_class = CustomTokenObtainPairSerializer

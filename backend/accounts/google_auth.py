from google.oauth2 import id_token
from google.auth.transport import requests
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User
from .serializers import UserSerializer
import os

@api_view(['POST'])
@permission_classes([AllowAny])
def google_login(request):
    try:
        token = request.data.get('token')
        if not token:
            return Response(
                {'error': 'Token is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        client_id = os.getenv('GOOGLE_CLIENT_ID')
        try:
            idinfo = id_token.verify_oauth2_token(
                token, 
                requests.Request(), 
                client_id
            )

            if idinfo['aud'] != client_id:
                raise ValueError('Wrong audience.')
            
            email = idinfo['email']
            email_verified = idinfo.get('email_verified', False)
            
            if not email_verified:
                return Response(
                    {'error': 'Email not verified by Google.'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Get or create user
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                user = User.objects.create(
                    email=email,
                    username=email.split('@')[0],
                    first_name=idinfo.get('given_name', ''),
                    last_name=idinfo.get('family_name', ''),
                    is_email_verified=True,
                    role='EMPLOYEE'
                )

            # Generate tokens
            refresh = RefreshToken.for_user(user)
            user_serializer = UserSerializer(user)

            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': user_serializer.data
            })

        except ValueError as e:
            print(f"Token verification error: {e}")  # For debugging
            return Response(
                {'error': f'Invalid token: {str(e)}'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

    except Exception as e:
        print(f"Google login error: {e}")  # For debugging
        return Response(
            {'error': f'Authentication failed: {str(e)}'}, 
            status=status.HTTP_400_BAD_REQUEST
        ) 
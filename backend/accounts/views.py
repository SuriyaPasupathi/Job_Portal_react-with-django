from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.core.mail import send_mail
from django.conf import settings
from .models import User, EmployeeProfile, CompanyProfile
from .serializers import UserSerializer, EmployeeProfileSerializer, CompanyProfileSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    @action(detail=False, methods=['post'])
    def register(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # Send verification email
            self.send_verification_email(user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def send_verification_email(self, user):
        # Implement email verification logic here
        subject = 'Verify your email'
        message = f'Click the link to verify your email: {settings.FRONTEND_URL}/verify/{user.id}'
        send_mail(subject, message, settings.EMAIL_HOST_USER, [user.email])

class EmployeeProfileViewSet(viewsets.ModelViewSet):
    queryset = EmployeeProfile.objects.all()
    serializer_class = EmployeeProfileSerializer
    permission_classes = [IsAuthenticated]

class CompanyProfileViewSet(viewsets.ModelViewSet):
    serializer_class = CompanyProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CompanyProfile.objects.filter(user=self.request.user)

    def retrieve(self, request, *args, **kwargs):
        try:
            instance = CompanyProfile.objects.get(user_id=kwargs.get('pk'))
            serializer = self.get_serializer(instance)
            return Response(serializer.data)
        except CompanyProfile.DoesNotExist:
            return Response(
                {'error': 'Company profile not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )

    def create(self, request, *args, **kwargs):
        # Check if profile already exists
        if CompanyProfile.objects.filter(user=request.user).exists():
            return Response(
                {'error': 'Company profile already exists'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            company_profile = CompanyProfile.objects.create(
                user=request.user,
                **serializer.validated_data
            )
            response_serializer = self.get_serializer(company_profile)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 
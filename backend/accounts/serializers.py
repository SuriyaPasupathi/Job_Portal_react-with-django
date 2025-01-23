from rest_framework import serializers
from .models import User, EmployeeProfile, CompanyProfile
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken

class UserSerializer(serializers.ModelSerializer):
    profile_image = serializers.SerializerMethodField()
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'password', 'role', 'is_email_verified', 'profile_image')
        read_only_fields = ('is_email_verified',)
        extra_kwargs = {'password': {'write_only': True}}

    def get_profile_image(self, obj):
        if obj.role == 'EMPLOYEE' and hasattr(obj, 'employeeprofile'):
            return obj.employeeprofile.profile_image.url if obj.employeeprofile.profile_image else None
        elif obj.role == 'EMPLOYER' and hasattr(obj, 'companyprofile'):
            return obj.companyprofile.company_logo.url if obj.companyprofile.company_logo else None
        return None

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password'],
            role=validated_data['role']
        )
        return user

class EmployeeProfileSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True)
    user_name = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = EmployeeProfile
        fields = [
            'id',
            'user',
            'user_email',
            'user_name',
            'profile_image',
            'resume',
            'degree',
            'skills',
            'experience',
            'phone'
        ]
        read_only_fields = ['user']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class CompanyProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyProfile
        fields = [
            'id',
            'company_name',
            'company_logo',
            'company_description',
            'industry',
            'company_size',
            'location'
        ]
        read_only_fields = ['id']

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['email'] = user.email
        token['username'] = user.username
        token['role'] = user.role
        token['is_email_verified'] = user.is_email_verified

        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        
        # Add extra responses here
        data['user'] = {
            'id': self.user.id,
            'email': self.user.email,
            'username': self.user.username,
            'role': self.user.role,
            'is_email_verified': self.user.is_email_verified
        }
        
        return data 
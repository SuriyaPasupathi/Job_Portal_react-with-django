from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    UserViewSet,
    EmployeeProfileViewSet,
    CompanyProfileViewSet
)
from .auth_views import (
    CustomTokenObtainPairView,
    register,
    get_user_profile,
    logout_view
)
from .google_auth import google_login

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'employee-profiles', EmployeeProfileViewSet)
router.register(r'company-profiles', CompanyProfileViewSet, basename='company-profile')

urlpatterns = [
    # Authentication endpoints
    path('register/', register, name='register'),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', logout_view, name='logout'),
    path('profile/', get_user_profile, name='user_profile'),
    path('google/login/', google_login, name='google_login'),
    
    # Include router URLs
    path('', include(router.urls)),
] 
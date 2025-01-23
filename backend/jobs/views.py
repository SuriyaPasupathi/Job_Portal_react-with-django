from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import Job, JobApplication
from .serializers import JobSerializer, JobApplicationSerializer
from accounts.models import User, CompanyProfile

class JobViewSet(viewsets.ModelViewSet):
    serializer_class = JobSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.AllowAny]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        queryset = Job.objects.all()
        
        # Apply filters
        job_type = self.request.query_params.get('job_type', None)
        location = self.request.query_params.get('location', None)
        
        if job_type:
            queryset = queryset.filter(job_type=job_type)
        if location:
            queryset = queryset.filter(location__icontains=location)
            
        # For update/delete operations, only show user's own jobs
        if self.action in ['update', 'partial_update', 'destroy']:
            return queryset.filter(employer=self.request.user)
            
        return queryset.order_by('-created_at')

    def create(self, request, *args, **kwargs):
        # Check if user is authenticated
        if not request.user.is_authenticated:
            return Response(
                {'error': 'Authentication required'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )

        # Check if user is an employer
        if request.user.role != 'EMPLOYER':
            return Response(
                {'error': 'Only employers can post jobs'}, 
                status=status.HTTP_403_FORBIDDEN
            )

        # Check if employer has a company profile
        try:
            company_profile = CompanyProfile.objects.get(user=request.user)
        except CompanyProfile.DoesNotExist:
            return Response(
                {'error': 'Please create a company profile before posting jobs'}, 
                status=status.HTTP_403_FORBIDDEN
            )

        # Add the employer to the job data
        job_data = request.data.copy()
        job_data['employer'] = request.user.id

        serializer = self.get_serializer(data=job_data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def perform_create(self, serializer):
        serializer.save(employer=self.request.user)

    @action(detail=False, methods=['get'])
    def my_jobs(self, request):
        jobs = self.get_queryset().filter(employer=request.user)
        serializer = self.get_serializer(jobs, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def apply(self, request, pk=None):
        job = self.get_object()
        
        # Check if user is an employee
        if request.user.role != 'EMPLOYEE':
            return Response(
                {'error': 'Only employees can apply for jobs'}, 
                status=status.HTTP_403_FORBIDDEN
            )
            
        # Check if already applied
        if JobApplication.objects.filter(job=job, applicant=request.user).exists():
            return Response(
                {'error': 'You have already applied for this job'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        # Create application
        JobApplication.objects.create(
            job=job,
            applicant=request.user,
            cover_letter=request.data.get('cover_letter', '')
        )
        
        return Response({'message': 'Application submitted successfully'})

class JobApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = JobApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'EMPLOYER':
            # Employers see applications for their jobs
            return JobApplication.objects.filter(job__employer=user)
        else:
            # Employees see their own applications
            return JobApplication.objects.filter(applicant=user).select_related('job', 'job__employer')

    def perform_create(self, serializer):
        serializer.save(applicant=self.request.user)

    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        application = self.get_object()
        new_status = request.data.get('status')
        
        if not new_status:
            return Response(
                {'error': 'Status is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        if application.job.employer != request.user:
            return Response(
                {'error': 'Not authorized to update this application'}, 
                status=status.HTTP_403_FORBIDDEN
            )

        application.status = new_status
        application.save()
        serializer = self.get_serializer(application)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def withdraw(self, request, pk=None):
        application = self.get_object()
        
        if application.applicant != request.user:
            return Response(
                {'error': 'Not authorized to withdraw this application'}, 
                status=status.HTTP_403_FORBIDDEN
            )
            
        if application.status in ['ACCEPTED', 'REJECTED']:
            return Response(
                {'error': 'Cannot withdraw a processed application'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        application.delete()
        return Response(status=status.HTTP_204_NO_CONTENT) 
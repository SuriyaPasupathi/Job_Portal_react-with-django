from rest_framework import serializers
from .models import Job, JobApplication

class JobSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='employer.companyprofile.company_name', read_only=True)
    
    class Meta:
        model = Job
        fields = [
            'id', 
            'title', 
            'description', 
            'requirements',
            'salary_range', 
            'location', 
            'job_type',
            'deadline',
            'created_at',
            'employer',
            'company_name'
        ]
        read_only_fields = ['employer', 'created_at']

class JobApplicationSerializer(serializers.ModelSerializer):
    job = JobSerializer(read_only=True)
    
    class Meta:
        model = JobApplication
        fields = [
            'id',
            'job',
            'applicant',
            'applied_date',
            'status',
            'cover_letter'
        ]
        read_only_fields = ['applicant', 'applied_date']

    def create(self, validated_data):
        validated_data['applicant'] = self.context['request'].user
        return super().create(validated_data) 
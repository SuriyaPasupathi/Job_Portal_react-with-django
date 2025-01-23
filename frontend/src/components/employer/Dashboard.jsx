import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Card, CardContent, Button, Grid, Chip, Alert } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/api';

const EmployerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [postedJobs, setPostedJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasCompanyProfile, setHasCompanyProfile] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsResponse, applicationsResponse] = await Promise.all([
          api.get('/jobs/my_jobs/'),
          api.get('/applications/')
        ]);
        setPostedJobs(jobsResponse.data);
        setApplications(applicationsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    const checkCompanyProfile = async () => {
      try {
        const response = await api.get('/accounts/company-profiles/');
        if (response.data && response.data.length > 0) {
          setHasCompanyProfile(true);
        }
      } catch (error) {
        if (error.response?.status === 404) {
          setHasCompanyProfile(false);
        }
      }
    };

    if (user) {
      fetchData();
      checkCompanyProfile();
    }
  }, [user]);

  const handleUpdateStatus = async (applicationId, newStatus) => {
    try {
      await api.post(`/jobs/applications/${applicationId}/update-status/`, {
        status: newStatus
      });
      // Refresh applications
      const response = await api.get('/jobs/applications/');
      setApplications(response.data);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4">Employer Dashboard</Typography>
        {!hasCompanyProfile && (
          <Alert 
            severity="warning" 
            action={
              <Button 
                color="inherit" 
                size="small" 
                onClick={() => navigate('/employer/company-profile')}
              >
                Create Now
              </Button>
            }
            sx={{ mb: 2 }}
          >
            Please create your company profile to start posting jobs
          </Alert>
        )}
      </Box>

      <Box sx={{ mt: 2 }}>
        <Button
          variant="contained"
          onClick={() => navigate('/employer/post-job')}
          disabled={!hasCompanyProfile}
          sx={{ mr: 2 }}
        >
          Post New Job
        </Button>
        {!hasCompanyProfile && (
          <Button
            variant="outlined"
            onClick={() => navigate('/employer/company-profile')}
          >
            Create Company Profile
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" sx={{ mb: 2 }}>Posted Jobs</Typography>
          {postedJobs.map((job) => (
            <Card key={job.id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">{job.title}</Typography>
                <Typography color="textSecondary">{job.location}</Typography>
                <Typography>Applications: {job.applications_count}</Typography>
                <Box sx={{ mt: 1 }}>
                  <Chip 
                    label={job.is_active ? 'Active' : 'Closed'} 
                    color={job.is_active ? 'success' : 'default'}
                  />
                </Box>
              </CardContent>
            </Card>
          ))}
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h6" sx={{ mb: 2 }}>Recent Applications</Typography>
          {applications.map((application) => (
            <Card key={application.id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">{application.job.title}</Typography>
                <Typography>Applicant: {application.applicant.email}</Typography>
                <Typography color="textSecondary">
                  Applied: {new Date(application.applied_date).toLocaleDateString()}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Button
                    size="small"
                    variant={application.status === 'ACCEPTED' ? 'contained' : 'outlined'}
                    color="success"
                    onClick={() => handleUpdateStatus(application.id, 'ACCEPTED')}
                    sx={{ mr: 1 }}
                  >
                    Accept
                  </Button>
                  <Button
                    size="small"
                    variant={application.status === 'REJECTED' ? 'contained' : 'outlined'}
                    color="error"
                    onClick={() => handleUpdateStatus(application.id, 'REJECTED')}
                  >
                    Reject
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Grid>
    </Container>
  );
};

export default EmployerDashboard; 
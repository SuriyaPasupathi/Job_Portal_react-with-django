import { useState, useEffect } from 'react';
import { 
  Container, Typography, Box, Card, CardContent, 
  Grid, Chip, Divider, Button 
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/api';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await api.get('/applications/');
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACCEPTED':
        return 'success';
      case 'REJECTED':
        return 'error';
      case 'REVIEWING':
        return 'warning';
      default:
        return 'default';
    }
  };

  const handleWithdraw = async (applicationId) => {
    if (window.confirm('Are you sure you want to withdraw this application?')) {
      try {
        await api.post(`/applications/${applicationId}/withdraw/`);
        fetchApplications(); // Refresh the list
      } catch (error) {
        alert(error.response?.data?.error || 'Failed to withdraw application');
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Applications
      </Typography>

      <Grid container spacing={3}>
        {applications.map((application) => (
          <Grid item xs={12} key={application.id}>
            <Card>
              <CardContent>
                <Box>
                  <Typography variant="h6">
                    {application.job.title}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    {application.job.company_name}
                  </Typography>
                  
                  <Box sx={{ my: 2 }}>
                    <Chip 
                      label={application.status} 
                      color={getStatusColor(application.status)}
                      sx={{ mr: 1 }} 
                    />
                    <Chip 
                      label={application.job.job_type} 
                      sx={{ mr: 1 }} 
                    />
                    <Chip 
                      label={application.job.location} 
                    />
                  </Box>

                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Applied on: {new Date(application.applied_date).toLocaleDateString()}
                  </Typography>
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Application deadline: {new Date(application.job.deadline).toLocaleDateString()}
                  </Typography>

                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Cover Letter:
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {application.cover_letter}
                    </Typography>
                  </Box>

                  {application.status === 'PENDING' && (
                    <Button 
                      variant="outlined" 
                      color="error"
                      size="small"
                      onClick={() => handleWithdraw(application.id)}
                      sx={{ mt: 2 }}
                    >
                      Withdraw Application
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {applications.length === 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography align="center" color="textSecondary">
                  You haven't applied to any jobs yet.
                </Typography>
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    href="/jobs"
                  >
                    Browse Jobs
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default EmployeeDashboard; 
import { useState, useEffect } from 'react';
import { 
  Container, Typography, Box, Card, CardContent, 
  Button, Grid, Chip, TextField, MenuItem 
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/api';

const JobList = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    job_type: '',
    location: ''
  });

  const jobTypes = [
    { value: 'FULL_TIME', label: 'Full Time' },
    { value: 'PART_TIME', label: 'Part Time' },
    { value: 'CONTRACT', label: 'Contract' },
    { value: 'INTERNSHIP', label: 'Internship' }
  ];

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const fetchJobs = async () => {
    try {
      let url = '/jobs/';
      const params = new URLSearchParams();
      if (filters.job_type) params.append('job_type', filters.job_type);
      if (filters.location) params.append('location', filters.location);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await api.get(url);
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId) => {
    try {
      await api.post(`/jobs/${jobId}/apply/`, {
        cover_letter: 'Interested in this position' // You might want to add a form for this
      });
      alert('Application submitted successfully!');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to apply for job');
    }
  };

  const handleFilterChange = (event) => {
    setFilters({
      ...filters,
      [event.target.name]: event.target.value
    });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Available Jobs
      </Typography>

      {/* Filters */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              name="job_type"
              label="Job Type"
              value={filters.job_type}
              onChange={handleFilterChange}
            >
              <MenuItem value="">All Types</MenuItem>
              {jobTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="location"
              label="Location"
              value={filters.location}
              onChange={handleFilterChange}
              placeholder="Enter location"
            />
          </Grid>
        </Grid>
      </Box>

      {/* Job Listings */}
      <Grid container spacing={3}>
        {jobs.map((job) => (
          <Grid item xs={12} key={job.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <Box>
                    <Typography variant="h6">{job.title}</Typography>
                    <Typography color="textSecondary" gutterBottom>
                      {job.company_name}
                    </Typography>
                    <Typography variant="body2" paragraph>
                      {job.description}
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Chip 
                        label={job.job_type} 
                        sx={{ mr: 1 }} 
                      />
                      <Chip 
                        label={job.location} 
                        sx={{ mr: 1 }} 
                      />
                      <Chip 
                        label={job.salary_range} 
                      />
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                      Deadline: {new Date(job.deadline).toLocaleDateString()}
                    </Typography>
                  </Box>
                  {user?.role === 'EMPLOYEE' && (
                    <Button 
                      variant="contained" 
                      color="primary"
                      onClick={() => handleApply(job.id)}
                    >
                      Apply Now
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default JobList; 
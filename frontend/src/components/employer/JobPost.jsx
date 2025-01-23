import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Container, Box, Alert, MenuItem } from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { jobApi } from '../../utils/jobApi';
import { useAuth } from '../../contexts/AuthContext';

const JobPost = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    salary_range: '',
    location: '',
    job_type: 'FULL_TIME',
    deadline: null
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Redirect if not an employer
  useEffect(() => {
    if (user && user.role !== 'EMPLOYER') {
      navigate('/');
    }
  }, [user, navigate]);

  const jobTypes = [
    { value: 'FULL_TIME', label: 'Full Time' },
    { value: 'PART_TIME', label: 'Part Time' },
    { value: 'CONTRACT', label: 'Contract' },
    { value: 'INTERNSHIP', label: 'Internship' }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedData = {
        ...formData,
        deadline: formData.deadline ? dayjs(formData.deadline).toISOString() : null
      };

      const response = await jobApi.createJob(formattedData);
      if (response.status === 201) {
        navigate('/employer/dashboard');
      }
    } catch (error) {
      setError(
        error.response?.data?.error || 
        error.response?.data?.detail || 
        'Failed to post job. Please make sure you have created a company profile.'
      );
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Post a New Job
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Job Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            multiline
            rows={4}
            label="Job Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            multiline
            rows={4}
            label="Requirements"
            name="requirements"
            value={formData.requirements}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Salary Range"
            name="salary_range"
            value={formData.salary_range}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            select
            label="Job Type"
            name="job_type"
            value={formData.job_type}
            onChange={handleChange}
          >
            {jobTypes.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker']}>
              <DatePicker
                label="Application Deadline"
                value={formData.deadline ? dayjs(formData.deadline) : null}
                onChange={(newValue) => {
                  setFormData({
                    ...formData,
                    deadline: newValue ? newValue.toISOString() : null
                  });
                }}
                sx={{ width: '100%', mt: 2 }}
              />
            </DemoContainer>
          </LocalizationProvider>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Post Job
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default JobPost; 
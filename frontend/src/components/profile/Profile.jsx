import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { TextField, Button, Typography, Container, Box, Alert, Grid } from '@mui/material';
import api from '../../utils/api';

const Profile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    resume: null,
    degree: null,
    skills: '',
    experience: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/accounts/profile/');
      setFormData({
        ...response.data,
        email: user.email,
        username: user.username
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    if (e.target.type === 'file') {
      setFormData({
        ...formData,
        [e.target.name]: e.target.files[0]
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null) {
          formDataToSend.append(key, formData[key]);
        }
      });

      await api.put('/accounts/profile/', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setSuccess('Profile updated successfully');
      setError('');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update profile');
      setSuccess('');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Profile
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="normal"
                fullWidth
                label="Email"
                value={formData.email}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="normal"
                fullWidth
                label="Username"
                value={formData.username}
                disabled
              />
            </Grid>
            {user.role === 'EMPLOYEE' && (
              <>
                <Grid item xs={12}>
                  <TextField
                    margin="normal"
                    fullWidth
                    label="Skills"
                    name="skills"
                    multiline
                    rows={3}
                    value={formData.skills}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    margin="normal"
                    fullWidth
                    label="Experience"
                    name="experience"
                    multiline
                    rows={3}
                    value={formData.experience}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    margin="normal"
                    fullWidth
                    label="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ mt: 2 }}>
                    <input
                      accept=".pdf,.doc,.docx"
                      style={{ display: 'none' }}
                      id="resume-file"
                      type="file"
                      name="resume"
                      onChange={handleChange}
                    />
                    <label htmlFor="resume-file">
                      <Button variant="contained" component="span">
                        Upload Resume
                      </Button>
                    </label>
                    {formData.resume && (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Selected resume: {typeof formData.resume === 'string' 
                          ? formData.resume.split('/').pop() 
                          : formData.resume.name}
                      </Typography>
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ mt: 2 }}>
                    <input
                      accept=".pdf,.doc,.docx"
                      style={{ display: 'none' }}
                      id="degree-file"
                      type="file"
                      name="degree"
                      onChange={handleChange}
                    />
                    <label htmlFor="degree-file">
                      <Button variant="contained" component="span">
                        Upload Degree
                      </Button>
                    </label>
                    {formData.degree && (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Selected degree: {typeof formData.degree === 'string' 
                          ? formData.degree.split('/').pop() 
                          : formData.degree.name}
                      </Typography>
                    )}
                  </Box>
                </Grid>
              </>
            )}
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Update Profile
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Profile; 
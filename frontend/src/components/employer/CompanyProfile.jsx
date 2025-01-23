import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Container, Alert, Avatar, IconButton, Grid } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/api';
import EditIcon from '@mui/icons-material/Edit';

const CompanyProfile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    company_name: '',
    company_description: '',
    industry: '',
    company_size: '',
    location: '',
  });
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/accounts/company-profiles/');
        if (response.data && response.data.length > 0) {
          setFormData(response.data[0]);
          if (response.data[0].company_logo) {
            setLogoPreview(`/media/${response.data[0].company_logo}`);
          }
        }
      } catch (error) {
        if (error.response?.status !== 404) {
          setError('Error fetching company profile');
        }
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogoClick = () => {
    fileInputRef.current.click();
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const formDataToSend = new FormData();
      
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });

      if (logo) {
        formDataToSend.append('company_logo', logo);
      }

      let response;
      if (formData.id) {
        response = await api.patch(`/accounts/company-profiles/${formData.id}/`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        response = await api.post('/accounts/company-profiles/', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      setSuccess('Company profile updated successfully!');
      setFormData(response.data);

      // Update user context with new logo
      if (updateUser) {
        updateUser({
          profile_image: response.data.company_logo
        });
      }

      setTimeout(() => {
        navigate('/employer/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error updating profile:', error.response?.data);
      const errorMessage = 
        error.response?.data?.error || 
        (typeof error.response?.data === 'object' 
          ? Object.values(error.response.data)[0]
          : 'Failed to update company profile');
      setError(errorMessage);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create Company Profile
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sx={{ textAlign: 'center' }}>
              <Box sx={{ position: 'relative', display: 'inline-block' }}>
                <Avatar
                  src={logoPreview}
                  sx={{ 
                    width: 150, 
                    height: 150, 
                    cursor: 'pointer',
                    '& img': { objectFit: 'contain' }
                  }}
                  onClick={handleLogoClick}
                />
                <IconButton
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    backgroundColor: 'white'
                  }}
                  onClick={handleLogoClick}
                >
                  <EditIcon />
                </IconButton>
              </Box>
              <input
                type="file"
                hidden
                ref={fileInputRef}
                accept="image/*"
                onChange={handleLogoChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Company Name"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="normal"
                required
                fullWidth
                multiline
                rows={4}
                label="Company Description"
                name="company_description"
                value={formData.company_description}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Industry"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Company Size"
                name="company_size"
                value={formData.company_size}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Save Company Profile
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default CompanyProfile; 
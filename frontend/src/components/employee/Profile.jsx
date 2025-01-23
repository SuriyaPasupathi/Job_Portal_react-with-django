import { useState, useEffect, useRef } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Grid,
  Card,
  CardContent,
  Alert,
  IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/api';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState({
    skills: '',
    experience: '',
    phone: '',
  });
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/accounts/employee-profiles/');
      if (response.data && response.data.length > 0) {
        setProfile(response.data[0]);
        if (response.data[0].profile_image) {
          setPreviewImage(`/media/${response.data[0].profile_image}`);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      Object.keys(profile).forEach(key => {
        if (profile[key]) {
          formData.append(key, profile[key]);
        }
      });

      if (profileImage) {
        formData.append('profile_image', profileImage);
      }

      let response;
      if (profile.id) {
        response = await api.patch(`/accounts/employee-profiles/${profile.id}/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        response = await api.post('/accounts/employee-profiles/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      setSuccess('Profile updated successfully!');
      setProfile(response.data);

      // Update user context with new profile image
      if (updateUser) {
        updateUser({
          profile_image: response.data.profile_image
        });
      }
    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to update profile');
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Employee Profile
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <Card>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} sx={{ textAlign: 'center' }}>
                <Box sx={{ position: 'relative', display: 'inline-block' }}>
                  <Avatar
                    src={previewImage}
                    sx={{ width: 150, height: 150, cursor: 'pointer' }}
                    onClick={handleImageClick}
                  />
                  <IconButton
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      backgroundColor: 'white'
                    }}
                    onClick={handleImageClick}
                  >
                    <EditIcon />
                  </IconButton>
                </Box>
                <input
                  type="file"
                  hidden
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Grid>

              <Grid item xs={12}>
                <Box component="form" onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    label="Phone"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Skills"
                    name="skills"
                    value={profile.skills}
                    onChange={handleChange}
                    margin="normal"
                    multiline
                    rows={3}
                  />
                  <TextField
                    fullWidth
                    label="Experience"
                    name="experience"
                    value={profile.experience}
                    onChange={handleChange}
                    margin="normal"
                    multiline
                    rows={4}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ mt: 3 }}
                    fullWidth
                  >
                    Save Profile
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Profile; 
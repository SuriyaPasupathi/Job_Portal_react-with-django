import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Container, Alert, Divider } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleGoogleCallback = async (response) => {
    try {
      const result = await googleLogin(response.credential);
      navigate(result.user.role === 'EMPLOYER' ? '/employer/dashboard' : '/employee/dashboard');
    } catch (error) {
      setError(error.message || 'Google login failed');
    }
  };

  useEffect(() => {
    const loadGoogleScript = () => {
      const initializeGoogleSignIn = () => {
        if (window.google) {
          try {
            window.google.accounts.id.initialize({
              client_id: '935943993509-l0t3o7ql0b4hvhgrl1rq2o5u28nn72jb.apps.googleusercontent.com',
              callback: handleGoogleCallback,
              ux_mode: 'popup',
              auto_select: false,
              context: 'signin'
            });

            window.google.accounts.id.renderButton(
              document.getElementById('googleSignInButton'),
              { 
                type: 'standard',
                theme: 'outline', 
                size: 'large',
                text: 'signin_with',
                shape: 'rectangular',
                width: '400'
              }
            );
          } catch (error) {
            console.error('Google Sign-In initialization error:', error);
            setError('Failed to initialize Google Sign-In');
          }
        }
      };

      // Load the Google script if it hasn't been loaded yet
      if (!window.google) {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = initializeGoogleSignIn;
        document.head.appendChild(script);
      } else {
        initializeGoogleSignIn();
      }
    };

    loadGoogleScript();
  }, []); // Remove handleGoogleCallback from dependencies

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = await login(email, password);
      navigate(user.role === 'EMPLOYER' ? '/employer/dashboard' : '/employee/dashboard');
    } catch (error) {
      setError(error.message || 'Invalid email or password');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
            {error}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email Address"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>

          <Divider sx={{ my: 2 }}>OR</Divider>

          {/* Google Sign-In Button Container */}
          <Box 
            id="googleSignInButton"
            sx={{ 
              width: '100%', 
              display: 'flex', 
              justifyContent: 'center',
              mb: 2 
            }}
          />
        </Box>
      </Box>
    </Container>
  );
};

export default Login; 
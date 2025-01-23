import { Box, Container, Typography, Button, Grid, Paper } from '@mui/material';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Box sx={{ 
        textAlign: 'center', 
        py: 8,
        backgroundColor: 'primary.main',
        color: 'white',
        borderRadius: 2,
        mb: 6,
        mt: 4
      }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Find Your Dream Job
        </Typography>
        <Typography variant="h6" sx={{ mb: 4 }}>
          Connect with the best companies and opportunities
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          component={Link}
          to="/register"
          sx={{ mr: 2 }}
        >
          Get Started
        </Button>
        <Button
          variant="outlined"
          color="inherit"
          size="large"
          component={Link}
          to="/jobs"
        >
          Browse Jobs
        </Button>
      </Box>

      {/* Features Section */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%', textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              For Job Seekers
            </Typography>
            <Typography>
              Create your profile, upload your resume, and apply to jobs with a single click
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%', textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              For Employers
            </Typography>
            <Typography>
              Post jobs, manage applications, and find the perfect candidates for your company
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%', textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Easy to Use
            </Typography>
            <Typography>
              Simple and intuitive interface to help you find or post jobs quickly
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Stats Section */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h4" color="primary" gutterBottom>
              1000+
            </Typography>
            <Typography variant="body1">Active Jobs</Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h4" color="primary" gutterBottom>
              500+
            </Typography>
            <Typography variant="body1">Companies</Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h4" color="primary" gutterBottom>
              10000+
            </Typography>
            <Typography variant="body1">Job Seekers</Typography>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Home; 
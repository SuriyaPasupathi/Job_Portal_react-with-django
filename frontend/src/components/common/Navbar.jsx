import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Button, Typography, Box, Menu, MenuItem, IconButton, Avatar } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      handleClose();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AppBar 
      position="static" 
      elevation={2}
      sx={{ 
        backgroundColor: 'primary.main',
        mb: 2
      }}
    >
      <Toolbar>
        <Typography 
          variant="h6" 
          component={Link} 
          to="/" 
          sx={{ 
            flexGrow: 1, 
            textDecoration: 'none', 
            color: 'white',
            fontWeight: 'bold',
            '&:hover': {
              color: 'rgba(255, 255, 255, 0.9)'
            }
          }}
        >
          Job Portal
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {!user ? (
            <>
              <Button 
                color="inherit" 
                component={Link} 
                to="/login"
                sx={{
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                Login
              </Button>
              <Button 
                variant="contained"
                color="secondary"
                component={Link} 
                to="/register"
                sx={{
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: 'secondary.dark'
                  }
                }}
              >
                Register
              </Button>
            </>
          ) : (
            <>
              <Button 
                color="inherit" 
                component={Link} 
                to="/jobs"
              >
                Jobs
              </Button>
              {user.role === 'EMPLOYER' && (
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/employer/post-job"
                >
                  Post Job
                </Button>
              )}
              <Button
                color="inherit"
                component={Link}
                to="/employee/profile"
              >
                Profile
              </Button>
              <IconButton
                size="large"
                onClick={handleMenu}
                color="inherit"
              >
                <Avatar 
                  src={user.profile_image ? `/media/${user.profile_image}` : undefined}
                  sx={{ 
                    width: 32, 
                    height: 32,
                    bgcolor: 'primary.main'
                  }}
                >
                  {!user.profile_image && <AccountCircle />}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem 
                  component={Link} 
                  to={user.role === 'EMPLOYER' ? '/employer/dashboard' : '/employee/dashboard'}
                  onClick={handleClose}
                >
                  Dashboard
                </MenuItem>
                <MenuItem 
                  component={Link} 
                  to="/profile"
                  onClick={handleClose}
                >
                  Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import AppRoutes from './routes.jsx';
import Navbar from './components/common/Navbar.jsx';
import { Container, Box } from '@mui/material';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Box sx={{ 
          minHeight: '100vh',
          backgroundColor: 'background.default'
        }}>
          <Navbar />
          <Container>
            <AppRoutes />
          </Container>
        </Box>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App; 




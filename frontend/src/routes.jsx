import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/common/PrivateRoute';
import Home from './components/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import EmployerDashboard from './components/employer/Dashboard';
import EmployeeDashboard from './components/employee/Dashboard';
import JobList from './components/jobs/JobList';
import JobPost from './components/employer/JobPost';
import Profile from './components/employee/Profile';
import CompanyProfile from './components/employer/CompanyProfile';
import { Box } from '@mui/material';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/jobs" element={<JobList />} />
      
      {/* Protected Employer Routes */}
      <Route path="/employer/*" element={
        <PrivateRoute role="EMPLOYER">
          <Routes>
            <Route path="dashboard" element={<EmployerDashboard />} />
            <Route path="post-job" element={<JobPost />} />
            <Route path="company-profile" element={<CompanyProfile />} />
          </Routes>
        </PrivateRoute>
      } />

      {/* Protected Employee Routes */}
      <Route path="/employee/*" element={
        <PrivateRoute role="EMPLOYEE">
          <Routes>
            <Route path="dashboard" element={<EmployeeDashboard />} />
            <Route path="profile" element={<Profile />} />
          </Routes>
        </PrivateRoute>
      } />

      {/* 404 Route */}
      <Route path="*" element={
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <h1>404: Page Not Found</h1>
        </Box>
      } />
    </Routes>
  );
};

export default AppRoutes; 
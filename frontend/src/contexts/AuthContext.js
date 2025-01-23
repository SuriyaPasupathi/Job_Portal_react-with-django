import { createContext, useContext, useState } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const updateUser = (updates) => {
    setUser(prev => ({
      ...prev,
      ...updates
    }));
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/accounts/token/', {
        email,
        password
      });
      
      const { access, refresh, user } = response.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      
      // Get profile image based on role
      let profileImage = null;
      if (user.role === 'EMPLOYEE') {
        const profileResponse = await api.get('/accounts/employee-profiles/');
        if (profileResponse.data.length > 0) {
          profileImage = profileResponse.data[0].profile_image;
        }
      } else if (user.role === 'EMPLOYER') {
        const profileResponse = await api.get('/accounts/company-profiles/');
        if (profileResponse.data.length > 0) {
          profileImage = profileResponse.data[0].company_logo;
        }
      }

      setUser({
        ...user,
        profile_image: profileImage
      });
      
    } catch (error) {
      throw error.response?.data?.detail || 'Login failed';
    }
  };

  // ... other functions

  const value = {
    user,
    loading,
    login,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
}; 
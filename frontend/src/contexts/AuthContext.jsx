import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api.jsx';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const response = await api.get('/accounts/profile/');
          setUser(response.data);
        } catch (error) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const register = async (userData) => {
    try {
      const response = await api.post('/accounts/register/', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/accounts/token/', {
        email,
        password
      });
      
      const { access, refresh } = response.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);

      // Get user profile
      const userResponse = await api.get('/accounts/profile/');
      setUser(userResponse.data);
      return userResponse.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  };

  const logout = async () => {
    try {
      // Call backend logout endpoint if you have one
      await api.post('/accounts/logout/');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage and state regardless of backend response
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
    }
  };

  const googleLogin = async (credential) => {
    try {
      const response = await api.post('/accounts/google/login/', {
        token: credential
      });
      
      const { access, refresh, user } = response.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      setUser(user);
      return { user };
    } catch (error) {
      throw error.response?.data || error.message;
    }
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    googleLogin
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 
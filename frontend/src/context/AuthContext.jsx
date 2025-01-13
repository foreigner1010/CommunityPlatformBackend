import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isNewRegistration, setIsNewRegistration] = useState(false);
  const [recentJoins, setRecentJoins] = useState([]);
  const [viewedJoins, setViewedJoins] = useState(() => {
    const saved = localStorage.getItem('viewedJoins');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      checkAuthStatus();
    } else {
      setLoading(false);
    }
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/auth/me`);
      setUser(response.data);
      setRecentJoins(response.data.recentJoins || []);
      setIsNewRegistration(false);
    } catch (error) {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password, city) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/register`, {
        username,
        email,
        password,
        city
      });
      
      const { token, user: userData } = response.data;
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
      setUser(userData);
      setIsNewRegistration(true);
      setRecentJoins([]);
      setViewedJoins([]);
      
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed'
      };
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password
      });

      const { token, user: userData, recentJoins: newJoins } = response.data;
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
      setUser(userData);
      setIsNewRegistration(false);
      
      // Get recent joins excluding already viewed ones
      if (newJoins) {
        const filteredJoins = newJoins.filter(
          join => !viewedJoins.includes(join._id)
        );
        setRecentJoins(filteredJoins);
        
        // Add these joins to viewed list
        const updatedViewedJoins = [...viewedJoins, ...filteredJoins.map(join => join._id)];
        setViewedJoins(updatedViewedJoins);
        localStorage.setItem('viewedJoins', JSON.stringify(updatedViewedJoins));
      }
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setIsNewRegistration(false);
    setRecentJoins([]);
    setViewedJoins([]);
    localStorage.removeItem('viewedJoins');
  };

  const value = {
    user,
    loading,
    isNewRegistration,
    recentJoins,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

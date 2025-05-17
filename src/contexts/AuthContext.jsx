import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('access_token') || '');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const register = async (email, password) => {
    setLoading(true);
    await api.post('/auth/register', { email, password });
    setLoading(false);
    return login(email, password);
  };

  const login = async (email, password) => {
    setLoading(true);
    const response = await api.post('/auth/login', { email, password });
    const accessToken = response.data.access_token;
    localStorage.setItem('access_token', accessToken);
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    setToken(accessToken);
    setLoading(false);
    navigate('/generate');
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setToken('');
    delete api.defaults.headers.common['Authorization'];
    navigate('/auth');
  };

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, loading, register, login, logout, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
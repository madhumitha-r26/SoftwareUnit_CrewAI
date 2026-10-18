import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/auth';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Request Interceptor to attach Access Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken'); // In real scenario, store in memory variable
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    const { data } = await api.post('/login', { email, password });
    localStorage.setItem('accessToken', data.accessToken);
    setUser(data.user);
  };

  const register = async (email, password, confirmPassword) => {
    await api.post('/register', { email, password, confirmPassword });
  };

  const logout = async () => {
    await api.post('/logout');
    localStorage.removeItem('accessToken');
    setUser(null);
  };

  const refresh = async () => {
    try {
      const { data } = await api.post('/refresh');
      localStorage.setItem('accessToken', data.accessToken);
      // Normally would fetch user profile here
      setUser({ email: 'Authenticated User' });
    } catch (err) {
      localStorage.removeItem('accessToken');
      setUser(null);
    }
  };

  useEffect(() => {
    refresh();
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, refresh }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default api;

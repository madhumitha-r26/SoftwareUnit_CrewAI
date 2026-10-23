import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { KanbanBoard } from './pages/KanbanBoard';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import axios from 'axios';

export const AuthContext = createContext(null);

const API_BASE = 'http://localhost:5000/api';

export default function App() {
  const [auth, setAuth] = useState(() => {
    const user = localStorage.getItem('tms_user');
    const token = localStorage.getItem('tms_token');
    return user && token ? { user: JSON.parse(user), token } : null;
  });

  const login = (userData, token) => {
    localStorage.setItem('tms_user', JSON.stringify(userData));
    localStorage.setItem('tms_token', token);
    setAuth({ user: userData, token });
  };

  const logout = () => {
    localStorage.clear();
    setAuth(null);
  };

  // Setup axios interceptor for JWT
  axios.interceptors.request.use((config) => {
    if (auth?.token) {
      config.headers.Authorization = `Bearer ${auth.token}`;
    }
    return config;
  });

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      <Router>
        <Routes>
          <Route path="/login" element={!auth ? <Login /> : <Navigate to="/" />} />
          <Route 
            path="/" 
            element={auth ? <Layout><KanbanBoard /></Layout> : <Navigate to="/login" />} 
          />
          <Route 
            path="/dashboard" 
            element={auth ? <Layout><Dashboard /></Layout> : <Navigate to="/login" />} 
          />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

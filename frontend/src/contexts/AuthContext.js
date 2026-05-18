// import React, { createContext, useState, useEffect } from 'react';
// import jwtDecode from 'jwt-decode';
// import axios from 'axios';

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       const decoded = jwtDecode(token);
//       setUser(decoded);
//       axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//     }
//     setLoading(false);
//   }, []);

//   const login = async (email, password) => {
//     const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/login`, { email, password });
//     localStorage.setItem('token', res.data);
//     const decoded = jwtDecode(res.data);
//     setUser(decoded);
//     axios.defaults.headers.common['Authorization'] = `Bearer ${res.data}`;
//   };

//   const register = async (username, email, password) => {
//     const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/register`, { username, email, password });
//     localStorage.setItem('token', res.data);
//     const decoded = jwtDecode(res.data);
//     setUser(decoded);
//     axios.defaults.headers.common['Authorization'] = `Bearer ${res.data}`;
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     setUser(null);
//     delete axios.defaults.headers.common['Authorization'];
//   };

//   return (
//     <AuthContext.Provider value={{ user, loading, login, register, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };


import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import { requestFCMToken } from '../firebase';

const normalizeApiBaseUrl = (url) => {
  const fallback = 'http://localhost:8080/api';
  if (!url || !url.trim()) {
    return fallback;
  }

  const trimmed = url.trim().replace(/\/+$/, '');
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
};

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const api = useMemo(
    () =>
      axios.create({
        baseURL: normalizeApiBaseUrl(process.env.REACT_APP_API_BASE_URL),
      }),
    []
  );

  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
    };
  }, [api]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem('token');
          setLoading(false);
          return;
        }
        setUser(decoded);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        console.log('Restored session with token:', token.substring(0, 20) + '...');
      } catch (err) {
        console.warn('Invalid JWT in localStorage:', err);
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, [api]);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const token = res.data;
      localStorage.setItem('token', token);
      const decoded = jwtDecode(token);
      setUser(decoded);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log('Login successful, token set:', token.substring(0, 20) + '...');

      await requestFCMToken(api);
      toast.success('Welcome back! 🏃‍♂️');
    } catch (err) {
      console.error('Login failed:', err.response?.data || err.message);
      toast.error('Login failed: ' + (err.response?.data || 'Check credentials'));
      throw err;
    }
  };

  const signup = async (username, email, password) => {
    try {
      const res = await api.post('/auth/register', { username, email, password });
      const token = res.data;
      localStorage.setItem('token', token);
      const decoded = jwtDecode(token);
      setUser(decoded);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log('Signup successful, token set');

      await requestFCMToken(api);
      toast.success('Account created! Let’s run together! 🏃');
    } catch (err) {
      console.error('Signup failed:', err.response?.data || err.message);
      toast.error('Signup failed: ' + (err.response?.data || 'Try again'));
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
    toast.info('Logged out');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, api }}>
      {children}
    </AuthContext.Provider>
  );
};
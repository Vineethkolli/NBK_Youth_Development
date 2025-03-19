import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../utils/config';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/users/profile`);
      setUser(data);
      // Synchronize language in localStorage if available
      if (data.language) {
        localStorage.setItem('preferredLanguage', data.language);
      }
    } catch (error) {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const updateUserData = (newData) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...newData,
    }));
  };

  const signin = async (identifier, password) => {
    const { data } = await axios.post(`${API_URL}/api/auth/signin`, {
      identifier,
      password,
    });
    localStorage.setItem('token', data.token);
    // Update language in localStorage if returned from the server
    if (data.user.language) {
      localStorage.setItem('preferredLanguage', data.user.language);
    }
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    setUser(data.user);
  };

  const signup = async (userData) => {
    // Get the current language preference
    const language = localStorage.getItem('preferredLanguage') || 'en';

    const { data } = await axios.post(`${API_URL}/api/auth/signup`, {
      ...userData,
      language, // Include language preference in signup data
    });

    localStorage.setItem('token', data.token);
    if (data.user.language) {
      localStorage.setItem('preferredLanguage', data.user.language);
    }
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    setUser(data.user);
  };

  const signout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const value = {
    user,
    loading,
    signin,
    signup,
    signout,
    updateUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;

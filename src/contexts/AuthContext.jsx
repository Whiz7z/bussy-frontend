import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Check if we have a token in localStorage
    const token = localStorage.getItem('authToken');
    if (token) {
      fetchUserData(token);
    } else {
      setLoading(false);
    }
  }, []);
  
  // Parse token from URL if it exists (after OAuth redirect)
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const token = query.get('token');
    
    if (token) {
      localStorage.setItem('authToken', token);
      fetchUserData(token);
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);
  
  const fetchUserData = async (token) => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/user`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setError(null);
      } else {
        // Token is invalid, clear it
        localStorage.removeItem('authToken');
        setError('Authentication failed. Please log in again.');
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Error connecting to server. Please try again later.');
      localStorage.removeItem('authToken');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  
  const login = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`;
  };
  
  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    // Optionally notify the server about logout
    fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {
      credentials: 'include'
    }).catch(error => {
      console.error('Error during logout:', error);
    });
  };
  
  const getAuthToken = () => {
    return localStorage.getItem('authToken');
  };
  
  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout, getAuthToken }}>
      {children}
    </AuthContext.Provider>
  );
}; 
import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Check authentication status on load
  useEffect(() => {
    checkAuthStatus();
  }, []);
  
  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      console.log('Checking auth status...');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/user`, {
        method: 'GET',
        credentials: 'include', // Include cookies in the request
        headers: {
          'Accept': 'application/json'
        }
      });
      
      console.log('Auth response status:', response.status);
      
      if (response.ok) {
        const userData = await response.json();
        console.log('User data received:', userData);
        setUser(userData);
        setError(null);
      } else {
        console.log('Not authenticated');
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking authentication status:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  
  const login = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`;
  };
  
  const logout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {
        credentials: 'include' // Include cookies in the request
      });
      setUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  
  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout, checkAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
}; 
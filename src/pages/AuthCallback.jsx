import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function AuthCallback() {
  const navigate = useNavigate();
  const { checkAuthStatus } = useAuth();

  useEffect(() => {
    const completeAuth = async () => {
      // Check authentication status after redirect
      await checkAuthStatus();
      // Redirect to home page
      navigate('/');
    };
    
    completeAuth();
  }, [checkAuthStatus, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent mx-auto mb-4"></div>
        <p className="text-text-secondary">Completing authentication...</p>
      </div>
    </div>
  );
} 
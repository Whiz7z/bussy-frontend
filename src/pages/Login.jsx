import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../hooks/useAuth';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-3xl font-bold text-center mb-8 text-primary">Welcome to Bussy</h1>
        <button
          onClick={login}
          className="w-full flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium cursor-pointer"
        >
          <FcGoogle className="text-2xl" />
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login; 
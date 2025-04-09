import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-[#333C7C] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="text-2xl font-bold cursor-pointer">
            Bussy
          </Link>
          
          <div className="flex items-center gap-4">
            <Link to="/" className="hover:text-accent cursor-pointer">
              Home
            </Link>
            {user ? (
              <>
                <Link to="/add-business" className="hover:text-accent cursor-pointer">
                  Add Business
                </Link>
                <div className="flex items-center gap-3">
                  <Link to="/profile" className="hover:text-accent cursor-pointer">
                    <img
                      src={user.picture}
                      alt={user.name}
                      className="w-8 h-8 rounded-full hover:ring-2 hover:ring-accent transition-all"
                    />
                  </Link>
                  <button
                    onClick={logout}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-accent hover:bg-accent/90 text-primary px-4 py-2 rounded-lg transition-colors duration-200 cursor-pointer"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import AddBusiness from './pages/AddBusiness';
import BusinessDetails from './pages/BusinessDetails';
import Profile from './pages/Profile';
import AuthCallback from './pages/AuthCallback';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="relative">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/business/:id" element={<BusinessDetails />} />
            <Route path="/add-business" element={<AddBusiness />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/auth-callback" element={<AuthCallback />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

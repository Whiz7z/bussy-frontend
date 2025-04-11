import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function AddBusiness() {
  const navigate = useNavigate();
  const { user, getAuthToken } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    formattedAddress: '',
    phoneNumber: '',
    website: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      const token = getAuthToken();
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/businesses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to create business');

      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 px-4">
      <div className="max-w-[600px] mx-auto">
        <h1 className="text-2xl font-semibold text-[#333C7C] mb-8">Add New Business</h1>

        {error && (
          <div className="bg-red-100 text-red-500 p-4 rounded-xl mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full h-[45px] bg-[#333C7C] rounded-xl text-white text-sm px-4 outline-none"
              placeholder="Enter business name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full h-[45px] bg-[#333C7C] rounded-xl text-white text-sm px-4 outline-none"
              placeholder="Enter business category"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <input
              type="text"
              name="formattedAddress"
              value={formData.formattedAddress}
              onChange={handleChange}
              required
              className="w-full h-[45px] bg-[#333C7C] rounded-xl text-white text-sm px-4 outline-none"
              placeholder="Enter business address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full h-[45px] bg-[#333C7C] rounded-xl text-white text-sm px-4 outline-none"
              placeholder="Enter phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Website
            </label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="w-full h-[45px] bg-[#333C7C] rounded-xl text-white text-sm px-4 outline-none"
              placeholder="Enter website URL"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-[45px] mt-4 bg-[#333C7C] rounded-xl text-white text-sm font-medium hover:bg-opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Adding...' : 'Add Business'}
          </button>
        </form>
      </div>
    </div>
  );
} 
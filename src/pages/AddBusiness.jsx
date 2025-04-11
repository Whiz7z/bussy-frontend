import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function AddBusiness() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    formattedAddress: '',
    phoneNumber: '',
    website: '',
    promotion: ''
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      // Check file type
      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed');
        return;
      }
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Create FormData to send both text and file data
      const submitData = new FormData();
      // Add all text fields
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          submitData.append(key, formData[key]);
        }
      });
      // Add image if selected
      if (selectedImage) {
        submitData.append('image', selectedImage);
      }
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/businesses`, {
        method: 'POST',
        credentials: 'include', // Include cookies in the request
        body: submitData // FormData - do not set Content-Type header, browser will set it with boundary
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create business');
      }

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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Promotion (Optional)
            </label>
            <input
              type="text"
              name="promotion"
              value={formData.promotion}
              onChange={handleChange}
              className="w-full h-[45px] bg-[#333C7C] rounded-xl text-white text-sm px-4 outline-none"
              placeholder="e.g., '20% off all services this week'"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Image
            </label>
            <div className="flex items-center space-x-4">
              <label className="cursor-pointer flex items-center justify-center h-[45px] bg-[#333C7C] rounded-xl text-white text-sm px-4 hover:bg-opacity-90 transition-opacity">
                <span>Select Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              {selectedImage && (
                <span className="text-sm text-gray-500">
                  {selectedImage.name}
                </span>
              )}
            </div>
            {previewUrl && (
              <div className="mt-2">
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="h-40 object-cover rounded-lg border border-gray-300" 
                />
              </div>
            )}
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
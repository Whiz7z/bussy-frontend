import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function Profile() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);


  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('File size must be less than 5MB');
        return;
      }
      // Check file type
      if (!file.type.startsWith('image/')) {
        setUploadError('Only image files are allowed');
        return;
      }
      setSelectedImage(file);
      setUploadError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) return;

    setIsUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append('image', selectedImage);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/upload-profile-picture`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload image');
      }

      // Update the user's picture in the UI
      if (data.url) {
        window.location.reload();
      }
    } catch (error) {
      setUploadError(error.message || 'Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="bg-secondary rounded-lg shadow-lg p-6">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative group">
            <img
              src={user.picture}
              alt={user.name}
              className="w-32 h-32 rounded-full object-cover"
            />
            <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
              <span className="text-white text-sm">Change Photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
            </label>
          </div>

          <div className="text-center">
            <h1 className="text-2xl font-bold text-text">{user.name}</h1>
            <p className="text-text-secondary">{user.email}</p>
          </div>

          {selectedImage && (
            <div className="flex flex-col items-center space-y-2">
              <button
                onClick={handleUpload}
                disabled={isUploading}
                className="bg-accent hover:bg-accent/90 text-white px-6 py-2 rounded-lg transition-colors bg-amber-400 disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
              >
                {isUploading ? 'Uploading...' : 'Upload New Photo'}
              </button>
              <p className="text-sm text-text-secondary">
                Selected: {selectedImage.name}
              </p>
            </div>
          )}

          {uploadError && (
            <p className="text-red-500 text-sm">{uploadError}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile; 
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function Profile() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    const fetchUserReviews = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/reviews/user`, {
          credentials: 'include'
        });
        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }
        const data = await response.json();
        setReviews(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoadingReviews(false);
      }
    };

    if (user) {
      fetchUserReviews();
    }
  }, [user]);

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
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
        body: formData,
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      // Refresh the page to show the new profile picture
      window.location.reload();
    } catch (err) {
      setUploadError('Failed to upload image. Please try again.');
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
                className="bg-accent hover:bg-accent/90 text-white px-6 py-2 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
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

      <div className="bg-secondary rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-text mb-4">Your Reviews</h2>
        {isLoadingReviews ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent"></div>
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : reviews.length === 0 ? (
          <p className="text-text-secondary">You haven't written any reviews yet.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="border border-border rounded-lg p-4 hover:border-accent transition-colors"
                onClick={() => navigate(`/business/${review.businessId}`)}
                role="button"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-text">{review.business.name}</h3>
                    <div className="flex items-center space-x-1 text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${
                            i < review.rating ? 'fill-current' : 'fill-gray-300'
                          }`}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <span className="text-sm text-text-secondary">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-2 text-text-secondary">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile; 
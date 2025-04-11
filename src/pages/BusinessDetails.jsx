import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function BusinessDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [business, setBusiness] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: ''
  });

  useEffect(() => {
    fetchBusinessDetails();
    fetchReviews();
  }, [id]);

  const fetchBusinessDetails = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/businesses/${id}`);
      if (!response.ok) throw new Error('Failed to fetch business details');
      const data = await response.json();
      setBusiness(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reviews/business/${id}`);
      if (!response.ok) throw new Error('Failed to fetch reviews');
      const data = await response.json();
      setReviews(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          ...reviewForm,
          businessId: id
        })
      });

      if (!response.ok) throw new Error('Failed to submit review');

      const newReview = await response.json();
      setReviews(prev => [...prev, newReview]);
      setReviewForm({ rating: 5, comment: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="min-h-screen pt-24 px-4 text-center">Loading...</div>;
  if (error) return <div className="min-h-screen pt-24 px-4 text-center text-red-500">{error}</div>;
  if (!business) return <div className="min-h-screen pt-24 px-4 text-center">Business not found</div>;

  return (
    <div className="min-h-screen pt-24 px-4">
      <div className="max-w-[900px] mx-auto">
        <div className="bg-[#333C7C] rounded-xl p-6 mb-8">
          <div className="flex">
            {business.imageUrl ? (
              <div className="w-32 h-32 mr-6 flex-shrink-0">
                <img 
                  src={business.imageUrl} 
                  alt={business.name} 
                  className="w-full h-full object-cover rounded-lg" 
                />
              </div>
            ) : (
              <div className="w-32 h-32 mr-6 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center">
                <span className="text-gray-500 text-sm">No image</span>
              </div>
            )}
            
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <h1 className="text-2xl font-semibold text-white">{business.name}</h1>
                {business.averageRating > 0 && (
                  <div className="ml-3 flex items-center">
                    <span className="text-[#FFB700] font-medium">{business.averageRating.toFixed(1)}</span>
                    <svg className="w-5 h-5 text-[#FFB700] ml-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-white text-sm ml-1">({business.reviews.length} reviews)</span>
                  </div>
                )}
              </div>
              
              {business.promotion && (
                <div className="mb-3">
                  <span className="inline-block bg-[#FFB700] text-[#333C7C] text-sm font-medium px-3 py-1 rounded-md">
                    {business.promotion}
                  </span>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-white text-sm mb-2">{business.category}</p>
                  <p className="text-white text-sm mb-2">{business.formattedAddress}</p>
                  <p className="text-white text-sm">{business.phoneNumber}</p>
                </div>
                {business.website && (
                  <div className="text-right">
                    <a
                      href={business.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#FFB700] hover:text-white transition-colors"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-[#333C7C] mb-4">Reviews</h2>
          {user && (
            <form onSubmit={handleReviewSubmit} className="bg-white rounded-xl p-6 mb-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rating
                </label>
                <select
                  value={reviewForm.rating}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, rating: Number(e.target.value) }))}
                  className="w-full h-[45px] bg-[#333C7C] rounded-xl text-white text-sm px-4 outline-none"
                >
                  {[5, 4, 3, 2, 1].map(num => (
                    <option key={num} value={num}>{num} Stars</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Comment
                </label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                  required
                  className="w-full h-[100px] bg-[#333C7C] rounded-xl text-white text-sm p-4 outline-none"
                  placeholder="Write your review..."
                />
              </div>
              <button
                type="submit"
                className="w-full h-[45px] bg-[#333C7C] rounded-xl text-white text-sm font-medium hover:bg-opacity-90 transition-opacity cursor-pointer"
              >
                Submit Review
              </button>
            </form>
          )}

          <div className="grid gap-4">
            {reviews.map(review => (
              <div key={review.id} className="bg-white rounded-xl p-6">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <span className="text-[#FFB700] font-semibold mr-2">
                      {review.rating} Stars
                    </span>
                    <span className="text-sm text-gray-500">
                      by {review.user.name}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
            {reviews.length === 0 && (
              <div className="text-center text-gray-500">No reviews yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 
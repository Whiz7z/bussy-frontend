import { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import BusinessCard from '../components/BusinessCard';
import { Link } from 'react-router-dom';

export default function Home() {
  const [businesses, setBusinesses] = useState([]); // Store all businesses
  const [filteredBusinesses, setFilteredBusinesses] = useState([]); // Store filtered businesses
  const [promotionBusinesses, setPromotionBusinesses] = useState([]); // Store businesses with promotions
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/businesses`);
      if (!response.ok) throw new Error('Failed to fetch businesses');
      const data = await response.json();
      
      // Filter businesses with promotions
      const businessesWithPromotions = data.filter(business => business.promotion);
      
      setBusinesses(data);
      setFilteredBusinesses(data); // Initialize filtered businesses
      setPromotionBusinesses(businessesWithPromotions); // Set businesses with promotions
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (params) => {
    const { category, address } = params;

    // Filter businesses based on category and address
    const filtered = businesses.filter(business => {
      const matchesCategory = category ? business.category.toLowerCase().includes(category.toLowerCase()) : true;
      const matchesAddress = address ? business.formattedAddress.toLowerCase().includes(address.toLowerCase()) : true;
      return matchesCategory && matchesAddress;
    });

    setFilteredBusinesses(filtered);
  };

  const handleReset = () => {
    setFilteredBusinesses(businesses); // Reset filtered businesses to all businesses
  };

  if (error) {
    return (
      <div className="min-h-screen pt-24 px-4">
        <div className="text-red-500 text-center">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 mt-[200px]">
      <div className="max-w-[900px] mx-auto grid gap-6">
        {/* Daily Offers Section */}
        <div className="w-[900px] bg-blue-500 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Daily Offers</h2>
          
          {loading ? (
            <div className="text-white text-center py-4">Loading promotions...</div>
          ) : promotionBusinesses.length > 0 ? (
            <div className="space-y-4">
              {promotionBusinesses.slice(0, 3).map(business => (
                <div key={business.id} className="bg-[#333C7C] bg-opacity-10 rounded-lg p-4 hover:bg-opacity-20 transition-colors">
                  <div className="flex items-start">
                    {business.imageUrl && (
                      <div className="w-16 h-16 mr-4 flex-shrink-0">
                        <img 
                          src={business.imageUrl} 
                          alt={business.name} 
                          className="w-full h-full object-cover rounded-lg" 
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <Link 
                        to={`/business/${business.id}`}
                        className="text-white font-semibold hover:text-[#FFB700] transition-colors"
                      >
                        {business.name}
                      </Link>
                      <div className="mt-1">
                        <span className="inline-block bg-[#FFB700] text-[#333C7C] text-xs font-medium px-2 py-1 rounded">
                          {business.promotion}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {promotionBusinesses.length > 3 && (
                <div className="text-center mt-2">
                  <span className="text-[#FFB700] text-sm">
                    + {promotionBusinesses.length - 3} more offers
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-white text-center py-4">No promotions available at the moment</div>
          )}
        </div>
        
        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} onReset={handleReset} />

        {/* Business Listings */}
        <div className="grid gap-4 mt-2">
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : filteredBusinesses.length > 0 ? (
            filteredBusinesses.map(business => (
              <BusinessCard key={business.id} business={business} />
            ))
          ) : (
            <div className="text-center text-gray-500">No businesses found</div>
          )}
        </div>
      </div>
    </div>
  );
}
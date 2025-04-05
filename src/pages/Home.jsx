import { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import BusinessCard from '../components/BusinessCard';

export default function Home() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async (searchParams = {}) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams(searchParams).toString();
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/businesses${queryParams ? `?${queryParams}` : ''}`);
      if (!response.ok) throw new Error('Failed to fetch businesses');
      const data = await response.json();
      setBusinesses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (params) => {
    fetchBusinesses(params);
  };

  if (error) {
    return (
      <div className="min-h-screen pt-24 px-4">
        <div className="text-red-500 text-center">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  px-4 mt-[200px]">
      <div className="max-w-[900px] mx-auto grid">
        <SearchBar onSearch={handleSearch} />
        
        <div className="grid gap-4 mt-8  ">
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : businesses.length > 0 ? (
            businesses.map(business => (
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
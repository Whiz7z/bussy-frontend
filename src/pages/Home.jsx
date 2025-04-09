import { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import BusinessCard from '../components/BusinessCard';

export default function Home() {
  const [businesses, setBusinesses] = useState([]); // Store all businesses
  const [filteredBusinesses, setFilteredBusinesses] = useState([]); // Store filtered businesses
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
      setBusinesses(data);
      setFilteredBusinesses(data); // Initialize filtered businesses
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
      <div className="max-w-[900px] mx-auto grid">
        <div className="w-[900px] h-[120px] bg-[#333C7C] rounded-xl p-6">
          <h2 className="text-2xl font-bold">Daily Offers</h2>
        </div>
        <SearchBar onSearch={handleSearch} onReset={handleReset} />


        <div className="grid gap-4 mt-8">
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
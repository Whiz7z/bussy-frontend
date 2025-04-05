import { useState } from 'react';

export default function SearchBar({ onSearch }) {
  const [category, setCategory] = useState('');
  const [address, setAddress] = useState('');

  const handleSearch = () => {
    onSearch({ category, address });
  };

  return (
    <div className="flex gap-4 w-[900px] h-[45px]">
      <div className="relative w-[240px]">
        <input
          type="text"
          placeholder="Business category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full h-[45px] bg-[#333C7C] rounded-xl text-white text-xs px-4 outline-none"
        />
      </div>
      <div className="relative w-[240px]">
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full h-[45px] bg-[#333C7C] rounded-xl text-white text-xs px-4 outline-none"
        />
      </div>
      <button
        onClick={handleSearch}
        className="w-[45px] h-[45px] bg-[#333C7C] rounded-xl flex items-center justify-center cursor-pointer"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="7"
            cy="7"
            r="5.75"
            stroke="#87878A"
            strokeWidth="1.5"
          />
          <line
            x1="11.0607"
            y1="11"
            x2="14"
            y2="13.9393"
            stroke="#87878A"
            strokeWidth="1.5"
          />
        </svg>
      </button>
    </div>
  );
} 
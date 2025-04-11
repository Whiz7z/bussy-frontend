import { Link } from 'react-router-dom';

export default function BusinessCard({ business }) {
  const { id, name, category, formattedAddress, phoneNumber, website, imageUrl, averageRating, promotion } = business;

  return (
    <div className="w-[900px] min-h-[120px] bg-[#333C7C] rounded-xl p-6 flex">
      {imageUrl ? (
        <div className="w-24 h-24 mr-6 flex-shrink-0">
          <img 
            src={imageUrl} 
            alt={name} 
            className="w-full h-full object-cover rounded-lg" 
          />
        </div>
      ) : (
        <div className="w-24 h-24 mr-6 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center">
          <span className="text-gray-500 text-xs">No image</span>
        </div>
      )}
      
      <div className="flex justify-between flex-1">
        <div className="flex flex-col gap-2">
          <div className="flex items-center">
            <Link 
              to={`/business/${id}`}
              className="text-white text-lg font-semibold hover:text-[#FFB700] transition-colors"
            >
              {name}
            </Link>
            {averageRating > 0 && (
              <div className="ml-2 flex items-center">
                <span className="text-[#FFB700] text-sm font-medium ml-1">{averageRating.toFixed(1)}</span>
                <svg className="w-4 h-4 text-[#FFB700] ml-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            )}
          </div>
          <span className="text-white text-sm">{category}</span>
          <span className="text-white text-xs">{formattedAddress}</span>
          {promotion && (
            <div className="mt-1">
              <span className="inline-block bg-[#FFB700] text-[#333C7C] text-xs font-medium px-2 py-1 rounded">
                {promotion}
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2 items-end">
          <a 
            href={`tel:${phoneNumber}`}
            className="text-white text-sm hover:text-[#FFB700] transition-colors"
          >
            {phoneNumber}
          </a>
          {website && (
            <a 
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white text-sm hover:text-[#FFB700] transition-colors"
            >
              Visit Website
            </a>
          )}
          <Link 
            to={`/business/${id}`}
            className="text-[#FFB700] text-sm hover:text-white transition-colors"
          >
            View Reviews
          </Link>
        </div>
      </div>
    </div>
  );
} 
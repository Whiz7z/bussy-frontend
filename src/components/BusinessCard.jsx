import { Link } from 'react-router-dom';

export default function BusinessCard({ business }) {
  const { id, name, category, formattedAddress, phoneNumber, website } = business;

  return (
    <div className="w-[900px] h-[120px] bg-[#333C7C] rounded-xl p-6">
      <div className="flex justify-between">
        <div className="flex flex-col gap-2">
          <Link 
            to={`/business/${id}`}
            className="text-white text-lg font-semibold hover:text-[#FFB700] transition-colors"
          >
            {name}
          </Link>
          <span className="text-white text-sm">{category}</span>
          <span className="text-white text-xs">{formattedAddress}</span>
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
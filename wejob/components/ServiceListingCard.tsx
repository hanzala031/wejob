
import React from 'react';
import { Heart, Star } from 'lucide-react';

interface Service {
  id: number;
  image: string;
  category: string;
  title: string;
  rating: number;
  reviews: number;
  seller: {
      name: string;
      avatar: string;
  };
  price: number;
}

interface ServiceListingCardProps {
  service: Service;
  onNavigate: (page: string, data?: any) => void;
}

const ServiceListingCard: React.FC<ServiceListingCardProps> = ({ service, onNavigate }) => {
  return (
    <div className="group bg-white rounded-lg border border-gray-200 p-4 flex flex-col sm:flex-row gap-6 hover:shadow-lg transition-shadow duration-300">
      {/* Image */}
      <div className="w-full sm:w-64 flex-shrink-0 rounded-lg overflow-hidden cursor-pointer" onClick={() => onNavigate('servicedetail', service)}>
        <img src={service.image} alt={service.title} className="rounded-lg w-full h-48 sm:h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110" />
      </div>

      {/* Details */}
      <div className="flex-grow flex flex-col">
        <div className="flex justify-between items-start">
            <p className="text-sm text-gray-500 mb-1">{service.category}</p>
            <button className="text-gray-400 hover:text-red-500" aria-label="Add to favorites">
                <Heart className="w-6 h-6" />
            </button>
        </div>
        <h3 
            className="text-lg font-bold text-gray-800 hover:text-blue-600 cursor-pointer mb-2"
            onClick={() => onNavigate('servicedetail', service)}
        >
            {service.title}
        </h3>
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
            <span className="font-bold text-gray-700">{service.rating.toFixed(2)}</span>
            <span>({service.reviews} reviews)</span>
        </div>
        
        <div className="border-t border-gray-100 mt-auto pt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={service.seller.avatar} alt={service.seller.name} className="w-8 h-8 rounded-full object-cover" />
            <span className="text-sm font-medium text-gray-700">{service.seller.name}</span>
          </div>
          <div>
            <span className="text-xs text-gray-500 block text-right">Starting at</span>
            <span className="text-xl font-bold text-gray-800">${service.price}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceListingCard;

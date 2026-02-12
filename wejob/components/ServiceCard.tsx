import React from 'react';
import { CheckCircle2, Heart, MapPin, Star } from 'lucide-react';

interface Service {
    id: number;
    category: string;
    image: string;
    seller: {
        name: string;
        avatar: string;
        verified: boolean;
    };
    title: string;
    rating: number;
    reviews: number;
    location: string;
    price: number;
    packages?: any;
}

interface ServiceCardProps {
    service: Service;
    onNavigate: (page: string, data?: any) => void;
}

const RatingStars: React.FC<{ rating: number }> = ({ rating }) => {
    return (
        <div className="flex items-center">
            {[...Array(5)].map((_, index) => (
                <Star
                    key={index}
                    className={`w-3.5 h-3.5 md:w-4 md:h-4 ${index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                />
            ))}
        </div>
    );
};

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onNavigate }) => {
    const isClickable = !!service.packages;

    return (
        <div 
            className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 flex flex-col h-full group ${isClickable ? 'cursor-pointer' : ''}`}
            onClick={() => isClickable && onNavigate('servicedetail', service)}
            role={isClickable ? "button" : undefined}
            tabIndex={isClickable ? 0 : -1}
        >
            <div className="relative overflow-hidden aspect-[4/3] xs:aspect-video lg:aspect-[4/3]">
                <img 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    src={service.image} 
                    alt={service.title} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <button className="absolute top-3 right-3 w-10 h-10 flex items-center justify-center bg-white/95 backdrop-blur-sm rounded-xl text-gray-400 hover:text-red-500 hover:scale-110 active:scale-90 transition-all shadow-lg">
                    <Heart className="w-5 h-5" />
                </button>
            </div>
            <div className="p-4 md:p-6 flex flex-col flex-grow">
                <div className="flex items-center mb-4">
                    <img className="w-8 h-8 md:w-9 md:h-9 rounded-full mr-3 object-cover border-2 border-white shadow-sm" src={service.seller.avatar} alt={service.seller.name} />
                    <div className="flex flex-col">
                        <span className="text-xs md:text-sm font-bold text-gray-900 flex items-center gap-1">
                            {service.seller.name}
                            {service.seller.verified && <CheckCircle2 className="w-3 h-3 text-blue-500" />}
                        </span>
                        <span className="text-[10px] text-gray-400 font-medium">Level 2 Seller</span>
                    </div>
                </div>
                
                <h3 className="text-sm md:text-base font-bold text-gray-800 leading-snug group-hover:text-[#2563eb] transition-colors mb-3 flex-grow line-clamp-2">
                    {service.title}
                </h3>
                
                <div className="flex items-center gap-2 mb-4">
                    <RatingStars rating={service.rating} />
                    <span className="text-xs md:text-sm font-bold text-gray-900">{service.rating.toFixed(1)}</span>
                    <span className="text-[10px] md:text-xs text-gray-400 font-medium">({service.reviews})</span>
                </div>
                
                <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex items-center text-gray-500">
                        <MapPin className="w-3.5 h-3.5 mr-1 text-blue-500" />
                        <span className="text-[10px] md:text-xs font-medium truncate max-w-[100px]">{service.location}</span>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Starts at</p>
                        <p className="text-base md:text-lg font-black text-[#2563eb]">${service.price}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceCard;

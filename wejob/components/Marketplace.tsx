
import React, { useState, forwardRef } from 'react';
import ServiceCard from './ServiceCard';
import { ChevronRight } from 'lucide-react';
import { services } from './ServicesData';

const categories = [
    'All', 
    'Digital Marketing', 
    'Programming & Tech', 
    'Smart AI Services',
    'Graphic Design',
    'Writing & Translation',
    'Video & Animation',
    'Business'
];

interface MarketplaceProps {
  onNavigate: (page: string, data?: any) => void;
}

const Marketplace = forwardRef<HTMLElement, MarketplaceProps>(({ onNavigate }, ref) => {
    const [activeCategory, setActiveCategory] = useState('All');

    const filteredServices = services.filter(service => 
        activeCategory === 'All' || service.category === activeCategory
    );

    return (
        <section ref={ref} className="bg-gray-50 py-10 md:py-16 lg:py-20 text-gray-800">
            <div className="container mx-auto px-4 md:px-6">
                <div className="max-w-4xl mb-8 md:mb-10 space-y-3">
                    <p className="text-xs md:text-sm font-semibold text-blue-600 uppercase tracking-wider">Boost Your Working Flow</p>
                    <p className="text-sm md:text-base text-gray-500 leading-relaxed max-w-2xl">
                        Your premier online marketplace. Find quality products and services, connect with trusted sellers, and enjoy a seamless shopping experience today.
                    </p>
                </div>

                <div className="flex flex-wrap gap-2 md:gap-3 mb-8 md:mb-12">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`px-4 py-2 md:px-3 md:py-2 text-xs md:text-sm font-medium rounded-md transition-all duration-200 ${
                                activeCategory === category
                                    ? 'bg-[#1D4ED8] text-white shadow-lg'
                                    : 'bg-white text-gray-600 hover:text-white hover:bg-[#1D4ED8] border border-gray-200 hover:border-gray-300 hover:shadow-lg'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                <div className="grid md:grid-cols-2 xs:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-5 md:gap-6 lg:gap-8">
                    {filteredServices?.map(service => (
                        <ServiceCard key={service.id} service={service} onNavigate={onNavigate} />
                    ))}
                </div>

                <div className="text-center mt-10 md:mt-14">
                    <button className="relative group overflow-hidden bg-white border border-gray-300 text-gray-800 hover:text-white font-semibold px-6 py-2.5 md:px-8 md:py-3 rounded-lg flex items-center justify-center gap-2 mx-auto transition-all duration-300 ease-in-out shadow-sm hover:shadow-md hover:border-[#2563eb]">
                        <span className="absolute top-0 left-0 w-full h-full bg-[#2563eb] transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 ease-in-out origin-bottom z-0"></span>
                        <span className="relative z-10 flex items-center gap-2 text-sm md:text-base">
                            <span>Explore More</span>
                            <ChevronRight className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 group-hover:translate-x-1" />
                        </span>
                    </button>
                </div>
            </div>
        </section>
    );
});

export default Marketplace;

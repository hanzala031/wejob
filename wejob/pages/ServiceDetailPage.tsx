
import React, { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { services } from '../components/ServicesData';
import LoginPopup from '../components/LoginPopup';

// Icons
import { Star, CheckCircle2, ShoppingCart, ChevronLeft, ChevronRight, Box, ArrowLeftRight, Loader2 } from 'lucide-react';

interface ServiceDetailPageProps {
  onNavigate: (page: string, data?: any) => void;
  service?: any;
  onShowNotification: (message: string) => void;
}

const RatingStars: React.FC<{ rating: number }> = ({ rating }) => (
    <div className="flex items-center">
        {[...Array(5)].map((_, index) => (
            <Star
                key={index}
                className={`w-5 h-5 ${index < Math.round(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
            />
        ))}
    </div>
);


const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({ onNavigate, service: propService, onShowNotification }) => {
    const { state } = useLocation();
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('description');
    const [activePackage, setActivePackage] = useState<'basic' | 'standard' | 'premium'>('standard');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isContinueLoading, setIsContinueLoading] = useState(false);
    const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);

    const service = propService || state?.service || services.find(s => s.id === Number(id));

    if (!service) {
        return (
          <div className="bg-gray-50 min-h-screen flex items-center justify-center font-sans">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Service Not Found</h2>
              <p className="text-gray-600 mb-4">We couldn't find the service you're looking for.</p>
              <button onClick={() => onNavigate('service')} className="text-blue-600 hover:underline font-semibold">
                Browse Services
              </button>
            </div>
          </div>
        );
    }
    
    const nextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % service.gallery.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + service.gallery.length) % service.gallery.length);
    };

    const selectedPackage = service.packages[activePackage];

    const handleContinueClick = () => {
        setIsContinueLoading(true);
        
        // Simulate a small load
        setTimeout(() => {
            setIsContinueLoading(false);
            setIsLoginPopupOpen(true);
            
            // Redirect after 2 seconds
            setTimeout(() => {
                setIsLoginPopupOpen(false);
                onNavigate('signin');
            }, 2000);
        }, 800);
    };

    return (
        <div className="bg-gray-50 font-sans">
            <LoginPopup isOpen={isLoginPopupOpen} onClose={() => setIsLoginPopupOpen(false)} />
            <div className="container mx-auto px-4 sm:px-6 py-8">
                {/* Breadcrumbs */}
                <nav className="text-sm text-gray-500 mb-4">
                    <ol className="list-none p-0 inline-flex">
                        <li className="flex items-center">
                            <button onClick={() => onNavigate('service')} className="hover:text-gray-800">Services</button>
                            <ChevronRight className="w-4 h-4 mx-2" />
                        </li>
                        <li>
                            <span className="text-gray-800 font-medium">{service.category}</span>
                        </li>
                    </ol>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Service Header */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">{service.title}</h1>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <img src={service.seller.avatar} alt={service.seller.name} className="w-10 h-10 rounded-full object-cover" />
                                    <span className="font-semibold">{service.seller.name}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <RatingStars rating={service.stats.rating} />
                                    <span className="font-bold text-gray-800">{service.stats.rating.toFixed(1)}</span>
                                    <span>({service.stats.reviews} Reviews)</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <ShoppingCart className="w-5 h-5" />
                                    <span>{service.stats.sales} Sales</span>
                                </div>
                            </div>
                        </div>

                        {/* Image Gallery */}
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                            <div className="relative mb-4">
                                <img src={service.gallery[currentImageIndex]} alt={`${service.title} - view ${currentImageIndex + 1}`} className="w-full h-auto max-h-[500px] object-cover rounded-md" />
                                <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition">
                                    <ChevronLeft className="w-6 h-6 text-gray-800" />
                                </button>
                                <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition">
                                    <ChevronRight className="w-6 h-6 text-gray-800" />
                                </button>
                            </div>
                             <div className="flex justify-center gap-2">
                                {service.gallery.map((img: string, index: number) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentImageIndex(index)}
                                        className={`w-20 h-20 rounded-md overflow-hidden border-2 transition-all ${
                                            currentImageIndex === index ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent hover:border-blue-300'
                                        }`}
                                    >
                                        <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        {/* Tabs */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="border-b border-gray-200">
                                <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
                                    <button onClick={() => setActiveTab('description')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'description' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Description</button>
                                    <button onClick={() => setActiveTab('features')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'features' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Service Features</button>
                                    <button onClick={() => setActiveTab('faq')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'faq' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>FAQ</button>
                                </nav>
                            </div>
                            <div className="p-6">
                                {activeTab === 'description' && (
                                    <div className="prose max-w-none text-gray-600">
                                        <p>{service.description}</p>
                                    </div>
                                )}
                                {activeTab === 'features' && (
                                    <ul className="space-y-3 text-gray-600">
                                        {service.serviceFeatures.map((feature: string, index: number) => (
                                            <li key={index} className="flex items-start gap-3">
                                                <CheckCircle2 className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                {activeTab === 'faq' && (
                                    <div className="space-y-4">
                                        {service.faq.map((item: any, index: number) => (
                                            <div key={index}>
                                                <h4 className="font-semibold text-gray-800">{item.question}</h4>
                                                <p className="text-gray-600">{item.answer}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-6 space-y-8">
                            {/* Packages */}
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                <div className="flex border-b border-gray-200 mb-4">
                                    <button onClick={() => setActivePackage('basic')} className={`flex-1 pb-2 text-center font-semibold ${activePackage === 'basic' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500'}`}>Basic</button>
                                    <button onClick={() => setActivePackage('standard')} className={`flex-1 pb-2 text-center font-semibold ${activePackage === 'standard' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500'}`}>Standard</button>
                                    <button onClick={() => setActivePackage('premium')} className={`flex-1 pb-2 text-center font-semibold ${activePackage === 'premium' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500'}`}>Premium</button>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="text-lg font-bold">{selectedPackage.name}</h3>
                                        <p className="text-2xl font-bold text-gray-800">${selectedPackage.price.toFixed(2)}</p>
                                    </div>
                                    <p className="text-sm text-gray-600">{selectedPackage.description}</p>
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <div className="flex items-center gap-1.5"><Box className="w-5 h-5" /> Delivery: {selectedPackage.delivery} Days</div>
                                        <div className="flex items-center gap-1.5"><ArrowLeftRight className="w-5 h-5" /> Revisions: 3</div>
                                    </div>
                                    <ul className="space-y-2 pt-2">
                                        {selectedPackage.features.map((feature: string, index: number) => (
                                            <li key={index} className="flex items-center gap-2 text-sm text-gray-700"><CheckCircle2 className="w-4 h-4 text-green-500" /> {feature}</li>
                                        ))}
                                    </ul>
                                    <button 
                                        onClick={handleContinueClick}
                                        disabled={isContinueLoading}
                                        className="w-full mt-4 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {isContinueLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                                        Continue (${selectedPackage.price.toFixed(2)})
                                    </button>
                                    <button className="w-full mt-2 text-center text-blue-600 font-semibold text-sm">Contact Seller</button>
                                </div>
                            </div>

                            {/* Seller Card */}
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                <h3 className="text-lg font-bold mb-4">About The Seller</h3>
                                <div className="flex items-center gap-4 mb-4">
                                    <img src={service.seller.avatar} alt={service.seller.name} className="w-16 h-16 rounded-full object-cover" />
                                    <div>
                                        <h4 className="font-bold text-gray-800">{service.seller.name}</h4>
                                        <p className="text-sm text-gray-500">{service.seller.title}</p>
                                        <div className="flex items-center gap-1 text-sm mt-1">
                                            <RatingStars rating={service.stats.rating} />
                                            <span>({service.stats.reviews})</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="border-t border-gray-200 pt-4 text-sm space-y-2">
                                    <div className="flex justify-between"><span>From</span><span className="font-semibold">{service.seller.location}</span></div>
                                    <div className="flex justify-between"><span>Avg. response time</span><span className="font-semibold">1 hour</span></div>
                                    <div className="flex justify-between"><span>Last delivery</span><span className="font-semibold">about 4 hours</span></div>
                                </div>
                                <button
                                  onClick={() => onNavigate('freelancerprofile', service.seller)}
                                  className="w-full mt-4 bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                  View Profile
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceDetailPage;

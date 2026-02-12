import React, { useState } from 'react';
import { Play } from 'lucide-react';
import ServiceListings from '../components/ServiceListings';
import VideoModal from '../components/VideoModal';

const Breadcrumb: React.FC = () => (
  <nav className="text-sm text-gray-500 mb-8">
    <ol className="list-none p-0 inline-flex">
      <li className="flex items-center">
        <a href="#" className="hover:text-gray-800">Browse Job</a>
        <svg className="fill-current w-3 h-3 mx-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"/></svg>
      </li>
      <li className="flex items-center">
        <a href="#" className="hover:text-gray-800">Services</a>
        <svg className="fill-current w-3 h-3 mx-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"/></svg>
      </li>
      <li>
        <span className="text-gray-800 font-medium">Design & Creative</span>
      </li>
    </ol>
  </nav>
);

interface ServicePageProps {
  onNavigate: (page: string, data?: any) => void;
}

const ServicePage: React.FC<ServicePageProps> = ({ onNavigate }) => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  return (
    <>
      <div className="bg-gray-50">
        <div className="container mx-auto px-6 pt-8">
          <Breadcrumb />
          <div 
            className="relative rounded-2xl p-8 md:p-16 text-white overflow-hidden bg-cover bg-center min-h-[300px] flex flex-col justify-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519642918688-7e43b19245d8?q=80&w=2070&auto=format&fit=crop')" }}
          >
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="relative z-10 max-w-lg">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Design & Creative</h1>
              <p className="text-lg mb-8">
                Give your visitor a smooth online experience with a solid UX design
              </p>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setIsVideoModalOpen(true)}
                  className="w-14 h-14 flex items-center justify-center bg-white rounded-full shadow-lg hover:bg-gray-200 transition-colors"
                >
                  <Play className="w-6 h-6 text-gray-800 ml-1 fill-current" />
                </button>
                <span className="font-semibold text-lg">How Freeio Works</span>
              </div>
            </div>
          </div>
        </div>
        <ServiceListings onNavigate={onNavigate} />
      </div>
      <VideoModal 
        isOpen={isVideoModalOpen} 
        onClose={() => setIsVideoModalOpen(false)} 
        videoId="LXb3EKWsInQ" 
      />
    </>
  );
};

export default ServicePage;

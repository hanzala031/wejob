
import React from 'react';
import HeroIllustration from './HeroIllustration';
import SearchBar from './SearchBar';
import { Play } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <main className="container mx-auto px-6 py-10 lg:py-14 relative z-10">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-10">
        {/* Left side: Illustration */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-start order-2 lg:order-1">
          <HeroIllustration />
        </div>

        {/* Right side: Content */}
        <div className="w-full lg:w-1/2 text-center lg:text-left order-1 lg:order-2">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-3">
            Hire expert freelancers <br /> for any job, Online
          </h1>
          <p className="text-base sm:text-lg text-gray-300 mb-6 max-w-lg mx-auto lg:mx-0">
            Consectetur adipisicing elit sed do eiusmod tempor incuntes ut labore etdolore magna aliqua enim.
          </p>
          
          <div className="mb-6">
            <SearchBar />
          </div>

          <div className="flex items-center justify-center lg:justify-start space-x-4">
            <button className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white rounded-full shadow-lg hover:bg-gray-200 transition-colors">
                <Play className="w-5 h-5 md:w-6 md:h-6 text-[#2563eb] ml-1 fill-current" />
            </button>
            <div className="text-left">
              <p className="font-semibold text-sm md:text-base">See For Yourself!</p>
              <p className="text-xs md:text-sm text-gray-400">How it works & experience the ultimate joy.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default HeroSection;
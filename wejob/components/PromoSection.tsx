
import React from 'react';
import { Play } from 'lucide-react';

const PromoSection: React.FC = () => {
  return (
    <section className="py-12 md:py-20 lg:py-24 bg-gradient-to-br from-violet-50 to-teal-50 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row items-center gap-10 md:gap-12 lg:gap-20">
          {/* Left side: Content */}
          <div className="w-full lg:w-1/2 text-left space-y-4 md:space-y-6">
            <p className="text-gray-500 font-semibold tracking-wide text-xs md:text-sm uppercase">WE PROVIDE STABLE SERVICE WITH EXPERTS</p>
            
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-black leading-tight md:leading-snug">
              Freelancers around the globe are looking for work and provide the best they have. Start now
            </h2>
            
            <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                  Experience state of the art marketplace platform with the Exertio. We combine the experience of our global community around the globe for a best marketplace theme.
                </p>
                <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                  With Exertio, you can develop a website for remote freelancers that will provide their best to the clients who are looking for Resources.
                </p>
            </div>

            <div className="grid lg:grid-cols-2 md:grid-cols-1 items-center gap-4 pt-4">
              <button className="xs:w-auto bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold rounded-lg px-5 py-4 transition-all shadow-lg shadow-blue-500/10 active:scale-95 text-base">
                View Projects
              </button>
              <button className="xs:w-auto bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-lg px-5 py-4 transition-all shadow-lg shadow-gray-500/10 active:scale-95 text-base">
                Post A Service
              </button>
            </div>
          </div>

          {/* Right side: Image */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end relative mt-6 lg:mt-0">
            <div className="relative rounded-lg overflow-hidden shadow-2xl w-full max-w-md lg:max-w-lg">
              <img 
                src="https://res.cloudinary.com/dxvkigop9/image/upload/v1762759785/Group-39378_xwrs30.png" 
                alt="Freelancers working on a laptop"
                className="w-full h-auto object-cover"
              />
              <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6">
                <button className="w-10 h-10 md:w-14 md:h-14 flex items-center justify-center bg-gray-800 bg-opacity-90 rounded-md shadow-lg hover:bg-gray-900 transition-colors transform hover:scale-105">
                    <Play className="w-4 h-4 md:w-6 md:h-6 text-white ml-1 fill-current" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoSection;

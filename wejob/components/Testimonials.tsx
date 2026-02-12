
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonialsData = [
  {
    id: 1,
    quote: "Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est.",
    author: 'Dean Cross',
    location: 'Portland, Oregon',
    avatar: 'https://res.cloudinary.com/dxvkigop9/image/upload/v1764572462/5f3f747a950c51e84eb34035_Picture_2_aka3sy.jpg',
  },
  {
    id: 2,
    quote: "AIHire transformed how we find talent. The platform is intuitive, and the quality of freelancers is exceptional. We found the perfect developer for our project in just a few days!",
    author: 'Sarah Johnson',
    location: 'CEO at TechCorp',
    avatar: 'https://res.cloudinary.com/dxvkigop9/image/upload/v1764572636/5f3f750ed9f60af5a6bc399f_Picture_3_mljpko.jpg',
  },
  {
    id: 3,
    quote: "As a freelancer, AIHire has been a game-changer. The variety of high-quality projects is amazing, and the secure payment system gives me peace of mind. Highly recommended!",
    author: 'Michael Chen',
    location: 'Full-Stack Developer',
    avatar: 'https://res.cloudinary.com/dxvkigop9/image/upload/v1764572432/5f3f6b4695543a346b7a8ecb_Picture_1_kamd4a.jpg',
  }
];

const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonialsData.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonialsData.length) % testimonialsData.length);
  };
  
  useEffect(() => {
    const timer = setTimeout(nextTestimonial, 6000); 
    return () => clearTimeout(timer);
  }, [currentIndex]);

  return (
    <section className="py-12 md:py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 md:px-14">
        <div className="relative max-w-6xl mx-auto">
          
          {/* Main Slider Content */}
          {/* Height adjustments: taller on mobile to fit stacked content, shorter on desktop for side-by-side */}
          <div className="relative min-h-[580px] xs:min-h-[520px] sm:min-h-[480px] md:min-h-[350px]">
            {testimonialsData.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`absolute inset-0 transition-all duration-700 ease-in-out flex flex-col-reverse md:flex-row items-center gap-6 md:gap-16 ${
                    index === currentIndex 
                    ? 'opacity-100 translate-x-0 z-10' 
                    : 'opacity-0 translate-x-10 z-0 pointer-events-none'
                }`}
              >
                {/* Left Side: Text */}
                <div className="w-full md:w-1/2 text-center md:text-left space-y-4 md:space-y-6 px-2 md:px-0">
                    <div className="relative inline-block md:block">
                        <Quote className="w-8 h-8 md:w-10 md:h-10 text-gray-200 absolute -top-4 -left-4 md:-top-6 md:-left-4 -z-10 transform -scale-x-100" />
                        <p className="text-lg sm:text-xl md:text-2xl text-gray-600 font-serif italic leading-relaxed">
                            "{testimonial.quote}"
                        </p>
                    </div>
                    
                    <div>
                        <h4 className="text-base sm:text-lg md:text-xl font-medium text-gray-800">{testimonial.author}</h4>
                        <p className="text-gray-400 text-sm md:text-base">{testimonial.location}</p>
                    </div>
                </div>

                {/* Right Side: Image */}
                <div className="w-full md:w-1/2 flex justify-center md:justify-end relative mt-2 md:mt-0">
                    {/* The Image Card */}
                    <div className="bg-white p-2 shadow-xl transform rotate-2 transition-transform duration-500 hover:rotate-0">
                        <img 
                            src={testimonial.avatar} 
                            alt={testimonial.author} 
                            className="w-full h-auto object-cover filter brightness-105 aspect-[4/3] md:w-[350px] md:h-[220px]"
                        />
                    </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Controls */}
          <div className="flex flex-col items-center justify-center mt-2 md:mt-4 relative z-20">
             
             {/* Pagination Dots */}
             <div className="flex gap-3 mb-6">
                {testimonialsData.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`rounded-full transition-all duration-300 ${
                            idx === currentIndex ? 'bg-gray-800 w-6 h-2 md:w-4 md:h-3' : 'bg-gray-300 w-2 h-2 md:w-3 md:h-3 hover:bg-gray-400'
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
             </div>
             
          </div>

        </div>
      </div>
    </section>
  );
};

export default Testimonials;

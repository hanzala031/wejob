
import React, { useState } from 'react';
import { Minus, Plus } from 'lucide-react';

const faqData = [
  {
    question: 'How do I get started as a freelancer?',
    answer: 'Sign up, complete your profile, and start browsing projects. Submit proposals and communicate with clients to get hired.'
  },
  {
    question: 'What kind of projects can I find?',
    answer: 'Our marketplace offers a variety of projects across industries like writing, design, programming, marketing, and more.'
  },
  {
    question: 'How do I ensure payment security?',
    answer: 'Use our secure payment system. Funds are held in escrow until you complete the project and both parties are satisfied.'
  },
  {
    question: 'What fees are involved for freelancers?',
    answer: 'We charge a service fee on completed projects, typically a percentage of the projects total value. Check our fee structure for details..'
  },
  {
    question: 'How can I build trust with clients?',
    answer: 'Maintain clear communication, deliver high-quality work on time, and ask for reviews. A strong portfolio also helps showcase your skills.'
  }
];

const FaqSection: React.FC = () => {
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  return (
    <section className="bg-white py-12 md:py-20 lg:py-24">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-800 mb-3 md:mb-4">Frequently Asked Questions</h2>
            <p className="text-sm md:text-base text-gray-600 max-w-xl mx-auto px-2">Find answers to your questions instantly. Need more guidance? Dive into our extensive documentation.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-start">
          {/* Left Column - Image & Button */}
          <div className="flex flex-col items-center lg:items-start relative">
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-gray-100 max-w-full mx-auto lg:mx-0">
                <img 
                  src="https://res.cloudinary.com/dxvkigop9/image/upload/v1764655593/Gemini_Generated_Image_mmey4dmmey4dmmey_e5deri.png" 
                  alt="FAQ Support Team" 
                  className="w-full h-64 md:h-[350px] object-cover"
                />
                <div className="absolute inset-0 bg-blue-600/10 pointer-events-none"></div>
            </div>
            
            <button className="mt-8 bg-[#2563eb] text-white font-bold py-4 px-10 rounded-xl shadow-lg shadow-blue-500/20 hover:bg-[#1d4ed8] active:scale-95 transition-all text-base md:text-lg w-full xs:w-auto">
                Contact Our Team
            </button>

            {/* Decorative Elements */}
            <div className="absolute -z-10 top-10 left-10 w-32 h-32 md:w-40 md:h-40 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute -z-10 bottom-10 right-10 w-32 h-32 md:w-40 md:h-40 bg-purple-100 rounded-full blur-3xl opacity-50"></div>
          </div>

          {/* Right Column - Accordion */}
          <div className="space-y-3 md:space-y-4 w-full">
            {faqData.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <button
                  onClick={() => toggleAccordion(index)}
                  className={`w-full flex justify-between items-center text-left p-4 md:p-5 gap-3 transition-colors ${openAccordion === index ? 'bg-gray-50' : 'bg-white hover:bg-gray-50'}`}
                  aria-expanded={openAccordion === index}
                >
                  <span className={`font-semibold text-sm md:text-base lg:text-lg leading-snug ${openAccordion === index ? 'text-[#2563eb]' : 'text-gray-900'}`}>{faq.question}</span>
                  <div className={`w-5 h-5 md:w-6 md:h-6 flex-shrink-0 flex items-center justify-center rounded-full transition-colors ${openAccordion === index ? 'bg-[#2563eb] text-white' : 'bg-gray-100 text-gray-500'}`}>
                    {openAccordion === index ? (
                       <Minus className="w-3 h-3 md:w-4 md:h-4" />
                    ) : (
                      <Plus className="w-3 h-3 md:w-4 md:h-4" />
                    )}
                  </div>
                </button>
                <div
                  className={`transition-all duration-300 ease-in-out ${openAccordion === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <div className="text-gray-600 px-4 md:px-5 pb-4 md:pb-5 pt-1 text-xs md:text-sm lg:text-base leading-relaxed border-t border-gray-100">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;

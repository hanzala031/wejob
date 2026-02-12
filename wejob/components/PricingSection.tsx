
import React, { useState } from 'react';
import PricingCard from './PricingCard';
import PurchaseModal from './PurchaseModal';

const freelancerPlans = [
  {
    name: 'Standard Plan',
    description: 'Budget-friendly and user-friendly, ideal for individuals and small businesses seeking essential features for online presence.',
    price: 11,
    isPopular: false,
    features: [
      { name: 'Package duration', value: '1 Month' },
      { name: 'Number of task to post', value: '5 tasks' },
      { name: 'Featured task', value: '2 Allowed' },
      { name: 'Task plans allowed', value: false },
      { name: 'Credits to apply on projects', value: '10 credits' },
      { name: 'Featured task duration', value: '5 days' },
    ],
  },
  {
    name: 'Economy Plan',
    description: 'Tailored for growth the Professional Package offers advanced features, scalability, and priority support 24/7.',
    price: 55,
    isPopular: true,
    features: [
      { name: 'Package duration', value: '3 Month' },
      { name: 'Number of task to post', value: '10 tasks' },
      { name: 'Featured task', value: '2 Allowed' },
      { name: 'Task plans allowed', value: true },
      { name: 'Credits to apply on projects', value: '55 credits' },
      { name: 'Featured task duration', value: '10 days' },
    ],
  },
  {
    name: 'Extended Plan',
    description: 'Ultimate for large organizations, offering cutting-edge tech, dedicated support, and advanced security features.',
    price: 100,
    isPopular: false,
    features: [
      { name: 'Package duration', value: '1 Year' },
      { name: 'Number of task to post', value: '50 tasks' },
      { name: 'Featured task', value: '20 Allowed' },
      { name: 'Task plans allowed', value: true },
      { name: 'Credits to apply on projects', value: '98 credits' },
      { name: 'Featured task duration', value: '20 days' },
    ],
  },
];

const employerPlans = [
  {
    name: 'Standard Plan',
    description: 'Budget-friendly and user-friendly, ideal for individuals and small businesses seeking essential features for online presence.',
    price: 49,
    isPopular: false,
    features: [
      { name: 'Package duration', value: '30 Day' },
      { name: 'Number of projects', value: '5 Projects' },
      { name: 'Featured projects', value: '2 Allowed' },
      { name: 'Featured projects duration', value: '10 day(s)' },
    ],
  },
  {
    name: 'Economy Plan',
    description: 'Tailored for growth the Professional Package offers advanced features, scalability, and priority support 24/7.',
    price: 99,
    isPopular: true,
    features: [
      { name: 'Package duration', value: '6 Month' },
      { name: 'Number of projects', value: '10 Projects' },
      { name: 'Featured projects', value: '3 Allowed' },
      { name: 'Featured projects duration', value: '20 day(s)' },
    ],
  },
  {
    name: 'Extended Plan',
    description: 'Ultimate for large organizations, offering cutting-edge tech, dedicated support, and advanced security features.',
    price: 199,
    isPopular: false,
    features: [
      { name: 'Package duration', value: '1 Year' },
      { name: 'Number of projects', value: '20 Projects' },
      { name: 'Featured projects', value: '5 Allowed' },
      { name: 'Featured projects duration', value: '30 day(s)' },
    ],
  },
];


const PricingSection: React.FC = () => {
    const [planType, setPlanType] = useState<'freelancer' | 'employer'>('freelancer');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<any>(null);
    const plans = planType === 'freelancer' ? freelancerPlans : employerPlans;

    const handleGetStartedClick = (plan: any) => {
        setSelectedPlan(plan);
        setIsModalOpen(true);
    };

  return (
    <>
      <section className="bg-gray-50 py-12 md:py-20 lg:py-24">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <p className="font-semibold text-blue-600 mb-2 text-sm md:text-base tracking-wide uppercase">Best Plans to Go With</p>
          <h2 className="text-3xl md:text-4xl lg:text-4xl font-semibold text-black mb-4 leading-tight">
            Tailored Packages for Every<br className="hidden md:block" /> Business Stage and Size
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto mb-8 md:mb-12 text-sm md:text-base px-4">
            Enter a realm of limitless possibilities, where extraordinary talent thrives and beckons you to unfold your boundless potential.
          </p>

          <div className="flex justify-center items-center gap-3 md:gap-4 mb-8 md:mb-12">
              <span className="text-sm text-gray-600 hidden sm:inline">Explore best packages for</span>
              <div className="bg-slate-200 p-1 rounded-lg flex items-center">
                  <button 
                      onClick={() => setPlanType('freelancer')}
                      className={`px-4 md:px-6 py-2 rounded-md text-xs md:text-sm font-semibold transition-all duration-200 ${planType === 'freelancer' ? 'bg-white text-[#2563eb] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                      Freelancer
                  </button>
                  <button 
                      onClick={() => setPlanType('employer')}
                      className={`px-4 md:px-6 py-2 rounded-md text-xs md:text-sm font-semibold transition-all duration-200 ${planType === 'employer' ? 'bg-white text-[#2563eb] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                      Employer
                  </button>
              </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto items-center">
            {plans.map((plan, index) => (
              <PricingCard key={index} plan={plan} onGetStartedClick={() => handleGetStartedClick(plan)} />
            ))}
          </div>
          
          <p className="text-xs text-gray-500 mt-10 md:mt-12 max-w-lg mx-auto px-4">
            *Pros who post over 4 jobs per month get 10x more views on average than non-payers
          </p>

        </div>
      </section>
      <PurchaseModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        planName={selectedPlan?.name}
        planId={selectedPlan?.name?.toLowerCase().replace(/\s+/g, '_')}
      />
    </>
  );
};

export default PricingSection;

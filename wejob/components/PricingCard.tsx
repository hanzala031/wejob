
import React from 'react';
import { Check } from 'lucide-react';

interface Feature {
  name: string;
  value: string | boolean;
}

interface Plan {
  name: string;
  description: string;
  price: number;
  isPopular: boolean;
  features: Feature[];
}

interface PricingCardProps {
  plan: Plan;
  onGetStartedClick: (plan: Plan) => void;
}

const PricingCard: React.FC<PricingCardProps> = ({ plan, onGetStartedClick }) => {
  const cardClasses = `bg-white rounded-xl p-6 md:p-8 flex flex-col transition-all duration-300 relative text-left h-full ${
    plan.isPopular 
      ? 'border-2 border-[#2563eb] shadow-xl lg:shadow-2xl lg:scale-105 z-10' 
      : 'border border-gray-200 shadow-md lg:shadow-lg hover:border-blue-200'
  }`;

  const buttonClasses = `w-full py-3 mt-auto font-semibold rounded-lg transition-all duration-300 text-sm md:text-base ${
    plan.isPopular 
      ? 'bg-[#2563eb] hover:bg-[#1d4ed8] text-white shadow-lg shadow-blue-200' 
      : 'bg-slate-100 text-[#2563eb] hover:bg-[#2563eb] hover:text-white'
  }`;

  return (
    <div className={cardClasses}>
      {plan.isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#2563eb] text-white text-xs font-bold px-4 py-1 rounded-full shadow-md whitespace-nowrap">
          Most Popular
        </div>
      )}
      <h3 className="text-lg md:text-xl font-bold text-gray-800">{plan.name}</h3>
      <p className="text-xs md:text-sm text-gray-500 mt-2 mb-6 min-h-[3rem]">{plan.description}</p>
      
      <div className="mb-6">
        <span className="text-4xl md:text-5xl font-bold text-gray-900">${plan.price}</span>
        <span className="text-xs md:text-sm text-gray-500 ml-1">incl all taxes</span>
      </div>

      <div className="mb-8 flex-grow">
        <p className="font-semibold text-gray-700 mb-4 text-sm md:text-base">It includes</p>
        <ul className="space-y-3 text-xs md:text-sm">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex justify-between items-center text-gray-600">
              <span>{feature.name}</span>
              {typeof feature.value === 'boolean' && feature.value === true ? (
                <Check className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
              ) : (
                <span className="font-medium text-gray-800">{feature.value || '-'}</span>
              )}
            </li>
          ))}
        </ul>
      </div>

      <button onClick={() => onGetStartedClick(plan)} className={buttonClasses}>Get Started</button>
    </div>
  );
};

export default PricingCard;

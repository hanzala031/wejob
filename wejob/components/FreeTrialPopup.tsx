
import React, { useState } from 'react';
import { X } from 'lucide-react';

interface FreeTrialPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const FreeTrialPopup: React.FC<FreeTrialPopupProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);

  if (!isOpen) return null;

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 4) {
        setStep(step + 1);
    } else {
        // Handle final submission here
        console.log("Form submitted");
        onClose();
    }
  };

  const handlePrev = () => {
    if (step > 1) {
        setStep(step - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-300">
        <style>{`
            .no-scrollbar::-webkit-scrollbar {
                display: none;
            }
            .no-scrollbar {
                -ms-overflow-style: none;
                scrollbar-width: none;
            }
        `}</style>
      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
        
        {/* Close Button - Sticky or absolute within relative container */}
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 p-1.5 bg-white/80 rounded-full text-gray-400 hover:text-gray-600 transition-colors hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-5 sm:p-6 md:p-8 no-scrollbar">
            {/* Header */}
            <div className="mb-6 text-center sm:text-left mt-2 sm:mt-0">
            <h2 className="text-xl sm:text-2xl font-bold text-[#2563eb] mb-2 leading-tight">
                Free 1-Week Trial, No Credit Card Needed!
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
                Get expert web development, design, and social media marketing—completely free for one week! No contracts, no strings attached!
            </p>
            </div>

            {/* Stepper */}
            <div className="flex items-center justify-between mb-8 px-1">
            {/* Step 1 */}
            <div className="flex items-center flex-1">
                <div className={`w-8 h-8 rounded-full border-2 font-semibold flex items-center justify-center text-sm shrink-0 transition-colors ${step >= 1 ? 'border-[#2563eb] text-[#2563eb] bg-blue-50' : 'border-gray-300 text-gray-400'}`}>
                1
                </div>
                <div className={`h-[2px] flex-1 mx-2 transition-colors rounded-full ${step > 1 ? 'bg-[#2563eb]' : 'bg-gray-200'}`}></div>
            </div>
            
            {/* Step 2 */}
            <div className="flex items-center flex-1">
                <div className={`w-8 h-8 rounded-full border-2 font-semibold flex items-center justify-center text-sm shrink-0 transition-colors ${step >= 2 ? 'border-[#2563eb] text-[#2563eb] bg-blue-50' : 'border-gray-300 text-gray-400'}`}>
                2
                </div>
                <div className={`h-[2px] flex-1 mx-2 transition-colors rounded-full ${step > 2 ? 'bg-[#2563eb]' : 'bg-gray-200'}`}></div>
            </div>

            {/* Step 3 */}
            <div className="flex items-center flex-1">
                <div className={`w-8 h-8 rounded-full border-2 font-semibold flex items-center justify-center text-sm shrink-0 transition-colors ${step >= 3 ? 'border-[#2563eb] text-[#2563eb] bg-blue-50' : 'border-gray-300 text-gray-400'}`}>
                3
                </div>
                <div className={`h-[2px] flex-1 mx-2 transition-colors rounded-full ${step > 3 ? 'bg-[#2563eb]' : 'bg-gray-200'}`}></div>
            </div>

            {/* Step 4 */}
            <div>
                <div className={`w-8 h-8 rounded-full border-2 font-semibold flex items-center justify-center text-sm shrink-0 transition-colors ${step >= 4 ? 'border-[#2563eb] text-[#2563eb] bg-blue-50' : 'border-gray-300 text-gray-400'}`}>
                4
                </div>
            </div>
            </div>

            {/* Form */}
            <form className="space-y-4" onSubmit={handleNext}>
            {step === 1 && (
                <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                    <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-1.5">
                        Name <span className="text-red-500">*</span>
                        </label>
                        <input 
                        type="text" 
                        required
                        placeholder="Your Full Name" 
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base sm:text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent transition-all shadow-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-1.5">
                        Email <span className="text-red-500">*</span>
                        </label>
                        <input 
                        type="email" 
                        required
                        placeholder="you@example.com" 
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base sm:text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent transition-all shadow-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-1.5">
                        Phone <span className="text-red-500">*</span>
                        </label>
                        <input 
                        type="tel" 
                        required
                        placeholder="+1 (555) 000-0000" 
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base sm:text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent transition-all shadow-sm"
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold py-3.5 rounded-lg text-base shadow-lg shadow-blue-200 transition-all transform active:scale-[0.98] mt-2"
                    >
                        Next Step
                    </button>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                    <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-1.5">
                        Business Name <span className="text-red-500">*</span>
                        </label>
                        <input 
                        type="text" 
                        required
                        placeholder="Your Company Name" 
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base sm:text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent transition-all shadow-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-1.5">
                        Website URL
                        </label>
                        <input 
                        type="url" 
                        placeholder="https://www.example.com" 
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base sm:text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent transition-all shadow-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-1.5">
                        Social Media Handles
                        </label>
                        <textarea 
                        rows={3}
                        placeholder="@username or links to profiles" 
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base sm:text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent transition-all resize-none shadow-sm"
                        />
                    </div>

                    <div className="flex gap-3 mt-4">
                        <button 
                            type="button" 
                            onClick={handlePrev}
                            className="w-1/2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3.5 rounded-lg text-base transition-all transform active:scale-[0.98]"
                        >
                            Back
                        </button>
                        <button 
                            type="submit" 
                            className="w-1/2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold py-3.5 rounded-lg text-base shadow-lg shadow-blue-200 transition-all transform active:scale-[0.98]"
                        >
                            Next Step
                        </button>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">
                    <div>
                        <label className="block text-gray-800 text-sm font-bold mb-3">
                            Which services are you interested in?
                        </label>
                        <div className="flex flex-col gap-3">
                            {['Web Development', 'Graphic Design', 'Social Media Marketing'].map((service) => (
                                <label key={service} className="relative flex items-center p-3 sm:p-4 rounded-lg border border-gray-200 cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-all">
                                    <input 
                                        type="checkbox" 
                                        className="h-5 w-5 text-[#2563eb] border-gray-300 rounded focus:ring-[#2563eb]" 
                                    />
                                    <span className="ml-3 text-gray-700 text-sm font-medium">{service}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-800 text-sm font-bold mb-2">
                            What are your goals with Weversity?
                        </label>
                        <textarea 
                            rows={5}
                            placeholder="Tell us about your project goals..."
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base sm:text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent transition-all resize-none shadow-sm"
                        />
                    </div>

                    <div className="flex gap-3 mt-4">
                        <button 
                            type="button" 
                            onClick={handlePrev}
                            className="w-1/2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3.5 rounded-lg text-base transition-all transform active:scale-[0.98]"
                        >
                            Back
                        </button>
                        <button 
                            type="submit" 
                            className="w-1/2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold py-3.5 rounded-lg text-base shadow-lg shadow-blue-200 transition-all transform active:scale-[0.98]"
                        >
                            Next Step
                        </button>
                    </div>
                </div>
            )}

            {step === 4 && (
                <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">
                    <div>
                        <label className="block text-gray-800 text-sm font-bold mb-3">
                            How would you like to be contacted?
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {['Email', 'Phone Call', 'WhatsApp'].map((method) => (
                                <label key={method} className="relative flex items-center justify-start p-3 sm:p-4 rounded-lg border border-gray-200 cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-all">
                                    <input 
                                        type="checkbox" 
                                        className="h-5 w-5 text-[#2563eb] border-gray-300 rounded focus:ring-[#2563eb]" 
                                    />
                                    <span className="ml-3 text-gray-700 text-sm font-medium">{method}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-800 text-sm font-bold mb-2">
                            Best time to contact
                        </label>
                        <textarea 
                            rows={3}
                            placeholder="e.g. Weekdays after 2 PM"
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base sm:text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent transition-all resize-none shadow-sm"
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 mt-4">
                        <button 
                            type="button" 
                            onClick={handlePrev}
                            className="w-full sm:w-1/3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3.5 rounded-lg text-base transition-all transform active:scale-[0.98]"
                        >
                            Back
                        </button>
                        <button 
                            type="submit" 
                            className="w-full sm:w-2/3 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold py-3.5 rounded-lg text-base shadow-lg shadow-blue-200 transition-all transform active:scale-[0.98]"
                        >
                            Sign Up for 1-Week Free Trial
                        </button>
                    </div>
                </div>
            )}
            </form>
        </div>
      </div>
    </div>
  );
};

export default FreeTrialPopup;
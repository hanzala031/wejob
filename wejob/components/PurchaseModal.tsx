
import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { supabase } from '../supabase';
import { useUser } from '../context/UserContext';
import toast from 'react-hot-toast';

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName?: string;
  planId?: string;
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({ isOpen, onClose, planName = 'Premium Plan', planId = 'pro_business' }) => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleUpgrade = async () => {
    if (!user) {
      toast.error("Please login to purchase a plan");
      return;
    }

    try {
      setLoading(true);
      // 1. Supabase Edge Function ko call karein jo Stripe checkout link banaye
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { plan: planId, userId: user.id }
      });

      if (error) throw error;

      // 2. User ko Stripe ke safe page par redirect kar dein
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err: any) {
      console.error("Stripe Checkout Error:", err);
      toast.error(err.message || "Failed to initiate checkout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 relative text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close modal"
          disabled={loading}
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="mx-auto w-16 h-16 flex items-center justify-center bg-blue-50 rounded-full mb-5">
          <X className="w-8 h-8 text-blue-500" />
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-2">Purchase {planName}?</h2>
        <p className="text-gray-600 mb-8">
          You will be redirected to our secure checkout page powered by Stripe.
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="bg-[#2563eb] text-white font-semibold px-10 py-3 rounded-lg hover:bg-[#1d4ed8] transition-all shadow-lg shadow-blue-200 flex items-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            YES
          </button>
          <button
            onClick={onClose}
            disabled={loading}
            className="bg-gray-200 text-gray-800 font-semibold px-10 py-3 rounded-lg hover:bg-gray-300 transition-colors"
          >
            NO
          </button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseModal;

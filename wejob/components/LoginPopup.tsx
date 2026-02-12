
import React from 'react';
import { X } from 'lucide-react';

interface LoginPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginPopup: React.FC<LoginPopupProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm relative overflow-hidden animate-in zoom-in-95 duration-300 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex gap-4 items-start">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <X className="w-6 h-6 text-red-500" />
          </div>
          <div className="pt-1">
            <h3 className="text-xl font-bold text-gray-900 mb-1">Oops!</h3>
            <p className="text-gray-600 text-sm leading-relaxed font-medium">
              You must be logged in to perform this action.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPopup;


import React from 'react';
import { X } from 'lucide-react';

interface LoginEmployerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginEmployerModal: React.FC<LoginEmployerModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="flex items-start gap-5">
          <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-blue-100 rounded-full">
            <X className="w-7 h-7 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Login as employer</h2>
            <p className="mt-2 text-gray-600">
              You must login as a employer to send a message to this freelancer.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginEmployerModal;

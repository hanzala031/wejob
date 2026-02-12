import React, { useEffect } from 'react';
import { X, ShieldAlert } from 'lucide-react';

interface NotificationProps {
  message: string;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);

  return (
    <div
      className="fixed top-5 right-5 z-50 bg-white rounded-lg shadow-lg flex items-stretch overflow-hidden"
      role="alert"
    >
      <div className="bg-red-600 p-4 flex items-center justify-center">
        <ShieldAlert className="w-6 h-6 text-white" />
      </div>
      <div className="py-3 px-5 flex items-center gap-4">
        <p className="text-md font-medium text-gray-800">{message}</p>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Close notification">
            <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Notification;

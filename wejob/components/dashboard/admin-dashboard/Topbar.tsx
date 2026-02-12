
import React from 'react';
import { Menu } from 'lucide-react';

interface TopbarProps {
  onMenuClick: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ onMenuClick }) => {
  return (
    <header className="sticky top-0 z-40 flex w-full bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
      <div className="flex flex-grow items-center justify-between py-4 px-6 md:px-8 2xl:px-11">
        
        {/* Left Section: Mobile Toggle */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 text-gray-600 hover:bg-gray-50 rounded-xl transition-all active:scale-95"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Right Section: Empty (or logic if needed later) */}
        <div className="flex items-center gap-3 md:gap-6">
        </div>
      </div>
    </header>
  );
};

export default Topbar;

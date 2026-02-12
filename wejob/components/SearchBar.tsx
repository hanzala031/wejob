
import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check, Users, Briefcase, Building2 } from 'lucide-react';

const SearchBar: React.FC = () => {
  const [category, setCategory] = useState('Freelancers');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const categories = [
    { name: 'Freelancers', icon: <Users size={16} /> },
    { name: 'Jobs', icon: <Briefcase size={16} /> },
    { name: 'Companies', icon: <Building2 size={16} /> }
  ];

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex w-full max-w-2xl mx-auto lg:mx-0 rounded-lg shadow-2xl overflow-hidden border border-white/10 transition-all duration-500">
      <div className="relative flex-grow bg-[#1e293b]/80 backdrop-blur-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder={`Search for ${category.toLowerCase()}...`}
          className="w-full pl-12 pr-4 py-3 md:py-3.5 text-sm md:text-base text-white placeholder-gray-500 bg-transparent focus:outline-none font-medium"
        />
      </div>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between px-4 md:px-6 py-3 md:py-3.5 text-gray-800 bg-white hover:bg-gray-100 h-full transition-all font-bold min-w-[140px] md:min-w-[180px] border-l border-gray-100"
        >
          <div className="flex items-center gap-2">
            <span className="text-blue-600">
              {categories.find(c => c.name === category)?.icon}
            </span>
            <span className="text-xs md:text-sm truncate uppercase tracking-widest">{category}</span>
          </div>
          <ChevronDown className={`w-4 h-4 md:w-5 md:h-5 ml-2 transition-transform duration-300 text-gray-400 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Premium Dropdown with Pointer */}
        <div 
          className={`absolute top-full right-0 mt-3 w-52 md:w-60 bg-white border border-gray-100 rounded-lg shadow-[0_25px_60px_rgba(0,0,0,0.18)] z-50 transition-all duration-300 ease-in-out ${
            isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
          }`}
        >
            {/* Pointer Arrow */}
            <div className="absolute -top-2 right-12 w-4 h-4 bg-white rotate-45 border-l border-t border-gray-100"></div>
            
            <div className="p-2 relative bg-white rounded-lg">
              {categories.filter(cat => cat.name !== category).map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => handleCategoryChange(cat.name)}
                  className="group flex items-center gap-4 w-full px-4 py-4 rounded-md text-sm md:text-base text-gray-600 hover:bg-[#2563eb] hover:text-white transition-all duration-300"
                >
                  <span className="text-gray-400 group-hover:text-white transition-colors">
                    {cat.icon}
                  </span>
                  <span className="font-black tracking-wide uppercase text-xs md:text-sm">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>
      </div>
      <button className="px-6 md:px-10 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold transition-all active:scale-95 flex items-center justify-center">
        <Search className="w-5 h-5" />
      </button>
    </div>
  );
};

export default SearchBar;

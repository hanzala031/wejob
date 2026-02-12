import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useUser } from '../../../context/UserContext';
import { supabase } from '../../../supabase';

const ProfileDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { profile, user: authUser } = useUser();

  const userName = profile?.full_name || (profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : 'Employer');
  const userAvatar = profile?.avatar_url || 'https://res.cloudinary.com/dxvkigop9/image/upload/v1763013353/awad-3-1-150x150_yed2gk.jpg';
  const userEmail = authUser?.email || '';

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/signin');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 hover:bg-gray-50 p-1.5 rounded-lg transition-colors focus:outline-none"
      >
        <img 
          src={userAvatar} 
          alt={userName} 
          className="w-9 h-9 rounded-full object-cover border border-gray-200"
        />
        <div className="hidden sm:block text-left">
          <p className="text-sm font-semibold text-gray-800 leading-none">{userName}</p>
          <p className="text-xs text-gray-500 mt-1">Employer</p>
        </div>
        <ChevronDown size={16} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''} hidden sm:block`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
          <div className="px-4 py-3 border-b border-gray-100 mb-2">
            <p className="text-sm font-semibold text-gray-900">{userName}</p>
            {userEmail && <p className="text-xs text-gray-500 truncate">{userEmail}</p>}
          </div>
          
          <NavLink 
            to="/employer/dashboard/profile"
            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600"
            onClick={() => setIsOpen(false)}
          >
            <User size={16} />
            Profile
          </NavLink>
          <NavLink 
            to="/employer/dashboard/settings"
            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600"
            onClick={() => setIsOpen(false)}
          >
            <Settings size={16} />
            Settings
          </NavLink>
          
          <div className="border-t border-gray-100 my-1"></div>
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;

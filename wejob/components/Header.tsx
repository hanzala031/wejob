import React, { useState, useEffect, useRef } from 'react';
import { Globe, ChevronDown, Menu, X, Command, LogOut, User as UserIcon } from 'lucide-react';
import { supabase } from '../supabase';
import { useUser } from '../context/UserContext';

interface HeaderProps {
  onNavigate: (page: string) => void;
  onPostProjectClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, onPostProjectClick }) => {
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { profile, user, loading } = useUser();

  const languageDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target as Node)) {
        setIsLanguageOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onNavigate('home');
    setIsMobileMenuOpen(false);
  };

  const handleDashboardClick = () => {
    if (user) {
      if (profile) {
        if (profile.role === 'employer') {
          onNavigate('dashboard');
        } else if (profile.role === 'freelancer') {
          onNavigate('freelancer-dashboard');
        } else {
          onNavigate('home');
        }
      } else {
        // User logged in but no profile record yet
        onNavigate('role-selection');
      }
    }
    setIsMobileMenuOpen(false);
  };

  const renderAuthButtons = (isMobile: boolean = false) => {
    if (loading) {
        return <div className="w-24 h-8 bg-white/10 animate-pulse rounded-lg"></div>;
    }

    if (user) {
      return (
        <div className={`flex ${isMobile ? 'flex-col' : 'items-center'} gap-4`}>
          <button onClick={handleDashboardClick} className={`flex items-center gap-3 group ${isMobile ? 'w-full bg-white/5 p-3 rounded-xl' : ''}`}>
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="Profile" className="w-10 h-10 rounded-full object-cover border border-white/20 group-hover:border-white/40 transition-colors" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20 group-hover:border-white/40 transition-colors">
                <UserIcon className="w-5 h-5 text-white" />
              </div>
            )}
            <div className="text-left">
              <span className="text-white font-bold block">
                {profile?.full_name || user.user_metadata?.full_name || 'Dashboard'}
              </span>
              {isMobile && <span className="text-xs text-gray-400">View your dashboard</span>}
            </div>
          </button>
          <button onClick={handleLogout} className={`${isMobile ? 'w-full justify-center' : ''} bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white font-bold px-6 py-3 rounded-xl transition-all flex items-center gap-2`}>
            <LogOut className="w-5 h-5" /> <span>Logout</span>
          </button>
        </div>
      );
    }
    return (
      <div className={`flex ${isMobile ? 'flex-col' : 'items-center'} gap-4`}>
        <button onClick={() => { onNavigate('signin'); setIsMobileMenuOpen(false); }} className={`${isMobile ? 'w-full py-4 bg-white/5' : ''} text-white font-bold hover:text-blue-400 transition-colors rounded-xl`}>Sign In</button>
        <button onClick={() => { onNavigate('signup'); setIsMobileMenuOpen(false); }} className={`${isMobile ? 'w-full py-4' : ''} bg-white text-black font-semibold py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors shadow-lg`}>Join Now</button>
      </div>
    );
  };

  return (
    <header className="py-4 sticky top-0 z-50 bg-[#1C357B] border-b border-white/10 backdrop-blur-md">
      <div className="container mx-auto">
        <div className="flex justify-between items-center px-4">
          <div className="flex items-center gap-8">
            <button onClick={() => onNavigate('home')} className="flex items-center gap-2">
              <Command className="h-8 w-8 text-[#2563eb]" />
              <span className="text-2xl font-bold tracking-tight text-white uppercase">We<span className="text-[#2563eb]">Job</span></span>
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-6">
            <div className="relative" ref={languageDropdownRef}>
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full text-gray-300 hover:text-white transition-colors"
              >
                <Globe className="w-5 h-5" />
              </button>
              {isLanguageOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#0f172a] border border-white/10 backdrop-blur-lg rounded-xl shadow-2xl py-2 z-50 overflow-hidden">
                  <button onClick={() => setIsLanguageOpen(false)} className="w-full text-left px-4 py-3 text-sm text-gray-200 hover:bg-white/10 transition-colors">English</button>
                  <button onClick={() => setIsLanguageOpen(false)} className="w-full text-left px-4 py-3 text-sm text-gray-200 hover:bg-white/10 transition-colors">Spanish</button>
                </div>
              )}
            </div>
            {renderAuthButtons()}
            <button
              onClick={() => {
                if (user && profile) {
                  if (profile.role === 'employer') {
                    onNavigate('dashboard/jobs/create');
                  } else {
                    onPostProjectClick();
                  }
                } else {
                  onNavigate('signin');
                }
              }}
              className="bg-[#2563eb] text-white font-bold px-8 py-3 rounded-xl hover:bg-[#1d4ed8] hover:shadow-lg hover:shadow-blue-500/20 transition-all whitespace-nowrap"
            >
              Post A Project
            </button>
          </div>

          <div className="lg:hidden flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-white bg-white/10 rounded-lg">
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-x-0 top-[73px] bg-[#1C357B] border-b border-white/10 p-6 shadow-2xl animate-in slide-in-from-top duration-300">
            <div className="flex flex-col gap-6">
              {renderAuthButtons(true)}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (user && profile) {
                    if (profile.role === 'employer') {
                      onNavigate('dashboard/jobs/create');
                    } else {
                      onPostProjectClick();
                    }
                  } else {
                    onNavigate('signin');
                  }
                }}
                className="bg-[#2563eb] text-white font-bold px-6 py-4 rounded-xl hover:bg-[#1d4ed8] transition-colors whitespace-nowrap text-lg shadow-lg"
              >
                Post A Project
              </button>
              <div className="pt-4 border-t border-white/10">
                <button
                  onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                  className="w-full flex items-center justify-between text-left px-4 py-3 text-gray-200 bg-white/5 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-blue-400" />
                    <span className="font-medium">Language</span>
                  </div>
                  <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${isLanguageOpen ? 'rotate-180' : ''}`} />
                </button>
                {isLanguageOpen && (
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <button onClick={() => setIsLanguageOpen(false)} className="px-4 py-3 text-center text-sm text-gray-200 bg-white/10 rounded-lg">English</button>
                    <button onClick={() => setIsLanguageOpen(false)} className="px-4 py-3 text-center text-sm text-gray-200 bg-white/10 rounded-lg">Spanish</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

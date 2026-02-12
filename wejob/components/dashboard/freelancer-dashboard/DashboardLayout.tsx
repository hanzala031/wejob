import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const DashboardLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    const root = document.documentElement;
    const applyTheme = (currentTheme: string) => {
        if (currentTheme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    };

    // Apply initial
    applyTheme(theme);

    // Listen for changes from AccountSettings
    const handleThemeChange = () => {
        const newTheme = localStorage.getItem('theme') || 'light';
        setTheme(newTheme);
        applyTheme(newTheme);
    };

    window.addEventListener('theme-change', handleThemeChange);
    // Also listen for storage events (multi-tab support)
    window.addEventListener('storage', handleThemeChange);

    return () => {
        window.removeEventListener('theme-change', handleThemeChange);
        window.removeEventListener('storage', handleThemeChange);
    };
  }, [theme]);

  const [hideTopbar, setHideTopbar] = useState(false);

  useEffect(() => {
    // Listen for modal open/close events
    const handleModalToggle = (e: any) => {
      setHideTopbar(e.detail.isOpen);
    };

    window.addEventListener('toggle-modal', handleModalToggle);
    return () => window.removeEventListener('toggle-modal', handleModalToggle);
  }, []);

  return (
    <div className={`flex h-screen font-sans overflow-hidden transition-colors duration-300 ${theme === 'dark' ? 'bg-[#0f172a]' : 'bg-gray-50'}`}>
      {/* ... styles ... */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {!hideTopbar && (
          <Topbar 
            onMenuClick={() => setIsSidebarOpen(true)} 
          />
        )}
        
        <main className="flex-1 overflow-y-auto p-3 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

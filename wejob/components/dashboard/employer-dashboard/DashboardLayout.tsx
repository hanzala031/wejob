
import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { supabase } from '../../../supabase';
import { toast, Toaster } from 'react-hot-toast';

const DashboardLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    // Real-time listener for new proposals
    let channel: any;

    const setupListener = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch jobs owned by this employer to filter notifications
        const { data: myJobs } = await supabase
            .from('jobs')
            .select('id, title')
            .eq('employer_id', user.id);
        
        const myJobIds = myJobs?.map(j => j.id) || [];
        const jobMap = myJobs?.reduce((acc, j) => ({ ...acc, [j.id]: j.title }), {} as any) || {};

        channel = supabase
            .channel('new-proposals')
            .on('postgres_changes', { 
                event: 'INSERT', 
                schema: 'public', 
                table: 'proposals' 
            }, async (payload) => {
                const newProposal = payload.new;
                if (myJobIds.includes(newProposal.job_id)) {
                    // Show toast
                    toast.success(`New proposal received for: ${jobMap[newProposal.job_id] || 'your job'}`, {
                        duration: 5000,
                        position: 'top-right'
                    });

                    // Persist notification in DB if possible
                    await supabase.from('notifications').insert([{
                        user_id: user.id,
                        type: 'application',
                        title: 'New Proposal Received',
                        message: `A new freelancer has applied for "${jobMap[newProposal.job_id] || 'your job'}".`,
                        is_read: false
                    }]);
                }
            })
            .subscribe();
    };

    setupListener();

    return () => {
        if (channel) supabase.removeChannel(channel);
    };
  }, []);

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
    window.addEventListener('storage', handleThemeChange);

    return () => {
        window.removeEventListener('theme-change', handleThemeChange);
        window.removeEventListener('storage', handleThemeChange);
    };
  }, [theme]);

  return (
    <div className={`flex h-screen font-sans overflow-hidden transition-colors duration-300 ${theme === 'dark' ? 'bg-[#0f172a]' : 'bg-gray-50'}`}>
      {theme === 'dark' && (
        <style>{`
            :root {
                --bg-dark-900: #0f172a;
                --bg-dark-800: #1e293b;
                --bg-dark-700: #334155;
                --text-light-100: #f1f5f9;
                --text-light-200: #e2e8f0;
                --text-light-400: #94a3b8;
            }
            /* Global Overrides for Dark Mode */
            .dark body { background-color: var(--bg-dark-900) !important; color: var(--text-light-100) !important; }
            
            /* Backgrounds */
            .dark .bg-gray-50, .dark.bg-gray-50 { background-color: var(--bg-dark-900) !important; }
            .dark .bg-gray-100, .dark.bg-gray-100 { background-color: var(--bg-dark-700) !important; }
            .dark .bg-white, .dark.bg-white { background-color: var(--bg-dark-800) !important; color: var(--text-light-200) !important; }
            
            /* Text Colors */
            .dark .text-gray-900 { color: var(--text-light-100) !important; }
            .dark .text-gray-800 { color: var(--text-light-100) !important; }
            .dark .text-gray-700 { color: var(--text-light-200) !important; }
            .dark .text-gray-600 { color: var(--text-light-400) !important; }
            .dark .text-gray-500 { color: var(--text-light-400) !important; }
            
            /* Borders */
            .dark .border-gray-100 { border-color: var(--bg-dark-700) !important; }
            .dark .border-gray-200 { border-color: var(--bg-dark-700) !important; }
            .dark .border-gray-300 { border-color: var(--bg-dark-700) !important; }
            
            /* Inputs */
            .dark input, .dark select, .dark textarea { 
                background-color: var(--bg-dark-900) !important; 
                border-color: var(--bg-dark-700) !important; 
                color: var(--text-light-100) !important; 
            }
            .dark input::placeholder { color: var(--text-light-400) !important; }
            
            /* Hover States */
            .dark .hover\\:bg-gray-50:hover { background-color: var(--bg-dark-700) !important; }
            .dark .hover\\:bg-gray-100:hover { background-color: var(--bg-dark-700) !important; }
            .dark .hover\\:bg-blue-50:hover { background-color: rgba(59, 130, 246, 0.1) !important; }
            
            /* Shadows */
            .dark .shadow-sm, .dark .shadow-md { box-shadow: none !important; }
        `}</style>
      )}

      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Toaster />
        <Topbar 
          onMenuClick={() => setIsSidebarOpen(true)} 
        />
        
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

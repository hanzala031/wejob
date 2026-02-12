
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Send, Briefcase, User, Settings, LogOut, X, Heart, DollarSign, Bell, Command, CreditCard } from 'lucide-react';
import { supabase } from '../../../supabase';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({
    proposals: 0,
    savedJobs: 0,
    notifications: 0
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch counts individually to handle errors gracefully
        let proposalsCount = 0;
        let savedJobsCount = 0;
        let notificationsCount = 0;

        try {
            const { count, error } = await supabase.from('proposals').select('*', { count: 'exact', head: true }).eq('freelancer_id', user.id);
            if (!error) proposalsCount = count || 0;
        } catch (e) { console.warn('Proposals count error', e); }

        try {
            const { count, error } = await supabase.from('saved_jobs').select('*', { count: 'exact', head: true }).eq('user_id', user.id);
            if (!error) savedJobsCount = count || 0;
        } catch (e) { console.warn('Saved jobs count error', e); }

        try {
            const { count, error } = await supabase.from('notifications').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('is_read', false);
            if (error) console.warn('Notifications count warning:', error.message);
            else notificationsCount = count || 0;
        } catch (e) { console.warn('Notifications count error', e); }

        setCounts({
          proposals: proposalsCount,
          savedJobs: savedJobsCount,
          notifications: notificationsCount
        });
      } catch (err) {
        console.error('Error fetching sidebar counts:', err);
      }
    };

    fetchCounts();

    // Set up Realtime subscriptions
    const savedJobsChannel = supabase
      .channel('sidebar-counts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'saved_jobs' }, () => fetchCounts())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'proposals' }, () => fetchCounts())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, () => fetchCounts())
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR') {
          console.warn('Realtime Sidebar counts subscription failed.');
        }
      });

    return () => {
      supabase.removeChannel(savedJobsChannel);
    };
  }, []);

  const menuItems = [
    { id: 'dashboard', path: '/freelancer/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} />, end: true },
    { id: 'proposals', path: '/freelancer/dashboard/proposals', label: 'My Proposals', icon: <Send size={20} />, badge: counts.proposals },
    { id: 'active-jobs', path: '/freelancer/dashboard/projects', label: 'My Projects', icon: <Briefcase size={20} /> },
    { id: 'saved-jobs', path: '/freelancer/dashboard/saved', label: 'Saved Jobs', icon: <Heart size={20} />, badge: counts.savedJobs },
    { id: 'payouts', path: '/freelancer/dashboard/earnings', label: 'Earnings', icon: <DollarSign size={20} /> },
    { id: 'billing', path: '/freelancer/dashboard/billing', label: 'Billing & Payments', icon: <CreditCard size={20} /> },
    { id: 'notifications', path: '/freelancer/dashboard/notifications', label: 'Notifications', icon: <Bell size={20} />, badge: counts.notifications },
    { id: 'profile', path: '/freelancer/dashboard/profile', label: 'My Profile', icon: <User size={20} /> },
    { id: 'settings', path: '/freelancer/dashboard/settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed lg:static top-0 left-0 z-30 h-full w-64 bg-[#0f172a] text-white transition-transform duration-300 ease-in-out flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <Command className="h-8 w-8 text-[#2563eb]" />
            <span className="text-xl font-bold tracking-tight text-white">WE<span className="text-[#2563eb]">JOB</span></span>
          </div>
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 mt-6 px-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            setActiveTab ? (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); onClose(); }}
                className={`
                        w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium
                        ${activeTab === item.id
                    ? 'bg-[#2563eb] text-white shadow-md'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }
                    `}
              >
                {item.icon}
                <span className="flex-1">{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                    {item.badge}
                  </span>
                )}
              </button>
            ) : (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={onClose}
                className={({ isActive }) => `
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium
                    ${isActive
                    ? 'bg-[#2563eb] text-white shadow-md'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }
                `}
              >
                {item.icon}
                <span className="flex-1">{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="bg-[#2563eb] border border-white/20 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            )
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => navigate('/signin')}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors text-sm font-medium"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

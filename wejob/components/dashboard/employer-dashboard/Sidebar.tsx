
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Users, PlusCircle, User, Settings, LogOut, X, Bell, Command, CreditCard } from 'lucide-react';
import { supabase } from '../../../supabase';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({
    jobs: 0,
    applicants: 0,
    notifications: 0
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Total Jobs posted by employer
        const { count: jobsCount } = await supabase
          .from('jobs')
          .select('*', { count: 'exact', head: true })
          .eq('employer_id', user.id);

        // Total applicants (proposals on jobs posted by employer)
        let totalApplicants = 0;
        try {
          const { data: jobIdsData } = await supabase
            .from('jobs')
            .select('id')
            .eq('employer_id', user.id);
          
          if (jobIdsData && jobIdsData.length > 0) {
            const jobIds = jobIdsData.map(j => j.id);
            const { count, error: applicantError } = await supabase
              .from('proposals')
              .select('*', { count: 'exact', head: true })
              .in('job_id', jobIds);
            
            if (applicantError) console.warn('Sidebar applicants count fetch error:', applicantError.message);
            else totalApplicants = count || 0;
          }
        } catch (e) {
          console.warn('Error calculating applicants count:', e);
        }

        // Unread Notifications
        let notifCount = 0;
        try {
            const { count, error: notifErr } = await supabase
            .from('notifications')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('is_read', false);
            
            if (notifErr) {
              console.warn('Sidebar notification fetch warning:', notifErr.message);
              notifCount = 0;
            } else {
              notifCount = count || 0;
            }
        } catch (e) {
            console.warn('Sidebar notification fetch error:', e);
            notifCount = 0;
        }

        setCounts({
          jobs: jobsCount || 0,
          applicants: totalApplicants,
          notifications: notifCount
        });
      } catch (err) {
        console.error('Error fetching employer sidebar counts:', err);
      }
    };

    fetchCounts();
  }, []);

  const menuItems = [
    { path: '/employer/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} />, end: true },
    { path: '/employer/dashboard/jobs', label: 'Posted Jobs', icon: <Briefcase size={20} />, badge: counts.jobs },
    { path: '/employer/dashboard/jobs/create', label: 'Post a Job', icon: <PlusCircle size={20} /> },
    { path: '/employer/dashboard/applicants', label: 'Applicants', icon: <Users size={20} />, badge: counts.applicants },
    { path: '/employer/dashboard/notifications', label: 'Notifications', icon: <Bell size={20} />, badge: counts.notifications },
    { path: '/employer/dashboard/profile', label: 'Company Profile', icon: <User size={20} /> },
    { path: '/employer/dashboard/billing', label: 'Billing & Payments', icon: <CreditCard size={20} /> },
    { path: '/employer/dashboard/settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/signin');
  };

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
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
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

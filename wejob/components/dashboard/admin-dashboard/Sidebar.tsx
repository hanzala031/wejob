import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  DollarSign, 
  ShieldCheck, 
  FileText, 
  AlertTriangle, 
  Settings, 
  LogOut, 
  X,
  ChevronRight
} from 'lucide-react';
import { supabase } from '../../../supabase';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const menuGroups = [
    {
      title: 'MAIN MENU',
      items: [
        { path: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} />, end: true },
        { path: '/admin/dashboard/users', label: 'Users', icon: <Users size={20} /> },
        { path: '/admin/dashboard/jobs', label: 'Jobs', icon: <Briefcase size={20} /> },
        { path: '/admin/dashboard/verification', label: 'KYC & Verification', icon: <ShieldCheck size={20} /> },
      ]
    },
    {
      title: 'MANAGEMENT',
      items: [
        { path: '/admin/dashboard/payments', label: 'Finances', icon: <DollarSign size={20} /> },
        { path: '/admin/dashboard/cms', label: 'CMS', icon: <FileText size={20} /> },
      ]
    },
    {
      title: 'SUPPORT',
      items: [
        { path: '/admin/dashboard/reports', label: 'Logs', icon: <AlertTriangle size={20} /> },
        { path: '/admin/dashboard/settings', label: 'Settings', icon: <Settings size={20} /> },
      ]
    }
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/signin');
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity duration-300" onClick={onClose}></div>
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed lg:static top-0 left-0 z-50 h-screen w-72 bg-[#1c2434] transition-all duration-300 ease-in-out flex flex-col shadow-2xl lg:shadow-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-8 py-8">
          <NavLink to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#3c50e0] rounded-xl flex items-center justify-center shadow-lg shadow-[#3c50e0]/30 transform group-hover:rotate-12 transition-transform">
              <ShieldCheck className="text-white" size={24} />
            </div>
            <span className="text-2xl font-extrabold tracking-tight font-['Plus_Jakarta_Sans']">
              <span className="text-[#2563eb]">AD</span>
              <span className="text-white">MIN</span>
            </span>
          </NavLink>
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all">
            <X size={24} />
          </button>
        </div>

        {/* Sidebar Menu */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-4">
          <nav className="mt-4 space-y-8">
            {menuGroups.map((group, idx) => (
              <div key={idx}>
                <h3 className="px-4 mb-4 text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em]">
                  {group.title}
                </h3>
                <ul className="space-y-1">
                  {group.items.map((item) => (
                    <li key={item.path}>
                      <NavLink
                        to={item.path}
                        end={item.end}
                        onClick={() => {
                          if (window.innerWidth < 1024) onClose();
                        }}
                        className={({ isActive }) => `
                          group relative flex items-center gap-3.5 rounded-xl py-3 px-4 text-sm font-semibold transition-all duration-300
                          ${isActive 
                            ? 'bg-gradient-to-r from-[#3c50e0] to-[#5a6cf3] text-white shadow-lg shadow-[#3c50e0]/20 translate-x-1' 
                            : 'text-[#dee4ee] hover:bg-white/5 hover:text-white'
                          }
                        `}
                      >
                        <span className={`transition-transform duration-300 ${isOpen ? 'group-hover:scale-110' : ''}`}>
                          {item.icon}
                        </span>
                        <span className="flex-1">{item.label}</span>
                        <ChevronRight size={14} className={`opacity-0 transition-all duration-300 ${isOpen ? 'group-hover:opacity-40 group-hover:translate-x-1' : ''}`} />
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-6 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-300 text-sm font-bold group"
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

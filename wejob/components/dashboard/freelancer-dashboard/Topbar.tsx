import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search, Menu, MessageSquare, X, Check, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProfileDropdown from './ProfileDropdown';
import { supabase } from '../../../supabase';
import { useUser } from '../../../context/UserContext';

interface TopbarProps {
  onMenuClick: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ onMenuClick }) => {
  const [activeDropdown, setActiveDropdown] = useState<'messages' | 'notifications' | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        // Fetch Notifications
        try {
          const { data: notifData, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(10);

          if (error) {
             console.warn('Notifications fetch warning:', error.message);
          } else if (notifData) {
            const formattedNotifs = notifData.map(n => ({
              id: n.id,
              title: n.title,
              desc: n.message,
              time: new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              unread: !n.is_read,
              type: n.type || 'info'
            }));
            setNotifications(formattedNotifs);
          }
        } catch (e) {
             console.warn('Notifications fetch error:', e);
        }

        // Fetch Messages
        try {
          const { data: msgData, error: msgError } = await supabase
            .from('messages')
            .select('*')
            .eq('receiver_id', user.id)
            .order('created_at', { ascending: false })
            .limit(10);

          if (msgError) {
             console.warn('Messages fetch warning:', msgError.message);
          } else if (msgData) {
            const formattedMessages = msgData.map(m => ({
              id: m.id,
              sender: "User", // Placeholder as we need a join to get name
              sender_id: m.sender_id,
              avatar: "https://randomuser.me/api/portraits/lego/1.jpg", // Placeholder
              message: m.content,
              time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              unread: true, // Assuming new messages are unread for now
              job: "Project" 
            }));
            setMessages(formattedMessages);
          }
        } catch (e) {
             console.warn('Messages fetch error:', e);
        }
      }
    };
    fetchData();

    // Subscribe to new notifications
    const notifChannel = supabase
      .channel('public:notifications')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, payload => {
        if (user && payload.new.user_id === user.id) {
          setNotifications(prev => [
            {
              id: payload.new.id,
              title: payload.new.title,
              desc: payload.new.message,
              time: 'Just now',
              unread: true,
              type: payload.new.type || 'info'
            },
            ...prev.slice(0, 9)
          ]);
        }
      })
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR') {
          console.warn('Realtime Notifications subscription failed.');
        }
      });

    // Subscribe to new messages
    const msgChannel = supabase
      .channel('public:messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
        if (user && payload.new.receiver_id === user.id) {
            setMessages(prev => [
              {
                id: payload.new.id,
                sender: "User",
                sender_id: payload.new.sender_id,
                avatar: "https://randomuser.me/api/portraits/lego/1.jpg",
                message: payload.new.content,
                time: 'Just now',
                unread: true,
                job: "Project"
              },
              ...prev.slice(0, 9)
            ]);
        }
      })
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR') {
            console.warn('Realtime Messages subscription failed.');
        }
      });

    return () => {
      supabase.removeChannel(notifChannel);
      supabase.removeChannel(msgChannel);
    };
  }, [user]);

  // Keep mock messages for now as per user request focus on notifications table
  // const messages = [
  //   { id: 1, sender: "TechCorp Inc.", avatar: "https://randomuser.me/api/portraits/men/32.jpg", message: "We'd like to discuss your proposal for the website redesign.", time: "2h ago", unread: true, job: "E-commerce Website Redesign" },
  //   { id: 2, sender: "Sarah Jenkins", avatar: "https://randomuser.me/api/portraits/women/44.jpg", message: "The design looks great! Just one small tweak needed on the header.", time: "1h ago", unread: false },
  //   { id: 3, sender: "TechCorp HR", avatar: "https://randomuser.me/api/portraits/men/86.jpg", message: "We have reviewed your proposal and would like to proceed.", time: "3h ago", unread: false },
  // ];

  const toggleDropdown = (type: 'messages' | 'notifications') => {
    if (activeDropdown === type) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(type);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const hasUnreadMessages = messages.some(m => m.unread);
  const hasUnreadNotifications = notifications.some(n => n.unread);

  return (
    <header className="bg-white border-b border-gray-200 h-16 px-4 md:px-6 flex items-center justify-between sticky top-0 z-10 font-sans shadow-sm">
      {/* Left Side: Mobile Menu & Search */}
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
        >
          <Menu size={24} />
        </button>
        <div className="hidden sm:flex items-center bg-gray-50 hover:bg-gray-100 transition-colors rounded-full px-4 py-2 w-full max-w-[180px] md:max-w-md border border-gray-200 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100">
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent border-none outline-none text-sm ml-2 w-full text-gray-700 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Right Side: Actions & Profile */}
      <div className="flex items-center gap-2 sm:gap-4" ref={dropdownRef}>

        {/* Message Icon & Dropdown */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown('messages')}
            className={`relative p-2 rounded-full transition-all duration-200 focus:outline-none ${activeDropdown === 'messages'
              ? 'bg-blue-50 text-blue-600 ring-2 ring-blue-100'
              : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
              }`}
            aria-label="Messages"
          >
            <MessageSquare size={20} />
            {hasUnreadMessages && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            )}
          </button>

          {/* Messages Dropdown Panel */}
          {activeDropdown === 'messages' && (
            <div className="absolute right-0 sm:-right-10 md:right-0 mt-3 w-[calc(100vw-2rem)] sm:w-96 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
              <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-bold text-gray-800">Messages</h3>
                <button className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline">Mark all as read</button>
              </div>
              <div className="max-h-[24rem] overflow-y-auto custom-scrollbar">
                {messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    onClick={() => {
                      setActiveDropdown(null);
                      navigate(`/chat/${msg.sender_id}`);
                    }}
                    className="p-4 hover:bg-blue-50/50 cursor-pointer border-b border-gray-50 last:border-0 transition-colors flex gap-3 group"
                  >
                    <div className="relative flex-shrink-0">
                      <img src={msg.avatar} alt={msg.sender} className="w-10 h-10 rounded-full object-cover border border-gray-100" />
                      {msg.unread && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <h4 className={`text-sm truncate ${msg.unread ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>{msg.sender}</h4>
                        <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">{msg.time}</span>
                      </div>
                      <p className={`text-xs truncate ${msg.unread ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>{msg.message}</p>
                    </div>
                    {msg.unread && <div className="self-center w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>}
                  </div>
                ))}
              </div>
              <div className="p-3 text-center border-t border-gray-50 bg-gray-50/30">
                <button 
                  onClick={() => {
                    setActiveDropdown(null);
                  }}
                  className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors"
                >
                  View All Messages
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Notification Icon & Dropdown */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown('notifications')}
            className={`relative p-2 rounded-full transition-all duration-200 focus:outline-none ${activeDropdown === 'notifications'
              ? 'bg-blue-50 text-blue-600 ring-2 ring-blue-100'
              : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
              }`}
            aria-label="Notifications"
          >
            <Bell size={20} />
            {hasUnreadNotifications && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {activeDropdown === 'notifications' && (
            <div className="absolute right-[-50px] sm:right-0 mt-3 w-[calc(100vw-2rem)] sm:w-96 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
              <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-bold text-gray-800">Notifications</h3>
                <button className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline">Settings</button>
              </div>
              <div className="max-h-[24rem] overflow-y-auto custom-scrollbar">
                {notifications.map((notif) => (
                  <div key={notif.id} className={`p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0 transition-colors flex gap-4 ${notif.unread ? 'bg-blue-50/20' : ''}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border border-transparent ${notif.type === 'payment' ? 'bg-green-100 text-green-600' :
                      notif.type === 'success' ? 'bg-blue-100 text-blue-600' :
                        'bg-purple-100 text-purple-600'
                      }`}>
                      {notif.type === 'payment' ? <DollarSign size={18} /> :
                        notif.type === 'success' ? <Check size={18} /> : <Bell size={18} />}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className={`text-sm ${notif.unread ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>{notif.title}</h4>
                        <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">{notif.time}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">{notif.desc}</p>
                    </div>
                    {notif.unread && <div className="self-center w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>}
                  </div>
                ))}
              </div>
              <div className="p-3 text-center border-t border-gray-50 bg-gray-50/30">
                <button className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors">View All Notifications</button>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-gray-200 hidden sm:block mx-1"></div>

        {/* User Profile */}
        <ProfileDropdown />
      </div>
    </header>
  );
};

export default Topbar;

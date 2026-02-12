import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search, Menu, MessageSquare, X, Check, DollarSign, FileText, User, Loader2 } from 'lucide-react';
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
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);
      
      // 1. Fetch Real Notifications
      try {
        const { data: notifData, error: notifError } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(10); // increased limit for better UX
        
        if (notifError) {
             console.warn('Notifications fetch warning:', notifError.message);
             setNotifications([]);
        } else if (notifData) {
            setNotifications(notifData);
        }
      } catch (e) {
          console.warn('Notifications fetch error:', e);
          setNotifications([]);
      }

      // 2. Fetch Real Messages
      try {
        const { data: msgData, error: msgError } = await supabase
            .from('messages')
            .select('*, profiles:sender_id(full_name, avatar_url)')
            .eq('receiver_id', user.id)
            .order('created_at', { ascending: false })
            .limit(5);

        if (msgError) {
             console.warn('Messages fetch warning:', msgError.message);
             setMessages([]);
        } else if (msgData) {
            setMessages(msgData);
        }
      } catch (e) {
          console.warn('Messages fetch error:', e);
          setMessages([]);
      }

      setLoading(false);
    };

    fetchData();

    // 3. Real-time Subscriptions
    const notifChannel = supabase.channel('realtime_notifs')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` }, 
      payload => setNotifications(prev => [payload.new, ...prev].slice(0, 5)))
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR') {
          console.warn('Realtime Notifications subscription failed. Check if Realtime is enabled in Supabase dashboard.');
        }
      });

    const msgChannel = supabase.channel('realtime_msgs')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `receiver_id=eq.${user.id}` }, 
      async (payload) => {
        // Fetch sender details for the new message
        const { data: sender } = await supabase.from('profiles').select('full_name, avatar_url').eq('id', payload.new.sender_id).single();
        const fullMsg = { ...payload.new, profiles: sender };
        setMessages(prev => [fullMsg, ...prev].slice(0, 5));
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

  const toggleDropdown = (type: 'messages' | 'notifications') => {
    setActiveDropdown(activeDropdown === type ? null : type);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadMessagesCount = messages.filter(m => !m.is_read).length;
  const unreadNotifsCount = notifications.filter(n => !n.is_read).length;

  return (
    <header className="bg-white border-b border-gray-200 h-16 px-4 md:px-6 flex items-center justify-between sticky top-0 z-10 shadow-sm font-sans">
      <div className="flex items-center gap-4 flex-1">
        <button onClick={onMenuClick} className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"><Menu size={24} /></button>
        <div className="hidden sm:flex items-center bg-gray-50 hover:bg-gray-100 rounded-lg px-3 py-2 w-full max-w-[200px] md:max-w-sm border border-transparent focus-within:border-gray-300 transition-all">
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input type="text" placeholder="Search..." className="bg-transparent border-none outline-none text-sm ml-2 w-full text-gray-700" />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 md:gap-6" ref={dropdownRef}>
        {/* Messages */}
        <div className="relative">
          <button onClick={() => toggleDropdown('messages')} className={`relative p-2 rounded-full transition-all ${activeDropdown === 'messages' ? 'bg-blue-50 text-blue-600 ring-2 ring-blue-100' : 'text-gray-500 hover:bg-gray-100'}`}>
            <MessageSquare size={20} />
            {unreadMessagesCount > 0 && <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>}
          </button>

          {activeDropdown === 'messages' && (
            <div className="absolute right-0 mt-3 w-[calc(100vw-2rem)] sm:w-96 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
              <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-bold text-gray-800">Recent Messages</h3>
                <button className="text-xs font-medium text-blue-600 hover:underline">Mark all as read</button>
              </div>
              <div className="max-h-[24rem] overflow-y-auto">
                {messages.length === 0 ? (
                  <div className="p-10 text-center text-gray-400 text-sm">No new messages</div>
                ) : (
                  messages.map((msg) => (
                    <div 
                      key={msg.id} 
                      onClick={() => {
                        setActiveDropdown(null);
                        navigate(`/chat/${msg.sender_id}`);
                      }}
                      className="p-4 hover:bg-blue-50/30 cursor-pointer border-b border-gray-50 last:border-0 flex gap-3 group"
                    >
                      <div className="relative flex-shrink-0">
                        <img src={msg.profiles?.avatar_url || 'https://placehold.co/40'} className="w-10 h-10 rounded-full object-cover" alt="" />
                        {!msg.is_read && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <h4 className={`text-sm truncate ${!msg.is_read ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>{msg.profiles?.full_name}</h4>
                          <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">{new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                        <p className={`text-xs truncate ${!msg.is_read ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>{msg.content}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button onClick={() => toggleDropdown('notifications')} className={`relative p-2 rounded-full transition-all ${activeDropdown === 'notifications' ? 'bg-blue-50 text-blue-600 ring-2 ring-blue-100' : 'text-gray-500 hover:bg-gray-100'}`}>
            <Bell size={20} />
            {unreadNotifsCount > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>}
          </button>

          {activeDropdown === 'notifications' && (
            <div className="absolute right-[-50px] sm:right-0 mt-3 w-[calc(100vw-2rem)] sm:w-96 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
              <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-bold text-gray-800">Notifications</h3>
                <button className="text-xs font-medium text-blue-600 hover:underline">Clear all</button>
              </div>
              <div className="max-h-[24rem] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-10 text-center text-gray-400 text-sm">No new notifications</div>
                ) : (
                  notifications.map((notif) => (
                    <div key={notif.id} className="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0 flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0"><Bell size={18} /></div>
                      <div className="flex-1">
                        <h4 className={`text-sm ${!notif.is_read ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>{notif.title || 'System Notification'}</h4>
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">{notif.message}</p>
                        <span className="text-[10px] text-gray-400 mt-2 block">{new Date(notif.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>
        <ProfileDropdown />
      </div>
    </header>
  );
};

export default Topbar;

import React, { useState, useEffect } from 'react';
import { Bell, Briefcase, CheckCircle, Info, DollarSign, Trash2, Check } from 'lucide-react';
import { supabase } from '../../../../supabase';
import toast from 'react-hot-toast';

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !user.id) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotifications(data || []);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Set up Realtime Subscription
    const channel = supabase
      .channel('notifications_realtime')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'notifications' 
      }, () => {
        fetchNotifications();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleMarkAllRead = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (error) throw error;
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      toast.success("All caught up!");
    } catch (err) {
      console.error('Error marking all as read:', err);
      toast.error("Failed to update notifications");
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);
      
      if (error) throw error;
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setNotifications(prev => prev.filter(n => n.id !== id));
      toast.success("Notification deleted");
    } catch (err) {
      console.error('Error deleting notification:', err);
      toast.error("Failed to delete notification");
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <div className="bg-green-100 p-2 rounded-full text-green-600"><CheckCircle size={20} /></div>;
      case 'payment': return <div className="bg-green-100 p-2 rounded-full text-green-600"><DollarSign size={20} /></div>;
      case 'invite': return <div className="bg-blue-100 p-2 rounded-full text-blue-600"><Briefcase size={20} /></div>;
      default: return <div className="bg-gray-100 p-2 rounded-full text-gray-600"><Info size={20} /></div>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
          <p className="text-sm text-gray-500">Stay updated with your latest activities</p>
        </div>
        <button
          onClick={handleMarkAllRead}
          disabled={!notifications.some(n => !n.is_read)}
          className="text-sm font-bold text-blue-600 hover:text-blue-700 disabled:opacity-50 flex items-center gap-1.5"
        >
          <Check size={16} />
          Mark all as read
        </button>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">
            <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="font-medium">Loading your alerts...</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {notifications.map((note) => (
              <div 
                key={note.id} 
                onClick={() => !note.is_read && markAsRead(note.id)}
                className={`p-6 flex gap-4 hover:bg-gray-50/80 transition-all cursor-pointer group ${!note.is_read ? 'bg-blue-50/30' : ''}`}
              >
                <div className="flex-shrink-0">
                  {getIcon(note.type)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className={`font-bold text-gray-900 ${!note.is_read ? 'text-blue-900' : ''}`}>
                        {note.title || 'Notification'}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1 leading-relaxed">{note.message}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                       <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                        {new Date(note.created_at).toLocaleDateString()}
                      </span>
                      <button 
                        onClick={(e) => { e.stopPropagation(); deleteNotification(note.id); }}
                        className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {notifications.length === 0 && (
              <div className="p-20 text-center">
                <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Bell size={32} className="text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">All caught up!</h3>
                <p className="text-gray-500 mt-2">You don't have any new notifications at the moment.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;

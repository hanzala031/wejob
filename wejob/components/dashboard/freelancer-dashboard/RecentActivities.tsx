import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, Mail, DollarSign } from 'lucide-react';
import { supabase } from '../../../supabase';

const RecentActivities: React.FC = () => {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let user_id: string;

    const fetchActivities = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        user_id = user.id;

        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) {
            console.warn('Could not fetch notifications:', error.message);
            // setActivities([]); // Default is empty anyway
        } else {
            const formatted = data?.map(n => ({
                id: n.id,
                type: n.type,
                message: n.message,
                time: new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date(n.created_at).toLocaleDateString()
            })) || [];
            setActivities(formatted);
        }
      } catch (err) {
        console.warn('Error fetching activities:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();

    // Subscribe to Realtime notifications
    const channel = supabase
      .channel('realtime_notifications')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'notifications'
        }, 
        (payload) => {
          if (payload.new.user_id === user_id) {
            setActivities(prev => [
              {
                id: payload.new.id,
                type: payload.new.type,
                message: payload.new.message,
                time: 'Just now'
              },
              ...prev
            ].slice(0, 5));
          }
        }
      )
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR') {
          console.warn('Realtime Activity subscription failed.');
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'view': return <div className="bg-blue-100 p-2 rounded-full text-blue-600"><EyeIcon size={16} /></div>;
      case 'payment': return <div className="bg-green-100 p-2 rounded-full text-green-600"><DollarSign size={16} /></div>;
      case 'message': return <div className="bg-purple-100 p-2 rounded-full text-purple-600"><Mail size={16} /></div>;
      default: return <div className="bg-gray-100 p-2 rounded-full text-gray-600"><Bell size={16} /></div>;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">Recent Activity</h2>
      </div>
      <div className="p-6">
        {loading ? (
          <div className="text-center py-8 text-gray-500">
            <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-sm">Loading activity...</p>
          </div>
        ) : activities?.length > 0 ? (
          <ul className="space-y-6 relative before:absolute before:left-[27px] before:top-8 before:h-[calc(100%-40px)] before:w-px before:bg-gray-200">
            {activities?.map((activity) => (
              <li key={activity.id} className="relative flex items-start gap-4">
                <div className="relative z-10 bg-white p-1">
                  {getIcon(activity.type)}
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-sm font-medium text-gray-800">{activity.message}</p>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">No recent activity</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper Icon
const EyeIcon: React.FC<{ size?: number }> = ({ size }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
)

export default RecentActivities;

import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, XCircle, FileText } from 'lucide-react';
import { supabase } from '../../../../supabase';

const RecentActivities: React.FC = () => {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) {
          // If table doesn't exist or other error, just return empty list and warn
          console.warn('Could not fetch notifications (table might be missing):', error.message);
          setActivities([]);
          return;
        }

        const formatted = data?.map(n => ({
          id: n.id,
          type: n.type,
          message: n.message,
          time: new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date(n.created_at).toLocaleDateString()
        })) || [];

        setActivities(formatted);
      } catch (err) {
        console.warn('Error fetching activities:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'apply': return <div className="bg-blue-100 p-2 rounded-full text-blue-600"><FileText size={16} /></div>;
      case 'post': return <div className="bg-purple-100 p-2 rounded-full text-purple-600"><CheckCircle size={16} /></div>;
      case 'reject': return <div className="bg-red-100 p-2 rounded-full text-red-600"><XCircle size={16} /></div>;
      default: return <div className="bg-gray-100 p-2 rounded-full text-gray-600"><Bell size={16} /></div>;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-800">Recent Activities</h2>
      </div>
      <div className="p-6">
        {loading ? (
          <div className="text-center py-8 text-gray-500">
            <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-sm">Loading activity...</p>
          </div>
        ) : activities.length > 0 ? (
          <ul className="space-y-6 relative before:absolute before:left-[27px] before:top-8 before:h-[calc(100%-40px)] before:w-px before:bg-gray-200">
            {activities.map((activity) => (
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

export default RecentActivities;

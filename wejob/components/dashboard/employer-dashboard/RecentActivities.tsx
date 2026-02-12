import React from 'react';
import { Bell, CheckCircle, XCircle, FileText } from 'lucide-react';

const activities = [
  { id: 1, type: 'apply', message: 'Sarah Jenkins applied for Senior UX Designer', time: '10 mins ago' },
  { id: 2, type: 'post', message: 'You posted a new job: React Developer', time: '2 hours ago' },
  { id: 3, type: 'reject', message: 'Application rejected for Graphic Designer', time: '5 hours ago' },
  { id: 4, type: 'shortlist', message: 'David Smith was shortlisted', time: '1 day ago' },
  { id: 5, type: 'update', message: 'Updated company profile details', time: '2 days ago' },
];

const RecentActivities: React.FC = () => {
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
        <h2 className="text-xl font-bold text-gray-800">Recent Activities</h2>
      </div>
      <div className="p-6">
        <ul className="space-y-6 relative before:absolute before:left-[27px] before:top-8 before:h-[calc(100%-40px)] before:w-px before:bg-gray-200">
          {activities.map((activity) => (
            <li key={activity.id} className="relative flex items-start gap-4">
              <div className="relative z-10 bg-white">
                {getIcon(activity.type)}
              </div>
              <div className="flex-1 pt-1">
                <p className="text-sm font-medium text-gray-800">{activity.message}</p>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RecentActivities;


import React from 'react';
import StatCards from '../components/StatCards';
import RecentActivities from '../components/RecentActivities';
import JobTable from '../components/JobTable';
import { NavLink } from 'react-router-dom';
import { supabase } from '../../../../supabase';

const DashboardHome: React.FC = () => {
  const [userName, setUserName] = React.useState('');

  React.useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserName(user.user_metadata?.first_name || 'Employer');
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
          <p className="text-gray-500 mt-1">Welcome back, {userName}! Here is what's happening with your jobs.</p>
        </div>
        <NavLink
          to="/employer/dashboard/jobs/create"
          className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-5 py-2.5 rounded-lg font-semibold shadow-sm transition-colors text-center"
        >
          Post a New Job
        </NavLink>
      </div>

      <StatCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-800">Recent Job Postings</h2>
              <NavLink to="/employer/dashboard/jobs" className="text-sm text-blue-600 hover:underline">View All</NavLink>
            </div>
            <div className="p-4">
              <JobTable limit={3} />
            </div>
          </div>
        </div>
        <div className="lg:col-span-1">
          <RecentActivities />
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;

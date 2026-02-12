
import React from 'react';
import { Briefcase, Users, Eye, FileCheck, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { supabase } from '../../../../supabase';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, trendUp, color }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg ${color} text-white`}>
        {icon}
      </div>
    </div>
    {trend && (
      <div className="mt-4 flex items-center text-xs">
        <span className={`flex items-center font-medium ${trendUp ? 'text-green-600' : 'text-red-500'}`}>
          {trendUp ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
          {trend}
        </span>
        <span className="text-gray-400 ml-2">vs last month</span>
      </div>
    )}
  </div>
);

const StatCards: React.FC = () => {
  const [stats, setStats] = React.useState({
    totalJobs: 0,
    totalApplications: 0,
    shortlisted: 0,
    profileViews: 0
  });
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch total jobs
        const { data: jobs, count: jobsCount, error: jobsError } = await supabase
          .from('jobs')
          .select('id', { count: 'exact' })
          .eq('employer_id', user.id);

        if (jobsError) throw jobsError;

        const jobIds = jobs?.map(job => job.id) || [];
        let totalApps = 0;
        let totalShortlisted = 0;

        if (jobIds.length > 0) {
          // Fetch total applications for those jobs
          const { count: appsCount, error: appsError } = await supabase
            .from('proposals')
            .select('id', { count: 'exact', head: true })
            .in('job_id', jobIds);
          
          if (!appsError) {
            totalApps = appsCount || 0;
          }

          // Fetch shortlisted apps
          const { count: shortlistedCount, error: shortlistedError } = await supabase
            .from('proposals')
            .select('id', { count: 'exact', head: true })
            .in('job_id', jobIds)
            .eq('status', 'shortlisted');

          if (!shortlistedError) {
            totalShortlisted = shortlistedCount || 0;
          }
        }

        setStats({
          totalJobs: jobsCount || 0,
          totalApplications: totalApps,
          shortlisted: totalShortlisted,
          profileViews: 0 // Not yet implemented in DB
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      <StatCard
        title="Total Jobs Posted"
        value={loading ? '...' : stats.totalJobs}
        icon={<Briefcase size={22} />}
        trend="12%"
        trendUp={true}
        color="bg-blue-500"
      />
      <StatCard
        title="Total Applications"
        value={loading ? '...' : stats.totalApplications}
        icon={<FileCheck size={22} />}
        trend="5%"
        trendUp={true}
        color="bg-purple-500"
      />
      <StatCard
        title="Shortlisted"
        value={loading ? '...' : stats.shortlisted}
        icon={<Users size={22} />}
        trend="0%"
        trendUp={true}
        color="bg-green-500"
      />
      <StatCard
        title="Profile Views"
        value="0"
        icon={<Eye size={22} />}
        trend="0%"
        trendUp={true}
        color="bg-orange-500"
      />
    </div>
  );
};

export default StatCards;

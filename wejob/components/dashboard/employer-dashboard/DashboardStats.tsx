import React, { useEffect, useState } from 'react';
import { Briefcase, Users, Eye, FileCheck, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { supabase } from '../../../supabase';
import { useUser } from '../../../context/UserContext';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  color: string;
  loading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, trendUp, color, loading }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800">
          {loading ? (
            <span className="inline-block w-8 h-8 bg-gray-100 rounded animate-pulse"></span>
          ) : (
            value
          )}
        </h3>
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

const DashboardStats: React.FC = () => {
  const { user } = useUser();
  const [totalApplications, setTotalApplications] = useState<number>(0);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      try {
        setStatsLoading(true);
        // 1. Get all job IDs for this employer
        const { data: jobs, error: jobsError } = await supabase
          .from('jobs')
          .select('id')
          .eq('employer_id', user.id);
        
        if (jobsError) throw jobsError;

        if (jobs && jobs.length > 0) {
          const jobIds = jobs.map(j => j.id);
          
          // 2. Fetch total applications for these jobs
          const { count, error } = await supabase
            .from('proposals')
            .select('*', { count: 'exact', head: true })
            .in('job_id', jobIds);
          
          if (!error && count !== null) {
            setTotalApplications(count);
          }
        } else {
          setTotalApplications(0);
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();

    // Realtime subscription for new proposals
    // Note: Filtering by job_id in a dynamic list is complex with Supabase Realtime
    // For now, we'll listen to all inserts and refetch to be accurate, 
    // or just listen to all and let the user know. 
    // A better way is to listen to the specific channel if we have a view.
    const channel = supabase
      .channel('dashboard-stats-proposals')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'proposals',
        },
        async (payload) => {
          // Verify if this proposal belongs to one of the employer's jobs
          const { data: job } = await supabase
            .from('jobs')
            .select('employer_id')
            .eq('id', payload.new.job_id)
            .single();
          
          if (job && job.employer_id === user.id) {
            setTotalApplications((prev) => prev + 1);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard 
        title="Total Jobs Posted" 
        value="12" 
        icon={<Briefcase size={22} />} 
        trend="12%" 
        trendUp={true} 
        color="bg-blue-500"
      />
      <StatCard 
        title="Total Applications" 
        value={totalApplications}
        loading={statsLoading}
        icon={<FileCheck size={22} />} 
        trend="Just updated" 
        trendUp={true} 
        color="bg-purple-500"
      />
      <StatCard 
        title="Shortlisted" 
        value="28" 
        icon={<Users size={22} />} 
        trend="2%" 
        trendUp={false} 
        color="bg-green-500"
      />
      <StatCard 
        title="Profile Views" 
        value="3.2k" 
        icon={<Eye size={22} />} 
        trend="18%" 
        trendUp={true} 
        color="bg-orange-500"
      />
    </div>
  );
};

export default DashboardStats;

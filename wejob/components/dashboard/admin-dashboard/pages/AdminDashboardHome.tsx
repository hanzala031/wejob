
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Users, 
  Briefcase, 
  DollarSign, 
  TrendingUp, 
  Activity,
  CheckCircle2,
  Clock,
  UserPlus,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { supabase } from '../../../../supabase';
import { toast } from 'react-hot-toast';

interface DashboardStats {
  total_freelancers: number;
  total_employers: number;
  active_jobs: number;
  total_revenue: number;
}

interface ActivityItem {
  id: string;
  type: 'user' | 'job';
  title: string;
  subtitle: string;
  time: string;
}

const AdminDashboardHome: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    total_freelancers: 0,
    total_employers: 0,
    active_jobs: 0,
    total_revenue: 0
  });
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [pendingJobs, setPendingJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);

      const [freelancers, employers, jobs, payouts] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'freelancer'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'employer'),
        supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('is_approved', true),
        supabase.from('payouts').select('amount').eq('status', 'approved')
      ]);

      const totalRevenue = payouts.data?.reduce((acc, curr) => acc + (curr.amount || 0), 0) || 0;

      setStats({
        total_freelancers: freelancers.count || 0,
        total_employers: employers.count || 0,
        active_jobs: jobs.count || 0,
        total_revenue: totalRevenue
      });

      const { data: jobsData, error: jobsError } = await supabase
        .from('jobs')
        .select('id, title, budget, status, employer_id, created_at')
        .eq('status', 'pending')
        .limit(5);
      
      if (jobsError) throw jobsError;

      const formattedPendingJobs = await Promise.all((jobsData || []).map(async (job) => {
        const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', job.employer_id)
            .single();
        
        return {
            ...job,
            employer_name: profile?.full_name || 'Anonymous',
            budget: job.budget ? `${job.budget}` : 'Negotiable'
        };
      }));
      
      setPendingJobs(formattedPendingJobs);

      const [recentUsers, recentJobsData] = await Promise.all([
        supabase.from('profiles').select('full_name, role, updated_at').order('updated_at', { ascending: false }).limit(6),
        supabase.from('jobs').select('title, budget, employer_id').order('id', { ascending: false }).limit(2)
      ]);

      const combinedActivities: ActivityItem[] = [
        ...(recentUsers.data || []).map((u, i) => ({
          id: `u-${i}`,
          type: 'user' as const,
          title: u.full_name || 'New User',
          subtitle: `Joined as ${u.role}`,
          time: 'Recently'
        })),
        ...(recentJobsData.data || []).map((j, i) => ({
          id: `j-${i}`,
          type: 'job' as const,
          title: j.title,
          subtitle: j.budget ? `Budget: $${j.budget}` : 'Budget: Negotiable',
          time: 'New Post'
        }))
      ];
      setActivities(combinedActivities);

    } catch (err) {
      console.error("Dashboard Sync Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
    const channel = supabase.channel('system_updates')
      .on('postgres_changes', { event: '*', schema: 'public' }, () => fetchDashboardData())
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR') {
          console.warn('Realtime System Updates subscription failed.');
        }
      });
    return () => { supabase.removeChannel(channel); };
  }, [fetchDashboardData]);

  const handleJobAction = async (jobId: string, action: 'approve' | 'reject') => {
    try {
      if (action === 'approve') {
        const { error } = await supabase
          .from('jobs')
          .update({ status: 'approved', is_approved: true })
          .eq('id', jobId);

        if (error) throw error;
        toast.success('Job approved successfully!');
      } else {
        const { error } = await supabase
          .from('jobs')
          .delete()
          .eq('id', jobId);

        if (error) throw error;
        toast.error('Job deleted permanently.', {
            style: {
                background: '#FEE2E2',
                color: '#991B1B',
                border: '1px solid #F87171'
            }
        });
      }
      
      fetchDashboardData();
    } catch (err: any) {
      console.error(`Error ${action}ing job:`, err);
      toast.error(`Failed to ${action} job`);
    }
  };

  if (loading) return (
    <div className="h-[70vh] flex flex-col items-center justify-center space-y-6">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-[#3c50e0]/10 border-t-[#3c50e0] rounded-full animate-spin"></div>
        <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#3c50e0]" size={24} />
      </div>
      <p className="text-gray-500 font-bold animate-pulse">Synchronizing Platform Intel...</p>
    </div>
  );

  const cardStats = [
    { label: 'Total Freelancers', value: stats.total_freelancers, icon: <Users size={24} />, color: 'bg-blue-500', trend: '+12.5%', up: true },
    { label: 'Total Employers', value: stats.total_employers, icon: <UserPlus size={24} />, color: 'bg-purple-500', trend: '+5.2%', up: true },
    { label: 'Active Projects', value: stats.active_jobs, icon: <Briefcase size={24} />, color: 'bg-indigo-500', trend: '-2.1%', up: false },
    { label: 'Total Revenue', value: `$${stats.total_revenue.toLocaleString()}`, icon: <DollarSign size={24} />, color: 'bg-emerald-500', trend: '+8.4%', up: true },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-gray-500 font-medium mt-1">Monitor your platform's growth and health in real-time.</p>
        </div>
        <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center gap-2">
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </div>
                <span className="text-sm font-bold text-gray-700 uppercase tracking-wider">Live Sync</span>
            </div>
        </div>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {cardStats.map((stat, i) => (
          <div key={i} className="relative group overflow-hidden bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
            <div className="flex items-center justify-between relative z-10">
              <div className={`${stat.color} p-3 rounded-2xl text-white shadow-lg shadow-gray-200 group-hover:scale-110 transition-transform duration-500`}>
                {stat.icon}
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${stat.up ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'} px-2 py-1 rounded-lg`}>
                {stat.up ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                {stat.trend}
              </div>
            </div>
            <div className="mt-6 relative z-10">
                <h3 className="text-3xl font-black text-gray-900 tracking-tight">{stat.value}</h3>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">{stat.label}</p>
            </div>
            {/* Background Decoration */}
            <div className={`absolute -right-4 -bottom-4 w-24 h-24 ${stat.color} opacity-5 rounded-full group-hover:scale-150 transition-transform duration-700`}></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Pending Reviews Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
          <div className="p-8 border-b border-gray-50 flex items-center justify-between">
            <div>
                <h3 className="text-xl font-extrabold text-gray-900">Pending Job Reviews</h3>
                <p className="text-sm text-gray-400 font-medium">Approve or reject newly posted projects</p>
            </div>
            <button className="text-sm font-bold text-[#3c50e0] hover:underline flex items-center gap-1">
                View All <ChevronRight size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-x-auto">
            {pendingJobs.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center py-20">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 size={40} className="text-emerald-500" />
                </div>
                <p className="font-bold text-gray-400">Zero pending jobs. Good job!</p>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-8 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Project Title</th>
                    <th className="px-8 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">Budget</th>
                    <th className="px-8 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">Status</th>
                    <th className="px-8 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {pendingJobs.map((job) => (
                    <tr key={job.id} className="group hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-6">
                        <p className="font-bold text-gray-900 group-hover:text-[#3c50e0] transition-colors">{job.title}</p>
                        <p className="text-[10px] text-gray-400 mt-1 font-medium">{new Date(job.created_at).toLocaleDateString()}</p>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className="text-emerald-600 font-extrabold">${job.budget}</span>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-amber-100">Pending</span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleJobAction(job.id, 'approve')}
                            className="bg-green-600 text-white text-[10px] font-black px-4 py-2 rounded-xl hover:bg-green-700 transition-all uppercase tracking-widest shadow-lg shadow-green-100"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => handleJobAction(job.id, 'reject')}
                            className="bg-red-50 text-red-600 border border-red-100 text-[10px] font-black px-4 py-2 rounded-xl hover:bg-red-100 transition-all uppercase tracking-widest"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Recent Activity Sidebar */}
        <div className="flex flex-col gap-8">
            <div className="bg-gray-900 p-8 rounded-[2rem] shadow-2xl shadow-blue-900/10 text-white flex-1 relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 opacity-20 blur-[60px]"></div>
                
                <div className="relative z-10">
                    <h3 className="text-lg font-extrabold mb-8 flex items-center gap-3">
                        <Activity size={20} className="text-[#3c50e0]" />
                        Recent Activity
                    </h3>
                    
                    <div className="space-y-8">
                        {activities.map((act) => (
                        <div key={act.id} className="flex gap-4 group">
                            <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${act.type === 'user' ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                                {act.type === 'user' ? <UserPlus size={16} /> : <Briefcase size={16} />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-bold text-gray-100 truncate">{act.title}</h4>
                                <p className="text-[11px] text-gray-500 font-medium truncate mt-0.5">{act.subtitle}</p>
                            </div>
                            <span className="text-[9px] font-bold text-gray-600 uppercase tracking-tighter mt-1">{act.time}</span>
                        </div>
                        ))}
                    </div>

                    <button className="w-full mt-12 py-3 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                        View Complete Audit Log
                    </button>
                </div>
            </div>

            {/* Platform Health Mini-Card */}
            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500">
                        <Activity size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Platform Health</p>
                        <p className="text-lg font-black text-gray-900 leading-tight">100% Online</p>
                    </div>
                </div>
                <TrendingUp className="text-emerald-500" size={24} />
            </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboardHome;

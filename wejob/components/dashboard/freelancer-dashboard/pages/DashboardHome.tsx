import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import DashboardStats from '../DashboardStats';
import ActiveJobs from '../ActiveJobs';
import JobFeed from '../JobFeed';
import RecentActivities from '../RecentActivities';
import ApplyModal from '../ApplyModal';
import { supabase } from '../../../../supabase';
import Notification from '../../../../components/Notification';

const DashboardHome: React.FC = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [jobs, setJobs] = useState<any[]>([]); // Open jobs
  const [activeJobs, setActiveJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<{ id: string | number; title: string } | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [stats, setStats] = useState({
    earnings: "$0",
    completedJobs: 0,
    proposalsSent: 0,
    views: "0"
  });

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      setLoading(true);
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
          navigate('/signin');
          return;
        }

        // Fetch profile full_name
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();
        
        if (profile) {
          setUserName(profile.full_name || 'Freelancer');
        } else {
          setUserName(user.user_metadata?.full_name || user.user_metadata?.first_name || 'Freelancer');
        }

        // Fetch stats for freelancer
        try {
            const { count: proposalsCount } = await supabase.from('proposals').select('*', { count: 'exact', head: true }).eq('freelancer_id', user.id);
            const { count: completedCount } = await supabase.from('contracts').select('*', { count: 'exact', head: true }).eq('freelancer_id', user.id).eq('status', 'completed');
            const { data: earningsData } = await supabase.from('contracts').select('amount').eq('freelancer_id', user.id).eq('status', 'paid');
            const totalEarnings = earningsData?.reduce((acc, c) => acc + (c.amount || 0), 0) || 0;

            setStats({
                earnings: `$${totalEarnings.toLocaleString()}`,
                completedJobs: completedCount || 0,
                proposalsSent: proposalsCount || 0,
                views: "0" 
            });
        } catch (e) { console.warn('Stats fetch error', e); }

        // Fetch Active Jobs (Jobs where freelancer has an accepted proposal)
        try {
            const { data: activeProposals, error: activeError } = await supabase
            .from('proposals')
            .select('id, bid_amount, status, job_id')
            .eq('freelancer_id', user.id)
            .eq('status', 'accepted');

            if (!activeError && activeProposals) {
                const formattedActive = [];
                
                for (const p of activeProposals as any[]) {
                    try {
                        // Validate jobId is not empty and is a valid format before querying
                        if (!p.job_id) continue;

                        const { data: jobData, error: jobFetchError } = await supabase
                            .from('jobs')
                            .select('id, title, employer_id')
                            .eq('id', p.job_id)
                            .maybeSingle();

                        if (jobFetchError || !jobData) {
                            console.warn(`Could not fetch job data for project ${p.job_id}:`, jobFetchError?.message);
                            continue;
                        }

                        let clientName = 'Anonymous Client';
                        if (jobData.employer_id) {
                            const { data: profileData } = await supabase
                                .from('profiles')
                                .select('full_name')
                                .eq('id', jobData.employer_id)
                                .maybeSingle();
                            clientName = profileData?.full_name || 'Anonymous Client';
                        }

                        formattedActive.push({
                            id: jobData.id,
                            title: jobData.title || 'Active Project',
                            client: clientName,
                            deadline: 'Ongoing',
                            price: `$${p.bid_amount}`,
                            status: p.status,
                            progress: 50
                        });
                    } catch (innerError) {
                        console.warn("Error processing individual active job:", innerError);
                    }
                }
                setActiveJobs(formattedActive);
            }
        } catch (e) { console.warn('Active jobs section fetch failed', e); }

        // Fetch approved jobs with manual profile lookup for safety
        let openJobsData = [];
        try {
          // Use is_approved=true as per schema
          const { data, error } = await supabase
            .from('jobs')
            .select('*')
            .eq('is_approved', true) 
            .order('created_at', { ascending: false })
            .limit(10);
          
          if (error) throw error;
          openJobsData = data || [];
          console.log(`FREELANCER FEED: Found ${openJobsData.length} approved jobs.`);
        } catch (err: any) {
            console.warn('Jobs fetch failed', err.message);
        }

        if (openJobsData.length > 0) {
            const formattedJobs = await Promise.all(openJobsData.map(async (j: any) => {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('full_name')
                    .eq('id', j.employer_id)
                    .single();
                
                return {
                    ...j,
                    employer: { company_name: profile?.full_name || 'Anonymous' }
                };
            }));
            setJobs(formattedJobs);
        } else {
            setJobs([]);
        }

      } catch (err) {
        console.error('Error fetching freelancer dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetchData();

    // Subscribe to real-time updates for jobs and proposals
    const channel = supabase.channel('dashboard-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'jobs' }, () => {
        checkAuthAndFetchData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'proposals' }, () => {
        checkAuthAndFetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [navigate]);

  const handleUpdateJob = async (id: number, updates: any) => {
    setActiveJobs(prev => prev.map(job => job.id === id ? { ...job, ...updates } : job));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {notification && (
        <Notification message={notification} onClose={() => setNotification(null)} />
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500">Welcome back, {userName}!</p>
        </div>
        <NavLink
          to="/browse-job/services"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold shadow-sm transition-colors"
        >
          Find Work
        </NavLink>
      </div>

      <DashboardStats stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-8">
          {/* Active Jobs Section */}
          {activeJobs?.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Active Projects</h2>
                <NavLink to="/freelancer/dashboard/projects" className="text-blue-600 text-sm font-semibold hover:underline">Manage All</NavLink>
              </div>
              <ActiveJobs jobs={activeJobs} onUpdateJob={handleUpdateJob} />
            </div>
          )}

          {/* Open Jobs Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Recent Open Jobs</h2>
              <NavLink to="/browse-job/services" className="text-blue-600 text-sm font-semibold hover:underline">View All</NavLink>
            </div>
            {loading ? (
              <div className="bg-white p-8 rounded-xl border border-gray-100 text-center text-gray-400">Loading jobs...</div>
            ) : (
              <JobFeed
                jobs={jobs?.map(j => ({
                  id: j.id,
                  title: j.title,
                  employer_name: j.employer?.company_name || 'Anonymous Client',
                  location: j.location || 'Remote',
                  salary_range: j.budget ? `${j.budget}` : `${j.salary_min} - ${j.salary_max}`,
                  type: j.type || 'Contract',
                  posted_at: new Date(j.created_at).toLocaleDateString()
                }))}
                onApply={(id) => {
                  const job = jobs?.find(j => j.id === id);
                  if (job) setSelectedJob({ id: job.id, title: job.title });
                }}
                onShowNotification={setNotification}
              />
            )}
          </div>
        </div>
        <div className="lg:col-span-1">
          <RecentActivities />
        </div>
      </div>

      {selectedJob && (
        <ApplyModal
          jobId={selectedJob.id}
          jobTitle={selectedJob.title}
          onClose={() => setSelectedJob(null)}
          onSuccess={() => {
            setNotification('Proposal submitted successfully!');
          }}
        />
      )}
    </div>
  );
};

export default DashboardHome;

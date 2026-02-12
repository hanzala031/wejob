import React, { useState, useEffect } from 'react';
import ActiveJobs from '../ActiveJobs';
import MilestoneList from '../../milestones/MilestoneList';
import { supabase } from '../../../../supabase';

const MyProjects: React.FC = () => {
  const [activeJobs, setActiveJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch proposals that are accepted
        const { data, error } = await supabase
          .from('proposals')
          .select(`
            id,
            bid_amount,
            status,
            job_id
          `)
          .eq('freelancer_id', user.id)
          .eq('status', 'accepted');

        if (error) throw error;

        const formattedProjects = await Promise.all((data as any[]).map(async (p) => {
          const { data: jobData } = await supabase
            .from('jobs')
            .select('id, title, employer_id')
            .eq('id', p.job_id)
            .single();

          let clientName = 'Anonymous Client';
          if (jobData?.employer_id) {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('company_name, full_name')
              .eq('id', jobData.employer_id)
              .single();
            clientName = profileData?.company_name || profileData?.full_name || 'Anonymous Client';
          }

          return {
            id: jobData?.id || p.id,
            title: jobData?.title || 'Unknown Project',
            client: clientName,
            deadline: 'Ongoing', 
            price: `$${p.bid_amount}`,
            status: 'In Progress', 
            progress: 50 
          };
        }));

        setActiveJobs(formattedProjects);
      } catch (err) {
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleUpdateJob = (id: number, updates: any) => {
      setActiveJobs(prev => prev.map(job => job.id === id ? { ...job, ...updates } : job));
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading projects...</div>;
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
        <h1 className="text-3xl font-black text-gray-900">My Active Projects</h1>
        
        {activeJobs.length > 0 ? (
          <div className="space-y-12">
            {activeJobs.map(job => (
              <div key={job.id} className="space-y-6">
                <div className="bg-white p-1 rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                   <div className="p-6 bg-gray-50/50 border-b border-gray-100 flex justify-between items-center">
                      <div>
                        <h2 className="text-xl font-black text-gray-900">{job.title}</h2>
                        <p className="text-sm text-gray-500 font-medium">Client: {job.client}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black text-blue-600">{job.price}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Budget</p>
                      </div>
                   </div>
                   <div className="p-6">
                      <MilestoneList jobId={job.id} role="freelancer" />
                   </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-20 rounded-[3rem] border border-dashed border-gray-200 text-center">
            <p className="text-gray-400 font-bold">You have no active projects yet.</p>
            <p className="text-sm text-gray-400 mt-1">Apply to jobs to get started!</p>
          </div>
        )}
    </div>
  );
};

export default MyProjects;

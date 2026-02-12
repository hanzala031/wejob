import React, { useState, useEffect } from 'react';
import { Check, X, Eye, ExternalLink, Clock, AlertCircle } from 'lucide-react';
import { supabase } from '../../../../supabase';
import { toast } from 'react-hot-toast';

interface Job {
  id: string;
  title: string;
  employer_name: string;
  budget: string;
  created_at: string;
  status: 'pending' | 'approved' | 'rejected';
  description: string;
}

const JobReview: React.FC = () => {
  const [pendingJobs, setPendingJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingJobs();
  }, []);

  const fetchPendingJobs = async () => {
    try {
      setLoading(true);
      // Fetch jobs with status 'pending'
      const { data: jobsData, error: jobsError } = await supabase
        .from('jobs')
        .select('id, title, budget, status, description, employer_id, created_at')
        .eq('status', 'pending');
      
      if (jobsError) throw jobsError;

      if (jobsData) {
        // Fetch profile full_name manually for each job
        const formattedJobs = await Promise.all(jobsData.map(async (job: any) => {
            const { data: profile } = await supabase
                .from('profiles')
                .select('full_name')
                .eq('id', job.employer_id)
                .single();
            
            return {
                ...job,
                employer_name: profile?.full_name || 'Anonymous Employer',
                budget: job.budget ? `${job.budget}` : 'Negotiable',
            };
        }));
        setPendingJobs(formattedJobs);
      }
    } catch (error: any) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load pending jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (jobId: string, action: 'approve' | 'reject') => {
    try {
      if (action === 'approve') {
        // Update status to approved - this is the key for freelancer visibility
        const { error } = await supabase
          .from('jobs')
          .update({ 
            status: 'approved', 
            is_approved: true 
          })
          .eq('id', jobId);
        
        if (error) throw error;
        toast.success('Job approved! It is now live for freelancers.');
      } else {
        // Permanently delete the job from backend on rejection
        const { error } = await supabase
          .from('jobs')
          .delete()
          .eq('id', jobId);
        
        if (error) throw error;
        toast.error('Job permanently deleted.', {
            style: {
                background: '#FEE2E2',
                color: '#991B1B',
                border: '1px solid #F87171'
            }
        });
      }
      
      // Remove from UI immediately
      setPendingJobs(prev => prev.filter(j => j.id !== jobId));
      
    } catch (error) {
      console.error(`Error during ${action}:`, error);
      toast.error(`Failed to ${action} job`);
    }
  };
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-['Roboto']">Job Review Queue</h1>
        <p className="text-gray-500 dark:text-gray-400 font-['Roboto']">Review and approve or reject newly posted jobs.</p>
      </div>

      <div className="grid gap-6">
        {loading ? (
          <div className="bg-white dark:bg-slate-800 p-8 text-center rounded-xl border border-gray-100 dark:border-slate-700">
            <p className="text-gray-500 font-['Roboto']">Loading pending jobs...</p>
          </div>
        ) : pendingJobs.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 p-12 text-center rounded-xl border border-gray-100 dark:border-slate-700">
            <Check className="mx-auto text-green-500 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white font-['Roboto']">All caught up!</h3>
            <p className="text-gray-500 font-['Roboto']">There are no pending jobs to review at the moment.</p>
          </div>
        ) : (
          pendingJobs.map((job) => (
            <div key={job.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden flex flex-col md:flex-row">
              <div className="flex-1 p-6 font-['Roboto']">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white hover:text-[#2563EB] transition-colors cursor-pointer flex items-center gap-2">
                      {job.title}
                      <ExternalLink size={14} className="text-gray-400" />
                    </h3>
                    <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                      <span className="font-medium text-[#2563EB] dark:text-blue-400">{job.employer_name}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><Clock size={14} /> {new Date(job.created_at).toLocaleDateString()}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">${job.budget}</span>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Budget</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mt-3">
                  {job.description}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-slate-900/50 p-6 flex md:flex-col justify-center gap-3 border-t md:border-t-0 md:border-l border-gray-100 dark:border-slate-700 w-full md:w-48 font-['Roboto']">
                <button 
                  onClick={() => handleAction(job.id, 'approve')}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors shadow-md"
                >
                  <Check size={18} />
                  Approve
                </button>
                <button 
                  onClick={() => handleAction(job.id, 'reject')}
                  className="flex-1 flex items-center justify-center gap-2 bg-white dark:bg-slate-800 border border-red-200 dark:border-red-900/30 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 py-2 px-4 rounded-lg font-medium transition-colors shadow-sm"
                >
                  <X size={18} />
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default JobReview;

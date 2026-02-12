import React, { useState, useEffect } from 'react';
import SavedJobsComponent from '../SavedJobs';
import { supabase } from '../../../../supabase';
import { jobs as mockJobsData } from '../../../LatestJobs';

const SavedJobs: React.FC = () => {
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // 1. Fetch Real Jobs from Supabase
        const { data: realData, error: savedJobsError } = await supabase
          .from('saved_jobs')
          .select('id, job_id')
          .eq('user_id', user.id);

        if (savedJobsError) throw savedJobsError;

        const realFormattedJobs = await Promise.all((realData || []).map(async (item: any) => {
            try {
                const { data: jobData } = await supabase
                    .from('jobs')
                    .select('id, title, budget, location, created_at, employer_id')
                    .eq('id', item.job_id)
                    .single();
                
                if (!jobData) return null;

                let clientName = 'Unknown Client';
                if (jobData?.employer_id) {
                    const { data: profileData } = await supabase
                        .from('profiles')
                        .select('company_name, full_name')
                        .eq('id', jobData.employer_id)
                        .single();
                    clientName = profileData?.company_name || profileData?.full_name || 'Unknown Client';
                }

                return {
                    id: item.id,
                    job_id: item.job_id,
                    title: jobData?.title || 'Unknown Job',
                    client: clientName,
                    location: jobData?.location || 'Remote',
                    budget: jobData?.budget ? `$${jobData.budget.toLocaleString()}` : 'Negotiable',
                    postedDate: jobData?.created_at ? new Date(jobData.created_at).toLocaleDateString() : 'N/A'
                };
            } catch (e) {
                return null;
            }
        }));

        // 2. Fetch Mock Jobs from localStorage
        const mockSavedIds = JSON.parse(localStorage.getItem(`saved_jobs_mock_${user.id}`) || '[]');
        const mockFormattedJobs = mockSavedIds.map((id: number) => {
            const job = mockJobsData.find(j => j.id === id);
            if (!job) return null;
            return {
                id: `mock-${id}`,
                job_id: id,
                title: job.title,
                client: job.company,
                location: job.location,
                budget: `$${job.price}`,
                postedDate: job.postedDate || 'N/A'
            };
        });

        const allJobs = [...realFormattedJobs.filter(Boolean), ...mockFormattedJobs.filter(Boolean)];
        setSavedJobs(allJobs);

      } catch (err) {
        console.error('Error fetching saved jobs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedJobs();

    // Realtime subscription (only for real jobs)
    const channel = supabase
      .channel('saved-jobs-page')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'saved_jobs' }, () => fetchSavedJobs())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleRemoveSavedJob = async (id: string | number) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (typeof id === 'string' && id.startsWith('mock-')) {
        // Handle Mock Removal
        const originalId = parseInt(id.replace('mock-', ''), 10);
        const mockSavedIds = JSON.parse(localStorage.getItem(`saved_jobs_mock_${user.id}`) || '[]');
        const newSavedIds = mockSavedIds.filter((sid: number) => sid !== originalId);
        localStorage.setItem(`saved_jobs_mock_${user.id}`, JSON.stringify(newSavedIds));
        setSavedJobs(prev => prev.filter(job => job.id !== id));
    } else {
        // Handle Real Removal
        try {
            const { error } = await supabase
                .from('saved_jobs')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setSavedJobs(prev => prev.filter(job => job.id !== id));
        } catch (err) {
            console.error('Error removing saved job:', err);
        }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h1 className="text-2xl font-bold text-gray-800">Saved Jobs</h1>
      {loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center text-gray-500">
          <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading your saved jobs...</p>
        </div>
      ) : (
        <SavedJobsComponent jobs={savedJobs} onRemove={handleRemoveSavedJob} />
      )}
    </div>
  );
};

export default SavedJobs;

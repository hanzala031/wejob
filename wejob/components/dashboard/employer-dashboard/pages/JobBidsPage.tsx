import React, { useState, useEffect } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { ArrowLeft, Briefcase, Calendar, MapPin } from 'lucide-react';
import { supabase } from '../../../../supabase';
import JobBidsList from '../JobBidsList';

const JobBidsPage: React.FC = () => {
  const { id } = useParams();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) return;
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setJob(data);
      } catch (err) {
        console.error('Error fetching job details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  if (loading) {
    return <div className="p-12 text-center text-gray-500">Loading job details...</div>;
  }

  if (!job) {
    return (
      <div className="p-12 text-center">
        <h2 className="text-xl font-bold text-gray-800">Job not found</h2>
        <NavLink to="/employer/dashboard/jobs" className="text-blue-600 hover:underline mt-4 inline-block">
          Back to My Jobs
        </NavLink>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <NavLink 
          to="/employer/dashboard/jobs" 
          className="p-2 bg-white rounded-lg border border-gray-200 text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={20} />
        </NavLink>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
          <div className="flex flex-wrap items-center gap-4 mt-1 text-sm text-gray-500">
            <span className="flex items-center gap-1"><Briefcase size={14} /> {job.type}</span>
            <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
            <span className="flex items-center gap-1"><Calendar size={14} /> Posted {new Date(job.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <JobBidsList jobId={id!} />
      </div>
    </div>
  );
};

export default JobBidsPage;

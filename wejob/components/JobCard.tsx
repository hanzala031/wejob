
import React, { useState, useEffect } from 'react';
import { CheckCircle2, Heart, Star, Loader2 } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { supabase } from '../supabase';

interface Job {
  id: number;
  company: string;
  title: string;
  tags: string[];
  price: string;
  isHourly?: boolean;
  expiry: string;
  proposals: string;
  featured?: boolean;
}

interface JobCardProps {
  job: Job;
  onShowNotification: (message: string) => void;
  onNavigate: (page: string, data?: any) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onShowNotification, onNavigate }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    let user_id: string;
    
    const checkStatus = async () => {
      const { data: authData } = await supabase.auth.getUser();
      const user = authData?.user;
      
      if (!user) return;
      user_id = user.id;

      // UUID Validation Regex
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(job.id.toString());

      // 1. Check Saved Status
      if (!isUUID) {
        const mockSavedIds = JSON.parse(localStorage.getItem(`saved_jobs_mock_${user.id}`) || '[]');
        if (mockSavedIds.includes(job.id)) {
          setIsSaved(true);
        }
      } else {
        try {
          const { data } = await supabase.from('saved_jobs').select('id').eq('user_id', user.id).eq('job_id', job.id).maybeSingle();
          if (data) setIsSaved(true);
        } catch (err) {}
      }

      // 2. Check Applied Status
      try {
        const { data } = await supabase.from('proposals').select('id').eq('freelancer_id', user.id).eq('job_id', job.id).maybeSingle();
        if (data) setIsApplied(true);
      } catch (err) {}
    };
    checkStatus();

    // Subscribe to Realtime changes for this job's proposals
    const channel = supabase.channel(`job-card-status-${job.id}`)
        .on('postgres_changes', { 
            event: '*', 
            schema: 'public', 
            table: 'proposals',
            filter: `job_id=eq.${job.id}`
        }, (payload) => {
            if (payload.eventType === 'INSERT' && payload.new.freelancer_id === user_id) {
                setIsApplied(true);
            } else if (payload.eventType === 'DELETE') {
                setIsApplied(false); // Reset if any proposal for this job is deleted (simplification)
                // Re-verify if current user still has a proposal (safer)
                checkStatus();
            }
        })
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
  }, [user, job.id]);

  const handleHeartClick = async () => {
    if (!user) {
      onShowNotification('Please login');
      setTimeout(() => {
        onNavigate('signin');
      }, 2000);
      return;
    }

    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(job.id.toString());
    setIsLoading(true);

    try {
      if (isSaved) {
        if (isUUID) {
          // Unsave real job
          await supabase
            .from('saved_jobs')
            .delete()
            .eq('user_id', user.id)
            .eq('job_id', job.id);
        } else {
          // Unsave dummy job
          const mockSavedIds = JSON.parse(localStorage.getItem(`saved_jobs_mock_${user.id}`) || '[]');
          const filtered = mockSavedIds.filter((id: any) => id !== job.id);
          localStorage.setItem(`saved_jobs_mock_${user.id}`, JSON.stringify(filtered));
        }
        setIsSaved(false);
        onShowNotification('Job removed from saved');
      } else {
        if (isUUID) {
          // Save real job
          const { error } = await supabase
            .from('saved_jobs')
            .insert({
              user_id: user.id,
              job_id: job.id
            });
          if (error) throw error;
        } else {
          // Save dummy job
          const mockSavedIds = JSON.parse(localStorage.getItem(`saved_jobs_mock_${user.id}`) || '[]');
          if (!mockSavedIds.includes(job.id)) {
            mockSavedIds.push(job.id);
            localStorage.setItem(`saved_jobs_mock_${user.id}`, JSON.stringify(mockSavedIds));
          }
        }
        setIsSaved(true);
        onShowNotification('Job saved successfully');
      }
    } catch (err) {
      console.error('Error toggling saved job:', err);
      onShowNotification('Failed to save job');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 p-4 md:p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 md:gap-6 transition-all duration-300 h-full group">
      {job.featured && (
        <div className="absolute top-0 left-0 h-12 w-12 z-10">
            <div className="absolute top-0 left-0 h-full w-full bg-[#2563eb]" style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}></div>
            <Star className="absolute top-2 left-2 w-3 h-3 text-white fill-current" />
        </div>
      )}
      
      <div className="flex-1 w-full space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
          </div>
          <span className="text-gray-500 text-[10px] md:text-xs font-semibold truncate tracking-tight">{job.company}</span>
        </div>
        <h3 className="text-base md:text-lg font-bold text-gray-900 group-hover:text-[#2563eb] transition-colors cursor-pointer line-clamp-2 leading-tight" onClick={() => onNavigate('jobdetail', job)}>
          {job.title}
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {job.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="text-[9px] md:text-[10px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-1 rounded-md border border-blue-100">
              {tag}
            </span>
          ))}
          {job.tags.length > 2 && <span className="text-[9px] md:text-[10px] text-gray-400 font-bold">+{job.tags.length - 2}</span>}
        </div>
      </div>

      <div className="w-full lg:w-auto border-t lg:border-t-0 pt-4 lg:pt-0">
        <div className="flex flex-col sm:flex-row lg:flex-row gap-4 items-start sm:items-center w-full lg:w-auto">
           <div className="grid grid-cols-3 gap-2 md:gap-4 w-full py-6 sm:w-auto">
              <div className="min-w-0">
                <p className="text-[9px] lg:text-[12px] text-gray-500 uppercase tracking-widest font-semibold mb-0.5 truncate">Budget</p>
                <p className="text-sm md:text-base font-bold text-gray-900 truncate">${job.price}</p>
              </div>
              <div className="min-w-0">
                <p className="text-[9px] lg:text-[12px] text-gray-500 uppercase tracking-widest font-semibold mb-0.5 truncate">Expiry</p>
                <p className="text-xs md:text-sm text-gray-900 font-bold truncate">{job.expiry.split(',')[0]}</p>
              </div>
              <div className="min-w-0">
                <p className="text-[9px] lg:text-[12px] text-gray-500 uppercase tracking-widest font-semibold mb-0.5 truncate">Bids</p>
                <p className="text-xs md:text-sm text-gray-900 font-bold truncate">{job.proposals.split(' ')[0]}</p>
              </div>
           </div>
           
           <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
               <button 
                  className={`w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-lg border-2 transition-all active:scale-90 ${isSaved ? 'border-red-100 bg-red-50 text-red-500' : 'border-gray-100 text-gray-400 hover:border-blue-100 hover:text-blue-500'}`}
                  onClick={handleHeartClick}
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />}
                </button>

                {isApplied ? (
                  <button 
                    disabled
                    className="flex-1 sm:flex-none bg-green-50 text-green-600 font-black px-4 py-2.5 rounded-xl border border-green-100 flex items-center justify-center gap-1.5 text-[10px] uppercase tracking-widest cursor-default whitespace-nowrap"
                  >
                    <CheckCircle2 size={14} />
                    Applied
                  </button>
                ) : (
                  <button 
                    onClick={() => onNavigate('jobdetail', job)}
                    className="flex-1 sm:flex-none bg-[#2563eb] text-white font-black px-5 py-3 rounded-lg hover:bg-[#1d4ed8] transition-all duration-300 shadow-lg shadow-blue-500/10 text-[10px] uppercase tracking-widest active:scale-95 whitespace-nowrap"
                  >
                    View Details
                  </button>
                )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;

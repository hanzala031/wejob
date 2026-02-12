import React, { useState, useEffect } from 'react';
import { Briefcase, MapPin, DollarSign, Clock, Heart, Loader2, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../../supabase';

interface Job {
    id: number;
    title: string;
    employer_name: string;
    location: string;
    salary_range: string;
    type: string;
    posted_at: string;
}

interface JobFeedProps {
    jobs: Job[];
    onApply: (jobId: number) => void;
    onShowNotification: (message: string) => void;
}

const JobFeedItem: React.FC<{ job: Job; onApply: (jobId: number | string) => void; onShowNotification: (message: string) => void }> = ({ job, onApply, onShowNotification }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [isApplied, setIsApplied] = useState(false);
    const [savedRowId, setSavedRowId] = useState<number | null>(null);

    useEffect(() => {
        let user_id: string;
        
        const checkStatus = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                user_id = user.id;
                
                // UUID Validation
                const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(job.id.toString());

                // 1. Check Saved Status
                if (isUUID) {
                    const { data: savedData } = await supabase
                        .from('saved_jobs')
                        .select('id')
                        .eq('user_id', user.id)
                        .eq('job_id', job.id)
                        .maybeSingle();

                    if (savedData) {
                        setIsSaved(true);
                        setSavedRowId(savedData.id);
                    }
                }

                // 2. Check Applied Status
                const { data: proposalData } = await supabase
                    .from('proposals')
                    .select('id')
                    .eq('freelancer_id', user.id)
                    .eq('job_id', job.id)
                    .maybeSingle();

                if (proposalData) {
                    setIsApplied(true);
                }
            }
        };
        checkStatus();

        // Subscribe to Realtime changes for this job's proposals
        const channel = supabase.channel(`job-status-${job.id}`)
            .on('postgres_changes', { 
                event: '*', 
                schema: 'public', 
                table: 'proposals',
                filter: `job_id=eq.${job.id}`
            }, (payload) => {
                if (payload.eventType === 'INSERT' && payload.new.freelancer_id === user_id) {
                    setIsApplied(true);
                } else if (payload.eventType === 'DELETE') {
                    // Check if the deleted proposal belonged to current user
                    // Note: For DELETE, payload.old contains the record
                    if (payload.old.freelancer_id === user_id || !payload.old.freelancer_id) {
                        setIsApplied(false);
                    }
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [job.id]);

    const handleHeartClick = async (e: React.MouseEvent) => {
        e.stopPropagation();

        // 1. Strict Session Check
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            onShowNotification('Please log in to save jobs');
            return;
        }

        const user = session.user;
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(job.id.toString());

        // 2. Role Check
        const userRole = user.user_metadata?.role;
        if (userRole === 'employer') {
            onShowNotification('You must be a freelancer to save jobs');
            return;
        }

        setIsLoading(true);
        try {
            if (isSaved) {
                // Unsave
                if (isUUID) {
                    await supabase.from('saved_jobs').delete().eq('user_id', user.id).eq('job_id', job.id);
                }
                setIsSaved(false);
                setSavedRowId(null);
                onShowNotification('Job removed from saved jobs');
            } else {
                // Save
                if (isUUID) {
                    await supabase.from('saved_jobs').insert({ user_id: user.id, job_id: job.id });
                }
                setIsSaved(true);
                onShowNotification('Job saved successfully');
            }
        } catch (err) {
            console.error('Error toggling saved job:', err);
            onShowNotification('Failed to update saved jobs');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white p-5 sm:p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all group relative">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="flex-1 w-full">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">{job.type}</span>
                        <span className="text-gray-400 text-xs flex items-center gap-1">
                            <Clock size={12} /> {job.posted_at}
                        </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors mb-1">{job.title}</h3>
                    <p className="text-sm text-gray-500 font-medium mb-4">{job.employer_name}</p>

                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-500">
                        <div className="items-center gap-1 flex">
                            <MapPin size={14} className="text-gray-400 flex-shrink-0" />
                            <span className="truncate">{job.location}</span>
                        </div>
                        <div className="items-center gap-1 font-semibold text-gray-700 flex">
                            <DollarSign size={14} className="text-green-500 flex-shrink-0" />
                            <span>{job.salary_range}</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-gray-50">
                    <button
                        onClick={handleHeartClick}
                        className="p-2.5 text-gray-400 hover:text-red-500 transition-colors bg-gray-50 rounded-lg group/heart flex-shrink-0"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Heart className={`w-5 h-5 transition-colors ${isSaved ? 'fill-red-500 text-red-500' : 'group-hover/heart:fill-red-200'}`} />
                        )}
                    </button>
                    {isApplied ? (
                        <button
                            disabled
                            className="flex-1 sm:flex-none justify-center bg-green-100 text-green-600 px-6 py-2.5 rounded-lg text-sm font-bold border border-green-200 cursor-default flex items-center gap-2"
                        >
                            <CheckCircle2 size={16} />
                            Applied
                        </button>
                    ) : (
                        <button
                            onClick={() => onApply(job.id)}
                            className="flex-1 sm:flex-none justify-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm whitespace-nowrap"
                        >
                            Apply Now
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

const JobFeed: React.FC<JobFeedProps> = ({ jobs, onApply, onShowNotification }) => {
    if (jobs?.length === 0) {
        return (
            <div className="bg-white p-8 rounded-xl border border-gray-100 text-center text-gray-400">
                No open jobs found at the moment.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {jobs?.map((job) => (
                <JobFeedItem key={job.id} job={job} onApply={onApply} onShowNotification={onShowNotification} />
            ))}
        </div>
    );
};

export default JobFeed;


import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Edit, Trash2, Eye, Briefcase, Clock, X, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../../supabase';
import MilestoneList from '../../milestones/MilestoneList';
import { toast } from 'react-hot-toast';

interface Job {
  id: string; // Changed to string for UUID support
  title: string;
  type: string;
  location: string;
  postedDate: string;
  deadline: string;
  applicants: number;
  applicantAvatars?: string[];
  status: string;
  salary: string;
  description: string;
  requirements: string[];
}

interface JobTableProps {
  limit?: number;
  filterStatus?: string;
}

const JobTable: React.FC<JobTableProps> = ({ limit, filterStatus = 'All' }) => {
  const navigate = useNavigate();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setIsLoading(false);
          return;
        }

        // Fetch jobs first
        const { data: jobsData, error: jobsError } = await supabase
          .from('jobs')
          .select('*')
          .eq('employer_id', user.id)
          .order('created_at', { ascending: false });

        if (jobsError) throw jobsError;

        let formattedJobs: Job[] = [];

        if (jobsData) {
          const jobIds = jobsData.map(j => j.id);
          let proposalCounts: Record<string, number> = {};
          let jobApplicants: Record<string, string[]> = {};

          if (jobIds.length > 0) {
            // Fetch proposals first
            const { data: proposalsData, error: propError } = await supabase
              .from('proposals')
              .select('job_id, freelancer_id')
              .in('job_id', jobIds);
            
            if (propError) {
              console.error('Proposals Fetch Error:', propError);
            }
            
            if (proposalsData) {
              // Get unique freelancer IDs to fetch avatars
              const freelancerIds = [...new Set(proposalsData.map(p => p.freelancer_id))];
              
              const { data: profilesData } = await supabase
                .from('profiles')
                .select('id, avatar_url')
                .in('id', freelancerIds);

              const avatarMap: Record<string, string> = {};
              profilesData?.forEach(prof => {
                if (prof.avatar_url) avatarMap[prof.id] = prof.avatar_url;
              });

              proposalsData.forEach((p: any) => {
                const jId = p.job_id;
                proposalCounts[jId] = (proposalCounts[jId] || 0) + 1;
                
                if (!jobApplicants[jId]) jobApplicants[jId] = [];
                // Collect avatar if available from map
                const avatar = avatarMap[p.freelancer_id];
                if (avatar && jobApplicants[jId].length < 3) {
                   jobApplicants[jId].push(avatar);
                }
              });
            }
          }

          formattedJobs = (jobsData as any[]).map((job) => ({
            id: job.id,
            title: job.title || 'Untitled Job',
            type: job.type || 'Full Time',
            location: job.location || 'Remote',
            postedDate: job.created_at ? new Date(job.created_at).toLocaleDateString() : 'N/A',
            deadline: job.deadline ? new Date(job.deadline).toLocaleDateString() : 'No deadline',
            applicants: proposalCounts[job.id] || 0,
            applicantAvatars: jobApplicants[job.id] || [],
            status: job.status === 'open' ? 'Active' : (job.status ? job.status.charAt(0).toUpperCase() + job.status.slice(1) : 'Active'),
            salary: job.salary_min ? `$${job.salary_min / 1000}k - $${job.salary_max / 1000}k` : 'Negotiable',
            description: job.description || '',
            requirements: job.skills || []
          }));
          setJobs(formattedJobs);
        }
      } catch (err) {
        console.error('Error fetching jobs:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Closed': return 'bg-red-100 text-red-700 border-red-200';
      case 'Paused': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedJobId(expandedJobId === id ? null : id);
  };

  const handlePreview = (job: Job) => {
    navigate(`/employer/dashboard/jobs/${job.id}/proposals`);
  };

  const handleEdit = (id: string) => {
    alert(`Editing job ${id}`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(`Are you sure you want to delete this job posting?`)) {
      try {
        const { error } = await supabase.from('jobs').delete().eq('id', id);
        if (error) throw error;
        setJobs(prevJobs => prevJobs.filter(job => job.id !== id));
      } catch (err) {
        console.error('Error deleting job:', err);
        alert('Failed to delete job');
      }
    }
  };

  const filteredJobs = jobs.filter(job => {
    if (filterStatus === 'All') return true;
    return job.status === filterStatus;
  });

  const displayedJobs = limit ? filteredJobs.slice(0, limit) : filteredJobs;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-gray-50">
        <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-medium animate-pulse">Loading jobs...</p>
      </div>
    );
  }

  if (displayedJobs.length === 0) {
    return (
      <div className="p-12 text-center bg-white rounded-xl border border-gray-100">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Briefcase className="w-8 h-8 text-gray-300" />
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-1">No jobs found</h3>
        <p className="text-gray-500">No jobs found matching "{filterStatus}".</p>
      </div>
    )
  }

  return (
    <div className="w-full overflow-hidden bg-white rounded-xl border border-gray-100 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead className="bg-gray-50/50 text-gray-500 text-xs uppercase font-medium border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 tracking-wider w-[40%]">Job Details</th>
              <th className="px-6 py-4 tracking-wider">Applicants</th>
              <th className="px-6 py-4 tracking-wider">Status</th>
              <th className="px-6 py-4 tracking-wider">Posted</th>
              <th className="px-6 py-4 text-right tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {displayedJobs?.map((job) => (
              <React.Fragment key={job.id}>
                <tr className={`group hover:bg-gray-50/80 transition-colors duration-200 ${expandedJobId === job.id ? 'bg-blue-50/30' : ''}`}>
                  {/* Job Details */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => toggleExpand(job.id)}
                        className={`p-1.5 rounded-lg transition-colors ${expandedJobId === job.id ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:bg-gray-100'}`}
                      >
                        {expandedJobId === job.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </button>
                      <div className="flex flex-col">
                        <span
                          className="font-semibold text-gray-900 text-base mb-1 group-hover:text-blue-600 transition-colors cursor-pointer line-clamp-1"
                          onClick={() => handlePreview(job)}
                        >
                          {job.title}
                        </span>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded text-gray-600 whitespace-nowrap">
                            <Briefcase size={12} /> {job.type}
                          </span>
                          <span className="flex items-center gap-1 text-gray-400 whitespace-nowrap">
                            <MapPin size={12} /> {job.location}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Applicants */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-2 overflow-hidden">
                        {job.applicantAvatars && job.applicantAvatars.length > 0 ? (
                          job.applicantAvatars.map((url, i) => (
                            <img key={i} src={url} alt="Applicant" className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover bg-gray-100" />
                          ))
                        ) : (
                          job.applicants > 0 && [...Array(Math.min(3, job.applicants))].map((_, i) => (
                            <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-500">
                              {String.fromCharCode(65 + i)}
                            </div>
                          ))
                        )}
                        {job.applicants === 0 && (
                            <span className="text-gray-400 text-xs italic">No applicants</span>
                        )}
                        {job.applicantAvatars && job.applicantAvatars.length > 0 && job.applicants > job.applicantAvatars.length && (
                          <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                            +{job.applicants - job.applicantAvatars.length}
                          </div>
                        )}
                        {(!job.applicantAvatars || job.applicantAvatars.length === 0) && job.applicants > 3 && (
                          <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                            +{job.applicants - 3}
                          </div>
                        )}
                      </div>
                      {job.applicants > 0 && <span className="text-xs font-medium text-gray-500 whitespace-nowrap">{job.applicants} Total</span>}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(job.status)}`}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${job.status === 'Active' ? 'bg-emerald-500' : job.status === 'Paused' ? 'bg-amber-500' : 'bg-red-500'}`}></span>
                      {job.status}
                    </span>
                  </td>

                  {/* Posted Date */}
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-500 whitespace-nowrap">
                      <Clock size={14} className="mr-1.5 text-gray-400" />
                      {job.postedDate}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      {job.status === 'Active' && (
                        <button
                          onClick={async () => {
                            if(window.confirm('Release full payment to freelancer?')) {
                              const { error } = await supabase.rpc('handle_milestone_release', { job_id_input: job.id });
                              if (error) toast.error(error.message);
                              else {
                                toast.success('Payment released successfully!');
                                window.location.reload();
                              }
                            }
                          }}
                          className="px-3 py-1.5 text-xs font-black text-white bg-green-600 hover:bg-green-700 rounded-lg transition-all shadow-md shadow-green-100"
                        >
                          Pay & Release
                        </button>
                      )}
                      <button
                        onClick={() => handlePreview(job)}
                        className="px-3 py-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-200"
                      >
                        Proposals
                      </button>
                      <button
                        onClick={() => handleEdit(job.id)}
                        className="p-2 text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all"
                        title="Edit Job"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(job.id)}
                        className="p-2 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-all"
                        title="Delete Job"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
                {/* Expanded Row for Milestones */}
                {expandedJobId === job.id && (
                  <tr>
                    <td colSpan={5} className="px-12 py-8 bg-gray-50/50 border-b border-gray-100">
                      <div className="animate-in slide-in-from-top-2 duration-300">
                        <MilestoneList jobId={job.id} role="employer" />
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default JobTable;

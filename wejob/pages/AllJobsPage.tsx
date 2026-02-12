
import React, { useState, useEffect } from 'react';
import JobCard from '../components/JobCard';
import { jobs as dummyJobs } from '../components/LatestJobs';
import { Search, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { supabase } from '../supabase';

interface AllJobsPageProps {
  onShowNotification: (message: string) => void;
  onNavigate: (page: string, data?: any) => void;
}

const AllJobsPage: React.FC<AllJobsPageProps> = ({ onShowNotification, onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [liveJobs, setLiveJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllJobs = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('is_approved', true)
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data) {
          const formattedJobs = await Promise.all(data.map(async (job: any) => {
            const { data: profile } = await supabase.from('profiles').select('company_name, full_name').eq('id', job.employer_id).single();
            const { count } = await supabase.from('proposals').select('*', { count: 'exact', head: true }).eq('job_id', job.id);

            return {
              id: job.id,
              company: profile?.company_name || profile?.full_name || 'Anonymous Client',
              title: job.title,
              tags: job.skills || [],
              price: job.budget ? `${job.budget}` : 'Negotiable',
              expiry: job.deadline ? new Date(job.deadline).toLocaleDateString() : 'Never Expire',
              proposals: `${count || 0} Received`,
              featured: job.is_featured || false,
              description: job.description,
              category: job.category,
              location: job.location,
              projectType: job.type, // Map for filtering
              postedDate: new Date(job.created_at).toLocaleDateString()
            };
          }));
          setLiveJobs(formattedJobs);
        }
      } catch (err) {
        console.error('Error fetching all jobs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllJobs();
  }, []);

  // Combine live and dummy jobs
  const combinedJobs = [...liveJobs, ...dummyJobs];

  const filteredJobs = combinedJobs.filter(job => {
    const titleMatch = job.title.toLowerCase().includes(searchTerm.toLowerCase());
    const companyMatch = (job.company || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSearch = titleMatch || companyMatch;
    const matchesType = filterType === 'All' || job.projectType === filterType || job.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      {/* Header Banner */}
      <div className="bg-[#0f172a] text-white py-12 md:py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Find Your Dream Job</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Browse through hundreds of opportunities from top companies and startups.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="max-w-6xl mx-auto">
          
          {/* Search and Filter UI (Simplified for brevity, assuming standard layout) */}
          <div className="mb-8 flex flex-col md:flex-row gap-4">
             <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                    type="text" 
                    placeholder="Search by job title or company..."
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
             <select 
                className="px-6 py-3 rounded-xl border border-gray-200 outline-none cursor-pointer bg-white"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
             >
                <option value="All">All Job Types</option>
                <option value="Full Time">Full Time</option>
                <option value="Contract">Contract</option>
                <option value="Freelance">Freelance</option>
             </select>
          </div>

          {/* Results Count */}
          <div className="mb-6 flex justify-between items-center">
            <p className="text-gray-600">
                Showing <span className="font-bold text-gray-900">{filteredJobs.length}</span> jobs
            </p>
          </div>

          {/* Job List */}
          <div className="space-y-4">
            {loading ? (
                <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
                    <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">Loading opportunities...</p>
                </div>
            ) : filteredJobs.length > 0 ? (
                filteredJobs.map((job, idx) => (
                    <JobCard key={job.id || idx} job={job as any} onShowNotification={onShowNotification} onNavigate={onNavigate} />
                ))
            ) : (
                <div className="text-center py-16 bg-white rounded-xl border border-gray-200 border-dashed">
                    <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">No jobs found</h3>
                    <p className="text-gray-500">Try adjusting your search or filters to find what you're looking for.</p>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllJobsPage;

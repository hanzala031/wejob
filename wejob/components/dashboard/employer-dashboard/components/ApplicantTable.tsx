import React, { useState, useEffect } from 'react';
import { MoreHorizontal, Download, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../../supabase';

interface Applicant {
  id: number;
  name: string;
  job: string;
  date: string;
  status: string;
  avatar: string;
  location: string;
  freelancerId: string;
}

const ApplicantTable: React.FC = () => {
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // 1. Fetch all jobs by this employer to get their IDs
        const { data: employerJobs } = await supabase
          .from('jobs')
          .select('id, title')
          .eq('employer_id', user.id);
        
        if (!employerJobs || employerJobs.length === 0) {
            setApplicants([]);
            setLoading(false);
            return;
        }

        const jobIds = employerJobs.map(j => j.id);
        const jobMap = employerJobs.reduce((acc, j) => ({ ...acc, [j.id]: j.title }), {} as any);

        // 2. Fetch proposals for these jobs with freelancer profiles joined
        const { data: proposals, error: propError } = await supabase
          .from('proposals')
          .select(`
            id, 
            created_at, 
            status, 
            bid_amount, 
            freelancer_id, 
            job_id,
            profiles:freelancer_id (
              full_name,
              avatar_url,
              location
            )
          `)
          .in('job_id', jobIds)
          .order('created_at', { ascending: false });

        if (propError) throw propError;

        // 3. Format the data for the UI
        const formattedApplicants = (proposals || []).map((p: any) => {
           // If profiles is an array (sometimes happens with certain join types), take the first element
           const profile = Array.isArray(p.profiles) ? p.profiles[0] : p.profiles;
           
           return {
            id: p.id,
            name: profile?.full_name || 'Anonymous',
            job: jobMap[p.job_id] || 'Unknown Job',
            date: new Date(p.created_at).toLocaleDateString(),
            status: p.status ? p.status.charAt(0).toUpperCase() + p.status.slice(1) : 'Pending',
            avatar: profile?.avatar_url || `https://ui-avatars.com/api/?name=${profile?.full_name || 'User'}&background=random`,
            location: profile?.location || 'Remote',
            freelancerId: p.freelancer_id
          };
        });

        setApplicants(formattedApplicants);
      } catch (err) {
        console.error('Error fetching applicants:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-700';
      case 'Interview': return 'bg-blue-100 text-blue-700';
      case 'Shortlisted': return 'bg-green-100 text-green-700';
      case 'Accepted': return 'bg-emerald-100 text-emerald-700';
      case 'Rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading applicants...</div>;
  }

  if (applicants.length === 0) {
    return <div className="p-8 text-center text-gray-500">No applicants found yet.</div>;
  }

  return (
    <div className="w-full overflow-hidden bg-white rounded-xl border border-gray-100 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
        <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold">
          <tr>
            <th className="px-6 py-4">Candidate Name</th>
            <th className="px-6 py-4">Applied Job</th>
            <th className="px-6 py-4">Applied Date</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {applicants?.map((applicant) => (
            <tr key={applicant.id} className="hover:bg-gray-50 transition-colors group">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(`/employer/dashboard/applicants/${applicant.id}`)}>
                  <img src={applicant.avatar} alt={applicant.name} className="w-10 h-10 rounded-full object-cover border border-gray-100" />
                  <div>
                    <p className="font-semibold text-gray-800 hover:text-blue-600 transition-colors">{applicant.name}</p>
                    <p className="text-xs text-gray-500">{applicant.location}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-700 font-medium">{applicant.job}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{applicant.date}</td>
              <td className="px-6 py-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(applicant.status)}`}>
                  {applicant.status}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => navigate(`/employer/dashboard/applicants/${applicant.id}`)}
                    className="p-2 text-gray-500 hover:bg-gray-100 hover:text-blue-600 rounded-lg transition-colors" 
                    title="View Application"
                  >
                    <Eye size={18} />
                  </button>
                  <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Download CV">
                    <Download size={18} />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreHorizontal size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default ApplicantTable;

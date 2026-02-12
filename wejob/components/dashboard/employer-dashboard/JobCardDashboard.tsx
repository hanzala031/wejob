import React from 'react';
import { MapPin, Calendar, MoreVertical, Edit, Trash2, Eye } from 'lucide-react';

interface JobCardDashboardProps {
  job: {
    id: number;
    title: string;
    type: string;
    location: string;
    postedDate: string;
    applicants: number;
    status: 'Active' | 'Closed' | 'Expired';
  };
}

const JobCardDashboard: React.FC<JobCardDashboardProps> = ({ job }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-700 border-green-200';
      case 'Closed': return 'bg-red-100 text-red-700 border-red-200';
      case 'Expired': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border mb-2 ${getStatusColor(job.status)}`}>
            {job.status}
          </span>
          <h3 className="font-bold text-gray-800 text-lg line-clamp-1">{job.title}</h3>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreVertical size={18} />
        </button>
      </div>

      <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-4">
        <span className="flex items-center gap-1">
          <BriefcaseIcon className="w-3.5 h-3.5" /> {job.type}
        </span>
        <span className="flex items-center gap-1">
          <MapPin size={14} /> {job.location}
        </span>
        <span className="flex items-center gap-1">
          <Calendar size={14} /> {job.postedDate}
        </span>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex -space-x-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-500">
              {i}
            </div>
          ))}
          <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-600">
            +{job.applicants > 3 ? job.applicants - 3 : 0}
          </div>
        </div>
        
        <div className="flex gap-2">
          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="View">
            <Eye size={18} />
          </button>
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors" title="Edit">
            <Edit size={18} />
          </button>
          <button className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Delete">
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper icon
const BriefcaseIcon: React.FC<{className?: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
);

export default JobCardDashboard;

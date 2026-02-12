
import React from 'react';
import JobCardDashboard from './JobCardDashboard';
import { Filter } from 'lucide-react';

const mockJobs = [
  { id: 1, title: 'Senior UX Designer', type: 'Full Time', location: 'Remote', postedDate: '2 days ago', applicants: 12, status: 'Active' as const },
  { id: 2, title: 'React Frontend Developer', type: 'Contract', location: 'London, UK', postedDate: '5 days ago', applicants: 28, status: 'Active' as const },
  { id: 3, title: 'Marketing Manager', type: 'Full Time', location: 'New York, USA', postedDate: '1 week ago', applicants: 45, status: 'Closed' as const },
  { id: 4, title: 'Technical Writer', type: 'Part Time', location: 'Remote', postedDate: '2 weeks ago', applicants: 8, status: 'Expired' as const },
];

const PostedJobs: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Posted Jobs</h2>
          <p className="text-sm text-gray-500">Manage your active and closed job listings</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
          <Filter size={16} /> Filter
        </button>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
          {mockJobs.map(job => (
            <JobCardDashboard key={job.id} job={job} />
          ))}
        </div>
      </div>
      
      <div className="p-4 border-t border-gray-200 text-center">
        <button className="text-sm font-semibold text-[#2563eb] hover:text-[#1d4ed8] transition-colors">
          View All Jobs
        </button>
      </div>
    </div>
  );
};

export default PostedJobs;

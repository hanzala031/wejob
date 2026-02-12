
import React from 'react';
import { Calendar, DollarSign, Clock, MoreVertical, CheckCircle } from 'lucide-react';

interface ActiveJob {
  id: number;
  title: string;
  client: string;
  deadline: string;
  price: string;
  status: 'In Progress' | 'Review' | 'Completed' | 'accepted' | 'pending';
  progress: number;
}

interface ActiveJobsProps {
  jobs: ActiveJob[];
  onUpdateJob: (id: number, updates: Partial<ActiveJob>) => void;
}

const ActiveJobs: React.FC<ActiveJobsProps> = ({ jobs, onUpdateJob }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
      case 'In Progress': return 'bg-blue-100 text-blue-700';
      case 'Review': return 'bg-yellow-100 text-yellow-700';
      case 'Completed': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleStatusChange = (id: number, currentStatus: string) => {
    const nextStatus = currentStatus === 'In Progress' ? 'Review' : currentStatus === 'Review' ? 'Completed' : 'In Progress';
    onUpdateJob(id, { status: nextStatus as any });
    // If completing, set progress to 100
    if (nextStatus === 'Completed') {
      onUpdateJob(id, { status: 'Completed', progress: 100 });
    }
  };

  const handleProgressChange = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const progress = parseInt(e.target.value);
    onUpdateJob(id, { progress });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Active Jobs</h2>
          <p className="text-sm text-gray-500">Projects currently in progress</p>
        </div>
        <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">View All</button>
      </div>

      <div className="p-6">
        <div className="space-y-6">
          {jobs?.length > 0 ? jobs?.map(job => (
            <div key={job.id} className="border border-gray-100 rounded-lg p-4 sm:p-5 hover:shadow-sm transition-shadow">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">{job.title}</h3>
                  <p className="text-sm text-gray-500">Client: {job.client}</p>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-2">
                  <button
                    onClick={() => handleStatusChange(job.id, job.status)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer hover:opacity-80 transition-opacity ${getStatusColor(job.status)}`}
                    title="Click to advance status"
                  >
                    {job.status === 'accepted' ? 'In Progress' : job.status}
                  </button>
                  <button className="text-gray-400 hover:text-gray-600 p-1">
                    <MoreVertical size={18} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-gray-400 flex-shrink-0" />
                  <span>Due: {job.deadline}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign size={16} className="text-gray-400 flex-shrink-0" />
                  <span>Budget: {job.price}</span>
                </div>
                <div className="xs:col-span-2 md:col-span-2 flex flex-col justify-center gap-1 mt-2 sm:mt-0">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="flex items-center gap-1"><Clock size={12} /> Progress</span>
                    <span className="font-medium">{job.progress}%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${job.progress}%` }}></div>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={job.progress}
                      onChange={(e) => handleProgressChange(job.id, e)}
                      className="w-16 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      title="Adjust Progress"
                    />
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div className="text-center py-6 text-gray-500">No active jobs found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActiveJobs;

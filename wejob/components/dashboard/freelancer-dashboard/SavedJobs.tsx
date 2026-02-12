
import React from 'react';
import { MapPin, DollarSign, Clock, Trash2, ExternalLink } from 'lucide-react';

interface SavedJob {
  id: string | number;
  title: string;
  client: string;
  location: string;
  budget: string;
  postedDate: string;
}

interface SavedJobsProps {
  jobs: SavedJob[];
  onRemove: (id: string | number) => void;
}

const SavedJobs: React.FC<SavedJobsProps> = ({ jobs, onRemove }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">Saved Jobs</h2>
        <p className="text-sm text-gray-500">Jobs you have bookmarked for later</p>
      </div>
      
      <div className="p-6">
        {jobs?.length > 0 ? (
          <div className="space-y-4">
            {jobs?.map(job => (
              <div key={job.id} className="border border-gray-100 rounded-lg p-5 hover:shadow-md transition-all duration-200 flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-gray-800 text-lg hover:text-blue-600 cursor-pointer">{job.title}</h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">{job.client}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <DollarSign size={16} className="text-gray-400" />
                      <span className="font-medium">{job.budget}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin size={16} className="text-gray-400" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={16} className="text-gray-400" />
                      <span>{job.postedDate}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center md:flex-col justify-end gap-3">
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                        Apply Now <ExternalLink size={14} />
                    </button>
                    <button 
                        onClick={() => onRemove(job.id)}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                    >
                        Remove <Trash2 size={14} />
                    </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No saved jobs</h3>
            <p className="text-gray-500 mt-1">Jobs you save will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedJobs;

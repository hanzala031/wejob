
import React, { useState } from 'react';
import JobTable from '../components/JobTable';
import { Plus, Filter } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const PostedJobs: React.FC = () => {
  const [filter, setFilter] = useState('All');

  const tabs = ['All', 'Active', 'Closed'];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">My Jobs</h1>
          <p className="text-gray-500 text-sm md:text-base">Manage your active and closed job listings</p>
        </div>
        <NavLink 
          to="/employer/dashboard/jobs/create"
          className="flex items-center gap-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-5 py-2.5 rounded-lg font-semibold shadow-sm transition-colors text-sm md:text-base"
        >
          <Plus size={18} /> Post New Job
        </NavLink>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
           <div className="flex items-center p-1 bg-gray-50 rounded-lg border border-gray-100 w-full sm:w-auto overflow-x-auto no-scrollbar">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`flex-1 sm:flex-none px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 whitespace-nowrap ${
                    filter === tab
                      ? 'bg-blue-100 text-blue-700 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
                  }`}
                >
                  {tab === 'All' ? 'All Jobs' : tab}
                </button>
              ))}
           </div>
           <button className="w-full sm:w-auto flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors">
              <Filter size={16} /> Filter
           </button>
        </div>
        <div className="p-0">
          <JobTable filterStatus={filter} />
        </div>
      </div>
    </div>
  );
};

export default PostedJobs;

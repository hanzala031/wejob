
import React from 'react';
import ApplicantTable from '../components/ApplicantTable';
import { Search } from 'lucide-react';

const Applicants: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">All Applicants</h1>
          <p className="text-gray-500">View and manage candidates applied to your jobs</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between gap-4">
           <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search candidates..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
           </div>
           <select className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
              <option>All Jobs</option>
              <option>Senior UX Designer</option>
              <option>React Developer</option>
           </select>
        </div>
        <ApplicantTable />
      </div>
    </div>
  );
};

export default Applicants;

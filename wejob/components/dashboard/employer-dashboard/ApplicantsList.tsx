import React from 'react';
import { MoreHorizontal, Download, Eye, Check, X } from 'lucide-react';

const mockApplicants = [
  { id: 1, name: 'Sarah Jenkins', job: 'Senior UX Designer', date: 'Oct 24, 2023', status: 'Pending', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { id: 2, name: 'Michael Chen', job: 'React Developer', date: 'Oct 23, 2023', status: 'Interview', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { id: 3, name: 'Jessica Lee', job: 'Senior UX Designer', date: 'Oct 22, 2023', status: 'Rejected', avatar: 'https://randomuser.me/api/portraits/women/68.jpg' },
  { id: 4, name: 'David Smith', job: 'Marketing Manager', date: 'Oct 21, 2023', status: 'Shortlisted', avatar: 'https://randomuser.me/api/portraits/men/86.jpg' },
];

const ApplicantsList: React.FC = () => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-700';
      case 'Interview': return 'bg-blue-100 text-blue-700';
      case 'Shortlisted': return 'bg-green-100 text-green-700';
      case 'Rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">Recent Applicants</h2>
        <p className="text-sm text-gray-500">Candidates applying to your jobs</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
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
            {mockApplicants.map((applicant) => (
              <tr key={applicant.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img src={applicant.avatar} alt={applicant.name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <p className="font-semibold text-gray-800">{applicant.name}</p>
                      <p className="text-xs text-gray-500">United States</p>
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
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-1.5 text-gray-500 hover:bg-gray-200 rounded transition-colors" title="View Profile">
                      <Eye size={18} />
                    </button>
                    <button className="p-1.5 text-blue-500 hover:bg-blue-100 rounded transition-colors" title="Download CV">
                      <Download size={18} />
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors">
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

export default ApplicantsList;

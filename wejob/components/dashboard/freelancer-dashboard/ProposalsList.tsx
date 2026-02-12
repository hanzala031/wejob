
import React from 'react';
import { Eye, Clock, Trash2 } from 'lucide-react';

interface Proposal {
    id: string | number;
    job: string;
    client: string;
    date: string;
    bid: string;
    status: string;
}

interface ProposalsListProps {
    proposals: Proposal[];
    onWithdraw?: (id: string | number) => void;
}

const ProposalsList: React.FC<ProposalsListProps> = ({ proposals, onWithdraw }) => {
    const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-700';
      case 'Viewed': return 'bg-blue-100 text-blue-700';
      case 'Accepted': return 'bg-green-100 text-green-700'; // Changed to green
      case 'Shortlisted': return 'bg-green-100 text-green-700';
      case 'Rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">My Proposals</h2>
        <p className="text-sm text-gray-500">Track the status of your sent proposals</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold">
            <tr>
              <th className="px-6 py-4">Job Title</th>
              <th className="px-6 py-4">Client</th>
              <th className="px-6 py-4">Date Sent</th>
              <th className="px-6 py-4">Your Bid</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {proposals?.length > 0 ? proposals?.map((proposal) => (
              <tr key={proposal.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-semibold text-gray-800">{proposal.job}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{proposal.client}</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                        <Clock size={14} /> {proposal.date}
                    </div>
                </td>
                <td className="px-6 py-4 font-medium text-gray-800">{proposal.bid}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(proposal.status)}`}>
                    {proposal.status === 'Accepted' ? 'Approved' : proposal.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="text-gray-400 hover:text-blue-600 transition-colors" title="View Details">
                        <Eye size={18} />
                    </button>
                    {onWithdraw && (
                        <button 
                            onClick={() => onWithdraw(proposal.id)}
                            className="text-gray-400 hover:text-red-600 transition-colors" 
                            title="Withdraw Proposal"
                        >
                            <Trash2 size={18} />
                        </button>
                    )}
                  </div>
                </td>
              </tr>
            )) : (
                <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                        No proposals found. Start applying to jobs!
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProposalsList;

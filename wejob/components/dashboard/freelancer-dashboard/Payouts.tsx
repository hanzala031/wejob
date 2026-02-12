import React from 'react';
import { Download } from 'lucide-react';
import BillingCards from './BillingCards';

interface Transaction {
  id: number;
  date: string;
  description: string;
  amount: string;
  status: 'Completed' | 'Pending' | 'Failed';
}

interface PayoutsProps {
  balance: string;
  totalEarnings: string;
  pendingClearance: string;
  transactions: Transaction[];
  onWithdraw: () => void;
}

const Payouts: React.FC<PayoutsProps> = ({ 
  balance, 
  totalEarnings, 
  pendingClearance, 
  transactions,
  onWithdraw 
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
        case 'Completed': return 'text-green-600 bg-green-100';
        case 'Pending': return 'text-yellow-600 bg-yellow-100';
        case 'Failed': return 'text-red-600 bg-red-100';
        default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
       <BillingCards 
         balance={balance}
         totalEarnings={totalEarnings}
         pendingClearance={pendingClearance}
         onWithdraw={onWithdraw}
       />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Transaction History</h2>
          <button className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-300 px-3 py-1.5 rounded-lg transition-colors">
             <Download size={16} /> Export CSV
          </button>
        </div>
        
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold">
                    <tr>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Description</th>
                        <th className="px-6 py-4">Amount</th>
                        <th className="px-6 py-4">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {transactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 text-sm text-gray-500">{tx.date}</td>
                            <td className="px-6 py-4 text-sm font-medium text-gray-800">{tx.description}</td>
                            <td className={`px-6 py-4 text-sm font-bold ${tx.amount.startsWith('+') ? 'text-green-600' : 'text-gray-800'}`}>
                                {tx.amount}
                            </td>
                            <td className="px-6 py-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(tx.status)}`}>
                                    {tx.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default Payouts;

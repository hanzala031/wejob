
import React from 'react';
import { AlertTriangle } from 'lucide-react';

const Disputes: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700">
      <AlertTriangle size={64} className="text-amber-500 mb-4" />
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dispute Management</h2>
      <p className="text-gray-500 dark:text-gray-400 mt-2">No active disputes to resolve.</p>
    </div>
  );
};

export default Disputes;

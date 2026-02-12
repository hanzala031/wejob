
import React from 'react';
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

interface WalletProps {
  balance: number;
  onWithdraw: () => void;
}

const Wallet: React.FC<WalletProps> = ({ balance, onWithdraw }) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
            <WalletIcon size={24} />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Wallet Balance</h3>
            <p className="text-3xl font-black text-gray-900">${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>
        </div>
        <button 
          onClick={onWithdraw}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center gap-2"
        >
          Withdraw
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
          <div className="flex items-center gap-2 text-green-600 mb-1">
            <ArrowDownLeft size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Total Earned</span>
          </div>
          <p className="text-xl font-bold text-gray-900">$0.00</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <ArrowUpRight size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Withdrawals</span>
          </div>
          <p className="text-xl font-bold text-gray-900">$0.00</p>
        </div>
      </div>
    </div>
  );
};

export default Wallet;

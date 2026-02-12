import React from 'react';

interface BillingCardsProps {
  balance: string;
  totalEarnings: string;
  pendingClearance: string;
  onWithdraw?: () => void;
}

export default function BillingCards({
  balance,
  totalEarnings,
  pendingClearance,
  onWithdraw
}: BillingCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

      {/* Available Balance */}
      <div className="relative flex flex-col justify-between rounded-3xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white shadow-xl">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider opacity-80">
            Available Balance
          </p>

          <h2 className="mt-3 text-4xl font-bold">{balance}</h2>
        </div>

        <button 
          onClick={onWithdraw}
          className="mt-8 rounded-xl bg-white/20 py-2.5 text-sm font-semibold backdrop-blur hover:bg-white/30 transition"
        >
          Withdraw Funds
        </button>
      </div>

      {/* Total Earnings */}
      <div className="flex flex-col justify-between rounded-3xl bg-[#0f172a] p-6 text-white shadow-xl">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
            Total Earnings
          </p>

          <h2 className="mt-3 text-4xl font-bold text-green-400">
            {totalEarnings}
          </h2>

          <p className="mt-2 text-sm text-gray-400">
            Lifetime income generated
          </p>
        </div>

        <div className="text-xs text-gray-500">
          Updated just now
        </div>
      </div>

      {/* Pending Clearance */}
      <div className="flex flex-col justify-between rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
            Pending Clearance
          </p>

          <h2 className="mt-3 text-4xl font-bold text-gray-900">
            {pendingClearance}
          </h2>

          <div className="mt-3 flex items-center gap-2 text-sm text-orange-500">
            <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse"></span>
            Awaiting verification
          </div>
        </div>

        <div className="text-xs text-gray-400">
          Processing
        </div>
      </div>

    </div>
  );
}

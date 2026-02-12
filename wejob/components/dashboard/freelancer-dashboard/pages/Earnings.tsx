import React, { useState, useEffect } from 'react';
import { supabase } from '../../../../supabase';
import { useUser } from '../../../../context/UserContext';
import { Loader2, ArrowUpRight, ArrowDownLeft, DollarSign, Clock, CheckCircle, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

const Earnings: React.FC = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [walletBalance, setWalletBalance] = useState(0);
  const [financials, setFinancials] = useState({
    balance: 0,
    earnings: 0,
    pending: 0
  });
  const [transactions, setTransactions] = useState<any[]>([]);

  const fetchEarningsData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Fetch Wallet Balance from profile
      const { data: profile } = await supabase.from('profiles').select('wallet_balance').eq('id', user.id).single();
      setWalletBalance(Number(profile?.wallet_balance) || 0);

      const { data, error } = await supabase
        .from('earnings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        const available = data
          .filter(tx => tx.status === 'completed')
          .reduce((sum, tx) => tx.type === 'credit' ? sum + (tx.amount || 0) : sum - (tx.amount || 0), 0);
        
        const total = data
          .filter(tx => tx.type === 'credit' && tx.status === 'completed')
          .reduce((sum, tx) => sum + (tx.amount || 0), 0);
        
        const pending = data
          .filter(tx => tx.status === 'pending' && tx.type === 'credit')
          .reduce((sum, tx) => sum + (tx.amount || 0), 0);

        setFinancials({
          balance: available,
          earnings: total,
          pending: pending
        });

        const formattedTransactions = data.map(tx => ({
          id: tx.id,
          date: new Date(tx.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
          description: tx.description,
          amount: tx.amount,
          type: tx.type,
          status: tx.status.charAt(0).toUpperCase() + tx.status.slice(1)
        }));

        setTransactions(formattedTransactions);
      } else {
        setFinancials({ balance: 0, earnings: 0, pending: 0 });
        setTransactions([]);
      }
    } catch (err: any) {
      console.error('Error fetching earnings:', err);
      toast.error("Failed to sync financial data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user?.id) return;
    
    fetchEarningsData();

    const channel = supabase
      .channel(`earnings_${user.id}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'earnings',
        filter: `user_id=eq.${user.id}`
      }, () => {
        fetchEarningsData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const handleWithdrawFunds = async () => {
    if (walletBalance <= 0) {
      toast.error("Insufficient wallet balance for withdrawal");
      return;
    }

    try {
      const { error } = await supabase
        .from('payouts')
        .insert({
          user_id: user?.id,
          amount: walletBalance,
          status: 'pending',
          method: 'Bank Transfer'
        });

      if (error) throw error;
      
      toast.success("Payout request sent! Admin will approve it shortly.");
      fetchEarningsData();
    } catch (err: any) {
      toast.error("Withdrawal failed: " + err.message);
    }
  };

  if (loading && !transactions.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-400">
        <Loader2 className="w-12 h-12 animate-spin mb-4 text-blue-600" />
        <p className="font-bold font-sans">Syncing your ledger...</p>
      </div>
    );
  }

  const formatCurrency = (val: number) => val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Financial Overview</h1>
        <p className="text-gray-500 font-medium">Manage your earnings, wallet, and payouts.</p>
      </div>

      {/* Top Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        
        {/* Main Balance Card */}
        <div className="lg:col-span-2 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 md:p-10 text-white shadow-2xl shadow-blue-200 relative overflow-hidden group">
           <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                  <DollarSign size={18} className="text-blue-100" />
                </div>
                <p className="text-blue-100 text-sm font-bold uppercase tracking-[0.2em]">Available Balance</p>
              </div>
              <h2 className="text-5xl md:text-6xl font-black mt-2 tracking-tighter">${formatCurrency(walletBalance)}</h2>
              <button 
                onClick={handleWithdrawFunds}
                disabled={walletBalance <= 0}
                className="mt-10 bg-white text-blue-600 px-10 py-4 rounded-2xl font-black hover:bg-blue-50 transition-all shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                 Withdraw Funds
              </button>
           </div>
           {/* Decorative Background */}
           <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
           <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-700">
              <DollarSign size={200} />
           </div>
        </div>

        {/* Secondary Stats Vertical Grid */}
        <div className="flex flex-col gap-4">
           <div className="bg-[#0f172a] p-8 rounded-[2rem] text-white shadow-xl relative overflow-hidden group">
              <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">Total Earnings</p>
              <h3 className="text-3xl font-black text-green-400 mt-2">${formatCurrency(financials.earnings)}</h3>
              <div className="mt-4 flex items-center gap-2 text-gray-500 text-xs font-bold">
                <ArrowUpRight size={14} className="text-green-400" />
                Lifetime income generated
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform">
                <CheckCircle size={100} />
              </div>
           </div>
           <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden group">
              <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">Pending Clearance</p>
              <h3 className="text-3xl font-black text-gray-900 mt-2">${formatCurrency(financials.pending)}</h3>
              <div className="mt-4 flex items-center gap-2 text-gray-400 text-xs font-bold">
                <Clock size={14} className="text-orange-400 animate-pulse" />
                Awaiting verification
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform">
                <Clock size={100} />
              </div>
           </div>
        </div>
      </div>

      {/* Transaction History Section */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
         <div className="p-8 border-b border-gray-50 flex justify-between items-center">
            <h3 className="text-xl font-black text-gray-900 tracking-tight">Recent Transactions</h3>
            <button className="text-blue-600 font-black text-sm hover:underline">View All</button>
         </div>
         
         <div className="overflow-x-auto">
            {transactions.length > 0 ? (
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50">
                    <th className="px-10 py-6">Transaction</th>
                    <th className="px-10 py-6">Date</th>
                    <th className="px-10 py-6">Amount</th>
                    <th className="px-10 py-6 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-2xl ${tx.type === 'credit' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'} group-hover:scale-110 transition-transform`}>
                            {tx.type === 'credit' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                          </div>
                          <span className="font-bold text-gray-900">{tx.description}</span>
                        </div>
                      </td>
                      <td className="px-10 py-6 text-sm font-bold text-gray-500">{tx.date}</td>
                      <td className={`px-10 py-6 font-black text-lg ${tx.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                        {tx.type === 'credit' ? '+' : '-'}${formatCurrency(tx.amount)}
                      </td>
                      <td className="px-10 py-6 text-right">
                        <span className={`text-[10px] font-black uppercase px-4 py-1.5 rounded-full tracking-widest ${
                          tx.status === 'Completed' ? 'bg-green-50 text-green-700 border border-green-100' : 
                          tx.status === 'Pending' ? 'bg-yellow-50 text-yellow-700 border border-yellow-100' : 
                          'bg-red-50 text-red-700 border border-red-100'
                        }`}>{tx.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-32 text-center text-gray-400">
                <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <FileText size={32} className="text-gray-200" />
                </div>
                <p className="font-black text-gray-900 text-xl tracking-tight">No transactions found</p>
                <p className="text-sm mt-2 font-medium">Your financial history will appear here once you start earning.</p>
              </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default Earnings;
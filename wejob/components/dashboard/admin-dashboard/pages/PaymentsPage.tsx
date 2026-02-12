import React, { useState, useEffect } from 'react';
import { DollarSign, ArrowUpRight, Clock, CheckCircle, XCircle, Search, Filter, Loader2 } from 'lucide-react';
import { supabase } from '../../../../supabase';
import { toast } from 'react-hot-toast';

interface PayoutRequest {
  id: string;
  user_id: string;
  amount: number;
  method: string;
  status: string;
  created_at: string;
  profiles: { full_name: string };
}

const PaymentsPage: React.FC = () => {
  const [requests, setRequests] = useState<PayoutRequest[]>([]);
  const [stats, setStats] = useState({ earnings: 0, pending: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // 1. Fetch Payout Requests
      const { data, error } = await supabase
        .from('payouts')
        .select('*, profiles:user_id(full_name)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);

      // 2. Fetch Stats
      const { data: statsData } = await supabase.from('admin_stats').select('*').single();
      if (statsData) {
        setStats({
          earnings: statsData.total_revenue,
          pending: data?.filter(r => r.status === 'pending').reduce((acc, r) => acc + r.amount, 0) || 0,
          total: statsData.total_revenue * 5 // Mocking a total volume
        });
      }
    } catch (err) {
      console.error('Payment Fetch Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, userId: string, amount: number, status: 'processed' | 'rejected') => {
    try {
      setLoading(true);
      
      if (status === 'processed') {
        // 1. Get current balance
        const { data: profile } = await supabase.from('profiles').select('wallet_balance').eq('id', userId).single();
        const currentBalance = Number(profile?.wallet_balance || 0);

        if (currentBalance < amount) {
          toast.error("Insufficient user balance to approve this payout.");
          return;
        }

        // 2. Deduct from Profile
        const { error: balanceError } = await supabase
          .from('profiles')
          .update({ wallet_balance: currentBalance - amount })
          .eq('id', userId);
        
        if (balanceError) throw balanceError;
      }

      // 3. Update Payout Status
      const { error } = await supabase
        .from('payouts')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      setRequests(prev => prev.map(req => req.id === id ? { ...req, status } : req));
      toast.success(`Payout ${status === 'processed' ? 'Approved & Deducted' : 'Rejected'}`);
      fetchData();
    } catch (err: any) {
      toast.error('Operation failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin text-[#2563EB]" size={40} /></div>;

  const statCards = [
    { label: 'Total Platform Earnings', value: `$${stats.earnings.toLocaleString()}`, icon: <DollarSign />, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Pending Withdrawals', value: `$${stats.pending.toLocaleString()}`, icon: <Clock />, color: 'text-amber-400', bg: 'bg-amber-400/10' },
    { label: 'Total Volume', value: `$${stats.total.toLocaleString()}`, icon: <ArrowUpRight />, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-white">Payments & Payouts</h1>
        <p className="text-slate-400">Manage platform revenue and freelancer withdrawals.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
              {stat.icon}
            </div>
            <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
            <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-700">
          <h3 className="text-lg font-bold text-white">Withdrawal Requests</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900/50 text-slate-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Freelancer</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Method</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4 text-white font-medium">{req.profiles?.full_name}</td>
                  <td className="px-6 py-4 text-white">${req.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-slate-400">{req.method}</td>
                  <td className="px-6 py-4 text-slate-400">{new Date(req.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-xs font-bold uppercase tracking-widest">
                    <span className={req.status === 'pending' ? 'text-amber-400' : req.status === 'processed' ? 'text-emerald-400' : 'text-red-400'}>
                      {req.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {req.status === 'pending' && (
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleAction(req.id, req.user_id, req.amount, 'processed')} 
                          className="p-1.5 text-emerald-400 hover:bg-emerald-400/10 rounded-lg"
                          title="Approve & Deduct"
                        >
                          <CheckCircle size={20} />
                        </button>
                        <button 
                          onClick={() => handleAction(req.id, req.user_id, req.amount, 'rejected')} 
                          className="p-1.5 text-red-400 hover:bg-red-400/10 rounded-lg"
                          title="Reject"
                        >
                          <XCircle size={20} />
                        </button>
                      </div>
                    )}
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

export default PaymentsPage;

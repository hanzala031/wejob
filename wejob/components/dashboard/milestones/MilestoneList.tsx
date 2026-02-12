
import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, DollarSign, Send, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../../../supabase';
import toast from 'react-hot-toast';

interface Milestone {
  id: string;
  title: string;
  amount: number;
  status: 'pending' | 'funded' | 'submitted' | 'released' | 'cancelled';
  description: string;
  freelancer_id: string;
  employer_id: string;
}

interface MilestoneListProps {
  jobId: string;
  role: 'freelancer' | 'employer';
}

const MilestoneList: React.FC<MilestoneListProps> = ({ jobId, role }) => {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchMilestones();
  }, [jobId]);

  const fetchMilestones = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('milestones')
        .select('*')
        .eq('job_id', jobId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMilestones(data || []);
    } catch (err: any) {
      console.error('Error fetching milestones:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFund = async (milestone: Milestone) => {
    try {
      setActionLoading(milestone.id);
      
      // Simulate Stripe Payment Intent creation and success
      const { error: paymentError } = await supabase.from('payments').insert({
        milestone_id: milestone.id,
        amount: milestone.amount,
        status: 'succeeded',
        stripe_payment_intent_id: 'pi_' + Math.random().toString(36).substr(2, 9)
      });

      if (paymentError) throw paymentError;

      const { error: milestoneError } = await supabase
        .from('milestones')
        .update({ status: 'funded' })
        .eq('id', milestone.id);

      if (milestoneError) throw milestoneError;

      toast.success(`Milestone funded: $${milestone.amount}`);
      fetchMilestones();
    } catch (err: any) {
      toast.error('Funding failed: ' + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleSubmitWork = async (milestoneId: string) => {
    try {
      setActionLoading(milestoneId);
      const { error } = await supabase
        .from('milestones')
        .update({ status: 'submitted' })
        .eq('id', milestoneId);

      if (error) throw error;
      toast.success('Work submitted for review!');
      fetchMilestones();
    } catch (err: any) {
      toast.error('Submission failed: ' + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRelease = async (milestone: Milestone) => {
    try {
      setActionLoading(milestone.id);
      
      // 1. Get current freelancer balance
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('wallet_balance')
        .eq('id', milestone.freelancer_id)
        .single();

      if (profileError) throw profileError;

      // 2. Update freelancer balance
      const newBalance = (Number(profile.wallet_balance) || 0) + Number(milestone.amount);
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ wallet_balance: newBalance })
        .eq('id', milestone.freelancer_id);

      if (updateError) throw updateError;

      // 3. Update milestone status
      const { error: milestoneError } = await supabase
        .from('milestones')
        .update({ status: 'released' })
        .eq('id', milestone.id);

      if (milestoneError) throw milestoneError;

      toast.success(`Payment released: $${milestone.amount}`);
      fetchMilestones();
    } catch (err: any) {
      toast.error('Release failed: ' + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Pending</span>;
      case 'funded': return <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Funded (Escrow)</span>;
      case 'submitted': return <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Under Review</span>;
      case 'released': return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Paid</span>;
      default: return <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{status}</span>;
    }
  };

  if (loading) return <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto text-blue-600" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-black text-gray-900">Project Milestones</h3>
        <p className="text-xs text-gray-500 italic">Payments are held securely in escrow</p>
      </div>

      {milestones.length === 0 ? (
        <div className="p-8 text-center border-2 border-dashed border-gray-100 rounded-3xl text-gray-400">
          No milestones defined for this project.
        </div>
      ) : (
        <div className="space-y-3">
          {milestones.map((m) => (
            <div key={m.id} className="bg-white border border-gray-100 p-5 rounded-[2rem] shadow-sm hover:shadow-md transition-all group">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${m.status === 'released' ? 'bg-green-100 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                    <DollarSign size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{m.title}</h4>
                    <p className="text-xs text-gray-500 font-medium">${m.amount.toLocaleString()} • {getStatusBadge(m.status)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {role === 'employer' && m.status === 'pending' && (
                    <button 
                      onClick={() => handleFund(m)}
                      disabled={!!actionLoading}
                      className="flex-1 sm:flex-none bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-100"
                    >
                      {actionLoading === m.id ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                      Fund Escrow
                    </button>
                  )}

                  {role === 'freelancer' && m.status === 'funded' && (
                    <button 
                      onClick={() => handleSubmitWork(m.id)}
                      disabled={!!actionLoading}
                      className="flex-1 sm:flex-none bg-yellow-500 text-white px-6 py-2 rounded-xl font-bold hover:bg-yellow-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-yellow-100"
                    >
                      {actionLoading === m.id ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                      Submit Work
                    </button>
                  )}

                  {role === 'employer' && m.status === 'submitted' && (
                    <button 
                      onClick={() => handleRelease(m)}
                      disabled={!!actionLoading}
                      className="flex-1 sm:flex-none bg-green-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-green-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-100"
                    >
                      {actionLoading === m.id ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                      Release Payment
                    </button>
                  )}

                  {m.status === 'released' && (
                    <div className="flex items-center gap-1 text-green-600 font-bold text-sm px-4">
                      <CheckCircle size={16} /> Paid
                    </div>
                  )}
                </div>
              </div>
              
              {m.description && (
                <p className="mt-3 text-sm text-gray-500 pl-14 leading-relaxed line-clamp-1 group-hover:line-clamp-none transition-all">
                  {m.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MilestoneList;

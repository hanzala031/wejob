import React, { useEffect, useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { supabase } from '../../../supabase';
import { CheckCircle, XCircle, Loader2, User, MessageSquare } from 'lucide-react';
import ChatUI from '../../ChatUI';

interface Proposal {
  id: string;
  job_id: string;
  freelancer_id: string;
  bid_amount: number;
  estimated_time: string;
  cover_letter: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  profiles?: {
    full_name: string;
    avatar_url: string;
  };
}

interface JobBidsListProps {
  jobId: string;
}

const JobBidsList: React.FC<JobBidsListProps> = ({ jobId }) => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [activeChat, setActiveChat] = useState<{ id: string, name: string } | null>(null);

  useEffect(() => {
    fetchProposals();
  }, [jobId]);

  const fetchProposals = async () => {
    try {
      setLoading(true);
      // Fetch proposals with explicit column names
      const { data: proposalsData, error: proposalsError } = await supabase
        .from('proposals')
        .select('id, job_id, freelancer_id, bid_amount, estimated_time, cover_letter, status, created_at')
        .eq('job_id', jobId)
        .order('created_at', { ascending: false });

      if (proposalsError) throw proposalsError;

      // Fetch profiles separately to avoid join issues
      const proposalsWithProfiles = await Promise.all((proposalsData || []).map(async (prop: any) => {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('full_name, avatar_url')
          .eq('id', prop.freelancer_id)
          .single();
        
        return {
          ...prop,
          profiles: profileData || { full_name: 'Anonymous Freelancer', avatar_url: null }
        };
      }));

      setProposals(proposalsWithProfiles as Proposal[]);
    } catch (error: any) {
      console.error('Error fetching proposals:', error);
      toast.error('Failed to load proposals.');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptProposal = async (proposalId: string) => {
    try {
      setActionLoading(proposalId);
      
      // Get proposal details first to know the freelancer
      const proposal = proposals.find(p => p.id === proposalId);
      if (!proposal) throw new Error("Proposal not found");

      // 1. Update the proposal status
      const { error: propError } = await supabase
        .from('proposals')
        .update({ status: 'accepted' })
        .eq('id', proposalId);

      if (propError) throw propError;

      // 2. Update the job status to 'filled'
      const { error: jobError } = await supabase
        .from('jobs')
        .update({ status: 'filled' })
        .eq('id', jobId);

      if (jobError) throw jobError;

      // 3. Reject other pending proposals for this job
      await supabase
        .from('proposals')
        .update({ status: 'rejected' })
        .eq('job_id', jobId)
        .eq('status', 'pending')
        .not('id', 'eq', proposalId);

      // 4. Send notification to the freelancer
      await supabase
        .from('notifications')
        .insert([{
          user_id: proposal.freelancer_id,
          title: 'Proposal Accepted!',
          message: `Congratulations! Your proposal for "${jobId}" has been accepted.`,
          type: 'hired'
          // link: `/freelancer/dashboard/projects` // Temporarily removed to avoid 400 error
        }]);

      toast.success('Contract Started Successfully!');
      
      // 5. Open chat with freelancer after a short delay
      setTimeout(() => {
        setActiveChat({ 
          id: proposal.freelancer_id, 
          name: proposal.profiles?.full_name || 'Freelancer' 
        });
      }, 1500);

      fetchProposals(); // Refresh the list
    } catch (error: any) {
      console.error('Error accepting proposal:', error);
      toast.error('Failed to accept proposal.');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return (
    <div className="flex justify-center p-12">
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
    </div>
  );

  if (proposals.length === 0) return (
    <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
      <p className="text-gray-500 font-medium">No proposals received yet for this job.</p>
    </div>
  );

  return (
    <div className="space-y-4">
      <Toaster position="top-right" />
      <h3 className="text-xl font-bold text-gray-900 mb-4">Received Proposals ({proposals?.length || 0})</h3>
      
      {proposals?.map((prop) => (
        <div key={prop.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 overflow-hidden shrink-0">
                {prop.profiles?.avatar_url ? (
                  <img src={prop.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <User size={24} />
                )}
              </div>
              <div>
                <h4 className="font-bold text-gray-900">{prop.profiles?.full_name || 'Anonymous Freelancer'}</h4>
                <p className="text-sm text-gray-500 mb-3">Submitted on {new Date(prop.created_at).toLocaleDateString()}</p>
                <div className="bg-gray-50 p-4 rounded-xl text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">
                  {prop.cover_letter}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-4 shrink-0">
              <div className="text-right">
                <p className="text-2xl font-black text-gray-900">${prop.bid_amount}</p>
                <p className="text-xs text-gray-500 font-medium">{prop.estimated_time}</p>
                <span className={`mt-2 inline-block text-xs font-bold uppercase px-2 py-1 rounded-md ${
                  prop.status === 'accepted' ? 'bg-green-100 text-green-700' :
                  prop.status === 'rejected' ? 'bg-red-100 text-red-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  {prop.status === 'accepted' ? 'Successful' : prop.status}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setActiveChat({ id: prop.freelancer_id, name: prop.profiles?.full_name || 'Freelancer' })}
                  className="p-2.5 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition-all border border-gray-100"
                  title="Message Freelancer"
                >
                  <MessageSquare size={20} />
                </button>

                {prop.status === 'accepted' ? (
                  <span className="flex items-center gap-2 text-green-600 font-bold px-4 py-2">
                    <CheckCircle size={18} /> Accepted
                  </span>
                ) : (
                  <button
                    onClick={() => handleAcceptProposal(prop.id.toString())}
                    disabled={!!actionLoading}
                    className="bg-blue-600 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    {actionLoading === prop.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle size={18} />}
                    Accept
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Real-time Chat Popup */}
      {activeChat && (
        <div className="fixed bottom-6 right-6 z-[100]">
          <ChatUI 
            jobId={jobId} 
            receiverId={activeChat.id} 
            receiverName={activeChat.name}
            onClose={() => setActiveChat(null)} 
          />
        </div>
      )}
    </div>
  );
};

export default JobBidsList;

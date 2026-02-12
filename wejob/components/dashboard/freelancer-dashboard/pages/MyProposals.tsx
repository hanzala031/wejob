import React, { useState, useEffect } from 'react';
import ProposalsList from '../ProposalsList';
import { supabase } from '../../../../supabase';
import { toast } from 'react-hot-toast';

const MyProposals: React.FC = () => {
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let user_id: string;

    const fetchProposals = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        user_id = user.id;

        const { data, error } = await supabase
          .from('proposals')
          .select(`id, bid_amount, status, created_at, job_id`)
          .eq('freelancer_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
           console.warn('Proposals fetch warning:', error.message);
           setProposals([]);
        } else {
           const formattedProposals = await Promise.all((data as any[]).map(async (p) => {
            const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(p.job_id);
            
            if (!isUUID) {
              return {
                id: p.id,
                job: 'Dummy Project',
                client: 'Mock Employer',
                date: new Date(p.created_at).toLocaleDateString(),
                bid: `$${p.bid_amount}`,
                status: p.status ? p.status.charAt(0).toUpperCase() + p.status.slice(1) : 'Pending'
              };
            }

            const { data: jobData } = await supabase
              .from('jobs')
              .select('title, employer_id')
              .eq('id', p.job_id)
              .maybeSingle();

            let clientName = 'Anonymous Client';
            if (jobData?.employer_id) {
              const { data: profileData } = await supabase
                .from('profiles')
                .select('company_name, full_name')
                .eq('id', jobData.employer_id)
                .maybeSingle();
              clientName = profileData?.company_name || profileData?.full_name || 'Anonymous Client';
            }

            return {
              id: p.id,
              job: jobData?.title || 'Unknown Job',
              client: clientName,
              date: new Date(p.created_at).toLocaleDateString(),
              bid: `$${p.bid_amount}`,
              status: p.status ? p.status.charAt(0).toUpperCase() + p.status.slice(1) : 'Pending'
            };
          }));
          setProposals(formattedProposals);
        }
      } catch (err) {
        console.warn('Error in fetchProposals wrapper:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();

    // Real-time subscription for proposal status changes
    const channel = supabase
      .channel('freelancer-proposals-status')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'proposals',
          filter: `freelancer_id=eq.${user_id!}`,
        },
        (payload) => {
          // Instantly update the status in the UI
          setProposals((current) => 
            current.map(p => p.id === payload.new.id 
              ? { ...p, status: payload.new.status.charAt(0).toUpperCase() + payload.new.status.slice(1) } 
              : p
            )
          );

          if (payload.new.status === 'accepted') {
            toast.success("🎉 Congratulations! Your proposal has been accepted successfully!", {
              duration: 6000,
              position: 'top-center'
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleWithdrawProposal = async (id: string | number) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this proposal? This action cannot be undone.");
    if (!isConfirmed) return;

    const loadingToast = toast.loading("Deleting proposal...");

    try {
      // 1. Backend Delete Request
      const { error } = await supabase
        .from('proposals')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // 2. Success Actions: Update State & Count
      setProposals((current) => current.filter((p) => p.id !== id));
      
      toast.success("Proposal deleted successfully!", { id: loadingToast });
    } catch (err: any) {
      console.error('Delete operation failed:', err.message);
      toast.error("Failed to delete. Please try again.", { id: loadingToast });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">My Proposals</h1>
        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">{proposals.length} Submitted</span>
      </div>
      <ProposalsList proposals={proposals} onWithdraw={handleWithdrawProposal} />
    </div>
  );
};

export default MyProposals;

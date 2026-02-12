import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import DashboardStats from './DashboardStats';
import RecentActivities from './RecentActivities';
import ActiveJobs from './ActiveJobs';
import ProposalsList from './ProposalsList';
import FreelancerProfile from './FreelancerProfile';
import SavedJobs from './SavedJobs';
import Payouts from './Payouts';
import { supabase } from '../../../supabase';
import { useUser } from '../../../context/UserContext';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const DashboardHome: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { profile, user, loading: contextLoading } = useUser();

  const [activeJobs, setActiveJobs] = useState<any[]>([]);
  const [proposals, setProposals] = useState<any[]>([]);
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [financials, setFinancials] = useState({
    balance: "$0.00",
    earnings: "$0.00",
    pending: "$0.00"
  });
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        console.log("DashboardHome Root: Fetching data for user ID:", user.id);

        // Fetch Earnings
        const { data: earningsData } = await supabase
          .from('earnings')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (earningsData) {
          console.log("DashboardHome Root: Fetched Earnings:", earningsData);
          const available = earningsData
            .filter(tx => tx.status === 'completed')
            .reduce((sum, tx) => tx.type === 'credit' ? sum + (tx.amount || 0) : sum - (tx.amount || 0), 0);
          
          const total = earningsData
            .filter(tx => tx.type === 'credit' && tx.status === 'completed')
            .reduce((sum, tx) => sum + (tx.amount || 0), 0);
          
          const pending = earningsData
            .filter(tx => tx.status === 'pending' && tx.type === 'credit')
            .reduce((sum, tx) => sum + (tx.amount || 0), 0);

          setFinancials({
            balance: `$${available.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
            earnings: `$${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
            pending: `$${pending.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
          });

          setTransactions(earningsData.map(tx => ({
            id: tx.id,
            date: new Date(tx.created_at).toLocaleDateString(),
            description: tx.description,
            amount: `${tx.type === 'credit' ? '+' : '-'}$${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
            status: tx.status.charAt(0).toUpperCase() + tx.status.slice(1)
          })));
        }

        // Fetch Proposals
        const { data: proposalsData } = await supabase
          .from('proposals')
          .select('*, jobs(title, profiles:employer_id(company_name))')
          .eq('freelancer_id', user.id);
        
        if (proposalsData) {
          setProposals(proposalsData.map(p => ({
            id: p.id,
            job: p.jobs?.title || 'Unknown Job',
            client: p.jobs?.profiles?.company_name || 'Unknown Client',
            date: new Date(p.created_at).toLocaleDateString(),
            bid: `$${p.amount}`,
            status: p.status ? p.status.charAt(0).toUpperCase() + p.status.slice(1) : 'Pending'
          })));
        }

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (!contextLoading) {
      fetchData();
    }
  }, [user, contextLoading]);

  // Derived Stats
  const stats = {
      earnings: financials.earnings,
      completedJobs: transactions.filter(t => t.status === 'Completed' && t.amount.startsWith('+')).length,
      proposalsSent: proposals.length,
      views: "0"
  };

  const handleWithdrawFunds = () => {
    toast.success("Withdrawal request initiated successfully!");
  };

  if (contextLoading || (loading && user)) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
              <p className="text-gray-500">Welcome back, {profile?.first_name || 'Freelancer'}!</p>
            </div>
            <DashboardStats stats={stats} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                {activeJobs.length > 0 ? (
                  <ActiveJobs jobs={activeJobs} onUpdateJob={() => {}} />
                ) : (
                  <div className="bg-white p-8 rounded-xl border border-gray-100 text-center text-gray-400 font-medium">No active projects</div>
                )}
              </div>
              <div className="lg:col-span-1">
                <RecentActivities />
              </div>
            </div>
            <ProposalsList proposals={proposals} onWithdraw={() => {}} />
          </div>
        );
      case 'payouts':
          return (
              <div className="space-y-6 animate-in fade-in duration-500">
                  <h1 className="text-2xl font-bold text-gray-800 mb-6">Payouts & Earnings</h1>
                  <Payouts 
                    balance={financials.balance}
                    totalEarnings={financials.earnings}
                    pendingClearance={financials.pending}
                    transactions={transactions}
                    onWithdraw={handleWithdrawFunds}
                  />
                  {transactions.length === 0 && (
                    <div className="bg-white p-12 rounded-xl border border-dashed border-gray-200 text-center text-gray-500">
                      No transactions found
                    </div>
                  )}
              </div>
          );
      default:
        return <div className="p-8 text-center text-gray-500 font-bold">Please use the sidebar to navigate.</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Topbar 
          onMenuClick={() => setIsSidebarOpen(true)} 
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardHome;

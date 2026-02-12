import React, { useState, useEffect } from 'react';
import { supabase } from '../../../../supabase';
import { 
  CreditCard, 
  History, 
  Landmark, 
  ShieldCheck, 
  Settings as SettingsIcon, 
  Download, 
  Plus, 
  AlertCircle,
  CheckCircle2,
  Wallet
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Payment {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  description?: string;
  payment_method?: string;
}

interface Milestone {
  id: string;
  title: string;
  amount: number;
  status: string;
  due_date: string;
  job: {
    title: string;
  };
  freelancer: {
    full_name: string;
  }
}

const BillingSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('methods');
  const [loading, setLoading] = useState(false);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [escrowMilestones, setEscrowMilestones] = useState<Milestone[]>([]);
  
  // Mock Settings State
  const [settings, setSettings] = useState({
    autoBilling: false,
    taxId: '',
    billingAddress: ''
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (activeTab === 'history') {
        // Fetch payments
        // Note: This assumes a relationship or structure where we can link payments to the employer
        // For now we might need to mock if the direct link isn't established in the schema provided
        // We will try to fetch from 'payments' via milestones
        const { data, error } = await supabase
          .from('payments')
          .select(`
            *,
            milestones!inner (
              employer_id,
              title
            )
          `)
          .eq('milestones.employer_id', user.id)
          .order('created_at', { ascending: false });

        if (!error && data) {
           const formatted = data.map((p: any) => ({
             id: p.id,
             amount: p.amount,
             status: p.status,
             created_at: p.created_at,
             description: p.milestones?.title || 'Payment',
             payment_method: 'Credit Card' // Mocked for now
           }));
           setPayments(formatted);
        }
      } else if (activeTab === 'escrow') {
        // Fetch funded milestones
        const { data, error } = await supabase
          .from('milestones')
          .select(`
            *,
            jobs (title),
            profiles:freelancer_id (full_name)
          `)
          .eq('employer_id', user.id)
          .eq('status', 'funded');

        if (!error && data) {
          // Map the data to match the Milestone interface
          const mappedData: Milestone[] = data.map((item: any) => ({
            id: item.id,
            title: item.title,
            amount: item.amount,
            status: item.status,
            due_date: item.due_date,
            job: {
              title: item.jobs?.title || 'Unknown Job'
            },
            freelancer: {
              full_name: item.profiles?.full_name || 'Unknown Freelancer'
            }
          }));
          setEscrowMilestones(mappedData);
        }
      }
    } catch (error) {
      console.error('Error fetching billing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = () => {
    // Save to local state or backend
    toast.success('Billing settings saved successfully');
  };

  const tabs = [
    { id: 'methods', label: 'Payment Methods', icon: <CreditCard size={18} /> },
    { id: 'history', label: 'Billing History', icon: <History size={18} /> },
    { id: 'escrow', label: 'Escrow & Deposits', icon: <ShieldCheck size={18} /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon size={18} /> },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Billing & Payments</h1>
        <p className="text-gray-500 mt-1">Manage your payment methods, view history, and handle escrow funds.</p>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-gray-200 no-scrollbar">
        <div className="flex space-x-6 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-4 px-1 border-b-2 transition-colors font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {/* PAYMENT METHODS */}
        {activeTab === 'methods' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Credit Card */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                    <CreditCard size={24} />
                  </div>
                  <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full uppercase">Primary</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900">Credit / Debit Card</h3>
                <p className="text-sm text-gray-500 mt-1 mb-6">Visa ending in 4242 • Exp 12/28</p>
                <div className="flex gap-3">
                  <button className="flex-1 py-2 px-4 bg-gray-50 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 text-sm">
                    Edit
                  </button>
                  <button className="flex-1 py-2 px-4 bg-white text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors border border-red-100 text-sm">
                    Remove
                  </button>
                </div>
              </div>

              {/* PayPal */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-blue-50 text-[#003087] rounded-lg">
                    <Wallet size={24} />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900">PayPal</h3>
                <p className="text-sm text-gray-500 mt-1 mb-6">Not connected</p>
                <button className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-sm">
                  Connect PayPal
                </button>
              </div>

              {/* Bank Wire */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-blue-50 text-gray-700 rounded-lg">
                    <Landmark size={24} />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900">Bank Wire</h3>
                <p className="text-sm text-gray-500 mt-1 mb-6">Direct bank transfer for large amounts.</p>
                <button className="w-full py-2 px-4 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors border border-blue-200 text-sm">
                  Add Bank Account
                </button>
              </div>

              {/* Add New Method */}
              <button className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all group min-h-[200px]">
                <div className="p-4 bg-gray-50 text-gray-400 rounded-full group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors mb-3">
                  <Plus size={24} />
                </div>
                <span className="font-medium text-gray-600 group-hover:text-blue-700">Add New Payment Method</span>
              </button>
            </div>
          </div>
        )}

        {/* BILLING HISTORY */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden animate-in fade-in duration-300">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-medium">
                    <th className="py-4 px-6">Date</th>
                    <th className="py-4 px-6">Description</th>
                    <th className="py-4 px-6">Payment Method</th>
                    <th className="py-4 px-6">Amount</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Invoice</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr><td colSpan={6} className="text-center py-8">Loading history...</td></tr>
                  ) : payments.length > 0 ? (
                    payments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-6 text-gray-600">{new Date(payment.created_at).toLocaleDateString()}</td>
                        <td className="py-4 px-6 font-medium text-gray-900">{payment.description}</td>
                        <td className="py-4 px-6 text-gray-500 flex items-center gap-2">
                          <CreditCard size={14} />
                          {payment.payment_method}
                        </td>
                        <td className="py-4 px-6 font-bold text-gray-900">${payment.amount.toFixed(2)}</td>
                        <td className="py-4 px-6">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                            payment.status === 'succeeded' || payment.status === 'completed' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {payment.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1">
                            <Download size={14} /> PDF
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                     <tr>
                      <td colSpan={6} className="text-center py-12 text-gray-500">
                        <div className="flex flex-col items-center gap-3">
                          <div className="p-3 bg-gray-100 rounded-full">
                            <History size={24} className="text-gray-400" />
                          </div>
                          <p>No payment history found.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ESCROW & DEPOSITS */}
        {activeTab === 'escrow' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-center gap-3 mb-2">
                  <ShieldCheck className="opacity-80" />
                  <span className="font-medium opacity-80">Total in Escrow</span>
                </div>
                <div className="text-3xl font-bold">
                  ${escrowMilestones.reduce((acc, curr) => acc + curr.amount, 0).toFixed(2)}
                </div>
                <p className="text-blue-100 text-sm mt-4">
                  Funds are held safely until you approve the work.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm lg:col-span-2">
                <h3 className="font-bold text-gray-900 mb-4">Active Escrows</h3>
                <div className="space-y-4">
                  {loading ? (
                    <p>Loading escrow data...</p>
                  ) : escrowMilestones.length > 0 ? (
                    escrowMilestones.map((milestone) => (
                      <div key={milestone.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <div>
                          <p className="font-bold text-gray-900">{milestone.job.title} - {milestone.title}</p>
                          <p className="text-sm text-gray-500">Freelancer: {milestone.freelancer.full_name}</p>
                          <p className="text-xs text-gray-400 mt-1">Due: {milestone.due_date ? new Date(milestone.due_date).toLocaleDateString() : 'No due date'}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-gray-900">${milestone.amount}</p>
                          <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-full mt-1">
                            {milestone.status}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <ShieldCheck className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                      <p>No funds currently in escrow.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SETTINGS */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl animate-in fade-in duration-300">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-8">
              
              {/* Automatic Billing */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-gray-900">Automatic Billing</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Automatically charge your primary payment method for weekly contracts.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={settings.autoBilling}
                    onChange={(e) => setSettings({...settings, autoBilling: e.target.checked})}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <hr className="border-gray-100" />

              {/* Tax Information */}
              <div className="space-y-4">
                <h3 className="font-bold text-gray-900">Tax Information</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">VAT / GST / Tax ID</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="e.g. US123456789"
                    value={settings.taxId}
                    onChange={(e) => setSettings({...settings, taxId: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Billing Address</label>
                  <textarea 
                    rows={3}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Full address for invoices"
                    value={settings.billingAddress}
                    onChange={(e) => setSettings({...settings, billingAddress: e.target.value})}
                  />
                </div>
              </div>

              <div className="pt-4">
                <button 
                  onClick={handleSaveSettings}
                  className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Save Changes
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BillingSettings;

import React, { useState, useEffect } from 'react';
import { supabase } from '../../../../supabase';
import { Loader2, Download, CreditCard, Banknote, History, FileText, Info, Smartphone, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

// --- Types ---
interface BillingHistoryProps {
  userId: string | undefined;
}

interface BillingInfoProps {
  userId: string | undefined;
}

interface PayoutMethodsProps {
  userId: string | undefined;
}

interface StatementsProps {
  userId: string | undefined;
}

// --- Sub-Components ---

// 1. Billing Info Component
const BillingInfo: React.FC<BillingInfoProps> = ({ userId }) => {
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState({
    full_name: '',
    billing_address: '',
    tax_id: '',
    country: 'Pakistan'
  });

  useEffect(() => {
    if (!userId) return;
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, billing_address, tax_id, country')
        .eq('id', userId)
        .single();
      
      if (data) {
        setInfo({
          full_name: data.full_name || '',
          billing_address: data.billing_address || '',
          tax_id: data.tax_id || '',
          country: data.country || 'Pakistan'
        });
      }
    };
    fetchProfile();
  }, [userId]);

  const saveInfo = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('profiles').update({
        full_name: info.full_name,
        billing_address: info.billing_address,
        tax_id: info.tax_id,
        country: info.country
      }).eq('id', userId);

      if (error) throw error;
      toast.success("Billing information updated!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-[2rem] border border-gray-100 p-8 md:p-12 shadow-sm max-w-2xl animate-in fade-in duration-300">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Full Name</label>
            <input 
              type="text" 
              value={info.full_name}
              onChange={e => setInfo({...info, full_name: e.target.value})}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
              placeholder="Enter your full name" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">VAT / GST Number</label>
            <input 
              type="text" 
              value={info.tax_id}
              onChange={e => setInfo({...info, tax_id: e.target.value})}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
              placeholder="e.g. GB123456789" 
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Billing Address</label>
          <textarea 
            rows={3} 
            value={info.billing_address}
            onChange={e => setInfo({...info, billing_address: e.target.value})}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
            placeholder="Street, City, Postcode" 
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Country</label>
           <input 
              type="text" 
              value={info.country}
              onChange={e => setInfo({...info, country: e.target.value})}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
              placeholder="Country" 
            />
        </div>
        <div className="pt-4">
          <button 
            onClick={saveInfo}
            disabled={loading}
            className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95 disabled:opacity-70 flex items-center gap-2"
          >
            {loading && <Loader2 className="animate-spin" size={18} />}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

// 2. Billing History Component
const BillingHistory: React.FC<BillingHistoryProps> = ({ userId }) => {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    if (!userId) return;
    setLoading(true);
    // Fetching from 'earnings' table as per previous context
    const { data } = await supabase.from('earnings').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    setList(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchHistory();
    
    // Real-time listener for history
    const channel = supabase
      .channel('billing_history_updates')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'earnings' 
      }, () => {
        fetchHistory();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  if (loading) return <div className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-blue-600" /></div>;

  return (
    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden animate-in fade-in duration-300">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
              <th className="py-6 px-8">Date</th>
              <th className="py-6 px-8">Type</th>
              <th className="py-6 px-8">Description</th>
              <th className="py-6 px-8">Amount</th>
              <th className="py-6 px-8">Status</th>
              <th className="py-6 px-8 text-right">Invoice</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {list.length > 0 ? list.map((item) => (
              <tr key={item.id} className="text-sm hover:bg-gray-50/50 transition-colors group">
                <td className="py-5 px-8 font-bold text-gray-500">{new Date(item.created_at).toLocaleDateString()}</td>
                <td className="py-5 px-8">
                  <span className={`font-black uppercase text-[10px] px-2 py-1 rounded ${item.type === 'credit' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    {item.type}
                  </span>
                </td>
                <td className="py-5 px-8 text-gray-900 font-bold">{item.description || 'Transaction'}</td>
                <td className={`py-5 px-8 font-black text-base ${item.type === 'withdrawal' || item.type === 'debit' ? 'text-red-600' : 'text-green-600'}`}>
                   {item.type === 'withdrawal' || item.type === 'debit' ? '-' : '+'}${item.amount}
                </td>
                <td className="py-5 px-8">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    item.status === 'completed' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-yellow-50 text-yellow-700 border border-yellow-100'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="py-5 px-8 text-right">
                  <button className="text-blue-600 hover:text-blue-800 transition-colors flex items-center justify-end gap-1 font-bold">
                    <Download size={14} /> PDF
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} className="text-center py-32 text-gray-400 italic">
                  <History size={48} className="mx-auto mb-4 opacity-10" />
                  <p className="font-bold text-gray-900 not-italic">No transactions found.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// 3. Payout Methods Component
const PayoutMethods: React.FC<PayoutMethodsProps> = ({ userId }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeMethod, setActiveMethod] = useState<'paypal' | 'jazzcash' | 'easypaisa'>('paypal');
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [methods, setMethods] = useState<any[]>([]);

  useEffect(() => {
    if (userId) fetchMethods();
  }, [userId]);

  const fetchMethods = async () => {
    const { data } = await supabase.from('payment_methods').select('*').eq('user_id', userId);
    setMethods(data || []);
  };

  const handleLinkMethod = (type: 'paypal' | 'jazzcash' | 'easypaisa') => {
    setActiveMethod(type);
    setIdentifier('');
    setModalOpen(true);
  };

  const linkAccount = async () => {
    if (!identifier) return toast.error(`Please enter your ${activeMethod === 'paypal' ? 'email' : 'phone number'}`);
    setLoading(true);
    try {
      const { error } = await supabase.from('payment_methods').insert([
        { 
          user_id: userId, 
          method_type: activeMethod, 
          account_identifier: identifier,
          is_primary: methods.length === 0
        }
      ]);

      if (error) throw error;
      
      toast.success(`${activeMethod === 'paypal' ? 'PayPal' : activeMethod === 'jazzcash' ? 'JazzCash' : 'EasyPaisa'} Linked successfully!`);
      setModalOpen(false);
      setIdentifier('');
      fetchMethods();
    } catch (error: any) {
      toast.error("Failed to link: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getMethodIcon = (type: string) => {
    switch(type) {
        case 'paypal': return <FileText size={28} />;
        case 'jazzcash': return <Smartphone size={28} />;
        case 'easypaisa': return <Smartphone size={28} />;
        default: return <Banknote size={28} />;
    }
  };

  const getMethodColor = (type: string) => {
    switch(type) {
        case 'paypal': return 'bg-blue-50 text-[#003087]';
        case 'jazzcash': return 'bg-red-50 text-red-600';
        case 'easypaisa': return 'bg-green-50 text-green-600';
        default: return 'bg-gray-50 text-gray-600';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Existing Methods List */}
      {methods.length > 0 && (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {methods.map((method) => (
                <div key={method.id} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col justify-between items-start gap-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                    {method.method_type === 'paypal' ? <FileText size={100}/> : <Smartphone size={100}/>}
                    </div>
                    <div className="flex justify-between w-full relative z-10">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${getMethodColor(method.method_type)}`}>
                        {getMethodIcon(method.method_type)}
                    </div>
                    {method.is_primary && <span className="text-[10px] font-black uppercase text-white bg-blue-600 px-3 py-1 rounded-full h-fit">Primary</span>}
                    </div>
                    <div className="relative z-10">
                    <p className="font-black text-xl text-gray-900 capitalize">{method.method_type.replace('_', ' ')}</p>
                    <p className="text-sm text-gray-500 font-medium mt-1">{method.account_identifier}</p>
                    </div>
                </div>
            ))}
         </div>
      )}

      <h3 className="font-bold text-gray-900 text-lg px-2">Add Payment Method</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* PayPal Card */}
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col justify-between items-start gap-6 group hover:border-blue-200 transition-all">
          <div className="flex justify-between w-full">
            <div className="w-14 h-14 bg-blue-50 text-[#003087] rounded-2xl flex items-center justify-center">
              <span className="font-black text-xl">P</span>
            </div>
          </div>
          <div>
            <p className="font-black text-xl text-gray-900">PayPal Account</p>
            <p className="text-sm text-gray-500 font-medium mt-1">Withdraw funds to your PayPal wallet globally.</p>
          </div>
          <button 
            onClick={() => handleLinkMethod('paypal')}
            className="w-full py-4 bg-gray-50 text-blue-600 font-black rounded-xl hover:bg-blue-50 transition-all border border-gray-100 group-hover:border-blue-100 flex items-center justify-center gap-2"
          >
            <Plus size={18}/> Link PayPal
          </button>
        </div>

        {/* JazzCash Card */}
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col justify-between items-start gap-6 group hover:border-red-200 transition-all">
          <div className="flex justify-between w-full">
            <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center">
              <span className="font-black text-xl">J</span>
            </div>
          </div>
          <div>
            <p className="font-black text-xl text-gray-900">JazzCash</p>
            <p className="text-sm text-gray-500 font-medium mt-1">Instant withdrawals to your JazzCash mobile account.</p>
          </div>
          <button 
            onClick={() => handleLinkMethod('jazzcash')}
            className="w-full py-4 bg-gray-50 text-red-600 font-black rounded-xl hover:bg-red-50 transition-all border border-gray-100 group-hover:border-red-100 flex items-center justify-center gap-2"
          >
            <Plus size={18}/> Link JazzCash
          </button>
        </div>

        {/* EasyPaisa Card */}
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col justify-between items-start gap-6 group hover:border-green-200 transition-all">
          <div className="flex justify-between w-full">
            <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
              <span className="font-black text-xl">E</span>
            </div>
          </div>
          <div>
            <p className="font-black text-xl text-gray-900">EasyPaisa</p>
            <p className="text-sm text-gray-500 font-medium mt-1">Seamless payments via EasyPaisa mobile wallet.</p>
          </div>
          <button 
            onClick={() => handleLinkMethod('easypaisa')}
            className="w-full py-4 bg-gray-50 text-green-600 font-black rounded-xl hover:bg-green-50 transition-all border border-gray-100 group-hover:border-green-100 flex items-center justify-center gap-2"
          >
            <Plus size={18}/> Link EasyPaisa
          </button>
        </div>

        {/* Bank Card Placeholder */}
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col justify-between items-start gap-6 group hover:border-blue-200 transition-all opacity-60">
           <div className="flex justify-between w-full">
             <div className="w-14 h-14 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center">
               <Banknote size={28} />
             </div>
             <span className="text-[10px] font-black uppercase text-gray-400 bg-gray-50 px-3 py-1 rounded-full">Coming Soon</span>
           </div>
           <div>
             <p className="font-black text-xl text-gray-900">Bank Transfer</p>
             <p className="text-sm text-gray-500 font-medium mt-1">Direct local bank withdrawals.</p>
           </div>
           <button disabled className="w-full py-4 bg-gray-50 text-gray-400 font-black rounded-xl cursor-not-allowed border border-gray-100">
             Unavailable
           </button>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
             <h3 className="text-2xl font-black text-gray-900 mb-2">
                 Link {activeMethod === 'paypal' ? 'PayPal' : activeMethod === 'jazzcash' ? 'JazzCash' : 'EasyPaisa'}
             </h3>
             <p className="text-gray-500 mb-6">
                 Enter your {activeMethod === 'paypal' ? 'email address' : 'mobile number'} to receive payouts.
             </p>
             
             <input 
               type={activeMethod === 'paypal' ? 'email' : 'text'} 
               className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none mb-4"
               placeholder={activeMethod === 'paypal' ? 'you@example.com' : '03XXXXXXXXX'}
               value={identifier}
               onChange={(e) => setIdentifier(e.target.value)}
             />
             
             <div className="flex gap-3">
               <button 
                 onClick={() => setModalOpen(false)}
                 className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200"
               >
                 Cancel
               </button>
               <button 
                 onClick={linkAccount}
                 disabled={loading}
                 className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 flex justify-center"
               >
                 {loading ? <Loader2 className="animate-spin" /> : 'Link Account'}
               </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 4. Statements Component
const Statements: React.FC<StatementsProps> = () => (
    <div className="bg-gray-50 p-16 rounded-[3rem] text-center border border-dashed border-gray-200 max-w-3xl mx-auto animate-in fade-in duration-300">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-gray-50">
        <FileText size={32} className="text-gray-300" />
        </div>
        <p className="text-gray-900 font-black text-xl">Tax & Earning Statements</p>
        <p className="text-gray-500 mt-2 font-medium max-w-sm mx-auto">Your monthly earning statements and tax summaries will appear here once you start completing projects.</p>
        <button className="mt-8 bg-white border-2 border-gray-900 text-gray-900 px-8 py-3 rounded-2xl font-black hover:bg-gray-900 hover:text-white transition-all active:scale-95">
        Generate 2026 Report
        </button>
    </div>
);

// --- Main Component ---

const BillingAndPayments = () => {
  const [activeTab, setActiveTab] = useState('payout');
  const [userId, setUserId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id);
    };
    getUser();
  }, []);

  const tabs = [
    { id: 'history', label: 'Billing History', icon: <History size={16} /> },
    { id: 'info', label: 'Billing Info', icon: <Info size={16} /> },
    { id: 'payout', label: 'Payout Methods', icon: <CreditCard size={16} /> },
    { id: 'statements', label: 'Statements', icon: <FileText size={16} /> },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Billing and Payments</h1>
        <p className="text-gray-500 font-medium">Manage your invoices, payout methods, and tax information.</p>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex border-b border-gray-100 overflow-x-auto no-scrollbar space-x-8 text-sm font-bold text-gray-400">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-4 transition-all flex items-center gap-2 whitespace-nowrap border-b-2 ${
              activeTab === tab.id 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent hover:text-gray-600'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === 'history' && <BillingHistory userId={userId} />}
        {activeTab === 'info' && <BillingInfo userId={userId} />}
        {activeTab === 'payout' && <PayoutMethods userId={userId} />}
        {activeTab === 'statements' && <Statements userId={userId} />}
      </div>
    </div>
  );
};

export default BillingAndPayments;

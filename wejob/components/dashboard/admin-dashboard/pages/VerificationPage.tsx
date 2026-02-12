
import React, { useState, useEffect } from 'react';
import { FileText, ExternalLink, Check, Shield, Loader2, XCircle, UserCheck } from 'lucide-react';
import { supabase } from '../../../../supabase';
import { toast } from 'react-hot-toast';

interface KYCRequest {
  id: string;
  document_url: string;
  portfolio_url: string;
  status: string;
  created_at: string;
  profiles: {
    full_name: string;
    role: string;
  };
}

const VerificationPage: React.FC = () => {
  const [requests, setRequests] = useState<KYCRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('kyc_requests')
        .select('*, profiles:user_id(full_name, role)')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (err) {
      console.error('KYC Fetch Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id: string, newStatus: 'verified' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('kyc_requests')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      setRequests(prev => prev.filter(req => req.id !== id));
      toast.success(`User verification ${newStatus}`);
    } catch (err) {
      toast.error('Operation failed');
    }
  };

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
      <Loader2 className="animate-spin text-[#2563eb]" size={40} />
      <p className="text-slate-500 font-medium">Checking verification queue...</p>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Identity Verification</h1>
          <p className="text-slate-500 font-medium mt-1">Review user KYC documents and portfolios.</p>
        </div>
        <div className="flex items-center gap-2 px-5 py-2.5 bg-[#2563EB]/10 text-[#2563EB] rounded-2xl border border-[#2563EB]/20 text-sm font-black uppercase tracking-widest">
          <UserCheck size={18} />
          {requests.length} Requests Pending
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="bg-white rounded-[2rem] border border-slate-200 p-20 text-center shadow-sm">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="text-emerald-500" size={40} />
          </div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Queue is Empty</h3>
          <p className="text-slate-500 font-medium mt-2 max-w-md mx-auto">There are no pending identity verification requests at this time. All users are up to date.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {requests.map((req) => (
            <div key={req.id} className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-xl hover:shadow-[#2563eb]/5 transition-all duration-300 group">
              <div className="p-8 flex-1">
                <div className="flex items-center gap-5 mb-8">
                  <div className="w-16 h-16 bg-[#2563EB] rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-lg shadow-[#2563eb]/20 group-hover:scale-110 transition-transform">
                    {req.profiles?.full_name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <h3 className="text-slate-900 font-black text-lg leading-tight">{req.profiles?.full_name || 'Anonymous User'}</h3>
                    <p className="text-[#2563EB] text-xs font-black uppercase tracking-widest mt-1">{req.profiles?.role}</p>
                    <p className="text-slate-400 text-[10px] font-bold mt-1">Requested: {new Date(req.created_at).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-3 flex items-center gap-2">
                      <FileText size={12} className="text-[#2563eb]" /> Documents
                    </p>
                    <a 
                      href={req.document_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group/doc hover:border-[#2563eb] transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <Shield className="text-slate-400 group-hover/doc:text-[#2563eb]" size={20} />
                        <span className="text-sm font-bold text-slate-600">KYC_ID_Document</span>
                      </div>
                      <ExternalLink size={14} className="text-slate-300 group-hover/doc:text-[#2563eb]" />
                    </a>
                  </div>

                  {req.portfolio_url && (
                    <div>
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-3 flex items-center gap-2">
                        <ExternalLink size={12} className="text-[#2563eb]" /> Portfolio
                      </p>
                      <a 
                        href={req.portfolio_url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-sm font-bold text-[#2563EB] hover:underline break-all"
                      >
                        {req.portfolio_url}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 bg-slate-50/50 border-t border-slate-100 grid grid-cols-2 gap-4">
                <button 
                  onClick={() => handleVerify(req.id, 'verified')}
                  className="flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-black shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                >
                  <Check size={18} /> Verify
                </button>
                <button 
                  onClick={() => handleVerify(req.id, 'rejected')}
                  className="flex items-center justify-center gap-2 py-3 bg-white text-red-500 border border-red-100 hover:bg-red-50 rounded-xl text-sm font-black active:scale-95 transition-all"
                >
                  <XCircle size={18} /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VerificationPage;

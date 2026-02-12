
import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock, Search, Loader2, CheckCircle2, UserX, ShieldAlert, History } from 'lucide-react';
import { supabase } from '../../../../supabase';
import { toast } from 'react-hot-toast';

interface Report {
  id: string;
  reason: string;
  status: string;
  created_at: string;
  reported: { full_name: string };
  reporter: { full_name: string };
}

interface AdminLog {
  id: string;
  action: string;
  created_at: string;
  profiles: { full_name: string };
}

const ReportsLogsPage: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [reportsData, logsData] = await Promise.all([
        supabase.from('reports').select('*, reported:reported_user_id(full_name), reporter:reporter_id(full_name)').order('created_at', { ascending: false }),
        supabase.from('admin_logs').select('*, profiles:admin_id(full_name)').order('created_at', { ascending: false }).limit(15)
      ]);

      setReports(reportsData.data || []);
      setLogs(logsData.data || []);
    } catch (err) {
      console.error('Reports Fetch Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewReport = async (id: string) => {
    try {
      const { error } = await supabase.from('reports').update({ status: 'reviewed' }).eq('id', id);
      if (error) throw error;
      setReports(prev => prev.map(r => r.id === id ? { ...r, status: 'reviewed' } : r));
      toast.success('Report marked as reviewed');
    } catch (err) {
      toast.error('Failed to update report');
    }
  };

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
      <Loader2 className="animate-spin text-[#2563eb]" size={40} />
      <p className="text-slate-500 font-medium">Analyzing platform logs...</p>
    </div>
  );

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Security & Activity</h1>
          <p className="text-slate-500 font-medium mt-1">Monitor platform reports and administrative history.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        {/* Reports Table Section */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-red-500/10 rounded-lg text-red-600">
              <ShieldAlert size={20} />
            </div>
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">User Reports</h3>
          </div>
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-black uppercase tracking-widest text-[10px]">
                  <tr>
                    <th className="px-8 py-5">Target / Reporter</th>
                    <th className="px-8 py-5">Violation Reason</th>
                    <th className="px-8 py-5">Date</th>
                    <th className="px-8 py-5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {reports.length === 0 ? (
                    <tr><td colSpan={4} className="px-8 py-20 text-center text-slate-400 font-medium italic">No security reports filed.</td></tr>
                  ) : (
                    reports.map((report) => (
                      <tr key={report.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-8 py-6">
                          <div className="font-bold text-slate-900 group-hover:text-[#2563eb] transition-colors">{report.reported?.full_name}</div>
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mt-0.5">By {report.reporter?.full_name}</div>
                        </td>
                        <td className="px-8 py-6">
                          <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full font-bold text-xs">{report.reason}</span>
                        </td>
                        <td className="px-8 py-6 text-slate-500 font-medium">{new Date(report.created_at).toLocaleDateString()}</td>
                        <td className="px-8 py-6 text-right">
                          {report.status === 'pending' ? (
                            <button 
                              onClick={() => handleReviewReport(report.id)}
                              className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black rounded-xl hover:bg-[#2563eb] transition-all uppercase tracking-widest"
                            >
                              Review
                            </button>
                          ) : (
                            <div className="flex items-center justify-end gap-1.5 text-emerald-600 font-black text-[10px] uppercase tracking-widest">
                              <CheckCircle2 size={14} /> Reviewed
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* System Activity Log Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-[#2563eb]/10 rounded-lg text-[#2563eb]">
              <History size={20} />
            </div>
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Admin Activity</h3>
          </div>
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm relative">
            <div className="absolute left-10 top-10 bottom-10 w-px bg-slate-100"></div>
            <div className="space-y-8">
              {logs.length === 0 ? (
                <p className="pl-10 text-slate-400 font-medium italic">No administrative logs recorded.</p>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="relative pl-10 flex items-start gap-4 group">
                    <div className="absolute left-0 w-5 h-5 rounded-full border-4 border-white bg-[#2563eb] shadow-lg shadow-blue-500/20 z-10"></div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="text-slate-900 text-sm font-black leading-tight">{log.profiles?.full_name}</h4>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter bg-slate-50 px-2 py-0.5 rounded-md">{new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-slate-500 text-xs font-medium mt-1">{log.action}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsLogsPage;

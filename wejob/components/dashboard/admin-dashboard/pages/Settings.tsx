import React, { useState } from 'react';
import { Shield, Bell, Globe, Database, Save, Loader2, Server, Lock } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminSettings: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    platformName: 'WEJOB',
    maintenanceMode: false,
    publicSignups: true,
    minWithdrawal: 50,
    adminEmail: 'admin@wejob.org'
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simulate API call to save settings (could be a 'site_settings' table)
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Configuration updated successfully');
    } catch (err) {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Configuration</h1>
          <p className="text-slate-500 font-medium mt-1">Manage global platform rules and environment variables.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 px-8 py-3.5 bg-[#2563EB] hover:bg-[#1d4ed8] text-white rounded-2xl font-black shadow-lg shadow-blue-500/30 active:scale-95 transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          Save Configuration
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Settings Form */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-8">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-6">
              <div className="p-2.5 bg-[#2563eb]/10 rounded-xl text-[#2563eb]">
                <Globe size={20} />
              </div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">General Settings</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Platform Name</label>
                <input 
                  type="text" 
                  value={settings.platformName}
                  onChange={e => setSettings({...settings, platformName: e.target.value})}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-[#2563eb] outline-none font-bold text-slate-700 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Support Email</label>
                <input 
                  type="email" 
                  value={settings.adminEmail}
                  onChange={e => setSettings({...settings, adminEmail: e.target.value})}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-[#2563eb] outline-none font-bold text-slate-700 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[1.5rem] border border-slate-100">
                <div>
                  <p className="font-black text-slate-900 text-sm uppercase">Maintenance Mode</p>
                  <p className="text-xs text-slate-500 font-medium">Temporarily disable public access</p>
                </div>
                <button 
                  onClick={() => setSettings({...settings, maintenanceMode: !settings.maintenanceMode})}
                  className={`w-12 h-6 rounded-full transition-colors relative ${settings.maintenanceMode ? 'bg-red-500' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.maintenanceMode ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>
              <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[1.5rem] border border-slate-100">
                <div>
                  <p className="font-black text-slate-900 text-sm uppercase">Public Registration</p>
                  <p className="text-xs text-slate-500 font-medium">Allow new user signups</p>
                </div>
                <button 
                  onClick={() => setSettings({...settings, publicSignups: !settings.publicSignups})}
                  className={`w-12 h-6 rounded-full transition-colors relative ${settings.publicSignups ? 'bg-emerald-500' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.publicSignups ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="space-y-8">
          <div className="bg-slate-900 p-8 rounded-[2rem] text-white shadow-xl shadow-blue-900/20">
            <div className="flex items-center gap-3 mb-8">
              <Server className="text-[#2563eb]" size={24} />
              <h3 className="text-lg font-black uppercase tracking-tighter">Infrastructure</h3>
            </div>
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-white/5">
                <span className="text-slate-400 text-xs font-bold uppercase">Supabase API</span>
                <span className="text-emerald-400 text-xs font-black">ACTIVE</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-white/5">
                <span className="text-slate-400 text-xs font-bold uppercase">Database Nodes</span>
                <span className="text-slate-200 text-xs font-black">AWS-US-EAST-1</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-xs font-bold uppercase">SSL Certificate</span>
                <span className="text-blue-400 text-xs font-black">VALID</span>
              </div>
            </div>
          </div>

          <div className="bg-[#2563eb]/10 p-8 rounded-[2rem] border border-[#2563eb]/20 group hover:bg-[#2563eb] transition-all duration-500">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="text-[#2563eb] group-hover:text-white transition-colors" size={24} />
              <h3 className="text-lg font-black uppercase tracking-tighter text-slate-900 group-hover:text-white transition-colors">Admin Access</h3>
            </div>
            <p className="text-sm font-medium text-slate-500 group-hover:text-blue-100 transition-colors mb-6">Modify root-level permissions and 2FA authentication protocols.</p>
            <button className="text-xs font-black uppercase tracking-widest text-[#2563eb] bg-white px-5 py-2.5 rounded-xl group-hover:shadow-lg transition-all">Manage Keys</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;

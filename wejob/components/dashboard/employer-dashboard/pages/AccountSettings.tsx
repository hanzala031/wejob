import React, { useState, useEffect } from 'react';
import {
  Lock, Bell, Shield, CreditCard, Globe, Smartphone,
  Camera, Upload, Trash2, Plus, Check, AlertCircle, Users,
  LogOut, Monitor, Mail, MapPin, FileText, Loader2, Key, CheckCircle, ToggleLeft, ToggleRight
} from 'lucide-react';
import { supabase } from '../../../../supabase';
import { useUser } from '../../../../context/UserContext';

// --- Types ---
type TabType = 'account' | 'billing' | 'security' | 'team' | 'preferences' | 'notifications';

// --- Sub-Components ---

const SectionHeader = ({ title, desc }: { title: string; desc: string }) => (
  <div className="mb-6">
    <h3 className="text-xl font-extrabold text-gray-900">{title}</h3>
    <p className="text-sm text-gray-500">{desc}</p>
  </div>
);

// 1. Account / Profile Settings (Personal)
const AccountInfo = ({ showToast }: { showToast: (msg: string, type: 'success' | 'error') => void }) => {
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: ''
  });

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        setFormData({
          fullName: profile?.full_name || '',
          phone: profile?.phone_number || '',
          email: user.email || ''
        });
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from('profiles').update({
      full_name: formData.fullName,
      phone_number: formData.phone
    }).eq('id', user.id);

    if (error) {
      showToast(error.message, 'error');
    } else {
      showToast('Account information updated!', 'success');
    }
  };

  if (loading) return <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto text-blue-600" /></div>;

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <SectionHeader title="Account Info" desc="Update your business name, email, and primary contact details." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Full Name</label>
          <input 
            type="text" value={formData.fullName} 
            onChange={e => setFormData({...formData, fullName: e.target.value})}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Email Address (Read-only)</label>
          <input type="email" value={formData.email} disabled className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-400 cursor-not-allowed" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Phone Number</label>
          <input 
            type="text" value={formData.phone} 
            onChange={e => setFormData({...formData, phone: e.target.value})}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
          />
        </div>
      </div>
      <button type="submit" className="bg-blue-600 text-white font-black px-8 py-3.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
        Update Account
      </button>
    </form>
  );
};



// 3. Security Tab
const SecurityTab = ({ showToast }: { showToast: (msg: string, type: 'success' | 'error') => void }) => {
  const [loading, setLoading] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) return showToast('Passwords do not match', 'error');
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: passwords.new });
    setLoading(false);
    if (error) showToast(error.message, 'error');
    else {
      showToast('Password updated successfully!', 'success');
      setPasswords({ current: '', new: '', confirm: '' });
    }
  };

  return (
    <div className="space-y-8">
      <SectionHeader title="Security" desc="Change your password and set up two-factor authentication." />
      
      <form onSubmit={handleUpdate} className="space-y-6 max-w-xl">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 flex items-center gap-2"><Lock size={16} className="text-gray-400"/> New Password</label>
          <input 
            type="password" required value={passwords.new} 
            onChange={e => setPasswords({...passwords, new: e.target.value})}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 flex items-center gap-2"><Check size={16} className="text-gray-400"/> Confirm Password</label>
          <input 
            type="password" required value={passwords.confirm} 
            onChange={e => setPasswords({...passwords, confirm: e.target.value})}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
          />
        </div>
        <button disabled={loading} className="bg-gray-900 text-white font-black px-8 py-3.5 rounded-xl hover:bg-black transition-all flex items-center gap-2">
          {loading ? <Loader2 className="animate-spin" size={18} /> : <Key size={18} />}
          Update Password
        </button>
      </form>

      <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h4 className="font-bold text-gray-900">Two-Factor Authentication</h4>
          <p className="text-sm text-gray-500">Protect your account with an extra layer of security.</p>
        </div>
        <button className="bg-blue-100 text-blue-700 font-bold px-6 py-3 rounded-xl hover:bg-blue-200 transition-all">
          Enable 2FA
        </button>
      </div>
    </div>
  );
};

// 4. Team Management
const TeamTab = ({ showToast }: { showToast: (msg: string, type: 'success' | 'error') => void }) => {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('employer_id', user.id);
      
      if (error) throw error;
      setMembers(data || []);
    } catch (err: any) {
      console.error('Team Fetch Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Remove this team member?')) return;
    try {
      const { error } = await supabase.from('team_members').delete().eq('id', id);
      if (error) throw error;
      setMembers(prev => prev.filter(m => m.id !== id));
      showToast('Member removed successfully', 'success');
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  if (loading) return <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto text-blue-600" /></div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <SectionHeader title="Team Members" desc="Invite and manage permissions for your team members." />
        <button className="bg-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 flex items-center gap-2 mb-6">
          <Plus size={20}/> Invite
        </button>
      </div>
      
      <div className="space-y-4">
        {members.length === 0 ? (
          <div className="p-10 text-center border-2 border-dashed border-gray-100 rounded-3xl text-gray-400">
            No team members added yet.
          </div>
        ) : (
          members.map((m, i) => (
            <div key={m.id} className="flex items-center justify-between p-5 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all group">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black bg-blue-100 text-blue-700`}>
                  {m.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{m.name}</p>
                  <p className="text-xs text-gray-500">{m.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full uppercase tracking-wider">{m.role}</span>
                <button onClick={() => handleDelete(m.id)} className="text-gray-300 hover:text-red-500 transition-colors p-2"><Trash2 size={18}/></button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// 5. Preferences
const PreferencesTab = ({ showToast }: { showToast: (msg: string, type: 'success' | 'error') => void }) => (
  <div className="space-y-8">
    <SectionHeader title="Preferences" desc="Configure your site language, currency, and display mode." />
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700">Display Language</label>
        <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer">
          <option>English (US)</option>
          <option>Spanish</option>
          <option>French</option>
        </select>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700">Primary Currency</label>
        <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer">
          <option>USD ($)</option>
          <option>EUR (€)</option>
          <option>GBP (£)</option>
        </select>
      </div>
    </div>

    <div className="space-y-4">
      <label className="text-sm font-bold text-gray-700">Appearance</label>
      <div className="flex gap-6">
        <div className="flex-1 p-4 border-2 border-blue-600 bg-blue-50 rounded-2xl cursor-pointer">
          <div className="w-full h-12 bg-white rounded-lg mb-3 shadow-sm"></div>
          <p className="text-center font-bold text-blue-700 text-sm">Light Mode</p>
        </div>
        <div className="flex-1 p-4 border border-gray-100 bg-gray-50 rounded-2xl cursor-pointer hover:border-gray-200 grayscale">
          <div className="w-full h-12 bg-gray-900 rounded-lg mb-3 shadow-sm"></div>
          <p className="text-center font-bold text-gray-400 text-sm">Dark Mode</p>
        </div>
      </div>
    </div>

    <div className="pt-6">
       <button onClick={() => showToast('Preferences updated!', 'success')} className="bg-blue-600 text-white font-black px-8 py-3.5 rounded-xl hover:bg-blue-700 transition-all">
          Save Preferences
       </button>
    </div>
  </div>
);

const Switch = ({ checked, onChange, label, desc }: { checked: boolean; onChange: (val: boolean) => void; label: string; desc: string }) => (
  <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100 hover:border-gray-200 transition-all cursor-pointer group" onClick={() => onChange(!checked)}>
    <div className="flex gap-4 items-center">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${checked ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-white text-gray-400 border border-gray-100 group-hover:bg-gray-50'}`}>
        <Bell size={20} />
      </div>
      <div>
        <p className="font-black text-gray-900">{label}</p>
        <p className="text-xs text-gray-500 font-bold">{desc}</p>
      </div>
    </div>
    <button className={`w-14 h-8 rounded-full transition-all relative flex items-center px-1 ${checked ? 'bg-blue-600' : 'bg-gray-200'}`}>
      <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-all transform ${checked ? 'translate-x-6' : 'translate-x-0'}`} />
    </button>
  </div>
);

// 6. Notifications Tab
const NotificationsTab = () => {
  const { profile, updateProfileSetting } = useUser();

  // Cast profile to any to handle potential missing types in UserProfile interface
  const p = profile as any;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <SectionHeader title="Notification Preferences" desc="Control how you receive alerts about job bids, messages, and security updates." />
      
      <div className="space-y-4">
        <Switch 
          label="Email Notifications" 
          desc="Receive summaries of activity and important alerts via email."
          checked={!!p?.email_notifications} 
          onChange={(val) => updateProfileSetting('email_notifications', val)} 
        />
        
        <Switch 
          label="Browser Notifications" 
          desc="Get real-time push notifications in your browser while working."
          checked={!!p?.browser_notifications} 
          onChange={(val) => updateProfileSetting('browser_notifications', val)} 
        />

        <Switch 
          label="SMS Alerts" 
          desc="Receive urgent updates about payments and security via SMS."
          checked={!!p?.sms_notifications} 
          onChange={(val) => updateProfileSetting('sms_notifications', val)} 
        />
      </div>

      <div className="bg-blue-50/50 rounded-3xl p-6 border border-blue-100/50 flex gap-4">
        <div className="text-blue-600 shrink-0"><AlertCircle size={20}/></div>
        <p className="text-sm text-blue-700 font-medium">
          You can also configure individual notification settings for each project from your dashboard.
        </p>
      </div>
    </div>
  );
};

// --- Main Page Component ---

const AccountSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('account');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const menu = [
    { id: 'account', label: 'Account Info', icon: <Lock size={18} /> },
    { id: 'security', label: 'Security', icon: <Shield size={18} /> },
    { id: 'team', label: 'Team Members', icon: <Users size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'preferences', label: 'Preferences', icon: <Globe size={18} /> },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Revamp your account settings and preferences.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Sidebar Nav */}
        <div className="w-full lg:w-72 flex-shrink-0 bg-white rounded-3xl shadow-sm border border-gray-50 p-3 sticky top-24">
          <nav className="flex flex-row lg:flex-col overflow-x-auto no-scrollbar gap-1">
            {menu.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as TabType)}
                className={`flex items-center gap-3 px-5 py-4 text-sm font-black transition-all rounded-2xl whitespace-nowrap ${
                  activeTab === item.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
                  : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="flex-1 w-full bg-white rounded-[2rem] shadow-sm border border-gray-50 p-6 md:p-10">
          {activeTab === 'account' && <AccountInfo showToast={showToast} />}
          {activeTab === 'security' && <SecurityTab showToast={showToast} />}
          {activeTab === 'team' && <TeamTab showToast={showToast} />}
          {activeTab === 'notifications' && <NotificationsTab />}
          {activeTab === 'preferences' && <PreferencesTab showToast={showToast} />}
        </div>
      </div>

      {toast && (
        <div className={`fixed bottom-10 right-10 px-8 py-4 rounded-2xl shadow-2xl text-white font-black flex items-center gap-3 z-50 animate-in slide-in-from-right-10 ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.type === 'success' ? <Check size={20}/> : <AlertCircle size={20}/>}
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default AccountSettings;

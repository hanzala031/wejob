import React, { useState, useEffect } from 'react';
import { 
  User, Lock, Bell, Shield, CreditCard, Globe, Smartphone, 
  Camera, Upload, Trash2, Plus, Check, AlertCircle, Eye, EyeOff,
  LogOut, Monitor, Loader2, Briefcase, Mail, DollarSign, ArrowUpRight, ArrowDownLeft, Moon, Sun
} from 'lucide-react';
import { supabase } from '../../../../supabase';
import { useUser } from '../../../../context/UserContext';
import toast from 'react-hot-toast';
import BillingCards from '../BillingCards';

type TabType = 'profile' | 'notifications' | 'security' | 'billing' | 'preferences';

// --- Sub-Components ---

// 1. Profile Settings
const ProfileSettings = () => {
  const { setProfile: setGlobalProfile, user } = useUser();
  const [profile, setProfile] = useState({
    name: "",
    title: "",
    bio: "",
    avatar: "",
    videoLink: "",
    skills: [] as string[],
  });
  const [newSkill, setNewSkill] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (data && !error) {
        setProfile({
          name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          title: data.professional_title || "",
          bio: data.bio || "",
          avatar: data.avatar_url || "",
          videoLink: data.video_url || "",
          skills: data.skills || [],
        });
      }
    };
    fetchProfile();
  }, [user]);

  const uploadAvatar = async (file: File) => {
    if (!user) return;
    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setProfile(prev => ({ ...prev, avatar: publicUrl }));
      setGlobalProfile(prev => prev ? { ...prev, avatar_url: publicUrl } : null);
      toast.success("Avatar updated!");
    } catch (error: any) {
      toast.error(error.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const nameParts = profile.name.trim().split(/\s+/);
      const first_name = nameParts[0] || "";
      const last_name = nameParts.slice(1).join(" ") || "";

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          first_name,
          last_name,
          professional_title: profile.title,
          bio: profile.bio,
          avatar_url: profile.avatar,
          video_url: profile.videoLink,
          skills: profile.skills,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      setGlobalProfile(prev => prev ? {
        ...prev,
        first_name,
        last_name,
        avatar_url: profile.avatar,
        bio: profile.bio,
        skills: profile.skills
      } : null);

      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const addSkill = () => {
    if (newSkill && !profile.skills.includes(newSkill)) {
      setProfile({ ...profile, skills: [...profile.skills, newSkill] });
      setNewSkill("");
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8">
      <div>
        <h3 className="text-xl font-bold text-gray-900">Profile Settings</h3>
        <p className="text-gray-500 mt-1">Update your display name, profile photo, and public visibility.</p>
      </div>

      <div className="flex items-center gap-6 pb-6 border-b border-gray-100">
        <div className="relative">
          <div className="w-28 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-sm bg-gray-50 flex items-center justify-center">
            {uploading ? (
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            ) : profile.avatar ? (
              <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User className="w-12 h-12 text-gray-300" />
            )}
          </div>
          <label className="absolute -bottom-2 -right-2 bg-blue-600 p-2.5 rounded-xl text-white cursor-pointer hover:bg-blue-700 transition-all shadow-lg border-2 border-white">
            <Camera size={16} />
            <input type="file" className="hidden" accept="image/*" onChange={e => e.target.files?.[0] && uploadAvatar(e.target.files[0])} disabled={uploading} />
          </label>
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-900">Profile Photo</h3>
          <p className="text-xs text-gray-500 mt-1">We recommend an image of at least 400x400. <br/> Gifs work too!</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
            <User size={16} className="text-gray-400" /> Display Name
          </label>
          <input type="text" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all" placeholder="e.g. Jane Doe" required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
            <Briefcase size={16} className="text-gray-400" /> Professional Title
          </label>
          <input type="text" value={profile.title} onChange={e => setProfile({...profile, title: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all" placeholder="e.g. Senior Full Stack Developer" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
          <Globe size={16} className="text-gray-400" /> Introduction Video Link (YouTube/Vimeo)
          </label>
          <input type="url" value={profile.videoLink} onChange={e => setProfile({...profile, videoLink: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all" placeholder="https://youtube.com/watch?v=..." />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
          <Mail size={16} className="text-gray-400" /> Bio
        </label>
        <textarea rows={5} value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all" placeholder="Write a brief introduction about yourself..." />
      </div>

      <div className="space-y-4">
        <label className="text-sm font-bold text-gray-700">Skills</label>
        <div className="flex flex-wrap gap-2">
          {profile.skills.map(skill => (
            <span key={skill} className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2 border border-blue-100">
              {skill}
              <button type="button" onClick={() => setProfile({...profile, skills: profile.skills.filter(s => s !== skill)})} className="hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input type="text" value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())} placeholder="Add a skill (e.g. React, UI Design)" className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all" />
          <button type="button" onClick={addSkill} className="bg-white hover:bg-gray-50 border border-gray-200 px-6 rounded-xl text-gray-700 font-bold transition-all shadow-sm">Add</button>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-100 flex justify-end">
        <button type="submit" disabled={loading || uploading} className="bg-blue-600 text-white px-10 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-200 disabled:opacity-70">
          {loading && <Loader2 className="w-5 h-5 animate-spin" />}
          Save Changes
        </button>
      </div>
    </form>
  );
};

// 2. Notification Settings
const NotificationSettings = () => {
  const { profile, updateProfileSetting } = useUser();
  const p = profile as any;

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-bold text-gray-900">Notifications</h3>
        <p className="text-gray-500 mt-1">Choose what alerts you receive and how you get them.</p>
      </div>

      <div className="space-y-4">
        {[
          { id: 'email_notifications' as const, title: 'Email Notifications', desc: 'Receive project updates and messages in your inbox.', icon: <Mail className="text-blue-500" /> },
          { id: 'browser_notifications' as const, title: 'Browser Notifications', desc: 'Get real-time alerts while you are browsing the platform.', icon: <Globe className="text-green-500" /> }
        ].map((item) => (
          <div key={item.id} className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-100 transition-all hover:bg-white hover:shadow-md group">
            <div className="flex gap-4">
              <div className="p-3 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform">{item.icon}</div>
              <div>
                <p className="font-bold text-gray-900">{item.title}</p>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            </div>
            <button onClick={() => updateProfileSetting(item.id, !p?.[item.id])} className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ${p?.[item.id] ? 'bg-blue-600' : 'bg-gray-300'}`}>
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${p?.[item.id] ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// 3. Security Settings
const SecuritySettings = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      toast.success("Password reset link sent to your email!");
    } catch (err: any) {
      toast.error(err.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOutAll = async () => {
    try {
      const { error } = await supabase.auth.signOut({ scope: 'others' });
      if (error) throw error;
      toast.success("Signed out from other devices");
    } catch (err) {
      toast.error("Failed to sign out other devices");
    }
  };

  return (
    <div className="space-y-8">
      <div className="p-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl text-white shadow-xl shadow-blue-100 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="relative z-10">
          <h3 className="text-2xl font-bold">Account Security</h3>
          <p className="text-blue-100 mt-2 opacity-90">Manage your login credentials and active sessions.</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <button onClick={handlePasswordReset} disabled={loading} className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-all flex items-center gap-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Reset Password
            </button>
            <button onClick={handleSignOutAll} className="bg-blue-500/20 hover:bg-blue-500/40 text-white border border-white/20 px-6 py-3 rounded-xl font-bold transition-all">
              Sign Out All Devices
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-lg font-bold text-gray-900 px-2">Active Sessions</h4>
        <div className="bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden">
          <div className="p-6 flex items-center justify-between hover:bg-white transition-colors border-b border-gray-100 last:border-0">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white rounded-xl shadow-sm text-gray-400"><Monitor size={20} /></div>
              <div>
                <p className="font-bold text-gray-900">Current Session <span className="ml-2 text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Active</span></p>
                <p className="text-xs text-gray-500 mt-0.5">Chrome on macOS • New York, USA</p>
              </div>
            </div>
            <p className="text-xs text-gray-400">Last used: Just now</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// 5. Appearance Settings
const AppearanceSettings = () => {
  const { user } = useUser();
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    const fetchTheme = async () => {
      if (!user) return;
      const { data } = await supabase.from('user_settings').select('theme').eq('user_id', user.id).single();
      if (data?.theme) {
        setTheme(data.theme);
        localStorage.setItem('theme', data.theme);
      }
    };
    fetchTheme();
  }, [user]);

  const handleThemeChange = async (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    window.dispatchEvent(new Event('theme-change'));
    
    if (user) {
      try {
        await supabase.from('user_settings').upsert({ user_id: user.id, theme: newTheme });
        toast.success(`Theme updated to ${newTheme}`);
      } catch (err) {
        toast.error("Failed to save theme preference");
      }
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-bold text-gray-900">Appearance</h3>
        <p className="text-gray-500 mt-1">Customize your dashboard theme (Dark/Light mode).</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <button 
          onClick={() => handleThemeChange('light')}
          className={`group p-6 rounded-[2rem] border-2 transition-all text-left ${
            theme === 'light' ? 'border-blue-600 bg-blue-50/50 shadow-xl shadow-blue-100' : 'border-gray-100 bg-gray-50 hover:border-gray-200'
          }`}
        >
          <div className="w-full aspect-video bg-white rounded-2xl border border-gray-200 mb-6 overflow-hidden p-3 space-y-2 group-hover:scale-105 transition-transform">
            <div className="h-2 w-1/3 bg-gray-100 rounded-full"></div>
            <div className="h-2 w-full bg-gray-50 rounded-full"></div>
            <div className="h-2 w-2/3 bg-gray-50 rounded-full"></div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-black text-gray-900">Light Mode</p>
              <p className="text-xs text-gray-500 mt-0.5">Perfect for day productivity.</p>
            </div>
            <div className={`p-2 rounded-xl ${theme === 'light' ? 'bg-blue-600 text-white' : 'bg-white text-gray-400'}`}>
              <Sun size={20} />
            </div>
          </div>
        </button>

        <button 
          onClick={() => handleThemeChange('dark')}
          className={`group p-6 rounded-[2rem] border-2 transition-all text-left ${
            theme === 'dark' ? 'border-blue-600 bg-blue-900/10 shadow-xl shadow-blue-100' : 'border-gray-100 bg-gray-50 hover:border-gray-200'
          }`}
        >
          <div className="w-full aspect-video bg-gray-900 rounded-2xl border border-gray-800 mb-6 overflow-hidden p-3 space-y-2 group-hover:scale-105 transition-transform">
            <div className="h-2 w-1/3 bg-gray-800 rounded-full"></div>
            <div className="h-2 w-full bg-gray-800/50 rounded-full"></div>
            <div className="h-2 w-2/3 bg-gray-800/50 rounded-full"></div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-black text-gray-900">Dark Mode</p>
              <p className="text-xs text-gray-500 mt-0.5">Easy on the eyes at night.</p>
            </div>
            <div className={`p-2 rounded-xl ${theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-white text-gray-400'}`}>
              <Moon size={20} />
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

// --- Main Page Component ---

const AccountSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const { loading } = useUser();

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
    </div>
  );

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'profile', label: 'Profile Settings', icon: <User size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'security', label: 'Security', icon: <Shield size={18} /> },
    { id: 'preferences', label: 'Appearance', icon: <Monitor size={18} /> },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-5xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Settings</h1>
          <p className="text-gray-500 mt-1">Manage your account preferences and settings.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 items-start">
        {/* Sidebar Navigation */}
        <div className="w-full lg:w-64 flex-shrink-0 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-5 py-4 text-sm font-bold transition-all rounded-2xl ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-100 translate-x-2'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 w-full bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 md:p-12">
          <div className="animate-in fade-in zoom-in-95 duration-300">
            {activeTab === 'profile' && <ProfileSettings />}
            {activeTab === 'notifications' && <NotificationSettings />}
            {activeTab === 'security' && <SecuritySettings />}
            {activeTab === 'preferences' && <AppearanceSettings />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;

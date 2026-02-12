import React, { useState, useRef, useEffect } from 'react';
import { Camera, MapPin, Globe, Mail, Phone, Check, Loader2, Upload, User, Bell, Shield, CreditCard, Users, Settings, Lock, Plus, Trash2, MoreVertical, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../../supabase';

interface EmployerProfileProps {
    initialTab?: string;
}

const EmployerProfile: React.FC<EmployerProfileProps> = ({ initialTab = 'Company Profile' }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // File Input Refs
  const coverInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Form State for Company Profile & Account
  const [formData, setFormData] = useState({
    company_name: '',
    industry: '',
    website: '',
    company_size: '1-10 Employees',
    description: '',
    full_name: '',
    phone_number: '',
    logo_url: 'https://res.cloudinary.com/dxvkigop9/image/upload/v1763013353/awad-3-1-150x150_yed2gk.jpg',
    cover_image: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2070&auto=format&fit=crop', // UI only
    email: '', // Read only
  });

  // State for Notifications
  const [notifications, setNotifications] = useState({
    emailJobAlerts: true,
    emailApplications: true,
    pushMessages: true,
    marketingEmails: false,
  });

  // State for Privacy
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    showContactInfo: true,
    indexSearchEngines: true,
  });

  // State for Security
  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactor: false,
  });

  // State for Preferences
  const [preferences, setPreferences] = useState({
    language: 'English',
    timezone: 'UTC-5 (EST)',
    currency: 'USD',
    theme: localStorage.getItem('theme') || 'light'
  });

  const handleThemeChange = (newTheme: string) => {
    setPreferences(prev => ({ ...prev, theme: newTheme }));
    localStorage.setItem('theme', newTheme);
    window.dispatchEvent(new Event('theme-change'));
    // Force a re-render or class update on the document if needed, 
    // though DashboardLayout usually listens to this event.
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // State for Team Members
  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: 'Sarah Wilson', role: 'Admin', email: 'sarah@example.com', status: 'Active' },
    { id: 2, name: 'Mike Johnson', role: 'Recruiter', email: 'mike@example.com', status: 'Pending' },
  ]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
             console.error('Error fetching profile:', error);
        }

        if (data) {
          setFormData(prev => ({
            ...prev,
            company_name: data.company_name || '',
            industry: data.industry || '',
            website: data.website || '',
            company_size: data.company_size || '1-10 Employees',
            description: data.description || '',
            full_name: data.full_name || '',
            phone_number: data.phone_number || '',
            logo_url: data.logo_url || prev.logo_url,
            email: user.email || '',
          }));

          // Load preferences and notifications if they exist
          if (data.language) {
              setPreferences(prev => ({ ...prev, language: data.language }));
          }
          if (data.email_notifications !== undefined) {
              // Assuming email_notifications is a boolean, we map it to the master toggle or specific ones
              setNotifications(prev => ({ 
                  ...prev, 
                  emailJobAlerts: data.email_notifications,
                  emailApplications: data.email_notifications 
              }));
          }
        } else {
            setFormData(prev => ({...prev, email: user.email || ''}));
        }
      } catch (err) {
        console.error('Error loading profile:', err);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (security.newPassword !== security.confirmPassword) {
        alert("New passwords do not match!");
        return;
    }
    
    setIsLoading(true);
    try {
        const { error } = await supabase.auth.updateUser({
            password: security.newPassword
        });
        if (error) throw error;
        
        setShowToast(true);
        setSecurity(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
        setTimeout(() => setShowToast(false), 3000);
    } catch (err: any) {
        console.error('Error updating password:', err);
        alert(err.message || "Failed to update password.");
    } finally {
        setIsLoading(false);
    }
  };

  const handleToggleChange = (category: 'notifications' | 'privacy', key: string, value?: string) => {
    if (category === 'notifications') {
      setNotifications(prev => ({ ...prev, [key]: !prev[key as keyof typeof notifications] }));
    } else if (category === 'privacy') {
        if (key === 'profileVisibility') {
            setPrivacy(prev => ({ ...prev, profileVisibility: value as string }));
        } else {
             setPrivacy(prev => ({ ...prev, [key]: !prev[key as keyof typeof privacy] }));
        }
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
      try {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
          const filePath = `${fileName}`;

          const { error: uploadError } = await supabase.storage
              .from('logos')
              .upload(filePath, file);

          if (uploadError) {
              throw uploadError;
          }

          const { data } = supabase.storage.from('logos').getPublicUrl(filePath);
          return data.publicUrl;
      } catch (error) {
          console.error('Error uploading image:', error);
          alert('Error uploading image');
          return null;
      }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'cover_image' | 'logo_url') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (field === 'logo_url') {
          // Upload to Supabase
          setIsLoading(true);
          const publicUrl = await uploadImage(file);
          setIsLoading(false);
          
          if (publicUrl) {
              setFormData(prev => ({ ...prev, [field]: publicUrl }));
          }
      } else {
          // Local preview for cover image
          const imageUrl = URL.createObjectURL(file);
          setFormData(prev => ({ ...prev, [field]: imageUrl }));
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('No user found');

        const updates = {
            id: user.id,
            company_name: formData.company_name,
            industry: formData.industry,
            website: formData.website,
            company_size: formData.company_size,
            description: formData.description,
            full_name: formData.full_name,
            phone_number: formData.phone_number,
            logo_url: formData.logo_url,
            language: preferences.language,
            email_notifications: notifications.emailJobAlerts, // Using main alert as the db column value
            updated_at: new Date(),
        };

        const { error } = await supabase
            .from('profiles')
            .upsert(updates);

        if (error) throw error;

        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
        console.error('Error saving profile:', err);
        alert('Failed to save profile changes.');
    } finally {
        setIsLoading(false);
    }
  };

  const [activeTab, setActiveTab] = useState(initialTab);
  const tabs = ['Company Profile', 'Account', 'Notifications', 'Privacy', 'Billing', 'Security', 'Team Members', 'Preferences'];

  if (initialLoading) {
      return <div className="p-12 text-center text-gray-500">Loading profile...</div>;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'Company Profile':
        return (
          <form onSubmit={handleSave} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative">
            {/* Success Toast */}
            {showToast && (
              <div className="fixed top-24 right-5 z-[100] bg-green-600 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-2 animate-in slide-in-from-top-5 fade-in duration-300">
                <Check size={18} />
                <span className="font-medium">Profile updated successfully!</span>
              </div>
            )}

            {/* Cover Image */}
            <div className="h-32 md:h-48 relative bg-gray-100 group">
              <img 
                src={formData.cover_image} 
                alt="Cover" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <input 
                  type="file" 
                  ref={coverInputRef} 
                  onChange={(e) => handleImageUpload(e, 'cover_image')} 
                  className="hidden" 
                  accept="image/*"
              />
              <button 
                  type="button"
                  onClick={() => coverInputRef.current?.click()}
                  className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-medium flex items-center gap-2 hover:bg-white transition shadow-sm"
              >
                <Camera size={14} className="md:w-4 md:h-4" /> Edit Cover
              </button>
            </div>

            <div className="px-4 md:px-8 pb-8">
              {/* Profile Header */}
              <div className="relative flex flex-col md:flex-row justify-between items-start md:items-end -mt-10 md:-mt-12 mb-8 gap-4">
                <div className="relative group mx-auto md:mx-0">
                  <img 
                    src={formData.logo_url} 
                    alt="Company Logo" 
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-lg bg-white object-cover"
                  />
                  <input 
                      type="file" 
                      ref={logoInputRef} 
                      onChange={(e) => handleImageUpload(e, 'logo_url')} 
                      className="hidden" 
                      accept="image/*"
                  />
                  <button 
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      className="absolute bottom-0 right-0 md:bottom-1 md:right-1 bg-[#2563eb] text-white p-2 md:p-2.5 rounded-full shadow-md hover:bg-[#1d4ed8] transition transform hover:scale-105"
                  >
                    <Upload size={14} className="md:w-4 md:h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-8">
                  <section>
                    <h2 className="text-lg font-bold text-gray-800 mb-5 border-b border-gray-100 pb-2">Company Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 tracking-wide">Company Name</label>
                        <input 
                          type="text" 
                          name="company_name"
                          value={formData.company_name} 
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 md:py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-700 text-sm md:text-base" 
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 tracking-wide">Industry</label>
                        <input 
                          type="text" 
                          name="industry"
                          placeholder="e.g. Technology, Healthcare"
                          value={formData.industry} 
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 md:py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-700 text-sm md:text-base" 
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 tracking-wide">Website</label>
                        <div className="relative">
                          <Globe size={18} className="absolute left-3 top-3 md:top-3.5 text-gray-400" />
                          <input 
                              type="url" 
                              name="website"
                              value={formData.website} 
                              onChange={handleChange}
                              className="w-full pl-10 pr-4 py-2.5 md:py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-700 text-sm md:text-base" 
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 tracking-wide">Company Size</label>
                        <select 
                          name="company_size"
                          value={formData.company_size} 
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 md:py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-700 appearance-none text-sm md:text-base"
                        >
                          <option>1-10 Employees</option>
                          <option>11-50 Employees</option>
                          <option>51-200 Employees</option>
                          <option>200+ Employees</option>
                        </select>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-lg font-bold text-gray-800 mb-5 border-b border-gray-100 pb-2">About Company</h2>
                    <textarea 
                      name="description"
                      rows={6} 
                      value={formData.description} 
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-700 leading-relaxed resize-none text-sm md:text-base"
                    ></textarea>
                  </section>
                  
                  <button 
                      type="submit" 
                      disabled={isLoading}
                      className="w-full md:w-auto bg-[#2563eb] text-white font-bold py-3 md:py-3.5 px-8 rounded-lg shadow-md hover:bg-[#1d4ed8] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} />}
                    {isLoading ? 'Saving Changes...' : 'Save Changes'}
                  </button>
              </div>
            </div>
          </form>
        );
      case 'Account':
        return (
          <form onSubmit={handleSave} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-lg font-bold text-gray-800 mb-5 border-b border-gray-100 pb-2">Account Settings</h2>
            <div className="space-y-6 max-w-2xl">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Full Name</label>
                <div className="relative">
                    <User size={18} className="absolute left-3 top-3 md:top-3.5 text-gray-400" />
                    <input
                        type="text"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-700"
                    />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Phone Number</label>
                <div className="relative">
                    <Phone size={18} className="absolute left-3 top-3 md:top-3.5 text-gray-400" />
                    <input
                        type="text"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-700"
                    />
                </div>
              </div>
               <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Email</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3 top-3 md:top-3.5 text-gray-400" />
                    <input 
                        type="email" 
                        name="email"
                        value={formData.email} 
                        readOnly
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none transition-colors text-gray-500 cursor-not-allowed" 
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Email cannot be changed here.</p>
                </div>

              <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-[#2563eb] text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-[#1d4ed8] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} />}
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        );
      case 'Notifications':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-lg font-bold text-gray-800 mb-6 border-b border-gray-100 pb-2">Notification Preferences</h2>
            <div className="space-y-6 max-w-2xl">
              {[
                { key: 'emailJobAlerts', label: 'Job Alerts', desc: 'Receive emails about new candidates for your posted jobs.' },
                { key: 'emailApplications', label: 'New Applications', desc: 'Get notified when someone applies to your job.' },
                { key: 'pushMessages', label: 'Push Messages', desc: 'Receive push notifications for new messages.' },
                { key: 'marketingEmails', label: 'Marketing Emails', desc: 'Receive updates about new features and promotions.' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between pb-4 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="font-medium text-gray-800">{item.label}</p>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={notifications[item.key as keyof typeof notifications]}
                      onChange={() => handleToggleChange('notifications', item.key)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        );
      case 'Privacy':
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-lg font-bold text-gray-800 mb-6 border-b border-gray-100 pb-2">Privacy Settings</h2>
              <div className="space-y-6 max-w-2xl">
                <div className="flex items-center justify-between pb-4 border-b border-gray-50">
                    <div>
                        <p className="font-medium text-gray-800">Profile Visibility</p>
                        <p className="text-sm text-gray-500">Control who can see your profile.</p>
                    </div>
                    <select 
                        value={privacy.profileVisibility}
                        onChange={(e) => handleToggleChange('privacy', 'profileVisibility', e.target.value)}
                        className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                    >
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                        <option value="contacts">Contacts Only</option>
                    </select>
                </div>
                {[
                  { key: 'showContactInfo', label: 'Show Contact Info', desc: 'Allow logged-in users to see your contact details.' },
                  { key: 'indexSearchEngines', label: 'Search Engine Indexing', desc: 'Allow search engines to show your profile in results.' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between pb-4 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="font-medium text-gray-800">{item.label}</p>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={privacy[item.key as keyof typeof privacy] as boolean}
                        onChange={() => handleToggleChange('privacy', item.key)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          );
      case 'Billing':
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-lg font-bold text-gray-800 mb-6 border-b border-gray-100 pb-2">Billing & Plans</h2>
                
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="p-6 bg-blue-50 rounded-xl border border-blue-100">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-gray-900">Current Plan</h3>
                                <p className="text-blue-600 font-medium text-lg">Pro Business</p>
                            </div>
                            <span className="bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded-full font-bold">ACTIVE</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">Billed annually. Next payment on <span className="font-semibold">Aug 15, 2026</span></p>
                        <button className="text-sm bg-white text-blue-600 border border-blue-200 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors">Manage Subscription</button>
                    </div>

                    <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                         <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-gray-900">Payment Method</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <CreditCard size={20} className="text-gray-500" />
                                    <p className="text-gray-700 font-medium">Visa ending in 4242</p>
                                </div>
                            </div>
                            <button className="text-gray-400 hover:text-gray-600"><Settings size={18} /></button>
                        </div>
                         <p className="text-sm text-gray-500 mb-4">Expires 12/28</p>
                        <button className="text-sm bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors">Update Method</button>
                    </div>
                </div>

                <h3 className="font-bold text-gray-800 mb-4">Billing History</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold tracking-wide">
                                <th className="py-3 pl-2">Date</th>
                                <th className="py-3">Description</th>
                                <th className="py-3">Amount</th>
                                <th className="py-3 pr-2 text-right">Status</th>
                                <th className="py-3 pr-2 text-right">Invoice</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                             {[
                                 { date: 'Aug 15, 2025', desc: 'Pro Business Plan (Yearly)', amount: '$299.00', status: 'Paid' },
                                 { date: 'Jul 15, 2025', desc: 'Job Post Boost', amount: '$49.00', status: 'Paid' },
                                 { date: 'Jun 15, 2025', desc: 'Pro Business Plan (Monthly)', amount: '$29.00', status: 'Paid' },
                             ].map((item, i) => (
                                <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                                    <td className="py-4 pl-2 text-gray-600">{item.date}</td>
                                    <td className="py-4 font-medium text-gray-800">{item.desc}</td>
                                    <td className="py-4 text-gray-600">{item.amount}</td>
                                    <td className="py-4 text-right">
                                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">{item.status}</span>
                                    </td>
                                    <td className="py-4 text-right pr-2">
                                        <button className="text-blue-600 hover:underline text-xs font-medium">Download</button>
                                    </td>
                                </tr>
                             ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
      case 'Security':
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-lg font-bold text-gray-800 mb-6 border-b border-gray-100 pb-2">Security Settings</h2>
                
                <div className="max-w-2xl space-y-8">
                    <section>
                         <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Lock size={18} className="text-gray-500" /> Change Password</h3>
                         <form onSubmit={handlePasswordUpdate} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">New Password</label>
                                <input 
                                    type="password" 
                                    required
                                    value={security.newPassword}
                                    onChange={(e) => setSecurity({...security, newPassword: e.target.value})}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Confirm Password</label>
                                <input 
                                    type="password" 
                                    required
                                    value={security.confirmPassword}
                                    onChange={(e) => setSecurity({...security, confirmPassword: e.target.value})}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>
                            <button 
                                type="submit"
                                disabled={isLoading}
                                className="bg-gray-800 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-black transition-colors flex items-center gap-2"
                            >
                                {isLoading ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />}
                                Update Password
                            </button>
                         </form>
                    </section>

                    <div className="border-t border-gray-100 pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-800">Two-Factor Authentication (2FA)</p>
                                <p className="text-sm text-gray-500">Add an extra layer of security to your account.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    className="sr-only peer"
                                    checked={security.twoFactor}
                                    onChange={() => setSecurity({...security, twoFactor: !security.twoFactor})}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        );
      case 'Team Members':
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">Team Members</h2>
                        <p className="text-sm text-gray-500">Manage your team and their access permissions.</p>
                    </div>
                    <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors shadow-md">
                        <Plus size={16} /> Add Member
                    </button>
                </div>
                
                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50">
                            <tr className="border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold tracking-wide">
                                <th className="py-3 px-4">Name</th>
                                <th className="py-3 px-4">Role</th>
                                <th className="py-3 px-4">Status</th>
                                <th className="py-3 px-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                             {teamMembers.map((member) => (
                                <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                                                {member.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-800 text-sm">{member.name}</p>
                                                <p className="text-xs text-gray-500">{member.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-600">{member.role}</td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${member.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {member.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-right">
                                        <button className="text-gray-400 hover:text-red-500 transition-colors p-1">
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                             ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
      case 'Preferences':
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-lg font-bold text-gray-800 mb-6 border-b border-gray-100 pb-2">Global Preferences</h2>
                <div className="max-w-2xl space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                        <select 
                            value={preferences.language}
                            onChange={(e) => setPreferences({...preferences, language: e.target.value})}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        >
                            <option>English</option>
                            <option>Spanish</option>
                            <option>French</option>
                            <option>German</option>
                            <option>Mandarin</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-1">This will change the language of the interface.</p>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Time Zone</label>
                        <select 
                            value={preferences.timezone}
                            onChange={(e) => setPreferences({...preferences, timezone: e.target.value})}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        >
                            <option>UTC-8 (PST)</option>
                            <option>UTC-5 (EST)</option>
                            <option>UTC+0 (GMT)</option>
                            <option>UTC+1 (CET)</option>
                            <option>UTC+5:30 (IST)</option>
                        </select>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                        <select 
                            value={preferences.currency}
                            onChange={(e) => setPreferences({...preferences, currency: e.target.value})}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        >
                            <option>USD ($)</option>
                            <option>EUR (€)</option>
                            <option>GBP (£)</option>
                            <option>JPY (¥)</option>
                            <option>INR (₹)</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-1">Default currency for job postings and payments.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Appearance</label>
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => handleThemeChange("light")}
                                className={`p-4 border rounded-xl flex flex-col items-center gap-2 w-32 transition-all ${preferences.theme === 'light' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                            >
                                <div className="w-full h-12 bg-white border border-gray-200 rounded-md shadow-sm"></div>
                                <span className={`text-sm font-medium ${preferences.theme === 'light' ? 'text-blue-700' : 'text-gray-600'}`}>Light</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleThemeChange("dark")}
                                className={`p-4 border rounded-xl flex flex-col items-center gap-2 w-32 transition-all ${preferences.theme === 'dark' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                            >
                                <div className="w-full h-12 bg-gray-800 border border-gray-700 rounded-md shadow-sm"></div>
                                <span className={`text-sm font-medium ${preferences.theme === 'dark' ? 'text-blue-700' : 'text-gray-600'}`}>Dark</span>
                            </button>
                        </div>
                    </div>

                    <button 
                        className="mt-4 bg-[#2563eb] text-white font-bold py-2.5 px-6 rounded-lg shadow-md hover:bg-[#1d4ed8] transition-all"
                        onClick={() => {
                            setShowToast(true);
                            setTimeout(() => setShowToast(false), 3000);
                        }}
                    >
                        Save Preferences
                    </button>
                </div>
            </div>
        );
      default:
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{activeTab}</h2>
            <p className="text-gray-500">This section is coming soon.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 flex-shrink-0">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sticky top-4">
          <h2 className="text-lg font-bold text-gray-800 mb-4 px-4">Settings</h2>
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1">
        {renderContent()}
      </div>
    </div>
  );
};

export default EmployerProfile;

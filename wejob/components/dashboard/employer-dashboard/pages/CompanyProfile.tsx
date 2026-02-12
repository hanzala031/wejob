import React, { useState, useRef, useEffect } from 'react';
import { Camera, MapPin, Globe, Check, Loader2, Upload, Building } from 'lucide-react';
import { supabase } from '../../../../supabase';
import { useUser } from '../../../../context/UserContext';

const CompanyProfile: React.FC = () => {
  const { setProfile: setGlobalProfile } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const logoInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    company_name: '',
    industry: '',
    website: '',
    company_size: '1-10 Employees',
    description: '',
    location: '',
    logo_url: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch from 'companies' table instead of 'profiles'
        const { data, error } = await supabase
          .from('companies')
          .select('*')
          .eq('employer_id', user.id)
          .maybeSingle();

        if (error) {
             console.error('Error fetching company profile:', error);
        }

        if (data) {
          setFormData({
            company_name: data.company_name || '',
            industry: data.industry || '',
            website: data.website || '',
            company_size: data.company_size || '1-10 Employees',
            description: data.bio || '',
            location: data.location || '',
            logo_url: data.logo_url || '',
          });
        } else {
            // Fallback: Try to pre-fill from user profile if company profile doesn't exist yet
            const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();
            
            if (profileData) {
                 setFormData(prev => ({
                    ...prev,
                    company_name: profileData.company_name || '',
                    website: profileData.website || '',
                    location: profileData.location || '',
                    logo_url: profileData.avatar_url || '',
                 }));
            }
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

  const uploadImage = async (file: File): Promise<string | null> => {
      try {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
          const filePath = `${fileName}`;

          // Upload to 'company-logos' bucket
          const { error: uploadError } = await supabase.storage
              .from('company-logos')
              .upload(filePath, file);

          if (uploadError) {
              // Fallback to 'logos' if 'company-logos' doesn't exist or fails
              const { error: retryError } = await supabase.storage
                  .from('logos')
                  .upload(filePath, file);
              
              if (retryError) throw retryError;
              
              const { data } = supabase.storage.from('logos').getPublicUrl(filePath);
              return data.publicUrl;
          }

          const { data } = supabase.storage.from('company-logos').getPublicUrl(filePath);
          return data.publicUrl;
      } catch (error) {
          console.error('Error uploading image:', error);
          return null;
      }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsLoading(true);
      const publicUrl = await uploadImage(file);
      setIsLoading(false);
      
      if (publicUrl) {
          setFormData(prev => ({ ...prev, logo_url: publicUrl }));
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('No user found');

        // Upsert to 'companies' table
        const { error } = await supabase
            .from('companies')
            .upsert({
                employer_id: user.id,
                company_name: formData.company_name,
                industry: formData.industry,
                website: formData.website,
                company_size: formData.company_size,
                bio: formData.description,
                location: formData.location,
                logo_url: formData.logo_url,
                updated_at: new Date(),
            }, { onConflict: 'employer_id' });

        if (error) throw error;

        // Also update the profile strictly for UI consistency if needed (optional based on app structure)
        // But main data source for this page is now 'companies'
        setGlobalProfile(prev => prev ? {
            ...prev,
            avatar_url: formData.logo_url,
        } : null);

        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
        console.error('Error saving company profile:', err);
        alert('Failed to save profile. Please try again.');
    } finally {
        setIsLoading(false);
    }
  };

  if (initialLoading) {
      return (
        <div className="p-12 text-center text-gray-500">
          <Loader2 className="animate-spin h-10 w-10 mx-auto mb-4 text-blue-600" />
          <p>Loading company profile...</p>
        </div>
      );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Company Profile</h1>
        <p className="text-gray-500">Update your company information and public profile</p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative">
        {showToast && (
          <div className="fixed top-24 right-5 z-[100] bg-green-600 text-white px-6 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-in slide-in-from-top-5 fade-in duration-300">
            <Check size={18} />
            <span className="font-medium">Company profile updated!</span>
          </div>
        )}

        <div className="p-6 md:p-8 space-y-8">
          {/* Logo Upload Section */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative group">
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden border-2 border-gray-100 shadow-md bg-gray-50 flex items-center justify-center">
                {formData.logo_url ? (
                  <img src={formData.logo_url} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <Building size={40} className="text-gray-300" />
                )}
                {isLoading && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  </div>
                )}
              </div>
              <button 
                type="button"
                onClick={() => logoInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2.5 rounded-xl shadow-lg hover:bg-blue-700 transition-all transform hover:scale-110 active:scale-95"
              >
                <Camera size={18} />
              </button>
              <input type="file" ref={logoInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-lg font-bold text-gray-900">Company Logo</h3>
              <p className="text-sm text-gray-500 mt-1 max-w-xs">Upload a high-quality logo for your brand. Recommended size: 400x400px.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Company Name</label>
              <input 
                type="text" name="company_name" value={formData.company_name} onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-gray-700" 
                required 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Industry</label>
              <input 
                type="text" name="industry" value={formData.industry} onChange={handleChange} placeholder="e.g. Technology"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-gray-700" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Website</label>
              <div className="relative">
                <Globe size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="url" name="website" value={formData.website} onChange={handleChange} placeholder="https://example.com"
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-gray-700" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Company Size</label>
              <select 
                name="company_size" value={formData.company_size} onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-gray-700 appearance-none cursor-pointer"
              >
                <option>1-10 Employees</option>
                <option>11-50 Employees</option>
                <option>51-200 Employees</option>
                <option>200+ Employees</option>
              </select>
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Office Location</label>
              <div className="relative">
                <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" name="location" value={formData.location} onChange={handleChange} placeholder="City, Country"
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-gray-700" 
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Company Biography</label>
            <textarea 
              name="description" rows={6} value={formData.description} onChange={handleChange}
              className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-gray-700 leading-relaxed resize-none"
              placeholder="Tell freelancers about your company mission, culture, and projects..."
            ></textarea>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-50">
            <button 
              type="submit" disabled={isLoading}
              className="w-full sm:w-auto bg-blue-600 text-white font-black py-4 px-10 rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} />}
              Save Profile
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CompanyProfile;

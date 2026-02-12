import React, { useState, useEffect } from 'react';
import { Camera, MapPin, Mail, Phone, Edit2, Plus, X, Save, Loader2 } from 'lucide-react';
import { supabase } from '../../../supabase';
import { useUser } from '../../../context/UserContext';
import toast from 'react-hot-toast';

interface UserProfile {
    name: string;
    title: string;
    hourlyRate: number;
    experience: string;
    about: string;
    skills: string[];
    phone: string;
    email: string;
    location: string;
    avatar: string;
    cover: string;
}

interface FreelancerProfileProps {
    initialData?: UserProfile;
    onSave?: (data: UserProfile) => void;
}

const FreelancerProfile: React.FC<FreelancerProfileProps> = ({ initialData, onSave }) => {
  const { user } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
      name: "Jane Doe",
      title: "Senior Web Developer",
      hourlyRate: 65,
      experience: "Expert",
      about: "I am a passionate Full Stack Developer with over 5 years of experience building responsive websites and applications. I specialize in React, Node.js, and modern CSS frameworks.",
      skills: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS', 'Figma', 'GraphQL'],
      phone: "+1 987 654 321",
      email: "jane.doe@example.com",
      location: "New York, USA",
      avatar: "https://res.cloudinary.com/dxvkigop9/image/upload/v1763111444/5-1714127904-1714127904-100x100_wgxdsx.jpg",
      cover: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=2070"
  });

  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
      if (initialData) {
          setProfile(initialData);
      }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      if (!user) throw new Error('User not found');

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `avatar-${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Save to DB immediately
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setProfile(prev => ({ ...prev, avatar: publicUrl }));
      toast.success('Avatar uploaded successfully!');
      
      if (!isEditing && onSave) {
          onSave({ ...profile, avatar: publicUrl });
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleCoverUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      if (!user) throw new Error('User not found');

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `cover-${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars') // Using same bucket or you can use 'covers' if it exists
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Save to DB immediately
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ cover_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setProfile(prev => ({ ...prev, cover: publicUrl }));
      toast.success('Cover photo updated!');
      
      if (!isEditing && onSave) {
          onSave({ ...profile, cover: publicUrl });
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleAddSkill = () => {
      if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
          setProfile(prev => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }));
          setNewSkill("");
      }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
      setProfile(prev => ({ ...prev, skills: prev.skills.filter(skill => skill !== skillToRemove) }));
  };

  const handleSave = () => {
      if (onSave) {
          onSave(profile);
      }
      setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Cover Image */}
      <div className="h-48 relative overflow-hidden group">
        <img 
            src={profile.cover} 
            alt="Cover" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-black/20"></div>
        <label className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1.5 rounded-md text-sm flex items-center gap-2 hover:bg-black/70 transition cursor-pointer backdrop-blur-sm">
          <Camera size={16} /> 
          {uploading ? 'Uploading...' : 'Edit Cover'}
          <input 
            type="file" 
            className="hidden" 
            accept="image/*" 
            onChange={handleCoverUpload}
            disabled={uploading}
          />
        </label>
      </div>

      <div className="px-8 pb-8">
        <div className="relative flex justify-between items-end -mt-12 mb-6">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full border-4 border-white shadow-md bg-white overflow-hidden relative">
                {uploading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                    </div>
                ) : null}
                <img 
                src={profile.avatar} 
                alt="Profile" 
                className="w-full h-full object-cover"
                />
            </div>
            <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2.5 rounded-full shadow-lg hover:bg-blue-700 transition-all cursor-pointer border-2 border-white">
              <Camera size={16} />
              <input 
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={handleAvatarUpload}
                disabled={uploading}
              />
            </label>
          </div>
          <div className="flex gap-3">
            {!isEditing ? (
                 <button 
                    onClick={() => setIsEditing(true)}
                    className="bg-white border border-gray-300 text-gray-700 font-semibold py-2 px-6 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                 >
                    <Edit2 size={16} /> Edit Profile
                 </button>
            ) : (
                <button 
                    onClick={() => setIsEditing(false)}
                    className="bg-white border border-gray-300 text-gray-700 font-semibold py-2 px-6 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    Cancel
                </button>
            )}
            <button className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors">
                View Public
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Info */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-800">Personal Details</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Full Name</label>
                  <input 
                    type="text" 
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full mt-1 p-2 border rounded-md transition-colors ${isEditing ? 'bg-white border-gray-300' : 'bg-gray-50 border-gray-200 text-gray-600'}`}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Professional Title</label>
                  <input 
                    type="text" 
                    name="title"
                    value={profile.title}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full mt-1 p-2 border rounded-md transition-colors ${isEditing ? 'bg-white border-gray-300' : 'bg-gray-50 border-gray-200 text-gray-600'}`}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Hourly Rate ($)</label>
                  <input 
                    type="number" 
                    name="hourlyRate"
                    value={profile.hourlyRate}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full mt-1 p-2 border rounded-md transition-colors ${isEditing ? 'bg-white border-gray-300' : 'bg-gray-50 border-gray-200 text-gray-600'}`}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Experience Level</label>
                  <select 
                    name="experience"
                    value={profile.experience}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full mt-1 p-2 border rounded-md transition-colors ${isEditing ? 'bg-white border-gray-300' : 'bg-gray-50 border-gray-200 text-gray-600'}`}
                  >
                    <option>Entry Level</option>
                    <option>Intermediate</option>
                    <option>Expert</option>
                  </select>
                </div>
              </div>
            </section>

            {/* About */}
            <section>
              <h2 className="text-lg font-bold text-gray-800 mb-4">About Me</h2>
              <textarea 
                rows={5} 
                name="about"
                value={profile.about}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full p-3 border rounded-md text-sm leading-relaxed transition-colors ${isEditing ? 'bg-white border-gray-300' : 'bg-gray-50 border-gray-200 text-gray-600'}`}
              ></textarea>
            </section>

            {/* Skills */}
            <section>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-gray-800">Skills</h2>
                </div>
                
                {isEditing && (
                    <div className="flex gap-2 mb-3">
                        <input 
                            type="text" 
                            value={newSkill} 
                            onChange={(e) => setNewSkill(e.target.value)} 
                            placeholder="Add a new skill"
                            className="p-2 border border-gray-300 rounded-md text-sm flex-1"
                            onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                        />
                        <button 
                            onClick={handleAddSkill}
                            className="px-4 py-2 bg-gray-100 text-blue-600 font-semibold rounded-md hover:bg-gray-200"
                        >
                            Add
                        </button>
                    </div>
                )}

                <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill) => (
                        <div key={skill} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center gap-2 text-wrap">
                            {skill}
                            {isEditing && (
                                <button onClick={() => handleRemoveSkill(skill)} className="hover:text-red-500"><X size={14} /></button>
                            )}
                        </div>
                    ))}
                </div>
            </section>
            
            {isEditing && (
                <button 
                    onClick={handleSave}
                    className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                    <Save size={18} />
                    Save Changes
                </button>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Phone</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Phone size={16} className="text-gray-400" />
                    <input 
                        type="text" 
                        name="phone"
                        value={profile.phone}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="bg-transparent border-b border-gray-300 w-full focus:outline-none py-1 disabled:border-transparent" 
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Email</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail size={16} className="text-gray-400" />
                    <input 
                        type="email" 
                        name="email"
                        value={profile.email}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="bg-transparent border-b border-gray-300 w-full focus:outline-none py-1 disabled:border-transparent" 
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Location</label>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin size={16} className="text-gray-400" />
                    <input 
                        type="text" 
                        name="location"
                        value={profile.location}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="bg-transparent border-b border-gray-300 w-full focus:outline-none py-1 disabled:border-transparent" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerProfile;
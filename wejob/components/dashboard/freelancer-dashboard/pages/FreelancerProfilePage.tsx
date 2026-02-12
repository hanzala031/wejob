import React, { useState, useEffect } from 'react';
import FreelancerProfile from '../FreelancerProfile';
import { supabase } from '../../../../supabase';
import toast from 'react-hot-toast';

const FreelancerProfilePage: React.FC = () => {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

        if (error && error.code !== 'PGRST116') throw error; // PGRST116 is no rows found

        const profileData = data || {};
        setUserProfile({
          name: profileData.full_name || user.user_metadata?.first_name + " " + user.user_metadata?.last_name || "New User",
          title: profileData.title || "No Title Set",
          hourlyRate: profileData.hourly_rate || 0,
          experience: profileData.experience_level || "Expert",
          about: profileData.bio || "No bio added yet.",
          skills: profileData.skills || [],
          phone: profileData.phone || "",
          email: user.email,
          location: profileData.location || "",
          avatar: profileData.avatar_url || user.user_metadata?.avatar || "https://res.cloudinary.com/dxvkigop9/image/upload/v1763111444/5-1714127904-1714127904-100x100_wgxdsx.jpg",
          cover: profileData.cover_url || "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=2070"
        });
      } catch (err) {
        console.error('Error fetching profile:', err);
        toast.error('Failed to fetch profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdateProfile = async (newProfile: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: newProfile.name,
          title: newProfile.title,
          hourly_rate: newProfile.hourlyRate,
          experience_level: newProfile.experience,
          bio: newProfile.about,
          skills: newProfile.skills,
          phone: newProfile.phone,
          location: newProfile.location,
          avatar_url: newProfile.avatar,
          cover_url: newProfile.cover,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      
      setUserProfile(newProfile);
      toast.success('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error('Failed to update profile. Please try again.');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
      {loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center text-gray-500">
          <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading your profile...</p>
        </div>
      ) : (
        <FreelancerProfile initialData={userProfile} onSave={handleUpdateProfile} />
      )}
    </div>
  );
};

export default FreelancerProfilePage;

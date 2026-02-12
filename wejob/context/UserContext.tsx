import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { supabase } from '../supabase';
import { User } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

interface UserProfile {
  full_name: string;
  first_name?: string;
  last_name?: string;
  role: 'employer' | 'freelancer' | 'admin' | null;
  avatar_url?: string;
  bio?: string;
  skills?: string[];
}

interface UserContextType {
  profile: UserProfile | null;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  loading: boolean;
  user: User | null;
  refreshProfile: () => Promise<void>;
  updateProfileSetting: (settingName: string, newValue: any) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const fetchedUserIdRef = useRef<string | null>(null);

  const fetchProfile = async (userId: string, force = false) => {
    // If we've already fetched this user's profile and not forcing, skip to prevent 429s
    if (fetchedUserIdRef.current === userId && !force && profile) {
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, first_name, last_name, role, avatar_url, bio, skills, email_notifications, browser_notifications')
        .eq('id', userId)
        .maybeSingle();
      
      if (error) {
        console.error("Supabase Error:", error.message, error.details);
        return;
      }
      
      if (data) {
        // Construct full_name if needed
        if (!data.full_name && (data.first_name || data.last_name)) {
          data.full_name = `${data.first_name || ''} ${data.last_name || ''}`.trim();
        }
        setProfile(data);
        fetchedUserIdRef.current = userId;
      } else {
        setProfile(null);
        fetchedUserIdRef.current = userId;
      }
    } catch (err) {
      console.error('Unexpected error in fetchProfile:', err);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      setLoading(true);
      await fetchProfile(user.id, true);
      setLoading(false);
    }
  };

  const updateProfileSetting = async (settingName: string, newValue: any) => {
    if (!user) {
      toast.error("You must be logged in to update settings.");
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ [settingName]: newValue })
        .eq('id', user.id);

      if (error) {
        toast.error(`Update failed: ${error.message}`);
        console.error("Profile update error:", error);
      } else {
        // Optimistically update or just refresh
        await refreshProfile();
        toast.success("Setting updated successfully!");
      }
    } catch (err: any) {
      toast.error("An unexpected error occurred.");
      console.error(err);
    }
  };

  useEffect(() => {
    let mounted = true;

    // Use onAuthStateChange to handle both initial session and future changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      if (currentUser) {
        // If it's the first time we see this user or a sign in event
        if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN' || fetchedUserIdRef.current !== currentUser.id) {
            await fetchProfile(currentUser.id);
        }
      } else {
        setProfile(null);
        fetchedUserIdRef.current = null;
      }
      
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Real-time subscriptions for messages and notifications
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`user-updates:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Naya message aaya!', payload.new);
          // Only show toast if we are not currently in a chat with this person? 
          // For now, global toast as requested.
          toast.success("Naya message aaya!", {
            icon: '💬',
            duration: 4000
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          // console.log('Naya notification!', payload.new);
          toast.success("Naya notification!", {
            icon: '🔔',
            duration: 4000
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return (
    <UserContext.Provider value={{ profile, setProfile, loading, user, refreshProfile, updateProfileSetting }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

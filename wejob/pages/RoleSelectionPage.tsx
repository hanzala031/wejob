import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { useUser } from '../context/UserContext';
import { Briefcase, User } from 'lucide-react';

const RoleSelectionPage: React.FC = () => {
  const { user, profile, setProfile } = useUser();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRoleSelection = async (role: 'employer' | 'freelancer') => {
    if (!user) return;
    setLoading(true);

    const { error } = await supabase
      .from('profiles')
      .upsert({ 
        id: user.id, 
        role,
        full_name: user.user_metadata?.full_name || `${user.user_metadata?.first_name || ''} ${user.user_metadata?.last_name || ''}`.trim() || 'New User'
      });

    if (!error) {
      if (profile) {
        setProfile({ ...profile, role });
      } else {
        // If profile was null, we need to fetch it or set it manually
        setProfile({
          full_name: user.user_metadata?.full_name || 'New User',
          role: role,
        });
      }
      navigate(role === 'employer' ? '/employer/dashboard' : '/freelancer/dashboard');
    } else {
      console.error('Error updating role:', error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Join as a client or freelancer</h1>
          <p className="mt-2 text-slate-600 text-lg">Choose how you'd like to use WeJob</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <button
            onClick={() => handleRoleSelection('employer')}
            disabled={loading}
            className="group relative flex flex-col items-center p-8 bg-white border-2 border-slate-200 rounded-2xl hover:border-blue-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
              <Briefcase className="w-8 h-8 text-blue-600" />
            </div>
            <span className="text-lg font-semibold text-slate-900 leading-tight">I'm a client, hiring for a project</span>
          </button>

          <button
            onClick={() => handleRoleSelection('freelancer')}
            disabled={loading}
            className="group relative flex flex-col items-center p-8 bg-white border-2 border-slate-200 rounded-2xl hover:border-blue-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
              <User className="w-8 h-8 text-green-600" />
            </div>
            <span className="text-lg font-semibold text-slate-900 leading-tight">I'm a freelancer, looking for work</span>
          </button>
        </div>

        <button
          onClick={() => navigate('/')}
          className="text-slate-500 hover:text-slate-700 font-medium transition-colors"
        >
          Not now, take me home
        </button>
      </div>
    </div>
  );
};

export default RoleSelectionPage;

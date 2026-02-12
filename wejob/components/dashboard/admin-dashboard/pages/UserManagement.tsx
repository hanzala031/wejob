import React, { useState, useEffect } from 'react';
import { Search, Filter, Ban, CheckCircle, Loader2, Trash2 } from 'lucide-react';
import { supabase } from '../../../../supabase';
import { toast } from 'react-hot-toast';

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  role: 'freelancer' | 'employer' | 'admin';
  status: 'active' | 'banned';
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();

    // Real-time Subscription to keep UI in sync
    const channel = supabase
      .channel('user_db_changes')
      .on(
        'postgres_changes', 
        { event: '*', schema: 'public', table: 'profiles' }, 
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            setUsers(prev => prev.map(u => u.id === payload.new.id ? { ...u, ...payload.new } : u));
          } else if (payload.eventType === 'INSERT') {
            setUsers(prev => [payload.new as UserProfile, ...prev]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Fetch all profiles that have a role assigned (freelancer or employer)
      // and exclude any test accounts
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .not('role', 'is', null)
        .not('email', 'ilike', '%test%')
        .not('full_name', 'ilike', '%test%');
      
      if (error) {
        console.error("Supabase Error:", error.message, error.details);
        throw error;
      }

      if (data) {
        // Ensure uniqueness by email to avoid showing duplicates
        const uniqueUsers = data.reduce((acc: UserProfile[], current) => {
          const x = acc.find(item => item.email === current.email);
          if (!x && current.email) {
            return acc.concat([current]);
          } else {
            return acc;
          }
        }, []);
        setUsers(uniqueUsers);
      }
    } catch (error: any) {
      console.error('Error in fetchUsers:', error);
      toast.error(`Failed to load users: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'banned' : 'active';
    try {
      // Update status in the database
      const { error } = await supabase
        .from('profiles')
        .update({ status: newStatus })
        .eq('id', userId);
      
      if (error) {
        console.error("Update Error:", error.message);
        throw error;
      }
      
      toast.success(`User ${newStatus === 'active' ? 'activated' : 'banned'}`);
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const deleteUser = async (userId: string) => {
    const confirmDelete = window.confirm('Are you sure you want to PERMANENTLY delete this user? This will also remove all their jobs, proposals, bids, and contracts. This action cannot be undone.');
    if (!confirmDelete) return;

    try {
      setLoading(true);
      console.log('Starting full cleanup for user:', userId);

      // 1. Delete from all possible related tables in correct order
      // We use separate calls to ensure a failure in one table (if it doesn't exist) doesn't stop the whole process
      await supabase.from('notifications').delete().eq('user_id', userId);
      await supabase.from('bids').delete().eq('freelancer_id', userId);
      await supabase.from('proposals').delete().eq('freelancer_id', userId);
      await supabase.from('contracts').delete().or(`freelancer_id.eq.${userId},employer_id.eq.${userId}`);
      await supabase.from('kyc_requests').delete().eq('user_id', userId);
      await supabase.from('payouts').delete().eq('user_id', userId);
      
      // Delete jobs owned by this user
      await supabase.from('jobs').delete().eq('employer_id', userId);

      // 2. Finally, delete the main profile record
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);
      
      if (profileError) {
        throw new Error(`Profile deletion failed: ${profileError.message}`);
      }

      toast.success('User and all associated data permanently removed');
      // No need to manually update state, the Real-time listener will catch the 'DELETE' event
    } catch (error: any) {
      console.error('CRITICAL Delete Error:', error);
      alert(`Delete Failed: ${error.message}\n\nCommon causes:\n1. Missing 'Delete' RLS policy in Supabase.\n2. Foreign key constraints in a table not listed here.`);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    (user.full_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
    (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  if (loading && users.length === 0) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="animate-spin mb-4" size={40} />
        <p>Fetching user profiles...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          <p className="text-slate-400">View and manage all registered users on the platform.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or email..."
              className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#2563EB] w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/50 border-b border-slate-700">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Name</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Email</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Role</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-500">No users found matching your search.</td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-[#2563EB]/20 flex items-center justify-center text-[#2563EB] font-bold">
                          {(user.full_name || 'U').charAt(0)}
                        </div>
                        <div className="font-medium text-white">{user.full_name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      {user.email}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        user.role === 'admin' ? 'bg-purple-500/10 text-purple-400' :
                        user.role === 'employer' ? 'bg-[#2563EB]/10 text-[#2563EB]' :
                        'bg-emerald-500/10 text-emerald-400'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        user.status === 'active' 
                          ? 'bg-emerald-500/10 text-emerald-400' 
                          : 'bg-red-500/10 text-red-400'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => toggleUserStatus(user.id, user.status)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                            user.status === 'active'
                              ? 'bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white'
                              : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white'
                          }`}
                        >
                          {user.status === 'active' ? <Ban size={12} /> : <CheckCircle size={12} />}
                          {user.status === 'active' ? 'Ban' : 'Activate'}
                        </button>
                        
                        <button 
                          onClick={() => deleteUser(user.id)}
                          className="p-1.5 bg-slate-700/50 text-slate-400 hover:bg-red-600 hover:text-white rounded-lg transition-all"
                          title="Delete User"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;

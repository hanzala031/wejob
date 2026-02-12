
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../supabase';
import { useUser } from '../context/UserContext';
import { toast } from 'react-hot-toast';

const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshProfile } = useUser();

  const from = (location.state as any)?.from?.pathname || "/admin/dashboard";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;
      if (!user) throw new Error("No user object returned from Supabase.");

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, status')
        .eq('id', user.id)
        .single();

      if (profileError) {
        toast.error(`Role fetch error: ${profileError.message}`);
        setLoading(false); 
        return;
      }

      if (profile?.status === 'banned') {
        await supabase.auth.signOut();
        setError('Unauthorized: This account has been banned.');
        toast.error('Access Denied');
        setLoading(false);
        return;
      }

      if (profile?.role === 'admin') {
        await refreshProfile();
        navigate(from, { replace: true });
      } else {
        await supabase.auth.signOut();
        setError('Unauthorized: You do not have administrator privileges.');
        toast.error('Access Denied');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row font-['Poppins'] overflow-x-hidden">
      {/* Left Side - Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 sm:p-10 md:p-16 lg:p-24 bg-white">
        <div className="w-full max-w-md">
          {/* Logo - Single Row */}
          <div className="flex items-center gap-2 mb-6 cursor-pointer group" onClick={() => navigate('/')}>
             <ShieldCheck className="h-8 w-8 text-[#2563EB]" />
             <span className="text-2xl font-bold tracking-tight text-[#0f172a]">
               WE<span className="text-[#2563EB]">JOB</span>
             </span>
          </div>

          <div className="text-left mb-8">
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#0f172a] mb-3 leading-tight">
              Administrator
            </h1>
            <p className="text-slate-400 text-sm md:text-base font-medium">
              Secure access to the administrative dashboard to manage users, monitor platform activity, and control system settings.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 flex items-start gap-3 rounded-r-lg">
              <AlertCircle className="text-red-500 shrink-0" size={20} />
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="relative group">
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="wejob@org"
                className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-xl focus:border-[#2563EB] focus:bg-white text-slate-700 placeholder-slate-400 transition-all duration-300 outline-none shadow-sm group-hover:bg-gray-100/80"
              />
            </div>
            <div className="relative group">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-xl focus:border-[#2563EB] focus:bg-white text-slate-700 placeholder-slate-400 transition-all duration-300 outline-none shadow-sm group-hover:bg-gray-100/80 pr-14"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#2563EB] transition-colors focus:outline-none"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full relative group overflow-hidden bg-[#2563EB] text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform active:scale-[0.98] disabled:opacity-50 flex justify-center items-center shadow-lg shadow-[#2563EB]/20 hover:shadow-[#2563EB]/40 hover:-translate-y-0.5"
              >
                <div className="absolute inset-0 w-full h-full bg-[#1d4ed8] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center justify-center gap-2">
                   {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Sign in to Dashboard'}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side - Illustration with background elements */}
      <div className="hidden md:flex md:w-1/2 h-screen bg-white justify-center items-center relative overflow-hidden">
        <div className="relative w-full h-full flex items-center justify-center">
            
           {/* Shelf with books (Top Left) */}
           <div className="absolute top-20 left-10 opacity-10">
              <div className="w-32 h-2 bg-[#2563EB] rounded-full mb-1"></div>
              <div className="flex gap-1 items-end pl-4">
                 <div className="w-4 h-16 bg-[#2563EB] rounded-t-sm"></div>
                 <div className="w-5 h-20 bg-[#2563EB] rounded-t-sm"></div>
                 <div className="w-4 h-14 bg-[#2563EB] rounded-t-sm rotate-12 origin-bottom"></div>
              </div>
           </div>

           {/* Brick pattern (Top Right) */}
           <div className="absolute top-10 right-10 opacity-5 flex flex-col gap-1">
              <div className="flex gap-1"><div className="w-6 h-3 bg-[#2563EB]"></div><div className="w-10 h-3 bg-[#2563EB]"></div></div>
              <div className="flex gap-1 ml-4"><div className="w-10 h-3 bg-[#2563EB]"></div><div className="w-6 h-3 bg-[#2563EB]"></div></div>
           </div>

           {/* Brick pattern (Bottom Left) */}
           <div className="absolute bottom-20 left-5 opacity-5 flex flex-col gap-1">
              <div className="flex gap-1"><div className="w-10 h-3 bg-[#2563EB]"></div><div className="w-6 h-3 bg-[#2563EB]"></div></div>
              <div className="flex gap-1 ml-4"><div className="w-6 h-3 bg-[#2563EB]"></div><div className="w-10 h-3 bg-[#2563EB]"></div></div>
           </div>

           {/* Brick pattern (Bottom Right) */}
           <div className="absolute bottom-40 right-5 opacity-5 flex flex-col gap-1">
              <div className="flex gap-1 ml-4"><div className="w-10 h-3 bg-[#2563EB]"></div><div className="w-6 h-3 bg-[#2563EB]"></div></div>
              <div className="flex gap-1"><div className="w-6 h-3 bg-[#2563EB]"></div><div className="w-10 h-3 bg-[#2563EB]"></div></div>
           </div>
           
           <img 
              src="https://img.freepik.com/free-vector/learning-concept-illustration_114360-6186.jpg" 
              alt="Admin Dashboard Illustration" 
              className="w-full h-full object-cover relative z-10"
              style={{ filter: 'hue-rotate(185deg) saturate(1.5) brightness(0.9)' }}
           />
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;

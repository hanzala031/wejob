import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';
import { Lock, CheckCircle, AlertCircle } from 'lucide-react';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    // 1. Initial check for session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (mounted) {
        if (session) {
          setSession(session);
          setLoading(false);
        }
      }
    };
    checkSession();

    // 2. Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('ResetPassword Auth Event:', event);
      if (!mounted) return;

      if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
        if (session) {
          setSession(session);
          setLoading(false);
        }
      } else if (event === 'SIGNED_OUT') {
        setSession(null);
        setLoading(false);
      }
    });

    // 3. Robust Fallback: Clear loading after a timeout
    const timeout = setTimeout(() => {
      if (mounted && loading) {
        setLoading(false);
      }
    }, 5000);

    return () => {
      mounted = false;
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  // Timer for 429 Rate Limit Cooldown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setMessage({ type: 'error', text: 'Passwords do not match!' });
    }

    if (password.length < 6) {
        return setMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
    }

    setMessage({ type: '', text: '' });
    
    try {
        const { error } = await supabase.auth.updateUser({ password });

        if (error) {
            console.error('Update password error:', error);
            if (error.status === 429) {
                setCooldown(60); // 60 seconds cooldown
                setMessage({ type: 'error', text: 'Too many requests. Please wait before trying again.' });
            } else {
                setMessage({ type: 'error', text: error.message });
            }
        } else {
            setMessage({ type: 'success', text: 'Password successfully updated! Redirecting to login...' });
            setTimeout(() => {
                supabase.auth.signOut().then(() => {
                    navigate('/signin');
                });
            }, 3000);
        }
    } catch (err: any) {
        setMessage({ type: 'error', text: 'An unexpected error occurred.' });
    }
  };

  if (loading) {
      return (
          <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
              <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600 font-medium">Verifying security token...</p>
              </div>
          </div>
      );
  }

  if (!session) {
      return (
          <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 font-sans">
              <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="w-8 h-8 text-red-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid or Expired Link</h2>
                  <p className="text-gray-500 mb-8">
                      The password reset link is invalid, expired, or has already been used. Please request a new one.
                  </p>
                  <button 
                    onClick={() => navigate('/forgot-password')}
                    className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                  >
                      Back to Forgot Password
                  </button>
              </div>
          </div>
      );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900">Reset Password</h2>
            <p className="text-gray-500 text-sm mt-2">Enter your new password below.</p>
        </div>

        <form className="space-y-6" onSubmit={handlePasswordUpdate}>
          <div className="space-y-4">
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                <input
                type="password"
                placeholder="Enter new password"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                />
            </div>
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
                <input
                type="password"
                placeholder="Confirm new password"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                />
            </div>
          </div>

          {message.text && (
            <div className={`p-4 rounded-xl flex items-start gap-3 text-sm ${message.type === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
              {message.type === 'success' ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
              <div>
                <p className="font-medium">{message.type === 'error' ? 'Error' : 'Success'}</p>
                <p>{message.text}</p>
                {cooldown > 0 && (
                    <p className="mt-1 font-bold">Try again in {cooldown}s</p>
                )}
              </div>
            </div>
          )}

          <button 
            type="submit" 
            disabled={cooldown > 0}
            className={`w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-200 transition-all ${cooldown > 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 hover:shadow-xl'}`}
          >
            {cooldown > 0 ? `Wait ${cooldown}s` : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;

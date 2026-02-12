
import React, { useState, useEffect } from 'react';
import { Command, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '../supabase';
import { useLocation } from 'react-router-dom';

interface ForgotPasswordPageProps {
  onNavigate: (page: string) => void;
}

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onNavigate }) => {
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // 1. Check if the user exists in our profiles table
      const { data: userProfile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .maybeSingle();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        setMessage({ type: 'error', text: 'An unexpected error occurred. Please try again.' });
        setLoading(false);
        return;
      }

      if (!userProfile) {
        setMessage({ type: 'error', text: 'This email is not registered with us.' });
        setLoading(false);
        return;
      }

      // 2. If user exists, send the reset link
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setMessage({ type: 'error', text: error.message });
      } else {
        setMessage({ 
          type: 'success', 
          text: 'Password reset link has been sent to your email.' 
        });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: 'An unexpected error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
        
        {/* Left Section - Form */}
        <div className="w-full lg:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
            <div className="flex flex-col items-center mb-8">
                 {/* Logo */}
                 <div className="flex items-center font-bold mb-4 cursor-pointer" onClick={() => onNavigate('home')}>
                     <Command className="mr-2 h-9 w-9 text-blue-500" />
                    <span className="text-3xl tracking-tight text-gray-900">WE<span className="text-blue-500">JOB</span></span>
                 </div>
                 <h2 className="text-xl font-bold text-gray-900 mb-2">Reset Password</h2>
                 <p className="text-[#888888] text-center text-sm">
                    Please enter your email to reset your <br/> account password
                 </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                    <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Please enter your email address"
                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-[#2563eb] outline-none transition-all text-gray-700 placeholder-gray-400"
                    />
                </div>

                {message && (
                  <div className={`p-4 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message.text}
                  </div>
                )}

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] disabled:bg-blue-300 text-white font-bold py-4 rounded-lg shadow-lg shadow-blue-200 transition-all duration-300 flex items-center justify-center gap-2"
                >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>Send reset link <ArrowRight className="w-5 h-5" /></>
                    )}
                </button>
            </form>

            <div className="mt-8 text-center text-sm text-gray-600">
                Don't have an account? <button onClick={() => onNavigate('signup')} className="font-bold text-gray-900 hover:text-[#2563eb] transition-colors ml-1">Sign up</button>
            </div>
            
            <div className="mt-4 text-center text-sm text-gray-600">
                <button onClick={() => onNavigate('signin')} className="text-gray-500 hover:text-[#2563eb] transition-colors">Back to Sign In</button>
            </div>
        </div>

        {/* Right Section - Image */}
        <div className="hidden lg:block w-1/2 relative">
             <img 
                src="https://res.cloudinary.com/dxvkigop9/image/upload/v1764141770/sz-2_p5gj7b.png" 
                alt="Office workspace" 
                className="absolute inset-0 w-full h-full object-cover"
             />
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

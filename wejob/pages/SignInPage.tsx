import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Command, CheckCircle2 } from 'lucide-react';
import { supabase } from '../supabase';
import { useLocation, useNavigate } from 'react-router-dom';

interface SignInPageProps {
    onNavigate: (page: string) => void;
}

const SignInPage: React.FC<SignInPageProps> = ({ onNavigate }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        if (location.state?.signupSuccess) {
            setSuccessMessage("Your account has been created successfully! Please log in now.");
            // Clear location state to prevent message showing again on refresh
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) {
                setError(authError.message);
                return;
            }

            if (data.user) {
                // Immediate fetch of profile role and status
                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('role, status')
                    .eq('id', data.user.id)
                    .maybeSingle();
                
                if (profileError) {
                    console.error('Error fetching profile during login:', profileError);
                    navigate('/');
                    return;
                }

                // CHECK BANNED STATUS
                if (profile?.status === 'banned') {
                    await supabase.auth.signOut();
                    setError('Your account has been banned by an administrator. Please contact support.');
                    return;
                }

                if (profile?.role === 'employer') {
                    navigate('/employer/dashboard');
                } else if (profile?.role === 'freelancer') {
                    navigate('/freelancer/dashboard');
                } else {
                    navigate('/');
                }
            }
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred during sign in');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
            <div className="w-full max-w-lg lg:max-w-6xl bg-white rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">

                {/* Left Section - Form */}
                <div className="w-full lg:w-1/2 p-6 sm:p-10 lg:p-16 flex flex-col justify-center">
                    <div className="flex flex-col items-center mb-6 md:mb-8 text-center">
                        {/* Logo */}
                        <div className="flex items-center font-bold mb-3 md:mb-4 cursor-pointer" onClick={() => navigate('/')}>
                            <Command className="mr-2 h-7 w-7 md:h-9 md:w-9 text-blue-500" />
                            <span className="text-2xl md:text-3xl tracking-tight text-gray-900 uppercase">WE<span className="text-blue-500">JOB</span></span>
                        </div>
                        <h2 className="text-gray-500 font-normal text-sm md:text-lg">
                            Please enter your email & password <br className="hidden sm:block" /> to access your account
                        </h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                        {successMessage && (
                            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4" />
                                {successMessage}
                            </div>
                        )}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Please enter your email address"
                                required
                                autoComplete="email"
                                className="w-full px-4 py-2.5 md:py-3 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-[#2563eb] outline-none transition-all text-gray-700 placeholder-gray-400 text-sm md:text-base"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Please enter your password"
                                    required
                                    autoComplete="current-password"
                                    className="w-full px-4 py-2.5 md:py-3 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-[#2563eb] outline-none transition-all text-gray-700 placeholder-gray-400 text-sm md:text-base"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                            <label className="flex items-center cursor-pointer select-none">
                                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#2563eb] focus:ring-[#2563eb] accent-[#2563eb]" />
                                <span className="ml-2 text-sm text-gray-500">Remember me</span>
                            </label>
                            <button
                                type="button"
                                onClick={() => navigate('/forgot-password', { state: { email } })}
                                className="text-sm font-semibold text-[#2563eb] hover:text-[#1d4ed8] transition-colors"
                            >
                                Forgot password?
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold py-3 md:py-4 rounded-lg shadow-lg shadow-blue-200 transition-all duration-300 mt-2 text-sm md:text-base disabled:opacity-50"
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-6 md:mt-8 text-center text-sm text-gray-600">
                        Don't have an account? <button onClick={() => navigate('/signup')} className="font-bold text-gray-900 hover:text-[#2563eb] transition-colors ml-1">Sign up</button>
                    </div>

                    {/* Credentials Demo Box */}
                    <div className="mt-8 md:mt-10 p-4 md:p-5 bg-gray-50 rounded-xl border border-gray-100 text-sm">
                        <p className="flex justify-between border-b border-gray-200 pb-2 mb-2">
                            <span className="text-gray-500">Username:</span>
                            <span className="font-medium text-gray-900">freelancer <span className="text-gray-400 font-normal">or</span> employer</span>
                        </p>
                        <p className="flex justify-between">
                            <span className="text-gray-500">Password:</span>
                            <span className="font-medium text-gray-900">google</span>
                        </p>
                    </div>
                </div>

                {/* Right Section - Image */}
                <div className="hidden lg:block w-1/2 relative">
                    <img
                        src="https://res.cloudinary.com/dxvkigop9/image/upload/v1764141770/sz-2_p5gj7b.png"
                        alt="Collaborating team"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                </div>
            </div>
        </div>
    );
};

export default SignInPage;

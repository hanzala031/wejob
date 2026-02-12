
import React, { useState } from 'react';
import { Command } from 'lucide-react';
import { supabase } from '../supabase';


interface SignUpPageProps {
    onNavigate: (page: string, data?: any) => void;
}

const SignUpIcon: React.FC<{ className?: string }> = ({ className }) => (
    <div className={`flex items-center font-bold ${className}`}>
        <Command className="mr-2 h-7 w-7 md:h-9 md:w-9 text-blue-500" />
        <span className="text-2xl md:text-3xl tracking-tight text-gray-900">WE<span className="text-blue-500">JOB</span></span>
    </div>
);

const SignUpPage: React.FC<SignUpPageProps> = ({ onNavigate }) => {
    const [accountType, setAccountType] = useState<'client' | 'freelancer'>('client');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { data, error } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            options: {
                data: {
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    full_name: `${formData.firstName} ${formData.lastName}`.trim(),
                    role: accountType === 'client' ? 'employer' : 'freelancer'
                }
            }
        });

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        // Create the profile record explicitly after successful auth sign-up
        if (data.user) {
            const { error: profileError } = await supabase
                .from('profiles')
                .upsert({
                    id: data.user.id,
                    full_name: `${formData.firstName} ${formData.lastName}`.trim(),
                    email: formData.email,
                    role: accountType === 'client' ? 'employer' : 'freelancer',
                    status: 'active'
                });
            
            if (profileError) {
                console.error('Profile creation error:', profileError);
            }
        }

        // Successfully signed up, now sign out immediately to prevent auto-login
        await supabase.auth.signOut();

        setLoading(false);
        onNavigate('signin', { signupSuccess: true });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
            <div className="w-full max-w-2xl lg:max-w-6xl bg-white rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">

                {/* Left Side - Form */}
                <div className="w-full lg:w-1/2 p-6 sm:p-10 lg:p-16 overflow-y-auto max-h-[90vh] lg:max-h-none">
                    <div className="text-center mb-6 md:mb-8">
                        <div onClick={() => onNavigate('home')} className="cursor-pointer inline-block mb-3 md:mb-4">
                            <SignUpIcon />
                        </div>
                        <h2 className="text-gray-500 font-normal text-sm md:text-lg uppercase tracking-tight">We are delighted to welcome you!</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">First Name</label>
                                <input name="firstName" value={formData.firstName} onChange={handleChange} type="text" required className="w-full px-4 py-2.5 md:py-3 bg-gray-50 rounded-lg border-none focus:ring-2 focus:ring-[#2563eb] outline-none transition-all placeholder-gray-400 text-sm md:text-base" placeholder="First name*" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Last Name</label>
                                <input name="lastName" value={formData.lastName} onChange={handleChange} type="text" required className="w-full px-4 py-2.5 md:py-3 bg-gray-50 rounded-lg border-none focus:ring-2 focus:ring-[#2563eb] outline-none transition-all placeholder-gray-400 text-sm md:text-base" placeholder="Last name*" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
                                <input name="email" value={formData.email} onChange={handleChange} type="email" required className="w-full px-4 py-2.5 md:py-3 bg-gray-50 rounded-lg border-none focus:ring-2 focus:ring-[#2563eb] outline-none transition-all placeholder-gray-400 text-sm md:text-base" placeholder="Email address*" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
                                <input name="password" value={formData.password} onChange={handleChange} type="password" required className="w-full px-4 py-2.5 md:py-3 bg-gray-50 rounded-lg border-none focus:ring-2 focus:ring-[#2563eb] outline-none transition-all placeholder-gray-400 text-sm md:text-base" placeholder="Enter password*" />
                            </div>
                        </div>

                        {/* Account Type Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">Choose Type</label>
                            <div className="bg-gray-50 rounded-lg p-3 md:p-4 flex items-center gap-6 md:gap-8">
                                <label className="flex items-center cursor-pointer">
                                    <div className="relative flex items-center">
                                        <input
                                            type="radio"
                                            name="accountType"
                                            checked={accountType === 'client'}
                                            onChange={() => setAccountType('client')}
                                            className="w-5 h-5 accent-[#2563eb] border-gray-300 focus:ring-[#2563eb]"
                                        />
                                    </div>
                                    <span className="ml-2 text-sm md:text-base text-gray-600">Employer</span>
                                </label>
                                <label className="flex items-center cursor-pointer">
                                    <div className="relative flex items-center">
                                        <input
                                            type="radio"
                                            name="accountType"
                                            checked={accountType === 'freelancer'}
                                            onChange={() => setAccountType('freelancer')}
                                            className="w-5 h-5 accent-[#2563eb] border-gray-300 focus:ring-[#2563eb]"
                                        />
                                    </div>
                                    <span className="ml-2 text-sm md:text-base text-gray-600">Freelancer</span>
                                </label>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 pt-2">
                            <input type="checkbox" required id="terms" className="mt-1 w-4 h-4 text-[#2563eb] border-gray-300 rounded focus:ring-[#2563eb]" />
                            <label htmlFor="terms" className="text-xs md:text-sm text-gray-600">
                                I have read and agree to all <a href="#" className="text-[#2563eb] hover:underline font-medium">Terms and Condition</a> and <a href="#" className="text-[#2563eb] hover:underline font-medium">Privacy Policy</a>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold py-3 md:py-4 rounded-lg transition-all duration-300 shadow-lg shadow-blue-200 mt-2 text-sm md:text-base disabled:opacity-50"
                        >
                            {loading ? 'Joining...' : 'Join Now'}
                        </button>
                    </form>

                    <div className="mt-6 md:mt-8 text-center">
                        <p className="text-gray-600 text-sm md:text-base">
                            Already have an account <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('signin'); }} className="text-gray-900 font-bold hover:underline">Sign In</a>
                        </p>
                    </div>
                </div>

                {/* Right Side - Image */}
                <div className="hidden lg:block w-1/2 relative">
                    <img
                        src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"
                        alt="Collaborating team"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                </div>

            </div>
        </div>
    );
};

export default SignUpPage;

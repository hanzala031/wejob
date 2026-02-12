import React, { useState } from 'react';
import { X, Send, DollarSign, FileText, Clock, AlertCircle, CheckCircle2, Info, Loader2 } from 'lucide-react';
import { supabase } from '../../../supabase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

interface ApplyModalProps {
    jobId: string | number;
    jobTitle: string;
    onClose: () => void;
    onSuccess: () => void;
}

const ApplyModal: React.FC<ApplyModalProps> = ({ jobId, jobTitle, onClose, onSuccess }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    
    const initialFormState = {
        bid_amount: '',
        cover_letter: '',
        estimated_time: '1 week'
    };

    const [formData, setFormData] = useState(initialFormState);

    React.useEffect(() => {
        // Dispatch event to hide topbar in layout
        window.dispatchEvent(new CustomEvent('toggle-modal', { detail: { isOpen: true } }));
        
        return () => {
            // Restore topbar on close
            window.dispatchEvent(new CustomEvent('toggle-modal', { detail: { isOpen: false } }));
        };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // 1. Get verified User ID
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            if (authError || !user) throw new Error('You must be logged in to apply. Please sign in.');

            // 1.5. Check for existing proposal again to be safe
            const { data: existingProposal } = await supabase
                .from('proposals')
                .select('id')
                .eq('job_id', jobId)
                .eq('freelancer_id', user.id)
                .maybeSingle();
            
            if (existingProposal) {
                throw new Error('Aap is job par pehle hi apply kar chuke hain.');
            }

            // 2. Insert into 'proposals' table
            const { error: submitError } = await supabase
                .from('proposals')
                .insert([{
                    job_id: jobId,
                    freelancer_id: user.id,
                    bid_amount: Number(formData.bid_amount),
                    estimated_time: formData.estimated_time,
                    cover_letter: formData.cover_letter,
                    status: 'pending'
                }]);

            if (submitError) {
                if (submitError.code === '23505') {
                    throw new Error('Aap is job par pehle hi apply kar chuke hain.');
                }
                throw submitError;
            }

            // 3. Success Actions
            setSuccess(true);
            toast.success('Aapka proposal bhej diya gaya hai!', {
                duration: 4000,
                style: { background: '#10B981', color: '#fff' }
            });

            // Trigger parent UI update (Applied state)
            onSuccess();

            // Clear the form
            setFormData(initialFormState);

            // 4. Email Confirmation Logic (Trigger Edge Function if exists)
            // await supabase.functions.invoke('send-proposal-email', { body: { userEmail: user.email, jobTitle } });

            // 5. Redirect after a brief delay to show success state
            setTimeout(() => {
                onClose();
                navigate('/freelancer/dashboard/proposals');
            }, 2000);

        } catch (err: any) {
            console.error('Proposal submission failed:', err);
            const msg = err.message || 'Failed to submit proposal';
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-8 text-center animate-in zoom-in duration-300">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Proposal Submitted!</h2>
                    <p className="text-gray-500">Your application for <span className="font-semibold text-gray-700">"{jobTitle}"</span> has been sent successfully.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl animate-in slide-in-from-bottom-8 duration-300 overflow-hidden border border-gray-100">
                {/* Header */}
                <div className="p-6 md:p-8 border-b border-gray-50 flex justify-between items-start bg-gray-50/50">
                    <div className="flex-1 pr-8">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">New Proposal</span>
                        </div>
                        <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 leading-tight">{jobTitle}</h2>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-xl transition-all shadow-sm">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-r-xl text-sm flex items-center gap-3">
                            <AlertCircle size={18} className="shrink-0" />
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                                <DollarSign size={16} className="text-green-500" /> Your Bid Amount ($)
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                                <input
                                    type="number"
                                    required
                                    value={formData.bid_amount}
                                    onChange={(e) => setFormData(prev => ({ ...prev, bid_amount: e.target.value }))}
                                    placeholder="0.00"
                                    className="w-full pl-8 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-bold text-gray-800"
                                />
                            </div>
                            <p className="text-[10px] text-gray-400 flex items-center gap-1 px-1">
                                <Info size={10} /> Total amount the client will see
                            </p>
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                                <Clock size={16} className="text-orange-500" /> Estimated Time
                            </label>
                            <select
                                value={formData.estimated_time}
                                onChange={(e) => setFormData(prev => ({ ...prev, estimated_time: e.target.value }))}
                                className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-medium text-gray-700 cursor-pointer appearance-none"
                            >
                                <option value="Less than 1 week">Less than 1 week</option>
                                <option value="1 week">1 week</option>
                                <option value="2 weeks">2 weeks</option>
                                <option value="1 month">1 month</option>
                                <option value="3 months">3 months</option>
                                <option value="More than 6 months">More than 6 months</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                                <FileText size={16} className="text-blue-500" /> Cover Letter
                            </label>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Markdown Supported</span>
                        </div>
                        <div className="relative group">
                            <textarea
                                required
                                rows={8}
                                value={formData.cover_letter}
                                onChange={(e) => setFormData(prev => ({ ...prev, cover_letter: e.target.value }))}
                                placeholder="Describe why you are the best fit for this project. Mention your relevant experience and how you plan to tackle the requirements..."
                                className="w-full px-5 py-5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all resize-none text-gray-700 leading-relaxed"
                            ></textarea>
                            <div className="absolute bottom-4 right-4 opacity-0 group-focus-within:opacity-100 transition-opacity">
                                <div className="flex gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-300 animate-pulse delay-75"></div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-200 animate-pulse delay-150"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex items-center gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 text-gray-500 font-bold hover:bg-gray-50 rounded-2xl transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-[2] bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-100 transition-all flex items-center justify-center gap-3 group"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Sending...</span>
                                </>
                            ) : (
                                <>
                                    <span>Submit Proposal</span>
                                    <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ApplyModal;

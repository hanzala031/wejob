import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { Send, AlertCircle, CheckCircle2, DollarSign, Clock, FileText } from 'lucide-react';

const ProposalForm: React.FC = () => {
    const { jobId } = useParams<{ jobId: string }>();
    const navigate = useNavigate();
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    
    const [formData, setFormData] = useState({
        bidAmount: '',
        estimatedTime: '1 week',
        coverLetter: ''
    });

    const isValidUUID = (uuid: string) => {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidRegex.test(uuid);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('You must be logged in to submit a proposal.');

            if (!jobId || !isValidUUID(jobId)) {
                throw new Error(`Invalid Job ID: "${jobId}". Please use a valid job link.`);
            }

            const proposalData = {
                job_id: jobId,
                freelancer_id: user.id,
                bid_amount: parseFloat(formData.bidAmount),
                estimated_time: formData.estimatedTime,
                cover_letter: formData.coverLetter,
                status: 'pending'
            };

            const { error: insertError } = await supabase
                .from('proposals')
                .insert([proposalData]);

            if (insertError) throw insertError;
            setSuccess(true);
        } catch (err: any) {
            console.error('Proposal submission error:', err);
            setError(err.message || 'Failed to submit proposal.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="max-w-2xl mx-auto p-8 bg-green-50 border border-green-200 rounded-3xl text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-green-800 mb-2">Proposal Submitted!</h2>
                <p className="text-green-700">Your proposal has been successfully sent.</p>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-50 bg-gray-50/50">
                <h2 className="text-2xl font-extrabold text-gray-900">Submit a Proposal</h2>
                <p className="text-gray-500 mt-1">Applying for Job ID: <span className="font-mono text-xs bg-gray-200 px-2 py-1 rounded">{jobId}</span></p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8">
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-4 rounded-r-xl flex items-start gap-3">
                        <AlertCircle className="w-6 h-6 shrink-0 mt-0.5" />
                        <div>
                            <p className="font-bold">Error</p>
                            <p className="text-sm">{error}</p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                            <DollarSign size={16} className="text-green-500" /> Bid Amount ($)
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                            <input
                                type="number"
                                required
                                min="0"
                                step="0.01"
                                value={formData.bidAmount}
                                onChange={(e) => setFormData(prev => ({ ...prev, bidAmount: e.target.value }))}
                                placeholder="0.00"
                                className="w-full pl-8 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-bold text-gray-800"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                            <Clock size={16} className="text-orange-500" /> Estimated Time
                        </label>
                        <select
                            value={formData.estimatedTime}
                            onChange={(e) => setFormData(prev => ({ ...prev, estimatedTime: e.target.value }))}
                            className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-medium text-gray-700 cursor-pointer appearance-none"
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

                <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                        <FileText size={16} className="text-blue-500" /> Cover Letter
                    </label>
                    <textarea
                        required
                        rows={8}
                        value={formData.coverLetter}
                        onChange={(e) => setFormData(prev => ({ ...prev, coverLetter: e.target.value }))}
                        placeholder="Explain why you're the best fit for this project..."
                        className="w-full px-5 py-5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all resize-none text-gray-700 leading-relaxed"
                    ></textarea>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-3 group"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <span className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></span>
                                Submitting...
                            </span>
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
    );
};

export default ProposalForm;

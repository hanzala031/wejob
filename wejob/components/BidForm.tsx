import React, { useState } from 'react';
import { supabase } from '../supabase';
import { useUser } from '../context/UserContext';
import { Send, AlertCircle, CheckCircle2, DollarSign, Clock } from 'lucide-react';

interface BidFormProps {
  jobId: string;
  onSuccess?: () => void;
}

const BidForm: React.FC<BidFormProps> = ({ jobId, onSuccess }) => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    bid_amount: '',
    estimated_time: '1 week',
    cover_letter: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError("Please sign in to submit a proposal.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Fetch employer_id from the job to store in proposal
      const { data: jobData, error: jobError } = await supabase
        .from('jobs')
        .select('employer_id')
        .eq('id', jobId)
        .single();

      if (jobError) throw new Error("Could not verify job details.");
      if (!jobData) throw new Error("Job not found.");

      // 2. Submit proposal
      const { error: proposalError } = await supabase
        .from('proposals')
        .insert([{
          job_id: jobId,
          freelancer_id: user.id,
          employer_id: jobData.employer_id,
          bid_amount: parseFloat(formData.bid_amount),
          estimated_time: formData.estimated_time,
          cover_letter: formData.cover_letter, // Fixed column name
          status: 'pending'
        }]);

      if (proposalError) {
        if (proposalError.code === '23505') throw new Error("You have already applied for this job.");
        throw proposalError;
      }

      setSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 p-6 rounded-2xl border border-green-100 text-center animate-in zoom-in duration-300">
        <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-green-800">Proposal Submitted!</h3>
        <p className="text-green-600 text-sm">The employer will review your application shortly.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
      <h3 className="text-xl font-black text-gray-900 mb-6">Submit Proposal</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-xl text-sm flex items-center gap-2">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
              <DollarSign size={16} className="text-green-500" /> Bid Amount ($)
            </label>
            <input
              type="number"
              required
              value={formData.bid_amount}
              onChange={(e) => setFormData({ ...formData, bid_amount: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold"
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
              <Clock size={16} className="text-orange-500" /> Estimated Time
            </label>
            <select
              value={formData.estimated_time}
              onChange={(e) => setFormData({ ...formData, estimated_time: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium cursor-pointer"
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
          <label className="block text-sm font-bold text-gray-700">Cover Letter</label>
          <textarea
            required
            rows={6}
            value={formData.cover_letter}
            onChange={(e) => setFormData({ ...formData, cover_letter: e.target.value })}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none leading-relaxed"
            placeholder="Describe your qualifications and approach..."
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2 group"
        >
          {loading ? (
             <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
             <><Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> Submit Proposal</>
          )}
        </button>
      </form>
    </div>
  );
};

export default BidForm;

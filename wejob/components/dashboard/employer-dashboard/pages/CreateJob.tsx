import React from 'react';
import { ArrowLeft, Type, Tag, DollarSign, Calendar, FileText, Layers, Briefcase, CheckCircle2, Globe, MessageCircle, BarChart } from 'lucide-react';
import { useNavigate, NavLink } from 'react-router-dom';
import { supabase } from '../../../../supabase';
import { toast } from 'react-hot-toast';

const CreateJob: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const [formData, setFormData] = React.useState({
    title: '',
    category: '',
    type: 'Full Time',
    experience_level: 'Mid-Level',
    location: '',
    budget: '',
    description: '',
    skills: '',
    deadline: '',
    freelancer_type: 'Individual',
    project_duration: '1-5 Days',
    project_level: 'Maximise Level',
    languages: 'English',
    english_level: 'Fluent'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Fetch current authenticated user for employer_id
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error('Authentication Error: Please sign in again.');
      }

      // 2. Prepare job data with exact database column names
      const jobData = {
        employer_id: user.id, // Fixed: Pass user ID to solve null constraint
        title: formData.title,
        category: formData.category,
        type: formData.type,
        experience_level: formData.experience_level,
        location: formData.location || 'Remote',
        budget: Number(formData.budget) || 0,
        salary_min: Number(formData.budget) || 0,
        salary_max: Number(formData.budget) || 0,
        description: formData.description,
        // Sync these with your database columns
        freelancer_type: formData.freelancer_type,
        project_duration: formData.project_duration,
        project_level: formData.project_level,
        english_level: formData.english_level,
        // Convert to arrays for TEXT[] columns
        skills: formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(s => s !== '') : [],
        languages: formData.languages ? formData.languages.split(',').map(s => s.trim()).filter(s => s !== '') : ['English'],
        status: 'pending',
        is_approved: false,
        deadline: formData.deadline || null,
        created_at: new Date().toISOString()
      };

      // 3. Execute Insert
      const { error: insertError } = await supabase
        .from('jobs')
        .insert([jobData]);

      if (insertError) {
        console.error("Supabase Insert Failed:", insertError);
        // Show specific alert for missing columns
        if (insertError.message.includes("column") && insertError.message.includes("not found")) {
            alert(`Database Error: Column '${insertError.message.split("'")[1]}' is missing. Please run the SQL fix in Supabase.`);
        }
        throw new Error(insertError.message);
      }

      setSuccess(true);
      toast.success('Job submitted! Pending admin approval.');
      
      setTimeout(() => {
        navigate('/employer/dashboard/jobs');
      }, 2000);

    } catch (err: any) {
      console.error('Job Submission Error:', err);
      const msg = err.message || 'Failed to post job';
      setError(msg);
      toast.error(msg);
      alert(msg); // Extra alert as requested
    } finally {
      // 4. Ensure loading is ALWAYS false so button doesn't stay stuck
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Job Posted Successfully!</h2>
        <p className="text-gray-500 text-lg text-center font-medium">Your job is currently <span className="text-blue-600 font-bold">pending approval</span>.<br/>Redirecting to dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12 font-sans">
      <div className="mb-8">
        <NavLink to="/employer/dashboard/jobs" className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 mb-4 transition-colors">
          <ArrowLeft size={16} className="mr-1.5" /> Back to Jobs
        </NavLink>
        <h1 className="text-3xl font-bold text-gray-900">Create a New Job</h1>
        <p className="text-gray-500 mt-2 text-lg">Provide detailed info to attract the right freelancers.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="h-2 bg-blue-600 w-full"></div>
        <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-8">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-4 rounded-r-lg text-sm flex items-start gap-3">
              <div className="mt-0.5 text-lg">⚠️</div>
              <p className="font-bold">{error}</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                <Type size={16} className="text-blue-500" /> Job Title
              </label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                type="text"
                placeholder="e.g. Graphic Designer Needed"
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                <Tag size={16} className="text-purple-500" /> Category
              </label>
              <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer" required>
                <option value="">Select Category</option>
                <option value="Development">Development</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Writing">Writing</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                <DollarSign size={16} className="text-green-500" /> Budget ($)
              </label>
              <input
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                type="number"
                placeholder="500"
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-gray-800"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                <Calendar size={16} className="text-orange-500" /> Deadline
              </label>
              <input
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                type="date"
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                <Briefcase size={16} className="text-indigo-500" /> Job Type
              </label>
              <select name="type" value={formData.type} onChange={handleChange} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
                <option value="Contract">Contract</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                <Briefcase size={16} className="text-cyan-500" /> Freelancer Type
              </label>
              <select name="freelancer_type" value={formData.freelancer_type} onChange={handleChange} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="Individual">Individual</option>
                <option value="Agency">Agency</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                <Layers size={16} className="text-blue-500" /> Experience Level
              </label>
              <select name="experience_level" value={formData.experience_level} onChange={handleChange} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="Junior">Junior</option>
                <option value="Mid-Level">Mid-Level</option>
                <option value="Senior">Senior</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                <Calendar size={16} className="text-blue-500" /> Project Duration
              </label>
              <select name="project_duration" value={formData.project_duration} onChange={handleChange} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="1-5 Days">1-5 Days</option>
                <option value="1-2 Weeks">1-2 Weeks</option>
                <option value="1 Month">1 Month</option>
                <option value="3-6 Months">3-6 Months</option>
                <option value="Long Term">Long Term</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                <BarChart size={16} className="text-indigo-500" /> Project Level
              </label>
              <select name="project_level" value={formData.project_level} onChange={handleChange} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="Basic Level">Basic Level</option>
                <option value="Moderate Level">Moderate Level</option>
                <option value="Maximise Level">Maximise Level</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                <Globe size={16} className="text-emerald-500" /> Languages
              </label>
              <input
                name="languages"
                value={formData.languages}
                onChange={handleChange}
                placeholder="e.g. English, Urdu"
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                <MessageCircle size={16} className="text-blue-500" /> English Level
              </label>
              <select name="english_level" value={formData.english_level} onChange={handleChange} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="Basic">Basic</option>
                <option value="Conversational">Conversational</option>
                <option value="Fluent">Fluent</option>
                <option value="Native or Bilingual">Native or Bilingual</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wider">
              <FileText size={16} className="text-red-500" /> Job Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={8}
              className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
              placeholder="Describe the job requirements and responsibilities in detail..."
              required
            ></textarea>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">Required Skills (Comma separated)</label>
            <input
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              type="text"
              placeholder="e.g. React, Node.js, Photoshop"
              className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-100">
            <button type="button" onClick={() => navigate('/employer/dashboard/jobs')} className="px-8 py-3.5 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-all" disabled={loading}>
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="min-w-[200px] bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-10 rounded-2xl shadow-xl shadow-blue-100 transition-all disabled:opacity-70 flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Publishing...
                </>
              ) : (
                'Publish Job'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateJob;

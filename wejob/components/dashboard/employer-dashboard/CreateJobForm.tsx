
import React, { useState } from 'react';
import { Upload, Loader2, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../supabase';

const CreateJobForm: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State Management
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    jobType: 'Full Time',
    budget: '',
    experienceLevel: 'Mid-Level',
    deadline: '',
    description: '',
    skills: '',
    location: 'Remote', // Defaulting to Remote for simplicity, or add input
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validation: Ensure budget is a valid number
    if (isNaN(Number(formData.budget)) || Number(formData.budget) <= 0) {
      setError('Please enter a valid budget greater than 0.');
      setIsLoading(false);
      return;
    }

    try {
      // 1. Get Current User (Employer)
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('You must be logged in to post a job.');
      }

      // 2. API Integration: Insert into 'jobs' table via Supabase
      // Note: This replaces the requested "POST /api/jobs" to adhere to the project's Supabase architecture.
      const { error: insertError } = await supabase
        .from('jobs')
        .insert([{
          employer_id: user.id,
          title: formData.title,
          category: formData.category,
          type: formData.jobType,
          salary_min: Number(formData.budget), // Mapping single 'Budget' to min/max for compatibility
          salary_max: Number(formData.budget),
          budget: Number(formData.budget),
          experience_level: formData.experienceLevel,
          description: formData.description,
          skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
          deadline: formData.deadline,
          location: formData.location,
          status: 'open',
          is_approved: true, // Auto-approve for demo purposes
          created_at: new Date().toISOString()
        }]);

      if (insertError) throw insertError;

      // 3. Success State
      setShowSuccess(true);
      
      // 4. Redirect after brief delay
      setTimeout(() => {
        navigate('/employer/dashboard/jobs');
      }, 2000);

    } catch (err: any) {
      console.error('Error posting job:', err);
      setError(err.message || 'Failed to post job. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  /* 
   * FREELANCER IMPACT:
   * 
   * Data Structure & Fetching Strategy:
   * 
   * 1. Schema Compatibility: The data inserted here (title, salary_min/max, type, location) directly maps to the 
   *    fields displayed in the Freelancer's 'Job Feed'.
   *    
   * 2. Salary Display: The Freelancer JobFeed component often expects a 'salary_range' string. 
   *    When fetching jobs for the feed, the backend query (or frontend transformation) should format 
   *    `salary_min` and `salary_max` into a string like "$5000" or "$5k - $6k" to match the `Job` interface.
   * 
   * 3. Employer Info: The 'employer_name' required by the Job Feed is not stored in the 'jobs' table directly.
   *    It must be fetched via a JOIN with the 'profiles' or 'companies' table using 'employer_id'.
   * 
   * 4. Search & Filtering: The 'category', 'skills', and 'type' fields saved here are critical for the 
   *    Freelancer's search filters to function correctly, allowing them to find this job.
   */

  if (showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in duration-300">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Job Posted Successfully!</h2>
        <p className="text-gray-500">Redirecting you to your posted jobs...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-8">
      <div className="mb-6 md:mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">Post a New Job</h2>
        <p className="text-gray-500 mt-1 text-sm md:text-base">Fill in the details to find the best talent</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
        {error && (
          <div className="p-4 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Job Title *</label>
            <input 
              name="title"
              value={formData.title}
              onChange={handleChange}
              type="text" 
              required
              placeholder="e.g. Senior Product Designer" 
              className="w-full px-4 py-2.5 md:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm md:text-base"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
            <select 
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 md:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm md:text-base cursor-pointer"
            >
              <option value="">Select Category</option>
              <option value="Design">Design</option>
              <option value="Development">Development</option>
              <option value="Marketing">Marketing</option>
              <option value="Writing">Writing</option>
              <option value="Data Science">Data Science</option>
              <option value="Customer Support">Customer Support</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
            <select 
              name="jobType"
              value={formData.jobType}
              onChange={handleChange}
              className="w-full px-4 py-2.5 md:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm md:text-base cursor-pointer"
            >
              <option value="Full Time">Full Time</option>
              <option value="Part Time">Part Time</option>
              <option value="Contract">Contract</option>
              <option value="Freelance">Freelance</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
            <select 
              name="experienceLevel"
              value={formData.experienceLevel}
              onChange={handleChange}
              className="w-full px-4 py-2.5 md:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm md:text-base cursor-pointer"
            >
              <option value="Junior">Junior</option>
              <option value="Mid-Level">Mid-Level</option>
              <option value="Senior">Senior</option>
              <option value="Expert">Expert</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Budget ($) *</label>
              <input 
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                type="number" 
                min="1"
                required
                placeholder="e.g. 5000" 
                className="w-full px-4 py-2.5 md:py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none text-sm md:text-base focus:ring-2 focus:ring-blue-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Deadline *</label>
              <input 
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                type="date" 
                required
                className="w-full px-4 py-2.5 md:py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none text-sm md:text-base focus:ring-2 focus:ring-blue-500 cursor-pointer" 
              />
            </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
          <textarea 
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={6} 
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm md:text-base resize-none"
            placeholder="Describe the role, responsibilities, and requirements..."
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Required Skills</label>
          <input 
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            type="text" 
            placeholder="Add skills separated by comma (e.g. React, Figma, SEO)" 
            className="w-full px-4 py-2.5 md:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm md:text-base"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Upload Attachment (Optional)</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 md:p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer group">
            <Upload className="mx-auto h-8 w-8 md:h-10 md:w-10 text-gray-400 group-hover:text-blue-500 transition-colors mb-2" />
            <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
            <p className="text-xs text-gray-400 mt-1">PDF, DOCX, JPG (Max 5MB)</p>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full md:w-auto bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold py-3 px-8 rounded-lg shadow-md transition-all text-sm md:text-base disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Post Job Now'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateJobForm;

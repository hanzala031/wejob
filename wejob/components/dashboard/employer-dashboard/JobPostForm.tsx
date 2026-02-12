import React, { useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { supabase } from '../../../supabase';

const JobPostForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Development',
    budget: '',
    deadline: '',
    jobType: 'Full-time',
    experienceLevel: 'Mid',
    description: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast.error('You must be logged in to post a job.');
        setLoading(false);
        return;
      }

      // Basic validation
      if (Number(formData.budget) <= 0) {
        toast.error('Please enter a valid budget.');
        setLoading(false);
        return;
      }

      const { error } = await supabase
        .from('jobs')
        .insert([
          {
            employer_id: user.id,
            title: formData.title,
            category: formData.category,
            salary_min: Number(formData.budget), // Mapping budget to salary fields
            salary_max: Number(formData.budget),
            budget: Number(formData.budget),
            deadline: formData.deadline,
            type: formData.jobType,
            experience_level: formData.experienceLevel,
            description: formData.description,
            status: 'open',
            created_at: new Date().toISOString()
          }
        ]);

      if (error) throw error;

      toast.success('Job posted successfully!');
      // Reset form
      setFormData({
        title: '',
        category: 'Development',
        budget: '',
        deadline: '',
        jobType: 'Full-time',
        experienceLevel: 'Mid',
        description: ''
      });

    } catch (error: any) {
      console.error('Error posting job:', error);
      toast.error(error.message || 'Failed to post job.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 md:p-8">
      <Toaster position="top-right" />
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Post a New Job</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Find the perfect talent for your project.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Job Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Job Title
          </label>
          <input
            id="title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="e.g. Senior UX Designer"
            className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors text-gray-900 dark:text-gray-100"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors text-gray-900 dark:text-gray-100 cursor-pointer"
            >
              <option value="Development">Development</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
              <option value="Writing">Writing</option>
              <option value="Data Science">Data Science</option>
              <option value="Customer Support">Customer Support</option>
            </select>
          </div>

          {/* Job Type */}
          <div>
            <label htmlFor="jobType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Job Type
            </label>
            <select
              id="jobType"
              name="jobType"
              value={formData.jobType}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors text-gray-900 dark:text-gray-100 cursor-pointer"
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Freelance">Freelance</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Budget */}
          <div>
            <label htmlFor="budget" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Budget ($)
            </label>
            <input
              id="budget"
              type="number"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              required
              min="1"
              placeholder="e.g. 5000"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* Deadline */}
          <div>
            <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Deadline
            </label>
            <input
              id="deadline"
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* Experience Level */}
          <div>
            <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Experience Level
            </label>
            <select
              id="experienceLevel"
              name="experienceLevel"
              value={formData.experienceLevel}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors text-gray-900 dark:text-gray-100 cursor-pointer"
            >
              <option value="Junior">Junior</option>
              <option value="Mid">Mid-Level</option>
              <option value="Senior">Senior</option>
              <option value="Expert">Expert</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={6}
            placeholder="Describe the role, responsibilities, and requirements..."
            className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors text-gray-900 dark:text-gray-100 resize-none"
          ></textarea>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Posting...
              </>
            ) : (
              'Post Job'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobPostForm;

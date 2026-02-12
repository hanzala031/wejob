
import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, ChevronDown, ChevronUp, LayoutGrid, HelpCircle, Loader2 } from 'lucide-react';
import { supabase } from '../../../../supabase';
import { toast } from 'react-hot-toast';

const ContentCMSPage: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const { data: cats, error: catsError } = await supabase.from('job_categories').select('*');
      const { data: qas, error: faqsError } = await supabase.from('faqs').select('*');
      
      if (catsError) console.error('Cats Fetch Error:', catsError);
      if (faqsError) console.error('Faqs Fetch Error:', faqsError);

      setCategories(cats || []);
      setFaqs(qas?.map(f => ({ ...f, open: false })) || []);
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id: string) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      const { error } = await supabase.from('job_categories').delete().eq('id', id);
      if (error) throw error;
      setCategories(prev => prev.filter(c => c.id !== id));
      toast.success('Category removed');
    } catch (err) {
      toast.error('Failed to delete category');
    }
  };

  const toggleFaq = (id: string) => {
    setFaqs(faqs.map(f => f.id === id ? { ...f, open: !f.open } : f));
  };

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
      <Loader2 className="animate-spin text-[#2563eb]" size={40} />
      <p className="text-slate-500 font-medium">Loading site content...</p>
    </div>
  );

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Platform Content (CMS)</h1>
          <p className="text-slate-500 font-medium mt-1">Manage job categories and site content.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-[#2563EB] hover:bg-[#1d4ed8] text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-all">
          <Plus size={20} /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Categories Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-[#2563eb]/10 rounded-lg text-[#2563eb]">
              <LayoutGrid size={20} />
            </div>
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Job Categories</h3>
          </div>
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
            {categories.length === 0 ? (
              <div className="p-10 text-center text-slate-400 font-medium italic">No categories added yet.</div>
            ) : (
              categories.map((cat) => (
                <div key={cat.id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <span className="text-slate-700 font-bold text-lg">{cat.name}</span>
                  <div className="flex gap-2">
                    <button className="p-2 text-slate-400 hover:text-[#2563eb] transition-colors"><Edit2 size={16} /></button>
                    <button onClick={() => deleteCategory(cat.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* FAQs Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-600">
              <HelpCircle size={20} />
            </div>
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">FAQ Management</h3>
          </div>
          <div className="space-y-4">
            {faqs.length === 0 ? (
              <div className="bg-white p-10 rounded-3xl border border-dashed border-slate-300 text-center text-slate-400 font-medium italic">No FAQs configured.</div>
            ) : (
              faqs.map((faq) => (
                <div key={faq.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <button onClick={() => toggleFaq(faq.id)} className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors">
                    <span className="text-slate-800 font-bold">{faq.question}</span>
                    {faq.open ? <ChevronUp size={20} className="text-[#2563eb]" /> : <ChevronDown size={20} className="text-slate-400" />}
                  </button>
                  {faq.open && (
                    <div className="p-5 bg-slate-50 border-t border-slate-100 text-slate-600 leading-relaxed font-medium">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))
            )}
            <button className="w-full p-5 border-2 border-dashed border-slate-200 rounded-3xl text-slate-400 hover:text-[#2563eb] hover:border-[#2563eb] hover:bg-blue-50 transition-all font-bold flex items-center justify-center gap-2">
              <Plus size={20} /> Create New FAQ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentCMSPage;

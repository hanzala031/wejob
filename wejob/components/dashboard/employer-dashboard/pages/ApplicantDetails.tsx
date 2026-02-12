import React, { useState, useEffect } from 'react';
import { useParams, NavLink, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Download, Check, X, FileText, DollarSign } from 'lucide-react';
import { supabase } from '../../../../supabase';

const ApplicantDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [applicant, setApplicant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchApplicant = async () => {
      if (!id) return;
      try {
        // Fetch proposal with explicit columns
        const { data: proposalData, error: proposalError } = await supabase
          .from('proposals')
          .select('id, job_id, freelancer_id, bid_amount, estimated_time, cover_letter, status, created_at')
          .eq('id', id)
          .single();

        if (proposalError) throw proposalError;

        // Fetch Job
        const { data: jobData } = await supabase
          .from('jobs')
          .select('title, type')
          .eq('id', proposalData.job_id)
          .single();

        // Fetch Profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('first_name, last_name, avatar_url, location, bio, headline, skills, email')
          .eq('id', proposalData.freelancer_id)
          .single();
        
        setApplicant({
            id: proposalData.id,
            freelancer_id: proposalData.freelancer_id,
            name: profileData ? `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim() || 'Anonymous' : 'Anonymous',
            role: profileData?.headline || 'Freelancer',
            email: profileData?.email || 'Hidden',
            phone: 'Hidden',
            location: profileData?.location || 'Remote',
            avatar: profileData?.avatar_url || 'https://placehold.co/150',
            appliedDate: new Date(proposalData.created_at).toLocaleDateString(),
            status: proposalData.status,
            coverLetter: proposalData.cover_letter,
            bidAmount: proposalData.bid_amount,
            about: profileData?.bio || 'No bio provided.',
            skills: profileData?.skills || [],
            experience: [],
            jobTitle: jobData?.title || 'Unknown Job'
        });

      } catch (err) {
        console.error('Error fetching applicant:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicant();
  }, [id]);

  const handleStatusUpdate = async (newStatus: 'accepted' | 'rejected') => {
      if (!id) return;
      setProcessing(true);
      try {
          const { error } = await supabase
              .from('proposals')
              .update({ status: newStatus })
              .eq('id', id);
          
          if (error) throw error;
          
          setApplicant((prev: any) => ({ ...prev, status: newStatus }));
          
          // Optional: Create notification for freelancer
          if (applicant?.freelancer_id) {
              await supabase.from('notifications').insert([{
                  user_id: applicant.freelancer_id,
                  type: newStatus === 'accepted' ? 'success' : 'info',
                  title: `Application ${newStatus === 'accepted' ? 'Accepted' : 'Update'}`,
                  message: `Your proposal for "${applicant.jobTitle}" has been ${newStatus}.`
              }]);
          }

      } catch (err) {
          console.error('Error updating status:', err);
          alert('Failed to update status');
      } finally {
          setProcessing(false);
      }
  };

  if (loading) {
      return <div className="p-12 text-center text-gray-500">Loading details...</div>;
  }

  if (!applicant) {
      return <div className="p-12 text-center text-gray-500">Applicant not found.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <NavLink to="/employer/dashboard/applicants" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900">
        <ArrowLeft size={16} className="mr-1" /> Back to Applicants
      </NavLink>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 md:items-start border-b border-gray-100">
            <img src={applicant.avatar} alt={applicant.name} className="w-24 h-24 rounded-full object-cover border-4 border-gray-50" />
            <div className="flex-1">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{applicant.name}</h1>
                        <p className="text-lg text-blue-600 font-medium">{applicant.role}</p>
                        <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
                            <span className="flex items-center gap-1"><Mail size={16} /> {applicant.email}</span>
                            <span className="flex items-center gap-1"><MapPin size={16} /> {applicant.location}</span>
                            <span className="flex items-center gap-1 text-green-600 font-medium"><DollarSign size={16} /> Bid: ${applicant.bidAmount}</span>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors">
                            <Download size={18} /> Resume
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors">
                            <Mail size={18} /> Message
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3">
            <div className="lg:col-span-2 p-6 md:p-8 border-r border-gray-100">
                <section className="mb-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <FileText size={20} className="text-blue-500"/> Cover Letter
                    </h3>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{applicant.coverLetter}</p>
                    </div>
                </section>

                <section className="mb-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">About Candidate</h3>
                    <p className="text-gray-600 leading-relaxed">{applicant.about}</p>
                </section>

                <section>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                        {applicant.skills && applicant.skills.length > 0 ? (
                             applicant.skills.map((skill: string) => (
                                <span key={skill} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                                    {skill}
                                </span>
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm">No skills listed.</p>
                        )}
                    </div>
                </section>
            </div>

            <div className="p-6 md:p-8 bg-gray-50">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Application Status</h3>
                
                {applicant.status === 'pending' || applicant.status === 'shortlisted' ? (
                    <div className="space-y-3">
                        <button 
                            onClick={() => handleStatusUpdate('accepted')}
                            disabled={processing}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold transition-colors disabled:opacity-50"
                        >
                            <Check size={20} /> Accept Application
                        </button>
                        <button 
                            onClick={() => handleStatusUpdate('rejected')}
                            disabled={processing}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 font-bold transition-colors disabled:opacity-50"
                        >
                            <X size={20} /> Reject
                        </button>
                    </div>
                ) : (
                    <div className={`p-4 rounded-lg text-center font-bold border ${
                        applicant.status === 'accepted' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'
                    }`}>
                        Application {applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1)}
                    </div>
                )}

                <div className="mt-8">
                    <h3 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wider">Applied For</h3>
                    <p className="text-gray-700 font-medium">{applicant.jobTitle}</p>
                    <p className="text-sm text-gray-500">Applied on {applicant.appliedDate}</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantDetails;

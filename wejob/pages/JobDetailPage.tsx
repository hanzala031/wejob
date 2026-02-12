import React, { useRef, useEffect, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { toast } from 'react-hot-toast';

import { Heart, Star, CheckCircle2, Briefcase, Calendar, BarChart, Languages, MessageSquare, Paperclip, Wallet, Flag, Loader2, MapPin, Clock, Eye, ArrowRight, Layers, FileText } from 'lucide-react';

import { jobs } from '../components/LatestJobs';

interface Job {
    id: string;
    title: string;
    description: string;
    category: string;
    location: string;
    budget: number;
    salary_min: number;
    salary_max: number;
    type: string;
    freelancer_type: string;
    project_duration: string;
    project_level: string;
    languages: string[];
    english_level: string;
    skills: string[];
    views: number;
    created_at: string;
    deadline: string;
    employer_id: string;
    status: string;
}

interface JobDetailPageProps {
    onNavigate: (page: string, data?: any) => void;
}

const JobDetailPage: React.FC<JobDetailPageProps> = ({ onNavigate }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState<Job | null>(null);
    const [employer, setEmployer] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [proposals, setProposals] = useState<any[]>([]);
    const [isApplied, setIsApplied] = useState(false);
    
    const proposalFormRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchJobDetails = async () => {
            if (!id) return;

            // UUID Validation Regex
            const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);

            if (!isUUID) {
                console.log("Dummy ID detected, fetching from local data.");
                const dummyJob = jobs.find(j => j.id === Number(id));
                if (dummyJob) {
                    // Map dummy job to match rich layout format
                    setJob({
                        ...dummyJob,
                        id: dummyJob.id.toString(),
                        budget: Number(dummyJob.price),
                        skills: dummyJob.tags || [],
                        created_at: new Date().toISOString(),
                    } as any);
                    setEmployer({
                        full_name: dummyJob.company,
                        company_name: dummyJob.company,
                        location: dummyJob.location,
                        member_since: "2021",
                        avatar_url: "https://placehold.co/80"
                    });
                }
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                // 1. Fetch Real Job from Supabase
                const { data: jobData, error: jobError } = await supabase
                    .from('jobs')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (jobError) throw jobError;
                setJob(jobData);

                // Check if already applied
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const { data: appliedData } = await supabase
                        .from('proposals')
                        .select('id')
                        .eq('job_id', id)
                        .eq('freelancer_id', user.id)
                        .maybeSingle();
                    
                    if (appliedData) {
                        setIsApplied(true);
                    }
                }

                // 2. Increment views
                await supabase.from('jobs').update({ views: (jobData.views || 0) + 1 }).eq('id', id);

                // 3. Fetch Real Employer
                const { data: profileData } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', jobData.employer_id)
                    .single();
                
                setEmployer(profileData);

                // 4. Fetch Real Proposals
                const { data: propsData } = await supabase
                    .from('proposals')
                    .select('*')
                    .eq('job_id', id)
                    .order('created_at', { ascending: false });
                
                if (propsData) {
                    const enrichedProps = await Promise.all(propsData.map(async (p) => {
                        const { data: freelancer } = await supabase.from('profiles').select('full_name, avatar_url').eq('id', p.freelancer_id).single();
                        return { ...p, freelancer };
                    }));
                    setProposals(enrichedProps);
                }

            } catch (err: any) {
                console.error('Error fetching job:', err);
                toast.error('Failed to load job details');
            } finally {
                setLoading(false);
            }
        };

        fetchJobDetails();
    }, [id]);

    const handleScrollToProposal = () => {
        proposalFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const DetailItem: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
        <div className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl bg-white shadow-sm">
            <div className="text-blue-600 bg-blue-50 p-2.5 rounded-lg">{icon}</div>
            <div>
                <p className="text-[10px] uppercase tracking-widest font-black text-gray-400 leading-none mb-1">{label}</p>
                <p className="font-bold text-gray-800 text-sm">{value}</p>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center font-sans">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-500 font-bold animate-pulse uppercase tracking-widest">Loading Project intel...</p>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="bg-gray-50 min-h-screen flex items-center justify-center font-sans">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Job Not Found</h2>
                    <p className="text-gray-600 mb-4">We couldn't find the job you're looking for.</p>
                    <button onClick={() => navigate('/')} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold">
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#F8FAFC] font-sans">
            <div className="container mx-auto px-4 sm:px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Job Header */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-2 h-full bg-blue-600"></div>
                            <div className="text-xs font-black uppercase tracking-widest text-blue-600 mb-3 flex items-center gap-2">
                                <span>{job.category}</span>
                                <span className="text-gray-300">&bull;</span>
                                <span>{job.location}</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-6 leading-tight">{job.title}</h1>
                            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-sm">
                                <span className="flex items-center gap-2 text-gray-500 font-bold"><Clock size={16} /> Posted {new Date(job.created_at).toLocaleDateString()}</span>
                                <span className="flex items-center gap-2 text-gray-500 font-bold"><Eye size={16} /> {job.views || 0} Views</span>
                                <button className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors font-bold"><Heart size={16} /> Save Project</button>
                                {isApplied ? (
                                    <button disabled className="bg-green-100 text-green-600 font-black px-8 py-3 rounded-2xl border border-green-200 cursor-default flex items-center gap-2 uppercase tracking-widest text-xs">
                                        <CheckCircle2 size={16} /> Applied
                                    </button>
                                ) : (
                                    <button onClick={handleScrollToProposal} className="bg-blue-600 text-white font-black px-8 py-3 rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 uppercase tracking-widest text-xs">Send Proposal</button>
                                )}
                            </div>
                        </div>

                        {/* Job Details Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            <DetailItem icon={<Briefcase size={20} />} label="Freelancer type" value={job.freelancer_type || 'Individual'} />
                            <DetailItem icon={<Calendar size={20} />} label="Project duration" value={job.project_duration || 'Not specified'} />
                            <DetailItem icon={<BarChart size={20} />} label="Project level" value={job.project_level || 'Maximise Level'} />
                            <DetailItem icon={<Languages size={20} />} label="Languages" value={Array.isArray(job.languages) ? job.languages.join(', ') : (job.languages || 'English')} />
                            <DetailItem icon={<MessageSquare size={20} />} label="English Level" value={job.english_level || 'Fluent'} />
                        </div>
                        
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-10">
                            <div>
                                <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-3">
                                    <FileText className="text-blue-600" size={24} />
                                    Project Description
                                </h2>
                                <p className="text-gray-600 leading-relaxed whitespace-pre-line text-lg font-medium">
                                    {job.description}
                                </p>
                            </div>

                            <div>
                                <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-3">
                                    <Layers className="text-purple-600" size={24} />
                                    Skills Required
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {job.skills?.map((tag: string) => (
                                        <span key={tag} className="bg-gray-50 text-gray-700 text-sm font-bold px-4 py-2 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-white transition-all cursor-default">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-3">
                                    <Paperclip className="text-orange-600" size={24} />
                                    Attachments
                                </h2>
                                <p className="text-sm text-gray-400 font-bold italic">No files attached to this project.</p>
                            </div>
                        </div>
                        
                        {/* Proposals Section */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                             <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                <MessageSquare className="text-emerald-600" size={24} />
                                Project Proposals ({proposals.length})
                             </h2>
                            <div className="space-y-6">
                                {proposals.map((p: any) => (
                                    <div key={p.id} className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 hover:border-blue-100 transition-all">
                                        <div className="flex justify-between items-start gap-4">
                                            <div className="flex items-center gap-4">
                                                <img src={p.freelancer?.avatar_url || 'https://placehold.co/48'} className="w-12 h-12 rounded-xl object-cover shadow-sm" />
                                                <div>
                                                    <h3 className="font-bold text-gray-900">{p.freelancer?.full_name || 'Freelancer'}</h3>
                                                    <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest flex items-center gap-2 mt-1">
                                                        <span>{new Date(p.created_at).toLocaleDateString()}</span>
                                                        <span className="text-yellow-400 flex items-center gap-1"><Star size={10} className="fill-current" /> NO REVIEWS</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xl font-black text-gray-900">${p.bid_amount}</p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{p.estimated_time}</p>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-4 leading-relaxed line-clamp-3">{p.cover_letter}</p>
                                    </div>
                                ))}
                                {proposals.length === 0 && (
                                    <div className="text-center py-10">
                                        <p className="text-gray-400 font-bold italic">No proposals yet. Be the first to apply!</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Send Proposal Form */}
                        <div ref={proposalFormRef} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50"></div>
                            <h2 className="text-2xl font-black text-gray-900 mb-8 relative z-10">Send Your Proposal</h2>
                            
                            <form className="space-y-6 relative z-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-black text-gray-700 uppercase tracking-widest">Your Price ($)</label>
                                        <input type="number" placeholder="500.00" className="block w-full bg-gray-50 border border-gray-100 p-4 text-gray-900 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold transition-all"/>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-black text-gray-700 uppercase tracking-widest">Days to complete</label>
                                        <input type="text" placeholder="e.g. 7 Days" className="block w-full bg-gray-50 border border-gray-100 p-4 text-gray-900 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold transition-all"/>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-black text-gray-700 uppercase tracking-widest">Cover Letter</label>
                                    <textarea rows={6} placeholder="Describe your experience and approach..." className="mt-1 block w-full bg-gray-50 border border-gray-100 p-5 text-gray-900 rounded-3xl focus:ring-2 focus:ring-blue-500 outline-none font-medium transition-all"></textarea>
                                </div>
                                
                                <div className="space-y-3 pt-4">
                                    <UpgradeOption color="yellow" title="Stick this Proposal to the Top" desc="This sticky proposal will always be displayed on top of all the proposals." price="10.00" />
                                    <UpgradeOption color="blue" title="Make Sealed Proposal" desc="The sealed proposal will be sent to the project author only it will not be visible publicly." price="7.00" />
                                    <UpgradeOption color="purple" title="Featured Proposal" desc="The featured proposal will have a distinctive color and proper age to get the author's attention." price="5.00" />
                                </div>

                                <div className="pt-6">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input type="checkbox" className="h-5 w-5 rounded-lg border-gray-200 text-blue-600 focus:ring-blue-500 transition-all" /> 
                                        <span className="text-sm text-gray-500 font-bold group-hover:text-gray-700 transition-colors">I agree to the <a href="#" className="text-blue-600 hover:underline">Terms And Conditions</a></span>
                                    </label>
                                </div>
                                {isApplied ? (
                                    <div className="bg-green-50 border border-green-100 p-6 rounded-3xl text-center">
                                        <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                                        <p className="text-green-800 font-bold">You have already submitted a proposal for this project.</p>
                                    </div>
                                ) : (
                                    <button type="button" onClick={() => toast.success('Form logic coming soon!')} className="bg-blue-600 text-white font-black px-10 py-4 rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 uppercase tracking-widest text-sm w-full sm:w-auto">Submit Proposal</button>
                                )}
                            </form>
                        </div>
                    </div>
                    
                    {/* Right Column */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-6 space-y-8">
                           {/* Budget */}
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group">
                                <div className="absolute -top-4 -right-4 w-20 h-20 bg-emerald-50 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                                <div className="flex items-center justify-between mb-6 relative z-10">
                                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Budget</h3>
                                    <Wallet className="w-6 h-6 text-emerald-500" />
                                </div>
                                <div className="relative z-10">
                                    <p className="text-4xl font-black text-gray-900 mb-2">${job.budget || job.salary_min}</p>
                                    <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full border border-emerald-200">
                                        {job.deadline ? `EXPIRY: ${new Date(job.deadline).toLocaleDateString()}` : 'NEVER EXPIRE'}
                                    </span>
                                </div>
                            </div>
                            
                            {/* Employer Profile Card */}
                             <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="relative h-32 bg-gray-900">
                                    {employer?.cover_image ? (
                                        <img src={employer.cover_image} className="w-full h-full object-cover opacity-60" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-[#1C357B] to-[#2563EB]"></div>
                                    )}
                                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                                        <img src={employer?.avatar_url || 'https://placehold.co/80'} className="w-20 h-20 rounded-2xl border-4 border-white object-cover shadow-lg" />
                                    </div>
                                </div>
                                <div className="text-center pt-14 pb-8 px-8">
                                    <h3 className="font-black text-gray-900 text-xl">{employer?.company_name || employer?.full_name || 'Anonymous Client'}</h3>
                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1 flex items-center justify-center gap-2">
                                        <MapPin size={10} /> {employer?.location || 'Location Hidden'}
                                    </p>
                                    <button onClick={() => navigate(`/employer/${employer?.id}`)} className="mt-6 w-full bg-blue-600 text-white font-black py-3 rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 uppercase tracking-widest text-xs">View Profile</button>
                                </div>
                                <div className="border-t border-gray-50 p-6 space-y-4 text-xs font-bold text-gray-500">
                                    <div className="flex justify-between items-center">
                                        <span className="uppercase tracking-widest text-[10px] text-gray-400">Member Since</span>
                                        <span className="text-gray-900">{employer?.created_at ? new Date(employer.created_at).getFullYear() : '2024'}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="uppercase tracking-widest text-[10px] text-gray-400">Projects Completed</span>
                                        <span className="text-gray-900">{employer?.projects_completed || 0}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="uppercase tracking-widest text-[10px] text-gray-400">Payment Status</span>
                                        {employer?.payment_verified ? (
                                            <span className="text-emerald-600 flex items-center gap-1 uppercase text-[9px] tracking-widest">VERIFIED <CheckCircle2 size={12} /></span>
                                        ) : (
                                            <span className="text-gray-400 uppercase text-[9px] tracking-widest">UNVERIFIED</span>
                                        )}
                                    </div>
                                </div>
                             </div>

                             {/* Security/Report */}
                             <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between group cursor-pointer hover:bg-red-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <Flag className="text-gray-400 group-hover:text-red-500" size={18} />
                                    <span className="text-xs font-black text-gray-500 group-hover:text-red-600 uppercase tracking-widest">Report Project</span>
                                </div>
                                <ArrowRight size={16} className="text-gray-300 group-hover:text-red-400 transition-transform group-hover:translate-x-1" />
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const UpgradeOption: React.FC<{ color: string; title: string; desc: string; price: string }> = ({ color, title, desc, price }) => {
    const colors: any = {
        yellow: 'border-yellow-200 bg-yellow-50 text-yellow-800',
        blue: 'border-blue-200 bg-blue-50 text-blue-800',
        purple: 'border-purple-200 bg-purple-50 text-purple-800'
    };
    return (
        <label className={`flex items-start p-4 border-2 rounded-2xl cursor-pointer hover:scale-[1.01] transition-all ${colors[color]}`}>
            <input type="checkbox" className="h-5 w-5 mt-0.5 rounded-lg border-transparent focus:ring-0" /> 
            <span className="ml-4 flex-grow">
                <span className="block font-black text-sm uppercase tracking-tight">{title}</span>
                <span className="block text-xs mt-1 font-medium opacity-70">{desc}</span>
            </span> 
            <span className="font-black text-sm">${price}</span>
        </label>
    );
};

export default JobDetailPage;

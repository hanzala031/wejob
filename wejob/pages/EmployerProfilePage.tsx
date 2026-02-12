
import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { supabase } from '../supabase';

import { Facebook, Twitter, Linkedin, AlertTriangle, MapPin, Calendar, Briefcase, Loader2 } from 'lucide-react';

interface EmployerProfilePageProps {
    onNavigate: (page: string, data?: any) => void;
    employer?: any;
}

const EmployerJobCard: React.FC<{ job: any, employer: any, onNavigate: (page: string, data?: any) => void }> = ({ job, employer, onNavigate }) => {
    const handleJobClick = () => {
        onNavigate('jobdetail', { ...job, employer });
    };

    return (
        <div className="bg-white p-4 md:p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-300">
            <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                <div className="flex-1 min-w-0">
                    <h3 
                        className="text-base md:text-lg font-bold text-gray-800 hover:text-blue-600 cursor-pointer mb-2 line-clamp-2"
                        onClick={handleJobClick}
                    >
                        {job.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                        {job.tags?.map((tag: string) => (
                            <span key={tag} className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded whitespace-nowrap">{tag}</span>
                        ))}
                    </div>
                    <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {job.projectDuration || job.duration || 'Not specified'}</span>
                        <span className="hidden sm:inline">&middot;</span>
                        <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> {job.projectLevel || job.level || 'All levels'}</span>
                        <span className="hidden sm:inline">&middot;</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location || 'Remote'}</span>
                    </div>
                </div>
                
                {/* Price and Action Section - Row on mobile, Column on desktop */}
                <div className="flex flex-row sm:flex-col justify-between items-center sm:items-end gap-3 sm:gap-1 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 mt-1 sm:mt-0">
                    <div className="text-left sm:text-right">
                        <p className="text-lg md:text-xl font-bold text-gray-800">${job.price || job.budget || '0'}</p>
                        <p className="text-xs text-gray-500">{job.priceType || 'Project Budget'}</p>
                    </div>
                    <button 
                        onClick={handleJobClick}
                        className={`text-white font-semibold px-4 py-2 rounded-md transition-colors text-xs md:text-sm whitespace-nowrap ${job.status === 'closed' ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                        {job.status === 'closed' ? 'Closed' : 'View Detail'}
                    </button>
                </div>
            </div>
        </div>
    );
};


const EmployerProfilePage: React.FC<EmployerProfilePageProps> = ({ onNavigate, employer: propEmployer }) => {
    const { state } = useLocation();
    const { name } = useParams();
    const [employer, setEmployer] = useState<any>(propEmployer || state?.employer || null);
    const [loading, setLoading] = useState(!employer);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!employer && name) {
            fetchEmployer();
        }
    }, [name]);

    const fetchEmployer = async () => {
        try {
            setLoading(true);
            // Try to find by ID first if name looks like a UUID
            const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(name || '');
            
            let query = supabase.from('profiles').select('*');
            if (isUUID) {
                query = query.eq('id', name);
            } else {
                query = query.or(`full_name.ilike.%${name}%,username.ilike.%${name}%`);
            }

            const { data, error: fetchError } = await query.single();

            if (fetchError) throw fetchError;

            // Fetch jobs for this employer
            const { data: jobsData, error: jobsError } = await supabase
                .from('jobs')
                .select('*')
                .eq('employer_id', data.id)
                .order('created_at', { ascending: false });

            setEmployer({
                ...data,
                name: data.full_name,
                avatar: data.avatar_url,
                openJobs: jobsData || []
            });
        } catch (err: any) {
            console.error('Error fetching employer:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        </div>
    );

    if (error || !employer) return (
        <div className="p-10 text-center">
            <h2 className="text-xl font-bold mb-2">Employer not found</h2>
            <p className="text-gray-500">{error || "The employer profile you're looking for doesn't exist."}</p>
            <button onClick={() => onNavigate('home')} className="mt-4 text-blue-600 font-semibold">Back to Home</button>
        </div>
    );

    return (
        <div className="bg-gray-50 font-sans min-h-screen pb-12">
            {/* Banner */}
            <div className="relative h-48 md:h-64 bg-cover bg-center bg-blue-900" style={{ backgroundImage: employer.coverImage ? `url(${employer.coverImage})` : undefined }}>
                <div className="absolute inset-0 bg-black/20"></div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 -mt-16 md:-mt-20 relative z-10">
                <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-start">
                    {/* Left Sidebar */}
                    <aside className="lg:col-span-4 xl:col-span-3 mb-8 lg:mb-0">
                        <div className="sticky top-6 space-y-6">
                            <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg border border-gray-200 text-center">
                                <img src={employer.avatar || 'https://placehold.co/150'} alt={employer.name} className="w-24 h-24 md:w-28 md:h-28 rounded-full mx-auto -mt-16 mb-4 border-4 border-white object-cover shadow-sm bg-white" />
                                <h2 className="text-lg font-bold text-gray-900">{employer.username || employer.name}</h2>
                                <div className="flex justify-center divide-x divide-gray-200 my-4">
                                    <div className="px-4">
                                        <p className="font-bold text-lg md:text-xl text-gray-800">{String(employer.proposalsCount || 0).padStart(2, '0')}</p>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">Proposals</p>
                                    </div>
                                    <div className="px-4">
                                        <p className="font-bold text-lg md:text-xl text-gray-800">{String(employer.followersCount || 0).padStart(2, '0')}</p>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">Followers</p>
                                    </div>
                                </div>
                                <ul className="text-sm text-gray-600 space-y-3 text-left border-t border-gray-100 pt-4">
                                    <li className="flex justify-between items-center">
                                        <span className="text-gray-500">Contact</span> 
                                        <span className="font-semibold text-gray-800 text-xs">{employer.phone || 'login to view'}</span>
                                    </li>
                                    <li className="flex justify-between items-center">
                                        <span className="text-gray-500">Email</span> 
                                        <span className="font-semibold text-gray-800 text-xs">{employer.email || 'login to view'}</span>
                                    </li>
                                    <li className="flex justify-between items-center">
                                        <span className="text-gray-500">Department</span> 
                                        <span className="font-semibold text-gray-800 text-right">{employer.department || 'General'}</span>
                                    </li>
                                    <li className="flex justify-between items-center">
                                        <span className="text-gray-500">Employees</span> 
                                        <span className="font-semibold text-gray-800 text-right">{employer.employeeCount || '1-10'}</span>
                                    </li>
                                    <li className="flex justify-between items-center">
                                        <span className="text-gray-500">Member Since</span> 
                                        <span className="font-semibold text-gray-800 text-right">{employer.created_at ? new Date(employer.created_at).getFullYear() : '2024'}</span>
                                    </li>
                                </ul>
                                <div className="flex justify-center gap-3 mt-6">
                                    <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-[#3b5998] hover:text-white transition-all text-gray-500"><Facebook className="w-4 h-4" /></a>
                                    <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-[#1DA1F2] hover:text-white transition-all text-gray-500"><Twitter className="w-4 h-4" /></a>
                                    <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-[#0077b5] hover:text-white transition-all text-gray-500"><Linkedin className="w-4 h-4" /></a>
                                </div>
                            </div>
                             <button className="w-full bg-white border border-gray-200 py-3 rounded-lg shadow-sm flex items-center justify-center gap-2 text-sm font-semibold text-gray-600 hover:text-blue-600 hover:border-blue-200 transition-all">
                                <AlertTriangle className="w-4 h-4" /> Report Employer
                            </button>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="lg:col-span-8 xl:col-span-9">
                        <div className="bg-white p-4 md:p-8 rounded-lg shadow-lg border border-gray-200">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6 md:mb-8 border-b border-gray-100 pb-6">
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">{employer.name || employer.full_name}</h1>
                                    <div className="flex items-center text-gray-500 text-sm">
                                        <MapPin className="w-4 h-4 mr-1" />
                                        {employer.location || 'Remote'}
                                    </div>
                                </div>
                                <button className="bg-gray-800 text-white font-semibold px-6 py-2.5 rounded-md hover:bg-gray-900 transition-colors shadow-lg shadow-gray-200 w-full sm:w-auto text-center">
                                    Click to Follow
                                </button>
                            </div>

                            <div className="space-y-8">
                                <div>
                                    <h2 className="text-lg md:text-xl font-bold mb-4 text-gray-900 border-l-4 border-blue-600 pl-3">About Us</h2>
                                    <div className="space-y-4 text-sm md:text-base text-gray-600 leading-relaxed">
                                        {employer.about ? (
                                            <>
                                                <div>
                                                    <h3 className="font-semibold text-gray-800 mb-1">Who are we?</h3>
                                                    <p>{employer.about.whoWeAre || employer.bio || 'Information not provided.'}</p>
                                                </div>
                                                {employer.about.whatWeDo && (
                                                    <div>
                                                        <h3 className="font-semibold text-gray-800 mb-1">What do we do?</h3>
                                                        <p>{employer.about.whatWeDo}</p>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <p>{employer.bio || 'No description available for this employer.'}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                     <h2 className="text-lg md:text-xl font-bold mb-4 text-gray-900 border-l-4 border-blue-600 pl-3">Open Positions</h2>
                                     <div className="space-y-4">
                                         {employer.openJobs && employer.openJobs?.length > 0 ? (
                                             employer.openJobs?.map((job: any) => (
                                                <EmployerJobCard key={job.id} job={job} employer={employer} onNavigate={onNavigate} />
                                             ))
                                         ) : (
                                             <div className="text-center py-8 bg-gray-50 rounded-lg text-gray-500">
                                                 No open positions at the moment.
                                             </div>
                                         )}
                                     </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default EmployerProfilePage;


import React, { useEffect, useState } from 'react';
import JobCard from './JobCard';
import { ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '../supabase';

// Define employer first to be used in jobs
const veeGamingEmployer = {
    name: 'Have 5th Sense Creation',
    username: 'VeeGaming ...',
    avatar: 'https://res.cloudinary.com/dxvkigop9/image/upload/v1763013353/awad-3-1-150x150_yed2gk.jpg',
    coverImage: 'https://res.cloudinary.com/dxvkigop9/image/upload/v1763013231/employer-cover_goao13.jpg',
    memberSince: 'January 1, 2021',
    location: 'Victoria, Australia',
    projectsCompleted: 0,
    paymentVerified: false,
    emailVerified: true,
    proposalsCount: 4,
    followersCount: 3,
    department: 'Graphics Designing',
    employeeCount: 'Less than 10',
    totalViews: '18,944',
    about: {
        whoWeAre: "We are a Graphics Design and programming House, a well-balanced of a gifted group who loves their work. We're craftsmen in the field of the web and endeavor to make a decent plan and programming that is reasonable. We trust in difficult work and genuineness. We're generally putting our best self forward to make some amazing things to work with.",
        whatWeDo: "Regardless of whether you need a totally new brand or simply new plans to revive your current style, whether you need a versatile application for your phone or your local site, we can help you with that. We have been making professional web applications and brands for a long time. We will give you an expert arrangement that will separate your message. In a world full of an assortment of choices, potential clients will be unable to choose between organizations. A solid brand and message can have a significant effect in a new client working with you."
    },
    openJobs: []
};

export const jobs = [
  {
    id: 1,
    company: 'Have 5th Sense Creation',
    title: 'Need Technical Email Expert, Emails Ending Up....',
    tags: ['Artist', 'Data Entry', 'Designer', 'Logo Design', 'QA Specialist'],
    price: '500.00',
    expiry: 'Never Expire',
    proposals: '1 Received',
    featured: false,
    category: 'Business',
    location: 'Berwick',
    postedDate: 'February 28, 2021',
    views: '7,328',
    projectType: 'Individual',
    projectDuration: '1-5 Days',
    projectLevel: 'Maximise Level',
    language: 'English, Japanese',
    englishLevel: 'Fluent',
    description: 'We are a local business based out of LA and we are experiencing difficulty with our messages ending up in spam inboxes. We have used online assistance to attempt to limit the issue and it appears to be that we need to correctly set up our DMARC configuration and DKIM set up. I have screenshot an image of what the site says is not right with our messages. We use Sendinbly on our email strings. We need an expert to set up our ad campaigns correctly in Facebook/Instagram, and also, in Google/YouTube & LinkedIn. We are launching a farm and we will need to drive people to our squeeze page. We need to set up prospecting ads and also retargeting ads with custom audiences. We need a freelancer who can be available for a couple of updates during our timezone in the morning and once in...',
    attachments: [
      { name: 'image-of-the-issue.docx', size: '256KB' }
    ],
    proposalsList: [],
    employer: veeGamingEmployer
  },
  {
    id: 2,
    company: 'VeeGaming ...',
    title: 'iOS and Android SENIOR mobile app developer',
    tags: ['Backend Developer', 'Designer', 'iOS Developer', 'Support Agent'],
    price: '40.00',
    isHourly: true,
    expiry: 'Expired',
    proposals: '1 Received',
    featured: true,
    category: 'IOS',
    location: 'Hamburg',
    postedDate: 'February 28, 2021',
    views: '9,800',
    projectType: 'Individual',
    projectDuration: 'Ideal',
    projectLevel: 'Reprehen',
    language: 'Bilingual',
    englishLevel: 'English, Japanese',
    description: "Senior mobile app developer needed...",
    attachments: [],
    proposalsList: [],
    employer: veeGamingEmployer
  },
  {
    id: 3,
    company: 'VeeGaming ...',
    title: 'Integrate insurance marketplace quotation for...',
    tags: ['Android Developer', 'Backend Developer', 'Designer', 'Developer'],
    price: '580.00',
    expiry: '10 Days left',
    proposals: '1 Received',
    featured: true,
    category: 'Services',
    location: 'Berwick',
    postedDate: 'February 28, 2021',
    views: '4,908',
    projectType: 'Individual',
    projectDuration: 'Long Term',
    projectLevel: 'Moderate Level',
    projectCover: 'Rural',
    language: 'English, French, Spanish',
    description: "Insurance marketplace integration...",
    attachments: [],
    proposalsList: [],
    employer: veeGamingEmployer
  }
];

interface LatestJobsProps {
  onShowNotification: (message: string) => void;
  onNavigate: (page: string, data?: any) => void;
}

const LatestJobs: React.FC<LatestJobsProps> = ({ onShowNotification, onNavigate }) => {
  const [liveJobs, setLiveJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestJobs = async () => {
      try {
        setLoading(true);
        // 1. Fetch Approved Jobs
        const { data: jobsData, error: jobsError } = await supabase
          .from('jobs')
          .select('*')
          .eq('is_approved', true)
          .order('created_at', { ascending: false })
          .limit(8);

        if (jobsError) throw jobsError;

        if (jobsData) {
          // 2. Fetch Profiles manually for these jobs
          const formattedJobs = await Promise.all(jobsData.map(async (job: any) => {
            // Fetch profile
            const { data: profile } = await supabase
                .from('profiles')
                .select('full_name, company_name')
                .eq('id', job.employer_id)
                .single();

            // Fetch proposal count
            const { count } = await supabase
                .from('proposals')
                .select('*', { count: 'exact', head: true })
                .eq('job_id', job.id);

            return {
              id: job.id,
              company: profile?.company_name || profile?.full_name || 'Anonymous Client',
              title: job.title,
              tags: job.skills || [],
              price: job.budget ? `${job.budget}` : 'Negotiable',
              expiry: job.deadline ? new Date(job.deadline).toLocaleDateString() : 'Never Expire',
              proposals: `${count || 0} Received`,
              featured: job.is_featured || false,
              description: job.description,
              category: job.category,
              location: job.location,
              postedDate: new Date(job.created_at).toLocaleDateString()
            };
          }));
          setLiveJobs(formattedJobs);
        }
      } catch (err) {
        console.error('Error fetching latest jobs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLatestJobs();
  }, []);

  return (
    <section className="bg-gray-50 py-10 md:py-20 text-gray-800">
        <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-10 md:mb-16">
                <h2 className="text-2xl md:text-4xl font-bold mb-3">Our Latest Jobs</h2>
                <p className="text-sm md:text-base text-gray-500 max-w-xl mx-auto">Hand picked featured jobs from verified authors</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-1 gap-6 max-w-7xl mx-auto">
                {/* Live Jobs Section */}
                {loading ? (
                    <div className="col-span-1 md:col-span-2 lg:col-span-1 flex flex-col items-center justify-center py-12">
                        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                        <p className="text-gray-500 font-medium">Fetching the latest opportunities...</p>
                    </div>
                ) : (
                    liveJobs.map(job => (
                        <JobCard key={`live-${job.id}`} job={job as any} onShowNotification={onShowNotification} onNavigate={onNavigate} />
                    ))
                )}

                {/* Divider if we have both */}
                {liveJobs.length > 0 && <div className="col-span-1 md:col-span-2 lg:col-span-1 py-4 flex items-center gap-4"><div className="h-px bg-gray-200 flex-1"></div><span className="text-xs text-gray-400 font-bold uppercase tracking-widest">More Opportunities</span><div className="h-px bg-gray-200 flex-1"></div></div>}

                {/* Dummy Jobs Section */}
                {jobs.slice(0, 3).map(job => (
                    <JobCard key={`dummy-${job.id}`} job={job as any} onShowNotification={onShowNotification} onNavigate={onNavigate} />
                ))}
            </div>
            
            <div className="mt-12 text-center">
              <button 
                onClick={() => onNavigate('all-jobs')}
                type="button"
                className="flex justify-center gap-2 items-center mx-auto shadow-lg text-md bg-gray-50 backdrop-blur-md lg:font-semibold isolation-auto border-gray-50 before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-left-full before:hover:left-0 before:rounded-md before:bg-[#2563eb] hover:text-gray-50 before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700 relative z-10 px-4 py-2 overflow-hidden border-1 rounded-md group"
              >
                View More Jobs
                <svg className="w-8 h-8 justify-end group-hover:rotate-90 group-hover:bg-gray-50 text-gray-50 ease-linear duration-300 rounded-full border border-gray-700 group-hover:border-none p-2 rotate-45" viewBox="0 0 16 19" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 18C7 18.5523 7.44772 19 8 19C8.55228 19 9 18.5523 9 18H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM9 18L9 1H7L7 18H9Z" className="fill-gray-800 group-hover:fill-gray-800" />
                </svg>
              </button>
            </div>
        </div>
    </section>
  );
};

export default LatestJobs;

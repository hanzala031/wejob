
import React, { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { services } from '../components/ServicesData';

import { Star, MapPin, CheckCircle2, GraduationCap, Home, Languages, ShieldCheck, Send } from 'lucide-react';
import ServiceCard from '../components/ServiceCard';
import LoginEmployerModal from '../components/LoginEmployerModal';

interface FreelancerProfilePageProps {
    onNavigate: (page: string, data?: any) => void;
    freelancer?: any;
}

const RatingStars: React.FC<{ rating: number }> = ({ rating }) => (
    <div className="flex items-center">
        {[...Array(5)].map((_, index) => (
            <Star
                key={index}
                className={`w-4 h-4 ${index < Math.round(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
            />
        ))}
    </div>
);

const ProfileDetailItem: React.FC<{ icon: React.ReactNode, label: string, value: string }> = ({ icon, label, value }) => (
    <div className="flex items-center gap-3">
        <div className="text-gray-400">{icon}</div>
        <div>
            <p className="text-xs text-gray-500">{label}</p>
            <p className="font-semibold text-gray-800">{value}</p>
        </div>
    </div>
);

const FreelancerProfilePage: React.FC<FreelancerProfilePageProps> = ({ onNavigate, freelancer: propFreelancer }) => {
    const { state } = useLocation();
    const { id } = useParams();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Find freelancer (seller) from services
    const freelancer = propFreelancer || state?.freelancer || services.find(s => 
        s.seller?.name === decodeURIComponent(id || '')
    )?.seller;

    if (!freelancer) return <div>Freelancer not found.</div>;

    return (
        <div className="bg-gray-100 font-sans py-12">
            <div className="container mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* Left Sidebar */}
                    <aside className="lg:col-span-1">
                        <div className="sticky top-6 space-y-6">
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                <div className="text-center mb-6">
                                    <img src={freelancer.avatar} alt={freelancer.name} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white shadow-md" />
                                    <div className="flex items-center justify-center gap-2">
                                        <h1 className="text-xl font-bold">{freelancer.name}</h1>
                                        {freelancer.verified && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                                    </div>
                                    <p className="text-sm text-gray-500">{freelancer.title}</p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Starting from: 
                                        <span className="font-bold text-gray-800">
                                            {freelancer.hourlyRate ? ` $${freelancer.hourlyRate} /hr` : ` $${freelancer.tasks && freelancer.tasks[0]?.price ? `$${freelancer.tasks[0].price}` : 'N/A'}`}
                                        </span>
                                    </p>
                                </div>
                                <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-6">
                                    <RatingStars rating={freelancer.rating} />
                                    <span className="font-bold text-gray-800">{freelancer.rating.toFixed(1)}</span>
                                    <span>({freelancer.reviews} review) &middot; {freelancer.views} views</span>
                                </div>

                                <div className="space-y-4 text-sm">
                                    <ProfileDetailItem icon={<MapPin className="w-5 h-5" />} label="Location" value={freelancer.location} />
                                    <ProfileDetailItem icon={<Home className="w-5 h-5" />} label="Residence type" value={freelancer.residenceType} />
                                    <ProfileDetailItem icon={<Languages className="w-5 h-5" />} label="Languages" value={freelancer.languages} />
                                    <ProfileDetailItem icon={<ShieldCheck className="w-5 h-5" />} label="English level" value={freelancer.englishLevel} />
                                </div>
                                
                                <button 
                                    onClick={() => setIsModalOpen(true)}
                                    className="w-full mt-6 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                                    <Send className="w-5 h-5" />
                                    Send Message
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="lg:col-span-2 space-y-8">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <h2 className="text-xl font-bold mb-4">About</h2>
                            <p className="text-gray-600 leading-relaxed">{freelancer.about}</p>
                            
                            <h3 className="text-lg font-bold mt-6 mb-3">Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {freelancer.skills.map((skill: string, index: number) => (
                                    <span key={index} className="bg-gray-100 text-gray-700 text-sm font-medium px-3 py-1 rounded-full">{skill}</span>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <h2 className="text-xl font-bold mb-4">Education</h2>
                            <div className="space-y-4">
                                {freelancer.education.map((edu: any, index: number) => (
                                    <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                                        <div className="bg-gray-100 p-3 rounded-md">
                                            <GraduationCap className="w-6 h-6 text-gray-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-800">{edu.degree}</h3>
                                            <p className="text-sm text-gray-500">{edu.institution} &middot; {edu.dates}</p>
                                            <p className="text-sm text-gray-600 mt-1">{edu.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </main>
                </div>
                
                 {/* Tasks Section */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold mb-6">Tasks</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {freelancer.tasks && freelancer.tasks.map((task: any) => (
                           <ServiceCard key={task.id} service={task} onNavigate={onNavigate} />
                        ))}
                    </div>
                </div>
            </div>
            <LoginEmployerModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

export default FreelancerProfilePage;

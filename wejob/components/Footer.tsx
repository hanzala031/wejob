
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Phone, 
  Mail, 
  Printer, 
  MessageCircle, 
  Facebook, 
  Linkedin, 
  Youtube, 
  Twitter, 
  Dribbble, 
  Plus,
  Command
} from 'lucide-react';

const Footer: React.FC = () => {
    const navigate = useNavigate();
    
    const categories = [
        'AI Development', 'Video Art', 'Ads Campaign', 'Social Media',
        'Digital Marketing', 'Art & Illustration', 'App Design', 'Pattern Design', 'Sonic Branding'
    ];

    const contactInfo = [
        { icon: <Phone className="w-5 h-5 flex-shrink-0" />, text: '+041-8814515', note: '(Mon to Sat 9am - 5pm)' },
        { icon: <Mail className="w-5 h-5 flex-shrink-0" />, text: 'hello@weversity.org' },
        { icon: <Printer className="w-5 h-5 flex-shrink-0" />, text: '+62 811 09998263' },
        { icon: <MessageCircle className="w-5 h-5 flex-shrink-0" />, text: '(+041-8814515', note: '(Mon to Sat 9am - 5pm)' },
    ];
    
    return (
        <footer className="bg-[#0f172a] text-gray-400 font-sans">
            <div className="container mx-auto px-4 md:px-6 pt-12 md:pt-20">
                {/* Top Banner */}
                <div className="relative bg-[#1e293b] rounded-2xl p-6 md:p-12 mb-12 md:mb-16 overflow-hidden border border-[#2563eb]/20 shadow-xl">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 md:gap-8">
                        <div className="w-full lg:w-2/3 text-left">
                            <p className="text-xs md:text-sm font-semibold mb-2 text-[#2563eb]">Talk to support</p>
                            <h2 className="text-2xl md:text-4xl font-bold text-white mb-3 md:mb-4 leading-tight">Join & Get a Unique Opportunity</h2>
                            <p className="text-sm md:text-base text-gray-300 max-w-xl">
                                Connect with skilled professionals, streamline collaboration, and unlock success. Join now and redefine your work experience!
                            </p>
                        </div>
                        <div className="w-full lg:w-auto flex flex-col sm:items-start lg:items-end">
                            <button 
                                onClick={() => navigate('/signup')}
                                className="w-full sm:w-auto bg-[#2563eb] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#1d4ed8] transition-colors whitespace-nowrap text-sm md:text-base shadow-lg shadow-blue-900/50"
                            >
                                Get Started Now &gt;
                            </button>
                            <p className="text-xs mt-3 text-gray-500">Try it risk free 14 days money-back guarantee</p>
                        </div>
                    </div>
                </div>

                {/* Main Footer Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 lg:gap-16 px-2 md:px-10 text-base md:text-lg">
                    {/* Column 1: WEJOB */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                             <Command className="h-8 w-8 text-[#2563eb]" />
                             <span className="text-2xl font-bold tracking-tight text-white">WE<span className="text-[#2563eb]">JOB</span></span>
                        </div>
                        <p className="text-sm leading-relaxed text-gray-400">Our platform offers the best features for freelancers and clients, making it easy to connect, collaborate, and get work done</p>
                        <div className="flex flex-wrap gap-3 pt-2">
                            <a href="#" className="transition-opacity hover:opacity-80"><img src="https://res.cloudinary.com/dxvkigop9/image/upload/v1763185078/app-store-light_tmrgto.png" alt="App Store" className="h-10 md:h-12" /></a>
                            <a href="#" className="transition-opacity hover:opacity-80"><img src="https://res.cloudinary.com/dxvkigop9/image/upload/v1763185071/google-paly-light_zv3xzc.png" alt="Google Play" className="h-10 md:h-12" /></a>
                        </div>
                    </div>

                    {/* Column 2: Top Rated Categories */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-4">Top Rated Categories</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                            {categories.map(cat => <a key={cat} href="#" className="hover:text-[#2563eb] transition-colors block">{cat}</a>)}
                             <button className="flex items-center gap-1 hover:text-white transition-colors text-[#2563eb] hover:text-blue-400 mt-1">
                                <Plus className="w-4 h-4" />
                                Show All
                            </button>
                        </div>
                    </div>

                    {/* Column 3 & 4: Feel Free To Share Your Question */}
                    <div className="lg:col-span-2">
                        <h3 className="text-lg font-bold text-white mb-4">Feel Free To Share Your Question</h3>
                        <ul className="space-y-4 text-sm">
                            {contactInfo.map((item, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <div className="mt-0.5 text-gray-500 group-hover:text-[#2563eb] transition-colors">{item.icon}</div>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                      <a href="#" className="hover:text-[#2563eb] transition-colors font-medium">{item.text}</a>
                                      {item.note && <span className="text-gray-500 text-xs sm:text-sm">{item.note}</span>}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Sub-Footer */}
                <div className="mt-12 md:mt-16 px-2 md:px-10 pt-8 border-t border-gray-800 flex flex-col lg:flex-row justify-between items-center text-sm gap-6 pb-8 md:pb-12 text-center lg:text-left">
                    <div className="flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-3 order-2 lg:order-1">
                        <a href="#" className="hover:text-[#2563eb] transition-colors">Terms of service</a>
                        <a href="#" className="hover:text-[#2563eb] transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-[#2563eb] transition-colors">Content Privacy</a>
                    </div>
                    
                    <p className="text-gray-500 order-3 lg:order-2 w-full lg:w-auto text-center">Copyright &copy; All rights reserved. 2024</p>
                    
                    <div className="flex gap-5 order-1 lg:order-3">
                        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#2563eb] transition-transform hover:-translate-y-1"><Facebook className="w-5 h-5" /></a>
                        <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#2563eb] transition-transform hover:-translate-y-1"><Linkedin className="w-5 h-5" /></a>
                        <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#2563eb] transition-transform hover:-translate-y-1"><Youtube className="w-5 h-5" /></a>
                        <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#2563eb] transition-transform hover:-translate-y-1"><Twitter className="w-5 h-5" /></a>
                        <a href="https://dribbble.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#2563eb] transition-transform hover:-translate-y-1"><Dribbble className="w-5 h-5" /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
    

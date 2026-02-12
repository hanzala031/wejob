import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import DashboardStats from './DashboardStats';
import RecentActivities from './RecentActivities';
import PostedJobs from './PostedJobs';
import ApplicantsList from './ApplicantsList';
import CreateJobForm from './CreateJobForm';
import EmployerProfile from './EmployerProfile';
import { useUser } from '../../../context/UserContext';

const DashboardHome: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { profile, user: authUser } = useUser();

  const user = {
    name: profile ? (`${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Employer') : 'Employer',
    avatar: profile?.avatar_url || 'https://res.cloudinary.com/dxvkigop9/image/upload/v1763013353/awad-3-1-150x150_yed2gk.jpg',
    email: authUser?.email || ''
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
              <p className="text-gray-500">Welcome back, {user.name}!</p>
            </div>
            <DashboardStats />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <PostedJobs />
              </div>
              <div className="lg:col-span-1">
                <RecentActivities />
              </div>
            </div>
            <ApplicantsList />
          </div>
        );
      case 'jobs':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage Jobs</h1>
            <PostedJobs />
          </div>
        );
      case 'applicants':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">All Applicants</h1>
            <ApplicantsList />
          </div>
        );
      case 'create-job':
        return <CreateJobForm />;
      case 'profile':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Company Profile</h1>
            <EmployerProfile />
          </div>
        );
      default:
        return <div>Content not found</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Topbar 
          onMenuClick={() => setIsSidebarOpen(true)} 
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardHome;

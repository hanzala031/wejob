import React, { useState, useRef, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import LatestJobs from './components/LatestJobs';
import Marketplace from './components/Marketplace';
import PromoSection from './components/PromoSection';
import Testimonials from './components/Testimonials';
import FaqSection from './components/FaqSection';
import Notification from './components/Notification';
import ServicePage from './pages/ServicePage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import JobDetailPage from './pages/JobDetailPage';
import EmployerProfilePage from './pages/EmployerProfilePage';
import FreelancerProfilePage from './pages/FreelancerProfilePage';
import PricingSection from './components/PricingSection';
import Footer from './components/Footer';
import AllJobsPage from './pages/AllJobsPage';
import FreeTrialPopup from './components/FreeTrialPopup';
import { UserProvider } from './context/UserContext';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLoginPage from './pages/AdminLoginPage';
import ChatPage from './pages/ChatPage';
import ResetPassword from './pages/ResetPassword';

// Employer Dashboard Imports
import DashboardLayout from './components/dashboard/employer-dashboard/DashboardLayout';
import DashboardHome from './components/dashboard/employer-dashboard/pages/DashboardHome';
import PostedJobs from './components/dashboard/employer-dashboard/pages/PostedJobs';
import JobBidsPage from './components/dashboard/employer-dashboard/pages/JobBidsPage';
import CreateJob from './components/dashboard/employer-dashboard/pages/CreateJob';
import Applicants from './components/dashboard/employer-dashboard/pages/Applicants';
import ApplicantDetails from './components/dashboard/employer-dashboard/pages/ApplicantDetails';
import Notifications from './components/dashboard/employer-dashboard/pages/Notifications';
import CompanyProfilePage from './components/dashboard/employer-dashboard/pages/CompanyProfile';
import AccountSettings from './components/dashboard/employer-dashboard/pages/AccountSettings';
import EmployerBillingSettings from './components/dashboard/employer-dashboard/pages/BillingSettings';

// Freelancer Dashboard Imports
import FreelancerDashboardLayout from './components/dashboard/freelancer-dashboard/DashboardLayout';
import FreelancerDashboardHome from './components/dashboard/freelancer-dashboard/pages/DashboardHome';
import MyProposals from './components/dashboard/freelancer-dashboard/pages/MyProposals';
import SavedJobs from './components/dashboard/freelancer-dashboard/pages/SavedJobs';
import MyProjects from './components/dashboard/freelancer-dashboard/pages/MyProjects';
import Earnings from './components/dashboard/freelancer-dashboard/pages/Earnings';
import FreelancerNotifications from './components/dashboard/freelancer-dashboard/pages/Notifications';
import FreelancerProfileSettings from './components/dashboard/freelancer-dashboard/pages/FreelancerProfilePage';
import FreelancerSettings from './components/dashboard/freelancer-dashboard/pages/AccountSettings';
import BillingAndPayments from './components/dashboard/freelancer-dashboard/pages/BillingAndPayments';

// Admin Dashboard Imports
import AdminDashboardLayout from './components/dashboard/admin-dashboard/DashboardLayout';
import AdminDashboardHome from './components/dashboard/admin-dashboard/pages/AdminDashboardHome';
import UserManagement from './components/dashboard/admin-dashboard/pages/UserManagement';
import JobReview from './components/dashboard/admin-dashboard/pages/JobReview';
import Disputes from './components/dashboard/admin-dashboard/pages/Disputes';
import AdminSettings from './components/dashboard/admin-dashboard/pages/Settings';
import PaymentsPage from './components/dashboard/admin-dashboard/pages/PaymentsPage';
import VerificationPage from './components/dashboard/admin-dashboard/pages/VerificationPage';
import ContentCMSPage from './components/dashboard/admin-dashboard/pages/ContentCMSPage';
import ReportsLogsPage from './components/dashboard/admin-dashboard/pages/ReportsLogsPage';

const HomePage: React.FC<{ onShowNotification: (msg: string) => void, onNavigate: (page: string, data?: any) => void }> = ({ onShowNotification, onNavigate }) => {
  const marketplaceRef = useRef<HTMLElement>(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Trigger popup after 5 seconds
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleInternalPostProjectClick = () => {
    marketplaceRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <FreeTrialPopup isOpen={showPopup} onClose={() => setShowPopup(false)} />
      <Header onNavigate={onNavigate} onPostProjectClick={handleInternalPostProjectClick} />
      <div className="relative bg-[#1C357B] min-h-[85vh] py-12 flex flex-col text-white overflow-hidden font-sans">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-30 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2 opacity-30 blur-3xl"></div>
        <div className="flex-grow flex items-center w-full">
          <HeroSection />
        </div>
      </div>
      <main>
        <LatestJobs onShowNotification={onShowNotification} onNavigate={onNavigate} />
        <Marketplace ref={marketplaceRef} onNavigate={onNavigate} />
        <PromoSection />
        <Testimonials />
        <PricingSection />
        <FaqSection />
      </main>
      <Footer />
    </>
  );
}

const PageLayout: React.FC<{ children: React.ReactNode, onNavigate: (page: string, data?: any) => void }> = ({ children, onNavigate }) => (
  <>
    <Header onNavigate={onNavigate} onPostProjectClick={() => onNavigate('home')} />
    {children}
    <Footer />
  </>
);

const App: React.FC = () => {
  const [notification, setNotification] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const showNotification = (message: string) => {
    setNotification(message);
  };

  const handleNavigate = (page: string, data?: any) => {
    window.scrollTo(0, 0);
    switch (page) {
      case 'home':
        navigate('/');
        break;
      case 'all-jobs':
        navigate('/jobs');
        break;
      case 'service':
        navigate('/browse-job/services');
        break;
      case 'servicedetail':
        navigate(`/service/${data.id}`, { state: { service: data } });
        break;
      case 'jobdetail':
        navigate(`/job/${data.id}`, { state: { job: data } });
        break;
      case 'employerprofile':
        navigate(`/employer/${encodeURIComponent(data.name || data.username)}`, { state: { employer: data } });
        break;
      case 'freelancerprofile':
        navigate(`/freelancer/${encodeURIComponent(data.name)}`, { state: { freelancer: data } });
        break;
      case 'signin':
        navigate('/signin', { state: data });
        break;
      case 'signup':
        navigate('/signup');
        break;
      case 'forgotpassword':
        navigate('/forgot-password');
        break;
      case 'dashboard':
        navigate('/employer/dashboard');
        break;
      case 'dashboard/jobs/create':
        navigate('/employer/dashboard/jobs/create');
        break;
      case 'freelancer-dashboard':
        navigate('/freelancer/dashboard');
        break;
      default:
        navigate('/');
    }
  };

  return (
    <div className="bg-white">
      <Toaster position="top-right" />
      {notification && (
        <Notification message={notification} onClose={() => setNotification(null)} />
      )}

      <UserProvider>
        <Routes>
          <Route path="/" element={<HomePage onShowNotification={showNotification} onNavigate={handleNavigate} />} />

          <Route path="/jobs" element={
            <PageLayout onNavigate={handleNavigate}>
              <AllJobsPage onShowNotification={showNotification} onNavigate={handleNavigate} />
            </PageLayout>
          } />

          <Route path="/browse-job/services" element={
            <PageLayout onNavigate={handleNavigate}>
              <ServicePage onNavigate={handleNavigate} />
            </PageLayout>
          } />

          <Route path="/service/:id" element={
            <PageLayout onNavigate={handleNavigate}>
              <ServiceDetailPage onNavigate={handleNavigate} onShowNotification={showNotification} />
            </PageLayout>
          } />

          <Route path="/job/:id" element={
            <PageLayout onNavigate={handleNavigate}>
              <JobDetailPage onNavigate={handleNavigate} />
            </PageLayout>
          } />

          <Route path="/employer/:name" element={
            <PageLayout onNavigate={handleNavigate}>
              <EmployerProfilePage onNavigate={handleNavigate} />
            </PageLayout>
          } />

          <Route path="/freelancer/:id" element={
            <PageLayout onNavigate={handleNavigate}>
              <FreelancerProfilePage onNavigate={handleNavigate} />
            </PageLayout>
          } />

          <Route path="/chat/:chatPartnerId" element={
            <PageLayout onNavigate={handleNavigate}>
              <ChatPage />
            </PageLayout>
          } />

          <Route path="/signin" element={<SignInPage onNavigate={handleNavigate} />} />
          <Route path="/signup" element={<SignUpPage onNavigate={handleNavigate} />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage onNavigate={handleNavigate} />} />
          <Route path="/reset-password/*" element={<ResetPassword />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin-login" element={<AdminLoginPage />} />

          {/* Employer Dashboard Routes */}
          <Route path="/employer/dashboard" element={
            <ProtectedRoute allowedRole="employer">
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<DashboardHome />} />
            <Route path="jobs" element={<PostedJobs />} />
            <Route path="jobs/:id/proposals" element={<JobBidsPage />} />
            <Route path="jobs/create" element={<CreateJob />} />
            <Route path="applicants" element={<Applicants />} />
            <Route path="applicants/:id" element={<ApplicantDetails />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="billing" element={<EmployerBillingSettings />} />
            <Route path="profile" element={<CompanyProfilePage />} />
            <Route path="settings" element={<AccountSettings />} />
          </Route>

          {/* Freelancer Dashboard Routes */}
          <Route path="/freelancer/dashboard" element={
            <ProtectedRoute allowedRole="freelancer">
              <FreelancerDashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<FreelancerDashboardHome />} />
            <Route path="proposals" element={<MyProposals />} />
            <Route path="saved" element={<SavedJobs />} />
            <Route path="projects" element={<MyProjects />} />
            <Route path="earnings" element={<Earnings />} />
            <Route path="billing" element={<BillingAndPayments />} />
            <Route path="notifications" element={<FreelancerNotifications />} />
            <Route path="profile" element={<FreelancerProfileSettings />} />
            <Route path="settings" element={<FreelancerSettings />} />
          </Route>

          {/* Admin Dashboard Routes */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboardHome />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="jobs" element={<JobReview />} />
            <Route path="payments" element={<PaymentsPage />} />
            <Route path="verification" element={<VerificationPage />} />
            <Route path="cms" element={<ContentCMSPage />} />
            <Route path="reports" element={<ReportsLogsPage />} />
            <Route path="disputes" element={<Disputes />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          <Route path="*" element={<HomePage onShowNotification={showNotification} onNavigate={handleNavigate} />} />
        </Routes>
      </UserProvider>
    </div>
  );
};

export default App;

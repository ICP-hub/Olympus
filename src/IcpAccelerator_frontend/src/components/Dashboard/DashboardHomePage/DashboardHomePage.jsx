import React, { useState } from 'react'
import DashboardHomeNavbar from './DashboardHomeNavbar'
import DashboardHomeSidebar from './DashboardHomeSidebar'
import DashboardHomeWelcomeSection from './DashboardHomeWelcomeSection'
import DashboardHomeProfileCards from './DashboardHomeProfileCards'
import { Routes, Route, useLocation } from 'react-router-dom';
import ProjectProfile from './ProjectProfile'
import UserSection from './UserSection'
import Jobs from '../../jobs/Jobs'
import ProfilePage from '../../profile/ProfilePage'
import EventMain from '../DashboardEvents/EventMain'
import ServiceDetailPage from './ServiceDetailPage'
import AddNewWork from './AddNewWork'
import WorksSection from './WorksSection'
import WorkSectionDetailPage from './WorkSectionDetailPage'
import EventDetails from '../DashboardEvents/EventDetail'
import MentorSignupMain from '../../Modals/Mentor-Signup-Model/MentorsignUpmain'
import ProjectRegisterMain from '../../Modals/ProjectRegisterModal/ProjectRegisterMain'
import InvestorForm from '../../Auth/investorForm/InvestorForm'

function DashboardHomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex flex-col h-screen bg-gray-100 lg:flex-row">
      <DashboardHomeSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <DashboardHomeNavbar onMenuClick={toggleSidebar} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 bg-white">
          {/* <DashboardHomeWelcomeSection
            userName={"Matt"}
            profileCompletion={"20"}
          />

          <DashboardHomeProfileCards /> */}
          {/* <ProjectProfile /> */}
          {/* <UserSection /> */}
          <Routes location={location.state?.background || location}>
            <Route path="/" element={<DashboardHomeWelcomeSection userName={"Matt"} profileCompletion={"35"} />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/user" element={<UserSection />} />
            <Route path="/event" element={<EventMain />} />
            <Route path="/single-event" element={<EventDetails />} />
            <Route path="/project" element={<ProjectProfile />} />
            <Route path="/single-project" element={<ServiceDetailPage />} />
            <Route path="/single-add-new-work" element={<AddNewWork />} />
            <Route path="/work-section" element={<WorksSection />} />
            <Route path="/work-section-detail-page" element={<WorkSectionDetailPage />} />

          </Routes>
        </main>
        {location.state?.background && (
          <Routes>
            <Route path="/mentor-sign-up" element={<MentorSignupMain />} />
            <Route path="/project-sign-up" element={<ProjectRegisterMain />} />
            <Route path="/investor-sign-up" element={<InvestorForm />} />
          </Routes>
        )}
      </div>
    </div>
  );
}

export default DashboardHomePage;

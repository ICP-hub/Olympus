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
import { useSelector } from 'react-redux'
import DocumentSection from '../Project/DocumentSection'

function DashboardHomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex flex-col h-screen bg-[#FFF4ED] lg:flex-row">
      <DashboardHomeSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <DashboardHomeNavbar onMenuClick={toggleSidebar} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 md:pt-0 bg-white mr-[4%] rounded-3xl">
          <Routes >
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
            <Route path="/document" element={<DocumentSection />} />
          </Routes>
        </main>

      </div>
    </div>
  );
}

export default DashboardHomePage;

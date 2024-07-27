import React, { useState } from 'react'
import DashboardHomeNavbar from './DashboardHomeNavbar'
import DashboardHomeSidebar from './DashboardHomeSidebar'
import DashboardHomeWelcomeSection from './DashboardHomeWelcomeSection'
import DashboardHomeProfileCards from './DashboardHomeProfileCards'
import { Routes, Route } from 'react-router-dom';
import ProjectProfile from './ProjectProfile'
import UserSection from './UserSection'

function DashboardHomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex flex-col h-screen bg-gray-100 lg:flex-row">
      <DashboardHomeSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <DashboardHomeNavbar onMenuClick={toggleSidebar} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6">
          {/* <DashboardHomeWelcomeSection
            userName={"Matt"}
            profileCompletion={"20"}
          />
          <DashboardHomeProfileCards /> */}
          <ProjectProfile />
          {/* <UserSection /> */}
           {/* <Routes>
            <Route path="/" element={<DashboardHomeWelcomeSection userName={"Matt"} profileCompletion={"20"} />} />
            <Route path="/profile-cards" element={<DashboardHomeProfileCards />} />
            
          </Routes> */}
        </main>
      </div>
    </div>
  );
}

export default DashboardHomePage
import React from 'react'
import DashboardHomeNavbar from './DashboardHomeNavbar'
import DashboardHomeSidebar from './DashboardHomeSidebar'
import DashboardHomeWelcomeSection from './DashboardHomeWelcomeSection'
import DashboardHomeProfileCards from './DashboardHomeProfileCards';

function DashboardHomePage() {
  return (
    <div className="flex h-screen bg-gray-100">
      <DashboardHomeSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <DashboardHomeNavbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <DashboardHomeWelcomeSection userName={"Matt"} profileCompletion={"20"} />
          {/* <DashboardHomeProfileCards /> */}
        </main>
      </div>
    </div>
  );
}

export default DashboardHomePage

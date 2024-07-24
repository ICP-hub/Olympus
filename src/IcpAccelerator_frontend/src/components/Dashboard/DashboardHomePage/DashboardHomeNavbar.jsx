import React from 'react';

import bigLogo from "../../../../assets/Logo/bigLogo.png";
import { SearchOutlined, MailOutline, NotificationsNone } from '@mui/icons-material';

function DashboardHomeNavbar() {
  return (
    <nav className="bg-[#FFF4ED] py-3 px-6 flex items-center justify-between shadow-sm">
      {/* Search Bar */}
      <div className="flex-grow mr-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search people, projects, jobs, events"
            className="w-2/4 py-2 pl-10 pr-4 rounded-md bg-white-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <SearchOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Icons */}
      <div className="flex items-center space-x-4">
        <MailOutline className="text-gray-600 cursor-pointer" />
        <NotificationsNone className="text-gray-600 cursor-pointer" />
        <img src={bigLogo} alt="User" className="h-[20px] w-[30px] rounded-full" />
      </div>
    </nav>
  );
}

export default DashboardHomeNavbar;
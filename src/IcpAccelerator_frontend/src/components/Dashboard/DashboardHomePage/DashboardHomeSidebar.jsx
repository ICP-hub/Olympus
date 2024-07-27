import React from 'react';
import topLogo from "../../../../assets/Logo/topLogo.png";
import { NavLink, Link } from 'react-router-dom';
import {
  Home as DashboardIcon,
  Person as ProfileIcon,
  Group as UsersIcon,
  Event as EventsIcon,
  LocationOn as RegionalHubsIcon,
  Work as JobsIcon,
  Star as PerksIcon,
  Close as CloseIcon
} from '@mui/icons-material';


function DashboardSidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 bg-[#FFF4ED] w-64 h-screen overflow-y-auto flex flex-col transition-transform duration-300 ease-in-out transform
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0`}>
        <div className="p-4 flex justify-between items-center">
          <img src={topLogo} alt="Olympus" className="h-8" />
          <button onClick={onClose} className="lg:hidden">
            <CloseIcon className="text-gray-600" />
          </button>
        </div>
        <nav className="flex-1 py-6">
          <div className="px-4 mb-6">
            <Link to="/dashboard" className="flex items-center px-4 py-2 bg-[#e4e3e2b1] rounded-lg">
              <DashboardIcon className="mr-3" />
              <span>Dashboard</span>
            </Link>
          </div>

          <div className="mb-6">
            <h3 className="px-6 mb-2 text-xs font-semibold text-gray-500 uppercase">IDENTITY</h3>
            <ul>
              <li>
                <Link to="/dashboard/profile-cards" className="flex items-center px-6 py-2 text-gray-700 hover:bg-[#e4e3e2b1]">
                  <ProfileIcon className="mr-3" />
                  <span>Profile</span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="px-6 mb-2 text-xs font-semibold text-gray-500 uppercase">DISCOVER</h3>
            <ul>
              <li>
                <Link to="/users" className="flex items-center px-6 py-2 text-gray-700 hover:bg-[#e4e3e2b1]">
                  <UsersIcon className="mr-3" />
                  <span>Users</span>
                </Link>
              </li>
              <li>
                <Link to="/events" className="flex items-center px-6 py-2 text-gray-700 hover:bg-[#e4e3e2b1]">
                  <EventsIcon className="mr-3" />
                  <span>Events</span>
                </Link>
              </li>
              <li>
                <Link to="/regional-hubs" className="flex items-center px-6 py-2 text-gray-700 hover:bg-[#e4e3e2b1]">
                  <RegionalHubsIcon className="mr-3" />
                  <span>Regional Hubs</span>
                </Link>
              </li>
              <li>
                <Link to="/dashboard/jobs" className="flex items-center px-6 py-2 text-gray-700 hover:bg-[#e4e3e2b1]">
                  <JobsIcon className="mr-3" />
                  <span>Jobs</span>
                </Link>
              </li>
              <li>
                <Link to="/perks" className="flex items-center px-6 py-2 text-gray-700 hover:bg-[#e4e3e2b1]">
                  <PerksIcon className="mr-3" />
                  <span>Perks</span>
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </aside>
    </>
  );
}

export default DashboardSidebar;
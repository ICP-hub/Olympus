// import React from 'react';
// import topLogo from "../../../../assets/Logo/topLogo.png";
// import { NavLink, Link } from 'react-router-dom';
// import {
//   Home as DashboardIcon,
//   Person as ProfileIcon,
//   Group as UsersIcon,
//   Event as EventsIcon,
//   LocationOn as RegionalHubsIcon,
//   Work as JobsIcon,
//   Star as PerksIcon,
//   Close as CloseIcon
// } from '@mui/icons-material';
// import { briefcaseSvgIcon, calenderSvgIcon, gridSvgIcon, homeSvgIcon, locationHubSvgIcon, star, staroutlineSvgIcon, userCircleSvgIcon, userSvgIcon } from '../../Utils/Data/SvgData';


// function DashboardSidebar({ isOpen, onClose }) {
//   return (
//     <>
//       {/* Overlay for mobile */}
//       {isOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
//           onClick={onClose}
//         ></div>
//       )}

//       {/* Sidebar */}
//       <aside className={`
//         fixed top-0 left-0 z-50 bg-[#FFF4ED] w-64 h-screen overflow-y-auto flex flex-col transition-transform duration-300 ease-in-out transform
//         ${isOpen ? 'translate-x-0' : '-translate-x-full'}
//         lg:relative lg:translate-x-0`}>
//         <div className="p-4 flex justify-between items-center">
//           <img src={topLogo} alt="Olympus" className="h-8" />
//           <button onClick={onClose} className="lg:hidden">
//             <CloseIcon className="text-gray-600" />
//           </button>
//         </div>
//         <nav className="flex-1 py-6">
//           <div className="px-4 mb-6">
//             <Link to="/dashboard" className="flex items-center px-4 py-2  rounded-lg hover:bg-[#e4e3e2b1]">
//               {homeSvgIcon}
//               <span className='ml-3'>Dashboard</span>
//             </Link>
//           </div>

//           <div className="mb-6">
//             <h3 className="px-6 mb-2 text-xs font-semibold text-gray-500 uppercase">IDENTITY</h3>
//             <ul>
//               <li>
//                 <Link to="/dashboard/profile" className="flex items-center px-6 py-2 text-gray-700 hover:bg-[#e4e3e2b1]">
//                   {userCircleSvgIcon}
//                   <span className='ml-3'>Profile</span>
//                 </Link>
//               </li>
//             </ul>
//           </div>
//           <div className="mb-6">
//             <h3 className="px-6 mb-2 text-xs font-semibold text-gray-500 uppercase">PROJECTS</h3>
//             <ul>
//               <li>
//                 <Link to="/dashboard/project" className="flex items-center px-6 py-2 text-gray-700 hover:bg-[#e4e3e2b1]">
//                   {gridSvgIcon}
//                   <span className='ml-3'>Cyperhunk Labs</span>
//                 </Link>
//               </li>
//               <Link to="/dashboard/project" className="flex items-center px-6 py-2 text-gray-700 hover:bg-[#e4e3e2b1]">
//                 {gridSvgIcon}
//                 <span className='ml-3'>Create new Project</span>
//               </Link>
//             </ul>
//           </div>

//           <div>
//             <h3 className="px-6 mb-2 text-xs font-semibold text-gray-500 uppercase ">DISCOVER</h3>
//             <ul>
//               <li>
//                 <Link to="/dashboard/user" className="flex items-center px-6 py-2 text-gray-700 hover:bg-[#e4e3e2b1]">
//                   {userSvgIcon}
//                   <span className='ml-3'>Users</span>
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/dashboard/event" className="flex items-center px-6 py-2 text-gray-700 hover:bg-[#e4e3e2b1]">
//                   {calenderSvgIcon}
//                   <span className='ml-3'>Events</span>
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/regional-hubs" className="flex items-center px-6 py-2 text-gray-700 hover:bg-[#e4e3e2b1]">
//                   {locationHubSvgIcon}
//                   <span className='ml-3'>Regional Hubs</span>
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/dashboard/jobs" className="flex items-center px-6 py-2 text-gray-700 hover:bg-[#e4e3e2b1]">
//                   {briefcaseSvgIcon}
//                   <span className='ml-3'>Jobs</span>
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/perks" className="flex items-center px-6 py-2 text-gray-700 hover:bg-[#e4e3e2b1]">
//                   {staroutlineSvgIcon}
//                   <span className='ml-3'>Perks</span>
//                 </Link>
//               </li>
//             </ul>
//           </div>
//         </nav>
//       </aside>
//     </>
//   );
// }

// export default DashboardSidebar;
import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
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
import topLogo from "../../../../assets/Logo/topLogo.png";
import { briefcaseSvgIcon, calenderSvgIcon, gridSvgIcon, homeSvgIcon, locationHubSvgIcon, staroutlineSvgIcon, userCircleSvgIcon, userSvgIcon } from '../../Utils/Data/SvgData';
import { dashboard } from '../../jsondata/data/dashboardData';
function DashboardSidebar({ isOpen, onClose }) {
  const {dashboardhomesidebar} =dashboard
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);

  const handleLinkClick = (path) => {
    setActiveLink(path);
  };

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
            <Link
              to="/dashboard"
              onClick={() => handleLinkClick('/dashboard')}
              className={`flex items-center px-4 py-2 rounded-lg ${activeLink === '/dashboard' ? 'bg-[#e4e3e2b1] ' : 'hover:bg-[#e4e3e2b1]'}`}
            >
              {homeSvgIcon}
              <span className='ml-3'>{dashboardhomesidebar.sidebarSections.dashboard.label}</span>
            </Link>
          </div>

          <div className="mb-6">
            <h3 className="px-6 mb-2 text-xs font-semibold text-gray-500 uppercase">{dashboardhomesidebar.sidebarSections.identity.label}</h3>
            <ul>
              <li>
                <Link
                  to="/dashboard/profile"
                  onClick={() => handleLinkClick('/dashboard/profile')}
                  className={`flex items-center px-6 py-2 ${activeLink === '/dashboard/profile' ? 'bg-[#e4e3e2b1] ' : 'hover:bg-[#e4e3e2b1]'}`}
                >
                  {userCircleSvgIcon}
                  <span className='ml-3'>{dashboardhomesidebar.sidebarSections.identity.items.label}</span>
                </Link>
              </li>
            </ul>
          </div>
          <div className="mb-6">
            <h3 className="px-6 mb-2 text-xs font-semibold text-gray-500 uppercase">{dashboardhomesidebar.sidebarSections.projects.label}</h3>
            <ul>
              <li>
                <Link
                  to="/dashboard/project"
                  onClick={() => handleLinkClick('/dashboard/project')}
                  className={`flex items-center px-6 py-2 ${activeLink === '/dashboard/project' ? 'bg-[#e4e3e2b1] ' : 'hover:bg-[#e4e3e2b1]'}`}
                >
                  {gridSvgIcon}
                  <span className='ml-3'>{dashboardhomesidebar.sidebarSections.projects.items.label1} </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/project/new"
                  onClick={() => handleLinkClick('/dashboard/project/new')}
                  className={`flex items-center px-6 py-2 ${activeLink === '/dashboard/project/new' ? 'bg-[#e4e3e2b1] ' : 'hover:bg-[#e4e3e2b1]'}`}
                >
                  {gridSvgIcon}
                  <span className='ml-3'>Create new Project</span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="px-6 mb-2 text-xs font-semibold text-gray-500 uppercase">DISCOVER</h3>
            <ul>
              <li>
                <Link
                  to="/dashboard/user"
                  onClick={() => handleLinkClick('/dashboard/user')}
                  className={`flex items-center px-6 py-2 ${activeLink === '/dashboard/user' ? 'bg-[#e4e3e2b1] ' : 'hover:bg-[#e4e3e2b1]'}`}
                >
                  {userSvgIcon}
                  <span className='ml-3'>{dashboardhomesidebar.sidebarSections.discover.items.user}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/event"
                  onClick={() => handleLinkClick('/dashboard/event')}
                  className={`flex items-center px-6 py-2 ${activeLink === '/dashboard/event' ? 'bg-[#e4e3e2b1] ' : 'hover:bg-[#e4e3e2b1]'}`}
                >
                  {calenderSvgIcon}
                  <span className='ml-3'>{dashboardhomesidebar.sidebarSections.discover.items.events}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/regional-hubs"
                  onClick={() => handleLinkClick('/regional-hubs')}
                  className={`flex items-center px-6 py-2 ${activeLink === '/regional-hubs' ? 'bg-[#e4e3e2b1] ' : 'hover:bg-[#e4e3e2b1]'}`}
                >
                  {locationHubSvgIcon}
                  <span className='ml-3'>{dashboardhomesidebar.sidebarSections.discover.items.hub} </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/jobs"
                  onClick={() => handleLinkClick('/dashboard/jobs')}
                  className={`flex items-center px-6 py-2 ${activeLink === '/dashboard/jobs' ? 'bg-[#e4e3e2b1] ' : 'hover:bg-[#e4e3e2b1]'}`}
                >
                  {briefcaseSvgIcon}
                  <span className='ml-3'>{dashboardhomesidebar.sidebarSections.discover.items.jobs}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/perks"
                  onClick={() => handleLinkClick('/perks')}
                  className={`flex items-center px-6 py-2 ${activeLink === '/perks' ? 'bg-[#e4e3e2b1] ' : 'hover:bg-[#e4e3e2b1]'}`}
                >
                  {staroutlineSvgIcon}
                  <span className='ml-3'>{dashboardhomesidebar.sidebarSections.discover.items.perks}</span>
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

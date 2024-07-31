import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import bigLogo from "../../../../assets/Logo/bigLogo.png";
import topLogo from "../../../../assets/Logo/topLogo.png";
import { 
  SearchOutlined, 
  MailOutline, 
  NotificationsNone, 
  Menu as MenuIcon,
  Close as CloseIcon,
  Home as DashboardIcon,
  Person as ProfileIcon,
  Group as UsersIcon,
  Event as EventsIcon,
  LocationOn as RegionalHubsIcon,
  Work as JobsIcon,
  Star as PerksIcon
} from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { logoutStart } from '../../StateManagement/Redux/Reducers/InternetIdentityReducer';

function DashboardHomeNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await dispatch(logoutStart());
      setIsLoading(false);
      window.location.href = '/';
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <nav className="bg-[#FFF4ED] py-3 px-4 md:px-6 flex items-center justify-between shadow-sm relative">
      {/* Hamburger Menu for Mobile */}
      <button onClick={toggleMenu} className="lg:hidden">
        <MenuIcon className="text-gray-600" />
      </button>

      {/* Logo for larger screens */}
      {/* <div className="hidden lg:block">
        <img src={topLogo} alt="Olympus" className="h-8" />
      </div> */}

      {/* Search Bar */}
      <div className="flex-grow mr-4 hidden md:block">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="w-full py-2 pl-10 pr-4 rounded-md bg-white-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <SearchOutlined
            className="absolute left-3 text-gray-400"
            style={{ top: "50%", transform: "translateY(-50%)" }}
          />
        </div>
      </div>

      {/* Icons */}
      <div className="flex items-center space-x-4">
        <MailOutline className="text-gray-600 cursor-pointer hidden md:block" />
        <NotificationsNone className="text-gray-600 cursor-pointer hidden md:block" />
        <img
          src={bigLogo}
          alt="User"
          className="h-[20px] w-[30px] rounded-full"
          onClick={toggleDropdown}
       />
         {dropdownOpen && (
        <div className="absolute right-[20px] top-[40px] mt-2  bg-white border rounded-md shadow-lg z-20">
          <Link
            to="/dashboard/profile"
            className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
          >
            Profile
          </Link>
          <button
            onClick={() => { !isLoading && handleLogout() }}
            className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200"
          >
            Logout
          </button>
        </div>
      )}
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 z-50 lg:hidden">
          <div className="bg-[#FFF4ED] h-full w-64 p-4 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <img src={topLogo} alt="Olympus" className="h-8" />
              <button onClick={toggleMenu}>
                <CloseIcon className="text-gray-600" />
              </button>
            </div>
            <div className="mb-6 relative">
              <input
                type="text"
                placeholder="Search"
                className="w-full py-2 pl-10 pr-4 rounded-md bg-white-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            <nav>
              <Link
                to="/dashboard"
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-[#e4e3e2b1] rounded-lg mb-2"
              >
                <DashboardIcon className="mr-3" />
                <span>Dashboard</span>
              </Link>
              <Link
                to="/profile"
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-[#e4e3e2b1] rounded-lg mb-2"
              >
                <ProfileIcon className="mr-3" />
                <span>Profile</span>
              </Link>
              <Link
                to="/users"
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-[#e4e3e2b1] rounded-lg mb-2"
              >
                <UsersIcon className="mr-3" />
                <span>Users</span>
              </Link>
              <Link
                to="/events"
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-[#e4e3e2b1] rounded-lg mb-2"
              >
                <EventsIcon className="mr-3" />
                <span>Events</span>
              </Link>
              <Link
                to="/regional-hubs"
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-[#e4e3e2b1] rounded-lg mb-2"
              >
                <RegionalHubsIcon className="mr-3" />
                <span>Regional Hubs</span>
              </Link>
              <Link
                to="/jobs"
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-[#e4e3e2b1] rounded-lg mb-2"
              >
                <JobsIcon className="mr-3" />
                <span>Jobs</span>
              </Link>
              <Link
                to="/perks"
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-[#e4e3e2b1] rounded-lg mb-2"
              >
                <PerksIcon className="mr-3" />
                <span>Perks</span>
              </Link>
            </nav>
          </div>
        </div>
      )}
    </nav>
  );
}

export default DashboardHomeNavbar;
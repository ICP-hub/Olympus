
import React, { useCallback, useState } from "react";


import { Link } from "react-router-dom";
import bigLogo from "../../../../assets/Logo/bigLogo.png";
import topLogo from "../../../../assets/Logo/topLogo.png";

import NavbarSmallLogo from "../../../../assets/Logo/NavbarSmallLogo.png";
import Bellicon from "../../../../assets/Logo/Bellicon.png";
import { useSelector } from "react-redux";
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

  Star as PerksIcon,
} from "@mui/icons-material";
import {
  briefcaseSvgIcon,
  calenderSvgIcon,
  homeSvgIcon,
  locationHubSvgIcon,
  staroutlineSvgIcon,
  userCircleSvgIcon,
  userSvgIcon,
} from "../../Utils/Data/SvgData";
import { logoutStart } from "../../StateManagement/Redux/Reducers/InternetIdentityReducer";
import { useDispatch, useSelector } from "react-redux";
import { afterCopySvg } from "../../../component/Utils/Data/SvgData";
import { beforeCopySvg } from "../../../component/Utils/Data/SvgData";
import { changeHasSelectedRoleHandler } from "../../../component/StateManagement/Redux/Reducers/userRoleReducer";
import { useAuth } from "../../../component/StateManagement/useContext/useAuth";
import toast, { Toaster } from "react-hot-toast";

function DashboardHomeNavbar() {
  const principal = useSelector((currState) => currState.internet.principal);
  const userCurrentRoleStatus = useSelector(
    (currState) => currState.currentRoleStatus.rolesStatusArray
  );
  const userCurrentRoleStatusActiveRole = useSelector(
    (currState) => currState.currentRoleStatus.activeRole
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(principal).then(
      () => {
        setCustomSvg(afterCopySvg);
        toast.success("Principal copied to clipboard!");
      },
      (err) => {
        console.error("Could not copy text: ", err);
      }
    );
  }, [principal]);
  const { logout } = useAuth();
  const [customSvg, setCustomSvg] = useState(beforeCopySvg);
  const logoutHandler = async () => {
    dispatch(changeHasSelectedRoleHandler(false));
    await logout();
    // navigate("/");
    window.location.href = "/";
  };

  return (
    <nav className="bg-[#FFF4ED] py-3 px-4 md:px-6 flex items-center justify-between shadow-sm relative">
      {/* Hamburger Menu for Mobile */}
      <button onClick={toggleMenu} className="lg:hidden">
        <MenuIcon className="text-gray-600" />
      </button>

      <div className="flex-grow mr-4 hidden md:block">
        <div className="relative">
          <input
            type="text"
            placeholder="Search people, projects, jobs, events"
            className="w-[480px] h-[44px] py-2 pl-10 pr-4 rounded-md bg-white-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <SearchOutlined
            className="absolute left-3 text-gray-400"
            style={{ top: "50%", transform: "translateY(-50%)" }}
          />
        </div>
      </div>

      {/* Icons */}
      <div className="flex items-center space-x-4">

        <img src={Bellicon} className="w-[14.57px] h-[16.67px] cursor-pointer hidden md:block" />
        <img
          src={NavbarSmallLogo}
          alt="User"
          className="h-[40px] w-[40px] rounded-full z-30 py-1 px-1 "

          onClick={toggleDropdown}
        />
        {dropdownOpen && (
          <div
            id="userDropdown"
            className="absolute  divide-y divide-gray-100 rounded-lg shadow w-48 bg-gray-100 z-10 top-4 right-6"
          >
            <div className="px-4 py-3 text-sm text-gray-90 text-black">
              <div className="flex flex-row justify-between w-full">
                <button
                  onClick={toggleDropdown}
                  type="button"
                  className=" bg-transparent hover:text-black rounded-lg text-2xl  text-black"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="26"
                    height="8"
                    viewBox="0 0 20 8"
                    fill="none"
                  >
                    <path
                      d="M19.2556 4.7793C19.5317 4.77946 19.7557 4.55574 19.7559 4.2796C19.756 4.00346 19.5323 3.77946 19.2562 3.7793L19.2556 4.7793ZM0.902522 3.91471C0.707143 4.10985 0.706953 4.42643 0.902096 4.62181L4.08216 7.80571C4.27731 8.00109 4.59389 8.00128 4.78927 7.80613C4.98465 7.61099 4.98484 7.2944 4.78969 7.09902L1.96297 4.2689L4.7931 1.44217C4.98848 1.24703 4.98867 0.930444 4.79352 0.735065C4.59838 0.539685 4.2818 0.539495 4.08642 0.734639L0.902522 3.91471ZM19.2562 3.7793L1.25616 3.76847L1.25556 4.76847L19.2556 4.7793L19.2562 3.7793Z"
                      fill="#B3B3B3"
                    />
                  </svg>
                </button>
              </div>
              <div className="group flex items-center mt-4">
                <div className="truncate w-32 overflow-hidden text-ellipsis   group-hover:text-left ">
                  Principal: {principal}
                </div>
                <button
                  onClick={copyToClipboard}
                  className="ml-2 text-sm text-blue-500 hover:text-blue-700"
                >
                  {customSvg}
                </button>
              </div>
            </div>

            <div className="text-sm text-black font-bold">
              <Link
                to="/dashboard/profile"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
              >
                Profile
              </Link>

              {userCurrentRoleStatus &&
                // userCurrentRoleStatusActiveRole !== "user" &&
                userCurrentRoleStatusActiveRole !== null && (
                  <p
                    onClick={() =>
                      profileHandler(
                        userCurrentRoleStatus && userCurrentRoleStatusActiveRole
                      )
                    }
                    className="py-2 px-4 cursor-pointer hover:bg-gray-200"
                  >
                    My Profile
                  </p>
                )}
              <p
                className="py-2 px-4 hover:bg-gray-200 cursor-pointer"
                onClick={logoutHandler}
              >
                Sign out
              </p>
            </div>
          </div>
          // )}
          // </div>
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
                {homeSvgIcon}
                <span className="ml-3">Dashboard</span>
              </Link>
              <Link
                to="/profile"
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-[#e4e3e2b1] rounded-lg mb-2"
              >
                {userCircleSvgIcon}
                <span className="ml-3">Profile</span>
              </Link>
              <Link
                to="/users"
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-[#e4e3e2b1] rounded-lg mb-2"
              >
                {userSvgIcon}
                <span className="ml-3">Users</span>
              </Link>
              <Link
                to="/events"
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-[#e4e3e2b1] rounded-lg mb-2"
              >
                {calenderSvgIcon}
                <span className="ml-3">Events</span>
              </Link>
              <Link
                to="/regional-hubs"
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-[#e4e3e2b1] rounded-lg mb-2"
              >
                {locationHubSvgIcon}
                <span className="ml-3">Regional Hubs</span>
              </Link>
              <Link
                to="/jobs"
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-[#e4e3e2b1] rounded-lg mb-2"
              >
                {briefcaseSvgIcon}
                <span className="ml-3">Jobs</span>
              </Link>
              <Link
                to="/perks"
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-[#e4e3e2b1] rounded-lg mb-2"
              >
                {staroutlineSvgIcon}
                <span className="ml-3">Perks</span>
              </Link>
            </nav>
          </div>
        </div>
      )}
    </nav>
  );
}

export default DashboardHomeNavbar;

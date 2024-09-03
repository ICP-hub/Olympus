// import React, { useCallback, useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { dashboard } from "../../Utils/jsondata/data/dashboardData";
// import project from "../../../../assets/Logo/founder.png";
// import mentor from "../../../../assets/Logo/mentor.png";
// import user from "../../../../assets/Logo/talent.png";
// import vc from "../../../../assets/Logo/Avatar3.png";
// import { useDispatch, useSelector } from "react-redux";
// import { afterCopySvg, beforeCopySvg } from "../../../component/Utils/Data/SvgData";
// import { changeHasSelectedRoleHandler } from "../../../components/StateManagement/Redux/Reducers/userRoleReducer";
// import { useAuth } from "../../../components/StateManagement/useContext/useAuth";
// import toast from "react-hot-toast";
// import RollingComponent from "../../Common/ToogleSwitch/RollingComponent";
// import { switchRoleRequestHandler } from "../../StateManagement/Redux/Reducers/userCurrentRoleStatusReducer";

// function DashboardHomeNavbar() {
//   const principal = useSelector((currState) => currState.internet.principal);
//   const userCurrentRoleStatus = useSelector(
//     (currState) => currState.currentRoleStatus.rolesStatusArray
//   );
//   const userCurrentRoleStatusActiveRole = useSelector(
//     (currState) => currState.currentRoleStatus.activeRole
//   );
//   const dispatch = useDispatch();
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [customSvg, setCustomSvg] = useState(beforeCopySvg);

//   const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
//   const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

//   const copyToClipboard = useCallback(() => {
//     navigator.clipboard.writeText(principal).then(
//       () => {
//         setCustomSvg(afterCopySvg);
//         toast.success("Principal copied to clipboard!");
//       },
//       (err) => {
//         console.error("Could not copy text: ", err);
//       }
//     );
//   }, [principal]);

//   const { logout } = useAuth();
//   const logoutHandler = async () => {
//     dispatch(changeHasSelectedRoleHandler(false));
//     await logout();
//     window.location.href = "/";
//   };

//    // Define roles and their associated images
//    const roleData = [
//     { name: 'mentor', image: mentor },
//     { name: 'vc', image: vc },
//     { name: 'project', image: project },
//     { name: 'user', image: user }
//   ];

//   const [isToggled, setIsToggled] = useState(false);
//   const [currentImage, setCurrentImage] = useState(user); // Default to user image

//   // Helper function to find the image associated with a role
//   const findRoleImage = (roleName) => {
//     const role = roleData.find(r => r.name === roleName);
//     return role ? role.image : user; // Fallback to user image if role not found
//   };

//   // Merging the backend data with roleData
//   const mergeData = (backendData, additionalData) => {
//     return backendData?.map(item => {
//       const additionalInfo = additionalData?.find(data => data.name === item.name);
//       return additionalInfo ? { ...item, ...additionalInfo } : item;
//     });
//   };

//   const mergedData = mergeData(userCurrentRoleStatus, roleData);

//   const handleToggleChange = (toggleValue) => {
//     let newRole;
//     let newImage;
//     let disableToggle = false;

//     const userRole = mergedData.find(role => role.name === "user");
//     const projectRole = mergedData.find(role => role.name === "project");
//     const mentorRole = mergedData.find(role => role.name === "mentor");
//     const vcRole = mergedData.find(role => role.name === "vc");

//     // Condition 1: Only user is approved, others are default -> Disable toggle
//     if (
//       userRole?.approval_status === "approved" &&
//       projectRole?.approval_status === "default" &&
//       mentorRole?.approval_status === "default" &&
//       vcRole?.approval_status === "default"
//     ) {
//       disableToggle = true;
//     }
//     // Condition 2: Project and user are approved -> false for user, true for project
//     else if (projectRole?.approval_status === "approved" && userRole?.approval_status === "approved") {
//       newRole = toggleValue === true ? "project" : "user";
//       newImage = findRoleImage(newRole);
//     }
//     // Condition 3: VC and user are approved -> false for user, true for VC
//     else if (vcRole?.approval_status === "approved" && userRole?.approval_status === "approved") {
//       newRole = toggleValue === true ? "vc" : "user";
//       newImage = findRoleImage(newRole);
//     }
//     // Condition 4: Mentor and user are approved -> false for user, true for mentor
//     else if (mentorRole?.approval_status === "approved" && userRole?.approval_status === "approved") {
//       newRole = toggleValue === true ? "mentor" : "user";
//       newImage = findRoleImage(newRole);
//     }
//     // Condition 5: Mentor and VC are approved -> false for mentor, true for VC
//     else if (mentorRole?.approval_status === "approved" && vcRole?.approval_status === "approved") {
//       newRole = toggleValue === true ? "vc" : "mentor";
//       newImage = findRoleImage(newRole);
//     }
//     // Default case: disable toggle if no valid condition is met
//     else {
//       disableToggle = true;
//     }

//     if (disableToggle) {
//       console.log("Toggle is disabled due to conditions.");
//       return; // Exit without changing state or triggering the event if the toggle should be disabled
//     }

//     setIsToggled(toggleValue);
//     setCurrentImage(newImage);
//     clickEventHandler(newRole, "active");
//   };

//   const clickEventHandler = async (roleName, newStatus) => {
//     await dispatch(
//       switchRoleRequestHandler({
//         roleName,
//         newStatus, // This is set to "active"
//       })
//     );
//   };

//   // Set the initial image based on the active role when the component mounts
//   useEffect(() => {
//     const activeRole = mergedData.find(role => role.name === userCurrentRoleStatusActiveRole);
//     if (activeRole) {
//       setCurrentImage(activeRole.image);
//     }
//   }, [mergedData, userCurrentRoleStatusActiveRole]);


//   return (
//     <nav className="bg-[#FFF4ED] py-3 px-4 md:px-12 md:pl-1 flex items-center justify-between relative pb-8">
//       <button onClick={toggleMenu} className="lg:hidden">
//         <dashboard.dashboardhomenavbar.icons.menuIcon.Menu className="text-gray-600" />
//       </button>

//       <div className="flex-grow mr-4 hidden md:block">
//         <div className="relative">
//           <input
//             type="text"
//             placeholder="Search people, projects, jobs, events"
//             className="w-[480px] h-[44px] py-2 pl-10 pr-4 rounded-md bg-white-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           <dashboard.dashboardhomenavbar.icons.searchOutlined.SearchOutlined
//             className="absolute left-3 text-gray-400"
//             style={{ top: "50%", transform: "translateY(-50%)" }}
//           />
//         </div>
//       </div>

//       <div className="flex items-center space-x-4">
//         {/* <RollingComponent
//           isToggled={isToggled}
//           toggle={handleToggleChange}
//           image={currentImage}
//         /> */}

//         <img
//           src={dashboard.dashboardhomenavbar.logoImages.bellicon.Bellicon}
//           className="w-[14.57px] h-[16.67px] cursor-pointer hidden md:block"
//           alt="Notification Bell"
//         />
//         <img
//           src={dashboard.dashboardhomenavbar.logoImages.df_small_logo.df_small_logo}
//           alt="User"
//           className="h-[40px] w-[40px] rounded-full z-30 py-1 px-1"
//           onClick={toggleDropdown}
//         />
//         {dropdownOpen && (
//           <div
//             id="userDropdown"
//             className="absolute divide-y divide-gray-100 rounded-lg shadow w-48 bg-gray-100 z-50 top-4 right-[3.2rem]"
//           >
//             <div className="px-4 py-3 text-sm text-gray-900 text-black">
//               <div className="flex flex-row justify-between w-full">
//                 <button
//                   onClick={toggleDropdown}
//                   type="button"
//                   className="bg-transparent hover:text-black rounded-lg text-2xl text-black"
//                 >
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     width="26"
//                     height="8"
//                     viewBox="0 0 20 8"
//                     fill="none"
//                   >
//                     <path
//                       d="M19.2556 4.7793C19.5317 4.77946 19.7557 4.55574 19.7559 4.2796C19.756 4.00346 19.5323 3.77946 19.2562 3.7793L19.2556 4.7793ZM0.902522 3.91471C0.707143 4.10985 0.706953 4.42643 0.902096 4.62181L4.08216 7.80571C4.27731 8.00109 4.59389 8.00128 4.78927 7.80613C4.98465 7.61099 4.98484 7.2944 4.78969 7.09902L1.96297 4.2689L4.7931 1.44217C4.98848 1.24703 4.98867 0.930444 4.79352 0.735065C4.59838 0.539685 4.2818 0.539495 4.08642 0.734639L0.902522 3.91471ZM19.2562 3.7793L1.25616 3.76847L1.25556 4.76847L19.2556 4.7793L19.2562 3.7793Z"
//                       fill="#B3B3B3"
//                     />
//                   </svg>
//                 </button>
//               </div>
//               <div className="group flex items-center mt-4">
//                 <div className="truncate w-32 overflow-hidden text-ellipsis group-hover:text-left">
//                   {dashboard.dashboardhomenavbar.navbarTexts.principalLabel}: {principal}
//                 </div>
//                 <button
//                   onClick={copyToClipboard}
//                   className="ml-2 text-sm text-blue-500 hover:text-blue-700"
//                 >
//                   {customSvg}
//                 </button>
//               </div>
//             </div>

//             <div className="text-sm text-black font-bold">
//               <p
//                 className="py-2 px-4 hover:bg-gray-200 cursor-pointer"
//                 onClick={logoutHandler}
//               >
//                 {dashboard.dashboardhomenavbar.navbarTexts.signOutText}
//               </p>
//             </div>
//           </div>
//         )}
//       </div>

//       {isMenuOpen && (
//         <div className="fixed inset-0 bg-gray-800 bg-opacity-75 z-50 lg:hidden">
//           <div className="bg-[#FFF4ED] h-full w-64 p-4 overflow-y-auto">
//             <div className="flex justify-between items-center mb-6">
//               <img
//                 src={dashboard.dashboardhomenavbar.logoImages.olympuslogo.olympuslogo}
//                 alt="Olympus"
//                 className="h-8"
//               />
//               <button onClick={toggleMenu}>
//                 <dashboardhomenavbar.icons.closeIcon.Close className="text-gray-600" />
//               </button>
//             </div>
//             <div className="mb-6 relative">
//               <input
//                 type="text"
//                 placeholder="Search"
//                 className="w-full py-2 pl-10 pr-4 rounded-md bg-white-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//               <dashboardhomenavbar.icons.searchOutlined.SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
//             </div>
//             <nav>
//               <Link
//                 to="/dashboard"
//                 className="flex items-center px-4 py-2 text-gray-700 hover:bg-[#e4e3e2b1] rounded-lg mb-2"
//               >
//                 {dashboard.dashboardhomenavbar.icons.dashboardIcon.homeSvgIcon}
//                 <span className="ml-3">
//                   {dashboard.dashboardhomenavbar.menuTexts.dashboard}
//                 </span>
//               </Link>
//               <Link
//                 to="/profile"
//                 className="flex items-center px-4 py-2 text-gray-700 hover:bg-[#e4e3e2b1] rounded-lg mb-2"
//               >
//                 {dashboard.dashboardhomenavbar.icons.profileIcon.userCircleSvgIcon}
//                 <span className="ml-3">
//                   {dashboard.dashboardhomenavbar.menuTexts.profile}
//                 </span>
//               </Link>
//               <Link
//                 to="/users"
//                 className="flex items-center px-4 py-2 text-gray-700 hover:bg-[#e4e3e2b1] rounded-lg mb-2"
//               >
//                 {dashboard.dashboardhomenavbar.icons.usersIcon.userSvgIcon}
//                 <span className="ml-3">
//                   {dashboard.dashboardhomenavbar.menuTexts.users}
//                 </span>
//               </Link>
//               <Link
//                 to="/events"
//                 className="flex items-center px-4 py-2 text-gray-700 hover:bg-[#e4e3e2b1] rounded-lg mb-2"
//               >
//                 {dashboard.dashboardhomenavbar.icons.eventsIcon.calenderSvgIcon}
//                 <span className="ml-3">
//                   {dashboard.dashboardhomenavbar.menuTexts.events}
//                 </span>
//               </Link>
//               <Link
//                 to="/regional-hubs"
//                 className="flex items-center px-4 py-2 text-gray-700 hover:bg-[#e4e3e2b1] rounded-lg mb-2"
//               >
//                 {dashboard.dashboardhomenavbar.icons.regionalHubsIcon.locationHubSvgIcon}
//                 <span className="ml-3">
//                   {dashboard.dashboardhomenavbar.menuTexts.regionalHubs}
//                 </span>
//               </Link>
//               <Link
//                 to="/jobs"
//                 className="flex items-center px-4 py-2 text-gray-700 hover:bg-[#e4e3e2b1] rounded-lg mb-2"
//               >
//                 {dashboard.dashboardhomenavbar.icons.jobsIcon.briefcaseSvgIcon}
//                 <span className="ml-3">
//                   {dashboard.dashboardhomenavbar.menuTexts.jobs}
//                 </span>
//               </Link>
//               <Link
//                 to="/perks"
//                 className="flex items-center px-4 py-2 text-gray-700 hover:bg-[#e4e3e2b1] rounded-lg mb-2"
//               >
//                 {dashboard.dashboardhomenavbar.icons.perksIcon.staroutlineSvgIcon}
//                 <span className="ml-3">
//                   {dashboard.dashboardhomenavbar.menuTexts.perks}
//                 </span>
//               </Link>
//             </nav>
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// }

// export default DashboardHomeNavbar;
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { dashboard } from "../../Utils/jsondata/data/dashboardData";
import project from "../../../../assets/Logo/founder.png";
import mentor from "../../../../assets/Logo/mentor.png";
import user from "../../../../assets/Logo/talent.png";
import vc from "../../../../assets/Logo/Avatar3.png";
import { useDispatch, useSelector } from "react-redux";
import { afterCopySvg, beforeCopySvg } from "../../../component/Utils/Data/SvgData";
import { changeHasSelectedRoleHandler } from "../../../components/StateManagement/Redux/Reducers/userRoleReducer";
import { useAuth } from "../../../components/StateManagement/useContext/useAuth";
import toast from "react-hot-toast";
import Tooltip from '@mui/material/Tooltip';
function DashboardHomeNavbar() {
  const principal = useSelector((currState) => currState.internet.principal);
  const userCurrentRoleStatusActiveRole = useSelector(
    (currState) => currState.currentRoleStatus.activeRole
  );
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [customSvg, setCustomSvg] = useState(beforeCopySvg);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(principal).then(
      () => {
        setCustomSvg(afterCopySvg);
        toast.success("Principal copied to clipboard!");
      },
      (err) => {
        console.error("Could not copy text: ", err);
      }
    );
  };

  const { logout } = useAuth();
  const logoutHandler = async () => {
    dispatch(changeHasSelectedRoleHandler(false));
    await logout();
    window.location.href = "/";
  };

  // Define roles and their associated images
  const roleData = {
    mentor: user,
    vc: vc,
    project: project,
    user: mentor,
  };

  // Get the image for the current active role
  const currentImage = roleData[userCurrentRoleStatusActiveRole] || user;

  return (
    <nav className="bg-[#FFF4ED] py-3 px-4 md:px-12 md:pl-1 flex items-center justify-between relative pb-8">
      <button onClick={toggleMenu} className="lg:hidden">
        <dashboard.dashboardhomenavbar.icons.menuIcon.Menu className="text-gray-600" />
      </button>

      <div className="flex-grow mr-4 hidden md:block">
        <div className="relative">
        <Tooltip title="Coming Soon" arrow>
          <input
            type="text"
            placeholder="Search people, projects, jobs, events"
            className="w-[480px] h-[44px] py-2 pl-10 pr-4 rounded-md bg-white-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled
          />
          <dashboard.dashboardhomenavbar.icons.searchOutlined.SearchOutlined
            className="absolute left-3 text-gray-400"
            style={{ top: "50%", transform: "translateY(-50%)" }}
          />
           </Tooltip>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Display the current active role's image */}
        <img
          src={currentImage}
          alt={userCurrentRoleStatusActiveRole}
          className="h-[30px] w-[30px] rounded-full"
        />

        {/* <img
          src={dashboard.dashboardhomenavbar.logoImages.bellicon.Bellicon}
          className="w-[14.57px] h-[16.67px] cursor-pointer hidden md:block"
          alt="Notification Bell"
        /> */}
        <img
          src={dashboard.dashboardhomenavbar.logoImages.df_small_logo.df_small_logo}
          alt="User"
          className="h-[40px] w-[40px] rounded-full z-30 py-1 px-1"
          onClick={toggleDropdown}
        />
        {dropdownOpen && (
          <div
            id="userDropdown"
            className="absolute divide-y divide-gray-100 rounded-lg shadow w-48 bg-gray-100 z-50 top-4 right-[3.2rem]"
          >
            <div className="px-4 py-3 text-sm text-gray-900 text-black">
              <div className="flex flex-row justify-between w-full">
                <button
                  onClick={toggleDropdown}
                  type="button"
                  className="bg-transparent hover:text-black rounded-lg text-2xl text-black"
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
                <div className="truncate w-32 overflow-hidden text-ellipsis group-hover:text-left">
                  {dashboard.dashboardhomenavbar.navbarTexts.principalLabel}: {principal}
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
              <p
                className="py-2 px-4 hover:bg-gray-200 cursor-pointer"
                onClick={logoutHandler}
              >
                {dashboard.dashboardhomenavbar.navbarTexts.signOutText}
              </p>
            </div>
          </div>
        )}
      </div>

      {isMenuOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 z-50 lg:hidden">
          <div className="bg-[#FFF4ED] h-full w-64 p-4 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <img
                src={dashboard.dashboardhomenavbar.logoImages.olympuslogo.olympuslogo}
                alt="Olympus"
                className="h-8"
              />
              <button onClick={toggleMenu}>
                <dashboardhomenavbar.icons.closeIcon.Close className="text-gray-600" />
              </button>
            </div>
            <div className="mb-6 relative">
              <input
                type="text"
                placeholder="Search"
                className="w-full py-2 pl-10 pr-4 rounded-md bg-white-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <dashboardhomenavbar.icons.searchOutlined.SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            <nav>
              <Link
                to="/dashboard"
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-[#e4e3e2b1] rounded-lg mb-2"
              >
                {dashboard.dashboardhomenavbar.icons.dashboardIcon.homeSvgIcon}
                <span className="ml-3">
                  {dashboard.dashboardhomenavbar.menuTexts.dashboard}
                </span>
              </Link>
              <Link
                to="/profile"
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-[#e4e3e2b1] rounded-lg mb-2"
              >
                {dashboard.dashboardhomenavbar.icons.profileIcon.userCircleSvgIcon}
                <span className="ml-3">
                  {dashboard.dashboardhomenavbar.menuTexts.profile}
                </span>
              </Link>
              <Link
                to="/users"
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-[#e4e3e2b1] rounded-lg mb-2"
              >
                {dashboard.dashboardhomenavbar.icons.usersIcon.userSvgIcon}
                <span className="ml-3">
                  {dashboard.dashboardhomenavbar.menuTexts.users}
                </span>
              </Link>
              <Link
                to="/events"
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-[#e4e3e2b1] rounded-lg mb-2"
              >
                {dashboard.dashboardhomenavbar.icons.eventsIcon.calenderSvgIcon}
                <span className="ml-3">
                  {dashboard.dashboardhomenavbar.menuTexts.events}
                </span>
              </Link>
              <Link
                to="/regional-hubs"
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-[#e4e3e2b1] rounded-lg mb-2"
              >
                {dashboard.dashboardhomenavbar.icons.regionalHubsIcon.locationHubSvgIcon}
                <span className="ml-3">
                  {dashboard.dashboardhomenavbar.menuTexts.regionalHubs}
                </span>
              </Link>
              <Link
                to="/jobs"
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-[#e4e3e2b1] rounded-lg mb-2"
              >
                {dashboard.dashboardhomenavbar.icons.jobsIcon.briefcaseSvgIcon}
                <span className="ml-3">
                  {dashboard.dashboardhomenavbar.menuTexts.jobs}
                </span>
              </Link>
              <Link
                to="/perks"
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-[#e4e3e2b1] rounded-lg mb-2"
              >
                {dashboard.dashboardhomenavbar.icons.perksIcon.staroutlineSvgIcon}
                <span className="ml-3">
                  {dashboard.dashboardhomenavbar.menuTexts.perks}
                </span>
              </Link>
            </nav>
          </div>
        </div>
      )}
    </nav>
  );
}

export default DashboardHomeNavbar;


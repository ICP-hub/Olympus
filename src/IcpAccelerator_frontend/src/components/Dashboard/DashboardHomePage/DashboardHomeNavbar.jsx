// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { dashboard } from '../../Utils/jsondata/data/dashboardData';
// import project from '../../../../assets/Logo/founder.png';
// import user from '../../../../assets/Logo/mentor.png';
// import mentor from '../../../../assets/Logo/talent.png';
// import vc from '../../../../assets/Logo/Avatar3.png';
// import { useDispatch, useSelector } from 'react-redux';
// import { SearchOutlined, Menu } from '@mui/icons-material';
// import {
//   afterCopySvg,
//   beforeCopySvg,
// } from '../../../components/Utils/Data/SvgData';
// import { changeHasSelectedRoleHandler } from '../../../components/StateManagement/Redux/Reducers/userRoleReducer';
// import { useAuth } from '../../../components/StateManagement/useContext/useAuth';
// import toast from 'react-hot-toast';
// import Tooltip from '@mui/material/Tooltip';
// import CloseIcon from '@mui/icons-material/Close';
// import DashboardSidebar from './DashboardHomeSidebar';
// function DashboardHomeNavbar({ id, id2 }) {
//   const principal = useSelector((currState) => currState.internet.principal);
//   const userCurrentRoleStatusActiveRole = useSelector(
//     (currState) => currState.currentRoleStatus.activeRole
//   );
//   const dispatch = useDispatch();
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [customSvg, setCustomSvg] = useState(beforeCopySvg);
//   const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
//   const [isOpen, setIsOpen] = useState(false);
//   const copyToClipboard = () => {
//     navigator.clipboard.writeText(principal).then(
//       () => {
//         setCustomSvg(afterCopySvg);
//         toast.success('Principal copied to clipboard!');
//       },
//       (err) => {
//         console.error('Could not copy text: ', err);
//       }
//     );
//   };
//   const { logout } = useAuth();
//   const logoutHandler = async () => {
//     dispatch(changeHasSelectedRoleHandler(false));
//     await logout();
//     window.location.href = '/';
//   };

//   // Define roles and their associated images
//   const roleData = {
//     mentor: mentor,
//     vc: vc,
//     project: project,
//     user: user,
//   };

//   // Get the image for the current active role
//   const currentImage = roleData[userCurrentRoleStatusActiveRole] || user;

//   // icons
//   const SearchIcon =
//     dashboard?.dashboardhomenavbar?.icons?.searchOutlined?.SearchOutlined;
//   const MenuIcon = dashboard?.dashboardhomenavbar.icons.menuIcon.Menu;
//   const logoutIcon =
//     dashboard?.dashboardhomenavbar?.logoImages?.df_small_logo?.df_small_logo;
//   const Signout = dashboard?.dashboardhomenavbar?.navbarTexts?.signOutText;
//   const principalLabel =
//     dashboard?.dashboardhomenavbar?.navbarTexts?.principalLabel;
//   return (
//     <nav className='bg-[#FFF4ED] py-3 px-4 md:px-12 md:pl-1 flex items-center justify-end relative lg:pb-8'>
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className='lg:hidden absolute  right-2'
//       >
//         <MenuIcon className='text-gray-600' />
//       </button>

//       <div className='flex-grow mr-4 md:ml-4 lg:ml-0 hidden md:block'>
//         <div className='relative'>
//           <Tooltip title='Coming Soon' arrow>
//             <input
//               type='text'
//               placeholder='Search people, projects, jobs, events'
//               className='w-[480px] h-[44px] py-2 pl-10 pr-4 rounded-md bg-white-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
//               disabled
//             />
//             <SearchIcon
//               className='absolute left-3 text-gray-400'
//               style={{ top: '50%', transform: 'translateY(-50%)' }}
//             />
//           </Tooltip>
//         </div>
//       </div>

//       <div className='flex items-center space-x-4 mr-6 md:mr-0 '>
//        z
//         {/* Display the current active role's image */}
//         <img
//           id={id}
//           src={currentImage}
//           alt={userCurrentRoleStatusActiveRole}
//           className='h-[30px] w-[30px] rounded-full'
//           loading='lazy'
//           draggable={false}
//         />

//         {/* <img
//           src={dashboard.dashboardhomenavbar.logoImages.bellicon.Bellicon}
//           className="w-[14.57px] h-[16.67px] cursor-pointer hidden md:block"
//           alt="Notification Bell"
//         /> */}
//         <img
//           id={id2}
//           src={logoutIcon}
//           alt='User'
//           className='h-[40px] w-[40px] rounded-full z-30 py-1 px-1'
//           onClick={toggleDropdown}
//           loading='lazy'
//           draggable={false}
//         />
//         {dropdownOpen && (
//           <div
//             id='userDropdown'
//             className='absolute divide-y divide-gray-100 rounded-lg shadow w-48 bg-gray-100 z-50 top-4 right-[3.2rem]'
//           >
//             <div className='px-4 py-3 text-sm text-gray-900 '>
//               <div className='flex flex-row justify-between w-full'>
//                 <button
//                   onClick={toggleDropdown}
//                   type='button'
//                   className='bg-transparent hover:text-black rounded-lg text-2xl text-black'
//                 >
//                   <svg
//                     xmlns='http://www.w3.org/2000/svg'
//                     width='26'
//                     height='8'
//                     viewBox='0 0 20 8'
//                     fill='none'
//                   >
//                     <path
//                       d='M19.2556 4.7793C19.5317 4.77946 19.7557 4.55574 19.7559 4.2796C19.756 4.00346 19.5323 3.77946 19.2562 3.7793L19.2556 4.7793ZM0.902522 3.91471C0.707143 4.10985 0.706953 4.42643 0.902096 4.62181L4.08216 7.80571C4.27731 8.00109 4.59389 8.00128 4.78927 7.80613C4.98465 7.61099 4.98484 7.2944 4.78969 7.09902L1.96297 4.2689L4.7931 1.44217C4.98848 1.24703 4.98867 0.930444 4.79352 0.735065C4.59838 0.539685 4.2818 0.539495 4.08642 0.734639L0.902522 3.91471ZM19.2562 3.7793L1.25616 3.76847L1.25556 4.76847L19.2556 4.7793L19.2562 3.7793Z'
//                       fill='#B3B3B3'
//                     />
//                   </svg>
//                 </button>
//               </div>
//               <div className='group flex items-center mt-4'>
//                 <div className='truncate w-32 overflow-hidden text-ellipsis group-hover:text-left'>
//                   {principalLabel}: {principal}
//                 </div>
//                 <button
//                   onClick={copyToClipboard}
//                   className='ml-2 text-sm text-blue-500 hover:text-blue-700'
//                 >
//                   {customSvg}
//                 </button>
//               </div>
//             </div>

//             <div className='text-sm text-black font-bold'>
//               <p
//                 className='py-2 px-4 hover:bg-gray-200 cursor-pointer'
//                 onClick={logoutHandler}
//               >
//                 {Signout}
//               </p>
//             </div>
//           </div>
//         )}
//       </div>

//       {isOpen && (
//         <DashboardSidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
//       )}
//     </nav>
//   );
// }

// export default DashboardHomeNavbar;
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dashboard } from '../../Utils/jsondata/data/dashboardData';
import project from '../../../../assets/Logo/founder.png';
import user from '../../../../assets/Logo/mentor.png';
import mentor from '../../../../assets/Logo/talent.png';
import vc from '../../../../assets/Logo/Avatar3.png';
import { useDispatch, useSelector } from 'react-redux';
import { SearchOutlined, Menu } from '@mui/icons-material';
import { Principal } from '@dfinity/principal';
import {
  afterCopySvg,
  beforeCopySvg,
} from '../../../components/Utils/Data/SvgData';
import { changeHasSelectedRoleHandler } from '../../../components/StateManagement/Redux/Reducers/userRoleReducer';
import { useAuth } from '../../StateManagement/useContext/useAuthentication';
import toast from 'react-hot-toast';
import Tooltip from '@mui/material/Tooltip';
import CloseIcon from '@mui/icons-material/Close';
import DashboardSidebar from './DashboardHomeSidebar';
import BellIconWithBadge from '../Notification/NotificationBell';
import NotificationDropdown from '../Notification/NotificationDropdown';

function DashboardHomeNavbar({ id, id2 }) {
  const principal = useSelector((currState) => currState.internet.principal);
  const actor = useSelector((state) => state.actors.actor);

  const userCurrentRoleStatusActiveRole = useSelector(
    (currState) => currState.currentRoleStatus.activeRole
  );
  const dispatch = useDispatch();

  // States for Dropdown and Notifications
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [customSvg, setCustomSvg] = useState(beforeCopySvg);
  const [isOpen, setIsOpen] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(principal).then(
      () => {
        setCustomSvg(afterCopySvg);
        toast.success('Principal copied to clipboard!');
      },
      (err) => {
        console.error('Could not copy text: ', err);
      }
    );
  };

  const { handleLogout } = useAuth();
  const logoutHandler = async () => {
    dispatch(changeHasSelectedRoleHandler(false));
    await handleLogout();
    window.location.href = '/';
  };

  // Define roles and their associated images
  const roleData = {
    mentor: mentor,
    vc: vc,
    project: project,
    user: user,
  };

  // Get the image for the current active role
  const currentImage = roleData[userCurrentRoleStatusActiveRole] || user;

  // Icons
  const SearchIcon =
    dashboard?.dashboardhomenavbar?.icons?.searchOutlined?.SearchOutlined;
  const MenuIcon = dashboard?.dashboardhomenavbar.icons.menuIcon.Menu;
  const logoutIcon =
    dashboard?.dashboardhomenavbar?.logoImages?.df_small_logo?.df_small_logo;
  const Signout = dashboard?.dashboardhomenavbar?.navbarTexts?.signOutText;
  const principalLabel =
    dashboard?.dashboardhomenavbar?.navbarTexts?.principalLabel;

  // Function to fetch notifications
  const fetchNotifications = async () => {
    console.log('API call initiated inside fetchNotifications function');
    console.log('principal 260', principal);

    const principal1 = Principal.fromText(principal);
    if (actor && principal) {
      try {
        console.log('Inside try block of fetchNotifications');
        const fetchedNotifications =
          await actor.get_notifications_by_principal(principal1);
        setNotifications(fetchedNotifications);
        console.log(
          'Notifications fetched successfully:',
          fetchedNotifications
        );
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    }
  };
  console.log('line 275', notifications?.Ok?.length);
  // Handle toggling the notification dropdown
  const toggleNotificationDropdown = () => {
    setIsNotificationOpen((prevState) => !prevState);

    // Call the API only if we're opening the dropdown
    if (!isNotificationOpen) {
      fetchNotifications();
    }
  };

  // Close dropdown
  const closeDropdown = () => {
    setIsNotificationOpen(false);
  };

  // Handle "View all" functionality
  const viewAllNotifications = () => {
    alert('View all notifications');
  };

  return (
    <nav className='bg-[#FFF4ED] py-3 px-4 md:px-8 dlg:px-12 md:pl-1 dlg:pl-1 xl2:px-16 xl2:pl-1 flex items-center justify-end relative lg:pb-8'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='lg:hidden absolute right-2'
      >
        <MenuIcon className='text-gray-600' />
      </button>

      <div className='flex-grow mr-4 md:ml-4 lg:ml-0 hidden md:block'>
        <div className='relative'>
          <Tooltip title='Coming Soon' arrow>
            <input
              type='text'
              placeholder='Search people, projects, jobs, events'
              className='w-[480px] h-[44px] py-2 pl-10 pr-4 rounded-md bg-white-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
              disabled
            />
            <SearchIcon
              className='absolute left-3 text-gray-400'
              style={{ top: '50%', transform: 'translateY(-50%)' }}
            />
          </Tooltip>
        </div>
      </div>

      <div className='flex items-center space-x-4 mr-6 md:mr-0 '>
        <span className='mr-2 mt-2'>
          <BellIconWithBadge
            notificationCount={notifications?.Ok?.length}
            onClick={toggleNotificationDropdown}
          />
        </span>
        {/* Render Notification Dropdown when bell is clicked */}
        {isNotificationOpen && (
          <NotificationDropdown
            notifications={notifications}
            onClose={closeDropdown}
            onViewAll={viewAllNotifications}
            closeDropdown={toggleNotificationDropdown}
          />
        )}
        <Tooltip
          title={
            userCurrentRoleStatusActiveRole
              ? userCurrentRoleStatusActiveRole.charAt(0).toUpperCase() +
                userCurrentRoleStatusActiveRole.slice(1)
              : ''
          }
          arrow
        >
          <img
            id={id}
            src={currentImage}
            alt={userCurrentRoleStatusActiveRole}
            className='h-[30px] w-[30px] rounded-full'
            loading='lazy'
            draggable={false}
          />
        </Tooltip>
        ;
        <img
          id={id2}
          src={logoutIcon}
          alt='User'
          className='h-[40px] w-[40px] rounded-full z-30 py-1 px-1'
          onClick={() => setDropdownOpen(!dropdownOpen)}
          loading='lazy'
          draggable={false}
        />
        {dropdownOpen && (
          <div
            id='userDropdown'
            className='absolute divide-y divide-gray-100 rounded-lg shadow w-48 bg-gray-100 z-50 top-4 right-[3.2rem]'
          >
            <div className='px-4 py-3 text-sm text-gray-900 '>
              <div className='flex flex-row justify-between w-full'>
                <button
                  onClick={() => setDropdownOpen(false)}
                  type='button'
                  className='bg-transparent hover:text-black rounded-lg text-2xl text-black'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='26'
                    height='8'
                    viewBox='0 0 20 8'
                    fill='none'
                  >
                    <path
                      d='M19.2556 4.7793C19.5317 4.77946 19.7557 4.55574 19.7559 4.2796C19.756 4.00346 19.5323 3.77946 19.2562 3.7793L19.2556 4.7793ZM0.902522 3.91471C0.707143 4.10985 0.706953 4.42643 0.902096 4.62181L4.08216 7.80571C4.27731 8.00109 4.59389 8.00128 4.78927 7.80613C4.98465 7.61099 4.98484 7.2944 4.78969 7.09902L1.96297 4.2689L4.7931 1.44217C4.98848 1.24703 4.98867 0.930444 4.79352 0.735065C4.59838 0.539685 4.2818 0.539495 4.08642 0.734639L0.902522 3.91471ZM19.2562 3.7793L1.25616 3.76847L1.25556 4.76847L19.2556 4.7793L19.2562 3.7793Z'
                      fill='#B3B3B3'
                    />
                  </svg>
                </button>
              </div>
              <div className='group flex items-center mt-4'>
                <div className='truncate w-32 overflow-hidden text-ellipsis group-hover:text-left'>
                  {principalLabel}: {principal}
                </div>
                <button
                  onClick={copyToClipboard}
                  className='ml-2 text-sm text-blue-500 hover:text-blue-700'
                >
                  {customSvg}
                </button>
              </div>
            </div>

            <div className='text-sm text-black font-bold'>
              <p
                className='py-2 px-4 hover:bg-gray-200 cursor-pointer'
                onClick={logoutHandler}
              >
                {Signout}
              </p>
            </div>
          </div>
        )}
      </div>

      {isOpen && (
        <DashboardSidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
      )}
    </nav>
  );
}

export default DashboardHomeNavbar;

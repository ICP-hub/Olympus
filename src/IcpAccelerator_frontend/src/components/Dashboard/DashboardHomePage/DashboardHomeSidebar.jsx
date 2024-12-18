import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home as DashboardIcon,
  Person as ProfileIcon,
  Group as UsersIcon,
  Event as EventsIcon,
  LocationOn as RegionalHubsIcon,
  Work as JobsIcon,
  Star as PerksIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import topLogo from '../../../../assets/Logo/topLogo.png';
import {
  briefcaseSvgIcon,
  calenderSvgIcon,
  gridSvgIcon,
  homeSvgIcon,
  locationHubSvgIcon,
  staroutlineSvgIcon,
  userCircleSvgIcon,
  userSvgIcon,
  plusSvgIcon,
} from '../../Utils/Data/SvgData';
import { dashboard } from '../../Utils/jsondata/data/dashboardData';
import { useDispatch, useSelector } from 'react-redux';
import { switchRoleRequestHandler } from '../../StateManagement/Redux/Reducers/userCurrentRoleStatusReducer';
import { founderRegisteredHandlerRequest } from '../../StateManagement/Redux/Reducers/founderRegisteredData';
import { Principal } from '@dfinity/principal';
import Tooltip from '@mui/material/Tooltip';
import { motion } from 'framer-motion';

const Toggle = ({ isChecked, onToggle, id }) => (
  <label className='inline-flex items-center cursor-pointer' id={id}>
    <input
      type='checkbox'
      className='sr-only peer'
      checked={isChecked}
      onChange={onToggle}
    />
    {/* <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div> */}
    <div className="relative w-7 h-4 bg-[#EDE8E6] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#aba29e] rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-[#d8d2ce] after:border-[#aba29e] after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#aba29e]"></div>
  </label>
);

function DashboardSidebar({ isOpen, onClose, id, id2 }) {
  const { dashboardhomesidebar } = dashboard;
  const [hasNavigated, setHasNavigated] = useState(false);

  const userCurrentRoleStatus = useSelector(
    (currState) => currState.currentRoleStatus.rolesStatusArray
  );
  const isAuthenticated = useSelector(
    (currState) => currState.internet.isAuthenticated
  );
  const actor = useSelector((currState) => currState.actors.actor);
  const projectFullData = useSelector(
    (currState) => currState.projectData.data
  );
  const projectName = projectFullData?.[0]?.[0]?.params?.project_name;
  // const cardData = projectFullData;
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeLink, setActiveLink] = useState(location.pathname);
  const [show, setShow] = useState(isOpen);
  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setShow(false);
    }, 300);
  };
  // Toggle State
  const [toggleState, setToggleState] = useState({
    mentor: false,
    investor: false,
    project: false,
  });

  // Handle Toggle State changes
  // Handle Toggle State changes
  const handleToggle = async (role) => {
    setToggleState((prevState) => {
      const newState = {
        mentor: role === 'mentor' ? !prevState.mentor : false,
        vc: role === 'vc' ? !prevState.vc : false,
        project: role === 'project' ? !prevState.project : false,
      };

      localStorage.setItem('toggleState', JSON.stringify(newState));

      // Update role status based on the toggle
      const newStatus = newState[role] ? 'active' : 'default';
      dispatch(switchRoleRequestHandler({ roleName: role, newStatus }));

      // Check if all toggles are off and set their status to "default"
      if (!newState.mentor && !newState.vc && !newState.project) {
        ['mentor', 'vc', 'project'].forEach((r) => {
          dispatch(
            switchRoleRequestHandler({ roleName: r, newStatus: 'default' })
          );
        });
      }
      handleClose();
      return newState;
    });
  };

  // Get Toggle State from local storage
  useEffect(() => {
    const savedState = localStorage.getItem('toggleState');
    if (savedState) {
      setToggleState(JSON.parse(savedState));
    }
  }, []);

  console.log('projectName', projectName);
  useEffect(() => {
    if (actor && isAuthenticated) {
      dispatch(founderRegisteredHandlerRequest());
    }
  }, [dispatch, isAuthenticated, actor]);

  const handleLinkClick = (path) => {
    setActiveLink(path);
    navigate(path);
    setHasNavigated(false);
    handleClose();
  };

  const clickEventHandler = async (roleName, value) => {
    await dispatch(
      switchRoleRequestHandler({
        roleName,
        newStatus: value,
      })
    );
  };

  const [cardData, setCardData] = useState([]);

  const principal = useSelector((currState) => currState.internet.principal);
  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const convertedPrincipal = await Principal.fromText(principal);
        const data =
          await actor.get_project_info_using_principal(convertedPrincipal);
        setCardData(data);
      } catch (error) {
        console.error('Error fetching project data:', error);
      }
    };

    fetchProjectData();
  }, [actor]);

  const handleNavigation = () => {
    if (cardData && cardData.length > 0) {
      console.log('data navigation', cardData);
      const projectId = cardData[0]?.[0]?.uid || 'No UID available';
      navigate('/dashboard/document', { state: { projectId, cardData } });
    } else {
      console.log('No project data available');
    }
  };

  const SidebarLink = ({ id2, path, icon, label, disabled, tooltip }) => (
    <Tooltip title={disabled ? tooltip : ''} arrow>
      <div
        id={id2}
        onClick={() => {
          if (!disabled) {
            if (typeof path === 'function') {
              path(); // If path is a function, execute it
            } else {
              handleLinkClick(path); // Otherwise, navigate normally
            }
          }
        }}
        className={`flex items-center px-6 py-2 cursor-pointer rounded-lg ${
          activeLink === path
            ? 'bg-gray-200 text-black font-semibold'
            : 'hover:bg-gray-100 text-gray-700'
        } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
      >
        {icon}
        <span className='ml-3 truncate'>{label}</span>
      </div>
    </Tooltip>
  );

  const roledata = [
    {
      name: 'mentor',
      Mentor: true,
      Investor: false,
      Project: false,
    },
    {
      name: 'vc',
      Mentor: false,
      Investor: true,
      Project: false,
    },
    {
      name: 'project',
      Mentor: false,
      Investor: false,
      Project: true,
    },
    {
      name: 'user',
      Mentor: false,
      Investor: false,
      Project: false,
    },
  ];

  function mergeData(backendData, additionalData) {
    return backendData?.map((item) => {
      const additionalInfo = additionalData?.find(
        (data) => data?.name?.toLowerCase() === item?.name?.toLowerCase()
      );
      return additionalInfo ? { ...item, ...additionalInfo } : item;
    });
  }

  const mergedData = mergeData(userCurrentRoleStatus, roledata);
  console.log('mergedData', mergedData);

  const filteredData = mergedData.filter(
    (role) => role.approval_status !== 'default' && role.name !== 'user'
  );

  console.log('Filtered Data:', filteredData);

  const mentorApproved = filteredData.some(
    (role) => role.name === 'mentor' && role.approval_status === 'approved'
  );

  const vcApproved = filteredData.some(
    (role) => role.name === 'vc' && role.approval_status === 'approved'
  );

  const projectApproved = filteredData.some(
    (role) => role.name === 'project' && role.approval_status === 'approved'
  );

  let finalData = [];

  if (mentorApproved && vcApproved) {
    console.log('Rendering both mentor and VC roles');
    finalData = filteredData.filter(
      (role) => role.name === 'mentor' || role.name === 'vc'
    );
  } else if (mentorApproved) {
    console.log('Rendering mentor role only');
    finalData = filteredData.filter((role) => role.name === 'mentor');
  } else if (vcApproved) {
    console.log('Rendering VC role only');
    finalData = filteredData.filter((role) => role.name === 'vc');
  } else if (projectApproved) {
    console.log('Rendering project role only');
    finalData = filteredData.filter((role) => role.name === 'project');
  } else {
    console.log('No roles approved or roles in default state');
  }

  const SidebarSection = ({ title, items, currentrole }) => (
    <div className='mb-6'>
      <div className='flex items-center justify-between px-6 mb-2'>
        <h3 className='text-xs font-semibold text-gray-500 uppercase'>
          {title}
        </h3>
        {(currentrole === 'mentor' ||
          currentrole === 'vc' ||
          currentrole === 'project') && (
          <Toggle
            id={id}
            isChecked={toggleState[currentrole]}
            onToggle={() => handleToggle(currentrole)}
          />
        )}
      </div>
      <ul>
        {items.map(({ path, icon, label, disabled, tooltip }, index) => (
          <li key={index}>
            <SidebarLink
              id2={id2}
              path={path}
              icon={icon}
              label={label}
              disabled={disabled}
              tooltip={tooltip}
            />
          </li>
        ))}
      </ul>
    </div>
  );

  const sectionConfig = [
    {
      roleKey: 'Mentor',
      title: dashboardhomesidebar.sidebarSections.mentors.label,
      items: [
        {
          path: '/dashboard/mentor',
          icon: gridSvgIcon,
          disabled: true,
          tooltip: 'Coming soon',
          label: dashboardhomesidebar.sidebarSections.mentors.items.label1,
        },
        {
          path: '/dashboard/mentor/new',
          icon: plusSvgIcon,
          disabled: true,
          tooltip: 'Coming soon',
          label: 'Create new Service',
        },
      ],
      currentrole: 'mentor',
    },
    {
      roleKey: 'Project',
      title: dashboardhomesidebar.sidebarSections.projects.label,
      items: [
        {
          path: () => handleNavigation(),
          icon: gridSvgIcon,
          label: projectName,
        },
        {
          path: '/dashboard/project/new',
          icon: plusSvgIcon,
          disabled: true,
          tooltip: 'Coming soon',
          label: 'Create new Project',
        },
      ],
      currentrole: 'project',
    },
    {
      roleKey: 'Investor',
      title: dashboardhomesidebar.sidebarSections.investors.label,
      items: [
        {
          path: '/dashboard/investor',
          icon: gridSvgIcon,
          disabled: true,
          tooltip: 'Coming soon',
          label: dashboardhomesidebar.sidebarSections.investors.items.label1,
        },
        {
          path: '/dashboard/investor/new',
          icon: plusSvgIcon,
          disabled: true,
          tooltip: 'Coming soon',
          label: 'Create new Investors',
        },
      ],
      currentrole: 'vc',
    },
  ];

  const Sidebar = () => {
    const approvedRoles = finalData.filter(
      (role) => role.approval_status === 'approved'
    );
    console.log('Approved Roles:', approvedRoles);

    const sidebarSections = [
      {
        title: dashboardhomesidebar.sidebarSections.identity.label,
        items: [
          {
            id2: id2,
            path: '/dashboard/profile',
            icon: userCircleSvgIcon,
            label: dashboardhomesidebar.sidebarSections.identity.items.label,
          },
        ],
      },
    ];

    const addedRoles = new Set();

    approvedRoles.forEach((role) => {
      sectionConfig.forEach(({ roleKey, title, items, currentrole }) => {
        if (role[roleKey] && !addedRoles.has(roleKey)) {
          sidebarSections.push({ title, items, currentrole }); // Pass currentrole here
          addedRoles.add(roleKey);
        }
      });
    });

    return (
      <div>
        {sidebarSections.map((section, index) => (
          <SidebarSection
            id2={id2}
            key={index}
            title={section.title}
            items={section.items}
            currentrole={section.currentrole}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      {/* Overlay for mobile */}
      {show && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 backdrop-blur-xs z-40 lg:hidden'
          onClick={handleClose}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 bg-[#FFF4ED] w-64 h-screen overflow-y-auto flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${show ? 'translate-x-0' : '-translate-x-full'}
          lg:relative lg:translate-x-0`}
      >
        <div className='p-4 flex justify-between items-center'>
          <img
            src={topLogo}
            alt='Olympus'
            className='h-8'
            loading='lazy'
            draggable={false}
          />
          <button onClick={onClose} className='lg:hidden'>
            <CloseIcon className='text-gray-600' />
          </button>
        </div>
        <nav className='flex-1 py-6'>
          <div className='px-2 mb-6'>
            <SidebarLink
              path='/dashboard'
              icon={homeSvgIcon}
              label={dashboardhomesidebar.sidebarSections.dashboard.label}
            />
          </div>
          {Sidebar()}
          <div>
            <h3 className='px-6 mb-2 text-xs font-semibold text-gray-500 uppercase'>
              DISCOVER
            </h3>
            <ul>
              <li>
                <SidebarLink
                  path='/dashboard/user'
                  icon={userSvgIcon}
                  label={
                    dashboardhomesidebar.sidebarSections.discover.items.user
                  }
                />
              </li>
              <li>
                <SidebarLink
                  path='/dashboard/event'
                  icon={calenderSvgIcon}
                  label={
                    dashboardhomesidebar.sidebarSections.discover.items.events
                  }
                />
              </li>
              <li>
                <SidebarLink
                  path='/dashboard/regional-hubs'
                  icon={locationHubSvgIcon}
                  label={
                    dashboardhomesidebar.sidebarSections.discover.items.hub
                  }
                />
              </li>
              <li>
                <SidebarLink
                  path='/dashboard/jobs'
                  icon={briefcaseSvgIcon}
                  label={
                    dashboardhomesidebar.sidebarSections.discover.items.jobs
                  }
                />
              </li>
            </ul>
          </div>
        </nav>
      </aside>
    </>
  );
}

export default DashboardSidebar;
// import React, { useEffect, useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import {
//   Home as DashboardIcon,
//   Person as ProfileIcon,
//   Group as UsersIcon,
//   Event as EventsIcon,
//   LocationOn as RegionalHubsIcon,
//   Work as JobsIcon,
//   Star as PerksIcon,
//   Close as CloseIcon,
// } from '@mui/icons-material';
// import topLogo from '../../../../assets/Logo/topLogo.png';
// import {
//   briefcaseSvgIcon,
//   calenderSvgIcon,
//   gridSvgIcon,
//   homeSvgIcon,
//   locationHubSvgIcon,
//   staroutlineSvgIcon,
//   userCircleSvgIcon,
//   userSvgIcon,
//   plusSvgIcon,
// } from '../../Utils/Data/SvgData';
// import { dashboard } from '../../Utils/jsondata/data/dashboardData';
// import { useDispatch, useSelector } from 'react-redux';
// import { switchRoleRequestHandler } from '../../StateManagement/Redux/Reducers/userCurrentRoleStatusReducer';
// import { founderRegisteredHandlerRequest } from '../../StateManagement/Redux/Reducers/founderRegisteredData';
// import { Principal } from '@dfinity/principal';
// import Tooltip from '@mui/material/Tooltip';
// import { motion } from 'framer-motion';
// import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
// import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

// const Toggle = ({ isChecked, onToggle, id }) => (
//   <label className='inline-flex items-center cursor-pointer' id={id}>
//     <input
//       type='checkbox'
//       className='sr-only peer'
//       checked={isChecked}
//       onChange={onToggle}
//     />
//     <div className="relative w-7 h-4 bg-[#EDE8E6] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#aba29e] rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-[#d8d2ce] after:border-[#aba29e] after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#aba29e]"></div>
//   </label>
// );

// function DashboardSidebar({ isOpen, onClose, id, id2 }) {
//   const { dashboardhomesidebar } = dashboard;
//   const [hasNavigated, setHasNavigated] = useState(false);

//   const userCurrentRoleStatus = useSelector(
//     (currState) => currState.currentRoleStatus.rolesStatusArray
//   );

//   const isAuthenticated = useSelector(
//     (currState) => currState.internet.isAuthenticated
//   );
//   const actor = useSelector((currState) => currState.actors.actor);
//   const projectFullData = useSelector(
//     (currState) => currState.projectData.data
//   );
//   const projectName = projectFullData?.[0]?.[0]?.params?.project_name;
//   const location = useLocation();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const [activeLink, setActiveLink] = useState(location.pathname);
//   const [show, setShow] = useState(isOpen);
//   const handleClose = () => {
//     onClose();
//     setTimeout(() => {
//       setShow(false);
//     }, 300);
//   };

//   // Toggle State
//   const [toggleState, setToggleState] = useState({
//     mentor: false,
//     investor: false,
//     project: false,
//   });

//   // Handle Toggle State changes
//   const handleToggle = async (role) => {
//     console.log('Role toggled:', role);
//     setToggleState((prevState) => {
//       const newState = {
//         mentor: role === 'mentor' ? !prevState.mentor : false,
//         vc: role === 'vc' ? !prevState.vc : false,
//         project: role === 'project' ? !prevState.project : false,
//       };
//       console.log('New toggle state:', newState);
//       localStorage.setItem('toggleState', JSON.stringify(newState));

//       const newStatus = newState[role] ? 'active' : 'default';
//       dispatch(switchRoleRequestHandler({ roleName: role, newStatus }));

//       if (!newState.mentor && !newState.vc && !newState.project) {
//         ['mentor', 'vc', 'project'].forEach((r) => {
//           dispatch(
//             switchRoleRequestHandler({ roleName: r, newStatus: 'default' })
//           );
//         });
//       }
//       handleClose();
//       return newState;
//     });
//   };

//   useEffect(() => {
//     const savedState = localStorage.getItem('toggleState');

//     if (savedState) {
//       console.log(
//         'Loaded toggle state from localStorage:',
//         JSON.parse(savedState)
//       );
//       setToggleState(JSON.parse(savedState));
//     } else {
//       const initialState = { mentor: false, vc: false, project: false };
//       setToggleState(initialState);
//       localStorage.setItem('toggleState', JSON.stringify(initialState));
//     }
//   }, []);

//   useEffect(() => {
//     if (actor && isAuthenticated) {
//       dispatch(founderRegisteredHandlerRequest());
//     }
//   }, [dispatch, isAuthenticated, actor]);

//   const handleLinkClick = (path) => {
//     setActiveLink(path);
//     navigate(path);
//     setHasNavigated(false);
//     handleClose();
//   };

//   const [cardData, setCardData] = useState([]);

//   const principal = useSelector((currState) => currState.internet.principal);
//   useEffect(() => {
//     const fetchProjectData = async () => {
//       try {
//         const convertedPrincipal = await Principal.fromText(principal);
//         const data =
//           await actor.get_project_info_using_principal(convertedPrincipal);
//         setCardData(data);
//       } catch (error) {
//         console.error('Error fetching project data:', error);
//       }
//     };

//     fetchProjectData();
//   }, [actor]);

//   const handleNavigation = () => {
//     if (cardData && cardData.length > 0) {
//       const projectId = cardData[0]?.[0]?.uid || 'No UID available';
//       navigate('/dashboard/document', { state: { projectId, cardData } });
//     } else {
//       console.log('No project data available');
//     }
//   };

//   const SidebarLink = ({ id2, path, icon, label, disabled, tooltip }) => (
//     <Tooltip title={disabled ? tooltip : ''} arrow>
//       <div
//         id={id2}
//         onClick={() => {
//           if (!disabled) {
//             if (typeof path === 'function') {
//               path();
//             } else {
//               handleLinkClick(path);
//             }
//           }
//         }}
//         className={` flex lg:items-center lg:px-6 lg:py-2 lg:cursor-pointer lg:rounded-lg ${
//           activeLink === path ? 'lg:bg-[#e4e3e2b1]' : 'lg:hover:bg-[#e4e3e2b1]'
//         } ${disabled ? 'lg:cursor-not-allowed lg:opacity-50' : ''}`}
//       >
//         {icon}
//         <span className=' ml-3 align-bottom pb-1 text-base md:text-base truncate break-all'>
//           {label}
//         </span>
//       </div>
//     </Tooltip>
//   );

//   const roledata = [
//     { name: 'mentor', Mentor: true, Investor: false, Project: false },
//     { name: 'vc', Mentor: false, Investor: true, Project: false },
//     { name: 'project', Mentor: false, Investor: false, Project: true },
//     { name: 'user', Mentor: false, Investor: false, Project: false },
//   ];

//   function mergeData(backendData, additionalData) {
//     return backendData?.map((item) => {
//       const additionalInfo = additionalData?.find(
//         (data) => data?.name?.toLowerCase() === item?.name?.toLowerCase()
//       );
//       return additionalInfo ? { ...item, ...additionalInfo } : item;
//     });
//   }

//   const mergedData = mergeData(userCurrentRoleStatus, roledata);
//   const filteredData = mergedData.filter(
//     (role) => role.approval_status !== 'default' && role.name !== 'user'
//   );

//   const mentorApproved = filteredData.some(
//     (role) => role.name === 'mentor' && role.approval_status === 'approved'
//   );

//   const vcApproved = filteredData.some(
//     (role) => role.name === 'vc' && role.approval_status === 'approved'
//   );

//   const projectApproved = filteredData.some(
//     (role) => role.name === 'project' && role.approval_status === 'approved'
//   );

//   let finalData = [];

//   if (mentorApproved && vcApproved) {
//     finalData = filteredData.filter(
//       (role) => role.name === 'mentor' || role.name === 'vc'
//     );
//   } else if (mentorApproved) {
//     finalData = filteredData.filter((role) => role.name === 'mentor');
//   } else if (vcApproved) {
//     finalData = filteredData.filter((role) => role.name === 'vc');
//   } else if (projectApproved) {
//     finalData = filteredData.filter((role) => role.name === 'project');
//   }

//   const SidebarSection = ({ title, items, currentrole }) => (
//     <div className='mb-6'>
//       <div className='flex items-center justify-between px-6 mb-2'>
//         <h3 className='text-xs font-semibold text-gray-500 uppercase'>
//           {title}
//         </h3>
//         {(currentrole === 'mentor' ||
//           currentrole === 'vc' ||
//           currentrole === 'project') && (
//           <Toggle
//             id={id}
//             isChecked={toggleState[currentrole] || false}
//             onToggle={() => handleToggle(currentrole || false)}
//           />
//         )}
//       </div>
//       <ul>
//         {items.map(({ path, icon, label, disabled, tooltip }, index) => (
//           <li key={index}>
//             <SidebarLink
//               id2={id2}
//               path={path}
//               icon={icon}
//               label={label}
//               disabled={disabled}
//               tooltip={tooltip}
//             />
//           </li>
//         ))}
//       </ul>
//     </div>
//   );

//   const sectionConfig = [
//     {
//       roleKey: 'Mentor',
//       title: dashboardhomesidebar.sidebarSections.mentors.label,
//       items: [
//         {
//           path: '/dashboard/mentor',
//           icon: gridSvgIcon,
//           disabled: true,
//           tooltip: 'Coming soon',
//           label: dashboardhomesidebar.sidebarSections.mentors.items.label1,
//         },
//         {
//           path: '/dashboard/mentor/new',
//           icon: plusSvgIcon,
//           disabled: true,
//           tooltip: 'Coming soon',
//           label: 'Create new Service',
//         },
//       ],
//       currentrole: 'mentor',
//     },
//     {
//       roleKey: 'Project',
//       title: dashboardhomesidebar.sidebarSections.projects.label,
//       items: [
//         {
//           path: () => handleNavigation(),
//           icon: gridSvgIcon,
//           label: projectName,
//         },
//         {
//           path: '/dashboard/project/new',
//           icon: plusSvgIcon,
//           disabled: true,
//           tooltip: 'Coming soon',
//           label: 'Create new Project',
//         },
//       ],
//       currentrole: 'project',
//     },
//     {
//       roleKey: 'Investor',
//       title: dashboardhomesidebar.sidebarSections.investors.label,
//       items: [
//         {
//           path: '/dashboard/investor',
//           icon: gridSvgIcon,
//           disabled: true,
//           tooltip: 'Coming soon',
//           label: dashboardhomesidebar.sidebarSections.investors.items.label1,
//         },
//         {
//           path: '/dashboard/investor/new',
//           icon: plusSvgIcon,
//           disabled: true,
//           tooltip: 'Coming soon',
//           label: 'Create new Investors',
//         },
//       ],
//       currentrole: 'vc',
//     },
//   ];

//   const Sidebar = () => {
//     const approvedRoles = finalData.filter(
//       (role) => role.approval_status === 'approved'
//     );

//     const sidebarSections = [
//       {
//         title: dashboardhomesidebar.sidebarSections.identity.label,
//         items: [
//           {
//             id2: id2,
//             path: '/dashboard/profile',
//             icon: userCircleSvgIcon,
//             label: dashboardhomesidebar.sidebarSections.identity.items.label,
//           },
//         ],
//       },
//     ];

//     const addedRoles = new Set();

//     approvedRoles.forEach((role) => {
//       sectionConfig.forEach(({ roleKey, title, items, currentrole }) => {
//         if (role[roleKey] && !addedRoles.has(roleKey)) {
//           sidebarSections.push({ title, items, currentrole });
//           addedRoles.add(roleKey);
//         }
//       });
//     });

//     return (
//       <div>
//         {sidebarSections.map((section, index) => (
//           <SidebarSection
//             id2={id2}
//             key={index}
//             title={section.title}
//             items={section.items}
//             currentrole={section.currentrole}
//           />
//         ))}
//       </div>
//     );
//   };

//   const BottomNav = () => {
//     const [dropdownOpen, setDropdownOpen] = useState(false);
//     const approvedRoles = finalData.filter(
//       (role) => role.approval_status === 'approved'
//     );
//     const hasCreatedRole = approvedRoles.some(
//       (role) =>
//         role.name.toLowerCase() === 'mentor' ||
//         role.name.toLowerCase() === 'vc' ||
//         role.name.toLowerCase() === 'project'
//     );
//     return (
//       <>
//         {dropdownOpen && (
//           <motion.div
//             className='fixed inset-0'
//             onClick={() => setDropdownOpen(false)}
//           />
//         )}

//         <motion.div
//           className='fixed bottom-0 left-0 w-full bg-[#FFF4ED] px-2 flex flex-col py-6 pb-2 z-50 rounded-t-3xl'
//           initial={{ y: '100%' }}
//           animate={{ y: 0 }}
//           exit={{ y: '100%' }}
//           transition={{ duration: 0.5, ease: 'easeInOut' }}
//         >
//           <div className='absolute right-[1.3rem] top-2'>
//             <button onClick={handleClose}>
//               <CloseIcon className='text-gray-700' />
//             </button>
//           </div>
//           <div className='flex flex-col w-full my-4 mx-4 gap-2'>
//             <SidebarLink
//               path='/dashboard'
//               icon={homeSvgIcon}
//               label='Dashboard'
//               onClick={() => handleLinkClick('/dashboard')}
//             />
//             <SidebarLink
//               path='/dashboard/user'
//               icon={userSvgIcon}
//               label='Discover'
//               onClick={() => handleLinkClick('/dashboard/user')}
//             />

//             <div className='flex items-center justify-between'>
//               <SidebarLink
//                 path='/dashboard/profile'
//                 icon={userCircleSvgIcon}
//                 label='Profile'
//                 onClick={() => handleLinkClick('/dashboard/profile')}
//               />

//               {hasCreatedRole && (
//                 <button
//                   onClick={() => setDropdownOpen(!dropdownOpen)}
//                   className='flex items-center mr-8'
//                 >
//                   {dropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
//                 </button>
//               )}
//             </div>

//             {dropdownOpen && (
//               <div className='flex flex-col bg-[#FFF4ED]  px-2 w-full'>
//                 {approvedRoles.map((role) => (
//                   <div
//                     key={role.name}
//                     className='flex items-center justify-between px-6 cursor-pointer hover:bg-gray-200'
//                   >
//                     <span>
//                       {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
//                     </span>
//                     <Toggle
//                       id={role.name}
//                       isChecked={toggleState[role.name.toLowerCase()] || false}
//                       onToggle={() => handleToggle(role.name.toLowerCase())}
//                     />
//                   </div>
//                 ))}
//               </div>
//             )}

//             <SidebarLink
//               path='/dashboard/jobs'
//               icon={briefcaseSvgIcon}
//               label='Jobs'
//               onClick={() => handleLinkClick('/dashboard/jobs')}
//             />
//             <SidebarLink
//               path='/dashboard/event'
//               icon={calenderSvgIcon}
//               label='Cohorts'
//               onClick={() => handleLinkClick('/dashboard/event')}
//             />
//             <SidebarLink
//               path='/dashboard/regional-hubs'
//               icon={locationHubSvgIcon}
//               label='Regional Hub'
//               onClick={() => handleLinkClick('/dashboard/regional-hubs')}
//             />
//           </div>
//         </motion.div>
//       </>
//     );
//   };

//   return (
//     <>
//       {/* Sidebar for larger screens */}
//       <div className='hidden lg:block'>
//         <aside
//           className={`fixed top-0 left-0 z-50 bg-[#FFF4ED] w-64 h-screen overflow-y-auto flex flex-col
//           transform transition-transform duration-300 ease-in-out
//           ${show ? 'translate-x-0' : '-translate-x-full'}
//           lg:relative lg:translate-x-0`}
//         >
//           <div className='p-4 flex justify-between items-center'>
//             <img
//               src={topLogo}
//               alt='Olympus'
//               className='h-8 pl-2'
//               loading='lazy'
//               draggable={false}
//             />
//             <button onClick={onClose} className='lg:hidden'>
//               <CloseIcon className='text-gray-600' />
//             </button>
//           </div>
//           <nav className='flex-1 py-6'>
//             <div className='px-2 mb-6'>
//               <SidebarLink
//                 path='/dashboard'
//                 icon={homeSvgIcon}
//                 label={dashboardhomesidebar.sidebarSections.dashboard.label}
//               />
//             </div>
//             {Sidebar()}
//             <div>
//               <h3 className='px-6 mb-2 text-xs font-semibold text-gray-500 uppercase'>
//                 DISCOVER
//               </h3>
//               <ul>
//                 <li>
//                   <SidebarLink
//                     path='/dashboard/user'
//                     icon={userSvgIcon}
//                     label={
//                       dashboardhomesidebar.sidebarSections.discover.items.user
//                     }
//                   />
//                 </li>
//                 <li>
//                   <SidebarLink
//                     path='/dashboard/event'
//                     icon={calenderSvgIcon}
//                     label={
//                       dashboardhomesidebar.sidebarSections.discover.items.events
//                     }
//                   />
//                 </li>
//                 <li>
//                   <SidebarLink
//                     path='/dashboard/regional-hubs'
//                     icon={locationHubSvgIcon}
//                     label={
//                       dashboardhomesidebar.sidebarSections.discover.items.hub
//                     }
//                   />
//                 </li>
//                 <li>
//                   <SidebarLink
//                     path='/dashboard/jobs'
//                     icon={briefcaseSvgIcon}
//                     label={
//                       dashboardhomesidebar.sidebarSections.discover.items.jobs
//                     }
//                   />
//                 </li>
//               </ul>
//             </div>
//           </nav>
//         </aside>
//       </div>
//       {/* Bottom Navigation for mobile */}
//       {show && <BottomNav />}
//     </>
//   );
// }

// export default DashboardSidebar;

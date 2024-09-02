import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home as DashboardIcon,
  Person as ProfileIcon,
  Group as UsersIcon,
  Event as EventsIcon,
  LocationOn as RegionalHubsIcon,
  Work as JobsIcon,
  Star as PerksIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import topLogo from "../../../../assets/Logo/topLogo.png";
import {
  briefcaseSvgIcon,
  calenderSvgIcon,
  gridSvgIcon,
  homeSvgIcon,
  locationHubSvgIcon,
  staroutlineSvgIcon,
  userCircleSvgIcon,
  userSvgIcon,
  plusSvgIcon
} from "../../Utils/Data/SvgData";
import { dashboard } from "../../Utils/jsondata/data/dashboardData";
import { useDispatch, useSelector } from "react-redux";
import { switchRoleRequestHandler } from "../../StateManagement/Redux/Reducers/userCurrentRoleStatusReducer";
import { founderRegisteredHandlerRequest } from "../../StateManagement/Redux/Reducers/founderRegisteredData";
import { Principal } from "@dfinity/principal";
import Tooltip from '@mui/material/Tooltip';

// const Toggle = ({ isChecked, onToggle }) => (
//   <label className="relative h-4 w-8 cursor-pointer">
//     <input
//       className="peer sr-only"
//       type="checkbox"
//       checked={isChecked}
//       onChange={onToggle}
//     />
//     <span className="absolute inset-0 m-auto h-2 rounded-full bg-stone-400"></span>
//     <span
//       className="absolute inset-y-0 start-0 m-auto w-4 h-4 rounded-full bg-stone-600 transition-all peer-checked:start-6 peer-checked:[&amp;_>_*]:scale-0"
//     >
//       <span className="absolute inset-0 m-auto w-2 h-2 rounded-full bg-stone-300 transition"></span>
//     </span>
//   </label>
// );
const Toggle = ({ isChecked, onToggle }) => (
  <label className="inline-flex items-center cursor-pointer">
    <input
      type="checkbox"
      className="sr-only peer"
      checked={isChecked}
      onChange={onToggle}
    />
    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
  </label>
);


function DashboardSidebar({ isOpen, onClose }) {
  const { dashboardhomesidebar } = dashboard;
  const [hasNavigated, setHasNavigated] = useState(false);

  const userCurrentRoleStatus = useSelector(
    (currState) => currState.currentRoleStatus.rolesStatusArray
  );
  const isAuthenticated = useSelector(
    (currState) => currState.internet.isAuthenticated
  );
  const actor = useSelector((currState) => currState.actors.actor);
  const projectFullData = useSelector((currState) => currState.projectData.data);
   const projectName = projectFullData?.[0]?.[0]?.params?.project_name
  // const cardData = projectFullData;
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeLink, setActiveLink] = useState(location.pathname);
  const [toggleState, setToggleState] = useState({
    mentor: false,
    investor: false,
    project: false,
  });
  console.log('projectName',projectName)
  useEffect(() => {
    if (actor && isAuthenticated){
          dispatch(founderRegisteredHandlerRequest());
    }
  }, [dispatch,isAuthenticated, actor]);

  const handleLinkClick = (path) => {
    setActiveLink(path);
    navigate(path);
    setHasNavigated(false);
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
        const data = await actor.get_project_info_using_principal(
          convertedPrincipal
        );
        setCardData(data);
      } catch (error) {
        console.error("Error fetching project data:", error);
      }
    };

    fetchProjectData();
  }, [actor]);

  const handleNavigation = () => {

    if (cardData && cardData.length > 0) {
      console.log("data navigation", cardData)
      const projectId = cardData[0]?.[0]?.uid || "No UID available";
      navigate("/dashboard/document", { state: { projectId, cardData } });
    } else {
      console.log("No project data available");
    }
  };

  // const SidebarLink = ({ path, icon, label,disabled, tooltip }) => (
  //   <div
  //     onClick={() => handleLinkClick(path)}
  //     className={`flex items-center px-6 py-2 cursor-pointer rounded-lg ${
  //       activeLink === path ? "bg-[#e4e3e2b1]" : "hover:bg-[#e4e3e2b1]"
  //     }`}
  //   >
  //     {icon}
  //     <span className="ml-3">{label}</span>
  //   </div>
  // );
  const SidebarLink = ({ path, icon, label, disabled, tooltip }) => (
    <Tooltip title={disabled ? tooltip : ""} arrow>
      <div
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
          activeLink === path ? "bg-[#e4e3e2b1]" : "hover:bg-[#e4e3e2b1]"
        } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
      >
        {icon}
        <span className="ml-3">{label}</span>
      </div>
    </Tooltip>
  );

  const roledata = [
    {
      name: "mentor",
      Mentor: true,
      Investor: false,
      Project: false,
    },
    {
      name: "vc",
      Mentor: false,
      Investor: true,
      Project: false,
    },
    {
      name: "project",
      Mentor: false,
      Investor: false,
      Project: true,
    },
    {
      name: "user",
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
  console.log("mergedData", mergedData);

  const filteredData = mergedData.filter(
    (role) => role.approval_status !== "default" && role.name !== "user"
  );

  console.log("Filtered Data:", filteredData);

  const mentorApproved = filteredData.some(
    (role) => role.name === "mentor" && role.approval_status === "approved"
  );

  const vcApproved = filteredData.some(
    (role) => role.name === "vc" && role.approval_status === "approved"
  );

  const projectApproved = filteredData.some(
    (role) => role.name === "project" && role.approval_status === "approved"
  );

  let finalData = [];

  if (mentorApproved && vcApproved) {
    console.log("Rendering both mentor and VC roles");
    finalData = filteredData.filter(
      (role) => role.name === "mentor" || role.name === "vc"
    );
  } else if (mentorApproved) {
    console.log("Rendering mentor role only");
    finalData = filteredData.filter((role) => role.name === "mentor");
  } else if (vcApproved) {
    console.log("Rendering VC role only");
    finalData = filteredData.filter((role) => role.name === "vc");
  } else if (projectApproved) {
    console.log("Rendering project role only");
    finalData = filteredData.filter((role) => role.name === "project");
  } else {
    console.log("No roles approved or roles in default state");
  }


  const handleToggle = async (role) => {
    setToggleState((prevState) => ({
      mentor: role === "mentor" ? !prevState.mentor : false,
      vc: role === "vc" ? !prevState.vc : false,
      project: role === "project" ? !prevState.project : false,
    }));
    await clickEventHandler(role, "active");
  };
  const SidebarSection = ({ title, items, currentrole }) => (
    <div className="mb-6">
      <div className="flex items-center justify-between px-6 mb-2">
        <h3 className="text-xs font-semibold text-gray-500 uppercase">
          {title}
        </h3>
        {(currentrole === "mentor" || currentrole === "vc" || currentrole === "project") && (
          <Toggle
            isChecked={toggleState[currentrole]}
            onToggle={() => handleToggle(currentrole)}
          />
        )}
      </div>
      <ul>
        {items.map(({ path, icon, label, disabled, tooltip }, index) => (
          <li key={index}>
            <SidebarLink
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
  
  // const SidebarSection = ({ title, items, currentrole }) => (
    
  //   <div className="mb-6">
  //     <div className="flex items-center justify-between px-6 mb-2">
  //         <h3
  //           className="text-xs font-semibold text-gray-500 uppercase"
  //           onClick={() => clickEventHandler(currentrole, "active")}
  //         >
  //           {title}
  //         </h3>
  //         <Toggle isChecked={isToggled} onToggle={handleToggle} />
  //       </div>
  //     {/* <ul>
  //       {items.map(({ path, icon, label }, index) => (
  //         <li key={index}>
  //           <SidebarLink path={path} icon={icon} label={label} />
  //         </li>
  //       ))}
  //     </ul> */}
  //      <ul>
  //       {items.map(({ path, icon, label, disabled, tooltip }, index) => (
  //         <li key={index}>
  //           <SidebarLink path={path} icon={icon} label={label} disabled={disabled} tooltip={tooltip} />
  //         </li>
  //       ))}
  //     </ul>
  //   </div>
  // );

  const sectionConfig = [
    {
      roleKey: "Mentor",
      title: dashboardhomesidebar.sidebarSections.mentors.label,
      items: [
        {
          path: "/dashboard/mentor",
          icon: gridSvgIcon,
          disabled: true, 
          tooltip: "Coming soon",
          label: dashboardhomesidebar.sidebarSections.mentors.items.label1,
        },
        {
          path: "/dashboard/mentor/new",
          icon: plusSvgIcon,
          disabled: true, 
        tooltip: "Coming soon",
          label: "Create new Service",
        },
      ],
      currentrole: "mentor",
    },
    {
      roleKey: "Project",
      title: dashboardhomesidebar.sidebarSections.projects.label,
      items: [
        {
          path: () => handleNavigation(),
          icon: gridSvgIcon,
          label: projectName,
        },
        {
          path: "/dashboard/project/new",
          icon: plusSvgIcon,
          disabled: true, 
        tooltip: "Coming soon",
          label: "Create new Project",
        },
      ],
      currentrole: "project",
    },
    {
      roleKey: "Investor",
      title: dashboardhomesidebar.sidebarSections.investors.label,
      items: [
        {
          path: "/dashboard/investor",
          icon: gridSvgIcon,
          disabled: true, 
          tooltip: "Coming soon",
          label: dashboardhomesidebar.sidebarSections.investors.items.label1,
        },
        {
          path: "/dashboard/investor/new",
          icon: plusSvgIcon,
          disabled: true, 
        tooltip: "Coming soon",
          label: "Create new Investors",
        },
      ],
      currentrole: "vc",
    },
  ];

  const Sidebar = () => {
    const approvedRoles = finalData.filter(
      (role) => role.approval_status === "approved"
    );
    console.log('Approved Roles:', approvedRoles);

    const sidebarSections = [
      {
        title: dashboardhomesidebar.sidebarSections.identity.label,
        items: [
          {
            path: "/dashboard/profile",
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
            key={index}
            title={section.title}
            items={section.items}
            currentrole={section.currentrole} // Pass currentrole to SidebarSection
          />
        ))}
      </div>
    );
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
      <aside
        className={`
        fixed top-0 left-0 z-50 bg-[#FFF4ED] w-64 h-screen overflow-y-auto flex flex-col transition-transform duration-300 ease-in-out transform
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:relative lg:translate-x-0`}
      >
        <div className="p-4 flex justify-between items-center">
          <img src={topLogo} alt="Olympus" className="h-8" />
          <button onClick={onClose} className="lg:hidden">
            <CloseIcon className="text-gray-600" />
          </button>
        </div>
        <nav className="flex-1 py-6">
          <div className="px-2 mb-6">
            <SidebarLink
              path="/dashboard"
              icon={homeSvgIcon}
              label={dashboardhomesidebar.sidebarSections.dashboard.label}
            />
          </div>
          {Sidebar()}
          <div>
            <h3 className="px-6 mb-2 text-xs font-semibold text-gray-500 uppercase">
              DISCOVER
            </h3>
            <ul>
              <li>
                <SidebarLink
                  path="/dashboard/user"
                  icon={userSvgIcon}
                  label={
                    dashboardhomesidebar.sidebarSections.discover.items.user
                  }
                />
              </li>
              <li>
                <SidebarLink
                  path="/dashboard/event"
                  icon={calenderSvgIcon}
                  label={
                    dashboardhomesidebar.sidebarSections.discover.items.events
                  }
                />
              </li>
              <li>
                <SidebarLink
                  path="/dashboard/regional-hubs"
                  icon={locationHubSvgIcon}
                  label={
                    dashboardhomesidebar.sidebarSections.discover.items.hub
                  }
                />
              </li>
              <li>
                <SidebarLink
                  path="/dashboard/jobs"
                  icon={briefcaseSvgIcon}
                  label={
                    dashboardhomesidebar.sidebarSections.discover.items.jobs
                  }
                />
              </li>
              {/* <li>
                <SidebarLink
                  path="/perks"
                  icon={staroutlineSvgIcon}
                  label={
                    dashboardhomesidebar.sidebarSections.discover.items.perks
                  }
                />
              </li> */}
            </ul>
          </div>
        </nav>
      </aside>
    </>
  );
}

export default DashboardSidebar;

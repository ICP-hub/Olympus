import React, { useState } from "react";
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
} from "../../Utils/Data/SvgData";
import { dashboard } from "../../Utils/jsondata/data/dashboardData";
import { useDispatch, useSelector } from "react-redux";
import { switchRoleRequestHandler } from "../../StateManagement/Redux/Reducers/userCurrentRoleStatusReducer";

function DashboardSidebar({ isOpen, onClose }) {
  const { dashboardhomesidebar } = dashboard;
  const userCurrentRoleStatus = useSelector(
    (currState) => currState.currentRoleStatus.rolesStatusArray
  );
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [activeLink, setActiveLink] = useState(location.pathname);

  const handleLinkClick = (path) => {
    setActiveLink(path);
    navigate(path);
  };

  const clickEventHandler = async (roleName, value) => {
    await dispatch(
      switchRoleRequestHandler({
        roleName,
        newStatus: value,
      })
    );
  };

  const SidebarLink = ({ path, icon, label }) => (
    <div
      onClick={() => handleLinkClick(path)}
      className={`flex items-center px-6 py-2 cursor-pointer rounded-lg ${
        activeLink === path ? "bg-[#e4e3e2b1]" : "hover:bg-[#e4e3e2b1]"
      }`}
    >
      {icon}
      <span className="ml-3">{label}</span>
    </div>
  );

  const roledata = [
    {
      name: "mentor",
      Mentor: true,
      Investor: true,
      Project: false,
    },
    {
      name: "vc",
      Mentor: true,
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
  const SidebarSection = ({ title, items, currentrole }) => (
    <div className="mb-6" >
      <h3 className="px-6 mb-2 text-xs font-semibold text-gray-500 uppercase" onClick={() => clickEventHandler(currentrole, "active")}>
        {title}
      </h3>
      <ul>
        {items.map(({ path, icon, label }, index) => (
          <li key={index}>
            <SidebarLink path={path} icon={icon} label={label} />
          </li>
        ))}
      </ul>
    </div>
  );
  
  const sectionConfig = [
    {
      roleKey: "Mentor",
      title: dashboardhomesidebar.sidebarSections.mentors.label,
      items: [
        {
          path: "/dashboard/mentor",
          icon: gridSvgIcon,
          label: dashboardhomesidebar.sidebarSections.mentors.items.label1,
        },
        {
          path: "/dashboard/mentor/new",
          icon: gridSvgIcon,
          label: "Create new Mentor",
        },
      ],
      currentrole: 'mentor'
    },
    {
      roleKey: "Project",
      title: dashboardhomesidebar.sidebarSections.projects.label,
      items: [
        {
          path: "/dashboard/project",
          icon: gridSvgIcon,
          label: dashboardhomesidebar.sidebarSections.projects.items.label1,
        },
        {
          path: "/dashboard/project/new",
          icon: gridSvgIcon,
          label: "Create new Project",
        },
      ],
      currentrole: 'project'
    },
    {
      roleKey: "Investor",
      title: dashboardhomesidebar.sidebarSections.investors.label,
      items: [
        {
          path: "/dashboard/investor",
          icon: gridSvgIcon,
          label: dashboardhomesidebar.sidebarSections.investors.items.label1,
        },
        {
          path: "/dashboard/investor/new",
          icon: gridSvgIcon,
          label: "Create new Investors",
        },
      ],
      currentrole: 'vc'
    },
  ];
  
  const Sidebar = () => {
    const approvedRoles = mergedData.filter(
      (role) => role.approval_status === "approved"
    );
  
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
          <div className="px-4 mb-6">
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
                  path="/regional-hubs"
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
              <li>
                <SidebarLink
                  path="/perks"
                  icon={staroutlineSvgIcon}
                  label={
                    dashboardhomesidebar.sidebarSections.discover.items.perks
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

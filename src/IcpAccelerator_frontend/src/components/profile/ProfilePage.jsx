import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { profile } from '../Utils/jsondata/data/profileData';
import { shareSvgIcon } from '../Utils/Data/SvgData';
import ProjectCard from '../Dashboard/Project/ProjectCard';
import NewEvent from '../Dashboard/DashboardEvents/NewEvent';
import JobSection from '../Dashboard/Project/JobSection';
import FAQ from '../Dashboard/Project/Faq';
import AssociationRequestCard from '../Dashboard/Associations/AssociationRequestCard';
import EventRequestCard from '../Dashboard/DashboardEvents/EventRequestCard';
import ProfileDetail from './ProfileDetail';
import Role from './Role';
import Announcement from './Announcement';
import EventRequestStatus from '../Dashboard/DashboardEvents/EventRequestStatus';
import RatingPage from './RatingPage';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("roles");
  const { profilepage } = profile;

  const userCurrentRoleStatus = useSelector(
    (currState) => currState.currentRoleStatus.rolesStatusArray
  );
  const userRole = useSelector(
    (currState) => currState.currentRoleStatus.activeRole
  );
  console.log("Define the tabs visibility based on user roles", userCurrentRoleStatus);

  // Function to get approved roles
  const getApprovedRoles = (rolesStatusArray) => {
    return rolesStatusArray
      .filter(role => role.approval_status === 'active')
      .map(role => role.name);
  };

  const approvedRoles = getApprovedRoles(userCurrentRoleStatus);

  // Define the tabs visibility based on approved roles
  const tabs = {
    user: ["roles", "rating"],
    project: ["roles", "project", "rating", "association-req", "job", "announcement"],
    mentor: ["roles", "rating", "cohort", "event-req", "association-req"],
    vc: ["roles", "rating", "job", "announcement", "association-req"],
  };

  // Combine all the tabs for the approved roles
  // const activeTabs = approvedRoles.reduce((acc, role) => {
  //   return acc.concat(tabs[role] || []);
  // }, ["roles", "rating"]);
  const activeTabs = tabs[userRole] || ["roles", "rating"];
  // Remove duplicate tabs
  const uniqueActiveTabs = [...new Set(activeTabs)];

  const handleChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="container mx-auto mb-5 bg-white">
      <div className="flex justify-between items-center mx-[3%] h-11 bg-opacity-95 -top-[.60rem] p-10 px-0 sticky bg-white z-20">
        <div className="">
          <h2 className="text-2xl font-bold">{profilepage.profileText}</h2>
        </div>
        <div className="flex gap-4">
          <button className="mr-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 bg-white px-3 py-2 rounded-md shadow-sm border border-gray-200">
            {profilepage.viewPublicProfileText}
          </button>
          <button className="flex items-center text-gray-600 hover:text-gray-800 hover:bg-gray-200 bg-white px-3 py-2 rounded-md shadow-sm border border-gray-200">
            {profilepage.shareText} <span>{shareSvgIcon}</span>
          </button>
        </div>
      </div>
      <div className="container flex justify-evenly">
        <div className="w-[30%] ">
          <ProfileDetail />
        </div>
        <div className="w-[60%] ">
          <div className="overflow-x-auto text-nowrap flex justify-start border-b">
            {uniqueActiveTabs.includes("roles") && (
              <button
                className={`px-4 py-2 focus:outline-none font-medium ${activeTab === "roles"
                    ? "border-b-2 border-blue-500 text-blue-500 font-medium"
                    : "text-gray-400"
                  }`}
                onClick={() => handleChange("roles")}
              >
                {profilepage.roleText}
              </button>
            )}
            {uniqueActiveTabs.includes("project") && (
              <button
                className={`px-4 py-2 focus:outline-none font-medium ${activeTab === "project"
                    ? "border-b-2 border-blue-500 text-blue-500 font-medium"
                    : "text-gray-400"
                  }`}
                onClick={() => handleChange("project")}
              >
                Project
              </button>
            )}
            {uniqueActiveTabs.includes("cohort") && (
              <button
                className={`px-4 py-2 focus:outline-none font-medium ${activeTab === "cohort"
                    ? "border-b-2 border-blue-500 text-blue-500 font-medium"
                    : "text-gray-400"
                  }`}
                onClick={() => handleChange("cohort")}
              >
                Cohort
              </button>
            )}
            {uniqueActiveTabs.includes("job") && (
              <button
                className={`px-4 py-2 focus:outline-none font-medium ${activeTab === "job"
                    ? "border-b-2 border-blue-500 text-blue-500 font-medium"
                    : "text-gray-400"
                  }`}
                onClick={() => handleChange("job")}
              >
                Job
              </button>
            )}
            {uniqueActiveTabs.includes("announcement") && (
              <button
                className={`px-4 py-2 focus:outline-none font-medium ${activeTab === "announcement"
                    ? "border-b-2 border-blue-500 text-blue-500 font-medium"
                    : "text-gray-400"
                  }`}
                onClick={() => handleChange("announcement")}
              >
                Announcement
              </button>
            )}
            {uniqueActiveTabs.includes("association-req") && (
              <button
                className={`px-4 py-2 focus:outline-none font-medium ${activeTab === "association-req"
                    ? "border-b-2 border-blue-500 text-blue-500 font-medium"
                    : "text-gray-400"
                  }`}
                onClick={() => handleChange("association-req")}
              >
                Request
              </button>
            )}
            {uniqueActiveTabs.includes("rating") && (
              <button
                className={`px-4 py-2 focus:outline-none font-medium ${activeTab === "rating"
                    ? "border-b-2 border-blue-500 text-blue-500 font-medium"
                    : "text-gray-400"
                  }`}
                onClick={() => handleChange("rating")}
              >
                {profilepage.ratingText}
              </button>
            )}
          </div>

          <div className="w-full">
            {activeTab === "roles" && <Role />}
          </div>
          <div className="w-full">
            {activeTab === "project" && <ProjectCard />}
          </div>
          <div className="w-full">
            {activeTab === "association-req" && <AssociationRequestCard />}
          </div>
          <div className="w-full">
          {activeTab === "cohort" && (
              <>
                {/* {!eventCreated ? (
                  <EventSection />  // Render EventSection when no event is created
                ) : (
                  <NewEvent />  // Render NewEvent when an event is created
                )} */}
                <NewEvent/>
              </>
            )}
          </div>
          <div className="w-full">
            {activeTab === "job" && (
              <>
                <JobSection />
                <FAQ />
              </>
            )}
          </div>
          <div className="w-full">
            {activeTab === "announcement" && <Announcement />}
          </div>
          <div className="w-full">
            {activeTab === "rating" && <RatingPage />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

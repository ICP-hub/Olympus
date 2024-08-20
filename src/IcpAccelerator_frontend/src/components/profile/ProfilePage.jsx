import React, { useState } from 'react'
import ProfileDetail from './ProfileDetail';
import { profile } from '../jsondata/data/profileData';


import Role from './Role';
import { shareSvgIcon } from '../Utils/Data/SvgData';
import ProjectCard from '../Dashboard/Project/ProjectCard';
import EventSection from '../Dashboard/Project/EventSection';
import EventMain from '../Dashboard/DashboardEvents/EventMain';
import NewEvent from '../Dashboard/DashboardEvents/NewEvent';
import Announcement from './Announcement';
import ProjectDetailsForOwnerProject from '../../component/Project/ProjectDetailsPages/ProjectDetailsForInvestorProject';



const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("roles");
  const [eventCreated, setEventCreated] = useState(false);
  const { profilepage } = profile

  const handleChange = (tab) => {
    setActiveTab(tab)
  }
  const userRole = "mentor";
  return (
    <div className="container mx-auto mb-5 bg-white">
      <div className="flex justify-between items-center mx-[3%] h-11   bg-opacity-95 -top-[.60rem] p-10 px-0 sticky bg-white  z-20">
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
          <div className="flex justify-start border-b">
            <button
              className={`px-4 py-2 focus:outline-none font-medium  ${activeTab === "roles"
                ? "border-b-2 border-blue-500 text-blue-500 font-medium"
                : "text-gray-400"
                }`}
              onClick={() => handleChange("roles")}
            >
              {profilepage.roleText}
            </button>
            {(userRole === "project" || userRole === "founder") && (
              <button
                className={`px-4 py-2 focus:outline-none font-medium  ${activeTab === "project"
                  ? "border-b-2 border-blue-500 text-blue-500 font-medium"
                  : "text-gray-400"
                  }`}
                onClick={() => handleChange("project")}
              >
                Project
              </button>
            )}
            {(userRole === "mentor" || userRole === "founder") && (
              <button
                className={`px-4 py-2 focus:outline-none font-medium  ${activeTab === "event"
                  ? "border-b-2 border-blue-500 text-blue-500 font-medium"
                  : "text-gray-400"
                  }`}
                onClick={() => handleChange("event")}
              >
                Event
              </button>
            )}
            {(userRole === "mentor" || userRole === "founder") && (
              <button
                className={`px-4 py-2 focus:outline-none font-medium  ${activeTab === "job"
                  ? "border-b-2 border-blue-500 text-blue-500 font-medium"
                  : "text-gray-400"
                  }`}
                onClick={() => handleChange("job")}
              >
                Job
              </button>
            )}
            {(userRole === "mentor" || userRole === "founder") && (
              <button
                className={`px-4 py-2 focus:outline-none font-medium  ${activeTab === "announcement"
                  ? "border-b-2 border-blue-500 text-blue-500 font-medium"
                  : "text-gray-400"
                  }`}
                onClick={() => handleChange("announcement")}
              >
                Announcement
              </button>
            )}
            {(userRole === "mentor" || userRole === "founder") && (
              <button
                className={`px-4 py-2 focus:outline-none font-medium  ${activeTab === "project"
                  ? "border-b-2 border-blue-500 text-blue-500 font-medium"
                  : "text-gray-400"
                  }`}
                onClick={() => handleChange("project")}
              >
                Project
              </button>
            )}
            <button
              className={`px-4 py-2 focus:outline-none font-medium ${activeTab === "rating"
                ? "border-b-2 border-blue-500 text-blue-500 font-medium"
                : "text-gray-400"
                }`}
              onClick={() => handleChange("rating")}>
              {profilepage.ratingText}
            </button>
          </div>
          <div className="w-full">
            {activeTab === "roles" ? <Role /> : ""}
          </div>
          <div className="w-full">
            {activeTab === "project" ? <ProjectCard /> : ""}
          </div>
          <div className="w-full">
            {activeTab === "event" ?
              <>
                <NewEvent />

                {/* // Render EventSection when no event is created */}
              </>
              : ""}
          </div>
          <div className="w-full">
            {activeTab === "job" ? <ProjectDetailsForOwnerProject /> : ""}
          </div>
          <div className="w-full">
            {activeTab === "announcement" ? <Announcement /> : ""}
          </div>
          <div className="w-full">
            {activeTab === "rating" ? <>
              <h1>Rating</h1>
            </> : ""}
          </div>

        </div>
      </div>
    </div>
  );
}

export default ProfilePage
import React, { useState } from 'react'
import RedoIcon from '@mui/icons-material/Redo';
import ProfileDetail from './ProfileDetail';

import Role from './Role';
import { shareSvgIcon } from '../Utils/Data/SvgData';


const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("roles");

  const handleChange = (tab) => {
    setActiveTab(tab)
  }

  return (
    <div className="container mx-auto mb-5 bg-white">
      <div className="flex justify-between items-center mx-[3%] h-11   bg-opacity-95 -top-[.60rem] p-10 px-0 sticky bg-white  z-20">
        <div className="">
          <h2 className="text-2xl font-bold">Profile</h2>
        </div>
        <div className="flex gap-4">
          <button className="mr-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 bg-white px-3 py-2 rounded-md shadow-sm border border-gray-200">
            View public profile
          </button>
          <button className="flex items-center text-gray-600 hover:text-gray-800 hover:bg-gray-200 bg-white px-3 py-2 rounded-md shadow-sm border border-gray-200">
            Share <span>{shareSvgIcon}</span>
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
              Roles
            </button>
            <button
              className={`px-4 py-2 focus:outline-none font-medium ${activeTab === "rating"
                ? "border-b-2 border-blue-500 text-blue-500 font-medium"
                : "text-gray-400"
                }`}
              onClick={() => handleChange("rating")}>
              Rating
            </button>
          </div>
          <div className="w-full">
            {activeTab === "roles" ? <Role /> : ""}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage
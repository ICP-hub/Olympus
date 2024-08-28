import React, { useState, useRef, useEffect } from "react";
import awtar from "../../../../assets/images/icons/_Avatar.png";
import VerifiedIcon from "@mui/icons-material/Verified";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import ArrowOutwardOutlinedIcon from "@mui/icons-material/ArrowOutwardOutlined";
import uint8ArrayToBase64 from "../../Utils/uint8ArrayToBase64";
import Select from "react-select";
import { useSelector } from "react-redux";
import { LinkedIn, GitHub, Telegram } from "@mui/icons-material";

const UserDetail = (projectData) => {

  const userData = projectData?.projectData?.[0]?.[1]?.params;
  console.log("user data", userData);

  const handleChange = (tab) => {
    setActiveTab(tab);
  };
  const [activeTab, setActiveTab] = useState("general");

  const profilepic =
    userData?.profile_picture && userData?.profile_picture[0]
      ? uint8ArrayToBase64(userData?.profile_picture[0])
      : "default-profile.png";

  const full_name = userData?.full_name || "Unknown User";
  const email = userData?.email || "N/A";
  const bio = userData?.bio[0] || "No bio available.";
  const area_of_interest = userData?.area_of_interest || "N/A";
  const location = userData?.country || "Unknown Location";
  const openchat_username = userData?.openchat_username ?? "username";

  return (
    <div className="">
      <div className="container bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden w-full max-w-[400px]">
        <div className="relative h-1 bg-gray-200">
          <div className="absolute left-0 top-0 h-full bg-green-500 w-1/3"></div>
        </div>
        <div className="p-6 bg-gray-50">
          <img
            src={profilepic}
            alt="Matt Bowers"
            className="w-24 h-24 mx-auto rounded-full mb-4"
          />
          <div className="flex items-center justify-center mb-1">
            <VerifiedIcon className="text-blue-500 mr-1" fontSize="small" />
            <h2 className="text-xl font-semibold">{full_name}</h2>
          </div>
          <p className="text-gray-600 text-center mb-4">{openchat_username}</p>
          <a
            href={`mailto:${email}`}
            className="w-full h-[#155EEF] bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 mb-6 flex items-center justify-center"
          >
            Get in touch
            <ArrowOutwardOutlinedIcon className="ml-1" fontSize="small" />
          </a>
        </div>

        <div className="p-6 bg-white">
          <div className="mb-4">
            <h3 className="font-semibold mb-2 text-xs text-gray-500 uppercase">
              Roles
            </h3>
            <div className="flex space-x-2">
              <span className="bg-[#F0F9FF] border border-[#B9E6FE] text-[#026AA2] px-1 py-1 rounded-md text-xs font-normal">
                OLYMPIAN
              </span>
              <span className="bg-[#F0F9FF] border border-[#B9E6FE] text-[#026AA2] px-1 py-1 rounded-md text-xs font-normal">
                FOUNDER
              </span>
              <span className="bg-[#F0F9FF] border border-[#B9E6FE] text-[#C5237C] px-1 py-1 rounded-md text-xs font-normal">
                MENTOR
              </span>
            </div>
          </div>
          <div className="">
            <h3 className="font-semibold mb-2 text-xs text-gray-500 uppercase">
              Associations
            </h3>
            <div className="mb-2">
              <img src={awtar} alt="icon" />
            </div>
          </div>
          <div className="flex justify-start border-b">
            <button
              className={`px-4 py-2 focus:outline-none font-medium  ${
                activeTab === "general"
                  ? "border-b-2 border-blue-500 text-blue-500 font-medium"
                  : "text-gray-400"
              }`}
              onClick={() => handleChange("general")}
            >
              General
            </button>
            <button
              className={`px-4 py-2 focus:outline-none font-medium  ${
                activeTab === "experties"
                  ? "border-b-2 border-blue-500 text-blue-500 font-medium"
                  : "text-gray-400"
              }`}
              onClick={() => handleChange("experties")}
            >
              Experties
            </button>
          </div>

          {activeTab === "general" ? (
            <div className=" px-1">
              <div className="mb-4  group relative hover:bg-gray-100 rounded-lg p-2 px-3">
                <div className="flex justify-between">
                  <h3 className="font-semibold mb-2 text-xs text-gray-500 uppercase">
                    Email
                  </h3>
                </div>
                <div className="flex items-center">
                  <p className="mr-2 text-sm">{email}</p>
                  <VerifiedIcon
                    className="text-blue-500 mr-2 w-2 h-2"
                    fontSize="small"
                  />
                  {/* <span className="bg-[#F8FAFC] border border-[#E3E8EF] text-[#364152] px-2 py-0.5 rounded text-xs">
                    HIDDEN
                  </span> */}
                </div>
              </div>

              {/* Tagline Section */}
              {/* <div className="mb-4 group relative hover:bg-gray-100 rounded-lg p-1 px-3">
                <div className="flex justify-between">
                  <h3 className="font-semibold mb-2 text-xs text-gray-500 uppercase">
                    Tagline
                  </h3>
                </div>
                <p className="text-sm">tagline</p>
              </div> */}

              {/* About Section */}
              <div className="mb-4 group relative hover:bg-gray-100 rounded-lg p-1 px-3">
                <div className="flex justify-between">
                  <h3 className="font-semibold mb-2 text-xs text-gray-500 uppercase">
                    About
                  </h3>
                </div>
                <p className="text-sm">{bio}</p>
              </div>

              {/* Location Section */}
              <div className="mb-4 group relative hover:bg-gray-100 rounded-lg p-1 px-3">
                <div className="flex justify-between">
                  <h3 className="font-semibold mb-2 text-xs text-gray-500 uppercase">
                    Location
                  </h3>
                </div>
                <div className="flex">
                <PlaceOutlinedIcon
                  className="text-gray-500 mr-1"
                  fontSize="small"
                />
                <p className="text-sm">{location}</p>
                </div>
              </div>

              {/* Reasons to Join Platform Section */}
              <div className="mb-4 group relative hover:bg-gray-100 rounded-lg p-1 px-3">
                <div className="flex justify-between">
                  <h3 className="font-semibold mb-2 text-xs text-gray-500 uppercase">
                    Reasons to Join Platform
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {userData?.reason_to_join?.map((reason) => (
                    <span
                      key={reason}
                      className="border-2 border-gray-500 rounded-full text-gray-700 text-xs px-2 py-1 "
                    >
                      {reason}
                    </span>
                  ))}
                </div>
              </div>

              {/* Interests Section */}
              {/* <div className="mb-4 group relative hover:bg-gray-100 rounded-lg p-1 px-3">
                <div className="flex justify-between">
                  <h3 className="font-semibold mb-2 text-xs text-gray-500 uppercase">
                    Interests
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profileData.domains_interested_in.map((interest) => (
                    <span
                      key={interest}
                      className="border-2 border-gray-500 rounded-full text-gray-700 text-xs px-2 py-1 "
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div> */}

              <div>
                <h3 className="mb-2 text-xs text-gray-500 px-3">LINKS</h3>
                
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetail;

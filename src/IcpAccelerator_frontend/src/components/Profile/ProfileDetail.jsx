import React, { useState, useRef, useEffect } from "react";
import ProfileImages from "../../../assets/Logo/ProfileImage.png";
import VerifiedIcon from "@mui/icons-material/Verified";
import ArrowOutwardOutlinedIcon from "@mui/icons-material/ArrowOutwardOutlined";
import { useDispatch, useSelector } from "react-redux";
import InvestorDetail from "./InvestorDetail";
import MentorEdit from "../../component/Mentors/MentorEdit";
import {FaEdit, FaPlus } from 'react-icons/fa';
import ProjectDetail from "./ProjectDetail";
import UserGeneralDetail from "./UserGeneralDetail";
import { founderRegisteredHandlerRequest,
  founderRegisteredHandlerSuccess,
  founderRegisteredHandlerFailure,} from "../StateManagement/Redux/Reducers/founderRegisteredData";
import { mentorRegisteredHandlerRequest } from "../StateManagement/Redux/Reducers/mentorRegisteredData";
import { investorRegisteredHandlerRequest } from "../StateManagement/Redux/Reducers/investorRegisteredData";

const ProfileDetail = () => {
     // Retrieve the active role
  const userRole = useSelector(
    (currState) => currState.currentRoleStatus.activeRole
  );
  const isAuthenticated = useSelector(
    (currState) => currState.internet.isAuthenticated
  );
  const actor = useSelector((currState) => currState.actors.actor);
  const dispatch = useDispatch();
  const userFullData = useSelector((currState) => currState.userData.data.Ok);
    // Retrieve data for all roles
    const investorFullData = useSelector(
      (currState) => currState.investorData
    );
    const projectFullData = useSelector((currState) => currState.projectData.data);
    const mentorFullData = useSelector(
      (currState) => currState.mentorData
    );
  console.log('INVESTOR USER DATA ',investorFullData)
  console.log('MENTOR USER DATA ',mentorFullData)
  console.log('PROJECT USER DATA ',projectFullData)
    // Combine all data into one object
    const userData = {
      investor: investorFullData,
      project: projectFullData,
      mentor: mentorFullData,
    };
    console.log('COMBINE USER DATA ',userData)




    useEffect(() => {
    if (actor && isAuthenticated){
    
          dispatch(founderRegisteredHandlerRequest());
          dispatch(mentorRegisteredHandlerRequest());
          dispatch(investorRegisteredHandlerRequest());
    }
    }, [dispatch,isAuthenticated, actor]);

  const [activeTab, setActiveTab] = useState("general");
  const containerRef = useRef(null);
  const handleChange = (tab) => {
    setActiveTab(tab);
  };


  const tabs = [
    { role: "general", label: "General" },
    userRole === "vc" && { role: "vc", label: "Investor" },
    userRole === "mentor" && { role: "mentor", label: "Mentor" },
    userRole === "project" && { role: "project", label: "Project" },
  ].filter(Boolean);

  // User data map 
  const ProfileImage = userFullData?.profile_picture[0];
  const Fullname = userFullData?.full_name;
  const openchat_username = userFullData?.openchat_username[0];
  return (
    <div
      ref={containerRef}
      className="container bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden w-full max-w-[400px]"
    >
      <div className="relative h-1 bg-gray-200">
        <div className="absolute left-0 top-0 h-full bg-green-500 w-1/3"></div>
      </div>
      {activeTab === "general" && (
      <div className="p-6 bg-gray-50">
     
      <div className="relative w-24 h-24 mx-auto rounded-full mb-4 group">
      <img
        src={ProfileImage}
        alt={Fullname}
        className="w-full h-full rounded-full object-cover"
      />
      <div className="absolute inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <FaPlus className="text-white text-xl" />
        <input
          id="file-upload"
          type="file"
          className="absolute inset-0 opacity-0 cursor-pointer"
          accept="image/*"
        />
      </div>
    </div>
  
        <div className="flex items-center justify-center mb-1">
          <VerifiedIcon className="text-blue-500 mr-1" fontSize="small" />
          <h2 className="text-xl font-semibold">{Fullname}</h2>
        </div>
        <p className="text-gray-600 text-center mb-4">{openchat_username}</p>
        <button className="w-full h-[#155EEF] bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 mb-6 flex items-center justify-center">
          Get in touch
          <ArrowOutwardOutlinedIcon className="ml-1" fontSize="small" />
        </button>
      </div>
    )}
    {userRole === "vc" && activeTab === "vc" && (
      <div className="p-6 bg-gray-50 relative cursor-pointer"  style={{
        backgroundImage: `url(${ProfileImages})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        // Remove inline filter style
      }}>
      {/* Edit icon */}
      <div
            className="absolute top-0 right-0 p-2  cursor-pointer"
          >
            <FaEdit className="text-white text-xl cursor-pointer" />
            <input
          id="file-upload"
          type="file"
          className="absolute inset-0 opacity-0 cursor-pointer"
          accept="image/*"
        />
          </div>
      <div className="relative w-24 h-24 mx-auto rounded-full mb-4 group">
      <img
        src={ProfileImages}
        alt={Fullname}
        className="w-full h-full rounded-full object-cover"
      />
      <div className="absolute inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <FaPlus className="text-white text-xl" />
        <input
          id="file-upload"
          type="file"
          className="absolute inset-0 opacity-0 cursor-pointer"
          accept="image/*"
        />
      </div>
    </div>
  
        <div className="flex items-center justify-center mb-1">
          <VerifiedIcon className="text-blue-500 mr-1" fontSize="small" />
          <h2 className="text-xl font-semibold">{Fullname}</h2>
        </div>
        <p className="text-gray-600 text-center mb-4">{openchat_username}</p>
        <button className="w-full h-[#155EEF] bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 mb-6 flex items-center justify-center">
          Get in touch
          <ArrowOutwardOutlinedIcon className="ml-1" fontSize="small" />
        </button>
      </div>
    )}
       {userRole === "mentor" && activeTab === "mentor" && (
      <div className="p-6 bg-gray-50 relative cursor-pointer"  style={{
        backgroundImage: `url(${ProfileImages})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        // Remove inline filter style
      }}>
      {/* Edit icon */}
      <div
            className="absolute top-0 right-0 p-2  cursor-pointer"
          >
            <FaEdit className="text-white text-xl cursor-pointer" />
            <input
          id="file-upload"
          type="file"
          className="absolute inset-0 opacity-0 cursor-pointer"
          accept="image/*"
        />
          </div>
      <div className="relative w-24 h-24 mx-auto rounded-full mb-4 group">
      <img
        src={ProfileImages}
        alt={Fullname}
        className="w-full h-full rounded-full object-cover"
      />
      <div className="absolute inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <FaPlus className="text-white text-xl" />
        <input
          id="file-upload"
          type="file"
          className="absolute inset-0 opacity-0 cursor-pointer"
          accept="image/*"
        />
      </div>
    </div>
  
        <div className="flex items-center justify-center mb-1">
          <VerifiedIcon className="text-blue-500 mr-1" fontSize="small" />
          <h2 className="text-xl font-semibold">{Fullname}</h2>
        </div>
        <p className="text-gray-600 text-center mb-4">{openchat_username}</p>
        <button className="w-full h-[#155EEF] bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 mb-6 flex items-center justify-center">
          Get in touch
          <ArrowOutwardOutlinedIcon className="ml-1" fontSize="small" />
        </button>
      </div>
    )}
       {userRole === "project" && activeTab === "project" && (
      <div className="p-6 bg-gray-50 relative cursor-pointer"  style={{
        backgroundImage: `url(${ProfileImages})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        // Remove inline filter style
      }}>
      {/* Edit icon */}
      <div
            className="absolute top-0 right-0 p-2  cursor-pointer"
          >
            <FaEdit className="text-white text-xl cursor-pointer" />
            <input
          id="file-upload"
          type="file"
          className="absolute inset-0 opacity-0 cursor-pointer"
          accept="image/*"
        />
          </div>
      <div className="relative w-24 h-24 mx-auto rounded-full mb-4 group">
      <img
        src={ProfileImages}
        alt={Fullname}
        className="w-full h-full rounded-full object-cover"
      />
      <div className="absolute inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <FaPlus className="text-white text-xl" />
        <input
          id="file-upload"
          type="file"
          className="absolute inset-0 opacity-0 cursor-pointer"
          accept="image/*"
        />
      </div>
    </div>
  
        <div className="flex items-center justify-center mb-1">
          <VerifiedIcon className="text-blue-500 mr-1" fontSize="small" />
          <h2 className="text-xl font-semibold">{Fullname}</h2>
        </div>
        <p className="text-gray-600 text-center mb-4">{openchat_username}</p>
        <button className="w-full h-[#155EEF] bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 mb-6 flex items-center justify-center">
          Get in touch
          <ArrowOutwardOutlinedIcon className="ml-1" fontSize="small" />
        </button>
      </div>
    )}
      <div className="p-6 bg-white">
        <div className="mb-4">
          <h3 className="font-semibold mb-2 text-xs text-gray-500 uppercase">
            Roles
          </h3>
          <div className="flex space-x-2">
            <span className="bg-[#F0F9FF] border border-[#B9E6FE] text-[#026AA2] px-3 py-1 rounded-md text-xs font-medium">
              OLYMPIAN
            </span>
          </div>
        </div>
        <div className="flex justify-start border-b">
    {tabs.map(
      (tab) =>
        (tab.role === "general" || userRole === tab.role) && (
          <button
            key={tab.role}
            className={`px-4 py-2 focus:outline-none font-medium ${
              activeTab === tab.role
                ? "border-b-2 border-blue-500 text-blue-500 font-medium"
                : "text-gray-400"
            }`}
            onClick={() => handleChange(tab.role)}
          >
            {tab.label}
          </button>
        )
    )}
  </div>

        {/* General Tab Content */}
        {activeTab === "general" && (
         <UserGeneralDetail/>
        )}

        {/* Investor Tab Content */}
        {userRole === "vc" && activeTab === "vc" && (
          <InvestorDetail />
        )}

        {/* Mentor Tab Content */}
        {userRole === "mentor" && activeTab === "mentor" && (
          <MentorEdit />
        )}

        {/* Founder Tab Content */}
        {userRole === "project" && activeTab === "project" && (
          < ProjectDetail/>
        )}
      </div>
    </div>
  );
};

export default ProfileDetail;
import React, { useState } from "react";
import ProfileImage from "../../../assets/Logo/ProfileImage.png";
import NeilProfileImages from "../../../assets/Logo/NeilProfileImages.png";
import LeonProfileImage from "../../../assets/Logo/LeonProfileImage.png";
import BlancheProfileImage from "../../../assets/Logo/BlancheProfileImage.png";
import CypherpunkLabLogo from "../../../assets/Logo/CypherpunkLabLogo.png";
import { FavoriteBorder, LocationOn, Star } from "@mui/icons-material";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import Tabs from "../Common/Tabs/Tabs";
import UserDetailPage from "../Dashboard/DashboardHomePage/UserDetailPage";
import DiscoverProject from "./ProjectAlldata";
import DiscoverUser from "./DiscoverUser";
import DiscoverMentor from "./DiscoverMentor";
import DiscoverInvestor from "./DiscoverInvestor";

const UserCard = ({
  name,
  username,
  tags,
  role,
  description,
  rating,
  skills,
  location,
  avatar,
}) => {
  const tagColors = {
    OLYMPIAN: "bg-[#F0F9FF] border-[#B9E6FE] border text-[#026AA2] rounded-md",
    FOUNDER: "bg-[#EEF4FF] border-[#C7D7FE] border text-[#3538CD] rounded-md",
    PROJECT: "bg-[#F8FAFC] text-[#364152] border border-[#E3E8EF] rounded-md",
    INVESTER: "bg-[#FFFAEB] border-[#FEDF89] border text-[#B54708] rounded-md",
    TALENT: "bg-[#ECFDF3] border-[#ABEFC6] border text-[#067647] rounded-md",
  };
  const [openDetail, setOpenDetail] = useState(false);

  return (
    <div className=" p-6 w-[60%] rounded-lg shadow-sm mb-4 flex">
      <div className="w-[272px]  ">
        <div
          onClick={() => setOpenDetail(true)}
          className="max-w-[250px] w-[250px] bg-gray-100 rounded-lg flex flex-col justify-between h-full relative overflow-hidden"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={avatar}
              alt={name}
              className="w-24 h-24 rounded-full object-cover"
            />
          </div>
          {rating && (
            <div className="absolute bottom-0 right-[6px] flex items-center bg-gray-100 p-1">
              <Star className="text-yellow-400 w-4 h-4" />
              <span className="text-sm font-medium">{rating}</span>
            </div>
          )}
        </div>
      </div>
      {openDetail && (
        <UserDetailPage openDetail={openDetail} setOpenDetail={setOpenDetail} />
      )}
      <div className="flex-grow ml-[25px] ">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-xl font-bold">{name}</h3>
            <p className="text-gray-500">@{username}</p>
          </div>
          <FavoriteBorder className="text-gray-400 cursor-pointer" />
        </div>
        <div className="mb-2">
          {tags?.map((tag, index) => (
            <span
              key={index}
              className={`inline-block ${
                tagColors[tag] || "bg-gray-100 text-gray-800"
              } text-xs px-3 py-1 rounded-full mr-2 mb-2`}
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="border-t border-gray-200 my-3 mr-3"></div>
        <p className="font-medium mb-2">{role}</p>

        <p className="text-gray-600 mb-4">{description}</p>
        <div className="flex items-center text-sm text-gray-500 flex-wrap">
          {skills?.map((skill, index) => (
            <span
              key={index}
              className="mr-2 mb-2 border boder-[#CDD5DF] bg-white text-[#364152] px-3 py-1 rounded-full"
            >
              {skill}
            </span>
          ))}
          {location && (
            <span className="mr-2 mb-2 flex text-[#121926] items-center">
              <PlaceOutlinedIcon className="text-[#364152] mr-1 w-4 h-4" />{" "}
              {location}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const UsersSection = () => {
  const [currentTab, setCurrentTab] = useState("Users");

  // Simulated counts for each category
  const [usersCount, setUsersCount] = useState(0);
  const [projectsCount, setProjectsCount] = useState(0);
  const [mentorsCount, setMentorsCount] = useState(0);
  const [investorsCount, setInvestorsCount] = useState(0);

  console.log('usersCount',usersCount)

  const tabs = [
    {
      label: (
        <span>
          Users{" "}
          {usersCount > 0 && (
            <div className="border-2 rounded-full text-gray-700 text-xs px-1 inline-block">
              {usersCount}
            </div>
          )}
        </span>
      ),
      value: "Users",
    },
    {
      label: (
        <span>
          Projects{" "}
          {projectsCount > 0 && (
            <div className="border-2 rounded-full text-gray-700 text-xs px-1 inline-block">
              {projectsCount}
            </div>
          )}
        </span>
      ),
      value: "Projects",
    },
    {
      label: (
        <span>
          Mentors{" "}
          {mentorsCount > 0 && (
            <div className="border-2 rounded-full text-gray-700 text-xs px-1 inline-block">
              {mentorsCount}
            </div>
          )}
        </span>
      ),
      value: "Mentors",
    },
    {
      label: (
        <span>
          Investors{" "}
          {investorsCount > 0 && (
            <div className="border-2 rounded-full text-gray-700 text-xs px-1 inline-block">
              {investorsCount}
            </div>
          )}
        </span>
      ),
      value: "Investors",
    },
  ];

  const handleTabChange = (tab) => {
    setCurrentTab(tab);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white">
      <h1 className="text-3xl font-bold p-4 px-0 bg-opacity-95 sticky bg-white z-20 top-0">
        Discover
      </h1>

      {/* Tabs Section */}
      <div className="sticky top-[4rem] bg-white z-10">
        <Tabs
          tabs={tabs}
          currentTab={currentTab}
          onTabChange={handleTabChange}
        />
      </div>

      <div className="md:flex lg:flex-none lgx:flex justify-between">
        <div className="flex-1">
          {currentTab === "Users" && (
            <DiscoverUser onUserCountChange={setUsersCount} />
          )}
          {currentTab === "Projects" && (
            <DiscoverProject onProjectCountChange={setProjectsCount} />
          )}
          {currentTab === "Mentors" && (
            <DiscoverMentor onMentorCountChange={setMentorsCount} />
          )}
          {currentTab === "Investors" && (
            <DiscoverInvestor onInvestorCountChange={setInvestorsCount} />
          )}
        </div>
        <div className=" hidden md:block lg:hidden lgx:block lg: w-[35%]">
          <div className="bg-white py-6 rounded-lg shadow-sm sticky top-0">
            <h2 className="text-lg font-semibold mb-4">Filters</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                onChange={(e) => handleTabChange(e.target.value)}
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option>Select role</option>
                <option value="Users">Users</option>
                <option value="Projects">Projects</option>
                <option value="Mentors">Mentors</option>
                <option value="Investors">Investors</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersSection;

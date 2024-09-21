import React, { useState, useCallback } from "react";
import uint8ArrayToBase64 from "../../../Utils/uint8ArrayToBase64";
import ArrowOutwardOutlinedIcon from "@mui/icons-material/ArrowOutwardOutlined";
import VerifiedIcon from "@mui/icons-material/Verified";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import parse from "html-react-parser";
import Avatar from "@mui/material/Avatar";
import UserDetail from "../UserDetail";
import getSocialLogo from "../../../Utils/navigationHelper/getSocialLogo";
const DiscoverMentorDetail = ({ projectDetails, userData }) => {
  const projectDetail = projectDetails;
  console.log("projectdetails ", projectDetail);
  console.log("userdetails ", userData);

  let full_name = projectDetail?.full_name;

  let icphub = projectDetail?.preferred_icp_hub?.[0];
  let projectFocus = projectDetail?.project_area_of_focus;
  let regestrationType = projectDetail?.type_of_registration;
  let links = projectDetail?.links?.[0]?.[0];
  const projectname = projectDetail?.project_name ?? "";
  const projectdescription =
    parse(projectDetail?.project_description?.[0]) ?? "";
  const project_elevator_pitch = projectDetail?.project_elevator_pitch ?? "";
  const project_website = projectDetail?.project_website?.[0] ?? "";

  const country_of_registration =
    projectDetail?.country_of_registration?.[0] ?? "";

  const dapp_link = projectDetail?.dapp_link?.[0] ?? "";
  const weekly_active_users = projectDetail?.weekly_active_users?.[0] ?? "";
  const revenue = projectDetail?.revenue?.[0] ?? "";

  const project_area_of_focus = projectDetail?.project_area_of_focus;
  const multi_chain_names =
    projectDetail?.supports_multichain?.join(", ") ?? "";

  const icp_grants = projectDetail?.money_raised?.[0]?.icp_grants ?? "";
  const investors = projectDetail?.money_raised?.[0]?.investors ?? "";
  const raised_from_other_ecosystem =
    projectDetail?.money_raised?.[0]?.raised_from_other_ecosystem ?? "";
  const valuation = projectDetail?.money_raised?.[0]?.sns ?? "";
  const target_amount = projectDetail?.money_raised?.[0]?.target_amount ?? 0;
  const promotional_video = projectDetail?.promotional_video?.[0] ?? "";

  const reason_to_join_incubator = projectDetail?.reason_to_join_incubator;

  // Initialize an array to hold the merged data
  let mergedProfiles = [];
  // Extract and merge mentor profiles
  if (
    projectDetail?.mentors_assigned &&
    projectDetail.mentors_assigned[0]?.length > 0
  ) {
    projectDetail.mentors_assigned[0].forEach((mentorGroup) => {
      mentorGroup.forEach((mentor) => {
        console.log("mentor", mentor);
        const profilePicture = mentor?.params?.profile_picture[0]
          ? uint8ArrayToBase64(mentor?.params?.profile_picture[0])
          : null; // Convert Uint8Array to Base64 if available

        mergedProfiles.push({
          profile_picture: profilePicture, // Store the Base64 encoded profile picture
          role: "mentor", // Mark role as mentor
        });
      });
    });
  }

  // Extract and merge VC profiles
  if (projectDetail?.vc_assigned && projectDetail.vc_assigned[0]?.length > 0) {
    projectDetail.vc_assigned[0].forEach((vcGroup) => {
      vcGroup.forEach((vc) => {
        console.log("vc", vc);
        const profilePicture = vc?.params?.profile_picture[0]
          ? uint8ArrayToBase64(vc?.params?.profile_picture[0])
          : null; // Convert Uint8Array to Base64 if available

        mergedProfiles.push({
          profile_picture: profilePicture, // Store the Base64 encoded profile picture
          role: "vc", // Mark role as VC
        });
      });
    });
  }

  console.log("mergedProfiles", mergedProfiles);

  const projectlogo =
    projectDetail?.project_logo && projectDetail?.project_logo[0]
      ? uint8ArrayToBase64(projectDetail?.project_logo[0])
      : "default-profile.png";

  const [socialLinks, setSocialLinks] = useState({
    LinkedIn: "https://www.linkedin.com/in/mattbowers",
    GitHub: "https://github.com/mattbowers",
    Telegram: "https://t.me/mattbowers",
  });

  const [isEditingLink, setIsEditingLink] = useState({
    LinkedIn: false,
    GitHub: false,
    Telegram: false,
  });



  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);

  const handleMouseEnter = useCallback(
    (index) => {
      if (hoveredIndex !== index) {
        setHoveredIndex(index);
        setActiveIndex(index);
      }
    },
    [hoveredIndex]
  );

  const handleMouseLeave = useCallback(() => {
    setHoveredIndex(null);
    setActiveIndex(null);
  }, []);

  const handleTransitionEnd = () => {
    if (hoveredIndex === null) {
      setActiveIndex(null);
    }
  };

  const [activeTab, setActiveTab] = useState("general");

  const handleChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg w-full lg1:pb-3 ">
      <div className="bg-slate-200 p-6">
        <div className="flex justify-center">
          <img
            src={projectlogo}
            alt="Profile"
            className="rounded-lg w-24 h-24"
            loading="lazy"
            draggable={false}
          />
        </div>

        <div className="text-center mt-2">
          <span className="text-xs font-medium text-[#3538CD] border bg-blue-50 rounded-lg px-3 py-1">
            Looking for funding
          </span>
        </div>

        <div className="text-center mt-4">
          <h2 className="text-xl font-semibold text-gray-800">{full_name}</h2>
          {/* <p className="text-gray-500">@cypherpunklabs</p> */}
        </div>

        <div className="text-center w-full mt-6">
          {/* <button className="bg-transparent border border-[#3505B2] text-[#3505B2] text-sm font-[950] px-2 py-1 rounded-md">
            Get in touch{" "}
          </button> */}
          <a
            href={project_website}
            className="w-full h-[#155EEF] bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 mb-6 flex items-center justify-center"
          >
            Get in touch
            <ArrowOutwardOutlinedIcon className="ml-1" fontSize="small" />
          </a>
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
            activeTab === "project"
              ? "border-b-2 border-blue-500 text-blue-500 font-medium"
              : "text-gray-400"
          }`}
          onClick={() => handleChange("project")}
        >
          Project
        </button>
      </div>

      {activeTab === "general" ? (
        <div className="p-4">
          <div className="mb-2 group relative hover:bg-gray-100 rounded-lg p-2 ">
            <h3 className="font-semibold mb-2 text-xs text-gray-500 uppercase">
              Email
            </h3>

            <div className="flex flex-wrap items-center">
              <p className="mr-2 text-sm">{userData?.email[0]}</p>
              <VerifiedIcon
                className="text-blue-500 mr-2 w-2 h-2"
                fontSize="small"
              />
              <span className="bg-[#F8FAFC] border border-[#E3E8EF] text-[#364152] px-2 py-0.5 rounded text-xs">
                  HIDDEN
                </span>
            </div>
          </div>

          <div className="mb-2 group relative hover:bg-gray-100 rounded-lg p-2 ">
            <h3 className="font-semibold mb-2 text-xs text-gray-500 uppercase">
              Type of Profile
            </h3>
            <div className="flex items-center">
              <p className="border-2 border-gray-500 rounded-full text-gray-700 text-xs px-3 py-1 bg-gray-100">
                {userData?.type_of_profile?.[0]}
              </p>
            </div>
          </div>

          <div className="mb-2 group relative hover:bg-gray-100 rounded-lg p-2 ">
            <h3 className="font-semibold mb-2 text-xs text-gray-500 uppercase">
              About
            </h3>

            <p className="text-sm">{userData?.bio[0] }</p>
          </div>

          <div className="mb-2 group relative hover:bg-gray-100 rounded-lg p-2 ">
            <h3 className="font-semibold mb-2 text-xs text-gray-500 uppercase">
              Location
            </h3>

            <div className="flex">
              <PlaceOutlinedIcon
                className="text-gray-500 mr-1"
                fontSize="small"
              />
              <p className="text-sm">{userData?.country}</p>
            </div>
          </div>

          <div className="mb-2 group relative hover:bg-gray-100 rounded-lg p-2">
            <h3 className="font-semibold mb-2 text-xs text-gray-500 uppercase">
              Area of Interest
            </h3>
            <div>
              <div className="flex flex-wrap gap-2">
                {userData?.area_of_interest &&
                  userData.area_of_interest
                    .split(", ")
                    .map((interest, index) => (
                      <span
                        key={index}
                        className="border-2 border-gray-500 rounded-full text-gray-700 text-xs px-3 py-1 bg-gray-100"
                      >
                        {interest}
                      </span>
                    ))}
              </div>
            </div>
          </div>

          <div className="mb-2 group relative hover:bg-gray-100 rounded-lg p-2 ">
            <h3 className="font-semibold mb-2 text-xs text-gray-500 uppercase">
              Reasons to Join Platform
            </h3>

            <div className="flex flex-wrap gap-2">
              {userData?.reason_to_join[0]?.map((reason) => (
                <span
                  key={reason}
                  className="border-2 border-gray-500 rounded-full text-gray-700 text-xs px-2 py-1"
                >
                  {reason}
                </span>
              ))}
            </div>
          </div>

          <div className="p-2 group relative hover:bg-gray-100 rounded-lg">
            {userData?.social_links[0] && (
              <h3 className="font-semibold mb-2 text-xs text-gray-500 uppercase ">
                LINKS
              </h3>
            )}

            <div className="flex items-center ">
              <div className="flex gap-3">
                {userData?.social_links[0]?.map((linkObj, i) => {
                  const link = linkObj.link[0]; // Assuming the link is in this format
                  const icon = getSocialLogo(link);
                  return (
                    <a
                      key={i}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2"
                    >
                      {icon}
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6">
          <h3 className="text-gray-600 text-sm font-medium">ASSOCIATIONS</h3>
          <div className="flex items-center space-x-2">
            {mergedProfiles.map((association, index) => (
              <div key={index} className="relative">
                {/* Profile Picture with Hover Effect */}
                <Avatar
                  src={association?.profile_picture}
                  className="h-12 w-12 rounded-full transition-transform duration-500 ease-in-out hover:scale-105"
                />
                {/* Role shown on hover using CSS */}
                <span className="absolute left-12 top-2 opacity-0 transform transition-all duration-500 ease-in-out hover:opacity-100 hover:translate-x-2">
                  {association?.role}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <h3 className="block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start">
              Project Name
            </h3>
            <p className="text-sm line-clamp-3">{projectname} </p>
          </div>
          <div className="mt-4">
            <h3 className="block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start">
              Project Description
            </h3>
            <p className="text-sm line-clamp-3">{projectdescription} </p>
          </div>
          <div className="mt-6">
            <h3 className="block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start">
              Prefered Icp Hub
            </h3>
            <p className="text-sm">{icphub}</p>
          </div>
          <div className="mt-6">
            <h3 className="block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start">
              Project Elevator Pitch
            </h3>
            <p className="text-sm">{project_elevator_pitch}</p>
          </div>
          <div className="mt-6">
            <h3 className="block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start">
              Project Website
            </h3>
            <p className="text-sm">{project_website}</p>
          </div>

          <div className="mt-4">
            <h3 className="block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start">
              PROJECT FOCUS AREA
            </h3>
            {projectFocus?.split(", ").map((focus, index) => (
              <span
                key={index}
                className="border-2 border-gray-500 rounded-full text-gray-700 text-xs px-2 py-1 inline-block mr-2 mb-2 mt-1"
              >
                {focus}
              </span>
            ))}
          </div>
          <div className="mt-4">
            <h3 className="block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start">
              MULTI-CHAIN NAMES
            </h3>
            {multi_chain_names?.split(", ").map((chain, index) => (
              <span
                key={index}
                className="border-2 border-gray-500 rounded-full text-gray-700 text-xs px-2 py-1 inline-block mr-2 mb-2 mt-1"
              >
                {chain}
              </span>
            ))}
          </div>
          <div className="mt-4">
            <h3 className="block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start">
              REASON TO JOIN
            </h3>

            {reason_to_join_incubator?.split(", ").map((chain, index) => (
              <span
                key={index}
                className="border-2 border-gray-500 rounded-full text-gray-700 text-xs px-2 py-1 inline-block mr-2 mb-2 mt-1"
              >
                {chain}
              </span>
            ))}
          </div>

          <div className="mt-4">
            <h3 className="block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start">
              TYPE OF REGISTRATION
            </h3>
            <span className=" border-2 border-gray-500 rounded-full text-gray-700 text-xs px-2 py-1 inline-block mr-2 mb-2 mt-1">
              {regestrationType}{" "}
            </span>
          </div>
          <div className="mt-4">
            <h3 className="block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start">
              COUNTRY OF REGISTRATION
            </h3>
            <span className=" text-sm">{country_of_registration} </span>
          </div>
          <div className="mt-4">
            <h3 className="block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start">
              DAPP LINK
            </h3>
            <span className=" text-sm">{dapp_link} </span>
          </div>
          <div className="mt-4">
            <h3 className="block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start">
              WEEKLY ACTIVE USERS
            </h3>
            <span className=" text-sm">{Number(weekly_active_users)}</span>
          </div>
          <div className="mt-4">
            <h3 className="block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start">
              REVENUE
            </h3>
            <span className=" text-sm">{Number(revenue)} </span>
          </div>
          {/* <div className="mt-4">
          <h3 className="block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start">
            ICP GRANTS
          </h3>
          <span className=" text-sm">{icp_grants} </span>
        </div>

        <div className="mt-4">
          <h3 className="block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start">
            INVESTORS
          </h3>
          <span className=" text-sm">{investors} </span>
        </div>
        <div className="mt-4">
          <h3 className="block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start">
            RAISED FROM OTHER ECOSYSTEM
          </h3>
          <span className=" text-sm">{raised_from_other_ecosystem} </span>
        </div>
        <div className="mt-4">
          <h3 className="block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start">
            VALUATION
          </h3>
          <span className=" text-sm">{valuation} </span>
        </div>
        <div className="mt-4">
          <h3 className="block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start">
            TARGET AMOUNT
          </h3>
          <span className=" text-sm">{target_amount} </span>
        </div> */}
          <div className="mt-4">
            <h3 className="block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start">
              PROMOTIONAL VIDEO
            </h3>
            <span className=" text-sm">{promotional_video} </span>
          </div>

          <div className="mt-6">
            <div>
              <h3 className="block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start ">
                LINKS
              </h3>
              {links?.link.map((alllink, i) => {
                const icon = getSocialLogo(alllink);
                return (
                  <div key={i} className="flex items-center space-x-2">
                    {icon ? <a href={`${alllink}`}>{icon}</a> : ""}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscoverMentorDetail;

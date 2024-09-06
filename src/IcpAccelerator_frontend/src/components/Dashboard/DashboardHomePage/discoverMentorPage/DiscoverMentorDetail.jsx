import React, { useState, useCallback } from "react";
import org from "../../../../../assets/images/Org.png";
import uint8ArrayToBase64 from "../../../Utils/uint8ArrayToBase64";
import { LanguageIcon } from "../../../UserRegistration/DefaultLink";
import ArrowOutwardOutlinedIcon from "@mui/icons-material/ArrowOutwardOutlined";

import {
  FaLinkedin,
  FaTwitter,
  FaGithub,
  FaTelegram,
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaReddit,
  FaTiktok,
  FaSnapchat,
  FaWhatsapp,
  FaMedium,
} from "react-icons/fa";
import parse from "html-react-parser";
import Avatar from "@mui/material/Avatar";
const DiscoverMentorDetail = (projectDetails) => {
  const projectDetail = projectDetails?.projectDetails;
  console.log("projectdetails ", projectDetail);

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

  const getLogo = (url) => {
    try {
      const domain = new URL(url).hostname.split(".").slice(-2).join(".");
      const size = "text-2xl"; // Adjust size as needed
      const icons = {
        "linkedin.com": <FaLinkedin className={`text-blue-600 ${size}`} />,
        "twitter.com": <FaTwitter className={`text-blue-400 ${size}`} />,
        "github.com": <FaGithub className={`text-gray-700 ${size}`} />,
        "telegram.com": <FaTelegram className={`text-blue-400 ${size}`} />,
        "facebook.com": <FaFacebook className={`text-blue-400 ${size}`} />,
        "instagram.com": <FaInstagram className={`text-pink-950 ${size}`} />,
        "youtube.com": <FaYoutube className={`text-red-600 ${size}`} />,
        "reddit.com": <FaReddit className={`text-orange-500 ${size}`} />,
        "tiktok.com": <FaTiktok className={`text-black ${size}`} />,
        "snapchat.com": <FaSnapchat className={`text-yellow-400 ${size}`} />,
        "whatsapp.com": <FaWhatsapp className={`text-green-600 ${size}`} />,
        "medium.com": <FaMedium className={`text-black ${size}`} />,
      };
      return icons[domain] || <LanguageIcon />;
    } catch (error) {
      return <LanguageIcon />;
    }
  };

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
  return (
    <div className="bg-white shadow-lg rounded-lg w-full max-w-sm">
      <div className="bg-slate-200 p-6">
        <div className="flex justify-center">
          <img
            src={projectlogo}
            alt="Profile"
            className="rounded-lg w-24 h-24"
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
        <div className="mt-4">
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
        </div>
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
              const icon = getLogo(alllink);
              return (
                <div key={i} className="flex items-center space-x-2">
                  {icon ? <a href={`${alllink}`}>{icon}</a> : ""}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscoverMentorDetail;

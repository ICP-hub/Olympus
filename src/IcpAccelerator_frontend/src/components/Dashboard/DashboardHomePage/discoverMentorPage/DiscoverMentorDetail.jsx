import React, { useState } from "react";
import org from "../../../../../assets/images/Org.png";
import uint8ArrayToBase64 from "../../../Utils/uint8ArrayToBase64";
import { LanguageIcon } from "../../../UserRegistration/DefaultLink";
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
import parse from "html-react-parser";import Avatar from '@mui/material/Avatar';
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
  console.log("multi_chain_names",revenue);

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
          <button className="bg-blue-600 text-white font-normal text-sm py-2 px-12 rounded hover:bg-blue-700">
            Get in touch{" "}
            <span className="ml-3" aria-hidden="true">
              ↗️
            </span>
          </button>
        </div>
      </div>

      <div className="p-6 ">
        <div className="">
          <h3 className="text-gray-600 text-sm font-medium">ASSOCIATIONS</h3>
          <div className="flex items-center space-x-2">
      {associations.map((association, index) => (
        <div
          key={index}
          className="relative flex items-center transition-all duration-[600ms] ease-[cubic-bezier(0.25, 0.1, 0.25, 1)]"
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
          onTransitionEnd={handleTransitionEnd}
        >
          {/* Name appears on hover */}
          <span
            className={`absolute left-12 transition-all duration-[600ms] ease-[cubic-bezier(0.25, 0.1, 0.25, 1)] transform ${
              activeIndex === index
                ? 'translate-x-0 opacity-100 delay-[100ms]'
                : '-translate-x-4 opacity-0'
            }`}
          >
            {association.name}
          </span>

          {/* Main Avatar */}
          <Avatar
            src={association.imgSrc}
            className={`h-12 w-12 rounded-full transition-transform duration-[600ms] ease-[cubic-bezier(0.25, 0.1, 0.25, 1)] hover:scale-105 ${
              activeIndex === index ? 'mr-16 delay-[100ms]' : 'mr-0'
            }`}
          />
        </div>
      ))}
    </div>
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

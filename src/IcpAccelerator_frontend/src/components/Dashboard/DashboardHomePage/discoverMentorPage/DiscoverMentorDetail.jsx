import React, { useState } from "react";
import org from "../../../../../assets/images/Org.png";
import uint8ArrayToBase64 from "../../../Utils/uint8ArrayToBase64";
import { LanguageIcon } from "../../../UserRegistration/DefaultLink";
import { FaLinkedin, FaTwitter, FaGithub, FaTelegram, FaFacebook, FaInstagram, FaYoutube, FaReddit, FaTiktok, FaSnapchat, FaWhatsapp, FaMedium } from 'react-icons/fa';

const DiscoverMentorDetail = (projectDetails) => {

  const projectDetail = projectDetails?.projectDetails;
  console.log("projectdetails ", projectDetail);

  let full_name = projectDetail?.full_name;
  let bio = projectDetail?.project_description;
  let icphub = projectDetail?.preferred_icp_hub?.[0];
  let projectFocus = projectDetail?.project_area_of_focus;
  let regestrationType=projectDetail?.type_of_registration
  let links=projectDetail?.links?.[0]?.[0]
  console.log('Links ', links)


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
      return icons[domain] || <LanguageIcon/>;
    } catch (error) {
      return <LanguageIcon/>;
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
          <div className="flex gap-4 mt-2 ml-2">
            <img
              src="https://via.placeholder.com/40"
              alt="Association 1"
              className="rounded-full w-10 h-10 border-2 border-white shadow-lg -ml-3"
            />
            <img
              src="https://via.placeholder.com/40"
              alt="Association 2"
              className="rounded-full w-10 h-10 border-2 border-white shadow-lg -ml-3"
            />
            <img
              src="https://via.placeholder.com/40"
              alt="Association 3"
              className="rounded-full w-10 h-10 border-2 border-white shadow-lg -ml-3"
            />
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-gray-400 text-sm font-medium">
            Prefered Icp Hub
          </h3>
          <p className="text-sm mt-2">{icphub}</p>
        </div>

        <div className="mt-4">
          <h3 className="text-gray-400 text-sm font-medium">ABOUT</h3>
          <p className="text-sm mt-2">{bio} </p>
        </div>

        <div className="mt-4">
          <h3 className="text-gray-400 text-sm mb-2 font-medium">PROJECT FOCUS AREA</h3>
          {/* {projectFocus?.map((project) => (
            <span className="  border  px-3 py-1 rounded-full text-sm">
              {project}
            </span>
          ))} */}
           <span className="  border  px-3 py-1 rounded-full text-sm">
              {projectFocus}
            </span>
        </div>

        <div className="mt-4">
          <h3 className="text-gray-400 mb-2 text-sm font-medium">TYPE OF REGISTRATION</h3>
          <span className=" border   px-3 py-1 rounded-full text-sm">{regestrationType} </span>
        </div>

        <div className="mt-6">
          <div>
            <h3 className="text-gray-400 mb-2 text-sm font-medium ">
              LINKS
            </h3>
            {links?.link.map((alllink,i)=>{
               const icon = getLogo(alllink);
               return (
                <div key={i} className="flex items-center space-x-2">
                  {icon ? (
                    <a href={`${alllink}`}>
                      {icon}
                    </a>
                  ) : (
                    ""
                  )}
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

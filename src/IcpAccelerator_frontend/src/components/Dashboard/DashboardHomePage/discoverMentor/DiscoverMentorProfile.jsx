import React, { useState, useRef, useEffect } from "react";
import awtar from "../../../../../assets/images/icons/_Avatar.png";
import VerifiedIcon from "@mui/icons-material/Verified";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import ArrowOutwardOutlinedIcon from "@mui/icons-material/ArrowOutwardOutlined";
import uint8ArrayToBase64 from "../../../Utils/uint8ArrayToBase64";
import { LanguageIcon } from "../../../UserRegistration/DefaultLink";
import { FaLinkedin, FaTwitter, FaGithub, FaTelegram, FaFacebook, FaInstagram, FaYoutube, FaReddit, FaTiktok, FaSnapchat, FaWhatsapp, FaMedium } from 'react-icons/fa';

const DiscoverMentorProfile = ({mentorData}) => {

  const mentorProfile =mentorData?.[0]
  const mentorEvent=mentorData?.[1]
  console.log("mentorProfile",mentorProfile)
  console.log('mentorEvent',mentorEvent)

    
    const profilepic =
    mentorEvent?.params?.profile_picture && mentorEvent?.params?.profile_picture[0]
      ? uint8ArrayToBase64(mentorEvent?.params?.profile_picture[0])
      : "default-profile.png";

  const full_name = mentorEvent?.params?.full_name || "Unknown User";
  const email = mentorEvent?.params?.email || "N/A";
  const bio = mentorEvent?.params?.bio[0] || "No bio available.";
  const area_of_interest = mentorEvent?.params?.area_of_interest || "N/A";
  const location = mentorEvent?.params?.country || "Unknown Location";
  const openchat_username = mentorEvent?.params?.openchat_username ?? "username";
  let links=mentorEvent?.params?.social_links[0];
  console.log('Links ', links)

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

  const [activeTab,setActiveTab]=useState("general")

  const handleChange=(tab)=>{
    setActiveTab(tab)
  }
  
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
            {/* <span className="bg-[#F0F9FF] border border-[#B9E6FE] text-[#026AA2] px-1 py-1 rounded-md text-xs font-normal">
              FOUNDER
            </span> */}
            <span className="bg-[#F0F9FF] border border-[#B9E6FE] text-[#C5237C] px-1 py-1 rounded-md text-xs font-normal">
              MENTOR
            </span>
          </div>
        </div>
        {/* <div className="">
          <h3 className="font-semibold mb-2 text-xs text-gray-500 uppercase">
            Associations
          </h3>
          <div className="mb-2">
            <img src={"awtar"} alt="icon" />
          </div>
        </div> */}
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
          {/* <button
            className={`px-4 py-2 focus:outline-none font-medium  ${
              activeTab === "experties"
                ? "border-b-2 border-blue-500 text-blue-500 font-medium"
                : "text-gray-400"
            }`}
            onClick={() => handleChange("experties")}
          >
            Experties
          </button> */}
        </div>

        {activeTab === "general" ? (
          <div className=" px-1">
            <div className="mb-4  group relative hover:bg-gray-100 rounded-lg p-2 ">
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

           

            {/* About Section */}
            <div className="mb-4 group relative hover:bg-gray-100 rounded-lg p-1 ">
              <div className="flex justify-between">
                <h3 className="font-semibold mb-2 text-xs text-gray-500 uppercase">
                  About
                </h3>
              </div>
              <p className="text-sm">{bio}</p>
            </div>

            {/* Location Section */}
            <div className="mb-4 group relative hover:bg-gray-100 rounded-lg p-1 ">
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
            <div className="mb-4 group relative hover:bg-gray-100 rounded-lg p-1 ">
              <div className="flex justify-between">
                <h3 className="font-semibold mb-2 text-xs text-gray-500 uppercase">
                  Reasons to Join Platform
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {mentorEvent?.params?.reason_to_join[0]?.map((reason) => (
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
            <div className="mb-4 group relative hover:bg-gray-100 rounded-lg p-1">
              <div className="flex justify-between">
                <h3 className="font-semibold mb-2 text-xs text-gray-500 uppercase">
                 Area of Interests
                </h3>
              </div>
              {/* <div className="flex flex-wrap text-sm gap-2">
                {mentorEvent?.params?.area_of_interest}
              </div> */}
              <div className="flex flex-wrap gap-2">
                {mentorEvent?.params?.area_of_interest
  ?.split(',')
  .map((interest, index) => (
    <span
      key={index}
      className="border-2 border-gray-500 rounded-full text-gray-700 text-xs px-2 py-1"
    >
      {interest.trim()}
    </span>
  ))}
              </div>
            </div>

            {/* <div>
              <h3 className="font-semibold mb-2 text-xs text-gray-500 uppercase ">LINKS</h3>
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
            </div> */}
             <div>
                <h3 className="font-semibold mb-2 text-xs text-gray-500 uppercase">
                  LINKS
                </h3>
                <div className="flex flex-wrap gap-2">
                  {links?.map((linkObj, i) => 
                    linkObj.link?.map((link, index) => {
                      const icon = getLogo(link);
                      return (
                        <a key={index} href={link} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2">
                          {icon}
                        </a>
                      );
                    })
                  )}
                </div>
              </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  </div>
  )
}

export default DiscoverMentorProfile
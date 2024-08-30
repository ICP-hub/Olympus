import React, { useState, useRef, useEffect } from "react";
// import ProfileImage from "../../../../../assets/Logo/ProfileImage.png";
import edit from "../../../../../assets/Logo/edit.png";
import awtar from "../../../../../assets/images/icons/_Avatar.png";
import VerifiedIcon from "@mui/icons-material/Verified";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import ArrowOutwardOutlinedIcon from "@mui/icons-material/ArrowOutwardOutlined";
import Select from "react-select";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useCountries } from "react-countries";
import { useSelector } from "react-redux";
import uint8ArrayToBase64 from "../../../Utils/uint8ArrayToBase64";
import { LanguageIcon } from "../../../UserRegistration/DefaultLink";


// import { LanguageIcon } from "../UserRegistration/DefaultLink";
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

import { LinkedIn, GitHub, Telegram } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";

const DiscoverUserModal = ({ openDetail, setOpenDetail, userData }) => {
  console.log("user data =>", userData);

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

  useEffect(() => {
    if (openDetail) {
      // Prevent background from scrolling when modal is open
      document.body.style.overflow = "hidden";
    } else {
      // Restore background scroll when modal is closed
      document.body.style.overflow = "auto";
    }
    // Cleanup when the component is unmounted
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [openDetail]);

  const profilepic =
    userData.profile_picture && userData.profile_picture[0]
      ? uint8ArrayToBase64(userData.profile_picture[0])
      : "default-profile.png";
  console.log("userData", userData);
  console.log(userData?.social_links[0])
  const full_name = userData.full_name || "Unknown User";
  const email = userData.email || "N/A";
  const bio = userData.bio[0] || "No bio available.";
  const area_of_interest = userData.area_of_interest || "N/A";
  const location = userData.country || "Unknown Location";
  const openchat_username = userData.openchat_username ?? "username";
  const type_of_profile = userData.type_of_profile ?? "typeofprofile";

  return (
    <div
      className={`w-full h-screen fixed inset-0 bg-black bg-opacity-30 backdrop-blur-xs z-50 transition-opacity duration-[4000ms] ease-in-out ${
        openDetail ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      {openDetail && userData && (
        <div
          className={`mx-auto w-[30%] absolute right-0 top-0 bg-white h-screen transform transition-transform duration-[4000ms] ease-[cubic-bezier(0.4, 0, 0.2, 1)] ${
            openDetail ? "translate-x-0" : "translate-x-full"
          } z-20`}
        >
          <div className="p-2 mb-2">
            <CloseIcon
              sx={{ cursor: "pointer" }}
              onClick={() => setOpenDetail(false)}
            />
          </div>
          <div className="container  h-[calc(100%-50px)] ml-2 pb-8 overflow-y-auto">
            <div className="flex justify-center p-6">
              <div className="container  bg-white rounded-lg shadow-sm y overflow-hidden w-full max-w-[400px]">
                <div className="p-6 bg-gray-100">
                  <img
                    src={profilepic}
                    alt="Matt Bowers"
                    className="w-24 h-24 mx-auto rounded-full mb-2"
                  />
                  <div className="flex items-center justify-center mb-1">
                    <VerifiedIcon
                      className="text-blue-500 mr-1"
                      fontSize="small"
                    />
                    <h2 className="text-xl font-semibold">{full_name}</h2>
                  </div>
                  <p className="text-gray-600 text-center mb-2">
                    {openchat_username}{" "}
                  </p>
                  <a
                    href={`mailto:${email}`}
                    className="w-full h-[#155EEF] bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 mb-6 flex items-center justify-center"
                  >
                    Get in touch
                    <ArrowOutwardOutlinedIcon
                      className="ml-1"
                      fontSize="small"
                    />
                  </a>
                </div>

                <div className="p-6 bg-white">
                  <div className="mb-2">
                    <h3 className="font-semibold mb-2 text-xs text-gray-500 uppercase">
                      Roles
                    </h3>
                    <div className="flex space-x-2">
                      <span className="bg-[#F0F9FF] border border-[#B9E6FE] text-[#026AA2] px-1 py-1 rounded-md text-xs font-normal">
                        OLYMPIAN
                      </span>
                    </div>
                  </div>
                  <hr />

                  <div className=" ">
                    <div className="mb-2 group relative hover:bg-gray-100 rounded-lg p-2 ">
                      <h3 className="font-semibold mb-2 text-xs text-gray-500 uppercase">
                        Email
                      </h3>

                      <div className="flex items-center">
                        <p className="mr-2 text-sm">{email}</p>
                        <VerifiedIcon
                          className="text-blue-500 mr-2 w-2 h-2"
                          fontSize="small"
                        />
                        <span className="bg-[#F8FAFC] border border-[#E3E8EF] text-[#364152] px-2 py-0.5 rounded text-xs">
                          HIDDEN
                        </span>
                      </div>
                    </div>

                    {/* About Section */}
                    <div className="mb-2 group relative hover:bg-gray-100 rounded-lg p-2 ">
                    <h3 className="font-semibold mb-2 text-xs text-gray-500 uppercase">
                        About
                      </h3>
                      <div>
                        <p className="text-sm line-clamp-3 hover:line-clamp-6">{bio}</p>
                      </div>
                    </div>
                    <div className="mb-2 group relative hover:bg-gray-100 rounded-lg p-2 ">
                    <h3 className="font-semibold mb-2 text-xs text-gray-500 uppercase">
                        Type of Profile
                      </h3>

                      <div className="flex items-center">
                        <p className="border-2 border-gray-500 rounded-full text-gray-700 text-xs px-3 py-1 bg-gray-100">{type_of_profile}</p>
                      </div>
                    </div>
                    <div className="mb-2 group relative hover:bg-gray-100 rounded-lg p-2 ">
                      <h3 className="font-semibold mb-2 text-xs text-gray-500 uppercase">
                        Reason to Join Platform
                      </h3>
                      <div>
                        <div className="flex flex-wrap gap-2">
                          {userData?.reason_to_join[0].map((reason, index) => (
                            <span
                              key={index}
                              className="border-2 border-gray-500 rounded-full text-gray-700 text-xs px-3 py-1 bg-gray-100"
                            >
                              {reason}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="mb-2 group relative hover:bg-gray-100 rounded-lg p-2 ">
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

                    {/* Location Section */}
                    <div className="mb-2 group relative hover:bg-gray-100 rounded-lg p-2 ">
                    <h3 className="font-semibold mb-2 text-xs text-gray-500 uppercase">
                        Location
                      </h3>
                      <div className="flex gap-2">
                        <PlaceOutlinedIcon
                          sx={{ fontSize: "medium", marginTop: "3px" }}
                        />
                        <p className="text-sm">{location}</p>
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
                          {userData?.social_links[0]
                            ? userData?.social_links[0]?.map(
                                (link, i) => {
                                  const icon = getLogo(link);
                                  return (
                                    <div
                                      key={i}
                                      className="flex items-center space-x-2"
                                    >
                                      {icon ? icon : ""}
                                    </div>
                                  );
                                }
                              )
                            : ""}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscoverUserModal;

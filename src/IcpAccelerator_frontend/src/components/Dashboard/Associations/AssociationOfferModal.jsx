import React, { useEffect } from "react";
import VerifiedIcon from "@mui/icons-material/Verified";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import ArrowOutwardOutlinedIcon from "@mui/icons-material/ArrowOutwardOutlined";
import uint8ArrayToBase64 from "../../Utils/uint8ArrayToBase64";

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
import { LanguageIcon } from "../../UserRegistration/DefaultLink";

const AssociationOfferModal = ({ openDetail, setOpenDetail, user }) => {
  console.log("user data =>", user);

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
      return icons[domain] || "";
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

  let projectImage = user?.project_info?.project_logo[0]
    ? uint8ArrayToBase64(user?.project_info?.project_logo[0])
    : "../../../assets/Logo/CypherpunkLabLogo.png";

  let projectName = user?.project_info?.project_name ?? "projectName";

  let profile = user?.project_info?.user_data?.profile_picture[0]
    ? uint8ArrayToBase64(user?.project_info?.user_data?.profile_picture[0])
    : "../../../assets/Logo/CypherpunkLabLogo.png";

  let userName = user?.project_info?.user_data?.full_name ?? "Fullname";

  let openchat_name =
    user?.project_info?.user_data?.openchat_username[0] ?? "username";

  let userEmail =
    user?.project_info?.user_data?.email[0] ?? "email@example.com";

  let userCountry = user?.project_info?.user_data?.country ?? "Country";

  let userBio = user?.project_info?.user_data?.bio[0] ?? "Bio not available";

  let userAreaOfInterest =
    user?.project_info?.user_data?.area_of_interest ?? "Area of Interest";

  let userReasonToJoin =
    user?.project_info?.user_data?.reason_to_join[0] ??
    "Reason to join not available";
  let socialLinks =
    user?.project_info?.user_data?.social_links ?? "No social links available";

  let projectDescription =
    user?.project_info?.project_description[0] ??
    "Project description not available";
  let projectId = user?.project_info?.project_id ?? "projectId";
  let offer = user?.offer ?? "offer";
  let sentAt = user?.sent_at ?? 0n;

  return (
    <div
      className={`w-full h-screen fixed inset-0 bg-black bg-opacity-30 backdrop-blur-xs z-50 transition-opacity duration-[4000ms] ease-in-out ${
        openDetail ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      {openDetail && user && (
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
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <img
                      src={profile}
                      alt="Matt Bowers"
                      className="absolute w-24 h-24 rounded-full backface-hidden transition-transform duration-500 transform hover:rotate-y-180"
                    />
                    <img
                      src={projectImage}
                      alt="Matt Bowers"
                      className="absolute w-24 h-24 rounded-full backface-hidden transition-transform duration-500 transform rotate-y-180 hover:rotate-y-0"
                    />
                  </div>

                  <div className="flex items-center justify-center mb-1">
                    <VerifiedIcon
                      className="text-blue-500 mr-1"
                      fontSize="small"
                    />
                    <h2 className="text-xl font-semibold">{userName}</h2>
                  </div>
                  <p className="text-gray-600 text-center mb-4">
                    {openchat_name}{" "}
                  </p>
                  <a
                    href={`mailto:${userEmail}`}
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
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2 text-xs text-gray-500 uppercase">
                      Roles
                    </h3>
                    <div className="flex space-x-2">
                      <span className="bg-[#F0F9FF] border border-[#B9E6FE] text-[#026AA2] px-1 py-1 rounded-md text-xs font-normal">
                        {projectId ? "Project" : "User"}
                      </span>
                    </div>
                  </div>
                  <hr />

                  <div className=" ">
                    <div className="mb-4 group relative hover:bg-gray-100 rounded-lg p-2 ">
                      <h3 className="font-semibold mb-2 text-xs text-gray-500 uppercase">
                        Email
                      </h3>

                      <div className="flex items-center">
                        <p className="mr-2 text-sm">{userEmail}</p>
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
                    <div className="mb-4 group relative hover:bg-gray-100 rounded-lg p-1 ">
                      <h3 className="font-semibold mb-2 text-xs text-gray-500 uppercase">
                        About
                      </h3>
                      <div>
                        <p className="text-sm overflow-hidden line-clamp-2 text-ellipsis max-h-[1.75rem]">{userBio}</p>
                      </div>
                    </div>

                    <div className="mb-4 group relative hover:bg-gray-100 rounded-lg p-1 ">
                      <h3 className="font-semibold mb-2 text-xs text-gray-500 uppercase">
                        Reason to Join Platform
                      </h3>
                      <div>
                        <div className="flex flex-wrap gap-2">
                          {userReasonToJoin.map((reason) => (
                            <span
                              key={reason}
                              className="border-2 border-gray-500 rounded-full text-gray-700 text-xs px-2 py-1 "
                            >
                              {reason}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Location Section */}
                    <div className="mb-4 group relative hover:bg-gray-100 rounded-lg p-1 ">
                      <h3 className="font-semibold mb-2 text-xs text-gray-500 uppercase">
                        Location
                      </h3>
                      <div className="flex gap-4">
                        <PlaceOutlinedIcon
                          sx={{ fontSize: "medium", marginTop: "3px" }}
                        />
                        <p className="text-sm">{userCountry}</p>
                      </div>
                    </div>

                    <div>
                      {socialLinks && (
                        <h3 className="mb-2 text-xs text-gray-500 font-medium ">
                          LINKS
                        </h3>
                      )}

                      <div className="flex items-center ">
                        <div className="flex gap-3">
                          {socialLinks
                            ? socialLinks?.map((link, i) => {
                                const icon = getLogo(link);
                                return (
                                  <div
                                    key={i}
                                    className="flex items-center space-x-2"
                                  >
                                    {icon ? icon : ""}
                                  </div>
                                );
                              })
                            : ""}
                        </div>
                      </div>
                      <div className="my-2 group relative hover:bg-gray-100 rounded-lg p-1 ">
                      <h3 className="font-semibold mb-2 text-xs text-gray-500 uppercase">
                        Proposed By {userName}
                      </h3>
                      <div>
                        <p className="text-sm overflow-hidden line-clamp-2 text-ellipsis max-h-[1.75rem]">{offer}</p>
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

export default AssociationOfferModal;

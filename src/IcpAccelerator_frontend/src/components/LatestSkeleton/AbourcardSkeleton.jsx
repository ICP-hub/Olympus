import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useNavigate } from "react-router-dom";
import "react-loading-skeleton/dist/skeleton.css";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import MailOutlinedIcon from "@mui/icons-material/MailOutlined";
import { LanguageIcon } from "../UserRegistration/DefaultLink";
import { FaLinkedin, FaTwitter, FaGithub, FaTelegram, FaFacebook, FaInstagram, FaYoutube, FaReddit, FaTiktok, FaSnapchat, FaWhatsapp, FaMedium } from 'react-icons/fa';
import { useFormContext, useFieldArray } from "react-hook-form";

export const AboutcardSkeleton = (getAllData) => {

  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "links",
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

  const navigate = useNavigate();
  console.log("getvalues", getAllData);

  return (
   
          <SkeletonTheme baseColor="#e3e3e3" highlightColor="#c8c8c873"> 
          <div className="w-1/2 bg-gradient-to-r from-[#ECE9FE] to-[#FFFFFF] items-center justify-center rounded-r-2xl">
        <div className="bg-white mx-auto my-10 rounded-lg shadow-md w-3/4">
          <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4 dark:bg-gray-700">
            <div
              className="bg-green-500 h-1.5 rounded-full dark:bg-gray-700"
              style={{ width: "20%" }}
            ></div>
          </div>
          <div className="p-6">
            <div className="flex flex-col items-center">
              <div className="bg-gray-200 rounded-full p-4 mb-4">
                <svg
                  className="w-9 h-9 text-gray-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
              {getAllData?.getAllData?.full_name ? (
                <h2 className="text-xl font-medium">
                  {getAllData?.getAllData?.full_name}
                </h2>
              ) : (
                <h2 className="text-xl font-medium">
                  <Skeleton height={25} width={160} className="rounded-3xl" />
                </h2>
              )}
              {getAllData?.getAllData?.openchat_user_name ? (
                <h2 className="text-lg font-normal">
                  {getAllData?.getAllData?.openchat_user_name}
                </h2>
              ) : (
                <span className="">
                  <Skeleton height={20} width={130} className="rounded-3xl" />
                </span>
              )}
            </div>
            <div className="mt-6">
              <div my-2>
                <label className="block font-medium text-gray-600 pb-2">
                  Roles
                </label>
                <span className="bg-[#EFF4FF] text-blue-600 border border-blue-300 rounded-lg px-4 pb-1 font-semibold">
                  Olympian
                </span>
              </div>
              <div className="mt-4">
                <label className="block font-medium text-gray-600 pb-1">
                  <MailOutlinedIcon
                    sx={{
                      fontSize: "lage",
                      marginTop: "-4px",
                      marginRight: "5px",
                    }}
                  />
                  Email
                </label>
                {getAllData?.getAllData?.email ? (
                  <h2 className="text-base font-normal">
                    {getAllData?.getAllData?.email}
                  </h2>
                ) : (
                  <Skeleton height={20} width="full" className="rounded-3xl" />
                )}
              </div>
              <div className="mt-3">
                <label className="block font-medium text-gray-600 pb-1">
                  About
                </label>
                {getAllData?.getAllData?.bio ? (
                  <p className="text-base font-normal">
                    {getAllData?.getAllData?.bio}
                  </p>
                ) : (
                  <>
                    <Skeleton
                      height={20}
                      width="full"
                      className="rounded-3xl"
                    />
                    <Skeleton height={20} width={150} className="rounded-3xl" />
                  </>
                )}
              </div>
              <label className="block mt-3 font-medium text-gray-600">
                Reason to join Platform
              </label>
              {getAllData?.getAllData?.reasons_to_join_platform ? (
                <p className="text-base font-normal mb-0">
                  {getAllData?.getAllData?.reasons_to_join_platform}
                </p>
              ) : (
                <div className="flex space-x-2">
                  <Skeleton height={25} width={80} className="rounded-3xl" />
                  <Skeleton height={25} width={80} className="rounded-3xl" />
                </div>
              )}
              <label className="block mt-3 font-medium text-gray-600">
                Interests
              </label>
              {getAllData?.getAllData?.area_of_interest ? (
                <p className="text-base font-normal">
                  {getAllData?.getAllData?.area_of_interest}
                </p>
              ) : (
                <div className="flex space-x-2">
                  <Skeleton height={25} width={80} className="rounded-3xl" />
                  <Skeleton height={25} width={80} className="rounded-3xl" />
                </div>
              )}
              <div className="mt-4">
                <label className="block font-medium text-gray-600 pb-1">
                  <LocationOnOutlinedIcon
                    sx={{
                      fontSize: "lage",
                      marginRight: "5px",
                      marginTop: "-4px",
                    }}
                  />
                  Location
                </label>
                {getAllData?.getAllData?.country ? (
                  <p className="text-base font-normal">
                    {getAllData?.getAllData?.country}
                  </p>
                ) : (
                  <div>
                    <Skeleton
                      height={20}
                      width="full"
                      className="rounded-3xl"
                    />
                  </div>
                )}
                <label className="block mb-2 font-medium text-gray-600 mt-3">
                  Links
                </label>
                <div className="flex gap-3">
                {getAllData?.getAllData?.links ? (
                  getAllData?.getAllData?.links?.map((link, i) => {
                    const icon = getLogo(link.link);
                    return (
                      <div key={i} className="flex items-center space-x-2">
                        {icon ? (
                          icon
                        ) : (
                          <Skeleton height={30} width={30} circle="true" />
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="flex space-x-2">
                    <div className="rounded-full flex items-center justify-center">
                      <Skeleton height={30} width={30} circle="true" />
                    </div>
                    <div className="rounded-full flex items-center justify-center">
                      <Skeleton height={30} width={30} circle="true" />

                      <Skeleton height={30} width={30} circle="true" />
                    </div>
                  </div>
                )}
                </div>
              </div>
            </div>
            </div>
          </div>
  </div>
    </SkeletonTheme>
  );
};

export default AboutcardSkeleton;

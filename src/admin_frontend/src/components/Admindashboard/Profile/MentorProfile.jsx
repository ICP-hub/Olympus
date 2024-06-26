import React, { useState, useEffect } from "react";
import "react-circular-progressbar/dist/styles.css";
import {
  place,
  place1,
  Profile2,
  telegramSVg,
  websiteSvg,
} from "../../Utils/AdminData/SvgData";
import {
  numberToDate,
  uint8ArrayToBase64,
} from "../../Utils/AdminData/saga_function/blobImageToUrl";
import { useSelector } from "react-redux";
import { Principal } from "@dfinity/principal";
import { ThreeDots } from "react-loader-spinner";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { mentorDeclinedRequest } from "../../AdminStateManagement/Redux/Reducers/mentorDeclined";
import { mentorApprovedRequest } from "../../AdminStateManagement/Redux/Reducers/mentorApproved";
import openchat_username from "../../../../assets/image/spinner.png";
import { linkedInSvg } from "../../../../../IcpAccelerator_frontend/src/components/Utils/Data/SvgData";
import { twitterSvg } from "../../../../../IcpAccelerator_frontend/src/components/Utils/Data/SvgData";
import { noDataPresentSvg } from "../../Utils/AdminData/SvgData";
import { Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
const MentorProfile = ({ userData, Allrole, principal, currentRole }) => {
  const actor = useSelector((currState) => currState.actors.actor);

  const [current, setCurrent] = useState("user");
  const [isAccepting, setIsAccepting] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);
  const [isSkillsOpen, setIsSkillsOpen] = useState(false);
  const [isReasonToJoinOpen, setIsReasonToJoinOpen] = useState(false);
  // const navigate = useNavigate();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // console.log("userData in mentor profile", userData);
  console.log("Allrole in mentor profile", Allrole);

  useEffect(() => {
    const requestedRole = Allrole?.role?.find(
      (role) => role.status === "requested"
    );
    if (requestedRole) {
      setCurrent(requestedRole.name.toLowerCase());
    } else {
      setCurrent("user");
    }
  }, [Allrole.role]);

  const getButtonClass = (status) => {
    switch (status) {
      case "active":
        return "bg-[#A7943A]";
      case "requested":
        return "bg-[#e55711]";
      case "approved":
        return "bg-[#0071FF]";
      default:
        return "bg-[#FF3A41]";
    }
  };

  function constructMessage(role) {
    let baseMessage = `This User's ${
      role.name.charAt(0).toUpperCase() + role.name.slice(1)
    } Profile `;

    if (
      role.status === "active" &&
      role.approved_on &&
      role.approved_on.length > 0
    ) {
      baseMessage += `was approved on ${numberToDate(role.approved_on[0])}`;
    } else if (
      role.status === "approved" &&
      role.approved_on &&
      role.approved_on.length > 0
    ) {
      baseMessage += `was approved on ${numberToDate(role.approved_on[0])}`;
    } else if (
      role.status === "requested" &&
      role.requested_on &&
      role.requested_on.length > 0
    ) {
      baseMessage += `request was made on ${numberToDate(
        role.requested_on[0]
      )}`;
    } else if (
      role.status === "rejected" &&
      role.rejected_on &&
      role.rejected_on.length > 0
    ) {
      baseMessage += `was rejected on ${numberToDate(role.rejected_on[0])}`;
    } else {
      baseMessage += `is currently in the '${role.status}' status without a specific date.`;
    }

    return baseMessage;
  }

  const declineUserRoleHandler = async (
    principal,
    boolean,
    state,
    category
  ) => {
    setIsDeclining(true);
    try {
      const covertedPrincipal = await Principal.fromText(principal);
      switch (category) {
        case "mentor":
          if (state === "Pending") {
            await actor.decline_mentor_creation_request_candid(
              covertedPrincipal,
              boolean
            );
            await dispatch(mentorDeclinedRequest());
          }
          break;
        default:
          console.warn("Unhandled category:", category);
      }
    } catch (error) {
      console.error("Error processing request:", error);
    } finally {
      setIsDeclining(false);
      window.location.reload();
    }
  };

  const allowUserRoleHandler = async (principal, boolean, state, category) => {
    setIsAccepting(true);
    try {
      const covertedPrincipal = await Principal.fromText(principal);
      switch (category) {
        case "mentor":
          if (state === "Pending") {
            await actor.approve_mentor_creation_request_candid(
              covertedPrincipal,
              boolean
            );
            await dispatch(mentorApprovedRequest());
          }
          break;
        default:
          console.warn("Unhandled category:", category);
      }
    } catch (error) {
      console.error("Error processing request:", error);
    } finally {
      setIsAccepting(false);
      window.location.reload();
    }
  };

  // console.log("userData[0].profile:", userData[0].profile);

  const date = numberToDate(Allrole[2].requested_on[0]);
  const profile = uint8ArrayToBase64(
    userData[0].profile.user_data.profile_picture[0]
  );
  return (
    <>
      <div className="w-full flex flex-col">
        <div className="w-full flex gap-4 sxxs:flex-col md:flex-row">
          <div className=" bg-[#D2D5F2]  shadow-md shadow-gray-400 p-6 rounded-lg md:w-1/4 sxxs:w-full">
            <div className="justify-center flex items-center">
              <div
                className="size-fit  rounded-full bg-no-repeat bg-center bg-cover relative p-1 bg-blend-overlay border-2 border-gray-300"
                style={{
                  backgroundImage: `url(${profile}), linear-gradient(168deg, rgba(255, 255, 255, 0.25) -0.86%, rgba(255, 255, 255, 0) 103.57%)`,
                  backdropFilter: "blur(20px)",
                }}
              >
                <img
                  className="object-cover size-44 max-h-44 rounded-full"
                  src={profile}
                  alt=""
                />
              </div>
            </div>

            <div className="flex flex-col ml-4  mt-2 w-auto justify-start md:mb-0 mb-6">
              <div className="flex flex-row  gap-4 items-center">
                <h1 className="md:text-[21px] text-xl md:font-bold font-bold  bg-black text-transparent bg-clip-text">
                  {userData[0].profile.user_data.full_name}
                </h1>
                <div className="text-xs border-2 rounded-2xl px-2 py-1 font-bold bg-[#c9c5c5]">
                  {current.charAt(0).toUpperCase() + current.slice(1)}
                </div>
              </div>
              {userData[0].profile.user_data.email[0] && (
                <div className="text-gray-500 md:text-md text-sm font-normal flex mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    className="size-4 "
                    fill="currentColor"
                  >
                    <path d="M256 64C150 64 64 150 64 256s86 192 192 192c17.7 0 32 14.3 32 32s-14.3 32-32 32C114.6 512 0 397.4 0 256S114.6 0 256 0S512 114.6 512 256v32c0 53-43 96-96 96c-29.3 0-55.6-13.2-73.2-33.9C320 371.1 289.5 384 256 384c-70.7 0-128-57.3-128-128s57.3-128 128-128c27.9 0 53.7 8.9 74.7 24.1c5.7-5 13.1-8.1 21.3-8.1c17.7 0 32 14.3 32 32v80 32c0 17.7 14.3 32 32 32s32-14.3 32-32V256c0-106-86-192-192-192zm64 192a64 64 0 1 0 -128 0 64 64 0 1 0 128 0z" />
                  </svg>
                  <span className="ml-2 truncate">
                    {userData[0].profile.user_data.email[0]}
                  </span>
                </div>
              )}
              <div className="flex flex-col items-start gap-3 text-sm">
                <div className="flex flex-row  text-gray-600 space-x-2">
                  {place1}
                  <p className="underline">
                    {userData[0].profile.user_data.country}
                  </p>
                </div>
                <div className=" flex flex-row space-x-2 text-gray-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                    className="size-4"
                    fill="currentColor"
                  >
                    <path d="M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H64C28.7 64 0 92.7 0 128v16 48V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V192 144 128c0-35.3-28.7-64-64-64H344V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H152V24zM48 192H400V448c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192z" />
                  </svg>
                  <p className="ml-2 truncate">
                    {Allrole[2]?.requested_on?.length > 0
                      ? date
                      : "No requested date"}
                  </p>
                </div>

                {userData[0].profile.user_data.openchat_username[0] && (
                  <div className="flex flex-row space-x-2 text-gray-600">
                    <img
                      src={openchat_username}
                      alt="openchat_username"
                      className="size-4"
                    />
                    <p className="ml-2">
                      {userData[0].profile.user_data.openchat_username[0]}
                    </p>
                  </div>
                )}

                <div className=" flex flex-col w-full text-gray-600">
                  <div className="flex flex-row justify-between items-center">
                    <p className="text-black font-semibold mb-1">Skill :</p>
                    <button
                      onClick={() => setIsSkillsOpen(!isSkillsOpen)}
                      className="flex items-center gap-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="size-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        {isSkillsOpen ? (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 15l7-7 7 7"
                          />
                        ) : (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 9l-7 7-7-7"
                          />
                        )}
                      </svg>
                    </button>
                  </div>

                  {isSkillsOpen && (
                    <div className="flex flex-col text-gray-600">
                      <div className="flex gap-2 text-xs flex-wrap items-center">
                        {userData[0].profile.user_data.area_of_interest
                          .split(",")
                          .slice(0, 3)
                          .map((tag, index) => (
                            <div
                              key={index}
                              className="text-xs border-2 rounded-2xl px-2 py-1 font-bold bg-[#c9c5c5]"
                            >
                              {tag.trim()}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className=" flex flex-col w-full text-gray-600">
                  <div className="flex flex-row justify-between items-center">
                    <p className="text-black font-semibold mb-1">
                      Reason to join :
                    </p>
                    <button
                      onClick={() => setIsReasonToJoinOpen(!isReasonToJoinOpen)}
                      className="flex items-center gap-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="size-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        {isReasonToJoinOpen ? (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 15l7-7 7 7"
                          />
                        ) : (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 9l-7 7-7-7"
                          />
                        )}
                      </svg>
                    </button>
                  </div>

                  {isReasonToJoinOpen && (
                    <div className="flex flex-col text-gray-600">
                      <div className="flex gap-2 break-all text-xs flex-wrap items-center">
                        {userData[0].profile.user_data.reason_to_join[0].map(
                          (tag, index) => (
                            <div
                              key={index}
                              className="text-xs border-2 rounded-2xl px-2 py-1 font-bold bg-[#c9c5c5]"
                            >
                              {tag.trim()}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className=" bg-[#D2D5F2] shadow-md shadow-gray-400 p-6 rounded-lg md:w-[74%] sxxs:w-full">
            {/* <div className=" bg-[#D2D5F2] shadow-md shadow-gray-400 p-6 rounded-lg "> */}
            <div className="flex w-full mb-4">
              <Swiper
                modules={[Pagination, Autoplay]}
                centeredSlides={true}
                loop={Allrole && Allrole.length > 1}
                autoplay={{
                  delay: 2500,
                  disableOnInteraction: false,
                }}
                spaceBetween={30}
                slidesPerView="auto"
                slidesOffsetAfter={100}
                breakpoints={{
                  640: {
                    slidesPerView: 1,
                  },
                  768: {
                    slidesPerView: 1,
                  },
                  1024: {
                    slidesPerView: 1,
                  },
                }}
              >
                {Allrole &&
                  Allrole.length > 0 &&
                  Allrole.filter(
                    (role) =>
                      role.approved_on[0] ||
                      role.rejected_on[0] ||
                      role.requested_on[0]
                  ).map((role, index) => (
                    <SwiperSlide key={index}>
                      <div
                        key={index}
                        className="flex justify-around items-center w-full"
                      >
                        <button
                          className={`flex p-2 items-center w-full ${getButtonClass(
                            role.status
                          )} rounded-md `}
                        >
                          <div className="xl:lg:ml-4">{Profile2}</div>
                          <p className="flex justify-center items-center text-white p-2 text-sm ">
                            {constructMessage(role)}
                          </p>
                        </button>
                      </div>
                    </SwiperSlide>
                  ))}
              </Swiper>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">About Mentor</h1>
            <div className="text-gray-600 md:text-sm text-xs break-all line-clamp-6 my-3 px-[4%]">
              {userData[0]?.profile?.user_data?.bio[0] ? (
                userData[0]?.profile?.user_data?.bio[0]
              ) : (
                <p className="flex items-center">
                  {noDataPresentSvg}
                  <span className="ml-2">No Data</span>
                </p>
              )}
            </div>

            <div className="pl-[4%]">
              <p className="w-full mb-4 border border-[#C5C5C5]"></p>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start gap-3 text-sm w-full md:px-[4%]">
              <div className="flex flex-col md:w-1/2 w-full">
                <div className="flex flex-col mb-4 md:mb-6">
                  <h2 className="text-lg font-bold text-gray-800 mb-2 sm:mb-0 mr-2">
                    Telegram:
                  </h2>
                  <div className="flex flex-grow items-start mt-1.5 truncate">
                    {userData[0]?.profile?.user_data?.telegram_id[0] ? (
                      <div
                        onClick={() => {
                          const telegramUsername =
                            userData[0]?.profile?.user_data?.telegram_id[0];
                          if (telegramUsername) {
                            const telegramUrl = `https://t.me/${telegramUsername}`;
                            window.open(telegramUrl, "_blank");
                          }
                        }}
                        className="cursor-pointer mr-2"
                      >
                        {telegramSVg}
                      </div>
                    ) : (
                      <div className="flex-shrink-0 w-6 h-6 mr-2">
                        {noDataPresentSvg}
                      </div>
                    )}

                    <p className="text-[#7283EA] text-xs md:text-sm truncate">
                      {userData[0]?.profile?.user_data?.telegram_id[0] ||
                        "Not available"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col mb-4 md:mb-6">
                  <h2 className="text-lg font-bold text-gray-800 mb-2 sm:mb-0 mr-2">
                    Twitter:
                  </h2>
                  <div className="flex flex-grow mt-1.5 truncate items-start">
                    {userData[0]?.profile?.user_data?.twitter_id[0] ? (
                      <div
                        onClick={() => {
                          const url =
                            userData[0]?.profile?.user_data?.twitter_id[0];
                          window.open(url, "_blank");
                        }}
                        className="cursor-pointer mr-2"
                      >
                        {twitterSvg}
                      </div>
                    ) : (
                      <div className="flex-shrink-0 w-6 h-6 mr-1">
                        {noDataPresentSvg}
                      </div>
                    )}

                    <p className="text-[#7283EA] text-xs  md:text-sm truncate">
                      {userData[0]?.profile?.user_data?.twitter_id[0] ||
                        "Not available"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:w-1/2 w-full">
                <div className="flex flex-col mb-4 md:mb-6">
                  <h2 className="text-lg font-bold text-gray-800 mb-2 sm:mb-0 mr-2">
                    Website:
                  </h2>
                  <div className="flex flex-grow mt-1.5 truncate items-start">
                    {userData[0]?.profile?.website[0] ? (
                      <div
                        onClick={() => {
                          const url = userData[0]?.profile?.website[0];
                          window.open(url, "_blank");
                        }}
                        className="cursor-pointer mr-2"
                      >
                        {websiteSvg}
                      </div>
                    ) : (
                      <div className="flex-shrink-0 w-6 h-6 mr-1">
                        {noDataPresentSvg}
                      </div>
                    )}

                    <p className="text-[#7283EA] text-xs  md:text-sm truncate">
                      {userData[0]?.profile?.website[0] || "Not available"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col mb-4 md:mb-6">
                  <h2 className="text-lg font-bold text-gray-800 mb-2 sm:mb-0 ">
                    LinkedIn:
                  </h2>
                  <div className="flex flex-grow mt-1.5 truncate items-start">
                    {userData[0]?.params?.linkedin_id ? (
                      <div
                        onClick={() => {
                          const url = userData[0]?.params?.linkedin_id;
                          window.open(url, "_blank");
                        }}
                        className="cursor-pointer mr-2"
                      >
                        {linkedInSvg}
                      </div>
                    ) : (
                      <div className="flex-shrink-0 w-6 h-6 mr-1">
                        {noDataPresentSvg}
                      </div>
                    )}

                    <p className="text-[#7283EA] text-xs  md:text-sm truncate">
                      {userData[0]?.params?.linkedin_id || "Not available"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full flex gap-4 sxxs:flex-col md:flex-row mt-4">
          <div className="flex flex-col  w-full   md:w-[26%] sxxs:w-full"></div>
          <div className="flex flex-row justify-between bg-[#D2D5F2] shadow-md shadow-gray-400 p-6 rounded-lg md:w-3/4 sxxs:w-fulll">
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full ">
              <li className="list-disc ml-4 md:ml-12">
                <div className=" flex flex-col text-gray-600">
                  <p className="text-black font-semibold mb-1">
                    Support Multichain :
                  </p>

                  <div className="flex gap-2 text-xs items-center overflow-y-scroll h-14 flex-wrap">
                    {userData[0]?.profile?.multichain?.[0] &&
                    userData[0].profile.multichain[0] !== "" ? (
                      userData[0]?.profile?.multichain?.[0]
                        .split(",")
                        // .slice(0, 3)
                        .map((tag, index) => (
                          <div
                            key={index}
                            className="text-xs border-2 rounded-2xl px-2 py-1 font-bold bg-[#c9c5c5]"
                          >
                            {tag.trim()}
                          </div>
                        ))
                    ) : (
                      <div className="flex items-center">
                        {noDataPresentSvg}
                        <span className="ml-2 text-xs">No Data</span>
                      </div>
                    )}
                  </div>
                </div>
              </li>

              <li className="list-disc ">
                <div className=" flex flex-col text-gray-600">
                  <p className="text-black font-semibold mb-1">
                    Area Of Expertise :
                  </p>

                  <div className="flex gap-2 text-xs items-center overflow-y-scroll h-14 flex-wrap">
                    {userData[0]?.profile?.user_data?.area_of_interest &&
                    userData[0].profile.user_data.area_of_interest !== "" ? (
                      userData[0]?.profile?.user_data?.area_of_interest
                        .split(",")
                        // .slice(0, 3)
                        .map((tag, index) => (
                          <div
                            key={index}
                            className="text-xs border-2 rounded-2xl px-2 py-1 font-bold bg-[#c9c5c5]"
                          >
                            {tag.trim()}
                          </div>
                        ))
                    ) : (
                      <div className="flex items-center">
                        {noDataPresentSvg}
                        <span className="ml-2 text-xs">No Data</span>
                      </div>
                    )}
                  </div>
                </div>
              </li>

              <li className="list-disc ml-4 md:ml-12">
                <div className="flex flex-col items-start justify-start sm:text-left ">
                  <h2 className=" font-semibold text-gray-800 mb-2 sm:mb-0 mr-2">
                    How many Years of Mentoring ?
                  </h2>
                  <div className="flex flex-grow truncate text-xs">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                      className="size-4"
                      fill="currentColor"
                    >
                      <path d="M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H64C28.7 64 0 92.7 0 128v16 48V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V192 144 128c0-35.3-28.7-64-64-64H344V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H152V24zM48 192H400V448c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192z" />
                    </svg>
                    <p className="text-gray-600 text-xs truncate ml-2">
                      {userData[0].profile.years_of_mentoring ? (
                        <span>{userData[0].profile.years_of_mentoring}</span>
                      ) : (
                        <span className="flex items-center">
                          {noDataPresentSvg}
                          No Data
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </li>
              <li className="list-disc ">
                <div className="flex flex-col items-start justify-start sm:text-left">
                  <h2 className=" font-semibold text-gray-800 mb-2 sm:mb-0 mr-2">
                    Are you currently serving as an Existing ICP Mentor?
                  </h2>
                  <div className="flex flex-grow items-center truncate text-gray-800 text-xs">
                    {userData[0].profile.existing_icp_mentor ? (
                      "Yes"
                    ) : "No" ? (
                      <span>
                        {userData[0].profile.existing_icp_mentor ? "Yes" : "No"}
                      </span>
                    ) : (
                      <span className="flex items-center text-xs">
                        {noDataPresentSvg}
                        No Data
                      </span>
                    )}
                  </div>
                </div>
              </li>
              <li className="list-disc ml-4 md:ml-12">
                <div className="flex flex-col items-start justify-start sm:text-left">
                  <h2 className=" font-semibold text-gray-800 mb-2 sm:mb-0 mr-2">
                    What is the scope and status of the Existing ICP Project
                    Portfolio?
                  </h2>
                  <div className="flex flex-grow items-center text-gray-800 truncate text-xs">
                    {userData[0]?.profile?.existing_icp_project_porfolio[0] ? (
                      <span>
                        {userData[0]?.profile?.existing_icp_project_porfolio[0]}
                      </span>
                    ) : (
                      <span className="flex items-center text-xs">
                        {noDataPresentSvg}
                        No Data
                      </span>
                    )}
                  </div>
                </div>
              </li>
              <li className="list-disc ">
                <div className="flex flex-col items-start justify-start sm:text-left">
                  <h2 className=" font-semibold text-gray-800 mb-2 sm:mb-0 mr-2">
                    What are the preferred ICP hubs ?
                  </h2>
                  <div className="flex flex-grow items-center text-gray-800 truncate text-xs">
                    {userData[0].profile.preferred_icp_hub ? (
                      <span>{userData[0].profile.preferred_icp_hub}</span>
                    ) : (
                      <span className="flex items-center text-xs">
                        {noDataPresentSvg}
                        No Data
                      </span>
                    )}
                  </div>
                </div>
              </li>

              <li className="list-disc ml-4 md:ml-12">
                <div className="flex flex-col items-start justify-start sm:text-left">
                  <h2 className=" font-semibold text-gray-800 mb-2 sm:mb-0 mr-2">
                    Have you previously been involved with any ICP hubs ?
                  </h2>
                  <div className="text-gray-800 flex flex-grow items-center truncate text-xs">
                    {userData[0].profile.icp_hub_or_spoke ? (
                      "Yes"
                    ) : "No" ? (
                      <span>
                        {userData[0].profile.icp_hub_or_spoke ? "Yes" : "No"}
                      </span>
                    ) : (
                      <span className="flex items-center text-xs">
                        {noDataPresentSvg}
                        No Data
                      </span>
                    )}
                  </div>
                </div>
              </li>

              <li className="list-disc ">
                <div className="flex flex-col items-start justify-start sm:text-left">
                  <h2 className=" font-semibold text-gray-800 mb-2 sm:mb-0 mr-2">
                    If you involved with any ICP hubs ? Which ICP hub do you
                    own?
                  </h2>
                  <div className="text-gray-800 flex flex-grow items-center truncate text-xs">
                    {userData[0].profile.hub_owner[0] ? (
                      <span>{userData[0].profile.hub_owner[0]}</span>
                    ) : (
                      <span className="flex items-center text-xs">
                        {noDataPresentSvg}
                        No Data
                      </span>
                    )}
                  </div>
                </div>
              </li>
              <li className="list-disc ml-4 md:ml-12">
                <div className="flex flex-col items-start justify-start sm:text-left">
                  <h2 className=" font-semibold text-gray-800 mb-2 sm:mb-0 mr-2">
                    What motivated you to join the ICP hub?
                  </h2>
                  <div className="text-gray-800 flex flex-grow items-center truncate text-xs">
                    {userData[0].profile.reason_for_joining[0] ? (
                      <span>{userData[0].profile.reason_for_joining[0]}</span>
                    ) : (
                      <span className="flex items-center text-xs">
                        {noDataPresentSvg}
                        No Data
                      </span>
                    )}
                  </div>
                </div>
              </li>
              <li className="list-disc ">
                <div className="flex flex-col items-start justify-start sm:text-left">
                  <h2 className=" font-semibold text-gray-800 mb-2 sm:mb-0 mr-2">
                    What type of profile are you referring to?
                  </h2>
                  <div className="text-gray-800 flex flex-grow items-center truncate text-xs">
                    {userData[0].profile.user_data.type_of_profile[0] ? (
                      <span>
                        {userData[0].profile.user_data.type_of_profile[0]}
                      </span>
                    ) : (
                      <span className="flex items-center text-xs">
                        {noDataPresentSvg}
                        No Data
                      </span>
                    )}
                  </div>
                </div>
              </li>

              <li className="list-disc ml-4 md:ml-12">
                <div className=" flex flex-col text-gray-600">
                  <p className="text-black font-semibold mb-1">
                    What types of mentoring services are you offering?
                  </p>

                  <div className="flex gap-2 text-xs items-center overflow-y-scroll h-14 flex-wrap">
                    {userData[0]?.profile?.category_of_mentoring_service &&
                    userData[0].profile.category_of_mentoring_service !== "" ? (
                      userData[0]?.profile?.category_of_mentoring_service
                        .split(",")
                        // .slice(0, 3)
                        .map((tag, index) => (
                          <div
                            key={index}
                            className="text-xs border-2 rounded-2xl px-2 py-1 font-bold bg-[#c9c5c5]"
                          >
                            {tag.trim()}
                          </div>
                        ))
                    ) : (
                      <div className="flex items-center">
                        {noDataPresentSvg}
                        <span className="ml-2 text-xs">No Data</span>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {Allrole?.map((role, index) => {
          const roleName = role.name === "vc" ? "investor" : role.name;
          if (role.status === "requested" && roleName === "mentor") {
            return (
              <div key={index} className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() =>
                    declineUserRoleHandler(
                      principal,
                      true,
                      "Pending",
                      role.name
                    )
                  }
                  disabled={isDeclining}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-[#C60404] hover:bg-[#8b2a2a] rounded-lg focus:outline-none focus:ring-4 focus:ring-gray-100"
                >
                  {isDeclining ? (
                    <ThreeDots color="#FFF" height={13} width={51} />
                  ) : (
                    "Decline"
                  )}
                </button>{" "}
                <button
                  onClick={() =>
                    allowUserRoleHandler(principal, true, "Pending", role.name)
                  }
                  disabled={isAccepting}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-[#3505B2] hover:bg-[#482b90] rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
                >
                  {isAccepting ? (
                    <ThreeDots color="#FFF" height={13} width={51} />
                  ) : (
                    "Accept"
                  )}
                </button>
              </div>
            );
          }
          return null;
        })}
      </div>
    </>
  );
};

export default MentorProfile;

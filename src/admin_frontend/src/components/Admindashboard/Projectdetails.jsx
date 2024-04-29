import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  numberToDate,
  uint8ArrayToBase64,
} from "../Utils/AdminData/saga_function/blobImageToUrl";
import { projectApprovedRequest } from "../AdminStateManagement/Redux/Reducers/projectApproved";
import { projectDeclinedRequest } from "../AdminStateManagement/Redux/Reducers/projectDeclined";
import { Principal } from "@dfinity/principal";
import { ThreeDots } from "react-loader-spinner";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  discordSvg,
  twitterSvg,
} from "../../../../IcpAccelerator_frontend/src/components/Utils/Data/SvgData";
import {
  Profile2,
  noDataPresentSvg,
  place1,
  websiteSvg,
  linkSvg,
  goalSvg,
  videoSvg,
  pitchSvg,
  tokenSvg,
} from "../Utils/AdminData/SvgData";
import pdfImage from "../../../assets/image/pdfimage.png";
import NoData from ".././../../../IcpAccelerator_frontend/assets/images/search_not_found.png";

import openchat_username from "../../../assets/image/spinner.png";
import { Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
// import { twitterSvg } from "../../../../../IcpAccelerator_frontend/src/components/Utils/Data/SvgData";

const Projectdetails = ({ userData, Allrole, principal }) => {
  const actor = useSelector((currState) => currState.actors.actor);

  const [percent, setPercent] = useState(0);
  const [current, setCurrent] = useState("user");
  const [isAccepting, setIsAccepting] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);
  const [showOriginalLogo, setShowOriginalLogo] = useState(true);
  const tm = useRef(null);
  const [showBio, setShowBio] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  // const projectData = location.state?.projectData;

  console.log("userdata =>>>>>>> ", userData[0]);
  // console.log("Allrole =>>>>>>> ", Allrole);
  // console.log("principal =>>>>>>> ", principal);

  const [sliderValuesProgress, setSliderValuesProgress] = useState({
    Team: 0,
    ProblemAndVision: 0,
    ValueProp: 0,
    Product: 0,
    Market: 0,
    BusinessModel: 0,

    Scale: 0,
    Exit: 0,
  });
  const [sliderValues, setSliderValues] = useState({
    Team: 0,
    ProblemAndVision: 0,
    ValueProp: 0,
    Product: 0,
    Market: 0,
    BusinessModel: 0,
    Scale: 0,
    Exit: 0,
  });
  const sliderKeys = [
    "Team",
    "ProblemAndVision",
    "ValueProp",
    "Product",
    "Market",
    "BusinessModel",
    "Scale",
    "Exit",
  ];
  const customStyles = `
  .slider-mark::after {
    content: attr(data-label);
    position: absolute;
    top: -2rem;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    white-space: nowrap;
    font-size: 0.75rem;
    color: #fff;
    padding: 0.2rem 0.4rem; 
    border-radius: 0.25rem;
  }
`;

  const handleSliderChange = (index, value) => {
    const key = sliderKeys[index];
    const newSliderValues = { ...sliderValues, [key]: value };
    setSliderValues(newSliderValues);
    const newSliderValuesProgress = {
      ...sliderValuesProgress,
      [key]: value === 9 ? 100 : Math.floor((value / 9) * 100),
    };
    setSliderValuesProgress(newSliderValuesProgress);
  };

  const increase = () => {
    setPercent((prevPercent) => {
      if (prevPercent >= 100) {
        clearTimeout(tm.current);
        return 100; // Ensure we don't exceed 100%
      }
      return prevPercent + 1;
    });
  };

  useEffect(() => {
    if (percent < 100) {
      tm.current = setTimeout(increase, 10);
    }
    return () => clearTimeout(tm.current);
  }, [percent]);
  useEffect(() => {
    if (percent < 100) {
      tm.current = setTimeout(increase, 10);
    }
    return () => clearTimeout(tm.current);
  }, [percent]);

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
        case "project":
          if (state === "Pending") {
            await actor.decline_project_creation_request(covertedPrincipal);
            await dispatch(projectDeclinedRequest());
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
        case "project":
          if (state === "Pending") {
            await actor.approve_project_creation_request(covertedPrincipal);
            await dispatch(projectApprovedRequest());
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

  const date = numberToDate(userData[0]?.creation_date);

  const weeklyUsers = Number(userData[0]?.params.weekly_active_users[0]);
  const revenueNum = Number(userData[0]?.params.revenue[0]);
  const icpGrants = Number(userData[0]?.params.money_raised[0]?.icp_grants[0]);
  const investorInvest = Number(
    userData[0]?.params.money_raised[0]?.investors[0]
  );
  const otherEcosystem = Number(
    userData[0]?.params.money_raised[0]?.raised_from_other_ecosystem[0]
  );
  const snsGrants = Number(userData[0]?.params.money_raised[0]?.sns[0]);
  const targetAmount = userData[0]?.params.money_raised[0]?.target_amount[0]
    ? Number(userData[0]?.params.money_raised[0]?.target_amount[0])
    : 0;

  const profile = uint8ArrayToBase64(
    userData[0]?.params?.user_data?.profile_picture[0]
  );
  const logo =
    userData && userData[0]?.params?.project_logo.length > 0
      ? uint8ArrayToBase64(userData[0]?.params?.project_logo)
      : null;

  const Project_cover = uint8ArrayToBase64(userData[0]?.params?.project_cover);
  return (
    <>
      <div className="w-full flex flex-col">
        <div className="w-full flex gap-4 sxxs:flex-col sm:flex-row">
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
                  {userData[0].params.user_data.full_name}
                </h1>
                <div className="text-xs border-2 rounded-2xl px-2 py-1 font-bold bg-[#c9c5c5]">
                  {current.charAt(0).toUpperCase() + current.slice(1)}
                </div>
              </div>
              {userData[0].params.user_data.email[0] && (
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
                    {userData[0].params.user_data.email[0]}
                  </span>
                </div>
              )}
              <div className="flex flex-col items-start gap-3 text-sm">
                <div className="flex flex-row  text-gray-600 space-x-2">
                  {place1}
                  <div className="underline">
                    {userData[0].params.user_data.country}
                  </div>
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
                  <div className="ml-2">
                    {Allrole[2]?.requested_on?.length > 0
                      ? date
                      : "No requested date"}
                  </div>
                </div>
                {userData[0].params.user_data.openchat_username[0] && (
                  <div className="flex flex-row space-x-2 text-gray-600">
                    <img
                      src={openchat_username}
                      alt="openchat_username"
                      className="size-4"
                    />
                    <div className="ml-2">
                      {userData[0].params.user_data.openchat_username[0]}
                    </div>
                  </div>
                )}
                {userData[0].params.user_data.area_of_interest && (
                  <div className=" flex flex-col text-gray-600">
                    <div className="text-black font-semibold mb-1">Skill :</div>
                    <div className="flex gap-2 text-xs items-center flex-wrap">
                      {userData[0].params.user_data.area_of_interest
                        .split(",")
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
                {userData[0].params.user_data.reason_to_join[0] && (
                  <div className="text-black font-semibold ">
                    Reason to join :
                  </div>
                )}
                <div className="flex text-gray-700 flex-row gap-2 flex-wrap text-xs">
                  {userData[0].params.user_data.reason_to_join[0].map(
                    (reason, index) => (
                      <div
                        key={index}
                        className="text-xs border-2 rounded-2xl px-2 py-1 font-bold bg-[#c9c5c5]"
                      >
                        {reason.replace(/_/g, " ")}
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className=" bg-[#D2D5F2] shadow-md shadow-gray-400 p-6 rounded-lg md:w-[74%] sxxs:w-full">
            <div className="flex w-full mb-4">
              <Swiper
                modules={[Pagination, Autoplay]}
                centeredSlides={true}
                loop={true}
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
                          <div className="flex justify-center items-center text-white p-2 text-sm ">
                            {constructMessage(role)}
                          </div>
                        </button>
                      </div>
                    </SwiperSlide>
                  ))}
              </Swiper>
            </div>
            <div className="w-full flex flex-row justify-between">
              <h1 className="md:text-2xl text-xl font-bold text-gray-800 mb-2">
                About Project
              </h1>
            </div>

            <div className="flex md:flex-row flex-col w-full mt-3 items-start">
              <div className=" md:w-[5.5rem] md:flex-shrink-0 w-full justify-start">
                <img
                  className="md:w-20 object-fill md:h-20 w-16 h-16 border border-white bg-gray-300 justify-center rounded-md"
                  src={showOriginalLogo ? logo : Project_cover}
                  alt="projectLogo"
                />
                <span className="text-xs font-semibold">
                  {showOriginalLogo ? "Project Logo" : "Project Cover"}
                </span>
                <label
                  htmlFor="toggle"
                  className="flex items-center cursor-pointer"
                >
                  <div className="relative">
                    <input
                      type="checkbox"
                      id="toggle"
                      className="sr-only"
                      checked={!showOriginalLogo}
                      onChange={() => setShowOriginalLogo(!showOriginalLogo)}
                    />
                    <div className=" bg-white w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-300 ease-in-out">
                      {showOriginalLogo ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="24"
                          height="24"
                        >
                          <g fill="#FF6B6B">
                            <circle cx="6" cy="12" r="2" />
                            <path d="M19 12l-7-7v4H8v6h4v4l7-7z" />
                          </g>
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="24"
                          height="24"
                        >
                          <g fill="#4CAF50">
                            <circle cx="18" cy="12" r="2" />
                            <path d="M5 12l7-7v4h4v6h-4v4l-7-7z" />
                          </g>
                        </svg>
                      )}
                    </div>
                  </div>
                </label>
              </div>
              <div className="flex flex-col md:flex-grow md:w-3/4 w-full justify-start md:ml-4 md:mb-0 mb-6">
                <div className="flex flex-col items-baseline">
                  <div className="flex flex-row justify-between w-full">
                    <h1 className="md:text-xl text-md  font-bold text-gray-800 mb-2 truncate">
                      {userData[0]?.params?.project_name}
                    </h1>
                  </div>

                  <div className="flex flex-row justify-between w-full">
                    <h1 className="md:text-lg text-sm font-bold text-gray-800 truncate">
                      {showBio ? "Project Description:" : "Bio:"}
                    </h1>
                    <div
                      onClick={() => setShowBio(!showBio)}
                      className="bg-white w-6 h-6 rounded-full flex items-center justify-center cursor-pointer transition-transform duration-300 ease-in-out"
                    >
                      {showBio ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="24"
                          height="24"
                        >
                          <g fill="#FF6B6B">
                            <circle cx="6" cy="12" r="2" />
                            <path d="M19 12l-7-7v4H8v6h4v4l7-7z" />
                          </g>
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="24"
                          height="24"
                        >
                          <g fill="#4CAF50">
                            <circle cx="18" cy="12" r="2" />
                            <path d="M5 12l7-7v4h4v6h-4v4l-7-7z" />
                          </g>
                        </svg>
                      )}
                    </div>
                  </div>

                  <h1 className="md:text-sm text-gray-600 flex h-[8rem] line-clamp-3 flex-wrap text-xs break-all">
                    {showBio
                      ? userData[0]?.params?.project_description?.[0] || (
                          <>
                            {noDataPresentSvg}
                            No data available
                          </>
                        )
                      : userData[0]?.params?.user_data?.bio?.[0] || (
                          <>
                            {noDataPresentSvg}
                            No data available
                          </>
                        )}
                  </h1>
                </div>

                <div className="border border-gray-400 w-full mt-2 mb-4 relative " />

                <div className="flex flex-col md:flex-row justify-between items-start gap-3 text-sm w-full">
                  {/* Left Column */}
                  <div className="flex flex-col md:w-1/2 w-full">
                    <div className="flex flex-col mb-4 md:mb-6">
                      <h2 className="text-lg font-bold text-gray-800 mb-2 sm:mb-0 mr-2">
                        Daap Link:
                      </h2>
                      <div className="flex flex-grow items-center mt-1.5 truncate">
                        <div
                          onClick={() => {
                            const daapLink =
                              userData[0]?.params?.dapp_link?.[0];
                            window.open(daapLink, "_blank");
                          }}
                          className="cursor-pointer"
                        >
                          {linkSvg}
                        </div>

                        <p className="text-[#7283EA] text-xs  md:text-sm truncate px-2">
                          {userData[0]?.params?.dapp_link?.[0] ||
                            "Not available"}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col mb-4 md:mb-6">
                      <h2 className="text-lg font-bold text-gray-800 mb-2 sm:mb-0 mr-2">
                        Project Elevator Pitch:
                      </h2>
                      <div className="flex flex-grow items-center mt-1.5 truncate">
                        <div
                          onClick={() => {
                            const url =
                              userData[0]?.params?.project_elevator_pitch?.[0];
                            window.open(url, "_blank");
                          }}
                          className="cursor-pointer"
                        >
                          {pitchSvg}
                        </div>

                        <p className="text-[#7283EA] text-xs  md:text-sm truncate px-2">
                          {userData[0]?.params?.project_elevator_pitch?.[0] ||
                            "Not available"}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col mb-4 md:mb-6">
                      <h2 className="text-lg font-bold text-gray-800 mb-2 sm:mb-0">
                        Promotional Video:
                      </h2>
                      <div className="flex flex-grow  mt-1.5 truncate items-start">
                        {userData[0]?.params?.promotional_video?.[0] ? (
                          <div
                            onClick={() => {
                              const url =
                                userData[0]?.params?.promotional_video?.[0];
                              window.open(url, "_blank");
                            }}
                            className="cursor-pointer mr-2"
                          >
                            {videoSvg}
                          </div>
                        ) : (
                          <div className="flex-shrink-0 w-6 h-6 mr-1">
                            {noDataPresentSvg}
                          </div>
                        )}

                        <p className="text-[#7283EA] text-xs md:text-sm truncate">
                          {userData[0]?.params?.promotional_video?.[0] ||
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
                        {userData[0]?.params?.project_website?.[0] ? (
                          <div
                            onClick={() => {
                              const url =
                                userData[0]?.params?.project_website?.[0];
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
                          {userData[0]?.params?.project_website?.[0] ||
                            "Not available"}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col mb-4 md:mb-6">
                      <h2 className="text-lg font-bold text-gray-800 mb-2 sm:mb-0 mr-2">
                        Long Term Goal:
                      </h2>
                      <div className="flex flex-grow items-start mt-1.5 truncate">
                        {userData[0]?.params?.long_term_goals?.[0] ? (
                          <div
                            onClick={() => {
                              const url =
                                userData[0]?.params?.long_term_goals?.[0];
                              window.open(url, "_blank");
                            }}
                            className="cursor-pointer mr-2"
                          >
                            {goalSvg}
                          </div>
                        ) : (
                          <div className="flex-shrink-0 w-6 h-6 mr-1">
                            {noDataPresentSvg}
                          </div>
                        )}

                        <p className="text-[#7283EA] text-xs md:text-sm truncate">
                          {userData[0]?.params?.long_term_goals?.[0] ||
                            "Not available"}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col mb-4 md:mb-6">
                      <h2 className="text-lg font-bold text-gray-800 mb-2 sm:mb-0 mr-2">
                        Token Economics:
                      </h2>
                      <div className="flex flex-grow items-start mt-1.5 truncate">
                        {userData[0]?.params?.token_economics?.[0] ? (
                          <div
                            onClick={() => {
                              const url =
                                userData[0]?.params?.token_economics?.[0];
                              window.open(url, "_blank");
                            }}
                            className="cursor-pointer mr-2"
                          >
                            {tokenSvg}
                          </div>
                        ) : (
                          <div className="flex-shrink-0 w-6 h-6 mr-1">
                            {noDataPresentSvg}
                          </div>
                        )}

                        <p className="text-[#7283EA] text-xs md:text-sm truncate">
                          {userData[0]?.params?.token_economics?.[0] ||
                            "Not available"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full flex gap-4 sxxs:flex-col sm:flex-row mt-4">
          <div className="flex flex-col  w-full   md:w-[26%] sxxs:w-full">
            <div className="w-full bg-[#D2D5F2] flex p-6 flex-col h-[312px] overflow-y-auto shadow-md shadow-gray-400 rounded-lg mb-4">
              <h1 className="text-xl font-bold text-gray-800  mb-2">
                Private Documents
              </h1>
              {userData[0]?.params?.private_docs?.[0] && (
                <div className="flex flex-row gap-2 px-2 py-1 items-center">
                  <img src={pdfImage} alt="PDF Icon" className="w-10 h-12" />
                  <div className="overflow-hidden">
                    <div className="space-y-4 w-full">
                      {userData[0]?.params?.private_docs?.[0].map(
                        (doc, index) => (
                          <div
                            key={index}
                            className="flex flex-col justify-between h-full"
                          >
                            <div className="flex-grow">
                              <a
                                href={doc.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-800 text-xs truncate font-medium"
                                title={doc.title}
                              >
                                {doc.title}
                              </a>
                            </div>
                            <div className="flex items-end">
                              <p className="text-gray-600 text-sm">
                                <a
                                  href={doc.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500 underline"
                                >
                                  CLICK HERE
                                </a>
                              </p>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}
              {!userData[0]?.params?.private_docs?.[0] && (
                <div className="flex justify-center items-center h-full w-full">
                  <img
                    src={NoData}
                    className="object-cover object-center w-[50%]"
                    alt="No data found"
                  />
                </div>
              )}
            </div>

            <div className="bg-[#D2D5F2] flex  flex-col p-6 h-[312px] overflow-y-auto shadow-md shadow-gray-400 rounded-lg  w-full mb-4">
              <h1 className="text-xl font-bold text-gray-800  mb-2">
                Public Documents
              </h1>
              {userData[0]?.params?.public_docs?.[0] && (
                <div className="flex flex-row gap-2 px-2 py-1 items-center">
                  <img src={pdfImage} alt="PDF Icon" className="w-10 h-12" />
                  <div className="overflow-hidden">
                    <div className="space-y-4 w-full">
                      {userData[0]?.params?.public_docs?.[0].map(
                        (doc, index) => (
                          <div
                            key={index}
                            className="flex flex-col justify-between h-full"
                          >
                            <div className="flex-grow">
                              <a
                                href={doc.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-800 text-xs truncate font-medium"
                                title={doc.title}
                              >
                                {doc.title}
                              </a>
                            </div>
                            <div className="flex items-end">
                              <p className="text-gray-600 text-sm">
                                <a
                                  href={doc.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500 underline"
                                >
                                  CLICK HERE
                                </a>
                              </p>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}
              {!userData[0]?.params?.public_docs?.[0] && (
                <div className="flex justify-center items-center h-full w-full">
                  <img
                    src={NoData}
                    className="object-cover object-center w-[50%]"
                    alt="No data found"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-row justify-between bg-[#D2D5F2] shadow-md shadow-gray-400 p-6 rounded-lg md:w-3/4 sxxs:w-fulll">
            <ul className="grid grid-cols-2 gap-4 w-full md:pl-[7.5rem]">
              <li className="list-disc">
                <div className="flex flex-col items-start justify-start sm:text-left ">
                  <h2 className=" font-bold text-gray-800 mb-2 sm:mb-0 mr-2">
                    Country of Registration:
                  </h2>
                  <div className="flex flex-grow truncate text-xs">
                    <p className="text-gray-600 text-xs truncate ml-2">
                      {userData[0]?.params?.country_of_registration?.[0] ? (
                        <span>
                          {userData[0]?.params?.country_of_registration?.[0]}
                        </span>
                      ) : (
                        <span className="flex items-center">
                          {noDataPresentSvg}
                          Data Not Available
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </li>

              <li className="list-disc ml-4">
                <div className="flex flex-col items-start justify-start sm:text-left">
                  <h2 className=" font-bold text-gray-800 mb-2 sm:mb-0 mr-2">
                    Uploaded Private Docs :
                  </h2>
                  <div className="flex flex-grow items-center truncate text-xs pl-2 text-gray-800">
                    {userData[0]?.params?.upload_private_documents?.[0] ? (
                      "Yes"
                    ) : "No" ? (
                      <span>
                        {userData[0]?.params?.upload_private_documents?.[0]
                          ? "Yes"
                          : "No"}
                      </span>
                    ) : (
                      <span className="flex items-center">
                        {noDataPresentSvg}
                        Data Not Available
                      </span>
                    )}
                  </div>
                </div>
              </li>
              <li className="list-disc">
                <div className="flex flex-col items-start justify-start sm:text-left">
                  <h2 className=" font-bold text-gray-800 mb-2 sm:mb-0 mr-2">
                    Money Raised Till Now :
                  </h2>
                  <div className="flex flex-grow items-center truncate text-xs pl-2 text-gray-800">
                    {userData[0]?.params?.money_raised_till_now?.[0] ? (
                      "Yes"
                    ) : "No" ? (
                      <span>
                        {userData[0]?.params?.money_raised_till_now?.[0]
                          ? "Yes"
                          : "No"}
                      </span>
                    ) : (
                      <span className="flex items-center">
                        {noDataPresentSvg}
                        Data Not Available
                      </span>
                    )}
                  </div>
                </div>
              </li>
              <li className="list-disc ml-4">
                <div className="flex flex-col items-start justify-start sm:text-left">
                  <h2 className=" font-bold text-gray-800 mb-2 sm:mb-0 mr-2">
                    Project Area Of Focus :
                  </h2>
                  <div className="flex flex-grow items-center truncate text-xs">
                    <p className="text-gray-600 text-xs truncate ml-2">
                      {userData[0].params.project_area_of_focus ? (
                        <span>{userData[0].params.project_area_of_focus}</span>
                      ) : (
                        <span className="flex items-center">
                          {noDataPresentSvg}
                          Data Not Available
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </li>
              <li className="list-disc">
                <div className="flex flex-col items-start justify-start sm:text-left">
                  <p className="text-black font-semibold mb-1">
                    Area Of Interest :
                  </p>
                  <div className="flex gap-2 text-xs text-gray-600 items-center flex-wrap">
                    {userData[0].params.user_data.area_of_interest
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
              </li>

              <li className="list-disc ml-4">
                <div className="flex flex-col items-start justify-start sm:text-left">
                  <h2 className=" font-bold text-gray-800 mb-2 sm:mb-0 mr-2">
                    Type of Registration :
                  </h2>
                  <div className="flex flex-grow items-center truncate text-xs">
                    <p className="text-gray-600 text-xs truncate ml-2">
                      {userData[0].params.type_of_registration[0] ? (
                        <span>
                          {userData[0].params.type_of_registration[0]}
                        </span>
                      ) : (
                        <span className="flex items-center">
                          {noDataPresentSvg}
                          Data Not Available
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </li>
              <li className="list-disc">
                <div className="flex flex-col items-start justify-start sm:text-left">
                  <h2 className=" font-bold text-gray-800 mb-2 sm:mb-0 mr-2">
                    Revenue:
                  </h2>
                  <div className="flex flex-grow items-center truncate text-xs">
                    <p className="text-gray-600 text-xs truncate ml-2">
                      {revenueNum ? (
                        <span>{revenueNum}</span>
                      ) : (
                        <span className="flex items-center">
                          {noDataPresentSvg}
                          Data Not Available
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </li>
              <li className="list-disc ml-4">
                <div className="flex flex-col items-start justify-start sm:text-left">
                  <h2 className=" font-bold text-gray-800 mb-2 sm:mb-0 mr-2">
                    ICP Grants:
                  </h2>
                  <div className="flex flex-grow items-center truncate text-xs">
                    <p className="text-gray-600 text-xs truncate ml-2">
                      {icpGrants ? (
                        <span>{icpGrants}</span>
                      ) : (
                        <span className="flex items-center">
                          {noDataPresentSvg}
                          Data Not Available
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </li>
              <li className="list-disc">
                <div className="flex flex-col items-start justify-start sm:text-left">
                  <h2 className=" font-bold text-gray-800 mb-2 sm:mb-0 mr-2">
                    Investors :
                  </h2>
                  <div className="flex flex-grow items-center truncate text-xs">
                    <p className="text-gray-600 text-xs truncate ml-2">
                      {investorInvest ? (
                        <span>{investorInvest}</span>
                      ) : (
                        <span className="flex items-center">
                          {noDataPresentSvg}
                          Data Not Available
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </li>
              <li className="list-disc ml-4">
                <div className="flex flex-col items-start justify-start sm:text-left">
                  <h2 className=" font-bold text-gray-800 mb-2 sm:mb-0 mr-2">
                    Project Registered :
                  </h2>
                  <div className="flex flex-grow items-center truncate text-xs pl-2 text-gray-800">
                    {userData[0]?.params?.is_your_project_registered?.[0] ? (
                      "Yes"
                    ) : "No" ? (
                      <span>
                        {userData[0]?.params?.is_your_project_registered?.[0]
                          ? "Yes"
                          : "No"}
                      </span>
                    ) : (
                      <span className="flex items-center">
                        {noDataPresentSvg}
                        Data Not Available
                      </span>
                    )}
                  </div>
                </div>
              </li>

              <li className="list-disc">
                <div className=" flex flex-col text-gray-600">
                  <p className="text-black font-semibold mb-1">
                    Support Multichain :
                  </p>
                  <div className="flex gap-2 text-xs items-center flex-wrap">
                    {userData[0]?.params?.supports_multichain?.[0]
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
              </li>

              <li className="list-disc ml-4">
                <div className="flex flex-col items-start justify-start sm:text-left">
                  <h2 className=" font-bold text-gray-800 mb-2 sm:mb-0 mr-2">
                    Preferred ICP Hub :
                  </h2>
                  <div className="flex flex-grow items-center truncate text-xs">
                    <p className="text-gray-600 text-xs truncate ml-2">
                      {userData[0].params.preferred_icp_hub[0] ? (
                        <span>{userData[0].params.preferred_icp_hub[0]}</span>
                      ) : (
                        <span className="flex items-center">
                          {noDataPresentSvg}
                          Data Not Available
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </li>
              <li className="list-disc">
                <div className="flex flex-col items-start justify-start sm:text-left">
                  <h2 className=" font-bold text-gray-800 mb-2 sm:mb-0 mr-2">
                    Mentor Assigned :
                  </h2>
                  <div className="flex flex-grow items-center truncate text-xs">
                    <p className="text-gray-600 text-xs truncate ml-2">
                      {userData[0].params.mentors_assigned[0] ? (
                        <span>{userData[0].params.mentors_assigned[0]}</span>
                      ) : (
                        <span className="flex items-center">
                          {noDataPresentSvg}
                          Data Not Available
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </li>
              <li className="list-disc ml-4">
                <div className="flex flex-col items-start justify-start sm:text-left">
                  <h2 className=" font-bold text-gray-800 mb-2 sm:mb-0 mr-2">
                    Project Team :
                  </h2>
                  <div className="flex flex-grow items-center truncate text-xs pl-2 text-gray-800">
                    {userData[0].params.project_team[0] ? (
                      "Yes"
                    ) : "No" ? (
                      <span>
                        {userData[0].params.project_team[0] ? "Yes" : "No"}
                      </span>
                    ) : (
                      <span className="flex items-center">
                        {noDataPresentSvg}
                        Data Not Available
                      </span>
                    )}
                  </div>
                </div>
              </li>
              <li className="list-disc">
                <div className="flex flex-col items-start justify-start sm:text-left">
                  <h2 className=" font-bold text-gray-800 mb-2 sm:mb-0 mr-2">
                    Target Market :
                  </h2>
                  <div className="flex flex-grow items-center truncate text-xs">
                    <p className="text-gray-600 text-xs truncate ml-2">
                      {userData[0].params.target_market[0] ? (
                        <span>{userData[0].params.target_market[0]}</span>
                      ) : (
                        <span className="flex items-center">
                          {noDataPresentSvg}
                          Data Not Available
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </li>
              <li className="list-disc ml-4">
                <div className="flex flex-col items-start justify-start sm:text-left">
                  <h2 className=" font-bold text-gray-800 mb-2 sm:mb-0 mr-2">
                    VC's assigned :
                  </h2>
                  <div className="flex flex-grow items-center truncate text-xs">
                    <p className="text-gray-600 text-xs truncate ml-2">
                      {userData[0].params.vc_assigned[0] ? (
                        <span>{userData[0].params.vc_assigned[0]}</span>
                      ) : (
                        <span className="flex items-center">
                          {noDataPresentSvg}
                          Data Not Available
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </li>
              <li className="list-disc">
                <div className="flex flex-col items-start justify-start sm:text-left">
                  <h2 className=" font-bold text-gray-800 mb-2 sm:mb-0 mr-2">
                    Weekly Active:
                  </h2>
                  <div className="flex flex-grow items-center truncate text-xs">
                    <p className="text-gray-600 text-xs truncate ml-2">
                      {weeklyUsers ? (
                        <span>{weeklyUsers}</span>
                      ) : (
                        <span className="flex items-center">
                          {noDataPresentSvg}
                          Data Not Available
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </li>
              <li className="list-disc ml-4">
                <div className="flex flex-col items-start justify-start sm:text-left">
                  <h2 className=" font-bold text-gray-800 mb-2 sm:mb-0 mr-2">
                    Raised from Other Ecosysytem:
                  </h2>
                  <div className="flex flex-grow items-center truncate text-xs">
                    <p className="text-gray-600 text-xs truncate ml-2">
                      {otherEcosystem ? (
                        <span>{otherEcosystem}</span>
                      ) : (
                        <span className="flex items-center">
                          {noDataPresentSvg}
                          Data Not Available
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </li>
              <li className="list-disc">
                <div className="flex flex-col items-start justify-start sm:text-left">
                  <h2 className=" font-bold text-gray-800 mb-2 sm:mb-0 mr-2">
                    Targeted Amount:
                  </h2>
                  <div className="flex flex-grow items-center truncate text-xs">
                    <p className="text-gray-600 text-xs truncate ml-2">
                      {targetAmount ? (
                        <span>{targetAmount}</span>
                      ) : (
                        <span className="flex items-center">
                          {noDataPresentSvg}
                          Data Not Available
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </li>
              <li className="list-disc ml-4">
                <div className="flex flex-col items-start justify-start sm:text-left">
                  <h2 className=" font-bold text-gray-800 mb-2 sm:mb-0 mr-2">
                    Sns:
                  </h2>
                  <div className="flex flex-grow items-center truncate text-xs">
                    <p className="text-gray-600 text-xs truncate ml-2">
                      {snsGrants ? (
                        <span>{snsGrants}</span>
                      ) : (
                        <span className="flex items-center">
                          {noDataPresentSvg}
                          Data Not Available
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mb-6">
          {Allrole?.map((role, index) => {
            const roleName = role.name === "vc" ? "investor" : role.name;
            if (role.status === "requested" && roleName === "project") {
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
                    className="px-5 py-2.5 text-sm font-medium text-white bg-[#C60404] hover:bg-[#8b2a2a] rounded-lg  focus:outline-none focus:ring-4 focus:ring-gray-100"
                  >
                    {isDeclining ? (
                      <ThreeDots color="#FFF" height={13} width={51} />
                    ) : (
                      "Decline"
                    )}
                  </button>
                  <button
                    onClick={() =>
                      allowUserRoleHandler(
                        principal,
                        true,
                        "Pending",
                        role.name
                      )
                    }
                    disabled={isAccepting}
                    className="px-5 py-2.5 text-sm font-medium text-white bg-[#3505B2] hover:bg-[#482b90] rounded-lg  focus:outline-none focus:ring-4 focus:ring-blue-300"
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
      </div>
    </>
  );
};

export default Projectdetails;

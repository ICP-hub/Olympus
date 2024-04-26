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
import { discordSvg } from "../../../../IcpAccelerator_frontend/src/components/Utils/Data/SvgData";
import { githubSvgBig } from "../../../../IcpAccelerator_frontend/src/components/Utils/Data/SvgData";
import { discordSvgBig } from "../../../../IcpAccelerator_frontend/src/components/Utils/Data/SvgData";
import {
  place,
  openWebsiteIcon,
  Profile2,
  noDataPresentSvg,
} from "../Utils/AdminData/SvgData";
import { linkedInSvgBig } from "../../../../IcpAccelerator_frontend/src/components/Utils/Data/SvgData";
import { twitterSvgBig } from "../../../../IcpAccelerator_frontend/src/components/Utils/Data/SvgData";
import openchat_username from "../../../assets/image/spinner.png";
import { Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
// import { twitterSvg } from "../../../../../IcpAccelerator_frontend/src/components/Utils/Data/SvgData";

const Projectdetails = ({ userData, Allrole, principal }) => {
  const actor = useSelector((currState) => currState.actors.actor);

  const [details, setDetails] = useState();
  const [isHovered, setIsHovered] = useState(false);
  const [percent, setPercent] = useState(0);
  const [current, setCurrent] = useState("user");
  const [isAccepting, setIsAccepting] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);
  const [showOriginalCover, setShowOriginalCover] = useState(true);
  const [showOriginalLogo, setShowOriginalLogo] = useState(true);
  const tm = useRef(null);
  const percentage = 0;
  const [currentStep, setCurrentStep] = useState(0);

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
      <div className="w-full flex gap-4  md:flex-row flex-col mt-4">
        <div className="md:w-1/4 sxxs:w-full space-y-4">
          <div className=" bg-[#D2D5F2]  shadow-md shadow-gray-400 p-6 rounded-lg">
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
                <h1 className="md:text-2xl text-xl md:font-extrabold font-bold  bg-black text-transparent bg-clip-text">
                  {userData[0].params.user_data.full_name}
                </h1>
                <div className="text-xs border-2 rounded-2xl px-2 py-1 font-bold bg-[#c9c5c5]">
                  {current.charAt(0).toUpperCase() + current.slice(1)}
                </div>
              </div>
              <div className="text-gray-500 md:text-md text-sm font-normal flex mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  className="size-4 "
                  fill="currentColor"
                >
                  <path d="M256 64C150 64 64 150 64 256s86 192 192 192c17.7 0 32 14.3 32 32s-14.3 32-32 32C114.6 512 0 397.4 0 256S114.6 0 256 0S512 114.6 512 256v32c0 53-43 96-96 96c-29.3 0-55.6-13.2-73.2-33.9C320 371.1 289.5 384 256 384c-70.7 0-128-57.3-128-128s57.3-128 128-128c27.9 0 53.7 8.9 74.7 24.1c5.7-5 13.1-8.1 21.3-8.1c17.7 0 32 14.3 32 32v80 32c0 17.7 14.3 32 32 32s32-14.3 32-32V256c0-106-86-192-192-192zm64 192a64 64 0 1 0 -128 0 64 64 0 1 0 128 0z" />
                </svg>
                <span className="ml-2">
                  {userData[0].params.user_data.email}
                </span>
              </div>
              <div className="flex flex-col items-start gap-3 text-sm">
                <div className="flex flex-row  text-gray-600 space-x-2">
                  {place}
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
                <div className="flex flex-row space-x-2 text-gray-600">
                  <img
                    src={openchat_username}
                    alt="openchat_username"
                    className="size-5"
                  />
                  <div className="ml-2">
                    {userData[0].params.user_data.openchat_username[0]}
                  </div>
                </div>
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
        </div>

        <div className=" bg-[#D2D5F2]  shadow-md shadow-gray-400 pb-6 pt-4 rounded-lg md:w-3/4 w-full">
          <div className="w-full flex flex-col  justify-around px-[4%] py-4">
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
              <h1 className="text-xl font-bold text-black mb-2">
                About Project
              </h1>
              {/* <div className="flex flex-row space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`dot bg-white w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-300 ease-in-out`}
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                >
                  <g fill="#FF6B6B">
                    <circle cx="18" cy="12" r="2" fill="#FF6B6B" />
                    <path d="M5 12l7-7v4h4v6h-4v4l-7-7z" />
                  </g>
                </svg>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`dot bg-white w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-300 ease-in-out`}
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                >
                  <g fill="#4CAF50">
                    <circle cx="6" cy="12" r="2" fill="#4CAF50" />
                    <path d="M19 12l-7-7v4H8v6h4v4l7-7z" />
                  </g>
                </svg>
              </div> */}
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
                      <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-300 ease-in-out">
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
              <div className="flex flex-col md:flex-grow w-full justify-start md:ml-4 md:mb-0 mb-6">
                <div className="flex flex-row  gap-4 items-center">
                  <h1 className="md:text-base md:h-[8rem] h-[12rem] line-clamp-3 flex-wrap text-sm bg-black break-all text-transparent bg-clip-text">
                    {userData[0].params.user_data.bio[0]}
                  </h1>
                </div>

                <div className="border border-gray-400 w-full mt-2 mb-4 relative " />

                <div className="flex flex-col md:flex-row justify-between items-start gap-3 text-sm w-full">
                  {/* Left Column */}
                  <div className="flex flex-col md:w-1/2 w-full">
                    {/* DApp Link */}
                    <div className="flex flex-col mb-4 md:mb-6">
                      <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">
                        Daap Link:
                      </h2>
                      <p className="text-[#7283EA] text-xs font-semibold md:text-sm truncate px-4">
                        {/* {orignalData?.dappLink || "Not available"} */}
                      </p>
                    </div>

                    {/* Project Elevator Pitch */}
                    <div className="flex flex-col mb-4 md:mb-6">
                      <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">
                        Project Elevator Pitch:
                      </h2>
                      <p className="text-[#7283EA] text-xs font-semibold md:text-sm truncate px-4">
                        {/* {orignalData?.projectElevatorPitch || "Not available"} */}
                      </p>
                    </div>

                    {/* Promotional Video */}
                    <div className="flex flex-col mb-4 md:mb-6">
                      <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">
                        Promotional Video:
                      </h2>
                      <p className="text-[#7283EA] text-xs font-semibold md:text-sm truncate px-4">
                        {/* {orignalData?.promotionalVideo || "Not available"} */}
                      </p>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="flex flex-col md:w-1/2 w-full">
                    {/* Website */}
                    <div className="flex flex-col mb-4 md:mb-6">
                      <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">
                        Website:
                      </h2>
                      <p className="text-[#7283EA] text-xs font-semibold md:text-sm truncate px-4">
                        {/* {orignalData?.projectWebsite || "Not available"} */}
                      </p>
                    </div>

                    {/* Long Term Goal */}
                    <div className="flex flex-col mb-4 md:mb-6">
                      <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">
                        Long Term Goal:
                      </h2>
                      <p className="text-[#7283EA] text-xs font-semibold md:text-sm truncate px-4">
                        {/* {orignalData?.longTermGoals || "Not available"} */}
                      </p>
                    </div>

                    {/* Token Economics */}
                    <div className="flex flex-col mb-4 md:mb-6">
                      <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">
                        Token Economics:
                      </h2>
                      <p className="text-[#7283EA] text-xs font-semibold md:text-sm truncate px-4">
                        {/* {orignalData?.tokenEconomics || "Not available"} */}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 
          <div className="flex flex-col gap-2 h-[275px] bg-gray-100 px-[1%] rounded-md mt-2  overflow-y-auto py-2">
            {Allrole &&
              Allrole.length > 0 &&
              Allrole.filter(
                (role) =>
                  role.approved_on[0] ||
                  role.rejected_on[0] ||
                  role.requested_on[0]
              ).map((role, index) => (
                <div key={index} className="flex justify-around items-center">
                  <button
                    className={`flex px-4 items-center md:w-[400px] w-full h-[90px] ${getButtonClass(
                      role.status
                    )} rounded-md `}
                  >
                    <div className="xl:lg:ml-4">{Profile2}</div>
                    <p className="flex justify-center items-center text-white p-2 text-sm">
                      {constructMessage(role)}
                    </p>
                  </button>
                </div>
              ))}
          </div> */}
          </div>
        </div>
      </div>

      {/* <div className="w-full flex gap-4  md:flex-row flex-col mt-4">
          <div className="flex flex-col md:w-1/4 w-full">
            <div className=" bg-[#D2D5F2] flex  flex-col shadow-md shadow-gray-400 p-6 rounded-lg  w-full mb-4">
              <h1 className="text-xl font-bold text-gray-800  mb-2">
                Private Documents
              </h1>
              <div className="flex flex-row gap-2  px-2 py-1 items-center">
                <img src={pdfSvg} alt="PDF Icon" className="w-10 h-12" />
                <div className="overflow-hidden">
                  <div className="space-y-4 w-full">
                    {orignalData?.privateDocs.map((doc, index) => (
                      <div
                        key={index}
                        className="truncate flex flex-col items-start"
                      >
                        <div className="flex-grow">
                          <a
                            href={doc.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-800 text-xs truncate font-medium justify-self-end"
                            title={doc.title}
                          >
                            {doc.title}
                          </a>
                        </div>
                        <div className="flex justify-end">
                          <p className="text-gray-600 text-sm mt-2 break-words">
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
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className=" bg-[#D2D5F2] flex  flex-col shadow-md shadow-gray-400 p-6 rounded-lg  w-full mb-4">
              <h1 className="text-xl font-bold text-gray-800  mb-2">
                Public Documents
              </h1>
              <div className="flex flex-row gap-2  px-2 py-1 items-center">
                <img src={pdfSvg} alt="PDF Icon" className="w-10 h-12" />
                <div className="overflow-hidden">
                  <div className="space-y-4 w-full">
                    {orignalData?.publicDocs.map((doc, index) => (
                      <div
                        key={index}
                        className="truncate flex flex-col items-start"
                      >
                        <div className="flex-grow">
                          <a
                            href={doc.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-800 text-xs truncate font-medium justify-self-end"
                            title={doc.title}
                          >
                            {doc.title}
                          </a>
                        </div>
                        <div className="flex justify-end">
                          <p className="text-gray-600 text-sm mt-2 break-words">
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
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className=" bg-[#D2D5F2] md:px-[4%] flex md:flex-row flex-col shadow-md shadow-gray-400 pb-6 pt-4 rounded-lg md:w-3/4 w-full">
            <div className="flex flex-col md:w-1/2 w-full">
              <div className="flex flex-col mb-4 md:mb-6">
                <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">
                  Country of Registration:
                </h2>
                <p className="text-md  font-normal text-gray-600 pl-6">
                  {orignalData?.countryOfRegistration ? (
                    <span>{orignalData?.countryOfRegistration}</span>
                  ) : (
                    <span className="flex items-center">
                      {noDataPresentSvg}
                      Data Not Available
                    </span>
                  )}
                </p>
              </div>

              <div className="flex flex-col mb-4 md:mb-6">
                <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">
                  Uploaded Private Docs :
                </h2>
                <p className="text-md  font-normal text-gray-600 pl-6">
                  {orignalData?.uploadPrivateDocuments ? (
                    "Yes"
                  ) : "No" ? (
                    <span>
                      {orignalData?.uploadPrivateDocuments ? "Yes" : "No"}
                    </span>
                  ) : (
                    <span className="flex items-center">
                      {noDataPresentSvg}
                      Data Not Available
                    </span>
                  )}
                </p>
              </div>

              <div className="flex flex-col mb-4 md:mb-6">
                <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">
                  Money Raised Till Now :
                </h2>
                <p className="text-md  font-normal text-gray-600 pl-6">
                  {orignalData?.moneyRaisedTillNow ? (
                    "Yes"
                  ) : "No" ? (
                    <span>
                      {orignalData?.moneyRaisedTillNow ? "Yes" : "No"}
                    </span>
                  ) : (
                    <span className="flex items-center">
                      {noDataPresentSvg}
                      Data Not Available
                    </span>
                  )}
                </p>
              </div>

              <div className="flex flex-col mb-4 md:mb-6">
                <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">
                  Project Area Of Focus :
                </h2>
                <p className="text-md  font-normal text-gray-600 pl-6">
                  {orignalData.projectAreaOfFocus ? (
                    <span>{orignalData.projectAreaOfFocus}</span>
                  ) : (
                    <span className="flex items-center">
                      {noDataPresentSvg}
                      Data Not Available
                    </span>
                  )}
                </p>
              </div>

              <div className="flex flex-col mb-4 md:mb-6">
                <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">
                  Area Of Interest :
                </h2>
                <p className="text-md  font-normal text-gray-600 pl-6">
                  {orignalData?.areaOfInterest ? (
                    <span>{orignalData?.areaOfInterest}</span>
                  ) : (
                    <span className="flex items-center">
                      {noDataPresentSvg}
                      Data Not Available
                    </span>
                  )}
                </p>
              </div>

              <div className="flex flex-col mb-4 md:mb-6">
                <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">
                  Live On Mainnet :
                </h2>
                <p className="text-md  font-normal text-gray-600 pl-6">
                  {orignalData?.liveOnIcpMainnet ? (
                    "Yes"
                  ) : "No" ? (
                    <span>{orignalData?.liveOnIcpMainnet ? "Yes" : "No"}</span>
                  ) : (
                    <span className="flex items-center">
                      {noDataPresentSvg}
                      Data Not Available
                    </span>
                  )}
                </p>
              </div>

              <div className="flex flex-col mb-4 md:mb-6">
                <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">
                  Type of Registration :
                </h2>
                <p className="text-md  font-normal text-gray-600 pl-6">
                  {orignalData?.typeOfRegistration ? (
                    <span>{orignalData?.typeOfRegistration}</span>
                  ) : (
                    <span className="flex items-center">
                      {noDataPresentSvg}
                      Data Not Available
                    </span>
                  )}
                </p>
              </div>

              <div className="flex flex-col mb-4 md:mb-6">
                <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">
                  Reason to join Incubator :
                </h2>
                <p className="text-md  font-normal text-gray-600 pl-6">
                  {orignalData?.reasonToJoinIncubator ? (
                    <span>{orignalData?.reasonToJoinIncubator}</span>
                  ) : (
                    <span className="flex items-center">
                      {noDataPresentSvg}
                      Data Not Available
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex flex-col md:w-1/2 w-full">
              <div className="flex flex-col mb-4 md:mb-6">
                <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">
                  Project Registered :
                </h2>
                <p className="text-md  font-normal text-gray-600 pl-6">
                  {orignalData?.isYourProjectRegistered ? (
                    "Yes"
                  ) : "No" ? (
                    <span>
                      {orignalData?.isYourProjectRegistered ? "Yes" : "No"}
                    </span>
                  ) : (
                    <span className="flex items-center">
                      {noDataPresentSvg}
                      Data Not Available
                    </span>
                  )}
                </p>
              </div>

              <div className="flex flex-col mb-4 md:mb-6">
                <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">
                  Support Multichain :
                </h2>
                <p className="text-md  font-normal text-gray-600 pl-6">
                  {orignalData?.supportsMultichain ? (
                    <span>{orignalData?.supportsMultichain}</span>
                  ) : (
                    <span className="flex items-center">
                      {noDataPresentSvg}
                      Data Not Available
                    </span>
                  )}
                </p>
              </div>

              <div className="flex flex-col mb-4 md:mb-6">
                <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">
                  Preferred ICP Hub :
                </h2>
                <p className="text-md  font-normal text-gray-600 pl-6">
                  {orignalData?.preferredIcpHub ? (
                    <span>{orignalData?.preferredIcpHub}</span>
                  ) : (
                    <span className="flex items-center">
                      {noDataPresentSvg}
                      Data Not Available
                    </span>
                  )}
                </p>
              </div>

              <div className="flex flex-col mb-4 md:mb-6">
                <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">
                  Mentor Assigned :
                </h2>
                <p className="text-md  font-normal text-gray-600 pl-6">
                  {orignalData?.mentorsAssigned ? (
                    <span>{orignalData?.mentorsAssigned}</span>
                  ) : (
                    <span className="flex items-center">
                      {noDataPresentSvg}
                      Data Not Available
                    </span>
                  )}
                </p>
              </div>

              <div className="flex flex-col mb-4 md:mb-6">
                <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">
                  Project Team :
                </h2>
                <p className="text-md  font-normal text-gray-600 pl-6">
                  {orignalData?.projectTeams ? (
                    "Yes"
                  ) : "No" ? (
                    <span>{orignalData?.projectTeams ? "Yes" : "No"}</span>
                  ) : (
                    <span className="flex items-center">
                      {noDataPresentSvg}
                      Data Not Available
                    </span>
                  )}
                </p>
              </div>

              <div className="flex flex-col mb-4 md:mb-6">
                <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">
                  Target Market :
                </h2>
                <p className="text-md  font-normal text-gray-600 pl-6">
                  {orignalData?.targetMarket ? (
                    <span>{orignalData?.targetMarket}</span>
                  ) : (
                    <span className="flex items-center">
                      {noDataPresentSvg}
                      Data Not Available
                    </span>
                  )}
                </p>
              </div>

              <div className="flex flex-col mb-4 md:mb-6">
                <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">
                  VC's assigned :
                </h2>
                <p className="text-md  font-normal text-gray-600 pl-6">
                  {orignalData?.vcsAssigned ? (
                    <span>{orignalData?.vcsAssigned}</span>
                  ) : (
                    <span className="flex items-center">
                      {noDataPresentSvg}
                      Data Not Available
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div> */}

      <div className="w-full">
        <div className=" bg-white  shadow-md shadow-gray-400 pb-6 pt-4 rounded-lg w-full">
          <div className="w-full flex  md:flex-row flex-col md:items-start items-center justify-around px-[4%] py-4">
            <div className="flex md:flex-row flex-col w-full gap-2">
              <div className="relative">
                <img
                  className="md:w-[6rem] object-fill md:h-[6rem] w-[4rem] h-[4rem]  justify-center aspect-square rounded-md"
                  src={Project_cover}
                  alt="description"
                />
              </div>
              <div className="flex flex-col pl-4  mt-2 w-auto justify-start md:mb-0 mb-6">
                <div className="flex flex-row gap-4 items-center w-full md:w-[248px] lg:w-[500px]">
                  <h1 className="text-xl md:text-3xl font-bold bg-black text-transparent bg-clip-text truncate">
                    {userData[0]?.params?.project_name}
                  </h1>
                </div>

                <div className="flex flex-col items-start gap-3 text-sm">
                  <div className="flex flex-row md:items-center mt-2">
                    <p className="pt-1">{openchat_username}</p>
                    <div className="flex flex-row flex-wrap items-center space-x-2 ml-3 space-y-1">
                      {userData[0]?.params?.user_data?.reason_to_join?.[0].map(
                        (reason, index) => (
                          <p
                            key={index}
                            className="bg-[#c9c5c5] py-0.5 rounded-full px-3"
                          >
                            {reason.replace(/_/g, " ")}
                          </p>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full  flex flex-row items-start justify-start px-[4%]  text-gray-600 md:text-md text-sm">
            <p className="mr-4">{userData[0]?.params?.user_data?.country}</p>
            <ul className="list-disc pl-5">
              <li>Platform joined on {date}</li>
            </ul>
          </div>
        </div>
      </div>
      <div>
        <div className="p-3 flex items-center bg-[#FFFFFF4D] border-[#E9E9E9] border-1 drop-shadow-[#0000000D] rounded-[10px]"></div>
        <div className="flex justify-center">
          <div className="relative w-full mb-6 px-[4%] border-2 border-black overflow-hidden">
            <div className="absolute bottom-0 left-7 top-[-28px] w-[400.31px] h-[450px] bg-blue-100 ellipse-quarter-left rounded-md rotate-90 z-0"></div>
            <div className="absolute top-0 right-0 bg-blue-100 w-[209.63px] h-[210px]  ellipse-quarter-right rounded-md "></div>

            <div className=" flex flex-col items-center h-full relative z-10 w-full">
              <div className="flex flex-col w-full">
                <div className="w-fit text-black  text-3xl font-bold font-fontUse leading-none mt-8">
                  Details
                </div>

                <div className="flex-row justify-center ">
                  <div className="w-full flex flex-col md:flex-row">
                    <div className="w-full mt-6 md:w-1/2 p-4 md:pl-0 pl-1 mr-8 text-[#737373] text-lg font-light font-fontUse mb-4 text-wrap   ">
                      <div className="flex flex-wrap flex-row justify-between items-center w-full">
                        <div className="flex flex-row items-center w-full md:w-[200px] lg:w-[250px]">
                          <h1 className="text-2xl md:text-3xl font-bold bg-black text-transparent bg-clip-text truncate">
                            {userData[0]?.params?.project_name}
                          </h1>
                        </div>
                        <div className="justify-end flex flex-col">
                          <p>{userData[0]?.params?.preferred_icp_hub?.[0]}</p>
                          <p>{date}</p>
                        </div>
                      </div>

                      <div className="border border-gray-400 w-full"></div>
                      <div className="flex flex-row justify-between mt-2">
                        <p className="font-bold">
                          {userData[0]?.params?.user_data?.full_name}
                        </p>
                        <div className="flex flex-row space-x-1">
                          <a
                            href={userData[0]?.params?.project_linkedin?.[0]}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {linkedInSvgBig}
                          </a>
                          <a
                            href={userData[0]?.params?.project_twitter?.[0]}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {twitterSvgBig}
                          </a>
                        </div>
                      </div>
                      <p>{userData[0]?.params?.user_data?.email}</p>
                      <div className="border border-gray-400 w-full"></div>
                      <div className="flex flex-row justify-between mt-2">
                        <p className="">
                          {userData[0]?.params?.user_data?.country}
                        </p>
                        <div className="flex flex-row space-x-1">
                          <a
                            href={userData[0]?.params?.github_link?.[0]}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {githubSvgBig}
                          </a>
                          <a
                            href={userData[0]?.params?.project_discord?.[0]}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {discordSvgBig}
                          </a>
                        </div>
                      </div>
                      <div className="border border-gray-400 w-full mt-2"></div>
                    </div>

                    <div className="flex flex-col  bg-[#B9C0F2] relative w-full md:w-1/2 gap-4 rounded-md p-2 text-[#737373] h-[230px] mt-8 justify-between overflow-y-auto">
                      <div className="ml-4 mr-20 mt-4 font-serif font-bold">
                        <div className="flex flex-row justify-between space-x-2">
                          <p>Weekly Active</p>
                          <p className="font-extrabold items-center">
                            {weeklyUsers}
                          </p>
                        </div>
                        <div className="flex flex-row justify-between mt-2 space-x-2">
                          <p>Revenue</p>
                          <p className="font-extrabold items-center">
                            {revenueNum}
                          </p>
                        </div>
                        <div className="flex flex-row justify-between mt-2 space-x-2">
                          <p>ICP Grants</p>
                          <p className="font-extrabold items-center">
                            {icpGrants}
                          </p>
                        </div>
                        <div className=" flex flex-row justify-between mt-2 space-x-2">
                          <p>Investors</p>
                          <p className="font-extrabold items-center">
                            {investorInvest}
                          </p>
                        </div>
                        <div className="flex flex-row justify-between mt-2 space-x-2">
                          <p>Raised from Other Ecosysytem</p>
                          <p className="font-extrabold items-center">
                            {otherEcosystem}
                          </p>
                        </div>
                        <div className="flex flex-row justify-between mt-2 space-x-2">
                          <p> Targeted Amount</p>
                          <p className="font-extrabold items-center">
                            {targetAmount}
                          </p>
                        </div>
                        <div className="flex flex-row justify-between mt-2 space-x-2">
                          <p>Sns</p>
                          <p className="font-extrabold">{snsGrants}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="border border-gray-400 w-full mt-6 relative "></div>

                <div className="absolute xl:lg:top-[500px] md:top-[700px] top-[700px] right-[-95px] flex  bg-blue-100 w-[190.63px] h-[190px]  border rounded-full  "></div>

                {logo && (
                  <div className="flex flex-col md:flex-row items-center justify-around w-full mt-4">
                    <div className="md:w-1/2 w-full md:flex md:items-center">
                      <div className="flex flex-col items-start md:flex-row md:items-center w-full p-4">
                        <img
                          className="w-28 h-28 md:w-36 md:h-36 lg:w-44 lg:h-44 xl:w-48 xl:h-48 md:mx-0 rounded-full"
                          src={profile}
                          alt="profile picture"
                        />
                        <div className="mt-4 md:mt-0 md:ml-4 text-start md:text-left">
                          <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-gray-800">
                            Profile Image
                          </h2>
                          <p className="text-sm md:text-base text-gray-600">
                            A detailed view of the individual's profile.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="md:w-1/2 w-full md:flex md:items-center">
                      <div className="flex flex-col items-start md:flex-row md:items-center w-full p-4">
                        <img
                          className="w-28 h-28 md:w-36 md:h-36 lg:w-44 lg:h-44 xl:w-48 xl:h-48 md:mx-0 rounded-full"
                          src={logo}
                          alt="company logo"
                        />
                        <div className="mt-4 md:mt-0 md:ml-4 text-start md:text-left">
                          <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-gray-800">
                            Company Logo
                          </h2>
                          <p className="text-sm md:text-base text-gray-600">
                            Representative logo of the organization.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <h1 className="text-3xl font-bold text-gray-800 mb-2 mt-6">
                  About Project
                </h1>
                <p className="text-gray-600 text-lg mb-10 break-all">
                  {userData[0]?.params?.project_description?.[0]}
                </p>

                <div className="flex md:flex-row flex-col justify-between md:items-center items-start w-full">
                  <div className="md:w-1/2 w-3/4 flex flex-row items-center justify-start sm:text-left pr-4">
                    <h2 className="text-xl sm:text-xl font-bold text-gray-800 mb-2 sm:mb-0 mr-2">
                      Daap Link:
                    </h2>
                    <div className="flex flex-grow items-center truncate">
                      <p className="text-gray-600 text-sm md:text-md truncate px-4">
                        {userData[0]?.params?.dapp_link?.[0]}
                      </p>
                      <a
                        href={userData[0]?.params?.dapp_link?.[0]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pl-2"
                      >
                        {openWebsiteIcon}
                      </a>{" "}
                    </div>
                  </div>

                  <div className="flex md:w-1/2 w-3/4 items-center text-center sm:text-left md:pl-4">
                    <h2 className="text-xl sm:text-xl font-bold text-gray-800 mb-2 mr-2">
                      Website:
                    </h2>
                    <div className="flex flex-grow items-center truncate  z-10">
                      <p className="text-gray-600 text-sm md:text-md truncate">
                        {userData[0]?.params?.project_website?.[0]}
                      </p>
                      <a
                        href={userData[0]?.params?.project_website?.[0]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 pl-2"
                      >
                        {openWebsiteIcon}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex md:flex-row flex-col justify-between md:items-center items-start w-full">
                  <div className="md:w-1/2 w-3/4 flex flex-row items-center justify-start sm:text-left pr-4">
                    <h2 className="text-xl sm:text-xl font-bold text-gray-800 mb-2 sm:mb-0 mr-2">
                      Project_Elevator Pitch:
                    </h2>
                    <div className="flex flex-grow items-center truncate">
                      <p className="text-gray-600 text-sm md:text-md truncate px-4">
                        {userData[0]?.params?.project_elevator_pitch?.[0]}
                      </p>
                      <a
                        href={userData[0]?.params?.project_elevator_pitch?.[0]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pl-2"
                      >
                        {openWebsiteIcon}
                      </a>{" "}
                    </div>
                  </div>

                  <div className="flex md:w-1/2 w-3/4 items-center text-center sm:text-left md:pl-4">
                    <h2 className="text-xl sm:text-xl font-bold text-gray-800 mb-2 mr-2">
                      Long Term Goal:
                    </h2>
                    <div className="flex flex-grow items-center truncate  z-10">
                      <p className="text-gray-600 text-sm md:text-md truncate">
                        {userData[0]?.params?.long_term_goals?.[0]}
                      </p>
                      <a
                        href={userData[0]?.params?.long_term_goals?.[0]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 pl-2"
                      >
                        {openWebsiteIcon}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex md:flex-row flex-col justify-between md:items-center items-start w-full">
                  <div className="md:w-1/2 w-3/4 flex flex-row items-center justify-start sm:text-left pr-4">
                    <h2 className="text-xl sm:text-xl font-bold text-gray-800 mb-2 sm:mb-0 mr-2">
                      Promotional Video:
                    </h2>
                    <div className="flex flex-grow items-center truncate">
                      <p className="text-gray-600 text-sm md:text-md truncate px-4">
                        {userData[0]?.params?.promotional_video?.[0]}
                      </p>
                      <a
                        href={userData[0]?.params?.promotional_video?.[0]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pl-2"
                      >
                        {openWebsiteIcon}
                      </a>{" "}
                    </div>
                  </div>

                  <div className="flex md:w-1/2 w-3/4 items-center text-center sm:text-left md:pl-4">
                    <h2 className="text-xl sm:text-xl font-bold text-gray-800 mb-2 mr-2">
                      Token Economics:
                    </h2>
                    <div className="flex flex-grow items-center truncate  z-10">
                      <p className="text-gray-600 text-sm md:text-md truncate">
                        {userData[0]?.params?.token_economics?.[0]}
                      </p>
                      <a
                        href={userData[0]?.params?.token_economics?.[0]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 pl-2"
                      >
                        {openWebsiteIcon}
                      </a>
                    </div>
                  </div>
                </div>

                {userData[0]?.params?.private_docs?.[0] &&
                  userData[0]?.params?.private_docs?.[0].length > 0 && (
                    <div className="bg-white shadow-md shadow-gray-400 pb-6 pt-4 rounded-lg w-full mt-4">
                      <div className="px-6 py-4">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                          Private Documents
                        </h2>
                        <div className="space-y-4">
                          {userData[0]?.params?.private_docs?.[0].map(
                            (doc, index) => (
                              <div
                                key={index}
                                className="bg-gray-100 rounded p-3 hover:bg-gray-200 transition duration-150 ease-in-out"
                              >
                                <a
                                  href={doc.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-gray-800 font-medium hover:underline"
                                >
                                  {doc.title}
                                </a>
                                <p className="text-gray-600 text-sm mt-2 break-words">
                                  URL:{" "}
                                  <a
                                    href={doc.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline"
                                  >
                                    {doc.link}
                                  </a>
                                </p>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                {userData[0]?.params?.public_docs?.[0] &&
                  userData[0]?.params?.public_docs?.[0].length > 0 && (
                    <div className="bg-white shadow-md shadow-gray-400 pb-6 pt-4 rounded-lg w-full mt-4">
                      <div className="px-6 py-4">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                          Public Documents
                        </h2>
                        <div className="space-y-4">
                          {userData[0]?.params?.public_docs?.[0].map(
                            (doc, index) => (
                              <div
                                key={index}
                                className="bg-gray-100 rounded p-3 hover:bg-gray-200 transition duration-150 ease-in-out"
                              >
                                <a
                                  href={doc.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-gray-800 font-medium hover:underline"
                                >
                                  {doc.title}
                                </a>
                                <p className="text-gray-600 text-sm mt-2 break-words">
                                  URL:{" "}
                                  <a
                                    href={doc.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline"
                                  >
                                    {doc.link}
                                  </a>
                                </p>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                <div className="flex md:flex-row flex-col items-center justify-around w-full mt-10">
                  <div className=" md:w-1/2 w-full flex flex-row md:items-center items-start justify-start">
                    <h1 className="text-lg font-normal text-gray-600">
                      Country of Registration :
                    </h1>
                    <p className="text-lg font-bold text-gray-800 pl-6">
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

                  <div className=" md:w-1/2 w-full flex flex-row md:items-center items-start justify-start md:pl-5">
                    <h1 className="text-lg font-normal text-gray-600">
                      Project Registered :
                    </h1>
                    <p className="text-lg font-bold text-gray-800 pl-6">
                      {" "}
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
                    </p>
                  </div>
                </div>

                <div className="flex md:flex-row flex-col items-center justify-around w-full mt-4">
                  <div className=" md:w-1/2 w-full flex flex-row md:items-center items-start justify-start">
                    <h1 className="text-lg font-normal text-gray-600">
                      Uploaded Private Docs :
                    </h1>
                    <p className="text-lg font-bold text-gray-800 pl-6">
                      {" "}
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
                    </p>
                  </div>

                  <div className=" md:w-1/2 w-full flex flex-row md:items-center items-start justify-start md:pl-5">
                    <h1 className="text-lg font-normal text-gray-600">
                      Support Multichain :
                    </h1>
                    <p className="text-lg font-bold text-gray-800 pl-6">
                      {userData[0]?.params?.supports_multichain?.[0] ? (
                        <span>
                          {userData[0]?.params?.supports_multichain?.[0]}
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

                <div className="flex md:flex-row flex-col items-center justify-around w-full mt-10">
                  <div className=" md:w-1/2 w-full flex flex-row md:items-center items-start justify-start">
                    <h1 className="text-lg font-normal text-gray-600">
                      Money Raised Till Now :
                    </h1>
                    <p className="text-lg font-bold text-gray-800 pl-6">
                      {" "}
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
                    </p>
                  </div>

                  <div className=" md:w-1/2 w-full flex flex-row md:items-center items-start justify-start md:pl-5">
                    <h1 className="text-lg font-normal text-gray-600">
                      Preferred ICP Hub :
                    </h1>
                    <p className="text-lg font-bold text-gray-800 pl-6">
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

                <div className="flex md:flex-row flex-col items-center justify-around w-full mt-4">
                  <div className=" md:w-1/2 w-full flex flex-row md:items-center items-start justify-start">
                    <h1 className="text-lg font-normal text-gray-600">
                      Project Area Of Focus :
                    </h1>
                    <p className="text-lg font-bold text-gray-800 pl-6">
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

                  <div className=" md:w-1/2 w-full flex flex-row md:items-center items-start justify-start md:pl-5">
                    <h1 className="text-lg font-normal text-gray-600">
                      Mentor Assigned :
                    </h1>
                    <p className="text-lg font-bold text-gray-800 pl-6">
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

                <div className="flex md:flex-row flex-col items-center justify-around w-full mt-10 ">
                  <div className=" md:w-1/2 w-full flex flex-row md:items-center items-start justify-start ">
                    <h1 className="text-lg font-normal text-gray-600">
                      Area Of Interest :
                    </h1>
                    <p className="text-lg font-bold text-gray-800 pl-6 overflow-x-auto">
                      {userData[0].params.user_data.area_of_interest ? (
                        <span>
                          {userData[0].params.user_data.area_of_interest}
                        </span>
                      ) : (
                        <span className="flex items-center">
                          {noDataPresentSvg}
                          Data Not Available
                        </span>
                      )}
                    </p>
                  </div>

                  <div className=" md:w-1/2 w-full flex flex-row md:items-center items-start justify-start md:pl-5">
                    <h1 className="text-lg font-normal text-gray-600">
                      Project Team :
                    </h1>
                    <p className="text-lg font-bold text-gray-800 pl-6">
                      {" "}
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
                    </p>
                  </div>
                </div>

                <div className="flex md:flex-row flex-col items-center justify-around w-full mt-4">
                  <div className=" md:w-1/2 w-full flex flex-row md:items-center items-start justify-start ">
                    <h1 className="text-lg font-normal text-gray-600">
                      Live On Mainnet :
                    </h1>
                    <p className="text-lg font-bold text-gray-800 pl-6">
                      {" "}
                      {userData[0].params.live_on_icp_mainnet[0] ? (
                        "Yes"
                      ) : "No" ? (
                        <span>
                          {userData[0].params.live_on_icp_mainnet[0]
                            ? "Yes"
                            : "No"}
                        </span>
                      ) : (
                        <span className="flex items-center">
                          {noDataPresentSvg}
                          Data Not Available
                        </span>
                      )}
                    </p>
                  </div>
                  <div className=" md:w-1/2 w-full flex flex-row md:items-center items-start justify-start md:pl-5">
                    <h1 className="text-lg font-normal text-gray-600">
                      Target Market :
                    </h1>
                    <p className="text-lg font-bold text-gray-800 pl-6">
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

                <div className="flex md:flex-row flex-col items-center justify-around w-full mt-10">
                  <div className=" md:w-1/2 w-full flex flex-row md:items-center items-start justify-start">
                    <h1 className="text-lg font-normal text-gray-600">
                      Type of Registration :
                    </h1>
                    <p className="text-lg font-bold text-gray-800 pl-6">
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
                  <div className=" md:w-1/2 w-full flex flex-row md:items-center items-start justify-start md:pl-5">
                    <h1 className="text-lg font-normal text-gray-600">
                      VC's assigned :
                    </h1>
                    <p className="text-lg font-bold text-gray-800 pl-6">
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

                <div className="flex md:flex-row flex-col items-center justify-around w-full mt-4 mb-10">
                  <div className=" md:w-full w-full flex flex-row md:items-center items-start justify-start">
                    <h1 className="text-lg font-normal text-gray-600">
                      Reason to join Incubator :
                    </h1>
                    <p className="text-lg font-bold text-gray-800 pl-6 overflow-x-auto">
                      {userData[0].params.reason_to_join_incubator ? (
                        <span>
                          {userData[0].params.reason_to_join_incubator}
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
              </div>
            </div>
          </div>
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
                  className="px-5 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-gray-100"
                >
                  {isDeclining ? (
                    <ThreeDots color="#FFF" height={13} width={51} />
                  ) : (
                    "Decline"
                  )}
                </button>
                <button
                  onClick={() =>
                    allowUserRoleHandler(principal, true, "Pending", role.name)
                  }
                  disabled={isAccepting}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
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

export default Projectdetails;

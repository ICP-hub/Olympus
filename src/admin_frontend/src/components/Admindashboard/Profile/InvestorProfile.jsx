import React, { useState, useEffect } from "react";
import "react-circular-progressbar/dist/styles.css";
import {
  place,
  Profile2,
  telegramSVg,
  noDataPresentSvg,
  place1,
  websiteSvg,
  linkSvg,
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
import { investorApprovedRequest } from "../../AdminStateManagement/Redux/Reducers/investorApproved";
import { investorDeclinedRequest } from "../../AdminStateManagement/Redux/Reducers/investorDecline";
import openchat_username from "../../../../assets/image/spinner.png";
import { linkedInSvg } from "../../../../../IcpAccelerator_frontend/src/component/Utils/Data/SvgData";
import { Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { twitterSvg } from "../../../../../IcpAccelerator_frontend/src/component/Utils/Data/SvgData";

const InvestorProfile = ({ userData, Allrole, principal }) => {
  const actor = useSelector((currState) => currState.actors.actor);

  const [current, setCurrent] = useState("user");
  const [isAccepting, setIsAccepting] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);
  const [isSkillsOpen, setIsSkillsOpen] = useState(false);
  const [isReasonToJoinOpen, setIsReasonToJoinOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //   const notificationDetails = location.state;

  console.log("userData in investor profile", userData[0]);
  // console.log("Allrole in investor profile", Allrole);

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
      // console.log("Converted Principal ", covertedPrincipal);

      switch (category) {
        case "vc":
          if (state === "Pending") {
            await actor.decline_vc_creation_request(covertedPrincipal, boolean);
            await dispatch(investorDeclinedRequest());
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
        case "vc":
          if (state === "Pending") {
            await actor.approve_vc_creation_request(covertedPrincipal, boolean);
            await dispatch(investorApprovedRequest());
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

  const date = numberToDate(Allrole[3].requested_on[0]);
  const profile = uint8ArrayToBase64(
    userData[0].params.user_data.profile_picture[0]
  );
  const logo =
    userData && userData[0]?.params.logo[0]?.length > 0
      ? uint8ArrayToBase64(userData[0].params.logo[0])
      : null;

  return (
    <>
      <div className="w-full flex flex-col">
        <div className="w-full flex gap-4 flex-col md:flex-row">
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
                  className="object-cover max-h-44 rounded-full"
                  src={profile}
                  alt=""
                />
              </div>
            </div>

            <div className="flex flex-col ml-4  mt-2 w-auto justify-start md:mb-0 mb-6">
              <div className="flex flex-row flex-wrap mb-3 gap-4 items-center">
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
                  <span className="ml-2 w-full truncate">
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
                  <div className="ml-2 truncate">
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
                    <p className="ml-2">
                      {userData[0].params.user_data.openchat_username[0]}
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
                      <div className="flex gap-2 text-xs flex-wrap overflow-y-scroll h-14 items-center">
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
                        {userData[0]?.params?.user_data?.reason_to_join?.[0].map(
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
                          <div className="flex justify-center items-center text-white p-2 text-sm ">
                            {constructMessage(role)}
                          </div>
                        </button>
                      </div>
                    </SwiperSlide>
                  ))}
              </Swiper>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">About Investor</h1>

            <div className="text-gray-600 md:text-sm text-xs break-all line-clamp-6 my-3 px-[4%]">
              {userData[0]?.params?.user_data?.bio?.[0] ? (
                userData[0]?.params?.user_data?.bio?.[0]
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
                    Telegram :
                  </h2>
                  <div className="flex flex-grow items-start mt-1.5 truncate">
                    {userData[0].params.user_data.telegram_id[0] ? (
                      <div
                        onClick={() => {
                          const telegramUsername =
                            userData[0].params.user_data.telegram_id[0];
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
                      {userData[0].params.user_data.telegram_id[0] ||
                        "Not available"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col mb-4 md:mb-6">
                  <h2 className="text-lg font-bold text-gray-800 mb-2 sm:mb-0 mr-2">
                    Twitter :
                  </h2>
                  <div className="flex flex-grow mt-1.5 truncate items-start">
                    {userData[0].params.user_data.twitter_id[0] ? (
                      <div
                        onClick={() => {
                          const url =
                            userData[0].params.user_data.twitter_id[0];
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
                      {userData[0].params.user_data.twitter_id[0] ||
                        "Not available"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col mb-4 md:mb-6">
                  <h2 className="text-lg font-bold text-gray-800 mb-2 sm:mb-0 mr-2">
                    Website :
                  </h2>
                  <div className="flex flex-grow mt-1.5 truncate items-start">
                    {userData[0].params.website_link[0] ? (
                      <div
                        onClick={() => {
                          const url = userData[0].params.website_link[0];
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
                      {userData[0].params.website_link[0] || "Not available"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:w-1/2 w-full">
                <div className="flex flex-col mb-4 md:mb-6">
                  <h2 className="text-lg font-bold text-gray-800 mb-2 sm:mb-0 mr-2">
                    LinkedIn :
                  </h2>
                  <div className="flex flex-grow mt-1.5 truncate items-start">
                    {userData[0].params.linkedin_link ? (
                      <div
                        onClick={() => {
                          const url = userData[0].params.linkedin_link;
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
                      {userData[0].params.linkedin_link || "Not available"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col mb-4 md:mb-6">
                  <h2 className="text-lg font-bold text-gray-800 mb-2 sm:mb-0 mr-2">
                    Portfoilo :
                  </h2>
                  <div className="flex flex-grow mt-1.5 truncate items-start">
                    {userData[0].params.portfolio_link ? (
                      <div
                        onClick={() => {
                          const url = userData[0].params.portfolio_link;
                          window.open(url, "_blank");
                        }}
                        className="cursor-pointer mr-2"
                      >
                        {linkSvg}
                      </div>
                    ) : (
                      <div className="flex-shrink-0 w-6 h-6 mr-1">
                        {noDataPresentSvg}
                      </div>
                    )}

                    <p className="text-[#7283EA] text-xs  md:text-sm truncate">
                      {userData[0].params.portfolio_link || "Not available"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full flex gap-4 flex-col md:flex-row mt-4">
          <div className="flex flex-col  w-full   md:w-[26%] sxxs:w-full"></div>
          <div className="flex flex-row justify-between bg-[#D2D5F2] shadow-md shadow-gray-400 p-6 rounded-lg md:w-3/4 sxxs:w-fulll">
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full px-[3%]">
              <li className="list-disc md:ml-4">
                <div className=" flex flex-col text-gray-600">
                  <p className="text-black font-semibold mb-1">
                    Support Multichain :
                  </p>

                  <div className="flex gap-2 text-xs text-gray-600 items-center overflow-y-scroll h-14 flex-wrap">
                    {userData[0]?.params?.project_on_multichain?.[0] &&
                    userData[0].params.project_on_multichain[0] !== "" ? (
                      userData[0]?.params?.project_on_multichain?.[0]
                        .split(",")
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

              <li className="list-disc md:ml-8">
                <div className=" flex flex-col text-gray-600">
                  <p className="text-black font-semibold mb-1">
                    Areas of Invest :
                  </p>

                  <div className="flex gap-2 text-xs text-gray-600 items-center overflow-y-scroll h-14 flex-wrap">
                    {userData[0]?.params?.category_of_investment &&
                    userData[0].params.category_of_investment !== "" ? (
                      userData[0]?.params?.category_of_investment
                        .split(",")
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

              <li className="list-disc  md:ml-4">
                <div className="flex flex-col items-start justify-start sm:text-left">
                  <p className="text-black font-semibold mb-1">
                    At what stage of investment are you currently focusing on?
                  </p>

                  <div className="flex gap-2 text-xs text-gray-600 items-center overflow-y-scroll h-14 flex-wrap">
                    {userData[0]?.params?.stage[0] &&
                    userData[0].params.stage[0] !== "" ? (
                      userData[0]?.params?.stage[0]
                        .split(",")
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

              <li className="list-disc md:ml-8">
                <div className="flex flex-col items-start justify-start sm:text-left">
                  <p className="text-black font-semibold mb-1">
                    What is the typical range of check sizes for your
                    investments?
                  </p>

                  <div className="flex gap-2 text-xs text-gray-600 items-center overflow-y-scroll h-14 flex-wrap">
                    {userData[0]?.params?.range_of_check_size?.[0] &&
                    userData[0].params.range_of_check_size[0] !== "" ? (
                      userData[0]?.params?.range_of_check_size?.[0]
                        .split(",")
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

              <li className="list-disc  md:ml-4">
                <div className="flex flex-col items-start justify-start sm:text-left">
                  <p className="font-semibold text-gray-800 mb-2 sm:mb-0 mr-2">
                    Are you currently serving as an Existing ICP Investror?
                  </p>
                  <div className="text-gray-600 flex flex-grow items-center truncate text-xs">
                    {userData[0].params.existing_icp_investor ? (
                      "Yes"
                    ) : "No" ? (
                      <span>
                        {userData[0].params.existing_icp_investor
                          ? "Yes"
                          : "No"}
                      </span>
                    ) : (
                      <span className="flex items-center">
                        {noDataPresentSvg}
                        No Data
                      </span>
                    )}
                  </div>
                </div>
              </li>

              <li className="list-disc md:ml-8">
                <div className="flex flex-col items-start justify-start sm:text-left">
                  <h2 className=" font-semibold text-gray-800 mb-2 sm:mb-0 mr-2">
                    What is the scope and status of the Existing ICP Project
                    Portfolio?
                  </h2>
                  <div className="text-gray-600 flex flex-grow items-center truncate text-xs">
                    {userData[0]?.params?.investor_type[0] ? (
                      <span>{userData[0]?.params?.investor_type[0]}</span>
                    ) : (
                      <span className="flex items-center text-xs">
                        {noDataPresentSvg}
                        No Data
                      </span>
                    )}
                  </div>
                </div>
              </li>

              <li className="list-disc md:ml-4">
                <div className="flex flex-col items-start justify-start sm:text-left">
                  <h2 className=" font-semibold text-gray-800 mb-2 sm:mb-0 mr-2">
                    What are the preferred ICP hubs ?
                  </h2>
                  <div className="text-gray-600 flex flex-grow items-center truncate text-xs">
                    {userData[0].params.preferred_icp_hub ? (
                      <span>{userData[0].params.preferred_icp_hub}</span>
                    ) : (
                      <span className="flex items-center text-xs">
                        {noDataPresentSvg}
                        No Data
                      </span>
                    )}
                  </div>
                </div>
              </li>

              <li className="list-disc md:ml-8">
                <div className="flex flex-col items-start justify-start sm:text-left">
                  <h2 className=" font-semibold text-gray-800 mb-2 sm:mb-0 mr-2">
                    Have you previously been involved with any ICP hubs ?
                  </h2>
                  <div className="text-gray-600 flex flex-grow items-center truncate text-xs">
                    {userData[0].params.registered_under_any_hub === true ? (
                      "Yes"
                    ) : "No" ? (
                      <span>
                        {userData[0].params.registered_under_any_hub === true
                          ? "Yes"
                          : "No"}
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

              <li className="list-disc md:ml-4">
                <div className="flex flex-col items-start justify-start sm:text-left">
                  <h2 className=" font-semibold text-gray-800 mb-2 sm:mb-0 mr-2">
                    What is the current value or amount of assets under
                    management?
                  </h2>
                  <div className="text-gray-600 flex flex-grow items-center truncate text-xs">
                    {userData[0].params.registered_under_any_hub === true ? (
                      "Yes"
                    ) : "No" ? (
                      <span>
                        {userData[0].params.registered_under_any_hub === true
                          ? "Yes"
                          : "No"}
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

              <li className="list-disc md:ml-8">
                <div className="flex flex-col items-start justify-start sm:text-left">
                  <h2 className=" font-semibold text-gray-800 mb-2 sm:mb-0 mr-2">
                    What is the average size of the checks issued or received?
                  </h2>
                  <div className="text-gray-600 flex flex-grow items-center truncate text-xs">
                    {userData[0].params.average_check_size ? (
                      <span>{userData[0].params.average_check_size}</span>
                    ) : (
                      <span className="flex items-center text-xs">
                        {noDataPresentSvg}
                        No Data
                      </span>
                    )}
                  </div>
                </div>
              </li>

              <li className="list-disc  md:ml-4">
                <div className="flex flex-col items-start justify-start sm:text-left">
                  <p className="font-semibold text-gray-800 mb-2 sm:mb-0 mr-2">
                    What is the total size of the fund you are referring to?
                  </p>
                  <div className="flex gap-2 text-xs text-gray-600 items-center flex-wrap">
                    {userData[0].params.average_check_size ? (
                      <span>{userData[0].params.average_check_size}</span>
                    ) : (
                      <span className="flex items-center text-xs">
                        {noDataPresentSvg}
                        No Data
                      </span>
                    )}
                  </div>
                </div>
              </li>

              <li className="list-disc md:ml-8">
                <div className="flex flex-col items-start justify-start sm:text-left">
                  <h2 className=" font-semibold text-gray-800 mb-2 sm:mb-0 mr-2">
                    How much money have you invested?
                  </h2>
                  <div className="text-gray-600 flex flex-grow items-center truncate text-xs">
                    {userData[0].params.money_invested[0] ? (
                      <span>{userData[0].params.money_invested[0]}</span>
                    ) : (
                      <span className="flex items-center text-xs">
                        {noDataPresentSvg}
                        No Data
                      </span>
                    )}
                  </div>
                </div>
              </li>

              <li className="list-disc  md:ml-4">
                <div className="flex flex-col items-start justify-start sm:text-left">
                  <p className="font-semibold text-gray-800 mb-2 sm:mb-0 mr-2">
                    Have you made any previous registrations?
                  </p>
                  <div className="flex gap-2 text-xs text-gray-600 items-center flex-wrap">
                    {userData[0].params.registered === true ? (
                      "Yes"
                    ) : "No" ? (
                      <span>
                        {userData[0].params.registered === true ? "Yes" : "No"}
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

              <li className="list-disc md:ml-8">
                <div className="flex flex-col items-start justify-start sm:text-left">
                  <h2 className=" font-semibold text-gray-800 mb-2 sm:mb-0 mr-2">
                    In which country are you registered?
                  </h2>
                  <div className="text-gray-600 flex flex-grow items-center truncate text-xs">
                    {place}
                    {userData[0].params.registered_country[0] ? (
                      <span className="ml-2">
                        {userData[0].params.registered_country[0]}
                      </span>
                    ) : (
                      <span className="flex items-center text-xs">No Data</span>
                    )}
                  </div>
                </div>
              </li>

              <li className="list-disc  md:ml-4">
                <div className="flex flex-col items-start justify-start sm:text-left">
                  <p className="font-semibold text-gray-800 mb-2 sm:mb-0 mr-2">
                    How many portfolio companies do you currently have?
                  </p>
                  <div className="flex gap-2 text-xs text-gray-600 items-center flex-wrap">
                    {userData[0].params.number_of_portfolio_companies ? (
                      <span>
                        {userData[0].params.number_of_portfolio_companies}
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

              <li className="list-disc md:ml-8">
                <div className="flex flex-col items-start justify-start sm:text-left">
                  <h2 className=" font-semibold text-gray-800 mb-2 sm:mb-0 mr-2">
                    What is the name of the fund you are referring to?
                  </h2>
                  <div className="text-gray-600 flex flex-grow items-center truncate text-xs">
                    {userData[0].params.name_of_fund ? (
                      <span>{userData[0].params.name_of_fund}</span>
                    ) : (
                      <span className="flex items-center text-xs">
                        {noDataPresentSvg}
                        No Data
                      </span>
                    )}
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {Allrole?.map((role, index) => {
          const roleName = role.name === "vc" ? "vc" : role.name;
          if (role.status === "requested" && roleName === "vc") {
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
                    allowUserRoleHandler(principal, true, "Pending", role.name)
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
    </>
  );
};

export default InvestorProfile;

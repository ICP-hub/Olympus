import React, { useState, useEffect } from "react";
import "react-circular-progressbar/dist/styles.css";
import {
  place,
  Profile2,
  telegramSVg,
  noDataPresentSvg,
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
import { linkedInSvg } from "../../../../../IcpAccelerator_frontend/src/components/Utils/Data/SvgData";
import { Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { twitterSvg } from "../../../../../IcpAccelerator_frontend/src/components/Utils/Data/SvgData";

const InvestorProfile = ({ userData, Allrole, principal }) => {
  const actor = useSelector((currState) => currState.actors.actor);

  const [current, setCurrent] = useState("user");
  const [isAccepting, setIsAccepting] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);

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
    userData && userData[0].params.logo[0].length > 0
      ? uint8ArrayToBase64(userData[0].params.logo[0])
      : null;

  return (
    <>
      <div className="w-full">
        <div className="flex gap-4 sxxs:flex-col sm:flex-row w-full">
          <div className="md:w-3/4 sxxs:w-full space-y-4">
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
                    <divath d="M256 64C150 64 64 150 64 256s86 192 192 192c17.7 0 32 14.3 32 32s-14.3 32-32 32C114.6 512 0 397.4 0 256S114.6 0 256 0S512 114.6 512 256v32c0 53-43 96-96 96c-29.3 0-55.6-13.2-73.2-33.9C320 371.1 289.5 384 256 384c-70.7 0-128-57.3-128-128s57.3-128 128-128c27.9 0 53.7 8.9 74.7 24.1c5.7-5 13.1-8.1 21.3-8.1c17.7 0 32 14.3 32 32v80 32c0 17.7 14.3 32 32 32s32-14.3 32-32V256c0-106-86-192-192-192zm64 192a64 64 0 1 0 -128 0 64 64 0 1 0 128 0z" />
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
                      <divath d="M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H64C28.7 64 0 92.7 0 128v16 48V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V192 144 128c0-35.3-28.7-64-64-64H344V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H152V24zM48 192H400V448c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192z" />
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
                      <div className="text-black font-semibold mb-1">
                        Skill :
                      </div>
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
          <div className="md:w-3/4 sxxs:w-full space-y-4">
            <div className=" bg-[#D2D5F2] shadow-md shadow-gray-400 p-6 rounded-lg ">
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
              <h1 className="text-2xl font-bold text-gray-800">
                About {current.charAt(0).toUpperCase() + current.slice(1)}
              </h1>
              <div className="text-gray-600 text-lg break-all line-clamp-6 my-3 px-[4%]">
                {userData[0].params.user_data.bio}
              </div>
              <div className="pl-[4%]">
                <div className="w-full mb-4 border border-[#C5C5C5]"></div>
              </div>
              <div className="grid md:grid-cols-2 gap-4 w-full px-[3%]">
                <div className="flex flex-col items-start justify-start sm:text-left px-[4%]">
                  <h2 className="text-xl sm:text-xl font-bold text-gray-800 mb-2 sm:mb-0 mr-2">
                    Telegram :
                  </h2>
                  <div className="flex flex-grow items-center truncate">
                    {telegramSVg}
                    <div className="text-gray-600 text-sm md:text-md truncate ml-2">
                      {userData[0].params.user_data.telegram_id}
                    </div>
                    <a
                      href={userData[0].params.user_data.telegram_id}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pl-2"
                    ></a>{" "}
                  </div>
                </div>
                <div className="flex flex-col items-start text-center sm:text-left px-[4%]">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 mr-2">
                    Twitter :
                  </h2>
                  <div className="flex flex-grow items-center truncate">
                    {twitterSvg}
                    <div className="text-gray-600 text-sm md:text-md truncate ml-2">
                      {userData[0].params.user_data.twitter_id}
                    </div>
                    <a
                      href={userData[0].params.user_data.twitter_id}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 pl-2"
                    ></a>
                  </div>
                </div>
                <div className="flex flex-col items-start justify-start sm:text-left px-[4%]">
                  <h2 className="text-xl sm:text-xl font-bold text-gray-800 mb-2 sm:mb-0 mr-2">
                    Website :
                  </h2>
                  <div className="flex flex-grow items-center truncate">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      className="size-4"
                      fill="currentColor"
                    >
                      <divath d="M352 256c0 22.2-1.2 43.6-3.3 64H163.3c-2.2-20.4-3.3-41.8-3.3-64s1.2-43.6 3.3-64H348.7c2.2 20.4 3.3 41.8 3.3 64zm28.8-64H503.9c5.3 20.5 8.1 41.9 8.1 64s-2.8 43.5-8.1 64H380.8c2.1-20.6 3.2-42 3.2-64s-1.1-43.4-3.2-64zm112.6-32H376.7c-10-63.9-29.8-117.4-55.3-151.6c78.3 20.7 142 77.5 171.9 151.6zm-149.1 0H167.7c6.1-36.4 15.5-68.6 27-94.7c10.5-23.6 22.2-40.7 33.5-51.5C239.4 3.2 248.7 0 256 0s16.6 3.2 27.8 13.8c11.3 10.8 23 27.9 33.5 51.5c11.6 26 20.9 58.2 27 94.7zm-209 0H18.6C48.6 85.9 112.2 29.1 190.6 8.4C165.1 42.6 145.3 96.1 135.3 160zM8.1 192H131.2c-2.1 20.6-3.2 42-3.2 64s1.1 43.4 3.2 64H8.1C2.8 299.5 0 278.1 0 256s2.8-43.5 8.1-64zM194.7 446.6c-11.6-26-20.9-58.2-27-94.6H344.3c-6.1 36.4-15.5 68.6-27 94.6c-10.5 23.6-22.2 40.7-33.5 51.5C272.6 508.8 263.3 512 256 512s-16.6-3.2-27.8-13.8c-11.3-10.8-23-27.9-33.5-51.5zM135.3 352c10 63.9 29.8 117.4 55.3 151.6C112.2 482.9 48.6 426.1 18.6 352H135.3zm358.1 0c-30 74.1-93.6 130.9-171.9 151.6c25.5-34.2 45.2-87.7 55.3-151.6H493.4z" />
                    </svg>
                    <div className="text-gray-600 text-sm md:text-md truncate ml-2">
                      {userData[0].params.website_link}
                    </div>
                    <a
                      href={userData[0].params.website_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pl-2"
                    ></a>{" "}
                  </div>
                </div>
                <div className="flex flex-col items-start justify-start sm:text-left px-[4%]">
                  <h2 className="text-xl sm:text-xl font-bold text-gray-800 mb-2 sm:mb-0 mr-2">
                    LinkedIn :
                  </h2>
                  <div className="flex flex-grow items-center truncate">
                    {linkedInSvg}
                    <div className="text-gray-600 text-sm md:text-md truncate ml-2">
                      {userData[0].params.linkedin_link}
                    </div>
                    <a
                      href={userData[0].params.linkedin_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pl-2"
                    ></a>{" "}
                  </div>
                </div>
                <div className="flex flex-col items-start justify-start sm:text-left px-[4%]">
                  <h2 className="text-xl sm:text-xl font-bold text-gray-800 mb-2 sm:mb-0 mr-2">
                    Portfoilo :
                  </h2>
                  <div className="flex flex-grow items-center truncate">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      className="size-4"
                      fill="currentColor"
                    >
                      <divath d="M352 256c0 22.2-1.2 43.6-3.3 64H163.3c-2.2-20.4-3.3-41.8-3.3-64s1.2-43.6 3.3-64H348.7c2.2 20.4 3.3 41.8 3.3 64zm28.8-64H503.9c5.3 20.5 8.1 41.9 8.1 64s-2.8 43.5-8.1 64H380.8c2.1-20.6 3.2-42 3.2-64s-1.1-43.4-3.2-64zm112.6-32H376.7c-10-63.9-29.8-117.4-55.3-151.6c78.3 20.7 142 77.5 171.9 151.6zm-149.1 0H167.7c6.1-36.4 15.5-68.6 27-94.7c10.5-23.6 22.2-40.7 33.5-51.5C239.4 3.2 248.7 0 256 0s16.6 3.2 27.8 13.8c11.3 10.8 23 27.9 33.5 51.5c11.6 26 20.9 58.2 27 94.7zm-209 0H18.6C48.6 85.9 112.2 29.1 190.6 8.4C165.1 42.6 145.3 96.1 135.3 160zM8.1 192H131.2c-2.1 20.6-3.2 42-3.2 64s1.1 43.4 3.2 64H8.1C2.8 299.5 0 278.1 0 256s2.8-43.5 8.1-64zM194.7 446.6c-11.6-26-20.9-58.2-27-94.6H344.3c-6.1 36.4-15.5 68.6-27 94.6c-10.5 23.6-22.2 40.7-33.5 51.5C272.6 508.8 263.3 512 256 512s-16.6-3.2-27.8-13.8c-11.3-10.8-23-27.9-33.5-51.5zM135.3 352c10 63.9 29.8 117.4 55.3 151.6C112.2 482.9 48.6 426.1 18.6 352H135.3zm358.1 0c-30 74.1-93.6 130.9-171.9 151.6c25.5-34.2 45.2-87.7 55.3-151.6H493.4z" />
                    </svg>
                    <div className="text-gray-600 text-sm md:text-md truncate ml-2">
                      {userData[0].params.portfolio_link}
                    </div>
                    <a
                      href={userData[0].params.portfolio_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pl-2"
                    ></a>{" "}
                  </div>
                </div>
              </div>
            </div>
            <div className=" bg-[#D2D5F2] shadow-md shadow-gray-400 p-6 rounded-lg">
              <ul className="grid grid-cols-2 gap-4 w-full px-[5%]">
                <li className="list-disc">
                  {userData[0].params.project_on_multichain && (
                    <div className="text-black font-semibold ">
                      Multichain :
                    </div>
                  )}
                  <div className="flex text-gray-700 flex-row gap-2 flex-wrap text-xs">
                    {userData[0].params.project_on_multichain.map(
                      (reason, index) => (
                        <div
                          key={index}
                          className="text-xs rounded-2xl flex gap-2 font-bold "
                        >
                          {reason.split(",").map((tag, index) => (
                            <div
                              key={index}
                              className="text-xs border-2 rounded-2xl px-2 py-1 font-bold bg-[#c9c5c5]"
                            >
                              {tag.trim()}
                            </div>
                          ))}
                        </div>
                      )
                    )}
                  </div>
                </li>
               
                <li className="list-disc">
                  {userData[0].params.category_of_investment && (
                    <div className=" flex flex-col text-gray-600">
                      <div className="text-black font-semibold mb-1">
                        Areas of Invest :
                      </div>
                      <div className="flex gap-2 text-xs items-center flex-wrap">
                        {userData[0].params.category_of_investment
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
                </li>
                <li className="list-disc">
                  {userData[0].params.stage && (
                    <div className="text-black font-semibold ">
                      At what stage of investment are you currently focusing on?
                    </div>
                  )}
                  <ul className="flex text-gray-700 flex-col gap-2 flex-wrap text-xs">
                    {userData[0].params.stage.map(
                      (reason, index) => (
                        <div
                          key={index}
                          className="text-xs rounded-2xl flex gap-2 font-bold flex-col"
                        >
                          {reason.split(",").map((tag, index) => (
                          <li className="list-disc">
                            <div
                              key={index}
                              className="text-xs font-bold"
                            >
                              {tag.trim()}
                            </div>
                            </li>
                          ))}
                        </div>
                      )
                    )}
                  </ul>
                </li>
                <li className="list-disc">
                  {userData[0].params.range_of_check_size && (
                    <div className="text-black font-semibold ">
                      What is the typical range of check sizes for your investments?
                    </div>
                  )}
                  <div className="flex text-gray-700 flex-row gap-2 flex-wrap text-xs">
                    {userData[0].params.range_of_check_size.map(
                      (reason, index) => (
                        <div
                          key={index}
                          className="text-xs rounded-2xl flex gap-2 font-bold "
                        >
                          {reason.split(",").map((tag, index) => (
                            <div
                              key={index}
                              className="text-xs border-2 rounded-2xl px-2 py-1 font-bold bg-[#c9c5c5]"
                            >
                              {tag.trim()}
                            </div>
                          ))}
                        </div>
                      )
                    )}
                  </div>
                </li>
                <li className="list-disc">
                  <div className="flex flex-col items-start justify-start sm:text-left">
                    <h2 className=" font-bold text-gray-800 mb-2 sm:mb-0 mr-2">
                      Are you currently serving as an Existing ICP Investror?
                    </h2>
                    <div className="flex flex-grow items-center truncate">
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
                          Data Not Available
                        </span>
                      )}
                    </div>
                  </div>
                </li>
                <li className="list-disc">
                  <div className="flex flex-col items-start justify-start sm:text-left">
                    <h2 className=" font-bold text-gray-800 mb-2 sm:mb-0 mr-2">
                      What is the scope and status of the Existing ICP Project
                      Portfolio?
                    </h2>
                    <div className="flex flex-grow items-center truncate text-xs">
                      {userData[0]?.profile?.existing_icp_portfolio[0] ? (
                        <span>
                          {userData[0]?.profile?.existing_icp_portfolio[0]}
                        </span>
                      ) : (
                        <span className="flex items-center text-xs">
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
                      What are the preferred ICP hubs ?
                    </h2>
                    <div className="flex flex-grow items-center truncate text-xs">
                      {userData[0].params.preferred_icp_hub ? (
                        <span>{userData[0].params.preferred_icp_hub}</span>
                      ) : (
                        <span className="flex items-center text-xs">
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
                      Have you previously been involved with any ICP hubs ?
                    </h2>
                    <div className="flex flex-grow items-center truncate text-xs">
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
                          Data Not Available
                        </span>
                      )}
                    </div>
                  </div>
                </li>
                <li className="list-disc">
                  <div className="flex flex-col items-start justify-start sm:text-left">
                    <h2 className=" font-bold text-gray-800 mb-2 sm:mb-0 mr-2">
                      What is the current value or amount of assets under
                      management?
                    </h2>
                    <div className="flex flex-grow items-center truncate text-xs">
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
                          Data Not Available
                        </span>
                      )}
                    </div>
                  </div>
                </li>
                <li className="list-disc">
                  <div className="flex flex-col items-start justify-start sm:text-left">
                    <h2 className=" font-bold text-gray-800 mb-2 sm:mb-0 mr-2">
                      What is the average size of the checks issued or received?
                    </h2>
                    <div className="flex flex-grow items-center truncate text-xs">
                      {userData[0].params.average_check_size ? (
                        <span>{userData[0].params.average_check_size}</span>
                      ) : (
                        <span className="flex items-center text-xs">
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
                      What is the total size of the fund you are referring to?
                    </h2>
                    <div className="flex flex-grow items-center truncate text-xs">
                      {userData[0].params.average_check_size ? (
                        <span>{userData[0].params.average_check_size}</span>
                      ) : (
                        <span className="flex items-center text-xs">
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
                      How much money have you invested?
                    </h2>
                    <div className="flex flex-grow items-center truncate text-xs">
                      {userData[0].params.money_invested[0] ? (
                        <span>{userData[0].params.money_invested[0]}</span>
                      ) : (
                        <span className="flex items-center text-xs">
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
                      Have you made any previous registrations?
                    </h2>
                    <div className="flex flex-grow items-center truncate text-xs">
                      {userData[0].params.registered === true ? (
                        "Yes"
                      ) : "No" ? (
                        <span>
                          {userData[0].params.registered === true
                            ? "Yes"
                            : "No"}
                        </span>
                      ) : (
                        <span className="flex items-center text-xs">
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
                      In which country are you registered?
                    </h2>
                    <div className="flex flex-grow items-center truncate text-xs">
                      {place}
                      {userData[0].params.registered_country[0] ? (
                        <span className="ml-2">
                          {userData[0].params.registered_country[0]}
                        </span>
                      ) : (
                        <span className="flex items-center text-xs">
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
                      How many portfolio companies do you currently have?
                    </h2>
                    <div className="flex flex-grow items-center truncate text-xs">
                      {userData[0].params.number_of_portfolio_companies ? (
                        <span>
                          {userData[0].params.number_of_portfolio_companies}
                        </span>
                      ) : (
                        <span className="flex items-center text-xs">
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
                      What is the name of the fund you are referring to?
                    </h2>
                    <div className="flex flex-grow items-center truncate text-xs">
                      {userData[0].params.name_of_fund ? (
                        <span>{userData[0].params.name_of_fund}</span>
                      ) : (
                        <span className="flex items-center text-xs">
                          {noDataPresentSvg}
                          Data Not Available
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              </ul>
            </div>
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
      {/* <div className="w-full">
        <div className=" bg-white  shadow-md shadow-gray-400 pb-6 pt-4 rounded-lg w-full">
          <div className="w-full flex  md:flex-row flex-col md:items-start items-center justify-around px-[4%] py-4">
            <div className="flex md:flex-row flex-col w-full ">
              <div className="relative">
                {/* <div className=""> 
                <img
                  className="md:w-36 object-fill md:h-36 w-28 h-28 mx-4 justify-center rounded-full"
                  src={profile}
                  alt="description"
                />
                {/* </div> 

                <div className=" top-0 left-0 w-full h-full flex justify-center items-center">
                  <svg className="absolute invisible">
                    <defs>
                      <linearGradient
                        id="progressGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                        className="rounded"
                      >
                        <stop offset="0%" stopColor="#e2e8f0" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
              <div className="flex flex-col ml-4  mt-2 w-auto justify-start md:mb-0 mb-6">
                <div className="flex flex-row  gap-4 items-center">
                  <h1 className="md:text-3xl text-lg md:font-extrabold font-bold  bg-black text-transparent bg-clip-text">
                    {userData[0].params.user_data.full_name}
                  </h1>
                </div>
                <div className="text-gray-500 md:text-md text-sm font-normal mb-4">
                  {userData[0].params.user_data.email}
                </div>

                <div className="flex flex-col items-start gap-3 text-sm">
                  <div className="flex flex-row  text-gray-600 space-x-2">
                    {place}
                    <div className="underline ">
                      {" "}
                      {userData[0].params.user_data.country}
                    </div>
                  </div>
                  <div className=" flex flex-row space-x-2 text-gray-600">
                    {star}
                    <div>{date}</div>
                  </div>
                  <div className="pl-1 flex flex-row space-x-2 text-gray-600">
                    {tick}
                    <div>{userData[0].params.user_data.area_of_interest}</div>
                  </div>

                  <div className="pl-1 flex flex-row space-x-2 text-gray-600">
                    {openchat_username}
                    <div>
                      {userData[0].params.user_data.openchat_username[0]}
                    </div>
                  </div>
                </div>

                {userData[0].params.user_data.reason_to_join[0] && (
                  <div className="mt-8 text-black mb-2">Reason to join</div>
                )}
                <div className="flex text-gray-700 flex-row gap-2 flex-wrap text-xs">
                  {userData[0].params.user_data.reason_to_join[0].map(
                    (reason, index) => (
                      <div
                        key={index}
                        className="bg-[#c9c5c5] py-0.5 rounded-full px-3"
                      >
                        {reason.replace(/_/g, " ")}
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

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
                      <div className="flex justify-center items-center text-white p-2 text-sm">
                        {constructMessage(role)}
                      </div>
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="w-full mt-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            About Investor
          </h1>
          <div className="text-gray-600 text-lg mb-10 break-all">
            {userData[0].params.user_data.bio}
          </div>
        </div>

        <div className="mt-12 pb-8">
          <div className="w-full mb-4 border border-[#DCDCDC]"></div>

          <div className="flex md:flex-row flex-col justify-between md:items-center items-start w-full">
            <div className="md:w-1/2 w-3/4 flex flex-row items-center justify-start sm:text-left pr-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-0 mr-2">
                Website:
              </h2>
              <div className="flex flex-grow items-center truncate">
                <div className="text-gray-600 text-sm md:text-md truncate px-4">
                  {userData[0].params.website_link}
                </div>
                <a
                  href={userData[0].params.website_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pl-2"
                >
                  {openWebsiteIcon}
                </a>{" "}
              </div>
            </div>

            <div className="flex md:w-1/2 w-3/4 items-center text-center sm:text-left md:pl-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 mr-2">
                Linkedin:
              </h2>
              <div className="flex flex-grow items-center truncate">
                <div className="text-gray-600 text-sm md:text-md truncate">
                  {userData[0].params.linkedin_link}
                </div>
                <a
                  href={userData[0].params.linkedin_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 pl-2"
                >
                  {linkedInSvg}
                </a>
              </div>
            </div>
          </div>

          <div className="flex md:flex-row flex-col justify-between md:items-center items-start w-full mt-4">
            <div className="md:w-1/2 w-3/4 flex flex-row items-center justify-start sm:text-left pr-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-0 mr-2">
                Portfolio:
              </h2>
              <div className="flex flex-grow items-center truncate">
                <div className="text-gray-600 text-sm md:text-md truncate px-4">
                  {userData[0].params.portfolio_link}
                </div>
                <a
                  href={userData[0].params.portfolio_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pl-2"
                >
                  {openWebsiteIcon}
                </a>{" "}
              </div>
            </div>

            <div className="flex md:w-1/2 w-3/4 items-center text-center sm:text-left md:pl-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 mr-2">
                Telegram:
              </h2>
              <div className="flex flex-grow items-center truncate">
                <div className="text-gray-600 text-sm md:text-md truncate">
                  {userData[0].params.user_data.telegram_id[0]}
                </div>
                <a
                  href={userData[0].params.user_data.telegram_id}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 pl-2"
                >
                  {telegramSVg}
                </a>
              </div>
            </div>
          </div>

          {logo && (
            <div className="flex md:flex-row flex-col items-center justify-around w-full mt-4">
              <div className=" md:w-1/2 w-full flex flex-row md:items-center items-start justify-start">
                <div className="object-fill">
                  <img
                    className="md:w-36 md:h-36 w-28 h-28  mx-4 justify-start rounded-full"
                    src={logo}
                    alt="logo"
                  />
                </div>
              </div>

              <div className="invisible  md:w-1/2 w-full flex flex-row items-start md:items-center justify-start md:pl-5">
                <h1 className="text-lg font-normal text-gray-600">
                  Reason For Join :
                </h1>
                <div className="text-lg font-bold text-gray-800 pl-6">
                  {userData[0].params.reason_for_joining[0] ? (
                    <span>
                      {userData[0].params.existing_icp_project_porfolio[0]}
                    </span>
                  ) : (
                    <span className="flex items-center">
                      {noDataPresentSvg} Data Not Available
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex md:flex-row flex-col items-center justify-around w-full mt-10">
            <div className=" md:w-1/2 w-full flex flex-row md:items-center items-start justify-start">
              <h1 className="text-lg font-normal text-gray-600">
                Exisitng ICP Portfolio :
              </h1>
              <div className="text-lg font-bold text-gray-800 pl-6">
                {userData[0].params.existing_icp_portfolio[0] ? (
                  <span>{userData[0].params.existing_icp_portfolio[0]}</span>
                ) : (
                  <span className="flex items-center">
                    {noDataPresentSvg}
                    Data Not Available
                  </span>
                )}
              </div>
            </div>

            <div className=" md:w-1/2 w-full flex flex-row md:items-center items-start justify-start md:pl-5">
              <h1 className="text-lg font-normal text-gray-600">
                Assets Under Management :
              </h1>
              <div className="text-lg font-bold text-gray-800 pl-6">
                {userData[0].params.assets_under_management[0] ? (
                  <span>{userData[0].params.assets_under_management[0]}</span>
                ) : (
                  <span className="flex items-center">
                    {noDataPresentSvg}
                    Data Not Available
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex md:flex-row flex-col items-center justify-around w-full mt-4">
            <div className=" md:w-1/2 w-full flex flex-row md:items-center items-start justify-start">
              <h1 className="text-lg font-normal text-gray-600">
                Average Check Size :
              </h1>
              <div className="text-lg font-bold text-gray-800 pl-6">
                {userData[0].params.average_check_size ? (
                  <span>{userData[0].params.average_check_size}</span>
                ) : (
                  <span className="flex items-center">
                    {noDataPresentSvg}
                    Data Not Available
                  </span>
                )}
              </div>
            </div>

            <div className=" md:w-1/2 w-full flex flex-row md:items-center items-start justify-start md:pl-5">
              <h1 className="text-lg font-normal text-gray-600">
                Registered Under Any Hub :
              </h1>
              <div className="text-lg font-bold text-gray-800 pl-6">
                {" "}
                {userData[0].params.registered_under_any_hub[0] ? (
                  "Yes"
                ) : "No" ? (
                  <span>
                    {userData[0].params.registered_under_any_hub[0]
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
          </div>

          <div className="flex md:flex-row flex-col items-center justify-around w-full mt-10">
            <div className=" md:w-1/2 w-full flex flex-row md:items-center items-start justify-start">
              <h1 className="text-lg font-normal text-gray-600">
                Announcement :
              </h1>
              <div className="text-lg font-bold text-gray-800 pl-6">
                {userData[0].params.announcement_details[0] ? (
                  <span>{userData[0].params.announcement_details[0]}</span>
                ) : (
                  <span className="flex items-center">
                    {noDataPresentSvg}
                    Data Not Available
                  </span>
                )}
              </div>
            </div>

            <div className=" md:w-1/2 w-full flex flex-row md:items-center items-start justify-start md:pl-5">
              <h1 className="text-lg font-normal text-gray-600">Fund Size :</h1>
              <div className="text-lg font-bold text-gray-800 pl-6">
                {userData[0].params.fund_size[0] ? (
                  <span>{userData[0].params.fund_size[0]}</span>
                ) : (
                  <span className="flex items-center">
                    {noDataPresentSvg}
                    Data Not Available
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex md:flex-row flex-col items-center justify-around w-full mt-4">
            <div className=" md:w-1/2 w-full flex flex-row md:items-center items-start justify-start ">
              <h1 className="text-lg font-normal text-gray-600">
                Money Invested :
              </h1>
              <div className="text-lg font-bold text-gray-800 pl-6">
                {userData[0].params.money_invested[0] ? (
                  <span>{userData[0].params.money_invested[0]}</span>
                ) : (
                  <span className="flex items-center">
                    {noDataPresentSvg}
                    Data Not Available
                  </span>
                )}
              </div>
            </div>
            <div className=" md:w-1/2 w-full flex flex-row md:items-center items-start justify-start md:pl-5">
              <h1 className="text-lg font-normal text-gray-600">
                Registered :
              </h1>
              <div className="text-lg font-bold text-gray-800 pl-6">
                {" "}
                {userData[0].params.registered ? (
                  "Yes"
                ) : "No" ? (
                  <span>{userData[0].params.registered ? "Yes" : "No"}</span>
                ) : (
                  <span className="flex items-center">
                    {noDataPresentSvg}
                    Data Not Available
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex md:flex-row flex-col items-center justify-around w-full mt-10">
            <div className=" md:w-1/2 w-full flex flex-row md:items-center items-start justify-start">
              <h1 className="text-lg font-normal text-gray-600">
                Type Of Investment :
              </h1>
              <div className="text-lg font-bold text-gray-800 pl-6">
                {userData[0].params.type_of_investment ? (
                  <span>{userData[0].params.type_of_investment}</span>
                ) : (
                  <span className="flex items-center">
                    {noDataPresentSvg}
                    Data Not Available
                  </span>
                )}
              </div>
            </div>

            <div className=" md:w-1/2 w-full flex flex-row md:items-center items-start justify-start md:pl-5">
              <h1 className="text-lg font-normal text-gray-600">
                Exisitng ICP Investor :
              </h1>
              <div className="text-lg font-bold text-gray-800 pl-6">
                {" "}
                {userData[0].params.existing_icp_investor ? (
                  "Yes"
                ) : "No" ? (
                  <span>
                    {userData[0].params.existing_icp_investor ? "Yes" : "No"}
                  </span>
                ) : (
                  <span className="flex items-center">
                    {noDataPresentSvg}
                    Data Not Available
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex md:flex-row flex-col items-center justify-around w-full mt-4">
            <div className=" md:w-1/2 w-full flex flex-row md:items-center items-start justify-start">
              <h1 className="text-lg font-normal text-gray-600">
                Registered Country :
              </h1>
              <div className="text-lg font-bold text-gray-800 pl-6">
                {userData[0].params.registered_country[0] ? (
                  <span>{userData[0].params.registered_country[0]}</span>
                ) : (
                  <span className="flex items-center">
                    {noDataPresentSvg}
                    Data Not Available
                  </span>
                )}
              </div>
            </div>

            <div className=" md:w-1/2 w-full flex flex-row md:items-center items-start justify-start md:pl-5">
              <h1 className="text-lg font-normal text-gray-600">
                Preferred ICP Hub :
              </h1>
              <div className="text-lg font-bold text-gray-800 pl-6">
                {userData[0].params.preferred_icp_hub ? (
                  <span>{userData[0].params.preferred_icp_hub}</span>
                ) : (
                  <span className="flex items-center">
                    {noDataPresentSvg}
                    Data Not Available
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex md:flex-row flex-col items-center justify-around w-full mt-10">
            <div className=" md:w-1/2 w-full flex flex-row md:items-center items-start justify-start">
              <h1 className="text-lg font-normal text-gray-600">
                Range Of Check Size :
              </h1>
              <div className="text-lg font-bold text-gray-800 pl-6">
                {userData[0].params.range_of_check_size[0] ? (
                  <span>{userData[0].params.range_of_check_size[0]}</span>
                ) : (
                  <span className="flex items-center">
                    {noDataPresentSvg}
                    Data Not Available
                  </span>
                )}
              </div>
            </div>

            <div className=" md:w-1/2 w-full flex flex-row md:items-center items-start justify-start md:pl-5">
              <h1 className="text-lg font-normal text-gray-600">
                Investor Type :
              </h1>
              <div className="text-lg font-bold text-gray-800 pl-6">
                {userData[0].params.investor_type[0] ? (
                  <span>{userData[0].params.investor_type[0]}</span>
                ) : (
                  <span className="flex items-center">
                    {noDataPresentSvg}
                    Data Not Available
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex md:flex-row flex-col items-center justify-around w-full mt-4">
            <div className=" md:w-1/2 w-full flex flex-row md:items-center items-start justify-start ">
              <h1 className="text-lg font-normal text-gray-600">
                Project On Multichain :
              </h1>
              <div className="text-lg font-bold text-gray-800 pl-6">
                {userData[0].params.project_on_multichain[0] ? (
                  <span>{userData[0].params.project_on_multichain[0]}</span>
                ) : (
                  <span className="flex items-center">
                    {noDataPresentSvg}
                    Data Not Available
                  </span>
                )}
              </div>
            </div>

            <div className=" md:w-1/2 w-full flex flex-row md:items-center items-start justify-start md:pl-5">
              <h1 className="text-lg font-normal text-gray-600">
                Name Of Fund:
              </h1>
              <div className="text-lg font-bold text-gray-800 pl-6">
                {userData[0].params.name_of_fund ? (
                  <span>{userData[0].params.name_of_fund}</span>
                ) : (
                  <span className="flex items-center">
                    {noDataPresentSvg}
                    Data Not Available
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex md:flex-row flex-col items-center justify-around w-full mt-10 mb-10 ">
            <div className=" md:w-1/2 w-full flex flex-row md:items-center items-start justify-start ">
              <h1 className="text-lg font-normal text-gray-600">
                Number Of Portfolio Companies :
              </h1>
              <div className="text-lg font-bold text-gray-800 pl-6">
                {userData[0].params.number_of_portfolio_companies ? (
                  <span>
                    {userData[0].params.number_of_portfolio_companies}
                  </span>
                ) : (
                  <span className="flex items-center">
                    {noDataPresentSvg}
                    Data Not Available
                  </span>
                )}
              </div>
            </div>

            <div className=" md:w-1/2 w-full flex flex-row md:items-center items-start justify-start md:pl-5">
              <h1 className="text-lg font-normal text-gray-600">
                Investment Stage:
              </h1>
              <div className="text-lg font-bold text-gray-800 pl-6">
                {userData[0].params.stage[0] ? (
                  <span>{userData[0].params.stage[0]}</span>
                ) : (
                  <span className="flex items-center">
                    {noDataPresentSvg}
                    Data Not Available
                  </span>
                )}
              </div>
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
                      allowUserRoleHandler(
                        principal,
                        true,
                        "Pending",
                        role.name
                      )
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
      </div> */}
    </>
  );
};

export default InvestorProfile;

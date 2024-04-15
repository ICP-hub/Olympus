import React, { useState, useRef, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { library, ColorStar, Profile } from "../Utils/AdminData/SvgData";
import ReactSlider from "react-slider";
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
  tick,
  star,
  Profile2,
  openWebsiteIcon,
  telegramSVg,
  noDataPresentSvg,
} from "../Utils/AdminData/SvgData";
import { linkedInSvgBig } from "../../../../IcpAccelerator_frontend/src/components/Utils/Data/SvgData";
import { twitterSvgBig } from "../../../../IcpAccelerator_frontend/src/components/Utils/Data/SvgData";
import { openchat_username } from "../Utils/AdminData/SvgData";

const Projectdetails = ({ userData, Allrole, principal }) => {
  const actor = useSelector((currState) => currState.actors.actor);

  const [details, setDetails] = useState();
  const [isHovered, setIsHovered] = useState(false);
  const [percent, setPercent] = useState(0);
  const [current, setCurrent] = useState("user");
  const [isAccepting, setIsAccepting] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);

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

  const date = numberToDate(userData[0].creation_date);

  const weeklyUsers = Number(userData[0].params.weekly_active_users[0]);
  const revenueNum = Number(userData[0].params.revenue[0]);
  const icpGrants = Number(userData[0].params.money_raised[0].icp_grants[0]);
  const investorInvest = Number(
    userData[0].params.money_raised[0].investors[0]
  );
  const otherEcosystem = Number(
    userData[0].params.money_raised[0].raised_from_other_ecosystem[0]
  );
  const snsGrants = Number(userData[0].params.money_raised[0].sns[0]);
  const targetAmount = userData[0].params.money_raised[0].target_amount[0]
    ? Number(userData[0].params.money_raised[0].target_amount[0])
    : 0;

  const profile = uint8ArrayToBase64(
    userData[0].params.user_data.profile_picture[0]
  );
  const logo =
    userData && userData[0].params.project_logo.length > 0
      ? uint8ArrayToBase64(userData[0].params.project_logo)
      : null;

  const Project_cover = uint8ArrayToBase64(userData[0].params.project_cover);
  return (
    <div>
      <div className="w-full">
        {/* <div className="p-2 shadow-lg  bg-[#FFFFFF4D] border-[#E9E9E9] border-1 drop-shadow-[#0000000D] rounded-[10px] w-full">
          <div className="flex items-center ">
            <div className="flex">
              <img
                src={profile}
                alt="project"
                className="w-14 h-14 aspect-square object-cover rounded-md"
              />
            </div>
            <div className="flex justify-between items-center w-full">
              <div className="px-2">
                <div className="flex items-center flex-wrap">
                  <div className="flex items-center flex-col ">
                    <p className="font-[950] text-2xl pr-2">
                      {userData[0].params.project_name}
                    </p>
                  </div>
                </div>
                <div className="md:flex block text-xs md:text-sm text-[#737373]">
                  <div className="flex flex-row gap-4 ">
                    <p className="text-[#737373] bg-gray-200 rounded-full px-2">
                      {userData[0].params.project_area_of_focus}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-row flex-wrap gap-2 text-xs md:text-sm text-right pr-4">
                <div className="flex gap-2.5 mr-2 mt-1.5">
                  <div className="w-4 h-4">{linkedInSvg}</div>
                  <div className="w-4 h-4">{twitterSvg}</div>
                </div>
                <div className="flex flex-col ">
                  <p className="text-[#320099] font-bold">View Rating</p>
                  <div className="flex flex-row gap-6 flex-wrap items-center">
                    <div>
                      <svg
                        style={{ position: "absolute", width: 0, height: 0 }}
                      >
                        <defs>
                          <linearGradient
                            id="progressGradient"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="0%"
                          >
                            <stop offset="0%" stopColor="blue" />
                            <stop offset="100%" stopColor="blue" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <CircularProgressbar
                        className="w-24 h-24"
                        value={percentage}
                        strokeWidth={8}
                        text={`${percentage}%`}
                        styles={buildStyles({
                          strokeLinecap: "round",
                          pathTransitionDuration: 0.5,
                          pathColor: `url(#progressGradient)`,
                          trailColor: "",
                          textColor: "#737373",
                          textSize: "24px",
                        })}
                      />
                    </div>
                    <div className="flex flex-col justify-center items-center gap-2">
                      <h1 className="font-bold text-black text-xl">
                        Overall Ratings
                      </h1>
                      <div className="flex flex-row gap-2 py-2 ">
                        {ColorStar}
                        {ColorStar}
                        {ColorStar}
                        {ColorStar}
                        {ColorStar}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-between text-gray-500 px-2 pt-2">
            <div className="flex items-center"></div>
            <div></div>
          </div>
          <div className="flex items-center gap-2">
            <span className="capitalize text-gray-500 text-xs md:text-sm">
              {userData[0].params.user_data.country}
            </span>
            <span className="w-1 h-1 rounded-full bg-gray-500"></span>
            <div>
              <div className="flex text-xs md:text-sm text-[#737373]">
                <p>{date}</p>
              </div>
            </div>
          </div>
        </div> */}

        <div className=" bg-white  shadow-md shadow-gray-400 pb-6 pt-4 rounded-lg w-full">
          <div className="w-full flex  md:flex-row flex-col md:items-start items-center justify-around px-[4%] py-4">
            <div className="flex md:flex-row flex-col w-full gap-2">
              <div className="relative">
                <img
                  className="md:w-[6rem] object-fill md:h-[6rem] w-[4rem] h-[4rem]  justify-center aspect-square rounded-md"
                  src={Project_cover}
                  alt="description"
                />

                {/* <div className=" top-0 left-0 w-full h-full flex justify-center items-center">
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
              </div> */}
              </div>
              <div className="flex flex-col pl-4  mt-2 w-auto justify-start md:mb-0 mb-6">
                <div className="flex flex-row gap-4 items-center w-full md:w-[248px] lg:w-[500px]">
                  <h1 className="text-xl md:text-3xl font-bold bg-black text-transparent bg-clip-text truncate">
                    {userData[0].params.project_name}
                  </h1>
                </div>

                <div className="flex flex-col items-start gap-3 text-sm">
                  <div className="flex flex-row md:items-center mt-2">
                    <p className="pt-1">{openchat_username}</p>
                    <div className="flex flex-row flex-wrap items-center space-x-2 ml-3 space-y-1">
                      {userData[0].params.user_data.reason_to_join[0].map(
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
            <p className="mr-4">{userData[0].params.user_data.country}</p>
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
                            {userData[0].params.project_name}
                          </h1>
                        </div>
                        <div className="justify-end flex flex-col">
                          <p>{userData[0].params.preferred_icp_hub[0]}</p>
                          <p>{date}</p>
                        </div>
                      </div>

                      <div className="border border-gray-400 w-full"></div>
                      <div className="flex flex-row justify-between mt-2">
                        <p className="font-bold">
                          {userData[0].params.user_data.full_name}
                        </p>
                        <div className="flex flex-row space-x-1">
                          <a
                            href={userData[0].params.project_linkedin[0]}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {linkedInSvgBig}
                          </a>
                          <a
                            href={userData[0].params.project_twitter[0]}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {twitterSvgBig}
                          </a>
                        </div>
                      </div>
                      <p>{userData[0].params.user_data.email}</p>
                      <div className="border border-gray-400 w-full"></div>
                      <div className="flex flex-row justify-between mt-2">
                        <p className="">
                          {userData[0].params.user_data.country}
                        </p>
                        <div className="flex flex-row space-x-1">
                          <a
                            href={userData[0].params.github_link[0]}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {githubSvgBig}
                          </a>
                          <a
                            href={userData[0].params.project_discord[0]}
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
                <p className="text-gray-600 text-lg mb-10">
                  {userData[0].params.project_description[0]}
                </p>

                <div className="flex md:flex-row flex-col justify-between md:items-center items-start w-full">
                  <div className="md:w-1/2 w-3/4 flex flex-row items-center justify-start sm:text-left pr-4">
                    <h2 className="text-xl sm:text-xl font-bold text-gray-800 mb-2 sm:mb-0 mr-2">
                      Daap Link:
                    </h2>
                    <div className="flex flex-grow items-center truncate">
                      <p className="text-gray-600 text-sm md:text-md truncate px-4">
                        {userData[0].params.dapp_link[0]}
                      </p>
                      <a
                        href={userData[0].params.dapp_link[0]}
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
                        {userData[0].params.project_website[0]}
                      </p>
                      <a
                        href={userData[0].params.project_website[0]}
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
                        {userData[0].params.project_elevator_pitch[0]}
                      </p>
                      <a
                        href={userData[0].params.project_elevator_pitch[0]}
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
                        {userData[0].params.long_term_goals[0]}
                      </p>
                      <a
                        href={userData[0].params.long_term_goals[0]}
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
                        {userData[0].params.promotional_video[0]}
                      </p>
                      <a
                        href={userData[0].params.promotional_video[0]}
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
                        {userData[0].params.token_economics[0]}
                      </p>
                      <a
                        href={userData[0].params.token_economics[0]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 pl-2"
                      >
                        {openWebsiteIcon}
                      </a>
                    </div>
                  </div>
                </div>

                {userData[0].params.private_docs[0].length > 0 && (
                  <div className="bg-white shadow-md shadow-gray-400 pb-6 pt-4 rounded-lg w-full mt-4">
                    <div className="px-6 py-4">
                      <h2 className="text-xl font-bold text-gray-800 mb-4">
                        Private Documents
                      </h2>
                      <div className="space-y-4">
                        {userData[0].params.private_docs[0].map(
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

                {userData[0].params.public_docs[0].length > 0 && (
                  <div className="bg-white shadow-md shadow-gray-400 pb-6 pt-4 rounded-lg w-full mt-4">
                    <div className="px-6 py-4">
                      <h2 className="text-xl font-bold text-gray-800 mb-4">
                        Public Documents
                      </h2>
                      <div className="space-y-4">
                        {userData[0].params.public_docs[0].map((doc, index) => (
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
                        ))}
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
                      {userData[0].params.country_of_registration[0] ? (
                        <span>
                          {userData[0].params.country_of_registration[0]}
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
                      {userData[0].params.is_your_project_registered[0] ? (
                        "Yes"
                      ) : "No" ? (
                        <span>
                          {userData[0].params.is_your_project_registered[0]
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
                      {userData[0].params.upload_private_documents[0] ? (
                        "Yes"
                      ) : "No" ? (
                        <span>
                          {userData[0].params.upload_private_documents[0]
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
                      {userData[0].params.supports_multichain[0] ? (
                        <span>{userData[0].params.supports_multichain[0]}</span>
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
                      {userData[0].params.money_raised_till_now[0] ? (
                        "Yes"
                      ) : "No" ? (
                        <span>
                          {userData[0].params.money_raised_till_now[0]
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
    </div>
  );
};

export default Projectdetails;

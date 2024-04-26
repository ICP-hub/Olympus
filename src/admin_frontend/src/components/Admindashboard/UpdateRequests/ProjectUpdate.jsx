import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  numberToDate,
  uint8ArrayToBase64,
} from "../../Utils/AdminData/saga_function/blobImageToUrl";
import { projectApprovedRequest } from "../../AdminStateManagement/Redux/Reducers/projectApproved";
import { projectDeclinedRequest } from "../../AdminStateManagement/Redux/Reducers/projectDeclined";
import { Principal } from "@dfinity/principal";
import { ThreeDots } from "react-loader-spinner";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

import {
  discordSvg,
  githubSvgBig,
  discordSvgBig,
  linkedInSvgBig,
  twitterSvgBig,
} from "../../../../../IcpAccelerator_frontend/src/components/Utils/Data/SvgData";
import {
  openWebsiteIcon,
  noDataPresentSvg,
  openchat_username,
  place,
  star,
  tick,
} from "../../Utils/AdminData/SvgData";
// import pdfSvg  from "../../../../assets/image/pdfimage.png";

const ProjectUpdate = () => {
  const actor = useSelector((currState) => currState.actors.actor);

  const [orignalData, setOrignalData] = useState(null);
  const [updatedData, setUpdatedData] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [percent, setPercent] = useState(0);
  const [current, setCurrent] = useState("user");
  const [isAccepting, setIsAccepting] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);
  const [userData, setUserData] = useState([]);
  const [showOriginalCover, setShowOriginalCover] = useState(true);
  const [showOriginalLogo, setShowOriginalLogo] = useState(true);
  const [showOriginalProfile, setShowOriginalProfile] = useState(true);
  const [editMode, setEditMode] = useState(false);

  const tm = useRef(null);
  const percentage = 0;
  const [currentStep, setCurrentStep] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  // const projectData = location.state?.projectData;

  // console.log("userdata =>>>>>>> ", orignalData);
  // console.log("Allrole =>>>>>>> ", Allrole);
  // console.log("principal =>>>>>>> ", principal);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const data = await actor.project_update_awaiting_approval();
        console.log("Received data from actor:", data);
        if (
          data &&
          data.length > 0 &&
          data[0].length > 1 &&
          data[0][1].original_info
        ) {
          const originalInfo = data[0][1].original_info;
          const updatedInfo = data[0][1].updated_info;

          console.log("Original Info:", originalInfo);
          console.log("updated Info:", updatedInfo);

          setOrignalData({
            projectName: originalInfo?.project_name || "No Name",
            projectLogo:
              originalInfo?.project_logo.length > 0
                ? uint8ArrayToBase64(originalInfo.project_logo)
                : null,
            projectCover:
              originalInfo?.project_cover.length > 0
                ? uint8ArrayToBase64(originalInfo.project_cover)
                : null,
            projectDescription:
              originalInfo?.project_description?.[0] || "No Description",
            projectWebsite: originalInfo?.project_website?.[0],
            projectDiscord: originalInfo?.project_discord?.[0],
            projectLinkedin: originalInfo?.project_linkedin?.[0],
            projectTwitter: originalInfo?.project_twitter?.[0],
            dappLink: originalInfo?.dapp_link?.[0],
            privateDocs: originalInfo?.private_docs?.[0] || [],
            publicDocs: originalInfo?.public_docs?.[0] || [],
            countryOfRegistration: originalInfo?.country_of_registration?.[0],
            promotionalVideo: originalInfo?.promotional_video?.[0],
            tokenEconomics: originalInfo?.token_economics?.[0],
            projectTeams: originalInfo?.project_team?.[0],
            technicalDocs: originalInfo?.technical_docs?.[0] || [],
            projectElevatorPitch: originalInfo?.project_elevator_pitch?.[0],
            longTermGoals: originalInfo?.long_term_goals?.[0],
            revenue: originalInfo?.revenue?.[0],
            weeklyActiveUsers: originalInfo?.weekly_active_users?.[0],
            icpGrants: originalInfo?.money_raised?.[0]?.icp_grants?.[0],
            investors: originalInfo?.money_raised?.[0]?.investors?.[0],
            raisedFromOtherEcosystem:
              originalInfo?.money_raised?.[0]?.raised_from_other_ecosystem?.[0],
            snsGrants: originalInfo?.money_raised?.[0]?.sns?.[0],
            targetAmount: originalInfo.money_raised?.[0]?.target_amount?.[0],
            moneyRaisedTillNow: originalInfo?.money_raised_till_now?.[0],
            preferredIcpHub: originalInfo?.preferred_icp_hub?.[0],
            supportsMultichain: originalInfo?.supports_multichain?.[0],
            typeOfRegistration: originalInfo?.type_of_registration?.[0],
            uploadPrivateDocuments: originalInfo?.upload_private_documents?.[0],
            projectAreaOfFocus: originalInfo?.project_area_of_focus,
            mentorsAssigned: originalInfo?.mentors_assigned[0],
            vcsAssigned: originalInfo?.vc_assigned[0],
            targetMarket: originalInfo?.target_market[0],
            githubLink: originalInfo?.github_link[0],
            reasonToJoinIncubator: originalInfo?.reason_to_join_incubator,
            reasonToJoin: originalInfo?.user_data.reason_to_join[0],
            liveOnIcpMainnet: originalInfo?.live_on_icp_mainnet?.[0],
            areaOfInterest: originalInfo?.user_data?.area_of_interest,
            userCountry: originalInfo?.user_data?.country,
            userFullName: originalInfo?.user_data?.full_name,
            isYourProjectRegistered :orignalData?.is_your_project_registered[0],
            userEmail: originalInfo?.user_data?.email,
            userProfilePicture:
              originalInfo?.user_data.profile_picture[0].length > 0
                ? uint8ArrayToBase64(originalInfo.user_data.profile_picture[0])
                : null,
            openchatUsername: originalInfo?.user_data.openchat_username?.[0],
          });

          setUpdatedData({
            projectName: updatedInfo?.project_name || "No Name",
            projectLogo:
              updatedInfo?.project_logo.length > 0
                ? uint8ArrayToBase64(updatedInfo.project_logo)
                : null,
            projectCover:
              updatedInfo?.project_cover.length > 0
                ? uint8ArrayToBase64(updatedInfo.project_cover)
                : null,
            projectDescription:
              updatedInfo?.project_description?.[0] || "No Description",
            projectWebsite: updatedInfo?.project_website?.[0],
            projectDiscord: updatedInfo?.project_discord?.[0],
            projectLinkedin: updatedInfo?.project_linkedin?.[0],
            projectTwitter: updatedInfo?.project_twitter?.[0],
            dappLink: updatedInfo?.dapp_link?.[0],
            privateDocs: updatedInfo?.private_docs?.[0] || [],
            publicDocs: updatedInfo?.public_docs?.[0] || [],
            countryOfRegistration: updatedInfo?.country_of_registration?.[0],
            promotionalVideo: updatedInfo?.promotional_video?.[0],
            tokenEconomics: updatedInfo?.token_economics?.[0],
            projectTeams: updatedInfo?.project_team?.[0],
            technicalDocs: updatedInfo?.technical_docs?.[0] || [],
            githubLink: updatedData?.github_link[0] || [],
            projectElevatorPitch: updatedInfo?.project_elevator_pitch?.[0],
            longTermGoals: updatedInfo?.long_term_goals?.[0],
            revenue: updatedInfo?.revenue?.[0],
            weeklyActiveUsers: updatedInfo?.weekly_active_users?.[0],
            icpGrants: updatedInfo?.money_raised?.[0]?.icp_grants?.[0],
            investors: updatedInfo?.money_raised?.[0]?.investors?.[0],
            raisedFromOtherEcosystem:
              updatedInfo?.money_raised?.[0]?.raised_from_other_ecosystem?.[0],
            snsGrants: updatedInfo?.money_raised?.[0]?.sns?.[0],
            targetAmount: updatedInfo.money_raised?.[0]?.target_amount?.[0],
            moneyRaisedTillNow: updatedInfo?.money_raised_till_now?.[0],
            preferredIcpHub: updatedInfo?.preferred_icp_hub?.[0],
            supportsMultichain: updatedInfo?.supports_multichain?.[0],
            typeOfRegistration: updatedInfo?.type_of_registration?.[0],
            isYourProjectRegistered :updatedData?.is_your_project_registered[0],
            uploadPrivateDocuments: updatedInfo?.upload_private_documents?.[0],
            projectAreaOfFocus: updatedInfo?.project_area_of_focus,
            mentorsAssigned: updatedInfo?.mentors_assigned[0],
            vcsAssigned: updatedInfo?.vc_assigned[0],
            targetMarket: updatedInfo?.target_market[0],
            reasonToJoinIncubator: updatedInfo?.reason_to_join_incubator,
            reasonToJoin: updatedInfo?.user_data.reason_to_join[0],
            liveOnIcpMainnet: updatedInfo?.live_on_icp_mainnet?.[0],
            areaOfInterest: updatedInfo?.user_data?.area_of_interest,
            userCountry: updatedInfo?.user_data?.country,
            userFullName: updatedInfo?.user_data?.full_name,
            userEmail: updatedInfo?.user_data?.email,
            userProfilePicture:
              updatedInfo?.user_data.profile_picture[0].length > 0
                ? uint8ArrayToBase64(updatedInfo.user_data.profile_picture[0])
                : null,
            openchatUsername: updatedInfo?.user_data.openchat_username?.[0],
          });
        } else {
          console.error("Unexpected data structure:", data);
          setOrignalData({});
          setUpdatedData({});
        }
      } catch (error) {
        console.error("Error fetching project data:", error);
      }
    };

    fetchProjectData();
  }, [actor]);

  function compareValues(key) {
    if (JSON.stringify(orignalData[key]) === JSON.stringify(updatedData[key])) {
      return "text-green-500"; // Data matches, use green
    } else {
      return "text-red-500"; // Data differs, use red
    }
  }

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
  // const sliderKeys = [
  //   "Team",
  //   "ProblemAndVision",
  //   "ValueProp",
  //   "Product",
  //   "Market",
  //   "BusinessModel",
  //   "Scale",
  //   "Exit",
  // ];
  //   const customStyles = `
  //   .slider-mark::after {
  //     content: attr(data-label);
  //     position: absolute;
  //     top: -2rem;
  //     left: 50%;
  //     transform: translateX(-50%);
  //     text-align: center;
  //     white-space: nowrap;
  //     font-size: 0.75rem;
  //     color: #fff;
  //     padding: 0.2rem 0.4rem;
  //     border-radius: 0.25rem;
  //   }
  // `;

  // const handleSliderChange = (index, value) => {
  //   const key = sliderKeys[index];
  //   const newSliderValues = { ...sliderValues, [key]: value };
  //   setSliderValues(newSliderValues);
  //   const newSliderValuesProgress = {
  //     ...sliderValuesProgress,
  //     [key]: value === 9 ? 100 : Math.floor((value / 9) * 100),
  //   };
  //   setSliderValuesProgress(newSliderValuesProgress);
  // };

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

  // useEffect(() => {
  //   const requestedRole = Allrole?.role?.find(
  //     (role) => role.status === "requested"
  //   );
  //   if (requestedRole) {
  //     setCurrent(requestedRole.name.toLowerCase());
  //   } else {
  //     setCurrent("user");
  //   }
  // }, [Allrole.role]);

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

  // const getButtonClass = (status) => {
  //   switch (status) {
  //     case "active":
  //       return "bg-[#A7943A]";
  //     case "requested":
  //       return "bg-[#e55711]";
  //     case "approved":
  //       return "bg-[#0071FF]";
  //     default:
  //       return "bg-[#FF3A41]";
  //   }
  // };

  // function constructMessage(role) {
  //   let baseMessage = `This User's ${
  //     role.name.charAt(0).toUpperCase() + role.name.slice(1)
  //   } Profile `;

  //   if (
  //     role.status === "active" &&
  //     role.approved_on &&
  //     role.approved_on.length > 0
  //   ) {
  //     baseMessage += `was approved on ${numberToDate(role.approved_on[0])}`;
  //   } else if (
  //     role.status === "approved" &&
  //     role.approved_on &&
  //     role.approved_on.length > 0
  //   ) {
  //     baseMessage += `was approved on ${numberToDate(role.approved_on[0])}`;
  //   } else if (
  //     role.status === "requested" &&
  //     role.requested_on &&
  //     role.requested_on.length > 0
  //   ) {
  //     baseMessage += `request was made on ${numberToDate(
  //       role.requested_on[0]
  //     )}`;
  //   } else if (
  //     role.status === "rejected" &&
  //     role.rejected_on &&
  //     role.rejected_on.length > 0
  //   ) {
  //     baseMessage += `was rejected on ${numberToDate(role.rejected_on[0])}`;
  //   } else {
  //     baseMessage += `is currently in the '${role.status}' status without a specific date.`;
  //   }

  //   return baseMessage;
  // }

  const date = numberToDate(orignalData?.creation_date);

  const weeklyUsers = Number(orignalData?.weeklyActiveUsers);
  const revenueNum = Number(orignalData?.revenue);
  const icpGrants = Number(orignalData?.icpGrants);
  const investorInvest = Number(orignalData?.investors);
  const otherEcosystem = Number(orignalData?.raisedFromOtherEcosystem);
  const snsGrants = Number(orignalData?.snsGrants);
  const targetAmount = orignalData?.targetAmount
    ? Number(orignalData?.targetAmount)
    : 0;

  const updatedweeklyUsers = Number(updatedData?.weeklyActiveUsers);
  const updatedRevenueNum = Number(updatedData?.revenue);
  const updatedIcpGrants = Number(updatedData?.icpGrants);
  const updatedInvestorInvest = Number(updatedData?.investors);
  const updatedOtherEcosystem = Number(updatedData?.raisedFromOtherEcosystem);
  const updatedSnsGrants = Number(updatedData?.snsGrants);
  const updatedTargetAmount = updatedData?.targetAmount
    ? Number(updatedData?.targetAmount)
    : 0;
  // const profile = uint8ArrayToBase64(
  //   orignalData?.userProfilePicture
  // );
  // const logo =
  //   orignalData && orignalData?.projectLogo.length > 0
  //     ? uint8ArrayToBase64(orignalData?.projectLogo)
  //     : null;

  // const Project_cover = uint8ArrayToBase64(orignalData?.projectCover);

  if (!orignalData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full px-[4%] py-[4%]">
      <div className="w-full">
        <div className=" bg-white  shadow-md shadow-gray-400 pb-6 pt-4 rounded-lg w-full">
          <div className="w-full flex  md:flex-row flex-col md:items-start items-center justify-around px-[4%] py-4">
            <div className="flex md:flex-row flex-col w-full gap-2">
              <div>
                <div className="relative">
                  <img
                    className="md:w-[6rem] border-gray-400 border bg-gray-400 object-fill md:h-[6rem] w-[4rem] h-[4rem] justify-center aspect-square rounded-md"
                    src={
                      showOriginalCover
                        ? orignalData?.projectCover
                        : updatedData?.projectCover
                    }
                    alt="Project Cover"
                  />
                </div>

                <label className="inline-flex items-center mt-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={!showOriginalCover}
                    onChange={() => setShowOriginalCover(!showOriginalCover)}
                  />
                  <div className="relative w-11 h-6 bg-gray-200 rounded-full peer-focus:ring-4 peer-focus:ring-green-300 peer-checked:bg-green-600 dark:bg-gray-700 dark:peer-focus:ring-green-800">
                    <div className="absolute left-1 top-0.5 bg-white border border-gray-300 rounded-full h-5 w-5 transition-transform peer-checked:translate-x-5 dark:border-gray-600"></div>
                  </div>
                </label>
              </div>

              <div className="flex flex-col pl-4  mt-2 w-auto justify-start md:mb-0 mb-6">
                <div className="flex flex-row gap-4 items-center w-full md:w-[248px] lg:w-[500px]">
                  <h1 className="text-xl  md:text-3xl font-bold bg-gray-500 text-transparent bg-clip-text truncate">
                    {orignalData?.projectName}
                  </h1>
                  <h1 className="text-xl  md:text-3xl font-bold bg-black text-transparent bg-clip-text truncate">
                    {updatedData?.projectName}
                  </h1>
                </div>

                <div className="flex flex-col items-start gap-3 text-sm">
                  <div className="flex flex-row md:items-center mt-2">
                    <p className="pt-1">{openchat_username}</p>
                    <div className="flex flex-row flex-wrap items-center space-x-2 ml-3 space-y-1">
                    {orignalData?.reasonToJoin?.map((reason, index) => (
                        <p
                          key={index}
                          className="bg-[#c9c5c5] py-0.5 rounded-full px-3"
                        >
                          {reason.replace(/_/g, " ")}
                        </p>
                      ))}
                    </div>
                    <div className="flex flex-row flex-wrap items-center space-x-2 ml-3 space-y-1">
                      {updatedData?.reasonToJoin?.map((reason, index) => (
                        <p
                          key={index}
                          className="bg-[#c9c5c5] py-0.5 rounded-full px-3"
                        >
                          {reason.replace(/_/g, " ")}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full  flex flex-row items-start justify-start px-[4%]  text-gray-600 md:text-md text-sm">
            <p className="mr-4">{orignalData?.userCountry}</p>
            <p className="mr-4">{updatedData?.userCountry}</p>

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
                            {orignalData?.projectName}
                          </h1>


                          <h1 className="text-2xl md:text-3xl font-bold bg-black text-transparent bg-clip-text truncate">
                            {updatedData?.projectName}
                          </h1>
                          <div>
                            {editMode ? (
                              <input
                                type="text"
                                value={updatedData?.projectName}
                                onChange={(e) =>
                                  setUpdatedData({
                                    ...updatedData,
                                    projectName: e.target.value,
                                  })
                                }
                              />
                            ) : (
                              <h1>{updatedData?.projectName}</h1>
                            )}
                          </div>
                        </div>



                        <div className="justify-end flex flex-col">
                          <p>{orignalData?.preferredIcpHub}</p>
                          <p>{updatedData?.preferredIcpHub}</p>

                          <p>{date}</p>
                        </div>
                      </div>

                      <div className="border border-gray-400 w-full"></div>
                      <div className="flex flex-row justify-between mt-2">
                        <p className="font-bold">{orignalData?.userFullName}</p>
                        <p className="font-bold">{updatedData?.userFullName}</p>
                        <div className="flex flex-row space-x-1 cursor-pointer">
                          <a
                            href={orignalData?.projectLinkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {linkedInSvgBig}
                          </a>
                          <a
                            href={orignalData?.projectTwitter}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {twitterSvgBig}
                          </a>
                        </div>
                        <div className="flex flex-row space-x-1 cursor-pointer">
                          <a
                            href={updatedData?.projectLinkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {linkedInSvgBig}
                          </a>
                          <a
                            href={updatedData?.projectTwitter}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {twitterSvgBig}
                          </a>
                        </div>
                      </div>
                      <p>{orignalData?.userEmail}</p>
                      <p>{updatedData?.userEmail}</p>

                      <div className="border border-gray-400 w-full"></div>
                      <div className="flex flex-row justify-between mt-2">
                        <p className="">{orignalData?.userCountry}</p>
                        <p className="">{updatedData?.userCountry}</p>
                        <div className="flex flex-row space-x-1 cursor-pointer">
                          <a
                            href={orignalData?.githubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {githubSvgBig}
                          </a>
                          <a
                            href={orignalData?.projectDiscord}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {discordSvgBig}
                          </a>
                        </div>
                        <div className="flex flex-row space-x-1 cursor-pointer">
                          <a
                            href={updatedData?.githubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {githubSvgBig}
                          </a>
                          <a
                            href={updatedData?.projectDiscord}
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
                          <p className="font-extrabold items-center">
                            {updatedweeklyUsers}
                          </p>
                        </div>
                        <div className="flex flex-row justify-between mt-2 space-x-2">
                          <p>Revenue</p>
                          <p className="font-extrabold items-center">
                            {revenueNum}
                          </p>
                          <p className="font-extrabold items-center">
                            {updatedRevenueNum}
                          </p>
                        </div>
                        <div className="flex flex-row justify-between mt-2 space-x-2">
                          <p>ICP Grants</p>
                          <p className="font-extrabold items-center">
                            {icpGrants}
                          </p>
                          <p className="font-extrabold items-center">
                            {updatedIcpGrants}
                          </p>
                        </div>
                        <div className=" flex flex-row justify-between mt-2 space-x-2">
                          <p>Investors</p>
                          <p className="font-extrabold items-center">
                            {investorInvest}
                          </p>
                          <p className="font-extrabold items-center">
                            {updatedInvestorInvest}
                          </p>
                        </div>
                        <div className="flex flex-row justify-between mt-2 space-x-2">
                          <p>Raised from Other Ecosysytem</p>
                          <p className="font-extrabold items-center">
                            {otherEcosystem}
                          </p>
                          <p className="font-extrabold items-center">
                            {updatedOtherEcosystem}
                          </p>
                        </div>
                        <div className="flex flex-row justify-between mt-2 space-x-2">
                          <p> Targeted Amount</p>
                          <p className="font-extrabold items-center">
                            {targetAmount}
                          </p>
                          <p className="font-extrabold items-center">
                            {updatedTargetAmount}
                          </p>
                        </div>
                        <div className="flex flex-row justify-between mt-2 space-x-2">
                          <p>Sns</p>
                          <p className="font-extrabold">{snsGrants}</p>
                          <p className="font-extrabold">{updatedSnsGrants}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="border border-gray-400 w-full mt-6 relative "></div>

                <div className="absolute xl:lg:top-[500px] md:top-[700px] top-[700px] right-[-95px] flex  bg-blue-100 w-[190.63px] h-[190px]  border rounded-full  "></div>

                {orignalData?.projectLogo  && (
                    <div className="flex flex-col md:flex-row items-center justify-around w-full mt-4">
                      <div className="md:w-1/2 w-full md:flex md:items-center">
                        <div className="flex flex-col items-start md:flex-row md:items-center w-full p-4">
                          <img
                            className="w-28 h-28 md:w-36 md:h-36 lg:w-44 lg:h-44 xl:w-48 xl:h-48 md:mx-0 rounded-full border-gray-400 border bg-gray-400"
                            src={
                              showOriginalProfile
                                ? orignalData.userProfilePicture
                                : updatedData.userProfilePicture
                            }
                            alt="profile picture"
                          />
                          <div className="mt-4 md:mt-0 md:ml-4 text-start md:text-left">
                            <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-gray-800">
                              Profile Image
                            </h2>
                            <p className="text-sm md:text-base text-gray-600">
                              A detailed view of the individual's profile.
                            </p>
                            <label className="inline-flex items-center mt-2 cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={!showOriginalProfile}
                                onChange={() =>
                                  setShowOriginalProfile(!showOriginalProfile)
                                }
                              />
                              <div className="relative w-11 h-6 bg-gray-200 rounded-full peer-focus:ring-4 peer-focus:ring-green-300 peer-checked:bg-green-600 dark:bg-gray-700 dark:peer-focus:ring-green-800">
                                <div className="absolute left-1 top-0.5 bg-white border border-gray-300 rounded-full h-5 w-5 transition-transform peer-checked:translate-x-5 dark:border-gray-600"></div>
                              </div>
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="md:w-1/2 w-full md:flex md:items-center">
                        <div className="flex flex-col items-start md:flex-row md:items-center w-full p-4">
                          <img
                            className="w-28 h-28 border-gray-400 border bg-gray-400 md:w-36 md:h-36 lg:w-44 lg:h-44 xl:w-48 xl:h-48 md:mx-0 rounded-full"
                            src={
                              showOriginalLogo
                                ? orignalData.projectLogo
                                : updatedData.projectLogo
                            }
                            alt="project-logo"
                          />
                          <div className="mt-4 md:mt-0 md:ml-4 text-start md:text-left">
                            <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-gray-800">
                              Project Logo
                            </h2>
                            <p className="text-sm md:text-base text-gray-600">
                              Representative logo of the organization.
                            </p>
                            <label className="inline-flex items-center mt-2 cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={!showOriginalLogo}
                                onChange={() =>
                                  setShowOriginalLogo(!showOriginalLogo)
                                }
                              />
                              <div className="relative w-11 h-6 bg-gray-200 rounded-full peer-focus:ring-4 peer-focus:ring-green-300 peer-checked:bg-green-600 dark:bg-gray-700 dark:peer-focus:ring-green-800">
                                <div className="absolute left-1 top-0.5 bg-white border border-gray-300 rounded-full h-5 w-5 transition-transform peer-checked:translate-x-5 dark:border-gray-600"></div>
                              </div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                <h1 className="text-3xl font-bold text-gray-800 mb-2 mt-6">
                  About Project
                </h1>
                <p className="text-gray-600 text-lg mb-10 break-all">
                  {orignalData?.projectDescription}
                </p>
                <p className="text-gray-600 text-lg mb-10 break-all">
                  {updatedData?.projectDescription}
                </p>

                <div className="flex md:flex-row flex-col justify-between md:items-center items-start w-full">
                  <div className="md:w-1/2 w-3/4 flex flex-row items-center justify-start sm:text-left pr-4">
                    <h2 className="text-xl sm:text-xl font-bold text-gray-800 mb-2 sm:mb-0 mr-2">
                      Daap Link:
                    </h2>
                    <div className="flex flex-grow items-center truncate">
                      <p className="text-gray-600 text-sm md:text-md truncate px-4">
                        {orignalData?.dappLink}
                      </p>
                      <a
                        href={orignalData?.dappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pl-2"
                      >
                        {openWebsiteIcon}
                      </a>{" "}
                    </div>
                    <div className="flex flex-grow items-center truncate">
                      <p className="text-gray-600 text-sm md:text-md truncate px-4">
                        {updatedData?.dappLink}
                      </p>
                      <a
                        href={updatedData?.dappLink}
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
                        {orignalData?.projectWebsite}
                      </p>
                      <a
                        href={orignalData?.projectWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 pl-2"
                      >
                        {openWebsiteIcon}
                      </a>
                    </div>

                    <div className="flex flex-grow items-center truncate  z-10">
                      <p className="text-gray-600 text-sm md:text-md truncate">
                        {updatedData?.projectWebsite}
                      </p>
                      <a
                        href={updatedData?.projectWebsite}
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
                        {orignalData?.projectElevatorPitch}
                      </p>
                      <a
                        href={orignalData?.projectElevatorPitch}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pl-2"
                      >
                        {openWebsiteIcon}
                      </a>{" "}
                    </div>
                    <div className="flex flex-grow items-center truncate">
                      <p className="text-gray-600 text-sm md:text-md truncate px-4">
                        {updatedData?.projectElevatorPitch}
                      </p>
                      <a
                        href={updatedData?.projectElevatorPitch}
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
                        {orignalData?.longTermGoals}
                      </p>
                      <a
                        href={orignalData?.longTermGoals}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 pl-2"
                      >
                        {openWebsiteIcon}
                      </a>
                    </div>

                    <div className="flex flex-grow items-center truncate  z-10">
                      <p className="text-gray-600 text-sm md:text-md truncate">
                        {updatedData?.longTermGoals}
                      </p>
                      <a
                        href={updatedData?.longTermGoals}
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
                        {orignalData?.promotionalVideo}
                      </p>
                      <a
                        href={orignalData?.promotionalVideo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pl-2"
                      >
                        {openWebsiteIcon}
                      </a>{" "}
                    </div>
                    <div className="flex flex-grow items-center truncate">
                      <p className="text-gray-600 text-sm md:text-md truncate px-4">
                        {updatedData?.promotionalVideo}
                      </p>
                      <a
                        href={updatedData?.promotionalVideo}
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
                        {orignalData?.tokenEconomics}
                      </p>
                      <a
                        href={orignalData?.tokenEconomics}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 pl-2"
                      >
                        {openWebsiteIcon}
                      </a>
                    </div>
                    <div className="flex flex-grow items-center truncate  z-10">
                      <p className="text-gray-600 text-sm md:text-md truncate">
                        {updatedData?.tokenEconomics}
                      </p>
                      <a
                        href={updatedData?.tokenEconomics}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 pl-2"
                      >
                        {openWebsiteIcon}
                      </a>
                    </div>
                  </div>
                </div>

                {orignalData?.privateDocs &&
                  orignalData?.privateDocs.length > 0 && (
                    <div className="bg-white shadow-md shadow-gray-400 pb-6 pt-4 rounded-lg w-full mt-4">
                      <div className="px-6 py-4">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                          Private Documents
                        </h2>
                        <div className="space-y-4">
                          {orignalData?.privateDocs.map((doc, index) => (
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

                        <div className="space-y-4">
                          {updatedData?.privateDocs.map((doc, index) => (
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

                {orignalData?.publicDocs &&
                  orignalData?.publicDocs.length > 0 && (
                    <div className="bg-white shadow-md shadow-gray-400 pb-6 pt-4 rounded-lg w-full mt-4">
                      <div className="px-6 py-4">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                          Public Documents
                        </h2>
                        <div className="space-y-4">
                          {orignalData?.publicDocs.map((doc, index) => (
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

                        <div className="space-y-4">
                          {updatedData?.publicDocs.map((doc, index) => (
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
                      {orignalData?.countryOfRegistration ? (
                        <span>{orignalData?.countryOfRegistration}</span>
                      ) : (
                        <span className="flex items-center">
                          {noDataPresentSvg}
                          Data Not Available
                        </span>
                      )}
                    </p>

                    <p className="text-lg font-bold text-gray-800 pl-6">
                      {updatedData?.countryOfRegistration ? (
                        <span>{updatedData?.countryOfRegistration}</span>
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
                      {orignalData?.isYourProjectRegistered ? (
                        "Yes"
                      ) : "No" ? (
                        <span>
                          {orignalData?.isYourProjectRegistered
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

                    <p className="text-lg font-bold text-gray-800 pl-6">
                      {" "}
                      {updatedData?.isYourProjectRegistered ? (
                        "Yes"
                      ) : "No" ? (
                        <span>
                          {updatedData?.isYourProjectRegistered
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

                    <p className="text-lg font-bold text-gray-800 pl-6">
                      {" "}
                      {updatedData?.uploadPrivateDocuments ? (
                        "Yes"
                      ) : "No" ? (
                        <span>
                          {updatedData?.uploadPrivateDocuments ? "Yes" : "No"}
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
                      {orignalData?.supportsMultichain ? (
                        <span>{orignalData?.supportsMultichain}</span>
                      ) : (
                        <span className="flex items-center">
                          {noDataPresentSvg}
                          Data Not Available
                        </span>
                      )}
                    </p>

                    <p className="text-lg font-bold text-gray-800 pl-6">
                      {updatedData?.supportsMultichain ? (
                        <span>{updatedData?.supportsMultichain}</span>
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

                    <p className="text-lg font-bold text-gray-800 pl-6">
                      {" "}
                      {updatedData?.moneyRaisedTillNow ? (
                        "Yes"
                      ) : "No" ? (
                        <span>
                          {updatedData?.moneyRaisedTillNow ? "Yes" : "No"}
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
                      {orignalData?.preferredIcpHub ? (
                        <span>{orignalData?.preferredIcpHub}</span>
                      ) : (
                        <span className="flex items-center">
                          {noDataPresentSvg}
                          Data Not Available
                        </span>
                      )}
                    </p>

                    <p className="text-lg font-bold text-gray-800 pl-6">
                      {updatedData?.preferredIcpHub ? (
                        <span>{updatedData?.preferredIcpHub}</span>
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

                  <div className=" md:w-1/2 w-full flex flex-row md:items-center items-start justify-start md:pl-5">
                    <h1 className="text-lg font-normal text-gray-600">
                      Mentor Assigned :
                    </h1>
                    <p className="text-lg font-bold text-gray-800 pl-6">
                      {orignalData?.mentorsAssigned ? (
                        <span>{orignalData?.mentorsAssigned}</span>
                      ) : (
                        <span className="flex items-center">
                          {noDataPresentSvg}
                          Data Not Available
                        </span>
                      )}
                    </p>

                    <p className="text-lg font-bold text-gray-800 pl-6">
                      {updatedData?.mentorsAssigned ? (
                        <span>{updatedData?.mentorsAssigned}</span>
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
                      {orignalData?.areaOfInterest ? (
                        <span>{orignalData?.areaOfInterest}</span>
                      ) : (
                        <span className="flex items-center">
                          {noDataPresentSvg}
                          Data Not Available
                        </span>
                      )}
                    </p>

                    <p className="text-lg font-bold text-gray-800 pl-6 overflow-x-auto">
                      {updatedData?.areaOfInterest ? (
                        <span>{updatedData?.areaOfInterest}</span>
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

                    <p className="text-lg font-bold text-gray-800 pl-6">
                      {" "}
                      {updatedData?.projectTeams ? (
                        "Yes"
                      ) : "No" ? (
                        <span>{updatedData?.projectTeams ? "Yes" : "No"}</span>
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
                      {orignalData?.liveOnIcpMainnet ? (
                        "Yes"
                      ) : "No" ? (
                        <span>
                          {orignalData?.liveOnIcpMainnet ? "Yes" : "No"}
                        </span>
                      ) : (
                        <span className="flex items-center">
                          {noDataPresentSvg}
                          Data Not Available
                        </span>
                      )}
                    </p>

                    <p className="text-lg font-bold text-gray-800 pl-6">
                      {" "}
                      {updatedData?.liveOnIcpMainnet ? (
                        "Yes"
                      ) : "No" ? (
                        <span>
                          {updatedData?.liveOnIcpMainnet ? "Yes" : "No"}
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
                      {orignalData?.targetMarket ? (
                        <span>{orignalData?.targetMarket}</span>
                      ) : (
                        <span className="flex items-center">
                          {noDataPresentSvg}
                          Data Not Available
                        </span>
                      )}
                    </p>

                    <p className="text-lg font-bold text-gray-800 pl-6">
                      {updatedData?.targetMarket ? (
                        <span>{updatedData?.targetMarket}</span>
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
                      {orignalData?.typeOfRegistration ? (
                        <span>{orignalData?.typeOfRegistration}</span>
                      ) : (
                        <span className="flex items-center">
                          {noDataPresentSvg}
                          Data Not Available
                        </span>
                      )}
                    </p>

                    <p className="text-lg font-bold text-gray-800 pl-6">
                      {updatedData?.typeOfRegistration ? (
                        <span>{updatedData.typeOfRegistration}</span>
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
                      {orignalData?.vcsAssigned ? (
                        <span>{orignalData?.vcsAssigned}</span>
                      ) : (
                        <span className="flex items-center">
                          {noDataPresentSvg}
                          Data Not Available
                        </span>
                      )}
                    </p>

                    <p className="text-lg font-bold text-gray-800 pl-6">
                      {updatedData?.vcsAssigned ? (
                        <span>{updatedData?.vcsAssigned}</span>
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
                      {orignalData?.reasonToJoinIncubator ? (
                        <span>{orignalData?.reasonToJoinIncubator}</span>
                      ) : (
                        <span className="flex items-center">
                          {noDataPresentSvg}
                          Data Not Available
                        </span>
                      )}
                    </p>

                    <p className="text-lg font-bold text-gray-800 pl-6 overflow-x-auto">
                      {updatedData?.reasonToJoinIncubator ? (
                        <span>{updatedData?.reasonToJoinIncubator}</span>
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
       {/*  {Allrole?.map((role, index) => {
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
        })}*/}

<button onClick={() => setEditMode(prev => !prev)} className="button">
  {editMode ? "Update" : "Edit"}
</button>
      </div> 


























      <div className="w-full flex gap-4  md:flex-row flex-col mt-4">
      <div className=" bg-[#D2D5F2]  shadow-md shadow-gray-400 p-6 rounded-lg md:w-1/4 w-full">
        <div className="justify-center flex items-center">
          <div
            className="size-fit  rounded-full bg-no-repeat bg-center bg-cover relative p-1 bg-blend-overlay border-2 border-gray-300"
            style={{
              backgroundImage: `url(${orignalData?.userProfilePicture}), linear-gradient(168deg, rgba(255, 255, 255, 0.25) -0.86%, rgba(255, 255, 255, 0) 103.57%)`,
              backdropFilter: "blur(20px)",
            }}
          >
            <img
              className="object-cover size-44 max-h-44 rounded-full"
              src={orignalData?.userProfilePicture}
              alt=""
            />
          </div>
        </div>
        <div className="flex flex-col ml-4  mt-2 w-auto justify-start md:mb-0 mb-6">
          <div className="flex flex-row  gap-4 items-center">
            <h1 className="md:text-3xl text-xl md:font-extrabold font-bold  bg-black text-transparent bg-clip-text">
              {orignalData.userFullName}
            </h1>
          </div>
          <p className="text-gray-500 md:text-md text-sm font-normal flex mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="size-4 " fill="currentColor"><path d="M256 64C150 64 64 150 64 256s86 192 192 192c17.7 0 32 14.3 32 32s-14.3 32-32 32C114.6 512 0 397.4 0 256S114.6 0 256 0S512 114.6 512 256v32c0 53-43 96-96 96c-29.3 0-55.6-13.2-73.2-33.9C320 371.1 289.5 384 256 384c-70.7 0-128-57.3-128-128s57.3-128 128-128c27.9 0 53.7 8.9 74.7 24.1c5.7-5 13.1-8.1 21.3-8.1c17.7 0 32 14.3 32 32v80 32c0 17.7 14.3 32 32 32s32-14.3 32-32V256c0-106-86-192-192-192zm64 192a64 64 0 1 0 -128 0 64 64 0 1 0 128 0z"/></svg><span className="ml-2 truncate">{orignalData.userEmail}</span>
          </p>
          <div className="flex flex-col items-start gap-3 text-sm">
            <div className="flex flex-row  text-gray-600 space-x-2">
              {place}
              <p className="underline ">{orignalData?.userCountry}</p>
            </div>
            <div className=" flex flex-row space-x-2 text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="size-4" fill="currentColor"><path d="M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H64C28.7 64 0 92.7 0 128v16 48V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V192 144 128c0-35.3-28.7-64-64-64H344V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H152V24zM48 192H400V448c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192z"/></svg>
              <p className="ml-2">{date}</p>
            </div>
            <div className="flex flex-row space-x-2 text-gray-600">
              <img src={openchat_username} alt="openchat_username" className="size-5"/>
              <p className="ml-2">{orignalData?.openchatUsername}</p>
            </div>
            {orignalData?.areaOfInterest && (
                            <div className="flex gap-2 mt-2 text-xs items-center flex-wrap">
                              {orignalData?.areaOfInterest
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
                          )}
            
          </div>

          {orignalData?.reasonToJoin && (
            <p className="mt-8 text-black mb-2">Reason to join</p>
          )}
          <div className="flex text-gray-700 flex-row gap-2 flex-wrap text-xs">
          {orignalData?.reasonToJoin?.map((reason, index) => (
              <p key={index} className="bg-[#c9c5c5] py-0.5 rounded-full px-3">
                          {reason.replace(/_/g, " ")}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className=" bg-[#D2D5F2]  shadow-md shadow-gray-400 pb-6 pt-4 rounded-lg md:w-3/4 w-full">
        <div className="w-full flex flex-col  justify-around px-[4%] py-4">
          <div className="w-full flex flex-row justify-between">
           <h1 className="text-xl font-bold text-black mb-2">About Project</h1>
           <div className="flex flex-row space-x-2">
 
 
 
          <svg xmlns="http://www.w3.org/2000/svg"  className={`dot bg-white w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-300 ease-in-out`} viewBox="0 0 24 24" width="24" height="24">
            <g fill="#FF6B6B" > 
              <circle cx="18" cy="12" r="2" fill="#FF6B6B"/> 
              <path d="M5 12l7-7v4h4v6h-4v4l-7-7z"/>
             </g>
            </svg>

           <svg xmlns="http://www.w3.org/2000/svg"  className={`dot bg-white w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-300 ease-in-out`} viewBox="0 0 24 24" width="24" height="24">
             <g  fill="#4CAF50"> 
  <circle cx="6" cy="12" r="2" fill="#4CAF50"/> 
  <path d="M19 12l-7-7v4H8v6h4v4l7-7z"/>
              </g>
            </svg>
         

          

           </div>
          </div>




          <div className="flex md:flex-row flex-col w-full mt-3 items-start">
  <div className=" md:w-[5.5rem] md:flex-shrink-0 w-full justify-start">
    <img
      className="md:w-20 object-fill md:h-20 w-16 h-16 border border-white bg-gray-300 justify-center rounded-md"
      src={showOriginalLogo ? orignalData.projectLogo : updatedData.projectLogo}
      alt="projectLogo"
    />
    <label htmlFor="toggle" className="flex items-center cursor-pointer">
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
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
              <g fill="#FF6B6B">
                <circle cx="6" cy="12" r="2" />
                <path d="M19 12l-7-7v4H8v6h4v4l7-7z"/>
              </g>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
              <g fill="#4CAF50">
                <circle cx="18" cy="12" r="2" />
                <path d="M5 12l7-7v4h4v6h-4v4l-7-7z"/>
              </g>
            </svg>
          )}
        </div>
      </div>
    </label>
  </div>
  <div className="flex flex-col md:flex-grow w-full justify-start md:ml-4 md:mb-0 mb-6">
     <div className="flex flex-row  gap-4 items-center">
                <h1 className="md:text-base md:h-[8rem] h-[12rem] flex-wrap text-sm bg-black break-all text-transparent bg-clip-text">
                  {orignalData?.projectDescription}
                </h1>
              </div>
              
              <div className="border border-gray-400 w-full mt-2 mb-4 relative "/>







              <div className="flex flex-col md:flex-row justify-between items-start gap-3 text-sm w-full">
  {/* Left Column */}
  <div className="flex flex-col md:w-1/2 w-full">
    {/* DApp Link */}
    <div className="flex flex-col mb-4 md:mb-6">
      <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">Daap Link:</h2>
      <p className="text-[#7283EA] text-xs font-semibold md:text-sm truncate px-4">
        {orignalData?.dappLink || 'Not available'}
      </p>
    </div>

    {/* Project Elevator Pitch */}
    <div className="flex flex-col mb-4 md:mb-6">
      <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">Project Elevator Pitch:</h2>
      <p className="text-[#7283EA] text-xs font-semibold md:text-sm truncate px-4">
        {orignalData?.projectElevatorPitch || 'Not available'}
      </p>
    </div>

    {/* Promotional Video */}
    <div className="flex flex-col mb-4 md:mb-6">
      <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">Promotional Video:</h2>
      <p className="text-[#7283EA] text-xs font-semibold md:text-sm truncate px-4">
        {orignalData?.promotionalVideo || 'Not available'}
      </p>
    </div>
  </div>

  {/* Right Column */}
  <div className="flex flex-col md:w-1/2 w-full">
    {/* Website */}
    <div className="flex flex-col mb-4 md:mb-6">
      <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">Website:</h2>
      <p className="text-[#7283EA] text-xs font-semibold md:text-sm truncate px-4">
        {orignalData?.projectWebsite || 'Not available'}
      </p>
    </div>

    {/* Long Term Goal */}
    <div className="flex flex-col mb-4 md:mb-6">
      <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">Long Term Goal:</h2>
      <p className="text-[#7283EA] text-xs font-semibold md:text-sm truncate px-4">
        {orignalData?.longTermGoals || 'Not available'}
      </p>
    </div>

    {/* Token Economics */}
    <div className="flex flex-col mb-4 md:mb-6">
      <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">Token Economics:</h2>
      <p className="text-[#7283EA] text-xs font-semibold md:text-sm truncate px-4">
        {orignalData?.tokenEconomics || 'Not available'}
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
     
<div className="w-full flex gap-4  md:flex-row flex-col mt-4">

<div className="flex flex-col md:w-1/4 w-full">
  <div className=" bg-[#D2D5F2] flex  flex-col shadow-md shadow-gray-400 p-6 rounded-lg  w-full mb-4">
<h1 className="text-xl font-bold text-gray-800  mb-2">Private Documents</h1>
<div className="flex flex-row gap-2  px-2 py-1 items-center">
  <img src='' alt="PDF Icon" className="w-10 h-12"/> 
  <div className="overflow-hidden">
  <div className="space-y-4 w-full">
  {orignalData?.privateDocs.map((doc, index) => (
    <div key={index} className="truncate flex flex-col items-start"> 
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
<h1 className="text-xl font-bold text-gray-800  mb-2">Public Documents</h1>
<div className="flex flex-row gap-2  px-2 py-1 items-center">
  <img src='' alt="PDF Icon" className="w-10 h-12"/> 
  <div className="overflow-hidden">
  <div className="space-y-4 w-full">
  {orignalData?.publicDocs.map((doc, index) => (
    <div key={index} className="truncate flex flex-col items-start"> 
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
      <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">Country of Registration:</h2>
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
      <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">Uploaded Private Docs :</h2>
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
      <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">Money Raised Till Now :</h2>
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
      <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">Project Area Of Focus :</h2>
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
      <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">Area Of Interest :</h2>
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
      <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">Live On Mainnet :</h2>
      <p className="text-md  font-normal text-gray-600 pl-6">
      {orignalData?.liveOnIcpMainnet ? (
                        "Yes"
                      ) : "No" ? (
                        <span>
                          {orignalData?.liveOnIcpMainnet ? "Yes" : "No"}
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
      <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">Type of Registration :</h2>
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
      <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">Reason to join Incubator :</h2>
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
      <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">Project Registered :</h2>
      <p className="text-md  font-normal text-gray-600 pl-6">
      {orignalData?.isYourProjectRegistered ? (
                        "Yes"
                      ) : "No" ? (
                        <span>
                          {orignalData?.isYourProjectRegistered
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

    <div className="flex flex-col mb-4 md:mb-6">
      <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">Support Multichain :</h2>
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
      <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">Preferred ICP Hub :</h2>
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
      <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">Mentor Assigned :</h2>
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
      <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">Project Team :</h2>
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
      <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">Target Market :</h2>
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
      <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">VC's assigned :</h2>
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
      </div>








    </div>
  );
};

export default ProjectUpdate;

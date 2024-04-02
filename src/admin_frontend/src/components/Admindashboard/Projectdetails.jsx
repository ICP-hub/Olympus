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
import { linkedInSvg } from "../../../../IcpAccelerator_frontend/src/components/Utils/Data/SvgData";
import { twitterSvg } from "../../../../IcpAccelerator_frontend/src/components/Utils/Data/SvgData";
import { discordSvg } from "../../../../IcpAccelerator_frontend/src/components/Utils/Data/SvgData";
import { githubSvg } from "../../../../IcpAccelerator_frontend/src/components/Utils/Data/SvgData";


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

  // console.log("userdata =>>>>>>> ", userData);
  // console.log("Allrole =>>>>>>> ", Allrole);
  // console.log("principal =>>>>>>> ", principal);

  // const totalSteps = 80;
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
    // console.log('index',index)
    // console.log('index',value)

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
    // console.log(principal, boolean, state, category);

    setIsDeclining(true);
    try {
      const covertedPrincipal = await Principal.fromText(principal);
      // console.log("Converted Principal ", covertedPrincipal);

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
      // toggleModelPopUp(false);
      window.location.reload();
    }
  };

  const allowUserRoleHandler = async (principal, boolean, state, category) => {
    setIsAccepting(true);

    // console.log(principal, boolean, state, category);
    try {
      const covertedPrincipal = await Principal.fromText(principal);
      // console.log("Converted Principal ", covertedPrincipal);
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
      // window.location.reload();
    }
  };

  const date = numberToDate(userData[0].creation_date);
  const profile = uint8ArrayToBase64(
    userData[0].params.user_data.profile_picture[0]
  );
  return (
    <div>
      <div className="mb-4 justify-center flex items-center">
        <div className="p-2 shadow-lg  bg-[#FFFFFF4D] border-[#E9E9E9] border-1 drop-shadow-[#0000000D] rounded-[10px] w-full">
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
                {/* {socials && ( */}
                <div className="flex gap-2.5 mr-2 mt-1.5">
                  <div className="w-4 h-4">{/* {linkedInSvg} */}</div>
                  <div className="w-4 h-4">{/* {twitterSvg} */}</div>
                </div>
                {/* )} */}

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
                      {/* Assuming Star is defined elsewhere */}
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
        </div>
      </div>
      <div>
        <div className="p-3 flex items-center bg-[#FFFFFF4D] border-[#E9E9E9] border-1 drop-shadow-[#0000000D] rounded-[10px]"></div>
        <div className="flex justify-center">
          <div className="relative w-full md:w-[950px] border-2 border-black overflow-hidden">
            <div className="absolute bottom-0 left-7 top-[-28px] w-[400.31px] h-[450px] bg-blue-100 ellipse-quarter-left rounded-md rotate-90 z-0"></div>
            <div className="absolute top-0 right-0 bg-blue-100 w-[209.63px] h-[210px]  ellipse-quarter-right rounded-md "></div>

            <div className="p-8 flex flex-col items-center h-full relative z-10 w-full">
              <div className="flex flex-col w-full">
                <div className="w-fit text-black  text-2xl font-bold font-fontUse leading-none md:ml-4 mt-8">
                  Details
                </div>
                <div className="flex-row justify-center ">
                  <div className="w-full flex flex-col md:flex-row">
                    <div className="w-full md:w-1/2 p-4 text-[#737373] text-lg font-light font-fontUse mb-4 text-wrap mt-2 md:ml-4 ">
                      <div className="flex flex-row justify-between"></div>
                      <div className="mb-[-22px]">
                        <p className="flex justify-end ">
                          {userData[0].params.preferred_icp_hub[0]}
                        </p>
                        <p className="flex justify-end">{date}</p>
                      </div>
                      <p className="font-bold  ">
                        {userData[0].params.project_name}
                      </p>
                      <div className="border border-gray-400 w-full"></div>
                      <div className="flex flex-row justify-between mt-2">
                        <p className="font-bold">
                          {userData[0].params.user_data.full_name}
                        </p>
                        <div className="flex flex-row space-x-1">
  <a href={userData[0].params.project_linkedin[0]} target="_blank" rel="noopener noreferrer">
    {linkedInSvg}
  </a>
  <a href={userData[0].params.project_twitter[0]} target="_blank" rel="noopener noreferrer">
    {twitterSvg}
  </a>
</div>
                       
                      </div>
                      <p>{userData[0].params.user_data.email}</p>
                      <div className="border border-gray-400 w-full"></div>
                      <div className="flex flex-row justify-between mt-2">
                        <p className="font-bold">
                          {userData[0].params.user_data.country}
                        </p>
                        <div className="flex flex-row space-x-1">
  <a href={userData[0].params.github_link[0]} target="_blank" rel="noopener noreferrer">
    {githubSvg}
  </a>
  <a href={userData[0].params.project_discord[0]} target="_blank" rel="noopener noreferrer">
    {discordSvg}
  </a>
</div>
                      </div>
                      <div className="border border-gray-400 w-full mt-2"></div>
                    
                    </div>
                    <div className="flex flex-col bg-[#B9C0F2] relative w-full md:w-1/2 gap-4 rounded-md p-2 text-[#737373] h-[230px] mt-8 justify-between overflow-y-auto">
                      <div className="ml-4 mr-20 mt-4">
                        <div className="flex flex-row justify-between ">
                          <p>Team Size</p>
                          <p className="font-extrabold">0</p>
                        </div>
                        <div className="flex flex-row justify-between mt-2">
                          <p>No. of Co-Founders</p>
                          <p className="font-extrabold">0</p>
                        </div>
                        <div className="flex flex-row justify-between mt-2">
                          <p>Referral</p>
                          <p className="font-extrabold"></p>
                        </div>
                        <div className=" flex flex-row justify-between mt-2">
                          <p>Average Experience</p>
                          <p className="font-extrabold">0</p>
                        </div>
                        <div className="flex flex-row justify-between mt-2">
                          <p>Goal</p>
                          <p className="font-extrabold"></p>
                        </div>
                        <div className="flex flex-row justify-between mt-2">
                          <p>Reason of Particifation</p>
                          <p className="font-extrabold">
                            {userData[0].params.reason_to_join_incubator}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="border border-gray-400 w-full mt-2 relative "></div>
             

              

                {userData[0].params.dapp_link[0] && (
                  <div className="mt-4 ml-8 text-[#737373] text-xl space-y-4 overflow-hidden ">
                    <p className="font-extrabold">Github</p>
                    <div className="absolute xl:lg:top-[500px] md:top-[700px] right-[-95px] flex  bg-blue-100 w-[190.63px] h-[190px]  border rounded-full  "></div>
                    <p className="flex flex-wrap relative ">
                      {userData[0].params.dapp_link[0]}
                    </p>
                  </div>
                )}

                <div className="mt-4 ml-8 text-[#737373] text-xl space-y-4 overflow-hidden ">
                  <p className="font-extrabold">Long term Goal</p>
                  <div className="absolute xl:lg:top-[500px] md:top-[700px] right-[-95px] flex  bg-blue-100 w-[190.63px] h-[190px]  border rounded-full  "></div>
                  <p className="flex flex-wrap relative ">
                    {userData[0].params.long_term_goals}
                  </p>
                </div>

                <div className="mt-4 ml-8 text-[#737373] text-xl space-y-4 overflow-hidden ">
                  <p className="font-extrabold">Project Elevator Pitch</p>
                  <div className="absolute xl:lg:top-[500px] md:top-[700px] right-[-95px] flex  bg-blue-100 w-[190.63px] h-[190px]  border rounded-full  "></div>
                  <p className="flex flex-wrap relative ">
                    {userData[0].params.project_elevator_pitch[0]}
                  </p>
                </div>

              

                <div className="mt-4 ml-8 text-[#737373] text-xl space-y-4 overflow-hidden ">
                  <p className="font-extrabold">Project website</p>
                  <div className="absolute xl:lg:top-[500px] md:top-[700px] right-[-95px] flex  bg-blue-100 w-[190.63px] h-[190px]  border rounded-full  "></div>
                  <p className="flex flex-wrap relative ">
                    {userData[0].params.project_website[0]}
                  </p>
                </div>

                <div className="mt-4 ml-8 text-[#737373] text-xl space-y-4 overflow-hidden ">
                  <p className="font-extrabold">Promotional Video</p>
                  <div className="absolute xl:lg:top-[500px] md:top-[700px] right-[-95px] flex  bg-blue-100 w-[190.63px] h-[190px]  border rounded-full  "></div>
                  <p className="flex flex-wrap relative ">
                    {userData[0].params.promotional_video[0]}
                  </p>
                </div>

                <div className="mt-4 ml-8 text-[#737373] text-xl space-y-4 overflow-hidden ">
                  <p className="font-extrabold">Self Rating of Project</p>
                  <div className="absolute xl:lg:top-[500px] md:top-[700px] right-[-95px] flex  bg-blue-100 w-[190.63px] h-[190px]  border rounded-full  "></div>
                  <p className="flex flex-wrap relative ">
                    {userData[0].params.self_rating_of_project}
                  </p>
                </div>

                <div className="mt-4 ml-8 text-[#737373] text-xl space-y-4 overflow-hidden ">
                  <p className="font-extrabold">Support Multi-chain</p>
                  <div className="absolute xl:lg:top-[500px] md:top-[700px] right-[-95px] flex  bg-blue-100 w-[190.63px] h-[190px]  border rounded-full  "></div>
                  <p className="flex flex-wrap relative ">
                    {userData[0].params.supports_multichain[0]}
                  </p>
                </div>

                <div className="mt-4 ml-8 text-[#737373] text-xl space-y-4 overflow-hidden ">
                  <p className="font-extrabold">Target Market</p>
                  <div className="absolute xl:lg:top-[500px] md:top-[700px] right-[-95px] flex  bg-blue-100 w-[190.63px] h-[190px]  border rounded-full  "></div>
                  <p className="flex flex-wrap relative ">
                    {userData[0].params.target_market[0]}
                  </p>
                </div>
                <div className="mt-4 ml-8 text-[#737373] text-xl space-y-4 overflow-hidden ">
                  <p className="font-extrabold">Technical Docs</p>
                  <div className="absolute xl:lg:top-[500px] md:top-[700px] right-[-95px] flex  bg-blue-100 w-[190.63px] h-[190px]  border rounded-full  "></div>
                  <p className="flex flex-wrap relative ">
                    {userData[0].params.technical_docs[0]}
                  </p>
                </div>
                <div className="mt-4 ml-8 text-[#737373] text-xl space-y-4 overflow-hidden ">
                  <p className="font-extrabold">Token Economics</p>
                  <div className="absolute xl:lg:top-[500px] md:top-[700px] right-[-95px] flex  bg-blue-100 w-[190.63px] h-[190px]  border rounded-full  "></div>
                  <p className="flex flex-wrap relative ">
                    {userData[0].params.token_economics[0]}
                  </p>
                </div>

                {userData[0].params.vc_assigned && (
                  <div className="mt-4 ml-8 text-[#737373] text-xl space-y-4 overflow-hidden ">
                    <p className="font-extrabold">VC Assigned</p>
                    <div className="absolute xl:lg:top-[500px] md:top-[700px] right-[-95px] flex  bg-blue-100 w-[190.63px] h-[190px]  border rounded-full  "></div>
                    <p className="flex flex-wrap relative ">
                      {userData[0].params.vc_assigned}
                    </p>
                  </div>
                )}

                {userData[0].params.weekly_active_users && (
                  <div className="mt-4 ml-8 text-[#737373] text-xl space-y-4 overflow-hidden ">
                    <p className="font-extrabold">Weekly Active Users</p>
                    <div className="absolute xl:lg:top-[500px] md:top-[700px] right-[-95px] flex  bg-blue-100 w-[190.63px] h-[190px]  border rounded-full  "></div>
                    <p className="flex flex-wrap relative ">
                      {userData[0].params.weekly_active_users}
                    </p>
                  </div>
                )}

                <div className="mt-4 ml-8 text-[#737373] text-xl space-y-4 overflow-hidden ">
                  <p className="font-extrabold">Overview</p>
                  <div className="absolute xl:lg:top-[500px] md:top-[700px] right-[-95px] flex  bg-blue-100 w-[190.63px] h-[190px]  border rounded-full  "></div>
                  <p className="flex flex-wrap relative ">
                    {userData[0].params.project_description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>









      <div className="flex justify-center  mt-[48px]">
        <div className="relative w-full h-[542.8px] border-4 border-[#E9E9E9] ">
          <div className="absolute bottom-0 left-0 top-0 w-[389.31px] h-[390px] bg-blue-100 ellipse-quarter-left rounded-md rotate-90 z-0"></div>
          <div className="absolute top-0 right-0 bg-blue-100 w-[209.63px] h-[210px] ellipse-quarter-right rounded-md"></div>
          <div className="absolute top-[327px] right-0 bg-blue-100 w-[209.63px] h-[210px] ellipse-quarter-right rounded-md rotate-90"></div>
          <div className="flex flex-col w-full relative mt-4">
            <div className="w-fit  p-4 text-2xl font-bold md:ml-4 mt-4 absolute top-0 left-0 right-0 text-center text-black">
              Ratings
            </div>

            <div className=" overflow-y-auto  w-full">
              <div className="flex flex-col w-full ">
                <div className="flex flex-row    mt-8 items-center justify-between p-4 ">
                  <div className="w-full  p-4">
                    <div className=" relative rounded-lg overflow-hidden   gap-2 w-full  ">
                      <div className="flex flex-col ">
                        <div className="relative my-8 ml-24 flex flex-row  items-center  gap-2 sm:flex-wrap ">
                          <p>Team</p>
                          <style
                            dangerouslySetInnerHTML={{ __html: customStyles }}
                          />
                          <ReactSlider
                            className="bg-gradient-to-r from-blue-200 to-blue-600 h-3 rounded-md flex-grow" // Increased height to 3
                            marks
                            markClassName="slider-mark bg-purple-800 rounded-md h-1 w-1"
                            min={2}
                            max={10}
                            thumbClassName="absolute bg-white w-16 h-16 flex items-center justify-center rounded-full shadow-md -top-7" // Increased width and height
                            trackClassName="h-3 rounded" // Adjusted height to match the slider height
                            value={sliderValues[sliderKeys[currentStep]]}
                            onChange={(value) =>
                              handleSliderChange(currentStep, value)
                            }
                            renderThumb={(props, state) => (
                              <div {...props} className="w-12 h-12 -top-6">
                                {" "}
                                <div className="w-4 h-4 rounded-full bg-gradient-to-r border-white border-2 from-blue-200 to-blue-600 mt-5 "></div>{" "}
                              </div>
                            )}
                            renderMark={({ key, style }) => (
                              <div
                                key={key > 0 ? key : ""}
                                className="slider-mark bg-transparent rounded-md h-1 w-1"
                                style={{ ...style, top: "0px" }}
                              >
                                {key > 0 ? (
                                  <div className="flex flex-row text-white items-center space-x-1 relative -top-8 justify-between">
                                    <span></span>
                                    <div className="relative group">
                                      <span className="cursor-pointer"></span>
                                      <div className="absolute hidden group-hover:block bg-transparent text-white p-2 rounded-lg shadow-lg min-w-[250px] -left-14 -top-[6.95rem] z-20 h-32 drop-shadow-sm backdrop-blur-lg border-white border-2">
                                        <div className="relative z-10 p-2"></div>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  ""
                                )}
                              </div>
                            )}
                          />
                          <div className="text-gray-600 ml-4">
                            {(
                              ((sliderValues[sliderKeys[currentStep]]) /
                                100) *
                              100
                            ).toFixed(0)}{" "}
                            Level
                          </div>
                        </div>
                        <div className="relative my-8 ml-14 flex flex-row  items-center  gap-2">
                          <p>Value Prop </p>
                          <style
                            dangerouslySetInnerHTML={{ __html: customStyles }}
                          />
                          <ReactSlider
                            className="bg-gradient-to-r from-blue-200 to-blue-600 h-3 rounded-md flex-grow" // Increased height to 3
                            marks
                            markClassName="slider-mark bg-purple-800 rounded-md h-1 w-1"
                            min={2}
                            max={10}
                            thumbClassName="absolute bg-white w-16 h-16 flex items-center justify-center rounded-full shadow-md -top-7" // Increased width and height
                            trackClassName="h-3 rounded" // Adjusted height to match the slider height
                            value={sliderValues[sliderKeys[currentStep]]}
                            onChange={(value) =>
                              handleSliderChange(currentStep, value)
                            }
                            renderThumb={(props, state) => (
                              <div {...props} className="w-12 h-12 -top-6">
                                {" "}
                                <div className="w-4 h-4 rounded-full bg-gradient-to-r border-white border-2 from-blue-200 to-blue-600 mt-5 "></div>{" "}
                              </div>
                            )}
                            renderMark={({ key, style }) => (
                              <div
                                key={key > 0 ? key : ""}
                                className="slider-mark bg-transparent rounded-md h-1 w-1"
                                style={{ ...style, top: "0px" }}
                              >
                                {key > 0 ? (
                                  <div className="flex flex-row text-white items-center space-x-1 relative -top-8 justify-between">
                                    <span></span>
                                    <div className="relative group">
                                      <span className="cursor-pointer"></span>
                                      <div className="absolute hidden group-hover:block bg-transparent text-white p-2 rounded-lg shadow-lg min-w-[250px] -left-14 -top-[6.95rem] z-20 h-32 drop-shadow-sm backdrop-blur-lg border-white border-2">
                                        <div className="relative z-10 p-2"></div>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  ""
                                )}
                              </div>
                            )}
                          />
                          <div className="text-gray-600 ml-4">
                            {(
                              ((sliderValues[sliderKeys[currentStep]]) /
                              100) *
                              100
                            ).toFixed(0)}{" "}
                            Level
                          </div>
                        </div>
                        <div className="relative my-8 flex flex-row  items-center  gap-2">
                          <p>Problem and Vision</p>
                          <style
                            dangerouslySetInnerHTML={{ __html: customStyles }}
                          />
                          <ReactSlider
                            className="bg-gradient-to-r from-blue-200 to-blue-600 h-3 rounded-md flex-grow" // Increased height to 3
                            marks
                            markClassName="slider-mark bg-purple-800 rounded-md h-1 w-1"
                            min={2}
                            max={10}
                            thumbClassName="absolute bg-white w-16 h-16 flex items-center justify-center rounded-full shadow-md -top-7" // Increased width and height
                            trackClassName="h-3 rounded" // Adjusted height to match the slider height
                            value={sliderValues[sliderKeys[currentStep]]}
                            onChange={(value) =>
                              handleSliderChange(currentStep, value)
                            }
                            renderThumb={(props, state) => (
                              <div {...props} className="w-12 h-12 -top-6">
                                {" "}
                                <div className="w-4 h-4 rounded-full bg-gradient-to-r border-white border-2 from-blue-200 to-blue-600 mt-5 "></div>{" "}
                              </div>
                            )}
                            renderMark={({ key, style }) => (
                              <div
                                key={key > 0 ? key : ""}
                                className="slider-mark bg-transparent rounded-md h-1 w-1"
                                style={{ ...style, top: "0px" }}
                              >
                                {key > 0 ? (
                                  <div className="flex flex-row text-white items-center space-x-1 relative -top-8 justify-between">
                                    <span></span>
                                    <div className="relative group">
                                      <span className="cursor-pointer"></span>
                                      <div className="absolute hidden group-hover:block bg-transparent text-white p-2 rounded-lg shadow-lg min-w-[250px] -left-14 -top-[6.95rem] z-20 h-32 drop-shadow-sm backdrop-blur-lg border-white border-2">
                                        <div className="relative z-10 p-2"></div>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  ""
                                )}
                              </div>
                            )}
                          />
                          <div className="text-gray-600 ml-4">
                            {(
                              ((sliderValues[sliderKeys[currentStep]]) /
                              100) *
                              100
                            ).toFixed(0)}{" "}
                            Level
                          </div>
                        </div>
                      </div>
                    </div>
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

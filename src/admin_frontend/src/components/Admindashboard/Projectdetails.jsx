import React, { useState, useRef, useEffect } from "react";
import ment from "../../../../IcpAccelerator_frontend/assets/images/ment.jpg";
import ProjectCard from "../../../../IcpAccelerator_frontend/src/components/Project/ProjectCard";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { library, ColorStar } from "../Utils/AdminData/SvgData";
import ReactSlider from "react-slider";
import { place, tick, star, Profile2 } from "../Utils/AdminData/SvgData";
import { coloralert } from "../Utils/AdminData/SvgData";
import { useNavigate,useLocation } from "react-router-dom";
import vc from "../../../../IcpAccelerator_frontend/assets/images/vc.png"
import proj from "../../../../IcpAccelerator_frontend/assets/images/vc.png"
import mentor from "../../../../IcpAccelerator_frontend/assets/images/vc.png"
// import vc from "../../../../IcpAccelerator_frontend/assets/images/vc.png"

const Projectdetails = () => {
  const [details, setDetails] = useState();
  const [isHovered, setIsHovered] = useState(false);
  const [percent, setPercent] = useState(0);
  const [current, setCurrent] = useState("user");

  const tm = useRef(null);
  const percentage = 50;
  const [currentStep, setCurrentStep] = useState(0);

  const navigate =useNavigate()
  const location = useLocation();
  const projectData = location.state?.projectData;

     console.log("projectData in projectdetails =>>>>>>> ", projectData);

  const totalSteps = 80;
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
  const handleFileInputChange = (event) => {
    // Handle selected file here
    const selectedFile = event.target.files[0];
    console.log("Selected file:", selectedFile);
  };
  const handleFileSelect = () => {
    document.getElementById("fileInput").click();
  };
  const gradientStops = isHovered
    ? { stop1: "#4087BF", stop2: "#3C04BA" } // Hover gradient colors
    : { stop1: "#B5B5B5", stop2: "#5B5B5B" };
  // Increase function is used to update the percent state
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
    const requestedRole = projectData.role?.find(
      (role) => role.status === "requested"
    );
    if (requestedRole) {
      setCurrent(requestedRole.name.toLowerCase());
    } else {
      setCurrent("user");
    }
  }, [projectData.role]);

  const handleRoleClick = (roleName) => {
    if (roleName !== 'project') {
      navigate('/profile', { state: { 
        ...projectData,
        currentRole: roleName 
      }  });
    } else {
      setCurrent(roleName);
    }
  };
  

  const isRoleDisabled = (roleName) => {
    const mappedRoleName = roleName === "investor" ? "vc" : roleName;
    const role = projectData.role.find(
      (r) => r.name === mappedRoleName
    );
    return role && role.status === "default";
  };

  const getLinkStyle = (path, role) => {
    const roleLowerCase = role?.toLowerCase();
    const isActive = location.pathname === path || current === roleLowerCase;
    if (isActive) {
      return "pb-1 border-b-2 border-white font-bold text-blue-800 text-xs cursor-pointer";
    } else {
      return "text-white text-xs cursor-pointer";
    }
  };



  return (
    <div>


<div className="flex flex-row justify-between mb-3">
        <h1 className="md:text-3xl text-[20px] font-bold bg-black text-transparent bg-clip-text">
          Project Profile
        </h1>
       <div className="flex text-white flex-row font-bold h-auto md:w-[24rem] w-[9.5rem] mr-2 items-center bg-blue-300 rounded-lg py-2 px-3 justify-between">
          <div className="md:block hidden">{Profile2}</div>
          <p className="md:text-md text-xs font-bold md:block hidden">
            Change Profile
          </p>

          {["user", "mentor", "project", "investor"].map((role) => {
            const roleDisabled = isRoleDisabled(role);
            const additionalClasses = roleDisabled
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer";

            return (
              <div
                key={role}
                className={`${getLinkStyle(
                  "",
                  role
                )} md:block hidden ${additionalClasses}`}
                onClick={() => {
                  if (!roleDisabled) {
                    handleRoleClick(role);
                  }
                }}
              >
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </div>
            );
          })}
        </div>
</div>




























      <div className="mb-4 justify-center flex items-center">      
        <div className="p-2 shadow-lg  bg-[#FFFFFF4D] border-[#E9E9E9] border-1 drop-shadow-[#0000000D] rounded-[10px] w-full">
          <div className="flex items-center ">
            <div className="flex">
              <img
                src={ment}
                alt="project"
                className="w-14 h-14 aspect-square object-cover rounded-md"
              />
            </div>
            <div className="flex justify-between items-center w-full">
              <div className="px-2">
                <div className="flex items-center flex-wrap">
                  <div className="flex items-center flex-col ">
                    <p className="font-[950] text-2xl pr-2">builder.fi</p>
                  </div>
                </div>
                <div className="md:flex block text-xs md:text-sm text-[#737373]">
                  <div className="flex flex-row gap-4 ">
                    <p className="text-[#737373] bg-gray-200 rounded-full px-2">
                      Infrastructure
                    </p>
                    <p className="text-[#737373] bg-gray-200 rounded-full px-2">
                      Tooling
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
                          textColor: "#737373", // Set the color of the text
                          textSize: "24px", // Set the size of the text
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
            <span className="capitalize">india</span>
            <span className="w-1 h-1 rounded-full bg-gray-500"></span>
            <p>
              <div className="flex text-xs md:text-sm text-[#737373]">
                <p>Platform Joined on 10 October, 2023 </p>
              </div>
            </p>
          </div>
        </div>
      </div>
      <div>
        <div className="p-3 flex items-center bg-[#FFFFFF4D] border-[#E9E9E9] border-1 drop-shadow-[#0000000D] rounded-[10px]">
          {/* <div className="flex justify-between items-center w-full">
          <div className="px-2">
            <div className="flex items-center">
              <div className="flex items-center">
                <p className="font-[950] text-2xl pr-2">builder.fi</p>
                <svg
                  width="13"
                  height="12"
                  viewBox="0 0 13 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.4735 1.54094C9.02098 0.64994 7.75319 1.009 6.99159 1.58095C6.67932 1.81546 6.52318 1.93272 6.43132 1.93272C6.33945 1.93272 6.18331 1.81546 5.87104 1.58095C5.10944 1.009 3.84165 0.64994 2.38909 1.54094C0.482769 2.71028 0.0514138 6.56799 4.44856 9.82259C5.28608 10.4425 5.70484 10.7524 6.43132 10.7524C7.15779 10.7524 7.57655 10.4425 8.41407 9.82259C12.8112 6.56799 12.3799 2.71028 10.4735 1.54094Z"
                    stroke="#7283EA"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div className="w-full block text-xs xxs1:hidden text-right pr-4">
                <button className="font-[950] border text-[#3505B2] py-[7px] px-[9px] rounded-md border-[#C7C7C7] bg-[#FFFFFF] text-nowrap">
                  Visit
                </button>
              </div>
            </div>
            <div className="md:flex block text-xs md:text-sm text-[#737373]">
              <p className="flex font-[450] pr-4">
                Proposer: <span className="font-normal pl-2">fine_web3</span>
              </p>
              <p className="flex items-center">
                Categories:{" "}
                <span className="bg-[#B5B5B54D] mx-1 px-2 rounded-full">
                  Infrastructure
                </span>
                <span className="bg-[#B5B5B54D] mx-1 px-2 rounded-full">
                  Tooling
                </span>
              </p>
            </div>
            <div className="flex items-center text-xs md:text-sm text-[#737373]">
              <p className="flex items-center">Chains:</p>
              <p className="text-[10px] font-[450] pl-1">+6 more</p>
            </div>
          </div>

        </div> */}
        </div>
        <div className="flex justify-center  ">
          <div className="relative w-full md:w-[950px] border-2 border-black overflow-hidden">
            <div className="absolute bottom-0 left-7 top-[-28px] w-[400.31px] h-[450px] bg-blue-100 ellipse-quarter-left rounded-md rotate-90 z-0"></div>
            <div className="absolute top-0 right-0 bg-blue-100 w-[209.63px] h-[210px]  ellipse-quarter-right rounded-md "></div>
            {/* <div className="absolute lg:md:top-[356px] top-[700px] right-0 bg-blue-100 w-[209.63px] h-[210px]  ellipse-quarter-right rounded-md rotate-90"></div> */}

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
                        <p className="flex justify-end ">ICP Hub</p>
                        <p className="flex justify-end">Oct,2023</p>
                      </div>
                      <p className="font-bold  ">Builder.fi</p>
                      <div className="border border-gray-400 w-full"></div>
                      <div className="flex flex-row justify-between mt-2">
                        <p className="font-bold">Jammy Anderson</p>
                        {library}
                      </div>
                      <p>abc@123</p>
                      <div className="border border-gray-400 w-full"></div>
                      <div className="flex flex-row justify-between mt-2">
                        <p className="font-bold">Country</p>
                      </div>
                      <div className="border border-gray-400 w-full mt-2"></div>
                      <div className="flex flex-row justify-between">
                        <div className="flex flex-row font-bold gap-2">
                          <p className="">.Stage</p>
                          <p> .Energify</p>
                        </div>
                      </div>
                      <div className="border border-gray-400 w-full mt-2"></div>
                      <button className="bg-[#B9C0F2] text-white px-4 mt-2 rounded-md font-bold">
                        Inprogress
                      </button>
                    </div>
                    <div className="flex flex-col bg-[#B9C0F2] relative w-full md:w-1/2 gap-4 rounded-md p-2 text-[#737373] h-[230px] mt-8 justify-between overflow-y-auto">
                      <div className="ml-4 mr-20 mt-4">
                        <div className="flex flex-row justify-between ">
                          <p>Team Size</p>
                          <p className="font-extrabold">5</p>
                        </div>
                        <div className="flex flex-row justify-between mt-2">
                          <p>No. of Co-Founders</p>
                          <p className="font-extrabold">5</p>
                        </div>
                        <div className="flex flex-row justify-between mt-2">
                          <p>Referral</p>
                          <p className="font-extrabold">Events</p>
                        </div>
                        <div className=" flex flex-row justify-between mt-2">
                          <p>Average Experience</p>
                          <p className="font-extrabold">3 Year </p>
                        </div>
                        <div className="flex flex-row justify-between mt-2">
                          <p>Target Group</p>
                          <p className="font-extrabold">XYZ</p>
                        </div>
                        <div className="flex flex-row justify-between mt-2">
                          <p>Reason of Particifation</p>
                          <p className="font-extrabold">Funding</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="border border-gray-400 w-full mt-2 relative "></div>
                <div className="mt-4 ml-8 text-[#737373] text-xl space-y-4 overflow-hidden ">
                  <p className="font-extrabold">Overview</p>
                  <div className="absolute xl:lg:top-[500px] md:top-[700px] right-[-95px] flex  bg-blue-100 w-[190.63px] h-[190px]  border rounded-full  "></div>
                  <p className="flex flex-wrap relative ">
                    The Student Side Dashboard provides students with access to
                    the assigned tests and assessments created by their
                    respective teachers. Students can log in to their accounts,
                    view a list of available tests, and choose the tests they
                    want to attempt. The dashboard allows them to navigate
                    through the tests, answer questions, and submit their
                    responses within the specified time limit.
                  </p>
                  <p className="relative">
                    Upon completing a test, students can view their scores and
                    performance summary. The platform provides immediate
                    feedback, highlighting correct and incorrect answers,
                    helping students identify areas that require improvement.
                    They can also access their historical test results and track
                    their progress over time.
                  </p>

                  <p className="relative">
                    Additional Features: In addition to the core functionalities
                    mentioned above, the website may include other features to
                    enhance the learning experience. These may include:
                  </p>
                  <p>
                    1. Test Scheduling: The ability for teachers to schedule
                    tests for specific dates and times, ensuring timely access
                    for students.
                  </p>
                  <p className="relative">
                    2. Announcements and Notifications: Teachers can share
                    important announcements, updates, and reminders with
                    students through the platform.
                  </p>
                  <p className="relative">
                    3. Progress Tracking: A comprehensive progress tracking
                    system that allows teachers and students to monitor
                    performance over time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center  ">
        <div className="relative w-full h-[542.8px] border-4 border-[#E9E9E9] ">
          <div className="absolute bottom-0 left-0 top-0 w-[389.31px] h-[390px] bg-blue-100 ellipse-quarter-left rounded-md rotate-90 z-0"></div>
          <div className="absolute top-0 right-0 bg-blue-100 w-[209.63px] h-[210px] ellipse-quarter-right rounded-md"></div>
          <div className="absolute top-[327px] right-0 bg-blue-100 w-[209.63px] h-[210px] ellipse-quarter-right rounded-md rotate-90"></div>
          <div className="flex flex-col w-full relative ">
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
                                {/* Adjusted size and top position */}
                                <div className="w-4 h-4 rounded-full bg-gradient-to-r border-white border-2 from-blue-200 to-blue-600 mt-5 "></div>{" "}
                                {/* Adjusted size */}
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
                          {/* Render the percentage sign dynamically */}
                          <div className="text-gray-600 ml-4">
                            {(
                              ((sliderValues[sliderKeys[currentStep]] - 2) /
                                8) *
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
                                {/* Adjusted size and top position */}
                                <div className="w-4 h-4 rounded-full bg-gradient-to-r border-white border-2 from-blue-200 to-blue-600 mt-5 "></div>{" "}
                                {/* Adjusted size */}
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
                          {/* Render the percentage sign dynamically */}
                          <div className="text-gray-600 ml-4">
                            {(
                              ((sliderValues[sliderKeys[currentStep]] - 2) /
                                8) *
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
                                {/* Adjusted size and top position */}
                                <div className="w-4 h-4 rounded-full bg-gradient-to-r border-white border-2 from-blue-200 to-blue-600 mt-5 "></div>{" "}
                                {/* Adjusted size */}
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
                          {/* Render the percentage sign dynamically */}
                          <div className="text-gray-600 ml-4">
                            {(
                              ((sliderValues[sliderKeys[currentStep]] - 2) /
                                8) *
                              100
                            ).toFixed(0)}{" "}
                            Level
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <div className="flex flex-row  gap-2 items-center justify-between w-full p-4 ">
                  <p className='text-[#737373] font-bold md:ml-4 '>Value </p>
                  <div className="flex items-center lg:w-[600px] md:w-[500px] w-[210px]">
                    <svg
                      width="100%"
                      height="7"
                      className="rounded-lg"
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                    >
                      <defs>
                        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop
                            offset="0%"
                            style={{ stopColor: isHovered ? gradientStops.stop1 : '#7283EA', stopOpacity: 1 }}
                          />
                          <stop
                            offset="100%"
                            style={{ stopColor: isHovered ? gradientStops.stop2 : '#7283EA', stopOpacity: 1 }}
                          />
                        </linearGradient>
                      </defs>
                      <rect
                        x="0"
                        y="0"
                        width={`${percent}%`}
                        height="10"
                        fill="url(#gradient1)"
                      />
                    </svg>
                    <div className="text-gray-600 text-sm ml-2 font-fontUse text-nowrap">
                      7
                    </div>
                  </div>
                </div>
                <div className="flex flex-row    lg:gap-14 md:gap-8 gap-2 items-center p-4 ">
                  <p className='text-[#737373] font-bold md:ml-4'>product</p>
                  <div className="flex items-center lg:w-[600px] md:w-[500px] w-[210px]">
                    
                    <div className="text-gray-600 text-sm ml-2 font-fontUse text-nowrap">
                      7
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projectdetails;

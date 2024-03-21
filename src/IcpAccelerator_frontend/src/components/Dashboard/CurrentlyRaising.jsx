import React, { useState, useEffect, useRef } from "react";
import ment from "../../../assets/images/ment.jpg";
import girl from "../../../assets/images/girl.jpeg";
import { IcpAccelerator_backend } from "../../../../declarations/IcpAccelerator_backend/index";
import uint8ArrayToBase64 from "../Utils/uint8ArrayToBase64";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
const CurrentlyRaising = () => {
  const actor = useSelector((currState) => currState.actors.actor);
  const isAuthenticated = useSelector((curr) => curr.internet.isAuthenticated);
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [percent, setPercent] = useState(0);
  const [showLine, setShowLine] = useState({});
  const tm = useRef(null);

  // Gradient color stops, changes when hovered
  const gradientStops = isHovered
    ? { stop1: "#4087BF", stop2: "#3C04BA" }
    : { stop1: "#B5B5B5", stop2: "#5B5B5B" };

  useEffect(() => {
      if (percent < 100) {
          tm.current = setTimeout(increase, 30);
      }
      return () => clearTimeout(tm.current);
  }, [percent]);

  const handleClickPlusOne = (id) => {
    setShowLine((prevShowLine) => ({
      ...prevShowLine,
      [id]: !prevShowLine[id],
    }));
  };

  const increase = () => {
      setPercent((prevPercent) => {
          if (prevPercent >= 100) {
              clearTimeout(tm.current);
              return 100;
          }
          return prevPercent + 1;
      });
  };

  const defaultArray = [
    {
      projectName: "Innovative Solutions",
      projectId: null,
      projectImage: ment,
      userImage: girl,
      principalId: "user001",
      projectDescription: "This project aims to provide innovative solutions to real-world problems.",
      projectAreaOfFocus: "Technology"
    },
    {
      projectName: "Artistic Expressions",
      projectId: null,
      projectImage: ment,
      userImage: girl,
      principalId: "user002",
      projectDescription: "An exploration of artistic expressions pushing the boundaries of creativity.",
      projectAreaOfFocus: "Art and Design"
    },
    {
      projectName: "Community Empowerment",
      projectId: null,
      projectImage: ment,
      userImage: girl,
      principalId: "user003",
      projectDescription: "Empowering communities through grassroots initiatives for lasting impact.",
      projectAreaOfFocus: "Social Impact"
    },
    {
      projectName: "Event Management",
      projectId: null,
      projectImage: ment,
      userImage: girl,
      principalId: "user003",
      projectDescription: "Welcome to the best event management system on ICP. Fully Decentralized On ICP ",
      projectAreaOfFocus: "Social Impact"
    }
  ];

  const [noData, setNoData] = useState(null);
  const [allProjectData, setAllProjectData] = useState([]);

  const getAllProject = async (caller) => {
    await caller
      .list_all_projects()
      .then((result) => {
        console.log("result-in-get-all-projects", result);
        if (!result || result.length == 0) {
          setNoData(true)
          setAllProjectData(defaultArray)
        } else {
          setAllProjectData(result);
          setNoData(false)
        }
      })
      .catch((error) => {
        setNoData(true)
        setAllProjectData(defaultArray)
        console.log("error-in-get-all-projects", error);
      });
  };

  useEffect(() => {
    if (actor) {
      getAllProject(actor);
    } else {
      getAllProject(IcpAccelerator_backend);
    }
  }, [actor]);

  const handleNavigate = (projectId) => {
    if (isAuthenticated) {
      navigate(`/individual-project-details/${projectId}`);
    }
  };
  return (
    <div className="flex flex-wrap -mx-4 mb-4 flex-row items-start">
    <div className="overflow-x-auto flex flex-row w-full">
      {allProjectData &&
        allProjectData.map((data, index) => {
          let projectName = ""
          let projectId = ""
          let projectImage = ""
          let userImage = ""
          let principalId = ""
          let projectDescription = ""
          let projectAreaOfFocus = ""
          let moneyRaisedTillNow = ""
           
          if (noData === false) {
            moneyRaisedTillNow = data[1]?.project_profile[0]?.params?.money_raised_till_now[0];
            projectName = data[1]?.project_profile[0]?.params?.project_name;
            projectId = data[1]?.project_profile[0]?.uid;
            projectImage = uint8ArrayToBase64(data[1]?.project_profile[0]?.params?.project_logo);
            userImage = uint8ArrayToBase64(data[1]?.project_profile[0]?.params?.user_data?.profile_picture[0]);
            principalId = data[0].toText()
            projectDescription = data[1]?.project_profile[0]?.params?.project_description
            projectAreaOfFocus = data[1]?.project_profile[0]?.params?.project_area_of_focus
          } else {
            projectName = data.projectName
            projectId = data.projectId
            projectImage = data.projectImage
            userImage = data.userImage
            principalId = data.principalId
            projectDescription = data.projectDescription
            projectAreaOfFocus = data.projectAreaOfFocus
            moneyRaisedTillNow = true
          }
          if(!moneyRaisedTillNow){
            return null;
          }
          return (
            <div className="w-full sm:w-1/2 md:w-1/4 mb-2 px-3 hover:scale-105 transition-transform duration-300 ease-in-out" key={index}>
              <div className="flex justify-between items-baseline mb-4 flex-wrap bg-white m-2 overflow-hidden rounded-lg shadow-lg min-w-1/2">
                <div className="p-4">
                  <div className="flex justify-between items-baseline mb-2 flex-col flex-wrap w-[265px]">
                    <div className="flex items-baseline w-1/2">
                      <img
                        className="rounded-full w-12 h-12 object-cover"
                        src={projectImage}
                      />
                      <h1 className="font-bold text-nowrap truncate w-[220px]">
                        {projectName}
                      </h1>
                    </div>
                    <div className="flex items-baseline w-1/2">
                      <img
                        className="h-5 w-5 rounded-full mx-2 mt-2"
                        src={userImage}
                        alt="not found"
                      />
                      <p className="text-xs truncate w-20">{principalId}</p>
                    </div>
                  </div>
                  <div className="mb-4 flex items-baseline">
                    <svg
                      width="100%"
                      height="8"
                      className="rounded-lg"
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                    >
                      <defs>
                        <linearGradient
                          id={`gradient-${index}`}
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="0%"
                        >
                          <stop
                            offset="0%"
                            stopColor={gradientStops.stop1}
                            stopOpacity="1"
                          />
                          <stop
                            offset="100%"
                            stopColor={gradientStops.stop2}
                            stopOpacity="1"
                          />
                        </linearGradient>
                      </defs>
                      <rect
                        x="0"
                        y="0"
                        width={`${percent}%`}
                        height="10"
                        fill={`url(#gradient-${index})`}
                      />
                    </svg>
                    <div className="ml-2 text-nowrap text-sm">Level 2</div>
                  </div>
                  <p className="text-gray-700 text-sm md:line-clamp-8 sxs:line-clamp-4 sm:line-clamp-6 line-clamp-8 h-36">
                    {projectDescription}
                  </p>
                  {projectAreaOfFocus ?
                    <div className="flex gap-2 mt-2 text-xs">
                      <p>{projectAreaOfFocus}</p>

                      <p
                        onClick={() =>
                          projectId ?
                          handleNavigate(projectId)
                          : ''
                        }
                        className="cursor-pointer"
                      >
                        +1 more
                      </p>
                    </div> : ''}

                  <button
                    className="mt-4 bg-transparent text-black px-4 py-1 rounded uppercase w-full text-center border border-gray-300 font-bold hover:bg-[#3505B2] hover:text-white transition-colors duration-200 ease-in-out"
                    onClick={() =>
                      projectId ?
                      handleNavigate(projectId)
                      : ''
                    }
                  >
                    KNOW MORE
                  </button>
                </div>
              </div>
            </div>
          );
        })}
         {/* {allProjectData &&
        allProjectData.map((data, index) => {
          let projectName = ""
          let projectId = ""
          let projectImage = ""
          let userImage = ""
          let principalId = ""
          let projectDescription = ""
          let projectAreaOfFocus = ""
          let moneyRaisedTillNow = ""
           
          if (noData === false) {
            moneyRaisedTillNow = data[1]?.project_profile[0]?.params?.money_raised_till_now[0];
            projectName = data[1]?.project_profile[0]?.params?.project_name;
            projectId = data[1]?.project_profile[0]?.uid;
            projectImage = uint8ArrayToBase64(data[1]?.project_profile[0]?.params?.project_logo);
            userImage = uint8ArrayToBase64(data[1]?.project_profile[0]?.params?.user_data?.profile_picture[0]);
            principalId = data[0].toText()
            projectDescription = data[1]?.project_profile[0]?.params?.project_description
            projectAreaOfFocus = data[1]?.project_profile[0]?.params?.project_area_of_focus
          } else {
            projectName = data.projectName
            projectId = data.projectId
            projectImage = data.projectImage
            userImage = data.userImage
            principalId = data.principalId
            projectDescription = data.projectDescription
            projectAreaOfFocus = data.projectAreaOfFocus
            moneyRaisedTillNow = true
          }
          if(!moneyRaisedTillNow){
            return null;
          }
          return (
            <div className="w-full sm:w-1/2 md:w-1/4 mb-2 px-3" key={index}>
              <div className="flex justify-between items-baseline mb-4 flex-wrap bg-white m-2 overflow-hidden rounded-lg shadow-lg min-w-1/2">
                <div className="p-4">
                  <div className="flex justify-between items-baseline mb-4 flex-wrap">
                    <div className="flex items-baseline w-1/2">
                      <img
                        className="rounded-full w-12 h-12 object-cover"
                        src={projectImage}
                        alt="profile"
                      />
                      <h1 className="font-bold text-nowrap truncate w-1/2">
                        {projectName}
                      </h1>
                    </div>
                    <div className="flex items-baseline w-1/2">
                      <img
                        className="h-5 w-5 rounded-full mr-2"
                        src={userImage}
                        alt="not found"
                      />
                      <p className="text-xs truncate w-20">{principalId}</p>
                    </div>
                  </div>
                  <div className="mb-4 flex items-baseline">
                    <svg
                      width="100%"
                      height="8"
                      className="rounded-lg"
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                    >
                      <defs>
                        <linearGradient
                          id={`gradient-${projectId}`}
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="0%"
                        >
                          <stop
                            offset="0%"
                            stopColor={gradientStops.stop1}
                            stopOpacity="1"
                          />
                          <stop
                            offset="100%"
                            stopColor={gradientStops.stop2}
                            stopOpacity="1"
                          />
                        </linearGradient>
                      </defs>
                      <rect
                        x="0"
                        y="0"
                        width={`${percent}%`}
                        height="10"
                        fill={`url(#gradient-${projectId})`}
                      />
                    </svg>
                    <div className="ml-2 text-nowrap text-sm">Level 2</div>
                  </div>
                  <p className="text-gray-700 text-sm md:line-clamp-8 sxs:line-clamp-4 sm:line-clamp-6 line-clamp-8 h-36">
                    {projectDescription}
                  </p>
                  {projectAreaOfFocus ?
                    <div className="flex gap-2 mt-2 text-xs">
                      <p>{projectAreaOfFocus}</p>

                      <p
                        onClick={() =>
                          handleNavigate(projectId)
                        }
                        className="cursor-pointer"
                      >
                        +1 more
                      </p>
                    </div> : ''}

                  <button
                    className="mt-4 bg-transparent text-black px-4 py-1 rounded uppercase w-full text-center border border-gray-300 font-bold hover:bg-[#3505B2] hover:text-white transition-colors duration-200 ease-in-out"
                    onClick={() =>
                      handleNavigate(projectId)
                    }
                  >
                    KNOW MORE
                  </button>
                </div>
              </div>
            </div>
          );
        })}
         {allProjectData &&
        allProjectData.map((data, index) => {
          let projectName = ""
          let projectId = ""
          let projectImage = ""
          let userImage = ""
          let principalId = ""
          let projectDescription = ""
          let projectAreaOfFocus = ""
          let moneyRaisedTillNow = ""
           
          if (noData === false) {
            moneyRaisedTillNow = data[1]?.project_profile[0]?.params?.money_raised_till_now[0];
            projectName = data[1]?.project_profile[0]?.params?.project_name;
            projectId = data[1]?.project_profile[0]?.uid;
            projectImage = uint8ArrayToBase64(data[1]?.project_profile[0]?.params?.project_logo);
            userImage = uint8ArrayToBase64(data[1]?.project_profile[0]?.params?.user_data?.profile_picture[0]);
            principalId = data[0].toText()
            projectDescription = data[1]?.project_profile[0]?.params?.project_description
            projectAreaOfFocus = data[1]?.project_profile[0]?.params?.project_area_of_focus
          } else {
            projectName = data.projectName
            projectId = data.projectId
            projectImage = data.projectImage
            userImage = data.userImage
            principalId = data.principalId
            projectDescription = data.projectDescription
            projectAreaOfFocus = data.projectAreaOfFocus
            moneyRaisedTillNow = true
          }
          if(!moneyRaisedTillNow){
            return null;
          }
          return (
            <div className="w-full sm:w-1/2 md:w-1/4 mb-2 px-3" key={index}>
              <div className="flex justify-between items-baseline mb-4 flex-wrap bg-white m-2 overflow-hidden rounded-lg shadow-lg min-w-1/2">
                <div className="p-4">
                  <div className="flex justify-between items-baseline mb-4 flex-wrap">
                    <div className="flex items-baseline w-1/2">
                      <img
                        className="rounded-full w-12 h-12 object-cover"
                        src={projectImage}
                        alt="profile"
                      />
                      <h1 className="font-bold text-nowrap truncate w-1/2">
                        {projectName}
                      </h1>
                    </div>
                    <div className="flex items-baseline w-1/2">
                      <img
                        className="h-5 w-5 rounded-full mr-2"
                        src={userImage}
                        alt="not found"
                      />
                      <p className="text-xs truncate w-20">{principalId}</p>
                    </div>
                  </div>
                  <div className="mb-4 flex items-baseline">
                    <svg
                      width="100%"
                      height="8"
                      className="rounded-lg"
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                    >
                      <defs>
                        <linearGradient
                          id={`gradient-${projectId}`}
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="0%"
                        >
                          <stop
                            offset="0%"
                            stopColor={gradientStops.stop1}
                            stopOpacity="1"
                          />
                          <stop
                            offset="100%"
                            stopColor={gradientStops.stop2}
                            stopOpacity="1"
                          />
                        </linearGradient>
                      </defs>
                      <rect
                        x="0"
                        y="0"
                        width={`${percent}%`}
                        height="10"
                        fill={`url(#gradient-${projectId})`}
                      />
                    </svg>
                    <div className="ml-2 text-nowrap text-sm">Level 2</div>
                  </div>
                  <p className="text-gray-700 text-sm md:line-clamp-8 sxs:line-clamp-4 sm:line-clamp-6 line-clamp-8 h-36">
                    {projectDescription}
                  </p>
                  {projectAreaOfFocus ?
                    <div className="flex gap-2 mt-2 text-xs">
                      <p>{projectAreaOfFocus}</p>

                      <p
                        onClick={() =>
                          handleNavigate(projectId)
                        }
                        className="cursor-pointer"
                      >
                        +1 more
                      </p>
                    </div> : ''}

                  <button
                    className="mt-4 bg-transparent text-black px-4 py-1 rounded uppercase w-full text-center border border-gray-300 font-bold hover:bg-[#3505B2] hover:text-white transition-colors duration-200 ease-in-out"
                    onClick={() =>
                      handleNavigate(projectId)
                    }
                  >
                    KNOW MORE
                  </button>
                </div>
              </div>
            </div>
          );
        })} */}
         {/* {allProjectData &&
        allProjectData.map((data, index) => {
          let projectName = ""
          let projectId = ""
          let projectImage = ""
          let userImage = ""
          let principalId = ""
          let projectDescription = ""
          let projectAreaOfFocus = ""
          let moneyRaisedTillNow =
            data[1]?.project_profile[0]?.params?.money_raised_till_now[0];
          if (noData === false && moneyRaisedTillNow === true) {
            projectName = data[1]?.project_profile[0]?.params?.project_name;
            projectId = data[1]?.project_profile[0]?.uid;
            projectImage = uint8ArrayToBase64(data[1]?.project_profile[0]?.params?.project_logo);
            userImage = uint8ArrayToBase64(data[1]?.project_profile[0]?.params?.user_data?.profile_picture[0]);
            principalId = data[0].toText()
            projectDescription = data[1]?.project_profile[0]?.params?.project_description
            projectAreaOfFocus = data[1]?.project_profile[0]?.params?.project_area_of_focus
          } else {
            projectName = data.projectName
            projectId = data.projectId
            projectImage = data.projectImage
            userImage = data.userImage
            principalId = data.principalId
            projectDescription = data.projectDescription
            projectAreaOfFocus = data.projectAreaOfFocus
          }
          return (
            <div className="w-full sm:w-1/2 md:w-1/3 mb-2" key={index}>
              <div className="flex justify-between items-baseline mb-4 flex-wrap bg-white m-2 overflow-hidden rounded-lg shadow-lg">
                <div className="p-4">
                  <div className="flex justify-between items-baseline mb-4 flex-wrap">
                    <div className="flex items-baseline">
                      <img
                        className="rounded-full w-12 h-12 object-cover"
                        src={projectImage}
                        alt="profile"
                      />
                      <h1 className="font-bold text-nowrap truncate w-1/2">
                        {projectName}
                      </h1>
                    </div>
                    <div className="flex items-baseline">
                      <img
                        className="h-5 w-5 rounded-full mr-2"
                        src={userImage}
                        alt="not found"
                      />
                      <p className="text-xs truncate w-20">{principalId}</p>
                    </div>
                  </div>
                  <div className="mb-4 flex items-baseline">
                    <svg
                      width="100%"
                      height="8"
                      className="rounded-lg"
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                    >
                      <defs>
                        <linearGradient
                          id={`gradient-${projectId}`}
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="0%"
                        >
                          <stop
                            offset="0%"
                            stopColor={gradientStops.stop1}
                            stopOpacity="1"
                          />
                          <stop
                            offset="100%"
                            stopColor={gradientStops.stop2}
                            stopOpacity="1"
                          />
                        </linearGradient>
                      </defs>
                      <rect
                        x="0"
                        y="0"
                        width={`${percent}%`}
                        height="10"
                        fill={`url(#gradient-${projectId})`}
                      />
                    </svg>
                    <div className="ml-2 text-nowrap text-sm">Level 2</div>
                  </div>
                  <p className="text-gray-700 text-sm md:line-clamp-8 sxs:line-clamp-4 sm:line-clamp-6 line-clamp-8 h-36">
                    {projectDescription}
                  </p>
                  {projectAreaOfFocus ?
                    <div className="flex gap-2 mt-2 text-xs">
                      <p>{projectAreaOfFocus}</p>

                      <p
                        onClick={() =>
                          handleNavigate(projectId)
                        }
                        className="cursor-pointer"
                      >
                        +1 more
                      </p>
                    </div> : ''}

                  <button
                    className="mt-4 bg-transparent text-black px-4 py-1 rounded uppercase w-full text-center border border-gray-300 font-bold hover:bg-[#3505B2] hover:text-white transition-colors duration-200 ease-in-out"
                    onClick={() =>
                      handleNavigate(projectId)
                    }
                  >
                    KNOW MORE
                  </button>
                </div>
              </div>
            </div>
          );
        })} */}
    </div>
    </div>
  );
};

export default CurrentlyRaising;

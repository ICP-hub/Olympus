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

  // useEffect(() => {
  //     if (percent < 100) {
  //         tm.current = setTimeout(increase, 30);
  //     }
  //     return () => clearTimeout(tm.current);
  // }, [percent]);

  const handleClickPlusOne = (id) => {
    setShowLine((prevShowLine) => ({
      ...prevShowLine,
      [id]: !prevShowLine[id],
    }));
  };

  // const increase = () => {
  //     setPercent((prevPercent) => {
  //         if (prevPercent >= 100) {
  //             clearTimeout(tm.current);
  //             return 100;
  //         }
  //         return prevPercent + 1;
  //     });
  // };

  const [allProjectData, setAllProjectData] = useState([]);

  const getAllProject = async (caller) => {
    await caller
      .list_all_projects()
      .then((result) => {
        console.log("result-in-get-all-projects", result);
        setAllProjectData(result);
      })
      .catch((error) => {
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
    <div className="flex flex-wrap -mx-4 mb-4">
      {allProjectData &&
        allProjectData.map((data, index) => {
          console.log("data", data[1]?.project_profile[0]?.params);
          let projectName = data[1]?.project_profile[0]?.params?.project_name;
          let projectId = data[1]?.project_profile[0]?.uid;
          let projectImage = uint8ArrayToBase64(
            data[1]?.project_profile[0]?.params?.project_logo
          );
          let userImage = uint8ArrayToBase64(
            data[1]?.project_profile[0]?.params?.user_data?.profile_picture[0]
          );
          let principalId = data[0].toText();
          let projectDescription =
            data[1]?.project_profile[0]?.params?.project_description;
          let projectAreaOfFocus =
            data[1]?.project_profile[0]?.params?.project_area_of_focus;
          let moneyRaisedTillNow =
            data[1]?.project_profile[0]?.params?.money_raised_till_now[0];
          return (
            <>
              {moneyRaisedTillNow === true ? (
                <div
                  key={index}
                  className="px-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
                >
                  <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-300 m-2">
                    <div className="p-4">
                      <div className="flex justify-between items-baseline mb-4 flex-wrap">
                        <div className="flex items-baseline">
                          <img
                            className="rounded-full w-12 h-12"
                            src={projectImage}
                            alt="profile"
                          />
                          <h1 className="font-bold text-nowrap truncate">
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
                      {projectAreaOfFocus ? (
                        <div className="flex gap-2 mt-2 text-xs">
                          <p>{projectAreaOfFocus}</p>

                          <p
                            onClick={() => handleNavigate(projectId)}
                            className="cursor-pointer"
                          >
                            +1 more
                          </p>
                        </div>
                      ) : (
                        ""
                      )}
                      <button
                        className="mt-4 bg-transparent text-black px-4 py-1 rounded uppercase w-full text-center border border-gray-300 font-bold hover:bg-[#3505B2] hover:text-white transition-colors duration-200 ease-in-out"
                        onClick={() => handleNavigate(projectId)}
                      >
                        KNOW MORE
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
            </>
          );
        })}
    </div>
  );
};

export default CurrentlyRaising;

import React, { useState, useEffect, useRef } from "react";
import ment from "../../../assets/images/ment.jpg";
import girl from "../../../assets/images/girl.jpeg";
import { IcpAccelerator_backend } from "../../../../declarations/IcpAccelerator_backend/index";
import uint8ArrayToBase64 from "../Utils/uint8ArrayToBase64";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import NoDataCard from "../Mentors/Event/RaisingNoDataCard";

const CurrentlyRaising = ({ progress }) => {
  const actor = useSelector((currState) => currState.actors.actor);
  const isAuthenticated = useSelector((curr) => curr.internet.isAuthenticated);
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [percent, setPercent] = useState(0);
  const [showLine, setShowLine] = useState({});
  const tm = useRef(null);
  const userCurrentRoleStatusActiveRole = useSelector(
    (currState) => currState.currentRoleStatus.activeRole
  );
  // Gradient color stops, changes when hovered
  // const gradientStops = isHovered
  //   ? { stop1: "#4087BF", stop2: "#3C04BA" }
  //   : { stop1: "#B5B5B5", stop2: "#5B5B5B" };

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


  const [noData, setNoData] = useState(null);
  const [allProjectData, setAllProjectData] = useState([]);

  const getAllProject = async (caller) => {
    await caller
      .list_all_projects()
      .then((result) => {
        console.log("result-in-get-all-projects", result);
        if (!result || result.length == 0) {
          setNoData(true);
          setAllProjectData([]);
        } else {
          setAllProjectData(result);
          setNoData(false);
        }
      })
      .catch((error) => {
        setNoData(true);
        setAllProjectData([]);
        console.log("error-in-get-all-projects", error);
      });
  };

  useEffect(() => {
    if (actor) {
      getAllProject(actor);
    } else {
      getAllProject(IcpAccelerator_backend);
    }
  }, [actor, userCurrentRoleStatusActiveRole]);

  const handleNavigate = (projectId, projectData) => {
    if (isAuthenticated) {
      switch (userCurrentRoleStatusActiveRole) {
        case 'user':
          toast.error("No Access to user role!!!");
          window.scrollTo({ top: 0, behavior: "smooth" });
          break;
        case 'project':
          toast.error("No Access to project role, without peer project in cohort!!!");
          window.scrollTo({ top: 0, behavior: "smooth" });
          break;
        case 'mentor':
          navigate(`/individual-project-details-project-mentor/${projectId}`);
          break;
        case 'vc':
          navigate(`/individual-project-details-project-investor/${projectId}`);
          break;
        default:
          toast.error("No Role Found, Please Sign Up !!!");
          window.scrollTo({ top: 0, behavior: "smooth" });
          break;
      }
    } else {
      toast.error("Please Sign Up !!!");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  return (
    <div className="flex flex-wrap -mx-4 mb-4 items-start">
      {noData || (allProjectData &&
        allProjectData.filter((val) =>
          val?.params?.params?.live_on_icp_mainnet[0] && val?.params?.params?.live_on_icp_mainnet[0] === true && val?.params?.params?.money_raised_till_now[0] && val?.params?.params?.money_raised_till_now[0] == true).length == 0) ? (
        <NoDataCard />
      ) : (

        <div className=" md:flex md:flex-row w-full">
          {allProjectData &&
            allProjectData.filter((val) =>
              val?.params?.params?.live_on_icp_mainnet[0] && val?.params?.params?.live_on_icp_mainnet[0] === true && val?.params?.params?.money_raised_till_now[0] && val?.params?.params?.money_raised_till_now[0] == true).slice(0, 4).map((data, index) => {

                let projectName = data?.params?.params?.project_name ?? "";
                let projectId = data?.params?.uid ?? "";
                let projectImage = data?.params?.params?.project_logo ? uint8ArrayToBase64(data?.params?.params?.project_logo) : "";
                let userImage = data?.params?.params?.user_data?.profile_picture[0] ? uint8ArrayToBase64(data?.params?.params?.user_data?.profile_picture[0]) : "";
                let principalId = data?.principal ? data?.principal.toText() : "";
                let projectDescription = data?.params?.params?.project_description ?? "";
                let projectAreaOfFocus = data?.params?.params?.project_area_of_focus ?? "";
                let projectData = data?.params ? data?.params : null;
                let projectRubricStatus = data?.overall_average.length > 0 ? data?.overall_average[data?.overall_average.length - 1] : 0;

                return (
                  <div
                    className="w-full sm:w-1/2 md:w-1/4 mb-2 hover:scale-105 transition-transform duration-300 ease-in-out"
                    key={index}
                  >
                    <div className="w-fit flex justify-between items-baseline mb-4 flex-wrap bg-white m-2 overflow-hidden rounded-lg shadow-lg min-w-1/2">
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
                        {progress && (<div className="mb-4 flex items-baseline">
                          <svg
                            width="100%"
                            height="8"
                            className="bg-[#B2B1B6] rounded-lg"
                          // onMouseEnter={() => setIsHovered(true)}
                          // onMouseLeave={() => setIsHovered(false)}
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
                                  stopColor={"#4087BF"}
                                  stopOpacity="1"
                                />
                                <stop
                                  offset={`${(projectRubricStatus * 100) / 8}%`}
                                  stopColor={"#3C04BA"}
                                  stopOpacity="1"
                                />
                              </linearGradient>
                            </defs>
                            <rect
                              x="0"
                              y="0"
                              width={`${(projectRubricStatus * 100) / 8}%`}
                              height="10"
                              fill={`url(#gradient-${index})`}
                            />
                          </svg>
                          <div className="ml-2 text-nowrap text-sm">{`${projectRubricStatus}/8`}</div>
                        </div>)}
                        <p className="text-gray-700 text-sm p-2 h-36 overflow-hidden line-clamp-8 mb-4">
                          {projectDescription}
                        </p>
                        {projectAreaOfFocus ? (
                          <div className="flex gap-2 mt-2 text-xs items-center">
                            {projectAreaOfFocus
                              .split(",")
                              .slice(0, 3)
                              .map((tag, index) => (
                                <div
                                  key={index}
                                  className="text-xs border-2 rounded-2xl px-2 py-1 font-bold bg-gray-100"
                                >
                                  {tag.trim()}
                                </div>
                              ))}
                            {projectAreaOfFocus.split(",").length > 3 && (
                              <p
                                onClick={() =>
                                  projectId ? handleNavigate(projectId, projectData) : ""
                                }
                                className="cursor-pointer">
                                +1 more
                              </p>
                            )}
                          </div>
                        ) : (
                          ""
                        )}

                        <button
                          className="mt-4 bg-transparent text-black px-4 py-1 rounded uppercase w-full text-center border border-gray-300 font-bold hover:bg-[#3505B2] hover:text-white transition-colors duration-200 ease-in-out"
                          onClick={() =>
                            projectId ? handleNavigate(projectId, projectData) : ""}>
                          view project
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>
      )}
    </div>
  );
};

export default CurrentlyRaising;

import React, { useState, useEffect, useRef } from "react";
import ment from "../../../../assets/images/ment.jpg";
import girl from "../../../../assets/images/girl.jpeg";
import hover from "../../../../assets/images/hover.png";
import { IcpAccelerator_backend } from "../../../../../declarations/IcpAccelerator_backend/index";
import uint8ArrayToBase64 from "../../Utils/uint8ArrayToBase64";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import NoDataCard from "../../Mentors/Event/NoDataCard";

const MoreLiveProjects = () => {
  const actor = useSelector((currState) => currState.actors.actor);
  const isAuthenticated = useSelector((curr) => curr.internet.isAuthenticated);

  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(false);
  const [showLine, setShowLine] = useState({});
  const tm = useRef(null);
  const userCurrentRoleStatusActiveRole = useSelector(
    (currState) => currState.currentRoleStatus.activeRole
  );

  const navigate = useNavigate();
  // Gradient color stops, changes when hovered
  // const gradientStops = isHovered
  //     ? { stop1: "#4087BF", stop2: "#3C04BA" }
  //     : { stop1: "#B5B5B5", stop2: "#5B5B5B" };

  const handleClickPlusOne = (id) => {
    setShowLine((prevShowLine) => ({
      ...prevShowLine,
      [id]: !prevShowLine[id],
    }));
  };

  const [noData, setNoData] = useState(null);
  const [allProjectData, setAllProjectData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("");
  const itemsPerPage = 12;

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
        case "user":
          navigate(`/individual-project-details-user/${projectId}`, {
            state: projectData,
          });
          break;
        case "project":
          toast.error("Only Access if you are in a same cohort!!");
          window.scrollTo({ top: 0, behavior: "smooth" });
          break;
        case "mentor":
          navigate(`/individual-project-details-project-mentor/${projectId}`);
          break;
        case "vc":
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

  const filteredUsers = React.useMemo(
    () =>
      allProjectData.filter((user) => {
        if (!filter) return true; // If no filter is set, show all users.

        const projectName =
          user?.params?.params?.project_name?.toLowerCase() || "";
        const userName =
          user?.params?.params?.user_data?.fullName?.toLowerCase() || "";

        return (
          projectName.includes(filter.toLowerCase()) ||
          userName.includes(filter.toLowerCase())
        );
      }),
    [filter, allProjectData]
  );

  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentProjects = filteredUsers.slice(
    indexOfFirstUser,
    indexOfLastUser
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handlePrevious = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setCurrentPage((prev) =>
      prev < Math.ceil(filteredUsers.length / itemsPerPage) ? prev + 1 : prev
    );
  };
  return (
    <div className="container mx-auto">
      <div className="px-[4%] pb-[4%] pt-[2%]">
        <div className="flex items-center justify-between">
          <div
            className="w-full bg-gradient-to-r from-purple-900 to-blue-500 text-transparent bg-clip-text text-3xl font-extrabold py-4 
       font-fontUse"
          >
            All Live Projects
          </div>

          <div className="relative flex items-center max-w-xs">
            <input
              type="text"
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="form-input rounded-xl px-4 py-2 bg-white text-gray-600 placeholder-gray-600 placeholder-ml-4 max-w-md"
              placeholder="Search..."
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              className="w-5 h-5 absolute right-2 text-gray-600"
            >
              <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
            </svg>
          </div>
        </div>
        <div className="flex justify-center mt-4">
          {noData ||
          (currentProjects &&
            currentProjects.filter(
              (val) =>
                val?.params?.params?.live_on_icp_mainnet[0] &&
                val?.params?.params?.live_on_icp_mainnet[0] === true
            ).length === 0) ? (
            <div className="h-screen">
              <NoDataCard />
            </div>
          ) : (
            <div className="flex flex-row  w-full gap-4  flex-wrap">
              {currentProjects &&
                currentProjects
                  .filter(
                    (val) =>
                      val?.params?.params?.live_on_icp_mainnet[0] &&
                      val?.params?.params?.live_on_icp_mainnet[0] === true
                  )
                  .map((data, index) => {
                    let projectName = data?.params?.params?.project_name ?? "";
                    let projectId = data?.params?.uid ?? "";
                    let projectImage = data?.params?.params?.project_logo
                      ? uint8ArrayToBase64(data?.params?.params?.project_logo)
                      : "";
                    let userImage = data?.params?.params?.user_data
                      ?.profile_picture[0]
                      ? uint8ArrayToBase64(
                          data?.params?.params?.user_data?.profile_picture[0]
                        )
                      : "";
                    let userName = data?.params?.params?.user_data?.full_name
                      ? data?.params?.params?.user_data?.full_name
                      : "";
                    let principalId = data?.principal
                      ? data?.principal.toText()
                      : "";
                    let projectDescription =
                      data?.params?.params?.project_description ?? "";
                    let projectAreaOfFocus =
                      data?.params?.params?.project_area_of_focus ?? "";
                    let projectData = data?.params ? data?.params : null;
                    let projectRubricStatus =
                      data?.overall_average.length > 0
                        ? data?.overall_average[
                            data?.overall_average.length - 1
                          ]
                        : 0;

                    return (
                      <div
                        className="w-full sm:w-1/2 md:w-1/4  hover:scale-105 transition-transform duration-300 ease-in-out"
                        key={index}
                      >
                        <div className="w-fit flex justify-between items-baseline flex-wrap bg-white overflow-hidden rounded-lg shadow-lg mb-5 md:mb-0">
                          <div className="p-4">
                            <div className="flex justify-between items-baseline flex-wrap w-fit">
                              <div className="flex items-center w-full">
                                <img
                                  className="rounded-full w-12 h-12 object-cover"
                                  src={projectImage}
                                  alt="profile"
                                />
                                <h1 className="ms-2 font-bold text-nowrap truncate w-[220px]">
                                  {projectName}
                                </h1>
                              </div>
                              <div className="flex items-center m-2 w-full">
                                <img
                                  className="h-5 w-5 rounded-full mr-2"
                                  src={userImage}
                                  alt="not found"
                                />
                                <p className="text-xs truncate">{userName}</p>
                              </div>
                            </div>
                            {progress && (
                              <div className="mb-4 flex items-baseline">
                                <svg
                                  width="100%"
                                  height="8"
                                  className="bg-[#B2B1B6] rounded-lg"
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
                                        offset={`${
                                          (projectRubricStatus * 100) / 8
                                        }%`}
                                        stopColor={"#3C04BA"}
                                        stopOpacity="1"
                                      />
                                    </linearGradient>
                                  </defs>
                                  <rect
                                    x="0"
                                    y="0"
                                    width={`${
                                      (projectRubricStatus * 100) / 8
                                    }%`}
                                    height="10"
                                    fill={`url(#gradient-${index})`}
                                  />
                                </svg>
                                <div className="ml-2 text-nowrap text-sm">
                                  {`${projectRubricStatus}/8`}
                                </div>
                              </div>
                            )}
                            <p
                              className="text-gray-700 text-sm p-2 overflow-hidden line-clamp-8 truncate text-wrap h-48"
                              style={{
                                overflow: "scroll",
                                display: "-webkit-box",
                                WebkitBoxOrient: "vertical",
                                WebkitLineClamp: 8,
                              }}
                            >
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
                                      projectId
                                        ? handleNavigate(projectId, projectData)
                                        : ""
                                    }
                                    className="cursor-pointer"
                                  >
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
                                handleNavigate(projectId, projectData)
                              }
                            >
                              KNOW MORE
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
            </div>
          )}
        </div>
        {currentProjects.length > 0 && (
          <div className="flex items-center gap-4 justify-center mt-8">
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-6 py-3 font-sans text-xs font-bold text-center text-gray-900 uppercase align-middle transition-all rounded-full select-none hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                aria-hidden="true"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                ></path>
              </svg>
              Previous
            </button>
            {Array.from(
              { length: Math.ceil(filteredUsers.length / itemsPerPage) },
              (_, i) => i + 1
            ).map((number) => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={`relative h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-full text-center align-middle font-sans text-xs font-medium uppercase text-gray-900 transition-all ${
                  currentPage === number
                    ? "bg-gray-900 text-white"
                    : "hover:bg-gray-900/10 active:bg-gray-900/20"
                }`}
                type="button"
              >
                <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                  {number}
                </span>
              </button>
            ))}
            <button
              onClick={handleNext}
              disabled={
                currentPage === Math.ceil(filteredUsers.length / itemsPerPage)
              }
              className="flex items-center gap-2 px-6 py-3 font-sans text-xs font-bold text-center text-gray-900 uppercase align-middle transition-all rounded-full select-none hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button"
            >
              Next
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                aria-hidden="true"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                ></path>
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoreLiveProjects;

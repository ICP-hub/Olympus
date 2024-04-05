import React, { useState, useEffect, useRef } from "react";
// import { IcpAccelerator_backend } from "../../../../declarations/IcpAccelerator_backend/index";
import uint8ArrayToBase64 from "../../../../IcpAccelerator_frontend/src/components/Utils/uint8ArrayToBase64";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import NoDataCard from "../../../../IcpAccelerator_frontend/src/components/Mentors/Event/NoDataCard";

const AllProject = () => {
  const actor = useSelector((currState) => currState.actors.actor);
  const isAuthenticated = useSelector((curr) => curr.internet.isAuthenticated);

  const [showLine, setShowLine] = useState({});
  const [noData, setNoData] = useState(false);
  const [allProjectData, setAllProjectData] = useState([]);
  const [spotlightProjectIds, setSpotlightProjectIds] = useState(new Set());
  const [filterOption, setFilterOption] = useState("All");
  const [displayedProjects, setDisplayedProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 9;

  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = displayedProjects.slice(
    indexOfFirstProject,
    indexOfLastProject
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterOption, displayedProjects.length]);

  useEffect(() => {
    fetchSpotlightProjects();
    fetchAllProjects();
  }, [actor]);

  const fetchSpotlightProjects = async () => {
    try {
      const spotlightProjects = await actor.get_spotlight_projects();
      const spotlightIds = new Set(spotlightProjects.map((p) => p.project_id));
      setSpotlightProjectIds(spotlightIds);
    } catch (error) {
      console.error("Error fetching spotlight projects:", error);
    }
  };

  const fetchAllProjects = async () => {
    try {
      const result = await actor.list_all_projects();
      const projectsWithSpotlightStatus = result.map((project) => ({
        ...project,
        isInSpotlight: spotlightProjectIds.has(project.params.uid),
      }));
      setAllProjectData(projectsWithSpotlightStatus);
    } catch (error) {
      console.error("Error fetching all projects:", error);
    }
  };

  useEffect(() => {
    const newDisplayedProjects = allProjectData.filter((project) => {
      switch (filterOption) {
        case "Added":
          return project.isInSpotlight;
        case "Not Added":
          return !project.isInSpotlight;
        default:
          return true;
      }
    });
    setDisplayedProjects(newDisplayedProjects);
  }, [allProjectData, filterOption]);

  // Pagination calculation
  const pageNumbers = [];
  for (
    let i = 1;
    i <= Math.ceil(displayedProjects.length / projectsPerPage);
    i++
  ) {
    pageNumbers.push(i);
  }

  useEffect(() => {
    setCurrentPage(1); // Reset to the first page when filter changes
  }, [filterOption, displayedProjects]);

  // Pagination Controls
  // const pageNumbers = [];
  // for (let i = 1; i <= Math.ceil(displayedProjects.length / projectsPerPage); i++) {
  //   pageNumbers.push(i);
  // }

  const tm = useRef(null);
  const navigate = useNavigate();

  const handleClickPlusOne = (id) => {
    setShowLine((prevShowLine) => ({
      ...prevShowLine,
      [id]: !prevShowLine[id],
    }));
  };

  useEffect(() => {
    const fetchSpotlightProjects = async () => {
      try {
        const spotlightProjects = await actor.get_spotlight_projects();
        console.log("spotlightProjects =>", spotlightProjects);
        const spotlightIds = new Set(
          spotlightProjects.map((p) => p.project_id)
        );
        setSpotlightProjectIds(spotlightIds);
      } catch (error) {
        console.error("Error fetching spotlight projects:", error);
      }
    };

    fetchSpotlightProjects();
  }, [actor]);

  useEffect(() => {
    const getAllProject = async () => {
      try {
        const result = await actor.list_all_projects();
        console.log("all project =>", result);
        const projectsWithSpotlightStatus = result.map((project) => ({
          ...project,
          isInSpotlight: spotlightProjectIds.has(project.params.uid),
        }));
        setAllProjectData(projectsWithSpotlightStatus);
        setNoData(projectsWithSpotlightStatus.length === 0);
      } catch (error) {
        console.error("Error fetching all projects:", error);
        setNoData(true);
      }
    };

    if (actor) {
      getAllProject();
    }
  }, [actor, spotlightProjectIds]);

  useEffect(() => {
    setDisplayedProjects(
      allProjectData.filter((project) => {
        switch (filterOption) {
          case "Added":
            return project.isInSpotlight;
          case "Not Added":
            return !project.isInSpotlight;
          default:
            return true;
        }
      })
    );
  }, [allProjectData, filterOption]);

  const addToSpotLightHandler = async (id) => {
    try {
      await actor.add_project_to_spotlight(id);
      setSpotlightProjectIds(new Set([...spotlightProjectIds, id]));
    } catch (err) {
      console.error("Error adding to spotlight:", err);
    }
  };

  const removeFromSpotLightHandler = async (id) => {
    try {
      await actor.remove_project_from_spotlight(id);
      spotlightProjectIds.delete(id);
      setSpotlightProjectIds(new Set([...spotlightProjectIds]));
    } catch (err) {
      console.error("Error removing from spotlight:", err);
    }
  };

  return (
    <div className="w-full flex flex-col px-[5%] py-[5%]">
      <div className="flex justify-end mb-4 items-center w-full">
        <label
          htmlFor="spotlightFilter"
          className="text-xs md:text-sm lg:text-md font-medium text-gray-700"
        >
          Filter Projects:
        </label>
        <select
          id="spotlightFilter"
          value={filterOption}
          onChange={(e) => setFilterOption(e.target.value)}
          className="ml-2 border-gray-300 border bg-white rounded-md p-1 md:p-2 shadow-sm hover:border-gray-400 focus:ring-blue-500 focus:border-blue-500 text-xs md:text-sm lg:text-md"
        >
          <option value="All">All</option>
          <option value="Added">Added to Spotlight</option>
          <option value="Not Added">Not in Spotlight</option>
        </select>
      </div>

      <div
        className="flex justify-start w-full space-x-2"
        style={{ minHeight: "60vh" }}
      >
        {noData ? (
          <NoDataCard />
        ) : (
          <div className="flex-wrap flex flex-row w-full">
            {currentProjects.map((data, index) => {
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
              let principalId = data?.principal ? data?.principal.toText() : "";
              let projectDescription =
                data?.params?.params?.project_description ?? "";
              let projectAreaOfFocus =
                data?.params?.params?.project_area_of_focus ?? "";
              let projectData = data?.params ? data?.params : null;
              let projectRubricStatus =
                data?.overall_average.length > 0
                  ? data?.overall_average[data?.overall_average.length - 1]
                  : 0;

              const isInSpotlight = spotlightProjectIds.has(projectId);

              return (
                <div
                  className="w-full sm:w-1/2 md:w-1/3 mb-2 px-2 sm:px-3"
                  key={index}
                >
                  <div className="justify-between items-baseline mb-4 flex-wrap bg-white overflow-hidden rounded-lg shadow-lg w-auto">
                    <div className="p-4">
                      <div className="flex justify-between items-baseline mb-4 flex-wrap w-full px-4">
                        <div className="flex items-baseline w-1/2">
                          <img
                            className="rounded-full w-12 h-12 object-cover"
                            src={projectImage}
                            alt="profile"
                          />
                          <h1 className="font-bold text-nowrap truncate md:w-[220px]">
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
                          className="bg-[#B2B1B6] rounded-lg"
                          // onMouseEnter={() => setIsHovered(true)}
                          // onMouseLeave={() => setIsHovered(false)}
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
                            fill={`url(#gradient-${projectId})`}
                          />
                        </svg>
                        <div className="ml-2 text-nowrap text-sm">
                          {" "}
                          {`${projectRubricStatus}/8`}
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm md:line-clamp-8 sxs:line-clamp-4 sm:line-clamp-6 line-clamp-8 h-36">
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
                        onClick={() => navigate("/all", { state: principalId })}
                      >
                        KNOW MORE
                      </button>
                      {!isInSpotlight ? (
                        <button
                          className="mt-4 bg-green-600 text-black px-4 py-1 rounded uppercase w-full text-center border border-gray-300 font-bold hover:bg-green-800 hover:text-white transition-colors duration-200 ease-in-out"
                          onClick={() => addToSpotLightHandler(projectId)}
                        >
                          Add to Spotlight
                        </button>
                      ) : (
                        <button
                          className="mt-4 bg-red-600 text-black px-4 py-1 rounded uppercase w-full text-center border border-gray-300 font-bold hover:bg-red-800  hover:text-white  transition-colors duration-200 ease-in-out"
                          onClick={() => removeFromSpotLightHandler(projectId)}
                        >
                          Remove Spotlight
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className="flex flex-wrap justify-center my-8">
        {pageNumbers.length > 1 && (
          <div className="flex items-center space-x-1">
            {currentPage > 1 && (
              <button
                onClick={() => paginate(currentPage - 1)}
                className="px-4 py-2 text-gray-700 bg-white rounded-md shadow hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Prev
              </button>
            )}
            {pageNumbers.map((number) => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={`px-4 py-2 text-gray-700 bg-white rounded-md shadow hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                  currentPage === number ? "bg-gray-200" : ""
                }`}
              >
                {number}
              </button>
            ))}
            {currentPage < pageNumbers.length && (
              <button
                onClick={() => paginate(currentPage + 1)}
                className="px-4 py-2 text-gray-700 bg-white rounded-md shadow hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Next
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProject;

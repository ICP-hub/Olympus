import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import NoDataCard from "../../../../IcpAccelerator_frontend/src/components/Mentors/Event/NoDataCard";
import uint8ArrayToBase64 from "../../../../IcpAccelerator_frontend/src/components/Utils/uint8ArrayToBase64";
import { principalToText } from "../Utils/AdminData/saga_function/blobImageToUrl";
import LiveModal from "../models/LiveModal";
import IncubatedModal from "../models/IncubatedModal";
import { useNavigate } from "react-router-dom";

const LiveIncubated = () => {
  const actor = useSelector((state) => state.actors.actor);
  const [allProjectData, setAllProjectData] = useState([]);
  const [filterOption, setFilterOption] = useState("All");

  const [displayedProjects, setDisplayedProjects] = useState([]);
  const [noData, setNoData] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 9;
  const [modalData, setModalData] = useState(null);

  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  const navigate = useNavigate();
  const toggleAcceptModal = (id) => {
    setModalData(id);
    setIsAcceptModalOpen(!isAcceptModalOpen);
  };
  const toggleRejectModal = (id) => {
    setModalData(id);
    setIsRejectModalOpen(!isRejectModalOpen);
  };

  const handleOpenModal = (projectData) => {
    setModalData(projectData);
    setShowModal(true);
  };

  useEffect(() => {
    const fetchAllProjects = async () => {
      try {
        const result = await actor.list_all_projects();
        // console.log("resultttttt => =>", result);
        const enhancedProjects = result.map((project) => ({
          ...project,
          isLive: project.params.params.live_on_icp_mainnet[0],
        }));
        setAllProjectData(enhancedProjects);
        setNoData(enhancedProjects.length === 0);
      } catch (error) {
        console.error("Error fetching all projects:", error);
        setNoData(true);
      }
    };

    if (actor) {
      fetchAllProjects();
    }
  }, [actor]);

  useEffect(() => {
    const filteredProjects = allProjectData.filter((project) => {
      if (filterOption === "Live") return project.isLive;
      if (filterOption === "Incubated") return !project.isLive;
      return true;
    });
    setDisplayedProjects(filteredProjects);
    setCurrentPage(1);
  }, [allProjectData, filterOption]);

  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = displayedProjects.slice(
    indexOfFirstProject,
    indexOfLastProject
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (
    let i = 1;
    i <= Math.ceil(displayedProjects.length / projectsPerPage);
    i++
  ) {
    pageNumbers.push(i);
  }

  return (
    <div className="w-full flex flex-col px-[5%] py-[5%]">
      <div className="flex justify-end mb-4 items-center w-full">
        <label
          htmlFor="liveFilter"
          className="text-xs md:text-sm lg:text-md font-medium text-gray-700"
        >
          Filter Projects:
        </label>
        <select
          id="liveFilter"
          value={filterOption}
          onChange={(e) => setFilterOption(e.target.value)}
          className="ml-2 border-gray-300 border bg-white rounded-md p-1 md:p-2 shadow-sm hover:border-gray-400 focus:ring-blue-500 focus:border-blue-500 text-xs md:text-sm lg:text-md"
        >
          <option value="All">All</option>
          <option value="Live">Live</option>
          <option value="Incubated">Incubated</option>
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
            {currentProjects.map((project, index) => {
              const {
                project_name,
                project_logo,
                project_description,
                project_area_of_focus,
                user_data,
                live_on_icp_mainnet,
              } = project.params.params;
              let projectId = project?.params?.uid ?? "";
              const projectName = project_name ?? "";
              let projectData = project?.params?.params ?? "";

              const projectImage = project_logo
                ? uint8ArrayToBase64(project_logo)
                : "";
              const userImage = user_data?.profile_picture
                ? uint8ArrayToBase64(user_data.profile_picture[0])
                : "";
              const principalId = principalToText(project.principal);
              const projectDescription = project_description ?? "";
              const statusLabel = project.isLive ? "Live" : "Incubated";
              const isLiveOnMainnet =
                live_on_icp_mainnet && live_on_icp_mainnet[0] === true;
              let projectRubricStatus =
                project?.overall_average.length > 0
                  ? project?.overall_average[data?.overall_average.length - 1]
                  : 0;

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
                            src={projectImage}
                            alt="Project Logo"
                            className="rounded-full w-12 h-12 object-cover"
                          />
                          <h1 className="font-bold text-nowrap truncate md:w-[220px]">
                            {projectName}
                          </h1>
                        </div>
                        <div className="flex items-baseline w-1/2">
                          <img
                            src={userImage}
                            alt="User Profile"
                            className="h-5 w-5 rounded-full mr-2"
                          />
                          <p className="text-xs truncate w-20">{principalId}</p>
                        </div>
                      </div>
                      <div className="mb-4 flex items-baseline">
                        <svg
                          width="100%"
                          height="8"
                          className="bg-[#B2B1B6] rounded-lg"
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
                      {project_area_of_focus && (
                        <div className="flex gap-2 mt-2 text-xs items-center">
                          {project_area_of_focus
                            .split(",")
                            .slice(0, 3)
                            .map((focus, index) => (
                              <div
                                key={index}
                                className="text-xs border-2 rounded-2xl px-2 py-1 font-bold bg-gray-100"
                              >
                                {focus.trim()}
                              </div>
                            ))}
                        </div>
                      )}

                      <button
                        className="mt-4 bg-transparent text-black px-4 py-1 rounded uppercase w-full text-center border border-gray-300 font-bold hover:bg-[#3505B2] hover:text-white transition-colors duration-200 ease-in-out"
                        onClick={() => navigate("/all", { state: principalId })}
                      >
                        KNOW MORE
                      </button>
                      {!isLiveOnMainnet ? (
                        <button
                          className="mt-4 bg-green-600 text-black px-4 py-1 rounded uppercase w-full text-center border border-gray-300 font-bold hover:bg-green-800 hover:text-white transition-colors duration-200 ease-in-out"
                          onClick={() => toggleAcceptModal(projectId)}
                        >
                          Live
                        </button>
                      ) : (
                        <button
                          className="mt-4 bg-red-600 text-black px-4 py-1 rounded uppercase w-full text-center border border-gray-300 font-bold hover:bg-red-800  hover:text-white  transition-colors duration-200 ease-in-out"
                          onClick={() => toggleRejectModal(projectId)}
                        >
                          Incubated
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
      {isRejectModalOpen && (
        <IncubatedModal
          id={modalData}
          onClose={() => setIsRejectModalOpen(false)}
        />
      )}
      {isAcceptModalOpen && (
        <LiveModal onClose={() => setIsAcceptModalOpen(false)} id={modalData} />
      )}
    </div>
  );
};

export default LiveIncubated;

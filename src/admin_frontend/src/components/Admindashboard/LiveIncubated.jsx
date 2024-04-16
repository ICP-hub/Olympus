import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import NoDataCard from "../../../../IcpAccelerator_frontend/src/components/Mentors/Event/NoDataCard";
import uint8ArrayToBase64 from "../../../../IcpAccelerator_frontend/src/components/Utils/uint8ArrayToBase64";
import { principalToText } from "../Utils/AdminData/saga_function/blobImageToUrl";
import LiveModal from "../models/LiveModal";
import IncubatedModal from "../models/IncubatedModal";
import { useNavigate } from "react-router-dom";
import { projectFilterSvg } from "../../../../IcpAccelerator_frontend/src/components/Utils/Data/SvgData";
import { useRef } from "react";
import { OutSideClickHandler } from "../../../../IcpAccelerator_frontend/src/components/hooks/OutSideClickHandler";
import toast, { Toaster } from "react-hot-toast";

const LiveIncubated = () => {
  const actor = useSelector((state) => state.actors.actor);
  const [allProjectData, setAllProjectData] = useState([]);
  const [filterOption, setFilterOption] = useState("Currently Live");
  const [showLine, setShowLine] = useState({});
  const [isLoadingAdd, setIsLoadingAdd] = useState({});
  const [isLoadingRemove, setIsLoadingRemove] = useState({});
  const [displayedProjects, setDisplayedProjects] = useState([]);
  const [noData, setNoData] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 9;
  const [modalData, setModalData] = useState(null);

  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [spotlightProjectIds, setSpotlightProjectIds] = useState(new Set());

  const dropdownRef = useRef(null);
  OutSideClickHandler(dropdownRef, () => setIsPopupOpen(false));

  const navigate = useNavigate();

  const toggleAcceptModal = (id) => {
    setModalData(id);
    setIsAcceptModalOpen(!isAcceptModalOpen);
  };

  const toggleRejectModal = (id) => {
    setModalData(id);
    setIsRejectModalOpen(!isRejectModalOpen);
  };

  const handleClickPlusOne = (id) => {
    setShowLine((prevShowLine) => ({
      ...prevShowLine,
      [id]: !prevShowLine[id],
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await actor.list_all_projects();
        const spotlightProjects = await actor.get_spotlight_projects();

        const spotlightIds = new Set(
          spotlightProjects.map((p) => p.project_id)
        );
        setSpotlightProjectIds(spotlightIds);

        const enhancedProjects = result.map((project) => ({
          ...project,
          isLive: !!project.params.params.live_on_icp_mainnet[0],
          isInSpotlight: spotlightIds.has(project.params.uid),
        }));

        setAllProjectData(enhancedProjects);
        setNoData(enhancedProjects.length === 0);
      } catch (error) {
        console.error("Error fetching data:", error);
        setNoData(true);
      }
    };

    if (actor) {
      fetchData();
    }
  }, [actor]);

  useEffect(() => {
    const filteredProjects = allProjectData.filter((project) => {
      switch (filterOption) {
        case "Featured in Spotlight":
          return spotlightProjectIds.has(project.params.uid);
        case "Excluded from Spotlight":
          return !spotlightProjectIds.has(project.params.uid);
        case "Currently Live":
          return project.isLive;
        case "Currently Incubating":
          return !project.isLive;
        default:
          return true;
      }
    });

    setDisplayedProjects(filteredProjects);
  }, [allProjectData, filterOption, spotlightProjectIds]);

  // Add to Spotlight handler
  const addToSpotLightHandler = async (id, live) => {
    setIsLoadingAdd((prevState) => ({ ...prevState, [id]: true }));

    if (live) {
      try {
        await actor.add_project_to_spotlight(id);
        setSpotlightProjectIds((prevState) => new Set([...prevState, id]));
      } catch (err) {
        console.error("Error adding to spotlight:", err);
      }
    } else {
      toast.error(
        "This project is not live yet, only live projects can be added to spotlight"
      );
    }

    setIsLoadingAdd((prevState) => ({ ...prevState, [id]: false }));
  };

  // Remove from Spotlight handler
  const removeFromSpotLightHandler = async (id) => {
    setIsLoadingRemove((prevState) => ({ ...prevState, [id]: true }));

    try {
      await actor.remove_project_from_spotlight(id);
      setSpotlightProjectIds((prevState) => {
        const updatedSet = new Set(prevState);
        updatedSet.delete(id);
        return updatedSet;
      });
    } catch (err) {
      console.error("Error removing from spotlight:", err);
    }

    setIsLoadingRemove((prevState) => ({ ...prevState, [id]: false }));
  };

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

  // const addToSpotLightHandler = async (id, live) => {
  //   if (live) {
  //     try {
  //       await actor.add_project_to_spotlight(id);
  //       setSpotlightProjectIds(new Set([...spotlightProjectIds, id]));
  //     } catch (err) {
  //       console.error("Error adding to spotlight:", err);
  //     }
  //   } else {
  //     toast.error(
  //       "This project is not live yet, only live projects can add in spotlight"
  //     );
  //   }
  // };

  // const removeFromSpotLightHandler = async (id) => {
  //   try {
  //     await actor.remove_project_from_spotlight(id);
  //     spotlightProjectIds.delete(id);
  //     setSpotlightProjectIds(new Set([...spotlightProjectIds]));
  //   } catch (err) {
  //     console.error("Error removing from spotlight:", err);
  //   }
  // };

  console.log("currentProjects =>", currentProjects);
  return (
    <div className="w-full flex flex-col px-[5%] py-[5%]">
      <div className="flex justify-end mb-4 items-center w-full">
        <div
          className="w-full bg-gradient-to-r from-purple-900 to-blue-500 text-transparent bg-clip-text text-xl md:text-3xl font-extrabold py-4 
       font-fontUse"
        >
          All Projects
        </div>

        <div className="cursor-pointer gap-2 flex flex-row items-center">
          <div
            className="border-2 border-blue-900 p-1 w-auto  font-bold rounded-md text-blue-900 px-2 capitalize"
            style={{ whiteSpace: "nowrap" }}
          >
            {filterOption}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex justify-end gap-4 relative " ref={dropdownRef}>
              <div
                className="cursor-pointer"
                onClick={() => setIsPopupOpen((curr) => !curr)}
              >
                {projectFilterSvg}
                {isPopupOpen && (
                  <div className="absolute w-[250px] top-full right-0 bg-white shadow-md rounded-lg border border-gray-200 p-3 z-10">
                    <ul className="flex flex-col">
                      <li>
                        <button
                          className="border-[#9C9C9C] w-[230px]  hover:text-indigo-800 border-b-2 py-2 px-4 focus:outline-none text-base flex justify-start font-fontUse"
                          onClick={() => {
                            setFilterOption("All");
                          }}
                        >
                          All
                        </button>
                      </li>
                      <li>
                        <button
                          className="border-[#9C9C9C] w-[230px]  hover:text-indigo-800 border-b-2 py-2 px-4 focus:outline-none text-base flex justify-start font-fontUse"
                          onClick={() =>
                            setFilterOption("Featured in Spotlight")
                          }
                        >
                          Featured in Spotlight
                        </button>
                      </li>
                      <li>
                        <button
                          className="border-[#9C9C9C] w-[230px]  hover:text-indigo-800 border-b-2 py-2 px-4 focus:outline-none text-base flex justify-start font-fontUse"
                          onClick={() =>
                            setFilterOption("Excluded from Spotlight")
                          }
                        >
                          Excluded from Spotlight
                        </button>
                      </li>
                      <li>
                        <button
                          className="border-[#9C9C9C] w-[230px]  hover:text-indigo-800 border-b-2 py-2 px-4 focus:outline-none text-base flex justify-start font-fontUse"
                          onClick={() => setFilterOption("Currently Live")}
                        >
                          Currently Live
                        </button>
                      </li>
                      <li>
                        <button
                          className="border-[#9C9C9C] w-[230px] py-2 px-4  hover:text-indigo-800 focus:outline-none text-base flex justify-start font-fontUse"
                          onClick={() =>
                            setFilterOption("Currently Incubating")
                          }
                        >
                          Currently Incubating
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>{" "}
        </div>
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
              let name = user_data?.full_name;
              const projectImage = project_logo
                ? uint8ArrayToBase64(project_logo)
                : "";
              const userImage = user_data?.profile_picture
                ? uint8ArrayToBase64(user_data.profile_picture[0])
                : "";
              const principalId = principalToText(project.principal);
              const projectDescription = project_description ?? "";
              // const statusLabel = project.isLive ? "Live" : "Incubated";
              const isLiveOnMainnet =
                live_on_icp_mainnet && live_on_icp_mainnet[0] === true;
              let projectRubricStatus =
                project?.overall_average.length > 0
                  ? project?.overall_average[data?.overall_average.length - 1]
                  : 0;
              let isLive_On = project?.params?.params?.live_on_icp_mainnet[0];
              const isInSpotlight = spotlightProjectIds.has(projectId);

              return (
                <div
                  className="w-full sm:w-1/2 md:w-1/3 mb-2 hover:scale-105 transition-transform duration-300 ease-in-out px-[1%]"
                  key={index}
                >
                  <div className="justify-between items-baseline mb-4 flex-wrap bg-white overflow-hidden rounded-lg shadow-lg w-auto">
                    <div className="p-4">
                      <div className="flex mb-2 items-center w-full">
                        <img
                          src={projectImage}
                          alt="Project Logo"
                          className="rounded-full w-12 h-12 object-cover"
                        />
                        <h1 className="font-bold pl-2 text-nowrap truncate w-[196px]">
                          {projectName}
                        </h1>
                      </div>
                      <div className="flex mb-4 pl-2 items-center justify-start w-full">
                        <img
                          src={userImage}
                          alt="User Profile"
                          className="h-5 w-5 rounded-full mr-2"
                        />
                        <p className="text-xs truncate w-[14rem]">{name}</p>
                      </div>
                      {/* <div className="mb-4 flex items-baseline px-2">
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
                      </div> */}
                      <p className="px-3 text-gray-700 text-sm md:line-clamp-8 sxs:line-clamp-4 sm:line-clamp-6 line-clamp-8 h-36">
                        {projectDescription}
                      </p>
                      {project_area_of_focus && (
                        <div
                          className="flex gap-2 mt-2 text-xs items-center overflow-x-auto"
                          style={{ minHeight: "50px" }}
                        >
                          {/* Always visible data */}
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

                          {/* Conditionally visible data */}
                          {showLine[projectId] &&
                            project_area_of_focus
                              .split(",")
                              .slice(3)
                              .map((tag, index) => (
                                <div
                                  key={index}
                                  className="text-xs border-2 rounded-2xl px-2 py-1 font-bold bg-gray-100"
                                >
                                  {tag.trim()}
                                </div>
                              ))}

                          {/* Toggle button */}
                          {project_area_of_focus.split(",").length > 3 && (
                            <p
                              onClick={() => handleClickPlusOne(projectId)}
                              className="cursor-pointer flex-shrink-0 px-2"
                            >
                              {showLine[projectId] ? "View less" : "view more"}
                            </p>
                          )}
                        </div>
                      )}

                      <button
                        className="mt-4 bg-transparent text-blue-900 px-4 py-1 rounded uppercase w-full text-center border border-gray-300 font-bold hover:bg-blue-900 hover:text-white transition-colors duration-200 ease-in-out"
                        onClick={() => navigate("/all", { state: principalId })}
                      >
                        KNOW MORE
                      </button>
                      {!spotlightProjectIds.has(projectId) ? (
                        <button
                          className="mt-2 bg-green-500 text-white px-4 py-1 rounded uppercase w-full text-center hover:bg-green-700 transition-colors duration-200 ease-in-out"
                          onClick={() =>
                            addToSpotLightHandler(projectId, isLive_On)
                          }
                          disabled={isLoadingAdd[projectId]} // Use specific loading state for adding
                        >
                          {isLoadingAdd[projectId] ? (
                            <div className="relative flex items-center justify-center">
                              <div className="absolute">
                                <div className="w-6 h-6 border-4 rounded-full animate-spin border-t-transparent border-green-300"></div>
                              </div>
                              <span className="opacity-0 ml-2">
                                Add to Spotlight
                              </span>
                            </div>
                          ) : (
                            "Add to Spotlight"
                          )}
                        </button>
                      ) : (
                        <button
                          className="mt-2 bg-yellow-500 text-white px-4 py-1 rounded uppercase w-full text-center hover:bg-yellow-600 transition-colors duration-200 ease-in-out"
                          onClick={() => removeFromSpotLightHandler(projectId)}
                          disabled={isLoadingRemove[projectId]} // Use specific loading state for removing
                        >
                          {isLoadingRemove[projectId] ? (
                            <div className="relative flex items-center justify-center">
                              <div className="absolute">
                                <div className="w-6 h-6 border-4 rounded-full animate-spin border-t-transparent border-yellow-300"></div>
                              </div>
                              <span className="opacity-0 ml-2">
                                Remove from Spotlight
                              </span>
                            </div>
                          ) : (
                            "Remove from Spotlight"
                          )}
                        </button>
                      )}

                      {!isLiveOnMainnet ? (
                        <button
                          className="mt-2 bg-teal-500 text-white px-4 py-1 rounded uppercase w-full text-center hover:bg-teal-600 transition-colors duration-200 ease-in-out"
                          onClick={() => toggleAcceptModal(projectId)}
                        >
                          Live Now
                        </button>
                      ) : (
                        <button
                          className="mt-2 bg-gray-500 text-white px-4 py-1 rounded uppercase w-full text-center hover:bg-gray-600 transition-colors duration-200 ease-in-out"
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

      {/* {pageNumbers.length > 1 && ( */}
      <div className="flex items-center gap-4 justify-center">
        {currentPage > 1 && (
          <button
            onClick={() => paginate(currentPage - 1)}
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
            Prev
          </button>
        )}
        {pageNumbers.map((number) => (
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
        {currentPage < pageNumbers.length && (
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === pageNumbers.length}
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
        )}
      </div>
      {/* )} */}

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

import React, { useState, useEffect, useRef } from "react";
import ment from "../../../../assets/images/ment.jpg";
import girl from "../../../../assets/images/girl.jpeg";
import { IcpAccelerator_backend } from "../../../../../declarations/IcpAccelerator_backend/index";
import uint8ArrayToBase64 from "../../Utils/uint8ArrayToBase64";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import NoDataCard from "../../Mentors/Event/NoDataCard";

const MoreCurrentlyRaisingProjects = () => {
  const actor = useSelector((currState) => currState.actors.actor);
  const isAuthenticated = useSelector((curr) => curr.internet.isAuthenticated);

  const [isHovered, setIsHovered] = useState(false);
  const [percent, setPercent] = useState(0);
  const [showLine, setShowLine] = useState({});
  const tm = useRef(null);
  const userCurrentRoleStatusActiveRole = useSelector(
    (currState) => currState.currentRoleStatus.activeRole
  );
  const navigate = useNavigate();
  // Gradient color stops, changes when hovered
  // const gradientStops = isHovered
  //   ? { stop1: "#4087BF", stop2: "#3C04BA" }
  //   : { stop1: "#B5B5B5", stop2: "#5B5B5B" };

  const handleClickPlusOne = (id) => {
    setShowLine((prevShowLine) => ({
      ...prevShowLine,
      [id]: !prevShowLine[id],
    }));
  };

  // const defaultArray = [
  //   {
  //     projectName: "Awesome Project",
  //     projectId: "ABC123",
  //     projectImage: ment,
  //     userImage: girl,
  //     principalId: "user123",
  //     projectDescription: "This is an amazing project focused on innovation.",
  //     projectAreaOfFocus: "Technology",
  //   },
  //   {
  //     projectName: "Creative Initiative",
  //     projectId: "DEF456",
  //     projectImage: ment,
  //     userImage: girl,
  //     principalId: "user456",
  //     projectDescription:
  //       "A creative initiative aiming to bring positive change.",
  //     projectAreaOfFocus: "Art and Design",
  //   },
  //   {
  //     projectName: "Community Outreach",
  //     projectId: "GHI789",
  //     projectImage: ment,
  //     userImage: girl,
  //     principalId: "user789",
  //     projectDescription:
  //       "Engaging community outreach program fostering collaboration.",
  //     projectAreaOfFocus: "Social Impact",
  //   },
  //   {
  //     projectName: "Community Outreach",
  //     projectId: "GHI789",
  //     projectImage: ment,
  //     userImage: girl,
  //     principalId: "user789",
  //     projectDescription:
  //       "Engaging community outreach program fostering collaboration.",
  //     projectAreaOfFocus: "Social Impact",
  //   },
  //   {
  //     projectName: "Community Outreach",
  //     projectId: "GHI789",
  //     projectImage: ment,
  //     userImage: girl,
  //     principalId: "user789",
  //     projectDescription:
  //       "Engaging community outreach program fostering collaboration.",
  //     projectAreaOfFocus: "Social Impact",
  //   },
  //   {
  //     projectName: "Community Outreach",
  //     projectId: "GHI789",
  //     projectImage: ment,
  //     userImage: girl,
  //     principalId: "user789",
  //     projectDescription:
  //       "Engaging community outreach program fostering collaboration.",
  //     projectAreaOfFocus: "Social Impact",
  //   },
  //   {
  //     projectName: "Community Outreach",
  //     projectId: "GHI789",
  //     projectImage: ment,
  //     userImage: girl,
  //     principalId: "user789",
  //     projectDescription:
  //       "Engaging community outreach program fostering collaboration.",
  //     projectAreaOfFocus: "Social Impact",
  //   },
  // ];

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
    // setAllProjectData(defaultArray);
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
        case 'investor':
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
    <div className="" style={{ minHeight: "60vh" }}>
      {noData || (allProjectData &&
        allProjectData.filter((val) =>
          val?.params?.params?.live_on_icp_mainnet[0] && val?.params?.params?.live_on_icp_mainnet[0] === true && val?.params?.params?.money_raised_till_now[0] && val?.params?.params?.money_raised_till_now[0] == true).length == 0) ?
        <div className="h-screen items-center"><NoDataCard /></div>
        :
        <div className="flex-wrap flex flex-row">
          {allProjectData &&
        allProjectData.filter((val) =>
          val?.params?.params?.live_on_icp_mainnet[0] && val?.params?.params?.live_on_icp_mainnet[0] === true && val?.params?.params?.money_raised_till_now[0] && val?.params?.params?.money_raised_till_now[0] == true).map((data, index) => {
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
              <div className="w-full sm:w-1/2 md:w-1/3 mb-2 px-3" key={index}>
                <div className="w-fit justify-between items-baseline mb-4 flex-wrap bg-white m-2 overflow-hidden rounded-lg shadow-lg">
                  <div className="p-4">
                    <div className="flex justify-between items-baseline mb-4 flex-wrap w-[265px]">
                      <div className="flex items-baseline w-1/2">
                        <img
                          className="rounded-full w-12 h-12 object-cover"
                          src={projectImage}
                          alt="profile"
                        />
                        <h1 className="font-bold text-nowrap truncate w-[220px]">
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
                      <div className="ml-2 text-nowrap text-sm">{`${projectRubricStatus}/8`}</div>
                    </div>
                    <p className="text-gray-700 text-sm md:line-clamp-8 sxs:line-clamp-4 sm:line-clamp-6 line-clamp-8 h-36">
                      {projectDescription}
                    </p>
                    {projectAreaOfFocus ?
                      <div className="flex gap-2 mt-2 text-xs">
                        <p>{projectAreaOfFocus}</p>

                        <p
                          onClick={() =>
                            handleNavigate(projectId, projectData)
                          }
                          className="cursor-pointer"
                        >
                          +1 more
                        </p>
                      </div> : ''}

                    <button
                      className="mt-4 bg-transparent text-black px-4 py-1 rounded uppercase w-full text-center border border-gray-300 font-bold hover:bg-[#3505B2] hover:text-white transition-colors duration-200 ease-in-out"
                      onClick={() =>
                        handleNavigate(projectId, projectData)
                      }
                    >
                      View Project
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>}
    </div>
  );
};

export default MoreCurrentlyRaisingProjects;

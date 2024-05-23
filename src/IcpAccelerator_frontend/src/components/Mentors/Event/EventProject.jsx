import React from "react";
import uint8ArrayToBase64 from "../../Utils/uint8ArrayToBase64";
import { useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import NoDataCard from "../../Mentors/Event/NoDataCard";
import NoData from "../../../../assets/images/file_not_found.png";

function EventProject({ allProjectData, noData }) {
  const actor = useSelector((currState) => currState.actors.actor);
  const isAuthenticated = useSelector((curr) => curr.internet.isAuthenticated);
  const userCurrentRoleStatusActiveRole = useSelector(
    (currState) => currState.currentRoleStatus.activeRole
  );
  console.log("allProjectData line no 17 =====>>>>>>>", allProjectData);
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
  return (
    <>
      <div className="flex max-md:flex-col -mx-4 mb-4 items-stretch">
        <div className="w-full px-4 md:flex md:gap-4 sm:flex sm:gap-4">
          {noData ||
          (allProjectData &&
            allProjectData?.Ok?.filter(
              (val) =>
                val?.params?.live_on_icp_mainnet[0] &&
                val?.params?.live_on_icp_mainnet[0] === true
            ).length == 0) ? (
            <NoDataCard image={NoData} desc={"No featured projects yet"} />
          ) : (
            <>
              {allProjectData &&
                allProjectData?.Ok?.filter(
                  (val) =>
                    val?.params?.live_on_icp_mainnet[0] &&
                    val?.params?.live_on_icp_mainnet[0] === true
                ).map((data, index) => {
                  let projectName = data?.params?.project_name ?? "";
                  let projectId = data?.uid ?? "";
                  let projectImage = data?.params?.project_logo
                    ? uint8ArrayToBase64(data?.params?.project_logo)
                    : "";
                  let userName = data?.params?.user_data?.full_name
                    ? data?.params?.user_data?.full_name
                    : "";
                  let userImage = data?.params?.user_data?.profile_picture[0]
                    ? uint8ArrayToBase64(
                        data?.params?.user_data?.profile_picture[0]
                      )
                    : "";
                  let principalId = data?.principal
                    ? data?.principal.toText()
                    : "";
                  let projectDescription =
                    data?.params?.project_description ?? "";
                  let projectAreaOfFocus =
                    data?.params?.project_area_of_focus ?? "";
                  let projectData = data?.params ? data?.params : null;
                  // let projectRubricStatus =
                  //   data?.overall_average.length > 0
                  //     ? data?.overall_average[data?.overall_average.length - 1]
                  //     : 0;

                  return (
                    <div
                      className="w-full sm:w-1/2 md:w-1/4  hover:scale-105 transition-transform duration-300 ease-in-out"
                      key={index}
                    >
                      <div className="sm:w-fit flex justify-between items-baseline flex-wrap bg-white overflow-hidden rounded-lg shadow-lg mb-5 md:mb-0">
                        <div className="p-4">
                          <div className="flex justify-between items-baseline flex-wrap w-fit">
                            <div className="flex items-center w-full">
                              <img
                                className="rounded-full w-12 h-12 object-cover border-black border-2 p-1"
                                src={projectImage}
                                alt="profile"
                              />
                              <h1 className="ms-2 font-bold text-nowrap truncate w-[220px]">
                                {projectName}
                              </h1>
                            </div>
                            <div className="flex items-center m-2 w-full">
                              <img
                                className="h-7 w-7 rounded-full mr-2 object-cover"
                                src={userImage}
                                alt="not found"
                              />
                              <p className="text-base truncate">{userName}</p>
                            </div>
                          </div>
                          {/* {progress && (
                              <div className="mb-4 flex items-baseline w-fit">
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
                                          (projectRubricStatus * 100) / 9
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
                                      (projectRubricStatus * 100) / 9
                                    }%`}
                                    height="10"
                                    fill={`url(#gradient-${index})`}
                                  />
                                </svg>
                                <div className="ml-2 text-nowrap text-sm">
                                  {`${projectRubricStatus}/9`}
                                </div>
                              </div>
                            )} */}
                          <p className="text-gray-700 text-sm p-2  min-h-48 break-all min-w-16 line-clamp-6 sxxs:w-11/12">
                            {projectDescription}
                          </p>

                          {/* {projectAreaOfFocus ? (
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
                          )} */}

                          <button
                            className="mt-4 bg-transparent text-black px-4 py-1 rounded uppercase w-full text-center border border-gray-300 font-bold hover:bg-[#3505B2] hover:text-white transition-colors duration-200 ease-in-out"
                            // onClick={() =>
                            //   handleNavigate(projectId, projectData)
                            // }
                          >
                            KNOW MORE
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </>
          )}
        </div>
      </div>
      <Toaster />
    </>
  );
}

export default EventProject;

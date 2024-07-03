import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import uint8ArrayToBase64 from "../../../../../IcpAccelerator_frontend/src/components/Utils/uint8ArrayToBase64";
import NoDataCard from "../../../../../IcpAccelerator_frontend/src/components/Mentors/Event/NoDataCard";
import NoData from "../../../../../IcpAccelerator_frontend/assets/images/file_not_found.png";
import CohortRemoveButton from "../../models/CohortRemoveButton";

function CohortProject({ allProjectData, noData, cohortId }) {
  const actor = useSelector((currState) => currState.actors.actor);
  const navigate = useNavigate();
  console.log("allProjectData line no 17 =====>>>>>>>", allProjectData);
  const [inputValue, setInputValue] = useState("");
  const [currentProjectId, setCurrentProjectId] = useState(null);

  const handleInputChange = (value) => {
    setInputValue(value);
  };
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const handleOpenDeleteModal = (id) => {
    setCurrentProjectId(id);
    setDeleteModalOpen(true);
  };
  const handleClose = () => {
    setDeleteModalOpen(false);
    setCurrentProjectId(null);
  };
  const handleSubmit = async () => {
    console.log("Submitted value:", inputValue);
    setIsSubmitting(true);
    let passphrase_key = `delete/${inputValue}`;
    let cohort_id = cohortId;
    let project_uid = currentProjectId;
    console.log("remove_project_from_cohort ====>>>", project_uid);
    console.log("remove_project_from_cohort ====>>>", passphrase_key);
    console.log("remove_project_from_cohort ====>>>", cohort_id);
    await actor
      .remove_project_from_cohort(cohort_id, project_uid, passphrase_key)
      .then((result) => {
        if (result && result?.Ok) {
          console.log("result-in-remove_project_from_cohort", result);
          toast.success(result?.Ok);
          setIsSubmitting(false);
          navigate("/");
        } else {
          console.log("result-in-remove_project_from_cohort", result);
          toast.error(result?.Err);
          setIsSubmitting(false);
        }
      });
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
                    ? uint8ArrayToBase64(data?.params?.project_logo[0])
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
                              </h1>{" "}
                              <div
                                onClick={() => handleOpenDeleteModal(projectId)}
                                className="right-text"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 16 16"
                                  fill="red"
                                  className="size-4 ml-2"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5a.75.75 0 0 1 .786-.711Z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>{" "}
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
                            onClick={() =>
                              navigate(`/cohort-project-detail/${projectId}`, {
                                state: { cohortId: cohortId },
                              })
                            }
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
      </div>{" "}
      {isDeleteModalOpen && (
        <CohortRemoveButton
          heading="Remove Cohort"
          onClose={handleClose}
          isSubmitting={false}
          onSubmitHandler={handleSubmit}
          onInputChange={handleInputChange}
          Id={currentProjectId}
        />
      )}
      <Toaster />
    </>
  );
}

export default CohortProject;

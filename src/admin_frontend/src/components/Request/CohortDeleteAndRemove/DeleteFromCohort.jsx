import React, { useState, useEffect } from "react";
import hover from "../../../../../IcpAccelerator_frontend/assets/images/1.png";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { formatFullDateFromSimpleDate } from "../../../../../IcpAccelerator_frontend/src/components/Utils/formatter/formatDateFromBigInt";
import toast, { Toaster } from "react-hot-toast";
import CohortInvestor from "./CohortInvestor";
import CohortMentor from "./CohortMentor";
import CohortProject from "./CohortProject";
function DeleteFromCohort() {
  const location = useLocation();
  const navigate = useNavigate();
  const actor = useSelector((currState) => currState.actors.actor);

  const [noData, setNoData] = useState(null);
  const { cohort_id } = location.state || {};

  const [cohortData, setCohortData] = useState(null);
  const [allProjectData, setAllProjectData] = useState([]);
  const [allMentorData, setAllMentorData] = useState([]);
  const [allInvestorData, setAllInvestorData] = useState([]);

  const fetchCohortData = async () => {
    await actor
      .get_cohort(cohort_id)
      .then((result) => {
        console.log("get_cohort line 14 ========>>>>>>>>", result);
        if (result && Object.keys(result).length > 0) {
          setCohortData(result);
          setNoData(false);
        } else {
          setCohortData(null);
          setNoData(true);
        }
      })
      .catch((error) => {
        console.log("error-in-get_my_cohort", error);
        setCohortData(null);
      });
  };
  const fetchProjectData = async () => {
    await actor
      .get_projects_applied_for_cohort(cohort_id)
      .then((result) => {
        console.log("get_project line 38 ========>>>>>>>>", result);
        if (result && Object.keys(result).length > 0) {
          setAllProjectData(result);
          setNoData(false);
        } else {
          setAllProjectData(null);
          setNoData(true);
        }
      })
      .catch((error) => {
        console.log("error-in-get_project", error);
        setAllProjectData(null);
      });
  };
  const fetchMentorData = async () => {
    await actor
      .get_mentors_applied_for_cohort(cohort_id)
      .then((result) => {
        console.log("get_mentor line 54 ========>>>>>>>>", result);
        if (result && Object.keys(result).length > 0) {
          setAllMentorData(result);
          setNoData(false);
        } else {
          setAllMentorData(null);
          setNoData(true);
        }
      })
      .catch((error) => {
        console.log("error-in-get_mentor", error);
        setAllMentorData(null);
      });
  };
  const fetchInvestorData = async () => {
    await actor
      .get_vcs_applied_for_cohort(cohort_id)
      .then((result) => {
        console.log("get_investor line 81 ========>>>>>>>>", result);
        if (result && Object.keys(result).length > 0) {
          setAllInvestorData(result);
          setNoData(false);
        } else {
          setAllInvestorData(null);
          setNoData(true);
        }
      })
      .catch((error) => {
        console.log("error-in-get_investor", error);
        setAllInvestorData(null);
      });
  };

  useEffect(() => {
    if (actor) {
      fetchCohortData();
      fetchProjectData();
      fetchMentorData();
      fetchInvestorData();
    } else {
      window.location.href = "/";
    }
  }, [actor]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const registerHandler = async () => {
    if (actor) {
      const today = new Date();
      const deadline = new Date(
        formatFullDateFromSimpleDate(cohortData?.cohort?.deadline)
      );

      if (deadline < today) {
        setIsModalOpen(true);
      } else {
        try {
          if (userCurrentRoleStatusActiveRole === "project") {
            let cohort_id = cohortData?.cohort_id;
            await actor
              .apply_for_a_cohort_as_a_project(cohort_id)
              .then((result) => {
                if (
                  result &&
                  result.includes(`Request Has Been Sent To Cohort Creator`)
                ) {
                  toast.success(result);
                  // window.location.href = "/";
                } else {
                  toast.error(result);
                }
              });
          } else if (userCurrentRoleStatusActiveRole === "vc") {
            let cohort_id = cohortData?.cohort_id;
            await actor
              .apply_for_a_cohort_as_a_investor(cohort_id)
              .then((result) => {
                if (result) {
                  toast.success(result);
                  // window.location.href = "/";
                } else {
                  toast.error(result);
                }
              });
          } else if (userCurrentRoleStatusActiveRole === "mentor") {
            let cohort_id = cohortData?.cohort_id;
            await actor
              .apply_for_a_cohort_as_a_mentor(cohort_id)
              .then((result) => {
                if (result) {
                  toast.success(result);
                  // window.location.href = "/";
                } else {
                  toast.error(result);
                }
              });
          }
        } catch (error) {
          toast.error(error);
          console.error("Error sending data to the backend:", error);
        }
      }
    } else {
      toast.error("Please signup with internet identity first");
      window.location.href = "/";
    }
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };
  console.log("cohort", cohortData);
  return (
    <section className="bg-gray-100 w-full h-full lg1:px-[4%] py-[2%] px-[5%]">
      {isModalOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50"></div>
          <div className=" overflow-y-auto overflow-x-hidden  top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full fixed flex">
            <div className="relative p-4 w-full max-w-md max-h-full">
              <div className="relative bg-white rounded-lg shadow">
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t ">
                  <h3 className="text-xl font-semibold text-gray-900 ">
                    Registration Closed
                  </h3>
                  <button
                    type="button"
                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center "
                    onClick={closeModal}
                  >
                    <svg
                      className="w-3 h-3"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 14"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                      />
                    </svg>
                  </button>
                </div>

                <div className=" items-center justify-center p-4 md:p-5 border-b rounded-t ">
                  <p className="text-lg font-semibold text-gray-900 ">
                    You cannot register for this event because the deadline has
                    passed.
                  </p>
                </div>
                <div className="flex w-full p-4 justify-end">
                  <button
                    onClick={closeModal}
                    type="close"
                    className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <div className="container">
        <div className="flex items-center justify-between my-4  flex-row font-bold bg-clip-text text-transparent text-[13px] xxs1:text-[13px] xxs:text-[9.5px] dxs:text-[9.5px] ss4:text-[9.5px] ss3:text-[9.5px] ss2:text-[9.5px] ss1:text-[9.5px] ss:text-[9.5px] sxs3:text-[9.5px] sxs2:text-[9.5px] sxs1:text-[9.5px] sxs:text-[9.5px] sxxs:text-[9.5px]">
          <h1 className="bg-gradient-to-r from-indigo-900 to-sky-400 font-extrabold text-transparent bg-clip-text text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl sxxs:text-lg">
            Cohort Details
          </h1>
        </div>
        <div className="container">
          <div className="bg-white rounded-2xl shadow-sm">
            <div className="flex justify-between p-8 sxxs:flex-col lg:flex-row">
              <div className="flex flex-col w-1/2">
                <div className="w-full">
                  <p className="font-extrabold text-xl capitalize">
                    {cohortData?.cohort?.title}
                  </p>
                  <ul className="my-4 grid md:grid-cols-2">
                    <li className="list-disc">
                      <div className="flex-col flex">
                        <span className="font-bold flex text-[#7283EA]">
                          Cohort Start Date:
                        </span>
                        <span className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 448 512"
                            className="size-4"
                          >
                            <path d="M96 32V64H48C21.5 64 0 85.5 0 112v48H448V112c0-26.5-21.5-48-48-48H352V32c0-17.7-14.3-32-32-32s-32 14.3-32 32V64H160V32c0-17.7-14.3-32-32-32S96 14.3 96 32zM448 192H0V464c0 26.5 21.5 48 48 48H400c26.5 0 48-21.5 48-48V192z" />
                          </svg>
                          <span className="ml-2">
                            {cohortData?.cohort?.cohort_launch_date}
                          </span>
                        </span>
                      </div>
                    </li>
                    <li className="list-disc">
                      <div className="flex flex-col">
                        <span className="font-bold flex text-[#7283EA]">
                          Cohort End Date:
                        </span>
                        <span className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 448 512"
                            className="size-4"
                          >
                            <path d="M96 32V64H48C21.5 64 0 85.5 0 112v48H448V112c0-26.5-21.5-48-48-48H352V32c0-17.7-14.3-32-32-32s-32 14.3-32 32V64H160V32c0-17.7-14.3-32-32-32S96 14.3 96 32zM448 192H0V464c0 26.5 21.5 48 48 48H400c26.5 0 48-21.5 48-48V192z" />
                          </svg>
                          <span className="ml-2"></span>
                          {cohortData?.cohort?.cohort_end_date}
                        </span>
                      </div>
                    </li>
                    <li className="list-disc">
                      <div className="flex flex-col">
                        <span className="font-bold flex text-[#7283EA]">
                          Cohort Deadline:
                        </span>
                        <span className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 448 512"
                            className="size-4"
                          >
                            <path d="M96 32V64H48C21.5 64 0 85.5 0 112v48H448V112c0-26.5-21.5-48-48-48H352V32c0-17.7-14.3-32-32-32s-32 14.3-32 32V64H160V32c0-17.7-14.3-32-32-32S96 14.3 96 32zM448 192H0V464c0 26.5 21.5 48 48 48H400c26.5 0 48-21.5 48-48V192z" />
                          </svg>
                          <span className="ml-2"></span>
                          {cohortData?.cohort?.deadline}
                        </span>
                      </div>
                    </li>
                    <li className="list-disc">
                      <div className="flex flex-col">
                        <span className="font-bold flex text-[#7283EA]">
                          Number of Seats :
                        </span>
                        <span className="flex items-center">
                          <span className="ml-2 text-xs border-2 rounded-2xl px-2 py-1 font-bold bg-gray-100 w-fit">
                            {Number(cohortData?.cohort?.no_of_seats)}
                          </span>
                        </span>
                      </div>
                    </li>
                  </ul>
                  <p className="text-[#7283EA] font-semibold text-xl mb-4">
                    Tags
                  </p>
                  {cohortData?.cohort?.tags ? (
                    <div className="flex gap-2 mt-2 text-xs items-center pb-2 flex-wrap">
                      {cohortData?.cohort?.tags
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
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                <div className="mb-4">
                  <p className="text-[#7283EA] font-semibold text-xl mb-2">
                    Eligibility criteria for applying
                  </p>
                  <p className=" truncate mb-2">
                    {cohortData?.cohort?.criteria?.eligibility[0]}
                  </p>
                  <div className="flex flex-col">
                    <span className="font-bold flex text-xl text-[#7283EA]">
                      Level of rubric required
                    </span>{" "}
                    <span className="ml-2 text-xs border-2 rounded-2xl px-2 py-1 font-bold bg-gray-100 w-fit">
                      {cohortData?.cohort?.criteria?.level_on_rubric}
                    </span>
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-[#7283EA] font-semibold text-xl mb-2">
                    Cohort instructions
                  </p>
                  <p className="h-full line-clamp-6">
                    {cohortData?.cohort?.description}
                  </p>
                </div>
              </div>
              <div className="md:w-1/2 w-full flex flex-col justify-between right-text">
                <img
                  className="h-full object-cover rounded-2xl w-full mb-2"
                  src={hover}
                  alt="not found"
                />
                <div className="flex flex-row justify-between items-center mt-2">
                  <div className="flex flex-row flex-wrap lg:justify-between md:justify-center space-x-8"></div>
                  <div className="flex justify-center items-center">
                    <div className="flex justify-center items-center">
                      {/* <button
                        className="uppercase w-full bg-[#3505B2] text-white  px-4 py-2 rounded-md  items-center font-extrabold text-xl sxxs:text-sm"
                        onClick={registerHandler}
                      >
                        Apply
                      </button> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between my-4  flex-row font-bold bg-clip-text text-transparent text-[13px] xxs1:text-[13px] xxs:text-[9.5px] dxs:text-[9.5px] ss4:text-[9.5px] ss3:text-[9.5px] ss2:text-[9.5px] ss1:text-[9.5px] ss:text-[9.5px] sxs3:text-[9.5px] sxs2:text-[9.5px] sxs1:text-[9.5px] sxs:text-[9.5px] sxxs:text-[9.5px]">
              <h1 className="bg-gradient-to-r from-indigo-900 to-sky-400 font-extrabold font-fontUse text-transparent bg-clip-text text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl sxxs:text-lg">
                Projects
              </h1>
              <button
                onClick={() => navigate("/live-projects")}
                className="border border-violet-800 px-4 py-2 rounded-md text-violet-800 sxxs:px-2 sxxs:py-1 sxxs:text-xs sm:text-lg"
              >
                View More
              </button>
            </div>
            <div className="mb-4 fade-in">
              <CohortProject
                allProjectData={allProjectData}
                noData={noData}
                cohortId={cohortData?.cohort_id}
              />
            </div>
            <div className="flex items-center justify-between mb-4  flex-row font-bold bg-clip-text text-transparent text-[13px] xxs1:text-[13px] xxs:text-[9.5px] dxs:text-[9.5px] ss4:text-[9.5px] ss3:text-[9.5px] ss2:text-[9.5px] ss1:text-[9.5px] ss:text-[9.5px] sxs3:text-[9.5px] sxs2:text-[9.5px] sxs1:text-[9.5px] sxs:text-[9.5px] sxxs:text-[9.5px] mt-3">
              <h1 className="bg-gradient-to-r from-indigo-900 to-sky-400 font-extrabold font-fontUse text-transparent bg-clip-text text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl sxxs:text-lg">
                Mentors
              </h1>
              <button
                onClick={() => navigate("/view-mentors")}
                className="border border-violet-800 px-4 py-2 rounded-md text-violet-800 sxxs:px-2 sxxs:py-1 sxxs:text-xs sm:text-lg"
              >
                View More
              </button>
            </div>
            <div className="w-full md:w-full md:flex md:gap-4 sm:flex sm:gap-4">
              <CohortMentor
                allMentorData={allMentorData}
                noData={noData}
                cohortId={cohortData?.cohort_id}
              />
            </div>
            <div className="flex items-center justify-between mb-4  flex-row font-bold bg-clip-text text-transparent text-[13px] xxs1:text-[13px] xxs:text-[9.5px] dxs:text-[9.5px] ss4:text-[9.5px] ss3:text-[9.5px] ss2:text-[9.5px] ss1:text-[9.5px] ss:text-[9.5px] sxs3:text-[9.5px] sxs2:text-[9.5px] sxs1:text-[9.5px] sxs:text-[9.5px] sxxs:text-[9.5px] mt-3">
              <h1 className="bg-gradient-to-r from-indigo-900 to-sky-400 font-extrabold font-fontUse text-transparent bg-clip-text text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl sxxs:text-lg">
                Investors
              </h1>
              <button
                onClick={() => navigate("/view-investor")}
                className="border border-violet-800 px-4 py-2 rounded-md text-violet-800 sxxs:px-2 sxxs:py-1 sxxs:text-xs sm:text-lg"
              >
                View More
              </button>
            </div>

            <div className="flex max-md:flex-col -mx-4 mb-4 items-stretch fade-in">
              <div className="w-full px-4 md:flex md:gap-4 sm:flex sm:gap-4">
                <CohortInvestor
                  allInvestorData={allInvestorData}
                  noData={noData}
                  cohortId={cohortData?.cohort_id}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </section>
  );
}

export default DeleteFromCohort;

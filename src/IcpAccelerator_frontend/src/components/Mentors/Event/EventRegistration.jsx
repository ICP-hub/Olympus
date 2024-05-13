import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Principal } from "@dfinity/principal";
import NoDataCard from "../../Mentors/Event/MentorAssocReqNoDataCard";
import hover from "../../../../assets/images/1.png";
import FunctionalityModel from "../../../models/FunctionalityModel";
import { projectFilterSvg } from "../../Utils/Data/SvgData";
function EventRegistration() {
  const [modalOpen, setModalOpen] = useState(false);
  const [para, setPara] = useState("");
  const [action, setAction] = useState("");
  const [index, setIndex] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");
  const [data, setData] = useState([]);
  const headerData = [
    {
      id: "pending",
      label: "pending",
    },
    {
      id: "approved",
      label: "approved",
    },
    {
      id: "declined",
      label: "declined",
    },
  ];

    const rolesFilterArray = [
      {
        id: "from-project",
        label: "from project",
      },
      {
        id: "from-mentor",
        label: "from mentor",
      },
      {
        id: "from-investor",
        label: "from investor",
      },
    ];

  const actor = useSelector((currState) => currState.actors.actor);
  const principal = useSelector((currState) => currState.internet.principal);
  const [selectedStatus, setSelectedStatus] = useState("from-project");
  const getTabClassName = (tab) => {
    return `inline-block p-1 ${
      activeTab === tab
        ? "border-b-2 border-[#3505B2]"
        : "text-[#737373] border-transparent"
    } rounded-t-lg`;
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleOpenModal = (para, action, index) => {
    setPara(para);
    setAction(action);
    setIndex(index);
    setModalOpen(true);
    console.log("Modal open with", para, action);
  };
  const handleClick = async (index) => {
    setIsSubmitting(true);
    try {
      let enroller_principal = data?.[index]?.enroller_principal;
      let cohortId = data?.[index]?.cohort_details?.cohort_id;
      let cohort_creator_principal =
        data?.[index]?.cohort_details?.cohort_creator_principal;

      // console.log("Line 21 Action ====>>>>", action)
      // console.log("Line 23 Decision =====>>>>", decision)

      if (action === "Approve") {
        const result = await actor.approve_enrollment_request(
          cohortId,
          enroller_principal
        );
        console.log("result of approve_enrollment_request 80 ====>>>>>",result)
      } else {
        const result = await actor.reject_enrollment_request(
          cohort_creator_principal,
          enroller_principal
        );
        console.log("result of reject_enrollment_request 86 ====>>>>>",result)
      }
    } catch (error) {
      console.error("Failed to process the decision: ", error);
    } finally {
      setIsSubmitting(false);
      setModalOpen(false);
      // window.location.href = "/";
    }
  };
  const handleCloseModal = () => {
    setModalOpen(false);
  };
  // // // GET POST API HANDLERS WHERE MENTOR APPROCHES PROJECT // // //

  // GET API HANDLER TO GET THE PENDING REQUESTS DATA WHERE MENTOR APPROCHES PROJECT
  const fetchPendingCohortEnrollmentRequests = async () => {
    let mentor_principal = Principal.fromText(principal);
    console.log(mentor_principal);
    try {
      const result = await actor.get_pending_cohort_enrollment_requests(
        mentor_principal
      );
      console.log(
        `result-in-get_pending_cohort_enrollment_requests`,
        Principal
      );
      console.log(`result-in-get_pending_cohort_enrollment_requests`, result);
      setData(result);
    } catch (error) {
      console.log(`error-in-get_pending_cohort_enrollment_requests`, error);
      setData([]);
    }
  };

  // GET API HANDLER TO GET THE APPROVED REQUESTS DATA WHERE MENTOR APPROCHES PROJECT
  const fetchApprovedRequestFromMentorToProject = async () => {
    try {
      const result =
        await actor.get_all_requests_which_got_accepted_for_mentor();
      console.log(
        `result-in-get_all_requests_which_got_accepted_for_mentor`,
        result
      );
      setData(result);
    } catch (error) {
      console.log(
        `error-in-get_all_requests_which_got_accepted_for_mentor`,
        error
      );
      setData([]);
    }
  };

  // GET API HANDLER TO GET THE DECLINED REQUESTS DATA WHERE MENTOR APPROCHES PROJECT
  const fetchDeclinedRequestFromMentorToProject = async () => {
    try {
      const result =
        await actor.get_all_requests_which_got_declined_for_mentor();
      console.log(
        `result-in-get_all_requests_which_got_declined_for_mentor`,
        result
      );
      setData(result);
    } catch (error) {
      console.log(
        `error-in-get_all_requests_which_got_declined_for_mentor`,
        error
      );
      setData([]);
    }
  };

  useEffect(() => {
    setData([]);
    if (actor && principal && activeTab && selectedStatus) {
      switch (activeTab) {
        case "pending":
          fetchPendingCohortEnrollmentRequests(); /// change as needed
          break;
        case "approved":
          fetchApprovedRequestFromMentorToProject(); /// change as needed
          break;
        case "declined":
          fetchDeclinedRequestFromMentorToProject(); /// change as needed
          break;
      }
    }
  }, [actor, principal, activeTab, selectedStatus]);
  return (
    <div className="font-fontUse flex flex-col items-center w-full h-fit px-[5%] lg1:px-[4%] py-[4%] md:pt-0">
      <div className="mb-4 flex flex-row justify-between items-end w-full">
        <FunctionalityModel
          para={para}
          action={action}
          onModal={modalOpen}
          isSubmitting={isSubmitting}
          onClose={handleCloseModal}
          onClick={handleClick}
        />
        <div className="flex flex-row">
          <p className="text-lg font-semibold bg-gradient-to-r from-indigo-900 to-sky-400 inline-block text-transparent bg-clip-text">
            Cohort Registeration Requests
          </p>
        </div>
        <div className="text-sm text-center text-[#737373] mt-2">
          <ul className="flex flex-wrap -mb-px text-[10px] ss2:text-[10.5px] ss3:text-[11px]  cursor-pointer">
            {headerData.map((header, index) => (
              <li key={index} className="me-6 relative group">
                <button
                  className={getTabClassName(header?.id)}
                  onClick={() => {
                    setData([]);
                    handleTabClick(header?.id);
                  }}
                >
                  <div className="capitalize text-base">{header.label}</div>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div
          onClick={() => setIsPopupOpen(!isPopupOpen)}
          className="cursor-pointer gap-2 flex flex-row items-center"
        >
          <button className="border-2 border-blue-900 p-1 font-bold rounded-md text-blue-900 px-2 capitalize">
            {selectedStatus.replace(/-/g, " ")}
          </button>
          {projectFilterSvg}
        </div>
        {isPopupOpen && (
          <div className="absolute w-[250px] top-52 right-16 bg-white shadow-xl rounded-lg border border-gray-300 p-4 z-50">
            {rolesFilterArray.map((status, index) => {
              console.log("rolesFilterArray-status", status);
              return (
                <button
                  key={index}
                  onClick={() => {
                    setData([]);
                    setSelectedStatus(status?.id);
                    setIsPopupOpen(false);
                  }}
                  className={`${
                    selectedStatus === status?.id
                      ? "bg-blue-50 text-blue-700"
                      : ""
                  } block w-full text-left px-4 py-2 text-lg font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md transition-colors duration-150 ease-in-out capitalize`}
                >
                  {status?.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
      <div className="h-screen overflow-y-scroll scroll-smooth w-full">
        {console.log("data on 196 ====>>>", data)}
        {data && data.length > 0 ? (
          data.map((val, index) => {
            console.log("full-val on 199 ===>>>", val);

            let name = "";
            let tags = "";
            let description = "";
            let no_of_seats = "";
            let cohort_launch_date = "";
            let cohort_end_date = "";
            let deadline = "";
            let eligibility = "";
            let level_on_rubric = "";
            let accepted_at = "";
            let rejected_at = "";

            switch (activeTab) {
              case "pending":
                name = val?.cohort_details?.cohort?.title;
                tags = val?.cohort_details?.cohort?.tags;
                description = val?.cohort_details?.cohort?.description;
                no_of_seats = val?.cohort_details?.cohort?.no_of_seats;
                cohort_launch_date =
                  val?.cohort_details?.cohort?.cohort_launch_date;
                cohort_end_date = val?.cohort_details?.cohort?.cohort_end_date;
                deadline = val?.cohort_details?.cohort?.deadline;
                eligibility =
                  val?.cohort_details?.cohort?.criteria?.eligibility?.[0];
                level_on_rubric =
                  val?.cohort_details?.cohort?.criteria?.level_on_ ?? "";
                break;
              case "approved":
                name = val?.cohort_details?.cohort?.title;
                tags = val?.cohort_details?.cohort?.tags;
                description = val?.cohort_details?.cohort?.description;
                no_of_seats = val?.cohort_details?.cohort?.no_of_seats;
                cohort_launch_date =
                  val?.cohort_details?.cohort?.cohort_launch_date;
                cohort_end_date = val?.cohort_details?.cohort?.cohort_end_date;
                deadline = val?.cohort_details?.cohort?.deadline;
                eligibility =
                  val?.cohort_details?.cohort?.criteria?.eligibility?.[0];
                level_on_rubric =
                  val?.cohort_details?.cohort?.criteria?.level_on_ ?? "";
                accepted_at = val?.accepted_at ?? "";
                break;
              case "declined":
                name = val?.cohort_details?.cohort?.title;
                tags = val?.cohort_details?.cohort?.tags;
                description = val?.cohort_details?.cohort?.description;
                no_of_seats = val?.cohort_details?.cohort?.no_of_seats;
                cohort_launch_date =
                  val?.cohort_details?.cohort?.cohort_launch_date;
                cohort_end_date = val?.cohort_details?.cohort?.cohort_end_date;
                deadline = val?.cohort_details?.cohort?.deadline;
                eligibility =
                  val?.cohort_details?.cohort?.criteria?.eligibility?.[0];
                level_on_rubric =
                  val?.cohort_details?.cohort?.criteria?.level_on_ ?? "";
                rejected_at = val?.rejected_at ?? "";
                break;
            }

            return (
              <div
                className="p-4 border-2 bg-white rounded-lg mb-4"
                key={index}
              >
                <div className="flex">
                  <div className="flex flex-col">
                    <div className="w-12 h-12">
                      <img
                        src={hover}
                        alt="img"
                        className="object-cover rounded-full h-full w-full"
                      />
                    </div>
                  </div>
                  <div className="w-full">
                    <div className="flex flex-col w-full pl-4 ">
                      <div className="flex justify-between">
                        <p className="text-gray-500 font-bold">{name}</p>
                        <p className="text-gray-400 font-thin">
                          {cohort_launch_date}
                        </p>
                      </div>
                      <div className="min-h-4 line-clamp-3 text-gray-400">
                        <p>{description}</p>
                      </div>
                      {activeTab === "approved" &&
                      accepted_at &&
                      accepted_at.trim() !== "" ? (
                        <>
                          <div className="flex justify-between pt-2">
                            <p className="text-green-700">{"RESPONSE"}</p>
                            <p className="text-gray-400 font-thin">
                              {accepted_at}
                            </p>
                          </div>
                        </>
                      ) : (
                        ""
                      )}
                      {activeTab === "declined" &&
                      rejected_at &&
                      rejected_at.trim() !== "" ? (
                        <>
                          <div className="flex justify-between pt-2">
                            <p className="text-red-700">{"RESPONSE"}</p>
                            <p className="text-gray-400 font-thin">
                              {rejected_at}
                            </p>
                          </div>
                        </>
                      ) : (
                        ""
                      )}
                      <div className="flex justify-end pt-4">
                        <div className="flex gap-4">
                          {activeTab !== "pending" ? (
                            ""
                          ) : (
                            <>
                              <div>
                                <button
                                  onClick={() =>
                                    handleOpenModal(
                                      "Are you sure you want to reject request?",
                                      "Reject"
                                    )
                                  }
                                  className="capitalize border-2 font-semibold bg-red-700 border-red-700 text-white px-2 py-1 rounded-md  hover:text-red-900 hover:bg-white"
                                >
                                  Reject
                                </button>
                              </div>
                              <div>
                                <button
                                  onClick={() =>
                                    handleOpenModal(
                                      "Are you sure you want to approve request?",
                                      "Approve",
                                      index
                                    )
                                  }
                                  className="capitalize border-2 font-semibold bg-blue-900 border-blue-900 text-white px-2 py-1 rounded-md  hover:text-blue-900 hover:bg-white"
                                >
                                  Approve
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <>
            <NoDataCard />
          </>
        )}
      </div>
    </div>
  );
}

export default EventRegistration;

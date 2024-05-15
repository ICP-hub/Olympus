import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Principal } from "@dfinity/principal";
import NoDataCard from "../../Mentors/Event/MentorAssocReqNoDataCard";
import hover from "../../../../assets/images/1.png";
import FunctionalityModel from "../../../models/FunctionalityModel";
import { projectFilterSvg } from "../../Utils/Data/SvgData";
import toast from "react-hot-toast";
import { formatFullDateFromBigInt } from "../../Utils/formatter/formatDateFromBigInt";
import uint8ArrayToBase64 from "../../Utils/uint8ArrayToBase64";
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
      map: "product_data",
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

    console.log(
      "Line 79 enroller_principal =====>>>>",
      data?.[index]?.enroller_principal
    );
    console.log("Modal open with", para, action, index);
  };
  const handleClick = async () => {
    console.log(data);
    setIsSubmitting(true);
    let enroller_principal = data?.[index]?.enroller_principal;
    let cohortId = data?.[index]?.cohort_details?.cohort_id;
    let cohort_creator_principal =
      data?.[index]?.cohort_details?.cohort_creator_principal;
    try {
      console.log("Line 78 data ====>>>>", data);
      console.log("Line 78 Action ====>>>>", action);
      console.log("Line 79 enroller_principal =====>>>>", enroller_principal);
      console.log("Line 79 cohortId =====>>>>", cohortId);
      console.log(
        "Line 79 cohort_creator_principal =====>>>>",
        cohort_creator_principal
      );
      console.log("Line 79 index =====>>>>", index);

      if (action === "Approve") {
        const result = await actor.approve_enrollment_request(
          cohortId,
          enroller_principal
        );
        console.log(
          "result of approve_enrollment_request 80 ====>>>>>",
          result
        );
        toast.success(result);
      } else if (action === "Reject") {
        const result = await actor.reject_enrollment_request(
          cohort_creator_principal,
          enroller_principal
        );
        console.log("result of reject_enrollment_request 86 ====>>>>>", result);
        toast.success(result);
      } else {
        toast.error(result);
      }
    } catch (error) {
      console.error("Failed to process the decision: ", error);
    } finally {
      setIsSubmitting(false);
      setModalOpen(false);
      // window.location.reload();
    }
  };
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    const fetchRequests = async (type) => {
      let result = [];
      setIsSubmitting(true);

      try {
        switch (type) {
          case "pending":
            result = await actor.get_pending_cohort_enrollment_requests(
              Principal.fromText(principal)
            );
            break;
          case "approved":
            result = await actor.get_accepted_cohort_enrollment_requests(
              Principal.fromText(principal)
            );
            break;
          case "declined":
            result = await actor.get_rejected_cohort_enrollment_requests(
              Principal.fromText(principal)
            );
            break;
          default:
            result = [];
        }
        setData(result);
        setIsSubmitting(false);
      } catch (error) {
        console.error(`Error fetching ${type} requests:`, error);
        setData([]);
        setIsSubmitting(false);
      }
    };

    if (actor && principal && activeTab && selectedStatus) {
      fetchRequests(activeTab);
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
          data?.map((val, index) => {
            console.log("full-val on 199 ===>>>", val);

            let img = "";
            let name = "";
            let tags = "";
            let request_status = "";
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
                switch (selectedStatus) {
                  case "from-project":
                    request_status = val?.request_status;
                    val &&
                      val.enroller_data.project_data.map((projectData) => {
                        img = projectData?.profile?.user_data
                          ?.profile_picture?.[0]
                          ? uint8ArrayToBase64(
                              projectData?.profile?.user_data
                                ?.profile_picture?.[0]
                            )
                          : "";
                        name = projectData?.title;
                        tags = projectData?.tags;
                        description = projectData?.description;
                        no_of_seats = projectData?.no_of_seats;
                        cohort_launch_date = projectData?.cohort_launch_date;
                        cohort_end_date = projectData?.cohort_end_date;
                        deadline = projectData?.deadline;
                        eligibility = projectData?.criteria?.eligibility?.[0];
                        level_on_rubric =
                          projectData?.criteria?.level_on_ ?? "";
                      });
                    break;
                  case "from-mentor":
                    request_status = val?.request_status;
                    val &&
                      val.enroller_data.mentor_data.map((mentorData) => {
                        img = mentorData?.profile?.user_data
                          ?.profile_picture?.[0]
                          ? uint8ArrayToBase64(
                              mentorData?.profile?.user_data
                                ?.profile_picture?.[0]
                            )
                          : "";
                        name = mentorData?.profile?.user_data?.full_name;
                        description = mentorData?.profile?.user_data?.bio;
                        no_of_seats = mentorData?.profile?.no_of_seats;
                        cohort_launch_date =
                          mentorData?.profile?.cohort_launch_date;
                        cohort_end_date = mentorData?.profile?.cohort_end_date;
                        deadline = mentorData?.profile?.deadline;
                        eligibility =
                          mentorData?.profile?.criteria?.eligibility?.[0];
                        level_on_rubric =
                          mentorData?.profile?.criteria?.level_on_ ?? "";
                      });
                    break;
                  case "from-investor":
                    img = hover;
                    name = val?.enroller_data?.project_data?.title;
                    request_status = val?.request_status;
                    tags = val?.enroller_data?.project_data?.tags;
                    description = val?.enroller_data?.project_data?.description;
                    no_of_seats = val?.enroller_data?.project_data?.no_of_seats;
                    cohort_launch_date =
                      val?.enroller_data?.project_data?.cohort_launch_date;
                    cohort_end_date =
                      val?.enroller_data?.project_data?.cohort_end_date;
                    deadline = val?.enroller_data?.project_data?.deadline;
                    eligibility =
                      val?.enroller_data?.project_data?.criteria
                        ?.eligibility?.[0];
                    level_on_rubric =
                      val?.enroller_data?.project_data?.criteria?.level_on_ ??
                      "";
                    break;
                  default:
                    break;
                }
              case "approved":
                name = val?.enroller_data?.cohort?.title;
                request_status = val?.request_status;
                tags = val?.enroller_data?.cohort?.tags;
                description = val?.enroller_data?.cohort?.description;
                no_of_seats = val?.enroller_data?.cohort?.no_of_seats;
                cohort_launch_date =
                  val?.enroller_data?.cohort?.cohort_launch_date;
                cohort_end_date = val?.enroller_data?.cohort?.cohort_end_date;
                deadline = val?.enroller_data?.cohort?.deadline;
                eligibility =
                  val?.enroller_data?.cohort?.criteria?.eligibility?.[0];
                level_on_rubric =
                  val?.enroller_data?.cohort?.criteria?.level_on_ ?? "";
                accepted_at = val?.accepted_at
                  ? formatFullDateFromBigInt(val?.accepted_at)
                  : "";
                break;
              case "declined":
                name = val?.enroller_data?.cohort?.title;
                request_status = val?.request_status;
                tags = val?.enroller_data?.cohort?.tags;
                description = val?.enroller_data?.cohort?.description;
                no_of_seats = val?.enroller_data?.cohort?.no_of_seats;
                cohort_launch_date =
                  val?.enroller_data?.cohort?.cohort_launch_date;
                cohort_end_date = val?.enroller_data?.cohort?.cohort_end_date;
                deadline = val?.enroller_data?.cohort?.deadline;
                eligibility =
                  val?.enroller_data?.cohort?.criteria?.eligibility?.[0];
                level_on_rubric =
                  val?.enroller_data?.cohort?.criteria?.level_on_ ?? "";
                rejected_at = val?.rejected_at
                  ? formatFullDateFromBigInt(val?.rejected_at)
                  : "";
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
                        src={img}
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
                            <p className="text-green-700 capitalize">
                              {request_status || ""}
                            </p>
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
                            <p className="text-red-700 capitalize">
                              {request_status || ""}
                            </p>
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
                                      "Reject",
                                      index
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

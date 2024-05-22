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
import EventRequset from "./EventRequset";
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
  };
  const handleClick = async () => {
    setIsSubmitting(true);
    let enroller_principal = data?.[index]?.enroller_principal;
    let cohortId = data?.[index]?.cohort_details?.cohort_id;
    let cohort_creator_principal =
      data?.[index]?.cohort_details?.cohort_creator_principal;
    try {
      if (action === "Approve") {
        const result = await actor.approve_enrollment_request(
          cohortId,
          enroller_principal
        );
        toast.success(result);
        console.log("enroller_principal line 87 ===>>>> ", enroller_principal);
      } else if (action === "Reject") {
        const result = await actor.reject_enrollment_request(
          cohort_creator_principal,
          enroller_principal
        );
        toast.success(result);
      } else {
        toast.error(result);
      }
    } catch (error) {
      console.error("Failed to process the decision: ", error);
    } finally {
      setIsSubmitting(false);
      setModalOpen(false);
      window.location.reload();
    }
  };
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    let isMounted = true;
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
        if (isMounted) {
          console.log("data", result);
          setData(result);
          setIsSubmitting(false);
        }
      } catch (error) {
        console.error(`Error fetching ${type} requests:`, error);
        if (isMounted) {
          setData([]);
          setIsSubmitting(false);
        }
      }
    };

    if (actor && principal) {
      fetchRequests(activeTab);
    }

    return () => {
      isMounted = false;
    };
  }, [actor, principal, activeTab, selectedStatus]);

  console.log("selectedStatus", selectedStatus);

  function processData(val, type) {
    console.log(type);
    console.log("pval", val);
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
    let request = "";
    let role = "";
    let accepted_at = "";
    let rejected_at = "";
    let cohort_name = "";
    if (val?.request_status) {
      request_status = val?.request_status;
    }

    // Process only the data related to the selected status
    if (type === "from-project" && val?.enroller_data?.project_data) {
      val?.enroller_data?.project_data.forEach((projectData) => {
        console.log("pdata", projectData);
        img = projectData?.params?.user_data?.profile_picture?.[0]
          ? uint8ArrayToBase64(
              projectData?.params?.user_data?.profile_picture?.[0]
            )
          : "";
        name = projectData?.params.user_data.full_name;
        cohort_name = val?.cohort_details?.cohort?.title;
        description = projectData?.params?.user_data?.bio;
        role = val?.enroller_data?.project_data.length > 0 ? "Project" : "";
        request = formatFullDateFromBigInt(val?.sent_at);
        accepted_at = formatFullDateFromBigInt(val?.accepted_at);
        rejected_at = formatFullDateFromBigInt(val?.rejected_at);
      });
    } else if (type === "from-mentor" && val?.enroller_data?.mentor_data) {
      val?.enroller_data?.mentor_data.forEach((mentorData) => {
        img = mentorData?.profile?.user_data?.profile_picture?.[0]
          ? uint8ArrayToBase64(
              mentorData?.profile?.user_data?.profile_picture?.[0]
            )
          : "";
        name = mentorData?.profile.user_data.full_name;
        cohort_name = val?.cohort_details?.cohort?.title;
        description = mentorData?.profile?.user_data?.bio[0];
        role = val?.enroller_data?.mentor_data.length > 0 ? "Mentor" : "";
        request = formatFullDateFromBigInt(val?.sent_at);
        accepted_at = formatFullDateFromBigInt(val?.accepted_at);
        rejected_at = formatFullDateFromBigInt(val?.rejected_at);
      });
    } else if (type === "from-investor" && val?.enroller_data?.vc_data) {
      val?.enroller_data?.vc_data.forEach((vcData) => {
        console.log("vcData", vcData);
        img = vcData?.params?.user_data?.profile_picture?.[0]
          ? uint8ArrayToBase64(vcData?.params?.user_data?.profile_picture?.[0])
          : "";
        name = vcData?.params.user_data.full_name;
        cohort_name = val?.cohort_details?.cohort?.title;
        description = vcData?.params?.user_data?.bio;
        role = val?.enroller_data?.vc_data.length > 0 ? "Investor" : "";
        request = formatFullDateFromBigInt(val?.sent_at);
        accepted_at = formatFullDateFromBigInt(val?.accepted_at);
        rejected_at = formatFullDateFromBigInt(val?.rejected_at);
      });
    }

    return {
      img,
      name,
      tags,
      request,
      request_status,
      role,
      cohort_name,
      rejected_at,
      accepted_at,
      description,
      no_of_seats,
      cohort_launch_date,
      cohort_end_date,
      deadline,
      eligibility,
      level_on_rubric,
    };
  }

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
        {data && data.length > 0 ? (
          data.map((val, index) => {
            if (
              selectedStatus === "from-project" &&
              val?.enroller_data?.project_data &&
              val?.enroller_data?.project_data.length > 0
            ) {
              if (
                !val?.enroller_data?.project_data ||
                val?.enroller_data?.project_data.length === 0
              ) {
                return <NoDataCard />;
              }
              const {
                img,
                name,
                request,
                role,
                request_status,
                cohort_name,
                description,
                rejected_at,
                accepted_at,
              } = processData(val, selectedStatus);
              return (
                <EventRequset
                  index={index}
                  img={img}
                  name={name}
                  role={role}
                  request={request}
                  description={description}
                  cohort_name={cohort_name}
                  accepted_at={accepted_at}
                  request_status={request_status}
                  rejected_at={rejected_at}
                  activeTab={activeTab}
                  handleOpenModal={handleOpenModal}
                />
              );
            } else if (
              selectedStatus === "from-mentor" &&
              val?.enroller_data?.mentor_data &&
              val?.enroller_data?.mentor_data.length > 0
            ) {
              if (
                !val?.enroller_data?.mentor_data ||
                val?.enroller_data?.mentor_data.length === 0
              ) {
                return <NoDataCard />;
              }
              const {
                img,
                name,
                request,
                role,
                request_status,
                cohort_name,
                description,
                rejected_at,
                accepted_at,
              } = processData(val, selectedStatus);
              return (
                <EventRequset
                  index={index}
                  img={img}
                  name={name}
                  role={role}
                  request={request}
                  description={description}
                  cohort_name={cohort_name}
                  accepted_at={accepted_at}
                  request_status={request_status}
                  rejected_at={rejected_at}
                  activeTab={activeTab}
                  handleOpenModal={handleOpenModal}
                />
              );
            } else if (
              selectedStatus === "from-investor" &&
              val?.enroller_data?.vc_data &&
              val?.enroller_data?.vc_data.length > 0
            ) {
              if (
                !val?.enroller_data?.vc_data ||
                val?.enroller_data?.vc_data.length === 0
              ) {
                return <NoDataCard />;
              }
              const {
                img,
                name,
                request,
                role,
                request_status,
                cohort_name,
                description,
                rejected_at,
                accepted_at,
              } = processData(val, selectedStatus);
              return (
                <EventRequset
                  index={index}
                  img={img}
                  name={name}
                  role={role}
                  request={request}
                  description={description}
                  cohort_name={cohort_name}
                  accepted_at={accepted_at}
                  request_status={request_status}
                  rejected_at={rejected_at}
                  activeTab={activeTab}
                  handleOpenModal={handleOpenModal}
                />
              );
            }
            return null;
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

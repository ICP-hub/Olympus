import React, { useEffect, useState } from "react";
import { projectFilterSvg } from "../../Utils/Data/SvgData";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Principal } from "@dfinity/principal";
import uint8ArrayToBase64 from "../../Utils/uint8ArrayToBase64";
import { formatFullDateFromBigInt } from "../../Utils/formatter/formatDateFromBigInt";
import DeclineOfferModal from "../../../models/DeclineOfferModal";
import AcceptOfferModal from "../../../models/AcceptOfferModal";
import NoDataCard from "../../Mentors/Event/MentorAssocReqNoDataCard";
function EventRegistration() {
  const navigate = useNavigate();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");
  const [data, setData] = useState([]);
  const [noData, setNoData] = useState(false);
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

  //   const rolesFilterArray = [
  //     {
  //       id: "to-project",
  //       label: "to project",
  //     },
  //     {
  //       id: "from-project",
  //       label: "from project",
  //     },
  //   ];

  const actor = useSelector((currState) => currState.actors.actor);
  const principal = useSelector((currState) => currState.internet.principal);
  const [selectedStatus, setSelectedStatus] = useState("to-project");
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

  // // // GET POST API HANDLERS WHERE MENTOR APPROCHES PROJECT // // //

  // GET API HANDLER TO GET THE PENDING REQUESTS DATA WHERE MENTOR APPROCHES PROJECT
  const fetchPendingRequestFromMentorToProject = async () => {
    // let mentor_id = Principal.fromText(principal)
    try {
      const result = await actor.get_all_offers_which_are_pending_for_mentor();
      console.log(
        `result-in-get_all_offers_which_are_pending_for_mentor`,
        result
      );
      setData(result);
    } catch (error) {
      console.log(
        `error-in-get_all_offers_which_are_pending_for_mentor`,
        error
      );
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
          fetchPendingRequestFromMentorToProject(); /// change as needed
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
        {/* <div
          onClick={() => setIsPopupOpen(!isPopupOpen)}
          className="cursor-pointer gap-2 flex flex-row items-center"
        >
          <button className="border-2 border-blue-900 p-1 font-bold rounded-md text-blue-900 px-2 capitalize">
            {selectedStatus.replace(/-/g, " ")}
          </button>
          {projectFilterSvg}
        </div> */}
        {/* {isPopupOpen && (
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
        )} */}
      </div>
      <div className="h-screen overflow-y-scroll scroll-smooth w-full">
        {data && data.length > 0 ? (
          data.map((val, index) => {
            console.log("full-val", val);
            let img = "";
            let name = "";
            let date = "";
            let msg = "";
            let offer_id = "";
            let resp_msg = "";
            let accpt_date = "";
            let decln_date = "";
            let self_decln = "";

            switch (activeTab) {
              case "pending":
                img = val?.project_info?.project_logo
                  ? uint8ArrayToBase64(val?.project_info?.project_logo)
                  : "";
                name = val?.project_info?.project_name ?? "";
                date = val?.sent_at
                  ? formatFullDateFromBigInt(val?.sent_at)
                  : "";
                msg = val?.offer ?? "";
                offer_id = val?.offer_id ?? "";
                break;
              case "approved":
                img = val?.project_info?.project_logo
                  ? uint8ArrayToBase64(val?.project_info?.project_logo)
                  : "";
                name = val?.project_info?.project_name ?? "";
                date = val?.sent_at
                  ? formatFullDateFromBigInt(val?.sent_at)
                  : "";
                msg = val?.offer ?? "";
                offer_id = val?.offer_id ?? "";
                resp_msg = val?.response ?? "";
                accpt_date = val?.accepted_at
                  ? formatFullDateFromBigInt(val?.accepted_at)
                  : "";
                break;
              case "declined":
                img = val?.project_info?.project_logo
                  ? uint8ArrayToBase64(val?.project_info?.project_logo)
                  : "";
                name = val?.project_info?.project_name ?? "";
                date = val?.sent_at
                  ? formatFullDateFromBigInt(val?.sent_at)
                  : "";
                msg = val?.offer ?? "";
                offer_id = val?.offer_id ?? "";
                resp_msg = val?.response ?? "";
                decln_date = val?.declined_at
                  ? formatFullDateFromBigInt(val?.declined_at)
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
                        <p className="text-gray-400 font-thin">{date}</p>
                      </div>
                      <div className="min-h-4 line-clamp-3 text-gray-400">
                        <p>{msg}</p>
                      </div>
                      {activeTab === "approved" &&
                      resp_msg &&
                      resp_msg.trim() !== "" &&
                      accpt_date &&
                      accpt_date.trim() !== "" ? (
                        <>
                          <div className="flex justify-between pt-2">
                            <p className="text-green-700">{"RESPONSE"}</p>
                            <p className="text-gray-400 font-thin">
                              {accpt_date}
                            </p>
                          </div>
                          <div className="min-h-4 line-clamp-3 text-gray-400">
                            <p>{resp_msg}</p>
                          </div>
                        </>
                      ) : (
                        ""
                      )}
                      {activeTab === "declined" &&
                      resp_msg &&
                      resp_msg.trim() !== "" &&
                      decln_date &&
                      decln_date.trim() !== "" ? (
                        <>
                          <div className="flex justify-between pt-2">
                            <p className="text-red-700">{"RESPONSE"}</p>
                            <p className="text-gray-400 font-thin">
                              {decln_date}
                            </p>
                          </div>
                          <div className="min-h-4 line-clamp-3 text-gray-400">
                            <p>{resp_msg}</p>
                          </div>
                        </>
                      ) : (
                        ""
                      )}
                      {activeTab === "self-reject" &&
                      self_decln &&
                      self_decln.trim() !== "" ? (
                        <>
                          <div className="flex justify-between pt-2">
                            <p className="text-blue-700 uppercase">
                              self reject
                            </p>
                            <p className="text-gray-400 font-thin">
                              {self_decln}
                            </p>
                          </div>
                        </>
                      ) : (
                        ""
                      )}
                      <div className="flex justify-end pt-4">
                        <div className="flex gap-4">
                          <div>
                            <button
                              onClick={() =>
                                navigate(viewProjectProfileHandler(val))
                              }
                              className="capitalize border-2 font-semibold bg-white border-blue-900 text-blue-900 px-2 py-1 rounded-md  hover:text-white hover:bg-blue-900"
                            >
                              view project
                            </button>
                          </div>
                          {activeTab !== "pending" ? (
                            ""
                          ) : selectedStatus.startsWith("to-") ? (
                            <div>
                              <button
                                onClick={() => handleSelfReject(offer_id)}
                                className="capitalize border-2 font-semibold bg-blue-900 border-blue-900 text-white px-2 py-1 rounded-md  hover:text-blue-900 hover:bg-white"
                              >
                                self decline
                              </button>
                            </div>
                          ) : (
                            <>
                              <div>
                                <button
                                  onClick={() =>
                                    handleDeclineModalOpenHandler(offer_id)
                                  }
                                  className="capitalize border-2 font-semibold bg-red-700 border-red-700 text-white px-2 py-1 rounded-md  hover:text-red-900 hover:bg-white"
                                >
                                  reject
                                </button>
                              </div>
                              <div>
                                <button
                                  onClick={() =>
                                    handleAcceptModalOpenHandler(offer_id)
                                  }
                                  className="capitalize border-2 font-semibold bg-blue-900 border-blue-900 text-white px-2 py-1 rounded-md  hover:text-blue-900 hover:bg-white"
                                >
                                  approve
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

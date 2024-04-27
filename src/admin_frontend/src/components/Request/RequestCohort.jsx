import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { projectFilterSvg } from "../Utils/AdminData/SvgData";
import toast, { Toaster } from "react-hot-toast";
import uint8ArrayToBase64 from "../../../../IcpAccelerator_frontend/src/components/Utils/uint8ArrayToBase64";
import { Principal } from "@dfinity/principal";
import NoDataCard from "../../../../IcpAccelerator_frontend/src/components/Mentors/Event/NoDataCard";

const RequestCohort = () => {
  const actor = useSelector((currState) => currState.actors.actor);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Pending");
  const [requestedData, setRequestedData] = useState([]);

  const fetchData = async () => {
    try {
      const result = await actor.get_pending_cohort_requests_for_admin();
      const result1 =
        await actor.get_accepted_cohort_creation_request_for_admin();
      const result2 =
        await actor.get_declined_cohort_creation_request_for_admin();

      console.log(
        "result get_pending_cohort_requests_for_admin ====>>>> ",
        result
      );
      console.log(
        "result get_accepted_cohort_creation_request_for_admin====>>>> ",
        result1
      );
      console.log(
        "result get_declined_cohort_creation_request_for_admin ====>>>> ",
        result2
      );

      // Handle your data here
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle errors here
    }
  };
  const [noData, setNoData] = useState(null);

  const fetchCohortRequests = async (status) => {
    if (!actor) {
      console.log("Actor not found");
      return null;
    }
    setSelectedOption(status);
    let result;
    switch (status) {
      case "Pending":
        result = await actor.get_pending_cohort_requests_for_admin();
        break;
      case "Accepted":
        result = await actor.get_accepted_cohort_creation_request_for_admin();
        break;
      case "Declined":
        result = await actor.get_declined_cohort_creation_request_for_admin();
        break;
      default:
        console.log("Unknown status");
        toast.error("Unknown status");
        return;
    }
    console.log(result);
    console.log(status);
    if (result && result.length > 0) {
      setNoData(false);
      setRequestedData(result);
      setIsPopupOpen(false);
    } else {
      setNoData(true);
      setRequestedData([]);
      setIsPopupOpen(false);
      throw new Error("Invalid response format");
    }
    // .catch((error) => {
    //   setNoData(true);
    //   setRequestedData([]);
    //   setIsPopupOpen(false);
    //   console.error("Error fetching document requests:", error);
    // });
  };

  useEffect(() => {
    fetchCohortRequests(selectedOption);
    fetchData();
  }, [actor, selectedOption]);

  const approveAndRejectCohort = async (value, cohortId) => {
    if (!actor) {
      console.log("Actor not found");
      return null;
    }
    try {
      let result;
      switch (value) {
        case "Approve":
          result = await actor.accept_cohort_creation_request(cohortId);
          break;
        case "Decline":
          result = await actor.decline_cohort_creation_request(cohortId);
          break;
        default:
          console.log("Unknown action");
          return;
      }

      if (
        result &&
        result.includes(
          `You have accepted the cohort creation with cohort id: ${cohortId}`
        )
      ) {
        // Assuming result contains some success indication
        console.log(result);
        toast.success(`Request ${value.toLowerCase()}ed successfully.`);
      } else {
        toast.error(`Failed to ${value.toLowerCase()} the request.`);
      }
    } catch (error) {
      console.error("Error processing document request action:", error);
      toast.error("An error occurred during processing.");
    }
  };

  console.log(noData);
  return (
    <>
      <div className="px-[4%] py-[4%] w-full bg-gray-100 h-screen overflow-y-scroll">
        <div className="flex items-center justify-between mb-8">
          {selectedOption && (
            <div className="left-4 lg:left-auto bg-gradient-to-r from-purple-900 to-blue-500 text-transparent bg-clip-text text-2xl font-extrabold">
              {selectedOption}
            </div>
          )}

          <div className="flex justify-end gap-4 relative ">
            <div
              className="cursor-pointer"
              onClick={() => setIsPopupOpen(true)}
            >
              {projectFilterSvg}

              {isPopupOpen && (
                <div className="absolute w-[250px] top-full right-1 bg-white shadow-md rounded-lg border border-gray-200 p-3 z-10">
                  <ul className="flex flex-col">
                    <li>
                      <button
                        onClick={() => fetchCohortRequests("Pending")}
                        className="px-4 font-bold py-[18px] focus:outline-none text-xl flex justify-start"
                      >
                        Pending
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => fetchCohortRequests("Accepted")}
                        className="border-[#9C9C9C] py-[18px] w-[230px] font-bold px-4 focus:outline-none text-xl flex justify-start"
                      >
                        Accepted
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => fetchCohortRequests("Declined")}
                        className="border-[#9C9C9C] py-[18px] w-[230px] px-4 font-bold focus:outline-none text-xl flex justify-start"
                      >
                        Declined
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
        {noData ? (
          <NoDataCard />
        ) : (
          requestedData &&
          requestedData.map((data, index) => {
            const request = data?.cohort_details;
            if (!request) return null;
            const image = uint8ArrayToBase64(request?.cohort_creator?._arr);
            const name = request?.cohort?.title;
            const tags = request?.cohort?.tags;
            const description = request?.cohort?.description;
            const no_of_seats = request?.cohort?.no_of_seats;
            const cohort_launch_date = request?.cohort?.cohort_launch_date;
            const cohort_end_date = request?.cohort?.cohort_end_date;
            const eligibility = request?.cohort?.criteria?.eligibility?.[0];
            const level_on_rubric = request?.cohort?.criteria?.level_on_rubric;
            // const principal = request?.sender.toText();
            const status = data?.request_status;
            const cohortId = request?.cohort_id;
            return (
              <div
                className="flex w-auto items-center flex-wrap justify-between bg-gray-200 rounded-lg  text-lg p-4 my-4"
                key={index}
              >
                <div className="flex items-center">
                  <img
                    src={image}
                    alt="Mentor"
                    className="w-6 h-6 lg:w-12 lg:h-12 object-cover rounded-full mb-4 lg:mb-0 border-black border-2 p-1"
                  />
                  <p className="font-extrabold ml-2">{name}</p>
                  <p
                    className="line-clamp-1 w-48 font-fontUse text-base ml-12
                  "
                  >
                    {description}
                  </p>
                </div>

                <div className="flex flex-wrap md:flex-nowrap">
                  <button className="px-4 py-1 bg-[#3505B2] text-white font-bold rounded-full uppercase text-base">
                    {status}
                  </button>
                  {status === "approved" || status === "declined" ? (
                    ""
                  ) : (
                    <>
                      <button
                        className="px-4 py-1 bg-white text-blue-800 font-bold rounded-lg border-2 border-blue-800 ml-12"
                        onClick={() =>
                          approveAndRejectCohort("Decline", cohortId)
                        }
                      >
                        Reject
                      </button>
                      <button
                        className="px-4 py-1 bg-[#3505B2] text-white font-bold rounded-lg ml-3"
                        onClick={() =>
                          approveAndRejectCohort("Approve", cohortId)
                        }
                      >
                        Accept
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <Toaster />
    </>
  );
};

export default RequestCohort;

import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { Principal } from "@dfinity/principal";
import NoDataCard from "../../../../../IcpAccelerator_frontend/src/components/Mentors/Event/NoDataCard";
import NoData from "../../../../../IcpAccelerator_frontend/assets/images/NoData.png";
import CohortDeleteCard from "./CohortDeleteCard";

const DeleteCohort = () => {
  const actor = useSelector((currState) => currState.actors.actor);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Delete");
  const [requestedData, setRequestedData] = useState([]);

  const [noData, setNoData] = useState(null);

  const fetchCohortRequests = async (status) => {
    if (!actor) {
      console.log("Actor not found");
      return null;
    }
    // setSelectedOption(status);
    let result;
    switch (status) {
      case "Delete":
        result = await actor.get_all_cohorts();
        break;
      //   case "Accepted":
      //     result = await actor.get_accepted_cohort_creation_request_for_admin();
      //     break;
      //   case "Declined":
      //     result = await actor.get_declined_cohort_creation_request_for_admin();
      //     break;
      //   default:
      //     console.log("Unknown status");
      //     toast.error("Unknown status");
      //     return;
    }
    console.log(result);
    console.log(status);
    if (result && result.length > 0) {
      console.log("Result ===>>", result);
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
    // fetchData();
  }, [actor, selectedOption]);

  const deleteCohort = async (value, cohortId) => {
    if (!actor) {
      console.log("Actor not found");
      return null;
    }
    try {
      let result;
      switch (value) {
        case "Delete":
          result = await actor.accept_cohort_creation_request(cohortId);
          break;
        default:
          console.log("Unknown action");
          return;
      }
      console.log(result);
      if (
        result &&
        result.includes(
          `Cohort request with id: ${cohortId} has been accepted.`
        )
      ) {
        // Assuming result contains some success indication

        toast.success(`Request ${value.toLowerCase()}d successfully.`);
      } else if (
        result &&
        result.includes(
          `You have declined the cohort creation request: ${cohortId}`
        )
      ) {
        toast.success(`Request ${value.toLowerCase()}d successfully.`);
        window.location.href = "/";
      } else {
        toast.error(`Failed to ${value.toLowerCase()} the request.`);
        window.location.href = "/";
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

          {/*    <div className="flex justify-end gap-4 relative ">
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
          </div>*/}
        </div>
        {noData ? (
          <NoDataCard image={NoData} desc={"No Cohorts"} />
        ) : (
          requestedData &&
          requestedData.map((data, index) => {
            return (
              <div key={index}>
                <CohortDeleteCard data={data} deleteCohort={deleteCohort} />
              </div>
            );
          })
        )}
      </div>

      <Toaster />
    </>
  );
};

export default DeleteCohort;
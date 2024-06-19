import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { projectFilterSvg } from "../Utils/AdminData/SvgData";
import toast, { Toaster } from "react-hot-toast";
import uint8ArrayToBase64 from "../../../../IcpAccelerator_frontend/src/components/Utils/uint8ArrayToBase64";
import { Principal } from "@dfinity/principal";
import NoDataCard from "../../../../IcpAccelerator_frontend/src/components/Mentors/Event/NoDataCard";
import EventCard from "../../../../IcpAccelerator_frontend/src/components/Mentors/Event/EventCard";
import NoData from "../../../../IcpAccelerator_frontend/assets/images/NoData.png";

const RequestCohort = () => {
  const actor = useSelector((currState) => currState.actors.actor);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Pending");
  const [requestedData, setRequestedData] = useState([]);

  const [filter, setFilter] = useState("");
  // const fetchData = async () => {
  //   try {
  //     const result = await actor.get_pending_cohort_requests_for_admin();
  //     const result1 =
  //       await actor.get_accepted_cohort_creation_request_for_admin();
  //     const result2 =
  //       await actor.get_declined_cohort_creation_request_for_admin();

  //     console.log(
  //       "result get_pending_cohort_requests_for_admin ====>>>> ",
  //       result
  //     );
  //     console.log(
  //       "result get_accepted_cohort_creation_request_for_admin====>>>> ",
  //       result1
  //     );
  //     console.log(
  //       "result get_declined_cohort_creation_request_for_admin ====>>>> ",
  //       result2
  //     );

  //     // Handle your data here
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //     // Handle errors here
  //   }
  // };
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
    // fetchData();
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
      console.log(result);
      if (
        result &&
        result.includes(
          `Cohort request with id: ${cohortId} has been accepted.`
        )
      ) {
        // Assuming result contains some success indication

        toast.success(`Request ${value.toLowerCase()}d successfully.`);
        setTimeout(() => {
          window.location.href = "/";
        }, 500);
      } else if (
        result &&
        result.includes(
          `You have declined the cohort creation request: ${cohortId}`
        )
      ) {
        toast.success(`Request ${value.toLowerCase()}d successfully.`);
        setTimeout(() => {
          window.location.href = "/";
        }, 500);
      } else {
        toast.error(`Failed to ${value.toLowerCase()} the request.`);
        // setTimeout(() => {
        //   window.location.href = "/";
        // }, 500);
      }
    } catch (error) {
      console.error("Error processing document request action:", error);
      toast.error("An error occurred during processing.");
    }
  };
  const filteredData = useMemo(
    () =>
      requestedData?.filter(
        (user) =>
          user?.cohort_details?.cohort?.title
            ?.toLowerCase()
            .includes(filter.toLowerCase()) ||
          user?.cohort_details?.cohort?.country
            ?.toLowerCase()
            .includes(filter.toLowerCase())
      ),
    [filter, requestedData]
  );
  // console.log(filteredData);
  // console.log(requestedData);
  return (
    <>
      <div className="px-[4%] py-[4%] w-full bg-gray-100 h-screen overflow-y-scroll">
        <div className="items-center mb-6">
          {/* <h1 className="text-3xl font-bold bg-gradient-to-r from-black to-gray-800 text-transparent bg-clip-text">
            Cohort requests
          </h1> */}
          <div className="flex justify-end mb-4">
            <div className="relative flex items-center max-w-xs bg-white rounded-xl">
              <input
                type="text"
                value={filter}
                onChange={(e) => {
                  setFilter(e.target.value);
                }}
                className="form-input rounded-xl px-4 py-2 bg-white text-gray-600 placeholder-gray-600 placeholder-ml-4 max-w-md"
                placeholder="Search..."
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className="w-5 h-5 absolute right-2 text-gray-600"
              >
                <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
              </svg>
            </div>
          </div>
        </div>
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
          <NoDataCard image={NoData} desc={"No Cohorts"} />
        ) : (
          filteredData &&
          filteredData.map((data, index) => {
            return (
              <div key={index}>
                <EventCard
                  data={data}
                  approveAndRejectCohort={approveAndRejectCohort}
                />
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

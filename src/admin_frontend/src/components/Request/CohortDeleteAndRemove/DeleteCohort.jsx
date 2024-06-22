import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { Principal } from "@dfinity/principal";
import NoDataCard from "../../../../../IcpAccelerator_frontend/src/components/Mentors/Event/NoDataCard";
import NoData from "../../../../../IcpAccelerator_frontend/assets/images/NoData.png";
import CohortDeleteCard from "./CohortDeleteCard";
import { AdminDashboardCohortSkeleton } from "../../Adminskeleton/AdminDashboardCohortskeleton";
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const DeleteCohort = () => {
  const actor = useSelector((currState) => currState.actors.actor);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Delete");
  const [requestedData, setRequestedData] = useState([]);

  const [noData, setNoData] = useState(false);
  const [isloading, setloading] = useState(true);
  const [countData, setCountData] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const fetchCohortRequests = async (status, page) => {
    setloading(true);
    await delay(500);
    if (!actor) {
      console.log("Actor not found");
      return null;
    }
    // setSelectedOption(status);
    let result;
    switch (status) {
      case "Delete":
        result = await actor.get_all_cohorts({
          page_size: itemsPerPage,
          page,
        });
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
    if (result && result?.data?.length >= 0) {
      console.log("Result ===>>", result);
      setNoData(false);
      setRequestedData(result.data);
      setIsPopupOpen(false);
      setCountData(result.total_count);
    } else {
      setNoData(true);
      setRequestedData([]);
      setIsPopupOpen(false);
      setCountData("");
    }
    setloading(false);

    // .catch((error) => {
    //   setNoData(true);
    //   setRequestedData([]);
    //   setIsPopupOpen(false);
    //   console.error("Error fetching document requests:", error);
    // });
  };

  useEffect(() => {
    fetchCohortRequests(selectedOption, currentPage);
    // fetchData();
  }, [actor, selectedOption, currentPage]);

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
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handlePrevious = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setCurrentPage((prev) =>
      prev < Math.ceil(Number(countData) / itemsPerPage) ? prev + 1 : prev
    );
  };
  const [maxPageNumbers, setMaxPageNumbers] = useState(10);

  useEffect(() => {
    const updateMaxPageNumbers = () => {
      if (window.innerWidth <= 430) {
        setMaxPageNumbers(1); // For mobile view
      } else if (window.innerWidth <= 530) {
        setMaxPageNumbers(3); // For tablet view
      } else if (window.innerWidth <= 640) {
        setMaxPageNumbers(5); // For tablet view
      } else if (window.innerWidth <= 810) {
        setMaxPageNumbers(7); // For tablet view
      } else {
        setMaxPageNumbers(10); // For desktop view
      }
    };

    updateMaxPageNumbers(); // Set initial value
    window.addEventListener("resize", updateMaxPageNumbers); // Update on resize

    return () => window.removeEventListener("resize", updateMaxPageNumbers);
  }, []);
  // Logic to limit the displayed page numbers to 10 at a time
  const renderPaginationNumbers = () => {
    const totalPages = Math.ceil(Number(countData) / itemsPerPage);
    // const maxPageNumbers = 10;
    const startPage =
      Math.floor((currentPage - 1) / maxPageNumbers) * maxPageNumbers + 1;
    const endPage = Math.min(startPage + maxPageNumbers - 1, totalPages);

    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => paginate(i)}
          className={`relative h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-full text-center align-middle font-sans text-xs font-medium uppercase text-gray-900 transition-all ${
            currentPage === i
              ? "bg-gray-900 text-white"
              : "hover:bg-gray-900/10 active:bg-gray-900/20"
          }`}
          type="button"
        >
          <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
            {i}
          </span>
        </button>
      );
    }
    return pageNumbers;
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
        {isloading ? (
          <AdminDashboardCohortSkeleton />
        ) : noData ? (
          <NoDataCard image={NoData} desc={"No Cohorts"} />
        ) : (
          <>
            {requestedData &&
              requestedData.map((data, index) => {
                return (
                  <div key={index}>
                    <CohortDeleteCard data={data} deleteCohort={deleteCohort} />
                  </div>
                );
              })}
            <div className="flex flex-row  w-full gap-4 justify-center">
              {Number(countData) > 0 && (
                <div className="flex items-center justify-center">
                  <button
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                    className="flex items-center gap-2 px-6 py-3 font-sans text-xs font-bold text-center text-gray-900 uppercase align-middle transition-all rounded-full select-none hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                    type="button"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      aria-hidden="true"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                      ></path>
                    </svg>
                    Previous
                  </button>
                  {renderPaginationNumbers()}
                  <button
                    onClick={handleNext}
                    disabled={
                      currentPage ===
                      Math.ceil(Number(countData) / itemsPerPage)
                    }
                    className="flex items-center gap-2 px-6 py-3 font-sans text-xs font-bold text-center text-gray-900 uppercase align-middle transition-all rounded-full select-none hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                    type="button"
                  >
                    Next
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      aria-hidden="true"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                      ></path>
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <Toaster />
    </>
  );
};

export default DeleteCohort;

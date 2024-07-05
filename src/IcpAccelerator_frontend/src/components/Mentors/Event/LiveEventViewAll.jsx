import React, { useState, useEffect } from "react";
import { IcpAccelerator_backend } from "../../../../../declarations/IcpAccelerator_backend/index";
import { useSelector } from "react-redux";
import NoDataCard from "./NoDataCard";
import SecondEventCard from "./SecondEventCard";
import NoData from "../../../../assets/images/file_not_found.png";
import OngoingAcceleratorSkeleton from "../../Dashboard/Skeleton/OngoingAcceleratorskeleton";

const LiveEventViewAll = () => {
  const actor = useSelector((currState) => currState.actors.actor);
  const [noData, setNoData] = useState(null);
  const [allLiveEventsData, setAllLiveEventsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [countData, setCountData] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("");
  const itemsPerPage = 12;

  console.log('noData',noData)
  const getAllLiveEvents = async (caller, page) => {
    setIsLoading(true);
    await caller
      .get_all_cohorts({
        page_size: itemsPerPage,
        page,
      })
      .then((result) => {
        console.log("cohort result", result);
        if (result && result?.data?.length > 0) {
          setNoData(false);
          setIsLoading(false);
          setAllLiveEventsData(result.data);
          setCountData(result.total_count);
        } else {
          setNoData(true);
          setIsLoading(false);
          setAllLiveEventsData([]);
          setCountData(0);
        }
      })
      .catch((error) => {
        setNoData(true);
        setIsLoading(false);
        setAllLiveEventsData([]);
        setCountData("");
        console.log("error-in-get-all-cohort", error);
      });
  };

  useEffect(() => {
    if (actor) {
      getAllLiveEvents(actor, currentPage);
    } else {
      getAllLiveEvents(IcpAccelerator_backend);
    }
  }, [actor, currentPage]);


  const filteredEvents = allLiveEventsData.filter((val) => {
    const launchDate = new Date(val?.cohort?.cohort_launch_date);
    const today = new Date();
    return launchDate <= today.setHours(0, 0, 0, 0);
  });
  const filteredInvestors = React.useMemo(() => {
    return filteredEvents?.filter((user) => {
      const fullName = user?.cohort?.title?.toLowerCase() || "";
      return fullName.includes(filter?.toLowerCase());
    });
  }, [filter, filteredEvents]);

  useEffect(() => {
    setCountData(filteredInvestors.length);
  }, [filteredInvestors]);

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
  return (
    <div className="container mx-auto min-h-screen">
      <div className="px-[4%] pb-[4%] pt-[1%]">
        <div className="flex items-center justify-between sm:flex-col sxxs:flex-col md:flex-row mb-8">
          <div
            className="w-full bg-gradient-to-r from-purple-900 to-blue-500 text-transparent bg-clip-text text-3xl font-extrabold py-4 
       font-fontUse"
          >
          All Ongoing Cohorts
          </div>

          <div className="relative flex items-center md:max-w-xs bg-white rounded-xl sxxs:w-full">
            <input
              type="text"
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="form-input rounded-xl px-4 py-2 bg-white text-gray-600 placeholder-gray-600 placeholder-ml-4 max-w-md"
              placeholder="Search Cohort..."
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

        <div className=" mb-4 items-start min-h-screen">
          <>
            {isLoading ? (
              Array(itemsPerPage)
                .fill(0)
                .map((_, index) => (
                  <div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 flex-wrap w-full gap-6"
                    key={index}
                  >
                    <OngoingAcceleratorSkeleton />
                  </div>
                ))
            ) : noData ? (
              <NoDataCard
                image={NoData}
                desc={"There is no ongoing accelerator"}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 flex-wrap w-full gap-6">
                {filteredInvestors &&
                  filteredInvestors?.map((val, index) => {
                    return (
                      <div key={index} className="w-min-w-[33%] sm:w-full ">
                        <SecondEventCard data={val} register={true} />
                      </div>
                    );
                  })}
              </div>
            )}
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
        </div>
      </div>
    </div>
  );
};

export default LiveEventViewAll;

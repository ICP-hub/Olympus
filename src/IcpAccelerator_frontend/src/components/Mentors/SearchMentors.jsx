import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import uint8ArrayToBase64 from "../Utils/uint8ArrayToBase64";
import { IcpAccelerator_backend } from "../../../../declarations/IcpAccelerator_backend/index";
import NoDataCard from "./Event/NoDataCard";
import MentorCard from "./MentorCard";
import { MentorlistSkeleton } from "../Dashboard/Skeleton/Mentorlistskeleton";

function SearchMentors() {
  const navigate = useNavigate();
  const [allMentorData, setAllMentorData] = useState([]);
  const [countData, setCountData] = useState(0);
  const [noData, setNoData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 12;
  const actor = useSelector((currState) => currState.actors.actor);

  const getAllMentors = async (caller, page) => {
    console.log("Fetching data for page:", page);
    setIsLoading(true);
    await caller
      .get_all_mentors_with_pagination({
        page_size: itemsPerPage,
        page,
      })
      .then((result) => {
        console.log("result-in-get-all-mentors", result);
        if (result.data.length > 0) {
          setAllMentorData(result.data);
          setCountData(result.count);
          setNoData(false);
          setIsLoading(false);
        } else {
          setAllMentorData([]);
          setCountData(0);
          setNoData(true);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        setAllMentorData([]);
        setCountData(0);
        setNoData(true);
        setIsLoading(false);
        console.log("error-in-get-all-mentors", error);
      });
  };

  useEffect(() => {
    if (actor) {
      getAllMentors(actor, currentPage);
    } else {
      getAllMentors(IcpAccelerator_backend, currentPage);
    }
  }, [actor, currentPage]);

  const filteredMentors = React.useMemo(() => {
    return allMentorData.filter((user) => {
      const fullName =
        user[1]?.mentor_profile?.profile?.user_data?.full_name?.toLowerCase() ||
        "";
      const areaOfInterest =
        user[1]?.mentor_profile?.profile?.user_data?.area_of_interest?.toLowerCase() ||
        "";
      const categoryOfMentoring =
        user[1]?.mentor_profile?.profile?.category_of_mentoring_service?.toLowerCase() ||
        "";
      return (
        fullName.includes(filter.toLowerCase()) ||
        areaOfInterest.includes(filter.toLowerCase()) ||
        categoryOfMentoring.includes(filter.toLowerCase())
      );
    });
  }, [filter, allMentorData]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleNext = () => {
    setCurrentPage((prev) => {
      const nextPage = prev + 1;
      console.log("Navigating to page:", nextPage);
      return nextPage <= Math.ceil(Number(countData) / itemsPerPage)
        ? nextPage
        : prev;
    });
  };

  const handlePrevious = () => {
    setCurrentPage((prev) => {
      const prevPage = prev > 1 ? prev - 1 : prev;
      console.log("Navigating to page:", prevPage);
      return prevPage;
    });
  };

  return (
    <div className="container mx-auto min-h-screen">
      <div className="px-[4%] pb-[4%] pt-[1%]">
        <div className="flex items-center justify-between sm:flex-col sxxs:flex-col md:flex-row mb-8">
          <div
            className="w-full bg-gradient-to-r from-purple-900 to-blue-500 text-transparent bg-clip-text text-3xl font-extrabold py-4 
       font-fontUse"
          >
            Our Mentors
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
              placeholder="Search Investor..."
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
        {isLoading ? (
          Array(1)
            .fill(0)
            .map((_, index) => <MentorlistSkeleton key={index} />)
        ) : noData ? (
          <NoDataCard />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 mb-8 gap-8 items-center flex-wrap ">
              {filteredMentors.map((mentor, index) => {
                let id = mentor[0] ? mentor[0].toText() : "";
                let img = uint8ArrayToBase64(
                  mentor[1]?.mentor_profile?.profile?.user_data
                    ?.profile_picture[0]
                );
                let name =
                  mentor[1]?.mentor_profile?.profile?.user_data?.full_name;
                let bio = mentor[1]?.mentor_profile?.profile?.user_data?.bio[0];
                let skills =
                  mentor[1]?.mentor_profile?.profile?.user_data
                    ?.area_of_interest;
                let role = "Mentor";
                let category_of_mentoring_service =
                  mentor[1]?.mentor_profile?.profile
                    ?.category_of_mentoring_service;
                return (
                  <div
                    key={index}
                    className="bg-white  hover:scale-105 w-full rounded-lg mb-5 md:mb-0 p-6"
                  >
                    <div className="justify-center flex items-center">
                      <div
                        className="size-48  rounded-full bg-no-repeat bg-center bg-cover relative p-1 bg-blend-overlay border-2 border-gray-300"
                        style={{
                          backgroundImage: `url(${img}), linear-gradient(168deg, rgba(255, 255, 255, 0.25) -0.86%, rgba(255, 255, 255, 0) 103.57%)`,
                          backdropFilter: "blur(20px)",
                        }}
                      >
                        <img
                          className="object-cover size-48 max-h-44 rounded-full"
                          src={img}
                          alt=""
                        />
                      </div>
                    </div>
                    <div className="text-black text-start">
                      <div className="text-start my-3">
                        <span className="font-semibold text-lg truncate">
                          {name}
                        </span>
                        <span className="block text-gray-500 truncate">
                          {category_of_mentoring_service}
                        </span>
                      </div>
                      <div>
                        <div className="flex overflow-x-auto gap-2 pb-4 max-md:justify-center">
                          {skills?.split(",").map((item, index) => {
                            return (
                              <span
                                key={index}
                                className="bg-[#E7E7E8] rounded-full text-gray-600 text-xs font-bold px-3 py-2 leading-none flex items-center mt-2"
                              >
                                {item.trim()}
                              </span>
                            );
                          })}
                        </div>
                        <button
                          onClick={() =>
                            id ? navigate(`/view-mentor-details/${id}`) : ""
                          }
                          className="mt-4 text-white px-4 py-1 rounded-lg uppercase w-full text-center border border-gray-300 font-bold bg-[#3505B2] transition-colors duration-200 ease-in-out"
                        >
                          View Profile
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex flex-row  w-full gap-4 justify-center">
              {Number(countData) > 0 && (
                <div className="flex items-center gap-4 justify-center">
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
                  {Array.from(
                    {
                      length: Math.ceil(Number(countData) / itemsPerPage),
                    },
                    (_, i) => i + 1
                  ).map((number) => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`relative h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-full text-center align-middle font-sans text-xs font-medium uppercase text-gray-900 transition-all ${
                        currentPage === number
                          ? "bg-gray-900 text-white"
                          : "hover:bg-gray-900/10 active:bg-gray-900/20"
                      }`}
                      type="button"
                    >
                      <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                        {number}
                      </span>
                    </button>
                  ))}
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
    </div>
  );
}

export default SearchMentors;

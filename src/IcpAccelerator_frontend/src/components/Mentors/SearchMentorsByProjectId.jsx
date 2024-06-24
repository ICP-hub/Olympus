import React, { useEffect, useState } from "react";
import girlImage from "../../../assets/images/girl.jpeg";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import uint8ArrayToBase64 from "../Utils/uint8ArrayToBase64";
import { IcpAccelerator_backend } from "../../../../declarations/IcpAccelerator_backend/index";
import NoDataCard from "./Event/NoDataCard";
import AddAMentorRequestModal from "../../models/AddAMentorRequestModal";
import toast, { Toaster } from "react-hot-toast";
import { Principal } from "@dfinity/principal";
import NoData from "../../../assets/images/search_not_found.png";
import { MentorlistSkeleton } from "../Dashboard/Skeleton/Mentorlistskeleton";

function SearchMentorsByProjectId() {
  const { id } = useParams();

  const navigate = useNavigate();
  const actor = useSelector((currState) => currState.actors.actor);
  const principal = useSelector((currState) => currState.internet.principal);
  const [allMentorData, setAllMentorData] = useState([]);
  const [noData, setNoData] = useState(null);
  const [isAddMentorModalOpen, setIsAddMentorModalOpen] = useState(false);
  const [mentorId, setMentorId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [countData, setCountData] = useState(0);
  const [filter, setFilter] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const itemsPerPage = 12;

  const handleMentorCloseModal = () => {
    setMentorId(null);
    setIsAddMentorModalOpen(false);
  };
  const handleMentorOpenModal = (val) => {
    setMentorId(val);
    setIsAddMentorModalOpen(true);
  };

  const handleAddMentor = async ({ message }) => {
    setIsSubmitting(true);
    console.log("add a mentor");
    if (actor && mentorId) {
      let mentor_id = Principal.fromText(mentorId);
      let msg = message;
      let project_id = id;

      await actor
        .send_offer_to_mentor(mentor_id, msg, project_id)
        .then((result) => {
          console.log("result-in-send_offer_to_mentor", result);
          if (result) {
            setIsSubmitting(false);
            handleMentorCloseModal();
            toast.success("offer sent to mentor successfully");
          } else {
            setIsSubmitting(false);
            handleMentorCloseModal();
            toast.error("something got wrong");
          }
        })
        .catch((error) => {
          console.log("error-in-send_offer_to_mentor", error);
          handleMentorCloseModal();
          setIsSubmitting(false);
          toast.error("something got wrong");
        });
    }
  };

  const getAllMentors = async (caller, page) => {
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
          setNoData(false);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        setAllMentorData([]);
        setCountData(0);
        setNoData(false);
        setIsLoading(false);
        console.log("error-in-get-all-mentors", error);
      });
  };

  useEffect(() => {
    if (actor && principal) {
      getAllMentors(actor, currentPage);
    } else {
      getAllMentors(IcpAccelerator_backend);
    }
  }, [actor, principal, currentPage]);
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
  console.log("allMentorData", allMentorData);
  console.log("filteredMentors", filteredMentors);
  return (
    <div className="px-[4%] w-full bg-gray-100 h-screen overflow-y-scroll">
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
            placeholder="Search Mentor..."
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md1:grid-cols-3 lg1:grid-cols-4 mb-8 gap-8 items-center flex-wrap ">
          {Array(itemsPerPage)
            .fill(0)
            .map((_, index) => (
              <MentorlistSkeleton key={index} />
            ))}
        </div>
      ) : Number(countData) <= 0 ? (
        <NoDataCard desc="No Investor to display yet" image={NoData} />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md1:grid-cols-3 lg1:grid-cols-4 mb-8 gap-8 items-center flex-wrap ">
            {filteredMentors &&
              filteredMentors?.map((mentor, index) => {
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
                        {actor && principal ? (
                          <button
                            onClick={() => handleMentorOpenModal(id)}
                            className="mt-4 text-white px-4 py-1 rounded-lg uppercase w-full text-center border border-gray-300 font-bold bg-[#3505B2] transition-colors duration-200 ease-in-out"
                          >
                            Reach Out
                          </button>
                        ) : (
                          <button
                            disabled={true}
                            className="mt-4 text-white px-4 py-1 rounded-lg uppercase w-full text-center border border-gray-300 font-bold bg-[#3505B2] transition-colors duration-200 ease-in-out"
                          >
                            Sign Up To Reach Out
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </>
      )}
      <div className="flex flex-row  w-full gap-4 mb-4 justify-center">
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
                currentPage === Math.ceil(Number(countData) / itemsPerPage)
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
      {isAddMentorModalOpen && (
        <AddAMentorRequestModal
          title={"Associate Mentor"}
          onClose={handleMentorCloseModal}
          onSubmitHandler={handleAddMentor}
          isSubmitting={isSubmitting}
        />
      )}
      <Toaster />
    </div>
  );
}

export default SearchMentorsByProjectId;

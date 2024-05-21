import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import uint8ArrayToBase64 from "../Utils/uint8ArrayToBase64";
import { IcpAccelerator_backend } from "../../../../declarations/IcpAccelerator_backend/index";
import NoDataCard from "./Event/NoDataCard";
import MentorCard from "./MentorCard";

function SearchMentors() {
  const navigate = useNavigate();
  const [allMentorData, setAllMentorData] = useState([]);
  const [noData, setNoData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("");
  const itemsPerPage = 12;
  const actor = useSelector((currState) => currState.actors.actor);

  const getAllMentors = async (caller) => {
    await caller
      .get_all_mentors_candid()
      .then((result) => {
        console.log("result-in-get-all-mentors", result);
        if (result.length > 0) {
          setAllMentorData(result);
          setNoData(false);
        } else {
          setAllMentorData([]);
          setNoData(true);
        }
      })
      .catch((error) => {
        setAllMentorData([]);
        setNoData(true);
        console.log("error-in-get-all-mentors", error);
      });
  };

  useEffect(() => {
    if (actor) {
      getAllMentors(actor);
    } else {
      getAllMentors(IcpAccelerator_backend);
    }
  }, [actor]);

  const filteredInvestors = React.useMemo(() => {
    return allMentorData.filter((user) => {
      console.log("user", user);
      const fullName =
        user[1]?.mentor_profile?.profile?.user_data?.full_name?.toLowerCase() ||
        "";
      const areaoFInterest =
        user[1]?.mentor_profile?.profile?.user_data?.area_of_interest?.toLowerCase() ||
        "";
      const categoryOfMentoring =
        user[1]?.mentor_profile?.profile?.category_of_mentoring_service?.toLowerCase() ||
        "";
      return (
        fullName.includes(filter.toLowerCase()) ||
        areaoFInterest.includes(filter.toLowerCase()) ||
        categoryOfMentoring.includes(filter.toLowerCase())
      );
    });
  }, [filter, allMentorData]);

  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentMentors = filteredInvestors.slice(
    indexOfFirstUser,
    indexOfLastUser
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handlePrevious = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setCurrentPage((prev) =>
      prev < Math.ceil(filteredInvestors.length / itemsPerPage)
        ? prev + 1
        : prev
    );
  };

  return (
    <div className="container mx-auto min-h-screen">
      <div className="px-[4%] pb-[4%] pt-[1%]">
      <div className="flex items-center justify-between sm:flex-col sxxs:flex-col md:flex-row">
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
        {noData ? (
          <NoDataCard />
        ) : (
          <>
            <div className="flex justify-center items-center flex-wrap ">
              {currentMentors.map((mentor, index) => {
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
                  <MentorCard
                    key={index}
                    img={img}
                    id={id}
                    name={name}
                    bio={bio}
                    role={role}
                    category_of_mentoring_service={
                      category_of_mentoring_service
                    }
                    skills={skills}
                  />
                );
              })}
            </div>
            <div className="flex flex-row  w-full gap-4 justify-center">
              {currentMentors.length > 0 && (
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
                      length: Math.ceil(
                        filteredInvestors.length / itemsPerPage
                      ),
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
                      Math.ceil(filteredInvestors.length / itemsPerPage)
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

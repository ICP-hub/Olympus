import React, { useEffect, useState } from "react";
import image from "../../../../assets/images/samya.jpg";
import uint8ArrayToBase64 from "../../Utils/uint8ArrayToBase64";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { IcpAccelerator_backend } from "../../../../../declarations/IcpAccelerator_backend/index";
import NoDataCard from "../../Mentors/Event/NoDataCard";
import { Principal } from "@dfinity/principal";
import toast, { Toaster } from "react-hot-toast";
import AddAMentorRequestModal from "../../../models/AddAMentorRequestModal";
import NoData from "../../../../assets/images/search_not_found.png";

const ViewInvestorByProjectId = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const actor = useSelector((currState) => currState.actors.actor);
  const principal = useSelector((currState) => currState.internet.principal);
  const [data, setData] = useState([]);
  const [noData, setNoData] = useState(null);
  const [isAddInvestorModalOpen, setIsAddInvestorModalOpen] = useState(false);
  const [investorId, setInvestorId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [countData, setCountData] = useState(0);
  const [filter, setFilter] = useState("");
  const itemsPerPage = 12;

  const handleInvestorCloseModal = () => {
    setInvestorId(null);
    setIsAddInvestorModalOpen(false);
  };
  const handleInvestorOpenModal = (val) => {
    setInvestorId(val);
    setIsAddInvestorModalOpen(true);
  };

  const handleAddInvestor = async ({ message }) => {
    console.log("add a investor");
    if (actor && investorId) {
      let investor_id = Principal.fromText(investorId);
      let msg = message;
      let project_id = id;

      await actor
        .send_offer_to_investor(investor_id, msg, project_id)
        .then((result) => {
          console.log("result-in-send_offer_to_investor", result);
          if (result) {
            handleInvestorCloseModal();
            toast.success("offer sent to mentor successfully");
          } else {
            handleInvestorCloseModal();
            toast.error("something got wrong");
          }
        })
        .catch((error) => {
          console.log("error-in-send_offer_to_investor", error);
          handleInvestorCloseModal();
          toast.error("something got wrong");
        });
    }
  };

  const getAllInvestors = async (caller, page) => {
    await caller
      .list_all_vcs_with_pagination({
        page_size: itemsPerPage,
        page,
      })
      .then((result) => {
        console.log("result-in-get-all-investors", result);
        if (result && result?.data?.length >= 0) {
          setNoData(true);
          setData(result.data);
          setCountData(result.count);
        } else {
          setNoData(false);
          setData([]);
          setCountData();
        }
      })
      .catch((error) => {
        setNoData(true);
        setData([]);
        console.log("error-in-get-all-investors", error);
      });
  };

  useEffect(() => {
    if (actor && principal) {
      getAllInvestors(actor, currentPage);
    } else {
      getAllInvestors(IcpAccelerator_backend);
    }
  }, [actor, principal, currentPage]);

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
    <div className="px-[4%] w-full bg-gray-100 h-screen overflow-y-scroll">
      <div className="flex flex-col text-center items-center justify-center">
        <div className="py-8">
          <h2 className="text-[40px] font-black leading-10 bg-gradient-to-r from-[#7283EA] to-[#4087BF] bg-clip-text text-transparent transform">
            Our{" "}
            <span className=" bg-gradient-to-r from-[#3C04BA] to-[#4087BF] bg-clip-text text-transparent transform">
              Investors
            </span>
          </h2>
        </div>
        {/* <div className="flex items-center relative md1:w-1/2 sm1:w-3/4 w-full p-2 mb-8 border border-[#737373] rounded-lg shadow-md">
          <input
            type="text"
            placeholder="Search by company, skills or role"
            className="flex-grow bg-transparent rounded focus:outline-none"
          />
          <button className="md1:block absolute hidden right-0 bg-[#3505B2] font-black text-xs text-white px-4 py-2 mr-1 rounded-md focus:outline-none">
            Search Investor
          </button>
          <button className="block absolute md1:hidden right-0 bg-transparent font-black text-xs text-[#3505B2] px-4 py-2 mr-1 rounded-md focus:outline-none">
            <svg
              className="w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </button>
        </div> */}
      </div>
      <div className="container mx-auto">
        {Number(countData) <= 0 ? (
          <NoDataCard desc="No Investor to display yet" image={NoData} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md1:grid-cols-3 lg1:grid-cols-4 mb-8 gap-8 items-center flex-wrap ">
            {data &&
              data.map((investor, index) => {
                let id = investor[0].toText();
                let img = uint8ArrayToBase64(
                  investor[1]?.vc_profile?.params?.user_data?.profile_picture[0]
                );
                let name =
                  investor[1]?.vc_profile?.params?.user_data?.full_name;
                let company = investor[1]?.vc_profile?.params?.name_of_fund;
                let role = "Investor";
                let website_link =
                  investor[1]?.vc_profile?.params?.website_link;
                let category_of_investment =
                  investor[1]?.vc_profile?.params?.category_of_investment ?? "";

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
                          {company}
                        </span>
                      </div>
                      <div className="flex overflow-x-auto gap-2 pb-4 max-md:justify-center">
                        {category_of_investment && category_of_investment !== ""
                          ? category_of_investment
                              .split(",")
                              .map((item, index) => {
                                return (
                                  <span
                                    key={index}
                                    className="bg-[#E7E7E8] rounded-full text-gray-600 text-xs font-bold px-3 py-1 leading-none flex items-center"
                                  >
                                    {item.trim()}
                                  </span>
                                );
                              })
                          : ""}
                      </div>
                      {actor && principal ? (
                        <button
                          onClick={() => handleInvestorOpenModal(id)}
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
      </div>
      {isAddInvestorModalOpen && (
        <AddAMentorRequestModal
          title={"Associate Investor"}
          onClose={handleInvestorCloseModal}
          onSubmitHandler={handleAddInvestor}
        />
      )}
      <Toaster />
    </div>
  );
};

export default ViewInvestorByProjectId;

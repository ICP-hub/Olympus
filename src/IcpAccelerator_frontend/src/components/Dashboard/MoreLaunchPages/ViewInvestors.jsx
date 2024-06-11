import React, { useEffect, useState } from "react";
import uint8ArrayToBase64 from "../../Utils/uint8ArrayToBase64";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { IcpAccelerator_backend } from "../../../../../declarations/IcpAccelerator_backend/index";
import NoDataCard from "../../Mentors/Event/NoDataCard";
import { InvestorlistSkeleton } from "../Skeleton/Investorslistskeleton";

const ViewInvestor = () => {
  const navigate = useNavigate();
  const [allInvestorData, setAllInvestorData] = useState([]);
  const [countData, setCountData] = useState("");
  const [noData, setNoData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 12;
  const actor = useSelector((currState) => currState.actors.actor);

  const getAllInvestors = async (caller, page) => {
    setIsLoading(true);
    try {
      const result = await caller.list_all_vcs_with_pagination({
        page_size: itemsPerPage,
        page,
      });
      console.log("result-in-get-all-investors", result);
      if (!result || result.data.length === 0) {
        setNoData(true);
        setIsLoading(false);
        setAllInvestorData([]);
        setCountData("");
      } else {
        setNoData(false);
        setIsLoading(false);
        setAllInvestorData(result.data);
        setCountData(result.total_count);
      }
    } catch (error) {
      setNoData(true);
      setIsLoading(false);
      setAllInvestorData([]);
      setCountData("");
      console.log("error-in-get-all-investors", error);
    }
  };

  useEffect(() => {
    if (actor) {
      getAllInvestors(actor, currentPage);
    } else {
      getAllInvestors(IcpAccelerator_backend);
    }
  }, [actor, currentPage]);

  const filteredInvestors = React.useMemo(() => {
    return allInvestorData?.filter((user) => {
      const fullName =
        user[1]?.vc_profile?.params?.user_data?.full_name?.toLowerCase() || "";
      const companyName =
        user[1]?.vc_profile?.params?.name_of_fund?.toLowerCase() || "";
      return (
        fullName.includes(filter?.toLowerCase()) ||
        companyName.includes(filter?.toLowerCase())
      );
    });
  }, [filter, allInvestorData]);

  // Determine the investors to show on the current page
  // const startIndex = (currentPage - 1) * itemsPerPage;
  // const endIndex = startIndex + itemsPerPage;
  // const currentInvestors = filteredInvestors.slice(startIndex, endIndex);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handlePrevious = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setCurrentPage((prev) =>
      prev < Math.ceil(Number(countData) / itemsPerPage) ? prev + 1 : prev
    );
  };

  // Logic to limit the displayed page numbers to 10 at a time
  const renderPaginationNumbers = () => {
    const totalPages = Math.ceil(Number(countData) / itemsPerPage);
    const maxPageNumbers = 10;
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
  console.log("countData:", countData);
  console.log("currentPage:", currentPage);
  console.log("filteredInvestors:", filteredInvestors);

  return (
    <div className="container mx-auto min-h-screen">
      <div className="px-[4%] pb-[4%] pt-[1%]">
        <div className="flex items-center justify-between sm:flex-col sxxs:flex-col md:flex-row">
          <div
            className="w-full bg-gradient-to-r from-purple-900 to-blue-500 text-transparent bg-clip-text text-3xl font-extrabold py-4 
       font-fontUse"
          >
            Our Investors
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
            .map((_, index) => <InvestorlistSkeleton key={index} />)
        ) : noData || filter === null ? (
          <div className="flex justify-center items-center">
            <NoDataCard />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 mb-4 gap-4 items-center flex-wrap ">
              {filteredInvestors &&
                filteredInvestors.map((investor, index) => {
                  let id = investor[0].toText();
                  let img = uint8ArrayToBase64(
                    investor[1]?.vc_profile?.params?.user_data
                      ?.profile_picture[0]
                  );
                  let name =
                    investor[1]?.vc_profile?.params?.user_data?.full_name;
                  let company = investor[1]?.vc_profile?.params?.name_of_fund;
                  let role = "Investor";
                  let website_link =
                    investor[1]?.vc_profile?.params?.website_link;
                  let category_of_investment =
                    investor[1]?.vc_profile?.params?.category_of_investment ??
                    "";

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
                          {category_of_investment &&
                          category_of_investment !== ""
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
                        <button
                          onClick={() =>
                            id ? navigate(`/view-investor-details/${id}`) : ""
                          }
                          className="text-white px-4 py-1 rounded-lg uppercase w-full text-center border border-gray-300 font-bold bg-[#3505B2] transition-colors duration-200 ease-in-out"
                        >
                          View Profile
                        </button>
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
    </div>
  );
};

export default ViewInvestor;

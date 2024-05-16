import React, { useEffect, useRef, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import uint8ArrayToBase64 from "../../../../../IcpAccelerator_frontend/src/components/Utils/uint8ArrayToBase64";
import { OutSideClickHandler } from "../../../../../IcpAccelerator_frontend/src/components/hooks/OutSideClickHandler";
import {
  BioSvg,
  DateSvg,
  noDataPresentSvg,
  projectFilterSvg,
} from "../../Utils/AdminData/SvgData";
import NoDataCard from "../../../../../IcpAccelerator_frontend/src/components/Mentors/Event/NoDataCard";
import NoData from "../../../../../IcpAccelerator_frontend/assets/images/NoData.png";

import {
  formatDateFromBigInt,
  principalToText,
} from "../../Utils/AdminData/saga_function/blobImageToUrl";
import { useNavigate } from "react-router-dom";
import { place } from "../../Utils/AdminData/SvgData";
import proj from "../../../../../IcpAccelerator_frontend/assets/images/founder.png";
import vc from "../../../../../IcpAccelerator_frontend/assets/images/vc.png";
import mentor from "../../../../../IcpAccelerator_frontend/assets/images/mentor.png";
const UpdateAllRequest = () => {
  const actor = useSelector((currState) => currState.actors.actor);
  const navigate = useNavigate();
  const [allData, setAllData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOption, setFilterOption] = useState("Projects");
  const [selectionOption, setSelectionOption] = useState("Pending");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const itemsPerPage = 10;
  const dropdownRef = useRef(null);
  OutSideClickHandler(dropdownRef, () => setIsPopupOpen(false));

  async function fetchUpdationData(filterOption, selectionOption) {
    const actions = {
      Mentors: {
        Pending: () => actor.mentor_profile_edit_awaiting_approval(),
        Approved: () => actor,
        Declined: () => actor.get_mentor_update_declined_request(),
      },
      Projects: {
        Pending: () => actor.project_update_awaiting_approval(),
        Approved: () => actor,
        Declined: () => actor.get_project_update_declined_request(),
      },
      Investors: {
        Pending: () => actor.vc_profile_edit_awaiting_approval(),
        Approved: () => actor,
        Declined: () => actor.get_vc_update_declined_request(),
      },
    };
    const action = actions[filterOption]?.[selectionOption];
    return action ? await action() : [];
  }


  const fetchData = useCallback(async () => {
    try {
      const data = await fetchUpdationData(filterOption, selectionOption);
      console.log("data status wala ==>", data);
      const processedData = data.map((item, index) => {
        console.log("data updated wale mai =>>>>", data);

        const updatedInfo = item[1]?.updated_info || {};
        const requestOn = formatDateFromBigInt(item[1]?.sent_at);
        // console.log("originalInfo", originalInfo);
        // console.log("updatedInfo", updatedInfo);

        let principal = "";
        if (data && data?.[0]?.[1]?.principal) {
          principal = principalToText(data?.[0]?.[1]?.principal);
        } else if (data && data?.[0]?.[0]) {
          principal = principalToText(data?.[0]?.[0]);
        }
        // console.log("principal", principal);

        const profilePicture =
          uint8ArrayToBase64(updatedInfo?.user_data?.profile_picture[0]) ||
          uint8ArrayToBase64(updatedInfo[0]?.user_data?.profile_picture?.[0]) ||
          uint8ArrayToBase64(updatedInfo?.project_logo);

        const commonData = {
          fullName: (
            updatedInfo.user_data?.full_name ||
            updatedInfo[0].user_data?.full_name ||
            "No Name"
          ).trim(),
          country:
            updatedInfo.user_data?.country ||
            updatedInfo[0].user_data?.country ||
            "No Country",
          profilePictureURL: profilePicture,

          telegram:
            updatedInfo?.user_data?.telegram_id?.[0] ||
            updatedInfo[0]?.user_data?.telegram_id?.[0] ||
            "",
          hub:
            updatedInfo?.preferred_icp_hub?.[0] ||
            updatedInfo[0]?.preferred_icp_hub ||
            updatedInfo[0]?.preferred_icp_hub?.[0] ||
            "N/A",
          requestTime: requestOn || "N/A",
          description:
            updatedInfo?.project_description?.[0] ||
            updatedInfo[0]?.project_description ||
            updatedInfo[0]?.project_description?.[0],
          bio:
            updatedInfo?.user_data?.bio?.[0] ||
            // updatedInfo[0]?.user_data?.bio ||
            updatedInfo[0]?.user_data?.bio?.[0],
          // "N/A",
          principalId: principal,
          index: index + 1,
        };

        return commonData;
      });

      setAllData(processedData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setAllData([]);
    }
  }, [actor, filterOption]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredData = allData.filter((item) => {
    const fullName = item.fullName?.toLowerCase() || "";
    const country = item.country?.toLowerCase() || "";
    return (
      fullName.includes(filter.toLowerCase()) ||
      country.includes(filter.toLowerCase())
    );
  });

  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirstUser, indexOfLastUser);

  console.log("currentData =?", currentData);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handlePrevious = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setCurrentPage((prev) =>
      prev < Math.ceil(filteredData.length / itemsPerPage) ? prev + 1 : prev
    );
  };

  const handleRowClick = (principalId ,selectionOption) => {
    const routePath =
      filterOption === "Mentors"
        ? "/mentorupdate"
        : filterOption === "Investors"
        ? "/investorupdate"
        : "/projectupdate";
        navigate(routePath, {
          state: {
            principalId: principalId,
            selectionOption: selectionOption
          }
        });
  };

  return (
    <div className="px-[4%] py-[3%] w-full bg-gray-100">
      <div className="flex justify-between mb-10">
        <div
          className="w-full bg-gradient-to-r from-purple-900 to-blue-500 text-transparent bg-clip-text text-xl md:text-3xl font-extrabold 
       font-fontUse"
        >
          All Updates
        </div>
        <div className="relative flex items-center max-w-xs bg-white rounded-xl">
          <input
            type="text"
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setCurrentPage(1);
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

      <div className="flex justify-between mb-4 items-center w-full">
        <div>
          {[
            { name: "Projects", icon: proj },
            { name: "Mentors", icon: mentor },
            { name: "Investors", icon: vc },
          ].map((item) => (
            <button
              key={item.name}
              onClick={() => setFilterOption(item.name)}
              className={`mr-4 text-sm font-medium transition-colors duration-300 ease-in-out ${
                filterOption === item.name
                  ? "pb-1 border-b-2 border-gray-700 font-bold text-gray-700"
                  : "text-gray-500"
              }`}
            >
              <span className="md:block hidden">{item.name}</span>
              <img
                src={item.icon}
                alt={item.icon}
                className="inline md:hidden w-7 h-7"
              />
            </button>
          ))}
        </div>
        <div className="flex">
          <div
            className="border-2 border-blue-900 p-1 w-auto  font-bold rounded-md text-blue-900 px-2 capitalize"
            style={{ whiteSpace: "nowrap" }}
          >
            {selectionOption}
          </div>
          <div className="flex items-center justify-between ml-2">
            <div className="flex justify-end gap-4 relative " ref={dropdownRef}>
              <div
                className="cursor-pointer"
                onClick={() => setIsPopupOpen((curr) => !curr)}
              >
                {projectFilterSvg}
                {isPopupOpen && (
                  <div className="absolute w-[250px] mt-4 top-full right-0 bg-white shadow-md rounded-lg border border-gray-200 p-3 z-10">
                    <ul className="flex flex-col">
                      <li>
                        <button
                          className="border-[#9C9C9C] w-[230px]  hover:text-indigo-800 border-b-2 py-2 px-4 focus:outline-none text-base flex justify-start font-fontUse"
                          onClick={() => {
                            setSelectionOption("Pending");
                          }}
                        >
                          Pending
                        </button>
                      </li>
                      <li>
                        <button
                          className="border-[#9C9C9C] w-[230px]  hover:text-indigo-800 border-b-2 py-2 px-4 focus:outline-none text-base flex justify-start font-fontUse"
                          onClick={() => setSelectionOption("Approved")}
                        >
                          Approved
                        </button>
                      </li>
                      <li>
                        <button
                          className="border-[#9C9C9C] w-[230px]  hover:text-indigo-800 border-b-2 py-2 px-4 focus:outline-none text-base flex justify-start font-fontUse"
                          onClick={() => setSelectionOption("Declined")}
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
        </div>
      </div>

      {currentData.length > 0 ? (
        <div className="px-[2%]  py-[1.5%] w-full flex flex-col mb-6 bg-white rounded-lg shadow border border-gray-200">
          {currentData.map((user, index) => (
            <div
              className="w-full mb-2 justify-between items-center  flex flex-row flex-wrap"
              key={index}
            >
              <div className="space-x-3 flex flex-row items-center">
                <img
                  src={user.profilePictureURL} // Use user.profilePictureURL instead of currentData.profilePictureURL
                  alt="profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <h4 className="md:text-2xl text-md font-extrabold text-[#3505B2]">
                  {user.fullName}{" "}
                  {/* Use user.fullName instead of currentData.fullName */}
                </h4>
                <div>
                  {filterOption && (
                    <p className="bg-[#2A353D] md:text-[10px] text-[8px] items-center  rounded-full text-white py-0.5 px-2">
                      {filterOption}
                    </p>
                  )}
                </div>
              </div>

              <div className=" hidden md:flex md:flex-row">
                <span className="text-gray-500 mr-2">
                  <DateSvg />
                </span>
                <p className="md:text-sm text-xs md:text-md text-[#3505B2]">
                  {user.requestTime}{" "}
                  {/* Use user.requestTime instead of currentData.requestTime */}
                </p>
              </div>

              <div className="flex md:flex-row flex-col w-full">
                <div className="flex flex-col md:w-3/4 w-full mb-3 md:mb-0">
                  <div className="md:hidden mt-2 block">
                    {user.requestTime && (
                      <div className="flex flex-row mt-2 items-center text-sm mb-1 font-medium text-gray-600">
                        <span className="text-gray-500 min-w-[40px] ml-3">
                          <DateSvg />
                        </span>
                        <span className="truncate md:text-sm text-xs">
                          {user.requestTime}{" "}
                          {/* Use user.requestTime instead of currentData.requestTime */}
                        </span>
                      </div>
                    )}
                  </div>

                  {user.country && (
                    <div className="flex flex-row items-center text-sm mb-1 md:mt-2 font-medium text-gray-600">
                      <span className="text-gray-500 min-w-[40px] ml-3">
                        {place}
                      </span>
                      <span className="truncate">
                        {user.country}{" "}
                        {/* Use user.country instead of currentData.country */}
                      </span>
                    </div>
                  )}
                  {user.description ? (
                    <div className="flex flex-row items-center text-sm font-medium text-gray-600 break-words">
                      <span className="text-gray-500 min-w-[40px] ml-3">
                        <BioSvg />
                      </span>
                      <span className="truncate md:text-sm text-xs">
                        {user.description}
                      </span>
                    </div>
                  ) : user.bio ? (
                    <div className="flex flex-row items-center text-sm font-medium text-gray-600 break-words">
                      <span className="text-gray-500 min-w-[40px] ml-3">
                        <BioSvg />
                      </span>
                      <span className="truncate md:text-sm text-xs">
                        {user.bio}
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-row items-center text-sm font-medium text-gray-600 break-words">
                      <span className="text-gray-500 min-w-[40px] ml-3.5">
                        {noDataPresentSvg}
                      </span>
                      <span className="truncate md:text-sm text-xs">
                        No Data
                      </span>
                    </div>
                  )}
                </div>
                <div className="md:w-1/4 w-full flex justify-end items-end space-x-2 md:h-10">
                  <button
                    onClick={() => handleRowClick(user.principalId ,selectionOption)}
                    className="capitalize border-2 font-semibold bg-[#3505B2] border-[#3505B2] md:text-xs text-[9px]  text-white md:px-1 px-2 rounded-md md:h-8 h-7 hover:text-[#3505B2] hover:bg-white"
                  >
                    View User Profile
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <NoDataCard image={NoData} desc={"No Update Requests"} />
      )}

      {currentData.length > 0 && (
        <div className="flex items-center gap-4 justify-center mb-4">
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
            { length: Math.ceil(filteredData.length / itemsPerPage) },
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
              currentPage === Math.ceil(filteredData.length / itemsPerPage)
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
  );
};

export default UpdateAllRequest;

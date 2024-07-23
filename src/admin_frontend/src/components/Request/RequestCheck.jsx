import React, { useState, useEffect, useRef, useMemo } from "react";
import { projectFilterSvg } from "../Utils/AdminData/SvgData";
import { useDispatch, useSelector } from "react-redux";
import NotificationCard from "../Notification/NotificationCard";
import Loader from "../Loader/Loader";
import NoDataCard from "../../../../IcpAccelerator_frontend/src/component/Mentors/Event/NoDataCard";
import proj from "../../../../IcpAccelerator_frontend/assets/images/founder.png";
import vc from "../../../../IcpAccelerator_frontend/assets/images/vc.png";
import mentor from "../../../../IcpAccelerator_frontend/assets/images/mentor.png";
import { OutSideClickHandler } from "../../../../IcpAccelerator_frontend/src/component/hooks/OutSideClickHandler";
import NoData from "../../../../IcpAccelerator_frontend/assets/images/NoData.png";
import {
  mentorPendingFailure,
  mentorPendingRequest,
} from "../AdminStateManagement/Redux/Reducers/mentorPending";
import { mentorDeclinedRequest } from "../AdminStateManagement/Redux/Reducers/mentorDeclined";
import { mentorApprovedRequest } from "../AdminStateManagement/Redux/Reducers/mentorApproved";
import { projectPendingRequest } from "../AdminStateManagement/Redux/Reducers/projectPending";
import { projectApprovedRequest } from "../AdminStateManagement/Redux/Reducers/projectApproved";
import { projectDeclinedRequest } from "../AdminStateManagement/Redux/Reducers/projectDeclined";
import { investorPendingRequest } from "../AdminStateManagement/Redux/Reducers/investorPending";
import { investorApprovedRequest } from "../AdminStateManagement/Redux/Reducers/investorApproved";
import { investorDeclinedRequest } from "../AdminStateManagement/Redux/Reducers/investorDecline";

const RequestCheck = () => {
  // const principal = useSelector((currState) => currState.internet.principal);
  const isAuthenticated = useSelector(
    (currState) => currState.internet.isAuthenticated
  );
  const [activeCategory, setActiveCategory] = useState("Project");
  const [selectedStatus, setSelectedStatus] = useState("Pending");
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [isFiltering, setIsFiltering] = useState(false);
  const itemsPerPage = 12;

  const dropdownRef = useRef(null);
  OutSideClickHandler(dropdownRef, () => setIsPopupOpen(false));

  const mentorPending = useSelector(
    (currState) => currState.mentor_pending.data
  );
  const mentorPendingCount = useSelector(
    (currState) => currState.mentor_pending.count
  );
  const mentorApproved = useSelector(
    (currState) => currState.mentor_approved.data
  );
  const mentorApprovedCount = useSelector(
    (currState) => currState.mentor_approved.count
  );
  const mentorDeclined = useSelector(
    (currState) => currState.mentor_declined.data
  );

  const mentorDeclinedCount = useSelector(
    (currState) => currState.mentor_declined.count
  );

  const projectPending = useSelector(
    (currState) => currState.project_pending.data
  );
  const projectPendingCount = useSelector(
    (currState) => currState.project_pending.count
  );
  const projectApproved = useSelector(
    (currState) => currState.project_approved.data
  );
  const projectApprovedCount = useSelector(
    (currState) => currState.project_approved.count
  );
  const projectDeclined = useSelector(
    (currState) => currState.project_declined.data
  );
  const projectDeclinedCount = useSelector(
    (currState) => currState.project_declined.count
  );

  const investorPending = useSelector(
    (currState) => currState.investor_pending.data
  );
  const investorPendingCount = useSelector(
    (currState) => currState.investor_pending.count
  );
  const investorApproved = useSelector(
    (currState) => currState.investor_approved.data
  );
  const investorApprovedCount = useSelector(
    (currState) => currState.investor_approved.count
  );
  const investorDeclined = useSelector(
    (currState) => currState.investor_declined.data
  );
  const investorDeclinedCount = useSelector(
    (currState) => currState.investor_declined.count
  );

  console.log("data in =>=>>>>>> mentorPending", mentorPending);

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  useEffect(() => {
    if (activeCategory === "Mentor") {
      if (selectedStatus === "Pending") {
        dispatch(mentorPendingRequest({ currentPage, itemsPerPage }));
      } else if (selectedStatus === "Approved") {
        dispatch(mentorApprovedRequest({ currentPage, itemsPerPage }));
      } else if (selectedStatus === "Declined") {
        dispatch(mentorDeclinedRequest({ currentPage, itemsPerPage }));
      }
    } else if (activeCategory === "Project") {
      if (selectedStatus === "Pending") {
        dispatch(projectPendingRequest({ currentPage, itemsPerPage }));
      } else if (selectedStatus === "Approved") {
        dispatch(projectApprovedRequest({ currentPage, itemsPerPage }));
      } else if (selectedStatus === "Declined") {
        dispatch(projectDeclinedRequest({ currentPage, itemsPerPage }));
      }
    } else if (activeCategory === "Investor") {
      if (selectedStatus === "Pending") {
        dispatch(investorPendingRequest({ currentPage, itemsPerPage }));
      } else if (selectedStatus === "Approved") {
        dispatch(investorApprovedRequest({ currentPage, itemsPerPage }));
      } else if (selectedStatus === "Declined") {
        dispatch(investorDeclinedRequest({ currentPage, itemsPerPage }));
      }
    }
  }, [dispatch, activeCategory, selectedStatus, currentPage, itemsPerPage]);

  useEffect(() => {
    const isDataLoaded =
      mentorPending.length > 0 ||
      mentorApproved.length > 0 ||
      mentorDeclined.length > 0 ||
      projectPending.length > 0 ||
      projectApproved.length > 0 ||
      projectDeclined.length > 0 ||
      investorPending.length > 0 ||
      investorApproved.length > 0 ||
      investorDeclined.length > 0;

    if (isDataLoaded) {
      setIsLoading(false);
    } else {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [
    mentorPending,
    mentorApproved,
    mentorDeclined,
    projectPending,
    projectApproved,
    projectDeclined,
    investorPending,
    investorApproved,
    investorDeclined,
  ]);

  const filteredData = useMemo(() => {
    const categoryMapping = {
      Mentor: {
        Pending: mentorPending,
        Approved: mentorApproved,
        Declined: mentorDeclined,
      },
      Project: {
        Pending: projectPending,
        Approved: projectApproved,
        Declined: projectDeclined,
      },
      Investor: {
        Pending: investorPending,
        Approved: investorApproved,
        Declined: investorDeclined,
      },
    };

    const currentData = categoryMapping[activeCategory][selectedStatus];
    return currentData.filter((item) => {
      const fullName = item?.profile?.user_data?.full_name?.toLowerCase() || "";
      const country = item?.profile?.user_data?.country?.toLowerCase() || "";
      return (
        fullName.includes(filter.toLowerCase()) ||
        country.includes(filter.toLowerCase())
      );
    });
  }, [
    activeCategory,
    selectedStatus,
    mentorPending,
    mentorApproved,
    mentorDeclined,
    projectPending,
    projectApproved,
    projectDeclined,
    investorPending,
    investorApproved,
    investorDeclined,
    filter,
  ]);
  useEffect(() => {
    setFilteredNotifications(filteredData);
  }, [filteredData]);

  useEffect(() => {
    if (filter) {
      setIsFiltering(true);
      setCurrentPage(1);
    } else {
      setIsFiltering(false);
    }
  }, [filter]);
  const totalPages = Math.ceil(
    activeCategory === "Mentor"
      ? selectedStatus === "Pending"
        ? mentorPendingCount / itemsPerPage
        : selectedStatus === "Approved"
        ? mentorApprovedCount / itemsPerPage
        : mentorDeclinedCount / itemsPerPage
      : activeCategory === "Project"
      ? selectedStatus === "Pending"
        ? projectPendingCount / itemsPerPage
        : selectedStatus === "Approved"
        ? projectApprovedCount / itemsPerPage
        : projectDeclinedCount / itemsPerPage
      : selectedStatus === "Pending"
      ? investorPendingCount / itemsPerPage
      : selectedStatus === "Approved"
      ? investorApprovedCount / itemsPerPage
      : investorDeclinedCount / itemsPerPage
  );
  // const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // const handlePrevious = () => {
  //   setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  // };

  // const handleNext = () => {
  //   setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
  // };
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
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const handlePrevious = () =>
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  const handleNext = () =>
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));

  const renderPaginationNumbers = () => {
    const startPage =
      Math.floor((currentPage - 1) / maxPageNumbers) * maxPageNumbers + 1;
    const endPage = Math.min(startPage + maxPageNumbers - 1, totalPages);

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    ).map((i) => (
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
    ));
  };
  return (
    <div className="px-[4%] py-[4%] w-full bg-gray-100 h-screen overflow-y-scroll">
      <div className="flex flex-wrap justify-between mb-10">
        <div className="text-2xl font-semibold text-left pb-2">
          <span className="inline-block bg-[#3505B2] text-transparent bg-clip-text">
            {selectedStatus}
          </span>
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
      <div className="flex justify-between">
        <div>
          {[
            { name: "Project", icon: proj },
            { name: "Mentor", icon: mentor },
            { name: "Investor", icon: vc },
          ].map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveCategory(item.name)}
              className={`mr-4 text-sm font-medium transition-colors duration-300 ease-in-out ${
                activeCategory === item.name
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
        <div className="flex flex-row space-x-2">
          <div
            className="border-2 border-blue-900 p-1 w-auto  font-bold rounded-md text-blue-900 px-2 capitalize"
            style={{ whiteSpace: "nowrap" }}
          >
            {selectedStatus}
          </div>
          <div className="flex justify-end gap-4 relative " ref={dropdownRef}>
            <div
              onClick={() => setIsPopupOpen(!isPopupOpen)}
              className="cursor-pointer"
            >
              {projectFilterSvg}

              {isPopupOpen && (
                <div className="absolute w-[250px] mt-4 top-full right-0 bg-white shadow-md rounded-lg border border-gray-200 p-3 z-10">
                  {["Pending", "Approved", "Declined"].map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        setSelectedStatus(status);
                        setIsPopupOpen(false);
                      }}
                      className="border-[#9C9C9C] w-[230px]  hover:text-indigo-800 border-b-2 py-2 px-4 focus:outline-none text-base flex justify-start font-fontUse"
                    >
                      {status}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {isLoading && isAuthenticated ? (
        <Loader />
      ) : filteredNotifications.length > 0 ? (
        <div className="mt-8">
          {filteredNotifications.map((notification, index) => (
            <NotificationCard
              key={index}
              notificationDetails={{
                role: notification.role,
                principal: notification.principal,
                requestedTime: notification.requestedTime,
                rejectedTime: notification.rejectedTime,
                state: { selectedStatus },
                category: { activeCategory },
                ...notification.profile,
                user_data: { ...notification.profile.user_data },
              }}
            />
          ))}
        </div>
      ) : (
        <div className="mt-8 text-center py-4">
          <NoDataCard image={NoData} desc={"No Pending Requests"} />
        </div>
      )}{" "}
      <div className="flex flex-row  w-full gap-4 justify-center">
        {!isFiltering && totalPages > 0 && (
          <div className="flex flex-row  w-full gap-4 justify-center">
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
                disabled={currentPage === totalPages}
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
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestCheck;

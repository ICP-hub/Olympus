import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import { FaFilter } from "react-icons/fa";
import parse from 'html-react-parser';

import eventbg from "../../../../assets/images/bg.png";
import ProfileImage from "../../../../assets/Logo/ProfileImage.png";
import { Principal } from "@dfinity/principal";
import toast from "react-hot-toast";
import { formatFullDateFromBigInt } from "../../Utils/formatter/formatDateFromBigInt";
import uint8ArrayToBase64 from "../../Utils/uint8ArrayToBase64";
import NoDataFound from "./NoDataFound";
import PriceIcon from "../../../../assets/Logo/PriceIcon.png";

const EventRequestCard = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [events, setEvents] = useState([]);  // Initialize as an empty array
  const [isSubmitting, setIsSubmitting] = useState(false);

  const actor = useSelector((currState) => currState.actors.actor);
  const principal = useSelector((currState) => currState.internet.principal);

  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };

  const handleApply = () => {
    console.log("Selected Category:", selectedCategory);
    console.log("Selected Type:", selectedType);
    setFilterOpen(false);
    // Fetch filtered events based on selectedCategory and selectedType
    fetchRequests(selectedCategory, selectedType);
  };

  const fetchRequests = async (category, type) => {
    let result = [];
    setIsSubmitting(true);

    try {
      switch (type) {
        case "pending":
          result = await actor.get_pending_cohort_enrollment_requests(
            Principal.fromText(principal)
          );
          break;
        case "approved":
          result = await actor.get_accepted_cohort_enrollment_requests(
            Principal.fromText(principal)
          );
          break;
        case "declined":
          result = await actor.get_rejected_cohort_enrollment_requests(
            Principal.fromText(principal)
          );
          break;
        default:
          result = [];
      }
      console.log("Fetched Events:", result);
      if (category) {
        result = result.filter((event) =>
          event.enroller_data?.[category]?.length > 0
        );
      }

      // Add a status field to each event
      const eventsWithStatus = result.map(event => ({ ...event, status: type === "approved" ? "approved" : "pending" }));

      setEvents(eventsWithStatus || []);  // Ensure result is always an array
      setIsSubmitting(false);
    } catch (error) {
      console.error(`Error fetching requests:`, error);
      setEvents([]);  // Set as empty array on error
      setIsSubmitting(false);
    }
  };

  const handleAction = async (action, index) => {
    setIsSubmitting(true);
    let event = events[index];
    console.log("event me kya aa rha h", event);
    let enroller_principal = event?.enroller_principal;
    let cohortId = event?.cohort_details?.cohort_id;
    let cohort_creator_principal = event?.cohort_details?.cohort_creator_principal;

    console.log(`Action: ${action} for Enroller: ${enroller_principal}, Cohort ID: ${cohortId}`); // Log who applied for which event
    try {
      let result;
      if (action === "Approve") {
        result = await actor.approve_enrollment_request(
          cohortId,
          enroller_principal
        );
        event.status = "approved";  // Update status to approved
      } else if (action === "Reject") {
        result = await actor.reject_enrollment_request(
          cohort_creator_principal,
          enroller_principal
        );
        event.status = "rejected";  // Update status to rejected
      }

      // Update the event in the state with the new status
      setEvents(prevEvents =>
        prevEvents.map((ev, i) =>
          i === index ? { ...ev, status: event.status } : ev
        )
      );

      toast.success(result);
    } catch (error) {
      console.error("Failed to process the decision: ", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (actor && principal) {
      fetchRequests(selectedCategory, selectedType);
    }
  }, [actor, principal, selectedCategory, selectedType]);

  return (
    <>
      <div className="flex gap-3 items-center py-2 justify-between relative">
        <div className="flex items-center border-2 border-gray-400 rounded-lg overflow-hidden w-full h-[50px]">
          <div className="flex items-center px-4">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103.5 3.5a7.5 7.5 0 0013.65 13.65z"
              ></path>
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search people, projects, jobs, events"
            className="w-full py-2 px-4 text-gray-700 focus:outline-none"
          />
          <div className="px-4">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 6h18M3 12h18m-7 6h7"
              ></path>
            </svg>
          </div>
        </div>
        <div>
          <FaFilter
            className="text-gray-400 text-2xl cursor-pointer"
            onClick={toggleFilter}
          />
        </div>
      </div>
      {filterOpen && (
        <div className="relative">
          <div className="absolute  -mt-30 right-2 w-52 bg-gray-100 border border-gray-300 p-4 rounded-lg shadow-lg z-50">
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
              <div className="mb-1">
                <span className="block text-sm font-medium text-gray-600 mb-2">
                  Category
                </span>
                <label className="flex items-center text-sm text-gray-700 font-medium mb-2">
                  <input
                    type="radio"
                    name="category"
                    value="project_data"
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="h-4 w-4 text-blue-600 form-radio checked:bg-blue-600 border border-black rounded-full cursor-pointer mr-2"
                  />
                  Project
                </label>
                <label className="flex items-center text-sm text-gray-700 font-medium mb-2">
                  <input
                    type="radio"
                    name="category"
                    value="vc_data"
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="h-4 w-4 text-blue-600 form-radio checked:bg-blue-600 border border-black rounded-full cursor-pointer mr-2"
                  />
                  Investor
                </label>
                <label className="flex items-center text-sm text-gray-700 font-medium">
                  <input
                    type="radio"
                    name="category"
                    value="mentor_data"
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="h-4 w-4 text-blue-600 form-radio checked:bg-blue-600 border border-black rounded-full cursor-pointer mr-2"
                  />
                  Mentor
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Types
                </label>
                <select
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="block w-full bg-white border border-gray-300 rounded-md shadow-sm focus:border-gray-400 focus:ring focus:ring-opacity-50 px-3 py-2"
                >
                  <option value="">All</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Accepted</option>
                  <option value="declined">Rejected</option>
                </select>
              </div>
              <div className="flex justify-between mt-1">
                <button
                  type="button"
                  className="bg-gray-200 text-gray-700 px-4 py-1 rounded-md hover:bg-gray-300"
                  onClick={toggleFilter}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600"
                  onClick={handleApply}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>

      )}
      {events.length > 0 ? (
        events.map((event, index) => {

          // Storing event details in variables
          const title = event.cohort_details.cohort.title;
          const description = event.cohort_details.cohort.description;
          const startDate = event.cohort_details.cohort.start_date;
          const endDate = event.cohort_details.cohort.cohort_end_date;
          const deadline = event.cohort_details.cohort.deadline;
          const noOfSeats = event.cohort_details.cohort.no_of_seats;
          const tags = event.cohort_details.cohort.tags;
          const hostName = event.cohort_details.cohort.host_name.join(", ");
          const fundingType = event.cohort_details.cohort.funding_type;
          const fundingAmount = event.cohort_details.cohort.funding_amount;
          const country = event.cohort_details.cohort.country ?? "global";
          const banner = event.cohort_details.cohort.cohort_banner[0]
            ? uint8ArrayToBase64(event.cohort_details.cohort.cohort_banner[0])
            : [];

          console.log("Event Title:", title); // Log the title to the console
          console.log("description", description);
          console.log("cohort_banner", banner);
          console.log("tag", tags);
          console.log("country", country);
          const attendees = event.attendees || [];  // Ensure attendees is an array
          return (
            <div key={index} className="bg-white rounded-lg shadow p-4 mb-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3 relative">
                  <div className="w-[272px] h-[230px]">
                    <div className="max-w-[230px] w-[230px] bg-gray-100 rounded-lg flex flex-col justify-between h-full relative overflow-hidden">
                      <div className="group">
                        <div
                          className="absolute inset-0 blur-sm"
                          style={{
                            backgroundImage: `url(${banner})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }}
                        ></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <img
                            src={ProfileImage}
                            alt={title}
                            className="w-24 h-24 rounded-full object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div>
                      <p className="bg-white font-medium border-2 border-[#CDD5DF] text-[#364152] w-[86px] px-2 py-1 rounded-full text-sm">
                        Workshop
                      </p>

                      <h3 className="text-lg font-bold mt-2 ">{title}</h3>
                      <p
                        className="text-sm text-gray-500 overflow-hidden text-ellipsis line-clamp-3 mt-2"
                        style={{ maxHeight: '3em', lineHeight: '1em' }}
                      >
                        {parse(description)}
                      </p>
                    </div>
                    {/* <div className="flex gap-3 items-center mt-2">{tags}</div> */}
                    <div className="flex flex-wrap gap-3 items-center mt-2">

                      <span key={index} className=" text-gray-700 px-2 border-2 rounded-xl">
                        {tags}
                      </span>

                    </div>
                    <div className="flex gap-3 items-center mt-2">
                      <span className="text-sm text-[#121926]">
                        <PlaceOutlinedIcon
                          className="text-[#364152]"
                          fontSize="small"
                        />
                        {country}
                      </span>
                      <div className="flex items-center">
                        <img
                          src={PriceIcon}
                          alt="End Date"
                          className="w-4 h-4 text-gray-400 mr-2"
                        />
                        <span className="text-gray-500">{fundingAmount}</span>
                      </div>

                      <div className="flex -space-x-1">
                        {attendees.map((attendee, idx) => (
                          <img
                            key={idx}
                            src={attendee}
                            alt="attendee"
                            className="w-6 h-6 rounded-full border-2 border-white"
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex py-2">
                      {selectedType === "pending" && event.status === "pending" && (
                        <>
                          <button
                            className="bg-blue-500 text-white px-4 py-2 rounded mr-2 font-normal text-sm"
                            onClick={() => handleAction("Approve", index)}
                            disabled={isSubmitting}
                          >
                            Accept
                          </button>
                          <button
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded font-normal text-sm"
                            onClick={() => handleAction("Reject", index)}
                            disabled={isSubmitting}
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {selectedType === "approved" && (

                        <button className="bg-[#ECFDF3] border-2 border-[#ABEFC6] text-[#067647] rounded-lg px-2 py-1" >Approved</button>
                      )}
                      {event.status === "approved" && selectedType !== "approved" && (

                        <button className="bg-[#ECFDF3] border-2 border-[#ABEFC6] text-[#067647] rounded-lg px-2 py-1 " >Approved</button>

                      )}
                      {event.status === "rejected" && (
                        // <span className="text-red-500">Rejected</span>
                        <button className="bg-[#FDF2FA]  border-2 text-[#C11574]  border-[#FCCEEE] rounded-lg px-2 py-1" >Approved</button>

                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <NoDataFound />
      )}
    </>
  );
};

export default EventRequestCard;

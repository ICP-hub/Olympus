import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FaFilter } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import toast from "react-hot-toast";
import { Principal } from "@dfinity/principal";
import parse from "html-react-parser";
import eventbg from "../../../../assets/images/bg.png";
import ProfileImage from "../../../../assets/Logo/ProfileImage.png";
import PriceIcon from "../../../../assets/Logo/PriceIcon.png";
import UserModal from "./UserModal";
import NoDataFound from "./NoDataFound";
import uint8ArrayToBase64 from "../../Utils/uint8ArrayToBase64";
import CloseIcon from "@mui/icons-material/Close";
import Avatar from "@mui/material/Avatar";

const EventRequestCard = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [appliedCategory, setAppliedCategory] = useState("all");
  const [appliedType, setAppliedType] = useState("all");
  const [events, setEvents] = useState([]);
  const [loadingIndexes, setLoadingIndexes] = useState({});
  const [selectedUserData, setSelectedUserData] = useState(null);
  const [openUserModal, setOpenUserModal] = useState(false);
  const actor = useSelector((state) => state.actors.actor);
  const principal = useSelector((state) => state.internet.principal);

  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };

  const handleApply = () => {
    setAppliedCategory(selectedCategory);
    setAppliedType(selectedType);

    setFilterOpen(false);
    fetchRequests(selectedCategory, selectedType);
  };

  const handleCardClick = (userData) => {
    setSelectedUserData(userData);
    setOpenUserModal(true);
  };
  // console.log("data user ka ",selectedUserData);
  const handleCloseModal = () => {
    setOpenUserModal(false);
    setSelectedUserData(null);
  };

  const fetchRequests = async (category, type) => {
    let result = [];

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
      }
      if (category && category !== "all") {
        result = result.filter(
          (event) => event.enroller_data?.[category]?.length > 0
        );
      }

      const eventsWithStatus = result.map((event) => ({
        ...event,
        status: event.status || "pending",
      }));

      setEvents(eventsWithStatus || []);
    } catch (error) {
      console.error("Error fetching requests:", error);
      setEvents([]);
    }
  };

  const handleAction = async (action, index) => {
    setLoadingIndexes((prevState) => ({
      ...prevState,
      [index]: action,
    }));

    let event = events[index];
    let enroller_principal = event?.enroller_principal;
    let cohortId = event?.cohort_details?.cohort_id;
    let cohort_creator_principal =
      event?.cohort_details?.cohort_creator_principal;

    try {
      let result;
      if (action === "Approve") {
        result = await actor.approve_enrollment_request(
          cohortId,
          enroller_principal
        );
        event.status = "approved";
      } else if (action === "Reject") {
        result = await actor.reject_enrollment_request(
          cohort_creator_principal,
          enroller_principal
        );
        event.status = "rejected";
      }

      setEvents((prevEvents) =>
        prevEvents.map((ev, i) =>
          i === index ? { ...ev, status: event.status } : ev
        )
      );

      toast.success(result);
    } catch (error) {
      console.error("Failed to process the decision: ", error);
    } finally {
      setLoadingIndexes((prevState) => ({
        ...prevState,
        [index]: null,
      }));
    }
  };

  // Fetch requests only when the apply button is clicked
  useEffect(() => {
    if (actor && principal) {
      fetchRequests(appliedCategory, appliedType);
    }
  }, [actor, principal, appliedCategory, appliedType]);

  return (
    <>
      <div className="flex gap-3 items-center py-2 justify-between relative">
        <div className="flex items-center border-2 border-gray-400 rounded-lg overflow-hidden w-full h-[50px]">
          <input
            type="text"
            placeholder="Search people, projects, jobs, events"
            className="w-full py-2 px-4 text-gray-700 focus:outline-none"
          />
          <div className="px-4">
            <FaFilter
              className="text-gray-400 text-2xl cursor-pointer"
              onClick={toggleFilter}
            />
          </div>
        </div>
      </div>

      {filterOpen && (
        <div
          className={`fixed top-0 right-0 inset-0 z-50 transition-opacity duration-700 ease-in-out ${
            filterOpen ? "opacity-100 bg-opacity-30" : "opacity-0 bg-opacity-0"
          } bg-black backdrop-blur-xs`}
        >
          <div
            className={`transition-transform duration-300 ease-in-out transform ${
              filterOpen ? "translate-x-0" : "translate-x-full"
            } mx-auto w-[25%] absolute right-0 top-0 z-10 bg-white h-screen flex flex-col`}
          >
            <div className="p-5 flex justify-start">
              <CloseIcon sx={{ cursor: "pointer" }} onClick={toggleFilter} />
            </div>
            <div className="container p-5 flex-grow">
              <h3 className="mb-4 text-lg font-semibold">Filters</h3>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Category
                </label>
                <div className="flex flex-col gap-2">
                  <label>
                    <input
                      type="radio"
                      name="category"
                      value="project_data"
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="h-4 w-4 text-blue-600 form-radio checked:bg-blue-600 border border-black rounded-full cursor-pointer mr-2"
                    />
                    Project
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="category"
                      value="vc_data"
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="h-4 w-4 text-blue-600 form-radio checked:bg-blue-600 border border-black rounded-full cursor-pointer mr-2"
                    />
                    Investor
                  </label>
                  <label>
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
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Types
                </label>
                <select
                  onChange={(e) => setSelectedType(e.target.value)}
                  value={selectedType}
                  className="block w-full bg-white border border-gray-300 rounded-md shadow-sm focus:border-gray-400 focus:ring focus:ring-opacity-50 px-3 py-2"
                >
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Accepted</option>
                  <option value="declined">Rejected</option>
                </select>
              </div>
            </div>
            <div className="p-5">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                onClick={handleApply}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {events.length > 0 ? (
        events.map((event, index) => {
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
          const profileImageSrc = event.enroller_data.user_data[0]?.params
            .profile_picture[0]
            ? uint8ArrayToBase64(
                event.enroller_data.user_data[0]?.params.profile_picture[0]
              )
            : ProfileImage;
          const fullname = event.enroller_data.user_data[0]?.params.full_name;
          const username =
            event.enroller_data.user_data[0]?.params.openchat_username[0] || "";
          const location = event.enroller_data.user_data[0]?.params.country;
          const interests =
            event.enroller_data.user_data[0]?.params.area_of_interest;
          const about = event.enroller_data.user_data[0]?.params.bio;
          const email = event.enroller_data.user_data[0]?.params.email;
          const reason =
            event.enroller_data.user_data[0]?.params.reason_to_join;

          const userData = {
            profileImage: profileImageSrc,
            fullname,
            username,
            location,
            reason: [reason],
            interests: [interests],
            email,
            about,
            linkedin: "",
            github: "",
            telegram: "",
          };

          return (
            <div key={index} className="bg-white rounded-lg shadow p-4 mb-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3 relative">
                  <div className="w-[272px] h-[230px]">
                    <div
                      className="max-w-[230px] w-[230px] bg-gray-100 rounded-lg flex flex-col justify-between h-full relative overflow-hidden"
                      onClick={() => handleCardClick(userData)}
                    >
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
                            src={profileImageSrc}
                            alt={title}
                            className="w-24 h-24 rounded-full object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mt-2">{title}</h3>
                    <span className="flex py-2">
                      <Avatar
                        alt="Mentor"
                        src={profileImageSrc}
                        className=" mr-2"
                        sx={{ width: 24, height: 24 }}
                      />
                      <span className="text-gray-500">{fullname}</span>
                    </span>
                    <div className="border-t border-gray-200 mt-2"></div>
                    <p
                      className="text-sm text-gray-500 overflow-hidden text-ellipsis break-all line-clamp-3 mt-2"
                      style={{ maxHeight: "3em", lineHeight: "1em" }}
                    >
                      {parse(description)}
                    </p>
                    <div className="flex flex-wrap gap-3 items-center mt-2">
                      <div className="flex items-center mt-2">
                        <img
                          src={PriceIcon}
                          alt="Funding Amount"
                          className="w-4 h-4 text-gray-400 mr-2"
                        />
                        <span className="text-gray-500">{fundingAmount}</span>
                      </div>
                      <span className="flex items-center mt-2 text-gray-700">
                        <PlaceOutlinedIcon className="" fontSize="small" />
                        {country}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3 items-center mt-2">
                      <div className="flex flex-wrap gap-2">
                        {tags?.split(",").map((interest, index) => (
                          <span
                            key={index}
                            className="border-2 border-gray-500 rounded-full text-gray-700 text-xs px-2 py-1"
                          >
                            {interest.trim()}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex py-2">
                      {appliedType === "pending" &&
                        event.status === "pending" && (
                          <>
                            <button
                              className="mr-2 mb-2 border border-[#097647] bg-[#EBFDF3] text-[#097647] px-3 py-1 rounded-full"
                              // onClick={() => handleAction("Approve", index)}
                              disabled={loadingIndexes[index] === "Approve"}
                            >
                              Accept
                              {loadingIndexes[index] === "Approve" && (
                                <ThreeDots
                                  visible={true}
                                  height="10"
                                  width="20"
                                  color="#FFFFFF"
                                  radius="8"
                                  ariaLabel="three-dots-loading"
                                  wrapperStyle={{}}
                                  wrapperclassName=""
                                />
                              )}
                            </button>
                            <button
                              className="mr-2 mb-2 border border-[#C11574] bg-[#FDF2FA] text-[#C11574] px-3 py-1 rounded-full"
                              // onClick={() => handleAction("Reject", index)}
                              disabled={loadingIndexes[index] === "Reject"}
                            >
                              Reject
                              {loadingIndexes[index] === "Reject" && (
                                <ThreeDots
                                  visible={true}
                                  height="15"
                                  width="20"
                                  color="#FFFFFF"
                                  radius="8"
                                  ariaLabel="three-dots-loading"
                                  wrapperStyle={{}}
                                  wrapperclassName=""
                                />
                              )}
                            </button>
                          </>
                        )}
                      {appliedType === "approved" && (
                        <button className="bg-[#ECFDF3] border-2 border-[#ABEFC6] text-[#067647] rounded-lg px-2 py-1">
                          Approved
                        </button>
                      )}
                      {event.status === "rejected" && (
                        <button className="bg-[#FDF2FA] border-2 text-[#C11574] border-[#FCCEEE] rounded-lg px-2 py-1">
                          Rejected
                        </button>
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

      {openUserModal && (
        <UserModal
          openDetail={openUserModal}
          setOpenDetail={handleCloseModal}
          userData={selectedUserData}
        />
      )}
    </>
  );
};

export default EventRequestCard;

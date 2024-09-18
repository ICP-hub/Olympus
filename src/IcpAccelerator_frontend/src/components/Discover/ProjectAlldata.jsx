import React, { useState, useEffect } from "react";
// import { IcpAccelerator_backend } from "../../../../declarations/IcpAccelerator_backend/index";
import { IcpAccelerator_backend } from "../../../../declarations/IcpAccelerator_backend/index";
import { useDispatch, useSelector } from "react-redux";
import { FavoriteBorder, LocationOn, Star } from "@mui/icons-material";
import CypherpunkLabLogo from "../../../assets/Logo/CypherpunkLabLogo.png";
import uint8ArrayToBase64 from "../Utils/uint8ArrayToBase64";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import { BsFillSendPlusFill } from "react-icons/bs";
import { IoSendSharp } from "react-icons/io5";
import { RiSendPlaneLine } from "react-icons/ri";
import { Tooltip } from "react-tooltip";
import { Principal } from "@dfinity/principal";
import toast, { Toaster } from "react-hot-toast";
import Avatar from "@mui/material/Avatar";

import UserDetailPage from "../Dashboard/DashboardHomePage/UserDetailPage";
import AddAMentorRequestModal from "../../models/AddAMentorRequestModal";
import { mentorRegisteredHandlerRequest } from "../StateManagement/Redux/Reducers/mentorRegisteredData";
import RatingModal from "../Common/RatingModal";
import { bufferToImageBlob } from "../Utils/formatter/bufferToImageBlob";
import parse from "html-react-parser";
import InfiniteScroll from "react-infinite-scroll-component";
import NoData from "../NoDataCard/NoData";
const DiscoverProject = ({ onProjectCountChange }) => {
  const actor = useSelector((currState) => currState.actors.actor);
  const [allProjectData, setAllProjectData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [userData, setUserData] = useState([]);
  const [cardDetail, setCadDetail] = useState(null);
  const [principal, setprincipal] = useState(null);
  const [listProjectId, setListProjectId] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [userDataToSend, setUserDataToSend] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPrincipal, setCurrentPrincipal] = useState([]);
  const [userRatingDetail, setUserRatingDetail] = useState(null);

  const mentorPrincipal = useSelector(
    (currState) => currState.internet.principal
  );

  const userCurrentRoleStatusActiveRole = useSelector(
    (currState) => currState.currentRoleStatus.activeRole
  );
  const isAuthenticated = useSelector(
    (currState) => currState.internet.isAuthenticated
  );
  const dispatch = useDispatch();

  const mentorFullData = useSelector(
    (currState) => currState.mentorData.data[0]
  );
  const mentorId = mentorFullData;
  console.log("mentorId", mentorId);
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(mentorRegisteredHandlerRequest());
    }
  }, [isAuthenticated, dispatch]);
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);

  const handleProjectCloseModal = () => setIsAddProjectModalOpen(false);
  const handleProjectOpenModal = (val) => {
    setListProjectId(val);
    setIsAddProjectModalOpen(true);
  };

  console.log("listProjectId", listProjectId);
  // ASSOCIATE IN A PROJECT HANDLER AS A MENTOR
  const handleAddProject = async ({ message }) => {
    setIsSubmitting(true);
    console.log("add into a project");
    if (actor && mentorPrincipal) {
      let project_id = listProjectId;
      let msg = message;
      let mentor_id = Principal.fromText(mentorPrincipal);
      console.log("Data before sending", project_id, msg, mentor_id);

      await actor
        .send_offer_to_project_by_mentor(project_id, msg, mentor_id)
        .then((result) => {
          console.log("result-in-send_offer_to_project_by_mentor", result);
          if (result) {
            handleProjectCloseModal();
            setIsSubmitting(false);
            toast.success("offer sent to project successfully");
          } else {
            handleProjectCloseModal();
            setIsSubmitting(false);
            toast.error("something got wrong");
          }
        })
        .catch((error) => {
          console.log("error-in-send_offer_to_project_by_mentor", error);
          setIsSubmitting(false);
          handleProjectCloseModal();
          toast.error("something got wrong");
        });
    }
  };

  const [isAddProjectModalOpenAsInvestor, setIsAddProjectModalOpenAsInvestor] =
    useState(false);

  const handleProjectCloseModalAsInvestor = () => {
    setIsAddProjectModalOpenAsInvestor(false);
  };
  const handleProjectOpenModalAsInvestor = (val) => {
    setListProjectId(val);
    setIsAddProjectModalOpenAsInvestor(true);
  };

  // ASSOCIATE IN A PROJECT HANDLER AS A Investor
  const handleAddProjectAsInvestor = async ({ message }) => {
    setIsSubmitting(true);
    console.log("add into a project AS INVESTOR");
    if (actor && principal) {
      let project_id = listProjectId;
      let msg = message;

      await actor
        .send_offer_to_project_by_investor(project_id, msg)
        .then((result) => {
          console.log("result-in-send_offer_to_project_by_investor", result);
          if (result) {
            handleProjectCloseModalAsInvestor();
            setIsSubmitting(false);
            fetchProjectData();
            toast.success("offer sent to project successfully");
          } else {
            handleProjectCloseModalAsInvestor();
            setIsSubmitting(false);
            toast.error("something got wrong");
          }
        })
        .catch((error) => {
          console.log("error-in-send_offer_to_project_by_investor", error);
          handleProjectCloseModalAsInvestor();
          setIsSubmitting(false);
          toast.error("something got wrong");
        });
    }
  };

  const getAllProject = async (caller, page, isRefresh = false) => {
    console.log(`Fetching projects for page: ${page}`);
    setIsFetching(true);

    try {
      const result = await caller.list_all_projects_with_pagination({
        page_size: itemsPerPage,
        page: page,
      });
      if (result && result.data) {
        const ProjectData = Object.values(result.data);
        if (isRefresh) {
          console.log("Refresh", "true");
          setAllProjectData(ProjectData); // Replace with refreshed data
          onProjectCountChange(ProjectData.length); // Update user count
        } else {
          console.log("Refresh", "false");
          setAllProjectData((prevData) => [...prevData, ...ProjectData]);
          const newTotal = allProjectData.length + ProjectData.length;
          onProjectCountChange(newTotal);
        }
        if (ProjectData.length < itemsPerPage) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      setHasMore(false);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (!isFetching && hasMore && actor) {
      getAllProject(actor, currentPage); // Fetch data
    }
  }, [actor, currentPage, hasMore]);

  const loadMore = () => {
    if (!isFetching && hasMore) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage); 
      getAllProject(actor, newPage);
    }
  };

  const [openDetail, setOpenDetail] = useState(false);

  const handleClick = (principal, user) => {
    setprincipal(principal);
    setOpenDetail(true);
    setUserDataToSend(user);
    console.log("passed principle", principal);
  };
  const handleRating = (ratings, principalId) => {
    setShowRatingModal(true);
    setUserRatingDetail(ratings);
    setCurrentPrincipal(principalId);
  };
  async function convertBufferToImageBlob(buffer) {
    try {
      // Assuming bufferToImageBlob returns a Promise
      const blob = await bufferToImageBlob(buffer);
      return blob;
    } catch (error) {
      console.error("Error converting buffer to image blob:", error);
      throw error; // Re-throw the error to be handled by the caller
    }
  }

  // Usage:
  async function handleProfilePicture(profilePicture) {
    try {
      const blob = await convertBufferToImageBlob(profilePicture);
      setImagePreview(blob);
    } catch (error) {
      // Handle any errors
      console.error("Error handling profile picture:", error);
    }
  }
  return (
    <div id="scrollableDiv" style={{ height: "80vh", overflowY: "auto" }}>
      {allProjectData.length > 0 ? (
        <InfiniteScroll
          dataLength={allProjectData.length}
          next={loadMore}
          hasMore={hasMore}
          loader={<h4>Loading more...</h4>}
          endMessage={
            <p className="flex justify-center">No more data available...</p>
          }
          scrollableTarget="scrollableDiv"
        >
          {allProjectData?.map((projectArray, index) => {
            const project_id = projectArray[1]?.params?.uid;
            const project = projectArray[1];
            const user = projectArray[2];
            let profile = user?.profile_picture[0]
              ? uint8ArrayToBase64(user?.profile_picture[0])
              : "../../../assets/Logo/CypherpunkLabLogo.png";
            const projectlogo = project.params.params.project_logo[0]
              ? uint8ArrayToBase64(project.params.params.project_logo[0])
              : CypherpunkLabLogo;
            const projectname = project.params.params.project_name;
            const projectdescription =
              project.params.params.project_description[0];
            let full_name = user?.full_name;
            let openchat_name = user?.openchat_username[0] ?? "N/A";
            let country = user?.country;
            let bio = user?.bio[0];
            let email = user?.email[0];
            const randomSkills = user?.area_of_interest
              .split(",")
              ?.map((skill) => skill.trim());
            const activeRole = project?.roles?.find(
              (role) => role.status === "approved"
            );

            const principle_id = projectArray[0];
            return (
              <div
                className="md:p-6 my-10 md:my-0 w-full md:w-[750px] rounded-lg shadow-sm mb-4 flex flex-col md:flex-row"
                key={index}
              >
                <div className="w-full md:w-[272px] relative">
                  <div
                    onClick={() => handleClick(principle_id, user)}
                    className="w-full md:max-w-[250px] md:w-[250px] h-[254px] bg-gray-100 rounded-lg flex flex-col justify-between relative overflow-hidden"
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <img
                        src={projectlogo || CypherpunkLabLogo} // Placeholder logo image
                        alt={full_name ?? "Project"}
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    </div>
                  </div>
                  <div
                    onClick={() => handleRating(user, principle_id)}
                    className="absolute cursor-pointer bottom-0 right-[6px] flex items-center bg-gray-100 p-1"
                  >
                    <Star className="text-yellow-400 w-4 h-4" />
                    <span className="text-sm font-medium">Rate Us</span>
                  </div>
                </div>

                <div className="flex-grow mt-5 md:mt-0 md:ml-[25px] w-full md:w-[544px]">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div>
                        <h3 className="text-xl font-bold">{projectname}</h3>
                        <span className="flex py-2">
                          <Avatar
                            alt="Mentor"
                            src={profile}
                            className=" mr-2"
                            sx={{ width: 24, height: 24 }}
                          />
                          <span className="text-gray-500">{full_name}</span>
                        </span>
                        {/* <span className="text-gray-500">@{openchat_name}</span> */}
                      </div>
                      {/* <h3 className="text-xl font-bold">{projectname}</h3> */}
                      {/* <h3 className="text-xl font-bold">{full_name}</h3> */}
                      {/* <p className="text-gray-500">@{openchat_name}</p> */}
                    </div>
                    {userCurrentRoleStatusActiveRole === "mentor" ||
                    userCurrentRoleStatusActiveRole === "vc" ? (
                      <button
                        data-tooltip-id="registerTip"
                        onClick={() => {
                          if (userCurrentRoleStatusActiveRole === "mentor") {
                            handleProjectOpenModal(project_id);
                          } else if (userCurrentRoleStatusActiveRole === "vc") {
                            handleProjectOpenModalAsInvestor(project_id);
                          }
                        }}
                      >
                        <RiSendPlaneLine />
                        <Tooltip
                          id="registerTip"
                          place="top"
                          effect="solid"
                          className="rounded-full z-10"
                        >
                          Send Association Request
                        </Tooltip>
                      </button>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="bg-[#daebf3] border-[#70b2e9] border text-[#144579] rounded-md text-xs px-3 py-1 mr-2 mb-2 w-[4.9rem]">
                    PROJECT
                  </div>
                  <div className="border-t border-gray-200 mt-3"></div>

                  <div className="mb-2">
                    {activeRole && (
                      <span
                        key={index}
                        className={`inline-block ${
                          tagColors[activeRole.name] ||
                          "bg-gray-100 text-gray-800"
                        } text-xs px-3 py-1 rounded-full mr-2 mb-2`}
                      >
                        {activeRole.name}
                      </span>
                    )}
                  </div>

                  {/* <div className="border-t border-gray-200 my-3">{email}</div> */}

                  <p className="text-gray-600 mb-4 line-clamp-3  ">
                    {" "}
                    {parse(projectdescription)}
                  </p>
                  <div className="flex items-center text-sm text-gray-500 flex-wrap">
                    {randomSkills?.map((skill, index) => (
                      <span
                        key={index}
                        className="mr-2 mb-2 border boder-[#CDD5DF] bg-white text-[#364152] px-3 py-1 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}

                    <span className="mr-2 mb-2 flex text-[#121926] items-center">
                      <PlaceOutlinedIcon className="text-[#364152] mr-1 w-4 h-4" />
                      {country}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </InfiniteScroll>
      ) : (
        <div className="flex justify-center items-center">
          <NoData message={"No Projects Posted Yet"} />
        </div>
      )}
      {showRatingModal && (
        <RatingModal
          showRating={showRatingModal}
          setShowRatingModal={setShowRatingModal}
          userRatingDetail={userRatingDetail}
          cardPrincipal={currentPrincipal}
        />
      )}
      {isAddProjectModalOpen && (
        <AddAMentorRequestModal
          title={"Associate Project"}
          onClose={handleProjectCloseModal}
          onSubmitHandler={handleAddProject}
          isSubmitting={isSubmitting}
        />
      )}
      {isAddProjectModalOpenAsInvestor && (
        <AddAMentorRequestModal
          title={"Associate Project"}
          onClose={handleProjectCloseModalAsInvestor}
          onSubmitHandler={handleAddProjectAsInvestor}
          isSubmitting={isSubmitting}
        />
      )}
      <Toaster />
      {openDetail && (
        <UserDetailPage
          openDetail={openDetail}
          setOpenDetail={setOpenDetail}
          principal={principal}
          userData={userDataToSend}
        />
      )}
    </div>
  );
};

export default DiscoverProject;

import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { IcpAccelerator_backend } from "../../../../declarations/IcpAccelerator_backend/index";
import { useDispatch, useSelector } from "react-redux";
import { Star } from "@mui/icons-material";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import uint8ArrayToBase64 from "../Utils/uint8ArrayToBase64";
import { Principal } from "@dfinity/principal";
import { RiSendPlaneLine } from "react-icons/ri";
import AddAMentorRequestModal from "../../models/AddAMentorRequestModal";
import toast, { Toaster } from "react-hot-toast";
import { founderRegisteredHandlerRequest } from "../StateManagement/Redux/Reducers/founderRegisteredData";
import { Tooltip } from "react-tooltip";
import DiscoverMentorMain from "../Dashboard/DashboardHomePage/discoverMentor/DiscoverMentorMain";
import RatingModal from "../Common/RatingModal";

const DiscoverMentor = ({onMentorCountChange}) => {
  const actor = useSelector((currState) => currState.actors.actor);
  const isAuthenticated = useSelector(
    (currState) => currState.internet.isAuthenticated
  );
  const [mentorCount, setMentorCount] = useState(0);
  const [allMentorData, setMentorData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const itemsPerPage = 10; // Updated to fetch 10 items per page
  const [currentPage, setCurrentPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const [sendprincipal, setSendprincipal] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [isAddMentorModalOpen, setIsAddMentorModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mentorId, setMentorId] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [userRatingDetail,setUserRatingDetail]=useState(null)

  const dispatch = useDispatch();
  const userCurrentRoleStatusActiveRole = useSelector(
    (currState) => currState.currentRoleStatus.activeRole
  );

  console.log("my mentor data ", allMentorData);
  const projectFullData = useSelector(
    (currState) => currState.projectData.data
  );
  const projectId = projectFullData?.[0]?.[0]?.uid;

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(founderRegisteredHandlerRequest());
    }
  }, [isAuthenticated, dispatch]);

  const getAllMentor = async (caller, page) => {
    setIsFetching(true);
    try {
      const result = await caller.get_all_mentors_with_pagination({
        page_size: itemsPerPage,
        page: page,
      });

      // {result?.data.map(val=>{
      //   setSendprincipal(val[0])
      // })}
      console.log("result =>", result?.data);

      if (result && result.data) {
        const mentorData = Object.values(result.data);
        const userData = Object.values(result.user_data || {});

        if (mentorData.length === 0) {
          setHasMore(false); // No more data to load
        } else {
          setMentorData((prevData) => {
            const newData = [...prevData, ...mentorData];
            onMentorCountChange(newData.length>0?newData.length:0); // Update count using the length of the data array
            return newData;
          });
          setUserData((prevData) => [...prevData, ...userData]);

          // If fewer items than expected are returned, stop further requests
          if (mentorData.length < itemsPerPage) {
            setHasMore(false);
          }
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("error-in-get-all-mentor", error);
      setHasMore(false);
    } finally {
      setIsFetching(false);
    }
  };

  console.log("send", sendprincipal);

  useEffect(() => {
    if (!isFetching && hasMore) {
      if (actor) {
        getAllMentor(actor, currentPage);
      } else {
        getAllMentor(IcpAccelerator_backend, currentPage);
      }
    }
  }, [actor, currentPage]);

  const loadMore = () => {
    if (!isFetching && hasMore) {
      setCurrentPage((prevPage) => {
        const newPage = prevPage + 1;
        getAllMentor(actor, newPage); // Fetch data for the next page
        return newPage;
      });
    }
  };
  const refresh = () => {
    if (actor) {
      getAllMentor(actor, 1); // Fetch the data starting from the first page
    }
  };
  const tagColors = {
    mentor: "bg-[#EEF4FF] border-[#C7D7FE] border text-[#3538CD] rounded-md",
    project: "bg-[#F8FAFC] text-[#364152] border border-[#E3E8EF] rounded-md",
    vc: "bg-[#FFFAEB] border-[#FEDF89] border text-[#B54708] rounded-md",
    TALENT: "bg-[#ECFDF3] border-[#ABEFC6] border text-[#067647] rounded-md",
  };

  const tags = ["OLYMPIAN", "FOUNDER", "TALENT", "INVESTER", "PROJECT"];
  const getRandomTags = () => {
    const shuffledTags = tags.sort(() => 0.5 - Math.random());
    return shuffledTags.slice(0, 2);
  };

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
    if (actor && mentorId) {
      let mentor_id = Principal.fromText(mentorId);
      let msg = message;
      let project_id = projectId;

      await actor
        .send_offer_to_mentor_from_project(mentor_id, msg, project_id)
        .then((result) => {
          console.log("result", result);
          if (result) {
            setIsSubmitting(false);
            handleMentorCloseModal();
            toast.success(result);
          } else {
            setIsSubmitting(false);
            handleMentorCloseModal();
            toast.error("something went wrong");
          }
        })
        .catch((error) => {
          console.error("error-in-send_offer_to_mentor_from_project", error);
          handleMentorCloseModal();
          setIsSubmitting(false);
          toast.error("something went wrong");
        });
    }
  };

  const handleClick = (principal) => {
    setSendprincipal(principal);
    setOpenDetail(true);
    console.log("passed principle", principal);
  };

  const handleRating=(ratings)=>{
    setShowRatingModal(true)
    setUserRatingDetail(ratings)
  }
  console.log("userRatingDetail =>",userRatingDetail)

  return (
    <>
      <div>
        {allMentorData.length > 0 ? (
          <InfiniteScroll
            dataLength={allMentorData.length}
            next={loadMore}
            hasMore={hasMore}
            loader={<h4>Loading more...</h4>}
            endMessage={<p>No more data available</p>}
            refreshFunction={refresh}
            pullDownToRefresh
            pullDownToRefreshThreshold={50}
            pullDownToRefreshContent={
              <h3 style={{ textAlign: "center" }}>
                &#8595; Pull down to refresh
              </h3>
            }
            releaseToRefreshContent={
              <h3 style={{ textAlign: "center" }}>
                &#8593; Release to refresh
              </h3>
            }
          >
            {allMentorData?.map((mentorArray, index) => {
              const mentor_id = mentorArray[0]?.toText();
              const mentor = mentorArray[1];
              const user = mentorArray[2];

              // if (!mentor || !user) {
              //   return null;
              // }
              console.log("//data1//", mentor);
              console.log("//data2//", user);
              const randomTags = getRandomTags();
              let profile = user?.profile_picture[0]
                ? uint8ArrayToBase64(user?.profile_picture[0])
                : "../../../assets/Logo/CypherpunkLabLogo.png";
              let full_name = user?.full_name;
              let openchat_name = user?.openchat_username;
              let country = user?.country;
              let bio = user?.bio[0];
              let email = user?.email[0];
              const randomSkills = user?.area_of_interest
                .split(",")
                ?.map((skill) => skill.trim());
              const activeRole = mentor?.roles.find(
                (role) => role.status === "approved"
              );

              const principle_id = mentorArray[0];
              console.log("principle", principle_id);
              return (
                <div
                  className="p-6 w-[750px] rounded-lg shadow-sm mb-4 flex"
                  key={index}
                >
                  <div className="w-[272px] relative">
                    <div
                      onClick={() => handleClick(principle_id)}
                      className="max-w-[250px] w-[250px] h-[254px] bg-gray-100 rounded-lg flex flex-col justify-between relative overflow-hidden"
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <img
                          src={profile}
                          alt={full_name ?? "Mentor"}
                          className="w-24 h-24 rounded-full object-cover"
                        />
                      </div>
                    </div>
                    <div  onClick={() => handleRating(user)} className="absolute bottom-0 right-[6px] flex items-center bg-gray-100 p-1">
                        <Star className="text-yellow-400 w-4 h-4" />
                        <span className="text-sm font-medium">5.0</span>
                      </div>
                  </div>
                  <div className="flex-grow ml-[25px] w-[544px]">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-xl font-bold">{full_name}</h3>
                        <p className="text-gray-500">@{openchat_name}</p>
                      </div>
                      {userCurrentRoleStatusActiveRole === "project" ? (
                        <button
                          data-tooltip-id="registerTip"
                          onClick={() => handleMentorOpenModal(mentor_id)}
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
                    <div className="mb-2">
                      {activeRole && (
                        <span
                          className={`inline-block ${
                            tagColors[activeRole.name] ||
                            "bg-gray-100 text-gray-800"
                          } text-xs px-3 py-1 rounded-full mr-2 mb-2`}
                        >
                          {activeRole.name}
                        </span>
                      )}
                    </div>
                    <div className="border-t border-gray-200 my-3">{email}</div>

                    <p className="text-gray-600 mb-4">{bio}</p>
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
          <div>No Data Available</div>
        )}
        {showRatingModal && (
        <RatingModal
          showRating={showRatingModal}
          setShowRatingModal={setShowRatingModal}
          userRatingDetail={userRatingDetail}
        />
      )}
        {isAddMentorModalOpen && (
          <AddAMentorRequestModal
            title={"Associate Mentor"}
            onClose={handleMentorCloseModal}
            onSubmitHandler={handleAddMentor}
            isSubmitting={isSubmitting}
          />
        )}
        {/* {openDetail && <DiscoverMentorMain openDetail={openDetail} setOpenDetail={setOpenDetail}  principal={sendprincipal} />} */}
      </div>
      <Toaster />
      {openDetail && sendprincipal && (
        <DiscoverMentorMain
          openDetail={openDetail}
          setOpenDetail={setOpenDetail}
          principal={sendprincipal}
        />
      )}
    </>
  );
};

export default DiscoverMentor;

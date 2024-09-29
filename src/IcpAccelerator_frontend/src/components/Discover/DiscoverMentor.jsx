import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch, useSelector } from 'react-redux';
import { Star } from '@mui/icons-material';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import uint8ArrayToBase64 from '../Utils/uint8ArrayToBase64';
import { Principal } from '@dfinity/principal';
import { RiSendPlaneLine } from 'react-icons/ri';
import AddAMentorRequestModal from '../../models/AddAMentorRequestModal';
import toast, { Toaster } from 'react-hot-toast';
import { founderRegisteredHandlerRequest } from '../StateManagement/Redux/Reducers/founderRegisteredData';
import { Tooltip } from 'react-tooltip';
import DiscoverMentorMain from '../Dashboard/DashboardHomePage/discoverMentor/DiscoverMentorMain';
import RatingModal from '../Common/RatingModal';
import NoData from '../NoDataCard/NoData';

const DiscoverMentor = ({ onMentorCountChange }) => {
  const actor = useSelector((currState) => currState.actors.actor);
  const isAuthenticated = useSelector(
    (currState) => currState.internet.isAuthenticated
  );
  const [allMentorData, setAllMentorData] = useState([]);
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
  const [userRatingDetail, setUserRatingDetail] = useState(null);
  const [currentPrincipal, setCurrentPrincipal] = useState([]);

  const dispatch = useDispatch();
  const userCurrentRoleStatusActiveRole = useSelector(
    (currState) => currState.currentRoleStatus.activeRole
  );

  const projectFullData = useSelector(
    (currState) => currState.projectData.data
  );
  const projectId = projectFullData?.[0]?.[0]?.uid;

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(founderRegisteredHandlerRequest());
    }
  }, [isAuthenticated, dispatch]);

  const getAllMentor = async (caller, page, isRefresh = false) => {
    console.log(`Fetching data for page: ${page}`);
    setIsFetching(true); // Set fetching state

    try {
      // Fetch data from the backend
      const result = await caller.get_all_mentors_with_pagination({
        page_size: itemsPerPage, // Number of items per page
        page: page, // Current page to fetch
      });
      console.log('discovementor', result);
      if (result && result.data) {
        const mentorData = Object.values(result.data); // Extract mentor data
        if (isRefresh) {
          console.log('Refresh mode: replacing mentor and user data');
          setAllMentorData(mentorData); // Replace with refreshed mentor data
          onMentorCountChange(mentorData.length); // Update mentor count
        } else {
          console.log('Appending mentor and user data');
          setAllMentorData((prevData) => [...prevData, ...mentorData]); // Append new mentor data
          const newTotal = allMentorData.length + mentorData.length; // Calculate new total
          onMentorCountChange(newTotal); // Update total mentor count
        }
        if (mentorData.length < itemsPerPage) {
          setHasMore(false); // If fetched data is less than itemsPerPage, stop further requests
        }
      } else {
        setHasMore(false); // If no data, stop further requests
      }
    } catch (error) {
      console.error('Error fetching mentors:', error);
      setHasMore(false); // Handle error and stop loading
    } finally {
      setIsFetching(false); // Reset fetching state
    }
  };

  useEffect(() => {
    if (!isFetching && hasMore && actor) {
      console.log(`Current page: ${currentPage}`);
      getAllMentor(actor, currentPage); // Fetch data for mentors
    }
  }, [actor, currentPage, hasMore]);

  // Load more mentor data when scrolling
  const loadMore = () => {
    if (!isFetching && hasMore) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage); // Increment the page number
      getAllMentor(actor, newPage); // Fetch the next set of mentor data
    }
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
          console.log('result', result);
          if (result) {
            setIsSubmitting(false);
            handleMentorCloseModal();
            toast.success(result);
          } else {
            setIsSubmitting(false);
            handleMentorCloseModal();
            toast.error('something went wrong');
          }
        })
        .catch((error) => {
          console.error('error-in-send_offer_to_mentor_from_project', error);
          handleMentorCloseModal();
          setIsSubmitting(false);
          toast.error('something went wrong');
        });
    }
  };

  const handleClick = (principal) => {
    setSendprincipal(principal);
    setOpenDetail(true);
  };

  const handleRating = (ratings, principalId) => {
    setShowRatingModal(true);
    setUserRatingDetail(ratings);
    setCurrentPrincipal(principalId);
  };

  return (
    <>
      <div id='scrollableDiv' style={{ height: '80vh', overflowY: 'auto' }}>
        {allMentorData.length > 0 ? (
          <InfiniteScroll
            dataLength={allMentorData.length}
            next={loadMore}
            hasMore={hasMore}
            loader={<h4>Loading more...</h4>}
            endMessage={
              <p className='flex justify-center'>No more data available...</p>
            }
            scrollableTarget='scrollableDiv'
          >
            {allMentorData?.map((mentorArray, index) => {
              const mentor_id = mentorArray[0]?.toText();
              const mentor = mentorArray[1];
              const user = mentorArray[2];
              let profile = user?.profile_picture[0]
                ? uint8ArrayToBase64(user?.profile_picture[0])
                : '../../../assets/Logo/CypherpunkLabLogo.png';
              let full_name = user?.full_name;
              let openchat_name = user?.openchat_username;
              let country = user?.country;
              let bio = user?.bio[0];
              let email = user?.email[0];
              const randomSkills = user?.area_of_interest
                .split(',')
                ?.map((skill) => skill.trim());
              const activeRole = mentor?.roles.find(
                (role) => role.status === 'approved'
              );

              const principle_id = mentorArray[0];
              return (
                <div
                  className='sm:pr-6 sm:pt-6 sm:pb-6  my-10 md1:my-0 w-full   rounded-lg shadow-sm mb-4 flex flex-col sm:flex-row'
                  key={index}
                >
                  <div className='w-full  sm:w-[272px] relative'>
                    <div
                      onClick={() => handleClick(principle_id)}
                      className='w-full sm:max-w-[250px] sm:w-[250px] h-[254px] bg-gray-100 rounded-lg flex flex-col justify-between relative overflow-hidden'
                    >
                      <div className='absolute inset-0 flex items-center justify-center'>
                        <img
                          src={profile}
                          alt={full_name ?? 'Mentor'}
                          className='w-24 h-24 rounded-full object-cover'
                          loading='lazy'
                          draggable={false}
                        />
                      </div>
                    </div>
                    <div
                      onClick={() => handleRating(user, principle_id)}
                      className='absolute bottom-0 right-[6px] flex items-center bg-gray-100 p-1'
                    >
                      <Star className='text-yellow-400 w-4 h-4' />
                      <span className='text-sm font-medium'>Rate Us</span>
                    </div>
                  </div>
                  <div className='flex-grow sm:ml-[25px] mt-5 md1:mt-0 w-full  '>
                    <div className='flex justify-between items-start mb-2'>
                      <div>
                        <h3 className='text-xl line-clamp-1 break-all font-bold'>
                          {full_name}
                        </h3>
                        <p className='text-gray-500 line-clamp-1 break-all'>
                          @{openchat_name}
                        </p>
                      </div>
                      {userCurrentRoleStatusActiveRole === 'project' ? (
                        <button
                          data-tooltip-id='registerTip'
                          onClick={() => handleMentorOpenModal(mentor_id)}
                        >
                          <RiSendPlaneLine />
                          <Tooltip
                            id='registerTip'
                            place='top'
                            effect='solid'
                            className='rounded-full z-50'
                          >
                            Send Association Request
                          </Tooltip>
                        </button>
                      ) : (
                        ''
                      )}
                    </div>
                    <div className='bg-[#ECFDF3] border-[#ABEFC6] border text-[#067647] rounded-md text-xs px-3 py-1 mr-2 mb-2 w-[4.7rem]'>
                      MENTOR
                      {/* {activeRole && (
                        <span
                          className={`inline-block ${
                            tagColors[activeRole.name] ||
                            "border-2 border-gray-500 rounded-full text-gray-700 text-xs px-3 py-1 bg-gray-100"
                          } text-xs px-3 py-1 rounded-full mr-2 `}
                        >
                          {activeRole.name}
                        </span>
                      )} */}
                    </div>
                    <div className='border-t border-gray-200 my-3 mb-2 break-all line-clamp-1 '>
                      {email}
                    </div>

                    <p className='text-gray-600 mb-2 break-all line-clamp-3'>
                      {bio}
                    </p>
                    <div className='flex items-center text-sm text-gray-500 flex-wrap gap-1'>
                      <div className='flex overflow-x-auto space-x-2'>
                        {randomSkills.map((skill, index) => (
                          <span
                            key={index}
                            className='border-2 border-gray-500 rounded-full text-gray-700 text-xs px-3 py-1 bg-gray-100'
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      <span className='mr-2  flex text-[#121926] items-center py-1'>
                        <PlaceOutlinedIcon className='text-[#364152] mr-1 w-4 h-4' />
                        {country}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </InfiniteScroll>
        ) : (
          <div className='flex justify-center'>
            <NoData message={'No Mentor Present Yet'} />
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
        {isAddMentorModalOpen && (
          <AddAMentorRequestModal
            title={'Associate Mentor'}
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

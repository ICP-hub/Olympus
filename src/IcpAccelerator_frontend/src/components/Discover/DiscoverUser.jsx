import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import { Star } from '@mui/icons-material';
import uint8ArrayToBase64 from '../Utils/uint8ArrayToBase64';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import DiscoverUserModal from '../Dashboard/DashboardHomePage/discoverMentorPage/DiscoverUserModal';
import RatingModal from '../Common/RatingModal';
import InfiniteScroll from 'react-infinite-scroll-component';
import NoData from '../NoDataCard/NoData';
import SpinnerLoader from './SpinnerLoader';
import AOS from 'aos';
import 'aos/dist/aos.css';
import DiscoverSkeleton from './DiscoverSkeleton/DiscoverSkeleton';
import useTimeout from '../hooks/TimeOutHook';
const DiscoverUser = ({ onUserCountChange }) => {
  const actor = useSelector((currState) => currState.actors.actor);
  const [allUserData, setAllUserData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [userRatingDetail, setUserRatingDetail] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [currentPrincipal, setCurrentPrincipal] = useState([]);
  const itemsPerPage = 10;
  useTimeout(() => setIsLoading(false));
  const getAllUser = async (caller, page, isRefresh = false) => {
    try {
      setIsFetching(true); // Set loading state

      // Fetch data from the backend
      const result = await caller.list_all_users({
        page_size: itemsPerPage, // Define the number of items per page (10 in this case)
        page: page, // The current page to fetch
      });

      if (result && result.length > 0) {
        if (isRefresh) {
          console.log('Refresh', 'true');
          setAllUserData(result); // Replace with refreshed data
          onUserCountChange(result.length); // Update user count
        } else {
          console.log('Refresh', 'false');
          setAllUserData((prevData) => [...prevData, ...result]); // Append new data to the existing list
          const newTotal = allUserData.length + result.length; // Calculate total number of users
          onUserCountChange(newTotal); // Update total user count
        }

        if (result.length < itemsPerPage) {
          setHasMore(false); // If the fetched result is less than itemsPerPage, stop further loading
        }
      } else {
        setHasMore(false); // If no result, stop further loading
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsFetching(false); // Reset fetching state
    }
  };
  console.log('allUserData', allUserData);

  useEffect(() => {
    if (!isFetching && hasMore && actor) {
      console.log(`Current page: ${currentPage}`);
      getAllUser(actor, currentPage); // Fetch data
    }
  }, [actor, currentPage, hasMore]);

  // Load more data when scrolling
  const loadMore = () => {
    if (!isFetching && hasMore) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage); // Increment the page number
      getAllUser(actor, newPage); // Fetch the next set of data
    }
  };

  /////////////////////////

  const [openDetail, setOpenDetail] = useState(false);
  const [cardDetail, setCadDetail] = useState(null);
  const handleClick = (user) => {
    setOpenDetail(true);
    setCadDetail(user);
    console.log('cardDetail => ', cardDetail);
  };

  const handleRating = (ratings, principalId) => {
    setShowRatingModal(true);
    setUserRatingDetail(ratings);
    setCurrentPrincipal(principalId);
  };
  console.log('userRatingDetail =>', userRatingDetail);
  // initialize Aos
  useLayoutEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
    });
  }, []);
  return (
    <>
      <div
        id='scrollableDiv'
        style={{ height: '80vh', overflowY: 'auto' }}
        data-aos='fade-up'
      >
        {isLoading ? (
          [...Array(allUserData.length || 5)].map((_, index) => (
            <DiscoverSkeleton key={index} />
          ))
        ) : (
          <InfiniteScroll
            dataLength={allUserData.length}
            next={loadMore}
            hasMore={hasMore}
            loader={
              <>
                <SpinnerLoader />
              </>
            }
            endMessage={
              <p className='flex justify-center'>No more data available...</p>
            }
            scrollableTarget='scrollableDiv'
          >
            {allUserData.length > 0 ? (
              allUserData.map(([principal, user], index) => {
                console.log('discoveruser', user);
                const logo =
                  user.profile_picture && user.profile_picture[0]
                    ? uint8ArrayToBase64(user.profile_picture[0])
                    : 'default-profile.png';

                const full_name = user.full_name || 'Unknown User';
                const bio = user.bio[0] || 'No bio available.';
                const area_of_interest = user.area_of_interest || 'N/A';
                const location = user.country || 'Unknown Location';
                const openchat_username = user.openchat_username[0] || 'N/A';
                const principalId = principal;

                return (
                  <div
                    className='sm:pr-6 sm:pt-6 sm:pb-6 my-10 md1:my-0 w-full  rounded-lg shadow-sm mb-4 flex flex-col sm:flex-row'
                    key={index}
                  >
                    <div className=' w-full sm:w-[272px] relative'>
                      <div
                        onClick={() => handleClick(user)}
                        className='w-full sm:max-w-[250px] sm:w-[250px] h-[254px] bg-gray-100 rounded-lg flex flex-col justify-between overflow-hidden'
                      >
                        <div className='absolute inset-0 flex items-center justify-center'>
                          <img
                            src={logo}
                            alt={full_name}
                            className='w-24 h-24 rounded-full object-cover'
                            loading='lazy'
                            draggable={false}
                          />
                        </div>
                      </div>
                      <div
                        onClick={() => handleRating(user, principalId)}
                        className='absolute cursor-pointer bottom-0 right-[6px] flex items-center bg-gray-100 p-1'
                      >
                        <Star className='text-yellow-400 w-4 h-4' />
                        <span className='text-sm font-medium'>Rate Us</span>
                      </div>
                    </div>
                    <div className='flex-grow mt-5 md1:mt-0 sm:ml-[25px] w-full'>
                      <div className='flex justify-between items-start mb-2'>
                        <div>
                          <h3 className='text-xl font-bold'>{full_name}</h3>
                          <p className='text-gray-500'>@{openchat_username}</p>
                        </div>
                      </div>
                      <div className='bg-[#fff0eb] border-[#f35454] border text-[#090907] rounded-md text-xs px-3 py-1 mr-2 mb-2 w-[3.4rem]'>
                        USER
                      </div>
                      <div className='border-t border-gray-200 my-1'></div>
                      <p className='text-gray-600 mb-4 overflow-hidden text-ellipsis max-h-12 line-clamp-2'>
                        {bio}
                      </p>
                      <div className='flex items-center text-sm text-gray-500 flex-wrap'>
                        <div className='flex flex-wrap'>
                          {area_of_interest
                            .split(',')
                            .map((interest, index) => (
                              <div
                                key={index}
                                className='border-2 border-gray-500 rounded-full text-gray-700 text-xs px-2 py-1 inline-block mr-2 mb-2 mt-1'
                              >
                                <p className='font-medium'>{interest.trim()}</p>
                              </div>
                            ))}
                        </div>
                        <span className='mr-2 mb-2 flex text-[#121926] items-center'>
                          <PlaceOutlinedIcon className='text-[#364152] mr-1 w-4 h-4' />
                          {location}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className='flex justify-center'>
                <NoData message={'No User Listed Yet'} />
              </div>
            )}
          </InfiniteScroll>
        )}
      </div>
      {showRatingModal && (
        <RatingModal
          showRating={showRatingModal}
          setShowRatingModal={setShowRatingModal}
          userRatingDetail={userRatingDetail}
          cardPrincipal={currentPrincipal}
        />
      )}
      {openDetail && (
        <DiscoverUserModal
          openDetail={openDetail}
          setOpenDetail={setOpenDetail}
          userData={cardDetail}
        />
      )}
    </>
  );
};

export default DiscoverUser;

import React, { useEffect, useLayoutEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import { useSelector } from 'react-redux';
import { IcpAccelerator_backend } from '../../../../../declarations/IcpAccelerator_backend/index';
import uint8ArrayToBase64 from '../../Utils/uint8ArrayToBase64';
import { useNavigate } from 'react-router-dom';
import parse from 'html-react-parser';
import images from '../../../../assets/images/bg.png';
import NoData from '../../NoDataCard/NoData';
import { RotatingLines } from 'react-loader-spinner';
import SpinnerLoader from '../../Discover/SpinnerLoader';
import AOS from 'aos';
import 'aos/dist/aos.css';
import EventCardSkeleton from './DashboardEventSkeletons/EventCardSkeleton';
import useTimeout from '../../hooks/TimeOutHook';
const EventCard = ({ selectedEventType }) => {
  const actor = useSelector((currState) => currState.actors.actor);
  const [noData, setNoData] = useState(false);
  const [allLiveEventsData, setAllLiveEventsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSkeletonLoading, setIsSkeletonLoading] = useState(true);
  const [eventCount, setEventCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  console.log('my cohort data lenght', allLiveEventsData.length);
  const navigate = useNavigate();

  const handleClick = (cohort_id) => {
    navigate(`/dashboard/single-event/${cohort_id}`);
  };

  console.log('selectedEventType', selectedEventType);

  const fetchEvents = async (caller, page, isRefresh = false) => {
    setIsLoading(true); // Start loading state
    try {
      const result = await caller.get_all_cohorts({
        page_size: itemsPerPage,
        page: page,
      });
      console.log('result: ', result);
      let filteredEvents = [];
      switch (selectedEventType) {
        case 'Ongoing':
          filteredEvents = result.present_cohorts ?? [];
          break;
        case 'Upcoming':
          filteredEvents = result.upcoming_cohorts ?? [];
          break;
        case 'Past':
          filteredEvents = result.past_cohorts ?? [];
          break;
        case 'All':
        default:
          filteredEvents = result.data ?? [];
          break;
      }

      if (filteredEvents.length > 0) {
        if (isRefresh) {
          setAllLiveEventsData(filteredEvents);
        } else {
          setAllLiveEventsData((prevEvents) => [
            ...prevEvents,
            ...filteredEvents,
          ]);
        }

        if (filteredEvents.length < itemsPerPage) {
          setHasMore(false); // No more data to load
        }
        setEventCount(filteredEvents.length);
      } else {
        setHasMore(false);
        setEventCount(0);
      }

      setNoData(filteredEvents.length === 0);
    } catch (error) {
      console.error('Error in get_all_cohorts:', error);
      setNoData(true);
      setHasMore(false);
    } finally {
      setIsLoading(false); // End loading state
    }
  };
  useEffect(() => {
    if (!isLoading && hasMore && actor) {
      fetchEvents(actor, currentPage).finally(() => {});
    }
  }, [actor, currentPage, hasMore, selectedEventType]);
  useTimeout(() => setIsSkeletonLoading(false));
  const loadMore = () => {
    if (!isLoading && hasMore) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage); // Increment the page number
      fetchEvents(actor, newPage); // Fetch the next set of data
    }
  };
  console.log('allLiveEventsData', allLiveEventsData);
  // initialize Aos
  useLayoutEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
    });
  }, []);
  return (
    <div
      id='scrollableDiv'
      style={{ height: '80vh', overflowY: 'auto' }}
      data-aos='fade-up'
    >
      {isSkeletonLoading ? (
        Array.from({ length: eventCount }).map((_, index) => (
          <EventCardSkeleton key={index} />
        ))
      ) : allLiveEventsData.length > 0 ? (
        <InfiniteScroll
          dataLength={allLiveEventsData.length}
          next={loadMore}
          hasMore={hasMore}
          loader={
            <>
              {' '}
              <SpinnerLoader />
            </>
          }
          endMessage={<p>No more data available</p>}
          scrollableTarget='scrollableDiv'
        >
          {allLiveEventsData.map((data, index) => {
            const image = data?.cohort?.cohort_banner[0]
              ? uint8ArrayToBase64(data?.cohort?.cohort_banner[0])
              : images;
            const name = data?.cohort?.title ?? 'No Title...';
            const launch_date = data?.cohort?.cohort_launch_date
              ? new Date(data.cohort.cohort_launch_date).toLocaleDateString(
                  'en-US',
                  {
                    month: 'short',
                    day: 'numeric',
                  }
                )
              : '';
            const end_date = data?.cohort?.cohort_end_date
              ? new Date(data.cohort.cohort_end_date).toLocaleDateString(
                  'en-US',
                  {
                    month: 'short',
                    day: 'numeric',
                  }
                )
              : '';
            const desc = data?.cohort?.description ?? '';
            const country = data?.cohort?.country ?? '';
            const funding = data?.cohort?.funding_amount ?? '';

            return (
              <div
                key={index}
                className='bg-white rounded-lg shadow p-4 mb-6'
                onClick={() => handleClick(data.cohort_id)}
              >
                <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center'>
                  <div className='relative w-full sm:flex items-start sm:items-center gap-3'>
                    <div className='absolute top-1 left-1 bg-white p-2 rounded-lg max-w-[122px] sm:max-w-[160px]'>
                      <p className='text-sm sm:text-base font-bold'>
                        {launch_date} – {end_date}
                      </p>
                      <p className='text-xs sm:text-sm font-normal'>
                        Start at:{' '}
                        {new Date(data?.cohort?.start_date).toLocaleDateString(
                          'en-US'
                        )}
                      </p>
                    </div>
                    <div className='w-full sm:w-[240px] h-[140px] sm:h-[172px] flex-shrink-0'>
                      <img
                        src={image}
                        alt={name}
                        className='w-full h-full rounded-lg object-cover object-center'
                        loading='lazy'
                        draggable={false}
                      />
                    </div>
                    <div className='w-full sm:w-2/3 mt-4 sm:mt-0'>
                      <div>
                        <div className='bg-[#c8eaef] border-[#45b0c1] border text-[#090907] text-xs px-2 py-1 rounded-full w-[70px]'>
                          COHORT
                        </div>
                        <h3 className='text-lg font-bold mt-2'>{name}</h3>
                        <p className='text-sm text-gray-500 mb-4 overflow-hidden text-ellipsis max-h-12 line-clamp-2 mt-2'>
                          {parse(desc)}
                        </p>
                      </div>
                      <div className='flex gap-3 items-center mt-2 sm:mt-0'>
                        <span className='text-sm text-[#121926] flex items-center'>
                          <PlaceOutlinedIcon
                            className='text-[#364152]'
                            fontSize='small'
                          />
                          {country}
                        </span>
                        <span className='text-sm text-[#121926]'>
                          ${funding}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </InfiniteScroll>
      ) : (
        <div className='flex justify-center items-center'>
          {isLoading ? (
            <div className='flex justify-center items-center w-full'>
              <RotatingLines
                visible={true}
                height='96'
                width='96'
                color='grey'
                strokeWidth='5'
                animationDuration='0.75'
                ariaLabel='rotating-lines-loading'
                wrapperStyle={{}}
                wrapperClass=''
              />
            </div>
          ) : (
            <NoData message={'No Cohort Available'} />
          )}
        </div>
      )}
    </div>
  );
};

export default EventCard;

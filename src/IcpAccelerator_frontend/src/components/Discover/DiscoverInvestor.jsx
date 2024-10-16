import React, { useState, useEffect, useLayoutEffect } from 'react';
import { IcpAccelerator_backend } from '../../../../declarations/IcpAccelerator_backend/index';
import { useDispatch, useSelector } from 'react-redux';
import { Star } from '@mui/icons-material';
import InfiniteScroll from 'react-infinite-scroll-component';
import uint8ArrayToBase64 from '../Utils/uint8ArrayToBase64';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import toast, { Toaster } from 'react-hot-toast';
import { RiSendPlaneLine } from 'react-icons/ri';
import { founderRegisteredHandlerRequest } from '../StateManagement/Redux/Reducers/founderRegisteredData';
import { Tooltip } from 'react-tooltip';
import AddAMentorRequestModal from '../../models/AddAMentorRequestModal';
import { Principal } from '@dfinity/principal';
import DiscoverInvestorPage from '../Dashboard/DashboardHomePage/DiscoverInvestor/DiscoverInvestorPage';
import RatingModal from '../Common/RatingModal';
import NoData from '../NoDataCard/NoData';
import SpinnerLoader from './SpinnerLoader';
import AOS from 'aos';
import 'aos/dist/aos.css';
import DiscoverSkeleton from './DiscoverSkeleton/DiscoverSkeleton';
import useTimeout from '../hooks/TimeOutHook';
const DiscoverInvestor = ({ onInvestorCountChange }) => {
  const actor = useSelector((currState) => currState.actors.actor);
  const [allInvestorData, setAllInvestorData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [userData, setUserData] = useState([]);
  const [sendprincipal, setSendprincipal] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [isAddInvestorModalOpen, setIsAddInvestorModalOpen] = useState(false);
  const [investorId, setInvestorId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [userRatingDetail, setUserRatingDetail] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [currentPrincipal, setCurrentPrincipal] = useState([]);

  const isAuthenticated = useSelector(
    (currState) => currState.internet.isAuthenticated
  );
  const userCurrentRoleStatusActiveRole = useSelector(
    (currState) => currState.currentRoleStatus.activeRole
  );
  const dispatch = useDispatch();

  const projectFullData = useSelector(
    (currState) => currState.projectData.data
  );
  const projectId = projectFullData?.[0]?.[0]?.uid;

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(founderRegisteredHandlerRequest());
    }
  }, [isAuthenticated, dispatch]);
  const handleInvestorCloseModal = () => {
    setInvestorId(null);
    setIsAddInvestorModalOpen(false);
  };
  const handleInvestorOpenModal = (val) => {
    setInvestorId(val);
    setIsAddInvestorModalOpen(true);
  };

  const handleAddInvestor = async ({ message }) => {
    setIsSubmitting(true);
    console.log('add a investor');
    if (actor && investorId) {
      let investor_id = Principal.fromText(investorId);
      let msg = message;
      let project_id = projectId;
      let is_cohort_association = false;
      let cohort_id = [];
      await actor
        .send_offer_to_investor_by_project(
          investor_id,
          msg,
          project_id,
          is_cohort_association,
          cohort_id
        )
        .then((result) => {
          console.log('result-in-send_offer_to_investor', result);
          if (result) {
            handleInvestorCloseModal();
            setIsSubmitting(false);
            toast.success(result);
          } else {
            handleInvestorCloseModal();
            setIsSubmitting(false);
            toast.error('something got wrong');
          }
        })
        .catch((error) => {
          console.log('error-in-send_offer_to_investor', error);
          handleInvestorCloseModal();
          setIsSubmitting(false);
          toast.error('something got wrong');
        });
    }
  };
  useTimeout(() => setIsLoading(false));
  const getAllInvestor = async (caller, page, isRefresh = false) => {
    setIsFetching(true);
    try {
      const result = await caller.list_all_vcs_with_pagination({
        page_size: itemsPerPage,
        page: page,
      });
      {
        result?.data?.map((val) => {
          setSendprincipal(val[0]);
        });
      }
      const InvestorData = Object.values(result?.data || []);
      if (InvestorData.length > 0) {
        if (isRefresh) {
          setAllInvestorData(InvestorData);
          onInvestorCountChange(InvestorData.length);
        } else {
          setAllInvestorData((prevData) => [...prevData, ...InvestorData]);
          const newTotal = allInvestorData.length + InvestorData.length;
          onInvestorCountChange(newTotal);
        }
        if (InvestorData.length < itemsPerPage) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('error-in-get-all-investor', error);
      setHasMore(false);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (!isFetching && hasMore && actor) {
      getAllInvestor(actor, currentPage); // Fetch data
    }
  }, [actor, currentPage, hasMore]);

  const loadMore = () => {
    if (!isFetching && hasMore) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage); // Increment the page number
      getAllInvestor(actor, newPage); // Fetch next set of data
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
          <>
            {[...Array(allInvestorData.length)].map((_, index) => (
              <DiscoverSkeleton key={index} />
            ))}
          </>
        ) : allInvestorData.length > 0 ? (
          <InfiniteScroll
            dataLength={allInvestorData.length}
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
            {allInvestorData?.map((investorArray, index) => {
              const investor_id = investorArray[0]?.toText();
              const investor = investorArray[1];
              const user = investorArray[2];
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
              const activeRole = investor?.roles.find(
                (role) => role.status === 'approved'
              );

              const principle_id = investorArray[0];
              // console.log("principle", principle_id);

              return (
                <div
                  className='sm:pr-6 sm:pt-6 sm:pb-6  my-10 md1:my-0 w-full  rounded-lg shadow-sm mb-4 flex flex-col sm:flex-row'
                  key={index}
                >
                  <div className='w-full sm:w-[272px] relative'>
                    <div
                      onClick={() => handleClick(principle_id)}
                      className='w-full sm:max-w-[250px] sm:w-[250px] h-[254px] bg-gray-100 rounded-lg flex flex-col justify-between relative overflow-hidden'
                    >
                      <div
                        className='absolute inset-0 flex items-center justify-center'
                        onClick={handleClick}
                      >
                        <img
                          src={profile} // Placeholder logo image
                          alt={full_name ?? 'investor'}
                          className='w-24 h-24 rounded-full object-cover'
                          loading='lazy'
                          draggable={false}
                        />
                      </div>
                    </div>
                    <div
                      onClick={() => handleRating(user, principle_id)}
                      className='absolute cursor-pointer bottom-0 right-[6px] flex items-center bg-gray-100 p-1'
                    >
                      <Star className='text-yellow-400 w-4 h-4' />
                      <span className='text-sm font-medium'>Rate Us</span>
                    </div>
                  </div>

                  <div className='flex-grow sm:ml-[25px] mt-5 md1:mt-0 w-full '>
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
                          onClick={() => handleInvestorOpenModal(investor_id)}
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
                    <div className='bg-[#FFFAEB] border-[#f2c855] border text-[#090907] rounded-md text-xs px-3 py-1 mr-2 mb-2 w-[5.3rem]'>
                      INVESTOR
                      {/* {activeRole && (
                    <span
                      className={`inline-block ${
                        tagColors[activeRole.name] ||
                        "bg-gray-100 text-gray-800"
                      } text-xs px-3 py-1 rounded-full mr-2 `}
                    >
                      {activeRole.name}
                    </span>
                  )} */}
                    </div>
                    <div className='border-t border-gray-200 my-3 break-all line-clamp-1'>
                      {email}
                    </div>

                    <p className='text-gray-600 mb-2 break-all line-clamp-3'>
                      {bio}
                    </p>
                    <div className='flex items-center text-sm text-gray-500 flex-wrap gap-1'>
                      <div className='flex overflow-x-auto space-x-2'>
                        {randomSkills?.map((skill, index) => (
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
            <NoData message={'No Investor Present Yet'} />
          </div>
        )}
      </div>
      {isAddInvestorModalOpen && (
        <AddAMentorRequestModal
          title={'Associate Investor'}
          onClose={handleInvestorCloseModal}
          onSubmitHandler={handleAddInvestor}
          isSubmitting={isSubmitting}
        />
      )}
      {openDetail && (
        <DiscoverInvestorPage
          openDetail={openDetail}
          setOpenDetail={setOpenDetail}
          principal={sendprincipal}
        />
      )}
      <Toaster />
      {showRatingModal && (
        <RatingModal
          showRating={showRatingModal}
          setShowRatingModal={setShowRatingModal}
          userRatingDetail={userRatingDetail}
          cardPrincipal={currentPrincipal}
        />
      )}
    </>
  );
};

export default DiscoverInvestor;

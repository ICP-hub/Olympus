import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FaFilter } from 'react-icons/fa';
import { ThreeDots } from 'react-loader-spinner';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import { Tooltip } from 'react-tooltip';
import { Principal } from '@dfinity/principal';
import parse from 'html-react-parser';
import eventbg from '../../../../assets/images/bg.png';
import ProfileImage from '../../../../assets/Logo/ProfileImage.png';
import PriceIcon from '../../../../assets/Logo/PriceIcon.png';
import UserModal from './UserModal';
import NoDataFound from './NoDataFound';
import uint8ArrayToBase64 from '../../Utils/uint8ArrayToBase64';
import CloseIcon from '@mui/icons-material/Close';
import Avatar from '@mui/material/Avatar';
import toast, { Toaster } from 'react-hot-toast';
import { RiSendPlaneLine } from 'react-icons/ri';
import AddAMentorRequestModal from '../../../models/AddAMentorRequestModal';
import { loginFailure } from '../../StateManagement/Redux/Reducers/InternetIdentityReducer';
import useTimeout from '../../hooks/TimeOutHook';
import EventRequestCardSkeleton from './DashboardEventSkeletons/EventRequestCardSkeleton';

const EventRequestCard = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('project_data');
  const [selectedType, setSelectedType] = useState('pending');
  const [appliedCategory, setAppliedCategory] = useState('project_data');
  const [appliedType, setAppliedType] = useState('pending');
  const [events, setEvents] = useState([]);
  const [loadingIndexes, setLoadingIndexes] = useState({});
  const [selectedUserData, setSelectedUserData] = useState(null);
  const [openUserModal, setOpenUserModal] = useState(false);
  const actor = useSelector((state) => state.actors.actor);
  const principal = useSelector((state) => state.internet.principal);
  const userCurrentRoleStatusActiveRole = useSelector(
    (currState) => currState.currentRoleStatus.activeRole
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [listProjectId, setListProjectId] = useState(null);
  const [listCohortId, setListCohortId] = useState(null);
  const [loading, setLoading] = useState(true);
  useTimeout(() => setLoading(false));
  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };

  console.log('appliedType', appliedType);
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

  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);

  const handleProjectCloseModal = () => setIsAddProjectModalOpen(false);
  const handleProjectOpenModal = (val) => {
    setListProjectId(val);
    setIsAddProjectModalOpen(true);
  };

  // ASSOCIATE IN A PROJECT HANDLER AS A MENTOR
  const handleAddProject = async ({ message }) => {
    setIsSubmitting(true);
    console.log('add into a project');
    if (actor && principal) {
      let project_id = listProjectId;
      let msg = message;
      let mentor_id = Principal.fromText(principal);
      let is_cohort_association = true;
      let cohort_id = listCohortId;
      console.log('Data before sending', project_id, msg, mentor_id);

      await actor
        .send_offer_to_project_by_mentor(
          project_id,
          msg,
          mentor_id,
          is_cohort_association,
          cohort_id
        )
        .then((result) => {
          console.log('result-in-send_offer_to_project_by_mentor', result);
          if (result) {
            handleProjectCloseModal();
            setIsSubmitting(false);
            toast.success('offer sent to project successfully');
          } else {
            handleProjectCloseModal();
            setIsSubmitting(false);
            toast.error('something got wrong');
          }
        })
        .catch((error) => {
          console.log('error-in-send_offer_to_project_by_mentor', error);
          setIsSubmitting(false);
          handleProjectCloseModal();
          toast.error('something got wrong');
        });
    }
  };

  const [isAddProjectModalOpenAsInvestor, setIsAddProjectModalOpenAsInvestor] =
    useState(false);

  const handleProjectCloseModalAsInvestor = () => {
    setIsAddProjectModalOpenAsInvestor(false);
  };
  const handleProjectOpenModalAsInvestor = (project_id, cohort_id) => {
    setListProjectId(project_id);
    setListCohortId(cohort_id);
    setIsAddProjectModalOpenAsInvestor(true);
  };

  // ASSOCIATE IN A PROJECT HANDLER AS A Investor
  const handleAddProjectAsInvestor = async ({ message }) => {
    setIsSubmitting(true);
    console.log('add into a project AS INVESTOR');
    if (actor) {
      let project_id = listProjectId;
      let msg = message;
      let is_cohort_association = true;
      let cohort_id = listCohortId ? [listCohortId] : [];
      await actor
        .send_offer_to_project_by_investor(
          project_id,
          msg,
          is_cohort_association,
          cohort_id
        )
        .then((result) => {
          console.log('result-in-send_offer_to_project_by_investor', result);
          if (result) {
            handleProjectCloseModalAsInvestor();
            setIsSubmitting(false);
            // fetchProjectData();
            toast.success('offer sent to project successfully');
          } else {
            handleProjectCloseModalAsInvestor();
            setIsSubmitting(false);
            toast.error('something got wrong');
          }
        })
        .catch((error) => {
          console.log('error-in-send_offer_to_project_by_investor', error);
          handleProjectCloseModalAsInvestor();
          setIsSubmitting(false);
          toast.error('something got wrong');
        });
    }
  };

  const fetchRequests = async (category, type) => {
    setLoading(true); // Start loading
    let result = [];

    try {
      switch (type) {
        case 'pending':
          result = await actor.get_pending_cohort_enrollment_requests(
            Principal.fromText(principal)
          );
          break;
        case 'approved':
          result = await actor.get_accepted_cohort_enrollment_requests(
            Principal.fromText(principal)
          );
          break;
        case 'rejected':
          result = await actor.get_rejected_cohort_enrollment_requests(
            Principal.fromText(principal)
          );
          break;
      }

      if (category && category !== 'all') {
        result = result.filter(
          (event) => event.enroller_data?.[category]?.length > 0
        );
      }

      const eventsWithStatus = result.map((event) => ({
        ...event,
        status: event.status || 'pending',
      }));

      setEvents(eventsWithStatus);
    } catch (error) {
      console.error('Error fetching requests:', error);
      setEvents([]);
    } finally {
      setLoading(false); // Stop loading regardless of success or failure
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
      if (action === 'Approve') {
        result = await actor.approve_enrollment_request(
          cohortId,
          enroller_principal
        );
        console.log('accept hogi successfully', result);

        event.status = 'approved';
      } else if (action === 'Reject') {
        result = await actor.reject_enrollment_request(
          cohort_creator_principal,
          enroller_principal
        );
        console.log('reject hogi successfully', result);
        event.status = 'rejected';
      }

      setEvents((prevEvents) =>
        prevEvents.map((ev, i) =>
          i === index ? { ...ev, status: event.status } : ev
        )
      );

      toast.success(result);
    } catch (error) {
      console.error('Failed to process the decision: ', error);
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
      <div className='flex items-center justify-between  gap-6 mt-4 mx-2'>
        <div className='flex items-center border-2 border-gray-400 rounded-lg overflow-hidden flex-grow h-[38px] md:h-[50px]'>
          <div className='flex items-center px-3 md:px-4'>
            <svg
              className='h-5 w-5 text-gray-400'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M21 21l-4.35-4.35m0 0A7.5 7.5 0 103.5 3.5a7.5 7.5 0 0013.65 13.65z'
              ></path>
            </svg>
          </div>
          <input
            type='text'
            placeholder='Search people, projects, jobs, events'
            className='w-full py-2 px-2 md:px-4 text-gray-700 focus:outline-none text-sm md:text-base'
          />
          <div className='px-3 md:px-4'>
            <svg
              className='h-5 w-5 text-gray-400'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M3 6h18M3 12h18m-7 6h7'
              ></path>
            </svg>
          </div>
        </div>
        <FaFilter
          onClick={toggleFilter}
          className='text-gray-400 text-xl md:text-2xl cursor-pointer'
        />
      </div>

      {filterOpen && (
        <div
          className={`fixed top-0 right-0 inset-0 z-50 transition-opacity duration-700 ease-in-out ${
            filterOpen ? 'opacity-100 bg-opacity-30' : 'opacity-0 bg-opacity-0'
          } bg-black backdrop-blur-xs`}
        >
          <div
            className={`transition-transform duration-300 ease-in-out transform ${
              filterOpen ? 'translate-x-0' : 'translate-x-full'
            } mx-auto w-full md:w-[35%] lg:w-[30%] absolute right-0 top-0 z-10 bg-white h-screen flex flex-col`}
          >
            <div className='p-5 flex justify-start'>
              <CloseIcon sx={{ cursor: 'pointer' }} onClick={toggleFilter} />
            </div>
            <div className='container p-5 flex-grow'>
              <h3 className='mb-4 text-lg font-semibold'>Filters</h3>
              <div className='mb-4'>
                <label className='block text-gray-700 text-sm font-bold mb-2'>
                  Category
                </label>
                <div className='flex flex-col gap-2'>
                  <label>
                    <input
                      type='radio'
                      name='category'
                      value='project_data'
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className='h-4 w-4 text-blue-600 form-radio checked:bg-blue-600 border border-black rounded-full cursor-pointer mr-2'
                    />
                    Project
                  </label>
                  <label>
                    <input
                      type='radio'
                      name='category'
                      value='vc_data'
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className='h-4 w-4 text-blue-600 form-radio checked:bg-blue-600 border border-black rounded-full cursor-pointer mr-2'
                    />
                    Investor
                  </label>
                  <label>
                    <input
                      type='radio'
                      name='category'
                      value='mentor_data'
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className='h-4 w-4 text-blue-600 form-radio checked:bg-blue-600 border border-black rounded-full cursor-pointer mr-2'
                    />
                    Mentor
                  </label>
                </div>
              </div>

              <div className='mb-4'>
                <label className='block text-gray-700 text-sm font-bold mb-2'>
                  Types
                </label>
                <select
                  onChange={(e) => setSelectedType(e.target.value)}
                  value={selectedType}
                  className='block w-full bg-white border border-gray-300 rounded-md shadow-sm focus:border-gray-400 focus:ring focus:ring-opacity-50 px-3 py-2'
                >
                  {/* <option value="all">All</option> */}
                  <option value='pending'>Pending</option>
                  <option value='approved'>Accepted</option>
                  <option value='rejected'>Rejected</option>
                </select>
              </div>
            </div>
            <div className='p-5'>
              <button
                className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full'
                onClick={handleApply}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <EventRequestCardSkeleton /> // Show the skeleton when loading
      ) : events.length > 0 ? (
        events.map((event, index) => {
          console.log('event', event);
          const title = event.cohort_details.cohort.title;
          const description = event.cohort_details.cohort.description;
          const startDate = event.cohort_details.cohort.start_date;
          const endDate = event.cohort_details.cohort.cohort_end_date;
          const deadline = event.cohort_details.cohort.deadline;
          const noOfSeats = event.cohort_details.cohort.no_of_seats;
          const tags = event.cohort_details.cohort.tags;
          const hostName = event.cohort_details.cohort.host_name.join(', ');
          const fundingType = event.cohort_details.cohort.funding_type;
          const fundingAmount = event.cohort_details.cohort.funding_amount;
          const country = event.cohort_details.cohort.country ?? 'global';
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
            event.enroller_data.user_data[0]?.params.openchat_username[0] || '';
          const location = event.enroller_data.user_data[0]?.params.country;
          const interests =
            event.enroller_data.user_data[0]?.params.area_of_interest;
          const about = event.enroller_data.user_data[0]?.params.bio;
          const email = event.enroller_data.user_data[0]?.params.email;
          const reason =
            event.enroller_data.user_data[0]?.params.reason_to_join;
          const project_id = event.enroller_data?.project_data?.[0]?.uid;
          const cohort_id = event?.cohort_details?.cohort_id;

          const userData = {
            profileImage: profileImageSrc,
            fullname,
            username,
            location,
            reason: [reason],
            interests: [interests],
            email,
            about,
            linkedin: '',
            github: '',
            telegram: '',
          };

          return (
            <div
              key={index}
              className='bg-white rounded-lg shadow p-4 mt-4  w-full  md:max-w-full '
            >
              <div className='flex flex-col sm0:flex-row sm0:gap-4 lg:flex-col lg1:flex-row items-start md1:items-center'>
                {/* Image section */}
                <div className='w-full lgx:w-[272px] h-[230px]'>
                  <div
                    className='w-full lgx:max-w-[230px] lgx:min-w-[230px] bg-gray-100 rounded-lg flex flex-col justify-between h-full relative overflow-hidden'
                    onClick={() => handleCardClick(userData)}
                  >
                    <div className='group'>
                      <div
                        className='absolute inset-0 blur-sm'
                        style={{
                          backgroundImage: `url(${banner})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                      ></div>
                      <div className='absolute inset-0 flex items-center justify-center'>
                        <img
                          src={profileImageSrc}
                          alt={title}
                          className='w-20 h-20 md:w-24 md:h-24 rounded-full object-cover'
                          loading='lazy'
                          draggable={false}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className='w-full'>
                  <div className='flex justify-between'>
                    <h3 className='text-base md:text-lg font-bold mt-2 md:mt-0 line-clamp-1 break-all'>
                      {title}
                    </h3>

                    {userCurrentRoleStatusActiveRole === 'mentor' ||
                    userCurrentRoleStatusActiveRole === 'vc' ? (
                      <button
                        className='mt-2'
                        data-tooltip-id='registerTip'
                        onClick={() => {
                          if (userCurrentRoleStatusActiveRole === 'mentor') {
                            handleProjectOpenModal(project_id, cohort_id);
                          } else if (userCurrentRoleStatusActiveRole === 'vc') {
                            handleProjectOpenModalAsInvestor(
                              project_id,
                              cohort_id
                            );
                          }
                        }}
                      >
                        <RiSendPlaneLine />
                        <Tooltip
                          id='registerTip'
                          place='top'
                          effect='solid'
                          className='rounded-full z-10'
                        >
                          Send Association Request
                        </Tooltip>
                      </button>
                    ) : (
                      ''
                    )}
                  </div>
                  <span className='flex '>
                    <Avatar
                      alt='Mentor'
                      src={profileImageSrc}
                      className='mr-2'
                      sx={{ width: 24, height: 24 }}
                    />
                    <span className='text-sm text-gray-500 line-clamp-1 break-all'>
                      {fullname}
                    </span>
                  </span>
                  <div className='border-t border-gray-200 my-0.5'></div>

                  {/* Description */}
                  <p
                    className='text-sm text-gray-500 overflow-hidden text-ellipsis break-all line-clamp-2 mt-2'
                    style={{ maxHeight: '3em', lineHeight: '1em' }}
                  >
                    {parse(description)}
                  </p>

                  {/* Funding and Location */}
                  <div className='flex flex-wrap gap-3 items-center mt-2'>
                    <div className='flex items-center'>
                      <img
                        src={PriceIcon}
                        alt='Funding Amount'
                        className='w-4 h-4 text-gray-400 mr-2'
                        loading='lazy'
                        draggable={false}
                      />
                      <span className='text-sm text-gray-500'>
                        {fundingAmount}
                      </span>
                    </div>
                    <span className='flex items-center text-sm text-gray-700'>
                      <PlaceOutlinedIcon className='' fontSize='small' />
                      {country}
                    </span>
                  </div>

                  {/* Tags */}
                  <div className='flex flex-wrap gap-2 items-center mt-2'>
                    {tags
                      ?.split(',')
                      .slice(0, 2)
                      .map((interest, index) => (
                        <span
                          key={index}
                          className='border-2 border-gray-500 rounded-full text-xs text-gray-700 px-2 py-1'
                        >
                          {interest.trim()}
                        </span>
                      ))}
                  </div>

                  {/* Action Buttons */}
                  <div className='flex flex-wrap gap-2 mt-2'>
                    {appliedType === 'pending' &&
                      event.status === 'pending' && (
                        <>
                          {/* Accept Button */}
                          <button
                            className='mr-2 mb-2 border border-[#097647] bg-[#EBFDF3] text-[#097647] px-3 py-1 rounded-full flex justify-center items-center'
                            onClick={() => handleAction('Approve', index)}
                            disabled={loadingIndexes[index] === 'Approve'}
                          >
                            {loadingIndexes[index] === 'Approve' ? (
                              <ThreeDots
                                visible={true}
                                height='15'
                                width='20'
                                color='#097647'
                                radius='8'
                                ariaLabel='three-dots-loading'
                              />
                            ) : (
                              <>Accept</>
                            )}
                          </button>

                          {/* Reject Button */}
                          <button
                            className='mr-2 mb-2 border border-[#C11574] bg-[#FDF2FA] text-[#C11574] px-3 py-1 rounded-full flex justify-center items-center'
                            onClick={() => handleAction('Reject', index)}
                            disabled={loadingIndexes[index] === 'Reject'}
                          >
                            {loadingIndexes[index] === 'Reject' ? (
                              <ThreeDots
                                visible={true}
                                height='15'
                                width='20'
                                color='#C11574'
                                radius='8'
                                ariaLabel='three-dots-loading'
                              />
                            ) : (
                              <>Reject</>
                            )}
                          </button>
                        </>
                      )}
                    {appliedType === 'approved' && (
                      <button className='bg-[#ECFDF3] border-2 border-[#ABEFC6] text-[#067647] rounded-lg px-2 py-1'>
                        Approved
                      </button>
                    )}
                    {event.status === 'rejected' && (
                      <button className='bg-[#FDF2FA] border-2 text-[#C11574] border-[#FCCEEE] rounded-lg px-2 py-1'>
                        Rejected
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <NoDataFound message='No Request Found' />
      )}
      {isAddProjectModalOpen && (
        <AddAMentorRequestModal
          title={'Associate Project'}
          onClose={handleProjectCloseModal}
          onSubmitHandler={handleAddProject}
          isSubmitting={isSubmitting}
        />
      )}
      {isAddProjectModalOpenAsInvestor && (
        <AddAMentorRequestModal
          title={'Associate Project'}
          onClose={handleProjectCloseModalAsInvestor}
          onSubmitHandler={handleAddProjectAsInvestor}
          isSubmitting={isSubmitting}
        />
      )}
      {openUserModal && (
        <UserModal
          openDetail={openUserModal}
          setOpenDetail={handleCloseModal}
          userData={selectedUserData}
        />
      )}
      <Toaster />
    </>
  );
};

export default EventRequestCard;

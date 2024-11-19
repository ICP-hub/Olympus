import React, { useState, useEffect, useLayoutEffect } from 'react';
// import { IcpAccelerator_backend } from "../../../../declarations/IcpAccelerator_backend/index";
import { IcpAccelerator_backend } from '../../../../declarations/IcpAccelerator_backend/index';
import { useDispatch, useSelector } from 'react-redux';
import { FavoriteBorder, LocationOn, Star } from '@mui/icons-material';
import CypherpunkLabLogo from '../../../assets/Logo/CypherpunkLabLogo.png';
import uint8ArrayToBase64 from '../Utils/uint8ArrayToBase64';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import { BsFillSendPlusFill } from 'react-icons/bs';
import { IoSendSharp } from 'react-icons/io5';
import { RiSendPlaneLine } from 'react-icons/ri';
import { Tooltip } from 'react-tooltip';
import { Principal } from '@dfinity/principal';
import toast, { Toaster } from 'react-hot-toast';
import Avatar from '@mui/material/Avatar';
import AOS from 'aos';
import 'aos/dist/aos.css';
import UserDetailPage from '../Dashboard/DashboardHomePage/UserDetailPage';
import AddAMentorRequestModal from '../../models/AddAMentorRequestModal';
import { mentorRegisteredHandlerRequest } from '../StateManagement/Redux/Reducers/mentorRegisteredData';
import RatingModal from '../Common/RatingModal';
import { bufferToImageBlob } from '../Utils/formatter/bufferToImageBlob';
import parse from 'html-react-parser';
import InfiniteScroll from 'react-infinite-scroll-component';
import NoData from '../NoDataCard/NoData';
import SpinnerLoader from './SpinnerLoader';
import DiscoverSkeleton from './DiscoverSkeleton/DiscoverSkeleton';
import useTimeout from '../hooks/TimeOutHook';
const DiscoverProject = ({ onProjectCountChange }) => {
  const actor = useSelector((currState) => currState.actors.actor);
  const [allProjectData, setAllProjectData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
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
  const [selectedAssociationType, setSelectedAssociationType] = useState(null);
  const [projectProfile, setProjectProfile] = useState(null);
  const [projectName, setProjectName] = useState(null);
  const [ratingProjectId, setRatingProjectId] = useState(null);

  useTimeout(() => setIsLoading(false));
  const mentorPrincipal = useSelector(
    (currState) => currState.internet.principal
  );

  const userCurrentRoleStatusActiveRole = useSelector(
    (currState) => currState.currentRoleStatus.activeRole
  );
  const userCurrentRoleStatus = useSelector(
    (currState) => currState.currentRoleStatus.rolesStatusArray
  );
  const isMentorApproved = userCurrentRoleStatus.some(
    (role) => role.name === 'mentor' && role.approval_status === 'approved'
  );
  const isVcApproved = userCurrentRoleStatus.some(
    (role) => role.name === 'vc' && role.approval_status === 'approved'
  );
  const isProjectApproved = userCurrentRoleStatus.some(
    (role) => role.name === 'project' && role.approval_status === 'approved'
  );
  const isAuthenticated = useSelector(
    (currState) => currState.internet.isAuthenticated
  );
  const dispatch = useDispatch();

  const mentorFullData = useSelector(
    (currState) => currState.mentorData.data[0]
  );
  const mentorId = mentorFullData;
  console.log('mentorId', mentorId);
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(mentorRegisteredHandlerRequest());
    }
  }, [isAuthenticated, dispatch]);
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);

  const handleProjectCloseModal = () => {
    setIsAddProjectModalOpen(false);
  };
  const handleProjectOpenModal = (val, profile, name) => {
    console.log('val', val);
    console.log('selectedAssociationType', selectedAssociationType);
    setListProjectId(val);
    setProjectProfile(profile);
    setProjectName(name);
    setIsAddProjectModalOpen(true);
  };

  const handleProjectCloseModalForInvestor = () => {
    setIsAddProjectModalOpenAsInvestor(false);
  };
  const handleProjectOpenModalForInvestor = (val, profile, name) => {
    console.log('val', val);
    console.log('selectedAssociationType', selectedAssociationType);
    setListProjectId(val);
    setProjectProfile(profile);
    setProjectName(name);
    setIsAddProjectModalOpenAsInvestor(true);
  };
  // ASSOCIATE IN A PROJECT HANDLER AS A MENTOR
  const handleAddProject = async ({ message }) => {
    setIsSubmitting(true);
    console.log('add into a project');
    if (actor && mentorPrincipal) {
      let project_id = listProjectId;
      let msg = message;
      let mentor_id = Principal.fromText(mentorPrincipal);
      let is_cohort_association = false;
      let cohort_id = [];
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

  // ASSOCIATE IN A PROJECT HANDLER AS A Investor
  const handleAddProjectAsInvestor = async ({ message }) => {
    setIsSubmitting(true);
    console.log('add into a project AS INVESTOR');
    if (actor) {
      let project_id = listProjectId;
      let msg = message;
      let is_cohort_association = false;
      let cohort_id = [];
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
            handleProjectCloseModal();
            setIsSubmitting(false);
            // fetchProjectData();
            toast.success('offer sent to project successfully');
          } else {
            handleProjectCloseModal();
            setIsSubmitting(false);
            toast.error('something got wrong');
          }
        })
        .catch((error) => {
          console.log('error-in-send_offer_to_project_by_investor', error);
          handleProjectCloseModal();
          setIsSubmitting(false);
          toast.error('something got wrong');
        });
    }
  };

  const getAllProject = async (caller, page, isRefresh = false) => {
    setIsFetching(true);

    try {
      const result = await caller.list_all_projects_with_pagination({
        page_size: itemsPerPage,
        page: page,
      });
      if (result && result.data) {
        const ProjectData = Object.values(result.data);
        if (isRefresh) {
          console.log('Refresh', 'true');
          setAllProjectData(ProjectData); // Replace with refreshed data
          onProjectCountChange(ProjectData.length); // Update user count
        } else {
          console.log('Refresh', 'false');
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
      console.error('Error fetching projects:', error);
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
    console.log('passed principle', principal);
  };
  const handleRating = (ratings, principalId, project_id) => {
    setShowRatingModal(true);
    setUserRatingDetail(ratings);
    setCurrentPrincipal(principalId);
    setRatingProjectId(project_id);
  };
  async function convertBufferToImageBlob(buffer) {
    try {
      // Assuming bufferToImageBlob returns a Promise
      const blob = await bufferToImageBlob(buffer);
      return blob;
    } catch (error) {
      console.error('Error converting buffer to image blob:', error);
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
      console.error('Error handling profile picture:', error);
    }
  }

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
            {[...Array(allProjectData.length)].map((_, index) => (
              <DiscoverSkeleton key={index} />
            ))}
          </>
        ) : allProjectData.length > 0 ? (
          <InfiniteScroll
            dataLength={allProjectData.length}
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
            {allProjectData?.map((projectArray, index) => {
              const project_id = projectArray[1]?.params?.uid;
              const project = projectArray[1];
              const user = projectArray[2];
              let profile = user?.profile_picture[0]
                ? uint8ArrayToBase64(user?.profile_picture[0])
                : '../../../assets/Logo/CypherpunkLabLogo.png';
              const projectlogo = project.params.params.project_logo[0]
                ? uint8ArrayToBase64(project.params.params.project_logo[0])
                : CypherpunkLabLogo;
              const projectname = project.params.params.project_name;
              const projectdescription =
                project.params.params.project_description[0];
              let full_name = user?.full_name;
              let openchat_name = user?.openchat_username[0] ?? 'N/A';
              let country = user?.country;
              let bio = user?.bio[0];
              let email = user?.email[0];
              const randomSkills = user?.area_of_interest
                .split(',')
                ?.map((skill) => skill.trim());
              const activeRole = project?.roles?.find(
                (role) => role.status === 'approved'
              );

              const principle_id = projectArray[0];
              return (
                <div
                  className='sm:pr-6 sm:pt-6 sm:pb-6  my-10 md1:my-0 w-full  rounded-lg shadow-sm mb-4 flex flex-col sm:flex-row p-4'
                  key={index}
                >
                  <div className='w-full sm:w-[272px] relative'>
                    <div
                      onClick={() => handleClick(principle_id, user)}
                      className='w-full sm:max-w-[250px] sm:w-[250px] h-[254px] bg-gray-100 rounded-lg flex flex-col justify-between relative overflow-hidden'
                    >
                      <div className='absolute inset-0 flex items-center justify-center'>
                        <img
                          src={projectlogo || CypherpunkLabLogo} // Placeholder logo image
                          alt={full_name ?? 'Project'}
                          className='w-24 h-24 rounded-full object-cover'
                          loading='lazy'
                          draggable={false}
                        />
                      </div>
                    </div>
                    <div
                      onClick={() =>
                        handleRating(user, principle_id, project_id)
                      }
                      className='absolute cursor-pointer bottom-0 right-[6px] flex items-center bg-gray-100 p-1'
                    >
                      <Star className='text-yellow-400 w-4 h-4' />
                      <span className='text-sm font-medium'>Rate Us</span>
                    </div>
                  </div>
                  {/* md1:w-[544px] */}
                  <div className='flex-grow mt-5 md1:mt-0 sm:ml-[25px] w-full '>
                    <div className='flex justify-between items-start mb-2'>
                      <div>
                        <div>
                          <h3 className='text-xl font-bold line-clamp-1 text-ellipsis break-all'>
                            {projectname}
                          </h3>
                          <span className='flex '>
                            <Avatar
                              alt='Mentor'
                              src={profile}
                              className=' mr-2'
                              sx={{ width: 24, height: 24 }}
                            />
                            <span className='text-gray-500 line-clamp-1 break-all'>
                              {full_name}
                            </span>
                          </span>
                        </div>
                      </div>
                      {userCurrentRoleStatusActiveRole === 'mentor' ||
                      userCurrentRoleStatusActiveRole === 'vc' ? (
                        isMentorApproved && !isVcApproved ? (
                          <button
                            data-tooltip-id='registerTip'
                            onClick={() => {
                              handleProjectOpenModal(
                                project_id,
                                projectlogo,
                                projectname
                              );
                            }}
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
                        ) : !isMentorApproved && isVcApproved ? (
                          <button
                            data-tooltip-id='registerTip'
                            onClick={() => {
                              handleProjectOpenModalForInvestor(
                                project_id,
                                projectlogo,
                                projectname
                              );
                            }}
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
                        ) : isMentorApproved && isVcApproved ? (
                          <button
                            data-tooltip-id='registerTip'
                            onClick={() => {
                              userCurrentRoleStatusActiveRole === 'mentor'
                                ? handleProjectOpenModal(
                                    project_id,
                                    projectlogo,
                                    projectname
                                  )
                                : handleProjectOpenModalForInvestor(
                                    project_id,
                                    projectlogo,
                                    projectname
                                  );
                            }}
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
                        ) : null
                      ) : null}
                    </div>
                    <div className='bg-[#daebf3] border-[#70b2e9] border text-[#144579] rounded-md text-xs px-3 py-1 mr-2 mb-2 w-[4.9rem]'>
                      PROJECT
                    </div>
                    <div className='border-t border-gray-200 mt-3 hidden sm:block'></div>

                    <div className='mb-2'>
                      {activeRole && (
                        <span
                          key={index}
                          className={`inline-block ${
                            tagColors[activeRole.name] ||
                            'bg-gray-100 text-gray-800'
                          } text-xs px-3 py-1 rounded-full mr-2 mb-2`}
                        >
                          {activeRole.name}
                        </span>
                      )}
                    </div>

                    <p className='text-gray-600 mb-2 overflow-hidden line-clamp-2 break-all sm:h-12'>
                      {' '}
                      {parse(projectdescription)}
                    </p>
                    <div className='flex items-center text-sm text-gray-500 flex-wrap'>
                      {randomSkills?.slice(0, 3).map((skill, index) => (
                        <span
                          key={index}
                          className='mr-2 mb-2 border boder-[#CDD5DF] bg-white text-[#364152] px-3 py-1 rounded-full'
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                    <span className='mr-2 mb-2 flex text-[#121926] items-center'>
                      <PlaceOutlinedIcon className='text-[#364152] mr-1 w-4 h-4' />
                      {country}
                    </span>
                  </div>
                </div>
              );
            })}
          </InfiniteScroll>
        ) : (
          <div className='flex justify-center items-center'>
            <NoData message={'No Projects Posted Yet'} />
          </div>
        )}
      </div>
      {showRatingModal && (
        <RatingModal
          showRating={showRatingModal}
          setShowRatingModal={setShowRatingModal}
          userRatingDetail={userRatingDetail}
          cardPrincipal={currentPrincipal}
          role={'project'}
          ratingProjectId={ratingProjectId}
        />
      )}
      {isAddProjectModalOpen && (
        <AddAMentorRequestModal
          title={'Request to Associate a Project M'}
          onClose={handleProjectCloseModal}
          onSubmitHandler={handleAddProject}
          isSubmitting={isSubmitting}
          selectedAssociationType={selectedAssociationType}
          setSelectedAssociationType={setSelectedAssociationType}
          projectProfile={projectProfile}
          projectName={projectName}
        />
      )}
      {isAddProjectModalOpenAsInvestor && (
        <AddAMentorRequestModal
          title={'Request to Associate a Project'}
          onClose={handleProjectCloseModalForInvestor}
          onSubmitHandler={handleAddProjectAsInvestor}
          isSubmitting={isSubmitting}
          selectedAssociationType={selectedAssociationType}
          setSelectedAssociationType={setSelectedAssociationType}
          projectProfile={projectProfile}
          projectName={projectName}
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
    </>
  );
};

export default DiscoverProject;

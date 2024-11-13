import React, { useEffect, useState } from 'react';
import VerifiedIcon from '@mui/icons-material/Verified';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import ArrowOutwardOutlinedIcon from '@mui/icons-material/ArrowOutwardOutlined';
import uint8ArrayToBase64 from '../../../Utils/uint8ArrayToBase64';
import CloseIcon from '@mui/icons-material/Close';
import getSocialLogo from '../../../Utils/navigationHelper/getSocialLogo';
import useTimeout from '../../../hooks/TimeOutHook';
import DiscoverUserModalSkeleton from './DiscoverMentorPageSkeleton/DiscoverUserModalSkeleton';
import { RiSendPlaneLine } from 'react-icons/ri';
import { useSelector } from 'react-redux';
import AddAMentorRequestModal from '../../../../models/AddAMentorRequestModal';
import toast, { Toaster } from 'react-hot-toast';
import { Principal } from '@dfinity/principal';
import GuestProfile1 from '../../../../../assets/Logo/GuestProfile1.png';
import parse from 'html-react-parser';
import RatingComponent from '../../../../Rating/ProjectRating';
import DiscoverMoneyRaising from '../../Project/DiscoverFundingCard';
import DiscoverReview from '../../../Discover/DiscoverReview';
import DiscoverTeam from './DiscoverTeam';
import DiscoverDocument from './DiscoverDocument';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const DiscoverProjectModal = ({
  openDetail,
  setOpenDetail,
  userData,
  value,
}) => {
  console.log('user data =>', userData);
  const projectDetail = userData.roleData.params;
  const projectId = userData.uid;

  const [loading, setIsLoading] = useState(true);
  const userCurrentRoleStatusActiveRole = useSelector(
    (currState) => currState.currentRoleStatus.activeRole
  );
  const actor = useSelector((state) => state.actors.actor);
  const principal = useSelector((state) => state.internet.principal);
  useTimeout(() => setIsLoading(false));

  const [isAddMentorModalOpen, setIsAddMentorModalOpen] = useState(false);
  const [isAddInvestorModalOpen, setIsAddInvestorModalOpen] = useState(false);
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [listProjectId, setListProjectId] = useState(null);
  const [listCohortId, setListCohortId] = useState(null);
  const [listEnrollmentPrincipal, setListEnrollmentPrincipal] = useState(null);
  const [projectProfile, setProjectProfile] = useState(null);
  const [projectName, setProjectName] = useState(null);
  const [selectedAssociationType, setSelectedAssociationType] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleProjectCloseModal = () => {
    setIsAddProjectModalOpen(false);
    setIsAddInvestorModalOpen(false);
    setIsAddMentorModalOpen(false);
  };
  const handleProjectOpenModal = (
    val,
    cohortId,
    profile,
    name,
    enroller_principal
  ) => {
    if (role === 'Project') {
      setListProjectId(val);
      setListCohortId(cohortId);
      setListEnrollmentPrincipal(enroller_principal);
      setProjectProfile(profile);
      setProjectName(name);
      setIsAddProjectModalOpen(true);
    } else if (role === 'Mentor') {
      setListProjectId(val);
      setListCohortId(cohortId);
      setListEnrollmentPrincipal(enroller_principal);
      setProjectProfile(profile);
      setProjectName(name);
      setIsAddMentorModalOpen(true);
    } else if (role === 'Investor') {
      setListProjectId(val);
      setListCohortId(cohortId);
      setListEnrollmentPrincipal(enroller_principal);
      setProjectProfile(profile);
      setProjectName(name);
      setIsAddInvestorModalOpen(true);
    }
  };
  console.log('listEnrollmentPrincipal', listEnrollmentPrincipal);

  const handleAddProjectByType = async ({ message }) => {
    setIsSubmitting(true);

    try {
      if (!selectedAssociationType || !actor) {
        throw new Error('Invalid association type or missing data');
      }

      // Define common parameters
      const project_id = listProjectId || '';
      const msg = message;
      const is_cohort_association = true;
      const cohort_id = listCohortId ? [listCohortId] : [];

      // Determine function and additional parameters based on association type
      const associationFunctions = {
        mentor: {
          method: actor.send_offer_to_project_by_mentor,
          params: [
            project_id,
            msg,
            Principal.fromText(principal),
            is_cohort_association,
            cohort_id,
          ],
          successMessage: 'Offer sent to project as mentor successfully',
        },
        vc: {
          method: actor.send_offer_to_project_by_investor,
          params: [project_id, msg, is_cohort_association, cohort_id],
          successMessage: 'Offer sent to project as investor successfully',
        },
      };

      const associationType = selectedAssociationType.value;
      const selectedFunction = associationFunctions[associationType];

      if (!selectedFunction) {
        throw new Error('Unsupported association type');
      }

      // Call the selected function with the relevant parameters
      console.log(
        `Adding project as ${associationType.toUpperCase()}`,
        ...selectedFunction.params
      );

      const result = await selectedFunction.method(...selectedFunction.params);
      console.log('result', result);
      if (result) {
        toast.success(selectedFunction.successMessage);
      } else {
        toast.error('Something went wrong');
      }
    } catch (error) {
      console.error(
        `Error in ${selectedAssociationType.value} association:`,
        error
      );
      toast.error('Something went wrong');
    } finally {
      setIsSubmitting(false);
      handleProjectCloseModal();
    }
  };

  const handleAddMentor = async ({ message }) => {
    setIsSubmitting(true);
    if (actor && principal) {
      let mentor_id = Principal.fromText(principal);
      let msg = message;
      let project_id = listProjectId;
      let is_cohort_association = true;
      let cohort_id = listCohortId ? [listCohortId] : [];
      await actor
        .send_offer_to_mentor_from_project(
          mentor_id,
          msg,
          project_id,
          is_cohort_association,
          cohort_id
        )
        .then((result) => {
          console.log('result', result);
          if (result) {
            setIsSubmitting(false);
            handleProjectCloseModal();
            toast.success(result);
          } else {
            setIsSubmitting(false);
            handleProjectCloseModal();
            toast.error('something went wrong');
          }
        })
        .catch((error) => {
          console.error('error-in-send_offer_to_mentor_from_project', error);
          handleProjectCloseModal();
          setIsSubmitting(false);
          toast.error('something went wrong');
        });
    }
  };
  const handleAddInvestor = async ({ message }) => {
    setIsSubmitting(true);
    console.log('add a investor');
    if (actor && principal) {
      let investor_id = Principal.fromText(principal);
      let msg = message;
      let project_id = listProjectId;
      let is_cohort_association = true;
      let cohort_id = listCohortId ? [listCohortId] : [];
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
            handleProjectCloseModal();
            setIsSubmitting(false);
            toast.success(result);
          } else {
            handleProjectCloseModal();
            setIsSubmitting(false);
            toast.error('something got wrong');
          }
        })
        .catch((error) => {
          console.log('error-in-send_offer_to_investor', error);
          handleProjectCloseModal();
          setIsSubmitting(false);
          toast.error('something got wrong');
        });
    }
  };
  const [activeMobileTab, setActiveMobileTab] = useState(null);
  const [activeTab, setActiveTab] = useState('document');

  // Define available tabs
  const tabs = ['document', 'team', 'ratings', 'moneyraised', 'rubricrating'];

  const uniqueActiveTabs = [...new Set(tabs)];

  const handleMobileTabToggle = (tab) => {
    setActiveMobileTab((prevTab) => (prevTab === tab ? null : tab));
  };

  const handleChange = (tab) => {
    setActiveTab(tab);
  };
  const handleclose = () => {
    setOpenDetails(false);
    setOpenDetail(false);
  };
  useEffect(() => {
    if (openDetail) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [openDetail]);

  const profilepic =
    value === true
      ? userData?.profile_picture
      : userData.profile_picture && userData.profile_picture[0]
        ? uint8ArrayToBase64(userData.profile_picture[0])
        : userData.profile_picture[0];
  console.log('my image of cohor 233', profilepic);
  const full_name = userData?.full_name || 'Unknown User';
  const email =
    value === true
      ? userData?.email
      : Array.isArray(userData?.email)
        ? userData.email[0]
        : userData?.email || 'N/A';
  const bio =
    value === true
      ? userData?.bio
      : Array.isArray(userData?.bio)
        ? userData.bio[0]
        : 'No bio available.';
  const area_of_interest =
    value === true
      ? userData?.area_of_interest
      : userData?.area_of_interest || 'N/A';
  const reason_to_join =
    value === true
      ? userData?.reason_to_join
      : userData?.reason_to_join || 'N/A';

  const location =
    value === true
      ? userData?.country
      : userData?.country || 'Unknown Location';
  const openchat_username =
    value === true
      ? userData?.username
      : Array.isArray(userData?.openchat_username)
        ? userData.openchat_username[0]
        : 'N/A';
  const type_of_profile =
    value === true
      ? userData?.type_of_profile
      : Array.isArray(userData?.type_of_profile)
        ? userData.type_of_profile[0]
        : 'N/A';
  const social_links =
    value === true
      ? userData?.social_links
      : Array.isArray(userData?.social_links)
        ? userData.social_links[0]
        : 'No link';
  const role = value === true ? userData?.role : '';
  const roleData = value === true ? userData?.roleData : '';
  const project_id = value === true && role === 'Project' ? roleData?.uid : '';
  const projectlogo =
    value === true && role === 'Project'
      ? roleData?.params?.project_logo && roleData?.params?.project_logo[0]
        ? uint8ArrayToBase64(roleData?.params?.project_logo[0])
        : roleData?.params?.project_logoe[0]
      : '';
  const projectname =
    value === true && role === 'Project' ? roleData?.params?.project_name : '';
  const cohort_id = value === true ? userData?.cohortid : '';
  const enrollerPrincipal = value === true ? userData?.userPrincipal : '';
  //project all data
  const project_name = projectDetail?.project_name ?? '';
  const projectdescription =
    parse(projectDetail?.project_description?.[0]) ?? '';
  const project_elevator_pitch = projectDetail?.project_elevator_pitch ?? '';
  const project_website = projectDetail?.project_website?.[0] ?? '';

  const country_of_registration =
    projectDetail?.country_of_registration?.[0] ?? '';

  const dapp_link = projectDetail?.dapp_link?.[0] ?? '';
  const weekly_active_users = projectDetail?.weekly_active_users?.[0] ?? '';
  const revenue = projectDetail?.revenue?.[0] ?? '';

  const multi_chain_names =
    projectDetail?.supports_multichain?.join(', ') ?? '';

  const promotional_video = projectDetail?.promotional_video?.[0] ?? '';
  let regestrationType = projectDetail?.type_of_registration;
  let projectFocus = projectDetail?.project_area_of_focus;
  let icphub = projectDetail?.preferred_icp_hub?.[0];
  let links = projectDetail?.links?.[0]?.[0];

  const reason_to_join_incubator = projectDetail?.reason_to_join_incubator;
  return (
    <>
      <div
        className={`w-full lg1:h-screen fixed inset-0 bg-black bg-opacity-30 backdrop-blur-xs z-50 transition-opacity duration-[4000ms] ease-in-out ${
          openDetail ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        {openDetail && userData && (
          <div
            className={`mx-auto w-full sm:w-[70%] absolute right-0 top-0 bg-white h-screen transform transition-transform duration-[4000ms] ease-[cubic-bezier(0.4, 0, 0.2, 1)] ${
              openDetail ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className='p-2 mb-2'>
              <CloseIcon
                sx={{ cursor: 'pointer' }}
                onClick={() => setOpenDetail(false)}
              />
            </div>
            <div className='container mx-auto h-full pb-8 px-[4%] sm:px-[2%] overflow-y-scroll'>
              <div className='flex flex-col gap-4 lg1:py-3 lg1:gap-0 lg1:flex-row w-full lg1:justify-evenly '>
                <div className='border rounded-lg w-full lg1:overflow-y-scroll lg1:w-[32%] '>
                  <div className='bg-slate-200 p-6'>
                    <img
                      src={profilepic ? profilepic : GuestProfile1}
                      alt='User Profile'
                      className='w-24 h-24 mx-auto rounded-full mb-2'
                      loading='lazy'
                      draggable={false}
                    />
                    <div className='flex items-center justify-center mb-1'>
                      <VerifiedIcon
                        className='text-blue-500 mr-1'
                        fontSize='small'
                      />
                      <h2 className='text-xl font-semibold'>{full_name}</h2>
                    </div>
                    <p className='text-gray-600 text-center mb-2'>
                      @{openchat_username}
                    </p>
                    <a
                      href={`mailto:${email}`}
                      className='w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 mb-6 flex items-center justify-center'
                    >
                      Get in touch
                      <ArrowOutwardOutlinedIcon
                        className='ml-1'
                        fontSize='small'
                      />
                    </a>
                    {value && (
                      <>
                        {userCurrentRoleStatusActiveRole === 'mentor' ||
                        userCurrentRoleStatusActiveRole === 'vc' ? (
                          <button
                            className='w-full h-[#155EEF] bg-white border-gray-300 text-black py-2 px-4 rounded-lg mb-4 flex items-center justify-center'
                            onClick={() =>
                              handleProjectOpenModal(
                                project_id,
                                cohort_id,
                                profilepic,
                                full_name,
                                enrollerPrincipal
                              )
                            }
                          >
                            Send Association Request
                            <RiSendPlaneLine className='ml-2' />
                          </button>
                        ) : userCurrentRoleStatusActiveRole === 'project' ? (
                          <button
                            className='w-full h-[#155EEF] bg-white border-gray-300 text-black py-2 px-4 rounded-lg mb-4 flex items-center justify-center'
                            onClick={() =>
                              handleProjectOpenModal(
                                project_id,
                                cohort_id,
                                projectlogo,
                                projectname,
                                enrollerPrincipal
                              )
                            }
                          >
                            Send Association Request
                            <RiSendPlaneLine className='ml-2' />
                          </button>
                        ) : null}
                      </>
                    )}
                  </div>
                  <div className='p-6 bg-white'>
                    <div className='mb-2 p-2'>
                      <h3 className='font-semibold mb-2 text-xs text-gray-500 uppercase'>
                        Roles
                      </h3>
                      <div className='flex space-x-2'>
                        <span className='bg-[#F0F9FF] border border-[#B9E6FE] text-[#026AA2] px-1 py-1 rounded-md text-xs font-normal'>
                          OLYMPIAN
                        </span>
                        <span className='bg-[#F0F9FF] border border-[#B9E6FE] text-[#026AA2] px-1 py-1 rounded-md text-xs font-normal'>
                          PROJECT
                        </span>
                      </div>
                    </div>
                    <hr />
                    <div className='mx-2'>
                      {project_name && (
                        <div className='mt-4'>
                          <h3 className='block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start'>
                            Project Name
                          </h3>
                          <p className='text-sm line-clamp-1 break-all'>
                            {project_name}
                          </p>
                        </div>
                      )}

                      {projectdescription && (
                        <div className='mt-4'>
                          <h3 className='block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start'>
                            Project Description
                          </h3>
                          <p className='text-sm line-clamp-3 break-all'>
                            {projectdescription}
                          </p>
                        </div>
                      )}

                      {project_elevator_pitch && (
                        <div className='mt-6'>
                          <h3 className='block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start'>
                            Project Elevator Pitch
                          </h3>
                          <p className='text-sm line-clamp-1 break-all'>
                            {project_elevator_pitch}
                          </p>
                        </div>
                      )}

                      {project_website && (
                        <div className='mt-6'>
                          <h3 className='block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start'>
                            Project Website
                          </h3>
                          <p className='text-sm line-clamp-1 break-all'>
                            {project_website}
                          </p>
                        </div>
                      )}

                      {icphub && (
                        <div className='mt-6'>
                          <h3 className='block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start'>
                            Preferred ICP Hub
                          </h3>
                          <p className='text-sm'>{icphub}</p>
                        </div>
                      )}

                      {projectFocus && (
                        <div className='mt-4'>
                          <h3 className='block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start'>
                            Project Focus Area
                          </h3>
                          {projectFocus.split(', ').map((focus, index) => (
                            <span
                              key={index}
                              className='border-2 border-gray-500 rounded-full text-gray-700 text-xs px-2 py-1 inline-block mr-2 mb-2 mt-1'
                            >
                              {focus}
                            </span>
                          ))}
                        </div>
                      )}

                      {multi_chain_names && (
                        <div className='mt-4'>
                          <h3 className='block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start'>
                            Multi-Chain Names
                          </h3>
                          {multi_chain_names.split(', ').map((chain, index) => (
                            <span
                              key={index}
                              className='border-2 border-gray-500 rounded-full text-gray-700 text-xs px-2 py-1 inline-block mr-2 mb-2 mt-1'
                            >
                              {chain}
                            </span>
                          ))}
                        </div>
                      )}

                      {reason_to_join_incubator && (
                        <div className='mt-4'>
                          <h3 className='block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start'>
                            Reason to Join
                          </h3>
                          {reason_to_join_incubator
                            .split(', ')
                            .map((reason, index) => (
                              <span
                                key={index}
                                className='border-2 border-gray-500 rounded-full text-gray-700 text-xs px-2 py-1 inline-block mr-2 mb-2 mt-1'
                              >
                                {reason}
                              </span>
                            ))}
                        </div>
                      )}

                      {regestrationType && (
                        <div className='mt-4'>
                          <h3 className='block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start'>
                            Type of Registration
                          </h3>
                          <span className='border-2 border-gray-500 rounded-full text-gray-700 text-xs px-2 py-1 inline-block mr-2 mb-2 mt-1'>
                            {regestrationType}
                          </span>
                        </div>
                      )}

                      {country_of_registration && (
                        <div className='mt-4'>
                          <h3 className='block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start'>
                            Country of Registration
                          </h3>
                          <span className='text-sm'>
                            {country_of_registration}
                          </span>
                        </div>
                      )}

                      {dapp_link && (
                        <div className='mt-4'>
                          <h3 className='block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start'>
                            DApp Link
                          </h3>
                          <span className='text-sm line-clamp-1 break-all'>
                            {dapp_link}
                          </span>
                        </div>
                      )}

                      {weekly_active_users && (
                        <div className='mt-4'>
                          <h3 className='block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start'>
                            Weekly Active Users
                          </h3>
                          <span className='text-sm line-clamp-1 break-all'>
                            {Number(weekly_active_users)}
                          </span>
                        </div>
                      )}

                      {revenue && (
                        <div className='mt-4'>
                          <h3 className='block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start'>
                            Revenue
                          </h3>
                          <span className='text-sm line-clamp-1 break-all'>
                            {Number(revenue)}
                          </span>
                        </div>
                      )}

                      {promotional_video && (
                        <div className='mt-4'>
                          <h3 className='block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start'>
                            Promotional Video
                          </h3>
                          <span className='text-sm line-clamp-1 break-all'>
                            {promotional_video}
                          </span>
                        </div>
                      )}

                      {links?.link && links.link.length > 0 && (
                        <div className='mt-6'>
                          <h3 className='block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start'>
                            Links
                          </h3>
                          {links.link.map((alllink, i) => {
                            const icon = getSocialLogo(alllink);
                            return (
                              <div
                                key={i}
                                className='flex items-center space-x-2'
                              >
                                {icon ? <a href={`${alllink}`}>{icon}</a> : ''}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* </div> */}
                </div>
                <div className='px-1 lg1:px-3 py-4 lg1:py-0 w-full lg1:overflow-y-scroll lg1:w-[63%] '>
                  {/* Mobile Tabs */}
                  <div className='flex flex-col md1:hidden bg-white rounded-lg shadow-sm border mb-4 border-gray-200 overflow-hidden w-full mt-10 p-4 pt-2'>
                    {uniqueActiveTabs.includes('document') && (
                      <div className='border-b'>
                        <button
                          className='flex justify-between items-center w-full px-2 py-3 text-left text-gray-800'
                          onClick={() => handleMobileTabToggle('document')}
                        >
                          Document
                          {activeMobileTab === 'document' ? (
                            <FaChevronUp />
                          ) : (
                            <FaChevronDown />
                          )}
                        </button>
                        {activeMobileTab === 'document' && (
                          <div className='px-2 py-2'>
                            <DiscoverDocument
                              projectDetails={projectDetail}
                              projectId={projectId}
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {uniqueActiveTabs.includes('team') && (
                      <div className='border-b'>
                        <button
                          className='flex justify-between items-center w-full px-2 py-3 text-left text-gray-800'
                          onClick={() => handleMobileTabToggle('team')}
                        >
                          Team
                          {activeMobileTab === 'team' ? (
                            <FaChevronUp />
                          ) : (
                            <FaChevronDown />
                          )}
                        </button>
                        {activeMobileTab === 'team' && (
                          <div className='px-2 py-2'>
                            <DiscoverTeam projectDetails={projectDetail} />
                          </div>
                        )}
                      </div>
                    )}

                    {uniqueActiveTabs.includes('ratings') && (
                      <div className='border-b'>
                        <button
                          className='flex justify-between items-center w-full px-2 py-3 text-left text-gray-800'
                          onClick={() => handleMobileTabToggle('ratings')}
                        >
                          Ratings
                          {activeMobileTab === 'ratings' ? (
                            <FaChevronUp />
                          ) : (
                            <FaChevronDown />
                          )}
                        </button>
                        {activeMobileTab === 'ratings' && (
                          <div className='px-2 py-2'>
                            <DiscoverReview
                              userData={userData}
                              principalId={principal}
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {uniqueActiveTabs.includes('moneyraised') && (
                      <div className='border-b'>
                        <button
                          className='flex justify-between items-center w-full px-2 py-3 text-left text-gray-800'
                          onClick={() => handleMobileTabToggle('moneyraised')}
                        >
                          Money Raised
                          {activeMobileTab === 'moneyraised' ? (
                            <FaChevronUp />
                          ) : (
                            <FaChevronDown />
                          )}
                        </button>
                        {activeMobileTab === 'moneyraised' && (
                          <div className='px-2 py-2'>
                            <DiscoverMoneyRaising
                              data={projectDetail}
                              projectId={projectId}
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {uniqueActiveTabs.includes('rubricrating') && (
                      <div className='border-b'>
                        <button
                          className='flex justify-between items-center w-full px-2 py-3 text-left text-gray-800'
                          onClick={() => handleMobileTabToggle('rubricrating')}
                        >
                          Rubric Rating
                          {activeMobileTab === 'rubricrating' ? (
                            <FaChevronUp />
                          ) : (
                            <FaChevronDown />
                          )}
                        </button>
                        {activeMobileTab === 'rubricrating' && (
                          <div className='px-2 py-2'>
                            <RatingComponent projectId={projectId} />
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Desktop Tabs */}
                  <div className='hidden md1:flex justify-start border-b'>
                    {uniqueActiveTabs.includes('document') && (
                      <button
                        className={`px-4 py-2 focus:outline-none font-medium ${
                          activeTab === 'document'
                            ? 'border-b-2 border-blue-500 text-blue-500 font-medium'
                            : 'text-gray-400'
                        }`}
                        onClick={() => handleChange('document')}
                      >
                        Document
                      </button>
                    )}

                    {uniqueActiveTabs.includes('team') && (
                      <button
                        className={`px-4 py-2 focus:outline-none font-medium ${
                          activeTab === 'team'
                            ? 'border-b-2 border-blue-500 text-blue-500 font-medium'
                            : 'text-gray-400'
                        }`}
                        onClick={() => handleChange('team')}
                      >
                        Team
                      </button>
                    )}

                    {uniqueActiveTabs.includes('ratings') && (
                      <button
                        className={`px-4 py-2 focus:outline-none font-medium ${
                          activeTab === 'ratings'
                            ? 'border-b-2 border-blue-500 text-blue-500 font-medium'
                            : 'text-gray-400'
                        }`}
                        onClick={() => handleChange('ratings')}
                      >
                        Ratings
                      </button>
                    )}

                    {uniqueActiveTabs.includes('moneyraised') && (
                      <button
                        className={`px-4 py-2 focus:outline-none font-medium ${
                          activeTab === 'moneyraised'
                            ? 'border-b-2 border-blue-500 text-blue-500 font-medium'
                            : 'text-gray-400'
                        }`}
                        onClick={() => handleChange('moneyraised')}
                      >
                        Money Raised
                      </button>
                    )}
                    {uniqueActiveTabs.includes('rubricrating') && (
                      <button
                        className={`px-4 py-2 focus:outline-none font-medium ${
                          activeTab === 'rubricrating'
                            ? 'border-b-2 border-blue-500 text-blue-500 font-medium'
                            : 'text-gray-400'
                        }`}
                        onClick={() => handleChange('rubricrating')}
                      >
                        Rubric Rating
                      </button>
                    )}
                  </div>

                  {/* Desktop Tab Content */}
                  <div className='hidden md1:block mb-4'>
                    {activeTab === 'document' && (
                      <DiscoverDocument
                        projectDetails={projectDetail}
                        projectId={projectId}
                      />
                    )}
                    {activeTab === 'team' && (
                      <DiscoverTeam projectDetails={projectDetail} />
                    )}
                    {activeTab === 'ratings' && (
                      <DiscoverReview
                        userData={userData}
                        principalId={principal}
                      />
                    )}
                    {activeTab === 'moneyraised' && (
                      <DiscoverMoneyRaising
                        data={projectDetail}
                        projectId={projectId}
                      />
                    )}
                    {activeTab === 'rubricrating' && (
                      <RatingComponent projectId={projectId} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {isAddProjectModalOpen && (
        <AddAMentorRequestModal
          title={'Request to Associate a Project'}
          onClose={handleProjectCloseModal}
          onSubmitHandler={handleAddProjectByType}
          isSubmitting={isSubmitting}
          selectedAssociationType={selectedAssociationType}
          setSelectedAssociationType={setSelectedAssociationType}
          projectProfile={projectProfile}
          projectName={projectName}
        />
      )}

      {isAddInvestorModalOpen && (
        <AddAMentorRequestModal
          title={'Request to Associate a Investor'}
          onClose={handleProjectCloseModal}
          onSubmitHandler={handleAddInvestor}
          isSubmitting={isSubmitting}
          selectedAssociationType={selectedAssociationType}
          setSelectedAssociationType={setSelectedAssociationType}
          projectProfile={projectProfile}
          projectName={projectName}
        />
      )}
      {isAddMentorModalOpen && (
        <AddAMentorRequestModal
          title={'Request to Associate a Mentor'}
          onClose={handleProjectCloseModal}
          onSubmitHandler={handleAddMentor}
          isSubmitting={isSubmitting}
          selectedAssociationType={selectedAssociationType}
          setSelectedAssociationType={setSelectedAssociationType}
          projectProfile={projectProfile}
          projectName={projectName}
        />
      )}
    </>
  );
};

export default DiscoverProjectModal;

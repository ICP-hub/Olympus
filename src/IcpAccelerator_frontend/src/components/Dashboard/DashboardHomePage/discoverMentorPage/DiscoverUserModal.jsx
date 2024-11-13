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

const DiscoverUserModal = ({ openDetail, setOpenDetail, userData, value }) => {
  console.log('user data =>', userData);
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
  return (
    <>
      <div
        className={`w-full h-screen fixed inset-0 bg-black bg-opacity-30 backdrop-blur-xs z-50 transition-opacity duration-[4000ms] ease-in-out ${
          openDetail ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        {openDetail && userData && (
          <div
            className={`mx-auto w-full pb-4 sm:w-[60%] lg:w-[40%] absolute right-0 top-0 bg-white h-screen transform transition-transform duration-[4000ms] ease-[cubic-bezier(0.4, 0, 0.2, 1)] ${
              openDetail ? 'translate-x-0' : 'translate-x-full'
            } z-20`}
          >
            <div className='p-2 mb-2'>
              <CloseIcon
                sx={{ cursor: 'pointer' }}
                onClick={() => setOpenDetail(false)}
              />
            </div>
            <div className='container mx-auto justify-center w-full h-full overflow-y-scroll pb-8'>
              {loading ? (
                <DiscoverUserModalSkeleton
                  openDetail={openDetail}
                  setOpenDetail={setOpenDetail}
                />
              ) : (
                <div className='flex justify-center p-6'>
                  <div className='container border bg-white rounded-lg shadow-sm h-full overflow-y-scroll w-full'>
                    <div className='flex flex-col w-full p-6 bg-gray-100'>
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
                        </div>
                      </div>
                      <hr />

                      <div className=''>
                        {email && (
                          <div className='mb-2 group relative hover:bg-gray-100 rounded-lg p-2'>
                            <h3 className='font-semibold mb-1 text-xs text-gray-500 uppercase'>
                              EmailABD
                            </h3>
                            <div className='flex flex-wrap items-center'>
                              <p className='mr-2 text-sm line-clamp-1 break-all'>
                                {email}
                              </p>
                              <VerifiedIcon
                                className='text-blue-500 mr-2 w-2 h-2'
                                fontSize='small'
                              />
                            </div>
                          </div>
                        )}

                        {bio && (
                          <div className='mb-2 group relative hover:bg-gray-100 rounded-lg p-2'>
                            <h3 className='font-semibold mb-1 text-xs text-gray-500 uppercase'>
                              About
                            </h3>
                            <div>
                              <p className='text-sm line-clamp-2 break-all'>
                                {bio}
                              </p>
                            </div>
                          </div>
                        )}

                        {type_of_profile && (
                          <div className='mb-2 group relative hover:bg-gray-100 rounded-lg p-2'>
                            <h3 className='font-semibold mb-2 text-xs text-gray-500 uppercase'>
                              Type of Profile
                            </h3>
                            <div className='flex items-center'>
                              <p className='border-2 border-gray-500 rounded-full text-gray-700 text-xs px-3 py-1 bg-gray-100'>
                                {type_of_profile}
                              </p>
                            </div>
                          </div>
                        )}

                        {reason_to_join && reason_to_join.length > 0 && (
                          <div className='mb-2 group relative hover:bg-gray-100 rounded-lg p-2'>
                            <h3 className='font-semibold mb-2 text-xs text-gray-500 uppercase'>
                              Reason to Join Platform
                            </h3>
                            <div>
                              <div className='flex flex-wrap gap-2'>
                                {reason_to_join.map((reason, index) => (
                                  <span
                                    key={index}
                                    className='border-2 border-gray-500 rounded-full text-gray-700 text-xs px-3 py-1 bg-gray-100'
                                  >
                                    {reason}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {area_of_interest && (
                          <div className='mb-2 group relative hover:bg-gray-100 rounded-lg p-2'>
                            <h3 className='font-semibold mb-2 text-xs text-gray-500 uppercase'>
                              Area of Interest
                            </h3>
                            <div>
                              <div className='flex flex-wrap gap-2'>
                                {area_of_interest
                                  .split(', ')
                                  .map((interest, index) => (
                                    <span
                                      key={index}
                                      className='border-2 border-gray-500 rounded-full text-gray-700 text-xs px-3 py-1 bg-gray-100'
                                    >
                                      {interest}
                                    </span>
                                  ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {location && (
                          <div className='mb-2 group relative hover:bg-gray-100 rounded-lg p-2'>
                            <h3 className='font-semibold mb-2 text-xs text-gray-500 uppercase'>
                              Location
                            </h3>
                            <div className='flex gap-2'>
                              <PlaceOutlinedIcon
                                sx={{ fontSize: 'medium', marginTop: '3px' }}
                              />
                              <p className='text-sm'>{location}</p>
                            </div>
                          </div>
                        )}

                        {social_links && social_links.length > 0 && (
                          <div className='mb-2 group relative hover:bg-gray-100 rounded-lg p-2'>
                            <h3 className='font-semibold mb-2 text-xs text-gray-500 uppercase'>
                              Links
                            </h3>
                            <div className='flex items-center'>
                              <div className='flex gap-3'>
                                {social_links.map((linkObj, i) => {
                                  const link = linkObj?.link && linkObj.link[0];
                                  if (!link) return null;
                                  const icon = getSocialLogo(link);
                                  return (
                                    <a
                                      key={i}
                                      href={link}
                                      target='_blank'
                                      rel='noopener noreferrer'
                                      className='flex items-center space-x-2'
                                    >
                                      {icon}
                                    </a>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
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

export default DiscoverUserModal;

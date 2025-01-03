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
import DiscoverInvestorDetail from '../DiscoverInvestor/DiscoverInvestorDetail';

const DiscoverInvestorModal = ({
  openDetail,
  setOpenDetail,
  userData,
  value,
}) => {
  console.log('user data =>', userData.roleData);
  const investorProfile = userData.roleData;
  const [loading, setIsLoading] = useState(true);
  const userCurrentRoleStatusActiveRole = useSelector(
    (currState) => currState.currentRoleStatus.activeRole
  );
  const actor = useSelector((state) => state.actors.actor);
  const principal = useSelector((state) => state.internet.principal);

  const projectFullData = useSelector(
    (currState) => currState.projectData.data
  );
  useTimeout(() => setIsLoading(false));

  const [isAddInvestorModalOpen, setIsAddInvestorModalOpen] = useState(false);
  const [listProjectId, setListProjectId] = useState(null);
  const [listCohortId, setListCohortId] = useState(null);
  const [listEnrollmentPrincipal, setListEnrollmentPrincipal] = useState(null);
  const [projectProfile, setProjectProfile] = useState(null);
  const [projectName, setProjectName] = useState(null);
  const [selectedAssociationType, setSelectedAssociationType] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const projectId = projectFullData?.[0]?.[0]?.uid;

  const handleProjectCloseModal = () => {
    setIsAddInvestorModalOpen(false);
  };
  const handleProjectOpenModal = (val, cohortId, profile, name) => {
    setListProjectId(val);
    setListCohortId(cohortId);
    setProjectProfile(profile);
    setProjectName(name);
    setIsAddInvestorModalOpen(true);
  };
  console.log('listEnrollmentPrincipal', listEnrollmentPrincipal);

  // const handleAddProjectByType = async ({ message }) => {
  //   setIsSubmitting(true);

  //   try {
  //     if (!selectedAssociationType || !actor) {
  //       throw new Error('Invalid association type or missing data');
  //     }

  //     // Define common parameters
  //     const project_id = listProjectId || '';
  //     const msg = message;
  //     const is_cohort_association = true;
  //     const cohort_id = listCohortId ? [listCohortId] : [];

  //     // Determine function and additional parameters based on association type
  //     const associationFunctions = {
  //       mentor: {
  //         method: actor.send_offer_to_project_by_mentor,
  //         params: [
  //           project_id,
  //           msg,
  //           Principal.fromText(principal),
  //           is_cohort_association,
  //           cohort_id,
  //         ],
  //         successMessage: 'Offer sent to project as mentor successfully',
  //       },
  //       vc: {
  //         method: actor.send_offer_to_project_by_investor,
  //         params: [project_id, msg, is_cohort_association, cohort_id],
  //         successMessage: 'Offer sent to project as investor successfully',
  //       },
  //     };

  //     const associationType = selectedAssociationType.value;
  //     const selectedFunction = associationFunctions[associationType];

  //     if (!selectedFunction) {
  //       throw new Error('Unsupported association type');
  //     }

  //     // Call the selected function with the relevant parameters
  //     console.log(
  //       `Adding project as ${associationType.toUpperCase()}`,
  //       ...selectedFunction.params
  //     );

  //     const result = await selectedFunction.method(...selectedFunction.params);
  //     console.log('result', result);
  //     if (result) {
  //       toast.success(selectedFunction.successMessage);
  //     } else {
  //       toast.error('Something went wrong');
  //     }
  //   } catch (error) {
  //     console.error(
  //       `Error in ${selectedAssociationType.value} association:`,
  //       error
  //     );
  //     toast.error('Something went wrong');
  //   } finally {
  //     setIsSubmitting(false);
  //     handleProjectCloseModal();
  //   }
  // };

  // const handleAddMentor = async ({ message }) => {
  //   setIsSubmitting(true);
  //   if (actor && principal) {
  //     let mentor_id = Principal.fromText(principal);
  //     let msg = message;
  //     let project_id = listProjectId;
  //     let is_cohort_association = true;
  //     let cohort_id = listCohortId ? [listCohortId] : [];
  //     await actor
  //       .send_offer_to_mentor_from_project(
  //         mentor_id,
  //         msg,
  //         project_id,
  //         is_cohort_association,
  //         cohort_id
  //       )
  //       .then((result) => {
  //         console.log('result', result);
  //         if (result) {
  //           setIsSubmitting(false);
  //           handleProjectCloseModal();
  //           toast.success(result);
  //         } else {
  //           setIsSubmitting(false);
  //           handleProjectCloseModal();
  //           toast.error('something went wrong');
  //         }
  //       })
  //       .catch((error) => {
  //         console.error('error-in-send_offer_to_mentor_from_project', error);
  //         handleProjectCloseModal();
  //         setIsSubmitting(false);
  //         toast.error('something went wrong');
  //       });
  //   }
  // };
  const handleAddInvestor = async ({ message }) => {
    setIsSubmitting(true);
    console.log('add a investor');
    if (actor && principal) {
      let investor_id = Principal.fromText(principal);
      let msg = message;
      let project_id = projectId;
      let is_cohort_association = true;
      let cohort_id = listCohortId ? [listCohortId] : [];
      console.log('investor_id', principal);
      console.log('cohort_id', cohort_id);
      console.log('project_id', project_id);
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
    (value === true && role === 'Project') || role === 'All'
      ? roleData?.params?.project_logo && roleData?.params?.project_logo[0]
        ? uint8ArrayToBase64(roleData?.params?.project_logo[0])
        : roleData?.params?.project_logoe[0]
      : '';
  const projectname =
    (value === true && role === 'Project') || role === 'All'
      ? roleData?.params?.project_name
      : '';
  const cohort_id = value === true ? userData?.cohortid : '';
  const enrollerPrincipal = value === true ? userData?.userPrincipal : '';

  console.log('return project_id', project_id);

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
            } z-20`}
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
                        {userCurrentRoleStatusActiveRole === 'project' && (
                          <button
                            className='w-full h-[#155EEF] bg-white border-gray-300 text-black py-2 px-4 rounded-lg mb-2 flex items-center justify-center'
                            onClick={() =>
                              handleProjectOpenModal(
                                project_id,
                                cohort_id,
                                profilepic,
                                full_name
                              )
                            }
                          >
                            Send Association Request
                            <RiSendPlaneLine className='ml-2' />
                          </button>
                        )}
                      </>
                    )}
                  </div>

                  <div className='p-6 bg-white'>
                    <div className='mb-2 py-2'>
                      <h3 className='font-semibold mb-2 text-xs text-gray-500 uppercase'>
                        Roles
                      </h3>
                      <div className='flex space-x-2 mb-2'>
                        <span className='bg-[#F0F9FF] border border-[#B9E6FE] text-[#026AA2] px-1 py-1 rounded-md text-xs font-normal'>
                          OLYMPIAN
                        </span>
                      </div>

                      <hr />

                      <div className='px-1'>
                        {investorProfile?.params?.registered_country?.[0] && (
                          <div className='mb-2 group relative hover:bg-gray-100 rounded-lg py-2 '>
                            <h3 className='font-semibold mb-2 text-xs text-gray-500 uppercase'>
                              Registered Country
                            </h3>
                            <p className='text-sm'>
                              {investorProfile.params.registered_country[0]}
                            </p>
                          </div>
                        )}

                        {investorProfile?.params?.preferred_icp_hub && (
                          <div className='mb-2 group relative hover:bg-gray-100 rounded-lg py-2 '>
                            <h3 className='font-semibold mb-2 text-xs text-gray-500 uppercase'>
                              ICP Hub You Would Like to Be Associated With
                            </h3>
                            <p className='text-sm'>
                              {investorProfile.params.preferred_icp_hub}
                            </p>
                          </div>
                        )}

                        {investorProfile?.params?.investor_type?.[0] && (
                          <div className=' group relative hover:bg-gray-100 rounded-lg py-2 '>
                            <h3 className='font-semibold mb-2 text-xs text-gray-500 uppercase'>
                              Type of Investment
                            </h3>
                            <div className='flex overflow-hidden overflow-x-auto gap-2'>
                              {investorProfile.params.investor_type[0]
                                .split(',')
                                .map((interest, index) => (
                                  <span
                                    key={index}
                                    className='border-2 text-center min-w-[80px] truncate border-gray-500 rounded-full text-gray-700 text-xs px-2 py-1'
                                  >
                                    {interest.trim()}
                                  </span>
                                ))}
                            </div>
                          </div>
                        )}

                        {investorProfile?.params?.portfolio_link && (
                          <div className='mb-2 group relative hover:bg-gray-100 rounded-lg py-2 '>
                            <h3 className='font-semibold mb-2 text-xs text-gray-500 uppercase'>
                              Portfolio Link
                            </h3>
                            <p className='text-sm'>
                              {investorProfile.params.portfolio_link}
                            </p>
                          </div>
                        )}

                        {investorProfile?.params?.name_of_fund && (
                          <div className='mb-2 group relative hover:bg-gray-100 rounded-lg py-2 '>
                            <h3 className='font-semibold mb-2 text-xs text-gray-500 uppercase'>
                              Fund Name
                            </h3>
                            <p className='text-sm'>
                              {investorProfile.params.name_of_fund}
                            </p>
                          </div>
                        )}

                        {investorProfile?.params?.fund_size?.[0] && (
                          <div className='mb-2 group relative hover:bg-gray-100 rounded-lg py-2 '>
                            <h3 className='font-semibold mb-2 text-xs text-gray-500 uppercase'>
                              Fund Size
                            </h3>
                            <p className='text-sm'>
                              {investorProfile.params.fund_size[0]}
                            </p>
                          </div>
                        )}

                        {investorProfile?.params?.website_link && (
                          <div className=' group relative hover:bg-gray-100 rounded-lg py-2 '>
                            <h3 className='font-semibold mb-2 text-xs text-gray-500 uppercase'>
                              Website Link
                            </h3>
                            <p className='text-sm'>
                              {investorProfile.params.website_link}
                            </p>
                          </div>
                        )}

                        {investorProfile?.params
                          ?.project_on_multichain?.[0] && (
                          <div className=' group relative hover:bg-gray-100 rounded-lg py-2 '>
                            <h3 className='font-semibold mb-2 text-xs text-gray-500 uppercase'>
                              Selected Multi-Chains
                            </h3>
                            <div className='flex overflow-hidden overflow-x-auto gap-2'>
                              {investorProfile.params.project_on_multichain[0]
                                .split(',')
                                .map((chain, index) => (
                                  <span
                                    key={index}
                                    className='border-2 text-center min-w-[80px] truncate border-gray-500 rounded-full text-gray-700 text-xs px-2 py-1'
                                  >
                                    {chain.trim()}
                                  </span>
                                ))}
                            </div>
                          </div>
                        )}

                        {investorProfile?.params?.category_of_investment && (
                          <div className=' group relative hover:bg-gray-100 rounded-lg py-2 '>
                            <h3 className='font-semibold mb-2 text-xs text-gray-500 uppercase'>
                              Category of Investment
                            </h3>
                            <div className='flex overflow-hidden overflow-x-auto gapy-2'>
                              {investorProfile.params.category_of_investment
                                .split(',')
                                .map((category, index) => (
                                  <span
                                    key={index}
                                    className='border-2 text-center min-w-[80px] truncate border-gray-500 rounded-full text-gray-700 text-xs px-2 py-1'
                                  >
                                    {category.trim()}
                                  </span>
                                ))}
                            </div>
                          </div>
                        )}

                        {investorProfile?.params?.stage?.[0] && (
                          <div className=' group relative hover:bg-gray-100 rounded-lg py-2 '>
                            <h3 className='font-semibold mb-2 text-xs text-gray-500 uppercase'>
                              Stage(s) You Invest At
                            </h3>
                            <div className='flex overflow-hidden overflow-x-auto gapy-2'>
                              {investorProfile.params.stage[0]
                                .split(',')
                                .map((stage, index) => (
                                  <span
                                    key={index}
                                    className='border-2 text-center min-w-[80px] truncate border-gray-500 rounded-full text-gray-700 text-xs px-2 py-1'
                                  >
                                    {stage.trim()}
                                  </span>
                                ))}
                            </div>
                          </div>
                        )}

                        {investorProfile?.params?.range_of_check_size?.[0] && (
                          <div className=' group relative hover:bg-gray-100 rounded-lg py-2 '>
                            <h3 className='font-semibold mb-2 text-xs text-gray-500 uppercase'>
                              Checksize Range
                            </h3>
                            <div className='flex overflow-hidden overflow-x-auto gapy-2'>
                              {investorProfile.params.range_of_check_size[0]
                                .split(',')
                                .map((range, index) => (
                                  <span
                                    key={index}
                                    className='border-2 text-center min-w-[80px] truncate border-gray-500 rounded-full text-gray-700 text-xs px-2 py-1'
                                  >
                                    {range.trim()}
                                  </span>
                                ))}
                            </div>
                          </div>
                        )}

                        {investorProfile?.params?.links?.[0]?.length > 0 && (
                          <div className='mb-2 group relative hover:bg-gray-100 rounded-lg py-2 '>
                            <h3 className='font-semibold mb-2 text-xs text-gray-500 uppercase'>
                              LINKS
                            </h3>
                            <div className='flex flex-wrap gapy-2'>
                              {investorProfile.params.links[0].map((linkObj) =>
                                linkObj.link.map((link, index) => {
                                  const icon = getSocialLogo(link);
                                  return (
                                    <a
                                      key={index}
                                      href={link}
                                      target='_blank'
                                      rel='noopener noreferrer'
                                      className='flex items-center space-x-2'
                                    >
                                      {icon}
                                    </a>
                                  );
                                })
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className='px-3 py-4 lg1:py-0 w-full lg1:overflow-y-scroll lg1:w-[63%] '>
                  <div className='border-2'>
                    {' '}
                    <DiscoverInvestorDetail />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
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
    </>
  );
};

export default DiscoverInvestorModal;

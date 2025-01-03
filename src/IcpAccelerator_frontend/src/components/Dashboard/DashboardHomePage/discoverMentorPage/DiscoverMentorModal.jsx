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
import DiscoverMentorEvent from '../discoverMentor/DiscoverMentorEvent';

const DiscoverMentorModal = ({
  openDetail,
  setOpenDetail,
  userData,
  value,
  principal,
}) => {
  console.log('principal at 19', principal);
  console.log('principal after principal', principal[0].userPrincipal);

  const chiku = principal.map((user) => user.userPrincipal);

  console.log('user data =>', chiku);

  const mentorProfile = userData.roleData;

  const [loading, setIsLoading] = useState(true);
  const userCurrentRoleStatusActiveRole = useSelector(
    (currState) => currState.currentRoleStatus.activeRole
  );
  const actor = useSelector((state) => state.actors.actor);
  const projectFullData = useSelector(
    (currState) => currState.projectData.data
  );
  console.log('simple vala principal', principal);

  useTimeout(() => setIsLoading(false));

  const [isAddMentorModalOpen, setIsAddMentorModalOpen] = useState(false);
  const [listMentorId, setListMentorId] = useState(null);
  const [listCohortId, setListCohortId] = useState(null);
  const [projectProfile, setProjectProfile] = useState(null);
  const [projectName, setProjectName] = useState(null);
  const [selectedAssociationType, setSelectedAssociationType] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const projectId = projectFullData?.[0]?.[0]?.uid;

  const handleProjectCloseModal = () => {
    setIsAddMentorModalOpen(false);
  };
  const handleProjectOpenModal = (val, cohortId, profile, name) => {
    setListMentorId(val);
    setListCohortId(cohortId);
    setProjectProfile(profile);
    setProjectName(name);
    setIsAddMentorModalOpen(true);
  };

  const handleAddMentor = async ({ message }) => {
    setIsSubmitting(true);
    if (actor && listMentorId) {
      let mentor_id = Principal.fromText(listMentorId);
      let msg = message;
      let project_id = projectId;
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
  console.log('userData line 236', userData);
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
  console.log('roleData', roleData);

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
                            className='w-full h-[#155EEF] bg-white border-gray-300 text-black py-2 px-4 rounded-lg mb-4 flex items-center justify-center'
                            onClick={() =>
                              handleProjectOpenModal(
                                principal[0].userPrincipal.toText(),
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

                    <div className='px-1'>
                      {mentorProfile?.profile?.preferred_icp_hub?.[0] && (
                        <div className='mb-4 group relative hover:bg-gray-100 rounded-lg p-2 '>
                          <h3 className='font-semibold mb-2 text-xs text-gray-500 uppercase'>
                            Preferred ICP Hub
                          </h3>
                          <p className='text-sm'>
                            {mentorProfile.profile.preferred_icp_hub[0]}
                          </p>
                        </div>
                      )}

                      {mentorProfile?.profile?.area_of_expertise &&
                        mentorProfile.profile.area_of_expertise.length > 0 && (
                          <div className='mb-4 group relative hover:bg-gray-100 rounded-lg p-2 '>
                            <h3 className='font-semibold mb-2 text-xs text-gray-500 uppercase'>
                              Area of Expertise
                            </h3>
                            <div className='flex overflow-hidden overflow-x-auto gap-2'>
                              {mentorProfile.profile.area_of_expertise.map(
                                (expertise) => (
                                  <span
                                    key={expertise}
                                    className='border-2 text-center min-w-[80px] truncate border-gray-500 rounded-full text-gray-700 text-xs px-2 py-1'
                                  >
                                    {expertise}
                                  </span>
                                )
                              )}
                            </div>
                          </div>
                        )}

                      {mentorProfile?.profile?.website?.[0] && (
                        <div className='mb-4 group relative hover:bg-gray-100 rounded-lg p-2 '>
                          <h3 className='font-semibold mb-2 text-xs text-gray-500 uppercase'>
                            Website Link
                          </h3>
                          <p className='text-sm line-clamp-1 break-all'>
                            {mentorProfile.profile.website[0]}
                          </p>
                        </div>
                      )}

                      {mentorProfile?.profile?.years_of_mentoring && (
                        <div className='mb-4 group relative hover:bg-gray-100 rounded-lg p-2 '>
                          <h3 className='font-semibold mb-2 text-xs text-gray-500 uppercase'>
                            Years of Mentoring
                          </h3>
                          <p className='text-sm line-clamp-1 break-all'>
                            {mentorProfile.profile.years_of_mentoring}
                          </p>
                        </div>
                      )}

                      {mentorProfile?.profile?.reason_for_joining?.[0] && (
                        <div className='mb-4 group relative hover:bg-gray-100 rounded-lg p-2 '>
                          <h3 className='font-semibold mb-2 text-xs text-gray-500 uppercase'>
                            Reasons to Join Platform
                          </h3>
                          <div className='flex overflow-hidden overflow-x-auto gap-2'>
                            {mentorProfile.profile.reason_for_joining[0]
                              .split(',')
                              .map((reason, index) => (
                                <span
                                  key={index}
                                  className='border-2 text-center min-w-[80px] truncate border-gray-500 rounded-full text-gray-700 text-xs px-2 py-1'
                                >
                                  {reason.trim()}
                                </span>
                              ))}
                          </div>
                        </div>
                      )}

                      {mentorProfile?.profile?.hub_owner?.[0] && (
                        <div className='mb-4 group relative hover:bg-gray-100 rounded-lg p-2 '>
                          <h3 className='font-semibold mb-2 text-xs text-gray-500 uppercase'>
                            ICP Hub Owner
                          </h3>
                          <p className='text-sm'>
                            {mentorProfile.profile.hub_owner[0]}
                          </p>
                        </div>
                      )}

                      {mentorProfile?.profile
                        ?.category_of_mentoring_service && (
                        <div className='mb-4 group relative hover:bg-gray-100 rounded-lg p-2 '>
                          <h3 className='font-semibold mb-2 text-xs text-gray-500 uppercase'>
                            Mentoring Services
                          </h3>
                          <div className='flex overflow-hidden overflow-x-auto gap-2'>
                            {mentorProfile.profile.category_of_mentoring_service
                              .split(',')
                              .map((service, index) => (
                                <span
                                  key={index}
                                  className='border-2 text-center min-w-[80px] truncate border-gray-500 rounded-full text-gray-700 text-xs px-2 py-1'
                                >
                                  {service.trim()}
                                </span>
                              ))}
                          </div>
                        </div>
                      )}

                      {mentorProfile?.profile?.links?.[0] && (
                        <div className='mb-4 group relative hover:bg-gray-100 rounded-lg p-2 '>
                          <h3 className='font-semibold mb-2 text-xs text-gray-500 uppercase'>
                            LINKS
                          </h3>
                          <div className='flex flex-wrap gap-2'>
                            {mentorProfile.profile.links[0].map((linkObj) =>
                              linkObj.link?.map((link, index) => {
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
                <div className='px-3 py-4 lg1:py-0 w-full lg1:overflow-y-scroll lg1:w-[63%] '>
                  <DiscoverMentorEvent principal={chiku} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

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

export default DiscoverMentorModal;

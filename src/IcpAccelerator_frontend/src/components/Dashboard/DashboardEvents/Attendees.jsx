import React, { useState, useEffect, useCallback } from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import uint8ArrayToBase64 from '../../Utils/uint8ArrayToBase64';
import CloseIcon from '@mui/icons-material/Close';
import NoData from '../../NoDataCard/NoData';
import AttendeeCardSkeleton from './DashboardEventSkeletons/AttendeesSkeleton';
import useTimeout from '../../hooks/TimeOutHook';
import { FaFilter } from 'react-icons/fa';
import StarIcon from '@mui/icons-material/Star';
import DiscoverUserModal from '../DashboardHomePage/discoverMentorPage/DiscoverUserModal';
import Rating1 from '../../Modals/RatingModals/Rating1';
const AttendeesCard = ({ member, appliedRole, handleClick, handleRating }) => {
  const onRateClick = () => handleRating(member?.uid);

  return (
    <div className='flex flex-col md:flex-row items-center p-4 bg-white shadow-md rounded-lg mb-6 transition-all hover:shadow-lg'>
      <div className='flex justify-center md:justify-start mb-4 md:mb-0'>
        <div className='w-[60px] h-[60px] sm:w-[70px] sm:h-[70px]'>
          <img
            src={member.profile_picture}
            alt={member.full_name}
            className='w-full h-full rounded-full object-cover'
            loading='lazy'
            draggable={false}
          />
        </div>
      </div>

      <div className='md:ml-6 flex-1 text-center md:text-left'>
        <div className='flex flex-col md:flex-row md:items-center'>
          <div className='flex-1'>
            <div className='flex justify-between items-center'>
              <h4 className='text-lg font-bold text-[#2C3E50]  items-center'>
                <span className='inline-block max-w-[150px] md:max-w-[200px] truncate'>
                  {member.full_name}
                </span>
                <span className='bg-[#eff3f5] border-[#70b2e9] border font-normal text-[#181b1e] rounded-md text-sm px-3 py-0.5 mx-2  inline-block line-clamp-1 break-all'>
                  Level 4
                </span>
              </h4>

              {/* Buttons for large screens */}
              <div className='hidden dxl0:flex space-x-2'>
                <button
                  className='block w-full md:w-auto text-gray-600 hover:text-gray-800 hover:bg-gray-200 bg-white px-3 py-0.5 rounded-md shadow-sm border border-gray-200 hover:border-gray-700 line-clamp-1 break-all'
                  onClick={() => handleClick(member)}
                >
                  View Profile
                </button>
                {member.role === 'Project' && (
                  <button
                    className='w-full md:w-auto flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-gray-200 bg-white px-3 py-0.5 rounded-md shadow-sm border border-gray-200 hover:border-gray-700'
                    onClick={onRateClick}
                  >
                    <StarIcon
                      className='mr-1 text-white'
                      fontSize='small'
                      style={{ stroke: 'black', strokeWidth: 1 }}
                    />
                    Rate
                  </button>
                )}
              </div>
            </div>

            {/* Username */}
            <p className='text-sm text-gray-500 break-all'>
              @{member.username}
            </p>

            {/* Project and User Labels */}
            <div className='flex justify-center md:justify-start space-x-2 mt-2'>
              <div className='bg-[#fff0eb] border-[#f35454] border text-[#090907] rounded-md text-sm px-3 py-0.5'>
                User
              </div>
              {member.role === 'Project' && (
                <div className='bg-[#daebf3] border-[#70b2e9] border text-[#144579] rounded-md text-sm px-3 py-0.5'>
                  Project
                </div>
              )}
              {member.role === 'Mentor' && (
                <div className='bg-[#ecf5e7] border-[#5ff470] border text-[#366e1f] rounded-md text-sm px-3 py-0.5'>
                  Mentor
                </div>
              )}
              {member.role === 'Investor' && (
                <div className='bg-[#f5f5c1] border-[#cbdb42] border text-[#0d0f04] rounded-md text-sm px-3 py-0.5'>
                  Investor
                </div>
              )}
            </div>

            <div className='mt-4 space-y-2 md:space-y-0 md:flex md:space-x-2 dxl0:hidden'>
              <button
                className='block w-full md:w-auto text-gray-600 hover:text-gray-800 hover:bg-gray-200 bg-white px-3 py-0.5 rounded-md shadow-sm border border-gray-200 hover:border-gray-700 '
                onClick={() => handleClick(member)}
              >
                View Profile
              </button>
              {member.role === 'Project' && (
                <button
                  className='w-full md:w-auto flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-gray-200 bg-white px-3 py-0.5 rounded-md shadow-sm border border-gray-200 hover:border-gray-700'
                  onClick={onRateClick}
                >
                  <StarIcon
                    className='mr-1 text-white'
                    fontSize='small'
                    style={{ stroke: 'black', strokeWidth: 1 }}
                  />
                  Rate
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Attendees = (cohortData) => {
  const [showMenu, setShowMenu] = useState(false);
  const [selectedRole, setSelectedRole] = useState('All');
  const [appliedRole, setAppliedRole] = useState('');
  const [attendees, setAttendees] = useState([]);
  const [noData, setNoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [cardDetail, setCardDetail] = useState(null);
  const [projectId, setProjectId] = useState(null);
  const [attendeeRole, setAttendeeRole] = useState(null);
  const actor = useSelector((currState) => currState.actors.actor);
  const location = useLocation();
  useTimeout(() => setLoading(false));

  const cohortid = cohortData?.cohortData?.cohort_id;

  useEffect(() => {
    if (!cohortid) {
      console.error('Cohort ID is undefined.');
    } else {
      handleApply(); // Fetch all attendees when the component mounts
    }
  }, [cohortid]);

  const toggleMenu = () => setShowMenu(!showMenu);

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  const fetchDataForRole = async (role) => {
    if (!cohortid) {
      toast.error('Cohort ID is not available.');
      return [];
    }
    let result;

    switch (role) {
      case 'Project':
        result = await actor.get_projects_applied_for_cohort(cohortid);
        break;
      case 'Mentor':
        result = await actor.get_mentors_applied_for_cohort(cohortid);
        break;
      case 'Investor':
        result = await actor.get_vcs_applied_for_cohort(cohortid);
        break;
      default:
        return [];
    }
    console.log('result: ', result);
    if (result?.Ok && Array.isArray(result.Ok)) {
      console.log('my attendees data in result 145', result);
      return result.Ok.map((item) => ({
        full_name: item[1].params.full_name,
        username: item[1].params.openchat_username[0],
        area_of_interest: item[1].params.area_of_interest,
        bio: item[1].params.bio,
        country: item[1].params.country,
        email: item[1].params.email[0],
        profile_picture: item[1].params.profile_picture[0]
          ? uint8ArrayToBase64(item[1].params.profile_picture[0])
          : [],
        reason_to_join: item[1].params.reason_to_join[0],
        social_links: item[1].params.social_links[0],
        type_of_profile: item[1].params.type_of_profile[0],
        badges: item[1].params.badges || [],
        uid: item[0]?.uid || '',
        userPrincipal: item[2] || '',
        roleData: item[0],
        cohortid: cohortid,
      }));
    } else {
      return [];
    }
  };

  const handleClick = (member) => {
    setOpenDetail(true);
    setCardDetail(member);
  };
  const [isRating, setIsRating] = useState(false);
  console.log('isRating', isRating);
  const handleRating = useCallback((projectId) => {
    setIsRating(true);
    setProjectId(projectId);
  }, []);

  const handleApply = async () => {
    setShowMenu(false);
    setAppliedRole(selectedRole);
    setLoading(true);
    let data = [];

    try {
      if (selectedRole === 'All') {
        const projectData = (await fetchDataForRole('Project')).map((item) => ({
          ...item,
          role: 'Project',
        }));
        const mentorData = (await fetchDataForRole('Mentor')).map((item) => ({
          ...item,
          role: 'Mentor',
        }));
        const investorData = (await fetchDataForRole('Investor')).map(
          (item) => ({
            ...item,
            role: 'Investor',
          })
        );

        data = [...projectData, ...mentorData, ...investorData];
      } else {
        data = (await fetchDataForRole(selectedRole)).map((item) => ({
          ...item,
          role: selectedRole,
        }));
      }
      console.log('attendes', data);
      setAttendees(data);
      setNoData(data.length === 0);
      if (data.length === 0) {
        toast.error(`No ${selectedRole.toLowerCase()} data available`);
      }
    } catch (error) {
      console.error(
        `Error fetching ${selectedRole.toLowerCase()} data:`,
        error
      );
      toast.error(`Failed to fetch ${selectedRole.toLowerCase()} data`);
    }
    setLoading(false);
  };

  return (
    <div className='rounded-xl'>
      <div className='mx-2'>
        <div className='justify-end items-center mb-6'>
          <div className='flex items-center justify-between gap-6 my-4'>
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
              onClick={toggleMenu}
              className='text-gray-400 text-xl md:text-2xl cursor-pointer'
            />
          </div>

          {showMenu && (
            <div
              className={`fixed top-0 right-0 inset-0 z-50 transition-opacity duration-700 ease-in-out ${
                showMenu
                  ? 'opacity-100 bg-opacity-30'
                  : 'opacity-0 bg-opacity-0'
              } bg-black backdrop-blur-xs`}
            >
              <div
                className={`transition-transform duration-300 ease-in-out transform ${
                  showMenu ? 'translate-x-0' : 'translate-x-full'
                } mx-auto w-full md:w-[25%] absolute right-0 top-0 z-10 bg-white h-screen flex flex-col`}
              >
                <div className='p-5 flex justify-start'>
                  <CloseIcon sx={{ cursor: 'pointer' }} onClick={toggleMenu} />
                </div>
                <div className='container p-5 flex-grow'>
                  <h3 className='mb-4 text-lg font-semibold'>Filter</h3>
                  <div className='mb-4'>
                    <label className='block text-gray-700 text-sm font-bold mb-2'>
                      Role
                    </label>
                    <div className='flex flex-col gap-2'>
                      <label>
                        <input
                          type='radio'
                          name='role'
                          value='Project'
                          checked={selectedRole === 'Project'}
                          onChange={handleRoleChange}
                          className='h-4 w-4 text-blue-600 form-radio checked:bg-blue-600 border border-black rounded-full cursor-pointer mr-2'
                        />
                        Project
                      </label>
                      <label>
                        <input
                          type='radio'
                          name='role'
                          value='Mentor'
                          checked={selectedRole === 'Mentor'}
                          onChange={handleRoleChange}
                          className='h-4 w-4 text-blue-600 form-radio checked:bg-blue-600 border border-black rounded-full cursor-pointer mr-2'
                        />
                        Mentor
                      </label>
                      <label>
                        <input
                          type='radio'
                          name='role'
                          value='Investor'
                          checked={selectedRole === 'Investor'}
                          onChange={handleRoleChange}
                          className='h-4 w-4 text-blue-600 form-radio checked:bg-blue-600 border border-black rounded-full cursor-pointer mr-2'
                        />
                        Investor
                      </label>
                      <label>
                        <input
                          type='radio'
                          name='role'
                          value='All'
                          checked={selectedRole === 'All'}
                          onChange={handleRoleChange}
                          className='h-4 w-4 text-blue-600 form-radio checked:bg-blue-600 border border-black rounded-full cursor-pointer mr-2'
                        />
                        All
                      </label>
                    </div>
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
        </div>

        <div>
          {loading ? (
            attendees.length > 0 ? (
              attendees.map((_, idx) => <AttendeeCardSkeleton key={idx} />)
            ) : null
          ) : attendees && attendees.length === 0 ? (
            <NoData message={'No attendees available for the selected role.'} />
          ) : (
            attendees.map((member, idx) => (
              <AttendeesCard
                key={idx}
                member={member}
                appliedRole={appliedRole}
                handleClick={handleClick}
                handleRating={handleRating}
              />
            ))
          )}

          {openDetail && (
            <DiscoverUserModal
              openDetail={openDetail}
              setOpenDetail={setOpenDetail}
              userData={cardDetail}
              value={true}
            />
          )}
          {isRating && (
            <Rating1
              position={'center'}
              projectId={projectId}
              isRating={isRating}
              setIsRating={setIsRating}
              cohortid={cohortid}
            />
          )}
        </div>
      </div>
    </div>
  );
};
export default Attendees;

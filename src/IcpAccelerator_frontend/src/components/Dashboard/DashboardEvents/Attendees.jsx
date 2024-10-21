import React, { useState, useEffect } from 'react';
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
const AttendeesCard = ({ member }) => {
  return (
    <div className='md:flex  p-4 bg-white shadow-md rounded-lg mb-6 transition-all items-center hover:shadow-lg text-center md:text-left'>
      <div className='flex justify-center '>
        <div className='w-[70px] h-[70px]'>
          <img
            src={member.profile_picture}
            alt={member.full_name}
            className='w-full h-full rounded-full object-cover'
            loading='lazy'
            draggable={false}
          />
        </div>
      </div>
      <div className='md:ml-6 flex-1'>
        <h4 className='text-lg font-bold text-[#2C3E50] line-clamp-1 break-all truncate'>
          {member.full_name}
        </h4>
        <p className='text-sm text-gray-500 line-clamp-1 break-all truncate'>
          @{member.username}
        </p>
        <div className='border-t border-gray-200 mt-2'></div>

        <p className='text-sm text-left text-gray-500 mt-2 md:max-w-[600px] line-clamp-2 break-all'>
          {member.bio || 'No bio available'}
        </p>

        <div className='flex flex-wrap gap-2 mt-1'>
          <div className='flex flex-wrap gap-2'>
            {member.reason_to_join?.map((reason) => (
              <span
                key={reason}
                className='bg-[#F4F7FC] font-medium border border-[#CDD5DF] text-[#364152] px-3 py-1 rounded-full text-sm inline-block '
              >
                {reason}
              </span>
            ))}
          </div>
          <p className='bg-[#F4F7FC] font-medium border border-[#CDD5DF] text-[#364152] px-3 py-1 rounded-full text-sm inline-block'>
            {member.area_of_interest || 'No area specified'}
          </p>
        </div>

        <div className='flex items-center mt-1'>
          <PlaceOutlinedIcon
            className='text-gray-500 h-5 w-5 mr-2'
            fontSize='small'
          />
          <span className='text-[#2C3E50] text-sm'>
            {member.country || 'Unknown'}
          </span>
        </div>
      </div>
    </div>
  );
};

const Attendees = (cohortData) => {
  console.log('cohort data 70', cohortData);
  console.log('cohort data 71', cohortData?.cohortData?.cohort_id);
  const [showMenu, setShowMenu] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [appliedRole, setAppliedRole] = useState('');
  const [attendees, setAttendees] = useState([]);
  const [noData, setNoData] = useState(null);
  const actor = useSelector((currState) => currState.actors.actor);
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  useTimeout(() => setLoading(false));
  // const { cohort_id } = location.state || {};
  const cohortid = cohortData?.cohortData?.cohort_id;

  console.log('cohort id kya h 79 pe', cohortid);

  useEffect(() => {
    if (!cohortid) {
      console.error('Cohort ID is undefined.');
    }
  }, [cohortid]);

  const toggleMenu = () => setShowMenu(!showMenu);

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  const handleApply = async () => {
    setShowMenu(false);
    setAppliedRole(selectedRole);

    if (!cohortid) {
      toast.error('Cohort ID is not available.');
      return;
    }

    try {
      let data = [];
      let result = null;

      if (selectedRole === 'Project') {
        result = await actor.get_projects_applied_for_cohort(cohortid);
      } else if (selectedRole === 'Mentor') {
        result = await actor.get_mentors_applied_for_cohort(cohortid);
      } else if (selectedRole === 'Investor') {
        result = await actor.get_vcs_applied_for_cohort(cohortid);
      }

      if (result?.Ok && Array.isArray(result.Ok)) {
        data = result.Ok.map((item) => ({
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
          badges: item[1].params.badges || [],
        }));
        setNoData(false);
      } else {
        toast.error(
          `Invalid data format received for ${selectedRole.toLowerCase()}`
        );
        setNoData(true);
      }

      setAttendees(data);
      if (data.length === 0) {
        setNoData(true);
        toast.error(`No ${selectedRole.toLowerCase()} data available`);
      }
    } catch (error) {
      console.error(
        `Error fetching ${selectedRole.toLowerCase()} data:`,
        error
      );
      toast.error(`Failed to fetch ${selectedRole.toLowerCase()} data`);
    }
  };

  const handleCancel = () => {
    setSelectedRole('');
    setShowMenu(false);
  };

  return (
    <div className='rounded-xl '>
      <div className='mx-2'>
        <div className=' justify-end items-center mb-6'>
          {/* <h2 className="text-xl font-semibold text-gray-900">Attendees</h2> */}

          <div className='flex items-center justify-between  gap-6 my-4'>
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

          <div>
            {/* {attendees && attendees.length === 0 ? (
            // <p>No attendees available for the selected role.</p>
            <NoData message={'No attendees available for the selected role.'} />
          ) : (
            attendees.map((member, idx) => (
              <AttendeesCard key={idx} member={member} />
            ))
          )} */}
            {loading ? (
              attendees.length > 0 ? (
                attendees.map((_, idx) => <AttendeeCardSkeleton key={idx} />)
              ) : null
            ) : attendees && attendees.length === 0 ? (
              <NoData
                message={'No attendees available for the selected role.'}
              />
            ) : (
              attendees.map((member, idx) => (
                <AttendeesCard key={idx} member={member} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendees;

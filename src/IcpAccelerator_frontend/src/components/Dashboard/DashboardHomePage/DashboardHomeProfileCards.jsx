import React, { useEffect, useState } from 'react';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import VerifiedIcon from '@mui/icons-material/Verified';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import DashboardProfileView from './DashboardProfileView';
import RatingCard from '../../Common/RatingCard';
import RatingReview from '../../Common/RatingReview';
import user from '../../../../assets/Logo/mentor.png';
import mentor from '../../../../assets/Logo/talent.png';
import project from '../../../../assets/Logo/founder.png';
import investor from '../../../../assets/Logo/Avatar3.png';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardProjectCard from './DashboardProjectCard';
import DashboardHomeProfileCardsSkeleton from './DashbooardHomepageSkeletons/DashboardHomeProfileCardsSkeleton';
import DashboardHomeProfileCardsmainprofileSkeleton from './DashbooardHomepageSkeletons/DashboardHomeProfileCardsSkeleton';

function getAvatarsByRoles(approvedRoles) {
  const defaultAvatar = user;
  const mentorAvatar = mentor;
  const investorAvatar = investor;
  const projectAvatar = project;

  let firstCardAvatar = defaultAvatar;
  let secondCardAvatar = defaultAvatar;

  // Prioritize combinations of mentor and investor
  if (approvedRoles.includes('mentor') && approvedRoles.includes('vc')) {
    firstCardAvatar = mentorAvatar;
    secondCardAvatar = investorAvatar;
  } else if (approvedRoles.includes('vc') && approvedRoles.includes('mentor')) {
    firstCardAvatar = investorAvatar;
    secondCardAvatar = mentorAvatar;
  }
  // If only one of mentor or investor is present
  else if (approvedRoles.includes('mentor')) {
    firstCardAvatar = defaultAvatar;
    secondCardAvatar = mentorAvatar;
  } else if (approvedRoles.includes('vc')) {
    firstCardAvatar = defaultAvatar;
    secondCardAvatar = investorAvatar;
  }
  // Handle user combined with other roles
  else if (
    approvedRoles.includes('user') &&
    approvedRoles.includes('project')
  ) {
    firstCardAvatar = defaultAvatar;
    secondCardAvatar = projectAvatar;
  } else if (
    approvedRoles.includes('user') &&
    approvedRoles.includes('mentor')
  ) {
    firstCardAvatar = defaultAvatar;
    secondCardAvatar = mentorAvatar;
  } else if (approvedRoles.includes('user') && approvedRoles.includes('vc')) {
    firstCardAvatar = defaultAvatar;
    secondCardAvatar = investorAvatar;
  }
  // Handle single roles
  else if (approvedRoles.includes('user') && approvedRoles.length === 1) {
    firstCardAvatar = defaultAvatar;
    secondCardAvatar = defaultAvatar;
  } else if (approvedRoles.includes('project') && approvedRoles.length === 1) {
    firstCardAvatar = defaultAvatar;
    secondCardAvatar = projectAvatar;
  }

  return [firstCardAvatar, secondCardAvatar];
}

function DashboardHomeProfileCards(percentage) {
  const navigate = useNavigate();
  const location = useLocation();
  const userFullData = useSelector((currState) => currState.userData.data.Ok);
  const [show, setShow] = useState(true);
  const [activeTab, setActiveTab] = useState('project');
  const [isLoading, setIsLoading] = useState(true);
  const userRoles = useSelector(
    (currState) => currState.currentRoleStatus.activeRole
  );
  const userCurrentRoleStatus = useSelector(
    (currState) => currState.currentRoleStatus.rolesStatusArray
  );
  const approvedRoles = userCurrentRoleStatus
    .filter((role) => role.approval_status === 'approved')
    .map((role) => role.name);
  console.log('.../.../.../../userrole', userCurrentRoleStatus);
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab) {
      setActiveTab(tab);
    } else {
      setActiveTab('project');
    }
    //  const timer = setTimeout(() => {
    //   setIsLoading(false);
    // }, 1000);

    // return () => clearTimeout(timer);
  }, [location.search]);

  const handleChange = (tab) => {
    setActiveTab(tab);

    // Update the URL with the selected tab
    navigate(`/dashboard/profile?tab=${tab}`);
  };

  const [firstCardAvatar, secondCardAvatar] = getAvatarsByRoles(approvedRoles);
  // if (isLoading) {
  //   return <DashboardHomeProfileCardsSkeleton />;
  // }

  return (
    <>
      <div className='grid grid-cols-1 dlg:grid-cols-2 lgx:grid-cols-3 gap-6 mt-6 lg:p-6'>
        {/* main profile card */}
        <div className='bg-white rounded-lg shadow-sm p-6 border'>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='ss2:text-xl font-bold'>Main profile</h2>
            <Link
              to='/dashboard/profile'
              className='text-blue-500 text-xs ss:font-normal '
            >
              Manage &gt;
            </Link>
          </div>
          <div className='bg-gray-50 rounded-lg p-4 relative overflow-hidden'>
            <div
              className='absolute top-0 left-0 right-0 h-[5px] bg-green-500'
              style={{ width: percentage }}
            ></div>
            <div className='flex flex-col items-center pt-2'>
              <div className=' bg-gray-300 rounded-full mb-3 overflow-hidden'>
                <img
                  src={userFullData?.profile_picture[0]}
                  alt='Profile Image'
                  className='w-24 h-24 rounded-full object-cover'
                  loading='lazy'
                  draggable={false}
                />
              </div>
              <span className='inline-block bg-[#F0F9FF] border border-[#B9E6FE] text-[#026AA2] text-xs font-semibold px-2 py-1 rounded-md mb-2'>
                OLYMPIAN
              </span>
              <h3 className='sm1:text-lg font-semibold flex items-center mb-1'>
                <span className='text-blue-500 ml-1'>
                  <VerifiedIcon
                    className='text-blue-500 mr-1'
                    fontSize='small'
                  />
                </span>
                {userFullData?.full_name}
              </h3>
              <p className='text-gray-500'>
                @{userFullData?.openchat_username[0]}
              </p>
            </div>
          </div>
        </div>

        {/* Rating card */}
        <div className='bg-white rounded-lg shadow-sm p-6 border'>
          <div className='flex justify-between items-center mb-4'>
            <div className='flex items-center'>
              <h2 className='ss2:text-xl font-bold mr-2'>Rating</h2>
              <HelpOutlineOutlinedIcon
                className='text-gray-400'
                fontSize='small'
              />
            </div>
            <Link
              to='/dashboard/profile'
              className='text-blue-500 text-xs ss:font-normal flex '
            >
              <span className='sxxs:hidden dxs:block lgx:hidden dxl0:block block pr-1'>
                View
              </span>{' '}
              Details &gt;
            </Link>
          </div>

          {show === true ? (
            <RatingCard show={show} setShow={setShow} />
          ) : (
            <RatingReview />
          )}
        </div>

        {/* Roles card */}
        <div className='bg-white rounded-lg shadow-sm p-6 border'>
          <div className='flex justify-between items-center mb-4'>
            <div className='flex items-center'>
              <h2 className='ss2:text-xl font-bold mr-2'>Roles</h2>
              <HelpOutlineOutlinedIcon
                className='text-gray-400'
                fontSize='small'
              />
            </div>
            <Link
              to='/dashboard/profile'
              className='text-blue-500 text-xs ss:font-normal'
            >
              Manage &gt;
            </Link>
          </div>
          <div className='mt-2 h-35 flex justify-center items-center border border-dashed border-gray-300 rounded-lg p-6'>
            <div className='w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center'>
              <img
                src={firstCardAvatar}
                className='text-gray-400 w-12 h-12'
                loading='lazy'
                draggable={false}
              />
            </div>
          </div>
          <div className='mt-4 h-35 flex justify-center items-center border border-dashed border-gray-300 rounded-lg p-6'>
            <div className='w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center'>
              <img
                src={secondCardAvatar}
                className='text-gray-400 w-12 h-12'
                loading='lazy'
                draggable={false}
              />
            </div>
          </div>
        </div>
      </div>
      <div className='bg-white w-full rounded-lg shadow-sm lg:shadow-none  mt-8 lg:p-6'>
        <DashboardProfileView />
      </div>
    </>
  );
}
export default DashboardHomeProfileCards;

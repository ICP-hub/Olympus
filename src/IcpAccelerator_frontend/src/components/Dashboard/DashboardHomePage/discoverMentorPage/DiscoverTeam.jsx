import React, { useState } from 'react';
import uint8ArrayToBase64 from '../../../Utils/uint8ArrayToBase64';
import NoDataFound from '../../DashboardEvents/NoDataFound';
import getSocialLogo from '../../../Utils/navigationHelper/getSocialLogo';
import useTimeout from '../../../hooks/TimeOutHook';
import DiscoverTeamSkeleton from './DiscoverMentorPageSkeleton/DiscoverTeamSkeleton';

const TeamCard = ({ member }) => {
  const profile = member?.profile_picture[0]
    ? uint8ArrayToBase64(member?.profile_picture[0])
    : '';

  let links = member?.social_links?.links?.[0];

  return (
    <div className='flex flex-col sm0:flex-row gap-6 sm0:items-center p-4 bg-white shadow-lg border border-gray-200 rounded-xl mt-3  mb-4'>
      <div className='bg-gray-100 min-w-[100px] w-full p-2 sm0:p-0 sm0:w-[100px] sm0:h-[100px] flex items-center justify-center'>
        <img
          src={profile}
          alt={member?.full_name}
          className='sm0:w-[70px] sm0:h-[70px] w-[100px] h-[100px] rounded-full'
          loading='lazy'
          draggable={false}
        />
      </div>

      <div className='ml-4'>
        <h4 className='text-base font-semibold line-clamp-1 break-all'>{member?.full_name}</h4>
        <p className='text-gray-500 text-sm line-clamp-1 break-all'>{member?.openchat_username}</p>
        <p className='text-gray-600 text-base mt-2 line-clamp-2 break-all'>{member?.bio[0]}</p>

        {links?.link.map((alllink, i) => {
          const icon = getSocialLogo(alllink);
          return (
            <div key={i} className='flex items-center space-x-2'>
              {icon ? (
                <a href={alllink} target='_blank' rel='noopener noreferrer'>
                  {icon}
                </a>
              ) : (
                ''
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const DiscoverTeam = ({ projectDetails }) => {
  const members = projectDetails.project_team?.[0] || [];
  const [isLoading,setIsLoading]=useState(true)

  useTimeout(()=>setIsLoading(false))

  return (
    <>
      {members.length > 0 ? (
        <div className='md1:p-3 lg1:p-2 dxl1:p-6  rounded-xl mt-3 '>
          <div className='mx-auto'>
            <div className='flex justify-end items-center mb-6'>
              {/* <h2 className="text-xl font-semibold text-gray-900">Team</h2> */}
              <a href='#' className='text-sm font-medium text-blue-500'>
                View all team
              </a>
            </div>
          </div>
          {isLoading ? <>{[...Array(members.length)].map((_,index)=><DiscoverTeamSkeleton/>)} </>:
          members.map((member, ind) => (
            <TeamCard key={ind} member={member?.member_data} />
          ))}
        </div>
      ) : (
        <NoDataFound message='No Team Member found' />
      )}
    </>
  );
};

export default DiscoverTeam;

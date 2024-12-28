import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { formatFullDateFromBigInt } from '../../Utils/formatter/formatDateFromBigInt';

import uint8ArrayToBase64 from '../../Utils/uint8ArrayToBase64';

import { Principal } from '@dfinity/principal';
import NoCardData from '../../profile/NoCardData';
import AnnouncementCardSkeleton from '../../profile/skeletonProfile/AnnouncementCardSkeleton';

const CohortAnnouncement = () => {
  const actor = useSelector((currState) => currState.actors.actor);
  const principal = useSelector((currState) => currState.internet.principal);
  const [latestAnnouncementData, setLatestAnnouncementData] = useState([]);
  const [noData, setNoData] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [numSkeletons, setNumSkeletons] = useState(1);

  const fetchLatestAnnouncements = async () => {
    let convertedId = Principal.fromText(principal);
    setIsLoading(true);

    try {
      const result = await actor.get_announcements_by_principal(convertedId);

      if (!result || result.length === 0) {
        setNoData(true);
        setLatestAnnouncementData([]);
      } else {
        setLatestAnnouncementData(result);
        setNoData(false);
      }
    } catch (error) {
      setNoData(true);
      setLatestAnnouncementData([]);
      console.error('Error fetching announcements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (actor) {
      fetchLatestAnnouncements();
    }
  }, [actor]);

  const updateNumSkeletons = () => {
    if (window.innerWidth >= 1100) {
      setNumSkeletons(3);
    } else if (window.innerWidth >= 768) {
      setNumSkeletons(2);
    } else {
      setNumSkeletons(1);
    }
  };

  useEffect(() => {
    updateNumSkeletons();
    window.addEventListener('resize', updateNumSkeletons);
    return () => {
      window.removeEventListener('resize', updateNumSkeletons);
    };
  }, []);

  return (
    <div className='bg-white w-full'>
      {noData ? (
        <div className='md:py-4 py-12'>
          <NoCardData />
        </div>
      ) : isLoading ? (
        <div className='md:py-4 py-12'>
          {Array(numSkeletons)
            .fill(0)
            .map((_, index) => (
              <AnnouncementCardSkeleton key={index} />
            ))}
        </div>
      ) : (
        latestAnnouncementData.map((card, index) => {
          const ann_name = card?.announcement_data?.announcement_title ?? '';
          const ann_time = card?.timestamp
            ? formatFullDateFromBigInt(card?.timestamp)
            : '';
          const ann_desc =
            card?.announcement_data?.announcement_description ?? '';
          const ann_project_logo = card?.user_data[0]?.params
            ?.profile_picture[0]
            ? uint8ArrayToBase64(card?.user_data[0]?.params?.profile_picture[0])
            : '';

          return (
            <div key={index} className='container mx-auto md:my-6 bg-white'>
              <div className='flex justify-between items-center px-3 pb-1 mb-2'>
                <div className='text-gray-500 truncate break-all'>
                  {ann_time}
                </div>
                <div className='flex gap-4 items-center'>
                  <span className='text-[16px] text-gray-500 cursor-pointer hover:text-red-700'></span>
                </div>
              </div>
              <div className='flex flex-col sm0:flex-row w-full items-start px-3 py-5 shadow rounded-md mb-4 sm0:space-x-4'>
                <div className='flex-shrink-0 self-center'>
                  <img
                    src={ann_project_logo}
                    alt='pic'
                    className='w-16 h-16 rounded-full border border-gray-300'
                    loading='lazy'
                    draggable={false}
                  />
                </div>
                <div className='flex flex-col gap-1 overflow-hidden'>
                  <h2 className='text-lg mt-4 sm0:mt-0 font-semibold break-all line-clamp-1'>
                    {ann_name}
                  </h2>
                  <h3 className='text-gray-600 text-sm font-normal break-all line-clamp-2'>
                    {ann_desc}
                  </h3>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default CohortAnnouncement;

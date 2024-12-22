import React, { useState } from 'react';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import parse from 'html-react-parser';
import uint8ArrayToBase64 from '../../Utils/uint8ArrayToBase64';
import NoData from '../../NoDataCard/NoData';
import DiscoverMentorEventSkeleton from '../DashboardHomePage/discoverMentor/discoverMentorSkeleton/DiscoverMentorEventSkeleton';
import useTimeout from '../../hooks/TimeOutHook';

const AssociationCohortData = ({ cohortData }) => {
  const [isLoading, setIsLoading] = useState(true);
  useTimeout(() => setIsLoading(false), 2000); // Add a timeout duration for clarity

  const mentorEvents =
    cohortData && Array.isArray(cohortData)
      ? cohortData
          .map((cohort) => {
            if (!cohort || !cohort.cohort) {
              return null;
            }

            return {
              title: cohort.cohort.title || 'Untitled Event',
              cohort_banner: cohort.cohort.cohort_banner?.[0]
                ? uint8ArrayToBase64(cohort.cohort.cohort_banner[0])
                : 'default-image.png', // Default image path
              cohort_launch_date: cohort.cohort.cohort_launch_date || 'N/A',
              cohort_end_date: cohort.cohort.cohort_end_date || 'N/A',
              start_date: cohort.cohort.start_date || 'N/A',
              no_of_seats: cohort.cohort.no_of_seats || 'N/A',
              tags: cohort.cohort.tags || [],
              country: cohort.cohort.country || 'Unknown Location',
              description:
                cohort.cohort.description || 'No description available.',
              funding_amount: cohort.cohort.funding_amount || '0',
              cohort_id: cohort.cohort_id, // Include cohort_id
            };
          })
          .filter((event) => event !== null)
      : [];

  return (
    <div className='w-full mb-4 lg1:pb-2 pb-4'>
      <h2 className='text-lg font-semibold text-gray-800 mb-4'>
        Events You Registered For
      </h2>
      {isLoading ? (
        [...Array(3)].map((_, index) => (
          <DiscoverMentorEventSkeleton key={index} />
        ))
      ) : mentorEvents.length === 0 ? (
        <NoData message={'No Events posted Yet'} />
      ) : (
        mentorEvents.map((event, index) => (
          <div
            key={index}
            className='relative mb-4 bg-white shadow-md border rounded-lg p-4'
          >
            <div className='overflow-hidden rounded-lg'>
              <img
                src={event.cohort_banner}
                alt={event.title}
                className='w-full h-[180px] object-cover'
                loading='lazy'
                draggable={false}
              />
            </div>
            <div className='p-2 flex bg-white rounded absolute top-6 left-6 z-10 justify-between items-start'>
              <div>
                <p className='rounded-md inline-block text-sm font-semibold'>
                  {event.start_date}
                </p>
                <p className='text-sm text-gray-600'>Start at 15:00 GMT+4</p>
              </div>
            </div>
            <div className='mt-4'>
              <span className='border text-gray-700 text-xs font-medium px-2 py-1 rounded-xl'>
                Workshop
              </span>
            </div>
            <h3 className='mt-2 text-lg font-bold text-gray-900'>
              {event.title}
            </h3>
            <div className='mt-2 text-gray-600 text-sm line-clamp-6 hover:line-clamp-none'>
              {parse(event.description)}
            </div>
            <div className='mt-4 flex items-center space-x-4'>
              <span className='text-sm text-gray-600 flex items-center'>
                <PlaceOutlinedIcon
                  sx={{ fontSize: 'medium', marginTop: '-2px' }}
                />
                {event.country}
              </span>
              <span className='text-sm text-gray-600'>
                ${event.funding_amount}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AssociationCohortData;

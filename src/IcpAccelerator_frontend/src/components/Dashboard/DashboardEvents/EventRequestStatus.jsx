// EventCard.js
import React, { useState } from 'react';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import eventbg from '../../../../assets/images/bg.png';
import ProfileImage from '../../../../assets/Logo/ProfileImage.png';
import { FaFilter } from 'react-icons/fa';
import NoDataFound from './NoDataFound';
import PriceIcon from '../../../../assets/Logo/PriceIcon.png';
import RequestStatus from './RequestStatus';

const EventRequestStatus = ({ event }) => {
  const [selectedType, setSelectedType] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);

  const toggleFilteropen = () => {
    setFilterOpen(!filterOpen);
  };
  const toggleFilterclose = () => {
    setFilterOpen(false);
  };
  console.log('my toggle button ', filterOpen);
  // const handleApply = () => {
  //   console.log("Selected Type:", selectedType);
  //   setFilterOpen(false);
  // };

  const events = [
    {
      date: '20 Jun – 22 Jun',
      time: 'Start at 15:00 GMT+4',
      title: 'Masterclass: How to build a robust community',
      description:
        'Est malesuada ac elit gravida vel aliquam nec. Arcu pelle ntesque convallis quam feugiat non viverra massa fringilla.',
      type: 'Workshop',
      label: 'Workshop',
      labelColor: 'bg-blue-600',
      mode: 'Online',
      price: '$100',
      attendees: [
        'https://via.placeholder.com/24',
        'https://via.placeholder.com/24',
        'https://via.placeholder.com/24',
        'https://via.placeholder.com/24',
      ],
      image: eventbg,
      profile: ProfileImage,
    },
  ];

  return (
    <>
      <div className='flex gap-3 items-center py-2 justify-between'>
        <div className='flex items-center border-2 border-gray-400 rounded-lg overflow-hidden w-full h-[50px]'>
          <div className='flex items-center px-4'>
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
            placeholder='Search users, projects, jobs, events'
            className='w-full py-2 px-4 text-gray-700 focus:outline-none'
          />
          <div className='px-4'>
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
        <div>
          <FaFilter
            className='text-gray-400 text-2xl cursor-pointer'
            onClick={toggleFilteropen}
          />
        </div>
      </div>

      {events.length > 0 ? (
        events.map((event, index) => {
          return (
            <div key={index} className='bg-white rounded-lg shadow p-4 mb-6'>
              <div className='flex justify-between items-center'>
                <div className='flex items-center gap-3 relative'>
                  <div className='w-[272px] h-[230px]'>
                    <div className='max-w-[230px] w-[230px] bg-gray-100 rounded-lg flex flex-col justify-between h-full relative overflow-hidden'>
                      <div className='group'>
                        <div
                          className='absolute inset-0 blur-sm'
                          style={{
                            backgroundImage: `url(${eventbg})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                          }}
                        ></div>
                        <div className='absolute inset-0 flex items-center justify-center'>
                          <img
                            src=''
                            alt={event.title}
                            className='w-24 h-24 rounded-full object-cover'
                            loading='lazy'
                            draggable={false}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div>
                      <p className='bg-white font-medium border-2 border-[#CDD5DF] text-[#364152] w-[86px] px-2 py-1 rounded-full text-sm'>
                        Workshop
                      </p>
                      <h3 className='text-lg font-semibold'>{event.title}</h3>
                      <p className='text-sm text-gray-500 overflow-hidden text-ellipsis max-h-12 line-clamp-2'>
                        {event.description}
                      </p>
                    </div>
                    <div className='flex gap-3 items-center mt-4'>
                      <span className='text-sm text-[#121926]'>
                        <PlaceOutlinedIcon
                          className='text-[#364152]'
                          fontSize='small'
                        />
                        {event.mode}
                      </span>
                      <div className='flex items-center'>
                        <img
                          src={PriceIcon}
                          alt='End Date'
                          className='w-4 h-4 text-gray-400 mr-2'
                          loading='lazy'
                          draggable={false}
                        />
                        <span className='text-gray-500'>Paisa</span>
                      </div>
                    </div>
                    <div className='flex py-2'>
                      <button
                        className='bg-blue-500 text-white px-4 py-2 rounded mr-2 font-normal text-sm'
                        onClick={() => handleAction('Approve', index)}
                      >
                        Accept
                      </button>
                      <button
                        className='bg-gray-300 text-gray-700 px-4 py-2 rounded font-normal text-sm'
                        onClick={() => handleAction('Reject', index)}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <NoDataFound />
      )}
      <div className='relative'>
        {filterOpen && (
          <RequestStatus open={toggleFilteropen} close={toggleFilterclose} />
        )}
      </div>
    </>
  );
};

export default EventRequestStatus;

import React, { useLayoutEffect, useState } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import SkeletonThemeMain from '../../../Common/SkeletonTheme';
import { shareSvgIcon } from '../../../Utils/Data/SvgData';
import { ArrowBack } from '@mui/icons-material';
import PriceIcon from '../../../../../assets/Logo/PriceIcon.png';
import StartDateCalender from '../../../../../assets/Logo/StartDateCalender.png';
import CapacityGroupIcon from '../../../../../assets/Logo/CapacityGroupIcon.png';

import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import Tabs from '../../../Common/Tabs/Tabs';
import FAQ from '../../Project/Faq';
import Attendees from '../Attendees';
import NoDataFound from '../NoDataFound';
import EventRequestCard from '../EventRequestCard';
import AOS from 'aos';
import 'aos/dist/aos.css';

const EventDetailSkeleton = ({
  userCurrentRoleStatusActiveRole,
  cohortData,
  cohortCreator,
}) => {
  const [currentTab, setCurrentTab] = useState('Summary');
  useLayoutEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
    });
  }, []);
  const tabs = [
    { label: 'Summary', value: 'Summary' },
    ...(userCurrentRoleStatusActiveRole !== 'user'
      ? [
          ...(cohortCreator ? [{ label: 'Request', value: 'Request' }] : []),
          { label: 'Announcements', value: 'Announcements' },
          { label: 'Attendees', value: 'Attendees' },
          { label: 'Reviews', value: 'Reviews' },
        ]
      : []),
  ];
  const handleTabChange = (tab) => {
    setCurrentTab(tab);
  };
  return (
    <>
      <SkeletonThemeMain>
        <div className='flex   w-full justify-between  my-2 py-3  -top-[1.2rem] md:-top-[0.2rem] bg-white sticky z-40 '>
          <button className=' flex mr-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 bg-white px-3 py-2 rounded-md shadow-sm border border-gray-200'>
            <ArrowBack className='mr-1' />
            <span className='hidden xxs1:block'> Back to profile</span>
          </button>

          <button className='flex items-center  text-gray-600 hover:text-gray-800 hover:bg-gray-200 bg-white px-3 py-2 rounded-md shadow-sm border border-gray-200'>
            <span className='hidden xxs1:block '>Share Cohort</span>
            <span className='ml-1'>{shareSvgIcon}</span>
          </button>
        </div>

        <div
          className='flex flex-col gap-4 md:gap-10 md:flex-row'
          data-aos='fade-up'
        >
          <div className='w-full md:w-[30%] bg-white rounded-lg shadow-md pt-2 md:ml-1'>
            <div className='bg-gray-100 p-4'>
              <div className='flex items-start mb-4'>
                <SkeletonTheme color='#e3e3e3'>
                  <div className='relative flex flex-col items-center'>
                    {/* Profile circle skeleton */}
                    <div className='rounded-full  '>
                      <Skeleton circle={true} height={56} width={56} />
                    </div>

                    {/* Icon in the center of the circle */}
                    <div
                      className='flex items-center justify-center border-2 rounded-full border-gray-300 w-10 h-10 absolute mt-0.5'
                      style={{
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: '#e3e3e3',
                      }}
                    >
                      <svg
                        className='w-6 h-6 text-gray-400'
                        fill='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' />
                      </svg>
                    </div>
                  </div>
                </SkeletonTheme>

                <div className='ml-3'>
                  <Skeleton width={120} height={25} />
                  <div className='mt-2'>
                    <span className='inline-block border border-[#FEDF89] bg-[#FFFAEB] text-[#B54708] text-xs px-2 py-0.5 rounded-md uppercase font-medium tracking-wide'>
                      ORGANISER
                    </span>
                  </div>
                </div>
              </div>
              <div className='mb-3'>
                <h3 className='text-sm md:text-base font-medium mb-2 text-left'>
                  Event starts in
                </h3>

                <div className='flex items-center justify-between'>
                  {[
                    { label: 'Days' },
                    { label: 'Hours' },
                    { label: 'Minutes' },
                    { label: 'Seconds' },
                  ].map((item, index) => (
                    <React.Fragment key={item.label}>
                      <div className='text-center'>
                        <div className='text-[14px] leading-[14px] lgx:text-[20px] lgx:leading-[20px]  font-bold bg-white rounded-lg p-1 lgx:p-2 min-w-[30px] lgx:min-w-[40px] max-w-[45px]'>
                          <Skeleton width={30} height={30} />
                        </div>

                        <div className='text-[10px] lgx:text-sm text-gray-500 mt-1 max-w-[45px] truncate break-all'>
                          {item.label}
                        </div>
                      </div>
                      {index < 3 && (
                        <div className='text-lg lgx:text-2xl font-bold mx-1 self-start mt-2'>
                          :
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <Skeleton width='90%' height={30} className='mt-3 mx-4' />
              <Skeleton width='90%' height={30} className='mt-2 mx-4' />
              <div className='flex justify-center text-center'>
                <Skeleton width={60} height={15} className='mt-2' />
              </div>
            </div>

            <div className='p-4'>
              <div className='mb-4  cursor-not-allowed opacity-50'>
                <h3 className='text-[12px] font-medium text-[#697586] mb-2'>
                  GUEST
                </h3>
                <div className='flex flex-wrap justify-start gap-4'>
                  {[...Array(11)].map((_, i) => (
                    <SkeletonTheme color='#e3e3e3'>
                      <div className='relative flex flex-col items-center'>
                        {/* Profile circle skeleton */}
                        <div className='rounded-full  '>
                          <Skeleton circle={true} height={32} width={32} />
                        </div>

                        {/* Icon in the center of the circle */}
                        <div
                          className='flex items-center justify-center border-2 rounded-full border-gray-300 w-10 h-10 absolute mt-0.5'
                          style={{
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            backgroundColor: '#e3e3e3',
                          }}
                        >
                          <svg
                            className='w-5 h-5 text-gray-400'
                            fill='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' />
                          </svg>
                        </div>
                      </div>
                    </SkeletonTheme>
                  ))}
                </div>
              </div>

              <div className='space-y-3 text-sm'>
                <div>
                  <span className='text-[#697586] text-[12px] block mb-2'>
                    EVENT CATEGORY
                  </span>
                  <div className='flex flex-wrap gap-1 '>
                    {[...Array(3)].map((_, index) => (
                      <div className='flex items-center rounded-full text-gray-700 text-xs px-2 py-1   mb-2 mt-1'>
                        <p className='font-medium flex items-center'>
                          <Skeleton
                            key={index}
                            width={60}
                            height={24}
                            style={{ borderRadius: '1rem' }}
                            className='  text-gray-700 text-xs px-1 py-1 '
                          />
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <span className='text-[#697586] text-[12px] block mb-1'>
                    CAPACITY
                  </span>
                  <div className='flex items-center'>
                    <img
                      src={CapacityGroupIcon}
                      alt='Capacity'
                      className='w-4 h-4 text-gray-400 mr-2'
                      loading='lazy'
                      draggable={false}
                    />
                    <span className='text-gray-700'>
                      <Skeleton width={80} height={16} />
                    </span>
                  </div>
                </div>
                <div>
                  <span className='text-[#697586] text-[12px] block mb-1'>
                    START DATE
                  </span>
                  <div className='flex items-center'>
                    <img
                      src={StartDateCalender}
                      alt='Start Date'
                      className='w-4 h-4 text-gray-400 mr-2'
                      loading='lazy'
                      draggable={false}
                    />
                    <span className='text-gray-700'>
                      <Skeleton width={80} height={16} />
                    </span>
                  </div>
                </div>
                <div>
                  <span className='text-[#697586] text-[12px] block mb-1'>
                    END DATE
                  </span>
                  <div className='flex items-center'>
                    <img
                      src={StartDateCalender}
                      alt='End Date'
                      className='w-4 h-4 text-gray-400 mr-2'
                      loading='lazy'
                      draggable={false}
                    />
                    <span className='text-gray-700'>
                      <Skeleton width={80} height={16} />
                    </span>
                  </div>
                </div>
                <div>
                  <span className='text-[#697586] text-[12px] block mb-1'>
                    COUNTRY
                  </span>
                  <div className='flex items-center'>
                    <PlaceOutlinedIcon
                      className='text-gray-500 h-4 w-4 mr-2'
                      fontSize='small'
                    />

                    <span className='text-gray-700'>
                      <Skeleton width={80} height={16} />
                    </span>
                  </div>
                </div>
                <div>
                  <span className='text-[#697586] text-[12px] block mb-1'>
                    FUNDING AMOUNT
                  </span>
                  <div className='flex items-center'>
                    <img
                      src={PriceIcon}
                      alt='End Date'
                      className='w-4 h-4 text-gray-400 mr-2'
                      loading='lazy'
                      draggable={false}
                    />
                    <span className='text-gray-700'>
                      <Skeleton width={80} height={16} />
                    </span>
                  </div>
                </div>
                <div></div>
                <div>
                  <span className='text-[#697586] text-[12px] block mb-1'>
                    DEADLINE
                  </span>
                  <div className='flex items-center'>
                    <img
                      src={StartDateCalender}
                      alt='deadline'
                      className='w-4 h-4 text-gray-400 mr-2'
                      loading='lazy'
                      draggable={false}
                    />
                    <span className='text-gray-700'>
                      <Skeleton width={80} height={16} />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='flex-1 w-full overflow-auto pt-1 '>
            <SkeletonTheme color='#e3e3e3'>
              <div className='relative flex flex-col items-center w-full md:h-[250px] bg-[#e3e3e3] rounded-md'>
                {/* Skeleton for the banner */}
                <Skeleton
                  height={200}
                  width='100%'
                  className='rounded-lg mb-2'
                />

                {/* Centered text */}
                <div className='flex items-center justify-center absolute inset-0'>
                  <h2 className='text-6xl font-bold text-gray-500'>Banner</h2>
                </div>
              </div>
            </SkeletonTheme>

            <Skeleton width='30%' height={30} className='mt-4' />

            <div className='flex items-center mt-2 text-gray-600'>
              <span className='mr-2'>
                <img
                  src={StartDateCalender}
                  className='w-5 h-5 font-bold'
                  alt='Price icon'
                  loading='lazy'
                  draggable={false}
                />
              </span>
              <span className='mr-2'>
                {' '}
                <Skeleton width={40} height={20} className='rounded-md' />
              </span>
              <span className='mr-2'>
                <img
                  src={PriceIcon}
                  className='w-5 h-5 font-bold'
                  alt='Price icon'
                  loading='lazy'
                  draggable={false}
                />
              </span>
              <span>
                {' '}
                <Skeleton width={40} height={20} className='rounded-md' />
              </span>
            </div>

            <div className='w-full overflow-x-auto mt-4 md:mt-6'>
              <Tabs
                tabs={tabs}
                currentTab={currentTab}
                onTabChange={handleTabChange}
              />
            </div>
            <div className='pr-0 md:pr-6'>
              {currentTab === 'Summary' && (
                <>
                  <div>
                    <div className='mt-4 mx-2'>
                      <h2 className='text-lg md:text-2xl font-semibold mb-2'>
                        Description
                      </h2>
                      <div className='relative text-gray-700 max-h-[10rem] md:max-h-none overflow-hidden group'>
                        <div className='overflow-hidden text-ellipsis line-clamp-5 md:line-clamp-6 hover:line-clamp-none'>
                          {/* <Skeleton
                            width='100%'
                            height={15}
                            count={5}
                            className='rounded-md mb-2'
                          /> */}
                          <div role='status' class='space-y-2.5 animate-pulse '>
                            <div class='flex items-center w-full'>
                              <div class='h-2.5 bg-gray-200 rounded-full  w-32'></div>
                              <div class='h-2.5 ms-2 bg-gray-300 rounded-full w-24'></div>
                              <div class='h-2.5 ms-2 bg-gray-300 rounded-full w-full'></div>
                            </div>
                            <div class='flex items-center w-full'>
                              <div class='h-2.5 bg-gray-200 rounded-full  w-full'></div>
                              <div class='h-2.5 ms-2 bg-gray-300 rounded-full w-full'></div>
                              <div class='h-2.5 ms-2 bg-gray-300 rounded-full w-24'></div>
                            </div>
                            <div class='flex items-center w-full '>
                              <div class='h-2.5 bg-gray-300 rounded-full w-full'></div>
                              <div class='h-2.5 ms-2 bg-gray-200 rounded-full  w-80'></div>
                              <div class='h-2.5 ms-2 bg-gray-300 rounded-full w-full'></div>
                            </div>
                            <div class='flex items-center w-full '>
                              <div class='h-2.5  bg-gray-200 rounded-full  w-full'></div>
                              <div class='h-2.5 ms-2 bg-gray-300 rounded-full w-full'></div>
                              <div class='h-2.5 ms-2 bg-gray-300 rounded-full w-24'></div>
                            </div>
                            <div class='flex items-center w-full'>
                              <div class='h-2.5  bg-gray-300 rounded-full w-32'></div>
                              <div class='h-2.5 ms-2 bg-gray-300 rounded-full w-24'></div>
                              <div class='h-2.5 ms-2 bg-gray-200 rounded-full  w-full'></div>
                            </div>
                            <div class='flex items-center w-full '>
                              <div class='h-2.5  bg-gray-300 rounded-full w-full'></div>
                              <div class='h-2.5 ms-2 bg-gray-200 rounded-full  w-80'></div>
                              <div class='h-2.5 ms-2 bg-gray-300 rounded-full w-full'></div>
                            </div>
                            <span class='sr-only'>Loading...</span>
                          </div>
                        </div>
                        <div className='absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none'></div>
                      </div>
                      <h2 className='text-lg md:text-2xl font-semibold mt-2'>
                        FAQ
                      </h2>
                      <div className='-mt-14'>
                        <FAQ />
                      </div>
                    </div>
                  </div>
                </>
              )}
              {currentTab === 'Attendees' &&
                (userCurrentRoleStatusActiveRole !== 'user' ? (
                  <Attendees cohortData={cohortData} />
                ) : (
                  <NoDataFound message='You do not have access to view this tab.' />
                ))}

              {currentTab === 'Announcements' &&
                (userCurrentRoleStatusActiveRole !== 'user' ? (
                  <NoDataFound message='No active announcements found' />
                ) : (
                  <NoDataFound message='You do not have access to view this tab.' />
                ))}

              {currentTab === 'Request' &&
                (userCurrentRoleStatusActiveRole !== 'user' ? (
                  <EventRequestCard />
                ) : (
                  <NoDataFound message='You do not have access to view this tab.' />
                ))}

              {currentTab === 'Reviews' &&
                (userCurrentRoleStatusActiveRole !== 'user' ? (
                  <NoDataFound message='No active reviews found' />
                ) : (
                  <NoDataFound message='You do not have access to view this tab.' />
                ))}
            </div>
          </div>
        </div>
      </SkeletonThemeMain>
    </>
  );
};

export default EventDetailSkeleton;

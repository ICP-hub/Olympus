import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { useNavigate } from 'react-router-dom';
import 'react-loading-skeleton/dist/skeleton.css';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import { useFormContext, useFieldArray } from 'react-hook-form';
import getSocialLogo from '../Utils/navigationHelper/getSocialLogo';

const AboutcardSkeleton = ({ getAllData }) => {
  return (
    <SkeletonTheme baseColor='#e3e3e3' highlightColor='#c8c8c873'>
      <div className='w-full overflow-hidden bg-gradient-to-r from-[#ECE9FE] to-[#FFFFFF] items-center justify-center rounded-2xl'>
        <div className='bg-white rounded-lg shadow-md m-8'>
          <div className='w-full bg-gray-200 rounded-full h-1.5 mb-4 '>
            <div
              className='bg-green-500 h-1.5 rounded-full '
              style={{ width: '20%' }}
            ></div>
          </div>
          <div className='p-6 '>
            <div className='flex flex-col items-center'>
              <div>
                {getAllData?.image ? (
                  <img
                    src={URL.createObjectURL(getAllData?.image)}
                    alt={`${getAllData?.full_name}`}
                    className='rounded-full size-28'
                    loading='lazy'
                    draggable={false}
                  />
                ) : (
                  <div className='bg-gray-200 rounded-full p-4 mb-4'>
                    <svg
                      className='w-9 h-9 text-gray-600'
                      fill='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' />
                    </svg>
                  </div>
                )}
              </div>
              {getAllData?.full_name ? (
                <h2 className='text-xl w-[12rem] text-center font-medium truncate'>
                  {getAllData?.full_name}
                </h2>
              ) : (
                <h2 className='text-xl font-medium'>
                  <Skeleton height={25} width={160} className='rounded-3xl' />
                </h2>
              )}
              {getAllData?.openchat_user_name ? (
                <h2 className='text-lg text-center w-[10rem] font-normal truncate'>
                  {getAllData?.openchat_user_name}
                </h2>
              ) : (
                <span className=''>
                  <Skeleton height={20} width={130} className='rounded-3xl' />
                </span>
              )}
            </div>
            <div className='mt-6  overflow-y-auto  dlg:h-[48vh] dxl0:overflow-y-auto '>
              {/* <div className=" overflow-hidden overflow-y-scroll"> */}
              <div className='my-2'>
                <label className='block font-medium text-gray-600 pb-2'>
                  Roles
                </label>
                <span className='bg-[#EFF4FF] text-blue-600 border border-blue-300 rounded-lg px-4 pb-1 font-semibold'>
                  Olympian
                </span>
              </div>
              <div className='mt-4'>
                <label className='block font-medium text-gray-600 pb-1'>
                  <MailOutlinedIcon
                    sx={{
                      fontSize: 'lage',
                      marginTop: '-4px',
                      marginRight: '5px',
                    }}
                  />
                  Email
                </label>
                {getAllData?.email ? (
                  <h2 className='text-base font-normal truncate'>
                    {getAllData?.email}
                  </h2>
                ) : (
                  <Skeleton height={20} width='full' className='rounded-3xl' />
                )}
              </div>
              <div className='mt-3'>
                <label className='block font-medium text-gray-600 pb-1'>
                  About
                </label>
                {getAllData?.bio ? (
                  <p className='text-base font-normal break-all line-clamp-3'>
                    {getAllData?.bio}
                  </p>
                ) : (
                  <>
                    {/* <Skeleton
                      height={20}
                      width='full'
                      className='rounded-3xl'
                    />
                    <Skeleton height={20} width={150} className='rounded-3xl' /> */}
                    <div role='status' className='space-y-2.5 animate-pulse '>
                      <div className='flex items-center w-full'>
                        <div className='h-2.5 bg-gray-200 rounded-full  w-32'></div>
                        <div className='h-2.5 ms-2 bg-gray-300 rounded-full w-24'></div>
                        <div className='h-2.5 ms-2 bg-gray-300 rounded-full w-full'></div>
                      </div>
                      <div className='flex items-center w-full'>
                        <div className='h-2.5 bg-gray-200 rounded-full  w-full'></div>
                        <div className='h-2.5 ms-2 bg-gray-300 rounded-full w-full'></div>
                        <div className='h-2.5 ms-2 bg-gray-300 rounded-full w-24'></div>
                      </div>
                    </div>
                  </>
                )}
              </div>
              <label className='block mt-3 font-medium text-gray-600'>
                Reason To Join Platform
              </label>
              <div className='flex  overflow-hidden overflow-x-scroll gap-1 '>
                {getAllData?.reasons_to_join_platform ? (
                  getAllData?.reasons_to_join_platform
                    .split(', ')
                    .slice(0, 10)
                    .map((tag, index) => (
                      <span
                        key={index}
                        className='text-center rounded-2xl sm:min-w-[80px] md:min-w-[100px] lg:max-w-[120px] truncate text-gray-600 border border-gray-300  px-4 py-0.5 font-normal mr-2'
                      >
                        {tag}
                      </span>
                    ))
                ) : (
                  <div className='flex space-x-2'>
                    <Skeleton height={25} width={80} className='rounded-3xl' />
                    <Skeleton height={25} width={80} className='rounded-3xl' />
                  </div>
                )}
              </div>
              <label className='block  font-medium text-gray-600 -mt-1'>
                Interests
              </label>
              <div className='flex  overflow-hidden overflow-x-scroll gap-1 '>
                {getAllData?.domains_interested_in ? (
                  getAllData?.domains_interested_in
                    .split(', ')
                    .slice(0, 10)
                    .map((tag, index) => (
                      <span
                        key={index}
                        className='text-center sm:min-w-[80px] md:min-w-[100px] lg:max-w-[120px] truncate text-gray-600 border border-gray-300 rounded-2xl px-4 py-0.5 font-normal mr-2'
                      >
                        {tag}
                      </span>
                    ))
                ) : (
                  <div className='flex space-x-2'>
                    <Skeleton height={25} width={80} className='rounded-3xl' />
                    <Skeleton height={25} width={80} className='rounded-3xl' />
                  </div>
                )}
              </div>

              <div className=''>
                <label className='block font-medium text-gray-600 pb-1'>
                  Location
                </label>
                {getAllData?.country ? (
                  <p className='sm:max-w-[11rem] text-base   truncate break-all font-normal'>
                    <LocationOnOutlinedIcon
                      sx={{
                        fontSize: 'lage',
                        marginRight: '5px',
                        marginTop: '-4px',
                      }}
                    />
                    {getAllData?.country}
                  </p>
                ) : (
                  <div>
                    <Skeleton
                      height={20}
                      width='full'
                      className='rounded-3xl'
                    />
                  </div>
                )}
                <label className='block mb-2 font-medium text-gray-600 mt-3'>
                  Links
                </label>
                <div className='flex gap-3'>
                  {getAllData?.links ? (
                    getAllData?.links?.slice(0, 3).map((link, i) => {
                      const icon = getSocialLogo(link.link);
                      return (
                        <div
                          key={i}
                          className='flex items-cente overflow-x-auto space-x-2'
                        >
                          {icon ? (
                            icon
                          ) : (
                            <Skeleton height={30} width={30} circle='true' />
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className='flex space-x-2'>
                      <div className='rounded-full flex items-center justify-center'>
                        <Skeleton height={30} width={30} circle='true' />
                      </div>
                      <div className='rounded-full flex gap-2 items-center justify-center'>
                        <Skeleton height={30} width={30} circle='true' />

                        <Skeleton height={30} width={30} circle='true' />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* </div> */}
            </div>
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default AboutcardSkeleton;

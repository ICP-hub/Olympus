import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import { IcpAccelerator_backend } from '../../../../declarations/IcpAccelerator_backend/index';
import CenterFocusStrongOutlinedIcon from '@mui/icons-material/CenterFocusStrongOutlined';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import FmdGoodOutlinedIcon from '@mui/icons-material/FmdGoodOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import JobDetails from './JobDetails';
import awtar from '../../../assets/images/icons/_Avatar.png';
import Select from 'react-select';
import InfiniteScroll from 'react-infinite-scroll-component';
import TuneIcon from '@mui/icons-material/Tune';
import { FaSliders } from 'react-icons/fa6';
import {
  clockSvgIcon,
  coinStackedSvgIcon,
  lenseSvgIcon,
  locationSvgIcon,
} from '../Utils/Data/SvgData';
import useFormatDateFromBigInt from '../../components/hooks/useFormatDateFromBigInt';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { formatFullDateFromBigInt } from '../Utils/formatter/formatDateFromBigInt';
import LinkIcon from '@mui/icons-material/Link';
import uint8ArrayToBase64 from '../Utils/uint8ArrayToBase64';
import parse from 'html-react-parser';
import Tooltip from '@mui/material/Tooltip';
import NoData from '../NoDataCard/NoData';
import JobFilterModal from './JobFilterModal';
import SpinnerLoader from '../Discover/SpinnerLoader';
import useTimeout from '../hooks/TimeOutHook';
import JobsSkeleton from './JobsSkeleton/JobsSkeleton';
const Jobs = () => {
  const actor = useSelector((currState) => currState.actors.actor);

  const [noData, setNoData] = useState(null);
  const [latestJobs, setLatestJobs] = useState([]);
  const [timeAgo] = useFormatDateFromBigInt();
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(0);
  const [openJobUid, setOpenJobUid] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalJobs, setTotalJobs] = useState([]);
  const [skeletonLoading, setskeletonLoading] = useState(true);

  useTimeout(() => setskeletonLoading(false));

  const fetchLatestJobs = async (caller, page, isRefresh = false) => {
    setIsLoading(true);
    try {
      const result = await caller.get_all_jobs(page, itemsPerPage);
      console.log('Fetched jobs:', result);

      if (result && result.length > 0) {
        if (isRefresh) {
          console.log('Refresh', 'true');
          setLatestJobs(result);
          setTotalJobs(result.length);
        } else {
          console.log('Refresh', 'false');
          setLatestJobs(result);
          setTotalJobs(latestJobs.length + result.length);
        }
        if (result.length < itemsPerPage) {
          setHasMore(false);
        }
      } else {
        setNoData(true);
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setNoData(true);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('useEffect triggered, fetching latest jobs...');
    let isMounted = true;

    if (actor && isMounted && hasMore) {
      fetchLatestJobs(actor, currentPage);
    } else {
      fetchLatestJobs(IcpAccelerator_backend, currentPage);
    }

    return () => {
      isMounted = false;
    };
  }, [actor, currentPage, hasMore]);

  // useEffect(() => {
  //   console.log("useEffect triggered, fetching latest jobs...");
  //   if (!isLoading && hasMore) {
  //     if (actor) {
  //       fetchLatestJobs(actor, currentPage);
  //     } else {
  //       fetchLatestJobs(IcpAccelerator_backend, currentPage);
  //     }
  //   }
  // }, [actor, currentPage]);

  const loadMore = () => {
    if (!isLoading && hasMore) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage); // Increment the page number
      fetchLatestJobs(actor, newPage); // Fetch the next set of data
    }
  };

  const [filter, setFilter] = useState({
    role: '',
    fullTime: false,
    partTime: true,
    contract: true,
    internship: true,
    location: '',
    remote: true,
    minSalary: '',
    maxSalary: '',
  });
  const [open, setOpen] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
  };
  const handlecheckbox = (e) => {
    const { name, checked } = e.target;
    setFilter({ ...filter, [name]: checked });
  };

  const openJobDetails = (job_id) => {
    console.log('Opening job details for UID:', job_id);
    setOpenJobUid(job_id);
  };

  const closeJobDetails = () => {
    setOpenJobUid(null);
  };

  console.log('totalJobs', totalJobs);
  const roleOptions = [
    { value: 'developer', label: 'Developer' },
    { value: 'designer', label: 'Designer' },
    { value: 'manager', label: 'Manager' },
    { value: 'analyst', label: 'Analyst' },
    // Add more options here
  ];

  const handleRoleChange = (selectedOption) => {
    setFilter({ ...filter, role: selectedOption.value });
  };

  const [openDetail, setOpenDetail] = useState(false);

  // initialize Aos
  useLayoutEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
    });
  }, []);
  return (
    <>
      <div className='container mx-auto px-6 bg-white'>
        {/* <div className="flex justify-between mx-auto -top-10  sticky ">
          <h2 className="text-3xl font-bold p-5 bg-white w-full  bg-opacity-95 ">
            Jobs
          </h2>
          <div className="flex justify-end pr-4 md1:hidden lg:flex lgx:hidden  mt-3 items-center bg-white w-full  bg-opacity-95 ">
            <p onClick={()=>setOpenDetail(true)} className="text-lg border py-1.5 px-4 font-semibold">Filters <span className="ml-3"><TuneIcon /></span></p>
            
          </div>
        </div> */}
        <div className='flex justify-between sticky -top-[1.1rem] md:top-0 bg-opacity-95 -mt-[1.1rem] md:mt-0   bg-white z-20'>
          <h1 className='text-3xl font-bold p-4  '>Jobs</h1>

          <div className=' block md1:hidden lg:block lgx:hidden '>
            <button
              onClick={() => setOpenDetail(true)}
              className='bg-white border border-gray-300 text-gray-800 py-2 px-4 rounded-md shadow-lg flex items-center my-4'
            >
              Filter
              <FaSliders className='ml-2' />
            </button>
          </div>
        </div>
        <div className='flex mx-auto justify-evenly '>
          <>
            <div className='mb-5 w-full md1:w-[65%] lg:w-full lgx:w-[65%] '>
              <div
                id='scrollableDiv'
                style={{ height: '100vh', overflowY: 'auto' }}
                data-aos='fade-up'
              >
                {skeletonLoading ? (
                  <>
                    {[...Array(latestJobs.length)].map((_, index) => (
                      <JobsSkeleton key={index} />
                    ))}
                  </>
                ) : latestJobs.length > 0 ? (
                  <InfiniteScroll
                    dataLength={latestJobs.length}
                    next={loadMore}
                    hasMore={hasMore}
                    loader={
                      <>
                        <SpinnerLoader />
                      </>
                    }
                    endMessage={
                      <p className='flex justify-center mt-4'>
                        No more data available...
                      </p>
                    }
                    scrollableTarget='scrollableDiv'
                  >
                    {latestJobs.map((card, index) => {
                      // console.log( " card?.job_poster.profile_picture",card?.job_poster?.profile_picture)
                      let full_Name = card[1]?.full_name ?? '';
                      let job_name = card[0]?.job_data?.title ?? '';
                      let job_category = card[0]?.job_data?.category ?? '';
                      let job_description =
                        card[0]?.job_data?.description ?? '';
                      let job_location = card[0]?.job_data?.location ?? '';
                      let job_link = card[0]?.job_data?.link ?? '';
                      let job_project_logo = card[1]?.profile_picture[0]
                        ? uint8ArrayToBase64(card[1]?.profile_picture[0])
                        : null;
                      let job_type = card[0]?.job_data?.job_type ?? '';
                      let job_project_name = card?.project_name ?? '';
                      let job_project_desc = card?.project_desc ?? '';
                      let job_post_time = card[0]?.timestamp
                        ? formatFullDateFromBigInt(card[0]?.timestamp)
                        : '';
                      // console.log("cardids", card.job_id);
                      return (
                        <div key={index}>
                          <div className='flex flex-col gap-3 my-8 shadow-md  rounded-md p-4'>
                            <div className='flex justify-between'>
                              <div
                                onClick={() => openJobDetails(card.job_id)}
                                className='flex flex-col gap-3 sm5:w-[70%] w-full '
                              >
                                <p className='text-sm xxs:text-base text-gray-400'>
                                  {job_post_time}{' '}
                                </p>
                                <h3 className='text-xl line-clamp-1 break-all font-bold'>
                                  {job_name}{' '}
                                </h3>
                                <p className='flex items-center'>
                                  <span className='mr-3'>
                                    <img
                                      src={job_project_logo}
                                      className='w-8 h-8 rounded-lg'
                                      alt='icon'
                                      loading='lazy'
                                      draggable={false}
                                    />
                                  </span>
                                  <span className='line-clamp-2 break-all'>
                                    {full_Name}{' '}
                                  </span>
                                </p>
                              </div>
                              <div className='hidden sm5:block'>
                                <div className='flex flex-col gap-4 items-center'>
                                  <a
                                    href={job_link}
                                    target='_blank'
                                    className='border rounded-md bg-[#155EEF] py-2 px-1 dxs:px-4 text-white text-center text-xs dxs:text-sm xxs:text-base'
                                  >
                                    Apply{' '}
                                    <span className='pl-1 text-white'></span>
                                    <ArrowOutwardIcon
                                      sx={{
                                        marginTop: '-2px',
                                        fontSize: 'medium',
                                      }}
                                    />
                                  </a>
                                  <button
                                    onClick={() =>
                                      openJobDetails(card[0].job_id)
                                    }
                                    className='hover:bg-slate-300 py-2 px-3 text-[#155EEF] font-medium flex'
                                  >
                                    view details
                                  </button>
                                </div>
                              </div>
                            </div>
                            <div className='flex flex-col gap-3'>
                              <p className='text-gray-600  overflow-hidden text-ellipsis max-h-12 line-clamp-2 break-all'>
                                {parse(job_description)}{' '}
                              </p>
                              <div className='flex gap-5 items-center flex-wrap'>
                                <div className='flex items-center gap-2'>
                                  {' '}
                                  {lenseSvgIcon}{' '}
                                  <span className=''>{job_category}</span>{' '}
                                </div>
                                <div className='flex items-center gap-2'>
                                  {locationSvgIcon}{' '}
                                  <span className=''>{job_location}</span>{' '}
                                </div>
                                <div className='flex items-center gap-2'>
                                  {clockSvgIcon}{' '}
                                  <span className='ml-2'>{job_type}</span>{' '}
                                </div>
                                <div className='flex items-center gap-2'>
                                  <a href={job_link} target='_blank'>
                                    <span className='flex'>
                                      <LinkIcon />
                                    </span>{' '}
                                  </a>
                                </div>
                              </div>
                              {/* Action Buttons */}
                              <div className='sm5:hidden'>
                                {' '}
                                <div className='flex justify-between flex-col sm1:flex-row w-full'>
                                  <button className='bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition w-full'>
                                    Apply{' '}
                                    <span className='ml-2 material-icons'>
                                      <ArrowOutwardIcon
                                        sx={{
                                          marginTop: '-2px',
                                          fontSize: 'medium',
                                        }}
                                      />
                                    </span>
                                  </button>
                                  <button
                                    onClick={() =>
                                      openJobDetails(card[0].job_id)
                                    }
                                    className='hover:bg-slate-300 py-2 px-3 text-[#155EEF] shadow-lg my-1 sm1:my-0 font-medium w-full'
                                  >
                                    view details
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* <hr /> */}
                        </div>
                      );
                    })}
                  </InfiniteScroll>
                ) : (
                  <div className='flex items-center justify-center'>
                    <NoData message={'No Jobs Data Available'} />
                  </div>
                )}
              </div>
            </div>
          </>
          <div className='w-[30%] hidden md1:block lg:hidden lgx:block  '>
            <Tooltip title='Coming Soon'>
              <div className='p-4 bg-white sticky top-12  max-w-sm'>
                <h2 className='text-xl font-semibold mb-4'>Filters</h2>

                <div className='mb-4'>
                  <label
                    htmlFor='department'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Department
                  </label>
                  {/* <select value={filter.role} onChange={handleChange} id="department" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 border focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                                <option>Select role</option>
                                
                            </select> */}
                  <Select
                    value={roleOptions.find(
                      (option) => option.value === filter.role
                    )}
                    onChange={handleRoleChange}
                    options={roleOptions}
                    placeholder='Select role'
                    className='mt-1 block w-full text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md'
                    isDisabled={true}
                  />
                </div>

                <div className='mb-4'>
                  <span className='block text-sm font-medium text-gray-700'>
                    Occupation
                  </span>
                  <div className='mt-2 space-y-2'>
                    <div className='flex items-center'>
                      <input
                        id='full-time'
                        checked={filter.fullTime}
                        onChange={handlecheckbox}
                        name='fullTime'
                        type='checkbox'
                        className='h-4 w-4 text-indigo-600 border-2 border-gray-300 rounded'
                        disabled
                      />
                      <label
                        htmlFor='full-time'
                        className='ml-2 block text-sm text-gray-900'
                      >
                        Full-time
                      </label>
                    </div>
                    <div className='flex items-center'>
                      <input
                        id='part-time'
                        checked={filter.partTime}
                        onChange={handlecheckbox}
                        name='partTime'
                        type='checkbox'
                        className='h-4 w-4 text-indigo-600 border-gray-300 border-2  rounded'
                        disabled
                      />
                      <label
                        htmlFor='part-time'
                        className='ml-2 block text-sm text-gray-900'
                      >
                        Part-time
                      </label>
                    </div>
                    <div className='flex items-center'>
                      <input
                        id='contract'
                        checked={filter.contract}
                        onChange={handlecheckbox}
                        name='contract'
                        type='checkbox'
                        className='h-4 w-4 text-indigo-600 border-gray-300 border-2 rounded'
                        disabled
                      />
                      <label
                        htmlFor='contract'
                        className='ml-2 block text-sm text-gray-900'
                      >
                        Contract
                      </label>
                    </div>
                    <div className='flex items-center'>
                      <input
                        id='internship'
                        checked={filter.internship}
                        onChange={handlecheckbox}
                        name='internship'
                        type='checkbox'
                        className='h-4 w-4 text-indigo-600 border-gray-300 border-2 rounded'
                        disabled
                      />
                      <label
                        htmlFor='internship'
                        className='ml-2 block text-sm text-gray-900'
                      >
                        Internship
                      </label>
                    </div>
                  </div>
                </div>

                <div className='mb-4'>
                  <label
                    htmlFor='location'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Location
                  </label>
                  <input
                    type='text'
                    name='location'
                    value={filter.location}
                    onChange={handleChange}
                    id='location'
                    className='mt-1 block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                    placeholder='Start typing'
                    disabled
                  />
                  <div className='flex items-center mt-2'>
                    <input
                      id='remote'
                      checked={filter.remote}
                      onChange={handlecheckbox}
                      name='remote'
                      type='checkbox'
                      className='h-4 w-4 text-indigo-600 border-gray-300 border-2 rounded'
                      disabled
                    />
                    <label
                      htmlFor='remote'
                      className='ml-2 block text-sm text-gray-900'
                    >
                      Remote
                    </label>
                  </div>
                </div>

                {/* <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Salary</label>
                            <div className="flex mt-1 w-full">
                                <input type="text" name='minSalary' value={filter.minSalary} onChange={handleChange} className="w-[40%]  px-1 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="$ From" />
                                <div className='px-2 text-center'>-</div>
                                <input type="text" name='maxSalary' value={filter.maxSalary} onChange={handleChange} className="w-[40%] px-1 py-2 border border-gray-300 rounded-r-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="$ To" />
                            </div>
                        </div> */}
              </div>
            </Tooltip>
          </div>
        </div>
      </div>
      {openDetail && (
        <JobFilterModal openDetail={openDetail} setOpenDetail={setOpenDetail} />
      )}
      {openJobUid && <JobDetails setOpen={closeJobDetails} uid={openJobUid} />}
    </>
  );
};

export default Jobs;

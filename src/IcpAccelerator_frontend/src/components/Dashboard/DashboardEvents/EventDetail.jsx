import React, { useEffect, useState, useRef } from 'react';
import GuestProfile1 from '../../../../assets/Logo/GuestProfile1.png';
import CapacityGroupIcon from '../../../../assets/Logo/CapacityGroupIcon.png';
import StartDateCalender from '../../../../assets/Logo/StartDateCalender.png';
import PriceIcon from '../../../../assets/Logo/PriceIcon.png';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import uint8ArrayToBase64 from '../../Utils/uint8ArrayToBase64';
import parse from 'html-react-parser';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import { formatFullDateFromSimpleDate } from '../../Utils/formatter/formatDateFromBigInt';
import { ThreeDots } from 'react-loader-spinner';
import toast, { Toaster } from 'react-hot-toast';
import NoDataFound from './NoDataFound';
import EventRequestCard from './EventRequestCard';
import Tabs from '../../Common/Tabs/Tabs';
import { ArrowBack } from '@mui/icons-material';
import Attendees from './Attendees';
import { Tooltip } from 'react-tooltip';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { shareSvgIcon } from '../../Utils/Data/SvgData';
import ShareModal from './EventshareModel';
import { useNavigate } from 'react-router-dom';
import DiscoverUserModal from '../DashboardHomePage/discoverMentorPage/DiscoverUserModal';
import EventDetailSkeleton from './DashboardEventSkeletons/EventDetailSkeleton';
import useTimeout from '../../hooks/TimeOutHook';
const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className='border-b border-gray-200'>
      <button
        className='flex justify-between items-center w-full text-left py-4'
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className='text-base font-medium'>{question}</span>
        {isOpen ? (
          <RemoveCircleOutlineOutlinedIcon className='text-[#9AA4B2]' />
        ) : (
          <AddCircleOutlineOutlinedIcon className='text-[#9AA4B2]' />
        )}
      </button>
      {isOpen && (
        <p className='mt-2 text-[#4B5565] font-normal text-sm pb-4'>{answer}</p>
      )}
    </div>
  );
};

const FAQ = () => {
  const faqData = [
    {
      question: 'What is a role, actually?',
      answer:
        'Est malesuada ac elit gravida vel aliquam nec. Arcu pelle ntesque convallis quam feugiat non viverra massa fringilla.',
    },
    {
      question: 'How do roles work?',
      answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
      question: 'Can I change roles?',
      answer:
        'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    },
  ];

  return (
    <div className='mt-3 text-[#121926] text-[18px] font-medium border-gray-200'>
      {faqData.map((item, index) => (
        <FAQItem key={index} question={item.question} answer={item.answer} />
      ))}
    </div>
  );
};

const EventDetails = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const tabsContainerRef = useRef(null);
  const userCurrentRoleStatusActiveRole = useSelector(
    (currState) => currState.currentRoleStatus.activeRole
  );
  const principal = useSelector((currState) => currState.internet.principal);
  const { id } = useParams();
  const cohort_id = id;
  const scrollTabs = (direction) => {
    if (tabsContainerRef.current) {
      tabsContainerRef.current.scrollBy({
        left: direction === 'left' ? -100 : 100, 
        behavior: 'smooth', 
      });
    }
  };

  const [showDetails, setShowDetails] = useState(false);

  const handleToggle = () => {
    setShowDetails(!showDetails);
  };
  const [cohortData, setCohortData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const actor = useSelector((currState) => currState.actors.actor);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [difference, setDifference] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [cardDetail, setCadDetail] = useState(null);
  const handleClick = (cohortData) => {
    setOpenDetail(true);
    setCadDetail(cohortData);
    console.log('cardDetail => ', cardDetail);
  };
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTab, setCurrentTab] = useState('Summary');
  const cohortCreator = cohortData?.cohort_creator.toText() === principal;
  const cohortCreatorProfile = cohortData?.cohort_creator_data
    ?.profile_picture[0]
    ? uint8ArrayToBase64(cohortData?.cohort_creator_data?.profile_picture[0])
    : [];
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

  useEffect(() => {
    const fetchCohortData = async () => {
      if (actor && cohort_id) {
        try {
          const result = await actor.get_cohort(cohort_id);
          console.log('result', result);
          if (result && Object.keys(result).length > 0) {
            setCohortData(result);
            calculateTimeLeft(result.cohort.cohort_launch_date);
          } else {
            setCohortData(null);
          }
        } catch (error) {
          console.log('error-in-get_my_cohort', error);
          setCohortData(null);
        } finally {
          // setTimeout(() => {
          //   setIsLoading(false);
          // }, 1000);
        }
      }
    };

    fetchCohortData();
  }, [actor, cohort_id]);

  const timeoutRef = useRef(null);

  useTimeout(() => setIsLoading(false),1000);
  useEffect(() => {
    if (cohortData) {
      const calculateRemainingTime = () => {
        calculateTimeLeft(cohortData.cohort.cohort_launch_date);
        timeoutRef.current = setTimeout(calculateRemainingTime, 1000);
      };
      calculateRemainingTime(); // Initial call
      return () => clearTimeout(timeoutRef.current);
    }
  }, [cohortData]);

  const calculateTimeLeft = (cohortLaunchDate) => {
    const launchDate = new Date(cohortLaunchDate);
    const now = new Date();
    const difference = launchDate - now;

    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    setTimeLeft(timeLeft);
    setDifference(difference);
  };

  if (isLoading) {
    return (
      <EventDetailSkeleton
        userCurrentRoleStatusActiveRole={userCurrentRoleStatusActiveRole}
        cohortCreator={cohortCreator}
        cohortData={cohortData}
      />
    ); // Show skeleton while loading
  }

  if (!cohortData) {
    return <div>Loading...</div>;
  }

  console.log('cohortData', cohortData);
  const {
    cohort_banner,
    cohort_end_date,
    cohort_launch_date,
    country,
    criteria,
    deadline,
    description,
    funding_amount,
    funding_type,
    host_name,
    email,
    no_of_seats,
    start_date,
    tags,
    title,
  } = cohortData.cohort;
  console.log('Line 215..............', cohortData.cohort_creator_data.email);
  console.log('Line 214', cohortData.cohort_creator_data.profile_picture);
  const Seats = Number(no_of_seats);
  const bannerImage =
    cohort_banner && cohort_banner.length > 0
      ? uint8ArrayToBase64(cohort_banner[0])
      : [];
  const profileimage = cohortData.cohort_creator_data.profile_picture;
  const ProfileImage =
    profileimage && profileimage.length > 0
      ? uint8ArrayToBase64(profileimage[0])
      : [];
  const TabButton = ({ name, label }) => (
    <button
      className={`py-2 px-4 ${
        activeTab === name
          ? 'text-blue-600 border-b-2 border-blue-600'
          : 'text-gray-600'
      }`}
      onClick={() => setActiveTab(name)}
    >
      {label}
    </button>
  );

  const registerHandler = async () => {
    setIsSubmitting(true);
    if (actor) {
      const today = new Date();
      const deadline = new Date(
        formatFullDateFromSimpleDate(cohortData?.cohort?.deadline)
      );

      // if (deadline < today) {
      //   setIsSubmitting(false);
      // } else {
      try {
        let cohort_id = cohortData?.cohort_id;
        if (userCurrentRoleStatusActiveRole === 'project') {
          await actor
            .apply_for_a_cohort_as_a_project(cohort_id)
            .then((result) => {
              setIsSubmitting(false);
              if (
                result &&
                result.includes(`Request Has Been Sent To Cohort Creator`)
              ) {
                toast.success(result);
              } else {
                toast.error(result);
              }
            });
        } else if (userCurrentRoleStatusActiveRole === 'vc') {
          await actor
            .apply_for_a_cohort_as_a_investor(cohort_id)
            .then((result) => {
              setIsSubmitting(false);
              if (result) {
                toast.success(result);
              } else {
                toast.error(result);
              }
            });
        } else if (userCurrentRoleStatusActiveRole === 'mentor') {
          await actor
            .apply_for_a_cohort_as_a_mentor(cohort_id)
            .then((result) => {
              setIsSubmitting(false);
              if (result) {
                toast.success(result);
              } else {
                toast.error(result);
              }
            });
        }
      } catch (error) {
        setIsSubmitting(false);
        toast.error(error);
        console.error('Error sending data to the backend:', error);
      }
      // }
    } else {
      setIsSubmitting(false);
      toast.error('Please signup with internet identity first');
      window.location.href = '/';
    }
  };

  const getButtonText = (role) => {
    switch (role) {
      case 'project':
        return 'Join as Project';
      case 'vc':
        return 'Join as Investor';
      case 'mentor':
        return 'Join as Mentor';
      case 'user':
        return "You can't join ";
      default:
        return 'Join';
    }
  };

  const shareUrl = `${window.location.origin}/dashboard/single-event${cohort_id}`;
 
  return ( 
    <div className='flex flex-col'>
      <div className='flex   w-full justify-between  my-2 py-3  -top-[1.2rem] md:-top-[0.2rem] bg-white sticky z-40'>
        <button
          className=' flex mr-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 bg-white px-3 py-2 rounded-md shadow-sm border border-gray-200'
          onClick={() => navigate(-1)}
        >
          <ArrowBack className='mr-1' />
          <span className='hidden xxs1:block'> Back to profile</span>
        </button>

        <button
          className='flex items-center md:mr-4 text-gray-600 hover:text-gray-800 hover:bg-gray-200 bg-white px-3 py-2 rounded-md shadow-sm border border-gray-200'
          onClick={() => setIsModalOpen(true)}
        >
          <span className='hidden xxs1:block'>Share Cohort</span>
          <span className='ml-1'>{shareSvgIcon}</span>
        </button>
      </div>
      <div className='flex flex-col  gap-4 md:gap-10 md:flex-row'  >
        <div className='  w-full md:w-[30%] bg-white rounded-lg shadow-md pt-2 md:ml-1'>
          <div className='bg-gray-100 p-4'>
            <div className='flex items-start mb-4'>
              <img
                src={ProfileImage}
                alt={host_name || 'Host'}
                className='w-14 h-14 rounded-full mr-3'
                loading='lazy'
                draggable={false}
                onClick={() => handleClick(cohortData?.cohort_creator_data)}
              />
              <div>
                <h2 className='text-lg font-medium'>
                  {host_name || 'Host Name'}
                </h2>
                <span className='inline-block border border-[#FEDF89] bg-[#FFFAEB] text-[#B54708] text-xs px-2 py-0.5 rounded-md uppercase font-medium tracking-wide'>
                  ORGANISER
                </span>
              </div>
            </div>

            <div className='mb-3'>
              <h3 className='text-sm md:text-base font-medium mb-2 text-left'>
                Event starts in
              </h3>
              <div className='flex items-center justify-between'>
                {[
                  { value: timeLeft.days, label: 'Days' },
                  { value: timeLeft.hours, label: 'Hours' },
                  { value: timeLeft.minutes, label: 'Minutes' },
                  { value: timeLeft.seconds, label: 'Seconds' },
                ].map((item, index) => (
                  <React.Fragment key={item.label}>
                    <div className='text-center'>
                      <div className='text-base lgx:text-xl font-bold bg-white rounded-lg p-1 lgx:p-2 min-w-[30px] lgx:min-w-[40px] max-w-[45px]'>
                        {item.value}
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

            {userCurrentRoleStatusActiveRole !== "user" && (
              <button
                className='w-full flex justify-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 mb-2 text-sm'
                onClick={registerHandler}
              >
                {isSubmitting ? (
                  <ThreeDots
                    visible={true}
                    height='30'
                    width='40'
                    color='#FFFFFF'
                    radius='9'
                    ariaLabel='three-dots-loading'
                  />
                ) : (
                  getButtonText(userCurrentRoleStatusActiveRole)
                )}
              </button>
            )}

            <button
              className='w-full border border-[#CDD5DF] bg-white text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition duration-300 mb-2 text-sm'
              onClick={() =>
                (window.location.href = `mailto:${cohortData.cohort_creator_data.email}`)
              }
            >
              Contact organiser
            </button>

            <div className='text-center text-orange-500 font-medium text-sm'>
              {Seats} spots left
            </div>
          </div>

          {/* laptop screen  */}
          <div className='p-4 hidden md:block'>
            <div className='mb-4 hover:bg-[#e4e3e2b1] cursor-not-allowed opacity-50'>
              <h3 className='text-[12px] font-medium text-[#697586] mb-2'>
                GUEST
              </h3>
              <div className='flex flex-wrap justify-start'>
                {[...Array(11)].map((_, i) => (
                  <img
                    key={i}
                    src={GuestProfile1}
                    alt={`Guest ${i + 1}`}
                    className='w-8 h-8 rounded-full mr-1 mb-1'
                    loading='lazy'
                    draggable={false}
                  />
                ))}
              </div>
            </div>
            <Tooltip
              id='registerTip'
              place='top'
              effect='solid'
              className='rounded-full z-10'
            >
              Comming Soon
            </Tooltip>
            <div className='space-y-3 text-sm'>
              <div>
                <span className='text-[#697586] text-[12px] block mb-2'>
                  EVENT CATEGORY
                </span>
                <div className='flex flex-wrap gap-2'>
                  {tags?.split(',').map((interest, index) => (
                    <span
                      key={index}
                      className='border-2 border-gray-500 rounded-full text-gray-700 text-xs px-2 py-1'
                    >
                      {interest.trim()}
                    </span>
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
                  <span className='text-gray-700'>{Seats}</span>
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
                  <span className='text-gray-700'>{start_date}</span>
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
                  <span className='text-gray-700'>{cohort_end_date}</span>
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

                  <span className='text-gray-700'>{country}</span>
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
                  <span className='text-gray-700'>{funding_amount}</span>
                </div>
              </div>
              <div>
                <span className='text-[#697586] text-[12px] block mb-1'>
                  FUNDING TYPE
                </span>

                <div className='flex flex-wrap gap-2'>
                  {funding_type?.split(',').map((interest, index) => (
                    <span
                      key={index}
                      className='border-2 border-gray-500 rounded-full text-gray-700 text-xs px-2 py-1'
                    >
                      {interest.trim()}
                    </span>
                  ))}
                </div>
              </div>
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
                  <span className='text-gray-700'>{deadline}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* mobile screen  */}
        <div className=' bg-white md:hidden  rounded-lg shadow-sm border border-gray-200 overflow-hidden w-full'>
          {!showDetails ? (
            <button
              onClick={handleToggle}
              className=' font-bold py-2 px-4 rounded w-full flex justify-center items-center '
            >
              Show details
              <FaChevronDown className='ml-2' />
            </button>
          ) : (
            <>
              <div className='p-4'>
                <div className='mb-4 hover:bg-[#e4e3e2b1] cursor-not-allowed opacity-50'>
                  <h3 className='text-[12px] font-medium text-[#697586] mb-2'>
                    GUEST
                  </h3>
                  <div className='flex flex-wrap justify-start'>
                    {[...Array(11)].map((_, i) => (
                      <img
                        key={i}
                        src={GuestProfile1}
                        alt={`Guest ${i + 1}`}
                        className='w-8 h-8 rounded-full mr-1 mb-1'
                        loading='lazy'
                        draggable={false}
                      />
                    ))}
                  </div>
                </div>
                <Tooltip
                  id='registerTip'
                  place='top'
                  effect='solid'
                  className='rounded-full z-10'
                >
                  Comming Soon
                </Tooltip>
                <div className='space-y-3 text-sm'>
                  <div>
                    <span className='text-[#697586] text-[12px] block mb-2'>
                      EVENT CATEGORY
                    </span>
                    <div className='flex flex-wrap gap-2'>
                      {tags?.split(',').map((interest, index) => (
                        <span
                          key={index}
                          className='border-2 border-gray-500 rounded-full text-gray-700 text-xs px-2 py-1'
                        >
                          {interest.trim()}
                        </span>
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
                      <span className='text-gray-700'>{Seats}</span>
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
                      <span className='text-gray-700'>{start_date}</span>
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
                      <span className='text-gray-700'>{cohort_end_date}</span>
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

                      <span className='text-gray-700'>{country}</span>
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
                      <span className='text-gray-700'>{funding_amount}</span>
                    </div>
                  </div>
                  <div>
                    <span className='text-[#697586] text-[12px] block mb-1'>
                      FUNDING TYPE
                    </span>

                    <div className='flex flex-wrap gap-2'>
                      {funding_type?.split(',').map((interest, index) => (
                        <span
                          key={index}
                          className='border-2 border-gray-500 rounded-full text-gray-700 text-xs px-2 py-1'
                        >
                          {interest.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
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
                      <span className='text-gray-700'>{deadline}</span>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={handleToggle}
                className='font-bold py-2 px-4 rounded w-full flex justify-center items-center mt-4 '
              >
                Hide details <FaChevronUp className='ml-2' />
              </button>
            </>
          )}
        </div>

        <div className='flex-1 w-full overflow-auto '>
          <div className='py-2'>
            <div className='w-full h-[200px] lgx:h-[310px] flex items-center justify-center bg-gray-100'>
              <img
                src={bannerImage}
                alt='Event'
                className='w-full h-full rounded-lg  bg-gray-200'
                loading='lazy'
                draggable={false}
              />
            </div>

            <h1 className='text-xl md:text-3xl font-bold mt-4'>{title}</h1>
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
              <span className='mr-2'> {timeLeft.days} days</span>
              <span className='mr-2'>
                <img
                  src={PriceIcon}
                  className='w-5 h-5 font-bold'
                  alt='Price icon'
                  loading='lazy'
                  draggable={false}
                />
              </span>
              <span>{funding_amount}</span>
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
                          {parse(description)}
                        </div>
                        <div className='absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none'></div>
                      </div>
                      <h2 className='text-lg md:text-2xl font-semibold mt-2'>
                        FAQ
                      </h2>
                      <FAQ />
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
      </div>
      <Toaster />
      {isModalOpen && (
        <ShareModal onClose={() => setIsModalOpen(false)} shareUrl={shareUrl} />
      )}
      {openDetail && (
        <DiscoverUserModal
          openDetail={openDetail}
          setOpenDetail={setOpenDetail}
          userData={cardDetail}
        />
      )}
    </div>
  );
};

export default EventDetails;

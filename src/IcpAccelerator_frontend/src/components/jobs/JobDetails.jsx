import React, { useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import awtar from '../../../assets/images/icons/_Avatar.png';
import { useSelector } from 'react-redux';
import { formatFullDateFromBigInt } from '../Utils/formatter/formatDateFromBigInt';
import parse from 'html-react-parser';
import { TfiEmail } from 'react-icons/tfi';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import JobDetailsSkeleton from './JobsSkeleton/JobDetailsSkeleton';
import useTimeout from '../hooks/TimeOutHook';
const JobDetails = ({ setOpen, uid }) => {
  const actor = useSelector((currState) => currState.actors.actor);
  const [jobDetails, setJobDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [show, setShow] = useState(false);
  const jobTitle = jobDetails?.job_data?.title ?? 'Title not available';
  const category = jobDetails?.job_data?.category ?? 'category not available';
  const description =
    jobDetails?.job_data?.description ?? 'description not available';
  const job_type = jobDetails?.job_data?.job_type ?? 'job_type not available';
  const link = jobDetails?.job_data?.link ?? 'link not available';
  const location = jobDetails?.job_data?.location ?? 'location not available';
  const fullname = jobDetails?.job_poster[0]?.full_name ?? 'name not available';
  const email = jobDetails?.job_poster[0]?.email[0] ?? 'name not available';
  let timestamp = jobDetails?.timestamp
    ? formatFullDateFromBigInt(jobDetails?.timestamp)
    : '';

  useEffect(() => {
    const fetchJobDetails = async () => {
      setIsLoading(true);
      try {
        const result = await actor.get_job_details_using_uid(uid);
        if (Array.isArray(result) && result.length > 0) {
          setJobDetails(result[0]);
        } else {
          setJobDetails(result);
        }
      } catch (error) {
        console.error('Failed to fetch job details:', error);
        setError('Failed to load job details.');
      } finally {
        setIsLoading(false);
      }
    };
    if (actor && uid) {
      fetchJobDetails();
    }

    // setShow(true);

    // return () => setShow(false);

    setTimeout(() => {
      setShow(true);
    }, 0);
  }, [actor, uid]);

  const handleClose = () => {
    setShow(false);
    setTimeout(() => {
      setOpen(false);
    }, 300);
  };

  const [loading, setLoading] = useState(true);

  useTimeout(() => setLoading(false));

  const [showDetails, setShowDetails] = useState(false);

  const handleToggle = () => {
    setShowDetails(!showDetails);
  };
  return (
    <div className='w-full bg-fixed h-screen fixed inset-0 bg-black bg-opacity-30 backdrop-blur-xs z-50'>
      {/* <div className=' mx-auto w-[83%] absolute right-0 top-0 z-10 bg-white h-screen'> */}
      <div
        className={`transition-transform duration-300 ease-in-out transform ${
          show ? 'translate-x-0' : 'translate-x-full'
        } mx-auto w-[83%] absolute right-0 top-0 z-10 bg-white h-screen overflow-y-auto `}
      >
        <div className=' p-5'>
          <CloseIcon sx={{ cursor: 'pointer' }} onClick={handleClose} />
        </div>
        <div className='container'>
          {loading ? (
            <JobDetailsSkeleton />
          ) : (
            <div className='flex flex-col md:flex-row justify-evenly px-[1%]  overflow-y-auto'>
              <div className='border md:h-fit rounded-lg w-full md:w-[30%] '>
                <div className='py-6 px-5 border  rounded-t-lg bg-[#EEF2F6]'>
                  <div className=' gap-2 flex flex-col justify-center items-center'>
                    <span className=''>
                      <img
                        src={awtar}
                        alt='icon'
                        loading='lazy'
                        draggable={false}
                      />
                    </span>
                    <p className=''>{jobTitle}</p>
                  </div>
                  <div className='flex justify-center'>
                    <h2 className='text-xl font-bold my-3'>
                      {fullname} {/* Quality Assurance Engineer */}
                    </h2>
                  </div>
                  <div className=''>
                    <a
                      href={link}
                      target='_blank'
                      className='block border rounded-md bg-[#155EEF]  py-2 w-full text-white text-center'
                    >
                      Apply <span className=' text-white'></span>
                      <ArrowOutwardIcon
                        sx={{ marginTop: '-2px', fontSize: 'medium' }}
                      />
                    </a>
                  </div>
                </div>
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
                      <div className='p-3 '>
                        <div className='p-2'>
                          <h3 className='text-gray-400 mb-2 text-sm'>DATE</h3>
                          <h4 className='text-sm font-medium'>{timestamp}</h4>
                        </div>
                        <div className='p-2'>
                          <h3 className='text-gray-400 mb-2 text-sm'>
                            CATEGORY
                          </h3>
                          <h4 className='text-sm font-medium'>{category}</h4>
                        </div>
                        <div className='p-2'>
                          <h3 className='text-gray-400 mb-2 text-sm'>
                            LOCATION
                          </h3>
                          <h4 className='text-sm font-medium'>{location}</h4>
                        </div>
                        <div className='p-2'>
                          <h3 className='text-gray-400 mb-2 text-sm'>
                            OCCUPATION
                          </h3>
                          <h4 className='text-sm font-medium'>{job_type}</h4>
                        </div>
                        <div className='p-2'>
                          <h3 className='text-gray-400 mb-2 text-sm'>
                            CONTACT
                          </h3>
                          <h4 className='text-sm font-medium flex items-center'>
                            <TfiEmail />
                            <span className='ml-2 truncate break-all'>
                              {email}
                            </span>
                          </h4>
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
                <div className='p-3 hidden md:block'>
                  <div className='p-2'>
                    <h3 className='text-gray-400 mb-2 text-sm'>DATE</h3>
                    <h4 className='text-sm font-medium'>{timestamp}</h4>
                  </div>
                  <div className='p-2'>
                    <h3 className='text-gray-400 mb-2 text-sm'>CATEGORY</h3>
                    <h4 className='text-sm font-medium'>{category}</h4>
                  </div>
                  <div className='p-2'>
                    <h3 className='text-gray-400 mb-2 text-sm'>LOCATION</h3>
                    <h4 className='text-sm font-medium'>{location}</h4>
                  </div>
                  <div className='p-2'>
                    <h3 className='text-gray-400 mb-2 text-sm'>OCCUPATION</h3>
                    <h4 className='text-sm font-medium'>{job_type}</h4>
                  </div>
                  <div className='p-2'>
                    <h3 className='text-gray-400 mb-2 text-sm'>CONTACT</h3>
                    <h4 className='text-sm font-medium flex items-center'>
                      <TfiEmail />
                      <span className='ml-2 truncate break-all'>{email}</span>
                    </h4>
                  </div>
                </div>
              </div>
              <div className='border rounded-lg p-3 w-full md:w-[65%] overflow-y-auto   h-full'>
                <div className='break-words whitespace-normal overflow-y-auto'>
                  {parse(description)}
                </div>
                {/* <p className=''>Sweatcoin is a London-based and well-funded scale-up with a team of 100+ and the mission to make the world more physically active. Our iOS and Android apps have more than 150M installs, 15M+ active users, more than 500 commercial partners and confirmed by the independent academic research ability to make our users up to 20% more active.
                                    </p>
                                    <p className=''> If you are interested in solving complex problems, then we are looking forward to seeing you be a part of our team!.
                                    </p> */}
              </div>
              {/* <div className=' '>
                                    <h3 className='font-bold'>we are :</h3>
                                    <ul className='list-disc pl-[5%]'>
                                        <li className=''>
                                            A team of exceptional people who celebrate our community by being supportive and creative all the way. The head of data once was developing mind-reading helmet; a software developer has his certified psychological practice; QA-vet; QA-skipper; and a number of musicians that might allow us to start our own band. All together we're multiplying each other's talents which inspire us to develop a product we're all proud of.
                                        </li>
                                        <li className=''>
                                            A product that promotes health and fitness in more than 100 countries. Sweatcoin has proven to help people and create multiple inspiring stories like this one:https://blog.sweatco.in/one-sweatcoiners-journey-to-100000-steps/.
                                        </li>
                                        <li className=''>
                                            A startup that actually works. We are completely self-sufficient yet our investors are excited to provide us with even more resources to keep growing. We recently broke our record of 10M new users each week.
                                        </li>
                                    </ul>
                                </div>
                                <div className=''>
                                    <h3 className='font-bold'>What to expect:</h3>
                                    <ul className='list-disc pl-[5%]'>
                                        <li className=''>
                                            Working over product solutions along with designers, product managers, and developers throughout the entire development cycle in one / two product teams
                                        </li>
                                        <li className=''>
                                            Perform functional testing of applications
                                        </li>
                                        <li className=''>
                                            Perform feature design review
                                        </li>
                                        <li className=''>
                                            Analyze, detect and document bugs
                                        </li>
                                        <li className=''>
                                            Write checklists from scratch in Qase
                                        </li>
                                        <li className=''>
                                            Be a QA-ninja (we will tell you more in the interview)
                                        </li>
                                    </ul>
                                </div>
                                <div className=''>
                                    <h3 className='font-bold'>Requirements:</h3>
                                    <ul className='list-disc pl-[5%]'>
                                        <li className=''>Hands-on experience in mobile testing or strong theoretical knowledge;</li>
                                        <li className=''>Experience testing APIs and RESTful services (manual or automated)</li>
                                        <li className=''>Good understanding principles of of web, https, json, restful-services;</li>
                                        <li className=''>Skills for applying test-design theories into practice.
                                        </li>
                                    </ul>
                                </div> */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetails;

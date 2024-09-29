import React from 'react';
import { useState } from 'react';
import ProfileImage from '../../../../assets/Logo/ProfileImage.png';
import LandingPageDesign from '../../../../assets/Logo/LandingPageDesign.png';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VerifiedIcon from '@mui/icons-material/Verified';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';
import { Folder } from '@mui/icons-material';
import {
  ArrowBack,
  ArrowForward,
  Share,
  MoreVert,
  CheckCircle,
  NorthEastOutlined,
  LinkedIn,
  GitHub,
  Telegram,
  Add,
  LocationOn,
} from '@mui/icons-material';

function AddNewWork() {
  const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className='border-b border-gray-200'>
        <button
          className='flex justify-between items-center w-full text-left py-4'
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className='text-lg font-semibold'>{question}</span>
          {isOpen ? (
            <RemoveCircleOutlineOutlinedIcon className='text-gray-500' />
          ) : (
            <AddCircleOutlineOutlinedIcon className='text-gray-500' />
          )}
        </button>
        {isOpen && <p className='mt-2 text-gray-600 pb-4'>{answer}</p>}
      </div>
    );
  };

  const FAQ = () => {
    const faqData = [
      {
        question: 'Est quis ornare proin quisque lacinia ac tincidunt massa?',
        answer:
          'Est malesuada ac elit gravida vel aliquam nec. Arcu pelle ntesque convallis quam feugiat non viverra massa fringilla. Est malesuada ac elit gravida vel aliquam nec. Arcu pelle ntesque convallis quam feugiat non viverra massa fringilla.',
      },
      {
        question: 'Gravida quis pellentesque mauris in fringilla?',
        answer:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      },
      {
        question: 'Lacus iaculis vitae pretium integer?',
        answer:
          'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      },
    ];

    return (
      <div>
        <h2 className='text-2xl font-semibold mb-4'>FAQ</h2>
        <div className='border-t border-gray-200'>
          {faqData.map((item, index) => (
            <FAQItem
              key={index}
              question={item.question}
              answer={item.answer}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className='bg-white p-6 rounded-lg shadow-sm'>
      {/* Top navigation */}
      <div className='flex justify-between items-center mb-6'>
        <Link to='/project'>
          <button className='flex items-center text-gray-600 hover:text-gray-800 hover:bg-gray-200 bg-white px-3 py-2 rounded-md shadow-sm border border-gray-200'>
            <ArrowBack className='mr-2' fontSize='small' />
            Back to profile
          </button>
        </Link>
        <div className='flex items-center'>
          <button className='mr-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 bg-white px-3 py-2 rounded-md shadow-sm border border-gray-200'>
            View public profile
          </button>
          <button className='flex items-center text-gray-600 hover:text-gray-800 hover:bg-gray-200 bg-white px-3 py-2 rounded-md shadow-sm border border-gray-200'>
            <Share className='mr-1' fontSize='small' /> Share
          </button>
        </div>
      </div>

      <div className='flex flex-col md:flex-row gap-8'>
        {/* Profile Card */}

        <div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden w-full max-w-sm'>
          <div className='relative h-1 bg-gray-200'>
            <div className='absolute left-0 top-0 h-full bg-green-500 w-1/3'></div>
          </div>
          <div className='p-6 bg-gray-50'>
            <img
              src={ProfileImage}
              alt='Matt Bowers'
              className='w-24 h-24 mx-auto rounded-full mb-4'
              loading='lazy'
              draggable={false}
            />
            <div className='flex items-center justify-center mb-1'>
              <VerifiedIcon className='text-blue-500 mr-1' fontSize='small' />
              <h2 className='text-2xl font-semibold'>Matt Bowers</h2>
            </div>
            <p className='text-gray-600 text-center mb-4'>@mattbowers</p>
            <button className='w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 mb-6 flex items-center justify-center'>
              Get in touch
              <ArrowForward className='ml-1' fontSize='small' />
            </button>
          </div>

          <div className='p-6 bg-white'>
            <div className='mb-4'>
              <h3 className='font-normal mb-2 text-xs text-gray-500 uppercase'>
                Roles
              </h3>
              <div className='flex space-x-2'>
                <span className='bg-[#F0F9FF] border border-[#B9E6FE] text-[#026AA2] px-3 py-1 rounded-md text-xs font-medium'>
                  OLYMPIAN
                </span>
                <span className='bg-[#ECFDF3] border border-[#ABEFC6] text-[#067647] px-3 py-1 rounded-md text-xs font-medium'>
                  TALENT
                </span>
              </div>
            </div>

            <div className='mb-4'>
              <div className='flex border-b'>
                <button className='text-blue-600 border-b-2 border-blue-600 pb-2 mr-4 font-medium'>
                  General
                </button>
                <button className='text-gray-400 pb-2 font-medium'>
                  Expertise
                </button>
              </div>
            </div>

            <div className='mb-4'>
              <h3 className='font-normal mb-2 text-xs text-gray-500 uppercase'>
                Email
              </h3>
              <div className='flex items-center'>
                <p className='mr-2 text-sm'>mail@email.com</p>
                <VerifiedIcon
                  className='text-blue-500 mr-2 w-2 h-2'
                  fontSize='small'
                />
                <span className='bg-gray-200 text-gray-600 px-2 py-0.5 rounded text-xs'>
                  HIDDEN
                </span>
              </div>
            </div>

            <div className='mb-4'>
              <h3 className='font-normal mb-2 text-xs text-gray-500 uppercase'>
                Tagline
              </h3>
              <p className='text-sm'>Founder & CEO at Cypherpunk Labs</p>
            </div>

            <div className='mb-4'>
              <h3 className='font-normal mb-2 text-xs text-gray-500 uppercase'>
                About
              </h3>
              <p className='text-sm'>
                Est malesuada ac elit gravida vel aliquam nec. Arcu pelle
                ntesque convallis quam feugiat non viverra massa fringilla.
              </p>
            </div>

            <div className='mb-4'>
              <h3 className='font-normal mb-2 text-sm text-gray-500'>
                INTERESTS
              </h3>
              <div className='flex space-x-2'>
                <span className='bg-white border borer-[#CDD5DF] text-[#364152] px-2 py-1 rounded-full text-sm'>
                  Web3
                </span>
                <span className='bg-white border borer-[#CDD5DF] text-[#364152] px-2 py-1 rounded-full text-sm'>
                  Cryptography
                </span>
              </div>
            </div>

            <div className='mb-4'>
              <h3 className='font-normal mb-2 text-sm text-gray-500'>
                LOCATION
              </h3>
              <div className='flex items-center'>
                <PlaceOutlinedIcon
                  className='text-gray-400 mr-1'
                  fontSize='small'
                />
                <p>San Diego, CA</p>
              </div>
            </div>

            <div className='mb-4 max-w-sm'>
              <h3 className='font-normal mb-2 text-sm text-gray-500'>
                TIMEZONE
              </h3>
              <button className='bg-gray-100 hover:bg-gray-200 text-sm w-full px-3 py-2 rounded border border-gray-200 text-left flex items-center'>
                <Add fontSize='small' className='mr-2' />
                <span>Add timezone</span>
              </button>
            </div>

            <div className='mb-4 max-w-sm'>
              <h3 className='font-normal mb-2 text-sm text-gray-500'>
                LANGUAGES
              </h3>
              <button className='bg-gray-100 hover:bg-gray-200 text-sm w-full px-3 py-2 rounded border border-gray-200 text-left flex items-center'>
                <Add fontSize='small' className='mr-1 inline-block' />
                Add languages
              </button>
            </div>

            <div>
              <h3 className='font-normal mb-2 text-sm text-gray-500'>LINKS</h3>
              <div className='flex space-x-2'>
                <LinkedIn className='text-gray-400 hover:text-gray-600 cursor-pointer' />
                <GitHub className='text-gray-400 hover:text-gray-600 cursor-pointer' />
                <Telegram className='text-gray-400 hover:text-gray-600 cursor-pointer' />
              </div>
            </div>
          </div>
        </div>

        {/*---------------------Service Section------------------------------- */}
        <div className='md:w-2/3'>
          <div className='flex justify-between items-center mb-6'>
            <div className='flex flex-col mb-6'>
              <div className='flex justify-between items-center'>
                <div className='flex space-x-4 relative pb-0.5'>
                  <button className='text-gray-500 py-2'>Roles</button>
                  <Link to='/dashboard/project'>
                    <button className='text-gray-500 py-2 flex items-center'>
                      Services
                      <span className='ml-1 bg-[#EFF4FF] border-[#E3E8EF] border text-[#364152] text-xs rounded-full w-6 h-4 flex items-center justify-center'>
                        1
                      </span>
                    </button>
                  </Link>
                  <Link to='/dashboard/single-add-new-work'>
                    <button className='text-[#155EEF] py-2 relative'>
                      Works
                      <div className='absolute bottom-0 left-0 right-0 h-0.5 bg-[#155EEF]'></div>
                    </button>
                  </Link>
                  <button className='text-gray-500 py-2'>Rating</button>
                </div>
              </div>
              <hr className='w-full border-t border-gray-200 mt-0' />
            </div>
          </div>

          {/* Add new work card */}
          <div className='p-6'>
            {/* Content */}
            <div className='text-center py-12'>
              <Folder className='w-24 h-24 text-gray-300 text-6xl mb-4 mx-auto' />
              <h2 className='text-xl font-semibold mb-2'>
                You haven't posted any jobs yet
              </h2>
              <p className='text-gray-600 mb-2'>
                Any assets used in projects will live here.
              </p>
              <p className='text-gray-600 mb-6'>
                Start creating by uploading your files.
              </p>
              <Link to='/dashboard/work-section'>
                <button className='bg-[#155EEF] text-white px-4 py-2 rounded-md flex items-center justify-center mx-auto'>
                  <Add className='mr-2' />
                  Add a new work
                </button>
              </Link>
            </div>

            {/* FAQ Section */}
            <FAQ />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddNewWork;

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ThreeDots } from 'react-loader-spinner';
import Select from 'react-select';
import Avatar from '@mui/material/Avatar';
import mentor from '../../assets/Logo/talent.png';
import vc from '../../assets/Logo/Avatar3.png';
import RequestSuccessModal from '../components/Modals/RequestSuccessModal';
const schema = yup
  .object({
    message: yup.string().required('Required'),
  })
  .required();

const AddAMentorRequestModal = ({
  title,
  onClose,
  onSubmitHandler,
  isSubmitting,
  selectedAssociationType,
  setSelectedAssociationType,
  projectProfile,
  projectName,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
  });
  const associationOptions = [
    {
      value: 'mentor',
      label: (
        <div className='flex items-center justify-start'>
          <Avatar
            alt='Mentor'
            src={mentor}
            style={{ width: '24px', height: '24px' }}
            className='mr-2'
          />
          <span className='font-semibold'>Mentor</span>
        </div>
      ),
    },
    {
      value: 'vc',
      label: (
        <div className='flex items-center justify-start'>
          <Avatar
            alt='Investor'
            src={vc}
            style={{ width: '24px', height: '24px' }}
            className='mr-2'
          />
          <span className='font-semibold'>Investor</span>
        </div>
      ),
    },
  ];
  const handleAssociationTypeChange = (selectedOption) => {
    setSelectedAssociationType(selectedOption);
  };

  const onSubmit = (data) => {
    console.log(data);
    onSubmitHandler(data);
  };

  return (
    <>
      <div className='fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50'></div>
      <div className='fixed inset-0 flex justify-center items-center z-50'>
        <div className='relative p-6 w-full max-w-md bg-white rounded-lg shadow-lg'>
          <div className='flex items-center justify-between mb-4'>
            <div className='flex'>
              <img
                src={projectProfile}
                alt='Cypherpunk Labs Logo'
                className='w-8 h-8 mr-3 rounded-full'
              />
              <h3 className='text-lg font-semibold text-gray-900'>
                {projectName}
              </h3>
            </div>
            <button
              type='button'
              className='text-gray-400 hover:bg-gray-200 rounded-lg focus:outline-none p-1'
              onClick={onClose}
            >
              <svg
                className='w-4 h-4'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 14 14'
              >
                <path
                  stroke='currentColor'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M1 1l6 6m0 0l6 6M7 7l6-6M7 7l-6 6'
                />
              </svg>
            </button>
          </div>

          <div className='flex items-center justify-between pb-4'>
            <h3 className='text-xl font-semibold text-gray-900'>{title}</h3>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='mb-4'>
              <Select
                options={associationOptions}
                value={selectedAssociationType}
                onChange={handleAssociationTypeChange}
                className='w-full'
                placeholder='Request as'
                menuPortalTarget={document.body}
                menuPlacement='auto'
                styles={{
                  menuPortal: (base) => ({
                    ...base,
                    zIndex: 9999,
                  }),
                  control: (base) => ({
                    ...base,
                    '@media (max-width: 768px)': {
                      width: '100%',
                    },
                  }),
                }}
              />
            </div>
            <div className='mb-4'>
              <label
                htmlFor='message'
                className='block text-sm font-medium text-gray-500'
              >
                Message
              </label>
              <textarea
                {...register('message')}
                className={`bg-gray-50 border-2 ${
                  errors.message
                    ? 'border-red-500 placeholder:text-red-500'
                    : 'border-gray-300'
                } text-gray-900 placeholder-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                placeholder='Enter a description...'
                rows={4}
              ></textarea>
              {errors.message && (
                <span className='text-sm text-red-500'>
                  {errors.message.message}
                </span>
              )}
            </div>
            <div className='flex justify-end space-x-4'>
              <button
                type='button'
                onClick={onClose}
                className='text-gray-500 hover:text-gray-700 focus:outline-none'
              >
                Cancel
              </button>
              <button
                type='submit'
                disabled={isSubmitting}
                className='bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300'
              >
                {isSubmitting ? (
                  <ThreeDots
                    visible={true}
                    height='20'
                    width='20'
                    color='#FFFFFF'
                    radius='9'
                    ariaLabel='three-dots-loading'
                    wrapperStyle={{}}
                    wrapperclassName=''
                  />
                ) : (
                  'Send Request'
                )}
              </button>
            </div>
          </form>
          {/* <RequestSuccessModal/> */}
        </div>
      </div>
    </>
  );
};

export default AddAMentorRequestModal;

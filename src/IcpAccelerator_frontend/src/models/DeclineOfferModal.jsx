import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ThreeDots } from 'react-loader-spinner';

const schema = yup
  .object({
    message: yup.string().required('Required'),
  })
  .required();

const DeclineOfferModal = ({
  title,
  onClose,
  onSubmitHandler,
  isSubmitting,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
  });

  const onSubmit = (data) => {
    console.log(data);
    onSubmitHandler(data);
  };

  return (
    <>
      <div className='fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50'></div>
      <div className=' overflow-y-auto overflow-x-hidden  top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full fixed flex'>
        <div className='relative p-4 w-full max-w-md max-h-full'>
          <div className='relative bg-white rounded-lg shadow'>
            <div className='flex items-center justify-between p-4 md:p-5 border-b rounded-t '>
              <h3 className='text-xl font-semibold text-gray-900 '>{title}</h3>
              <button
                type='button'
                className='text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center '
                onClick={onClose}
              >
                <svg
                  className='w-3 h-3'
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
                    d='m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6'
                  />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className='p-4 md:p-5'>
              <div className='grid gap-4 mb-4 grid-cols-2'>
                <div className='col-span-2'>
                  <label
                    htmlFor='user_id'
                    className='block mb-2 text-lg font-medium text-gray-500 hover:text-black  hover:whitespace-normal truncate overflow-hidden hover:text-left'
                  >
                    Response
                  </label>
                  <textarea
                    {...register('message')}
                    className={`bg-gray-50 border-2 ${errors.message ? 'border-red-500 placeholder:text-red-500' : 'border-[#737373]'} text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                    placeholder='Write down your offer'
                    rows={3}
                  ></textarea>
                  {errors.message && (
                    <span className='mt-1 text-sm text-red-500 font-bold'>
                      {errors.message.message}
                    </span>
                  )}
                </div>
              </div>
              <div className='flex w-full justify-end'>
                <button
                  type='submit'
                  className='text-white inline-flex items-center bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center'
                >
                  {isSubmitting ? (
                    <ThreeDots
                      visible={true}
                      height='35'
                      width='35'
                      color='#FFFEFF'
                      radius='9'
                      ariaLabel='three-dots-loading'
                      wrapperStyle={{}}
                      wrapperclassName=''
                    />
                  ) : (
                    'Decline Offer'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeclineOfferModal;

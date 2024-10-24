import React from 'react';
import { useFormContext } from 'react-hook-form';
// import{  FaEmail} from "react-icons/fa";
const RegisterForm2 = React.memo(() => {
  const {
    register,
    formState: { errors },
  } = useFormContext({ mode: 'all' });

  return (
    <>
      <div className='overflow-y-auto px-4'>
        <div className='mb-4 sm:mb-6'>
          <h1 className='text-xl sm1:text-2xl md:text-3xl font-bold  text-[#121926]'>
            What's your email?
          </h1>
        </div>
        <div className='space-y-4'>
          <div className='flex flex-col justify-between sm:gap-3'>
            <label
              htmlFor='email'
              className=' font-semibold block text-[#121926]'
            >
              Email <span className='text-[red] ml-1'>*</span>
            </label>
            <div className='relative'>
              <input
                type='email'
                {...register('email')}
                className={`bg-gray-50 border-2 

                                                ${
                                                  errors?.email
                                                    ? 'border-red-500'
                                                    : 'border-[#737373]'
                                                } mt-1 p-2 border border-gray-300 rounded w-full`}
                placeholder='Enter your email'
              />
              <span className='absolute left-2 top-2 text-gray-500'>
                {/* <FaEmail/> */}
              </span>
            </div>
            {errors?.email && (
              <span className='mt-1 text-sm text-red-500 font-bold flex justify-start'>
                {errors?.email?.message}
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
});
export default RegisterForm2;

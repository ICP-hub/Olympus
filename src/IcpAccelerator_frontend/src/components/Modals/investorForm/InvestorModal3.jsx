import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useSelector } from 'react-redux';

const InvestorModal3 = () => {
  const {
    watch,
    register,
    clearErrors,
    countries,
    formState: { errors },
    setValue,
    setError,
  } = useFormContext();

  const getAllIcpHubs = useSelector((currState) => currState.hubs.allHubs);

  return (
    <>
      <div className='mb-2'>
        <label className='block mb-1'>
          Which ICP hub would you like to be associated with?
          <span className='text-[red] ml-1'>*</span>
        </label>
        <select
          {...register('preferred_icp_hub')}
          name='preferred_icp_hub'
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
            errors.preferred_icp_hub
              ? 'border-red-500 border-2'
              : 'border-gray-300'
          }`}
        >
          <option value=''>Please choose an option</option>
          {getAllIcpHubs?.map((hub) => (
            <option
              key={hub.id}
              value={`${hub.name}, ${hub.region}`}
              className='text-lg font-bold'
            >
              {hub.name}, {hub.region}
            </option>
          ))}
        </select>
        {errors.preferred_icp_hub && (
          <p className='mt-1 text-sm text-red-500 font-bold text-left'>
            {errors.preferred_icp_hub.message}
          </p>
        )}
      </div>

      {/* PORTFOLIO LINK INPUT */}
      <div className='mb-2'>
        <label className='block mb-1'>
          Portfolio Link <span className='text-[red] ml-1'>*</span>
        </label>
        <input
          type='text'
          {...register('investor_portfolio_link', {
            required: 'Portfolio link is required',
            pattern: {
              value: /^(ftp|http|https):\/\/[^ "]+$/,
              message: 'Invalid URL format',
            },
          })}
          placeholder='Enter your Portfolio URL'
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
            errors.investor_portfolio_link
              ? 'border-red-500 border-2'
              : 'border-gray-300'
          }`}
        />

        {errors.investor_portfolio_link && (
          <p className='mt-1 text-sm text-red-500 font-bold text-left'>
            {errors.investor_portfolio_link.message}
          </p>
        )}
      </div>

      {/* FUND NAME INPUT */}
      <div className='mb-2'>
        <label className='block mb-1'>
          Fund Name <span className='text-[red] ml-1'>*</span>
        </label>
        <input
          {...register('investor_fund_name', {
            required: 'This field is required',
          })}
          name='investor_fund_name'
          type='text'
          placeholder='Enter your fund name'
          className={`block w-full border rounded-md p-2 ${
            errors.investor_fund_name
              ? 'border-red-500 border-2'
              : 'border-gray-300'
          }`}
        />
        {errors?.investor_fund_name && (
          <span className='mt-1 text-sm text-red-500 font-bold flex justify-start'>
            {errors?.investor_fund_name?.message}
          </span>
        )}
      </div>

      {/* FUND SIZE INPUT */}
      <div className='mb-2'>
        <label className='block mb-1'>
          Fund size (in million USD){' '}
          <span className='text-red-500 ml-1'>*</span>
        </label>
        <input
          {...register('investor_fund_size', {
            required: 'Fund size is required',
            min: {
              value: 0,
              message: 'Fund size must be at least 0',
            },
            valueAsNumber: true,
          })}
          type='number'
          placeholder='Enter fund size in Millions'
          className={`block w-full border rounded-md p-2 ${
            errors.investor_fund_size
              ? 'border-red-500 border-2'
              : 'border-gray-300'
          }`}
          onWheel={(e) => e.target.blur()}
        />
        {errors?.investor_fund_size && (
          <span className='mt-1 text-sm text-red-500 font-bold flex justify-start'>
            {errors?.investor_fund_size?.message}
          </span>
        )}
      </div>
    </>
  );
};

export default InvestorModal3;

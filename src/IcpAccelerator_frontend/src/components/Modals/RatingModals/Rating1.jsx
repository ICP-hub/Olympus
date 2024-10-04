import React, { useState, useEffect } from 'react';
import ReactSelect from 'react-select';
import Select from 'react-select';
import { useFormContext } from 'react-hook-form';
import { useSelector } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';
import getReactSelectStyles from '../../Utils/navigationHelper/getReactSelectStyles';
const selectStyles = {
  control: (provided) => ({
    ...provided,
    borderColor: '#CDD5DF', // Tailwind border-gray-300
    borderRadius: '0.375rem', // Tailwind rounded-md
  }),
  controlIsFocused: (provided) => ({
    ...provided,
    borderColor: '#3b82f6', // Tailwind border-blue-500
    boxShadow: 'none',
  }),
  multiValue: (provided) => ({
    ...provided,
    borderColor: '#CDD5DF', // Tailwind bg-gray-200
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: '#1f2937', // Tailwind text-gray-700
  }),
};
// MENTOR SIGNUP FORM COMPONENT
const Rating1 = () => {
  const [categories, setCategories] = useState([]);
  const categoryOptions = [
    { value: 'DeFi', label: 'DeFi' },
    { value: 'GameFi', label: 'GameFi' },
    // Add more options as needed
  ];

  return (
    <>
      <h1 className='text-3xl text-[#121926] font-bold mb-3'>Rating</h1>

      <div className='mb-2'>
        <label className='block text-sm font-medium mb-1 text-[#364152]'>
          Relevant categories <span className='text-[red] ml-1'>*</span>
        </label>
        <Select
          isMulti
          options={categoryOptions}
          value={categories}
          onChange={setCategories}
          styles={selectStyles}
          className='basic-multi-select'
          classNamePrefix='select'
          placeholder='Add Relevant Categories'
        />
      </div>

      {/* TOASTER FOR NOTIFICATIONS */}
      <Toaster />
    </>
  );
};

export default Rating1;

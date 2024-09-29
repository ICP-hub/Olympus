import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const selectStyles = {
  control: (provided) => ({
    ...provided,
    borderColor: '#CDD5DF', // Tailwind border-gray-300
    borderRadius: '0.375rem', // Tailwind rounded-md
  }),
  controlIsFocused: (provided) => ({
    ...provided,
    borderColor: 'black', // Tailwind border-blue-500
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

const Mentormodal5 = ({ isOpen, onClose }) => {
  const [pricingCategories, setPricingCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(isOpen || true);
  const [acceptTokens, setAcceptTokens] = useState(null); // State for radio buttons
  const [currencyCategories, setcurrencyCategories] = useState([]);

  const [contactCategories, setcontactCategories] = useState([]);

  const PricingtypeOptions = [
    { value: 'Flat Rate', label: 'Flat Rate' },
    { value: 'House Rate', label: 'House Rate' },
    // Add more options as needed
  ];
  const CurrencytypeOptions = [
    { value: 'ETH', label: 'ETH' },
    { value: 'ICP', label: 'ICP' },
    { value: 'BTC', label: 'BTC' },
    // Add more options as needed
  ];

  const ContacttypeOptions = [
    { value: 'Chirag', label: 'Chirag' },
    { value: 'Chandan', label: 'Chandan' },
    { value: 'Mohit', label: 'Mohit' },
    // Add more options as needed
  ];

  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [modalOpen]);

  // Handle radio button change
  const handleRadioChange = (event) => {
    setAcceptTokens(event.target.value);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${modalOpen ? 'block' : 'hidden'}`}
    >
      <div className='bg-white rounded-lg p-6 w-[500px]'>
        <div className='flex justify-between items-center mb-1'>
          <h2 className='text-sm font-semibold text-[#364152]'>Step 5 of 5</h2>
          <button
            className='text-[#364152] text-2xl'
            onClick={() => setModalOpen(false)}
          >
            &times;
          </button>
        </div>
        <h2 className='text-2xl font-bold mb-4'>Pricing</h2>

        <div className='mb-4'>
          <label className='block text-sm text-[#364152] font-medium mb-1'>
            Pricing Type<span className='text-[red] ml-1'>*</span>
          </label>
          <Select
            options={PricingtypeOptions}
            value={pricingCategories}
            onChange={setPricingCategories}
            styles={selectStyles}
            className='basic-multi-select'
            classNamePrefix='select'
            placeholder='Select a pricing type'
          />
        </div>
        <div className='mb-4'>
          <label className='block text-sm text-[#364152] font-medium mb-1'>
            Price<span className='text-[red] ml-1'>*</span>
          </label>
          <div className='relative w-[30%]'>
            <input
              type='text'
              className='pl-6 pr-4 py-2 border border-gray-300 rounded-md w-full'
              placeholder='Enter amount'
            />
            <span className='absolute inset-y-0 left-0 flex items-center pl-3 text-normal text-black'>
              $
            </span>
          </div>
        </div>
        <div className='mb-4'>
          <fieldset>
            <legend className='text-sm font-semibold mb-4 text-[#364152]'>
              Do you accept tokens?
            </legend>
            <div className='flex items-center mb-4'>
              <input
                id='true'
                type='radio'
                name='acceptTokens'
                value='true'
                className={`h-4 w-4 border-2 rounded-full cursor-pointer ${acceptTokens === 'true' ? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-300'}`}
                checked={acceptTokens === 'true'}
                onChange={handleRadioChange}
              />
              <label
                htmlFor='true'
                className='text-[#121926] text-sm font-semibold ml-2'
              >
                Yes
              </label>
            </div>
            <div className='flex items-center mb-4'>
              <input
                id='false'
                type='radio'
                name='acceptTokens'
                value='false'
                className={`h-4 w-4 border-2 rounded-full cursor-pointer ${acceptTokens === 'false' ? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-300'}`}
                checked={acceptTokens === 'false'}
                onChange={handleRadioChange}
              />
              <label
                htmlFor='false'
                className='text-[#121926] text-sm font-semibold ml-2'
              >
                No
              </label>
            </div>
          </fieldset>
        </div>
        <div className='mb-4'>
          <Select
            isMulti
            options={CurrencytypeOptions}
            value={currencyCategories}
            onChange={setcurrencyCategories}
            styles={selectStyles}
            className='basic-multi-select'
            classNamePrefix='select'
            placeholder='Add Relevant Currency'
          />
        </div>
        <div className='mb-4'>
          <label className='block text-sm text-[#364152] font-medium mb-1'>
            Contact method<span className='text-[red] ml-1'>*</span>
          </label>

          <Select
            options={ContacttypeOptions}
            value={contactCategories}
            onChange={setcontactCategories}
            styles={selectStyles}
            className='basic-multi-select'
            classNamePrefix='select'
            placeholder='Select a contact method'
          />
        </div>
        <div className='flex justify-between'>
          <button
            type='button'
            onClick={onClose}
            className='bg-gray-200 text-gray-700 px-4 py-2 rounded-md'
          >
            Cancel
          </button>
          <button
            type='submit'
            className='bg-blue-500 text-white px-4 py-2 rounded-md'
          >
            Continue
            <ArrowForwardIcon fontSize='small' className='ml-2' />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Mentormodal5;

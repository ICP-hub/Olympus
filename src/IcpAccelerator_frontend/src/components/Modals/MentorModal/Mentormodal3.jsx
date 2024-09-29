import React, { useState, useEffect } from 'react';
import Foldericon from '../../../../assets/Logo/Foldericon.png';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckIcon from '@mui/icons-material/Check';
import Select from 'react-select';

const Mentormodal3 = ({ isOpen, onClose }) => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    Servicetitle: '',
    Servicedescription: '',
  });
  // Ensure the modal is open by default if `isOpen` is not provided
  const [modalOpen, setModalOpen] = useState(isOpen || true);
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

  // Effect to manage body scroll
  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = 'hidden'; // Disable scrolling
    } else {
      document.body.style.overflow = 'auto'; // Enable scrolling
    }

    // Cleanup function to ensure scrolling is restored
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [modalOpen]);
  const DurationOptions = [
    { value: 'Weeks', label: 'Weeks' },
    { value: 'Months', label: 'Months' },
    { value: 'Years', label: 'Years' },

    // Add more options as needed
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const [duration, setDuration] = useState(1);
  const [unit, setUnit] = useState('Week(s)');
  const [notLimited, setNotLimited] = useState(false);

  const incrementDuration = () => {
    setDuration(duration + 1);
  };

  const decrementDuration = () => {
    if (duration > 1) {
      setDuration(duration - 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    onClose();
  };

  // const handleBack = () => {
  //     onBack();
  //     setModalOpen(false);
  // };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${modalOpen ? 'block' : 'hidden'}`}
    >
      <div className='bg-white rounded-lg shadow-lg w-[500px] p-6 pt-4'>
        <div className='flex justify-end mr-4'>
          <button
            className='text-2xl text-[#121926]'
            onClick={() => setModalOpen(false)}
          >
            &times;
          </button>
        </div>
        <h2 className='text-xs text-[#364152]'>Step 3 of 5</h2>
        <h1 className='text-3xl text-[#121926] font-bold mb-3'>
          Service details
        </h1>
        <form onSubmit={handleSubmit}>
          <div className='mb-2'>
            <label className='block text-sm font-medium mb-1'>
              Cover image<span className='text-[#155EEF]'>*</span>
            </label>
            <div className='flex gap-2'>
              <img
                src={Foldericon}
                alt='projectimg'
                className='border-2 border-dashed border-[#E3E8EF] p-4 rounded-md'
                loading='lazy'
                draggable={false}
              />
              <div className='flex gap-1 items-center justify-center'>
                <div className='flex gap-1'>
                  <label
                    htmlFor='file-upload'
                    className='block font-medium text-gray-700 border border-gray-500 px-1 cursor-pointer rounded'
                  >
                    <ControlPointIcon
                      fontSize='small'
                      className='items-center -mt-1'
                    />{' '}
                    Upload
                  </label>
                  <input
                    id='file-upload'
                    type='file'
                    name='photo'
                    className='mt-2 hidden'
                    onChange={handleChange}
                  />
                  <label
                    htmlFor='file-upload'
                    className='block font-medium text-gray-700 border border-gray-500 px-1 cursor-pointer rounded'
                  >
                    <AutoAwesomeIcon fontSize='small' className='mr-2' />
                    Generate Image
                  </label>
                  <input
                    id='file-upload'
                    type='file'
                    name='photo'
                    className='mt-2 hidden'
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className='mb-2'>
            <label className='block text-sm font-medium mb-1'>
              Service title<span className='text-[#155EEF]'>*</span>
            </label>
            <input
              type='text'
              name='Servicetitle'
              value={formData.Servicetitle}
              onChange={handleChange}
              maxLength={50}
              className='block w-full border border-gray-300 rounded-md p-2'
              required
              placeholder='Clear and concise service title'
            />
          </div>
          <div className='mb-2'>
            <label className='block text-sm font-medium mb-1'>
              Service description<span className='text-[#155EEF]'>*</span>
            </label>
            <textarea
              name='Servicedescription'
              value={formData.Servicedescription}
              onChange={handleChange}
              maxLength={500}
              className='block w-full border border-gray-300 rounded-md p-2'
              required
              placeholder='this is about section '
            />
          </div>
          <div className='mb-2 relative'>
            <label className='block text-sm font-medium mb-1'>
              Service duration<span className='text-[#155EEF]'>*</span>
            </label>
            <div className='flex space-x-3'>
              <div className='border border-gray-300 rounded'>
                <button
                  className='px-2 py-1  rounded'
                  onClick={decrementDuration}
                  disabled={duration <= 1}
                >
                  &minus;
                </button>
                <input
                  type='text'
                  id='duration'
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value) || 1)}
                  className='w-12 text-center  rounded'
                  disabled={notLimited}
                />
                <button
                  className='px-2 py-1  rounded'
                  onClick={incrementDuration}
                >
                  +
                </button>
              </div>
              <div>
                <Select
                  options={DurationOptions}
                  value={categories}
                  onChange={setCategories}
                  styles={selectStyles}
                  className='basic-multi-select'
                  classNamePrefix='select'
                  placeholder='Add Duration'
                />{' '}
              </div>
            </div>
          </div>

          <div className='flex justify-between'>
            <button
              type='button'
              // onClick={handleBack}
              className='mr-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-md'
            >
              <ArrowBackIcon fontSize='medium' className='ml-2' /> Back
            </button>
            <button
              // onClick={onClose}
              type='submit'
              className='bg-blue-500 text-white px-4 py-2 rounded-md'
            >
              Continue <ArrowForwardIcon fontSize='medium' className='ml-2' />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Mentormodal3;

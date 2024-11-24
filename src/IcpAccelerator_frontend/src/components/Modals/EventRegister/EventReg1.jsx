import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { formFields1 } from './EventFormData';
import { useFormContext, Controller } from 'react-hook-form';
import CompressedImage from '../../../components/ImageCompressed/CompressedImage';
import uint8ArrayToBase64 from '../../Utils/uint8ArrayToBase64';

const EventReg1 = ({
  formData,
  setFormData,
  imageData,
  setImageData,
  editMode,
  singleEventData,
}) => {
  console.log('formData', formData);
  console.log('singleEventData', singleEventData);
  console.log('imageData', imageData);

  const [imagePreview, setImagePreview] = useState(null);
  console.log('imagePreview', imagePreview);

  const {
    register,
    formState: { errors },
    control,
    setValue,
    clearErrors,
    setError,
    trigger,
  } = useFormContext();

  const [inputType, setInputType] = useState('date');

  const handleFocus = (field) => {
    if (field.onFocus) {
      setInputType(field.onFocus);
    }
  };

  const handleBlur = (field) => {
    if (field.onBlur) {
      setInputType(field.onBlur);
    }
  };

  const imageCreationFunc = async (file) => {
    const result = await trigger('cohort_banner');
    if (result) {
      try {
        const compressedFile = await CompressedImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(compressedFile);
        const byteArray = await compressedFile.arrayBuffer();
        setImageData(Array.from(new Uint8Array(byteArray)));
        console.log('Event Image Buffer Array', byteArray);
      } catch (error) {
        setError('cohort_banner', {
          type: 'manual',
          message: 'Could not process image, please try another.',
        });
      }
    } else {
      console.log('ERROR--imageCreationFunc-file', file);
    }
  };

  const clearImageFunc = (val) => {
    let field_id = val;
    setValue(field_id, null);
    clearErrors(field_id);
    setImageData(null);
    setImagePreview(null);
  };

  useEffect(() => {
    if (formData?.cohort_banner) {
      const imageFile = formData?.cohort_banner;
      // imageCreationFunc(imageFile);
    } else if (singleEventData?.cohort_banner && editMode === true) {
      setImagePreview(uint8ArrayToBase64(singleEventData?.cohort_banner)); // If in edit mode, set the banner image from singleEventData
      setImageData(singleEventData?.cohort_banner);
    }
  }, [formData, singleEventData, editMode]);

  return (
    <>
      <div>
        <h1 className='text-3xl text-[#121926] font-bold mb-3'>
          {editMode ? 'Update Cohort' : 'Create a New Cohort'}
        </h1>
      </div>
      <div className='mb-2'>
        <label className='block text-sm font-medium mb-1'>
          Upload a logo<span className='text-red-500'>*</span>
        </label>

        <div className='flex gap-2 items-center'>
          <div className='h-24 w-24 rounded-2xl border-2 border-dashed border-gray-300 items-center justify-center overflow-hidden flex'>
            {imagePreview && !errors.cohort_banner ? (
              <img
                src={imagePreview}
                alt='Profile'
                className='h-full w-full object-cover'
                loading='lazy'
                draggable={false}
              />
            ) : (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth='1.5'
                stroke='currentColor'
                className='size-11'
              >
                <path
                  fill='#BBBBBB'
                  stroke-linecap='round'
                  stroke-linejoin='round'
                  d='M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z'
                />
              </svg>
            )}
          </div>

          <Controller
            name='cohort_banner'
            control={control}
            render={({ field }) => (
              <>
                <input
                  type='file'
                  className='hidden'
                  id='cohort_banner'
                  name='cohort_banner'
                  onChange={(e) => {
                    field.onChange(e.target.files[0]);
                    imageCreationFunc(e.target.files[0]);
                  }}
                  accept='.jpg, .jpeg, .png'
                />
                <div className=' flex flex-col xxs:flex-row gap-2'>
                  <label
                    htmlFor='cohort_banner'
                    className=' p-1 sxs3:p-2 border-2 border-blue-800 items-center  rounded-md text-xs md:text-sm bg-transparent text-blue-800 cursor-pointer font-semibold'
                  >
                    {imagePreview && !errors.cohort_banner ? (
                      <>
                        <span className='xxs:hidden'>Change banner</span>
                        <span className='hidden xxs:inline'>
                          Change banner picture
                        </span>
                      </>
                    ) : (
                      <>
                        <span className='xxs:hidden'>Upload banner</span>
                        <span className='hidden xxs:inline'>
                          Upload banner picture
                        </span>
                      </>
                    )}
                  </label>
                  {imagePreview || errors.cohort_banner ? (
                    <button
                      className='p-1 sxs3:p-2 border-2 border-red-500  items-center rounded-md text-xs md:text-sm transparent text-red-500 cursor-pointer font-semibold '
                      onClick={() => clearImageFunc('cohort_banner')}
                    >
                      Clear
                    </button>
                  ) : (
                    ''
                  )}
                </div>
              </>
            )}
          />
        </div>

        {errors.cohort_banner && (
          <span className='mt-1 text-sm text-red-500 font-bold text-start '>
            {errors?.cohort_banner?.message}
          </span>
        )}
      </div>

      <div className='mb-2'>
        {formFields1?.map((field) => (
          <div key={field.id} className='relative z-0 group mb-2'>
            <label htmlFor={field.id} className='text-sm font-medium mb-1 flex'>
              {field.label}{' '}
              <span
                className={`${
                  field.label === 'Eligibility Cirteria' ? 'hidden' : 'flex'
                } text-red-500`}
              >
                *
              </span>
            </label>

            {field.type === 'textarea' ? (
              <textarea
                name={field.name}
                id={field.id}
                {...register(field.name)}
                className={`border border-[#CDD5DF] rounded-md shadow-sm 
                  ${
                    errors[field.name]
                      ? 'border-red-500 placeholder:text-red-500'
                      : 'border-[#737373]'
                  } text-gray-900 placeholder-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                placeholder={field.placeholder}
                onFocus={() => handleFocus(field)}
                onBlur={() => handleBlur(field)}
              ></textarea>
            ) : (
              <input
                type={field.id === 'date_of_birth' ? inputType : field.type}
                name={field.name}
                id={field.id}
                {...register(field.name)}
                className={`border border-[#CDD5DF] rounded-md shadow-sm 
                  ${
                    errors[field.name]
                      ? 'border-red-500 placeholder:text-red-500'
                      : 'border-[#737373]'
                  } text-gray-900 placeholder-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                placeholder={field.placeholder}
                onFocus={() => handleFocus(field)}
                onBlur={() => handleBlur(field)}
              />
            )}

            {errors[field.name] && (
              <span className='mt-1 text-sm text-red-500 font-bold flex justify-start'>
                {errors[field.name].message}
              </span>
            )}
          </div>
        ))}
      </div>

      <Toaster />
    </>
  );
};

export default EventReg1;

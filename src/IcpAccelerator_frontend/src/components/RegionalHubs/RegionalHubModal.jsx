import React, { useState } from 'react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import * as Yup from 'yup';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import CompressedImage from '../../components/ImageCompressed/CompressedImage';
import toast, { Toaster } from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { FaPlus, FaTrash } from 'react-icons/fa';
import getSocialLogo from '../Utils/navigationHelper/getSocialLogo';

// Validation schema using Yup
const validationSchema = Yup.object().shape({
  name: Yup.string().required('Project name is required'),
  flag: Yup.mixed().required('Banner image is required'),
  website: Yup.mixed().required('Website Link is required'),
  description: Yup.string()
    .required('Description is required')
    .max(300, 'Description cannot exceed 300 characters'),
});

const RegionalHubModal = ({ onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    clearErrors,
    setError,
    trigger,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'links',
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const actor = useSelector((currState) => currState.actors.actor);

  const imageCreationFunc = async (file) => {
    const result = await trigger('flag');
    if (result) {
      try {
        const compressedFile = await CompressedImage(file); // Compress the image file
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.onerror = (error) => {
          console.error('FileReader error: ', error);
          setError('flag', {
            type: 'manual',
            message: 'Failed to load the compressed logo.',
          });
        };
        reader.readAsDataURL(compressedFile);

        const byteArray = new Uint8Array(await compressedFile.arrayBuffer());
        setImageData(byteArray);
      } catch (error) {
        setError('flag', {
          type: 'manual',
          message: 'Could not process image, please try another.',
        });
      }
    } else {
      console.log('ERROR--imageCreationFunc-file', file);
    }
  };

  const clearImageFunc = () => {
    setValue('flag', null);
    clearErrors('flag');
    setImagePreview(null);
    setImageData(null);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    console.log('Form Data:', data); // Log form data

    // Check if the actor is defined
    if (!actor) {
      console.error('Actor is not defined');
      toast.error('Actor is not available.');
      setIsSubmitting(false);
      return;
    }

    try {
      const argument = {
        flag: imageData ? [imageData] : [],
        description: data.description ? [data.description] : [],
        name: data.name ? [data.name] : [],
        website: data.website ? [data.website] : [],
        links: data?.links
          ? [data.links.map((val) => ({ links: val?.link ? [val.link] : [] }))]
          : [],
      };

      console.log(
        'Submitting the following data to add_icp_hub_details:',
        argument
      );

      const result = await actor.add_icp_hub_details(argument);

      console.log('Hub creation result:', result);

      if (result) {
        toast.success('Hub added successfully!');
        onClose();
      } else {
        toast.error('Something went wrong.');
      }
    } catch (error) {
      console.error('Error adding Hub:', error);
      toast.error('An error occurred while adding the hub.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onErrorHandler = (errors) => {
    toast.error('Please check the form for errors.');
    console.log('Form errors:', errors);
  };
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='bg-white rounded-lg overflow-hidden shadow-lg w-[500px]'>
        <div className='flex justify-end mr-4 mt-1'>
          <button className='text-3xl text-[#121926]' onClick={onClose}>
            &times;
          </button>
        </div>
        <div className='p-6 pt-0'>
          <h1 className='text-3xl text-[#121926] font-bold mb-2'>Add a Hub</h1>

          <form onSubmit={handleSubmit(onSubmit, onErrorHandler)}>
            <div className='max-h-[70vh] overflow-y-auto'>
              {/* Image Upload */}
              <div className='mb-2'>
                <label className='block text-sm font-medium mb-1'>
                  Upload a logo<span className='text-red-500'>*</span>
                </label>
                <div className='flex gap-2 items-center'>
                  <div className='h-24 w-24 rounded-2xl border-2 border-dashed border-gray-300 items-center justify-center overflow-hidden flex'>
                    {imagePreview && !errors.flag ? (
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
                    name='flag'
                    control={control}
                    render={({ field }) => (
                      <>
                        <input
                          type='file'
                          className='hidden'
                          id='flag'
                          onChange={(e) => {
                            field.onChange(e.target.files[0]);
                            imageCreationFunc(e.target.files[0]);
                          }}
                          accept='.jpg, .jpeg, .png'
                        />
                        <label
                          htmlFor='flag'
                          className='p-2 border-2 border-blue-800 items-center sm:ml-6 rounded-md text-md bg-transparent text-blue-800 cursor-pointer font-semibold'
                        >
                          {imagePreview && !errors.flag
                            ? 'Change Hub Logo'
                            : 'Upload Hub Logo'}
                        </label>
                        {imagePreview || errors.flag ? (
                          <button
                            type='button'
                            className='p-2 border-2 border-red-500 ml-2 items-center rounded-md text-md bg-transparent text-red-500 cursor-pointer font-semibold capitalize'
                            onClick={clearImageFunc}
                          >
                            clear
                          </button>
                        ) : null}
                      </>
                    )}
                  />
                </div>

                {errors.flag && (
                  <span className='mt-1 text-sm text-red-500 font-bold text-start px-4'>
                    {errors?.flag?.message}
                  </span>
                )}
              </div>

              {/* Project Name Input */}
              <div className='mb-2'>
                <label className='block mb-1'>
                  Hub Name<span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  {...register('name')}
                  className={`border ${
                    errors.name ? 'border-red-500' : 'border-[#737373]'
                  } shadow-sm text-gray-900 placeholder-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                  placeholder='Enter your Project name'
                />
                {errors.name && (
                  <span className='mt-1 text-sm text-red-500 font-bold flex justify-start'>
                    {errors.name?.message}
                  </span>
                )}
              </div>
              {/* website link Input */}
              <div className='mb-2'>
                <label className='block mb-1'>
                  Website Link<span className='text-red-500'>*</span>
                </label>
                <input
                  {...register('website')}
                  className={`border ${
                    errors.website ? 'border-red-500' : 'border-[#737373]'
                  } shadow-sm text-gray-900 placeholder-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                  placeholder='Enter  website'
                  rows='4'
                />
                {errors.website && (
                  <span className='mt-1 text-sm text-red-500 font-bold flex justify-start'>
                    {errors.website?.message}
                  </span>
                )}
              </div>
              {/* Description Input */}
              <div className='mb-2'>
                <label className='block mb-1'>
                  Description<span className='text-red-500'>*</span>
                </label>
                <textarea
                  {...register('description')}
                  className={`border ${
                    errors.description ? 'border-red-500' : 'border-[#737373]'
                  } shadow-sm text-gray-900 placeholder-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                  placeholder='Enter a brief description'
                  rows='4'
                />
                {errors.description && (
                  <span className='mt-1 text-sm text-red-500 font-bold flex justify-start'>
                    {errors.description?.message}
                  </span>
                )}
              </div>

              {/* Social Media Links */}
              <div className='mb-2'>
                <label className='block text-sm font-medium mb-1'>
                  Social Links
                </label>
                <div className='relative'>
                  {fields.map((item, index) => (
                    <div
                      key={item.id}
                      className='flex items-center mb-4 border-b pb-2'
                    >
                      <Controller
                        name={`links[${index}].link`}
                        control={control}
                        // defaultValue={item.link || ""}
                        render={({ field, fieldState }) => (
                          <div className='flex items-center w-full'>
                            <div className='flex items-center space-x-2 w-full'>
                              <div className='flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full'>
                                {field.value && getSocialLogo(field.value)}
                              </div>
                              <input
                                type='text'
                                placeholder='Enter your social media URL'
                                className={`p-2 border ${
                                  fieldState.error
                                    ? 'border-red-500'
                                    : 'border-gray-300'
                                } rounded-md w-full`}
                                {...field}
                              />
                            </div>
                            {fieldState.error && (
                              <span className='ml-2 text-red-500 text-sm'>
                                {fieldState.error.message}
                              </span>
                            )}
                          </div>
                        )}
                      />
                      <button
                        type='button'
                        onClick={() => remove(index)}
                        className='ml-2 text-red-500 hover:text-red-700'
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                  <button
                    type='button'
                    onClick={() => append({ link: '' })}
                    className='flex items-center p-1 text-[#155EEF]'
                  >
                    <FaPlus className='mr-1' /> Add Another Link
                  </button>
                </div>
              </div>
            </div>
            {/* Submit Button */}
            <div className='mt-2'>
              <button
                type='submit'
                className='bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700'
              >
                Submit <ArrowForwardIcon fontSize='small' className='ml-2' />
              </button>
            </div>
          </form>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default RegionalHubModal;

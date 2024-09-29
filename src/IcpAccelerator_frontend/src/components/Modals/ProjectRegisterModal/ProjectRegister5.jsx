import React from 'react';
import { useFormContext, Controller, useFieldArray } from 'react-hook-form';
import { FaPlus, FaTrash } from 'react-icons/fa';
import getSocialLogo from '../../Utils/navigationHelper/getSocialLogo';

// PROJECT REGISTER COMPONENT (STEP 5)
const ProjectRegister5 = ({ isOpen, onClose, onBack }) => {
  // INITIALIZE FORM HOOKS AND METHODS
  const {
    register,
    formState: { errors },
    trigger,
    setValue,
    clearErrors,
    setError,
    control,
    watch,
  } = useFormContext();

  // INITIALIZE FIELD ARRAY HOOK FOR SOCIAL LINKS
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'social_link',
    defaultValues: [{ link: '' }], // Ensure at least one empty field at start
  });

  return (
    <>
      {/* PROMOTION VIDEO LINK INPUT */}
      <div className='max-h-[80vh] overflow-y-auto '>
        <div className='mb-2'>
          <label className='block mb-1'>Promotion video link</label>
          <input
            type='text'
            {...register('promotional_video')}
            className={`border border-[#CDD5DF] rounded-md shadow-sm
                                             ${
                                               errors?.promotional_video
                                                 ? 'border-red-500 '
                                                 : 'border-[#737373]'
                                             } text-gray-900 placeholder-gray-500  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
            placeholder='https://'
            defaultValue=''
          />
          {errors?.promotional_video && (
            <span className='mt-1 text-sm text-red-500 font-bold flex justify-start'>
              {errors?.promotional_video?.message}
            </span>
          )}
        </div>

        {/* TOKENOMICS INPUT */}
        <div className='mb-2'>
          <label className='block mb-1'>Tokenomics</label>
          <input
            type='text'
            {...register('token_economics')}
            className={`border border-[#CDD5DF] rounded-md shadow-sm 
                                             ${
                                               errors?.token_economics
                                                 ? 'border-red-500 '
                                                 : 'border-[#737373]'
                                             } text-gray-900 placeholder-gray-500  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
            placeholder='https://'
            defaultValue=''
          />
          {errors?.token_economics && (
            <span className='mt-1 text-sm text-red-500 font-bold flex justify-start'>
              {errors?.token_economics?.message}
            </span>
          )}
        </div>

        {/* SOCIAL LINKS INPUT WITH ADD/REMOVE FUNCTIONALITY */}
        <div className='mb-2'>
          <label className='block mb-1'>Links</label>
          <div className='relative'>
            {fields.map((item, index) => (
              <div key={item.id} className='flex flex-col '>
                <div className='flex items-center mb-2  pb-1'>
                  <Controller
                    name={`links[${index}].link`}
                    control={control}
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
                <div className='mb-4 border-b pb-2'>
                  {errors.links &&
                    errors.links[index] &&
                    errors.links[index].link && (
                      <span className='mt-1 text-sm text-red-500 font-bold'>
                        {errors.links[index].link.message}
                      </span>
                    )}
                </div>
              </div>
            ))}
            {/* ADD NEW LINK BUTTON */}
            <button
              type='button'
              onClick={() => append({ social_link: '' })}
              className='flex items-center p-1 text-[#155EEF]'
            >
              <FaPlus className='mr-1' /> Add Another Link
            </button>
          </div>
        </div>
      </div>{' '}
    </>
  );
};

export default ProjectRegister5;

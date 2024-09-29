import React, { useEffect, useState } from 'react';
import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import ReactSelect from 'react-select';
import { Toaster } from 'react-hot-toast';
import { FaPlus, FaTrash } from 'react-icons/fa';
import getSocialLogo from '../../Utils/navigationHelper/getSocialLogo';
import getReactSelectStyles from '../../Utils/navigationHelper/getReactSelectStyles';

const MentorSignup2 = ({ formData }) => {
  // EXTRACT NECESSARY FUNCTIONS FROM useFormContext HOOK
  const {
    register,
    formState: { errors },
    watch,
    control,
    setValue,
    clearErrors,
    setError,
  } = useFormContext({ mode: 'all' });
  //Reason to join
  const [reasonOfJoiningOptions, setReasonOfJoiningOptions] = useState([
    { value: 'listing_and_promotion', label: 'Project listing and promotion' },
    { value: 'Funding', label: 'Funding' },
    { value: 'Mentoring', label: 'Mentoring' },
    { value: 'Incubation', label: 'Incubation' },
    {
      value: 'Engaging_and_building_community',
      label: 'Engaging and building community',
    },
    { value: 'Jobs', label: 'Jobs' },
  ]);
  const [isFormTouched, setIsFormTouched] = useState({
    years_of_mentoring: false,
  });

  const handleFieldTouch = (fieldName) => {
    setIsFormTouched((prevState) => ({
      ...prevState,
      [fieldName]: true,
    }));
  };
  // RETRIEVE ALL ICP HUBS FROM REDUX STATE
  const getAllIcpHubs = useSelector((currState) => currState.hubs.allHubs);

  // USE useFieldArray HOOK FOR DYNAMICALLY ADDING/REMOVING LINKS
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'links',
  });

  // FUNCTION TO DETERMINE AND RETURN THE APPROPRIATE LOGO BASED ON THE URL

  useEffect(() => {
    if (formData) {
      setProjectValuesHandler(formData);
    }
  }, [formData]);

  const [reasonOfJoiningSelectedOptions, setReasonOfJoiningSelectedOptions] =
    useState([]);
  // SELECTOR TO ACCESS AREA OF EXPERTISE DATA FROM REDUX STORE
  const areaOfExpertise = useSelector(
    (currState) => currState.expertiseIn.expertise
  );
  // USE EFFECT TO SET INVESTMENT CATEGORIES OPTIONS BASED ON AREA OF EXPERTISE DATA
  useEffect(() => {
    if (areaOfExpertise) {
      setprojectOptions(
        areaOfExpertise.map((expert) => ({
          value: expert.name,
          label: expert.name,
        }))
      );
    } else {
      setprojectOptions([]);
    }
  }, [areaOfExpertise]);

  // STATES FOR VARIOUS FORM FIELDS
  const [projectOptions, setprojectOptions] = useState([]);
  const [
    areaof_focus_SelectedOptions,
    setproject_area_of_focusSelectedOptions,
  ] = useState([]);

  const setproject_area_of_focusSelectedOptionsHandler = (val) => {
    setproject_area_of_focusSelectedOptions(
      val
        ? val
            .split(', ')
            .map((investment) => ({ value: investment, label: investment }))
        : []
    );
  };
  // FUNCTION TO SET INITIAL FORM VALUES BASED ON PROVIDED FORM DATA
  const setProjectValuesHandler = (val) => {
    console.log('val', val);
    if (val) {
      setValue(
        'area_of_expertise',
        val.area_of_expertise ? val?.area_of_expertise : ''
      );
      setproject_area_of_focusSelectedOptionsHandler(
        val?.area_of_expertise ?? null
      );
    }
  };
  return (
    <>
      <div className='max-h-[80vh] overflow-y-auto '>
        <div className='mb-2'>
          <label className='block mb-1'>
            Why do you want to join this platform ?{' '}
            <span className='text-[red] ml-1'>*</span>
          </label>
          <ReactSelect
            isMulti
            menuPortalTarget={document.body}
            menuPosition={'fixed'}
            styles={getReactSelectStyles(errors.reasons_to_join_platform)}
            value={reasonOfJoiningSelectedOptions}
            options={reasonOfJoiningOptions}
            classNamePrefix='select'
            className='basic-multi-select w-full text-start'
            placeholder='Select your reasons to join this platform'
            name='reasons_to_join_platform'
            onChange={(selectedOptions) => {
              if (selectedOptions && selectedOptions.length > 0) {
                setReasonOfJoiningSelectedOptions(selectedOptions);
                clearErrors('reasons_to_join_platform');
                setValue(
                  'reasons_to_join_platform',
                  selectedOptions.map((option) => option.value).join(', '),
                  { shouldValidate: true }
                );
              } else {
                setReasonOfJoiningSelectedOptions([]);
                setValue('reasons_to_join_platform', '', {
                  shouldValidate: true,
                });
                setError('reasons_to_join_platform', {
                  type: 'required',
                  message: 'Selecting a reason is required',
                });
              }
            }}
          />
          {errors.reasons_to_join_platform && (
            <span className='mt-1 text-sm text-red-500 font-bold flex justify-start'>
              {errors.reasons_to_join_platform.message}
            </span>
          )}
        </div>
        <div className='mb-2'>
          <label className='block mb-1'>
            Area of focus <span className='text-[red] ml-1'>*</span>
          </label>
          <Select
            isMulti
            menuPortalTarget={document.body}
            menuPosition={'fixed'}
            styles={getReactSelectStyles(errors.area_of_expertise)}
            value={areaof_focus_SelectedOptions}
            options={projectOptions}
            classNamePrefix='select'
            className='basic-multi-select w-full text-start'
            placeholder='Select categories of investment'
            name='area_of_expertise'
            onChange={(selectedOptions) => {
              if (selectedOptions && selectedOptions.length > 0) {
                setproject_area_of_focusSelectedOptions(selectedOptions);
                clearErrors('area_of_expertise');
                setValue(
                  'area_of_expertise',
                  selectedOptions.map((option) => option.value).join(', '),
                  { shouldValidate: true }
                );
              } else {
                setproject_area_of_focusSelectedOptions([]);
                setValue('area_of_expertise', '', {
                  shouldValidate: true,
                });
                setError('area_of_expertise', {
                  type: 'required',
                  message: 'Selecting a category is required',
                });
              }
            }}
          />
          {/* ERROR MESSAGE FOR INVESTMENT CATEGORIES */}
          {errors.area_of_expertise && (
            <span className='mt-1 text-sm text-red-500 font-bold flex justify-start'>
              {errors.area_of_expertise.message}
            </span>
          )}
        </div>
        {/* ICP HUB/SPOKE SELECTION FIELD */}
        <div className='mb-2'>
          <label className='block mb-1'>
            Are you ICP Hub/Spoke <span className='text-red-500'>*</span>
          </label>
          <select
            {...register('icp_hub_or_spoke')}
            className={`bg-gray-50 border rounded-md shadow-sm ${
              errors.icp_hub_or_spoke ? 'border-red-500' : 'border-[#CDD5DF]'
            } text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
          >
            <option className='text-lg font-bold' value='false'>
              No
            </option>
            <option className='text-lg font-bold' value='true'>
              Yes
            </option>
          </select>
          {errors.icp_hub_or_spoke && (
            <p className='mt-1 text-sm text-red-500 font-bold'>
              {errors.icp_hub_or_spoke.message}
            </p>
          )}
        </div>

        {/* CONDITIONAL HUB OWNER SELECTION FIELD */}
        {watch('icp_hub_or_spoke') === 'true' && (
          <div className='relative z-0 group mb-2'>
            <label className='block mb-1'>
              Hub Owner <span className='text-red-500'>*</span>
            </label>
            <select
              {...register('hub_owner')}
              className={`bg-gray-50 border rounded-md shadow-sm ${errors.hub_owner ? 'border-red-500' : 'border-[#CDD5DF]'} text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
            >
              <option className='text-lg font-bold' value=''>
                Select your ICP Hub
              </option>
              {getAllIcpHubs?.map((hub) => (
                <option
                  key={hub.id}
                  value={`${hub.name} ,${hub.region}`}
                  className='text-lg font-bold'
                >
                  {hub.name}, {hub.region}
                </option>
              ))}
            </select>
            {errors.hub_owner && (
              <p className='mt-1 text-sm text-red-500 font-bold'>
                {errors.hub_owner.message}
              </p>
            )}
          </div>
        )}

        {/* WEBSITE LINK INPUT FIELD */}
        <div className='mb-2'>
          <label className='block mb-1'>Website link</label>
          <input
            type='text'
            {...register('mentor_website_url')}
            className={`bg-gray-50 border rounded-md shadow-sm ${errors.mentor_website_url ? 'border-red-500' : 'border-[#CDD5DF]'} text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
            placeholder='Enter your website URL'
          />
          {errors.mentor_website_url && (
            <span className='mt-1 text-sm text-red-500 font-bold'>
              {errors.mentor_website_url.message}
            </span>
          )}
        </div>

        {/* YEARS OF MENTORING INPUT FIELD */}
        <div className='mb-2'>
          <label className='block mb-1'>
            Years of mentoring <span className='text-red-500'>*</span>
          </label>
          <input
            type='number'
            {...register('years_of_mentoring', { valueAsNumber: true })}
            className={`bg-gray-50 border-2 rounded-md shadow-sm ${errors.years_of_mentoring ? 'border-red-500' : 'border-[#CDD5DF]'} text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
            placeholder='Enter your mentoring experience years'
            min={0}
            onChange={(e) => {
              register('years_of_mentoring').onChange(e);
              handleFieldTouch('years_of_mentoring');
            }}
          />
          {errors.years_of_mentoring && (
            <span className='mt-1 text-sm text-red-500 font-bold'>
              {errors.years_of_mentoring.message}
            </span>
          )}
        </div>

        {/* DYNAMIC LINKS INPUT FIELD */}
        <div className='mb-2'>
          <label className='block mb-1'>Links</label>
          <div className='relative'>
            {fields.map((item, index) => (
              <div key={item.id} className='flex flex-col'>
                <div className='flex items-center mb-2 pb-1'>
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
            {fields.length < 10 && (
              <button
                type='button'
                onClick={() => append({ links: '' })}
                className='flex items-center p-1 text-[#155EEF]'
              >
                <FaPlus className='mr-1' /> Add Another Link
              </button>
            )}
          </div>
        </div>

        {/* TOASTER FOR NOTIFICATIONS */}
        <Toaster />
      </div>
    </>
  );
};

export default MentorSignup2;

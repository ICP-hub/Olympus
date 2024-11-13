import React, { useState, useEffect } from 'react';
import ReactSelect from 'react-select';
import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { FaPlus, FaTrash } from 'react-icons/fa';
import getSocialLogo from '../../Utils/navigationHelper/getSocialLogo';
import getReactSelectStyles from '../../Utils/navigationHelper/getReactSelectStyles';
const EventReg3 = ({ formData, singleEventData }) => {
  console.log('formData', formData);

  const {
    register,
    formState: { errors },
    setValue,
    clearErrors,
    setError,
    control,
  } = useFormContext();
  const areaOfExpertise = useSelector(
    (currState) => currState.expertiseIn.expertise
  );
  // USE useFieldArray HOOK FOR DYNAMICALLY ADDING/REMOVING LINKS
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'contact_links',
  });

  const [rubricEligibilityOptions, setRubricEligibilityOptions] = useState([
    {
      value: '1',
      label: '1',
    },
    {
      value: '2',
      label: '2',
    },
    {
      value: '3',
      label: '3',
    },
    {
      value: '4',
      label: '4',
    },
    {
      value: '5',
      label: '5',
    },
    {
      value: '6',
      label: '6',
    },
    {
      value: '7',
      label: '7',
    },
    {
      value: '8',
      label: '8',
    },
    {
      value: '9',
      label: '9',
    },
  ]);
  const [
    rubricEligibilitySelectedOptions,
    setRubricEligibilitySelectedOptions,
  ] = useState([]);

  const [interestedFundingTypeOptions, setInterestedFundingTypeOptions] =
    useState([
      {
        value: 'Grants',
        label: 'Grants',
      },
      { value: 'Investments', label: 'Investments' },
    ]);
  const [
    interestedFundingTypeSelectedOptions,
    setInterestedFundingTypeSelectedOptions,
  ] = useState([]);

  useEffect(() => {
    if (areaOfExpertise) {
      setInterestedDomainsOptions(
        areaOfExpertise.map((expert) => ({
          value: expert.name,
          label: expert.name,
        }))
      );
    } else {
      setInterestedDomainsOptions([]);
    }
  }, [areaOfExpertise]);

  const [interestedDomainsOptions, setInterestedDomainsOptions] = useState([]);
  const [
    interestedDomainsSelectedOptions,
    setInterestedDomainsSelectedOptions,
  ] = useState([]);

  // FUNCTION TO SET INITIAL FORM VALUES BASED ON PROVIDED formData
  const setCohortValuesHandler = (val) => {
    console.log('val', val);
    if (val) {
      setValue(
        'level_on_rubric',
        val?.level_on_rubric ? val?.level_on_rubric : ''
      );
      setValue('tags', val?.tags ? val?.tags : '');
      setValue('funding_type', val?.funding_type ? val?.funding_type : '');

      // Map contact_links for both structures
      setValue(
        'contact_links',
        val?.contact_links
          ? val.contact_links.map((item) => {
              // Check if item is an array (first structure)
              if (Array.isArray(item)) {
                return { link: item[0]?.link ? item[0].link : '' };
              }
              // Handle if item is an object with link array (second structure)
              else if (item?.link && Array.isArray(item.link)) {
                return { link: item.link[0] ? item.link[0] : '' };
              }
              return { link: '' }; // Default if none of the conditions are met
            })
          : []
      );

      setInterestedDomainSelectedOptionsHandler(val.tags ?? null);
      setInterestedFundingTypeSelectedOptionsHandler(val.funding_type ?? null);
      setRubricEligibilitySelectedOptionsHandler(val.level_on_rubric ?? null);
    }
  };

  useEffect(() => {
    if (formData) {
      setCohortValuesHandler(formData);
    } else if (singleEventData) {
      setCohortValuesHandler(singleEventData); // Also set initial values from singleEventData if provided
    }
  }, [formData, singleEventData]);
  const setInterestedDomainSelectedOptionsHandler = (val) => {
    setInterestedDomainsSelectedOptions(
      val
        ? val.split(', ').map((chain) => ({ value: chain, label: chain }))
        : []
    );
  };
  const setInterestedFundingTypeSelectedOptionsHandler = (val) => {
    setInterestedFundingTypeSelectedOptions(
      val
        ? val.split(', ').map((chain) => ({ value: chain, label: chain }))
        : []
    );
  };
  const setRubricEligibilitySelectedOptionsHandler = (val) => {
    setRubricEligibilitySelectedOptions(
      val
        ? val.split(', ').map((chain) => ({ value: chain, label: chain }))
        : []
    );
  };

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
  return (
    <>
      <div className='max-h-[70vh] overflow-y-auto'>
        <div className='mb-2'>
          <label
            htmlFor='rubric_eligibility'
            className='block text-sm font-medium mb-1'
          >
            Level on rubric required for eligibility
          </label>
          <ReactSelect
            isMulti
            menuPortalTarget={document.body}
            menuPosition={'fixed'}
            styles={getReactSelectStyles(errors?.rubric_eligibility)}
            value={rubricEligibilitySelectedOptions}
            options={rubricEligibilityOptions}
            classNamePrefix='select'
            className='basic-multi-select w-full text-start'
            placeholder='Select a Rubric Level'
            name='eligibility'
            onChange={(selectedOptions) => {
              if (selectedOptions && selectedOptions.length > 0) {
                setRubricEligibilitySelectedOptions(selectedOptions);
                setValue(
                  'eligibility',
                  selectedOptions.map((option) => option.value).join(', '),
                  { shouldValidate: true }
                );
              } else {
                setRubricEligibilitySelectedOptions([]);
              }
            }}
          />
          {errors.rubric_eligibility && (
            <span className='mt-1 text-sm text-red-500 font-bold flex justify-start'>
              {errors.rubric_eligibility.message}
            </span>
          )}
        </div>
        <div className='mb-2'>
          <label htmlFor='tags' className='block text-sm font-medium mb-1'>
            Tags <span className='text-red-500'>*</span>
          </label>
          <ReactSelect
            isMulti
            menuPortalTarget={document.body}
            menuPosition={'fixed'}
            styles={getReactSelectStyles(errors?.tags)}
            value={interestedDomainsSelectedOptions}
            options={interestedDomainsOptions}
            classNamePrefix='select'
            className='basic-multi-select w-full text-start'
            placeholder='Select a Tag'
            name='tags'
            onChange={(selectedOptions) => {
              if (selectedOptions && selectedOptions.length > 0) {
                setInterestedDomainsSelectedOptions(selectedOptions);
                clearErrors('tags');
                setValue(
                  'tags',
                  selectedOptions.map((option) => option.value).join(', '),
                  { shouldValidate: true }
                );
              } else {
                setInterestedDomainsSelectedOptions([]);
                setValue('tags', '', { shouldValidate: true });
                setError('tags', {
                  type: 'required',
                  message: 'Selecting a tag is required',
                });
              }
            }}
          />
          {errors.tags && (
            <span className='mt-1 text-sm text-red-500 font-bold flex justify-start'>
              {errors.tags.message}
            </span>
          )}
        </div>
        <div className='mb-2'>
          <label
            htmlFor='funding_type'
            className='block text-sm font-medium mb-1'
          >
            Funding type <span className='text-red-500'>*</span>
          </label>
          <ReactSelect
            isMulti
            menuPortalTarget={document.body}
            menuPosition={'fixed'}
            styles={getReactSelectStyles(errors?.funding_type)}
            value={interestedFundingTypeSelectedOptions}
            options={interestedFundingTypeOptions}
            classNamePrefix='select'
            className='basic-multi-select w-full text-start'
            placeholder='Select funding type'
            name='funding_type'
            onChange={(selectedOptions) => {
              if (selectedOptions && selectedOptions.length > 0) {
                setInterestedFundingTypeSelectedOptions(selectedOptions);
                clearErrors('funding_type');
                setValue(
                  'funding_type',
                  selectedOptions.map((option) => option.value).join(', '),
                  { shouldValidate: true }
                );
              } else {
                setInterestedFundingTypeSelectedOptions([]);
                setValue('funding_type', '', { shouldValidate: true });
                setError('funding_type', {
                  type: 'required',
                  message: 'Selecting a type is required',
                });
              }
            }}
          />
          {errors.funding_type && (
            <span className='mt-1 text-sm text-red-500 font-bold flex justify-start'>
              {errors.funding_type.message}
            </span>
          )}
        </div>
        <div className='mb-2'>
          <label
            htmlFor='funding_amount'
            className='block text-sm font-medium mb-1'
          >
            Select funding amount <span className='text-red-500'>*</span>
          </label>
          <select
            name='funding_amount'
            id='funding_amount'
            {...register('funding_amount', {
              required: 'Funding Amount is required',
            })}
            className={`bg-gray-50 border ${
              errors.funding_amount
                ? 'border-red-500 border-2'
                : 'border-[#737373]'
            } text-gray-900 placeholder-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
            onFocus={() => handleFocus('funding_amount')}
            onBlur={() => handleBlur('funding_amount')}
          >
            <option className='text-lg font-bold' value=''>
              Select Amount of Funding
            </option>
            <option value='1k-5k' className='text-lg font-normal'>
              1k-5k
            </option>
            <option value='5k-25k' className='text-lg font-normal'>
              5k-25k
            </option>
            <option value='25k- 100k' className='text-lg font-normal'>
              25k-100k
            </option>
            <option value='100k+' className='text-lg font-normal'>
              100k+
            </option>
          </select>
        </div>
        <div className='mb-2'>
          <label className='block text-sm font-medium mb-1'>Links</label>
          <div className='relative'>
            {fields.map((item, index) => (
              <div
                key={item.id}
                className='flex items-center mb-4 border-b pb-2'
              >
                <Controller
                  name={`contact_links[${index}].link`}
                  control={control}
                  render={({ field, fieldState }) => (
                    <div className='flex items-center w-full'>
                      <div className='flex items-center space-x-2 w-full'>
                        <div className='flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full'>
                          {field.value && getSocialLogo(field.value)}
                        </div>
                        <input
                          {...register('contact_links')}
                          type='text'
                          placeholder='Enter your social media URL'
                          className={`p-2 border ${fieldState.error ? 'border-red-500' : 'border-gray-300'} rounded-md w-full`}
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
      </div>
    </>
  );
};

export default EventReg3;

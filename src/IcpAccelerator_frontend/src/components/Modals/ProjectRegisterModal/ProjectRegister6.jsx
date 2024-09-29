import React, { useEffect, useMemo, useState } from 'react';
import ReactQuill from 'react-quill'; // Import ReactQuill for rich text editing
import { useFormContext, Controller } from 'react-hook-form'; // Import necessary hooks from react-hook-form
import 'react-quill/dist/quill.snow.css'; // Import the Quill stylesheet
import { useSelector } from 'react-redux';
import Select from 'react-select';
import ReactSelect from 'react-select';
import getReactSelectStyles from '../../Utils/navigationHelper/getReactSelectStyles';
// Component for Project Registration Form Step 6
const ProjectRegister6 = ({ formData }) => {
  // Destructure form state and control from useFormContext hook
  const {
    formState: { errors }, // Extract form errors
    control,
    setValue,
    setError,
    clearErrors, // Extract control for managing form state
  } = useFormContext();

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
  // Define the toolbar and formats for the ReactQuill editor
  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: '1' }, { header: '2' }, { font: [] }], // Heading and font options
        [{ list: 'ordered' }, { list: 'bullet' }], // List options
        ['bold', 'italic', 'underline'], // Text formatting options
        [{ align: [] }], // Text alignment options
        ['link'], // Link option
        ['clean'], // Clear formatting option
        // Clear formatting option
      ],
    }),
    []
  );

  // Define the formats that the editor will support
  // Define the formats that the editor will support
  const formats = [
    'header',
    'font',
    'list',
    'bullet',
    'bold',
    'italic',
    'underline',
    'align',
    'link',
  ];

  // USE EFFECT TO SET INITIAL FORM VALUES BASED ON PROVIDED FORM DATA
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
        'project_area_of_focus',
        val.project_area_of_focus ? val?.project_area_of_focus : ''
      );
      setproject_area_of_focusSelectedOptionsHandler(
        val?.project_area_of_focus ?? null
      );
    }
  };
  return (
    <>
      <div className='mb-2'>
        <label className='block mb-1'>
          Why do you want to join this platform ?{' '}
          <span className='text-[red] ml-1'>*</span>
        </label>
        <ReactSelect
          isMulti
          menuPortalTarget={document.body}
          menuPosition={'fixed'}
          styles={getReactSelectStyles(errors?.reason_to_join_incubator)}
          value={reasonOfJoiningSelectedOptions}
          options={reasonOfJoiningOptions}
          classNamePrefix='select'
          className='basic-multi-select w-full text-start'
          placeholder='Select your reasons to join this platform'
          name='reason_to_join_incubator'
          onChange={(selectedOptions) => {
            if (selectedOptions && selectedOptions.length > 0) {
              setReasonOfJoiningSelectedOptions(selectedOptions);
              setValue(
                'reason_to_join_incubator',
                selectedOptions.map((option) => option.value).join(', '),
                { shouldValidate: true }
              );
            } else {
              setReasonOfJoiningSelectedOptions([]);
            }
          }}
        />
        {errors.reason_to_join_incubator && (
          <span className='mt-1 text-sm text-red-500 font-bold flex justify-start'>
            {errors.reason_to_join_incubator.message}
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
          styles={getReactSelectStyles(errors?.project_area_of_focus)}
          value={areaof_focus_SelectedOptions}
          options={projectOptions}
          classNamePrefix='select'
          className='basic-multi-select w-full text-start'
          placeholder='Select categories of investment'
          name='project_area_of_focus'
          onChange={(selectedOptions) => {
            if (selectedOptions && selectedOptions.length > 0) {
              setproject_area_of_focusSelectedOptions(selectedOptions);
              setValue(
                'project_area_of_focus',
                selectedOptions.map((option) => option.value).join(', '),
                { shouldValidate: true }
              );
            } else {
              setproject_area_of_focusSelectedOptions([]);
            }
          }}
        />
        {/* ERROR MESSAGE FOR INVESTMENT CATEGORIES */}
        {errors.project_area_of_focus && (
          <span className='mt-1 text-sm text-red-500 font-bold flex justify-start'>
            {errors.project_area_of_focus.message}
          </span>
        )}
      </div>
      <div className='mb-24'>
        <label className='block mb-1'>
          Project Description (50 words){' '}
          <span className='text-[red] ml-1'>*</span>
        </label>

        <Controller
          name='project_description' // Name of the form field
          control={control}
          defaultValue=''
          render={({ field: { onChange, value } }) => (
            <ReactQuill
              value={value}
              onChange={onChange}
              modules={modules}
              formats={formats}
              placeholder='Enter your Project description here...'
              style={{ height: '120px' }}
            />
          )}
        />

        {/* Display an error message if the project description field has an error */}
        {errors?.project_description && (
          <span className='mt-[4.25rem] text-sm text-red-500 font-bold flex justify-start'>
            {errors?.project_description?.message}
          </span>
        )}
      </div>
    </>
  );
};

export default ProjectRegister6; // Export the component as default

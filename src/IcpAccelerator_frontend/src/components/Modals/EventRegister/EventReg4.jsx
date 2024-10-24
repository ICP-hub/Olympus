import React, { useMemo } from 'react'; // IMPORT REACT AND MEMO HOOK
import ReactQuill from 'react-quill'; // IMPORT REACT QUILL FOR RICH TEXT EDITING
import { useFormContext, Controller } from 'react-hook-form'; // IMPORT REACT HOOK FORM FOR FORM MANAGEMENT
import 'react-quill/dist/quill.snow.css'; // IMPORT QUILL STYLESHEET

// COMPONENT FOR PROJECT REGISTRATION FORM STEP 6
const EventReg4 = ({}) => {
  // DESTRUCTURE FORM STATE AND CONTROL FROM USEFORMCONTEXT HOOK
  const {
    formState: { errors },
    control,
  } = useFormContext();

  // CUSTOM EDITOR OPTIONS
  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: '1' }, { header: '2' }, { font: [] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['bold', 'italic', 'underline'],
        [{ align: [] }],
        ['link'],
        ['clean'],
      ],
    }),
    []
  );

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

  return (
    <>
      <div className='max-h-[70vh] overflow-y-auto'>
        <div className='mb-2'>
          {/* LABEL FOR PROJECT DESCRIPTION */}
          <label className='block text-sm font-medium mb-1'>Description</label>

          {/* CONTROLLER TO INTEGRATE REACT QUILL WITH REACT HOOK FORM */}
          <Controller
            name='description' // FORM FIELD NAME
            control={control} // CONTROL PROP PASSED FROM REACT HOOK FORM
            defaultValue='' // DEFAULT VALUE FOR THE FIELD
            render={({ field: { onChange, value } }) => (
              <ReactQuill
                value={value} // CURRENT VALUE FOR THE EDITOR
                onChange={onChange} // UPDATE FIELD VALUE ON CHANGE EVENT
                modules={modules} // EDITOR MODULES CONFIGURATION
                formats={formats} // EDITOR FORMATS CONFIGURATION
                placeholder='Enter your description here...' // PLACEHOLDER TEXT
              />
            )}
          />
          {/* ERROR MESSAGE FOR PROJECT DESCRIPTION FIELD */}
          {errors?.description && (
            <span className='mt-1 text-sm text-red-500 font-bold flex justify-start'>
              {errors?.description?.message}
            </span>
          )}
        </div>
      </div>
    </>
  );
};

export default EventReg4; // EXPORT COMPONENT AS DEFAULT

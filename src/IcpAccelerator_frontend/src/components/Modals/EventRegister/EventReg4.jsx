import React, { useState,  useRef, useMemo } from "react";
import JoditEditor from 'jodit-react';
import { useFormContext } from "react-hook-form";
const EventReg4 = () => {
    const {  formState: { errors },  setValue, } = useFormContext();
    const editor = useRef(null);
    const [projectDescription, setProjectDescription] = useState("");


    ////Custome Editor//////////
  const options = [ 'bold', 'italic', '|', 'ul', 'ol', '|', 'font', 'fontsize', '|', 'outdent', 'indent', 'align', '|', 'hr', '|', 'fullsize',  'link', ];

  const config = useMemo(
    () => ({
    readonly: false,
    placeholder: '',
    defaultActionOnPaste: 'insert_as_html',
    defaultLineHeight: 1.5,
    enter: 'div',
   // options that we defined in above step.
    buttons: options,
    buttonsMD: options,
    buttonsSM: options,
    buttonsXS: options,
    statusbar: false,
    sizeLG: 900,
    sizeMD: 700,
    sizeSM: 400,
    toolbarAdaptive: false,
    }),
    [],
   );
    return (
        <>
                 <div className="mb-2">
                <label className="block text-sm font-medium mb-1">
                Description
                </label>

              
                <JoditEditor
                 value={projectDescription}
                  config={config}
                  ref={editor}
                  tabIndex={1}
                  onBlur={(newContent) => {
                    setProjectDescription(newContent);
                    setValue("description", newContent);
                }} 
                onChange={(newContent) => {}}
                requred
                />
                {errors?.project_description && (
                    <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                        {errors?.project_description?.message}
                    </span>
                )}
            </div>
        </>
    );
};

export default EventReg4;

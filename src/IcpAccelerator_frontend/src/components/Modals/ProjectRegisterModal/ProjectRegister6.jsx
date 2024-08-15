import React, { useState,  useRef, useMemo } from "react";
import JoditEditor from 'jodit-react';
import { useFormContext, Controller } from "react-hook-form";
const ProjectRegister6 = ({ isOpen, onClose, onBack }) => {
    const {
        formState: { errors },
        setValue,
    } = useFormContext();
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
                    Project Description (50 words)
                </label>

              
                <JoditEditor
                 value={projectDescription}
                  config={config}
                  ref={editor}
                  tabIndex={1}
                  onBlur={(newContent) => {
                    setProjectDescription(newContent);
                    setValue("project_description", newContent);
                }} 
                onChange={(newContent) => {}}
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

export default ProjectRegister6;

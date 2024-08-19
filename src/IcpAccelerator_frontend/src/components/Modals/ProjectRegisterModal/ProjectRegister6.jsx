import React, { useState, useRef, useMemo } from "react"; // IMPORT REACT, HOOKS, AND LIBRARIES
import JoditEditor from "jodit-react"; // IMPORT JODIT EDITOR FOR RICH TEXT EDITING
import { useFormContext, Controller } from "react-hook-form"; // IMPORT REACT HOOK FORM FOR FORM MANAGEMENT

// COMPONENT FOR PROJECT REGISTRATION FORM STEP 6
const ProjectRegister6 = ({ isOpen, onClose, onBack }) => {
  // DESTRUCTURE FORM STATE AND CONTROL FROM USEFORMCONTEXT HOOK
  const {
    formState: { errors },
    control,
  } = useFormContext();

  const editor = useRef(null); // CREATE A REFERENCE FOR THE JODIT EDITOR

  //// CUSTOM EDITOR OPTIONS //////
  const options = [
    "bold",          // BOLD TEXT OPTION
    "italic",        // ITALIC TEXT OPTION
    "|",             // SEPARATOR
    "ul",            // UNORDERED LIST OPTION
    "ol",            // ORDERED LIST OPTION
    "|",             // SEPARATOR
    "font",          // FONT SELECTION OPTION
    "fontsize",      // FONT SIZE SELECTION OPTION
    "|",             // SEPARATOR
    "outdent",       // OUTDENT OPTION
    "indent",        // INDENT OPTION
    "align",         // TEXT ALIGNMENT OPTION
    "|",             // SEPARATOR
    "hr",            // HORIZONTAL LINE OPTION
    "|",             // SEPARATOR
    "fullsize",      // FULLSIZE VIEW OPTION
    "link",          // INSERT LINK OPTION
  ];

  // CONFIGURE JODIT EDITOR WITH SPECIFIC OPTIONS AND SETTINGS
  const config = useMemo(
    () => ({
      readonly: false,                   // MAKE EDITOR EDITABLE
      placeholder: "",                   // SET PLACEHOLDER TEXT
      defaultActionOnPaste: "insert_as_html", // SET DEFAULT PASTE ACTION
      defaultLineHeight: 1.5,            // SET DEFAULT LINE HEIGHT
      enter: "div",                      // SET ENTER KEY TO CREATE DIV ELEMENTS
      buttons: options,                  // SET TOOLBAR BUTTONS FOR LARGE SCREEN
      buttonsMD: options,                // SET TOOLBAR BUTTONS FOR MEDIUM SCREEN
      buttonsSM: options,                // SET TOOLBAR BUTTONS FOR SMALL SCREEN
      buttonsXS: options,                // SET TOOLBAR BUTTONS FOR EXTRA SMALL SCREEN
      statusbar: false,                  // DISABLE STATUS BAR
      sizeLG: 900,                       // SET EDITOR SIZE FOR LARGE SCREEN
      sizeMD: 700,                       // SET EDITOR SIZE FOR MEDIUM SCREEN
      sizeSM: 400,                       // SET EDITOR SIZE FOR SMALL SCREEN
      toolbarAdaptive: false,            // DISABLE TOOLBAR ADAPTIVENESS
    }),
    []
  );

  return (
    <>
      <div className="mb-2">
        {/* LABEL FOR PROJECT DESCRIPTION */}
        <label className="block text-sm font-medium mb-1">
          Project Description (50 words)
        </label>

        {/* CONTROLLER TO INTEGRATE JODIT EDITOR WITH REACT HOOK FORM */}
        <Controller
          name="project_description" // FORM FIELD NAME
          control={control}           // CONTROL PROP PASSED FROM REACT HOOK FORM
          defaultValue=""             // DEFAULT VALUE FOR THE FIELD
          render={({ field: { onChange, value } }) => (
            <JoditEditor
              ref={editor}            // REFERENCE FOR JODIT EDITOR
              value={value}           // CURRENT VALUE FOR THE EDITOR
              config={config}         // EDITOR CONFIGURATION
              tabIndex={1}            // TAB INDEX FOR FOCUS MANAGEMENT
              onBlur={(newContent) => {
                onChange(newContent); // UPDATE FIELD VALUE ON BLUR EVENT
              }}
              onChange={() => { }}     // NO OPERATION ON CHANGE EVENT
            />
          )}
        />
        {/* ERROR MESSAGE FOR PROJECT DESCRIPTION FIELD */}
        {errors?.project_description && (
          <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
            {errors?.project_description?.message}
          </span>
        )}
      </div>
    </>
  );
};

export default ProjectRegister6; // EXPORT COMPONENT AS DEFAULT


import React, { useMemo } from "react";
import ReactQuill from "react-quill"; // Import ReactQuill for rich text editing
import { useFormContext, Controller } from "react-hook-form"; // Import necessary hooks from react-hook-form
import "react-quill/dist/quill.snow.css"; // Import the Quill stylesheet

// Component for Project Registration Form Step 6
const ProjectRegister6 = () => {
  // Destructure form state and control from useFormContext hook
  const {
    formState: { errors }, // Extract form errors
    control,               // Extract control for managing form state
  } = useFormContext();

  // Define the toolbar and formats for the ReactQuill editor
  const modules = useMemo(() => ({
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }], // Heading and font options
      [{ list: "ordered" }, { list: "bullet" }],       // List options
      ["bold", "italic", "underline"],                 // Text formatting options
      [{ align: [] }],                                 // Text alignment options
      ["link"],                                        // Link option
      ["clean"],                                       // Clear formatting option
    ],
  }), []);

  // Define the formats that the editor will support
  const formats = [
    "header", "font", "list", "bullet", "bold", "italic", "underline", "align", "link"
  ];

  return (
    <div className="mb-2">
      {/* Label for the project description */}
      <label className="block text-sm font-medium mb-1">
        Project Description (50 words)
      </label>

      {/* Use Controller to integrate ReactQuill with React Hook Form */}
      <Controller
        name="project_description"  // Name of the form field
        control={control}           // Control prop passed from useFormContext
        defaultValue=""             // Default value for the field
        render={({ field: { onChange, value } }) => (
          <ReactQuill
            value={value}           // Set the current value of the editor
            onChange={onChange}     // Update form state when the content changes
            modules={modules}       // Editor modules configuration
            formats={formats}       // Editor formats configuration
            placeholder="Enter your project description here..." // Placeholder text
            className="relative"
          />
        )}
      />

      {/* Display an error message if the project description field has an error */}
      {errors?.project_description && (
        <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
          {errors?.project_description?.message}  // Show the error message
        </span>
      )}
    </div>
  );
};

export default ProjectRegister6; // Export the component as default

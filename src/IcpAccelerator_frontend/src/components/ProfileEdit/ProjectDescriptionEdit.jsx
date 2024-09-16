import React, { useMemo } from "react";
import ReactQuill from "react-quill"; // Import ReactQuill for rich text editing
import { Controller } from "react-hook-form"; // Import necessary hooks from react-hook-form
import "react-quill/dist/quill.snow.css"; // Import the Quill stylesheet

const ProjectDescriptionEdit = ({ control, errors, isModalOpen, setIsModalOpen, project_description }) => {
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
    <>
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${
          isModalOpen ? "block" : "hidden"
        }`}
      >
        <div 
          className="bg-white rounded-lg shadow-lg w-[500px] p-6 pt-4"
          style={{ 
            height: 'calc(100vh - 30vh)', // Ensure the modal is 70% of the viewport height
            maxHeight: 'calc(100vh - 30vh)', // Add a max height to prevent overflow
            overflowY: 'auto' // Enable scrolling if content overflows
          }}
        >
          <div className="flex justify-end mr-4">
            <button
              className="text-2xl text-[#121926]"
              onClick={() => setIsModalOpen(!isModalOpen)}
            >
              &times;
            </button>
          </div>
          <div className="">
            <label className="block mb-1">
              Project Description (50 words) <span className="text-[red] ml-1">*</span>
            </label>
            <Controller
              name="project_description"
              control={control}
              defaultValue={project_description}
              render={({ field: { onChange, value } }) => (
                <ReactQuill
                  value={value}
                  onChange={onChange}
                  modules={modules}
                  formats={formats}
                  placeholder="Enter your description here..."
                  style={{ height: '10rem' }} // Fixed height for the Quill editor
                />
              )}
            />
            {/* Display an error message if the project description field has an error */}
            {errors?.project_description && (
              <span className="mt-20 text-sm text-red-500 font-bold flex justify-start">
                {errors?.project_description?.message}
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectDescriptionEdit;

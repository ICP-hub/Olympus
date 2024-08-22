import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import LinkIcon from "@mui/icons-material/Link";
import React, { useState } from "react";
import DocumentModal from "./DocumentModal";
import Nodata from "./Nodata";

export function DocumentItem({
  title,
  description,
  buttonText,
  visibility,
  selectedOption,
  setSelectedOption,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [documentdata, setDocumentdata] = useState([]);
  const message = {
    message1: "You haven't posted any Document yet",
    message2: "Any assets used in document will live here.",
    message3: "Start creating by uploading your files.",
    button: "Create a new Document",
  };

  return (
    <div className="flex items-stretch space-x-4 mb-6 pb-6">
      {/* Left Side */}
      <div className="w-[200px] flex-shrink-0 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
        <svg width="154" height="64" viewBox="0 0 154 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* SVG content here */}
        </svg>
      </div>

      {/* Right Side */}
      <div className="flex-grow">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-lg font-semibold">{title}</h3>
          <span
            className={`text-xs px-2 py-1 rounded-md ${
              visibility.includes("public")
                ? "text-gray-600 border-gray-200 bg-gray-100"
                : "text-blue-600 bg-blue-100"
            }`}
          >
            {visibility}
          </span>
        </div>

        <div className="flex">
          <div className="flex items-center space-x-4">
            <label
              className={`flex items-center cursor-pointer ${
                selectedOption === "file" ? "text-blue-600" : "text-gray-600"
              }`}
            >
              <input
                type="radio"
                name="upload"
                value="file"
                checked={selectedOption === "file"}
                onChange={() => setSelectedOption("file")}
                className="hidden"
              />
              <span
                className={`w-4 h-4 border-2 rounded-full mr-2 flex items-center justify-center ${
                  selectedOption === "file" ? "border-blue-600" : "border-gray-400"
                }`}
              >
                {selectedOption === "file" && (
                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                )}
              </span>
              Upload a file
            </label>

            <label
              className={`flex items-center cursor-pointer ${
                selectedOption === "link" ? "text-blue-600" : "text-gray-600"
              }`}
            >
              <input
                type="radio"
                name="upload"
                value="link"
                checked={selectedOption === "link"}
                onChange={() => setSelectedOption("link")}
                className="hidden"
              />
              <span
                className={`w-4 h-4 border-2 rounded-full mr-2 flex items-center justify-center ${
                  selectedOption === "link" ? "border-blue-600" : "border-gray-400"
                }`}
              >
                {selectedOption === "link" && (
                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                )}
              </span>
              Upload a link
            </label>
          </div>
        </div>

        <ul className="list-disc px-5">
          <li>Visible to investors only</li>
          <li>Visible to investors only</li>
          <li>Visible to investors only</li>
        </ul>

        {/* Conditional rendering of buttons based on the selected option */}
        {selectedOption === 'file' && (
          <button className="bg-[#155EEF] hover:bg-blue-700 text-white px-4 py-2 mt-3 rounded-[4px] border-2 text-sm flex items-center">
            <CloudUploadOutlinedIcon className="mr-2" fontSize="small" />
            Upload a file
          </button>
        )}

        {selectedOption === 'link' && (
          <button className="bg-[#155EEF] hover:bg-blue-700 text-white px-4 py-2 mt-3 rounded-[4px] border-2 text-sm flex items-center">
            <LinkIcon className="mr-2" fontSize="small" />
            Upload a link
          </button>
        )}
      </div>

      <div className="">
        {documentdata.length > 0 && (
          <div className="flex justify-end">
            <button
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              onClick={() => setIsOpen(true)}
            >
              + Add new Document
            </button>
            {isOpen && <DocumentModal setIsOpen={setIsOpen} isOpen={isOpen} />}
          </div>
        )}
        {documentdata.length === 0 ? (
          <Nodata message={message} setIsOpen={setIsOpen} isOpen={isOpen} />
        ) : (
          " Document data will render here"
        )}
      </div>
    </div>
  );
}

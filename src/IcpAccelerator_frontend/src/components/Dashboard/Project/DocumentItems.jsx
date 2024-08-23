import React from "react";
import docu from "../../../../assets/images/docu.png";
const UploadComponent = ({ visibility, selectedOption, setSelectedOption }) => {
  return (
    <div className="flex items-start space-x-4 p-4 border rounded-lg shadow-lg max-w-2xl bg-white">
      {/* Thumbnail */}
      <div className=" rounded-md overflow-hidden">
        <img
          src={docu}
          alt="Thumbnail"
          className="w-[200px] h-[172px] rounded-lg mr-4 object-cover"
        />
      </div>

      {/* Details Section */}
      <div className="flex-grow">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">
            Demo video{" "}
            <span className="text-green-600 ml-2 font-semibold">✓</span>
          </h3>

          {/* Visibility Status */}
          <div>
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
        </div>

        {/* Upload Options */}
        <div className="flex my-4">
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
                  selectedOption === "file"
                    ? "border-blue-600"
                    : "border-gray-400"
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
                  selectedOption === "link"
                    ? "border-blue-600"
                    : "border-gray-400"
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

        {/* Uploaded File */}
        <div className="flex items-center space-x-2 p-2 bg-green-100 rounded-md">
          <div className="flex-grow">
            <p className="text-gray-700">pitchdeck.pdf</p>
            <p className="text-xs text-gray-500">1.4 MB</p>
          </div>
          <button className="text-gray-500 hover:text-gray-700">&times;</button>
        </div>
      </div>
    </div>
    
  );
};

export default UploadComponent;

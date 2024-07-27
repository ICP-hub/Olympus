import React from 'react';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';

const DocumentItem = ({ title, description, buttonText, visibility }) => (
  <div className="flex items-start space-x-4 mb-6 pb-6">
    <div className="w-16 h-16 flex-shrink-0 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
      <svg
        className="w-8 h-8 text-gray-400"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
      </svg>
    </div>
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
      <p className="text-sm text-gray-600 mb-2">{description}</p>
      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center">
        <CloudUploadOutlinedIcon className="mr-2" fontSize="small" />
        {buttonText}
      </button>
    </div>
  </div>
);

function DocumentSection() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b">
        <button className="px-4 py-2 text-gray-600 hover:text-gray-800">General</button>
        <button className="px-4 py-2 text-blue-600 border-b-2 border-blue-600">Documents</button>
        <button className="px-4 py-2 text-gray-600 hover:text-gray-800">Team</button>
        <button className="px-4 py-2 text-gray-600 hover:text-gray-800">Jobs</button>
        <button className="px-4 py-2 text-gray-600 hover:text-gray-800">Rating</button>
      </div>

      {/* Document Items */}
      <div className="p-6">
        <DocumentItem 
          title="Demo video"
          description="Est malesuada ac elit gravida vel aliquam nec. Arcu pelle ntesque convallis quam feugiat non viverra massa fringilla."
          buttonText="Upload a demo video"
          visibility="Visible to public"
        />
        <DocumentItem 
          title="Whitepaper"
          description="Est malesuada ac elit gravida vel aliquam nec. Arcu pelle ntesque convallis quam feugiat non viverra massa fringilla."
          buttonText="Upload whitepaper"
          visibility="Visible to public"
        />
        <DocumentItem 
          title="Pitch deck"
          description="Est malesuada ac elit gravida vel aliquam nec. Arcu pelle ntesque convallis quam feugiat non viverra massa fringilla."
          buttonText="Upload pitch deck"
          visibility="Visible to investors only"
        />
        <DocumentItem 
          title="Tokenomics"
          description="Est malesuada ac elit gravida vel aliquam nec. Arcu pelle ntesque convallis quam feugiat non viverra massa fringilla."
          buttonText="Upload tokenomics plan"
          visibility="Visible to investors only"
        />
        <DocumentItem 
          title="GTM Strategy"
          description="Est malesuada ac elit gravida vel aliquam nec. Arcu pelle ntesque convallis quam feugiat non viverra massa fringilla."
          buttonText="Upload GTM strategy"
          visibility="Visible to investors only"
        />
        <DocumentItem 
          title="Legal documents"
          description="Est malesuada ac elit gravida vel aliquam nec. Arcu pelle ntesque convallis quam feugiat non viverra massa fringilla."
          buttonText="Upload legal documents"
          visibility="Visible to investors only"
        />
      </div>

      {/* FAQ Section */}
      <div className="border-t border-gray-200 p-6">
        <div className="mb-4">
          <button className="flex justify-between items-center w-full text-left">
            <span className="text-lg font-semibold">Est quis ornare proin quisque lacinia ac tincidunt massa?</span>
            <RemoveCircleOutlineOutlinedIcon className="text-gray-500" />
          </button>
          <p className="mt-2 text-gray-600">
            Est malesuada ac elit gravida vel aliquam nec. Arcu pelle ntesque convallis quam feugiat non viverra 
            massa fringilla. Est malesuada ac elit gravida vel aliquam nec. Arcu pelle ntesque convallis quam 
            feugiat non viverra massa fringilla.
          </p>
        </div>
        <hr className='mb-4'></hr>
        <div className="mb-4">
          <button className="flex justify-between items-center w-full text-left">
            <span className="text-lg font-semibold">Gravida quis pellentesque mauris in fringilla?</span>
            <AddCircleOutlineOutlinedIcon className="transform rotate-180 text-gray-500" />
          </button>
        </div>
        <hr className='mb-4'></hr>
        <div>
          <button className="flex justify-between items-center w-full text-left">
            <span className="text-lg font-semibold">Lacus iaculis vitae pretium integer?</span>
            <AddCircleOutlineOutlinedIcon className="transform rotate-180 text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default DocumentSection;
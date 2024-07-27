import React from 'react';
import { Folder, Add } from '@mui/icons-material';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';

const JobSection = () => {
  return (
    <div className="p-6">
      {/* Tab Navigation */}
      <div className="flex border-b mb-6">
        <div className="mr-6 text-gray-500">General</div>
        <div className="mr-6 text-gray-500">Documents</div>
        <div className="mr-6 text-gray-500">Team</div>
        <div className="mr-6 text-blue-500 border-b-2 border-blue-500 pb-2">Jobs</div>
        <div className="text-gray-500">Rating</div>
      </div>

      {/* Content */}
      <div className="text-center py-12">
        <Folder className="w-2 h-24 text-gray-300 text-6xl mb-4 mx-auto" />
        <h2 className="text-xl font-semibold mb-2">You haven't posted any jobs yet</h2>
        <p className="text-gray-600 mb-2">Any assets used in projects will live here.</p>
        <p className="text-gray-600 mb-6">Start creating by uploading your files.</p>
        <button className="bg-[#155EEF] text-white px-4 py-2 rounded-md flex items-center justify-center mx-auto">
          <WorkOutlineOutlinedIcon className="mr-2" />
          Post a job
        </button>
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
        <div className="mb-4">
          <button className="flex justify-between items-center w-full text-left">
            <span className="text-lg font-semibold">Gravida quis pellentesque mauris in fringilla?</span>
            <AddCircleOutlineOutlinedIcon className="transform rotate-180 text-gray-500" />
          </button>
        </div>
        <div>
          <button className="flex justify-between items-center w-full text-left">
            <span className="text-lg font-semibold">Lacus iaculis vitae pretium integer?</span>
            <AddCircleOutlineOutlinedIcon className="transform rotate-180 text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobSection;
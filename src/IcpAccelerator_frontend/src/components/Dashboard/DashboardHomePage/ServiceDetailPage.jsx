import React from 'react';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import ServiceDetailPageImage from "../../../../assets/Logo/ServiceDetailPageImage.png";

const ServiceDetailPage = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <img
        src={ServiceDetailPageImage}
        alt="Startup Business"
        className="w-full rounded-lg mb-6"
      />

      <h1 className="text-3xl font-bold mb-4">Landing page design</h1>

      <div className="flex items-center space-x-4 mb-6">
        <div className="flex items-center">
          <AccessTimeIcon className="text-gray-500 mr-1" />
          <span>1 week</span>
        </div>
        <div className="flex items-center">
          <span>$1,000</span>
        </div>
      </div>

      <div className="mb-8">
        <div className="mb-8">
          <div className="flex space-x-4 mb-4 border-b border-gray-200">
            <button className="text-blue-600 border-b-2 border-blue-600 pb-2 -mb-[2px]">
              Summary
            </button>
            <button className="text-gray-500 pb-2">Reviews</button>
          </div>

          {/* Rest of the content */}
        </div>
        <h2 className="text-2xl font-semibold mb-4">Deliverables</h2>
        <p className="text-gray-700 mb-4">
          Est quis ornare proin quisque lacinia ac tincidunt massa
        </p>
        <p className="text-gray-600">
          Est malesuada ac elit gravida vel aliquam nec. Arcu pelle ntesque
          convallis quam feugiat non viverra massa fringilla. Est malesuada ac
          elit gravida vel aliquam nec. Arcu pelle ntesque convallis quam
          feugiat non viverra massa fringilla.
        </p>
      </div>
      <hr className="my-8 border-t border-gray-200" />
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Showcase</h2>
        <button className="flex items-center bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md w-full">
          <span className="mr-2">+</span>
          Attach work
        </button>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">FAQ</h2>
        <div className="border-t border-gray-200">
          <div className="mb-4">
            <button className="flex justify-between items-center w-full text-left py-4">
              <span className="text-lg font-semibold">
                Est quis ornare proin quisque lacinia ac tincidunt massa?
              </span>
              <RemoveCircleOutlineOutlinedIcon className="text-gray-500" />
            </button>
            <p className="mt-2 text-gray-600">
              Est malesuada ac elit gravida vel aliquam nec. Arcu pelle ntesque
              convallis quam feugiat non viverra massa fringilla. Est malesuada
              ac elit gravida vel aliquam nec. Arcu pelle ntesque convallis quam
              feugiat non viverra massa fringilla.
            </p>
          </div>
          <div className="mb-4">
            <button className="flex justify-between items-center w-full text-left py-4">
              <span className="text-lg font-semibold">
                Gravida quis pellentesque mauris in fringilla?
              </span>
              <AddCircleOutlineOutlinedIcon className="transform rotate-180 text-gray-500" />
            </button>
          </div>
          <div>
            <button className="flex justify-between items-center w-full text-left py-4">
              <span className="text-lg font-semibold">
                Lacus iaculis vitae pretium integer?
              </span>
              <AddCircleOutlineOutlinedIcon className="transform rotate-180 text-gray-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailPage;
import React from "react";

const JobFilterModal = ({ openDetail, setOpenDetail }) => {
  return (
    <div className="md1:hidden lg:flex lgx:hidden lg:pr-[1%] transition-transform duration-300 ease-in-out transform translate-y-0 fixed inset-0 flex items-end justify-end bg-black bg-opacity-50">
      <div className="bg-white rounded-t-3xl w-full lg:max-w-[75%] p-6 space-y-6 shadow-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Filters</h2>
          <button
            onClick={() => setOpenDetail(false)}
            className="text-gray-600 text-4xl "
          >
            &times;
          </button>
        </div>

       
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Department
          </label>
          <select className="w-full border rounded p-2 text-gray-700">
            <option>Select role</option>
          </select>
        </div>

        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Occupation
          </label>
          <div className="flex flex-col space-y-1">
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox border" />
              <span className="ml-2">Full-time</span>
            </label>
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox border" />
              <span className="ml-2">Part-time</span>
            </label>
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox border" />
              <span className="ml-2">Contract</span>
            </label>
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox border" />
              <span className="ml-2">Internship</span>
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            type="text"
            placeholder="Start typing"
            className="w-full border rounded p-2"
          />
          <label className="inline-flex items-center">
            <input type="checkbox" className="h-4 w-4 text-indigo-600 border-2 border-gray-300 rounded" />
            <span className="ml-2">Remote</span>
          </label>
        </div>

        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Salary
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="$ From"
              className="w-full border rounded p-2"
            />
            <input
              type="text"
              placeholder="$ To"
              className="w-full border rounded p-2"
            />
          </div>
        </div>
      </div>
    </div>

    

  );
};

export default JobFilterModal;

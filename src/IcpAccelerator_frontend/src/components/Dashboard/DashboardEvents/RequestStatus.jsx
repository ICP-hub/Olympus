import React, { useState } from 'react'

export default function RequestStatus({ close }) {
  const [selectedValue, setSelectedValue] = useState('');

  const handleSelectionChange = (e) => {
    setSelectedValue(e.target.value);
  };

  const handleApply = () => {
    console.log('Selected Value:', selectedValue);
    close(); // Close the filter box after applying
  };

  return (
   <>
     <div className="absolute -top-72 right-0 w-52 bg-gray-100 border border-gray-300 p-4 rounded-lg shadow-lg z-50">
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold text-gray-800">Filter</h2>
              <div className="mb-1">
                <span className="block text-sm font-medium text-gray-600 mb-2">
                  Request
                </span>
                <label className="flex items-center text-sm text-gray-700 font-medium mb-2">
                  <input
                    type="radio"
                    name="category"
                    value="accepted"
                    onChange={handleSelectionChange}
                    className="h-4 w-4 text-blue-600 form-radio checked:bg-blue-600 border border-black rounded-full cursor-pointer mr-2"
                  />
                  Accepted
                </label>
                <label className="flex items-center text-sm text-gray-700 font-medium mb-2">
                  <input
                    type="radio"
                    name="category"
                    value="rejected"
                    onChange={handleSelectionChange}
                    className="h-4 w-4 text-blue-600 form-radio checked:bg-blue-600 border border-black rounded-full cursor-pointer mr-2"
                  />
                  Rejected
                </label>
                <label className="flex items-center text-sm text-gray-700 font-medium">
                  <input
                    type="radio"
                    name="category"
                    value="pending"
                    onChange={handleSelectionChange}
                    className="h-4 w-4 text-blue-600 form-radio checked:bg-blue-600 border border-black rounded-full cursor-pointer mr-2"
                  />
                  Pending
                </label>
              </div>
              <div className="flex justify-between mt-1">
                <button
                  type="button"
                  className="bg-gray-200 text-gray-700 px-4 py-1 rounded-md hover:bg-gray-300"
                  onClick={close} // Close the filter box when clicking on Cancel
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600"
                  onClick={handleApply} // Close the filter box when clicking on Apply
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
   </>
  )
}

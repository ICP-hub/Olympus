import React from "react";
import { ThreeDots } from "react-loader-spinner";

function DeleteModel({
  title,
  heading,
  onClose,
  onSubmitHandler,
  isSubmitting,
  Id,
}) {
  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50"></div>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:inset-0 h-full">
        <div className="relative w-full max-w-md bg-white rounded-lg shadow-lg">
          <div className="flex items-center justify-between p-5 border-b rounded-t">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="p-6">
            <p>{heading}</p>
          </div>
          <div className="flex justify-end items-center p-4 border-t rounded-b">
            <button
              onClick={onClose}
              className="mr-3 text-gray-500 hover:text-gray-800 focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={onSubmitHandler}
              disabled={isSubmitting}
              className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
            >
              {isSubmitting ? (
                <ThreeDots
                  visible={true}
                  height="24"
                  width="24"
                  color="#FFFFFF"
                  radius="9"
                  ariaLabel="three-dots-loading"
                  wrapperStyle={{}}
                  wrapperClassName=""
                />
              ) : (
                "Delete"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default DeleteModel;

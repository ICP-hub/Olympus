import React, { useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import { beforeCopySvg } from "../Utils/AdminData/SvgData";
import { afterCopySvg } from "../Utils/AdminData/SvgData";
import { useCallback } from "react";
import toast from "react-hot-toast";

function CohortRemoveButton({
  heading,
  onClose,
  isSubmitting,
  onSubmitHandler,
  onInputChange,
  Id,
}) {
  const [inputValue, setInputValue] = useState("");
  const [customSvg, setCustomSvg] = useState(beforeCopySvg);

  const handleChange = (e) => {
    setInputValue(e.target.value);
    onInputChange(e.target.value);
  };
  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(Id).then(
      () => {
        setCustomSvg(afterCopySvg);
        toast.success("Principal copied to clipboard!");
      },
      (err) => {
        console.error("Could not copy text: ", err);
      }
    );
  }, [Id]);
  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50"></div>
      <div className="overflow-y-auto overflow-x-hidden top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full fixed flex">
        <div className="relative p-4 w-full max-w-md max-h-full">
          <div className="relative bg-white rounded-lg shadow">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
              <p>{heading}</p>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-800"
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
            <div className="p-4">
              <p className="py-4">Reason</p>
              <div className="group flex items-center my-4">
                <div className="truncate w-full overflow-hidden text-ellipsis group-hover:text-left ">
                  Principal: {Id}
                </div>
                <button
                  onClick={copyToClipboard}
                  className="ml-2 text-sm text-blue-500 hover:text-blue-700"
                >
                  {customSvg}
                </button>
              </div>
              <input
                className="w-full p-2 border rounded"
                value={inputValue}
                onChange={handleChange}
                placeholder="Add principal Id to remove"
              />
            </div>
            <div className="flex justify-end items-center p-4">
              <button
                type="submit"
                onClick={onSubmitHandler}
                disabled={isSubmitting}
                className="w-full justify-center text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                {isSubmitting ? (
                  <ThreeDots
                    visible={true}
                    height="35"
                    width="35"
                    color="#FFFEFF"
                    radius="9"
                    ariaLabel="three-dots-loading"
                    wrapperStyle={{}}
                    wrapperclassName=""
                  />
                ) : (
                  "Remove"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CohortRemoveButton;

import React from "react";

function DeleteModel(heading, onClose) {
  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50"></div>
      <div className=" overflow-y-auto overflow-x-hidden  top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full fixed flex">
        <div className="relative p-4 w-full max-w-md max-h-full">
          <div className="relative bg-white rounded-lg shadow">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t ">
              <p>{heading}</p>
            </div>
            <div className="flex justify-end items-center">
              <button
                type="submit"
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
                  `${jobbutton}`
                )}
              </button>
              <button
                type="submit"
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
                  `${jobbutton}`
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DeleteModel;

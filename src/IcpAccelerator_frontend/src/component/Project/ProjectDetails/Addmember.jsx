import React, { useState } from "react";

import { Profile } from "../../../../../admin_frontend/src/components/Utils/AdminData/SvgData";

const Addmember = () => {
  const [forms, setForms] = useState([
    { name: "", role: "", openchat: "", linkedin: "", twitter: "" }
  ]);

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const newForms = [...forms];
    newForms[index][name] = value;
    setForms(newForms);
  };

  const handleAddForm = () => {
    setForms([...forms, { name: "", role: "", openchat: "", linkedin: "", twitter: "" }]);
  };

  const handleRemoveForm = index => {
    const newForms = [...forms];
    newForms.splice(index, 1);
    setForms(newForms);
  };

  return (
    <section className="w-full px-[6%] lg1:px-[4%] bg-gray-100">
      <div className="w-full bg-gray-100">
        <div className="bg-gradient-to-r from-purple-800 to-blue-500 text-transparent bg-clip-text text-[30px] sm:text-[25px] md1:text-[30px] md2:text-[35px] font-black font-fontUse dxl:text-[40px] p-8">
          Add Team Members
        </div>
        <div className="text-sm font-medium text-center text-gray-200">
          <div className="flex flex-col">
            <div className="flex-row w-full flex justify-start gap-4 items-center">
              <div className="mb-3 ml-6 h-24 w-24 rounded-full border-2 border-gray-300 flex items-center justify-center overflow-hidden">
                {Profile}
              </div>
              <div className="p-2 border-2 border-blue-800 items-center rounded-md text-md bg-transparent text-blue-800 cursor-pointer font-extrabold">
                Upload Image
              </div>
            </div>
          </div>
          {forms.map((form, index) => (
            <div className="text-sm font-medium text-center text-gray-200" key={index}>
              <form className="w-full px-4 ">
                <div className="flex flex-row flex-wrap">
                  <div className="relative z-0 group mb-6 w-full flex flex-row flex-wrap">
                    <div className="w-full sm:w-1/3 pr-2">
                      <label
                        htmlFor=""
                        className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={(event) => handleInputChange(index, event)}
                        className={`bg-gray-50 border-2 border-[#737373] text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                        placeholder=""
                      />
                      {/* Error message placeholder */}
                    </div>
                    <div className="w-full sm:w-1/3   ">
                      <label
                        htmlFor=""
                        className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                      >
                        Openchat Username
                      </label>
                      <input
                        type="text"
                        name=""
                        id=""
                        className={`bg-gray-50 border-2 border-[#737373] text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                        placeholder=""
                      />
                      {/* Error message placeholder */}
                    </div>
                    <div className="w-full sm:w-1/3  ">
                      <label
                        htmlFor=""
                        className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                      >
                        Role
                      </label>
                      <input
                        type="text"
                        name=""
                        id=""
                        className={`bg-gray-50 border-2 border-[#737373] text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                        placeholder=""
                      />
                      {/* Error message placeholder */}
                    </div>
                  </div>
                </div>
                <div className="flex flex-row flex-wrap justify-start space-x-4">
                  <div className="w-full sm:w-1/3">
                    <label
                      htmlFor=""
                      className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                    >
                      LinkedIn
                    </label>
                    <input
                      type="text"
                      name=""
                      id=""
                      className={`bg-gray-50 border-2 border-[#737373] text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                      placeholder="https://"
                    />
                    {/* Error message placeholder */}
                  </div>
                  <div className="w-full sm:w-1/3  ">
                    <label
                      htmlFor=""
                      className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                    >
                      Twitter
                    </label>
                    <input
                      type="text"
                      name=""
                      id=""
                      className={`bg-gray-50 border-2 border-[#737373] text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                      placeholder=""
                    />
                    {/* Error message placeholder */}
                  </div>
                </div>
                {index !== 0 && (
                  <div className="flex justify-end mt-4">
                    <button
                      type="button"
                      onClick={() => handleRemoveForm(index)}
                      className="text-white font-bold bg-red-800 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 rounded-md w-auto sm:w-auto px-5 py-2 text-center mb-4"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </form>
            </div>
          ))}
          <div className="flex justify-end mt-4">
            <button
              className="text-white font-bold bg-blue-800 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-md w-auto sm:w-auto px-5 py-2 text-center mb-4"
              onClick={handleAddForm}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Addmember;

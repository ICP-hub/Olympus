import React, { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { ThreeDots } from "react-loader-spinner";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";


const schema = yup
  .object({
    documentTitle: yup
      .string()
      .required("Document title is required")
      .min(5, "Title must be at least 5 characters")
      .test(
        "no-leading-spaces",
        "Document title should not have leading spaces",
        (value) => !value || value.trimStart() === value
      ),
      documentPrivacy: yup
      .string()
      .required("Please select a privacy option")
      .oneOf(["public", "private"], "Invalid privacy option selected"),
      link: yup
        .string()
        .required("This field is required")
        .nullable(true)
        .optional()
        .url("Invalid url"),
  })
  .required();

const DocumentModal = ({
  setIsOpen,
  isOpen,
  onSubmitHandler,
  isSubmitting,
  isUpdate,
  data,
}) => {
//   const [formData, setFormData] = useState(null);
  const [selectedOption, setSelectedOption] = useState("file");

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
  });

    const onSubmit = (data) => {
    //   setFormData(data);
      console.log("data",data);
      setIsOpen(false);
      reset()
    //   console.log("formdata" , formData)
    };



  return (
    <div>
      {isOpen && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${
            isOpen ? "block" : "hidden"
          }`}
        >
          <div className="bg-white rounded-lg shadow-lg w-[500px] p-2">
            <div className="flex justify-between items-center ml-6 mb-2">
              <button
                className="text-[#364152] text-3xl"
                onClick={() => setIsOpen(false)}
              >
                &times;
              </button>
            </div>
            <div className="p-3">
              <h2 className="text-xl font-bold ml-4 mb-2">
                {isUpdate === true ? "Update Document" : "Add Document"}
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="p-3 md:p-5">
                <div className=" gap-4 mb-4 ">
                  <div className="col-span-2">
                    <label
                      htmlFor="DocumentTitle"
                      className="block text-base font-medium mb-2"
                    >
                      Document Title
                    </label>
                    <input
                      type="text"
                      {...register("documentTitle")}
                      className={`bg-gray-50 border ${
                        errors.announcementTitle
                          ? "border-red-500 placeholder:text-red-500"
                          : "border-[#737373]"
                      } text-gray-700 placeholder-gray-500 placeholder:font-semibold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5`}
                      placeholder="Document Title"
                    />
                    {errors.documentTitle && (
                      <span className="mt-1 text-sm text-red-500 font-semibold">
                        {errors.documentTitle.message}
                      </span>
                    )}
                  </div>

                  <div className="col-span-2">
                    <label
                      htmlFor="documentPrivacy"
                      className="block text-base font-medium my-2"
                    >
                      Select Privacy
                    </label>
                    <select
                      {...register("documentPrivacy")}
                      className="border my-1 w-full py-1 px-2"
                    >
                      <option value="">Select Privacy</option>
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                    </select>
                    {errors.documentPrivacy && (
                      <span className="mt-1 text-sm text-red-500 font-semibold">
                        {errors.documentPrivacy.message}
                      </span>
                    )}
                  </div>

                  <div className="flex w-full my-2 flex-col">
                    <div className="flex items-center space-x-4">
                      <label
                        className={`flex items-center cursor-pointer ${
                          selectedOption === "file"
                            ? "text-blue-600"
                            : "text-gray-600"
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
                          selectedOption === "link"
                            ? "text-blue-600"
                            : "text-gray-600"
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
                    {selectedOption === "link" && (
                      <div className="col-span-2">
                      <label
                        className="block text-base font-medium mb-2"
                      >
                         Add Link
                      </label>
                      <input
                        type="url"
                        placeholder="Enter your link "
                        {...register("link")}
                        className={`bg-gray-50 border ${
                          errors.link
                            ? "border-red-500 placeholder:text-red-500"
                            : "border-[#737373]"
                        } text-gray-700 placeholder-gray-500 placeholder:font-semibold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5`}
                        
                      />
                      {errors.link && (
                        <span className="mt-1 text-sm text-red-500 font-semibold">
                          {errors.link.message}
                        </span>
                      )}
                    </div>
                    )}
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="py-2 px-4 text-white rounded-xl bg-blue-600 border border-[#B2CCFF] w-full justify-center flex items-center"
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
                  ) : isUpdate ? (
                    "Update Document"
                  ) : (
                    "Add new Document"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentModal;

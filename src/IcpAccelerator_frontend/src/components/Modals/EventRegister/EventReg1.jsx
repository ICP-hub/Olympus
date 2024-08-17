import React, { useState, useEffect } from "react";
import ReactSelect from "react-select";
import toast, { Toaster } from "react-hot-toast";
import { formFields1 } from "./EventFormData1";
import { useFormContext } from "react-hook-form";
import { useForm, Controller } from "react-hook-form";
import CompressedImage from "../../../component/ImageCompressed/CompressedImage"
import ControlPointIcon from "@mui/icons-material/ControlPoint";
const EventReg1 = ({ setImageData, setImagePreview, imagePreview }) => {
  const { register, formState: { errors }, control, setValue, clearErrors, setError, trigger } = useFormContext();


  const [inputType, setInputType] = useState("date");
  const handleFocus = (field) => {
    if (field.onFocus) {
      setInputType(field.onFocus);
    }
  };

  const handleBlur = (field) => {
    if (field.onBlur) {
      setInputType(field.onBlur);
    }
  };


  // image creation function compression and uintarray creator
  const imageCreationFunc = async (file) => {
    const result = await trigger("image");
    if (result) {
      try {
        const compressedFile = await CompressedImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(compressedFile);
        const byteArray = await compressedFile.arrayBuffer();
        setImageData(Array.from(new Uint8Array(byteArray)));
        console.log("Event Image Buffer Array", byteArray)
      } catch (error) {
        setError("image", {
          type: "manual",
          message: "Could not process image, please try another.",
        });
      }
    } else {
      console.log("ERROR--imageCreationFunc-file", file);
    }
  };
  // clear image func
  const clearImageFunc = (val) => {
    let field_id = val;
    setValue(field_id, null);
    clearErrors(field_id);
    setImageData(null);
    setImagePreview(null);
  };
  return (
    <>
      <h1 className="text-3xl text-[#121926] font-bold mb-3">
        Create a Event
      </h1>
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">
          Upload a logo<span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2  items-center">
          <div className="h-24 w-24 rounded-2xl border-2 border-dashed border-gray-300 items-center justify-center overflow-hidden flex">
            {imagePreview && !errors.image ? (
              <img
                src={imagePreview}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="size-11"
              >
                <path
                  fill="#BBBBBB"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
                />
              </svg>
            )}
          </div>

          <Controller
            name="image"
            control={control}
            render={({ field }) => (
              <>
                <input
                  type="file"
                  className="hidden"
                  id="image"
                  name="image"
                  onChange={(e) => {
                    field.onChange(e.target.files[0]);
                    imageCreationFunc(e.target.files[0]);
                  }}
                  accept=".jpg, .jpeg, .png"
                />

                <label
                  htmlFor="image"
                  className="p-2 border-2 border-blue-800 items-center sm:ml-6 rounded-md text-md bg-transparent text-blue-800 cursor-pointer font-semibold"
                >
                  {imagePreview && !errors.image
                    ? "Change banner picture"
                    : "Upload banner picture"}
                </label>
                {imagePreview || errors.image ? (
                  <button
                    className="p-2 border-2 border-red-500 ml-2 items-center rounded-md text-md bg-transparent text-red-500 cursor-pointer font-semibold capitalize"
                    onClick={() => clearImageFunc("image")}
                  >
                    clear
                  </button>
                ) : (
                  ""
                )}

              </>
            )}
          />
        </div>
        {errors.image && (
          <span className="mt-1 text-sm text-red-500 font-bold text-start px-4">
            {errors?.image?.message}
          </span>
        )}
      </div>
      <div className="mb-2">
        {formFields1?.map((field) => (
          <div key={field.id} className="relative z-0 group mb-2">
            <label
              htmlFor={field.id}
              className=" text-sm font-medium mb-1 flex"
            >
              {field.label}{" "}
              <span
                className={`${field.label === "Eligibility Cirteria" ? "hidden" : "flex"
                  } text-red-500`}
              >
                *
              </span>
            </label>
            {field.type === "textarea" ? (
              <textarea
                name={field.name}
                id={field.id}
                {...register(field.name)}
                className={`border border-[#CDD5DF] rounded-md shadow-sm 
                  ${errors[field.name]
                    ? "border-red-500 placeholder:text-red-500"
                    : "border-[#737373]"
                  } text-gray-900 placeholder-gray-500  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                placeholder={field.placeholder}
                onFocus={() => handleFocus(field)}
                onBlur={() => handleBlur(field)}
              ></textarea>
            ) : (
              <input
                type={field.id === "date_of_birth" ? inputType : field.type}
                name={field.name}
                id={field.id}
                {...register(field.name)}
                className={`border border-[#CDD5DF] rounded-md shadow-sm 
                  ${errors[field.name]
                    ? "border-red-500 placeholder:text-red-500"
                    : "border-[#737373]"
                  } text-gray-900 placeholder-gray-500  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                placeholder={field.placeholder}
                onFocus={() => handleFocus(field)}
                onBlur={() => handleBlur(field)}
              />
            )}
            {errors[field.name] && (
              <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                {errors[field.name].message}
              </span>
            )}
          </div>
        ))}
      </div>



      <Toaster />
    </>
  );
};

export default EventReg1;

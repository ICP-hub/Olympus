import React, { useEffect, useState } from "react";
import { formFields } from "../../Utils/Data/founderFormField";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { allHubHandlerRequest } from "../../StateManagement/Redux/Reducers/All_IcpHubReducer";
// import { AuthClient } from "@dfinity/auth-client";
import { ThreeDots } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { userRoleHandler } from "../../StateManagement/Redux/Reducers/userRoleReducer";

const today = new Date();
const startDate = new Date("1900-01-01");

const schema = yup.object({
  full_name: yup
    .string()
    .required()
    .test("is-non-empty", null, (value) => value && value.trim().length > 0),
  date_of_birth: yup
    .date()
    .required()
    .min(startDate, "Date of birth cannot be before January 1, 1900")
    .max(today, "Date of birth cannot be in the future")
    .typeError("Invalid date format, please use YYYY-MM-DD"),
  email: yup.string().email().required(),
  phone_number: yup
    .string()
    .required()
    .matches(/^(\+\d{1,3}[- ]?)?\d{10}$/, null),
  linked_in_profile: yup.string().required().url(),
  telegram_id: yup.string().required().url(),
  twitter_id: yup.string().required().url(),
  hub: yup.string().required("Selecting a hub is required."),
});

const FounderInfo = () => {
  
  const getAllIcpHubs = useSelector((currState) => currState.hubs.allHubs);
  const actor = useSelector((currState) => currState.actors.actor);
  const founderFullData = useSelector((currState) => currState.projectData.data);

  const [inputType, setInputType] = useState("date");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // console.log("FounderInfo run =>");
  // console.log("getAllIcpHubs", getAllIcpHubs);

  useEffect(() => {
    dispatch(allHubHandlerRequest());
  }, [actor, dispatch]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    trigger, reset
  } = useForm({
    resolver: yupResolver(schema), mode :'all'
  });

  const onSubmitHandler = async (data) => {
    // console.log("data aaya data aaya ", data);

    const founderData = {
      full_name: [data.full_name],
      date_of_birth: [data.date_of_birth.toISOString().split("T")[0]],
      email: [data.email],
      phone_number: [data.phone_number],
      linked_in_profile: [data.linked_in_profile.toString()],
      telegram_id: [data.telegram_id.toString()],
      twitter_id: [data.twitter_id.toString()],
      preferred_icp_hub: [data.hub],
    };

    // console.log("founderdata => ", founderData);

    try {
      const result = await actor.register_founder_caller(founderData);
      toast.success(result);
      console.log("data passed to backend");
      await dispatch(userRoleHandler());
      await navigate("/dashboard");
    } catch (error) {
      toast.error(error);
      console.error("Error sending data to the backend:", error);
    }
  };

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

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmitHandler)} className="w-full px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {formFields?.map((field) => (
            <div key={field.id} className="relative z-0 group mb-6">
              <label
                htmlFor={field.id}
                className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden hover:text-left"
              >
                {field.label}
              </label>
              <input
                type={field.id === "date_of_birth" ? inputType : field.type}
                name={field.name}
                id={field.id}
                {...register(field.name)}
                className={`bg-gray-50 border-2 ${
                  errors[field.name]
                    ? "border-red-500 placeholder:text-red-500"
                    : "border-[#737373]"
                } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                placeholder={field.placeholder}
                onFocus={() => handleFocus(field)}
                onBlur={() => handleBlur(field)}
              />
              {errors[field.name] && (
                <span className="mt-1 text-sm text-red-500 font-bold">
                  {errors[field.name].message}
                </span>
              )}
            </div>
          ))}

          <div className="relative z-0 group">
            <label
              htmlFor="hub"
              className="block mb-2 text-lg font-medium text-gray-700 hover:whitespace-normal truncate overflow-hidden hover:text-left"
            >
              Can you please share your preferred ICP Hub
            </label>
            <select
              {...register("hub")}
              id="hub"
              className={`bg-gray-50 border-2 ${
                errors.hub
                  ? "border-red-500 placeholder:text-red-500"
                  : "border-[#737373]"
              } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
            >
              <option className="text-lg font-bold" value="">
                Select your ICP Hub
              </option>
              {getAllIcpHubs?.map((hub) => (
                <option
                  key={hub.id}
                  value={`${hub.name} ,${hub.region}`}
                  className="text-lg font-bold"
                >
                  {hub.name} , {hub.region}
                </option>
              ))}
            </select>
            {errors.hub && (
              <span className="mt-1 text-sm text-red-500 font-bold">
                {errors.hub.message}
              </span>
            )}
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button
            disabled={isSubmitting}
            type="submit"
            className="text-white font-bold bg-blue-800 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-md w-auto sm:w-auto px-5 py-2 text-center mb-4"
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
              "Submit"
            )}
          </button>
        </div>
      </form>
      <Toaster />
    </div>
  );
};

export default FounderInfo;

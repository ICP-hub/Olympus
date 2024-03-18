import React, { useCallback, useEffect, useState } from "react";
import { formFields } from "../../../components/Utils/Data/EventFormData";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import CompressedImage from "../../ImageCompressed/CompressedImage";
import { useDispatch, useSelector } from "react-redux";
// import { allHubHandlerRequest } from "../../StateManagement/Redux/Reducers/All_IcpHubReducer";
// import { AuthClient } from "@dfinity/auth-client";
import { ThreeDots } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import DetailHeroSection from "../../Common/DetailHeroSection";
// import { userRoleHandler } from "../../StateManagement/Redux/Reducers/userRoleReducer";
import Founder from "../../../../assets/images/founderRegistration.png";
// import { getCurrentRoleStatusRequestHandler } from "../StateManagement/Redux/Reducers/userCurrentRoleStatusReducer";

const today = new Date();
const startDate = new Date("1900-01-01");

const schema = yup.object({
  // full_name: yup
  //   .string()
  //   .required()
  //   .test("is-non-empty", null, (value) => value && value.trim().length > 0),
  // user_name: yup
  //   .string()
  //   .nullable(true) // Allows the value to be null
  //   .test(
  //     "is-valid-username",
  //     "Username must be between 6 and 20 characters and can only contain letters, numbers, and underscores",
  //     (value) => {
  //       // If no value is provided, consider it valid (since it's optional)
  //       if (!value) return true;

  //       // Check length
  //       const isValidLength = value.length >= 6 && value.length <= 20;
  //       // Check allowed characters (including at least one uppercase letter or number)
  //       const hasValidChars = /^(?=.*[A-Z0-9_])[a-zA-Z0-9_]+$/.test(value);

  //       return isValidLength && hasValidChars;
  //     }
  //   ),
  // bio: yup.string().optional(),
  // email: yup.string().email().optional(),
  // telegram_id: yup.string().optional().url(),
  // twitter_id: yup.string().optional().url(),
  // country: yup.string().required("Country is required."),
  // areas_of_expertise: yup
  //   .string()
  //   .required("Selecting a interest is required."),
});

const EventForm = () => {
  const actor = useSelector((currState) => currState.actors.actor);
  const userFullData = useSelector((currState) => currState.userData);

  const [inputType, setInputType] = useState("date");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  console.log("userInfo run =>", userFullData);
  //   console.log("getAllIcpHubs", getAllIcpHubs);

  //   useEffect(() => {
  //     dispatch(allHubHandlerRequest());
  //   }, [actor, dispatch]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    trigger,
    setError,
    clearErrors,
    control,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
  });
  //   async (file) => {
  //     clearErrors("imageData");
  //     if (!["image/jpeg", "image/png", "image/gif"].includes(file.type))
  //       return setError("imageData", {
  //         type: "manual",
  //         message: "Unsupported file format",
  //       });
  //     if (file.size > 1024 * 1024)
  //       // 1MB
  //       return setError("imageData", {
  //         type: "manual",
  //         message: "The file is too large",
  //       });

  //     setIsLoading(true);
  //     try {
  //       const compressedFile = await CompressedImage(file);
  //       const reader = new FileReader();
  //       reader.onloadend = () => {
  //         setImagePreview(reader.result);
  //         setIsLoading(false);
  //       };
  //       reader.readAsDataURL(compressedFile);

  //       const byteArray = await compressedFile.arrayBuffer();
  //       setImageData(Array.from(new Uint8Array(byteArray)));
  //       console.log("imageData", Array.from(new Uint8Array(byteArray)));
  //       clearErrors("imageData");
  //     } catch (error) {
  //       console.error("Error processing the image:", error);
  //       setError("imageData", {
  //         type: "manual",
  //         message: "Could not process image, please try another.",
  //       });
  //       setIsLoading(false);
  //     }
  //   },
  //   [setError, clearErrors, setIsLoading, setImagePreview, setImageData]
  // );
  const onSubmitHandler = async (data) => {
    // console.log("data aaya data aaya ", data);
    const userData = {
      title: data.title,
      description: data.description,
      cohort_launch_date: data.cohort_launch_date,
      cohort_end_date: data.cohort_end_date,
      eligibility: data.eligibility,
      rubric_eligibility: data.rubric_eligibility,
      no_of_seats: data.no_of_seats,
    };

    console.log("userData => ", userData);

    try {
      // await actor.register_user(userData).then((result) => {
        toast.success("Registered as a User");
        // navigate("/");
        // window.location.href = "/";
      // });
      console.log("data passed to backend");
      // await dispatch(getCurrentRoleStatusRequestHandler());
      // await dispatch(userRoleHandler());
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

  const HeroImage = (
    <img
      src={Founder}
      alt="Astronaut"
      className={`z-20 w-[500px] md:w-[300px] sm:w-[250px] sxs:w-[260px] md:h-56 relative  sxs:-right-3 right-16 md:right-0 sm:right-0 top-10`}
    />
  );
  return (
    <>
      <DetailHeroSection HeroImage={HeroImage} />
      <section className="w-full h-fit px-[6%] lg1:px-[4%] py-[6%] lg1:py-[4%] bg-gray-100">
        <div className="w-full h-full bg-gray-100 pt-8">
          <div className="bg-gradient-to-r from-purple-800 to-blue-500 text-transparent bg-clip-text text-[30px]  sm:text-[25px] md1:text-[30px] md2:text-[35px] font-black font-fontUse dxl:text-[40px] p-8">
            Event Information
          </div>
          <div className="text-sm font-medium text-center text-gray-200 ">
            <form
              onSubmit={handleSubmit(onSubmitHandler)}
              className="w-full px-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {formFields?.map((field) => (
                  <div key={field.id} className="relative z-0 group mb-6">
                    <label
                      htmlFor={field.id}
                      className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                    >
                      {field.label}
                    </label>
                    <input
                      type={
                        field.id === "date_of_birth" ? inputType : field.type
                      }
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
                      <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                        {errors[field.name].message}
                      </span>
                    )}
                  </div>
                ))}
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
          </div>
        </div>
      </section>
      <Toaster />
    </>
  );
};

export default EventForm;

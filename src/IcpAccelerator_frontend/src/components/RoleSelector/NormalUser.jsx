import React, { useCallback, useEffect, useState } from "react";
import { formFields } from "../../components/Utils/Data/userFormData";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import CompressedImage from "../ImageCompressed/CompressedImage";
import { useDispatch, useSelector } from "react-redux";
// import { allHubHandlerRequest } from "../../StateManagement/Redux/Reducers/All_IcpHubReducer";
// import { AuthClient } from "@dfinity/auth-client";
import { ThreeDots } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import DetailHeroSection from "../Common/DetailHeroSection";
// import { userRoleHandler } from "../../StateManagement/Redux/Reducers/userRoleReducer";
import Founder from "../../../assets/images/founderRegistration.png";
import { useCountries } from "react-countries";
import { getCurrentRoleStatusRequestHandler } from "../StateManagement/Redux/Reducers/userCurrentRoleStatusReducer";
import { defaultUserImage } from "./Image";

const today = new Date();
const startDate = new Date("1900-01-01");

const schema = yup.object({
  full_name: yup
    .string()
    .required()
    .test("is-non-empty", null, (value) => value && value.trim().length > 0),
  user_name: yup
    .string()
    .nullable(true) // Allows the value to be null
    .test(
      "is-valid-username",
      "Username must be between 6 and 20 characters and can only contain letters, numbers, and underscores",
      (value) => {
        // If no value is provided, consider it valid (since it's optional)
        if (!value) return true;

        // Check length
        const isValidLength = value.length >= 6 && value.length <= 20;
        // Check allowed characters (including at least one uppercase letter or number)
        const hasValidChars = /^(?=.*[A-Z0-9_])[a-zA-Z0-9_]+$/.test(value);

        return isValidLength && hasValidChars;
      }
    ),
  bio: yup.string().optional(),
  email: yup.string().email().optional(),
  telegram_id: yup.string().optional().url(),
  twitter_id: yup.string().optional().url(),
  country: yup.string().required("Country is required."),
  areas_of_expertise: yup
    .string()
    .required("Selecting a interest is required."),
});

const NormalUser = () => {
  const getAllIcpHubs = useSelector((currState) => currState.hubs.allHubs);
  const areaOfExpertise = useSelector(
    (currState) => currState.expertiseIn.expertise
  );
  const actor = useSelector((currState) => currState.actors.actor);
  const userFullData = useSelector((currState) => currState.userData);

  const [inputType, setInputType] = useState("date");
  const [imageData, setImageData] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { countries } = useCountries();

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
  const addImageHandler = useCallback(
    async (file) => {
      clearErrors("imageData");
      if (!["image/jpeg", "image/png", "image/gif"].includes(file.type))
        return setError("imageData", {
          type: "manual",
          message: "Unsupported file format",
        });
      if (file.size > 1024 * 1024)
        // 1MB
        return setError("imageData", {
          type: "manual",
          message: "The file is too large",
        });

      setIsLoading(true);
      try {
        const compressedFile = await CompressedImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
          setIsLoading(false);
        };
        reader.readAsDataURL(compressedFile);

        const byteArray = await compressedFile.arrayBuffer();
        setImageData(Array.from(new Uint8Array(byteArray)));
        console.log("imageData", Array.from(new Uint8Array(byteArray)));
        clearErrors("imageData");
      } catch (error) {
        console.error("Error processing the image:", error);
        setError("imageData", {
          type: "manual",
          message: "Could not process image, please try another.",
        });
        setIsLoading(false);
      }
    },
    [setError, clearErrors, setIsLoading, setImagePreview, setImageData]
  );
  const onSubmitHandler = async (data) => {
    // console.log("data aaya data aaya ", data);
   console.log(" setImageData(defaultUserImage)",defaultUserImage)
    const userData = {
      full_name: data.full_name,
      openchat_username: [data.user_name],
      bio: [data.bio],
      email: [data.email],
      telegram_id: [data.telegram_id.toString()],
      twitter_id: [data.twitter_id.toString()],
      country: data.country,
      area_of_intrest: data.areas_of_expertise,
      profile_picture:  imageData ? [imageData] : [defaultUserImage],
    };

    console.log("userData => ", userData);

    try {
      await actor.register_user(userData).then((result) => {
        toast.success("Registered as a User");
        // navigate("/");
        // window.location.href = "/";
      });
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
            User Information
          </div>
          <div className="text-sm font-medium text-center text-gray-200 ">
            <form
              onSubmit={handleSubmit(onSubmitHandler)}
              className="w-full px-4"
            >
              <div className="flex flex-col">
                <div className="flex-row w-full flex justify-start gap-4 items-center">
                  <div className="mb-3 ml-6 h-24 w-24 rounded-full border-2 border-gray-300 flex items-center justify-center overflow-hidden">
                    {isLoading ? (
                      <div>Loading...</div>
                    ) : imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : formFields.imageData ? (
                      <img
                        src={formFields?.imageData}
                        alt="User"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <svg
                        width="35"
                        height="37"
                        viewBox="0 0 35 37"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="bg-no-repeat"
                      >
                        <path
                          d="M8.53049 8.62583C8.5304 13.3783 12.3575 17.2449 17.0605 17.2438C21.7634 17.2428 25.5907 13.3744 25.5908 8.62196C25.5909 3.8695 21.7638 0.00287764 17.0608 0.00394405C12.3579 0.00501045 8.53058 3.87336 8.53049 8.62583ZM32.2249 36.3959L34.1204 36.3954L34.1205 34.4799C34.1206 27.0878 28.1667 21.0724 20.8516 21.0741L13.2692 21.0758C5.95224 21.0775 -3.41468e-05 27.0955 -0.000176714 34.4876L-0.000213659 36.4032L32.2249 36.3959Z"
                          fill="#BBBBBB"
                        />
                      </svg>
                    )}
                  </div>

                  <Controller
                    name="imageData"
                    control={control}
                    render={({ field }) => (
                      <>
                        <input
                          id="images"
                          type="file"
                          name="images"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            addImageHandler(file);
                          }}
                        />
                        <label
                          htmlFor="images"
                          className="p-2 border-2 border-blue-800 items-center rounded-md text-md bg-transparent text-blue-800 cursor-pointer font-extrabold"
                        >
                          Upload Image
                        </label>
                      </>
                    )}
                  />
                </div>
                {errors.imageData && (
                  <span className="mt-1 text-sm text-red-500 font-bold text-start px-4">
                    {errors.imageData.message}
                  </span>
                )}
              </div>
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

                <div className="z-0 w-full group">
                  <label
                    htmlFor="country"
                    className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                  >
                    Please select your Country.
                  </label>
                  <select
                    {...register("country")}
                    className={`bg-gray-50 border-2 ${
                      errors.country
                        ? "border-red-500 placeholder:text-red-500"
                        : "border-[#737373]"
                    } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                  >
                    <option className="text-lg font-bold" value="">
                      select your Country ⌄
                    </option>
                    {countries?.map((expert) => (
                      <option
                        key={expert.name}
                        value={`${expert.name}`}
                        className="text-lg font-bold"
                      >
                        {expert.name}
                      </option>
                    ))}
                  </select>

                  {errors.country && (
                    <p className="text-red-500 text-xs italic">
                      {errors.country.message}
                    </p>
                  )}
                </div>
                <div className="z-0 w-full group">
                  <label
                    htmlFor="areas_of_expertise"
                    className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                  >
                    What are your interests?
                  </label>
                  <select
                    {...register("areas_of_expertise")}
                    className={`bg-gray-50 border-2 ${
                      errors.areas_of_expertise
                        ? "border-red-500 placeholder:text-red-500"
                        : "border-[#737373]"
                    } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                  >
                    <option className="text-lg font-bold" value="">
                      interests ⌄
                    </option>
                    {areaOfExpertise?.map((expert) => (
                      <option
                        key={expert.id}
                        value={`${expert.name}`}
                        className="text-lg font-bold"
                      >
                        {expert.name}
                      </option>
                    ))}
                  </select>
                  {errors.areas_of_expertise && (
                    <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                      {errors.areas_of_expertise.message}
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
                      wrapperClass=""
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

export default NormalUser;

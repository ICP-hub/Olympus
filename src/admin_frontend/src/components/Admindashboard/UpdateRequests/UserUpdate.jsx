import React, { useState, useEffect } from "react";
import "react-circular-progressbar/dist/styles.css";
import {
  noDataPresentSvg,
  place,
  telegramSVg,
  websiteSvg,
} from "../../Utils/AdminData/SvgData";
import { uint8ArrayToBase64 } from "../../Utils/AdminData/saga_function/blobImageToUrl";
import { useSelector } from "react-redux";
import { ThreeDots } from "react-loader-spinner";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import openchat_username from "../../../../assets/image/spinner.png";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { useCountries } from "react-countries";
import ReactSelect from "react-select";
import toast, { Toaster } from "react-hot-toast";
import { twitterSvg } from "../../../../../IcpAccelerator_frontend/src/components/Utils/Data/SvgData";
import { Principal } from "@dfinity/principal";
import CompressedImage from "../../../../../IcpAccelerator_frontend/src/components/ImageCompressed/CompressedImage";

const validationSchema = yup
  .object()
  .shape({
    full_name: yup
      .string()
      .test("is-non-empty", "Full name is required", (value) =>
        /\S/.test(value)
      )
      .required("Full name is required"),
    email: yup.string().email("Invalid email").nullable(true).optional(),
    telegram_id: yup
      .string()
      .nullable(true)
      .optional()
      // .test("is-valid-telegram", "Invalid Telegram link", (value) => {
      //   if (!value) return true;
      //   const hasValidChars = /^[a-zA-Z0-9_]{5,32}$/.test(value);
      //   return hasValidChars;
      // })
      .url("Invalid url"),
    twitter_url: yup
      .string()
      .nullable(true)
      .optional()
      // .test("is-valid-twitter", "Invalid Twitter ID", (value) => {
      //   if (!value) return true;
      //   const hasValidChars =
      //   /^(https?:\/\/)?(www\.)?(twitter\.com|x\.com)\/[a-zA-Z0-9_]{1,15}$/.test(
      //       value
      //     );
      //   return hasValidChars;
      // })
      .url("Invalid url"),
    openchat_user_name: yup
      .string()
      .nullable(true)
      .test(
        "is-valid-username",
        "Username must be between 6 and 20 characters and can only contain letters, numbers, and underscores",
        (value) => {
          if (!value) return true;
          const isValidLength = value.length >= 6 && value.length <= 20;
          const hasValidChars = /^(?=.*[A-Z0-9_])[a-zA-Z0-9_]+$/.test(value);
          return isValidLength && hasValidChars;
        }
      ),
    bio: yup
      .string()
      .optional()
      .test(
        "maxWords",
        "Bio must not exceed 50 words",
        (value) =>
          !value || value.trim().split(/\s+/).filter(Boolean).length <= 50
      )
      .test(
        "maxChars",
        "Bio must not exceed 500 characters",
        (value) => !value || value.length <= 500
      ),
    country: yup
      .string()
      .test("is-non-empty", "Country is required", (value) => /\S/.test(value))
      .required("Country is required"),
    domains_interested_in: yup
      .string()
      .test("is-non-empty", "Selecting an interest is required", (value) =>
        /\S/.test(value)
      )
      .required("Selecting an interest is required"),
    type_of_profile: yup
      .string()
      .test("is-non-empty", "Type of profile is required", (value) =>
        /\S/.test(value)
      )
      .required("Type of profile is required"),
    reasons_to_join_platform: yup
      .string()
      .test("is-non-empty", "Selecting a reason is required", (value) =>
        /\S/.test(value)
      )
      .required("Selecting a reason is required"),

    image: yup
      .mixed()
      .nullable(true)
      .test("fileSize", "File size max 10MB allowed", (value) => {
        return !value || (value && value.size <= 10 * 1024 * 1024); // 10 MB limit
      })
      .test("fileType", "Only jpeg, jpg & png file format allowed", (value) => {
        return (
          !value ||
          (value &&
            ["image/jpeg", "image/jpg", "image/png"].includes(value.type))
        );
      }),
  })
  .required();

const UserUpdate = () => {
  const actor = useSelector((currState) => currState.actors.actor);
  const [orignalData, setOrignalData] = useState(null);
  const [updatedData, setUpdatedData] = useState(null);
  const [isSkillsOpen, setIsSkillsOpen] = useState(false);
  const [isReasonToJoinOpen, setIsReasonToJoinOpen] = useState(false);
  const { countries } = useCountries();
  const areaOfExpertise = useSelector(
    (currState) => currState.expertise.expertise
  );
  const typeOfProfile = useSelector(
    (currState) => currState.profileTypes.profiles
  );
  // STATES

  // user image states
  const [imagePreview, setImagePreview] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [editMode, setEditMode] = useState(null);
  const [principal, setPrincipal] = useState("");
  // default & static options states
  const [interestedDomainsOptions, setInterestedDomainsOptions] = useState([]);
  const [
    interestedDomainsSelectedOptions,
    setInterestedDomainsSelectedOptions,
  ] = useState([]);
  const [typeOfProfileOptions, setTypeOfProfileOptions] = useState([]);

  const [reasonOfJoiningOptions, setReasonOfJoiningOptions] = useState([
    { value: "listing_and_promotion", label: "Project listing and promotion" },
    { value: "Funding", label: "Funding" },
    { value: "Mentoring", label: "Mentoring" },
    { value: "Incubation", label: "Incubation" },
    {
      value: "Engaging_and_building_community",
      label: "Engaging and building community",
    },
    { value: "Jobs", label: "Jobs" },
  ]);
  const [reasonOfJoiningSelectedOptions, setReasonOfJoiningSelectedOptions] =
    useState([]);
  const [showOriginalProfile, setShowOriginalProfile] = useState(true);

  // const navigate = useNavigate();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  console.log("location", location.state);

  const principalId = location.state;
  const {
    register,
    handleSubmit,
    clearErrors,
    setValue,
    getValues,
    setError,
    watch,
    control,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "all",
    defaultValues: {
      bio: "",
    },
  });

  // image creation function compression and uintarray creator
  const imageCreationFunc = async (file) => {
    const result = await trigger("image");
    if (result) {
      try {
        const compressedFile = await CompressedImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
          setImageData(reader.result);
        };
        reader.readAsDataURL(compressedFile);
        const byteArray = await compressedFile.arrayBuffer();
        // console.log("byteArray Image ==>", byteArray);
        setImageData(Array.from(new Uint8Array(byteArray)));
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

  useEffect(() => {
    const fetchUserData = async () => {
      const convertedPrincipal = await Principal.fromText(principalId);
      console.log("convertedPrincipal", convertedPrincipal);
      try {
        await actor
          .get_user_info_using_principal(convertedPrincipal)
          .then((data) => {
            console.log("Received data in user update:", data);

            const originalInfo = data[0]?.params;
            const updatedInfo = data[0]?.params;
            console.log("Original Info:", originalInfo);
            console.log("updated Info:", updatedInfo);

            if (data && data.length > 0) {
              setOrignalData({
                areaOfInterest: originalInfo?.area_of_interest,
                email: originalInfo?.email[0],
                bio: originalInfo?.bio?.[0] ?? [],
                country: originalInfo?.country,
                fullName: originalInfo?.full_name,
                openchatUsername: originalInfo.openchat_username?.[0],

                profilePicture:
                  originalInfo?.profile_picture?.[0].length > 0
                    ? uint8ArrayToBase64(originalInfo?.profile_picture[0])
                    : null,

                reasonToJoin: originalInfo?.reason_to_join?.[0],
                telegram: originalInfo?.telegram_id?.[0],
                twitter: originalInfo?.twitter_id?.[0],
                typeOfProfile: originalInfo?.type_of_profile?.[0],
              });

              setUpdatedData({
                areaOfInterest: updatedInfo?.area_of_interest,

                email: updatedInfo?.email[0],
                bio: updatedInfo?.bio?.[0] ?? [],
                country: updatedInfo?.country,
                fullName: updatedInfo?.full_name,
                openchatUsername: updatedInfo.openchat_username?.[0],
                profilePicture:
                  updatedInfo?.profile_picture?.[0].length > 0
                    ? uint8ArrayToBase64(updatedInfo?.profile_picture[0])
                    : null,
                reasonToJoin: updatedInfo?.reason_to_join?.[0],
                telegram: updatedInfo?.telegram_id?.[0],
                twitter: updatedInfo?.twitter_id?.[0],
                typeOfProfile: updatedInfo?.type_of_profile?.[0],
              });
            } else {
              console.error("Unexpected data structure:", data);
              setOrignalData({});
              setUpdatedData({});
            }
          })
          .catch((error) => {
            console.error("Error fetching project data:", error);
          });
      } catch (error) {
        console.error("Error fetching project data:", error);
      }
    };

    if (actor) {
      fetchUserData();
    }
  }, [actor]);

  // default interests set function
  const setInterestedDomainsSelectedOptionsHandler = (val) => {
    setInterestedDomainsSelectedOptions(
      val
        ? val
            ?.split(", ")
            ?.map((interest) => ({ value: interest, label: interest }))
        : []
    );
  };

  // default reasons set function
  const setReasonOfJoiningSelectedOptionsHandler = (val) => {
    setReasonOfJoiningSelectedOptions(
      val && val.length > 0
        ? val?.map((reason) => ({ value: reason, label: reason }))
        : []
    );
  };
  // set user values handler
  const setUserValuesHandler = (val) => {
    console.log("val", val);
    if (val) {
      setValue("full_name", val?.fullName ?? "");
      setValue("email", val?.email ?? "");
      setValue("telegram_id", val?.telegram ?? "");
      setValue("twitter_url", val?.twitter ?? "");
      setValue("openchat_user_name", val?.openchatUsername ?? "");
      setValue("bio", val?.bio ?? "");
      setValue("country", val?.country ?? "");
      setValue("domains_interested_in", val?.areaOfInterest ?? "");
      setInterestedDomainsSelectedOptionsHandler(val?.areaOfInterest ?? null);
      setImagePreview(val?.profilePicture ?? "");
      // setImagePreview(
      //   val?.profile_picture instanceof Uint8Array
      //     ? uint8ArrayToBase64(val?.profile_picture)
      //     : ""
      // );
      setImageData(
        val?.profile_picture instanceof Uint8Array
          ? uint8ArrayToBase64(val?.profile_picture)
          : ""
      );
      setValue("type_of_profile", val?.typeOfProfile);
      setValue(
        "reasons_to_join_platform",
        val?.reasonToJoin ? val?.reasonToJoin.join(", ") : ""
      );
      setReasonOfJoiningSelectedOptionsHandler(val?.reasonToJoin);
    }
  };

  console.log("imageData", imageData);
  // Get data from redux useEffect
  useEffect(() => {
    if (areaOfExpertise) {
      setInterestedDomainsOptions(
        areaOfExpertise?.map((expert) => ({
          value: expert.name,
          label: expert.name,
        }))
      );
    } else {
      setInterestedDomainsOptions([]);
    }
  }, [areaOfExpertise]);

  useEffect(() => {
    if (typeOfProfile) {
      setTypeOfProfileOptions(
        typeOfProfile?.map((type) => ({
          value: type.role_type.toLowerCase(),
          label: type.role_type,
        }))
      );
    } else {
      setTypeOfProfileOptions([]);
    }
  }, [typeOfProfile]);

  useEffect(() => {
    if (updatedData) {
      console.log("User full data ==>", updatedData);
      setUserValuesHandler(updatedData);
      //  setEditMode(true);
    } else {
      setUserValuesHandler("");
    }
  }, [updatedData]);

  // form submit handler func
  const onSubmitHandler = async (data) => {
    console.log("data", data);
    const convertedPrincipal = await Principal.fromText(principalId);
    console.log("convertedPrincipal", convertedPrincipal);
    if (actor) {
      const user_data = {
        bio: data?.bio ? [data.bio] : [""],
        full_name: data?.full_name,
        email: [data?.email],
        telegram_id: [data?.telegram_id.toString()],
        twitter_id: [data?.twitter_url.toString()],
        openchat_username: [data?.openchat_user_name],
        country: data?.country,
        area_of_interest: data?.domains_interested_in,
        type_of_profile: [data?.type_of_profile || ""],
        reason_to_join: [
          data?.reasons_to_join_platform
            ?.split(",")
            ?.map((val) => val.trim()) || [""],
        ],
        profile_picture: imageData ? [imageData] : [],
      };
      try {
        console.log("user_data", user_data);
        await actor
          .update_user_data(convertedPrincipal, user_data)
          .then((result) => {
            console.log("update_user_data", result);
            if ("Ok" in result) {
              toast.success("User profile updated successfully");
              setTimeout(() => {
                window.location.href = "/";
              }, 500);
            } else {
              console.log("error");
              toast.error(result);
            }
          })
          .catch((error) => {
            console.log("Error===>", error);
          });
      } catch (error) {
        toast.error(error);
        console.error("Error sending data to the backend:", error);
      }
    } else {
      toast.error("Please signup with internet identity first");
      window.location.href = "/";
    }
  };

  // form error handler func
  const onErrorHandler = (val) => {
    console.log(val);
    toast.error("Empty fields or invalid values, please recheck the form");
  };

  const handleSwitchEditMode = () => {
    setEditMode(true);
    setIsSkillsOpen(true);
    setIsReasonToJoinOpen(true);
    setShowOriginalProfile(false);
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmitHandler, onErrorHandler)}>
        <div className="container mx-auto p-6 bg-[#D2D5F2] my-4 rounded-lg shadow-lg">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-black to-gray-800 text-transparent bg-clip-text">
              User Profile
            </h1>
            <div
              className="flex items-center bg-customBlue text-white text-sm font-semibold rounded-lg p-3 cursor-pointer"
              onClick={handleSwitchEditMode}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className="w-6 h-6"
                fill="currentColor"
              >
                <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z" />
              </svg>
              <span className="ml-2">Edit</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6">
            <div className="w-full sm:w-1/3 bg-transparent p-6 rounded-lg shadow-md">
              <div className="flex flex-col items-center">
                <div
                  className="relative w-44 h-44 rounded-full bg-cover bg-center mb-4"
                  style={{
                    backgroundImage: `url(${orignalData?.profilePicture}), linear-gradient(168deg, rgba(255, 255, 255, 0.25) -0.86%, rgba(255, 255, 255, 0) 103.57%)`,
                  }}
                >
                  <img
                    className="w-full h-full rounded-full object-cover"
                    src={orignalData?.profilePicture}
                    alt="Profile"
                  />
                </div>
                <div className="flex space-x-2">
                  <span
                    className="w-3 h-3 bg-red-700 rounded-full cursor-pointer"
                    onClick={() => setShowOriginalProfile(true)}
                  ></span>
                  <span
                    className="w-3 h-3 bg-green-700 rounded-full cursor-pointer"
                    onClick={() => setShowOriginalProfile(false)}
                  ></span>
                </div>
              </div>
            </div>

            <div className="w-full sm:w-2/3 bg-transparent p-6 rounded-lg shadow-md">
              <div className="flex flex-col space-y-4">
                <div className="flex flex-col">
                  <label className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                    <h1 className="text-2xl font-bold bg-black text-transparent bg-clip-text">
                      {orignalData?.fullName ?? "Not available"}
                    </h1>
                  </label>
                  {editMode && (
                    <input
                      type="text"
                      {...register("full_name")}
                      className={`mt-2 p-2 border-2 rounded-lg ${
                        errors?.full_name ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter your full name"
                    />
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      className="w-4 h-4"
                      fill="currentColor"
                    >
                      <path d="M256 64C150 64 64 150 64 256s86 192 192 192c17.7 0 32 14.3 32 32s-14.3 32-32 32C114.6 512 0 397.4 0 256S114.6 0 256 0S512 114.6 512 256v32c0 53-43 96-96 96c-29.3 0-55.6-13.2-73.2-33.9C320 371.1 289.5 384 256 384c-70.7 0-128-57.3-128-128s57.3-128 128-128c27.9 0 53.7 8.9 74.7 24.1c5.7-5 13.1-8.1 21.3-8.1c17.7 0 32 14.3 32 32v80 32c0 17.7 14.3 32 32 32s32-14.3 32-32V256c0-106-86-192-192-192zm64 192a64 64 0 1 0 -128 0 64 64 0 1 0 128 0z" />
                    </svg>
                    <span className="line-clamp-1">
                      {orignalData?.email ?? "Not available"}
                    </span>
                  </label>
                  {editMode && (
                    <input
                      type="email"
                      {...register("email")}
                      className={`mt-2 p-2 border-2 rounded-lg ${
                        errors?.email ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter your email"
                    />
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                    <span>{place}</span>
                    <span className="underline">
                      {orignalData?.country ?? "Not available"}
                    </span>
                  </label>
                  {editMode && (
                    <select
                      {...register("country")}
                      className={`mt-2 p-2 border-2 rounded-lg ${
                        errors.country ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="">Select your country</option>
                      {countries?.map((country) => (
                        <option key={country.name} value={country.name}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                    <span>OpenChat Username:</span>
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      {...register("openchat_user_name")}
                      className={`mt-2 p-2 border-2 rounded-lg ${
                        errors?.openchat_user_name
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter openchat username"
                    />
                  ) : (
                    <span>
                      {orignalData?.openchatUsername ?? "Not available"}
                    </span>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                    <span>Bio:</span>
                  </label>
                  {editMode ? (
                    <textarea
                      {...register("bio")}
                      className={`mt-2 p-2 border-2 rounded-lg ${
                        errors?.bio ? "border-red-500" : "border-gray-300"
                      } h-32`}
                      placeholder="Enter your bio"
                    ></textarea>
                  ) : (
                    <p className="mt-2 p-2 ">
                      {orignalData?.bio ?? "Bio not available"}
                    </p>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                    <span>Telegram:</span>
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      {...register("telegram_id")}
                      className={`mt-2 p-2 border-2 rounded-lg ${
                        errors?.telegram_id
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter your telegram id"
                    />
                  ) : (
                    <span className="mt-2">
                      {orignalData?.telegram ?? "Not available"}
                    </span>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                    <span>Twitter:</span>
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      {...register("twitter_url")}
                      className={`mt-2 p-2 border-2 rounded-lg ${
                        errors?.twitter_url
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter your twitter url"
                    />
                  ) : (
                    <span className="mt-2">
                      {orignalData?.twitter ?? "Not available"}
                    </span>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                    <span>Skills:</span>
                  </label>
                  {editMode ? (
                    <ReactSelect
                      isMulti
                      menuPortalTarget={document.body}
                      menuPosition={"fixed"}
                      styles={{
                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        control: (provided) => ({
                          ...provided,
                          paddingBlock: "0px",
                          borderRadius: "8px",
                          border: errors.domains_interested_in
                            ? "2px solid #ef4444"
                            : "2px solid #737373",
                          backgroundColor: "rgb(249 250 251)",
                          "&::placeholder": {
                            color: errors.domains_interested_in
                              ? "#ef4444"
                              : "currentColor",
                          },
                        }),
                      }}
                      value={interestedDomainsSelectedOptions}
                      options={interestedDomainsOptions}
                      classNamePrefix="select"
                      className="basic-multi-select mt-2"
                      placeholder="Select domains you are interested in"
                      onChange={(selectedOptions) => {
                        if (selectedOptions && selectedOptions.length > 0) {
                          setInterestedDomainsSelectedOptions(selectedOptions);
                          clearErrors("domains_interested_in");
                          setValue(
                            "domains_interested_in",
                            selectedOptions
                              .map((option) => option.value)
                              .join(", "),
                            { shouldValidate: true }
                          );
                        } else {
                          setInterestedDomainsSelectedOptions([]);
                          setValue("domains_interested_in", "", {
                            shouldValidate: true,
                          });
                          setError("domains_interested_in", {
                            type: "required",
                            message: "Selecting an interest is required",
                          });
                        }
                      }}
                    />
                  ) : (
                    <div className="flex gap-2 mt-2">
                      {orignalData?.areaOfInterest
                        ?.split(",")
                        .map((skill, index) => (
                          <span
                            key={index}
                            className="text-xs border-2 rounded-2xl px-2 py-1 font-bold bg-[#c9c5c5]"
                          >
                            {skill.trim()}
                          </span>
                        )) ?? "Not available"}
                    </div>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                    <span>Reason to join:</span>
                  </label>
                  {editMode ? (
                    <ReactSelect
                      isMulti
                      menuPortalTarget={document.body}
                      menuPosition={"fixed"}
                      styles={{
                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        control: (provided) => ({
                          ...provided,
                          paddingBlock: "0px",
                          borderRadius: "8px",
                          border: errors.reasons_to_join_platform
                            ? "2px solid #ef4444"
                            : "2px solid #737373",
                          backgroundColor: "rgb(249 250 251)",
                          "&::placeholder": {
                            color: errors.reasons_to_join_platform
                              ? "#ef4444"
                              : "currentColor",
                          },
                        }),
                      }}
                      value={reasonOfJoiningSelectedOptions}
                      options={reasonOfJoiningOptions}
                      classNamePrefix="select"
                      className="basic-multi-select mt-2"
                      placeholder="Select your reasons to join this platform"
                      onChange={(selectedOptions) => {
                        if (selectedOptions && selectedOptions.length > 0) {
                          setReasonOfJoiningSelectedOptions(selectedOptions);
                          clearErrors("reasons_to_join_platform");
                          setValue(
                            "reasons_to_join_platform",
                            selectedOptions
                              .map((option) => option.value)
                              .join(", "),
                            { shouldValidate: true }
                          );
                        } else {
                          setReasonOfJoiningSelectedOptions([]);
                          setValue("reasons_to_join_platform", "", {
                            shouldValidate: true,
                          });
                          setError("reasons_to_join_platform", {
                            type: "required",
                            message: "Selecting a reason is required",
                          });
                        }
                      }}
                    />
                  ) : (
                    <div className="flex gap-2 mt-2">
                      {orignalData?.reasonToJoin?.map((reason, index) => (
                        <span
                          key={index}
                          className="text-xs border-2 rounded-2xl px-2 py-1 font-bold bg-[#c9c5c5]"
                        >
                          {reason.replace(/_/g, " ")}
                        </span>
                      )) ?? "Not available"}
                    </div>
                  )}
                </div>
                <div className="flex flex-col">
                  <label className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                    <span>What type of profile are you referring to?</span>
                  </label>
                  {editMode ? (
                    <select
                      {...register("type_of_profile")}
                      className={`mt-2 p-2 border-2 rounded-lg ${
                        errors.type_of_profile
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    >
                      <option className="text-lg font-bold" value="">
                        Select profile type
                      </option>
                      {typeOfProfileOptions &&
                        typeOfProfileOptions.map((val, index) => {
                          return (
                            <option
                              className="text-lg font-bold"
                              key={index}
                              value={val?.value}
                            >
                              {val?.label}
                            </option>
                          );
                        })}
                    </select>
                  ) : (
                    <span>{orignalData?.typeOfProfile ?? "Not available"}</span>
                  )}{" "}
                </div>
              </div>
            </div>
          </div>

          {editMode ? (
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
                  "Update"
                )}
              </button>
            </div>
          ) : (
            ""
          )}
        </div>
      </form>
      <Toaster />
    </>
  );
};

export default UserUpdate;

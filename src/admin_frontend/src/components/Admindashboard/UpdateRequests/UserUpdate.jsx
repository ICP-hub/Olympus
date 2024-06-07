import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useCountries } from "react-countries";
import CompressedImage from "../../../../../IcpAccelerator_frontend/src/components/ImageCompressed/CompressedImage";

const UserUpdate = () => {
  const { countries } = useCountries();
  const actor = useSelector((currState) => currState.actors.actor);
  const areaOfExpertise = useSelector(
    (currState) => currState.expertiseIn.expertise
  );
  const typeOfProfile = useSelector(
    (currState) => currState.profileTypes.profiles
  );
  const userFullData = useSelector((currState) => currState.userData.data.Ok);

  // STATES

  // user image states
  const [imagePreview, setImagePreview] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [editMode, setEditMode] = useState(null);

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

  // user reg form validation schema
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
          "Username must be between 5 and 20 characters",
          (value) => {
            if (!value) return true;
            const isValidLength = value.length >= 5 && value.length <= 20;
            // const hasValidChars = /^(?=.*[A-Z0-9_])[a-zA-Z0-9_]+$/.test(value);
            return isValidLength;
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
        .test("is-non-empty", "Country is required", (value) =>
          /\S/.test(value)
        )
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
        .test(
          "fileType",
          "Only jpeg, jpg & png file format allowed",
          (value) => {
            return (
              !value ||
              (value &&
                ["image/jpeg", "image/jpg", "image/png"].includes(value.type))
            );
          }
        ),
    })
    .required();

  const {
    register,
    handleSubmit,
    reset,
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
        };
        reader.readAsDataURL(compressedFile);
        const byteArray = await compressedFile.arrayBuffer();
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

  // form submit handler func
  const onSubmitHandler = async (data) => {
    if (actor) {
      const userData = {
        full_name: data?.full_name,
        email: [data?.email],
        telegram_id: [data?.telegram_id.toString()],
        twitter_id: [data?.twitter_url.toString()],
        openchat_username: [data?.openchat_user_name],
        bio: [data?.bio],
        country: data?.country,
        area_of_interest: data?.domains_interested_in,
        type_of_profile: [data?.type_of_profile || ""],
        reason_to_join: [
          data?.reasons_to_join_platform
            .split(",")
            .map((val) => val.trim()) || [""],
        ],
        profile_picture: imageData ? [imageData] : [],
      };
      try {
        await actor.register_user(userData).then((result) => {
          if (result && result.includes("User registered successfully")) {
            toast.success("Registered as a User");
            window.location.href = "/";
          } else {
            toast.error("Something got wrong");
          }
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
    toast.error("Empty fields or invalid values, please recheck the form");
  };

  // default interests set function
  const setInterestedDomainsSelectedOptionsHandler = (val) => {
    setInterestedDomainsSelectedOptions(
      val
        ? val
            .split(", ")
            .map((interest) => ({ value: interest, label: interest }))
        : []
    );
  };

  // default reasons set function
  const setReasonOfJoiningSelectedOptionsHandler = (val) => {
    setReasonOfJoiningSelectedOptions(
      val && val.length > 0 && val[0].length > 0
        ? val[0].map((reason) => ({ value: reason, label: reason }))
        : []
    );
  };

  // set values handler
  const setValuesHandler = (val) => {
    if (val) {
      setValue("full_name", val?.full_name ?? "");
      setValue("email", val?.email?.[0] ?? "");
      setValue("telegram_id", val?.telegram_id?.[0] ?? "");
      setValue("twitter_url", val?.twitter_id?.[0] ?? "");
      setValue("openchat_user_name", val?.openchat_username?.[0] ?? "");
      setValue("bio", val?.bio?.[0] ?? "");
      setValue("country", val?.country ?? "");
      setValue("domains_interested_in", val?.area_of_interest ?? "");
      setInterestedDomainsSelectedOptionsHandler(val?.area_of_interest ?? null);
      setImagePreview(val?.profile_picture?.[0] ?? "");
      setValue("type_of_profile", val?.type_of_profile?.[0]);
      setValue(
        "reasons_to_join_platform",
        val?.reason_to_join ? val?.reason_to_join.join(", ") : ""
      );
      setReasonOfJoiningSelectedOptionsHandler(val?.reason_to_join);
    }
  };

  // Get data from redux useEffect
  useEffect(() => {
    if (areaOfExpertise) {
      setInterestedDomainsOptions(
        areaOfExpertise.map((expert) => ({
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
        typeOfProfile.map((type) => ({
          value: type.role_type.toLowerCase(),
          label: type.role_type,
        }))
      );
    } else {
      setTypeOfProfileOptions([]);
    }
  }, [typeOfProfile]);

  useEffect(() => {
    if (userFullData) {
      setValuesHandler(userFullData);
      setEditMode(true);
    }
  }, [userFullData]);

  return (
    <>
      <div className=" bg-[#D2D5F2]  shadow-md shadow-gray-400 p-6 rounded-lg md:w-1/4 w-full">
        <div className="div">
          {showOriginalProfile ? (
            <div className="justify-center flex items-center">
              <div
                className="size-fit  rounded-full bg-no-repeat bg-center bg-cover relative p-1 bg-blend-overlay border-2 border-gray-300"
                style={{
                  backgroundImage: `url(${orignalData?.userProfilePicture}), linear-gradient(168deg, rgba(255, 255, 255, 0.25) -0.86%, rgba(255, 255, 255, 0) 103.57%)`,
                  backdropFilter: "blur(20px)",
                }}
              >
                <img
                  className="object-cover size-44 max-h-44 rounded-full"
                  src={orignalData?.userProfilePicture}
                  alt=""
                />
              </div>
            </div>
          ) : (
            <div>
              <div className="justify-center flex items-center">
                <div
                  className="size-fit  rounded-full bg-no-repeat bg-center bg-cover relative p-1 bg-blend-overlay border-2 border-gray-300"
                  style={{
                    backgroundImage: `url(${updatedData?.userProfilePicture}), linear-gradient(168deg, rgba(255, 255, 255, 0.25) -0.86%, rgba(255, 255, 255, 0) 103.57%)`,
                    backdropFilter: "blur(20px)",
                  }}
                >
                  <img
                    className="object-cover size-44 max-h-44 rounded-full"
                    src={updatedData?.userProfilePicture}
                    alt=""
                  />
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-center p-2 gap-2">
            <span
              className="w-2 h-2 bg-red-700 rounded-full"
              onClick={() => setShowOriginalProfile(true)}
            ></span>
            <span
              className="w-2 h-2 bg-green-700 rounded-full"
              onClick={() => setShowOriginalProfile(false)}
            ></span>
          </div>
        </div>
        <div className="flex flex-col ml-4 w-auto justify-start md:mb-0 mb-6">
          <div className="flex flex-col mb-2">
            <div className="flex space-x-2 items-center flex-row">
              <span className="w-2 h-2 bg-red-700 rounded-full"></span>
              <h1 className="md:text-3xl text-xl md:font-extrabold font-bold  bg-black text-transparent bg-clip-text">
                {orignalData?.userFullName}
              </h1>
            </div>
            <div className="flex space-x-2 items-center flex-row mt-1">
              <span className="w-2 h-2 bg-green-700 rounded-full"></span>
              <h1 className="md:text-3xl text-xl md:font-extrabold font-bold  bg-black text-transparent bg-clip-text">
                {updatedData?.userFullName}
              </h1>
            </div>
          </div>
          <div className="text-gray-500 md:text-md text-sm font-normal flex mb-2">
            <div className="flex flex-col mb-2">
              <div className="flex space-x-2 items-center flex-row">
                <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  className="size-4 "
                  fill="currentColor"
                >
                  <path d="M256 64C150 64 64 150 64 256s86 192 192 192c17.7 0 32 14.3 32 32s-14.3 32-32 32C114.6 512 0 397.4 0 256S114.6 0 256 0S512 114.6 512 256v32c0 53-43 96-96 96c-29.3 0-55.6-13.2-73.2-33.9C320 371.1 289.5 384 256 384c-70.7 0-128-57.3-128-128s57.3-128 128-128c27.9 0 53.7 8.9 74.7 24.1c5.7-5 13.1-8.1 21.3-8.1c17.7 0 32 14.3 32 32v80 32c0 17.7 14.3 32 32 32s32-14.3 32-32V256c0-106-86-192-192-192zm64 192a64 64 0 1 0 -128 0 64 64 0 1 0 128 0z" />
                </svg>
                <span className="ml-2 truncate">{orignalData.userEmail}</span>
              </div>
              <div className="flex space-x-2 items-center flex-row mt-1">
                <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    className="size-4 "
                    fill="currentColor"
                  >
                    <path d="M256 64C150 64 64 150 64 256s86 192 192 192c17.7 0 32 14.3 32 32s-14.3 32-32 32C114.6 512 0 397.4 0 256S114.6 0 256 0S512 114.6 512 256v32c0 53-43 96-96 96c-29.3 0-55.6-13.2-73.2-33.9C320 371.1 289.5 384 256 384c-70.7 0-128-57.3-128-128s57.3-128 128-128c27.9 0 53.7 8.9 74.7 24.1c5.7-5 13.1-8.1 21.3-8.1c17.7 0 32 14.3 32 32v80 32c0 17.7 14.3 32 32 32s32-14.3 32-32V256c0-106-86-192-192-192zm64 192a64 64 0 1 0 -128 0 64 64 0 1 0 128 0z" />
                  </svg>
                  <span className="ml-2 truncate">
                    {updatedData?.userEmail}
                  </span>
                </>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start text-sm">
            <div className="flex flex-col mb-2">
              <div className="flex flex-row  text-gray-600 space-x-2 items-center">
                <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                {place}
                <div className="underline ">{orignalData?.userCountry}</div>
              </div>
              <div className="flex space-x-2 items-center flex-row text-gray-600">
                <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                <>
                  {place}
                  <div className="underline ">{updatedData?.userCountry}</div>
                </>
              </div>
            </div>
            <div className="flex flex-col mb-2">
              <div className="flex flex-row  text-gray-600 space-x-2 items-center">
                <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                <img
                  src={openchat_username}
                  alt="openchat_username"
                  className="size-5"
                />
                <div className="ml-2">{orignalData?.openchatUsername}</div>
              </div>
              <div className="flex space-x-2 items-center flex-row text-gray-600 mt-1">
                <span className="w-2 h-2 bg-green-700 rounded-full"></span>{" "}
                <>
                  <img
                    src={openchat_username}
                    alt="openchat_username"
                    className="size-5"
                  />
                  <div className="ml-2">{updatedData?.openchatUsername}</div>
                </>
              </div>
            </div>

            <div className="flex flex-col mb-2">
              <div className="flex flex-col  text-gray-600 space-x-2">
                <div className="flex flex-row  text-gray-600 space-x-2 items-center">
                  <span className="w-2 h-2 bg-red-700 rounded-full"></span>

                  <div className="text-black font-semibold">Skill :</div>
                </div>
                <div className="flex gap-2 text-xs items-center flex-wrap">
                  {orignalData?.areaOfInterest &&
                    orignalData?.areaOfInterest
                      .split(",")
                      .slice(0, 3)
                      .map((tag, index) => (
                        <div
                          key={index}
                          className="text-xs border-2 rounded-2xl px-2 py-1 font-bold bg-[#c9c5c5]"
                        >
                          {tag.trim()}
                        </div>
                      ))}
                </div>
              </div>
              <div className="flex space-x-2 items-center flex-row text-gray-600 mt-1">
                <div className="flex flex-row  text-gray-600 space-x-2 items-center">
                  <div className="flex flex-col space-x-2 text-gray-600">
                    <div className="flex flex-row  text-gray-600 space-x-2 items-center">
                      <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                      <div className="text-black font-semibold">Skill :</div>
                    </div>
                    <div className="flex gap-2 text-xs items-center flex-wrap">
                      {updatedData?.areaOfInterest &&
                        updatedData?.areaOfInterest
                          .split(",")
                          .slice(0, 3)
                          .map((tag, index) => (
                            <div
                              key={index}
                              className="text-xs border-2 rounded-2xl px-2 py-1 font-bold bg-[#c9c5c5]"
                            >
                              {tag.trim()}
                            </div>
                          ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col mb-2">
            <div className="flex flex-col  text-gray-600 space-x-2">
              <div className="flex flex-row  text-gray-600 space-x-2 items-center">
                <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                <div className=" text-black mb-2 font-semibold">
                  Reason to join:
                </div>
              </div>
              <div className="flex gap-2 text-xs items-center flex-wrap">
                <div className="flex text-gray-700 flex-row gap-2 flex-wrap text-xs">
                  {orignalData?.reasonToJoin?.map((reason, index) => (
                    <div
                      key={index}
                      className="text-xs border-2 rounded-2xl px-2 py-1 font-bold bg-[#c9c5c5]"
                    >
                      {reason.replace(/_/g, " ")}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex space-x-2 items-center flex-row text-gray-600 mt-1">
              <div className="flex flex-row  text-gray-600 space-x-2 items-center">
                <div className="flex flex-col space-x-2 text-gray-600">
                  <div className="flex flex-row  text-gray-600 space-x-2 items-center">
                    <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                    <div className=" text-black mb-2 font-semibold">
                      Reason to join:
                    </div>
                  </div>
                  <div className="flex text-gray-700 flex-row gap-2 flex-wrap text-xs">
                    {orignalData?.reasonToJoin?.map((reason, index) => (
                      <div
                        key={index}
                        className="text-xs border-2 rounded-2xl px-2 py-1 font-bold bg-[#c9c5c5]"
                      >
                        {reason.replace(/_/g, " ")}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default UserUpdate;

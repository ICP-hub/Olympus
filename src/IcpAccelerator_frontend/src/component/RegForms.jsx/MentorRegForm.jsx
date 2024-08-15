import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import DetailHeroSection from "../Common/DetailHeroSection";
import { ThreeDots } from "react-loader-spinner";
import { useCountries } from "react-countries";
import ReactSelect from "react-select";
import CompressedImage from "../ImageCompressed/CompressedImage";
import { allHubHandlerRequest } from "../../components/StateManagement/Redux/Reducers/All_IcpHubReducer";
import { uint8ArrayToBase64 } from "../../../../admin_frontend/src/components/Utils/AdminData/saga_function/blobImageToUrl";

const MentorRegForm = () => {
  const { countries } = useCountries();
  const dispatch = useDispatch();
  const actor = useSelector((currState) => currState.actors.actor);
  const areaOfExpertise = useSelector(
    (currState) => currState.expertiseIn.expertise
  );
  const typeOfProfile = useSelector(
    (currState) => currState.profileTypes.profiles
  );
  const getAllIcpHubs = useSelector((currState) => currState.hubs.allHubs);
  const multiChainNames = useSelector((currState) => currState.chains.chains);

  const userFullData = useSelector((currState) => currState.userData.data.Ok);
  const mentorFullData = useSelector(
    (currState) => currState.mentorData.data[0]
  );
  const userCurrentRoleStatusActiveRole = useSelector(
    (currState) => currState.currentRoleStatus.activeRole
  );
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
  // Mentor from states
  const [multiChainOptions, setMultiChainOptions] = useState([]);
  const [multiChainSelectedOptions, setMultiChainSelectedOptions] = useState(
    []
  );

  const [
    categoryOfMentoringServiceOptions,
    setCategoryOfMentoringServiceOptions,
  ] = useState([
    { value: "Incubation", label: "Incubation" },
    { value: "Tokenomics", label: "Tokenomics" },
    { value: "Branding", label: "Branding" },
    { value: "Listing", label: "Listing" },
    { value: "Raise", label: "Raise" },
  ]);
  const [
    categoryOfMentoringServiceSelectedOptions,
    setCategoryOfMentoringServiceSelectedOptions,
  ] = useState([]);

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
          "Username must be between 5 and 20 characters, and cannot start or contain spaces",
          (value) => {
            if (!value) return true;
            const isValidLength = value.length >= 5 && value.length <= 20;
            const hasNoSpaces = !/\s/.test(value) && !value.startsWith(" ");
            return isValidLength && hasNoSpaces;
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
          "no-leading-spaces",
          "Bio should not have leading spaces",
          (value) => !value || value.trimStart() === value
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
      preferred_icp_hub: yup
        .string()
        .test("is-non-empty", "ICP Hub selection is required", (value) =>
          /\S/.test(value)
        )
        .required("ICP Hub selection is required"),
      multi_chain: yup
        .string()
        .required("Required")
        .oneOf(["true", "false"], "Invalid value"),
      multi_chain_names: yup
        .string()
        .when("multi_chain", (val, schema) =>
          val && val[0] === "true"
            ? schema
                .test(
                  "is-non-empty",
                  "Atleast one chain name required",
                  (value) => /\S/.test(value)
                )
                .required("Atleast one chain name required")
            : schema
        ),
      category_of_mentoring_service: yup
        .string()
        .test("is-non-empty", "Selecting a service is required", (value) =>
          /\S/.test(value)
        )
        .required("Selecting a service is required"),
      icp_hub_or_spoke: yup
        .string()
        .required("Required")
        .oneOf(["true", "false"], "Invalid value"),
      hub_owner: yup
        .string()
        .when("icp_hub_or_spoke", (val, schema) =>
          val && val[0] === "true"
            ? schema
                .test(
                  "is-non-empty",
                  "ICP Hub selection is required",
                  (value) => /\S/.test(value)
                )
                .required("ICP Hub selection is required")
            : schema
        ),
      mentor_website_url: yup
        .string()
        .nullable(true)
        .optional()
        .url("Invalid url"),
      years_of_mentoring: yup
        .number()
        .typeError("You must enter a number")
        .positive("Must be a positive number")
        .required("Years of experience mentoring startups is required"),
      mentor_linkedin_url: yup
        .string()
        // .test("is-non-empty", "LinkedIn url is required", (value) =>
        //   /\S/.test(value)
        // )
        // .matches(
        //   /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/,
        //   "Invalid LinkedIn URL"
        // )
        .url("Invalid url")
        .required("LinkedIn url is required"),
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
  const [selectedTypeOfProfile, setSelectedTypeOfProfile] = useState(
    watch("type_of_profile")
  );

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
      const mentorData = {
        // user data
        user_data: {
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
        },
        // mentor data
        preferred_icp_hub: [data?.preferred_icp_hub || ""],
        icp_hub_or_spoke: data?.icp_hub_or_spoke === "true" ? true : false,
        hub_owner: [
          data?.icp_hub_or_spoke === "true" && data?.hub_owner
            ? data?.hub_owner
            : "",
        ],
        hub_owner: [data?.hub_owner || ""],
        category_of_mentoring_service: data?.category_of_mentoring_service,
        years_of_mentoring: data.years_of_mentoring.toString(),
        linkedin_link: data?.mentor_linkedin_url,
        multichain: [
          data?.multi_chain === "true" && data?.multi_chain_names
            ? data?.multi_chain_names
            : "",
        ],
        website: [data?.mentor_website_url || ""],
        // mentor data not exiting on frontend or raw variables
        existing_icp_mentor: false,
        existing_icp_project_porfolio: [
          data?.existing_icp_project_porfolio || "",
        ],
        area_of_expertise: "",
        reason_for_joining: [""],
      };
      try {
        if (userCurrentRoleStatusActiveRole === "mentor") {
          await actor.update_mentor(mentorData).then((result) => {
            if (result && result.includes("approval request is sent")) {
              toast.success("Approval request is sent");
              window.location.href = "/";
            } else {
              toast.error(result);
            }
          });
        } else if (
          userCurrentRoleStatusActiveRole === null ||
          userCurrentRoleStatusActiveRole === "user" ||
          userCurrentRoleStatusActiveRole === "project" ||
          userCurrentRoleStatusActiveRole === "vc"
        ) {
          await actor.register_mentor_candid(mentorData).then((result) => {
            if (result && result.includes("approval request is sent")) {
              toast.success("Approval request is sent");
              window.location.href = "/";
            } else {
              toast.error(result);
            }
          });
        }
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
  const setCategoryOfMentoringServiceSelectedOptionsHandler = (val) => {
    setCategoryOfMentoringServiceSelectedOptions(
      val
        ? val.split(", ").map((reason) => ({ value: reason, label: reason }))
        : []
    );
  };
  const setMultiChainSelectedOptionsHandler = (val) => {
    setMultiChainSelectedOptions(
      val
        ? val?.[0].split(", ").map((chain) => ({ value: chain, label: chain }))
        : []
    );
  };

  // set users values handler
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
      setValue(
        "type_of_profile",
        val?.user_data?.type_of_profile?.[0]
          ? val?.user_data?.type_of_profile?.[0]
          : ""
      );
      setValue(
        "reasons_to_join_platform",
        val?.reason_to_join ? val?.reason_to_join.join(", ") : ""
      );
      setReasonOfJoiningSelectedOptionsHandler(val?.reason_to_join);
    }
  };
  // set mentor values handler
  const setMentorValuesHandler = (val) => {
    if (val) {
      setValue("full_name", val?.user_data?.full_name ?? "");
      setValue("email", val?.user_data?.email?.[0] ?? "");
      setValue("telegram_id", val?.user_data?.telegram_id?.[0] ?? "");
      setValue("twitter_url", val?.user_data?.twitter_id?.[0] ?? "");
      setValue(
        "openchat_user_name",
        val?.user_data?.openchat_username?.[0] ?? ""
      );
      setValue("bio", val?.user_data?.bio?.[0] ?? "");
      setValue("country", val?.user_data?.country ?? "");
      setValue("domains_interested_in", val?.user_data?.area_of_interest ?? "");
      setInterestedDomainsSelectedOptionsHandler(
        val?.user_data?.area_of_interest ?? null
      );
      // setImagePreview(val?.user_data?.profile_picture?.[0] ?? "");
      setImagePreview(
        val?.user_data?.profile_picture?.[0] instanceof Uint8Array
          ? uint8ArrayToBase64(val?.user_data?.profile_picture?.[0])
          : ""
      );
      setValue(
        "type_of_profile",
        val?.user_data?.type_of_profile?.[0]
          ? val?.user_data?.type_of_profile?.[0]
          : ""
      );
      setValue(
        "reasons_to_join_platform",
        val?.user_data?.reason_to_join
          ? val?.user_data?.reason_to_join.join(", ")
          : ""
      );
      setReasonOfJoiningSelectedOptionsHandler(val?.user_data?.reason_to_join);
      setValue("area_of_expertise", val?.area_of_expertise?.[0] ?? "");
      setValue(
        "category_of_mentoring_service",
        val?.category_of_mentoring_service ?? ""
      );
      setCategoryOfMentoringServiceSelectedOptionsHandler(
        val?.category_of_mentoring_service ?? null
      );
      setValue("existing_icp_mentor", val?.existing_icp_mentor ?? "");
      setValue(
        "existing_icp_project_porfolio",
        val?.existing_icp_project_porfolio?.[0] ?? ""
      );
      setValue("icp_hub_or_spoke", val?.icp_hub_or_spoke ?? "");
      if (val?.icp_hub_or_spoke === true) {
        setValue("icp_hub_or_spoke", "true");
      } else {
        setValue("icp_hub_or_spoke", "false");
      }
      setValue("hub_owner", val?.hub_owner ? val?.hub_owner?.[0] : "");
      setValue("mentor_linkedin_url", val?.linkedin_link ?? "");
      if (val?.multichain?.[0]) {
        setValue("multi_chain", "true");
      } else {
        setValue("multi_chain", "false");
      }
      setValue(
        "multi_chain_names",
        val?.multichain?.[0] ? val?.multichain?.[0] : ""
      );
      setMultiChainSelectedOptionsHandler(val?.multichain ?? null);
      setValue(
        "preferred_icp_hub",
        val?.preferred_icp_hub ? val?.preferred_icp_hub?.[0] : ""
      );
      setValue("mentor_website_url", val?.website?.[0] ?? "");
      setValue("years_of_mentoring", val?.years_of_mentoring ?? "");
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
    if (mentorFullData) {
      console.log("Mentor full data ==>", mentorFullData);
      setMentorValuesHandler(mentorFullData);
      setEditMode(true);
    } else if (userFullData) {
      setValuesHandler(userFullData);
    }
  }, [userFullData, mentorFullData]);

  // Mentor form states
  useEffect(() => {
    if (multiChainNames) {
      setMultiChainOptions(
        multiChainNames.map((chain) => ({
          value: chain,
          label: chain,
        }))
      );
    } else {
      setMultiChainOptions([]);
    }
  }, [multiChainNames]);

  useEffect(() => {
    dispatch(allHubHandlerRequest());
  }, [actor, dispatch]);

  useEffect(() => {
    if (actor) {
      (async () => {
        if (userCurrentRoleStatusActiveRole === "mentor") {
          const result = await actor.get_mentor();
          if (result) {
            console.log("result", result?.[0]);
            setImageData(result?.[0]?.user_data?.profile_picture?.[0] ?? null);
            setValue(
              "type_of_profile",
              result?.[0]?.user_data?.type_of_profile?.[0]
                ? result?.[0]?.user_data?.type_of_profile?.[0]
                : ""
            );
            setValue(
              "hub_owner",
              result?.[0]?.hub_owner?.[0] ? result?.[0]?.hub_owner?.[0] : ""
            );
            setValue(
              "preferred_icp_hub",
              result?.[0]?.preferred_icp_hub?.[0]
                ? result?.[0]?.preferred_icp_hub?.[0]
                : ""
            );
          } else {
            setImageData(null);
            setValue("type_of_profile", "");
            setValue("hub_owner", "");
            setValue("preferred_icp_hub", "");
          }
        } else if (
          userCurrentRoleStatusActiveRole === null ||
          userCurrentRoleStatusActiveRole === "user" ||
          userCurrentRoleStatusActiveRole === "project" ||
          userCurrentRoleStatusActiveRole === "vc"
        ) {
          const result = await actor.get_user_information();
          if (result) {
            setImageData(result?.Ok?.profile_picture?.[0] ?? null);

            setValue(
              "type_of_profile",
              result?.Ok?.type_of_profile?.[0]
                ? result?.Ok?.type_of_profile?.[0]
                : ""
            );
          } else {
            setImageData(null);
            setValue("type_of_profile", "");
          }
        }
      })();
    }
  }, [actor]);

  return (
    <>
      <DetailHeroSection />
      <section className="w-full h-fit px-[6%] lg1:px-[4%] bg-gray-100">
        <div className="w-full center-text sm:left-text h-full bg-gray-100">
          <div className="bg-gradient-to-r from-purple-800 to-blue-500 text-transparent bg-clip-text text-[30px]  sm:text-[25px] md1:text-[30px] md2:text-[35px] font-black font-fontUse dxl:text-[40px] p-6 mt-[50px]">
            Mentor Information
          </div>
          <div className="text-sm font-medium text-center text-gray-200 ">
            {/* START OF USER REGISTRATION FORM */}
            <form
              onSubmit={handleSubmit(onSubmitHandler, onErrorHandler)}
              className="w-full px-4"
            >
              <div className="flex flex-col">
                <div className="flex-row w-full flex justify-start gap-4 items-center">
                  <div className="mb-3 ml-6 h-24 w-24 rounded-full border-2 border-gray-300 flex items-center justify-center overflow-hidden">
                    {imagePreview && !errors.image ? (
                      <img
                        src={imagePreview}
                        alt="Profile"
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
                          className="p-2 border-2 border-blue-800 items-center rounded-md text-md bg-transparent text-blue-800 cursor-pointer font-semibold"
                        >
                          {imagePreview && !errors.image
                            ? "Change profile picture"
                            : "Upload profile picture"}
                        </label>
                        {imagePreview || errors.image ? (
                          <button
                            className="p-2 border-2 border-red-500 items-center rounded-md text-md bg-transparent text-red-500 cursor-pointer font-semibold capitalize"
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* User Details */}

                <div className="relative z-0 group mb-6">
                  <label
                    htmlFor="full_name"
                    className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                  >
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("full_name")}
                    className={`bg-gray-50 border-2 
                                                ${
                                                  errors?.full_name
                                                    ? "border-red-500"
                                                    : "border-[#737373]"
                                                } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                    placeholder="Enter your full name"
                  />
                  {errors?.full_name && (
                    <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                      {errors?.full_name?.message}
                    </span>
                  )}
                </div>
                <div className="relative z-0 group mb-6">
                  <label
                    htmlFor="email"
                    className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    {...register("email")}
                    className={`bg-gray-50 border-2 
                                                ${
                                                  errors?.email
                                                    ? "border-red-500"
                                                    : "border-[#737373]"
                                                } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                    placeholder="Enter your email"
                  />
                  {errors?.email && (
                    <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                      {errors?.email?.message}
                    </span>
                  )}
                </div>
                <div className="relative z-0 group mb-6">
                  <label
                    htmlFor="telegram_id"
                    className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                  >
                    Telegram link
                  </label>
                  <input
                    type="text"
                    {...register("telegram_id")}
                    className={`bg-gray-50 border-2 
                                                ${
                                                  errors?.telegram_id
                                                    ? "border-red-500 "
                                                    : "border-[#737373]"
                                                } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                    placeholder="Enter your telegram url"
                  />
                  {errors?.telegram_id && (
                    <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                      {errors?.telegram_id?.message}
                    </span>
                  )}
                </div>
                <div className="relative z-0 group mb-6">
                  <label
                    htmlFor="twitter_url"
                    className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                  >
                    Twitter link
                  </label>
                  <input
                    type="text"
                    {...register("twitter_url")}
                    className={`bg-gray-50 border-2 
                                                ${
                                                  errors?.twitter_url
                                                    ? "border-red-500 "
                                                    : "border-[#737373]"
                                                } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                    placeholder="Enter your twitter url"
                  />
                  {errors?.twitter_url && (
                    <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                      {errors?.twitter_url?.message}
                    </span>
                  )}
                </div>
                <div className="relative z-0 group mb-6">
                  <label
                    htmlFor="openchat_user_name"
                    className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                  >
                    OpenChat username
                  </label>
                  <input
                    type="text"
                    {...register("openchat_user_name")}
                    className={`bg-gray-50 border-2 
                                                ${
                                                  errors?.openchat_user_name
                                                    ? "border-red-500 "
                                                    : "border-[#737373]"
                                                } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                    placeholder="Enter your openchat username"
                  />
                  {errors?.openchat_user_name && (
                    <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                      {errors?.openchat_user_name?.message}
                    </span>
                  )}
                </div>
                <div className="relative z-0 group mb-6">
                  <label
                    htmlFor="bio"
                    className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                  >
                    Bio (50 words)
                  </label>
                  <textarea
                    {...register("bio")}
                    className={`bg-gray-50 border-2 ${
                      errors?.bio ? "border-red-500 " : "border-[#737373]"
                    } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                    placeholder="Enter your bio"
                    rows={1}
                  ></textarea>
                  {errors?.bio && (
                    <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                      {errors?.bio?.message}
                    </span>
                  )}
                </div>
                <div className="relative z-0 group mb-6">
                  <label
                    htmlFor="country"
                    className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                  >
                    Country <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("country")}
                    className={`bg-gray-50 border-2 ${
                      errors.country ? "border-red-500 " : "border-[#737373]"
                    } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                  >
                    <option className="text-lg font-bold" value="">
                      Select your country
                    </option>
                    {countries?.map((expert) => (
                      <option
                        key={expert.name}
                        value={expert.name}
                        className="text-lg font-bold"
                      >
                        {expert.name}
                      </option>
                    ))}
                  </select>

                  {errors?.country && (
                    <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                      {errors?.country?.message}
                    </span>
                  )}
                </div>
                <div className="relative z-0 group mb-6">
                  <label
                    htmlFor="domains_interested_in"
                    className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                  >
                    Domains you are interested in{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <ReactSelect
                    isMulti
                    menuPortalTarget={document.body}
                    menuPosition={"fixed"}
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                      control: (provided, state) => ({
                        ...provided,
                        paddingBlock: "2px",
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
                        display: "flex",
                        overflowX: "auto",
                        maxHeight: "43px",
                        "&::-webkit-scrollbar": {
                          display: "none",
                        },
                      }),
                      valueContainer: (provided, state) => ({
                        ...provided,
                        overflow: "scroll",
                        maxHeight: "40px",
                        scrollbarWidth: "none",
                      }),
                      placeholder: (provided, state) => ({
                        ...provided,
                        color: errors.domains_interested_in
                          ? "#ef4444"
                          : "rgb(107 114 128)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }),
                      multiValue: (provided) => ({
                        ...provided,
                        display: "inline-flex",
                        alignItems: "center",
                      }),
                      multiValueRemove: (provided) => ({
                        ...provided,
                        display: "inline-flex",
                        alignItems: "center",
                      }),
                    }}
                    value={interestedDomainsSelectedOptions}
                    options={interestedDomainsOptions}
                    classNamePrefix="select"
                    className="basic-multi-select w-full text-start"
                    placeholder="Select domains you are interested in"
                    name="domains_interested_in"
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
                  {errors.domains_interested_in && (
                    <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                      {errors.domains_interested_in.message}
                    </span>
                  )}
                </div>
                <div className="relative z-0 group mb-6">
                  <label
                    htmlFor="type_of_profile"
                    className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                  >
                    Type of profile <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("type_of_profile")}
                    className={`bg-gray-50 border-2 ${
                      errors.type_of_profile
                        ? "border-red-500 "
                        : "border-[#737373]"
                    } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
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
                  {errors.type_of_profile && (
                    <p className="mt-1 text-sm text-red-500 font-bold text-left">
                      {errors.type_of_profile.message}
                    </p>
                  )}
                </div>
                <div className="relative z-0 group mb-6">
                  <label
                    htmlFor="reasons_to_join_platform"
                    className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                  >
                    Why do you want to join this platform ?{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <ReactSelect
                    isMulti
                    menuPortalTarget={document.body}
                    menuPosition={"fixed"}
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                      control: (provided, state) => ({
                        ...provided,
                        paddingBlock: "2px",
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
                        display: "flex",
                        overflowX: "auto",
                        maxHeight: "43px",
                        "&::-webkit-scrollbar": {
                          display: "none",
                        },
                      }),
                      valueContainer: (provided, state) => ({
                        ...provided,
                        overflow: "scroll",
                        maxHeight: "40px",
                        scrollbarWidth: "none",
                      }),
                      placeholder: (provided, state) => ({
                        ...provided,
                        color: errors.reasons_to_join_platform
                          ? "#ef4444"
                          : "rgb(107 114 128)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }),
                      multiValue: (provided) => ({
                        ...provided,
                        display: "inline-flex",
                        alignItems: "center",
                      }),
                      multiValueRemove: (provided) => ({
                        ...provided,
                        display: "inline-flex",
                        alignItems: "center",
                      }),
                    }}
                    value={reasonOfJoiningSelectedOptions}
                    options={reasonOfJoiningOptions}
                    classNamePrefix="select"
                    className="basic-multi-select w-full text-start"
                    placeholder="Select your reasons to join this platform"
                    name="reasons_to_join_platform"
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
                  {errors.reasons_to_join_platform && (
                    <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                      {errors.reasons_to_join_platform.message}
                    </span>
                  )}
                </div>

                {/* END OF USER REGISTRATION FORM */}

                {/* START OF MENTOR REGISTRATION FORM */}

                <div className="relative z-0 group mb-6">
                  <label
                    htmlFor="preferred_icp_hub"
                    className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                  >
                    Preferred ICP Hub you would like to be associated with{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("preferred_icp_hub")}
                    className={`bg-gray-50 border-2 ${
                      errors.preferred_icp_hub
                        ? "border-red-500 "
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
                        {hub.name}, {hub.region}
                      </option>
                    ))}
                  </select>
                  {errors.preferred_icp_hub && (
                    <p className="mt-1 text-sm text-red-500 font-bold text-left">
                      {errors.preferred_icp_hub.message}
                    </p>
                  )}
                </div>
                <div className="relative z-0 group mb-6">
                  <label
                    htmlFor="multi_chain"
                    className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                  >
                    Do you mentor multiple ecosystems{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("multi_chain")}
                    className={`bg-gray-50 border-2 ${
                      errors.multi_chain ? "border-red-500" : "border-[#737373]"
                    } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                  >
                    <option className="text-lg font-bold" value="false">
                      No
                    </option>
                    <option className="text-lg font-bold" value="true">
                      Yes
                    </option>
                  </select>
                  {errors.multi_chain && (
                    <p className="mt-1 text-sm text-red-500 font-bold text-left">
                      {errors.multi_chain.message}
                    </p>
                  )}
                </div>
                {watch("multi_chain") === "true" ? (
                  <div className="relative z-0 group mb-6">
                    <label
                      htmlFor="multi_chain_names"
                      className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                    >
                      Please select the chains{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <ReactSelect
                      isMulti
                      menuPortalTarget={document.body}
                      menuPosition={"fixed"}
                      styles={{
                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        control: (provided, state) => ({
                          ...provided,
                          paddingBlock: "2px",
                          borderRadius: "8px",
                          border: errors.multi_chain_names
                            ? "2px solid #ef4444"
                            : "2px solid #737373",
                          backgroundColor: "rgb(249 250 251)",
                          "&::placeholder": {
                            color: errors.multi_chain_names
                              ? "#ef4444"
                              : "currentColor",
                          },
                          display: "flex",
                          overflowX: "auto",
                          maxHeight: "43px",
                          "&::-webkit-scrollbar": {
                            display: "none",
                          },
                        }),
                        valueContainer: (provided, state) => ({
                          ...provided,
                          overflow: "scroll",
                          maxHeight: "40px",
                          scrollbarWidth: "none",
                        }),
                        placeholder: (provided, state) => ({
                          ...provided,
                          color: errors.multi_chain_names
                            ? "#ef4444"
                            : "rgb(107 114 128)",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }),
                        multiValue: (provided) => ({
                          ...provided,
                          display: "inline-flex",
                          alignItems: "center",
                        }),
                        multiValueRemove: (provided) => ({
                          ...provided,
                          display: "inline-flex",
                          alignItems: "center",
                        }),
                      }}
                      value={multiChainSelectedOptions}
                      options={multiChainOptions}
                      classNamePrefix="select"
                      className="basic-multi-select w-full text-start"
                      placeholder="Select a chain"
                      name="multi_chain_names"
                      onChange={(selectedOptions) => {
                        if (selectedOptions && selectedOptions.length > 0) {
                          setMultiChainSelectedOptions(selectedOptions);
                          clearErrors("multi_chain_names");
                          setValue(
                            "multi_chain_names",
                            selectedOptions
                              .map((option) => option.value)
                              .join(", "),
                            { shouldValidate: true }
                          );
                        } else {
                          setMultiChainSelectedOptions([]);
                          setValue("multi_chain_names", "", {
                            shouldValidate: true,
                          });
                          setError("multi_chain_names", {
                            type: "required",
                            message: "Atleast one chain name required",
                          });
                        }
                      }}
                    />
                    {errors.multi_chain_names && (
                      <p className="mt-1 text-sm text-red-500 font-bold text-left">
                        {errors.multi_chain_names.message}
                      </p>
                    )}
                  </div>
                ) : (
                  <></>
                )}
                <div className="relative z-0 group mb-6">
                  <label
                    htmlFor="category_of_mentoring_service"
                    className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                  >
                    Categories of mentoring services{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <ReactSelect
                    isMulti
                    menuPortalTarget={document.body}
                    menuPosition={"fixed"}
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                      control: (provided, state) => ({
                        ...provided,
                        paddingBlock: "2px",
                        borderRadius: "8px",
                        border: errors.category_of_mentoring_service
                          ? "2px solid #ef4444"
                          : "2px solid #737373",
                        backgroundColor: "rgb(249 250 251)",
                        "&::placeholder": {
                          color: errors.category_of_mentoring_service
                            ? "#ef4444"
                            : "currentColor",
                        },
                        display: "flex",
                        overflowX: "auto",
                        maxHeight: "43px",
                        "&::-webkit-scrollbar": {
                          display: "none",
                        },
                      }),
                      valueContainer: (provided, state) => ({
                        ...provided,
                        overflow: "scroll",
                        maxHeight: "40px",
                        scrollbarWidth: "none",
                      }),
                      placeholder: (provided, state) => ({
                        ...provided,
                        color: errors.category_of_mentoring_service
                          ? "#ef4444"
                          : "rgb(107 114 128)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }),
                      multiValue: (provided) => ({
                        ...provided,
                        display: "inline-flex",
                        alignItems: "center",
                      }),
                      multiValueRemove: (provided) => ({
                        ...provided,
                        display: "inline-flex",
                        alignItems: "center",
                      }),
                    }}
                    value={categoryOfMentoringServiceSelectedOptions}
                    options={categoryOfMentoringServiceOptions}
                    classNamePrefix="select"
                    className="basic-multi-select w-full text-start"
                    placeholder="Select a service"
                    name="category_of_mentoring_service"
                    onChange={(selectedOptions) => {
                      if (selectedOptions && selectedOptions.length > 0) {
                        setCategoryOfMentoringServiceSelectedOptions(
                          selectedOptions
                        );
                        clearErrors("category_of_mentoring_service");
                        setValue(
                          "category_of_mentoring_service",
                          selectedOptions
                            .map((option) => option.value)
                            .join(", "),
                          { shouldValidate: true }
                        );
                      } else {
                        setCategoryOfMentoringServiceSelectedOptions([]);
                        setValue("category_of_mentoring_service", "", {
                          shouldValidate: true,
                        });
                        setError("category_of_mentoring_service", {
                          type: "required",
                          message: "Atleast one service name required",
                        });
                      }
                    }}
                  />
                  {errors.category_of_mentoring_service && (
                    <p className="mt-1 text-sm text-red-500 font-bold text-left">
                      {errors.category_of_mentoring_service.message}
                    </p>
                  )}
                </div>
                <div className="relative z-0 group mb-6">
                  <label
                    htmlFor="icp_hub_or_spoke"
                    className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                  >
                    Are you ICP Hub/Spoke{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("icp_hub_or_spoke")}
                    className={`bg-gray-50 border-2 ${
                      errors.icp_hub_or_spoke
                        ? "border-red-500"
                        : "border-[#737373]"
                    } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                  >
                    <option className="text-lg font-bold" value="false">
                      No
                    </option>
                    <option className="text-lg font-bold" value="true">
                      Yes
                    </option>
                  </select>
                  {errors.icp_hub_or_spoke && (
                    <p className="mt-1 text-sm text-red-500 font-bold text-left">
                      {errors.icp_hub_or_spoke.message}
                    </p>
                  )}
                </div>
                {watch("icp_hub_or_spoke") === "true" ? (
                  <div className="z-0 w-full mb-3 group">
                    <label
                      htmlFor="hub_owner"
                      className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                    >
                      Hub Owner <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register("hub_owner")}
                      className={`bg-gray-50 border-2 ${
                        errors.hub_owner
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
                          {hub.name}, {hub.region}
                        </option>
                      ))}
                    </select>
                    {errors.hub_owner && (
                      <p className="mt-1 text-sm text-red-500 font-bold text-left">
                        {errors.hub_owner.message}
                      </p>
                    )}
                  </div>
                ) : (
                  <></>
                )}
                <div className="relative z-0 group mb-6">
                  <label
                    htmlFor="mentor_website_url"
                    className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                  >
                    Website link
                  </label>
                  <input
                    type="text"
                    {...register("mentor_website_url")}
                    className={`bg-gray-50 border-2 
                                                ${
                                                  errors?.mentor_website_url
                                                    ? "border-red-500 "
                                                    : "border-[#737373]"
                                                } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                    placeholder="Enter your website url"
                  />
                  {errors?.mentor_website_url && (
                    <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                      {errors?.mentor_website_url?.message}
                    </span>
                  )}
                </div>
                <div className="relative z-0 group mb-6">
                  <label
                    htmlFor="years_of_mentoring"
                    className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                  >
                    Years of mentoring <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    {...register("years_of_mentoring")}
                    className={`bg-gray-50 border-2 
                                                ${
                                                  errors?.years_of_mentoring
                                                    ? "border-red-500 "
                                                    : "border-[#737373]"
                                                } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                    placeholder="Enter your mentoring experience years"
                    onWheel={(e) => e.target.blur()}
                    min={0}
                  />
                  {errors?.years_of_mentoring && (
                    <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                      {errors?.years_of_mentoring?.message}
                    </span>
                  )}
                </div>
                <div className="relative z-0 group mb-6">
                  <label
                    htmlFor="mentor_linkedin_url"
                    className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                  >
                    LinkedIn link <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("mentor_linkedin_url")}
                    className={`bg-gray-50 border-2 
                                                ${
                                                  errors?.mentor_linkedin_url
                                                    ? "border-red-500 "
                                                    : "border-[#737373]"
                                                } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                    placeholder="Enter your linkedin url"
                  />
                  {errors?.mentor_linkedin_url && (
                    <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                      {errors?.mentor_linkedin_url?.message}
                    </span>
                  )}
                </div>
                {/* <div className="relative z-0 group mb-6">
                                    <label htmlFor="mentor_documents_url"
                                        className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start">
                                        Documents
                                    </label>
                                    <input
                                        type="text"
                                        {...register("mentor_documents_url")}
                                        className={`bg-gray-50 border-2 
                                                ${errors?.mentor_documents_url
                                                ? "border-red-500 "
                                                : "border-[#737373]"
                                            } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                                        placeholder="Documents url"
                                    />
                                    {errors?.mentor_documents_url && (
                                        <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                                            {errors?.mentor_documents_url?.message}
                                        </span>
                                    )}
                                </div> */}
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
                  ) : editMode ? (
                    "Update"
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            </form>

            {/* END OF MENTOR REGISTRATION FORM */}
          </div>
        </div>
      </section>
      <Toaster />
    </>
  );
};

export default MentorRegForm;

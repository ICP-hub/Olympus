import React, { useState, useEffect } from "react";
import { mentorRegistration } from "../../Utils/Data/AllDetailFormData";
import { Tooltip as ReactTooltip } from "react-tooltip";
import MentorPersonalInformation from "./MentorPersonalInformation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import MentorDetails from "./MentorDetails";
import MentorAdditionalInformation from "./MentorAdditionalInformation";
import {
  // mentorRegistrationAdditionalInfo,
  mentorRegistrationPersonalDetails,
  mentorRegistrationDetails,
} from "../../Utils/Data/mentorFormData";
import { useSelector } from "react-redux";
import CompressedImage from "../../ImageCompressed/CompressedImage";
import { useDispatch } from "react-redux";
import { allHubHandlerRequest } from "../../StateManagement/Redux/Reducers/All_IcpHubReducer";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { userRoleHandler } from "../../StateManagement/Redux/Reducers/userRoleReducer";
import { useCountries } from "react-countries";
import { userRegisteredHandlerRequest } from "../../StateManagement/Redux/Reducers/userRegisteredData";
import { bufferToImageBlob } from "../../Utils/formatter/bufferToImageBlob";
import DetailHeroSection from "../../Common/DetailHeroSection";

const validationSchema = {
  personalDetails: yup.object().shape({
    full_name: yup
      .string()
      .test("is-non-empty", "Full Name is required", (value) =>
        /\S/.test(value)
      )
      .required("Full Name is required"),
    openchat_username: yup
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
    country: yup
      .string()
      .test("is-non-empty", "ICP Hub selection is required", (value) =>
        /\S/.test(value)
      )
      .required("Selecting an interest is required."),
    area_of_interest: yup
      .string()
      .test("is-non-empty", "Areas of Intrest are required", (value) =>
        /\S/.test(value)
      )
      .required("Areas of Intrest are required"),
  }),

  mentorDetails: yup.object().shape({
    existing_icp_mentor: yup
      .string()
      .test("is-non-empty", "Icp Mentor selection is required", (value) =>
        /\S/.test(value)
      )
      .required("Icp Mentor selection is required"),
    reason_for_joining: yup
      .string()
      .test("is-non-empty", "Reason For Joining is required", (value) =>
        /\S/.test(value)
      )
      .required("Reason For Joining is required"),
    website: yup
      .string()
      .url("Invalid website URL")
      .test("is-non-empty", "website URL is required", (value) =>
        /\S/.test(value)
      )
      .required("website URL is required"),
    linkedin_link: yup
      .string()
      .url("Invalid Linkedin link")
      .test("is-non-empty", "linkedin link is required", (value) =>
        /\S/.test(value)
      )
      .required("linkedin link is required"),
    twitter_link: yup.string().url("Invalid twitter link"),
    telegram_link: yup.string().url("Invalid telegram link"),
    documents_link: yup.string().url("Invalid documents link"),
    bio_mentor: yup
      .string()
      .test("wordCount", "Bio must be 50 words or fewer", (value) => {
        if (typeof value === "string") {
          const words = value.trim().split(/\s+/); // Split by any whitespace
          return words.length <= 50;
        }
        return false; // Fails validation if not a string
      })
      .required("Bio is Required"),
    hub_owner: yup.string().optional(),
    multichain: yup.string().optional(),
    preferred_icp_hub: yup
      .string()
      .test("is-non-empty", "ICP Hub selection is required", (value) =>
        /\S/.test(value)
      )
      .required("ICP Hub selection is required"),
    icp_hub_or_spoke: yup
      .string()
      .test("is-non-empty", "ICP Hub selection is required", (value) =>
        /\S/.test(value)
      )
      .required("ICP Hub selection is required"),
    area_of_expertise: yup
      .string()
      .test("is-non-empty", "Areas of expertise are required", (value) =>
        /\S/.test(value)
      )
      .required("Areas of expertise are required"),
    category_of_mentoring_service: yup
      .string()
      .test(
        "is-non-empty",
        "Category of mentoring service is required",
        (value) => /\S/.test(value)
      )
      .required("Category of mentoring service is required"),
    existing_icp_project_porfolio: yup.string().optional(),
    years_of_mentoring: yup
      .number()
      .typeError("You must enter a number")
      .positive("Must be a positive number")
      .required("Years of experience mentoring startups is required"),
  }),
};

const MentorRegistration = () => {
  const actor = useSelector((currState) => currState.actors.actor);
  const getAllIcpHubs = useSelector((currState) => currState.hubs.allHubs);
  const specificRole = useSelector(
    (currState) => currState.currentRoleStatus.activeRole
  );
  console.log("specificRole is Here===>", specificRole);
  const mentorFullData = useSelector((currState) => currState.mentorData.data);
  console.log("specificRole is Here===>", mentorFullData);
  const areaOfExpertise = useSelector(
    (currState) => currState.expertiseIn.expertise
  );
  const multiChain = useSelector((currState) => currState.chains.chains);
  const userData = useSelector((currState) => currState.userData.data.Ok);
  console.log(userData);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { countries } = useCountries();

  const [activeTab, setActiveTab] = useState(mentorRegistration[0].id);
  const [formData, setFormData] = useState({});
  const [step, setStep] = useState(0);
  const [isCurrentStepValid, setIsCurrentStepValid] = useState(false);
  const [userHasInteracted, setUserHasInteracted] = useState(false);
  const [image, setImage] = useState(null);
  const [mentor_image, setmentor_image] = useState(null);
  const [mentorDataObject, setMentorDataObject] = useState({});

  // console.log("MentorRegistration  run  specificRole =>", specificRole);
  // console.log("expertiseIn in mentor-registratn comp =>", areaOfExpertise);
  console.log("userData in mentor-registratn comp =>", userData);

  // Form Updates Changes in enable and diabled
  const [isExistingICPMentor, setExistingICPMentor] = useState(false);
  const [isMulti_Chain, setIsMulti_Chain] = useState(false);
  const [isicpHuborSpoke, seticpHuborSpoke] = useState(false);

  const getTabClassName = (tab) => {
    return `inline-block p-2 font-bold ${
      activeTab === tab
        ? "text-black border-b-2 border-black"
        : "text-gray-400  border-transparent hover:text-black"
    } rounded-t-lg`;
  };

  const steps = [
    // { id: "personalDetails", fields: mentorRegistrationPersonalDetails },
    { id: "mentorDetails", fields: mentorRegistrationDetails },
  ];

  const currentValidationSchema = validationSchema[steps[step].id];

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    trigger,
    setValue,
    control,
    getValues,
    clearErrors,
    setError,
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(currentValidationSchema),
    mode: "all",
  });

  const handleTabClick = async (tab) => {
    const targetStep = mentorRegistration.findIndex(
      (header) => header.id === tab
    );
    setUserHasInteracted(true);

    if (step === targetStep) {
      return;
    }
    if (targetStep < step || isCurrentStepValid) {
      setActiveTab(tab);
      setStep(targetStep);
    } else {
    }
  };
  // Watch the value of existing_icp_mentor to update ExistingICPMentor state
  const ExistingICPMentor = watch("existing_icp_mentor");
  const IsMultiChain = watch("multi_chain");
  const icpHuborSpoke = watch("icp_hub_or_spoke");
  useEffect(() => {
    // Update ExistingICPMentor based on existing_icp_mentor field value
    setExistingICPMentor(ExistingICPMentor === "true");
    if (ExistingICPMentor !== "true") {
      setValue("existing_icp_project_porfolio", "");
    }
    if (IsMultiChain === "true") {
      setIsMulti_Chain(true);
      const multichainValue = getValues("multichain"); // Get current value of "multichain"
      if (multichainValue) {
        clearErrors("multichain");
      } else {
        setError("multichain", { type: "required", message: "Required" });
      }
    } else {
      setIsMulti_Chain(false);
      setValue("multichain", "", { shouldValidate: true });
      clearErrors("multichain");
    }
    seticpHuborSpoke(icpHuborSpoke === "true");
    if (icpHuborSpoke !== "true") {
      setValue("hub_owner", "");
    }
  }, [ExistingICPMentor, IsMultiChain, icpHuborSpoke, setValue]);
  useEffect(() => {
    if (!userHasInteracted) return;
    const validateStep = async () => {
      const fieldsToValidate = steps[step].fields.map((field) => field.name);
      const result = await trigger(fieldsToValidate);
      setIsCurrentStepValid(result);
    };
    validateStep();
  }, [step, trigger, userHasInteracted]);

  useEffect(() => {
    dispatch(allHubHandlerRequest());
  }, [actor, dispatch]);

  const handleNext = async () => {
    const fieldsToValidate = steps[step].fields.map((field) => field.name);
    const result = await trigger(fieldsToValidate);
    // console.log("fieldsToValidate", fieldsToValidate);
    if (result) {
      setStep((prevStep) => prevStep + 1);
      setActiveTab(mentorRegistration[step + 1]?.id);
    }
  };

  const imageUrlToByteArray = async (imageUrl) => {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    return Array.from(new Uint8Array(arrayBuffer));
  };
  const handlePrevious = () => {
    if (step > 0) {
      setStep((prevStep) => prevStep - 1);
      setActiveTab(mentorRegistration[step - 1]?.id);
    }
  };

  const addImageHandler = async (e) => {
    const selectedImages = e.target.files[0];
    if (selectedImages) {
      try {
        // 1) image ko phle compress kia
        const compressedFile = await CompressedImage(selectedImages);

        // 2) frontend pr display k lie
        const reader = new FileReader();
        reader.readAsDataURL(compressedFile); // Convert the compressed blob to a Data URL for display
        reader.onloadend = () => {
          setImage(reader.result);
        };

        // 3) image ko backend mai bhejne k lie
        const byteArray = await compressedFile.arrayBuffer(); // Convert krega Blob ko ArrayBuffer mai
        const imageBytes = Array.from(new Uint8Array(byteArray)); // Convert ArrayBuffer ko array of bytes mai
        setmentor_image(imageBytes);
        console.log("imageBytes", imageBytes);
      } catch (error) {
        console.error("Error compressing the image:", error);
      }
    }
  };

  useEffect(() => {
    const preventScroll = (e) => {
      if (e.target.type === "number") {
        e.preventDefault();
      }
    };

    window.addEventListener("wheel", preventScroll, { passive: false });

    return () => {
      window.removeEventListener("wheel", preventScroll);
    };
  }, []);
  useEffect(() => {
    if (mentorFullData && mentorFullData.length > 0) {
      const data = mentorFullData[0];
      const formattedData = Object.keys(data).reduce((acc, key) => {
        acc[key] = Array.isArray(data[key]) ? data[key][0] : data[key];
        return acc;
      }, {});
      reset(formattedData);
      setFormData(formattedData);
      console.log("formattedData341", formattedData);
      console.log("342 data", data);
      if (formattedData.user_data.profile_picture) {
        imageUrlToByteArray(formattedData.user_data.profile_picture[0])
          .then((imageUrl) => {
            setmentor_image(imageUrl);
            console.log("i am here Working ===>", imageUrl);
          })
          .catch((error) => console.error("Error converting image:", error));
      }
    } else {
      if (userData) {
        // Create an object that matches the form fields structure
        const formData = {
          full_name: userData.full_name || "",
          email: userData.email?.[0] || "",
          telegram_id: userData.telegram_id?.[0] || "",
          twitter_id: userData.twitter_id?.[0] || "",
          openchat_username: userData.openchat_username?.[0] || "",
          bio: userData.bio?.[0] || "",
          country: userData.country || "",
          area_of_interest: userData.area_of_interest || "",
        };

        // If there is a mentor_image, handle its conversion and set it separately if needed
        if (userData.profile_picture) {
          bufferToImageBlob(userData?.profile_picture)
            .then((imageUrl) => {
              setmentor_image(imageUrl);
              setFormData({ mentor_image: userData.profile_picture[0] });
              // You might also need to handle setting the image for display if required
            })
            .catch((error) => console.error("Error converting image:", error));
        }

        // Use the reset function to populate the form
        reset(formData);
      }
    }
  }, [mentorFullData, reset, userData]);

  const sendingMentorData = async (val) => {
    // console.log("run sendingMentorData =========");
    console.log("sendingMentorData ==>> ", val);

    let result;

    try {
      if (specificRole === "mentor") {
        console.log("update mentor functn k pass reached");
        result = await actor.update_mentor(val).then((result) => {
          toast.success(result);
          // navigate("/")
          window.location.href = "/";
        });
      } else if (
        specificRole === null ||
        specificRole === "user" ||
        specificRole === "project" ||
        specificRole === "vc"
      ) {
        console.log("register mentor functn k pass reached");
        await actor.register_mentor_candid(val).then((result) => {
          toast.success(result);
          // navigate("/")
          window.location.href = "/";
        });
      }
      // await dispatch(userRoleHandler());
      // await navigate("/");
    } catch (error) {
      toast.error(error);
      console.log(error.message);
    }
  };

  const errorFunc = (val) => {
    console.log("val", val);
  };
  const onSubmit = async (data) => {
    console.log("data >>>>", data);
    const updatedFormData = { ...formData, ...data };
    setFormData(updatedFormData);

    console.log("updatedFormData inside onSUbmit ~~~~~~", updatedFormData);
    if (step < steps.length - 1) {
      handleNext();
    } else if (
      specificRole === "mentor" ||
      (undefined && step > steps.length - 1)
    ) {
      // console.log("exisiting user visit ");
      const updatedexisting_icp_mentor =
        ExistingICPMentor === "true" ? true : false;
      const icpHubOrSpoke =
        updatedFormData.icp_hub_or_spoke === "true" ? true : false;
      let tempObj2 = {
        user_data: {
          profile_picture: [mentor_image] || [],
          full_name: updatedFormData.full_name || "",
          country: updatedFormData.country || "",
          email: [updatedFormData.email] || [],
          telegram_id: [updatedFormData.telegram_id],
          twitter_id: [updatedFormData.twitter_id],
          openchat_username: [updatedFormData.openchat_username] || [],
          bio: [updatedFormData.bio] || [],
          area_of_interest: updatedFormData.area_of_interest || [],
        },
        existing_icp_mentor: updatedexisting_icp_mentor,
        reason_for_joining: updatedFormData.reason_for_joining || "",
        website: updatedFormData.website,
        multichain: [updatedFormData.multichain || ""],
        preferred_icp_hub: [updatedFormData.preferred_icp_hub],
        hub_owner: [updatedFormData.hub_owner || ""],
        area_of_expertise: updatedFormData.area_of_expertise,
        category_of_mentoring_service:
          updatedFormData.category_of_mentoring_service,
        existing_icp_project_porfolio: [
          updatedFormData.existing_icp_project_porfolio || "",
        ],
        years_of_mentoring: updatedFormData.years_of_mentoring.toString(),
        icp_hub_or_spoke: icpHubOrSpoke,
        linkedin_link: updatedFormData.linkedin_link || "",
      };

      console.log("tempObj2 kaam kia ????? ", tempObj2); // work kia
      setMentorDataObject(tempObj2);
      await sendingMentorData(tempObj2);
    } else if (
      specificRole === null ||
      specificRole === "user" ||
      specificRole === "project" ||
      specificRole === "vc" ||
      step > steps.length - 1
    ) {
      console.log("existing visit ");
      const updatedexisting_icp_mentor =
        ExistingICPMentor === "true" ? true : false;
      const icpHubOrSpoke =
        updatedFormData.icp_hub_or_spoke === "true" ? true : false;
      let tempObj = {
        user_data: {
          profile_picture: [updatedFormData.mentor_image] || [],
          full_name: updatedFormData.full_name || "",
          country: updatedFormData.country || "",
          email: [updatedFormData.email] || [],
          telegram_id: [updatedFormData.telegram_id],
          twitter_id: [updatedFormData.twitter_id],
          openchat_username: [updatedFormData.openchat_username] || [],
          bio: [updatedFormData.bio] || [],
          area_of_interest: updatedFormData.area_of_interest || [],
        },
        existing_icp_mentor: updatedexisting_icp_mentor,
        reason_for_joining: updatedFormData.reason_for_joining || "",
        website: updatedFormData.website,
        multichain: [updatedFormData.multichain || ""],
        preferred_icp_hub: [updatedFormData.preferred_icp_hub],
        hub_owner: [updatedFormData.hub_owner || ""],
        area_of_expertise: updatedFormData.area_of_expertise,
        category_of_mentoring_service:
          updatedFormData.category_of_mentoring_service,
        existing_icp_project_porfolio: [
          updatedFormData.existing_icp_project_porfolio || "",
        ],
        years_of_mentoring: updatedFormData.years_of_mentoring.toString(),
        icp_hub_or_spoke: icpHubOrSpoke,
        linkedin_link: updatedFormData.linkedin_link || "",
      };
      console.log("tempObj kaam kia ????? ", tempObj); // work kia

      setMentorDataObject(tempObj);
      await sendingMentorData(tempObj);
    }
  };

  const stepFields = steps[step].fields;
  let StepComponent;
  // if (step === 0) {
  //   StepComponent = <MentorPersonalInformation />;
  // } else
  if (step === 0) {
    StepComponent = <MentorDetails isSubmitting={isSubmitting} />;
  }

  return (
    <>
      <DetailHeroSection />
      <section className="w-full h-fit px-[6%] lg1:px-[4%] py-[6%] lg1:py-[4%] bg-gray-100">
        <div className="w-full h-full bg-gray-100 pt-8">
          <div className="bg-gradient-to-r from-purple-800 to-blue-500 text-transparent bg-clip-text text-[30px]  sm:text-[25px] md1:text-[30px] md2:text-[35px] font-black font-fontUse dxl:text-[40px] p-8">
            Mentor Information
          </div>
          <div className="text-sm font-medium text-center text-gray-200 ">
            <ul className="flex flex-wrap mb-4 text-sxxs:text-[7px] sxs:text-[7.5px] sxs1:text-[8px] sxs2:text-[8.5px] sxs3:text-[9px] ss:text-[9.5px] ss1:text-[10px] ss2:text-[10.5px] ss3:text-[11px] ss4:text-[11.5px] dxs:text-[12px] xxs:text-[12.5px] xxs1:text-[13px] sm1:text-[13.5px] sm4:text-[14px] sm2:text-[14.5px] sm3:text-[13px] sm:text-[11.5px] md:text-[14px.3] md1:text-[13px] md2:text-[13px] md3:text-[13px] lg:text-[14.5px] dlg:text-[15px] lg1:text-[16.5px] lgx:text-[16px] dxl:text-[16.5px] xl:text-[19px] xl2:text-[19.5px] cursor-pointer justify-around">
              {mentorRegistration?.map((header, index) => (
                <li key={header.id} className="me-2 relative group">
                  <button
                    className={`${getTabClassName(header.id)} ${
                      index > step && !isCurrentStepValid
                        ? "cursor-not-allowed opacity-50"
                        : "cursor-pointer"
                    }`}
                    onClick={() => handleTabClick(header.id)}
                    disabled={index > step && !isCurrentStepValid}
                  >
                    <div className="hidden md:block">{header.label}</div>

                    <div className="flex md:hidden items-center">
                      {header.icon}
                    </div>
                  </button>
                  <div className="md:hidden">
                    {index > step && !isCurrentStepValid && (
                      <ReactTooltip
                        id={header.id}
                        place="bottom"
                        content="Complete current step to proceed"
                        className="z-10"
                      />
                    )}
                  </div>
                </li>
              ))}
            </ul>

            {/* {step === 0 && (
              <div className="flex flex-col">
                <div className="flex-row w-full flex justify-start gap-4 items-center">
                  <div className="mb-3 ml-6 h-24 w-24 rounded-full border-2 border-gray-300 flex items-center justify-center overflow-hidden">
                    {image ? (
                      <img
                        src={image}
                        alt="New profile"
                        className="h-full w-full object-cover"
                      />
                    ) : mentor_image ? (
                      <img
                        src={mentor_image}
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
                    <input
                      id="images"
                      type="file"
                      name="images"
                      onChange={(e) => addImageHandler(e)}
                      className="hidden"
                    />
                  </div>

                  <label
                    htmlFor="images"
                    className="p-2 border-2 border-blue-800 items-center rounded-md text-md bg-transparent text-blue-800 cursor-pointer font-extrabold"
                  >
                    Upload Profile
                  </label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 px-4 gap-6">
                  <div className="z-0 w-full my-3 group">
                    <label
                      htmlFor="area_of_interest"
                      className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                    >
                      Area of Intrest
                    </label>
                    <select
                      {...register("area_of_interest")}
                      className={`bg-gray-50 border-2 ${
                        errors.area_of_interest
                          ? "border-red-500 placeholder:text-red-500"
                          : "border-[#737373]"
                      } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                    >
                      <option className="text-lg font-bold" value="">
                        Area of Interest
                      </option>
                      {areaOfExpertise?.map((intrest) => (
                        <option
                          key={intrest.id}
                          value={`${intrest.name}`}
                          className="text-lg font-bold capitalize"
                        >
                          {intrest.name}
                        </option>
                      ))}
                    </select>
                    {errors.area_of_interest && (
                      <p className="mt-1 text-sm text-red-500 font-bold text-left">
                        {errors.area_of_interest.message}
                      </p>
                    )}
                  </div>
                  <div className="z-0 w-full my-3 group">
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
                        Select your Country
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
                      <p className="mt-1 text-sm text-red-500 font-bold text-left">
                        {errors.country.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )} */}

            {step === 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 px-4 gap-6">
                  <div className="z-0 w-full mb-3 group">
                    <label
                      htmlFor="preferred_icp_hub"
                      className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                    >
                      Preferred ICP Hub you would like to be associated with <span className="text-red-600">*</span>
                    </label>
                    <select
                      {...register("preferred_icp_hub")}
                      className={`bg-gray-50 border-2 ${
                        errors.preferred_icp_hub
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
                    {errors.preferred_icp_hub && (
                      <p className="mt-1 text-sm text-red-500 font-bold text-left">
                        {errors.preferred_icp_hub.message}
                      </p>
                    )}
                  </div>
                  <div className="z-0 w-full mb-3 group">
                    <label
                      htmlFor="multi_chain"
                      className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                    >
                      Are you also multi-chain <span className="text-red-600">*</span>
                    </label>
                    <select
                      {...register("multi_chain")}
                      className={`bg-gray-50 border-2 ${
                        errors.multi_chain
                          ? "border-red-500 placeholder:text-red-500"
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
                    {errors.multi_chain && (
                      <p className="mt-1 text-sm text-red-500 font-bold text-left">
                        {errors.multi_chain.message}
                      </p>
                    )}
                  </div>
                  {isMulti_Chain && (
                    <div className="z-0 w-full mb-3 group">
                      <label
                        htmlFor="multichain"
                        className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                      >
                        Please select the chains *
                      </label>
                      <select
                        {...register("multichain")}
                        className={`bg-gray-50 border-2 ${
                          errors.multichain
                            ? "border-red-500 placeholder:text-red-500"
                            : "border-[#737373]"
                        } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                      >
                        {multiChain?.map((chain, i) => (
                          <option
                            key={i}
                            value={`${chain}`}
                            className="text-lg font-bold"
                          >
                            {chain}
                          </option>
                        ))}
                      </select>
                      {errors.multichain && (
                        <p className="mt-1 text-sm text-red-500 font-bold text-left">
                          {errors.multichain.message}
                        </p>
                      )}
                    </div>
                  )}
                  <div className="z-0 w-full mb-3 group">
                    <label
                      htmlFor="existing_icp_mentor"
                      className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                    >
                      Are you an existing ICP Mentors ?*
                    </label>
                    <select
                      {...register("existing_icp_mentor")}
                      className={`bg-gray-50 border-2 ${
                        errors.existing_icp_mentor
                          ? "border-red-500 placeholder:text-red-500"
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
                    {errors.existing_icp_mentor && (
                      <p className="mt-1 text-sm text-red-500 font-bold text-left">
                        {errors.existing_icp_mentor.message}
                      </p>
                    )}
                  </div>
                  {isExistingICPMentor && (
                    <div className="z-0 w-full mb-3 group">
                      <label
                        htmlFor="existing_icp_project_porfolio"
                        className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                      >
                        Existing ICP project portfolio
                      </label>
                      <input
                        type="text"
                        name="existing_icp_project_porfolio"
                        id="existing_icp_project_porfolio"
                        {...register("existing_icp_project_porfolio")}
                        className={`bg-gray-50 border-2 ${
                          errors.existing_icp_project_porfolio
                            ? "border-red-500 placeholder:text-red-500"
                            : "border-[#737373]"
                        } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                      />
                      {errors.existing_icp_project_porfolio && (
                        <p className="mt-1 text-sm text-red-500 font-bold text-left">
                          {errors.existing_icp_project_porfolio.message}
                        </p>
                      )}
                    </div>
                  )}
                  <div className="z-0 w-full mb-3 group">
                    <label
                      htmlFor="area_of_expertise"
                      className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                    >
                      Areas of expertise? *
                    </label>
                    <select
                      {...register("area_of_expertise")}
                      className={`bg-gray-50 border-2 ${
                        errors.area_of_expertise
                          ? "border-red-500 placeholder:text-red-500"
                          : "border-[#737373]"
                      } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                    >
                      <option className="text-lg font-bold" value="">
                        Areas of expertise
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
                    {errors.area_of_expertise && (
                      <p className="mt-1 text-sm text-red-500 font-bold text-left">
                        {errors.area_of_expertise.message}
                      </p>
                    )}
                  </div>

                  <div className="z-0 w-full mb-3 group">
                    <label
                      htmlFor="category_of_mentoring_service"
                      className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                    >
                      Categories of mentoring services *
                    </label>
                    <select
                      {...register("category_of_mentoring_service")}
                      className={`bg-gray-50 border-2 ${
                        errors.category_of_mentoring_service
                          ? "border-red-500 placeholder:text-red-500"
                          : "border-[#737373]"
                      } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                    >
                      <option className="text-lg font-bold" value="">
                        Select your option
                      </option>
                      <option className="text-lg font-bold">Incubation</option>
                      <option className="text-lg font-bold">Tokenomics</option>
                      <option className="text-lg font-bold">Branding</option>
                      <option className="text-lg font-bold">Listing</option>
                      <option className="text-lg font-bold">Raise</option>
                    </select>
                    {errors.category_of_mentoring_service && (
                      <p className="mt-1 text-sm text-red-500 font-bold text-left">
                        {errors.category_of_mentoring_service.message}
                      </p>
                    )}
                  </div>
                  <div className="z-0 w-full mb-3 group">
                    <label
                      htmlFor="icp_hub_or_spoke"
                      className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                    >
                      Are you ICP Hub/Spoke
                    </label>
                    <select
                      {...register("icp_hub_or_spoke")}
                      className={`bg-gray-50 border-2 ${
                        errors.icp_hub_or_spoke
                          ? "border-red-500 placeholder:text-red-500"
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
                  {isicpHuborSpoke && (
                    <div className="z-0 w-full mb-3 group">
                      <label
                        htmlFor="hub_owner"
                        className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                      >
                        Hub Owner *
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
                            {hub.name} , {hub.region}
                          </option>
                        ))}
                      </select>
                      {errors.hub_owner && (
                        <p className="mt-1 text-sm text-red-500 font-bold text-left">
                          {errors.hub_owner.message}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {StepComponent &&
            React.cloneElement(StepComponent, {
              onSubmit: handleSubmit(onSubmit, errorFunc),
              register,
              errors,
              fields: stepFields,
              goToPrevious: handlePrevious,
              goToNext: handleNext,
            })}
          <Toaster />
        </div>
      </section>
    </>
  );
};

export default MentorRegistration;

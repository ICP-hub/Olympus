import React, { useEffect, useCallback, useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDropzone } from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";
import { allHubHandlerRequest } from "../../StateManagement/Redux/Reducers/All_IcpHubReducer";
import CompressedImage from "../../ImageCompressed/CompressedImage";
import { projectRegistration } from "../../Utils/Data/AllDetailFormData";
import { projectPersonalInformation ,projectDetails} from "../../Utils/Data/createFormData";
import { Tooltip as ReactTooltip } from "react-tooltip";
import toast, { Toaster } from "react-hot-toast";
import CreateProjectPersonalInformation from "../CreateProjectPersonalInformation";
import { useCountries } from "react-countries";
import { userRegisteredHandlerRequest } from "../../StateManagement/Redux/Reducers/userRegisteredData";
import CreateProjectsDetails from "./CreateProjectsDetails";
import { bufferToImageBlob } from "../../Utils/formatter/bufferToImageBlob";
const validationSchema = {
  personalDetails: yup.object().shape({
    full_name: yup
      .string()
      .required()
      .test("is-non-empty", null, (value) => value && value.trim().length > 0),
    user_name: yup
      .string()
      .min(6, "Username must be at least 6 characters")
      .max(20, "Username must be at most 20 characters")
      .matches(
        /^(?=.*[A-Z0-9_])[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores"
      )
      .optional(),
    openchat_username: yup
      .string()
      .min(6, "openchat username must be at least 6 characters")
      .max(20, "openchat username must be at most 20 characters")
      .matches(
        /^(?=.*[A-Z0-9_])[a-zA-Z0-9_]+$/,
        "openchat username can only contain letters, numbers, and underscores"
      )
      .optional(),
    bio: yup.string().optional(),
    email: yup.string().email().optional(),
    telegram_id: yup.string().optional().url(),
    twitter_id: yup.string().optional().url(),
    country: yup
      .string()
      .test("is-non-empty", "ICP Hub selection is required", (value) =>
        /\S/.test(value)
      ),
    area_of_intrest: yup.string().required("Selecting a interest is required."),
    imageData: yup.mixed().required("An image is required"),

  }),
  projectDetails: yup.object().shape({
    project_name: yup.string().required("Project name is required"),
    github_link: yup
      .string()
      .url("Must be a valid URL")
      .required("URL is required"),
    project_description: yup.string().required("Description is required"),
    preferred_icp_hub: yup.string().required("ICP hub is required"),
    project_area_of_focus: yup.string().required("Area of focus is required"),
    project_cover: yup.mixed().required("Project Cover is required"),
    project_logo: yup.mixed().required("Logo is required"),
    social_links: yup.array().of(yup.string().url("Must be a valid URL")),
  }),
};

const CreateProjectRegistration = () => {
  const actor = useSelector((currState) => currState.actors.actor);
  const getAllIcpHubs = useSelector((currState) => currState.hubs.allHubs);
  const areaOfExpertise = useSelector(
    (currState) => currState.expertiseIn.expertise
  );
  const userData = useSelector((currState) => currState.userData.data.Ok);
  const dispatch = useDispatch();
  const { countries } = useCountries();

  const [activeTab, setActiveTab] = useState(projectRegistration[0].id);
  const [formData, setFormData] = useState({});
  const [step, setStep] = useState(0);
  const [isCurrentStepValid, setIsCurrentStepValid] = useState(false);
  const [userHasInteracted, setUserHasInteracted] = useState(false);
  const [projectLogo, setProjectLogo] = useState(null);
  const [projectLogoPreview, setProjectLogoPreview] = useState(null);
  const [isProjectLoading, setIsProjectLoading] = useState(false);
  const [isLoadingMultiple, setIsMultipleLoading] = useState(false);
  const [multipleImagesPreview, setMultipleImagesPreview] = useState([]);
  const [multipleImageData, setMultipleImageData] = useState([]);
  const [imageData, setImageData] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  console.log('userData',userData)

  useEffect(() => {
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
        area_of_intrest: userData.area_of_intrest || "",
      };

      // If there is a mentor_image, handle its conversion and set it separately if needed
      if (userData.profile_picture) {
        bufferToImageBlob(userData?.profile_picture)
          .then((imageUrl) => {
            setImagePreview(imageUrl);
            setFormData({ imageData: userData.profile_picture });
            // You might also need to handle setting the image for display if required
          })
          .catch((error) => console.error("Error converting image:", error));
      }
      reset(formData);
    }
  }, [userData]);

  const getTabClassName = (tab) => {
    return `inline-block p-2 font-bold ${
      activeTab === tab
        ? "text-black border-b-2 border-black"
        : "text-gray-400  border-transparent hover:text-black"
    } rounded-t-lg`;
  };

  useEffect(() => {
    dispatch(userRegisteredHandlerRequest());
  }, [actor, dispatch]);

  
  const steps = [
    { id: "personalDetails", fields: projectPersonalInformation },
    { id: "projectDetails", fields: projectDetails },
  ];

  const currentValidationSchema = validationSchema[steps[step].id];

 

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    trigger,
    setError,
    clearErrors,
    reset,
    control,
  } = useForm({
    resolver: yupResolver(currentValidationSchema),
    mode: "all",
  });


  const handleTabClick = async (tab) => {
    const targetStep = projectRegistration.findIndex(
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

  useEffect(() => {
    if (!userHasInteracted) return;
    const validateStep = async () => {
      const fieldsToValidate = steps[step].fields.map((field) => field.name);
      const result = await trigger(fieldsToValidate);
      setIsCurrentStepValid(result);
    };

    validateStep();
  }, [step, trigger, userHasInteracted]);
  const addProjectLogoHandler = useCallback(
    async (file) => {
      clearErrors("project_logo");
      if (!file)
        return setError("project_logo", {
          type: "manual",
          message: "An image is required",
        });
      if (!["image/jpeg", "image/png", "image/gif"].includes(file.type))
        return setError("project_logo", {
          type: "manual",
          message: "Unsupported file format",
        });
      if (file.size > 1024 * 1024)
        // 1MB
        return setError("project_logo", {
          type: "manual",
          message: "The file is too large",
        });

      setIsProjectLoading(true);
      try {
        const compressedFile = await CompressedImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setProjectLogoPreview(reader.result);
          setIsProjectLoading(false);
        };
        reader.readAsDataURL(compressedFile);

        const byteArray = await compressedFile.arrayBuffer();
        setProjectLogo(Array.from(new Uint8Array(byteArray)));
        clearErrors("project_logo");
      } catch (error) {
        console.error("Error processing the image:", error);
        setError("project_logo", {
          type: "manual",
          message: "Could not process image, please try another.",
        });
        setIsProjectLoading(false);
      }
    },
    [
      setError,
      clearErrors,
      setIsProjectLoading,
      setProjectLogoPreview,
      setProjectLogo,
    ]
  );

  const addMultipleImageHandler = useCallback(
    async (acceptedFiles) => {
      clearErrors("project_cover");
      setIsMultipleLoading(true);
      const validatedFiles = acceptedFiles.filter((file, index) => {
        if (index >= 5) {
          setError("project_cover", {
            type: "manual",
            message: "You can only upload up to 5 images",
          });
          return false;
        }
        if (!["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
          setError("project_cover", {
            type: "manual",
            message: "Unsupported file format",
          });
          return false;
        }
        if (file.size > 1024 * 1024) {
          // 1MB
          setError("project_cover", {
            type: "manual",
            message: "The file is too large",
          });
          return false;
        }
        return true;
      });

      // Check if the number of validated files is greater than 5
      if (validatedFiles.length > 5) {
        setIsMultipleLoading(false);
        return; // Stop further processing
      }

      const multipleImagesPreviewTemp = [];
      const imagesDataTemp = [];

      for (const file of validatedFiles) {
        try {
          const compressedFile = await CompressedImage(file);
          const reader = new FileReader();

          reader.onloadend = () => {
            multipleImagesPreviewTemp.push(reader.result);
            setMultipleImagesPreview([...multipleImagesPreviewTemp]);
            setIsMultipleLoading(false);
          };
          reader.readAsDataURL(compressedFile);

          const byteArray = await compressedFile.arrayBuffer();
          imagesDataTemp.push(Array.from(new Uint8Array(byteArray)));
          setMultipleImageData([...imagesDataTemp]);
        } catch (error) {
          console.error("Error processing the image:", error);
          setError("project_cover", {
            type: "manual",
            message: "Could not process image, please try another.",
          });
          setIsMultipleLoading(false);
        }
      }
    },
    [
      setError,
      clearErrors,
      setIsMultipleLoading,
      setMultipleImagesPreview,
      setMultipleImageData,
    ]
  );
  const removeImage = (index) => {
    const newPreviewImages = [...multipleImagesPreview];
    newPreviewImages.splice(index, 1);
    setMultipleImagesPreview(newPreviewImages);

    const newData = [...multipleImageData];
    newData.splice(index, 1);
    setMultipleImageData(newData);
  };
  const addImageHandler = useCallback(
    async (file) => {
      clearErrors("imageData");
      if (!file)
        return setError("imageData", {
          type: "manual",
          message: "An image is required",
        });
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
  const handleNext = async () => {
    const fieldsToValidate = steps[step].fields.map((field) => field.name);
    console.log(fieldsToValidate)
    const result = await trigger(fieldsToValidate);
    console.log(result)
    // const isImageUploaded = imageData && imageData.length > 0;

    // if (!isImageUploaded) {
    //   setError("imageData", {
    //     type: "manual",
    //     message: "Please upload a ICP Hub profile.",
    //   });
    //   return;
    // }
    // if (result && isImageUploaded) {
    //   clearErrors("imageData");
      if (step < steps.length - 1) {
        setStep((prevStep) => prevStep + 1);
        setActiveTab([step + 1]?.id);
      }
    // }
  };

  const handlePrevious = () => {
    if (step > 0) {
      setStep((prevStep) => prevStep - 1);
      setActiveTab(projectRegistration[step - 1]?.id);
    }
  };

const onError=(val)=>{
  console.log('val',val)
}
  const onSubmit = (data) => {
    console.log("dataaaaaaaaaaaaa", data);
    
    const updatedFormData = { ...formData, ...data };
    setFormData(updatedFormData);

    if (step < steps.length - 1) {
      handleNext();
    }else{
      console.log("form submitted ...............");
    }
    // Process form data
  };
  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/jpeg, image/png, image/gif",
    onDrop: addMultipleImageHandler,
    multiple: true,
  });
  const stepFields = steps[step].fields;
  let StepComponent;
  if (step === 0) {
    StepComponent = <CreateProjectPersonalInformation />;
  } else if (step === 1) {
     StepComponent = <CreateProjectsDetails/>
  }

  useEffect(() => {
    dispatch(allHubHandlerRequest());
  }, [actor, dispatch]);
  return (
    <section className="w-full h-fit px-[6%] lg1:px-[4%] py-[6%] lg1:py-[4%] bg-gray-100">
      <div className="w-full h-full bg-gray-100 pt-8">
        <div className="bg-gradient-to-r from-purple-800 to-blue-500 text-transparent bg-clip-text text-[30px]  sm:text-[25px] md1:text-[30px] md2:text-[35px] font-black font-fontUse dxl:text-[40px] p-8">
          Project Information
        </div>
        <div className="text-sm font-medium text-center text-gray-200 ">
          <ul className="flex flex-wrap mb-4 text-sxxs:text-[7px] sxs:text-[7.5px] sxs1:text-[8px] sxs2:text-[8.5px] sxs3:text-[9px] ss:text-[9.5px] ss1:text-[10px] ss2:text-[10.5px] ss3:text-[11px] ss4:text-[11.5px] dxs:text-[12px] xxs:text-[12.5px] xxs1:text-[13px] sm1:text-[13.5px] sm4:text-[14px] sm2:text-[14.5px] sm3:text-[13px] sm:text-[11.5px] md:text-[14px.3] md1:text-[13px] md2:text-[13px] md3:text-[13px] lg:text-[14.5px] dlg:text-[15px] lg1:text-[16.5px] lgx:text-[16px] dxl:text-[16.5px] xl:text-[19px] xl2:text-[19.5px] cursor-pointer justify-around">
            {projectRegistration?.map((header, index) => (
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
          {step === 0 && (
            <>
              <div className="flex flex-col">
                <div className="flex-row w-full flex justify-start gap-4 items-center">
                  <div className="mb-3 ml-6 h-24 w-24 rounded-full border-2 border-gray-300 flex items-center justify-center overflow-hidden">
                    {isLoading ? (
                      <svg
                        width="35"
                        height="37"
                        viewBox="0 0 35 37"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="bg-no-repeat animate-pulse"
                      >
                        <path
                          d="M8.53049 8.62583C8.5304 13.3783 12.3575 17.2449 17.0605 17.2438C21.7634 17.2428 25.5907 13.3744 25.5908 8.62196C25.5909 3.8695 21.7638 0.00287764 17.0608 0.00394405C12.3579 0.00501045 8.53058 3.87336 8.53049 8.62583ZM32.2249 36.3959L34.1204 36.3954L34.1205 34.4799C34.1206 27.0878 28.1667 21.0724 20.8516 21.0741L13.2692 21.0758C5.95224 21.0775 -3.41468e-05 27.0955 -0.000176714 34.4876L-0.000213659 36.4032L32.2249 36.3959Z"
                          fill="#BBBBBB"
                        />
                      </svg>
                    ) : imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : projectPersonalInformation.imageData ? (
                      <img
                        src={projectPersonalInformation?.imageData}
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
              <div className="z-0 w-full my-3 group px-4">
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
            </>
          )}
          {StepComponent &&
            React.cloneElement(StepComponent, {
              onSubmit: handleSubmit(onSubmit,onError),
              register,
              errors,
              fields: stepFields,
              goToPrevious: handlePrevious,
              goToNext: handleNext,
            })}
          <Toaster />
          {/* <form className="w-full px-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col mb-6">
              <div className="flex flex-row flex-wrap-reverse">
                <div className="flex flex-col w-1/2">
                <div className="flex-row w-full flex justify-start gap-4 items-center">
                    <div className="mb-3 ml-6 h-24 w-24 rounded-full border-2 border-gray-300 flex items-center justify-center overflow-hidden">
                      {isProjectLoading ? (
                        <div>Loading...</div>
                      ) : projectLogoPreview ? (
                        <img
                          src={projectLogoPreview}
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
                      name="project_logo"
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
                              addProjectLogoHandler(file);
                            }}
                          />
                          <label
                            htmlFor="images"
                            className="p-2 border-2 border-blue-800 items-center rounded-md text-md bg-transparent text-blue-800 cursor-pointer font-extrabold"
                          >
                            Project Logo
                          </label>
                        </>
                      )}
                    />

                    {errors.project_logo && (
                      <span className="mt-1 text-sm text-red-500 font-bold text-start px-4">
                        {errors.project_logo.message}
                      </span>
                    )}
                  </div>
                  <div className="mb-6">
                    <label
                      htmlFor="project_name"
                      className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                    >
                      Project Name
                    </label>
                    <input
                      type="text" // Assuming project_name is of type text
                      name="project_name"
                      id="project_name"
                      {...register("project_name")}
                      className={`bg-gray-50 border-2 ${errors["project_name"]
                          ? "border-red-500 placeholder:text-red-500"
                          : "border-[#737373]"
                        } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block lg:md:w-full  p-2.5 `}
                      placeholder="Enter the project name    "
                    />
                    {errors["project_name"] && (
                      <span className="mt-1 text-sm text-red-500 font-bold flex justify-start ">
                        {errors["project_name"].message}
                      </span>
                    )}
                  </div>
                  <div className="mb-6">
                    <label
                      htmlFor="project_url"
                      className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                    >
                      Project URL
                    </label>
                    <input
                      type="text" // Assuming project_name is of type text
                      name="project_url"
                      id="project_url"
                      {...register("project_url")}
                      className={`bg-gray-50 border-2 ${errors["project_url"]
                          ? "border-red-500 placeholder:text-red-500"
                          : "border-[#737373]"
                        } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block lg:md:w-full p-2.5 `}
                      placeholder="Enter the project URL"
                    />
                    {errors["project_url"] && (
                      <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                        {errors["project_url"].message}
                      </span>
                    )}
                  </div>
                </div>
                <div className="w-full md:w-1/2  flex justify-center ">
                  <div className="md:w-[300px] w-full mb-8 flex flex-col ">
                    <div className="flex flex-col justify-between border border-gray-300 rounded-xl pt-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <img
                            className="object-fill rounded-full h-12 w-12 ml-4"
                            src={imagePreview}
                            alt="Project logo"
                          />
                          <div className="ml-2">
                            <p className="text-[16px] font-extrabold text-black">
                              project
                            </p>
                            <p
                              className="truncate overflow-hidden whitespace-nowrap text-[10px] text-gray-400"
                              style={{ maxHeight: "4.5rem" }}
                            >
                             
                            </p>
                          </div>
                        </div>
                      </div>
                      <p
                        className="text-[10px] px-4 pt-3 text-gray-400 overflow-hidden"
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: "2",
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        jgdhgdg
                      </p>

                      
                      <div className="flex items-center w-full mt-4 px-2">
                        <div className="relative flex-grow  h-2  rounded-lg bg-gradient-to-r from-gray-100 to-black"></div>
                        <p className="text-xs ml-2 text-black">level 9</p>
                      </div>
                     
                      <div className="w-full px-8 my-5 border-t-2 border-gray-300"></div>

                      <div className="flex flex-row justify-between items-center px-4 pb-4 ">
                        <img
                          className="object-fill h-5 w-5 rounded-full"
                          src={imagePreview}
                          alt="Project logo"
                        />
                        <button className="rounded-sm h-8 w-16 mr-4 border border-gray-300 flex justify-center items-center">
                          <div className="flex flex-row gap-2 justify-center items-center">
                            <svg
                              width="15"
                              height="15"
                              viewBox="0 0 8 6"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="transition-transform transform hover:scale-150"
                            >
                              <path
                                d="M3.04007 0.934606C3.44005 0.449652 4.18299 0.449652 4.58298 0.934606L6.79207 3.61298C7.33002 4.26522 6.86608 5.24927 6.02061 5.24927H1.60244C0.756969 5.24927 0.293022 4.26522 0.830981 3.61298L3.04007 0.934606Z"
                                fill="#737373"
                              />
                            </svg>
                            <span className="text-black text-[10px] font-bold">
                              UpVote
                            </span>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative z-0 group">
                  <label
                    htmlFor="preferred_icp_hub"
                    className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                  >
                    Can you please share your preferred ICP Hub
                  </label>
                  <select
                    {...register("preferred_icp_hub")}
                    className={`bg-gray-50 border-2 ${errors.preferred_icp_hub
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
                    <p className="text-red-500 text-xs italic">
                      {errors.preferred_icp_hub.message}
                    </p>
                  )}
                </div>
                <div className="relative z-0 group">
                  <label
                    htmlFor="areas_of_focus"
                    className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                  >
                    What are your areas of expertise?
                  </label>
                  <select
                    {...register("areas_of_focus")}
                    className={`bg-gray-50 border-2 ${errors.areas_of_focus
                        ? "border-red-500 placeholder:text-red-500"
                        : "border-[#737373]"
                      } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                  >
                    <option className="text-lg font-bold" value="">
                      Areas of Focus
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
                  {errors.areas_of_focus && (
                    <p className="text-red-500 text-xs italic">
                      {errors.areas_of_focus.message}
                    </p>
                  )}
                </div>

                <div className="relative z-0 group">
                  <label
                    htmlFor="project_description"
                    className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                  >
                    Project Description
                  </label>
                  <textarea
                    name="project_description"
                    id="project_description"
                    {...register("project_description")}
                    className={`bg-gray-50 border-2 ${errors["project_description"]
                        ? "border-red-500 placeholder:text-red-500"
                        : "border-[#737373]"
                      } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                    placeholder="Enter the project description"
                    rows="4" // Adjust the number of rows as needed
                  ></textarea>
                  {errors["project_description"] && (
                    <span className="mt-1 text-sm text-red-500 font-bold">
                      {errors["project_description"].message}
                    </span>
                  )}
                </div>
                <div className="flex flex-col w-full justify-start">
                  <label
                    htmlFor="project_description"
                    className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                  >
                    Project Cover
                  </label>
                  <div
                    {...getRootProps()}
                    className=" h-24 w-full rounded border-2 border-black border-dashed flex justify-center items-center overflow-hidden cursor-pointer"
                  >
                    <input {...getInputProps()} />
                    {isLoadingMultiple ? (
                      <div>Loading...</div>
                    ) : (
                      <div className="flex flex-wrap">
                        {multipleImagesPreview.length > 0 ? (
                          multipleImagesPreview.map((src, index) => (
                            <div key={index} className="relative">
                              <img
                                src={src}
                                alt={`Preview ${index}`}
                                className="h-16 w-16 object-cover"
                              />
                              <button
                                onClick={() => removeImage(index)}
                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full "
                              >
                                X
                              </button>
                            </div>
                          ))
                        ) : (
                          <p className="text-black">Drag 'n' drop some files here, or click to select files</p>
                        )}
                        {control && (
                          <Controller
                            name="project_cover"
                            control={control}
                            render={({ field }) => <></>} // As the input is being managed by Dropzone, this remains empty.
                          />
                        )}

                        {setError && (
                          <div>
                            {multipleImageData.length > 0 && (
                              <p className="text-sm text-green-500">
                                Images are ready for upload.
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    )}



                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="text-white font-bold bg-blue-800 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-md w-auto sm:w-auto px-5 py-2 text-center mb-4"
              // onClick={goToNext}
              >
                Next
              </button>
            </div>
          </form> */}
        </div>
      </div>
    </section>
  );
};

export default CreateProjectRegistration;

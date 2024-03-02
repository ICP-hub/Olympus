import React, { useState, useEffect ,useCallback} from "react";
import { hubRegistration } from "../../Utils/Data/AllDetailFormData";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  hubRegistrationDetails,
  hubRegistrationPersonalDetails,
} from "../../Utils/Data/hubFormData";
import { useSelector } from "react-redux";
import CompressedImage from "../../ImageCompressed/CompressedImage";
import { useDispatch } from "react-redux";
import { allHubHandlerRequest } from "../../Redux/Reducers/All_IcpHubReducer";
import HubPersonalInformation from "./HubPersonalInformation";
import HubDetails from "./HubDetails";
import toast, { Toaster } from "react-hot-toast";
// import { DocumentPreview } from "../../ImageCompressed/DocumentPreview";


const validationSchema = {
  personalDetails: yup.object().shape({
    fullName: yup
      .string()
      .test("is-non-empty", "Full Name is required", (value) => /\S/.test(value))
      .required("Full Name is required"),
    hubName: yup
      .string()
      .test("is-non-empty", "ICP Hub name is required", (value) => /\S/.test(value))
      .required("ICP Hub name is required"),
    email: yup
      .string()
      .email("Must be a valid email")
      .required("Email is required")
      .test("is-non-empty", "Email is required", (value) => /\S/.test(value)),
    hubLocation: yup
      .string()
      .test("is-non-empty", "Location is required", (value) => /\S/.test(value))
      .required("Location is required"),
    hubDescription: yup
      .string()
      .required("ICP Hub description is required")
      .test("is-non-empty", "ICP Hub description is required", (value) => /\S/.test(value)),
    websiteUrl: yup
      .string()
      .url("Must be a valid URL")
      .required("Website URL is required")
      .test("is-non-empty", "Website URL is required", (value) => /\S/.test(value)),
    imageData: yup.mixed().required("An image is required"),
  }),

  hubDetails: yup.object().shape({
    contactNumber: yup
      .string()
      .matches(/^[0-9]+$/, "Must be only digits")
      .required("Contact number is required")
      .test("is-non-empty", "Contact number is required", (value) => /\S/.test(value)),
    privacyPolicyConsent: yup
      .boolean()
      .required("Privacy policy consent is required")
      .test("is-non-empty", "Privacy policy consent is required", (value) => /\S/.test(value)),
    communicationConsent: yup
      .boolean()
      .required("Communication consent is required")
      .test("is-non-empty", "Communication consent is required", (value) => /\S/.test(value)),
      documentData: yup.mixed()
      .required("A document is required")
      .test(
        "fileSize",
        "The file is too large",
        value => value && value[0] && value[0].size <= 1024 * 1024 // 1MB
      )
      .test(
        "fileType",
        "Unsupported file format",
        value => value && value[0] && [
          "application/pdf",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        ].includes(value[0].type)
      ),
  }),
};
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" onClick={onClose}>
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div>{children}</div>
        <button onClick={onClose} className="absolute top-0 right-0 p-2">Close</button>
      </div>
    </div>
  );
};

const HubRegistration = () => {
  const actor = useSelector((currState) => currState.actors.actor);
  // const getAllIcpHubs = useSelector((currState) => currState.hubs.allHubs);

  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState(hubRegistration[0].id);
  const [formData, setFormData] = useState({});
  const [step, setStep] = useState(0);
  const [isCurrentStepValid, setIsCurrentStepValid] = useState(false);
  const [userHasInteracted, setUserHasInteracted] = useState(false);
  const [imageData, setImageData] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [documentPreview, setDocumentPreview] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // console.log("getAllIcpHubs + actor =>", getAllIcpHubs, actor);

  const getTabClassName = (tab) => {
    return `inline-block p-2 font-bold ${
      activeTab === tab
        ? "text-black border-b-2 border-black"
        : "text-gray-400  border-transparent hover:text-black"
    } rounded-t-lg`;
  };

  const steps = [
    { id: "personalDetails", fields: hubRegistrationPersonalDetails },
    { id: "hubDetails", fields: hubRegistrationDetails },
  ];

  const currentValidationSchema = validationSchema[steps[step].id];

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    trigger,
    setError,
    clearErrors,
    control,
  } = useForm({
    resolver: yupResolver(currentValidationSchema),
  });

  const handleTabClick = async (tab) => {
    const targetStep = hubRegistration.findIndex((header) => header.id === tab);
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

  useEffect(() => {
    dispatch(allHubHandlerRequest());
  }, [actor, dispatch]);

 

  const addImageHandler = useCallback(async (file) => {
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
    if (file.size > 1024 * 1024) // 1MB
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
  }, [setError, clearErrors, setIsLoading, setImagePreview, setImageData]);


  const addDocumentHandler = useCallback(async (file) => {
    clearErrors("documentData");
    if (!file) {
      return setError("documentData", {
        type: "manual",
        message: "A document is required",
      });
    }
  
    try {
      const fileUrl = URL.createObjectURL(file);
      setDocumentPreview(fileUrl);
      setIsModalOpen(true); // Open modal to view the document
  
      // Read the file as an ArrayBuffer for backend submission
      const arrayBuffer = await readFileAsArrayBuffer(file);
      console.log(arrayBuffer); // Placeholder for actual usage
  
      // Example: Here you would typically send the ArrayBuffer to the backend
      // sendArrayBufferToBackend(arrayBuffer);
    } catch (error) {
      console.error("Error processing the document:", error);
      setError("documentData", {
        type: "manual",
        message: "Could not process document, please try another.",
      });
    }
  }, [setError, clearErrors, setDocumentPreview, setIsModalOpen]);
  
  const readFileAsArrayBuffer = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };
  
  console.log('documentPreview',documentPreview)

  const handleNext = async () => {
    const fieldsToValidate = steps[step].fields.map((field) => field.name);
    const result = await trigger(fieldsToValidate);
    const isImageUploaded = imageData && imageData.length > 0;

    if (!isImageUploaded) {
        setError("imageData", {
            type: "manual",
            message: "Please upload a ICP Hub profile."
        });
        return;
    }
    if (result && isImageUploaded) {
        clearErrors("imageData");
        if (step < steps.length - 1) {
            setStep((prevStep) => prevStep + 1);
        }
    }
};


  const handlePrevious = () => {
    if (step > 0) {
      setStep((prevStep) => prevStep - 1);
    }
  };

  const onSubmit = async (data) => {
    console.log("data >>>>", data);
    const updatedFormData = { ...formData, ...data };
    console.log(updatedFormData);
    setFormData(updatedFormData);

    if (step < steps.length - 1) {
      handleNext();
    } else {
      const hubDataObject = {
        email: [updatedFormData.email],
        hub_name: [updatedFormData.hubName],
        hub_location: [updatedFormData.hubLocation],
        full_name: [updatedFormData.fullName],
        hub_description: [updatedFormData.hubDescription],
        website_url: [updatedFormData.websiteUrl],
        contact_number: [updatedFormData.contactNumber],
        privacy_policy_consent: [updatedFormData.privacyPolicyConsent],
        communication_consent: [updatedFormData.communicationConsent],
        id_professional_document_upload: [],
        profile_picture: [imageData],
      };

      const sendingHubData = async () => {
        try {
          const result = await actor.register_hub_organizer_candid(
            hubDataObject
          );
          toast.success(result);
          console.log("hub data registered in backend");
        } catch (error) {
          toast.error(error);
          console.log(error.message);
        }
      };
      sendingHubData();
    }
  };

  const stepFields = steps[step].fields;
  let StepComponent;
  if (step === 0) {
    StepComponent = <HubPersonalInformation />;
  } else if (step === 1) {
    StepComponent = <HubDetails isSubmitting={isSubmitting} />;
  }
  // else if (step === 2) {
  //   StepComponent = <MentorAdditionalInformation />;
  // }

  return (
    <div className="w-full h-full bg-gray-100">
      <div className="text-sm font-medium text-center text-gray-200 ">
        <ul className="flex flex-wrap mb-4 text-sxxs:text-[7px] sxs:text-[7.5px] sxs1:text-[8px] sxs2:text-[8.5px] sxs3:text-[9px] ss:text-[9.5px] ss1:text-[10px] ss2:text-[10.5px] ss3:text-[11px] ss4:text-[11.5px] dxs:text-[12px] xxs:text-[12.5px] xxs1:text-[13px] sm1:text-[13.5px] sm4:text-[14px] sm2:text-[14.5px] sm3:text-[13px] sm:text-[11.5px] md:text-[14px.3] md1:text-[13px] md2:text-[13px] md3:text-[13px] lg:text-[14.5px] dlg:text-[15px] lg1:text-[16.5px] lgx:text-[16px] dxl:text-[16.5px] xl:text-[19px] xl2:text-[19.5px] cursor-pointer justify-around">
          {hubRegistration?.map((header, index) => (
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

                <div className="flex md:hidden items-center">{header.icon}</div>
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
                      Upload Profile
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
        )}
        {step === 1 && (
          <div className="flex flex-col">
            <div className="relative z-0 group mb-6 px-4">
              <label
                htmlFor="privacyPolicyConsent"
                className="block mb-2 text-lg font-medium text-gray-500 hover:text-black  truncate overflow-hidden text-start"
              >
                Do you consent to our privacy policy?
              </label>
              <select
                {...register("privacyPolicyConsent")}
                id="privacyPolicyConsent"
                className={`bg-gray-50 border-2 ${
                  errors.privacyPolicyConsent
                    ? "border-red-500 placeholder:text-red-500"
                    : "border-[#737373]"
                } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
              >
                <option className="text-lg font-bold" value="">
                  Consent to our privacy policy
                </option>
                <option className="text-lg font-bold" value="true">
                  Yes
                </option>
                <option className="text-lg font-bold" value="false">
                  No
                </option>
              </select>

              {errors.privacyPolicyConsent && (
                <span className="mt-1 text-sm text-red-500 font-bold flex">
                  {errors.privacyPolicyConsent.message}
                </span>
              )}
            </div>

            <div className="relative z-0 group mb-6 px-4">
              <label
                htmlFor="communicationConsent"
                className="block mb-2 text-lg font-medium text-gray-500 hover:text-black  truncate overflow-hidden text-start"
              >
                Do you consent to receive communications from us?
              </label>
              <select
                {...register("communicationConsent")}
                id="communicationConsent"
                className={`bg-gray-50 border-2 ${
                  errors.communicationConsent
                    ? "border-red-500 placeholder:text-red-500"
                    : "border-[#737373]"
                } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
              >
                <option className="text-lg font-bold" value="">
                  Communication Consent?
                </option>
                <option className="text-lg font-bold" value="true">
                  Yes
                </option>
                <option className="text-lg font-bold" value="false">
                  No
                </option>
              </select>
              {errors.communicationConsent && (
                <span className="mt-1 text-sm text-red-500 font-bold flex">
                  {errors.communicationConsent.message}
                </span>
              )}
            </div>
            <div className="flex flex-col">
      <div className="flex-row w-full flex justify-start gap-4 items-center">
        <div className="mb-3 ml-6 flex items-center justify-center">
          <button onClick={() => setIsModalOpen(true)} className="p-2 border-2 border-gray-300 rounded-md">
            View Document
          </button>
        </div>

        <Controller
          name="documentData"
          control={control}
          render={({ field }) => (
            <>
              <input
                id="documents"
                type="file"
                name="documents"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  addDocumentHandler(file);
                  field.onChange(e.target.files); // Important for validation to work
                }}
              />
              <label htmlFor="documents" className="p-2 border-2 border-blue-800 rounded-md text-md bg-transparent text-blue-800 cursor-pointer font-extrabold">
                Upload Document
              </label>
            </>
          )}
        />
      </div>
      {errors.documentData && (
        <span className="mt-1 text-sm text-red-500 font-bold text-start px-4">
          {errors.documentData.message}
        </span>
      )}
      </div>
          </div>
        )}
      </div>
      {/* <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-4">
          {/* Render document preview here. Adjust based on document type. 
          {documentPreview &&  <DocumentPreview file={documentPreview} />}
          
        </div>
      </Modal> */}
      {StepComponent &&
        React.cloneElement(StepComponent, {
          onSubmit: handleSubmit(onSubmit),
          register,
          errors,
          fields: stepFields,
          goToPrevious: handlePrevious,
          goToNext: handleNext,
        })}
      <Toaster />
    </div>
  );
};

export default HubRegistration;

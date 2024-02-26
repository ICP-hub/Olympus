import React, { useState, useEffect } from "react";
import { hubRegistration } from "../../Utils/Data/AllDetailFormData";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { useForm } from "react-hook-form";
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

const validationSchema = {
  personalDetails: yup.object().shape({
    fullName: yup
      .string()
      .test("is-non-empty", "Required", (value) => /\S/.test(value))
      .required("Full Name is required"),
      hubName: yup
      .string()
      .test("is-non-empty", "Required", (value) => /\S/.test(value))
      .required("Hub name is required"),
    email: yup
      .string()
      .email("Must be a valid email")
      .required("Email is required")
      .test("is-non-empty", "Required", (value) => /\S/.test(value)),
      hubLocation: yup
      .string()
      .test("is-non-empty", "Required", (value) => /\S/.test(value))
      .required("Location is required"),
      hubDescription: yup
      .string()
      .required("Hub description is required")
      .test("is-non-empty", "Required", (value) => /\S/.test(value)),
      websiteUrl: yup
      .string()
      .url("Must be a valid URL")
      .required("Website URL is required")
      .test("is-non-empty", "Required", (value) => /\S/.test(value)),
      // images:yup
      // .required('Please select an image')
  }),

  hubDetails: yup.object().shape({
    contactNumber: yup
      .string()
      .matches(/^[0-9]+$/, "Must be only digits")
      .required("Contact number is required")
      .test("is-non-empty", "Required", (value) => /\S/.test(value)),
      privacyPolicyConsent: yup
      .boolean()
      .required("Privacy policy consent is required")
      .test("is-non-empty", "Required", (value) => /\S/.test(value)),
      communicationConsent: yup
      .boolean()
      .required("Communication consent is required")
      .test("is-non-empty", "Required", (value) => /\S/.test(value)),
  }),
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
  const [image, setImage] = useState(null);
  const [imageData, setImageData] = useState(null);

  // console.log("getAllIcpHubs + actor =>", getAllIcpHubs, actor);

  const getTabClassName = (tab) => {
    return `inline-block p-4 ${
      activeTab === tab
        ? "text-white border-b-2 "
        : "text-gray-400  border-transparent hover:text-white"
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
    formState: { errors },
    trigger,
    setError,
    clearErrors
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
  console.log(errors)

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
    if (result) {
      // if (!image) {
      //   alert("Please upload a profile image.");
      //   return;
      // }
      setStep((prevStep) => prevStep + 1);
    }
  };

  const handlePrevious = () => {
    if (step > 0) {
      setStep((prevStep) => prevStep - 1);
    }
  };

  const addImageHandler = async (e) => {
    const selectedImage = e.target.files[0];
    if (selectedImage) {
      try {
        // Replace CompressedImage with your actual image compression function
        const compressedFile = await CompressedImage(selectedImage);

        // Manual image validation
        if (compressedFile.size > 2097152) { // 2MB in bytes
          setError('images', {
            type: 'manual',
            message: 'File size must be less than 2 MB',
          });
          return;
        } else {
          clearErrors('images');
        }

        const reader = new FileReader();
        reader.readAsDataURL(compressedFile);
        reader.onloadend = () => {
          setImage(reader.result);
        };

        const byteArray = await compressedFile.arrayBuffer();
        const imageBytes = Array.from(new Uint8Array(byteArray));
        setImageData(imageBytes);
      } catch (error) {
        console.error("Error compressing the image:", error);
        setError('images', {
          type: 'manual',
          message: 'Error processing the image',
        });
      }
    }
  };

  const onSubmit = async (data) => {
    console.log("data >>>>", data);
    const updatedFormData = { ...formData, ...data };
    setFormData(updatedFormData);

    if (step < steps.length - 1) {
      handleNext();
    } else {
      const mentorDataObject = {
        areas_of_expertise: [updatedFormData.areasOfExpertise],
        availability_and_time_commitment: [
          updatedFormData.availabilityAndTimeCommitment,
        ],
        conflict_of_interest_disclosure: [
          updatedFormData.conflictOfInterestDisclosure,
        ],
        email_address: [updatedFormData.emailAddress],
        full_name: [updatedFormData.fullName],
        preferred_icp_hub: [updatedFormData.icp_Hub],
        industry_achievements: [updatedFormData.industryAchievements],
        languages_spoken: [updatedFormData.language],
        linkedin_profile_link: [updatedFormData.linkedIn],
        location: [updatedFormData.location],
        motivation_for_becoming_a_mentor: [
          updatedFormData.motivationForBecomingAMentor,
        ],
        past_work_records_links: [updatedFormData.pastWorkRecordsLinks],
        preferred_communication_tools: [
          updatedFormData.preferredCommunicationTools,
        ],
        preferred_startup_stage: [updatedFormData.preferredStartupStage],
        professional_affiliations: [updatedFormData.professionalAffiliations],
        referrer_contact: [updatedFormData.referrerContact],
        specific_goals_objectives_as_a_mentor: [
          updatedFormData.specificGoalsObjectivesAsAMentor,
        ],
        specific_skills_or_technologies_expertise: [
          updatedFormData.specificSkillsOrTechnologiesExpertise,
        ],
        success_stories_testimonials: [
          updatedFormData.successStoriesTestimonials,
        ],
        telegram_id: [updatedFormData.telegram],
        time_zone: [updatedFormData.timeZone],
        unique_contribution_to_startups: [
          updatedFormData.uniqueContributionToStartups,
        ],
        volunteer_experience: [updatedFormData.volunteerExperience],
        years_of_experience_mentoring_startups: [
          parseInt(updatedFormData.yearsOfExperienceMentoringStartups),
        ],
        mentor_image: [imageData],
      };

      const sendingMentorData = async () => {
        // try {
        //   await actor.register_mentor_candid(mentorDataObject);
        //   console.log("mentor data registered in backend");
        // } catch (error) {
        //   console.log(error.message);
        // }
      };
      sendingMentorData();
    }
  };

  const stepFields = steps[step].fields;
  let StepComponent;
  if (step === 0) {
    StepComponent = <HubPersonalInformation />;
  } else if (step === 1) {
    StepComponent = <HubDetails />;
  } 
  // else if (step === 2) {
  //   StepComponent = <MentorAdditionalInformation />;
  // }

  return (
    <div className="w-full h-full bg-gradient-to-r from-shadeBlue from-0% to-shadeSkyBlue to-100% shadow-custom rounded-md z-10 relative">
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
            <div className="flex-row w-full flex justify-start gap-4 items-end">
              <div
                className="mb-3 ml-6 h-32 w-32 rounded-full border-2 border-gray-300 cursor-pointer"
                style={{
                  background: image
                    ? `url(${image})`
                    : "linear-gradient(transparent, transparent), radial-gradient(circle at center, #cccccc, #cccccc)",
                  backgroundBlendMode: "multiply",
                }}
              >
                <input
              {...register('images', {
                required: 'Image is required',
                validate: {
                  // Example of a synchronous custom validation
                  isNotEmpty: (fileList) => fileList.length > 0 || 'You must select a file',
                  // Assuming you have a state or way to synchronously check file properties
                  isValidType: (fileList) => {
                    if (fileList.length === 0) return true; // Skip if no file is selected
                    // Synchronous check example (This is conceptual, actual file type check might need async operation)
                    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
                    return allowedTypes.includes(fileList[0].type) || 'Invalid file type. Allowed types: JPEG, PNG, GIF';
                  }
                },
              })}
              id="images"
              type="file"
              name="images"
              onChange={addImageHandler}
              className="hidden"
            />
              </div>

              <label
                htmlFor="images"
                className="p-2 border border-yellow-700 items-center rounded-md text-md bg-transparent text-yellow-600 cursor-pointer"
              >
                Upload Profile
              </label>
            </div>
            {errors.images && <p className="text-red-500">{errors.images.message}</p>}
          </div>
        )}
        {step === 1 && (
          <div className="flex flex-col">
            <div className="relative z-0 group">
              <label
                htmlFor="privacyPolicyConsent"
                className="block mb-2 text-sm font-medium text-gray-700 hover:whitespace-normal truncate overflow-hidden hover:text-left"
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
                <option value="">Consent to our privacy policy</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>

              {errors.privacyPolicyConsent && (
                <span className="mt-1 text-sm text-red-500 font-bold">
                  {errors.privacyPolicyConsent.message}
                </span>
              )}
            </div>

            <div className="relative z-0 group">
              <label
                htmlFor="communicationConsent"
                className="block mb-2 text-sm font-medium text-gray-700 hover:whitespace-normal truncate overflow-hidden hover:text-left"
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
                <option value="">Communication Consent?</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
              {errors.communicationConsent && (
                <span className="mt-1 text-sm text-red-500 font-bold">
                  {errors.communicationConsent.message}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {StepComponent &&
        React.cloneElement(StepComponent, {
          onSubmit: handleSubmit(onSubmit),
          register,
          errors,
          fields: stepFields,
          goToPrevious: handlePrevious,
          goToNext: handleNext,
        })}
    </div>
  );
};

export default HubRegistration;

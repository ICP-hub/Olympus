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
  mentorRegistrationAdditionalInfo,
  mentorRegistrationPersonalDetails,
  mentorRegistrationDetails,
} from "../../Utils/Data/mentorFormData";
import { useSelector } from "react-redux";
import CompressedImage from "../../ImageCompressed/CompressedImage";

const validationSchema = {
  personalDetails: yup.object().shape({
    fullName: yup
      .string()
      .test("is-non-empty", "Required", (value) => /\S/.test(value))
      .required("Full Name is required"),
    emailAddress: yup
      .string()
      .email("Invalid email")
      .test("is-non-empty", "Required", (value) => /\S/.test(value))
      .required("Email is required"),
    location: yup
      .string()
      .test("is-non-empty", "Required", (value) => /\S/.test(value))
      .required("Location is required"),
    linkedIn: yup
      .string()
      .url("Invalid LinkedIn URL")
      .test("is-non-empty", "Required", (value) => /\S/.test(value))
      .required("LinkedIn URL is required"),
    telegram: yup
      .string()
      .url("Invalid Telegram URL")
      .test("is-non-empty", "Required", (value) => /\S/.test(value))
      .required("Telegram URL is required"),
    language: yup
      .string()
      .test("is-non-empty", "Required", (value) => /\S/.test(value))
      .required("Language is required"),
    icp_Hub: yup
      .string()
      .test("is-non-empty", "Required", (value) => /\S/.test(value))
      .required("ICP Hub selection is required"),
  }),

  mentorDetails: yup.object().shape({
    motivationForBecomingAMentor: yup
      .string()
      .test("is-non-empty", "Required", (value) => /\S/.test(value))
      .required("Motivation for becoming a mentor is required"),
    yearsOfExperienceMentoringStartups: yup
      .number()
      .typeError("You must enter a number")
      .positive("Must be a positive number")
      .required("Years of experience mentoring startups is required"),
    professionalAffiliations: yup.string().nullable(),
    timeZone: yup
      .string()
      .test("is-non-empty", "Required", (value) => /\S/.test(value))
      .required("Time zone is required"),
    uniqueContributionToStartups: yup
      .string()
      .test("is-non-empty", "Required", (value) => /\S/.test(value))
      .required("Unique contribution to startups is required"),
    referrerContact: yup.string().nullable(),
    specificSkillsOrTechnologiesExpertise: yup
      .string()
      .test("is-non-empty", "Required", (value) => /\S/.test(value))
      .required("Specific skills or technologies expertise is required"),
    specificGoalsObjectivesAsAMentor: yup
      .string()
      .test("is-non-empty", "Required", (value) => /\S/.test(value))
      .required("Specific goals and objectives as a mentor are required"),
    areasOfExpertise: yup
      .string()
      .test("is-non-empty", "Required", (value) => /\S/.test(value))
      .required("Areas of expertise are required"),
  }),

  additionalInfo: yup.object().shape({
    preferredStartupStage: yup
      .string()
      .test("is-non-empty", "Required", (value) => /\S/.test(value))
      .required("Preferred startup stage is required"),
    industryAchievements: yup
      .string()
      .test("is-non-empty", "Required", (value) => /\S/.test(value))
      .required("Industry achievements are required"),
    conflictOfInterestDisclosure: yup.string().nullable(),
    pastWorkRecordsLinks: yup.string().nullable(),
    availabilityAndTimeCommitment: yup
      .string()
      .test("is-non-empty", "Required", (value) => /\S/.test(value))
      .required("Availability and time commitment are required"),
    successStoriesTestimonials: yup.string().nullable(),
    preferredCommunicationTools: yup
      .string()
      .test("is-non-empty", "Required", (value) => /\S/.test(value))
      .required("Preferred communication tools are required"),
    volunteerExperience: yup.string().nullable(),
  }),
};

const MentorRegistration = () => {

  const getAllIcpHubs = useSelector((currState) => currState.hubs.allHubs);
  const actor = useSelector((currState) => currState.actors.actor);

  const [activeTab, setActiveTab] = useState(mentorRegistration[0].id);
  const [formData, setFormData] = useState({});
  const [step, setStep] = useState(0);
  const [isCurrentStepValid, setIsCurrentStepValid] = useState(false);
  const [userHasInteracted, setUserHasInteracted] = useState(false);
  const [image, setImage] = useState(null);
  const [imageData, setImageData] = useState(null);


  const getTabClassName = (tab) => {
    return `inline-block p-4 ${
      activeTab === tab
        ? "text-white border-b-2 "
        : "text-gray-400  border-transparent hover:text-white"
    } rounded-t-lg`;
  };


  const steps = [
    { id: "personalDetails", fields: mentorRegistrationPersonalDetails },
    { id: "mentorDetails", fields: mentorRegistrationDetails },
    { id: "additionalInfo", fields: mentorRegistrationAdditionalInfo },
  ];


  const currentValidationSchema = validationSchema[steps[step].id];

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm({
    resolver: yupResolver(currentValidationSchema),
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


  useEffect(() => {
    if (!userHasInteracted) return;
    const validateStep = async () => {
      const fieldsToValidate = steps[step].fields.map((field) => field.name);
      const result = await trigger(fieldsToValidate);
      setIsCurrentStepValid(result);
    };

    validateStep();
  }, [step, trigger, userHasInteracted]);


  const handleNext = async () => {
    const fieldsToValidate = steps[step].fields.map((field) => field.name);
    const result = await trigger(fieldsToValidate);
    if (result) {
      if (!image) {
        alert("Please upload a profile image.");
        return;
      }
      setStep((prevStep) => prevStep + 1);
    }
  };


  const handlePrevious = () => {
    if (step > 0) {
      setStep((prevStep) => prevStep - 1);
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
        setImageData(imageBytes);
      } catch (error) {
        console.error("Error compressing the image:", error);
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
      // console.log("Final Form Data:", updatedFormData);
   
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
        try {
          await actor.register_mentor_candid(mentorDataObject);
          console.log("mentor data registered in backend");
        } catch (error) {
          console.log(error.message);
        }
      };
      sendingMentorData();
    }
  };

  const stepFields = steps[step].fields;
  let StepComponent;
  if (step === 0) {
    StepComponent = <MentorPersonalInformation />;
  } else if (step === 1) {
    StepComponent = <MentorDetails />;
  } else if (step === 2) {
    StepComponent = <MentorAdditionalInformation />;
  }

  return (
    <div className="w-full h-full bg-gradient-to-r from-shadeBlue from-0% to-shadeSkyBlue to-100% shadow-custom rounded-md z-10 relative">
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

        {step == 0 && (
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
                  id="images"
                  type="file"
                  name="images"
                  onChange={(e) => addImageHandler(e)}
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

            <div className="px-4 z-0 w-full mb-5 group">
              <select
                {...register("icp_Hub")}
                className="block pb-2 pt-6 text-lg font-normal  w-full text-black bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-gray-300 peer "
              >
                <option value="">Select Hub ⌄</option>
                {getAllIcpHubs?.map((hub) => (
                  <option key={hub.id} value={`${hub.name} ,${hub.region}`}>
                    {hub.name} , {hub.region}
                  </option>
                ))}
              </select>
              {errors.icp_Hub && (
                <p className="text-red-500 text-xs italic">
                  {errors.icp_Hub.message}
                </p>
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

export default MentorRegistration;

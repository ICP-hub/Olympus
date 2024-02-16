import React, { useState ,useEffect} from "react";
import { mentorRegistration } from "../../Utils/Data/AllDetailFormData";
import { Tooltip as ReactTooltip } from "react-tooltip";
import MentorPersonalInformation from "./MentorPersonalInformation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import MentorDetails from "./MentorDetails";
import MentorAdditionalInformation from "./MentorAdditionalInformation";
import { mentorRegistrationAdditionalInfo ,mentorRegistrationPersonalDetails,mentorRegistrationDetails} from "../../Utils/Data/mentorFormData";

const MentorRegistration = () => {

  
  const [activeTab, setActiveTab] = useState(mentorRegistration[0].id);
  const [formData, setFormData] = useState({});
  const [step, setStep] = useState(0);
  const [isCurrentStepValid, setIsCurrentStepValid] = useState(false);
  const [userHasInteracted, setUserHasInteracted] = useState(false);

  const getTabClassName = (tab) => {
    return `inline-block p-4 ${
      activeTab === tab
        ? "text-white border-b-2 "
        : "text-gray-400  border-transparent hover:text-white"
    } rounded-t-lg`;
  }; 
  const steps = [
    { id: 'personalDetails', fields: mentorRegistrationPersonalDetails },
    { id: 'mentorDetails', fields: mentorRegistrationDetails },
    { id: 'additionalInfo', fields: mentorRegistrationAdditionalInfo }
  ];

  // Validation schema adjusted to step-wise validation
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
      .test("is-non-empty", "Required", (value) => /\S/.test(value))
      .required("LinkedIn URL is required"),
    telegram: yup
      .string()
      .test("is-non-empty", "Required", (value) => /\S/.test(value))
      .required("Telegram ID is required"),
    language: yup
      .string()
      .test("is-non-empty", "Required", (value) => /\S/.test(value))
      .required("Twitter ID is required"),
    icp_Hub: yup
      .string()
      .test("is-non-empty", "Required", (value) => /\S/.test(value))
      .required("ICP Hub selection is required"),
    }),
    mentorDetails: yup.object().shape({
      motivationForBecomingAMentor: yup
      .string()
      .test("is-non-empty", "Required", (value) => /\S/.test(value))
      .required("This field is required"),
    yearsOfExperienceMentoringStartups: yup
      .number()
      .typeError("You must enter a number")
      .positive("Must be a positive number")
      .test('is-non-empty', 'Required', (value) => /\S/.test(value))
      .required("This field is required"),
    professionalAffiliations: yup.string(),
    timeZone: yup.string()
    .test('is-non-empty', 'Required', (value) => /\S/.test(value))
    .required("This field is required"),
    uniqueContributionToStartups: yup
      .string()
      .test('is-non-empty', 'Required', (value) => /\S/.test(value))
      .required("This field is required"),
    referrerContact: yup.string(),
    specificSkillsOrTechnologiesExpertise: yup
      .string()
      .test('is-non-empty', 'Required', (value) => /\S/.test(value))
      .required("This field is required"),
    specificGoalsObjectivesAsAMentor: yup
      .string()
      .test('is-non-empty', 'Required', (value) => /\S/.test(value))
      .required("This field is required"),
    areasOfExpertise: yup.string()
    .test('is-non-empty', 'Required', (value) => /\S/.test(value))
    .required("This field is required"),
    }),
    additionalInfo: yup.object().shape({
      preferredStartupStage: yup.string()
      .test('is-non-empty', 'Required', (value) => /\S/.test(value))
      .required("This field is required"),
      industryAchievements: yup.string()
      .test('is-non-empty', 'Required', (value) => /\S/.test(value))
      .required("This field is required"),
      conflictOfInterestDisclosure: yup.string()
      .test('is-non-empty', 'Required', (value) => /\S/.test(value)),
      pastWorkRecordsLinks: yup.string()
      .test('is-non-empty', 'Required', (value) => /\S/.test(value)),
      availabilityAndTimeCommitment: yup
        .string()
        .test('is-non-empty', 'Required', (value) => /\S/.test(value))
        .required("This field is required"),
      successStoriesTestimonials: yup.string()
      .test('is-non-empty', 'Required', (value) => /\S/.test(value)),
      preferredCommunicationTools: yup
        .string()
        .test('is-non-empty', 'Required', (value) => /\S/.test(value))
        .required("This field is required"),
      volunteerExperience: yup.string()
      .test('is-non-empty', 'Required', (value) => /\S/.test(value)),
    }),
  };

  const currentValidationSchema = validationSchema[steps[step].id];

  const { register, handleSubmit, formState: { errors }, trigger } = useForm({
    resolver: yupResolver(currentValidationSchema),
  });


  const handleTabClick = async (tab) => {
    const targetStep = mentorRegistration.findIndex((header) => header.id === tab);
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
      const fieldsToValidate = steps[step].fields.map(field => field.name);
      const result = await trigger(fieldsToValidate);
      setIsCurrentStepValid(result);
    };

    validateStep();
  }, [step, trigger, userHasInteracted]); 

  const handleNext = async () => {
    const fieldsToValidate = steps[step].fields.map(field => field.name);
    const result = await trigger(fieldsToValidate);
    if (result) {
      setStep((prevStep) => prevStep + 1);
    }
  };

  const handlePrevious = () => {
    if (step > 0) {
      setStep((prevStep) => prevStep - 1);
    }
  };

  console.log(errors)
  const onSubmit = (data) => {
    console.log(data)
    setFormData((prevData) => ({ ...prevData, ...data }));
    if (step < steps.length - 1) {
      handleNext();
    } else {
      console.log("Final Form Data:", formData);
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
          {mentorRegistration.map((header,index) => (
            <li key={header.id} className="me-2 relative group">
              <button
                className={`${getTabClassName(header.id)} ${index > step && !isCurrentStepValid ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                onClick={() => handleTabClick(header.id)}
                disabled={index > step && !isCurrentStepValid}
              >
                <div className="hidden md:block">{header.label}</div>

                <div className="flex md:hidden items-center">{header.icon}</div>
              </button>
              <div className="md:hidden">
              {index > step && !isCurrentStepValid && (
                <ReactTooltip id={header.id} place="bottom" content="Complete current step to proceed" className="z-10" />
              )}
              </div>
            </li>
          ))}
        </ul>
      </div>
      {StepComponent && React.cloneElement(StepComponent, {
        onSubmit: handleSubmit(onSubmit),
        register,
        errors,
        fields: stepFields,
        goToPrevious: handlePrevious,
        goToNext: handleNext
      })}
    </div>
  );
};


export default MentorRegistration;

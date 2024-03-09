// import React from "react";
// import FounderInfo from "./FounderInfo";
// import CompanyInfo from "./CompanyInfo";
// import CompanyMetrics from "./CompanyMetrics";
// import TeamDetails from "./TeamDetails";
// import AdditionalInfo from "./AdditionalInfo";
// import { headerData } from "../../Utils/Data/AllDetailFormData";
// import { useState } from "react";
// import { Tooltip as ReactTooltip } from "react-tooltip";

// const FounderRegistration = () => {
//   const specificRole = useSelector(
//     (currState) => currState.current.specificRole
//   );

//   const [activeTab, setActiveTab] = useState(headerData[0].id);

//   const handleTabClick = (tab) => {
//     setActiveTab(tab);
//   };

//   const getTabClassName = (tab) => {
//     return `inline-block p-2 font-bold ${
//       activeTab === tab
//         ? "text-black border-b-2 border-black"
//         : "text-gray-400  border-transparent hover:text-black"
//     } rounded-t-lg`;
//   };

//   const renderActiveComponent = () => {
//     switch (activeTab) {
//       case "company":
//         return <CompanyInfo />;
//       case "metrics":
//         return <CompanyMetrics />;
//       case "team":
//         return <TeamDetails />;
//       case "additional":
//         return <AdditionalInfo />;
//       default:
//         return <FounderInfo />;
//     }
//   };

//   return (
//     <div>
//       <div className="w-full h-full bg-gray-100 pt-8">
//         <div className="bg-gradient-to-r from-purple-800 to-blue-500 text-transparent bg-clip-text text-[30px]  sm:text-[25px] md1:text-[30px] md2:text-[35px] font-black font-fontUse dxl:text-[40px] p-8">
//           Founder Information
//         </div>
//         <div className="text-sm font-medium text-center text-gray-200 ">
//           <ul
//             className={`flex flex-wrap text-sxxs:text-[7px] sxs:text-[7.5px] sxs1:text-[8px] sxs2:text-[8.5px] sxs3:text-[9px] ss:text-[9.5px] ss1:text-[10px] ss2:text-[10.5px] ss3:text-[11px] ss4:text-[11.5px] dxs:text-[12px] xxs:text-[12.5px] xxs1:text-[13px] sm1:text-[13.5px] sm4:text-[14px] sm2:text-[14.5px] sm3:text-[13px] sm:text-[11.5px] md:text-[14px.3] md1:text-[13px] md2:text-[13px] md3:text-[13px] lg:text-[14.5px] dlg:text-[15px] lg1:text-[16.5px] lgx:text-[16px] dxl:text-[16.5px] xl:text-[19px] xl2:text-[19.5px] cursor-pointer ${
//               headerData.id !== "founder"
//                 ? "md:justify-start xl:px-12 ss1:justify-center"
//                 : "justify-around"
//             }`}
//           >
//             {headerData.map((header) => (
//               <li key={header.id} className="me-2 relative group">
//                 <button
//                   className={getTabClassName(header.id)}
//                   onClick={() => handleTabClick(header.id)}
//                 >
//                   <div className="hidden md:block">{header.label}</div>

//                   <div className="flex md:hidden items-center">
//                     {header.icon}
//                   </div>
//                 </button>
//                 <div className="md:hidden">
//                   <ReactTooltip
//                     id={header.id}
//                     place="bottom"
//                     content={header.label}
//                     className="z-10 "
//                   />
//                 </div>
//               </li>
//             ))}
//           </ul>
//         </div>
//         <div className="xl:px-12 py-12">
//           {specificRole ? renderActiveComponent() : <FounderInfo />}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FounderRegistration;

import React, { useState, useEffect } from "react";
// import { mentorRegistration } from "../../Utils/Data/AllDetailFormData";
import { Tooltip as ReactTooltip } from "react-tooltip";
// import MentorPersonalInformation from "./MentorPersonalInformation";
import FounderInfo from "./FounderInfo";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
// import MentorDetails from "./MentorDetails";
import CompanyInfo from "./CompanyInfo";
// import MentorAdditionalInformation from "./MentorAdditionalInformation";
import CompanyMetrics from "./CompanyMetrics";
// import {
//   mentorRegistrationAdditionalInfo,
//   mentorRegistrationPersonalDetails,
//   mentorRegistrationDetails,
// } from "../../Utils/Data/mentorFormData";

import {
  formFields,
  TeamDetailsField,
  companyMetricsFormFields,
  companyInfoFormFields,
  additionalInfoFormFields,
} from "../../Utils/Data/founderFormField";
import { updateFounder } from "../../Utils/Data/AllDetailFormData";
import { useSelector } from "react-redux";
import CompressedImage from "../../ImageCompressed/CompressedImage";
import { useDispatch } from "react-redux";
import { allHubHandlerRequest } from "../../StateManagement/Redux/Reducers/All_IcpHubReducer";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { userRoleHandler } from "../../StateManagement/Redux/Reducers/userRoleReducer";

const today = new Date();
const startDate = new Date("1900-01-01");
const allowedStages = ["Startup", "Growth", "Mature"];

const validationSchema = {
  founderDetails: yup.object().shape({
    full_name: yup
      .string()
      .required("Full Name is required")
      .test("is-non-empty", "Full Name is required", (value) =>
        /\S/.test(value)
      ),
    date_of_birth: yup
      .date()
      .required("Date of Birth is required")
      .max(today, `Date of Birth cannot be in the future`)
      .min(startDate, "Date of Birth cannot be before January 1, 1900"),
    email: yup.string().email("Invalid email").required("Email is required"),
    phone_number: yup
      .string()
      .matches(/^[0-9]+$/, "Phone Number must be numeric")
      .required("Phone Number is required"),
    linked_in_profile: yup
      .string()
      .url("Invalid LinkedIn URL")
      .required("LinkedIn Profile is required"),
    telegram_id: yup.string().required("Telegram ID is required"),
    twitter_id: yup.string().required("Twitter ID is required"),
    preferred_icp_hub: yup
      .string()
      .required("Preferred ICP Hub is required")
      .test(
        "is-non-empty",
        "Preferred ICP Hub selection is required",
        (value) => /\S/.test(value)
      ),
  }),

  companyInfo: yup.object().shape({
    location: yup
      .string()
      .test("is-non-empty", "Location is required", (value) => /\S/.test(value))
      .required("Location is required"),
    role_within_company: yup
      .string()
      .test("is-non-empty", "Role within company is required", (value) =>
        /\S/.test(value)
      )
      .required("Role within company is required"),
    employee_count: yup
      .number()
      .typeError("Employee count must be a number")
      .positive("Employee count must be positive")
      .integer("Employee count must be an integer")
      .required("Employee count is required"),
    stage_of_company: yup
      .string()
      .required("Stage of company is required")
      .oneOf(allowedStages, "Invalid stage of company"),
  }),
  companyMetric: yup.object().shape({
    currently_users: yup
      .number()
      .typeError("Currently users must be a number")
      .min(0, "Currently users cannot be negative")
      .required("Currently users is required"),
    average_monthly_spending: yup
      .number()
      .typeError("Average monthly spending must be a number")
      .min(0, "Average monthly spending cannot be negative")
      .required("Average monthly spending is required"),
    average_monthly_revenue: yup
      .number()
      .typeError("Average monthly revenue must be a number")
      .min(0, "Average monthly revenue cannot be negative")
      .required("Average monthly revenue is required"),
    company_debt: yup
      .boolean()
      .required("company debt status is required")
      .test("is-non-empty", "company debt status is required", (value) =>
        /\S/.test(value)
      ),

    raised_any_capital: yup
      .boolean()
      .required("raised capital status is required")
      .test("is-non-empty", "raised capital status is required", (value) =>
        /\S/.test(value)
      ),
    previous_part_in_incubator: yup
      .boolean()
      .required("previously taken part in incubator ?")
      .test(
        "is-non-empty",
        "taken part in incubator status is required",
        (value) => /\S/.test(value)
      ),
  }),
  teamInfo: yup.object().shape({
    how_many_co_founder: yup
      .number()
      .integer("Number of co-founders must be an integer")
      .min(0, "Number of co-founders must be at least 1")
      .required("Number of co-founders is required"),

    co_founder_linkedin_profile: yup
      .string()
      .url("Invalid LinkedIn URL")
      .test("is-non-empty", "LinkedIn URL is required", (value) =>
        /\S/.test(value)
      )
      .required("LinkedIn URL is required"),

    how_long_know_each_other: yup
      .string()
      .test(
        "is-non-empty",
        "How long you've known each other is required",
        (value) => /\S/.test(value)
      )
      .required("How long you've known each other is required"),
      is_team_full_time_working_on_project: yup
      .boolean()
      .required("team working status is required")
      .test("is-non-empty", "team working status is required", (value) =>
        /\S/.test(value)
      ),
      equity_owner_of_company: yup
      .string()
      .required("Equity ownership status is required")
      .test("is-non-empty", "Equity ownership status is required", (value) =>
        /\S/.test(value)
      ),
      share_about_venture: yup
      .string()
      .required("Sharing about the venture is required")
      .test("is-non-empty", "Sharing about the venture is required", (value) =>
        /\S/.test(value)
      ),
  }),
  additionalInfo: yup.object().shape({
    preferred_startup_stage: yup
      .string()
      .test("is-non-empty", "Preferred Startup Stage is required", (value) =>
        /\S/.test(value)
      )
      .required("Preferred startup stage is required"),
    industry_achievements: yup
      .string()
      .test("is-non-empty", "Industry achievements are required", (value) =>
        /\S/.test(value)
      )
      .required("Industry achievements are required"),
    conflict_of_interest_disclosure: yup
      .string()
      .test(
        "is-non-empty",
        "Conflict Of Interest Disclosure are required",
        (value) => /\S/.test(value)
      )
      .required("Conflict Of Interest Disclosure are required"),
    past_work_records_links: yup
      .string()
      .test("is-non-empty", "PastWork Records Links are required", (value) =>
        /\S/.test(value)
      )
      .required("PastWork Records Links are required"),
    availability_and_time_commitment: yup
      .string()
      .test(
        "is-non-empty",
        "Availability and time commitment are required",
        (value) => /\S/.test(value)
      )
      .required("Availability and time commitment are required"),
    success_stories_testimonials: yup
      .string()
      .test(
        "is-non-empty",
        "Success Stories Testimonials are required",
        (value) => /\S/.test(value)
      )
      .required("Success Stories Testimonials are required"),
    preferred_communication_tools: yup
      .string()
      .test(
        "is-non-empty",
        "Preferred communication tools are required",
        (value) => /\S/.test(value)
      )
      .required("Preferred communication tools are required"),
    volunteer_experience: yup
      .string()
      .test("is-non-empty", "Volunteer Experience are required", (value) =>
        /\S/.test(value)
      )
      .required("Volunteer Experience are required"),
  }),
};

const FounderRegistration = () => {
  const actor = useSelector((currState) => currState.actors.actor);
  const getAllIcpHubs = useSelector((currState) => currState.hubs.allHubs);
  const specificRole = useSelector(
    (currState) => currState.current.specificRole
  );
  const founderFullData = useSelector((currState) => currState.mentorData.data);
  const areaOfExpertise = useSelector(
    (currState) => currState.expertiseIn.expertise
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(updateFounder[0].id);
  const [formData, setFormData] = useState({});
  const [step, setStep] = useState(0);
  const [isCurrentStepValid, setIsCurrentStepValid] = useState(false);
  const [userHasInteracted, setUserHasInteracted] = useState(false);
  const [image, setImage] = useState(null);
  const [founder_image, setFounderImage] = useState(null);
  const [founderDataObject, setFounderDataObject] = useState({});

  // console.log("FounderRegistration  run  specificRole =>", specificRole);
  console.log("expertiseIn in mentor-registratn comp =>", areaOfExpertise);

  const getTabClassName = (tab) => {
    return `inline-block p-2 font-bold ${
      activeTab === tab
        ? "text-black border-b-2 border-black"
        : "text-gray-400  border-transparent hover:text-black"
    } rounded-t-lg`;
  };

  const steps = [
    { id: "founder", fields: formFields },
    { id: "company", fields: companyInfoFormFields },
    { id: "metrics", fields: companyMetricsFormFields },
    { id: "team", fields: TeamDetailsField },
    { id: "additional", fields: additionalInfoFormFields },
  ];

  const currentValidationSchema = validationSchema[steps[step].id];

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    trigger,
    reset,
  } = useForm({
    resolver: yupResolver(currentValidationSchema),
    mode: "all",
  });

  const handleTabClick = async (tab) => {
    const targetStep = updateFounder.findIndex((header) => header.id === tab);
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

  const handleNext = async () => {
    const fieldsToValidate = steps[step].fields.map((field) => field.name);
    const result = await trigger(fieldsToValidate);
    // console.log("fieldsToValidate", fieldsToValidate);
    if (result) {
      if (!image && !formData.founder_image) {
        alert("Please upload a profile image.");
        return;
      }
      setStep((prevStep) => prevStep + 1);
      setActiveTab(updateFounder[step + 1]?.id);
    }
  };

  const handlePrevious = () => {
    if (step > 0) {
      setStep((prevStep) => prevStep - 1);
      setActiveTab(updateFounder[step - 1]?.id);
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
        setFounderImage(imageBytes);
        // console.log("imageBytes", imageBytes);
      } catch (error) {
        console.error("Error compressing the image:", error);
      }
    }
  };

  const imageUrlToByteArray = async (imageUrl) => {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    return Array.from(new Uint8Array(arrayBuffer));
  };

  useEffect(() => {
    if (founderFullData && founderFullData.length > 0) {
      const data = founderFullData[0];
      const formattedData = Object.keys(data).reduce((acc, key) => {
        acc[key] = Array.isArray(data[key]) ? data[key][0] : data[key];
        return acc;
      }, {});
      reset(formattedData);
      setFormData(formattedData);

      if (formattedData.founder_image) {
        imageUrlToByteArray(formattedData.founder_image)
          .then((imageBytes) => {
            setFounderImage(imageBytes);
          })
          .catch((error) => console.error("Error converting image:", error));
      }
    }
  }, [founderFullData, reset]);

  const sendingFounderData = async (val) => {
    // console.log("run sendingFounderData =========");
    console.log("sendingFounderData ==>> ", val);

    let result;

    try {
      if (specificRole !== null || undefined) {
        // console.log("update mentor functn k pass reached");
        result = await actor.update_mentor_profile(val);
      } else if (specificRole === null || specificRole === undefined) {
        // console.log("register mentor functn k pass reached");
        result = await actor.register_mentor_candid(val);
      }
      toast.success(result);
      await dispatch(userRoleHandler());
      await navigate("/dashboard");
    } catch (error) {
      toast.error(error);
      console.log(error.message);
    }
  };

  const onSubmit = async (data) => {
    // console.log("data >>>>", data);
    const updatedFormData = { ...formData, ...data };
    setFormData(updatedFormData);

    // console.log("updatedFormData inside onSUbmit ~~~~~~", updatedFormData);
    if (step < steps.length - 1) {
      handleNext();
    } else if (
      specificRole !== null ||
      (undefined && step > steps.length - 1)
    ) {
      // console.log("exisiting user visit ");

      let tempObj2 = {
        areas_of_expertise: [updatedFormData.areas_of_expertise] || [],
        availability_and_time_commitment:
          [updatedFormData.availability_and_time_commitment] || [],
        conflict_of_interest_disclosure:
          [updatedFormData.conflict_of_interest_disclosure] || [],
        email: [updatedFormData.email] || [],
        full_name: [updatedFormData.full_name] || [],
        preferred_icp_hub: [updatedFormData.preferred_icp_hub] || [],
        industry_achievements: [updatedFormData.industry_achievements] || [],
        languages_spoken: [updatedFormData.languages_spoken] || [],
        linkedin_profile_link: [updatedFormData.linkedin_profile_link] || [],
        location: [updatedFormData.location] || [],
        motivation_for_becoming_a_mentor:
          [updatedFormData.motivation_for_becoming_a_mentor] || [],
        past_work_records_links:
          [updatedFormData.past_work_records_links] || [],
        preferred_communication_tools:
          [updatedFormData.preferred_communication_tools] || [],
        preferred_startup_stage:
          [updatedFormData.preferred_startup_stage] || [],
        professional_affiliations:
          [updatedFormData.professional_affiliations] || [],
        referrer_contact: [updatedFormData.referrer_contact] || [],
        specific_goals_objectives_as_a_mentor:
          [updatedFormData.specific_goals_objectives_as_a_mentor] || [],
        specific_skills_or_technologies_expertise:
          [updatedFormData.specific_skills_or_technologies_expertise] || [],
        success_stories_testimonials:
          [updatedFormData.success_stories_testimonials] || [],
        telegram_id: [updatedFormData.telegram_id] || [],
        time_zone: [updatedFormData.time_zone] || [],
        unique_contribution_to_startups:
          [updatedFormData.unique_contribution_to_startups] || [],
        volunteer_experience: [updatedFormData.volunteer_experience] || [],
        years_of_experience_mentoring_startups:
          [parseInt(updatedFormData.years_of_experience_mentoring_startups)] ||
          [],
        founder_image: [founder_image] || [],
      };

      // console.log("tempObj2 kaam kia ????? ", tempObj2); // work kia
      setFounderDataObject(tempObj2);
      await sendingFounderData(tempObj2);
    } else if (
      specificRole === null ||
      (specificRole === undefined && step > steps.length - 1)
    ) {
      // console.log("first time visit ");
      let tempObj = {
        areas_of_expertise: [updatedFormData.areas_of_expertise],
        availability_and_time_commitment: [
          updatedFormData.availability_and_time_commitment,
        ],
        conflict_of_interest_disclosure: [
          updatedFormData.conflict_of_interest_disclosure,
        ],
        email: [updatedFormData.email],
        full_name: [updatedFormData.full_name],
        preferred_icp_hub: [updatedFormData.preferred_icp_hub],
        industry_achievements: [updatedFormData.industry_achievements],
        languages_spoken: [updatedFormData.languages_spoken],
        linkedin_profile_link: [updatedFormData.linkedin_profile_link],
        location: [updatedFormData.location],
        motivation_for_becoming_a_mentor: [
          updatedFormData.motivation_for_becoming_a_mentor,
        ],
        past_work_records_links: [updatedFormData.past_work_records_links],
        preferred_communication_tools: [
          updatedFormData.preferred_communication_tools,
        ],
        preferred_startup_stage: [updatedFormData.preferred_startup_stage],
        professional_affiliations: [updatedFormData.professional_affiliations],
        referrer_contact: [updatedFormData.referrer_contact],
        specific_goals_objectives_as_a_mentor: [
          updatedFormData.specific_goals_objectives_as_a_mentor,
        ],
        specific_skills_or_technologies_expertise: [
          updatedFormData.specific_skills_or_technologies_expertise,
        ],
        success_stories_testimonials: [
          updatedFormData.success_stories_testimonials,
        ],
        telegram_id: [updatedFormData.telegram_id],
        time_zone: [updatedFormData.time_zone],
        unique_contribution_to_startups: [
          updatedFormData.unique_contribution_to_startups,
        ],
        volunteer_experience: [updatedFormData.volunteer_experience],
        years_of_experience_mentoring_startups: [
          parseInt(updatedFormData.years_of_experience_mentoring_startups),
        ],
        founder_image: [founder_image],
      };

      // console.log("tempObj kaam kia ????? ", tempObj); // work kia

      setFounderDataObject(tempObj);
      await sendingFounderData(tempObj);
    }
  };

  const stepFields = steps[step].fields;
  let StepComponent;
  if (step === 0) {
    StepComponent = <FounderInfo />;
  } else if (step === 1) {
    StepComponent = <CompanyInfo />;
  } else if (step === 2) {
    StepComponent = <CompanyMetrics isSubmitting={isSubmitting} />;
  }

  return (
    <div className="w-full h-full bg-gray-100 pt-8">
      <div className="bg-gradient-to-r from-purple-800 to-blue-500 text-transparent bg-clip-text text-[30px]  sm:text-[25px] md1:text-[30px] md2:text-[35px] font-black font-fontUse dxl:text-[40px] p-8">
        Mentors Information
      </div>
      <div className="text-sm font-medium text-center text-gray-200 ">
        <ul className="flex flex-wrap mb-4 text-sxxs:text-[7px] sxs:text-[7.5px] sxs1:text-[8px] sxs2:text-[8.5px] sxs3:text-[9px] ss:text-[9.5px] ss1:text-[10px] ss2:text-[10.5px] ss3:text-[11px] ss4:text-[11.5px] dxs:text-[12px] xxs:text-[12.5px] xxs1:text-[13px] sm1:text-[13.5px] sm4:text-[14px] sm2:text-[14.5px] sm3:text-[13px] sm:text-[11.5px] md:text-[14px.3] md1:text-[13px] md2:text-[13px] md3:text-[13px] lg:text-[14.5px] dlg:text-[15px] lg1:text-[16.5px] lgx:text-[16px] dxl:text-[16.5px] xl:text-[19px] xl2:text-[19.5px] cursor-pointer justify-around">
          {updateFounder?.map((header, index) => (
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
                {image ? (
                  <img
                    src={image}
                    alt="New profile"
                    className="h-full w-full object-cover"
                  />
                ) : formData.founder_image ? (
                  <img
                    src={formData?.founder_image}
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

            <div className="px-4 z-0 w-full my-5 group">
              <label
                htmlFor="preferred_icp_hub"
                className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
              >
                Can you please share your preferred ICP Hub
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
                  Select your ICP Hub⌄
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
          </div>
        )}

        {step === 1 && (
          <div className="px-4 z-0 w-full my-5 group">
            <label
              htmlFor="areas_of_expertise"
              className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
            >
              What are your areas of expertise?
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
                Areas_of_expertise ⌄
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
              <p className="text-red-500 text-xs italic">
                {errors.areas_of_expertise.message}
              </p>
            )}
          </div>
        )}
      </div>

      {step === 2 && (
        <div>
          <div className="relative z-0 group mb-6 px-4">
            <label
              htmlFor="company_debt"
              className="block mb-2 text-lg font-medium text-gray-500 hover:text-black truncate overflow-hidden text-start"
            >
              Does your company currently have any debt?
            </label>
            <select
              {...register("company_debt")}
              id="company_debt"
              className={`bg-gray-50 border-2 ${
                errors.company_debt
                  ? "border-red-500 placeholder:text-red-500"
                  : "border-[#737373]"
              } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
            >
              <option className="text-lg font-bold" value="">
                company debt ?
              </option>
              <option className="text-lg font-bold" value="true">
                Yes
              </option>
              <option className="text-lg font-bold" value="false">
                No
              </option>
            </select>
            {errors.company_debt && (
              <span className="mt-1 text-sm text-red-500 font-bold">
                {errors.company_debt.message}
              </span>
            )}
          </div>

          <div className="relative z-0 group mb-6 px-4">
            <label
              htmlFor="raised_any_capital"
              className="block mb-2 text-lg font-medium text-gray-500 hover:text-black truncate overflow-hidden text-start"
            >
              Have you raised any capital for your business?
            </label>
            <select
              {...register("raised_any_capital")}
              id="raised_any_capital"
              className={`bg-gray-50 border-2 ${
                errors.raised_any_capital
                  ? "border-red-500 placeholder:text-red-500"
                  : "border-[#737373]"
              } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
            >
              <option className="text-lg font-bold" value="">
                raised capital ?
              </option>
              <option className="text-lg font-bold" value="true">
                Yes
              </option>
              <option className="text-lg font-bold" value="false">
                No
              </option>
            </select>
            {errors.raised_any_capital && (
              <span className="mt-1 text-sm text-red-500 font-bold">
                {errors.raised_any_capital.message}
              </span>
            )}
          </div>

          <div className="relative z-0 group mb-6 px-4">
            <label
              htmlFor="previous_part_in_incubator"
              className="block mb-2 text-lg font-medium text-gray-500 hover:text-black truncate overflow-hidden text-start"
            >
              Have you previously participated in an incubator, accelerator, or
              pre-accelerator program?
            </label>
            <select
              {...register("previous_part_in_incubator")}
              id="previous_part_in_incubator"
              className={`bg-gray-50 border-2 ${
                errors.previous_part_in_incubator
                  ? "border-red-500 placeholder:text-red-500"
                  : "border-[#737373]"
              } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
            >
              <option className="text-lg font-bold" value="">
                participated in incubator ?
              </option>
              <option className="text-lg font-bold" value="true">
                Yes
              </option>
              <option className="text-lg font-bold" value="false">
                No
              </option>
            </select>
            {errors.previous_part_in_incubator && (
              <span className="mt-1 text-sm text-red-500 font-bold">
                {errors.previous_part_in_incubator.message}
              </span>
            )}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="relative z-0 group mb-6 px-4">
        <label
          htmlFor="is_team_full_time_working_on_project"
          className="block mb-2 text-lg font-medium text-gray-500 hover:text-black truncate overflow-hidden text-start"
        >
       Is the team working full time on this project?  
              </label>
        <select
          {...register("is_team_full_time_working_on_project")}
          id="is_team_full_time_working_on_project"
          className={`bg-gray-50 border-2 ${
            errors.is_team_full_time_working_on_project
              ? "border-red-500 placeholder:text-red-500"
              : "border-[#737373]"
          } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
        >
          <option className="text-lg font-bold" value="">
            full time ?
          </option>
          <option className="text-lg font-bold" value="true">
            Yes
          </option>
          <option className="text-lg font-bold" value="false">
            No
          </option>
        </select>
        {errors.is_team_full_time_working_on_project && (
          <span className="mt-1 text-sm text-red-500 font-bold">
            {errors.is_team_full_time_working_on_project.message}
          </span>
        )}
      </div>
      )}
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

export default FounderRegistration;

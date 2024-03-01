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
import { useDispatch } from "react-redux";
import { allHubHandlerRequest } from "../../Redux/Reducers/All_IcpHubReducer";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const validationSchema = {
  personalDetails: yup.object().shape({
    full_name: yup
      .string()
      .test("is-non-empty", "Full Name is required", (value) =>
        /\S/.test(value)
      )
      .required("Full Name is required"),
    email_address: yup
      .string()
      .email("Invalid email")
      .test("is-non-empty", "Email is required", (value) => /\S/.test(value))
      .required("Email is required"),
    location: yup
      .string()
      .test("is-non-empty", "Location is required", (value) => /\S/.test(value))
      .required("Location is required"),
    linkedin_profile_link: yup
      .string()
      .url("Invalid LinkedIn URL")
      .test("is-non-empty", "LinkedIn URL is required", (value) =>
        /\S/.test(value)
      )
      .required("LinkedIn URL is required"),
    telegram_id: yup
      .string()
      .url("Invalid telegram_id URL")
      .test("is-non-empty", "telegram_id URL is required", (value) =>
        /\S/.test(value)
      )
      .required("telegram_id URL is required"),
    languages_spoken: yup
      .string()
      .test("is-non-empty", "Language is required", (value) => /\S/.test(value))
      .required("Language is required"),
    preferred_icp_hub: yup
      .string()
      .test("is-non-empty", "ICP Hub selection is required", (value) =>
        /\S/.test(value)
      )
      .required("ICP Hub selection is required"),
  }),

  mentorDetails: yup.object().shape({
    motivation_for_becoming_a_mentor: yup
      .string()
      .test(
        "is-non-empty",
        "Motivation for becoming a mentor is required",
        (value) => /\S/.test(value)
      )
      .required("Motivation for becoming a mentor is required"),
    years_of_experience_mentoring_startups: yup
      .number()
      .typeError("You must enter a number")
      .positive("Must be a positive number")
      .required("Years of experience mentoring startups is required"),
    professional_affiliations: yup
      .string()
      .test("is-non-empty", "Professional Affiliations is required", (value) =>
        /\S/.test(value)
      )
      .required("Professional Affiliations is required"),
    time_zone: yup
      .string()
      .test("is-non-empty", "Time zone is required", (value) =>
        /\S/.test(value)
      )
      .required("Time zone is required"),
    unique_contribution_to_startups: yup
      .string()
      .test(
        "is-non-empty",
        "Unique contribution to startups is required",
        (value) => /\S/.test(value)
      )
      .required("Unique contribution to startups is required"),
    referrer_contact: yup.string().nullable(),
    specific_skills_or_technologies_expertise: yup
      .string()
      .test(
        "is-non-empty",
        "Specific skills or technologies expertise is required",
        (value) => /\S/.test(value)
      )
      .required("Specific skills or technologies expertise is required"),
    specific_goals_objectives_as_a_mentor: yup
      .string()
      .test(
        "is-non-empty",
        "Specific goals and objectives as a mentor are required",
        (value) => /\S/.test(value)
      )
      .required("Specific goals and objectives as a mentor are required"),
    areas_of_expertise: yup
      .string()
      .test("is-non-empty", "Areas of expertise are required", (value) =>
        /\S/.test(value)
      )
      .required("Areas of expertise are required"),
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

const MentorRegistration = () => {
  const actor = useSelector((currState) => currState.actors.actor);
  const getAllIcpHubs = useSelector((currState) => currState.hubs.allHubs);
  const specificRole = useSelector(
    (currState) => currState.current.specificRole
  );
  const mentorFullData = useSelector((currState) => currState.mentorData.data);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(mentorRegistration[0].id);
  const [formData, setFormData] = useState({});
  const [step, setStep] = useState(0);
  const [isCurrentStepValid, setIsCurrentStepValid] = useState(false);
  const [userHasInteracted, setUserHasInteracted] = useState(false);
  const [image, setImage] = useState(null);
  const [mentor_image, setmentor_image] = useState(null);
  const [mentorDataObject, setMentorDataObject] = useState({});

  console.log("MentorRegistration  run  specificRole =>", specificRole);
  console.log("mentorFullData in mentor-registratn comp =>", mentorFullData)



  const getTabClassName = (tab) => {
    return `inline-block p-2 font-bold ${
      activeTab === tab
        ? "text-black border-b-2 border-black"
        : "text-gray-400  border-transparent hover:text-black"
    } rounded-t-lg`;
  };

  // useEffect(() => {a
  //   if (mentorFullData) {
  //     const formattedData = {};

  //     // Object.keys(mentorFullData).forEach((key) => {
  //     //   formattedData[key] = mentorFullData[key][0];
  //     // });


  //    mentorFullData.forEach((data) => {
  //       for (let key in data) {
  //       formattedData[key] = data[key];     
  //         //  console.log(formattedData[key]);

  //   }

  //     });
  //     console.log('mentordatafetch ------------------------------->', formattedData)
  //     setFormData(formattedData);
  //   }
  // }, [mentorFullData]);
  

  const steps = [
    { id: "personalDetails", fields: mentorRegistrationPersonalDetails },
    { id: "mentorDetails", fields: mentorRegistrationDetails },
    { id: "additionalInfo", fields: mentorRegistrationAdditionalInfo },
  ];

  const currentValidationSchema = validationSchema[steps[step].id];

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    trigger,reset
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

  useEffect(() => {
    dispatch(allHubHandlerRequest());
  }, [actor, dispatch]);

  const handleNext = async () => {
    const fieldsToValidate = steps[step].fields.map((field) => field.name);
    const result = await trigger(fieldsToValidate);
    console.log("fieldsToValidate", fieldsToValidate);
    if (result) {
      // if (steps[step].fields.some(field => field.name === 'icp_Hub') && !formData.icp_Hub) {
      //   setError('icp_Hub', {
      //     type: 'manual',
      //     message: 'ICP Hub is required',
      //   });
      //   return; // Stop the execution if there's an error with icp_Hub
      // }
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
        setmentor_image(imageBytes);
      } catch (error) {
        console.error("Error compressing the image:", error);
      }
    }
  };


  useEffect(() => {
    if (mentorFullData && mentorFullData.length > 0) {
      const data = mentorFullData[0];
      const formattedData = Object.keys(data).reduce((acc, key) => {
        acc[key] = Array.isArray(data[key]) ? data[key][0] : data[key];
        return acc;
      }, {});
  
      console.log("Attempting to reset form with data:", formattedData);
      reset(formattedData);
    }
  }, [mentorFullData, reset]);
  
  

  const sendingMentorData = async (val) => {
    console.log('run sendingMentorData =========')
    console.log('mentorDataObject ==>> ', mentorDataObject)
    
    // try {
    //   if(specificRole){
    //     console.log(specificRole)
    //   }
    // } catch (error) {
    //   toast.error(error);
    //   console.log(error.message);
    // }
    let result;

    try {
      if (specificRole) {
        result = await actor.update_mentor_profile(val);
      } else if (specificRole === null || specificRole === undefined) {
        result = await actor.register_mentor_candid(val);
      }
      toast.success(result);
      console.log("mentor data registered in backend");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error);
      console.log(error.message);
    }
  };

  const onSubmit = async (data) => {
    console.log("data >>>>", data);
    const updatedFormData = { ...formData, ...data };
    setFormData(updatedFormData);
    if (step < steps.length - 1) {
      handleNext();
    }
    
    
    
    else if (specificRole && step > steps.length - 1) {
      console.log("exisiting user visit ");
    
      let tempObj2 = {
        areas_of_expertise: [updatedFormData.areas_of_expertise] || [],
        availability_and_time_commitment:
          [updatedFormData.availability_and_time_commitment] || [],
        conflict_of_interest_disclosure:
          [updatedFormData.conflict_of_interest_disclosure] || [],
        email_address: [updatedFormData.email_address] | [],
        full_name: [updatedFormData.full_name] || [],
        preferred_icp_hub: [updatedFormData.preferred_icp_hub] || [],
        industry_achievements: [updatedFormData.industry_achievements] || [],
        languages_spoken: [updatedFormData.languages_spoken] || [],
        linkedin_profile_link: [updatedFormData.linkedin_profile_link] || [],
        location: [updatedFormData.location] || [],
        motivation_for_becoming_a_mentor:
          [updatedFormData.motivation_for_becoming_a_mentor] || [],
        past_work_records_links: [updatedFormData.past_work_records_links] || [],
        preferred_communication_tools:
          [updatedFormData.preferred_communication_tools] || [],
        preferred_startup_stage: [updatedFormData.preferred_startup_stage] || [],
        professional_affiliations:
          [updatedFormData.professional_affiliations] || [],
        referrer_contact: [updatedFormData.referrer_contact] || [],
        specific_goals_objectives_as_a_mentor:
          [updatedFormData.specific_goals_objectives_as_a_mentor] || [],
        specific_skills_or_technologies_expertise:
          [updatedFormData.specific_skills_or_technologies_expertise] || [],
        success_stories_testimonials:
          [updatedFormData.success_stories_testimonials] || [],
        telegram_id_id: [updatedFormData.telegram_id] || [],
        time_zone: [updatedFormData.time_zone] || [],
        unique_contribution_to_startups:
          [updatedFormData.unique_contribution_to_startups] || [],
        volunteer_experience: [updatedFormData.volunteer_experience] || [],
        years_of_experience_mentoring_startups:
          [parseInt(updatedFormData.years_of_experience_mentoring_startups)] || [],
        mentor_image: [mentor_image] || [],
      };
      setMentorDataObject(tempObj2);
      await sendingMentorData(tempObj2)
    } else if (
      specificRole === null ||
      (specificRole === undefined && step > steps.length - 1)
    ) {
      console.log("first time visit ");
      let tempObj = {
        areas_of_expertise: [updatedFormData.areas_of_expertise],
        availability_and_time_commitment: [
          updatedFormData.availability_and_time_commitment,
        ],
        conflict_of_interest_disclosure: [
          updatedFormData.conflict_of_interest_disclosure,
        ],
        email_address: [updatedFormData.email_address],
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
        mentor_image: [mentor_image],
      }
      setMentorDataObject(tempObj);
      await sendingMentorData(tempObj);
    }
  };

  const stepFields = steps[step].fields;
  let StepComponent;
  if (step === 0) {
    StepComponent = <MentorPersonalInformation />;
  } else if (step === 1) {
    StepComponent = <MentorDetails />;
  } else if (step === 2) {
    StepComponent = <MentorAdditionalInformation isSubmitting={isSubmitting} />;
  }

  return (
    <div className="w-full h-full bg-gray-100 pt-8">
      <div className="bg-gradient-to-r from-purple-800 to-blue-500 text-transparent bg-clip-text text-[30px]  sm:text-[25px] md1:text-[30px] md2:text-[35px] font-black font-fontUse dxl:text-[40px] p-8">
        Mentors Information
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
      <Toaster />
    </div>
  );
};

export default MentorRegistration;

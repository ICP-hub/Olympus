import React, { useState } from "react";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import { ThreeDots } from "react-loader-spinner";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MentorSignup1 from "./MentoSignup1";
import MentorSignup2 from "./MentorSignup2";
import MentorSignup3 from "./MentorSignUp3";
import MentorSignup4 from "./MentorSignup4";


// Form validation schema
const validationSchema = yup.object().shape({
  full_name: yup.string().required("Full name is required"),
  email: yup.string().email("Invalid email").nullable(true).optional(),
  telegram_id: yup.string().nullable(true).optional(),
  twitter_url: yup.string().nullable(true).optional().url("Invalid url"),
  openchat_user_name: yup
    .string()
    .nullable(true)
    .test("is-valid-username", "Invalid username", (value) => {
      if (!value) return true;
      return /^[a-zA-Z0-9_]{5,20}$/.test(value) && !value.startsWith(" ");
    }),
  bio: yup
    .string()
    .optional()
    .test("maxWords", "Bio must not exceed 50 words", (value) => {
      if (!value) return true;
      return value.trim().split(/\s+/).length <= 50;
    })
    .test("maxChars", "Bio must not exceed 500 characters", (value) => {
      if (!value) return true;
      return value.length <= 500;
    }),
  country: yup.string().required("Country is required"),
  domains_interested_in: yup.string().required("Selecting an interest is required"),
  type_of_profile: yup.string().required("Type of profile is required"),
  reasons_to_join_platform: yup.string().required("Selecting a reason is required"),
  image: yup
    .mixed()
    .nullable(true)
    .test("fileSize", "File size max 10MB allowed", (value) => {
      if (!value) return true;
      return value.size <= 10 * 1024 * 1024;
    })
    .test("fileType", "Only jpeg, jpg & png file format allowed", (value) => {
      if (!value) return true;
      return ["image/jpeg", "image/jpg", "image/png"].includes(value.type);
    }),
  preferred_icp_hub: yup.string().required("ICP Hub selection is required"),
  multi_chain: yup.string().required("Required").oneOf(["true", "false"], "Invalid value"),
  category_of_mentoring_service: yup.string().required("Selecting a service is required"),
  icp_hub_or_spoke: yup.string().required("Required").oneOf(["true", "false"], "Invalid value"),
  years_of_mentoring: yup
    .number()
    .required("Years of experience mentoring startups is required")
    .positive("Must be a positive number"),
  mentor_linkedin_url: yup.string().url("Invalid url").required("LinkedIn url is required"),
}).required();

const MentorSignupMain = () => {
  const methods = useForm({
    resolver: yupResolver(validationSchema),
    mode: "all",
  });
  const {
    handleSubmit,
    trigger,
    formState: { isSubmitting },
  } = methods;
  const [index, setIndex] = useState(0);

  const formFields = {
    0: ["full_name", "email", "telegram_id", "twitter_id", "openchat_username"],
    1: ["bio", "country", "area_of_interest", "type_of_profile","reason_to_join"],
    2: ["preferred_icp_hub", "category_of_mentoring_service","multichain","existing_icp_mentor"],
    3: ["icp_hub_or_spoke", "hub_owner","website","years_of_mentoring","linkedin_link"],
  };

  const handleNext = async () => {
    const isValid = await trigger(formFields[index]);
    if (isValid) {
      setIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handleBack = () => {
    if (index > 0) {
      setIndex((prevIndex) => prevIndex - 1);
    }
  };

  const onSubmitHandler = async (data) => {
    // Process form submission logic here
    console.log(data);
  };

  const onErrorHandler = (errors) => {
    toast.error("Empty fields or invalid values, please recheck the form");
  };

  const renderComponent = () => {
    let component;

    switch (index) {
      case 0:
        component = <MentorSignup1 />;
        break;
      case 1:
        component = <MentorSignup2 />;
        break;
      case 2:
        component = <MentorSignup3 />;
        break;
      case 3:
        component = <MentorSignup4 />;
        break;
      default:
        component = <MentorSignup1 />;
    }

    return component;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-[500px] p-6 pt-4 overflow-y-auto">
        <div className="flex justify-end mr-4">
          <button className="text-2xl text-[#121926]" onClick={() => setModalOpen(false)}>
            &times;
          </button>
        </div>
        <h2 className="text-xs text-[#364152] mb-3">Step {index + 1} of 4</h2>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmitHandler, onErrorHandler)}>
            {renderComponent()}
            <div className={`flex mt-4 ${index === 0 ? "justify-end" : "justify-between"}`}>
            {index > 0 && (
              <button
                type="button"
                className="py-2 px-4 text-gray-600 rounded hover:text-black"
                onClick={handleBack}
                disabled={index === 0}
              >
                Back
              </button>
            )}
              {index === 3 ? (
                <button
                  type="submit"
                  className="py-2 px-4 bg-[#D1E0FF] text-white rounded hover:bg-blue-600 border-2 border-[#B2CCFF]"
                >
                  {isSubmitting ? (
                    <ThreeDots
                      visible={true}
                      height="35"
                      width="35"
                      color="#FFFEFF"
                      radius="9"
                      ariaLabel="three-dots-loading"
                    />
                  ) : (
                    "Submit"
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  className="py-2 px-4 bg-[#D1E0FF] text-white rounded hover:bg-blue-600 border-2 border-[#B2CCFF] flex items-center"
                  onClick={handleNext}
                >
                  Continue
                  <ArrowForwardIcon fontSize="medium" className="ml-2" />
                </button>
              )}
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default MentorSignupMain;

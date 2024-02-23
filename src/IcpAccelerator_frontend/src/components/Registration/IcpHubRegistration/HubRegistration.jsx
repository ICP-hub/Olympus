import React, { useState, useEffect } from "react";
import { investorRegistration } from "../../Utils/Data/AllDetailFormData";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  investorRegistrationAdditionalInfo,
  investorRegistrationPersonalDetails,
  investorRegistrationDetails,
} from "../../Utils/Data/InvestorFormData";
import InvestorDetails from "../InvestorRegistration/InvestorDetails";
import InvestorAdditionalInformation from "../InvestorRegistration/InvestorAdditionalInformation";
import InvestorPersonalInformation from "../InvestorRegistration/InvestorPersonalInformation";

const HubRegistration = () => {
  const [activeTab, setActiveTab] = useState(investorRegistration[0].id);
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
    { id: "personalDetails", fields: investorRegistrationPersonalDetails },
    { id: "investorDetails", fields: investorRegistrationDetails },
    { id: "additionalInfo", fields: investorRegistrationAdditionalInfo },
  ];

  // Validation schema adjusted to step-wise validation
  const validationSchema = {
    personalDetails: yup.object().shape({
      email_address: yup
        .string()
        .email("Invalid email format")
        .required("Email address is required")
        .test("is-non-empty", "Required", (value) => /\S/.test(value)),
      telegram_id: yup
        .string()
        .test("is-non-empty", "Required", (value) => /\S/.test(value))
        .required("Telegram ID is required"),
      portfolio_link: yup
        .string()
        .url("Must be a valid URL")
        .test("is-non-empty", "Required", (value) => /\S/.test(value)),
      location: yup.string().required("Location is required"),
      website_link: yup
        .string()
        .url("Must be a valid URL")
        .required("Website link is required"),
      technological_focus: yup
        .string()
        .required("Technological focus is required"),
      preferred_icp_hub: yup
        .string()
        .test("is-non-empty", "Required", (value) => /\S/.test(value))
        .required("ICP Hub selection is required"),
    }),
    investorDetails: yup.object().shape({
      investor_type: yup.string().required("Investor type is required"),
      typical_decision_making_timeline_for_investments: yup
        .string()
        .required("Decision making timeline is required"),
      interest_in_board_positions: yup
        .boolean()
        .required("Interest in board positions is required"),
      name_of_fund: yup.string().required("Name of fund is required"),
      size_of_managed_fund: yup
        .number()
        .positive("Must be a positive number")
        .required("Size of managed fund is required"),
      accredited_investor_status: yup
        .boolean()
        .required("Accredited investor status is required"),
      preferred_investment_sectors: yup
        .string()
        .required("Preferred investment sectors are required"),
    }),
    additionalInfo: yup.object().shape({
      average_investment_ticket: yup
        .number()
        .positive("Must be a positive number")
        .required("Average investment ticket is required"),
      investment_stage_preference: yup
        .string()
        .required("Investment stage preference is required"),
      number_of_portfolio_companies: yup
        .number()
        .positive("Must be a positive number")
        .integer("Must be an integer")
        .required("Number of portfolio companies is required"),
      revenue_range_preference: yup
        .string()
        .required("Revenue range preference is required"),
      assets_for_investment: yup
        .number()
        .positive("Must be a positive number")
        .required("Assets for investment is required"),
      referrer: yup
        .string()
        .test("is-non-empty", "Required", (value) => /\S/.test(value)),
    }),
  };

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
    const targetStep = investorRegistration.findIndex(
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
      setStep((prevStep) => prevStep + 1);
    }
  };

  const handlePrevious = () => {
    if (step > 0) {
      setStep((prevStep) => prevStep - 1);
    }
  };

  console.log(errors);
  const onSubmit = (data) => {
    console.log(data);
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
    StepComponent = <InvestorPersonalInformation />;
  } else if (step === 1) {
    StepComponent = <InvestorDetails />;
  } else if (step === 2) {
    StepComponent = <InvestorAdditionalInformation />;
  }

  return (
    <div className="w-full h-full bg-gradient-to-r from-shadeBlue from-0% to-shadeSkyBlue to-100% shadow-custom rounded-md z-10 relative">
      <div className="text-sm font-medium text-center text-gray-200 ">
        <ul className="flex flex-wrap mb-4 text-sxxs:text-[7px] sxs:text-[7.5px] sxs1:text-[8px] sxs2:text-[8.5px] sxs3:text-[9px] ss:text-[9.5px] ss1:text-[10px] ss2:text-[10.5px] ss3:text-[11px] ss4:text-[11.5px] dxs:text-[12px] xxs:text-[12.5px] xxs1:text-[13px] sm1:text-[13.5px] sm4:text-[14px] sm2:text-[14.5px] sm3:text-[13px] sm:text-[11.5px] md:text-[14px.3] md1:text-[13px] md2:text-[13px] md3:text-[13px] lg:text-[14.5px] dlg:text-[15px] lg1:text-[16.5px] lgx:text-[16px] dxl:text-[16.5px] xl:text-[19px] xl2:text-[19.5px] cursor-pointer justify-around">
          {investorRegistration.map((header, index) => (
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

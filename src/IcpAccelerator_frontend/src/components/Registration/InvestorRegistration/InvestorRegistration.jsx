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
import InvestorDetails from "./InvestorDetails";
import InvestorAdditionalInformation from "./InvestorAdditionalInformation";
import InvestorPersonalInformation from "./InvestorPersonalInformation";
import { useSelector } from "react-redux";
import { allHubHandlerRequest } from "../../Redux/Reducers/All_IcpHubReducer";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

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

const InvestorRegistration = () => {
  const getAllIcpHubs = useSelector((currState) => currState.hubs.allHubs);
  const actor = useSelector((currState) => currState.actors.actor);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(investorRegistration[0].id);
  const [formData, setFormData] = useState({});
  const [step, setStep] = useState(0);
  const [isCurrentStepValid, setIsCurrentStepValid] = useState(false);
  const [userHasInteracted, setUserHasInteracted] = useState(false);

  useEffect(() => {
    dispatch(allHubHandlerRequest());
  }, [actor, dispatch]);

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

  const stepFields = steps[step].fields;
  let StepComponent;

  if (step === 0) {
    StepComponent = <InvestorPersonalInformation />;
  } else if (step === 1) {
    StepComponent = <InvestorDetails />;
  } else if (step === 2) {
    StepComponent = <InvestorAdditionalInformation />;
  }

  const onSubmit = async (data) => {
    console.log("data of investor =>", data);

    const updatedFormData = { ...formData, ...data };
    setFormData(updatedFormData);

    if (step < steps.length - 1) {
      handleNext();
    } else {
      console.log("Final Form Data:", updatedFormData);

      const interestInBoardPosition =
        updatedFormData.interest_in_board_positions === "true" ? true : false;
      const accreditedInvestorStatus =
        updatedFormData.accredited_investor_status === "true" ? true : false;

      const investorDataObject = {
        accredited_investor_status: [accreditedInvestorStatus],
        assets_for_investment: [updatedFormData.assets_for_investment],
        average_investment_ticket: [updatedFormData.average_investment_ticket],
        email_address: [updatedFormData.email_address],
        interest_in_board_positions: [interestInBoardPosition],
        investment_stage_preference: [
          updatedFormData.investment_stage_preference,
        ],
        investor_type: [updatedFormData.investor_type],
        location: [updatedFormData.location],
        name_of_fund: [updatedFormData.name_of_fund],
        number_of_portfolio_companies: [
          updatedFormData.number_of_portfolio_companies,
        ],
        portfolio_link: [updatedFormData.portfolio_link],
        preferred_icp_hub: [updatedFormData.preferred_icp_hub],
        preferred_investment_sectors: [
          updatedFormData.preferred_investment_sectors,
        ],
        referrer: [updatedFormData.referrer],
        revenue_range_preference: [updatedFormData.revenue_range_preference],
        size_of_managed_fund: [updatedFormData.size_of_managed_fund],
        technological_focus: [updatedFormData.technological_focus],
        telegram_id: [updatedFormData.telegram_id],
        typical_decision_making_timeline_for_investments: [
          updatedFormData.typical_decision_making_timeline_for_investments,
        ],
        website_link: [updatedFormData.website_link],
        id: [],
        is_active: [],
      };

      const sendingInvestorData = async () => {
        try {
          await actor.register_venture_capitalist_caller(investorDataObject);
          console.log("investor data registered in backend");
          navigate("/dashboard");
        } catch (error) {
          console.log(error.message);
        }
      };
      sendingInvestorData();
    }
  };

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

        {step == 0 && (
          <div className="relative z-0 group">
            <label
              htmlFor="preferred_icp_hub"
              className="block mb-2 text-sm font-medium text-gray-700 hover:whitespace-normal truncate overflow-hidden hover:text-left"
            >
              Can you please share your preferred ICP Hub
            </label>
            <select
              {...register("preferred_icp_hub")}
              id="preferred_icp_hub"
              className={`bg-gray-50 border-2 ${
                errors.preferred_icp_hub
                  ? "border-red-500 placeholder:text-red-500"
                  : "border-[#737373]"
              } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
            >
              <option value="">Select your ICP Hub</option>
              {getAllIcpHubs?.map((hub) => (
                <option key={hub.id} value={`${hub.name} ,${hub.region}`}>
                  {hub.name} , {hub.region}
                </option>
              ))}
            </select>
            {errors.preferred_icp_hub && (
              <span className="mt-1 text-sm text-red-500 font-bold">
                {errors.preferred_icp_hub.message}
              </span>
            )}
          </div>
        )}

        {step == 1 && (
          <div className="flex flex-col">
            <div className="relative z-0 group">
              <label
                htmlFor="interest_in_board_positions"
                className="block mb-2 text-sm font-medium text-gray-700 hover:whitespace-normal truncate overflow-hidden hover:text-left"
              >
                Do you have an interest in board positions?
              </label>
              <select
                {...register("interest_in_board_positions")}
                id="interest_in_board_positions"
                className={`bg-gray-50 border-2 ${
                  errors.interest_in_board_positions
                    ? "border-red-500 placeholder:text-red-500"
                    : "border-[#737373]"
                } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
              >
                <option value="">interest in board positions</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>

              {errors.interest_in_board_positions && (
                <span className="mt-1 text-sm text-red-500 font-bold">
                  {errors.interest_in_board_positions.message}
                </span>
              )}
            </div>

            <div className="relative z-0 group">
              <label
                htmlFor="accredited_investor_status"
                className="block mb-2 text-sm font-medium text-gray-700 hover:whitespace-normal truncate overflow-hidden hover:text-left"
              >
                Are you an accredited investor?
              </label>
              <select
                {...register("accredited_investor_status")}
                id="accredited_investor_status"
                className={`bg-gray-50 border-2 ${
                  errors.accredited_investor_status
                    ? "border-red-500 placeholder:text-red-500"
                    : "border-[#737373]"
                } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
              >
                <option value="">accredited-investor?</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
              {errors.accredited_investor_status && (
                <span className="mt-1 text-sm text-red-500 font-bold">
                  {errors.accredited_investor_status.message}
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

export default InvestorRegistration;

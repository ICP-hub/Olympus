
// import Layer1 from "../../../assets/Logo/Layer1.png";
// import Aboutcard from "../UserRegistration/Aboutcard";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import AboutcardSkeleton from "../LatestSkeleton/AbourcardSkeleton";
import { useNavigate } from "react-router-dom";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useForm, Controller, FormProvider } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
// import DetailHeroSection from "../Common/DetailHeroSection";
import { ThreeDots } from "react-loader-spinner";
import { useCountries } from "react-countries";
// import RegisterForm1 from "./RegisterForm1";
import InvestorModal1 from "./InvestorModal1";
import InvestorModal2 from "./InvestorModal2";
import InvestorModal3 from "./InvestorModal3";
import { allHubHandlerRequest } from "../../StateManagement/Redux/Reducers/All_IcpHubReducer";
// import { allHubHandlerRequest } from "../StateManagement/Redux/Reducers/All_IcpHubReducer";



const InvestorForm = ({ isOpen, onClose }) => {
    const [modalOpen, setModalOpen] = useState(isOpen || true);
    const { countries } = useCountries();
    const dispatch = useDispatch();
  const actor = useSelector((state) => state.actors.actor);
    const investorFullData = useSelector(
        (currState) => currState.investorData.data[0]
    );
  

   
 
    //  USER & MENTOR reg form validation schema
    const validationSchema = yup
        .object()
        .shape({
            full_name: yup
                .string()
                .test("is-non-empty", "Full name is required", (value) =>
                    /\S/.test(value)
                )
                .required("Full name is required"),
            email: yup.string().email("Invalid email").nullable(true).optional(),
            telegram_id: yup
                .string()
                .nullable(true)
                .optional()
                // .test("is-valid-telegram", "Invalid Telegram link", (value) => {
                //   if (!value) return true;
                //   const hasValidChars = /^[a-zA-Z0-9_]{5,32}$/.test(value);
                //   return hasValidChars;
                // })
                .url("Invalid url"),
            twitter_url: yup
                .string()
                .nullable(true)
                .optional()
                // .test("is-valid-twitter", "Invalid Twitter ID", (value) => {
                //   if (!value) return true;
                //   const hasValidChars =
                //   /^(https?:\/\/)?(www\.)?(twitter\.com|x\.com)\/[a-zA-Z0-9_]{1,15}$/.test(
                //       value
                //     );
                //   return hasValidChars;
                // })
                .url("Invalid url"),
            openchat_user_name: yup
                .string()
                .nullable(true)
                .test(
                    "is-valid-username",
                    "Username must be between 5 and 20 characters, and cannot start or contain spaces",
                    (value) => {
                        if (!value) return true;
                        const isValidLength = value.length >= 5 && value.length <= 20;
                        const hasNoSpaces = !/\s/.test(value) && !value.startsWith(" ");
                        return isValidLength && hasNoSpaces;
                    }
                ),
            bio: yup
                .string()
                .optional()
                .test(
                    "maxWords",
                    "Bio must not exceed 50 words",
                    (value) =>
                        !value || value.trim().split(/\s+/).filter(Boolean).length <= 50
                )
                .test(
                    "no-leading-spaces",
                    "Bio should not have leading spaces",
                    (value) => !value || value.trimStart() === value
                )
                .test(
                    "maxChars",
                    "Bio must not exceed 500 characters",
                    (value) => !value || value.length <= 500
                ),
            country: yup
                .string()
                .test("is-non-empty", "Country is required", (value) =>
                    /\S/.test(value)
                )
                .required("Country is required"),
            domains_interested_in: yup
                .string()
                .test("is-non-empty", "Selecting an interest is required", (value) =>
                    /\S/.test(value)
                )
                .required("Selecting an interest is required"),
            type_of_profile: yup
                .string()
                .test("is-non-empty", "Type of profile is required", (value) =>
                    /\S/.test(value)
                )
                .required("Type of profile is required"),
            reasons_to_join_platform: yup
                .string()
                .test("is-non-empty", "Selecting a reason is required", (value) =>
                    /\S/.test(value)
                )
                .required("Selecting a reason is required"),

            image: yup
                .mixed()
                .nullable(true)
                .test("fileSize", "File size max 10MB allowed", (value) => {
                    return !value || (value && value.size <= 10 * 1024 * 1024); // 10 MB limit
                })
                .test(
                    "fileType",
                    "Only jpeg, jpg & png file format allowed",
                    (value) => {
                        return (
                            !value ||
                            (value &&
                                ["image/jpeg", "image/jpg", "image/png"].includes(value.type))
                        );
                    }
                ),
            investor_registered: yup
                .string()
                .required("Required")
                .oneOf(["true", "false"], "Invalid value"),
            registered_country: yup
                .string()
                .when("investor_registered", (val, schema) =>
                    val && val[0] === "true"
                        ? schema
                            .test(
                                "is-non-empty",
                                "Registered country name required",
                                (value) => /\S/.test(value)
                            )
                            .required("Registered country name required")
                        : schema
                ),

            preferred_icp_hub: yup
                .string()
                .test("is-non-empty", "ICP Hub selection is required", (value) =>
                    /\S/.test(value)
                )
                .required("ICP Hub selection is required"),
            existing_icp_investor: yup
                .string()
                .oneOf(["true", "false"], "Invalid value"),
            investment_type: yup
                .string()
                .when("existing_icp_investor", (val, schema) =>
                    val && val[0] === "true"
                        ? schema
                            .test(
                                "is-non-empty",
                                "Atleast one investment type required",
                                (value) => /\S/.test(value)
                            )
                            .required("Atleast one investment type required")
                        : schema
                ),
            investor_portfolio_link: yup
                .string()
                .test("is-non-empty", "Portfolio url is required", (value) =>
                    /\S/.test(value)
                )
                .url("Invalid url")
                .required("Portfolio url is required"),
            investor_fund_name: yup
                .string()
                .test("is-non-empty", "Fund name is required", (value) =>
                    /\S/.test(value)
                )
                .required("Fund name is required"),
            investor_fund_size: yup
                .number()
                .optional()
                .nullable(true)
                .typeError("You must enter a number")
                .positive("Must be a positive number"),

            invested_in_multi_chain: yup
                .string()
                .required("Required")
                .oneOf(["true", "false"], "Invalid value"),
            invested_in_multi_chain_names: yup
                .string()
                .when("invested_in_multi_chain", (val, schema) =>
                    val && val[0] === "true"
                        ? schema
                            .test(
                                "is-non-empty",
                                "Atleast one chain name required",
                                (value) => /\S/.test(value)
                            )
                            .required("Atleast one chain name required")
                        : schema
                ),
            investment_categories: yup
                .string()
                .test("is-non-empty", "Selecting a category is required", (value) =>
                    /\S/.test(value)
                )
                .required("Selecting an category is required"),
            investor_website_url: yup
                .string()
                .nullable(true)
                .optional()
                .url("Invalid url"),
            investor_linkedin_url: yup
                .string()
                .required("LinkedIn URL is required")
                // .test("is-non-empty", "LinkedIn URL is required", (value) =>
                //   /\S/.test(value)
                // )
                // .matches(
                //   /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/,
                //   "Invalid LinkedIn URL"
                // )
                .url("Invalid url")
                .required("LinkedIn url is required"),
            investment_stage: yup
                .string()
                .test("is-non-empty", "Investment stage is required", (value) =>
                    /\S/.test(value)
                )
                .required("Investment stage is required"),
            investment_stage_range: yup
                .string()
                .when("investment_stage", (val, schema) =>
                    val && val !== "we do not currently invest"
                        ? schema
                            .test("is-non-empty", "Atleast one range required", (value) =>
                                /\S/.test(value)
                            )
                            .required("Atleast one range required")
                        : schema
                ),
        })
        .required();

 


 
  
    const formFields = {
        // 0: ["full_name", "email", "telegram_id", "twitter_id", "openchat_username"],
        // 1: ["bio", "country", "area_of_interest", "type_of_profile", "reason_to_join"],
        0: ["investor_registered", "registered_country", "existing_icp_investor", "investment_type", "invested_in_multi_chain", "invested_in_multi_chain_names"],
        1: ["investment_categories", "investment_stage", "investment_stage_range", "investor_website_url", "investor_linkedin_url"],
        2: ["preferred_icp_hub", "investor_portfolio_link", "investor_fund_name", "investor_fund_size"],
    };

  

    const [index, setIndex] = useState(0);

    //next button functionality
    const handleNext = async () => {
        const isValid = await trigger(formFields[index]);
        if (isValid) {
            setIndex((prevIndex) => prevIndex + 1);
        }
    };

    // back button functionality 
    const handleBack = () => {
        if (index > 0) {
            setIndex((prevIndex) => prevIndex - 1);
        }
    };

    // data submit handler 
    const onSubmitHandler = async (data) => {
        if (actor) {
            const investorData = {
                // user data
              
                // investor data
                name_of_fund: data?.investor_fund_name,
                fund_size: [
                    data?.investor_fund_size &&
                        typeof data?.investor_fund_size === "number"
                        ? data?.investor_fund_size
                        : 0,
                ],
                existing_icp_investor:
                    data?.existing_icp_investor === "true" ? true : false,
                investor_type: [
                    data?.existing_icp_investor === "true" && data?.investment_type
                        ? data?.investment_type
                        : "",
                ],
                project_on_multichain: [
                    data?.invested_in_multi_chain === "true" &&
                        data?.invested_in_multi_chain_names
                        ? data?.invested_in_multi_chain_names
                        : "",
                ],
                category_of_investment: data?.investment_categories,
                preferred_icp_hub: [data.preferred_icp_hub || ""],
                portfolio_link: data?.investor_portfolio_link,
                website_link: [data?.investor_website_url || ""],
                registered: data?.investor_registered === "true" ? true : false,
                registered_country: [
                    data?.investor_registered === "true" && data?.registered_country
                        ? data?.registered_country
                        : "",
                ],
                linkedin_link: data?.investor_linkedin_url,
                stage: [data?.investment_stage || ""],
                range_of_check_size: [
                    data?.investment_stage !== "" &&
                        data?.investment_stage !== "we do not currently invest" &&
                        data?.investment_stage_range
                        ? data?.investment_stage_range
                        : "",
                ],
                // investor data not exiting on frontend or raw variables
                average_check_size: 0,
                assets_under_management: [""],
                registered_under_any_hub: [false],
                logo: [[]],
                money_invested: [0],
                existing_icp_portfolio: [""],
                reason_for_joining: [""],
                type_of_investment: "",
                number_of_portfolio_companies: 0,
                announcement_details: [""],
            };
            console.log(investorData);
            try {
                
                    await actor.register_user(userData).then((result) => {
                        if (result && result.includes("User registered successfully")) {
                            toast.success("Registered as a User");
                            window.location.href = "/";
                        } else {
                            toast.error("Something got wrong");
                        }
                    });
                
            } catch (error) {
                toast.error(error);
                console.error("Error sending data to the backend:", error);
            }
        } else {
            toast.error("Please signup with internet identity first");
            window.location.href = "/";
        }
    };

    // form error handler func
    const onErrorHandler = (val) => {
        console.log("val Error", val);
        toast.error("Empty fields or invalid values, please recheck the form");
    };


    //render conponents
    const renderComponent = () => {
        let component;

        switch (index) {
            case 0:
                component = <InvestorModal1 />;
                break;
            case 1:
                component = <InvestorModal2 />;
                break;
            case 2:
                component = <InvestorModal3 />;
                break;
            default:
                component = <InvestorModal1 />;
        }

        return component;

    };
    const {
        register,
        handleSubmit,
        reset,
        clearErrors,
        setValue,
        getValues,
        setError,
        watch,
        control,
        trigger,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(validationSchema),
        mode: "all",
     
    });

    useEffect(() => {
        dispatch(allHubHandlerRequest());
      }, [actor, dispatch]);
    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${modalOpen ? 'block' : 'hidden'}`}>
            <div className="container mx-auto">
                <div className="pb-12 flex items-center justify-center rounded-xl">
                    <div className="bg-white shadow-xl rounded-2xl flex w-full max-w-[30rem] relative">
                        <div className="absolute top-2 right-4">
                            <button className='text-2xl text-gray-300' onClick={() => setModalOpen(false)}>&times;</button>
                        </div>
                        <div className="w-full p-6">
                            <h2 className="text-[#364152] text-sm font-normal mb-2  text-start">
                                Step {index + 1} of 3
                            </h2>
                            <FormProvider {...{ ...{ register, handleSubmit, reset, clearErrors, setValue, countries, getValues, setError, watch, control, trigger, formState: { errors, isSubmitting } } }}>
                                <form onSubmit={handleSubmit(onSubmitHandler, onErrorHandler)}>
                                    {renderComponent()}
                                    <div className={`flex mt-4 ${index === 0 ? "justify-end" : "justify-between"}`}>
                                        {index > 0 && (
                                            <button
                                                type="button"
                                                className="py-2 border-2 px-4 text-gray-600 rounded hover:text-black"
                                                onClick={handleBack}
                                                disabled={index === 0}
                                            >
                                                <span className=""><ArrowBackIcon sx={{ marginTop: "-3px " }} /> </span>
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
                                                        wrapperStyle={{}}
                                                    />
                                                ) : (
                                                    "Submit"
                                                )}
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                className="py-2 px-4 text-white rounded bg-blue-600 border-2 border-[#B2CCFF] flex items-center"
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
                        {/* <AboutcardSkeleton /> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvestorForm;


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
import ReactSelect from "react-select";
// import CompressedImage from "../ImageCompressed/CompressedImage";
import { Principal } from "@dfinity/principal";
// import RegisterForm1 from "./RegisterForm1";
import InvestorModal1 from "./InvestorModal1";
import InvestorModal2 from "./InvestorModal2";
import InvestorModal3 from "./InvestorModal3";
// import { allHubHandlerRequest } from "../StateManagement/Redux/Reducers/All_IcpHubReducer";



const InvestorForm = ({ isOpen, onClose }) => {
    const [modalOpen, setModalOpen] = useState(isOpen || true);

    const { countries } = useCountries();
    const dispatch = useDispatch();
    const actor = useSelector((currState) => currState.actors.actor);
    const areaOfExpertise = useSelector(
        (currState) => currState.expertiseIn.expertise
    );
    const typeOfProfile = useSelector(
        (currState) => currState.profileTypes.profiles
    );
    // const getAllIcpHubs = useSelector((currState) => currState.hubs.allHubs);
    const multiChainNames = useSelector((currState) => currState.chains.chains);
    const userFullData = useSelector((currState) => currState.userData.data.Ok);
    const investorFullData = useSelector(
        (currState) => currState.investorData.data[0]
    );
    console.log("investorFullData ====>", investorFullData);

    const userCurrentRoleStatusActiveRole = useSelector(
        (currState) => currState.currentRoleStatus.activeRole
    );
    // STATES

    // user image states
    const [imagePreview, setImagePreview] = useState(null);
    const [imageData, setImageData] = useState(null);
    const [editMode, setEditMode] = useState(null);

    // default & static options states
    const [interestedDomainsOptions, setInterestedDomainsOptions] = useState([]);
    const [
        interestedDomainsSelectedOptions,
        setInterestedDomainsSelectedOptions,
    ] = useState([]);
    const [typeOfProfileOptions, setTypeOfProfileOptions] = useState([]);
    const [reasonOfJoiningSelectedOptions, setReasonOfJoiningSelectedOptions] =
        useState([]);
    const [reasonOfJoiningOptions, setReasonOfJoiningOptions] = useState([
        { value: "listing_and_promotion", label: "Project listing and promotion" },
        { value: "Funding", label: "Funding" },
        { value: "Mentoring", label: "Mentoring" },
        { value: "Incubation", label: "Incubation" },
        {
            value: "Engaging_and_building_community",
            label: "Engaging and building community",
        },
        { value: "Jobs", label: "Jobs" },
    ]);

    // INVESTOR FORM STATES
    const [typeOfInvestSelectedOptions, setTypeOfInvestSelectedOptions] =
        useState([]);
    const [typeOfInvestOptions, setTypeOfInvestOptions] = useState([
        { value: "Direct", label: "Direct" },
        { value: "SNS", label: "SNS" },
        { value: "both", label: "both" },
    ]);
    const [investedInmultiChainOptions, setInvestedInMultiChainOptions] =
        useState([]);
    const [
        investedInMultiChainSelectedOptions,
        setInvestedInMultiChainSelectedOptions,
    ] = useState([]);
    const [investmentCategoriesOptions, setInvestmentCategoriesOptions] =
        useState([]);
    const [
        investmentCategoriesSelectedOptions,
        setInvestmentCategoriesSelectedOptions,
    ] = useState([]);

    const [investStageOptions, setInvestStageOptions] = useState([]);
    const [investStageSelectedOptions, setInvestStageSelectedOptions] = useState(
        []
    );
    const [investStageRangeOptions, setInvestStageRangeOptions] = useState([]);
    const [investStageRangeSelectedOptions, setInvestStageRangeSelectedOptions] =
        useState([]);

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

    // const {
    //   register,
    //   handleSubmit,
    //   reset,
    //   clearErrors,
    //   setValue,
    //   getValues,
    //   setError,
    //   watch,
    //   control,
    //   trigger,
    //   formState: { errors, isSubmitting },
    // } = useForm({
    //   resolver: yupResolver(validationSchema),
    //   mode: "all",
    // });

    // image creation function compression and uintarray creator
    const imageCreationFunc = async (file) => {
        const result = await trigger("image");
        if (result) {
            try {
                const compressedFile = await CompressedImage(file);
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePreview(reader.result);
                };
                reader.readAsDataURL(compressedFile);
                const byteArray = await compressedFile.arrayBuffer();
                setImageData(Array.from(new Uint8Array(byteArray)));
            } catch (error) {
                setError("image", {
                    type: "manual",
                    message: "Could not process image, please try another.",
                });
            }
        } else {
            console.log("ERROR--imageCreationFunc-file", file);
        }
    };

    // clear image func
    const clearImageFunc = (val) => {
        let field_id = val;
        setValue(field_id, null);
        clearErrors(field_id);
        setImageData(null);
        setImagePreview(null);
    };

    // form submit handler func
    // const onSubmitHandler = async (data) => {
    //   if (actor) {
    //     const investorData = {
    //       // user data
    //       user_data: {
    //         full_name: data?.full_name,
    //         email: [data?.email],
    //         telegram_id: [data?.telegram_id.toString()],
    //         twitter_id: [data?.twitter_url.toString()],
    //         openchat_username: [data?.openchat_user_name],
    //         bio: [data?.bio],
    //         country: data?.country,
    //         area_of_interest: data?.domains_interested_in,
    //         type_of_profile: [data?.type_of_profile || ""],
    //         reason_to_join: [
    //           data?.reasons_to_join_platform
    //             .split(",")
    //             .map((val) => val.trim()) || [""],
    //         ],
    //         profile_picture: imageData ? [imageData] : [],
    //       },
    //       // investor data
    //       name_of_fund: data?.investor_fund_name,
    //       fund_size: [
    //         data?.investor_fund_size &&
    //         typeof data?.investor_fund_size === "number"
    //           ? data?.investor_fund_size
    //           : 0,
    //       ],
    //       existing_icp_investor:
    //         data?.existing_icp_investor === "true" ? true : false,
    //       investor_type: [
    //         data?.existing_icp_investor === "true" && data?.investment_type
    //           ? data?.investment_type
    //           : "",
    //       ],
    //       project_on_multichain: [
    //         data?.invested_in_multi_chain === "true" &&
    //         data?.invested_in_multi_chain_names
    //           ? data?.invested_in_multi_chain_names
    //           : "",
    //       ],
    //       category_of_investment: data?.investment_categories,
    //       preferred_icp_hub: data?.preferred_icp_hub,
    //       portfolio_link: data?.investor_portfolio_link,
    //       website_link: [data?.investor_website_url || ""],
    //       registered: data?.investor_registered === "true" ? true : false,
    //       registered_country: [
    //         data?.investor_registered === "true" && data?.registered_country
    //           ? data?.registered_country
    //           : "",
    //       ],
    //       linkedin_link: data?.investor_linkedin_url,
    //       stage: [data?.investment_stage || ""],
    //       range_of_check_size: [
    //         data?.investment_stage !== "" &&
    //         data?.investment_stage !== "we do not currently invest" &&
    //         data?.investment_stage_range
    //           ? data?.investment_stage_range
    //           : "",
    //       ],
    //       // investor data not exiting on frontend or raw variables
    //       average_check_size: 0,
    //       assets_under_management: [""],
    //       registered_under_any_hub: [false],
    //       logo: [[]],
    //       money_invested: [0],
    //       existing_icp_portfolio: [""],
    //       reason_for_joining: [""],
    //       type_of_investment: "",
    //       number_of_portfolio_companies: 0,
    //       announcement_details: [""],
    //     };
    //     console.log(investorData);
    //     try {
    //       if (userCurrentRoleStatusActiveRole === "vc") {
    //         await actor.update_venture_capitalist(investorData).then((result) => {
    //           if (result && result.includes("approval request is sent")) {
    //             toast.success("Approval request is sent");
    //             window.location.href = "/";
    //           } else {
    //             toast.error(result);
    //           }
    //         });
    //       } else if (
    //         userCurrentRoleStatusActiveRole === null ||
    //         userCurrentRoleStatusActiveRole === "user" ||
    //         userCurrentRoleStatusActiveRole === "project" ||
    //         userCurrentRoleStatusActiveRole === "mentor"
    //       ) {
    //         await actor
    //           .register_venture_capitalist(investorData)
    //           .then((result) => {
    //             if (result && result.includes("approval request is sent")) {
    //               toast.success("Approval request is sent");
    //               window.location.href = "/";
    //             } else {
    //               toast.error("something got wrong");
    //             }
    //           });
    //       }
    //     } catch (error) {
    //       toast.error(error);
    //       console.error("Error sending data to the backend:", error);
    //     }
    //   } else {
    //     toast.error("Please signup with internet identity first");
    //     window.location.href = "/";
    //   }
    // };

    // form error handler func
    // const onErrorHandler = (val) => {
    //   console.log("val Error", val);
    //   toast.error("Empty fields or invalid values, please recheck the form");
    // };

    // default interests set function
    const setInterestedDomainsSelectedOptionsHandler = (val) => {
        setInterestedDomainsSelectedOptions(
            val
                ? val
                    .split(", ")
                    .map((interest) => ({ value: interest, label: interest }))
                : []
        );
    };

    // default reasons set function
    const setReasonOfJoiningSelectedOptionsHandler = (val) => {
        setReasonOfJoiningSelectedOptions(
            val && val.length > 0 && val[0].length > 0
                ? val[0].map((reason) => ({ value: reason, label: reason }))
                : []
        );
    };
    // default Interest set function
    const setTypeOfInvestSelectedOptionsHandler = (val) => {
        setTypeOfInvestSelectedOptions(
            val && val.length > 0
                ? val?.[0]
                    .split(", ")
                    .map((interest) => ({ value: interest, label: interest }))
                : []
        );
    };
    const setInvestedInMultiChainSelectedOptionsHandler = (val) => {
        setInvestedInMultiChainSelectedOptions(
            val
                ? val?.[0].split(", ").map((chain) => ({ value: chain, label: chain }))
                : []
        );
    };

    // default investment categories set function
    const setInvestmentCategoriesSelectedOptionsHandler = (val) => {
        setInvestmentCategoriesSelectedOptions(
            val
                ? val
                    .split(", ")
                    .map((investment) => ({ value: investment, label: investment }))
                : []
        );
    };

    // default investment stage set function
    const setInvestStageSelectedOptionsHandler = (val) => {
        setInvestStageSelectedOptions(
            val
                ? val?.[0]
                    .split(", ")
                    .map((investment) => ({ value: investment, label: investment }))
                : []
        );
    };

    // default investment stage range set function
    const setInvestStageRangeSelectedOptionsHandler = (val) => {
        setInvestStageRangeSelectedOptions(
            val
                ? val?.[0]
                    .split(", ")
                    .map((investment) => ({ value: investment, label: investment }))
                : []
        );
    };

    // set values handler
    const setValuesHandler = (val) => {
        if (val) {
            setValue("full_name", val?.full_name ?? "");
            setValue("email", val?.email?.[0] ?? "");
            setValue("telegram_id", val?.telegram_id?.[0] ?? "");
            setValue("twitter_url", val?.twitter_id?.[0] ?? "");
            setValue("openchat_user_name", val?.openchat_username?.[0] ?? "");
            setValue("bio", val?.bio?.[0] ?? "");
            setValue("country", val?.country ?? "");
            setValue("domains_interested_in", val?.area_of_interest ?? "");
            setInterestedDomainsSelectedOptionsHandler(val?.area_of_interest ?? null);
            setImagePreview(val?.profile_picture?.[0] ?? "");
            setValue("type_of_profile", val?.type_of_profile[0]);
            setValue(
                "reasons_to_join_platform",
                val?.reason_to_join ? val?.reason_to_join.join(", ") : ""
            );
            setReasonOfJoiningSelectedOptionsHandler(val?.reason_to_join);
        }
    };
    // set investor values handler
    const setInvestorValuesHandler = (val) => {
        console.log("val==========>>>>>>>>>>>>>>>", val);
        if (val) {
            setValue("full_name", val?.user_data?.full_name ?? "");
            setValue("email", val?.user_data?.email?.[0] ?? "");
            setValue("telegram_id", val?.user_data?.telegram_id?.[0] ?? "");
            setValue("twitter_url", val?.user_data?.twitter_id?.[0] ?? "");
            setValue(
                "openchat_user_name",
                val?.user_data?.openchat_username?.[0] ?? ""
            );
            setValue("bio", val?.user_data?.bio?.[0] ?? "");
            setValue("country", val?.user_data?.country ?? "");
            setValue("domains_interested_in", val?.user_data?.area_of_interest ?? "");
            setInterestedDomainsSelectedOptionsHandler(
                val?.user_data?.area_of_interest ?? null
            );
            // setImagePreview(val?.user_data?.profile_picture?.[0] ?? "");
            setImagePreview(
                val?.user_data?.profile_picture?.[0] instanceof Uint8Array
                    ? uint8ArrayToBase64(val?.user_data?.profile_picture?.[0])
                    : ""
            );
            setValue("type_of_profile", val?.user_data?.type_of_profile?.[0]);
            setValue(
                "reasons_to_join_platform",
                val?.user_data?.reason_to_join
                    ? val?.user_data?.reason_to_join.join(", ")
                    : ""
            );
            setReasonOfJoiningSelectedOptionsHandler(val?.user_data?.reason_to_join);
            setValue("area_of_expertise", val?.area_of_expertise?.[0] ?? "");
            setValue("investor_registered", val?.registered ?? "");
            if (val?.registered === true) {
                setValue("investor_registered", "true");
            } else {
                setValue("investor_registered", "false");
            }
            setValue("registered_country", val?.registered_country?.[0] ?? "");
            setValue(
                "preferred_icp_hub",
                val?.preferred_icp_hub ? val?.preferred_icp_hub : ""
            );
            setValue("existing_icp_investor", val?.existing_icp_investor ?? "");
            if (val?.existing_icp_investor === true) {
                setValue("existing_icp_investor", "true");
            } else {
                setValue("existing_icp_investor", "false");
            }
            setValue("investment_type", val?.investor_type?.[0] ?? "");
            setTypeOfInvestSelectedOptionsHandler(val?.investor_type);
            setValue("investor_portfolio_link", val?.portfolio_link ?? "");
            setValue("investor_fund_name", val?.name_of_fund ?? "");
            setValue("investor_fund_size", val?.fund_size?.[0] ?? "");
            if (val?.project_on_multichain?.[0]) {
                setValue("invested_in_multi_chain", "true");
            } else {
                setValue("invested_in_multi_chain", "false");
            }
            setValue(
                "invested_in_multi_chain_names",
                val?.project_on_multichain?.[0] ?? ""
            );
            setInvestedInMultiChainSelectedOptionsHandler(val?.project_on_multichain);
            setValue("investment_categories", val?.category_of_investment ?? "");
            setInvestmentCategoriesSelectedOptionsHandler(
                val?.category_of_investment
            );
            setValue("investor_website_url", val?.website_link?.[0] ?? "");
            setValue("investor_linkedin_url", val?.linkedin_link ?? "");
            setValue("investment_stage", val?.stage?.[0] ?? "");
            setInvestStageSelectedOptionsHandler(val?.stage);
            setValue("investment_stage_range", val?.range_of_check_size?.[0] ?? "");
            setInvestStageRangeSelectedOptionsHandler(val?.range_of_check_size);
        }
    };
    // Get data from redux useEffect
    useEffect(() => {
        if (areaOfExpertise) {
            setInterestedDomainsOptions(
                areaOfExpertise.map((expert) => ({
                    value: expert.name,
                    label: expert.name,
                }))
            );
        } else {
            setInterestedDomainsOptions([]);
        }
    }, [areaOfExpertise]);

    useEffect(() => {
        if (typeOfProfile) {
            setTypeOfProfileOptions(
                typeOfProfile.map((type) => ({
                    value: type.role_type.toLowerCase(),
                    label: type.role_type,
                }))
            );
        } else {
            setTypeOfProfileOptions([]);
        }
    }, [typeOfProfile]);

    useEffect(() => {
        if (investorFullData) {
            console.log("Investor full data ==>", investorFullData);
            setInvestorValuesHandler(investorFullData);
            setEditMode(true);
        } else if (userFullData) {
            setValuesHandler(userFullData);
        }
    }, [userFullData, investorFullData]);

    // INVESTOR SIDE USEEFFECTS

    // useEffect(() => {
    //     dispatch(allHubHandlerRequest());
    // }, [actor, dispatch]);

    useEffect(() => {
        if (multiChainNames) {
            setInvestedInMultiChainOptions(
                multiChainNames.map((chain) => ({
                    value: chain,
                    label: chain,
                }))
            );
        } else {
            setInvestedInMultiChainOptions([]);
        }
    }, [multiChainNames]);

    useEffect(() => {
        if (areaOfExpertise) {
            setInvestmentCategoriesOptions(
                areaOfExpertise.map((expert) => ({
                    value: expert.name,
                    label: expert.name,
                }))
            );
        } else {
            setInvestmentCategoriesOptions([]);
        }
    }, [areaOfExpertise]);

    useEffect(() => {
        if (actor) {
            (async () => {
                try {
                    const result = await actor.get_investment_stage();
                    if (result && result.length > 0) {
                        let mapped_arr = result.map((val, index) => ({
                            value: val.toLowerCase(),
                            label: val,
                        }));
                        setInvestStageOptions(mapped_arr);
                    } else {
                        setInvestStageOptions([]);
                    }
                } catch (error) {
                    setInvestStageOptions([]);
                }
            })();
        }
    }, [actor]);
    useEffect(() => {
        if (actor) {
            (async () => {
                if (userCurrentRoleStatusActiveRole === "vc") {
                    const result = await actor.get_vc_info();
                    if (result) {
                        console.log("result", result);
                        setImageData(result?.[0]?.user_data?.profile_picture?.[0] ?? null);
                        setValue(
                            "type_of_profile",
                            result?.[0]?.user_data?.type_of_profile?.[0]
                                ? result?.[0]?.user_data?.type_of_profile?.[0]
                                : ""
                        );
                        setValue(
                            "preferred_icp_hub",
                            result?.[0]?.preferred_icp_hub
                                ? result?.[0]?.preferred_icp_hub
                                : ""
                        );
                    } else {
                        setImageData(null);
                        setValue("type_of_profile", "");
                        setValue("preferred_icp_hub", "");
                    }
                } else if (
                    userCurrentRoleStatusActiveRole === null ||
                    userCurrentRoleStatusActiveRole === "user" ||
                    userCurrentRoleStatusActiveRole === "mentor" ||
                    userCurrentRoleStatusActiveRole === "project"
                ) {
                    const result = await actor.get_user_information();
                    if (result) {
                        setImageData(result?.Ok?.profile_picture?.[0] ?? null);

                        setValue(
                            "type_of_profile",
                            result?.Ok?.type_of_profile?.[0]
                                ? result?.Ok?.type_of_profile?.[0]
                                : ""
                        );
                    } else {
                        setImageData(null);
                        setValue("type_of_profile", "");
                    }
                }
            })();
        }
    }, [actor]);

    useEffect(() => {
        if (actor) {
            (async () => {
                try {
                    const result = await actor.get_range_of_check_size();
                    if (result && result.length > 0) {
                        let mapped_arr = result.map((val, index) => ({
                            value: val.toLowerCase(),
                            label: val,
                        }));
                        setInvestStageRangeOptions(mapped_arr);
                    } else {
                        setInvestStageRangeOptions([]);
                    }
                } catch (error) {
                    setInvestStageRangeOptions([]);
                }
            })();
        }
    }, [actor]);

    useEffect(() => {
        if (actor) {
            (async () => {
                const result = await actor.get_user_information();
                if (result) {
                    setImageData(result?.Ok?.profile_picture?.[0] ?? null);
                } else {
                    setImageData(null);
                }
            })();
        }
    }, [actor]);

    const formFields = {
        // 0: ["full_name", "email", "telegram_id", "twitter_id", "openchat_username"],
        // 1: ["bio", "country", "area_of_interest", "type_of_profile", "reason_to_join"],
        0: ["investor_registered", "registered_country", "existing_icp_investor", "investment_type", "invested_in_multi_chain", "invested_in_multi_chain_names"],
        1: ["investment_categories", "investment_stage", "investment_stage_range", "investor_website_url", "investor_linkedin_url"],
        2: ["preferred_icp_hub", "investor_portfolio_link", "investor_fund_name", "investor_fund_size"],
    };

    const methods = useForm({
        // defaultValues: {
        //     investor_registered: 'no',
        //     registered_country: "",
        //     countries: [],
        //     existing_icp_investor: 'no',
        //     investment_type: [],
        //     invested_in_multi_chain: "no",
        //     invested_in_multi_chain_names: [],
        //     investment_categories: [],
        //     investor_website_url: "",
        //     investment_stage: [],
        //     investment_stage_range: [],
        //     investor_linkedin_url: "",
        //     investor_portfolio_link: "",
        //     preferred_icp_hub: "",
        //     investor_fund_name: "",
        //     investor_fund_size: '',
        // },
        resolver: yupResolver(validationSchema),
        mode: "all",
    });
    const {
        handleSubmit,
        setValue,
        register,
        reset,
        clearErrors,
        getValues,
        setError,
        watch,
        control,
        trigger,
        formState: { errors, isSubmitting },
    } = methods;

    const [index, setIndex] = useState(0);

    //next button functionality
    const handleNext = async () => {
        `
        `
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
                user_data: {
                    full_name: data?.full_name,
                    email: [data?.email],
                    telegram_id: [data?.telegram_id.toString()],
                    twitter_id: [data?.twitter_url.toString()],
                    openchat_username: [data?.openchat_user_name],
                    bio: [data?.bio],
                    country: data?.country,
                    area_of_interest: data?.domains_interested_in,
                    type_of_profile: [data?.type_of_profile || ""],
                    reason_to_join: [
                        data?.reasons_to_join_platform
                            .split(",")
                            .map((val) => val.trim()) || [""],
                    ],
                    profile_picture: imageData ? [imageData] : [],
                },
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
                preferred_icp_hub: data?.preferred_icp_hub,
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
                const covertedPrincipal = await Principal.fromText(principal);
                if (userCurrentRoleStatusActiveRole === "user") {
                    await actor
                        .update_user_data(covertedPrincipal, userData)
                        .then((result) => {
                            if ("Ok" in result) {
                                toast.success("Approval request is sent");
                                setTimeout(() => {
                                    window.location.href = "/";
                                }, 500);
                            } else {
                                toast.error(result);
                            }
                        });
                } else if (
                    userCurrentRoleStatusActiveRole === null ||
                    userCurrentRoleStatusActiveRole === "mentor" ||
                    userCurrentRoleStatusActiveRole === "project" ||
                    userCurrentRoleStatusActiveRole === "vc"
                ) {
                    await actor.register_user(userData).then((result) => {
                        if (result && result.includes("User registered successfully")) {
                            toast.success("Registered as a User");
                            window.location.href = "/";
                        } else {
                            toast.error("Something got wrong");
                        }
                    });
                }
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

import React, { useState,useEffect, useRef } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import { useForm, Controller } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
// import DetailHeroSection from "../Common/DetailHeroSection";
import { ThreeDots } from "react-loader-spinner";
import { useCountries } from "react-countries";
import Select from 'react-select';
import ReactSelect from "react-select";
import CompressedImage from "../ImageCompressed/CompressedImage";
import { allHubHandlerRequest } from "../StateManagement/Redux/Reducers/All_IcpHubReducer";
import { uint8ArrayToBase64 } from "../../../../admin_frontend/src/components/Utils/AdminData/saga_function/blobImageToUrl";

const InvestorDetail = () => {

    const { countries } = useCountries();
    const dispatch = useDispatch();
    const actor = useSelector((currState) => currState.actors.actor);
    const areaOfExpertise = useSelector(
      (currState) => currState.expertiseIn.expertise
    );
    const typeOfProfile = useSelector(
      (currState) => currState.profileTypes.profiles
    );
    const getAllIcpHubs = useSelector((currState) => currState.hubs.allHubs);
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
          ).nullable(true)
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
     const defaultValues ={
      investor_registered:"No",
      registered_country: "India",
      preferred_icp_hub: "Icp Hub India",
      existing_icp_investor: "No",
      investment_type: ["SNS"],
      investor_portfolio_link: "https://portfolio.com",
      investor_fund_name: "fund name",
      investor_fund_size : "",
      invested_in_multi_chain : "No",
      invested_in_multi_chain_names : ["Etherium,Base"],
      investment_categories : ["Tooling","Social"],
      investor_website_url : "https://website.com",
      investor_linkedin_url : "https://linkedIn.com",
      investment_stage : ["Pre-Mvp"],
      investment_stage_range : ["$2-5M"],


     }
  
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
      defaultValues,
    });
     console.log("getvalues =>",getValues)
  
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
          if (userCurrentRoleStatusActiveRole === "vc") {
            await actor.update_venture_capitalist(investorData).then((result) => {
              if (result && result.includes("approval request is sent")) {
                toast.success("Approval request is sent");
                window.location.href = "/";
              } else {
                toast.error(result);
              }
            });
          } else if (
            userCurrentRoleStatusActiveRole === null ||
            userCurrentRoleStatusActiveRole === "user" ||
            userCurrentRoleStatusActiveRole === "project" ||
            userCurrentRoleStatusActiveRole === "mentor"
          ) {
            await actor
              .register_venture_capitalist(investorData)
              .then((result) => {
                if (result && result.includes("approval request is sent")) {
                  toast.success("Approval request is sent");
                  window.location.href = "/";
                } else {
                  toast.error("something got wrong");
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
  
    useEffect(() => {
      dispatch(allHubHandlerRequest());
    }, [actor, dispatch]);
  
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
  
   
   const [edit, setEdit] = useState({
    investorRegistered: false,
    registeredCountry : false,
    preferredIcpHub: false,
    existingIcpInvestor: false,
    invested_in_multiChain: false,
    portfolioLink : false,
    fundName:false,
    fundSize:false,
    investedCategory:false,
    websiteLink:false,
    linkedInLink:false,
    investmentStag:false,
    investmentRange:false,


  });

  const handleEditClick = (field) => {
    setEdit({ ...edit, [field]: true });
  };

  const editableRef = useRef(null);

  const handleClickOutside = (event) => {
    if (editableRef.current && !editableRef.current.contains(event.target)) {
      setEdit({
        investorRegistered: false,
    registeredCountry : false,
    preferredIcpHub: false,
    existingIcpInvestor: false,
    invested_in_multiChain: false,
    portfolioLink : false,
    fundName:false,
    fundSize:false,
    investedCategory:false,
    websiteLink:false,
    linkedInLink:false,
    investmentStag:false,
    investmentRange:false,
      });
      setInvestorValuesHandler(getValues)
    }
  };
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={editableRef} className=" bg-white">
      <form onSubmit={handleSubmit(onSubmitHandler, onErrorHandler)}
      >
      <div className="my-1 relative group hover:bg-slate-50 rounded p-1">
        <div className="absolute right-2 top-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <EditIcon
            sx={{ fontSize: 'medium', cursor: 'pointer' }}
            onClick={() => handleEditClick('investorRegistered')}
          />
        </div>

        <label className="block text-gray-700">Are you registered?</label>
        {edit.investorRegistered ? (
          <div>
            <select
            {...register("investor_registered")}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option className="text-lg" value="false">
              No
            </option>
            <option className="text-lg" value="true">
              Yes
            </option>
          </select>
          </div>
        ) : (
          <div className="flex justify-between items-center cursor-pointer p-1">
            <span>{getValues.investor_registered}</span>
          </div>
        )}
      </div>
      {watch("investor_registered") === "true" && (
      <div className="mb-1 relative group hover:bg-slate-50 rounded p-1">
        <div className="absolute right-2 top-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <EditIcon
            sx={{ fontSize: 'medium', cursor: 'pointer' }}
            onClick={() => handleEditClick('registeredCountry')}
          />
        </div>

        <label className="block text-gray-700">Registered Country </label>
        {edit.registeredCountry ? (
          <div>
            <select
                        {...register("registered_country")}
                        name="registered_country"
                        // value={getValues("registered_country")}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                        <option value="">Please choose an option </option>/
                        {countries?.map((country) => (
                            <option
                                key={country.name}
                                value={`${country.name}`}
                                className="text-lg"
                            >
                                {country.name}
                            </option>
                        ))}
                    </select>
                    {errors.registered_country && (
                        <p className="mt-1 text-sm text-red-500 font-bold text-left">
                            {errors.registered_country.message}
                        </p>
                    )}
          </div>
        ) : (
          <div className="flex justify-between items-center cursor-pointer p-1">
            <span>{getValues.registered_country} </span>
          </div>
        )}
      </div>
      )}
      
      <div className="mb-1 relative group hover:bg-slate-50 rounded p-1">
        <div className="absolute right-2 top-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <EditIcon
            sx={{ fontSize: 'medium', cursor: 'pointer' }}
            onClick={() => handleEditClick('preferredIcpHub')}
          />
        </div>

        <label className="block text-gray-700">ICP hub you will like to be associated </label>
        {edit.preferredIcpHub ? (
          <div>
            <select
                    {...register("preferred_icp_hub")}
                    name="preferred_icp_hub"

                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                    <option value="">Please choose an option</option>
                    {getAllIcpHubs?.map((hub) => (
            <option key={hub.id} value={`${hub.name} ,${hub.region}`} className="text-lg font-bold">
              {hub.name}, {hub.region}
            </option>
          ))}
                </select>
                {errors.preferred_icp_hub && (
                    <p className="mt-1 text-sm text-red-500 font-bold text-left">
                        {errors.preferred_icp_hub.message}
                    </p>
                )}
          </div>
        ) : (
          <div className="flex justify-between items-center cursor-pointer p-1">
            <span>{getValues.preferred_icp_hub}</span>
          </div>
        )}
      </div>
      <div className="mb-1 relative group hover:bg-slate-50 rounded p-1">
        <div className="absolute right-2 top-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <EditIcon
            sx={{ fontSize: 'medium', cursor: 'pointer' }}
            onClick={() => handleEditClick('existingIcpInvestor')}
          />
        </div>

        <label className="block text-gray-700">Are you an existing ICP investor </label>
        {edit.existingIcpInvestor ? (
          <div>
          <select
                    {...register("existing_icp_investor")}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                    <option className="text-lg" value="false">
                        No
                    </option>
                    <option className="text-lg" value="true">
                        Yes
                    </option>
                </select>
                {errors.existing_icp_investor && (
                    <p className="mt-1 text-sm text-red-500 font-bold text-left">
                        {errors.existing_icp_investor.message}
                    </p>
                )}
        </div>
        ) : (
          <div className="flex justify-between items-center cursor-pointer p-1">
            <span>{getValues.existing_icp_investor}</span>
          </div>
        )}
      </div>
      {watch("existing_icp_investor") === 'true' && (
                <div className="mb-1">
                    <label className="block text-sm font-medium mb-1">Type of investment<span className='text-[red] ml-1'>*</span></label>
                    <ReactSelect
                        isMulti
                        menuPortalTarget={document.body}
                        menuPosition={"fixed"}
                        styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                            control: (provided, state) => ({
                                ...provided,
                                paddingBlock: "2px",
                                borderRadius: "8px",
                                border: errors.investment_type
                                    ? "1px solid #ef4444"
                                    : "1px solid #737373",
                                backgroundColor: "rgb(249 250 251)",
                                "&::placeholder": {
                                    color: errors.investment_type
                                        ? "#ef4444"
                                        : "currentColor",
                                },
                                display: "flex",
                                overflowX: "auto",
                                maxHeight: "43px",
                                "&::-webkit-scrollbar": {
                                    display: "none",
                                },
                            }),
                            valueContainer: (provided, state) => ({
                                ...provided,
                                overflow: "scroll",
                                maxHeight: "40px",
                                scrollbarWidth: "none",
                            }),
                            placeholder: (provided, state) => ({
                                ...provided,
                                color: errors.investment_type
                                    ? "#ef4444"
                                    : "rgb(107 114 128)",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }),
                            multiValue: (provided) => ({
                                ...provided,
                                display: "inline-flex",
                                alignItems: "center",
                                backgroundColor: "white",
                                border: "1px solid gray",
                                borderRadius: "5px"

                            }),
                            multiValueRemove: (provided) => ({
                                ...provided,
                                display: "inline-flex",
                                alignItems: "center",

                            }),
                        }}
                        value={typeOfInvestSelectedOptions}
                        options={typeOfInvestOptions}
                        classNamePrefix="select"
                        className="basic-multi-select w-full text-start"
                        placeholder="Select a investment type"
                        name="investment_type"
                        onChange={(selectedOptions) => {
                            if (selectedOptions && selectedOptions.length > 0) {
                                setTypeOfInvestSelectedOptions(selectedOptions);
                                clearErrors("investment_type");
                                setValue(
                                    "investment_type",
                                    selectedOptions
                                        .map((option) => option.value)
                                        .join(", "),
                                    { shouldValidate: true }
                                );
                            } else {
                                setTypeOfInvestSelectedOptions([]);
                                setValue("investment_type", "", {
                                    shouldValidate: true,
                                });
                                setError("investment_type", {
                                    type: "required",
                                    message: "Atleast one investment type required",
                                });
                            }
                        }}
                    />
                    {errors.investment_type && (
                        <p className="mt-1 text-sm text-red-500 font-bold text-left">
                            {errors.investment_type.message}
                        </p>
                    )}
                </div>
            )}
             <div className="my-1 relative group hover:bg-slate-50 rounded p-1">
        <div className="absolute right-2 top-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <EditIcon
            sx={{ fontSize: 'medium', cursor: 'pointer' }}
            onClick={() => handleEditClick('portfolioLink')}
          />
        </div>

        <label className="block text-gray-700">Portfolio Link</label>
        {edit.portfolioLink ? (
          <div>
            <input
                    {...register("investor_portfolio_link")}
                    type="url"
                    placeholder="Enter your portfolio url"
                    name=" investor_portfolio_link"
                    className="block w-full border border-gray-300 rounded-md p-1"

                />
                {errors?.investor_portfolio_link && (
                    <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                        {errors?.investor_portfolio_link?.message}
                    </span>
                )}
          </div>
        ) : (
          <div className="flex justify-between items-center cursor-pointer p-1">
            <span>{getValues.investor_portfolio_link}</span>
          </div>
        )}
      </div>

      <div className="my-1 relative group hover:bg-slate-50 rounded p-1">
        <div className="absolute right-2 top-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <EditIcon
            sx={{ fontSize: 'medium', cursor: 'pointer' }}
            onClick={() => handleEditClick('fundName')}
          />
        </div>

        <label className="block text-gray-700">Fund Name </label>
        {edit.fundName ? (
          <div>
             <input
                    {...register("investor_fund_name")}
                    type="text"
                    placeholder="Enter your fund name"
                    name="investor_fund_name"
                    className="block w-full border border-gray-300 rounded-md p-1"

                />
                {errors?.investor_fund_name && (
                    <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                        {errors?.investor_fund_name?.message}
                    </span>
                )}
          </div>
        ) : (
          <div className="flex justify-between items-center cursor-pointer p-1">
            <span>{getValues.investor_fund_name}</span>
          </div>
        )}
      </div>

      <div className="my-1 relative group hover:bg-slate-50 rounded p-1">
        <div className="absolute right-2 top-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <EditIcon
            sx={{ fontSize: 'medium', cursor: 'pointer' }}
            onClick={() => handleEditClick('fundSize')}
          />
        </div>

        <label className="block text-gray-700">Fund size (in million USD) </label>
        {edit.fundSize ? (
          <div>
             <input
                    {...register("investor_fund_size")}
                    type="number"
                    placeholder="Enter fund size in Millions"
                    name="investor_fund_size"
                    className="block w-full border border-gray-300 rounded-md p-1"
                    onWheel={(e) => e.target.blur()}
                
                />
                {errors?.investor_fund_size && (
                    <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                        {errors?.investor_fund_size?.message}
                    </span>
                )}
          </div>
        ) : (
          <div className="flex justify-between items-center cursor-pointer p-1">
            <span>{getValues.investor_fund_size}</span>
          </div>
        )}
      </div>

      <div className="mb-1 relative group hover:bg-slate-50 rounded p-1">
        <div className="absolute right-2 top-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <EditIcon
            sx={{ fontSize: 'medium', cursor: 'pointer' }}
            onClick={() => handleEditClick('invested_in_multiChain')}
          />
        </div>

        <label className="block text-gray-700">Do you invest in multiple ecosystems ? </label>
        {edit.invested_in_multiChain ? (
          <div>
          <select
                    {...register("invested_in_multi_chain")}
                    // value={getValues("invested_in_multi_chain")}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                    <option className="text-lg" value="false">
                        No
                    </option>
                    <option className="text-lg" value="true">
                        Yes
                    </option>
                </select>
                {errors.invested_in_multi_chain && (
                    <p className="mt-1 text-sm text-red-500 font-bold text-left">
                        {errors.invested_in_multi_chain.message}
                    </p>
                )}
        </div>
        ) : (
          <div className="flex justify-between items-center cursor-pointer p-1">
            <span>{getValues.invested_in_multi_chain}</span>
          </div>
        )}
      </div>
      {watch("invested_in_multi_chain") === 'true' && (
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Please select the chains <span className='text-[red] ml-1'>*</span></label>
                    <Select
                        isMulti
                        menuPortalTarget={document.body}
                        menuPosition={"fixed"}
                        styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                            control: (provided, state) => ({
                                ...provided,
                                paddingBlock: "0px",
                                borderRadius: "8px",
                                border: errors.invested_in_multi_chain_names
                                    ? "2px solid #ef4444"
                                    : "2px solid #737373",
                                backgroundColor: "rgb(249 250 251)",
                                "&::placeholder": {
                                    color: errors.invested_in_multi_chain_names
                                        ? "#ef4444"
                                        : "currentColor",
                                },
                                display: "flex",
                                overflowX: "hidden",
                                height:"24px",
                                maxHeight: "33px",
                                "&::-webkit-scrollbar": {
                                    display: "none",
                                },
                            }),
                            valueContainer: (provided, state) => ({
                                ...provided,
                                overflow: "hidden",
                                height:"24px",
                                maxHeight: "30px",
                                scrollbarWidth: "none",
                            }),
                            placeholder: (provided, state) => ({
                                ...provided,
                                color: errors.invested_in_multi_chain_names
                                    ? "#ef4444"
                                    : "rgb(107 114 128)",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }),
                            multiValue: (provided) => ({
                                ...provided,
                                display: "inline-flex",
                                alignItems: "center",
                                backgroundColor: "white",
                                border: "1px solid gray",
                                borderRadius: "5px"
                            }),
                            multiValueRemove: (provided) => ({
                                ...provided,
                                display: "inline-flex",
                                alignItems: "center",
                            }),
                        }}
                        value={investedInMultiChainSelectedOptions}
                        options={investedInmultiChainOptions}
                        classNamePrefix="select"
                        className="basic-multi-select w-full text-start"
                        placeholder="Select a chain"
                        name="invested_in_multi_chain_names"
                        onChange={(selectedOptions) => {
                            if (selectedOptions && selectedOptions.length > 0) {
                                setInvestedInMultiChainSelectedOptions(
                                    selectedOptions
                                );
                                clearErrors("invested_in_multi_chain_names");
                                setValue(
                                    "invested_in_multi_chain_names",
                                    selectedOptions
                                        .map((option) => option.value)
                                        .join(", "),
                                    { shouldValidate: true }
                                );
                            } else {
                                setInvestedInMultiChainSelectedOptions([]);
                                setValue("invested_in_multi_chain_names", "", {
                                    shouldValidate: true,
                                });
                                setError("invested_in_multi_chain_names", {
                                    type: "required",
                                    message: "Atleast one chain name required",
                                });
                            }
                        }}
                    />
                    {errors.invested_in_multi_chain_names && (
                        <p className="mt-1 text-sm text-red-500 font-bold text-left">
                            {errors.invested_in_multi_chain_names.message}
                        </p>
                    )}
                </div>
            )}

            <div className="mb-1 relative group hover:bg-slate-50 rounded p-1">
        <div className="absolute right-2 top-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <EditIcon
            sx={{ fontSize: 'medium', cursor: 'pointer' }}
            onClick={() => handleEditClick('investedCategory')}
          />
        </div>

        <label className="block text-gray-700">Category of investment </label>
        {edit.investedCategory ? (
          <div>
          <Select
                    isMulti
                    menuPortalTarget={document.body}
                    menuPosition={"fixed"}
                    styles={{
                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        control: (provided, state) => ({
                            ...provided,
                            paddingBlock: "2px",
                            borderRadius: "8px",
                            border: errors.investment_categories
                                ? "2px solid #ef4444"
                                : "2px solid #737373",
                            backgroundColor: "rgb(249 250 251)",
                            "&::placeholder": {
                                color: errors.investment_categories
                                    ? "#ef4444"
                                    : "currentColor",
                            },
                            display: "flex",
                            overflowX: "auto",
                            maxHeight: "43px",
                            "&::-webkit-scrollbar": {
                                display: "none",
                            },
                        }),
                        valueContainer: (provided, state) => ({
                            ...provided,
                            overflow: "scroll",
                            maxHeight: "40px",
                            scrollbarWidth: "none",
                        }),
                        placeholder: (provided, state) => ({
                            ...provided,
                            color: errors.investment_categories
                                ? "#ef4444"
                                : "rgb(107 114 128)",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }),
                        multiValue: (provided) => ({
                            ...provided,
                            display: "inline-flex",
                            alignItems: "center",
                            backgroundColor: "white",
                            border: "1px solid gray",
                            borderRadius: "5px"
                        }),
                        multiValueRemove: (provided) => ({
                            ...provided,
                            display: "inline-flex",
                            alignItems: "center",
                        }),
                    }}
                    value={investmentCategoriesSelectedOptions}
                    options={investmentCategoriesOptions}
                    classNamePrefix="select"
                    className="basic-multi-select w-full text-start"
                    placeholder="Select categories of investment"
                    name="investment_categories"
                    onChange={(selectedOptions) => {
                        if (selectedOptions && selectedOptions.length > 0) {
                            setInvestmentCategoriesSelectedOptions(selectedOptions);
                            clearErrors("investment_categories");
                            setValue(
                                "investment_categories",
                                selectedOptions
                                    .map((option) => option.value)
                                    .join(", "),
                                { shouldValidate: true }
                            );
                        } else {
                            setInvestmentCategoriesSelectedOptions([]);
                            setValue("investment_categories", "", {
                                shouldValidate: true,
                            });
                            setError("investment_categories", {
                                type: "required",
                                message: "Selecting a category is required",
                            });
                        }
                    }}

                />
                {errors.investment_categories && (
                    <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                        {errors.investment_categories.message}
                    </span>
                )}
        </div>
        ) : (
          <div className="flex justify-between items-center cursor-pointer p-1">
            <span>{getValues.investment_categories}</span>
          </div>
        )}
      </div>

      <div className="my-1 relative group hover:bg-slate-50 rounded p-1">
        <div className="absolute right-2 top-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <EditIcon
            sx={{ fontSize: 'medium', cursor: 'pointer' }}
            onClick={() => handleEditClick('websiteLink')}
          />
        </div>

        <label className="block text-gray-700">Website Link</label>
        {edit.websiteLink ? (
          <div>
            <input
                    {...register("investor_website_url")}
                    type="url"
                    name="investor_website_url"
                    placeholder="Enter your website url"
                    className="block w-full border border-gray-300 rounded-md p-1"
                />
                {errors?.investor_website_url && (
                    <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                        {errors?.investor_website_url?.message}
                    </span>
                )}
          </div>
        ) : (
          <div className="flex justify-between items-center cursor-pointer p-1">
            <span>{getValues.investor_website_url}</span>
          </div>
        )}
      </div>

      <div className="my-1 relative group hover:bg-slate-50 rounded p-1">
        <div className="absolute right-2 top-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <EditIcon
            sx={{ fontSize: 'medium', cursor: 'pointer' }}
            onClick={() => handleEditClick('linkedInLink')}
          />
        </div>

        <label className="block text-gray-700">LinkedIn Link</label>
        {edit.linkedInLink ? (
          <div>
            <input
                    {...register("investor_linkedin_url")}
                    type="url"
                    name="investor_linkedin_url"
                    placeholder="Enter your linkedin url"
                    className="block w-full border border-gray-300 rounded-md p-1"
                    required
                />
                {errors?.investor_linkedin_url && (
                    <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                        {errors?.investor_linkedin_url?.message}
                    </span>
                )}
          </div>
        ) : (
          <div className="flex justify-between items-center cursor-pointer p-1">
            <span>{getValues.investor_linkedin_url}</span>
          </div>
        )}
      </div>


      <div className="mb-1 relative group hover:bg-slate-50 rounded p-1">
        <div className="absolute right-2 top-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <EditIcon
            sx={{ fontSize: 'medium', cursor: 'pointer' }}
            onClick={() => handleEditClick('investmentStag')}
          />
        </div>

        <label className="block text-gray-700">Which stage(s) do you invest at ?   </label>
        {edit.investmentStag ? (
          <div>
            <Select
                    isMulti
                    menuPortalTarget={document.body}
                    menuPosition={"fixed"}
                    styles={{
                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        control: (provided, state) => ({
                            ...provided,
                            paddingBlock: "2px",
                            borderRadius: "8px",
                            border: errors.investment_stage
                                ? "2px solid #ef4444"
                                : "2px solid #737373",
                            backgroundColor: "rgb(249 250 251)",
                            "&::placeholder": {
                                color: errors.investment_stage
                                    ? "#ef4444"
                                    : "currentColor",
                            },
                            display: "flex",
                            overflowX: "auto",
                            maxHeight: "43px",
                            "&::-webkit-scrollbar": {
                                display: "none",
                            },
                        }),
                        valueContainer: (provided, state) => ({
                            ...provided,
                            overflow: "scroll",
                            maxHeight: "40px",
                            scrollbarWidth: "none",
                        }),
                        placeholder: (provided, state) => ({
                            ...provided,
                            color: errors.investment_stage
                                ? "#ef4444"
                                : "rgb(107 114 128)",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }),
                        multiValue: (provided) => ({
                            ...provided,
                            display: "inline-flex",
                            alignItems: "center",
                            backgroundColor: "white",
                            border: "1px solid gray",
                            borderRadius: "5px"
                        }),
                        multiValueRemove: (provided) => ({
                            ...provided,
                            display: "inline-flex",
                            alignItems: "center",
                        }),
                    }}
                    value={investStageSelectedOptions}
                    options={investStageOptions}
                    classNamePrefix="select"
                    className="basic-multi-select w-full text-start"
                    placeholder="Select a stage"
                    name="investment_stage"
                    onChange={(selectedOptions) => {
                        if (selectedOptions && selectedOptions.length > 0) {
                            setInvestStageSelectedOptions(selectedOptions);
                            clearErrors("investment_stage");
                            setValue(
                                "investment_stage",
                                selectedOptions
                                    .map((option) => option.value)
                                    .join(", "),
                                { shouldValidate: true }
                            );
                        } else {
                            setInvestStageSelectedOptions([]);
                            setValue("investment_stage", "", {
                                shouldValidate: true,
                            });
                            setError("investment_stage", {
                                type: "required",
                                message: "Atleast one stage required",
                            });
                        }
                    }}
                />
                {errors.investment_stage && (
                    <p className="mt-1 text-sm text-red-500 font-bold text-left">
                        {errors.investment_stage.message}
                    </p>
                )}
        </div>
        ) : (
          <div className="flex justify-between items-center cursor-pointer p-1">
            <span>{getValues.investment_stage}</span>
          </div>
        )}
      </div>


      <div className="mb-1 relative group hover:bg-slate-50 rounded p-1">
        <div className="absolute right-2 top-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <EditIcon
            sx={{ fontSize: 'medium', cursor: 'pointer' }}
            onClick={() => handleEditClick('investmentRange')}
          />
        </div>

        <label className="block text-gray-700">What is the range of your check size ?    </label>
        {edit.investmentRange ? (
          <div>
                <Select
                    isMulti
                    menuPortalTarget={document.body}
                    menuPosition={"fixed"}
                    styles={{
                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        control: (provided, state) => ({
                            ...provided,
                            paddingBlock: "2px",
                            borderRadius: "8px",
                            border: errors.investment_stage_range
                                ? "2px solid #ef4444"
                                : "2px solid #737373",
                            backgroundColor: "rgb(249 250 251)",
                            "&::placeholder": {
                                color: errors.investment_stage_range
                                    ? "#ef4444"
                                    : "currentColor",
                            },
                            display: "flex",
                            overflowX: "auto",
                            maxHeight: "43px",
                            "&::-webkit-scrollbar": {
                                display: "none",
                            },
                        }),
                        valueContainer: (provided, state) => ({
                            ...provided,
                            overflow: "scroll",
                            maxHeight: "40px",
                            scrollbarWidth: "none",
                        }),
                        placeholder: (provided, state) => ({
                            ...provided,
                            color: errors.investment_stage_range
                                ? "#ef4444"
                                : "rgb(107 114 128)",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }),
                        multiValue: (provided) => ({
                            ...provided,
                            display: "inline-flex",
                            alignItems: "center",
                            backgroundColor: "white",
                            border: "1px solid gray",
                            borderRadius: "5px"
                        }),
                        multiValueRemove: (provided) => ({
                            ...provided,
                            display: "inline-flex",
                            alignItems: "center",
                        }),
                    }}
                    value={investStageRangeSelectedOptions}
                    options={investStageRangeOptions}
                    classNamePrefix="select"
                    className="basic-multi-select w-full text-start"
                    placeholder="Select a range"
                    name="investment_stage_range"
                    onChange={(selectedOptions) => {
                        if (selectedOptions && selectedOptions.length > 0) {
                            setInvestStageRangeSelectedOptions(selectedOptions);
                            clearErrors("investment_stage_range");
                            setValue(
                                "investment_stage_range",
                                selectedOptions
                                    .map((option) => option.value)
                                    .join(", "),
                                { shouldValidate: true }
                            );
                        } else {
                            setInvestStageRangeSelectedOptions([]);
                            setValue("investment_stage_range", "", {
                                shouldValidate: true,
                            });
                            setError("investment_stage_range", {
                                type: "required",
                                message: "Atleast one stage required",
                            });
                        }
                    }}
                />
                {errors.investment_stage_range && (
                    <p className="mt-1 text-sm text-red-500 font-bold text-left">
                        {errors.investment_stage_range.message}
                    </p>
                )}
        </div>
        ) : (
          <div className="flex justify-between items-center cursor-pointer p-1">
            <span>{getValues.investment_stage_range} </span>
          </div>
        )}
      </div>
      

            <div className="flex ">
            <button type='submit' className=" h-[#155EEF] bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 mb-2 flex items-center justify-center">
               Save
            </button>
            
            </div>
            </form>
    </div>

  );
};

export default InvestorDetail;

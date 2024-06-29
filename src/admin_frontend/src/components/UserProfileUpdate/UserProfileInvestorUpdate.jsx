import React, { useState, useEffect } from "react";
import "react-circular-progressbar/dist/styles.css";
import {
  place,
  telegramSVg,
  noDataPresentSvg,
  place1,
  websiteSvg,
  linkSvg,
} from "../Utils/AdminData/SvgData";
import { uint8ArrayToBase64 } from "../Utils/AdminData/saga_function/blobImageToUrl";
import { ThreeDots } from "react-loader-spinner";
import { useNavigate, useLocation } from "react-router-dom";
import openchat_username from "../../../assets/image/spinner.png";
import { linkedInSvg } from "../../../../IcpAccelerator_frontend/src/components/Utils/Data/SvgData";
import { twitterSvg } from "../../../../IcpAccelerator_frontend/src/components/Utils/Data/SvgData";
import { useForm, Controller } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useCountries } from "react-countries";
import ReactSelect from "react-select";
import CompressedImage from "../../../../IcpAccelerator_frontend/src/components/ImageCompressed/CompressedImage";
import { Principal } from "@dfinity/principal";

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
      .test("is-non-empty", "Country is required", (value) => /\S/.test(value))
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
      .test("fileType", "Only jpeg, jpg & png file format allowed", (value) => {
        return (
          !value ||
          (value &&
            ["image/jpeg", "image/jpg", "image/png"].includes(value.type))
        );
      }),
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
      .test("is-non-empty", "LinkedIn URL is required", (value) =>
        /\S/.test(value)
      )
      .matches(
        /^(https?:\/\/)?(www\.)?linkedin\.com\/(in\/[a-zA-Z0-9_-]+|company\/[a-zA-Z0-9_-]+|groups\/[a-zA-Z0-9_-]+)\/?$/,
        "Invalid LinkedIn URL"
      )
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

const UserProfileInvestorUpdate = () => {
  const actor = useSelector((currState) => currState.actors.actor);

  const [orignalData, setOrignalData] = useState(null);
  const [updatedData, setUpdatedData] = useState(null);
  const [isSkillsOpen, setIsSkillsOpen] = useState(false);
  const [isReasonToJoinOpen, setIsReasonToJoinOpen] = useState(false);
  const [principal, setPrincipal] = useState("");
  const { countries } = useCountries();
  const dispatch = useDispatch();
  const areaOfExpertise = useSelector(
    (currState) => currState.expertise.expertise
  );
  const typeOfProfile = useSelector(
    (currState) => currState.profileTypes.profiles
  );
  const getAllIcpHubs = useSelector((currState) => currState.hubs.allHubs);
  const multiChainNames = useSelector((currState) => currState.chains.chains);

  // const userCurrentRoleStatusActiveRole = useSelector(
  //   (currState) => currState.currentRoleStatus.activeRole
  // );
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
  const [showOriginalProfile, setShowOriginalProfile] = useState(true);
  const [showOriginalBio, setshowOriginalBio] = useState(true);
  //   const notificationDetails = location.state;

  //   console.log("userData in investor profile", originalInfo);
  // console.log("Allrole in investor profile", Allrole);
  const location = useLocation();
  console.log("loca", location);
  const investorId = location?.state;
  const {
    register,
    handleSubmit,
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
  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        if (!investorId) {
          console.error("investorId is not defined");
          return;
        }
        const covertedPrincipal = await Principal.fromText(investorId);
        if (!actor || typeof actor.get_vc_info_using_principal !== "function") {
          console.error(
            "caller is not defined or does not have the method 'get_vc_info_using_principal'"
          );
          return;
        }
        // let data = await actor.vc_profile_edit_awaiting_approval();
        let data = await actor.get_vc_info_using_principal(covertedPrincipal);
        console.log("Received data in investor update:", data);

        const originalInfo = data[0]?.profile;
        const updatedInfo = data[0]?.profile;
        // const approveAt = data[0][1].approved_at;
        // const rejectAt = data[0][1].rejected_at;
        // const sentAt = data[0][1].sent_at;
        // const principalId = data[0][0];
        setPrincipal(investorId);

        if (
          data &&
          data.length > 0
          // &&
          // data[0].length > 1 &&
          // data[0][1].original_info
        ) {
          setOrignalData({
            announcementDetails: originalInfo?.announcement_details?.[0],
            assetsUnderManagement: originalInfo?.assets_under_management?.[0],
            averageCheckSize: originalInfo?.average_check_size,
            categoryOfInvestment: originalInfo?.category_of_investment,
            exisitngIcpInvestor: originalInfo?.existing_icp_investor,
            exisitngIcpPortfolio: originalInfo?.existing_icp_portfolio?.[0],
            preferredIcpHub: originalInfo?.preferred_icp_hub,
            fundSize: originalInfo?.fund_size?.[0],
            investorType: originalInfo?.investor_type?.[0],
            logo:
              originalInfo?.logo?.[0].length > 0
                ? uint8ArrayToBase64(originalInfo?.logo[0])
                : null,
            linkedIn: originalInfo?.linkedin_link,
            moneyInvested: originalInfo?.money_invested?.[0],
            nameOfFund: originalInfo?.name_of_fund,
            numberOfPortfolioCompanies:
              originalInfo?.number_of_portfolio_companies,
            portfolio: originalInfo?.portfolio_link,
            profilePicture:
              originalInfo?.user_data?.profile_picture?.[0].length > 0
                ? uint8ArrayToBase64(
                    originalInfo?.user_data?.profile_picture[0]
                  )
                : null,
            multichain: originalInfo?.project_on_multichain?.[0],
            checkSize: originalInfo?.range_of_check_size?.[0],
            reasonForJoining: originalInfo?.reason_for_joining?.[0],
            registered: originalInfo?.registered,
            registeredCountry: originalInfo?.registered_country?.[0],
            registeredUnderAnyHub: originalInfo?.registered_under_any_hub?.[0],
            stage: originalInfo?.stage?.[0],
            typeOfInvestment: originalInfo?.type_of_investment,
            website: originalInfo?.website_link?.[0],
            areaOfInterest: originalInfo?.user_data?.area_of_interest,
            bio: originalInfo?.user_data?.bio?.[0],
            country: originalInfo?.user_data?.country,
            email: originalInfo?.user_data?.email?.[0],
            fullName: originalInfo?.user_data?.full_name,
            openchatUsername: originalInfo?.user_data?.openchat_username?.[0],
            reasonToJoin: originalInfo?.user_data?.reason_to_join?.[0],
            telegram: originalInfo?.user_data?.telegram_id?.[0],
            twitter: originalInfo?.user_data?.twitter_id?.[0],
            typeOfProfile: originalInfo?.user_data?.type_of_profile?.[0],
          });

          setUpdatedData({
            announcementDetails: updatedInfo?.announcement_details?.[0],
            assetsUnderManagement: updatedInfo?.assets_under_management?.[0],
            fundSize: updatedInfo?.fund_size?.[0],
            investorType: updatedInfo?.investor_type?.[0],
            logo:
              updatedInfo?.logo?.[0].length > 0
                ? uint8ArrayToBase64(updatedInfo?.logo[0])
                : null,
            averageCheckSize: updatedInfo?.average_check_size,
            categoryOfInvestment: updatedInfo?.category_of_investment,
            exisitngIcpInvestor: updatedInfo?.existing_icp_investor,
            exisitngIcpPortfolio: updatedInfo?.existing_icp_portfolio?.[0],
            reasonForJoining: updatedInfo?.reason_for_joining?.[0],
            typeOfInvestment: updatedInfo?.type_of_investment,
            typeOfProfile: updatedInfo?.user_data?.type_of_profile?.[0],

            preferredIcpHub: updatedInfo?.preferred_icp_hub,
            linkedIn: updatedInfo?.linkedin_link,
            moneyInvested: updatedInfo?.money_invested?.[0],
            nameOfFund: updatedInfo?.name_of_fund,
            numberOfPortfolioCompanies:
              updatedInfo?.number_of_portfolio_companies,
            portfolio: updatedInfo?.portfolio_link,
            profilePicture:
              updatedInfo?.user_data?.profile_picture?.[0].length > 0
                ? uint8ArrayToBase64(updatedInfo?.user_data?.profile_picture[0])
                : null,
            multichain: updatedInfo?.project_on_multichain?.[0],
            checkSize: updatedInfo?.range_of_check_size?.[0],
            registered: updatedInfo?.registered,
            registeredCountry: updatedInfo?.registered_country?.[0],
            registeredUnderAnyHub: updatedInfo?.registered_under_any_hub?.[0],
            stage: updatedInfo?.stage?.[0],
            website: updatedInfo?.website_link?.[0],
            areaOfInterest: updatedInfo?.user_data?.area_of_interest,
            bio: updatedInfo?.user_data?.bio?.[0],
            country: updatedInfo?.user_data?.country,
            email: updatedInfo?.user_data?.email?.[0],
            fullName: updatedInfo?.user_data?.full_name,
            openchatUsername: updatedInfo?.user_data?.openchat_username?.[0],
            reasonToJoin: updatedInfo?.user_data?.reason_to_join?.[0],
            telegram: updatedInfo?.user_data?.telegram_id?.[0],
            twitter: updatedInfo?.user_data?.twitter_id?.[0],
          });
        } else {
          console.error("Unexpected data structure:", data);
          setOrignalData({});
          setUpdatedData({});
        }
      } catch (error) {
        console.error("Error fetching project data:", error);
      }
    };

    if (actor) {
      fetchProjectData();
    }
  }, [actor]);

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
      val && val.length > 0
        ? val.map((reason) => ({ value: reason, label: reason }))
        : ""
    );
  };
  // default Interest set function
  const setTypeOfInvestSelectedOptionsHandler = (val) => {
    setTypeOfInvestSelectedOptions(
      val && val.length > 0
        ? val
            ?.split(", ")
            .map((interest) => ({ value: interest, label: interest }))
        : []
    );
  };
  const setInvestedInMultiChainSelectedOptionsHandler = (val) => {
    setInvestedInMultiChainSelectedOptions(
      val
        ? val?.split(", ").map((chain) => ({ value: chain, label: chain }))
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
        ? val
            ?.split(", ")
            .map((investment) => ({ value: investment, label: investment }))
        : []
    );
  };

  // default investment stage range set function
  const setInvestStageRangeSelectedOptionsHandler = (val) => {
    setInvestStageRangeSelectedOptions(
      val
        ? val
            ?.split(", ")
            .map((investment) => ({ value: investment, label: investment }))
        : []
    );
  };

  // set investor values handler
  const setInvestorValuesHandler = (val) => {
    console.log("val==========>>>>>>>>>>>>>>>", val);
    if (val) {
      setValue("full_name", val?.fullName ?? "");
      setValue("email", val?.email ?? "");
      setValue("telegram_id", val?.telegram ?? "");
      setValue("twitter_url", val?.twitter ?? "");
      setValue("openchat_user_name", val?.openchatUsername ?? "");
      setValue("bio", val?.bio ?? "");
      setValue("country", val?.country ?? "");
      setValue("domains_interested_in", val?.areaOfInterest ?? "");
      setInterestedDomainsSelectedOptionsHandler(val?.areaOfInterest ?? null);
      // setImagePreview(val?.user_data?.profile_picture?.[0] ?? "");
      setImagePreview(
        val?.profilePicture instanceof Uint8Array
          ? uint8ArrayToBase64(val?.profilePicture)
          : ""
      );
      setValue("type_of_profile", val?.typeOfProfile);
      setValue(
        "reasons_to_join_platform",
        val?.reasonToJoin ? val?.reasonToJoin.join(", ") : ""
      );
      setReasonOfJoiningSelectedOptionsHandler(val?.reasonToJoin);
      setValue("area_of_expertise", val?.areaOfInterest ?? "");
      setValue("investor_registered", val?.registered ?? "");
      if (val?.registered === true) {
        setValue("investor_registered", "true");
      } else {
        setValue("investor_registered", "false");
      }
      setValue("registered_country", val?.registeredCountry ?? "");
      setValue(
        "preferred_icp_hub",
        val?.preferredIcpHub ? val?.preferredIcpHub : ""
      );
      setValue("existing_icp_investor", val?.exisitngIcpInvestor ?? "");
      if (val?.exisitngIcpInvestor === true) {
        setValue("existing_icp_investor", "true");
      } else {
        setValue("existing_icp_investor", "false");
      }
      setValue("investment_type", val?.investorType ?? "");
      setTypeOfInvestSelectedOptionsHandler(val?.investorType);
      setValue("investor_portfolio_link", val?.portfolio ?? "");
      setValue("investor_fund_name", val?.nameOfFund ?? "");
      setValue("investor_fund_size", val?.fundSize ?? "");
      if (val?.multichain) {
        setValue("invested_in_multi_chain", "true");
      } else {
        setValue("invested_in_multi_chain", "false");
      }
      setValue("invested_in_multi_chain_names", val?.multichain ?? "");
      setInvestedInMultiChainSelectedOptionsHandler(val?.multichain);
      setValue("investment_categories", val?.categoryOfInvestment ?? "");
      setInvestmentCategoriesSelectedOptionsHandler(val?.categoryOfInvestment);
      setValue("investor_website_url", val?.website ?? "");
      setValue("investor_linkedin_url", val?.linkedIn ?? "");
      setValue("investment_stage", val?.stage ?? "");
      setInvestStageSelectedOptionsHandler(val?.stage);
      setValue("investment_stage_range", val?.checkSize ?? "");
      setInvestStageRangeSelectedOptionsHandler(val?.checkSize);
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
    if (updatedData) {
      console.log("Investor full data ==>", updatedData);
      setInvestorValuesHandler(updatedData);
    } else {
      setInvestorValuesHandler("");
    }
  }, [updatedData]);

  // INVESTOR SIDE USEEFFECTS

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

  const handleSwitchEditMode = () => {
    setEditMode(true);
    setIsSkillsOpen(true);
    setIsReasonToJoinOpen(true);
    setShowOriginalProfile(false);
    setshowOriginalBio(false);
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
        await actor
          .update_vc_profile(principal, investorData)
          .then((result) => {
            if (
              result &&
              result.includes("Venture Capitalist profile updated successfully")
            ) {
              toast.success("Investor profile updated successfully");
              window.location.href = "/";
            } else {
              toast.error("something got wrong");
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
    toast.error("Empty fields or invalid values, please recheck the form");
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmitHandler, onErrorHandler)}>
        <div className="w-full flex flex-col px-[4%] py-[4%]">
          <div className="flex sm:flex-row justify-between  mb-4 sxxs:flex-col">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-black to-gray-800 text-transparent bg-clip-text">
              Investor Profile
            </h1>
            <div className="flex text-white text-sm flex-row font-semibold h-auto items-center bg-customBlue rounded-lg p-3 justify-around">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className="size-4"
                fill="currentColor"
                onClick={handleSwitchEditMode}
              >
                <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z" />
              </svg>
            </div>
          </div>
          <div className="w-full flex gap-4 sxxs:flex-col sm:flex-row">
            <div className=" bg-[#D2D5F2]  shadow-md shadow-gray-400 p-6 rounded-lg md:w-1/4 sxxs:w-full">
              <div className="div">
                {showOriginalProfile ? (
                  <div className="justify-center flex items-center">
                    <div
                      className="size-fit  rounded-full bg-no-repeat bg-center bg-cover relative p-1 bg-blend-overlay border-2 border-gray-300"
                      style={{
                        backgroundImage: `url(${orignalData?.profilePicture}), linear-gradient(168deg, rgba(255, 255, 255, 0.25) -0.86%, rgba(255, 255, 255, 0) 103.57%)`,
                        backdropFilter: "blur(20px)",
                      }}
                    >
                      {console.log("imagePreview 1320 ===>>>>s", imagePreview)}
                      <img
                        className="object-cover size-44 max-h-44 rounded-full"
                        src={orignalData?.profilePicture}
                        alt=""
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    {editMode ? (
                      <div className="flex flex-col">
                        <div className="flex-col w-full flex justify-start gap-4 items-center">
                          <div className=" size-28 rounded-full border-2 border-gray-300 flex items-center justify-center overflow-hidden">
                            {imagePreview && !errors.image ? (
                              <img
                                src={imagePreview}
                                alt="Profile"
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
                          </div>

                          <Controller
                            name="image"
                            control={control}
                            render={({ field }) => (
                              <>
                                <input
                                  type="file"
                                  className="hidden"
                                  id="image"
                                  name="image"
                                  onChange={(e) => {
                                    field.onChange(e.target.files[0]);
                                    imageCreationFunc(e.target.files[0]);
                                  }}
                                  accept=".jpg, .jpeg, .png"
                                />
                                <div className="flex">
                                  {console.log(
                                    "imagePreview 1373 ===>>>>s",
                                    imagePreview
                                  )}
                                  {imagePreview && !errors.image ? (
                                    <label
                                      htmlFor="image"
                                      className="p-2 border-2 border-blue-800 items-center rounded-md text-xs bg-transparent text-blue-800 cursor-pointer font-semibold flex"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 448 512"
                                        className="size-4"
                                        fill="currentColor"
                                        style={{ transform: "rotate(135deg)" }}
                                      >
                                        <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
                                      </svg>
                                      <span className="ml-2">
                                        Change profile picture
                                      </span>
                                    </label>
                                  ) : (
                                    <label
                                      htmlFor="image"
                                      className="p-2 border-2 border-blue-800 items-center rounded-md text-xs bg-transparent text-blue-800 cursor-pointer font-semibold flex"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 512 512"
                                        className="size-4"
                                        fill="currentColor"
                                      >
                                        <path d="M288 109.3V352c0 17.7-14.3 32-32 32s-32-14.3-32-32V109.3l-73.4 73.4c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l128-128c12.5-12.5 32.8-12.5 45.3 0l128 128c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L288 109.3zM64 352H192c0 35.3 28.7 64 64 64s64-28.7 64-64H448c35.3 0 64 28.7 64 64v32c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V416c0-35.3 28.7-64 64-64zM432 456a24 24 0 1 0 0-48 24 24 0 1 0 0 48z" />
                                      </svg>
                                      <span className="ml-2">
                                        Upload profile picture
                                      </span>
                                    </label>
                                  )}
                                  {imagePreview || errors.image ? (
                                    <button
                                      className=" ml-2 p-2 border-2 border-red-500 items-center rounded-md text-xs bg-transparent text-red-500 cursor-pointer font-semibold capitalize"
                                      onClick={() => clearImageFunc("image")}
                                    >
                                      clear
                                    </button>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              </>
                            )}
                          />
                        </div>
                        {errors.image && (
                          <span className="mt-1 text-sm text-red-500 font-bold text-start px-4">
                            {errors?.image?.message}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="justify-center flex items-center">
                        <div
                          className="size-fit  rounded-full bg-no-repeat bg-center bg-cover relative p-1 bg-blend-overlay border-2 border-gray-300"
                          style={{
                            backgroundImage: `url(${updatedData?.profilePicture}), linear-gradient(168deg, rgba(255, 255, 255, 0.25) -0.86%, rgba(255, 255, 255, 0) 103.57%)`,
                            backdropFilter: "blur(20px)",
                          }}
                        >
                          <img
                            className="object-cover size-44 max-h-44 rounded-full"
                            src={updatedData?.profilePicture}
                            alt=""
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <div className="flex justify-center p-2 gap-2">
                  <span
                    className="w-2 h-2 bg-red-700 rounded-full"
                    onClick={() => setShowOriginalProfile(true)}
                  ></span>
                  <span
                    className="w-2 h-2 bg-green-700 rounded-full"
                    onClick={() => setShowOriginalProfile(false)}
                  ></span>
                </div>
              </div>

              <div className="flex flex-col ml-4  mt-2 w-auto justify-start md:mb-0 mb-6">
                <div className="flex flex-col mb-2">
                  <div className="flex space-x-2 items-center flex-row">
                    <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                    <h1 className="md:text-3xl text-xl md:font-extrabold font-bold  bg-black text-transparent bg-clip-text">
                      {orignalData?.fullName}
                    </h1>
                  </div>
                  <div className="flex space-x-2 items-center flex-row mt-1">
                    <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                    {editMode ? (
                      <div className="flex flex-col mb-3">
                        <input
                          type="text"
                          {...register("full_name")}
                          className={`bg-gray-50 border-2 
                                              ${
                                                errors?.full_name
                                                  ? "border-red-500"
                                                  : "border-[#737373]"
                                              } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1`}
                          placeholder="Enter your full name"
                        />
                        {errors?.full_name && (
                          <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                            {errors?.full_name?.message}
                          </span>
                        )}
                      </div>
                    ) : (
                      <h1 className="md:text-3xl text-xl md:font-extrabold font-bold  bg-black text-transparent bg-clip-text">
                        {updatedData?.fullName}
                      </h1>
                    )}
                  </div>
                </div>
                <div className="text-gray-500 md:text-md text-sm font-normal flex mb-2">
                  <div className="flex flex-col mb-2">
                    <div className="flex space-x-2 items-center flex-row">
                      <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        className="size-4 "
                        fill="currentColor"
                      >
                        <path d="M256 64C150 64 64 150 64 256s86 192 192 192c17.7 0 32 14.3 32 32s-14.3 32-32 32C114.6 512 0 397.4 0 256S114.6 0 256 0S512 114.6 512 256v32c0 53-43 96-96 96c-29.3 0-55.6-13.2-73.2-33.9C320 371.1 289.5 384 256 384c-70.7 0-128-57.3-128-128s57.3-128 128-128c27.9 0 53.7 8.9 74.7 24.1c5.7-5 13.1-8.1 21.3-8.1c17.7 0 32 14.3 32 32v80 32c0 17.7 14.3 32 32 32s32-14.3 32-32V256c0-106-86-192-192-192zm64 192a64 64 0 1 0 -128 0 64 64 0 1 0 128 0z" />
                      </svg>
                      <span className="ml-2 truncate">
                        {orignalData?.email}
                      </span>
                    </div>
                    <div className="flex space-x-2 items-center flex-row mt-1">
                      <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                      {editMode ? (
                        <div className="flex flex-col mt-1">
                          <input
                            type="email"
                            {...register("email")}
                            className={`bg-gray-50 border-2 
                                              ${
                                                errors?.email
                                                  ? "border-red-500"
                                                  : "border-[#737373]"
                                              } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1`}
                            placeholder="Enter your email"
                          />
                          {errors?.email && (
                            <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                              {errors?.email?.message}
                            </span>
                          )}
                        </div>
                      ) : (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512"
                            className="size-4 "
                            fill="currentColor"
                          >
                            <path d="M256 64C150 64 64 150 64 256s86 192 192 192c17.7 0 32 14.3 32 32s-14.3 32-32 32C114.6 512 0 397.4 0 256S114.6 0 256 0S512 114.6 512 256v32c0 53-43 96-96 96c-29.3 0-55.6-13.2-73.2-33.9C320 371.1 289.5 384 256 384c-70.7 0-128-57.3-128-128s57.3-128 128-128c27.9 0 53.7 8.9 74.7 24.1c5.7-5 13.1-8.1 21.3-8.1c17.7 0 32 14.3 32 32v80 32c0 17.7 14.3 32 32 32s32-14.3 32-32V256c0-106-86-192-192-192zm64 192a64 64 0 1 0 -128 0 64 64 0 1 0 128 0z" />
                          </svg>
                          <span className="ml-2 truncate">
                            {updatedData?.email}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-start gap-3 text-sm">
                  <div className="flex flex-col mb-2">
                    <div className="flex flex-row  text-gray-600 space-x-2 items-center">
                      <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                      {place}
                      <div className="underline ">{orignalData?.country}</div>
                    </div>
                    <div className="flex space-x-2 items-center flex-row text-gray-600">
                      <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                      {editMode ? (
                        <div className="flex flex-col mt-1">
                          <select
                            {...register("country")}
                            className={`bg-gray-50 border-2 ${
                              errors.country
                                ? "border-red-500 "
                                : "border-[#737373]"
                            } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1`}
                          >
                            <option className="text-sm font-bold" value="">
                              Select your country
                            </option>
                            {countries?.map((expert) => (
                              <option
                                key={expert.name}
                                value={expert.name}
                                className="text-sm font-bold "
                              >
                                {expert.name}
                              </option>
                            ))}
                          </select>

                          {errors?.country && (
                            <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                              {errors?.country?.message}
                            </span>
                          )}
                        </div>
                      ) : (
                        <>
                          {place}
                          <div className="underline ">
                            {updatedData?.country}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col mb-2">
                    <div className="flex flex-row  text-gray-600 space-x-2 items-center">
                      <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                      <img
                        src={openchat_username}
                        alt="openchat_username"
                        className="size-5"
                      />
                      <div className="ml-2">
                        {orignalData?.openchatUsername}
                      </div>
                    </div>
                    <div className="flex space-x-2 items-center flex-row text-gray-600 mt-1">
                      <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                      {editMode ? (
                        <div className="flex flex-col mt-1">
                          <input
                            type="text"
                            {...register("openchat_user_name")}
                            className={`bg-gray-50 border-2 
                                              ${
                                                errors?.openchat_user_name
                                                  ? "border-red-500 "
                                                  : "border-[#737373]"
                                              } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1`}
                            placeholder="Enter openchat username"
                          />
                          {errors?.openchat_user_name && (
                            <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                              {errors?.openchat_user_name?.message}
                            </span>
                          )}
                        </div>
                      ) : (
                        <>
                          <img
                            src={openchat_username}
                            alt="openchat_username"
                            className="size-5"
                          />
                          <div className="ml-2">
                            {updatedData?.openchatUsername}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className=" flex flex-col w-full text-gray-600">
                    <div className="flex flex-row justify-between items-center">
                      <p className="text-black font-semibold mb-1">Skill :</p>
                      <button
                        onClick={() => setIsSkillsOpen(!isSkillsOpen)}
                        className="flex items-center gap-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="size-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          {isSkillsOpen ? (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 15l7-7 7 7"
                            />
                          ) : (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 9l-7 7-7-7"
                            />
                          )}
                        </svg>
                      </button>
                    </div>

                    {isSkillsOpen && (
                      <div className="flex flex-col text-gray-600">
                        <div className="flex gap-2 text-xs flex-wrap items-center">
                          <span className="inline-block w-1.5 p-0.5 h-1.5 bg-red-700 rounded-full"></span>
                          {orignalData?.areaOfInterest
                            .split(",")
                            .slice(0, 3)
                            .map((tag, index) => (
                              <div
                                key={index}
                                className="text-xs border-2 rounded-2xl px-2 py-1 font-bold bg-[#c9c5c5]"
                              >
                                {tag.trim()}
                              </div>
                            ))}
                        </div>
                        <div className="flex space-x-2 items-center flex-row text-gray-600 mt-1">
                          <div className="flex flex-row  text-gray-600 space-x-2 items-center">
                            {editMode ? (
                              <div className="flex flex-row mt-1 items-center">
                                <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                                <div className="flex flex-col w-11/12">
                                  <ReactSelect
                                    isMulti
                                    menuPortalTarget={document.body}
                                    menuPosition={"fixed"}
                                    styles={{
                                      menuPortal: (base) => ({
                                        ...base,
                                        zIndex: 9999,
                                      }),
                                      control: (provided, state) => ({
                                        ...provided,
                                        paddingBlock: "0px",
                                        borderRadius: "8px",
                                        border: errors.domains_interested_in
                                          ? "2px solid #ef4444"
                                          : "2px solid #737373",
                                        backgroundColor: "rgb(249 250 251)",
                                        "&::placeholder": {
                                          color: errors.domains_interested_in
                                            ? "#ef4444"
                                            : "currentColor",
                                        },
                                      }),
                                    }}
                                    value={interestedDomainsSelectedOptions}
                                    options={interestedDomainsOptions}
                                    classNamePrefix="select"
                                    className="basic-multi-select w-full text-start text-nowrap p-1 text-sm"
                                    placeholder="Select domains you are interested in"
                                    name="domains_interested_in"
                                    onChange={(selectedOptions) => {
                                      if (
                                        selectedOptions &&
                                        selectedOptions.length > 0
                                      ) {
                                        setInterestedDomainsSelectedOptions(
                                          selectedOptions
                                        );
                                        clearErrors("domains_interested_in");
                                        setValue(
                                          "domains_interested_in",
                                          selectedOptions
                                            .map((option) => option.value)
                                            .join(", "),
                                          { shouldValidate: true }
                                        );
                                      } else {
                                        setInterestedDomainsSelectedOptions([]);
                                        setValue("domains_interested_in", "", {
                                          shouldValidate: true,
                                        });
                                        setError("domains_interested_in", {
                                          type: "required",
                                          message:
                                            "Selecting an interest is required",
                                        });
                                      }
                                    }}
                                  />
                                  {errors.domains_interested_in && (
                                    <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                                      {errors.domains_interested_in.message}
                                    </span>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div className="flex flex-col space-x-2 text-gray-600">
                                <div className="flex flex-row  text-gray-600 space-x-2 items-center">
                                  <span className="w-2 h-2 bg-green-700 rounded-full"></span>

                                  <div className="flex gap-2 text-xs items-center flex-wrap">
                                    {updatedData?.areaOfInterest &&
                                      updatedData?.areaOfInterest
                                        .split(",")
                                        .slice(0, 3)
                                        .map((tag, index) => (
                                          <div
                                            key={index}
                                            className="text-xs border-2 rounded-2xl px-2 py-1 font-bold bg-[#c9c5c5]"
                                          >
                                            {tag.trim()}
                                          </div>
                                        ))}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col w-full text-gray-600">
                    <div className="flex flex-row justify-between items-center">
                      <p className="text-black font-semibold mb-1">
                        Reason to join:
                      </p>
                      <button
                        onClick={() =>
                          setIsReasonToJoinOpen(!isReasonToJoinOpen)
                        }
                        className="flex items-center gap-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="size-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          {isReasonToJoinOpen ? (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 15l7-7 7 7"
                            />
                          ) : (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 9l-7 7-7-7"
                            />
                          )}
                        </svg>
                      </button>
                    </div>

                    {isReasonToJoinOpen && (
                      <div className="flex flex-col text-gray-600">
                        <div className="flex gap-2 text-xs flex-wrap items-center">
                          <span className="inline-block w-1.5 p-0.5 h-1.5 bg-red-700 rounded-full"></span>
                          {orignalData?.reasonToJoin.map((reason, index) => (
                            <p
                              key={index}
                              className="text-xs border-2 rounded-2xl px-2 py-1 font-bold bg-[#c9c5c5]"
                            >
                              {reason.replace(/_/g, " ")}
                            </p>
                          ))}
                        </div>

                        <div className="flex space-x-2 items-center flex-row text-gray-600 mt-1">
                          <div className="flex flex-row  text-gray-600 space-x-2 items-center">
                            {editMode ? (
                              <div className="flex flex-row mt-1 items-center">
                                <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                                <div className="flex flex-col">
                                  <ReactSelect
                                    isMulti
                                    menuPortalTarget={document.body}
                                    menuPosition={"fixed"}
                                    styles={{
                                      menuPortal: (base) => ({
                                        ...base,
                                        zIndex: 9999,
                                      }),
                                      control: (provided, state) => ({
                                        ...provided,
                                        paddingBlock: "0px",
                                        borderRadius: "8px",
                                        border: errors.reasons_to_join_platform
                                          ? "2px solid #ef4444"
                                          : "2px solid #737373",
                                        backgroundColor: "rgb(249 250 251)",
                                        "&::placeholder": {
                                          color: errors.reasons_to_join_platform
                                            ? "#ef4444"
                                            : "currentColor",
                                        },
                                      }),
                                    }}
                                    value={reasonOfJoiningSelectedOptions}
                                    options={reasonOfJoiningOptions}
                                    classNamePrefix="select"
                                    className="basic-multi-select w-full text-start text-nowrap p-1 text-xs"
                                    placeholder="Select your reasons to join this platform"
                                    name="reasons_to_join_platform"
                                    onChange={(selectedOptions) => {
                                      if (
                                        selectedOptions &&
                                        selectedOptions.length > 0
                                      ) {
                                        setReasonOfJoiningSelectedOptions(
                                          selectedOptions
                                        );
                                        clearErrors("reasons_to_join_platform");
                                        setValue(
                                          "reasons_to_join_platform",
                                          selectedOptions
                                            .map((option) => option.value)
                                            .join(", "),
                                          { shouldValidate: true }
                                        );
                                      } else {
                                        setReasonOfJoiningSelectedOptions([]);
                                        setValue(
                                          "reasons_to_join_platform",
                                          "",
                                          {
                                            shouldValidate: true,
                                          }
                                        );
                                        setError("reasons_to_join_platform", {
                                          type: "required",
                                          message:
                                            "Selecting a reason is required",
                                        });
                                      }
                                    }}
                                  />
                                  {errors.reasons_to_join_platform && (
                                    <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                                      {errors.reasons_to_join_platform.message}
                                    </span>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div className="flex flex-col space-x-2 text-gray-600">
                                <div className="flex flex-row  text-gray-600 space-x-2 items-center">
                                  <span className="w-2 h-2 bg-green-700 rounded-full"></span>

                                  <div className="flex text-gray-700 flex-row gap-2 flex-wrap text-xs">
                                    {updatedData?.reasonToJoin?.map(
                                      (reason, index) => (
                                        <div
                                          key={index}
                                          className="text-xs border-2 rounded-2xl px-2 py-1 font-bold bg-[#c9c5c5]"
                                        >
                                          {reason.replace(/_/g, " ")}
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className=" bg-[#D2D5F2] shadow-md shadow-gray-400 p-6 rounded-lg md:w-[74%] sxxs:w-full">
              <div className="w-full flex flex-row justify-between items-center">
                <h1 className="md:text-lg text-sm font-bold text-gray-800 truncate">
                  About mentor
                </h1>
                <div className="flex justify-center p-2 gap-2">
                  <span
                    className="w-2 h-2 bg-red-700 rounded-full"
                    onClick={() => setshowOriginalBio(true)}
                  ></span>
                  <span
                    className="w-2 h-2 bg-green-700 rounded-full"
                    onClick={() => setshowOriginalBio(false)}
                  ></span>
                </div>
              </div>
              {showOriginalBio ? (
                <h1 className="md:text-base md:h-[8rem] h-[12rem] flex-wrap text-sm bg-black break-all text-transparent bg-clip-text">
                  {orignalData?.bio}
                </h1>
              ) : (
                <div className="w-full">
                  {editMode ? (
                    <div className="flex flex-col mt-1">
                      <textarea
                        {...register("bio")}
                        className={`bg-gray-50 border-2 ${
                          errors?.bio ? "border-red-500 " : "border-[#737373]"
                        } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1 h-32 resize-none`}
                        placeholder="Enter your bio"
                      ></textarea>
                      {errors?.bio && (
                        <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                          {errors?.bio?.message}
                        </span>
                      )}
                    </div>
                  ) : (
                    <h1 className="md:text-base md:h-[8rem] h-[12rem] flex-wrap text-sm bg-black break-all text-transparent bg-clip-text">
                      {updatedData?.bio}
                    </h1>
                  )}
                </div>
              )}
              <div className="pl-[4%]">
                <p className="w-full mb-4 border border-[#C5C5C5]"></p>
              </div>
              <div className="flex flex-col md:flex-row justify-between items-start gap-3 text-sm w-full md:px-[4%]">
                <div className="flex flex-col md:w-1/2 w-full">
                  <div className="flex flex-col mb-4 md:mb-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-2 sm:mb-0 mr-2">
                      Telegram :
                    </h2>
                    <div className="flex flex-grow items-center mt-1.5 truncate">
                      <span className="inline-block w-1.5  p-0.5 h-1.5 mr-2 bg-red-700 rounded-full"></span>

                      {orignalData?.telegram ? (
                        <div
                          onClick={() => {
                            const telegramUsername = orignalData?.telegram;
                            if (telegramUsername) {
                              const telegramUrl = `https://t.me/${telegramUsername}`;
                              window.open(telegramUrl, "_blank");
                            }
                          }}
                          className="cursor-pointer mr-2"
                        >
                          {telegramSVg}
                        </div>
                      ) : (
                        <div className="flex-shrink-0 pt-1 w-6 h-6 mr-2 ml-0.5">
                          {noDataPresentSvg}
                        </div>
                      )}

                      <p className="text-[#7283EA] text-xs md:text-sm truncate">
                        {orignalData?.telegram || "Not available"}
                      </p>
                    </div>
                    <div className="w-3/4">
                      {editMode ? (
                        <div className="flex flex-col mt-1">
                          <div className="flex items-center">
                            <span className="inline-block w-1.5  p-0.5 h-1.5 mr-2 bg-green-700 rounded-full"></span>
                            <input
                              type="text"
                              {...register("telegram_id")}
                              className={`bg-gray-50 border-2 
                                                ${
                                                  errors?.telegram_id
                                                    ? "border-red-500 "
                                                    : "border-[#737373]"
                                                } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1`}
                              placeholder="Enter your telegram id"
                            />
                          </div>
                          {errors?.telegram_id && (
                            <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                              {errors?.telegram_id?.message}
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-grow items-center mt-1.5 truncate">
                          <span className="inline-block w-1.5  p-0.5 h-1.5 mr-2 bg-green-700 rounded-full"></span>

                          {updatedData?.telegram ? (
                            <div
                              onClick={() => {
                                const telegramUsername = updatedData?.telegram;
                                if (telegramUsername) {
                                  const telegramUrl = `https://t.me/${telegramUsername}`;
                                  window.open(telegramUrl, "_blank");
                                }
                              }}
                              className="cursor-pointer mr-2"
                            >
                              {telegramSVg}
                            </div>
                          ) : (
                            <div className="flex-shrink-0 pt-1 w-6 h-6 mr-2 ml-0.5">
                              {noDataPresentSvg}
                            </div>
                          )}

                          <p className="text-[#7283EA] text-xs md:text-sm truncate">
                            {updatedData?.telegram ?? "Not available"}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col mb-4 md:mb-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-2 sm:mb-0 mr-2">
                      Twitter :
                    </h2>
                    <div className="flex flex-grow mt-1.5 truncate items-center">
                      <span className="inline-block w-1.5  p-0.5 h-1.5 mr-2 bg-red-700 rounded-full"></span>

                      {orignalData?.twitter ? (
                        <div
                          onClick={() => {
                            const url = orignalData?.twitter;
                            window.open(url, "_blank");
                          }}
                          className="cursor-pointer mr-2 ml-0.5"
                        >
                          {twitterSvg}
                        </div>
                      ) : (
                        <div className="flex-shrink-0 pt-1 w-6 h-6 mr-2 ml-0.5">
                          {noDataPresentSvg}
                        </div>
                      )}

                      <p className="text-[#7283EA] text-xs  md:text-sm truncate">
                        {orignalData?.twitter ?? "Not available"}
                      </p>
                    </div>

                    <div className="w-3/4">
                      {editMode ? (
                        <div className="flex flex-col mt-1">
                          <div className="flex items-center">
                            <span className="inline-block w-1.5  p-0.5 h-1.5 mr-2 bg-green-700 rounded-full"></span>
                            <input
                              type="text"
                              {...register("twitter_url")}
                              className={`bg-gray-50 border-2 
                                                ${
                                                  errors?.twitter_url
                                                    ? "border-red-500 "
                                                    : "border-[#737373]"
                                                } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1`}
                              placeholder="Enter your twitter url"
                            />
                          </div>
                          {errors?.twitter_url && (
                            <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                              {errors?.twitter_url?.message}
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-grow mt-1.5 truncate items-center">
                          <span className="inline-block w-1.5  p-0.5 h-1.5 mr-2 bg-green-700 rounded-full"></span>

                          {updatedData?.twitter ? (
                            <div
                              onClick={() => {
                                const url = updatedData?.twitter;
                                window.open(url, "_blank");
                              }}
                              className="cursor-pointer mr-2 ml-0.5"
                            >
                              {twitterSvg}
                            </div>
                          ) : (
                            <div className="flex-shrink-0 pt-1 w-6 h-6 mr-2 ml-0.5">
                              {noDataPresentSvg}
                            </div>
                          )}

                          <p className="text-[#7283EA] text-xs  md:text-sm truncate">
                            {updatedData?.twitter ?? "Not available"}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col mb-4 md:mb-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-2 sm:mb-0 mr-2">
                      Website :
                    </h2>
                    <div className="flex flex-grow mt-1.5 truncate items-center">
                      <span className="inline-block w-1.5   p-0.5 h-1.5 mr-2 bg-red-700 rounded-full"></span>

                      {orignalData?.website ? (
                        <div
                          onClick={() => {
                            const url = orignalData?.website;
                            window.open(url, "_blank");
                          }}
                          className="cursor-pointer mr-2"
                        >
                          {websiteSvg}
                        </div>
                      ) : (
                        <div className="flex-shrink-0 pt-1 w-6 h-6 mr-2 ml-0.5">
                          {noDataPresentSvg}
                        </div>
                      )}

                      <p className="text-[#7283EA] text-xs  md:text-sm truncate">
                        {orignalData?.website ?? "Not available"}
                      </p>
                    </div>
                    <div className="w-3/4">
                      {editMode ? (
                        <div className="flex flex-col mt-1">
                          <div className="flex items-center">
                            <span className="inline-block w-1.5  p-0.5 h-1.5 mr-2 bg-green-700 rounded-full"></span>
                            <input
                              type="text"
                              {...register("investor_website_url")}
                              className={`bg-gray-50 border-2 
                                                ${
                                                  errors?.investor_website_url
                                                    ? "border-red-500 "
                                                    : "border-[#737373]"
                                                } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1`}
                              placeholder="Enter your website url"
                            />
                            {errors?.investor_website_url && (
                              <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                                {errors?.investor_website_url?.message}
                              </span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-grow mt-1.5 truncate items-center">
                          <span className="inline-block w-1.5  p-0.5 h-1.5 mr-2 bg-green-700 rounded-full"></span>

                          {updatedData?.website ? (
                            <div
                              onClick={() => {
                                const url = updatedData?.website;
                                window.open(url, "_blank");
                              }}
                              className="cursor-pointer mr-2"
                            >
                              {websiteSvg}
                            </div>
                          ) : (
                            <div className="flex-shrink-0 pt-1 w-6 h-6 mr-2 ml-0.5">
                              {noDataPresentSvg}
                            </div>
                          )}

                          <p className="text-[#7283EA] text-xs  md:text-sm truncate">
                            {updatedData?.website ?? "Not available"}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:w-1/2 w-full">
                  <div className="flex flex-col mb-4 md:mb-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-2 sm:mb-0 mr-2">
                      LinkedIn :
                    </h2>
                    <div className="flex flex-grow mt-1.5 truncate items-center">
                      <span className="inline-block w-1.5  p-0.5 h-1.5 mr-2 bg-red-700 rounded-full"></span>

                      {orignalData?.linkedIn ? (
                        <div
                          onClick={() => {
                            const url = orignalData?.linkedIn;
                            window.open(url, "_blank");
                          }}
                          className="cursor-pointer mr-2"
                        >
                          {linkedInSvg}
                        </div>
                      ) : (
                        <div className="flex-shrink-0 pt-1 w-6 h-6 mr-2 ml-0.5">
                          {noDataPresentSvg}
                        </div>
                      )}

                      <p className="text-[#7283EA] text-xs  md:text-sm truncate">
                        {orignalData?.linkedIn ?? "Not available"}
                      </p>
                    </div>
                    <div className="w-3/4">
                      {editMode ? (
                        <div className="flex flex-col mt-1">
                          <div className="flex items-center">
                            <span className="inline-block w-1.5  p-0.5 h-1.5 mr-2 bg-green-700 rounded-full"></span>
                            <input
                              type="text"
                              {...register("investor_linkedin_url")}
                              className={`bg-gray-50 border-2 
                                                ${
                                                  errors?.investor_linkedin_url
                                                    ? "border-red-500"
                                                    : "border-[#737373]"
                                                } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1`}
                              placeholder="Enter your linkedin url"
                            />
                            {errors?.investor_linkedin_url && (
                              <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                                {errors?.investor_linkedin_url?.message}
                              </span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-grow mt-1.5 truncate items-center">
                          <span className="inline-block w-1.5  p-0.5 h-1.5 mr-2 bg-green-700 rounded-full"></span>

                          {updatedData?.linkedIn ? (
                            <div
                              onClick={() => {
                                const url = updatedData?.linkedIn;
                                window.open(url, "_blank");
                              }}
                              className="cursor-pointer mr-2"
                            >
                              {linkedInSvg}
                            </div>
                          ) : (
                            <div className="flex-shrink-0 pt-1 w-6 h-6 mr-2 ml-0.5">
                              {noDataPresentSvg}
                            </div>
                          )}

                          <p className="text-[#7283EA] text-xs  md:text-sm truncate">
                            {updatedData?.linkedIn ?? "Not available"}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col mb-4 md:mb-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-2 sm:mb-0 mr-2">
                      Portfoilo :
                    </h2>
                    <div className="flex flex-grow mt-1.5 truncate items-center">
                      <span className="inline-block w-1.5  p-0.5 h-1.5 mr-2 bg-red-700 rounded-full"></span>

                      {orignalData?.portfolio ? (
                        <div
                          onClick={() => {
                            const url = orignalData?.portfolio;
                            window.open(url, "_blank");
                          }}
                          className="cursor-pointer mr-2"
                        >
                          {linkSvg}
                        </div>
                      ) : (
                        <div className="flex-shrink-0 pt-1 w-6 h-6 mr-2 ml-0.5">
                          {noDataPresentSvg}
                        </div>
                      )}

                      <p className="text-[#7283EA] text-xs  md:text-sm truncate">
                        {orignalData?.portfolio ?? "Not available"}
                      </p>
                    </div>
                    <div className="w-3/4">
                      {editMode ? (
                        <div className="flex flex-col mt-1">
                          <div className="flex items-center">
                            <span className="inline-block w-1.5  p-0.5 h-1.5 mr-2 bg-green-700 rounded-full"></span>
                            <input
                              type="text"
                              {...register("investor_portfolio_link")}
                              className={`bg-gray-50 border-2 
                                                ${
                                                  errors?.investor_portfolio_link
                                                    ? "border-red-500 "
                                                    : "border-[#737373]"
                                                } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1`}
                              placeholder="Enter your portfolio url"
                            />
                            {errors?.investor_portfolio_link && (
                              <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                                {errors?.investor_portfolio_link?.message}
                              </span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-grow mt-1.5 truncate items-center">
                          <span className="inline-block w-1.5  p-0.5 h-1.5 mr-2 bg-green-700 rounded-full"></span>

                          {updatedData?.portfolio ? (
                            <div
                              onClick={() => {
                                const url = updatedData?.portfolio;
                                window.open(url, "_blank");
                              }}
                              className="cursor-pointer mr-2"
                            >
                              {linkSvg}
                            </div>
                          ) : (
                            <div className="flex-shrink-0 pt-1 w-6 h-6 mr-2 ml-0.5">
                              {noDataPresentSvg}
                            </div>
                          )}

                          <p className="text-[#7283EA] text-xs  md:text-sm truncate">
                            {updatedData?.portfolio ?? "Not available"}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full flex gap-4 sxxs:flex-col sm:flex-row mt-4">
            <div className="flex flex-col  w-full   md:w-[26%] sxxs:w-full"></div>
            <div className="flex flex-row justify-between bg-[#D2D5F2] shadow-md shadow-gray-400 p-6 rounded-lg md:w-3/4 sxxs:w-fulll">
              <ul className="grid grid-cols-2 gap-4 w-full px-[3%]">
                <li className="list-disc">
                  <div className="flex flex-col items-start justify-start sm:text-left text-base">
                    <p className="font-semibold text-gray-800 mb-2 sm:mb-0 mr-2">
                      Do you invest in multiple ecosystems ?
                    </p>
                    <div className="text-gray-600 flex flex-grow items-center truncate text-xs">
                      <span className="inline-block w-1.5 mr-2  p-0.5 h-1.5  bg-red-700 rounded-full"></span>

                      {orignalData?.multichain ? (
                        "Yes"
                      ) : "No" ? (
                        <span>{orignalData?.multichain ? "Yes" : "No"}</span>
                      ) : (
                        <span className="flex items-center">
                          {noDataPresentSvg}
                          No Data
                        </span>
                      )}
                    </div>
                    <div className="w-3/4">
                      {editMode ? (
                        <div className="flex flex-col mt-1">
                          <div className="flex items-center">
                            <span className="inline-block w-1.5 mr-2  p-0.5 h-1.5  bg-green-700 rounded-full"></span>
                            <select
                              {...register("invested_in_multi_chain")}
                              className={`bg-gray-50 border-2 ${
                                errors.invested_in_multi_chain
                                  ? "border-red-500"
                                  : "border-[#737373]"
                              } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1`}
                            >
                              <option
                                className="text-lg font-bold"
                                value="false"
                              >
                                No
                              </option>
                              <option
                                className="text-lg font-bold"
                                value="true"
                              >
                                Yes
                              </option>
                            </select>
                          </div>
                          {errors.invested_in_multi_chain && (
                            <p className="mt-1 text-sm text-red-500 font-bold text-left">
                              {errors.invested_in_multi_chain.message}
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="text-gray-600 flex flex-grow items-center mt-1 truncate text-xs">
                          <span className="inline-block w-1.5 mr-2  p-0.5 h-1.5  bg-green-700 rounded-full"></span>

                          {updatedData?.multichain ? (
                            "Yes"
                          ) : "No" ? (
                            <span>
                              {updatedData?.multichain ? "Yes" : "No"}
                            </span>
                          ) : (
                            <span className="flex items-center">
                              {noDataPresentSvg}
                              No Data
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </li>
                <li className="list-disc">
                  {orignalData?.multichain && (
                    <p className="text-gray-800 font-semibold text-base ">
                      Multichain :
                    </p>
                  )}
                  <div className="flex gap-2 mt-1 text-xs text-gray-600 items-center flex-wrap">
                    <span className="inline-block w-1.5 mr-2 p-0.5 h-1.5 bg-red-700 rounded-full"></span>
                    {orignalData?.multichain &&
                    orignalData.multichain !== "" ? (
                      orignalData.multichain
                        .split(",")
                        .slice(0, 3)
                        .map((tag, index) => (
                          <div
                            key={index}
                            className="text-xs border-2 rounded-2xl px-2 py-1 font-bold bg-[#c9c5c5]"
                          >
                            {tag.trim()}
                          </div>
                        ))
                    ) : (
                      <div className="flex items-center">
                        {noDataPresentSvg}
                        <span className="ml-2 text-xs">No Data</span>
                      </div>
                    )}
                  </div>
                  <div className="w-3/4">
                    {editMode && watch("invested_in_multi_chain") === "true" ? (
                      <div className="flex flex-col mt-1">
                        <div className="flex items-center">
                          <span className="inline-block w-1.5 mr-2 p-0.5 h-1.5 bg-green-700 rounded-full"></span>
                          <ReactSelect
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
                              }),
                            }}
                            value={investedInMultiChainSelectedOptions}
                            options={investedInmultiChainOptions}
                            classNamePrefix="select"
                            className="basic-multi-select w-full text-start text-xs text-nowrap"
                            placeholder="Select a chain"
                            name="invested_in_multi_chain_names"
                            onChange={(selectedOptions) => {
                              if (
                                selectedOptions &&
                                selectedOptions.length > 0
                              ) {
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
                        </div>
                        {errors.invested_in_multi_chain_names && (
                          <p className="mt-1 text-sm text-red-500 font-bold text-left">
                            {errors.invested_in_multi_chain_names.message}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="flex gap-2 mt-1 text-xs text-gray-600 items-center flex-wrap">
                        <span className="inline-block w-1.5 mr-2 p-0.5 h-1.5 bg-green-700 rounded-full"></span>
                        {updatedData?.multichain &&
                        updatedData.multichain !== "" ? (
                          updatedData.multichain
                            .split(",")
                            .slice(0, 3)
                            .map((tag, index) => (
                              <div
                                key={index}
                                className="text-xs border-2 rounded-2xl px-2 py-1 font-bold bg-[#c9c5c5]"
                              >
                                {tag.trim()}
                              </div>
                            ))
                        ) : (
                          <div className="flex items-center">
                            {noDataPresentSvg}
                            <span className="ml-2 text-xs">No Data</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </li>
                <li className="list-disc">
                  {orignalData?.categoryOfInvestment && (
                    <div className=" flex flex-col text-gray-600">
                      <p className="font-semibold mb-1 text-gray-800">
                        Category of Invest :
                      </p>
                      <div className="flex gap-2 mt-1 text-xs text-gray-600 items-center flex-wrap">
                        <span className="inline-block w-1.5 mr-2 p-0.5 h-1.5 bg-red-700 rounded-full"></span>
                        {orignalData?.categoryOfInvestment &&
                        orignalData.categoryOfInvestment !== "" ? (
                          orignalData.categoryOfInvestment
                            .split(",")
                            .slice(0, 3)
                            .map((tag, index) => (
                              <div
                                key={index}
                                className="text-xs border-2 rounded-2xl px-2 py-1 font-bold bg-[#c9c5c5]"
                              >
                                {tag.trim()}
                              </div>
                            ))
                        ) : (
                          <div className="flex items-center">
                            {noDataPresentSvg}
                            <span className="ml-2 text-xs">No Data</span>
                          </div>
                        )}
                      </div>
                      <div className="w-3/4">
                        {editMode ? (
                          <div className="flex flex-col mt-1">
                            <div className="flex items-center">
                              <span className="inline-block w-1.5 mr-2 p-0.5 h-1.5 bg-green-700 rounded-full"></span>
                              <ReactSelect
                                isMulti
                                menuPortalTarget={document.body}
                                menuPosition={"fixed"}
                                styles={{
                                  menuPortal: (base) => ({
                                    ...base,
                                    zIndex: 9999,
                                  }),
                                  control: (provided, state) => ({
                                    ...provided,
                                    paddingBlock: "0px",
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
                                  }),
                                }}
                                value={investmentCategoriesSelectedOptions}
                                options={investmentCategoriesOptions}
                                classNamePrefix="select"
                                className="basic-multi-select w-full text-start text-xs text-nowrap"
                                placeholder="Select categories of investment"
                                name="investment_categories"
                                onChange={(selectedOptions) => {
                                  if (
                                    selectedOptions &&
                                    selectedOptions.length > 0
                                  ) {
                                    setInvestmentCategoriesSelectedOptions(
                                      selectedOptions
                                    );
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
                                      message:
                                        "Selecting a category is required",
                                    });
                                  }
                                }}
                              />
                            </div>
                            {errors.investment_categories && (
                              <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                                {errors.investment_categories.message}
                              </span>
                            )}
                          </div>
                        ) : (
                          <div className="flex gap-2 mt-1 text-xs text-gray-600 items-center flex-wrap">
                            <span className="inline-block w-1.5 mr-2 p-0.5 h-1.5 bg-green-700 rounded-full"></span>
                            {updatedData?.categoryOfInvestment &&
                            updatedData.categoryOfInvestment !== "" ? (
                              updatedData.categoryOfInvestment
                                .split(",")
                                .slice(0, 3)
                                .map((tag, index) => (
                                  <div
                                    key={index}
                                    className="text-xs border-2 rounded-2xl px-2 py-1 font-bold bg-[#c9c5c5]"
                                  >
                                    {tag.trim()}
                                  </div>
                                ))
                            ) : (
                              <div className="flex items-center">
                                {noDataPresentSvg}
                                <span className="ml-2 text-xs">No Data</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </li>
                <li className="list-disc">
                  <div className="flex flex-col items-start justify-start sm:text-left">
                    <p className="font-semibold text-gray-800 mb-2 sm:mb-0 mr-2">
                      At what stage of investment are you currently focusing on?
                    </p>
                    <div className="flex gap-2 mt-1 text-xs text-gray-600 items-center flex-wrap">
                      <span className="inline-block w-1.5 mr-2 p-0.5 h-1.5 bg-red-700 rounded-full"></span>
                      {orignalData?.stage && orignalData.stage !== "" ? (
                        orignalData.stage
                          .split(",")
                          .slice(0, 3)
                          .map((tag, index) => (
                            <div
                              key={index}
                              className="text-xs border-2 rounded-2xl px-2 py-1 font-bold bg-[#c9c5c5]"
                            >
                              {tag.trim()}
                            </div>
                          ))
                      ) : (
                        <div className="flex items-center">
                          {noDataPresentSvg}
                          <span className="ml-2 text-xs">No Data</span>
                        </div>
                      )}
                    </div>
                    <div className="w-3/4">
                      {editMode ? (
                        <div className="flex flex-col mt-1">
                          <div className="flex items-center">
                            <span className="inline-block w-1.5 mr-2 p-0.5 h-1.5 bg-green-700 rounded-full"></span>
                            <ReactSelect
                              isMulti
                              menuPortalTarget={document.body}
                              menuPosition={"fixed"}
                              styles={{
                                menuPortal: (base) => ({
                                  ...base,
                                  zIndex: 9999,
                                }),
                                control: (provided, state) => ({
                                  ...provided,
                                  paddingBlock: "0px",
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
                                }),
                              }}
                              value={investStageSelectedOptions}
                              options={investStageOptions}
                              classNamePrefix="select"
                              className="basic-multi-select w-full text-start text-xs text-nowrap"
                              placeholder="Select a stage"
                              name="investment_stage"
                              onChange={(selectedOptions) => {
                                if (
                                  selectedOptions &&
                                  selectedOptions.length > 0
                                ) {
                                  setInvestStageSelectedOptions(
                                    selectedOptions
                                  );
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
                          </div>
                          {errors.investment_stage && (
                            <p className="mt-1 text-sm text-red-500 font-bold text-left">
                              {errors.investment_stage.message}
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="flex gap-2 mt-1 text-xs text-gray-600 items-center flex-wrap">
                          <span className="inline-block w-1.5 mr-2 p-0.5 h-1.5 bg-green-700 rounded-full"></span>
                          {updatedData?.stage && updatedData.stage !== "" ? (
                            updatedData.stage
                              .split(",")
                              .slice(0, 3)
                              .map((tag, index) => (
                                <div
                                  key={index}
                                  className="text-xs border-2 rounded-2xl px-2 py-1 font-bold bg-[#c9c5c5]"
                                >
                                  {tag.trim()}
                                </div>
                              ))
                          ) : (
                            <div className="flex items-center">
                              {noDataPresentSvg}
                              <span className="ml-2 text-xs">No Data</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </li>
                <li className="list-disc">
                  <div className="flex flex-col items-start justify-start sm:text-left">
                    <h2 className=" font-semibold text-gray-800 mb-2 sm:mb-0 mr-2">
                      What is the typical range of check sizes for your
                      investments?
                    </h2>
                    <div className="flex gap-2 mt-1 text-xs text-gray-600 items-center flex-wrap">
                      <span className="inline-block w-1.5 mr-2 p-0.5 h-1.5 bg-red-700 rounded-full"></span>
                      {orignalData?.checkSize &&
                      orignalData.checkSize !== "" ? (
                        orignalData.checkSize
                          .split(",")
                          .slice(0, 3)
                          .map((tag, index) => (
                            <div
                              key={index}
                              className="text-xs border-2 rounded-2xl px-2 py-1 font-bold bg-[#c9c5c5]"
                            >
                              {tag.trim()}
                            </div>
                          ))
                      ) : (
                        <div className="flex items-center">
                          {noDataPresentSvg}
                          <span className="ml-2 text-xs">No Data</span>
                        </div>
                      )}
                    </div>
                    <div className="w-3/4">
                      {editMode ? (
                        <div className="flex flex-col mt-1">
                          <div className="flex items-center">
                            <span className="inline-block w-1.5 mr-2 p-0.5 h-1.5 bg-green-700 rounded-full"></span>

                            <ReactSelect
                              isMulti
                              menuPortalTarget={document.body}
                              menuPosition={"fixed"}
                              styles={{
                                menuPortal: (base) => ({
                                  ...base,
                                  zIndex: 9999,
                                }),
                                control: (provided, state) => ({
                                  ...provided,
                                  paddingBlock: "0px",
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
                                }),
                              }}
                              value={investStageRangeSelectedOptions}
                              options={investStageRangeOptions}
                              classNamePrefix="select"
                              className="basic-multi-select w-full text-start text-nowrap text-xs"
                              placeholder="Select a range"
                              name="investment_stage_range"
                              onChange={(selectedOptions) => {
                                if (
                                  selectedOptions &&
                                  selectedOptions.length > 0
                                ) {
                                  setInvestStageRangeSelectedOptions(
                                    selectedOptions
                                  );
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
                        </div>
                      ) : (
                        <div className="flex gap-2 mt-1 text-xs text-gray-600 items-center flex-wrap">
                          <span className="inline-block w-1.5 mr-2 p-0.5 h-1.5 bg-green-700 rounded-full"></span>
                          {updatedData?.checkSize &&
                          updatedData.checkSize !== "" ? (
                            updatedData.checkSize
                              .split(",")
                              .slice(0, 3)
                              .map((tag, index) => (
                                <div
                                  key={index}
                                  className="text-xs border-2 rounded-2xl px-2 py-1 font-bold bg-[#c9c5c5]"
                                >
                                  {tag.trim()}
                                </div>
                              ))
                          ) : (
                            <div className="flex items-center">
                              {noDataPresentSvg}
                              <span className="ml-2 text-xs">No Data</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </li>
                <li className="list-disc">
                  <div className="flex flex-col items-start justify-start sm:text-left">
                    <p className="font-semibold text-gray-800 mb-2 sm:mb-0 mr-2">
                      Are you currently serving as an Existing ICP Investror?
                    </p>
                    <div className="text-gray-600 flex flex-grow items-center truncate text-xs">
                      <span className="inline-block w-1.5 mr-2  p-0.5 h-1.5  bg-red-700 rounded-full"></span>

                      {orignalData?.exisitngIcpInvestor ? (
                        "Yes"
                      ) : "No" ? (
                        <span>
                          {orignalData?.exisitngIcpInvestor ? "Yes" : "No"}
                        </span>
                      ) : (
                        <span className="flex items-center">
                          {noDataPresentSvg}
                          No Data
                        </span>
                      )}
                    </div>
                    <div className="w-3/4">
                      {editMode ? (
                        <div className="flex flex-col mt-1">
                          <div className="flex items-center">
                            <span className="inline-block w-1.5 mr-2  p-0.5 h-1.5  bg-green-700 rounded-full"></span>
                            <select
                              {...register("existing_icp_investor")}
                              className={`bg-gray-50 border-2 ${
                                errors.existing_icp_investor
                                  ? "border-red-500 placeholder:text-red-500"
                                  : "border-[#737373]"
                              } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1`}
                            >
                              <option
                                className="text-lg font-bold"
                                value="false"
                              >
                                No
                              </option>
                              <option
                                className="text-lg font-bold"
                                value="true"
                              >
                                Yes
                              </option>
                            </select>
                          </div>
                          {errors.existing_icp_investor && (
                            <p className="mt-1 text-sm text-red-500 font-bold text-left">
                              {errors.existing_icp_investor.message}
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="text-gray-600 flex flex-grow items-center mt-1 truncate text-xs">
                          <span className="inline-block w-1.5 mr-2  p-0.5 h-1.5  bg-green-700 rounded-full"></span>

                          {updatedData?.exisitngIcpInvestor ? (
                            "Yes"
                          ) : "No" ? (
                            <span>
                              {updatedData?.exisitngIcpInvestor ? "Yes" : "No"}
                            </span>
                          ) : (
                            <span className="flex items-center">
                              {noDataPresentSvg}
                              No Data
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </li>
                <li className="list-disc">
                  <div className="flex flex-col items-start justify-start sm:text-left">
                    <h2 className=" font-semibold text-gray-800 mb-2 sm:mb-0 mr-2">
                      What type of Investor you are ?
                    </h2>
                    <div className="flex gap-2 text-xs text-gray-600 items-center flex-wrap">
                      <span className="inline-block w-1.5 mr-2 p-0.5 h-1.5 bg-red-700 rounded-full"></span>
                      {orignalData?.investorType &&
                      orignalData.investorType !== "" ? (
                        orignalData.investorType
                          .split(",")
                          .slice(0, 3)
                          .map((tag, index) => (
                            <div
                              key={index}
                              className="text-xs border-2 rounded-2xl px-2 py-1 font-bold bg-[#c9c5c5]"
                            >
                              {tag.trim()}
                            </div>
                          ))
                      ) : (
                        <div className="flex items-center">
                          {noDataPresentSvg}
                          <span className="ml-2 text-xs">No Data</span>
                        </div>
                      )}
                    </div>
                    <div className="w-3/4">
                      {editMode && watch("existing_icp_investor") === "true" ? (
                        <div className="flex flex-col mt-1">
                          <div className="flex items-center">
                            <span className="inline-block w-1.5 mr-2 p-0.5 h-1.5 bg-green-700 rounded-full"></span>
                            <ReactSelect
                              isMulti
                              menuPortalTarget={document.body}
                              menuPosition={"fixed"}
                              styles={{
                                menuPortal: (base) => ({
                                  ...base,
                                  zIndex: 9999,
                                }),
                                control: (provided, state) => ({
                                  ...provided,
                                  paddingBlock: "2px",
                                  borderRadius: "8px",
                                  border: errors.investment_type
                                    ? "2px solid #ef4444"
                                    : "2px solid #737373",
                                  backgroundColor: "rgb(249 250 251)",
                                  "&::placeholder": {
                                    color: errors.investment_type
                                      ? "#ef4444"
                                      : "currentColor",
                                  },
                                }),
                              }}
                              value={typeOfInvestSelectedOptions}
                              options={typeOfInvestOptions}
                              classNamePrefix="select"
                              className="basic-multi-select w-full text-start"
                              placeholder="Select a investment type"
                              name="investment_type"
                              onChange={(selectedOptions) => {
                                if (
                                  selectedOptions &&
                                  selectedOptions.length > 0
                                ) {
                                  setTypeOfInvestSelectedOptions(
                                    selectedOptions
                                  );
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
                                    message:
                                      "Atleast one investment type required",
                                  });
                                }
                              }}
                            />
                          </div>
                          {errors.investment_type && (
                            <p className="mt-1 text-sm text-red-500 font-bold text-left">
                              {errors.investment_type.message}
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="flex gap-2 mt-1 text-xs text-gray-600 items-center flex-wrap">
                          <span className="inline-block w-1.5 mr-2 p-0.5 h-1.5 bg-green-700 rounded-full"></span>
                          {updatedData?.investorType &&
                          updatedData.investorType !== "" ? (
                            updatedData.investorType
                              .split(",")
                              .slice(0, 3)
                              .map((tag, index) => (
                                <div
                                  key={index}
                                  className="text-xs border-2 rounded-2xl px-2 py-1 font-bold bg-[#c9c5c5]"
                                >
                                  {tag.trim()}
                                </div>
                              ))
                          ) : (
                            <div className="flex items-center">
                              {noDataPresentSvg}
                              <span className="ml-2 text-xs">No Data</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </li>
                <li className="list-disc">
                  <div className="flex flex-col items-start justify-start sm:text-left">
                    <h2 className=" font-semibold text-gray-800 mb-2 sm:mb-0 mr-2">
                      What are the preferred ICP hubs ?
                    </h2>
                    <div className="text-gray-600 flex flex-grow items-center truncate text-xs">
                      <span className="inline-block w-1.5 mr-2  p-0.5 h-1.5  bg-red-700 rounded-full"></span>

                      {orignalData?.preferredIcpHub ? (
                        <span>{orignalData?.preferredIcpHub}</span>
                      ) : (
                        <span className="flex items-center text-xs">
                          {noDataPresentSvg}
                          No Data
                        </span>
                      )}
                    </div>
                    <div className="w-3/4">
                      {editMode ? (
                        <div className="flex flex-col mt-2">
                          <div className="flex items-center">
                            <span className="inline-block w-1.5 mr-2  p-0.5 h-1.5  bg-green-700 rounded-full"></span>
                            <select
                              {...register("preferred_icp_hub")}
                              className={`bg-gray-50 border-2 ${
                                errors.preferred_icp_hub
                                  ? "border-red-500"
                                  : "border-[#737373]"
                              } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1`}
                            >
                              <option className="text-lg font-bold" value="">
                                Select
                              </option>
                              {getAllIcpHubs?.map((hub) => (
                                <option
                                  key={hub.id}
                                  value={`${hub.name} ,${hub.region}`}
                                  className="text-lg font-bold"
                                >
                                  {hub.name}, {hub.region}
                                </option>
                              ))}
                            </select>
                          </div>
                          {errors.preferred_icp_hub && (
                            <p className="mt-1 text-sm text-red-500 font-bold text-left">
                              {errors.preferred_icp_hub.message}
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="text-gray-600 flex flex-grow items-center mt-1 truncate text-xs">
                          <span className="inline-block w-1.5 mr-2  p-0.5 h-1.5  bg-green-700 rounded-full"></span>

                          {updatedData?.preferredIcpHub ? (
                            <span>{updatedData?.preferredIcpHub}</span>
                          ) : (
                            <span className="flex items-center text-xs">
                              {noDataPresentSvg}
                              No Data
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </li>
                <li className="list-disc">
                  <div className="flex flex-col items-start justify-start sm:text-left">
                    <p className="font-semibold text-gray-800 mb-2 sm:mb-0 mr-2">
                      Have you made any previous registrations?
                    </p>
                    <div className="flex gap-2 text-xs text-gray-600 items-center flex-wrap">
                      <span className="inline-block w-1.5 mr-2  p-0.5 h-1.5  bg-red-700 rounded-full"></span>

                      {orignalData?.registered === true ? (
                        "Yes"
                      ) : "No" ? (
                        <span>
                          {orignalData?.registered === true ? "Yes" : "No"}
                        </span>
                      ) : (
                        <span className="flex items-center text-xs">
                          {noDataPresentSvg}
                          No Data
                        </span>
                      )}
                    </div>
                    <div className="w-3/4">
                      {editMode ? (
                        <div className="flex flex-col mt-1">
                          <div className="flex items-center">
                            <span className="inline-block w-1.5 mr-2  p-0.5 h-1.5  bg-green-700 rounded-full"></span>
                            <select
                              {...register("investor_registered")}
                              className={`bg-gray-50 border-2 ${
                                errors.investor_registered
                                  ? "border-red-500"
                                  : "border-[#737373]"
                              } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1`}
                            >
                              <option
                                className="text-lg font-bold"
                                value="false"
                              >
                                No
                              </option>
                              <option
                                className="text-lg font-bold"
                                value="true"
                              >
                                Yes
                              </option>
                            </select>
                          </div>
                          {errors.investor_registered && (
                            <p className="mt-1 text-sm text-red-500 font-bold text-left">
                              {errors.investor_registered.message}
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="flex gap-2 text-xs text-gray-600 items-center flex-wrap">
                          <span className="inline-block w-1.5 mr-2  p-0.5 h-1.5  bg-green-700 rounded-full"></span>

                          {updatedData?.registered === true ? (
                            "Yes"
                          ) : "No" ? (
                            <span>
                              {updatedData?.registered === true ? "Yes" : "No"}
                            </span>
                          ) : (
                            <span className="flex items-center text-xs">
                              {noDataPresentSvg}
                              No Data
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </li>
                <li className="list-disc">
                  <div className="flex flex-col items-start justify-start sm:text-left">
                    <h2 className=" font-semibold text-gray-800 mb-2 sm:mb-0 mr-2">
                      In which country are you registered?
                    </h2>
                    <div className="text-gray-600 flex flex-grow items-center truncate text-xs">
                      <span className="inline-block w-1.5 mr-2  p-0.5 h-1.5  bg-red-700 rounded-full"></span>

                      {place}
                      {orignalData?.registeredCountry ? (
                        <span className="ml-2">
                          {orignalData?.registeredCountry}
                        </span>
                      ) : (
                        <span className="flex items-center text-xs ml-2">
                          No Data
                        </span>
                      )}
                    </div>
                    <div className="w-3/4">
                      {editMode && watch("investor_registered") === "true" ? (
                        <div className="flex flex-col mt-1">
                          <div className="flex items-center">
                            <span className="inline-block w-1.5 mr-2  p-0.5 h-1.5  bg-green-700 rounded-full"></span>
                            <select
                              {...register("registered_country")}
                              className={`bg-gray-50 border-2 ${
                                errors.registered_country
                                  ? "border-red-500 placeholder:text-red-500"
                                  : "border-[#737373]"
                              } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1`}
                            >
                              <option className="text-lg font-bold" value="">
                                Select your registered country
                              </option>
                              {countries?.map((country) => (
                                <option
                                  key={country.name}
                                  value={`${country.name}`}
                                  className="text-lg font-bold"
                                >
                                  {country.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          {errors.registered_country && (
                            <p className="mt-1 text-sm text-red-500 font-bold text-left">
                              {errors.registered_country.message}
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="text-gray-600 flex flex-grow items-center mt-1 truncate text-xs">
                          <span className="inline-block w-1.5 mr-2  p-0.5 h-1.5  bg-green-700 rounded-full"></span>
                          {place}
                          {updatedData?.registeredCountry ? (
                            <span className="ml-2">
                              {updatedData?.registeredCountry}
                            </span>
                          ) : (
                            <span className="flex items-center text-xs">
                              No Data
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </li>
                <li className="list-disc">
                  <div className="flex flex-col items-start justify-start sm:text-left">
                    <h2 className=" font-semibold text-gray-800 mb-2 sm:mb-0 mr-2">
                      What is the name of the fund you are referring to?
                    </h2>
                    <div className="text-gray-600 flex flex-grow items-center truncate text-xs">
                      <span className="inline-block w-1.5 mr-2  p-0.5 h-1.5  bg-red-700 rounded-full"></span>

                      {orignalData?.nameOfFund ? (
                        <span>{orignalData?.nameOfFund}</span>
                      ) : (
                        <span className="flex items-center text-xs">
                          {noDataPresentSvg}
                          No Data
                        </span>
                      )}
                    </div>
                    <div className="w-3/4">
                      {editMode ? (
                        <div className="flex flex-col mt-1">
                          <div className="flex items-center">
                            <span className="inline-block w-1.5 mr-2  p-0.5 h-1.5  bg-green-700 rounded-full"></span>
                            <input
                              type="text"
                              {...register("investor_fund_name")}
                              className={`bg-gray-50 border-2 
                                                ${
                                                  errors?.investor_fund_name
                                                    ? "border-red-500 "
                                                    : "border-[#737373]"
                                                } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1`}
                              placeholder="Enter your fund name"
                            />
                          </div>
                          {errors?.investor_fund_name && (
                            <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                              {errors?.investor_fund_name?.message}
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="text-gray-600 mt-1 flex flex-grow items-center truncate text-xs">
                          <span className="inline-block w-1.5 mr-2  p-0.5 h-1.5  bg-green-700 rounded-full"></span>

                          {updatedData?.nameOfFund ? (
                            <span>{updatedData?.nameOfFund}</span>
                          ) : (
                            <span className="flex items-center text-xs">
                              {noDataPresentSvg}
                              No Data
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </li>
                <li className="list-disc">
                  <div className="flex flex-col items-start justify-start sm:text-left">
                    <h2 className=" font-semibold text-gray-800 mb-2 sm:mb-0 mr-2">
                      What is the size of fund?
                    </h2>
                    <div className="text-gray-600 flex flex-grow items-center truncate text-xs">
                      <span className="inline-block w-1.5 mr-2  p-0.5 h-1.5  bg-red-700 rounded-full"></span>

                      {orignalData?.fundSize ? (
                        <span>{orignalData?.fundSize}</span>
                      ) : (
                        <span className="flex items-center text-xs">
                          {noDataPresentSvg}
                          No Data
                        </span>
                      )}
                    </div>
                    <div className="w-3/4">
                      {editMode ? (
                        <div className="flex flex-col mt-1">
                          <div className="flex items-center">
                            <span className="inline-block w-1.5 mr-2  p-0.5 h-1.5  bg-green-700 rounded-full"></span>
                            <input
                              type="number"
                              {...register("investor_fund_size")}
                              className={`bg-gray-50 border-2 
                                                ${
                                                  errors?.investor_fund_size
                                                    ? "border-red-500 "
                                                    : "border-[#737373]"
                                                } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1`}
                              placeholder="Enter fund size in Millions"
                              onWheel={(e) => e.target.blur()}
                              min={0}
                            />
                          </div>
                          {errors?.investor_fund_size && (
                            <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                              {errors?.investor_fund_size?.message}
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="text-gray-600 mt-1 flex flex-grow items-center truncate text-xs">
                          <span className="inline-block w-1.5 mr-2  p-0.5 h-1.5  bg-green-700 rounded-full"></span>

                          {updatedData?.fundSize ? (
                            <span>{updatedData?.fundSize}</span>
                          ) : (
                            <span className="flex items-center text-xs">
                              {noDataPresentSvg}
                              No Data
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </li>
                <li className="list-disc">
                  <div className="flex flex-col items-start justify-start sm:text-left">
                    <h2 className=" font-semibold text-gray-800 mb-2 sm:mb-0 mr-2">
                      Which type of profile it is ?
                    </h2>
                    <div className="text-gray-600 flex flex-grow items-center truncate text-xs">
                      <span className="inline-block w-1.5 mr-2  p-0.5 h-1.5  bg-red-700 rounded-full"></span>

                      {orignalData?.typeOfProfile ? (
                        <span>{orignalData?.typeOfProfile}</span>
                      ) : (
                        <span className="flex items-center text-xs">
                          {noDataPresentSvg}
                          No Data
                        </span>
                      )}
                    </div>
                    <div className="w-3/4">
                      {editMode ? (
                        <div className="flex flex-col mt-1">
                          <div className="flex items-center">
                            <span className="inline-block w-1.5 mr-2  p-0.5 h-1.5  bg-green-700 rounded-full"></span>
                            <select
                              {...register("type_of_profile")}
                              className={`bg-gray-50 border-2 ${
                                errors.type_of_profile
                                  ? "border-red-500 "
                                  : "border-[#737373]"
                              } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1`}
                            >
                              <option className="text-lg font-bold" value="">
                                Select profile type
                              </option>
                              {typeOfProfileOptions &&
                                typeOfProfileOptions.map((val, index) => {
                                  return (
                                    <option
                                      className="text-lg font-bold"
                                      key={index}
                                      value={val?.value}
                                    >
                                      {val?.label}
                                    </option>
                                  );
                                })}
                            </select>
                            {errors.type_of_profile && (
                              <p className="mt-1 text-sm text-red-500 font-bold text-left">
                                {errors.type_of_profile.message}
                              </p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="text-gray-600 mt-1 flex flex-grow items-center truncate text-xs">
                          <span className="inline-block w-1.5 mr-2  p-0.5 h-1.5  bg-green-700 rounded-full"></span>

                          {updatedData?.typeOfProfile ? (
                            <span>{updatedData?.typeOfProfile}</span>
                          ) : (
                            <span className="flex items-center text-xs">
                              {noDataPresentSvg}
                              No Data
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          {editMode ? (
            <div className="flex justify-end mt-4">
              <button
                disabled={isSubmitting}
                type="submit"
                className="text-white font-bold bg-blue-800 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-md w-auto sm:w-auto px-5 py-2 text-center mb-4"
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
                    wrapperclassName=""
                  />
                ) : (
                  "Update"
                )}
              </button>
            </div>
          ) : (
            ""
          )}
        </div>
      </form>
      <Toaster />
    </>
  );
};

export default UserProfileInvestorUpdate;

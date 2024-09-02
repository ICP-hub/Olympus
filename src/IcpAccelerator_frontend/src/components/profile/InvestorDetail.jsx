
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import { useForm, Controller } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useCountries } from "react-countries";
import Select from "react-select";
import ReactSelect from "react-select";
import { LinkedIn, GitHub, Telegram, Language } from "@mui/icons-material";
import CompressedImage from "../ImageCompressed/CompressedImage";
import { allHubHandlerRequest } from "../StateManagement/Redux/Reducers/All_IcpHubReducer";
import { uint8ArrayToBase64 } from "../../../../admin_frontend/src/components/Utils/AdminData/saga_function/blobImageToUrl";
import editp from "../../../assets/Logo/edit.png";
import { ThreeDots } from "react-loader-spinner";

import {Principal} from "@dfinity/principal"


const InvestorDetail = () => {
  const navigate = useNavigate();
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
  const principal = useSelector((currState) => currState.internet.principal);
  const principalId=Principal.fromText(principal)
console.log("principal in investordetail",principal)

  const userCurrentRoleStatusActiveRole = useSelector(
    (currState) => currState.currentRoleStatus.activeRole
  );

  const [imagePreview, setImagePreview] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [editMode, setEditMode] = useState(null);

  const [links, setLinks] = useState({});

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

  const validationSchema = yup
    .object()
    .shape({
      investor_registered: yup
        .string()
        .required("Required")
        .oneOf(["true", "false"], "Invalid value"),
      registered_country: yup
        .string()
        .when("investor_registered", (val, schema) =>
          val === "true"
            ? schema.required("Registered country name required")
            : schema
        ),
      // preferred_icp_hub: yup.string().required("ICP Hub selection is required"),
      preferred_icp_hub: yup.string(),
      existing_icp_investor: yup
        .string()
        .required("Required")
        .oneOf(["true", "false"], "Invalid value"),
      investment_type: yup
        .string()
        .when("existing_icp_investor", (val, schema) =>
          val === "true"
            ? schema
                .test(
                  "is-non-empty",
                  "At least one investment type required",
                  (value) => value?.length > 0
                )
                .required("At least one investment type required")
            : schema
        ),
      investor_portfolio_link: yup
        .string()
        .nullable(true)
        .url("Invalid URL")
        .required("Portfolio URL is required"),
      name_of_fund: yup
        .string()
        // .required("Fund name is required")  // Validation for fund name
        .test("is-non-empty", "Fund name is required", (value) =>
          /\S/.test(value)
        ),
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
      invested_in_multi_chain: yup
        .string()
        .required("Required")
        .oneOf(["true", "false"], "Invalid value"),
      invested_in_multi_chain_names: yup
        .string()
        .when("invested_in_multi_chain", (val, schema) =>
          val === "true"
            ? schema.required("Selecting a Multichain is required")
            : schema
        ),
      investment_categories: yup
        .string()
        .test("is-non-empty", "Selecting a category is required", (value) =>
          /\S/.test(value)
        )
        .required("Selecting a category is required"),
      investor_website_url: yup
        .string()
        .nullable(true)
        .optional()
        .url("Invalid URL"),
      // investor_linkedin_url: yup
      //   .string()
      //   .required("LinkedIn URL is required")
      //   .url("Invalid URL"),
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
                .test("is-non-empty", "At least one range required", (value) =>
                  /\S/.test(value)
                )
                .required("At least one range required")
            : schema
        ),
    })
    .required();

    const [showbtn,setShowbtn]=useState(true)

  // form submit handler func

  const onSubmitHandler = async (data) => {
    const updatedSocialLinks = Object.entries(socialLinks).map(([key, value]) => ({
      link: value ? [value] : [],
    }));
    console.log("Form data being sent to backend: ", data);
    if (actor) {
      const investorData = {
        name_of_fund: data?.investor_fund_name,
        fund_size: [Number(data?.investor_fund_size) || 0],
        existing_icp_investor: data?.existing_icp_investor === "true",
        investor_type: [data?.investment_type?.split(", ").join(", ")] || [],
        project_on_multichain: 
        data?.invested_in_multi_chain === "true"
          ? [data?.invested_in_multi_chain_names?.split(", ").join(", ")]
          : [],
        category_of_investment: data?.investment_categories
          ?.split(", ")
          .join(", "),
        preferred_icp_hub: data?.preferred_icp_hub,
        portfolio_link: data?.investor_portfolio_link,
        website_link: [data?.investor_website_url || ""],
        registered: data?.investor_registered === "true",
        registered_country: [data?.registered_country] || [],
        // linkedin_link: data?.investor_linkedin_url,
        stage: [data?.investment_stage?.split(", ").join(", ")] || [],
        range_of_check_size: [data?.investment_stage_range?.split(", ").join(", ")] || [],
        existing_icp_portfolio: [],
        registered_under_any_hub: [true],
        reason_for_joining: [],
        average_check_size: 0,
        money_invested: [parseInt(0)],
        links: [updatedSocialLinks], 
        number_of_portfolio_companies: 0,
        assets_under_management: [""],
        type_of_investment: data?.type_of_investment || "",
      };

      console.log("Formatted investorData to send: ", investorData);

      try {
        if (userCurrentRoleStatusActiveRole === "vc") {
          const result = await actor.update_venture_capitalist(investorData);
          if (result?.includes("Profile updated successfully")) {
            toast.success("Profile updated successfully");
            navigate("/dashboard/profile")
          } else {
            toast.error(result);
          }
          
        } else {
          const result = await actor.register_venture_capitalist(investorData);
          if (result?.includes("Profile updated successfully")) {
            toast.success("Profile updated successfully");
            window.location.href = "/";
          } else {
            toast.error("Something went wrong");
          }
        }
      } catch (error) {
        toast.error("Error sending data to backend");
        console.error("Error:", error);
      }
    } else {
      toast.error("Please sign up with Internet Identity first");
      window.location.href = "/";
    }
  };
 
  

  const setInvestorValuesHandler = (val) => {
    console.log("val==========>>>>>>>>>>>>>>>INVESTOR JI", val);
    if (val) {
      setValue(
        "investor_registered",
        val?.[0].profile?.params?.registered ?? ""
      );
      if (val?.[0].profile?.params?.registered === true) {
        setValue("investor_registered", "true");
      } else {
        setValue("investor_registered", "false");
      }
      setValue(
        "registered_country",
        val?.[0].profile?.params?.registered_country[0] ?? ""
      );
      // setValue(
      //   "preferred_icp_hub",
      //   val?.[0].profile?.params?.preferred_icp_hub ?? ""
      // );
      setValue(
        "preferred_icp_hub",
        val?.[0].profile?.params?.preferred_icp_hub || ""
      );
      setValue(
        "existing_icp_investor",
        val?.[0].profile?.params?.existing_icp_investor ?? ""
      );
      if (val?.[0].profile?.params?.existing_icp_investor === true) {
        setValue("existing_icp_investor", "true");
      } else {
        setValue("existing_icp_investor", "false");
      }
      setValue(
        "investment_type",
        val?.[0].profile?.params?.investor_type[0] ?? ""
      );
      setTypeOfInvestSelectedOptionsHandler(
        val?.[0].profile?.params?.investor_type
      );
      setValue(
        "type_of_investment",
        typeOfInvestOptions.map((option) => option.value).join(", ")
      );
      setValue(
        "investor_portfolio_link",
        val?.[0].profile?.params?.portfolio_link ?? ""
      );
      // setValue("investor_fund_name", val?.name_of_fund ?? "");
      const fundName = val?.[0].profile?.params?.name_of_fund || "";
      setValue("investor_fund_name", fundName.trim() ? fundName : "");
      // setValue("investor_fund_size", val?.fund_size?.[0] ?? "");
      const fundSize = Number(val?.[0].profile?.params?.fund_size?.[0]) || 0;
      setValue("investor_fund_size", fundSize > 0 ? fundSize : "");
      if (val?.[0].profile?.params?.project_on_multichain) {
        setValue("invested_in_multi_chain", "true");
      } else {
        setValue("invested_in_multi_chain", "false");
      }
      setValue(
        "invested_in_multi_chain_names",
        val?.[0].profile?.params?.project_on_multichain[0] ?? ""
      );
      setInvestedInMultiChainSelectedOptionsHandler(
        val?.[0].profile?.params?.project_on_multichain
      );
      setValue(
        "investment_categories",
        val?.[0].profile?.params?.category_of_investment ?? ""
      );
      setInvestmentCategoriesSelectedOptionsHandler(
        val?.[0].profile?.params?.category_of_investment
      );
      setValue(
        "investor_website_url",
        val?.[0].profile?.params?.website_link[0] ?? ""
      );
      // setValue(
      //   "investor_linkedin_url",
      //   val?.[0].profile?.params?.linkedin_link ?? ""
      // );
      setValue("investment_stage", val?.[0].profile?.params?.stage[0] ?? "");
      setValue(
        "number_of_portfolio_companies",
        val?.[0].profile?.params?.number_of_portfolio_companies ?? 0
      );
      setInvestStageSelectedOptionsHandler(val?.[0].profile?.params?.stage);
      setValue(
        "investment_stage_range",
        val?.[0].profile?.params?.range_of_check_size[0] ?? ""
      );
      setInvestStageRangeSelectedOptionsHandler(
        val?.[0].profile?.params?.range_of_check_size
      );
      if (val) {
        // Existing code for setting other values...
    
        if (val[0].profile?.params.links?.length) {
          const links = {};
    
          val[0].profile?.params.links.forEach((linkArray) => {
            linkArray.forEach((linkData) => {
              const url = linkData.link[0];
    
              if (url && typeof url === "string") {
                let domainKey;
    
                if (url.includes("linkedin.com")) {
                  domainKey = "LinkedIn";
                } else if (url.includes("github.com")) {
                  domainKey = "GitHub";
                } else if (url.includes("t.me") || url.includes("telegram")) {
                  domainKey = "Telegram";
                } else {
                  domainKey = new URL(url).hostname.replace("www.", "");
                }
    
                // Initialize array for this domain if it doesn't exist
                if (!links[domainKey]) {
                  links[domainKey] = [];
                }
    
                // Add the URL to the corresponding domain array
                links[domainKey].push(url);
              }
            });
          });
    
          setSocialLinks(links);
        } else {
          setSocialLinks({});
        }
      }
      
      
    }
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

  const registered = investorFullData[0]?.profile?.params?.registered;
  const registeredValue = registered ? "Yes" : "No";
  const registered_country =
    investorFullData[0]?.profile?.params?.registered_country;
  const preferred_icp_hub =
    investorFullData[0]?.profile?.params?.preferred_icp_hub;
  const existing_icp_investor =
    investorFullData[0]?.profile?.params?.existing_icp_investor;
  const investor_type = investorFullData[0]?.profile?.params?.investor_type;
  const portfolio_link = investorFullData[0]?.profile?.params?.portfolio_link;
  const fund_size = investorFullData[0]?.profile?.params?.fund_size;
  const invested_in_multi_chain = investorFullData?.invested_in_multi_chain;
  const project_on_multichain =
    investorFullData[0]?.profile?.params?.project_on_multichain;
  const category_of_investment =
    investorFullData[0]?.profile?.params?.category_of_investment;
  const name_of_fund = investorFullData[0]?.profile?.params?.name_of_fund;
  const website_link = investorFullData[0]?.profile?.params?.website_link;
  // const investor_linkedin_url = investorFullData?.investor_linkedin_url;
  const stage = investorFullData[0]?.profile?.params?.stage;
  const range_of_check_size =
    investorFullData[0]?.profile?.params?.range_of_check_size;

  const setInterestedDomainsSelectedOptionsHandler = (val) => {
    setInterestedDomainsSelectedOptions(
      val
        ? val
            .split(", ")
            .map((interest) => ({ value: interest, label: interest }))
        : []
    );
  };

  const setReasonOfJoiningSelectedOptionsHandler = (val) => {
    setReasonOfJoiningSelectedOptions(
      val && val.length > 0 && val[0].length > 0
        ? val[0].map((reason) => ({ value: reason, label: reason }))
        : []
    );
  };

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

  const setInvestmentCategoriesSelectedOptionsHandler = (val) => {
    setInvestmentCategoriesSelectedOptions(
      val
        ? val
            .split(", ")
            .map((investment) => ({ value: investment, label: investment }))
        : []
    );
  };

  const setInvestStageSelectedOptionsHandler = (val) => {
    setInvestStageSelectedOptions(
      val
        ? val?.[0]
            .split(", ")
            .map((investment) => ({ value: investment, label: investment }))
        : []
    );
  };

  const setInvestStageRangeSelectedOptionsHandler = (val) => {
    setInvestStageRangeSelectedOptions(
      val
        ? val?.[0]
            .split(", ")
            .map((investment) => ({ value: investment, label: investment }))
        : []
    );
  };

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
            let mapped_arr = result.map((val) => ({
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

  const handleInputChange = (e, field) => {
    setValue(field, e.target.value, { shouldValidate: true });
  };

  useEffect(() => {
    if (actor) {
      (async () => {
        if (userCurrentRoleStatusActiveRole === "vc") {
          const result = await actor.get_vc_info(principalId);
          if (result) {
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
            let mapped_arr = result.map((val) => ({
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
 
  console.log("mere link aa rahe hai ", links);
  const [socialLinks, setSocialLinks] = useState({});
  const [isEditingLink, setIsEditingLink] = useState({});
  const [isLinkBeingEdited, setIsLinkBeingEdited] = useState(false);

  
  const handleLinkEditToggle = (linkKey) => {
    setIsEditingLink((prev) => ({
      ...prev,
      [linkKey]: !prev[linkKey],
    }));
    setIsLinkBeingEdited(!isLinkBeingEdited);
  };
  
  const handleLinkChange = (e, link) => {
    setSocialLinks((prev) => ({
      ...prev,
      [link]: e.target.value,
    }));
  };
  const getIconForLink = (url) => {
    if (url.includes("linkedin.com")) {
      return LinkedIn;
    } else if (url.includes("github.com")) {
      return GitHub;
    } else if (url.includes("t.me") || url.includes("telegram")) {
      return Telegram;
    } else {
      return Language;
    }
  };
  const handleSave = () => {
    // Validate form and update the main state
    const isFormValid = Object.keys(errors).length === 0;

    if (isFormValid) {
      // setProfileData(tempData); // Update the main profile data state
      setEdit({
        registered: false,
        registered_country: false,
        preferred_icp_hub: false,
        existing_icp_investor: false,
        project_on_multichain: false,
        portfolio_link: false,
        name_of_fund: false,
        invested_in_multi_chain:false,
        fund_size: false,
        category_of_investment: false,
        website_link: false,
        // linkedin_link: false,
        stage: false,
        range_of_check_size: false,
      });
    } else {
      console.log("Validation failed:", errors);
    }
  };
  const handleCancel = () => {
    setEdit({
      registered: false,
      registered_country: false,
      preferred_icp_hub: false,
      existing_icp_investor: false,
      project_on_multichain: false,
      portfolio_link: false,
      name_of_fund: false,
      fund_size: false,
      category_of_investment: false,
      website_link: false,
      invested_in_multi_chain:false,
      // linkedin_link: false,
      stage: false,
      range_of_check_size: false,
    });
  };

  const [edit, setEdit] = useState({
    registered: false,
    invested_in_multi_chain:false,
    registered_country: false,
    preferred_icp_hub: false,
    existing_icp_investor: false,
    project_on_multichain: false,
    portfolio_link: false,
    name_of_fund: false,
    fund_size: false,
    category_of_investment: false,
    website_link: false,
    // linkedin_link: false,
    stage: false,
    range_of_check_size: false,
  });

  const handleEditClick = (field) => {
    setEdit({ ...edit, [field]: true });
  };

  const editableRef = useRef(null);

  const handleClickOutside = (event) => {
    if (editableRef.current && !editableRef.current.contains(event.target)) {
      setEdit({
        registered: false,
        registered_country: false,
        preferred_icp_hub: false,
        existing_icp_investor: false,
        project_on_multichain: false,
        portfolio_link: false,
        name_of_fund: false,
        fund_size: false,
        category_of_investment: false,
        website_link: false,
        // linkedin_link: false,
        stage: false,
        range_of_check_size: false,
      });
    }
  };
  console.log(
    "fund size from backend",
    investorFullData[0]?.profile?.params?.fund_size[0]
  );

  useEffect(() => {
    if (investorFullData) {
      console.log("Investor full data ==>", investorFullData);
      setInvestorValuesHandler(investorFullData);
      setEdit(true);
    }
  }, [investorFullData]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const onErrorHandler = (val) => {
    console.log("Validation errors:", val);
    toast.error("Empty fields or invalid values, please recheck the form");
  };
  return (
    <form onSubmit={handleSubmit(onSubmitHandler, onErrorHandler)}>
      <div className="px-1">
        <div className="group relative hover:bg-gray-100 rounded-lg p-3 px-3 mt-4 mb-2">
          <div className="flex justify-between items-center">
            <label className="font-semibold  text-xs text-gray-500 uppercase mb-1">
              Are you registered?
            </label>
            <img
              src={editp}
              className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
              alt="edit"
              onClick={() => handleEditClick("registered")}
            />
          </div>
          {edit.registered ? (
            <div>
              <select
                {...register("investor_registered")}
                className={`bg-gray-50 border-2 ${
                  errors.investor_registered
                    ? "border-red-500"
                    : "border-[#737373]"
                } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
              >
                <option className="text-lg font-bold" value="false">
                  No
                </option>
                <option className="text-lg font-bold" value="true">
                  Yes
                </option>
              </select>
              {errors.investor_registered && (
                <p className="mt-1 text-sm text-red-500 font-bold text-left">
                  {errors.investor_registered.message}
                </p>
              )}
            </div>
          ) : (
            <div className="flex justify-between items-center cursor-pointer py-1">
              <span className="mr-2 text-sm">{registeredValue}</span>
            </div>
          )}
        </div>
        {watch("investor_registered") === "true" && (
          <div className="group relative hover:bg-gray-100 rounded-lg my-3 p-2 px-3">
            <div className="flex justify-between items-center">
              <label className="font-semibold  text-xs text-gray-500 uppercase mb-1">
                Registered Country
              </label>
              <img
                src={editp}
                className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
                alt="edit"
                onClick={() => handleEditClick("registered_country")}
              />
            </div>
            {edit.registered_country ? (
              <div>
                <select
                  {...register("registered_country")}
                  className={`bg-gray-50 border-2 ${
                    errors.registered_country
                      ? "border-red-500 placeholder:text-red-500"
                      : "border-[#737373]"
                  } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
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

                {errors.registered_country && (
                  <p className="mt-1 text-sm text-red-500 font-bold text-left">
                    {errors.registered_country.message}
                  </p>
                )}
              </div>
            ) : (
              <div className="flex justify-between items-center cursor-pointer py-1">
                <span className="mr-2 text-sm">{registered_country}</span>
              </div>
            )}
          </div>
        )}

        <div className="group relative hover:bg-gray-100 rounded-lg my-3 p-2 px-3">
          <div className="flex justify-between items-center">
            <label className="font-semibold  text-xs text-gray-500 uppercase mb-1">
              ICP hub you will like to be associated
            </label>
            <img
              src={editp}
              className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
              alt="edit"
              onClick={() => handleEditClick("preferred_icp_hub")}
            />
          </div>
          {edit.preferred_icp_hub ? (
            <div>
              <select
                {...register("preferred_icp_hub")}
                className={`bg-gray-50 border-2 ${
                  errors.preferred_icp_hub
                    ? "border-red-500"
                    : "border-[#737373]"
                } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
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
              {errors.preferred_icp_hub && (
                <p className="mt-1 text-sm text-red-500 font-bold text-left">
                  {errors.preferred_icp_hub.message}
                </p>
              )}
            </div>
          ) : (
            <div className="flex justify-between items-center cursor-pointer py-1">
              <span className="mr-2 text-sm">{preferred_icp_hub}</span>
            </div>
          )}
        </div>

        <div className="group relative hover:bg-gray-100 rounded-lg my-3 p-2 px-3">
          <div className="flex justify-between items-center">
            <label className="font-semibold  text-xs text-gray-500 uppercase mb-1">
              Are you an existing ICP investor
            </label>
            <img
              src={editp}
              className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
              alt="edit"
              onClick={() => handleEditClick("existing_icp_investor")}
            />
          </div>
          {edit.existing_icp_investor ? (
            <div>
              <select
                {...register("existing_icp_investor")}
                className={`bg-gray-50 border-2 ${
                  errors.existing_icp_investor
                    ? "border-red-500"
                    : "border-[#737373]"
                } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
              >
                <option className="text-lg font-bold" value="false">
                  No
                </option>
                <option className="text-lg font-bold" value="true">
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
            <div className="flex justify-between items-center cursor-pointer py-1">
              <span className="mr-2 text-sm">
                {getValues("existing_icp_investor") === "true" ? "Yes" : "No"}
              </span>
            </div>
          )}
        </div>

        {watch("existing_icp_investor") === "true" && (
          <div className="group relative hover:bg-gray-100 rounded-lg my-3 p-2 px-3">
            <div className="flex justify-between items-center">
              <label className="font-semibold  text-xs text-gray-500 uppercase mb-1">
                Type of investment
              </label>
              <img
                src={editp}
                className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
                alt="edit"
                onClick={() => handleEditClick("investor_type")}
              />
            </div>
            {edit.investor_type ? (
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
                      ? "2px solid #ef4444"
                      : "2px solid #737373",
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
                      selectedOptions.map((option) => option.value).join(", "),
                      { shouldValidate: true }
                    );
                  } else {
                    setTypeOfInvestSelectedOptions([]);
                    setValue("investment_type", "", {
                      shouldValidate: true,
                    });
                    setError("investment_type", {
                      type: "required",
                      message: "At least one investment type required",
                    });
                  }
                }}
              />
            ) : (
              
              <div className="flex overflow-hidden overflow-x-auto gap-2 cursor-pointer py-1">
              {investor_type &&
              typeof investor_type[0] === "string" ? (
                investor_type[0].split(", ").map((type, index) => (
                  <span
                    key={index}
                    className="border-2 border-gray-500 min-w-[80px] truncate text-center rounded-full text-gray-700 text-xs px-2 py-1"
                  >
                    {type}
                  </span>
                ))
              ) : (
                <span className="border-2 border-gray-500 rounded-full text-gray-700 text-xs px-2 py-1">
                  
                </span>
              )}
            </div>
            )}
          </div>
        )}

        <div className="group relative hover:bg-gray-100 rounded-lg my-3 p-2 px-3">
          <div className="flex justify-between items-center">
            <label className="font-semibold  text-xs text-gray-500 uppercase mb-1">
              Portfolio Link
            </label>
            <img
              src={editp}
              className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
              alt="edit"
              onClick={() => handleEditClick("portfolio_link")}
            />
          </div>
          {edit.portfolio_link ? (
            <div>
              <input
                type="text"
                {...register("investor_portfolio_link")}
                className={`bg-gray-50 border-2 ${
                  errors.investor_portfolio_link
                    ? "border-red-500 "
                    : "border-[#737373]"
                } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                placeholder="Enter your portfolio url"
              />
              {errors.investor_portfolio_link && (
                <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                  {errors.investor_portfolio_link.message}
                </span>
              )}
            </div>
          ) : (
            <div className="flex justify-between items-center cursor-pointer py-1 ">
              <span className="mr-2 text-sm">{portfolio_link}</span>
            </div>
          )}
        </div>

        <div className="group relative hover:bg-gray-100 rounded-lg my-3 p-2 px-3">
          <div className="flex justify-between items-center">
            <label className="font-semibold text-xs text-gray-500 uppercase mb-1">
              Fund Name
            </label>
            <img
              src={editp}
              className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
              alt="edit"
              onClick={() => handleEditClick("name_of_fund")}
            />
          </div>
          {edit.name_of_fund ? (
            <div>
              <input
                type="text"
                {...register("investor_fund_name")}
                className={`bg-gray-50 border-2 ${
                  errors.investor_fund_name
                    ? "border-red-500 "
                    : "border-[#737373]"
                } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                placeholder="Enter your fund name"
              />
              {errors.investor_fund_name && (
                <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                  {errors.investor_fund_name.message}
                </span>
              )}
            </div>
          ) : (
            <div className="flex justify-between items-center cursor-pointer py-1">
              <span className="mr-2 text-sm">{name_of_fund}</span>
            </div>
          )}
        </div>

        <div className="group relative hover:bg-gray-100 rounded-lg my-3 p-2 px-3">
          <div className="flex justify-between items-center">
            <label className="font-semibold  text-xs text-gray-500 uppercase mb-1">
              Fund size (in million USD)
            </label>
            <img
              src={editp}
              className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
              alt="edit"
              onClick={() => handleEditClick("fund_size")}
            />
          </div>
          {edit.fund_size ? (
            <div>
              <input
                type="number"
                {...register("investor_fund_size")}
                className={`bg-gray-50 border-2 ${
                  errors.investor_fund_size
                    ? "border-red-500 "
                    : "border-[#737373]"
                } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                placeholder="Enter fund size in Millions"
                onWheel={(e) => e.target.blur()}
                min={0}
              />
              {errors.investor_fund_size && (
                <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                  {errors.investor_fund_size.message}
                </span>
              )}
            </div>
          ) : (
            <div className="flex justify-between items-center cursor-pointer py-1">
              <span className="mr-2 text-sm">{fund_size}</span>
            </div>
          )}
        </div>

        <div className="group relative hover:bg-gray-100 rounded-lg my-3 p-2 px-3">
        <div className="flex justify-between items-center">
        <label
            
            className="font-semibold  text-xs text-gray-500 uppercase mb-1"
          >
            Do you invest in multiple ecosystems{" "}
            
          </label>
            <img
              src={editp}
              className="absolute right-2 top-2 invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
              alt="edit"
              onClick={() => handleEditClick("invested_in_multi_chain")}
            />
          </div>
          {edit.invested_in_multi_chain ? 
          <div className="">
            <select
            {...register("invested_in_multi_chain")}
            className={`bg-gray-50 border-2 ${
              errors.invested_in_multi_chain
                ? "border-red-500"
                : "border-[#737373]"
            } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
          >
            <option className="text-lg font-bold" value="false">
              No
            </option>
            <option className="text-lg font-bold" value="true">
              Yes
            </option>
          </select>
          {errors.invested_in_multi_chain && (
            <p className="mt-1 text-sm text-red-500 font-bold text-left">
              {errors.invested_in_multi_chain.message}
            </p>
          )}
          </div> :
          <div className="flex justify-between items-center cursor-pointer py-1">
          <span className="mr-2 text-sm">
            {getValues("invested_in_multi_chain") === "true" ? "Yes" : "No"}
          </span>
        </div>
          }
        </div>
        {watch("invested_in_multi_chain") === "true" && 
          <div className="group relative hover:bg-gray-100 rounded-lg my-3 p-2 px-3">
            <div className="">
            <label
              
              className="font-semibold  text-xs text-gray-500 uppercase mb-1"
            >
              Please select the chains 
            </label>
            <img
                src={editp}
                className="absolute right-2 top-2  invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
                alt="edit"
                onClick={() => handleEditClick("project_on_multichain")}
              />
            </div>
            {edit.project_on_multichain ? 
            <div className="">
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
                  setInvestedInMultiChainSelectedOptions(selectedOptions);
                  clearErrors("invested_in_multi_chain_names");
                  setValue(
                    "invested_in_multi_chain_names",
                    selectedOptions.map((option) => option.value).join(", "),
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
            </div> :
            
            <div className="flex overflow-hidden overflow-x-auto  gap-2 cursor-pointer py-1">
            {project_on_multichain &&
            typeof project_on_multichain[0] === "string" ? (
              project_on_multichain[0].split(", ").map((projects, index) => (
                <span
                  key={index}
                  className="border-2 border-gray-500 min-w-[80px] truncate text-center rounded-full text-gray-700 text-xs px-2 py-1"
                >
                  {projects}
                </span>
              ))
            ) : (
              <span className="border-2 border-gray-500 rounded-full text-gray-700 text-xs px-2 py-1">
                
              </span>
            )}
          </div>
               }
           
          </div>
        
        }

        <div className="group relative hover:bg-gray-100 rounded-lg my-3 p-2 px-3">
          <div className="flex justify-between items-center">
            <label className="font-semibold  text-xs text-gray-500 uppercase mb-1">
              Category of investment
            </label>
            <img
              src={editp}
              className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
              alt="edit"
              onClick={() => handleEditClick("category_of_investment")}
            />
          </div>
          {edit.category_of_investment ? (
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
                    const selectedString = selectedOptions
                      .map((option) => option.value)
                      .join(", ");
                    setInvestmentCategoriesSelectedOptions(selectedOptions);
                    clearErrors("investment_categories");
                    setValue("investment_categories", selectedString, {
                      shouldValidate: true,
                    });
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
            </div>
          ) : (
            <div className="flex overflow-hidden overflow-x-auto gap-2 cursor-pointer py-1">
              {category_of_investment &&
              typeof category_of_investment === "string" ? (
                category_of_investment.split(", ").map((category, index) => (
                  <span
                    key={index}
                    className="border-2 border-gray-500 text-center min-w-[80px] truncate rounded-full text-gray-700 text-xs px-2 py-1"
                  >
                    {category}
                  </span>
                ))
              ) : (
                <span className="border-2 border-gray-500 rounded-full text-gray-700 text-xs px-2 py-1">
                  tooling
                </span>
              )}
            </div>
          )}
        </div>

        <div className="group relative hover:bg-gray-100 rounded-lg my-3 p-2 px-3">
          <div className="flex justify-between items-center">
            <label className="font-semibold  text-xs text-gray-500 uppercase mb-1">
              Website Link
            </label>
            <img
              src={editp}
              className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
              alt="edit"
              onClick={() => handleEditClick("website_link")}
            />
          </div>
          {edit.website_link ? (
            <div>
              <input
                type="text"
                {...register("investor_website_url")}
                className={`bg-gray-50 border-2 ${
                  errors.investor_website_url
                    ? "border-red-500 "
                    : "border-[#737373]"
                } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w/full p-2.5`}
                placeholder="Enter your website url"
              />
              {errors.investor_website_url && (
                <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                  {errors.investor_website_url.message}
                </span>
              )}
            </div>
          ) : (
            <div className="flex justify-between items-center cursor-pointer py-1">
              <span className="mr-2 text-sm">{website_link}</span>
            </div>
          )}
        </div>

        <div className="group relative hover:bg-gray-100 rounded-lg my-3 p-2 px-3">
          <div className="flex justify-between items-center">
            <label className="font-semibold text-xs text-gray-500 uppercase mb-1">
              Which stage(s) do you invest at?{" "}
            </label>
            <img
              src={editp}
              className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
              alt="edit"
              onClick={() => handleEditClick("stage")}
            />
          </div>
          {edit.stage ? (
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
                      selectedOptions.map((option) => option.value).join(", "),
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
            
            <div className="flex overflow-hidden overflow-x-auto gap-2 cursor-pointer py-1">
            {stage &&
            typeof stage[0] === "string" ? (
              stage[0].split(", ").map((value, index) => (
                <span
                  key={index}
                  className="border-2 text-center min-w-[80px] truncate border-gray-500 rounded-full text-gray-700 text-xs px-2 py-1"
                >
                  {value}
                </span>
              ))
            ) : (
              <span className="border-2 border-gray-500 rounded-full text-gray-700 text-xs px-2 py-1">
                
              </span>
            )}
          </div>
          )}
        </div>

        <div className="group relative hover:bg-gray-100 rounded-lg my-3 p-2 px-3">
          <div className="flex justify-between items-center">
            <label className="font-semibold  text-xs text-gray-500 uppercase mb-1">
              What is the range of your check size?
            </label>
            <img
              src={editp}
              className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
              alt="edit"
              onClick={() => handleEditClick("range_of_check_size")}
            />
          </div>
          {edit.range_of_check_size ? (
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
                      selectedOptions.map((option) => option.value).join(", "),
                      { shouldValidate: true }
                    );
                  } else {
                    setInvestStageRangeSelectedOptions([]);
                    setValue("investment_stage_range", "", {
                      shouldValidate: true,
                    });
                    setError("investment_stage_range", {
                      type: "required",
                      message: "At least one stage required",
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
            
            <div className="flex overflow-hidden overflow-x-auto gap-2 cursor-pointer py-1">
              {range_of_check_size &&
              typeof range_of_check_size[0] === "string" ? (
                range_of_check_size[0].split(", ").map((range, index) => (
                  <span
                    key={index}
                    className="border-2 text-center min-w-[80px] truncate border-gray-500 rounded-full text-gray-700 text-xs px-2 py-1"
                  >
                    {range}
                  </span>
                ))
              ) : (
                <span className="border-2 border-gray-500 rounded-full text-gray-700 text-xs px-2 py-1">
                  tooling
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-6 px-3">
  {/* Display existing links */}
  {console.log("Display existing links ", socialLinks)}
  {socialLinks &&
    Object.keys(socialLinks).map((key) => {
      const urls = socialLinks[key];
      
      if (!Array.isArray(urls) || urls.length === 0) {
        return null; // Skip rendering if urls is not an array or is empty
      }

      return urls.map((url, index) => {
        const uniqueKey = `${key}-${index}`;
        const Icon = getIconForLink(url);
        return (
          <div className="group relative flex items-center" key={uniqueKey}>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center"
            >
              <Icon className="text-gray-400 hover:text-gray-600 cursor-pointer transform transition-all duration-300 hover:scale-110" />
            </a>
            <button
              type="button"
              className="absolute right-0 p-1 text-gray-500 text-xs transition-all duration-300 ease-in-out transform opacity-0 group-hover:opacity-100 group-hover:translate-x-6 h-10 w-7"
              onClick={() => handleLinkEditToggle(uniqueKey)}
            >
              <img src={editp} alt="edit" />
            </button>
            {isEditingLink[uniqueKey] && (
              <input
                type="text"
                {...register(`social_links[${key}][${index}]`)}
                value={url}
                onChange={(e) => handleLinkChange(e, key, index)}
                className="border p-1 rounded w-full ml-2 transition-all duration-300 ease-in-out transform"
              />
            )}
          </div>
        );
      });
    })}
</div>





        {Object.values(edit).some((value) => value) && (
          showbtn && <div className="flex justify-end gap-4 mt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-300 text-gray-700 py-2 px-4 rounded"
            >
              Cancel
            </button>
            <button
              disabled={isSubmitting}
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded"
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
              ) : edit ? (
                "Update"
              ) : (
                "Submit"
              )}
            </button>
          </div>
        )}
      </div>
    </form>
  );
};

export default InvestorDetail;

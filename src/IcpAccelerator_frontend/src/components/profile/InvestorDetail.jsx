import React, { useState, useEffect, useRef } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import { useForm, Controller } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useCountries } from "react-countries";
import Select from 'react-select';
import ReactSelect from "react-select";
import CompressedImage from "../ImageCompressed/CompressedImage";
import { allHubHandlerRequest } from "../StateManagement/Redux/Reducers/All_IcpHubReducer";
import { uint8ArrayToBase64 } from "../../../../admin_frontend/src/components/Utils/AdminData/saga_function/blobImageToUrl";
import editp from "../../../assets/Logo/edit.png";

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

  const userCurrentRoleStatusActiveRole = useSelector(
    (currState) => currState.currentRoleStatus.activeRole
  );

  const [imagePreview, setImagePreview] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [editMode, setEditMode] = useState(null);

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
        .url("Invalid url"),
      twitter_url: yup
        .string()
        .nullable(true)
        .optional()
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
        .oneOf(["Yes", "No"], "Invalid value"),
      registered_country: yup
        .string()
        .when("investor_registered", (val, schema) =>
          val && val[0] === "Yes"
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
        .oneOf(["Yes", "No"], "Invalid value"),
      investment_type: yup
        .string()
        .when("existing_icp_investor", (val, schema) =>
          val && val[0] === "Yes"
            ? schema
              .test(
                "is-non-empty",
                "At least one investment type required",
                (value) => /\S/.test(value)
              )
              .required("At least one investment type required")
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
        .oneOf(["Yes", "No"], "Invalid value"),
      invested_in_multi_chain_names: yup.string().required("Selecting a Multichain is required"),
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
              .test("is-non-empty", "At least one range required", (value) =>
                /\S/.test(value)
              )
              .required("At least one range required")
            : schema
        ),
    })
    .required();

  const defaultValues = {
    investor_registered: "No",
    registered_country: "India",
    preferred_icp_hub: "Icp Hub India",
    existing_icp_investor: "No",
    investment_type: ["SNS"],
    investor_portfolio_link: "https://portfolio.com",
    investor_fund_name: "Lakshmi Chit Fund",
    investor_fund_size: "1000",
    invested_in_multi_chain: "No",
    invested_in_multi_chain_names: ['Etherium', 'Base'],
    investment_categories: ['Tooling'],
    investor_website_url: "https://website.com",
    investor_linkedin_url: "https://linkedIn.com",
    investment_stage: ["Pre-Mvp"],
    investment_stage_range: ["$2-5M"],
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

  const [profileData, setProfileData] = useState(defaultValues);
  const [tempData, setTempData] = useState(profileData);





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

  const setInvestorValuesHandler = (val) => {
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
      setValue("investor_registered", val?.registered ? "Yes" : "No");
      setValue("registered_country", val?.registered_country?.[0] ?? "");
      setValue(
        "preferred_icp_hub",
        val?.preferred_icp_hub ? val?.preferred_icp_hub : ""
      );
      setValue("existing_icp_investor", val?.existing_icp_investor ?? "");
      setValue("existing_icp_investor", val?.existing_icp_investor ? "Yes" : "No");
      setValue("investment_type", val?.investor_type?.[0] ?? "");
      setTypeOfInvestSelectedOptionsHandler(val?.investor_type);
      setValue("investor_portfolio_link", val?.portfolio_link ?? "");
      setValue("investor_fund_name", val?.name_of_fund ?? "");
      setValue("investor_fund_size", val?.fund_size?.[0] ?? "");
      setValue("invested_in_multi_chain", val?.project_on_multichain?.[0] ? "Yes" : "No");
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
      setInvestorValuesHandler(investorFullData);
      setEditMode(true);
    } else if (userFullData) {
      setValuesHandler(userFullData);
    }
  }, [userFullData, investorFullData]);

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
    setTempData(prev => ({ ...prev, [field]: e.target.value }));
  };

  useEffect(() => {
    if (actor) {
      (async () => {
        if (userCurrentRoleStatusActiveRole === "vc") {
          const result = await actor.get_vc_info();
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

  const handleSave = () => {
    // Validate form and update the main state
    const isFormValid = Object.keys(errors).length === 0;

    if (isFormValid) {
      setProfileData(tempData); // Update the main profile data state
      setEdit({
        investorRegistered: false,
        registeredCountry: false,
        preferredIcpHub: false,
        existingIcpInvestor: false,
        invested_in_multiChain: false,
        portfolioLink: false,
        fundName: false,
        fundSize: false,
        investedCategory: false,
        websiteLink: false,
        linkedInLink: false,
        investmentStag: false,
        investmentRange: false,
      });
    } else {
      console.log('Validation failed:', errors);
    }
  };
  const handleCancel = () => {
    setEdit({
      investorRegistered: false,
      registeredCountry: false,
      preferredIcpHub: false,
      existingIcpInvestor: false,
      invested_in_multiChain: false,
      portfolioLink: false,
      fundName: false,
      fundSize: false,
      investedCategory: false,
      websiteLink: false,
      linkedInLink: false,
      investmentStag: false,
      investmentRange: false,
    });
    setTempData(profileData);
  };

  const [edit, setEdit] = useState({
    investorRegistered: false,
    registeredCountry: false,
    preferredIcpHub: false,
    existingIcpInvestor: false,
    invested_in_multiChain: false,
    portfolioLink: false,
    fundName: false,
    fundSize: false,
    investedCategory: false,
    websiteLink: false,
    linkedInLink: false,
    investmentStag: false,
    investmentRange: false,
  });

  const handleEditClick = (field) => {
    setEdit({ ...edit, [field]: true });
  };

  const editableRef = useRef(null);

  const handleClickOutside = (event) => {
    if (editableRef.current && !editableRef.current.contains(event.target)) {
      setEdit({
        investorRegistered: false,
        registeredCountry: false,
        preferredIcpHub: false,
        existingIcpInvestor: false,
        invested_in_multiChain: false,
        portfolioLink: false,
        fundName: false,
        fundSize: false,
        investedCategory: false,
        websiteLink: false,
        linkedInLink: false,
        investmentStag: false,
        investmentRange: false,
      });
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className='px-1'>
      <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3">
        <div className='flex justify-between items-center'>
          <label className="font-semibold  text-xs text-gray-500 uppercase mb-1">Are you registered?</label>
          <img
            src={editp}
            className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
            alt="edit"
            onClick={() => handleEditClick('investorRegistered')}
          />
        </div>
        {edit.investorRegistered ? (
          <div>
            <select
              {...register("investor_registered")}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={tempData.investor_registered}
              onChange={(e) => handleInputChange(e, 'investor_registered')}
            >
              <option value="No" className='mr-2 text-sm'>No</option>
              <option value="Yes" className='mr-2 text-sm'>Yes</option>
            </select>
            {errors.investor_registered && (
              <p className="mt-1 text-sm text-red-500 font-bold text-left">
                {errors.investor_registered.message}
              </p>
            )}
          </div>
        ) : (
          <div className="flex justify-between items-center cursor-pointer py-1">
            <span className='mr-2 text-sm'>{getValues("investor_registered")}</span>
          </div>
        )}
      </div>

      {watch("investor_registered") === "Yes" && (
        <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3">
          <div className='flex justify-between items-center'>
            <label className="font-semibold  text-xs text-gray-500 uppercase mb-1">Registered Country</label>
            <img
              src={editp}
              className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
              alt="edit"
              onClick={() => handleEditClick('registeredCountry')}
            />
          </div>
          {edit.registeredCountry ? (
            <div>
              <select
                {...register("registered_country")}
                name="registered_country"
                value={tempData.registered_country}
                onChange={(e) => handleInputChange(e, 'registered_country')}
                className={`bg-gray-50 border-2 ${errors.registered_country ? "border-red-500" : "border-[#737373]"} text-gray-900 placeholder-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2 py-1`}
              >
                <option value="" className='text-sm font-bold'>Please choose an option </option>
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
            <div className="flex justify-between items-center cursor-pointer py-1">
              <span className='mr-2 text-sm'>{getValues("registered_country")} </span>
            </div>
          )}
        </div>
      )}

      <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3">
        <div className='flex justify-between items-center'>
          <label className="font-semibold  text-xs text-gray-500 uppercase mb-1">ICP hub you will like to be associated</label>
          <img
            src={editp}
            className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
            alt="edit"
            onClick={() => handleEditClick('preferredIcpHub')}
          />
        </div>
        {edit.preferredIcpHub ? (
          <div>
            <select
              {...register("preferred_icp_hub")}
              name="preferred_icp_hub"
              value={tempData.preferred_icp_hub}
              onChange={(e) => handleInputChange(e, 'preferred_icp_hub')}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Please choose an option</option>
              {getAllIcpHubs?.map((hub) => (
                <option key={hub.id} value={`${hub.name} ,${hub.region}`} className="text-lg font-bold">
                  {hub.name}, {hub.region}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="flex justify-between items-center cursor-pointer py-1">
            <span className='mr-2 text-sm'>{getValues("preferred_icp_hub")}</span>
          </div>
        )}
      </div>

      <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3">
        <div className='flex justify-between items-center'>
          <label className="font-semibold  text-xs text-gray-500 uppercase mb-1">Are you an existing ICP investor</label>
          <img
            src={editp}
            className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
            alt="edit"
            onClick={() => handleEditClick('existingIcpInvestor')}
          />
        </div>
        {edit.existingIcpInvestor ? (
          <div>
            <select
              {...register("existing_icp_investor")}
              value={tempData.existing_icp_investor}
              onChange={(e) => handleInputChange(e, 'existing_icp_investor')}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
            {errors.existing_icp_investor && (
              <p className="mt-1 text-sm text-red-500 font-bold text-left">
                {errors.existing_icp_investor.message}
              </p>
            )}
          </div>
        ) : (
          <div className="flex justify-between items-center cursor-pointer py-1">
            <span className='mr-2 text-sm'>{getValues("existing_icp_investor")}</span>
          </div>
        )}
      </div>


      {watch("existing_icp_investor") === 'Yes' && (
        <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3">
          <div className='flex justify-between items-center'>
            <label className="font-semibold  text-xs text-gray-500 uppercase mb-1">Type of investment</label>
            <img
              src={editp}
              className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
              alt="edit"
              onClick={() => handleEditClick('investment_type')}
            />
          </div>
          {edit.investment_type ? (
            <ReactSelect
              menuPortalTarget={document.body}
              menuPosition={"fixed"}
              styles={{
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                control: (provided, state) => ({
                  ...provided,
                  paddingBlock: "2px",
                  borderRadius: "8px",
                  border: "1px solid #737373",
                  backgroundColor: "rgb(249 250 251)",
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
                  color: "rgb(107 114 128)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }),
                singleValue: (provided) => ({
                  ...provided,


                  backgroundColor: "white",
                  border: "1px solid gray",
                  borderRadius: "5px"
                }),
              }}
              value={typeOfInvestSelectedOptions}
              options={typeOfInvestOptions}
              classNamePrefix="select"
              className="basic-select w-full text-start"
              placeholder="Select a investment type"
              name="investment_type"
              onChange={(selectedOption) => {
                if (selectedOption) {
                  setTypeOfInvestSelectedOptions(selectedOption);
                  setTempData(prev => ({
                    ...prev,
                    investment_type: selectedOption.value
                  }));
                  setValue("investment_type", selectedOption.value); // Update form value
                } else {
                  setTypeOfInvestSelectedOptions(null);
                  setTempData(prev => ({
                    ...prev,
                    investment_type: "",
                  }));
                  setValue("investment_type", ""); // Update form value
                }
              }}
            />
          ) : (
            <div className="flex justify-between items-center cursor-pointer " onClick={() => handleEditClick('investment_type')}>
              <span className='mr-2 text-sm'>{getValues("investment_type") || "No investment type selected"}</span>
            </div>
          )}
        </div>
      )}



      <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3">
        <div className='flex justify-between items-center'>
          <label className="font-semibold  text-xs text-gray-500 uppercase mb-1">Portfolio Link</label>
          <img
            src={editp}
            className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
            alt="edit"
            onClick={() => handleEditClick('portfolioLink')}
          />
        </div>
        {edit.portfolioLink ? (
          <div>
            <input
              {...register("investor_portfolio_link")}
              type="url"
              placeholder="Enter your portfolio url"
              name="investor_portfolio_link"
              className="block w-full border border-gray-300 rounded-md "
              value={tempData.investor_portfolio_link}
              onChange={(e) => handleInputChange(e, 'investor_portfolio_link')}
            />
            {errors?.investor_portfolio_link && (
              <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                {errors?.investor_portfolio_link?.message}
              </span>
            )}
          </div>
        ) : (
          <div className="flex justify-between items-center cursor-pointer py-1 ">
            <span className='mr-2 text-sm'>{getValues("investor_portfolio_link")}</span>
          </div>
        )}
      </div>

      <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3">
        <div className='flex justify-between items-center'>
          <label className="font-semibold  text-xs text-gray-500 uppercase mb-1">Fund Name</label>
          <img
            src={editp}
            className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
            alt="edit"
            onClick={() => handleEditClick('fundName')}
          />
        </div>
        {edit.fundName ? (
          <div>
            <input
              {...register("investor_fund_name")}
              type="text"
              placeholder="Enter your fund name"
              name="investor_fund_name"
              className="block w-full border border-gray-300 rounded-md "
              value={tempData.investor_fund_name}
              onChange={(e) => handleInputChange(e, 'investor_fund_name')}
            />
            {errors?.investor_fund_name && (
              <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                {errors?.investor_fund_name?.message}
              </span>
            )}
          </div>
        ) : (
          <div className="flex justify-between items-center cursor-pointer py-1">
            <span className='mr-2 text-sm'>{getValues("investor_fund_name")}</span>
          </div>
        )}
      </div>

      <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3">
        <div className='flex justify-between items-center'>
          <label className="font-semibold  text-xs text-gray-500 uppercase mb-1">Fund size (in million USD)</label>
          <img
            src={editp}
            className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
            alt="edit"
            onClick={() => handleEditClick('fundSize')}
          />
        </div>
        {edit.fundSize ? (
          <div>
            <input
              {...register("investor_fund_size")}
              type="number"
              placeholder="Enter fund size in Millions"
              name="investor_fund_size"
              className="block w-full border border-gray-300 rounded-md "
              value={tempData.investor_fund_size}
              onChange={(e) => handleInputChange(e, 'investor_fund_size')}
              onWheel={(e) => e.target.blur()}
            />
            {errors?.investor_fund_size && (
              <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                {errors?.investor_fund_size?.message}
              </span>
            )}
          </div>
        ) : (
          <div className="flex justify-between items-center cursor-pointer py-1">
            <span className='mr-2 text-sm'>{getValues("investor_fund_size")}</span>
          </div>
        )}
      </div>

      <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3">
        <div className='flex justify-between items-center'>
          <label className="font-semibold  text-xs text-gray-500 uppercase mb-1">Do you invest in multiple ecosystems? </label>
          <img
            src={editp}
            className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
            alt="edit"
            onClick={() => handleEditClick('invested_in_multiChain')}
          />
        </div>
        {edit.invested_in_multiChain ? (
          <div>
            <select
              {...register("invested_in_multi_chain")}
              value={tempData.invested_in_multi_chain}
              onChange={(e) => handleInputChange(e, 'invested_in_multi_chain')}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
            {errors.invested_in_multi_chain && (
              <p className="mt-1 text-sm text-red-500 font-bold text-left">
                {errors.invested_in_multi_chain.message}
              </p>
            )}
          </div>
        ) : (
          <div className="flex justify-between items-center cursor-pointer ">
            <span className='mr-2 text-sm'>{getValues("invested_in_multi_chain")}</span>
          </div>
        )}
      </div>

      {watch("invested_in_multi_chain") === 'Yes' && (
        <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3">
          <div className='flex justify-between items-center'>
            <label className="font-semibold text-xs text-gray-500 uppercase mb-1">Please select the chains </label>
            <img
              src={editp}
              className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
              alt="edit"
              onClick={() => handleEditClick('invested_in_multiChain')}
            />
          </div>
          {edit.invested_in_multiChain ? (
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
                  border: "2px solid #737373",
                  backgroundColor: "rgb(249 250 251)",
                  display: "flex",
                  overflowX: "hidden",
                  height: "24px",
                  maxHeight: "33px",
                  "&::-webkit-scrollbar": {
                    display: "none",
                  },
                }),
                valueContainer: (provided, state) => ({
                  ...provided,
                  overflow: "hidden",
                  height: "24px",
                  maxHeight: "30px",
                  scrollbarWidth: "none",
                }),
                placeholder: (provided, state) => ({
                  ...provided,
                  color: "rgb(107 114 128)",
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
                  setInvestedInMultiChainSelectedOptions(selectedOptions);
                  clearErrors("invested_in_multi_chain_names");
                  setTempData(prev => ({
                    ...prev,
                    invested_in_multi_chain_names: selectedOptions.map(option => option.value).join(", "),
                  }));
                  setValue("invested_in_multi_chain_names", selectedOptions.map(option => option.value).join(", "));
                } else {
                  setInvestedInMultiChainSelectedOptions([]);
                  setTempData(prev => ({
                    ...prev,
                    invested_in_multi_chain_names: "",
                  }));
                  setValue("invested_in_multi_chain_names", "");
                }
              }}
            />
          ) : (
            <div className="flex flex-wrap gap-2 cursor-pointer py-1">
              {profileData.invested_in_multi_chain_names ? (
                profileData.invested_in_multi_chain_names.split(", ").map((chain, index) => (
                  <span
                    key={index}
                    className='border-2 border-gray-500 rounded-full text-gray-700 text-xs px-2 py-1'
                  >
                    {chain}
                  </span>
                ))
              ) : (
                <span className='border-2 border-gray-500 rounded-full text-gray-700 text-xs px-2 py-1'>
                  No chains selected
                </span>
              )}
            </div>
          )}
        </div>
      )}
      <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3">
        <div className='flex justify-between items-center'>
          <label className="font-semibold  text-xs text-gray-500 uppercase mb-1">Category of investment</label>
          <img
            src={editp}
            className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
            alt="edit"
            onClick={() => handleEditClick('investedCategory')}
          />
        </div>
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
                  border: "2px solid #737373",
                  backgroundColor: "rgb(249 250 251)",
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
                  color: "rgb(107 114 128)",
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
                  setTempData(prev => ({
                    ...prev,
                    investment_categories: selectedOptions.map(option => option.value).join(", "),
                  }));
                  setValue("investment_categories", selectedOptions.map(option => option.value).join(", ")); // Update form value
                } else {
                  setInvestmentCategoriesSelectedOptions([]);
                  setTempData(prev => ({
                    ...prev,
                    investment_categories: "",
                  }));
                  setValue("investment_categories", ""); // Update form value
                }
              }}
            />
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 cursor-pointer py-1">
            {getValues("investment_categories") && typeof getValues("investment_categories") === 'string' ? (
              getValues("investment_categories")
                .split(", ")
                .map((category, index) => (
                  <span
                    key={index}
                    className='border-2 border-gray-500 rounded-full text-gray-700 text-xs px-2 py-1'
                  >
                    {category}
                  </span>
                ))
            ) : (
              <span className='border-2 border-gray-500 rounded-full text-gray-700 text-xs px-2 py-1'>
                Tooling
              </span>
            )}
          </div>
        )}
      </div>


      <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3">
        <div className='flex justify-between items-center'>
          <label className="font-semibold  text-xs text-gray-500 uppercase mb-1">Website Link</label>
          <img
            src={editp}
            className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
            alt="edit"
            onClick={() => handleEditClick('websiteLink')}
          />
        </div>
        {edit.websiteLink ? (
          <div>
            <input
              {...register("investor_website_url")}
              type="url"
              name="investor_website_url"
              placeholder="Enter your website url"
              className="block w-full border border-gray-300 rounded-md "
              value={tempData.investor_website_url}
              onChange={(e) => handleInputChange(e, 'investor_website_url')}
            />
            {errors?.investor_website_url && (
              <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                {errors?.investor_website_url?.message}
              </span>
            )}
          </div>
        ) : (
          <div className="flex justify-between items-center cursor-pointer py-1">
            <span className='mr-2 text-sm'>{getValues("investor_website_url")}</span>
          </div>
        )}
      </div>

      <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3">
        <div className='flex justify-between items-center'>
          <label className="font-semibold  text-xs text-gray-500 uppercase mb-1">LinkedIn Link</label>
          <img
            src={editp}
            className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
            alt="edit"
            onClick={() => handleEditClick('linkedInLink')}
          />
        </div>
        {edit.linkedInLink ? (
          <div>
            <input
              {...register("investor_linkedin_url")}
              type="url"
              name="investor_linkedin_url"
              placeholder="Enter your linkedin url"
              className="block w-full border border-gray-300 rounded-md "
              value={tempData.investor_linkedin_url}
              onChange={(e) => handleInputChange(e, 'investor_linkedin_url')}
            />
            {errors?.investor_linkedin_url && (
              <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                {errors?.investor_linkedin_url?.message}
              </span>
            )}
          </div>
        ) : (
          <div className="flex justify-between items-center cursor-pointer py-1">
            <span className='mr-2 text-sm'>{getValues("investor_linkedin_url")}</span>
          </div>
        )}
      </div>

      <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3">
        <div className='flex justify-between items-center'>
          <label className="font-semibold text-xs text-gray-500 uppercase mb-1">Which stage(s) do you invest at? </label>
          <img
            src={editp}
            className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
            alt="edit"
            onClick={() => handleEditClick('investmentStag')}
          />
        </div>
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
                  border: "2px solid #737373",
                  backgroundColor: "rgb(249 250 251)",
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
                  color: "rgb(107 114 128)",
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
                const selectedStages = selectedOptions.map(option => option.value).join(", ");
                setInvestStageSelectedOptions(selectedOptions);
                setTempData(prev => ({
                  ...prev,
                  investment_stage: selectedStages,
                }));
                setValue("investment_stage", selectedStages);
              }}
            />
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 cursor-pointer" onClick={() => handleEditClick('investmentStag')}>
            {(getValues("investment_stage") && typeof getValues("investment_stage") === 'string'
              ? getValues("investment_stage").split(", ")
              : []
            ).map((stage, index) => (
              <span key={index} className='border-2 border-gray-500 rounded-full text-gray-700 text-xs px-2 py-1'>
                {stage}
              </span>
            ))}
            {/* {!getValues("investment_stage") && (
              <span className='border-2 border-gray-500 rounded-full text-gray-700 text-xs px-2 py-1'>
                No stage selected
              </span>
            )} */}
          </div>
        )}
      </div>




      <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3">
        <div className='flex justify-between items-center'>
          <label className="font-semibold  text-xs text-gray-500 uppercase mb-1">What is the range of your check size?</label>
          <img
            src={editp}
            className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
            alt="edit"
            onClick={() => handleEditClick('investmentRange')}
          />
        </div>
        {edit.investmentRange ? (
          <div>
            <Select
              menuPortalTarget={document.body}
              menuPosition={"fixed"}
              styles={{
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                control: (provided, state) => ({
                  ...provided,
                  paddingBlock: "2px",
                  borderRadius: "8px",
                  border: errors.investment_stage_range ? "2px solid #ef4444" : "2px solid #737373",
                  backgroundColor: "rgb(249 250 251)",
                  "&::placeholder": {
                    color: errors.investment_stage_range ? "#ef4444" : "currentColor",
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
                  color: errors.investment_stage_range ? "#ef4444" : "rgb(107 114 128)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }),
                singleValue: (provided) => ({
                  ...provided,
                  display: "inline-flex",
                  alignItems: "center",
                  backgroundColor: "white",
                  border: "1px solid gray",
                  borderRadius: "5px"
                }),
              }}
              value={investStageRangeSelectedOptions}
              options={investStageRangeOptions}
              classNamePrefix="select"
              className="basic-select w-full text-start"
              placeholder="Select a range"
              name="investment_stage_range"
              onChange={(selectedOption) => {
                if (selectedOption) {
                  setInvestStageRangeSelectedOptions(selectedOption);
                  setTempData(prev => ({
                    ...prev,
                    investment_stage_range: selectedOption.value,
                  }));
                  setValue("investment_stage_range", selectedOption.value); // Update form value
                } else {
                  setInvestStageRangeSelectedOptions(null);
                  setTempData(prev => ({
                    ...prev,
                    investment_stage_range: "",
                  }));
                  setValue("investment_stage_range", getValues("investment_stage_range")); // Update form value
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
          <div className="flex justify-between items-center cursor-pointer py-1 " onClick={() => handleEditClick('investmentRange')}>
            <span className='mr-2 text-sm'>{getValues("investment_stage_range") || "No range selected"}</span>
          </div>
        )}
      </div>


      {(Object.values(edit).some(value => value)) && (
        <div className="flex justify-end gap-4 mt-4">
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-300 text-gray-700 py-2 px-4 rounded"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="bg-blue-600 text-white py-2 px-4 rounded"
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
};

export default InvestorDetail;

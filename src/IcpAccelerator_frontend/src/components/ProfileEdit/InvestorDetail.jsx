
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller ,useFieldArray} from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCountries } from "react-countries";
import Select from "react-select";
import ReactSelect from "react-select";
import { LinkedIn, GitHub, Telegram, Language } from "@mui/icons-material";
import { allHubHandlerRequest } from "../StateManagement/Redux/Reducers/All_IcpHubReducer";
import editp from "../../../assets/Logo/edit.png";
import { ThreeDots } from "react-loader-spinner";
import { FaPlus, FaTrash, FaSave } from "react-icons/fa";
import {Principal} from "@dfinity/principal"
import getReactSelectStyles from "../Utils/navigationHelper/getReactSelectStyles";
import { validationSchema } from "../Modals/investorForm/investorvalidation";
import getSocialLogo from "../Utils/navigationHelper/getSocialLogo";
import getPlatformFromHostname from "../Utils/navigationHelper/getPlatformFromHostname";


const InvestorDetail = () => {
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


    const [showbtn,setShowbtn]=useState(true)

  // form submit handler func
  const [socialLinks, setSocialLinks] = useState({});
  const [isEditingLink, setIsEditingLink] = useState({});
  const [isLinkBeingEdited, setIsLinkBeingEdited] = useState(false);
  const { fields, append, remove } = useFieldArray({
    control,
    name: "links",
  });

  const handleSaveLink = (key) => {
    setIsEditingLink((prev) => ({
      ...prev,
      [key]: false, // Exit editing mode for the saved link
    }));
  };

  // Handle adding new link from form field
  const handleSaveNewLink = (data, index) => {
    const linkKey = `custom-link-${Date.now()}-${index}`; // Generate unique key
    setSocialLinks((prevLinks) => ({
      ...prevLinks,
      [linkKey]: data, // Add new link to socialLinks state
    }));
    remove(index); // Remove the field after saving
  };

  // Toggle the editing of individual links
  const handleLinkEditToggle = (key) => {
    setIsEditingLink((prev) => ({
      ...prev,
      [key]: !prev[key], // Toggle the edit state for each link
    }));
    setIsLinkBeingEdited(!isLinkBeingEdited);
  };

  // Handle changes to individual links
  const handleLinkChange = (e, key) => {
    setSocialLinks((prev) => ({
      ...prev,
      [key]: e.target.value, // Update the specific link's value
    }));
  };

  // Handle deletion of existing links
  const handleLinkDelete = (key) => {
    setSocialLinks((prev) => {
      const updatedLinks = { ...prev };
      delete updatedLinks[key]; // Remove the link
      return updatedLinks;
    });
  };
 
 
  

  const setInvestorValuesHandler = (val) => {
    console.log('val',val)
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
      setValue(
        "preferred_icp_hub",
        val?.[0].profile?.params?.preferred_icp_hub ?? ""
      );
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
      const fundName = val?.[0].profile?.params?.name_of_fund || "";
      setValue("investor_fund_name", fundName.trim() ? fundName : "");
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
        if (val[0].profile?.params.links?.length) {
          const links = {};
          val[0].profile?.params.links?.forEach((linkArray) => {
            if (Array.isArray(linkArray)) {
              linkArray.forEach((linkData) => {
                const url = linkData.link?.[0];
                if (url && typeof url === "string") {
                  try {
                    const parsedUrl = new URL(url);
                    const hostname = parsedUrl.hostname.replace("www.", "");
                    const platform = getPlatformFromHostname(hostname);
                    links[platform] = url;
                  } catch (error) {
                    console.error("Invalid URL:", url, error);
                  }
                }
              });
            }
          });
          setSocialLinks(links);
        } else {
          setSocialLinks({});
        }
      }
      
      
    }
  };

 

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
  const stage = investorFullData[0]?.profile?.params?.stage;
  const range_of_check_size =
    investorFullData[0]?.profile?.params?.range_of_check_size;


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
        stage: false,
        range_of_check_size: false,
      });
    }
  };
 

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

  const onSubmitHandler = async (data) => {
    const updatedSocialLinks = Object.entries(socialLinks).map(([key, url]) => ({
      link: url ? [url] : [],
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
        stage: [data?.investment_stage?.split(", ").join(", ")] || [],
        range_of_check_size: [data?.investment_stage_range?.split(", ").join(", ")] || [],
        existing_icp_portfolio: [],
        registered_under_any_hub: [true],
        reason_for_joining: [],
        average_check_size: 0,
        money_invested: [parseInt(0)],
        links: updatedSocialLinks.length > 0 ? [updatedSocialLinks] : [],
        number_of_portfolio_companies: 0,
        assets_under_management: [""],
        type_of_investment: data?.type_of_investment || "",
      };

      console.log("Formatted investorData to send: ", investorData);

      try {
          const result = await actor.update_venture_capitalist(investorData);
          if (result?.includes("Profile updated successfully")) {
            toast.success("Profile updated successfully");
            navigate("/dashboard/profile")
          } else {
            toast.error(result);
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
              loading="lazy"
              draggable={false}
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
             
            </div>
          ) : (
            <div className="flex justify-between items-center cursor-pointer py-1">
              <span className="mr-2 text-sm truncate break-all">{registeredValue}</span>
            </div>
          )}
           {errors.investor_registered && (
                <p className="mt-1 text-sm text-red-500 font-bold text-left">
                  {errors.investor_registered.message}
                </p>
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
                loading="lazy"
                draggable={false}
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

                
              </div>
            ) : (
              <div className="flex justify-between items-center cursor-pointer py-1">
                <span className="mr-2 text-sm truncate break-all">{registered_country}</span>
              </div>
            )}
            {errors.registered_country && (
                  <p className="mt-1 text-sm text-red-500 font-bold text-left">
                    {errors.registered_country.message}
                  </p>
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
              loading="lazy"
              draggable={false}
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
             
            </div>
          ) : (
            <div className="flex justify-between items-center cursor-pointer py-1">
              <span className="mr-2 text-sm truncate break-all">{preferred_icp_hub}</span>
            </div>
          )}
           {errors.preferred_icp_hub && (
                <p className="mt-1 text-sm text-red-500 font-bold text-left">
                  {errors.preferred_icp_hub.message}
                </p>
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
              loading="lazy"
              draggable={false}
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
             
            </div>
          ) : (
            <div className="flex justify-between items-center cursor-pointer py-1">
              <span className="mr-2 text-sm truncate break-all">
                {getValues("existing_icp_investor") === "true" ? "Yes" : "No"}
              </span>
            </div>
          )}
           {errors.existing_icp_investor && (
                <p className="mt-1 text-sm text-red-500 font-bold text-left">
                  {errors.existing_icp_investor.message}
                </p>
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
                loading="lazy"
                draggable={false}
              />
            </div>
            {edit.investor_type ? (
              <ReactSelect
                isMulti
                menuPortalTarget={document.body}
                menuPosition={"fixed"}
                styles={getReactSelectStyles(errors?.investment_type)}
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
              loading="lazy"
              draggable={false}
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
              
            </div>
          ) : (
            <div className="flex justify-between items-center cursor-pointer py-1 ">
              <span className="mr-2 text-sm truncate break-all">{portfolio_link}</span>
            </div>
          )}
          {errors.investor_portfolio_link && (
                <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                  {errors.investor_portfolio_link.message}
                </span>
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
              loading="lazy"
              draggable={false}
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
             
            </div>
          ) : (
            <div className="flex justify-between items-center cursor-pointer py-1">
              <span className="mr-2 text-sm truncate break-all">{name_of_fund}</span>
            </div>
          )}
           {errors.investor_fund_name && (
                <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                  {errors.investor_fund_name.message}
                </span>
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
              loading="lazy"
              draggable={false}
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
             
            </div>
          ) : (
            <div className="flex justify-between items-center cursor-pointer py-1">
              <span className="mr-2 text-sm truncate break-all">{fund_size}</span>
            </div>
          )}
           {errors.investor_fund_size && (
                <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                  {errors.investor_fund_size.message}
                </span>
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
              loading="lazy"
              draggable={false}
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
         
          </div> :
          <div className="flex justify-between items-center cursor-pointer py-1">
          <span className="mr-2 text-sm truncate break-all">
            {getValues("invested_in_multi_chain") === "true" ? "Yes" : "No"}
          </span>
        </div>
          }
           {errors.invested_in_multi_chain && (
            <p className="mt-1 text-sm text-red-500 font-bold text-left">
              {errors.invested_in_multi_chain.message}
            </p>
          )}
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
                loading="lazy"
                draggable={false}
              />
            </div>
            {edit.project_on_multichain ? 
            <div className="">
               <ReactSelect
              isMulti
              menuPortalTarget={document.body}
              menuPosition={"fixed"}
              styles={getReactSelectStyles(errors?.invested_in_multi_chain_names)}
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
            {errors.invested_in_multi_chain_names && (
              <p className="mt-1 text-sm text-red-500 font-bold text-left">
                {errors.invested_in_multi_chain_names.message}
              </p>
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
              loading="lazy"
              draggable={false}
            />
          </div>
          {edit.category_of_investment ? (
            <div>
              <Select
                isMulti
                menuPortalTarget={document.body}
                menuPosition={"fixed"}
                styles={getReactSelectStyles(errors?.investment_categories)}
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
              loading="lazy"
              draggable={false}
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
              
            </div>
          ) : (
            <div className="flex justify-between items-center cursor-pointer py-1">
              <span className="mr-2 text-sm truncate break-all">{website_link}</span>
            </div>
          )}
          {errors.investor_website_url && (
                <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                  {errors.investor_website_url.message}
                </span>
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
              loading="lazy"
              draggable={false}
            />
          </div>
          {edit.stage ? (
            <div>
              <Select
                isMulti
                menuPortalTarget={document.body}
                menuPosition={"fixed"}
                styles={getReactSelectStyles(errors?.investment_stage)}
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
           {errors.investment_stage && (
                <p className="mt-1 text-sm text-red-500 font-bold text-left">
                  {errors.investment_stage.message}
                </p>
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
              loading="lazy"
              draggable={false}
            />
          </div>
          {edit.range_of_check_size ? (
            <div>
              <Select
                isMulti
                menuPortalTarget={document.body}
                menuPosition={"fixed"}
                styles={getReactSelectStyles(errors?.investment_stage_range)}
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
          {errors.investment_stage_range && (
                <p className="mt-1 text-sm text-red-500 font-bold text-left">
                  {errors.investment_stage_range.message}
                </p>
              )}
        </div>
        <h3 className="mb-2 text-xs text-gray-500 px-3">LINKS</h3>
        <div className="relative px-3">
                  <div className="flex flex-wrap gap-5">
                    {Object.keys(socialLinks)
                      .filter((key) => socialLinks[key]) // Only show links with valid URLs
                      .map((key, index) => {
                        const url = socialLinks[key];
                        const Icon = getSocialLogo(url); // Get the corresponding social icon
                        return (
                          <div
                            className="group relative flex items-center mb-3"
                            key={key}
                          >
                            {isEditingLink[key] ? (
                              <div className="flex w-full">
                                <div className="flex items-center w-full">
                                  <div className="flex items-center space-x-2 w-full">
                                    <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full">
                                      {Icon} {/* Display the icon */}
                                    </div>
                                    <input
                                      type="text"
                                      value={url}
                                      onChange={(e) => handleLinkChange(e, key)}
                                      className="border p-2 rounded-md w-full"
                                      placeholder="Enter your social media URL"
                                    />
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleSaveLink(key)} // Save the link
                                    className="ml-2 text-green-500 hover:text-green-700"
                                  >
                                    <FaSave />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleLinkDelete(key)} // Delete the link
                                    className="ml-2 text-red-500 hover:text-red-700"
                                  >
                                    <FaTrash />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <a
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center"
                                >
                                  {Icon} {/* Display the icon */}
                                </a>
                                <button
                                  type="button"
                                  className="absolute right-0 p-1 text-gray-500 text-xs transition-all duration-300 ease-in-out transform opacity-0 group-hover:opacity-100 group-hover:translate-x-6 h-10 w-7"
                                  onClick={() => handleLinkEditToggle(key)} // Toggle editing mode for this link
                                >
                                  <img src={editp} alt="edit"    loading="lazy"
                    draggable={false}/>
                                </button>
                              </>
                            )}
                          </div>
                        );
                      })}
                  </div>
                  {fields.map((item, index) => (
                    <div key={item.id} className="flex flex-col">
                      <div className="flex items-center mb-2 pb-1">
                        <Controller
                          name={`links[${index}].link`}
                          control={control}
                          render={({ field, fieldState }) => (
                            <div className="flex items-center w-full">
                              <div className="flex items-center space-x-2 w-full">
                                <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full">
                                  {field.value && getSocialLogo(field.value)}{" "}
                                  {/* Display logo for new link */}
                                </div>
                                <input
                                  type="text"
                                  placeholder="Enter your social media URL"
                                  className={`p-2 border ${
                                    fieldState.error
                                      ? "border-red-500"
                                      : "border-[#737373]"
                                  } rounded-md w-full bg-gray-50 border-2 border-[#D1D5DB]`}
                                  {...field}
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  handleSaveNewLink(field.value, index)
                                } // Save the new link
                                className="ml-2 text-green-500 hover:text-green-700"
                              >
                                <FaSave />
                              </button>
                              <button
                                type="button"
                                onClick={() => remove(index)} // Remove link field
                                className="ml-2 text-red-500 hover:text-red-700"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          )}
                        />
                      </div>
                    </div>
                  ))}
                  {fields.length < 10 && (
                    <button
                      type="button"
                      onClick={() => {
                        if (fields.length < 10) {
                          append({ link: "" });
                        }
                      }}
                      className="flex items-center p-1 text-[#155EEF]"
                    >
                      <FaPlus className="mr-1" /> Add Another Link
                    </button>
                  )}
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

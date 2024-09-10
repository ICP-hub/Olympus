import React, { useEffect, useState, useRef } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ReactSelect from "react-select";
import { LinkedIn, GitHub, Telegram, Language } from "@mui/icons-material";
import editp from "../../../assets/Logo/edit.png";
import { mentorRegisteredHandlerRequest } from "../StateManagement/Redux/Reducers/mentorRegisteredData";
import { allHubHandlerRequest } from "../../components/StateManagement/Redux/Reducers/All_IcpHubReducer";
import { ThreeDots } from "react-loader-spinner";
import getReactSelectStyles from "../Utils/navigationHelper/getReactSelectStyles";
const MentorEdit = () => {
  const dispatch = useDispatch();
  const actor = useSelector((currState) => currState.actors.actor);
  const getAllIcpHubs = useSelector((currState) => currState.hubs.allHubs);
  const multiChainNames = useSelector((currState) => currState.chains.chains);
  const isAuthenticated = useSelector(
    (currState) => currState.internet.isAuthenticated
  );
  const mentorFullData = useSelector(
    (currState) => currState.mentorData.data[0]
  );
  const areaOfExpertise = useSelector(
    (currState) => currState.expertiseIn.expertise
  );
  const typeOfProfile = useSelector(
    (currState) => currState.profileTypes.profiles
  );


  useEffect(() => {
    if (actor && isAuthenticated) {
      dispatch(mentorRegisteredHandlerRequest());
    }
  }, [dispatch, isAuthenticated, actor]);
  const [reasonOfJoiningOptions] = useState([
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
  
  const [reasonOfJoiningSelectedOptions, setReasonOfJoiningSelectedOptions] =
    useState([]);
  const validationSchema = yup.object().shape({
    preferred_icp_hub: yup.string().required("ICP Hub selection is required"),
    multi_chain: yup.string().required("Required").oneOf(["true", "false"], "Invalid value"),
    multi_chain_names: yup.string().when("multi_chain", (val, schema) =>
      val && val[0] === "true" ? schema.required("At least one chain name required") : schema
    ),
    category_of_mentoring_service: yup.string().required("Selecting a service is required"),
    icp_hub_or_spoke: yup.string().required("Required").oneOf(["true", "false"], "Invalid value"),
    hub_owner: yup.string().when("icp_hub_or_spoke", (val, schema) =>
      val && val[0] === "true" ? schema.required("ICP Hub selection is required") : schema
    ),
    mentor_website_url: yup
    .string()
      .nullable(true)
      .optional()
      .matches(/^[a-zA-Z0-9@.\/:\-]*$/, "Website Link should be valid")
      .test(
        "is-url-valid",
        "Invalid URL",
        (value) => !value || yup.string().url().isValidSync(value)
      ),

    years_of_mentoring: yup
    .number()
    .min(0, "Must be a non-negative number")
    .required(" Fund is required")
    .typeError("You must enter a number")
    .test(
      "not-negative-zero",
      "Negative zero (-0) is not allowed",
      (value) => Object.is(value, -0) === false
    ),
    
      links: yup.array().of(
        yup.object().shape({
          link: yup
            .string()
            .test(
              "no-leading-trailing-spaces",
              "URL should not have leading or trailing spaces",
              (value) => {
                return value === value?.trim();
              }
            )
            .test(
              "no-invalid-extensions",
              "URL should not end with .php, .js, or .txt",
              (value) => {
                const invalidExtensions = [".php", ".js", ".txt"];
                return value
                  ? !invalidExtensions.some((ext) => value.endsWith(ext))
                  : true;
              }
            )
            .test("is-website", "Only website links are allowed", (value) => {
              if (value) {
                try {
                  const url = new URL(value);
                  const hostname = url.hostname.toLowerCase();
                  const validExtensions = [
                    ".com",
                    ".org",
                    ".net",
                    ".in",
                    ".co",
                    ".io",
                    ".gov",
                  ];
                  const hasValidExtension = validExtensions.some((ext) =>
                    hostname.endsWith(ext)
                  );
                  return hasValidExtension;
                } catch (err) {
                  return false;
                }
              }
              return true;
            })
            .url("Invalid URL")
            .nullable(true)
            .optional(),
        })
      ),
  });

  
  
  // default & static options states
  const [interestedDomainsOptions, setInterestedDomainsOptions] = useState([]);
  const [
    interestedDomainsSelectedOptions,
    setInterestedDomainsSelectedOptions,
  ] = useState([]);
  const [typeOfProfileOptions, setTypeOfProfileOptions] = useState([]);

  // Mentor from states
  const [multiChainOptions, setMultiChainOptions] = useState([]);
  const [multiChainSelectedOptions, setMultiChainSelectedOptions] = useState(
    []
  );

  const [
    categoryOfMentoringServiceOptions,
    setCategoryOfMentoringServiceOptions,
  ] = useState([
    { value: "Incubation", label: "Incubation" },
    { value: "Tokenomics", label: "Tokenomics" },
    { value: "Branding", label: "Branding" },
    { value: "Listing", label: "Listing" },
    { value: "Raise", label: "Raise" },
  ]);
  const [
    categoryOfMentoringServiceSelectedOptions,
    setCategoryOfMentoringServiceSelectedOptions,
  ] = useState([]);

  const {
    register,
    handleSubmit,
    clearErrors,
    setValue,
    getValues,
    setError,
    watch,
    trigger,
    formState: { errors, isSubmitting },
    control,
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "all",
    // defaultValues,
  });

  const [edit, setEdit] = useState({
    preferred_icp_hub: false,
    multi_chain: false,
    multichain: false,
    category_of_mentoring_service: false,
    icp_hub_or_spoke: false,
    hub_owner: false,
    years_of_mentoring: false,
    mentor_linkedin_url: false,
    website: false,
    reason_for_joining: false,
    area_of_expertise: false,
  });

  const handleEditClick = (field) => {
    setEdit({ ...edit, [field]: true });
  };


  const { fields, append, remove } = useFieldArray({
    name: "links",
    control,
  });
  const [socialLinks, setSocialLinks] = useState({});
  const [isEditingLink, setIsEditingLink] = useState({});
  const [isLinkBeingEdited, setIsLinkBeingEdited] = useState(false);

  const handleLinkEditToggle = (link) => {
    setIsEditingLink((prev) => ({
      ...prev,
      [link]: !prev[link],
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
  const onSubmitHandler = async (data) => {
    console.log("my submit data on submit", data);

    const updatedSocialLinks = Object.entries(socialLinks).map(([key, url]) => ({
      link: url ? [url] : []
  }));

  const multichainNames = data.multi_chain === "true"
  ? Array.isArray(data.multi_chain_names) && data.multi_chain_names.length > 0
    ? data.multi_chain_names.map(name => name.trim())
    : []
  : [];


    const area_of_expertise = Array.isArray(data.area_of_expertise)
        ? data.area_of_expertise
        : typeof data.area_of_expertise === "string"
            ? data.area_of_expertise.split(",").map(item => item.trim())
            : [];
    const mentorData = {
        preferred_icp_hub: [data?.preferred_icp_hub || ""],
        icp_hub_or_spoke: data?.icp_hub_or_spoke === "true" ? true : false,
        hub_owner: [
            data?.icp_hub_or_spoke === "true" && data?.hub_owner
                ? data?.hub_owner
                : "",
        ],
        category_of_mentoring_service: data?.category_of_mentoring_service,
        years_of_mentoring: data.years_of_mentoring.toString(),
        linkedin_link: data?.mentor_linkedin_url,
        multichain: multichainNames?.length > 0 ? [multichainNames] : [],
        website: [data?.mentor_website_url || ""],
        existing_icp_mentor: false,
        existing_icp_project_porfolio: data.existing_icp_project_porfolio ? [data.existing_icp_project_porfolio] : [],
        area_of_expertise: area_of_expertise ? area_of_expertise : [],
        links: updatedSocialLinks.length > 0 ? [updatedSocialLinks] : [],

        reason_for_joining: data.reasons_to_join_platform
    ? [data.reasons_to_join_platform]
    : [],
    };

    console.log("my submit mentorData on submit", mentorData);

    try {
        const result = await actor.update_mentor(mentorData);
        console.log("on submit mera result update data ja raha hai  ....", result);
        if (result) {
            toast.success("Update successfully");
            // window.location.href = "/";
        } else {
            toast.error(result);
        }
    } catch (error) {
        toast.error(error.message || "An unexpected error occurred");
        console.error("Error sending data to the backend:", error);
    }
    setEdit(false);
    setIsLinkBeingEdited(false);
};





const setReasonOfJoiningSelectedOptionsHandler = (val) => {
  setReasonOfJoiningSelectedOptions(
    val && Array.isArray(val)
      ? val.map((reason) => ({ value: reason, label: reason }))
      : []
  );
};
  // set mentor values handler
  const setMentorValuesHandler = (val) => {
    console.log("mera mentor data aa gya in val",val)
    if (val) {
      setValue(
        "type_of_profile",
        val[0]?.profile?.type_of_profile?.[0]
          ? val[0]?.profile?.type_of_profile?.[0]
          : ""
      );
      setValue(
        "reasons_to_join_platform",
        val[0]?.profile?.reason_for_joining?.length
          ? val[0]?.profile?.reason_for_joining.join(", ")
          : ""
      );
      setReasonOfJoiningSelectedOptionsHandler(val[0]?.profile?.reason_for_joining);

      setValue("area_of_expertise", val[0]?.profile?.area_of_expertise?.[0] ?? "");
      setValue(
        "category_of_mentoring_service",
        val[0]?.profile?.category_of_mentoring_service ?? ""
      );
      setCategoryOfMentoringServiceSelectedOptionsHandler(
        val[0]?.profile?.category_of_mentoring_service ?? null
      );
      setValue("existing_icp_mentor", val[0]?.profile?.existing_icp_mentor ?? "");
      setValue(
        "existing_icp_project_porfolio",
        val[0]?.profile?.existing_icp_project_porfolio?.[0] ?? ""
      );
      setValue("icp_hub_or_spoke", val[0]?.profile?.icp_hub_or_spoke ?? "");
      if (val[0]?.profile?.icp_hub_or_spoke === true) {
        setValue("icp_hub_or_spoke", "true");
      } else {
        setValue("icp_hub_or_spoke", "false");
      }
      setValue("hub_owner", val[0]?.profile?.hub_owner ? val[0]?.profile?.hub_owner?.[0] : "");
      setValue("mentor_linkedin_url", val[0]?.profile?.linkedin_link ?? "");
      if (val[0]?.profile?.multichain?.[0]) {
        setValue("multi_chain", "true");
      } else {
        setValue("multi_chain", "false");
      }
      setValue(
        "multi_chain_names",
        val[0]?.profile?.multichain?.[0] ? val[0]?.profile?.multichain?.[0] : ""
      );
      setMultiChainSelectedOptionsHandler(val[0]?.profile?.multichain ?? null);
      setValue(
        "preferred_icp_hub",
        val[0]?.profile?.preferred_icp_hub ? val[0]?.profile?.preferred_icp_hub?.[0] : ""
      );
      setValue("mentor_website_url", val[0]?.profile?.website?.[0] ?? "");
      setValue("years_of_mentoring", val[0]?.profile?.years_of_mentoring ?? "");
      if (val[0]?.profile?.links?.length) {
        const links = {};

        val[0]?.profile?.links.forEach((linkArray) => {
          linkArray.forEach((linkData) => {
            const url = linkData.link[0];

            if (url && typeof url === "string") {
              if (url.includes("linkedin.com")) {
                links["LinkedIn"] = url;
              } else if (url.includes("github.com")) {
                links["GitHub"] = url;
              } else if (url.includes("t.me") || url.includes("telegram")) {
                links["Telegram"] = url;
              } else {
                const domainKey = new URL(url).hostname.replace("www.", "");
                links[domainKey] = url;
              }
            }
          });
        });

        setSocialLinks(links);
      } else {
        setSocialLinks({});
      }
    }
  };
  const handleCancel = () => {
    setEdit({
      preferred_icp_hub: false,
      multichain: false,
      category_of_mentoring_service: false,
      icp_hub_or_spoke: false,
      hub_owner: false,
      years_of_mentoring: false,
      mentor_linkedin_url: false,
      website: false,
      reason_for_joining: false,
    });
  };

  const editableRef = useRef(null);

  const handleClickOutside = (event) => {
    if (editableRef.current && !editableRef.current.contains(event.target)) {
      handleCancel();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);



  // form error handler func
  const onErrorHandler = (val) => {
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


  const setCategoryOfMentoringServiceSelectedOptionsHandler = (val) => {
    setCategoryOfMentoringServiceSelectedOptions(
      val
        ? val.split(", ").map((reason) => ({ value: reason, label: reason }))
        : []
    );
  };
  const setMultiChainSelectedOptionsHandler = (val) => {
    if (val && val.length > 0 && typeof val[0] === 'string') {
        setMultiChainSelectedOptions(
            val[0].split(", ").map((chain) => ({ value: chain, label: chain }))
        );
    } else {
        setMultiChainSelectedOptions([]);
    }
};


  useEffect(() => {
    dispatch(allHubHandlerRequest());
  }, [actor, dispatch]);

  useEffect(() => {
    if (mentorFullData) {
      console.log("Mentor full data ==>", mentorFullData);
      setMentorValuesHandler(mentorFullData);
    } 
  }, [ mentorFullData]);
console.log("mentor full data ...../",mentorFullData)
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
  // Mentor form states
  useEffect(() => {
    if (multiChainNames) {
      setMultiChainOptions(
        multiChainNames.map((chain) => ({
          value: chain,
          label: chain,
        }))
      );
    } else {
      setMultiChainOptions([]);
    }
  }, [multiChainNames]);



  // data 
  const domains_interested_in = mentorFullData[0]?.profile?.area_of_interest ?? "";
  const type_of_profile = mentorFullData[0]?.profile?.type_of_profile?.[0] ?? "";
  const reasons_to_join_platform = mentorFullData[0]?.profile?.reason_for_joining ?? "";
  const area_of_expertise = mentorFullData[0]?.profile?.area_of_expertise?.[0] ?? "";
  const category_of_mentoring_service = mentorFullData[0]?.profile?.category_of_mentoring_service ?? "";
  const existing_icp_mentor = mentorFullData[0]?.profile?.existing_icp_mentor ?? "";
  const existing_icp_project_porfolio = mentorFullData[0]?.profile?.existing_icp_project_porfolio?.[0] ?? "";
  const icp_hub_or_spoke = mentorFullData[0]?.profile?.icp_hub_or_spoke ? "true" : "false";
  const hub_owner = mentorFullData[0]?.profile?.hub_owner?.[0] ?? "";
  const mentor_linkedin_url = mentorFullData[0]?.profile?.linkedin_link ?? "";
  const multi_chain = mentorFullData[0]?.profile?.multichain?.length ? "true" : "false";
  const multi_chain_names = mentorFullData[0]?.profile?.multichain?.join(", ") ?? "";
  const preferred_icp_hub = mentorFullData[0]?.profile?.preferred_icp_hub?.[0] ?? "";
  const mentor_website_url = mentorFullData[0]?.profile?.website?.[0] ?? "";
  const years_of_mentoring = mentorFullData[0]?.profile?.years_of_mentoring ?? "";
  const multichain = multi_chain ? "Yes" : "No";
  const spoke=icp_hub_or_spoke ? "Yes" : "No";
  return (
    <div ref={editableRef} className="bg-white p-4 ">
      <form onSubmit={handleSubmit(onSubmitHandler, onErrorHandler)}>
        <div className="my-1 relative group hover:bg-slate-50 rounded p-1 mb-1">
          <div className="absolute right-0 top-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <img
              src={editp}
              className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
              alt="edit"
              onClick={() => handleEditClick("preferred_icp_hub")}
            />
          </div>
          <label className="block mb-2 text-xs font-semibold text-gray-500">
            ICP HUB YOU WILL LIKE TO BE ASSOCIATED
          </label>
          {edit.preferred_icp_hub ? (
            <select
              {...register("preferred_icp_hub")}
              className={`bg-gray-50 border-2 ${
                errors.preferred_icp_hub
                  ? "border-red-500 "
                  : "border-[#737373]"
              } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
            >
              <option className="text-lg font-bold" value="">
                Select your ICP Hub
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
          ) : (
            <div className="flex justify-between items-center cursor-pointer text-sm">
              <span>{preferred_icp_hub}</span>
            </div>
          )}
        {errors.preferred_icp_hub && (
  <p className="mt-1 text-sm text-red-500">{errors.preferred_icp_hub.message}</p>
)}

        </div>

        <div className="my-1 relative group hover:bg-slate-50 rounded p-1 mb-1">
          <div className="absolute right-1 top-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <img
              src={editp}
              className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
              alt="edit"
              onClick={() => handleEditClick("multi_chain")}
            />
          </div>
          <label className="block mb-1 text-xs font-semibold text-gray-500">
            DO YOU MENTOR MULTIPLE ECOSYSTEMS
          </label>
          {edit.multi_chain ? (
            <select
              {...register("multi_chain")}
              className={`bg-gray-50 border-2 ${
                errors.multi_chain ? "border-red-500" : "border-[#737373]"
              } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
            >
              <option className="text-lg font-bold" value="false">
                No
              </option>
              <option className="text-lg font-bold" value="true">
                Yes
              </option>
            </select>
          ) : (
            <div className="flex justify-between items-center cursor-pointer p-1">
              <span>{multichain}</span>
            </div>
          )}
        </div>

        {watch("multi_chain") === "true" ? (
           <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3 mb-2">
           <div className="flex justify-between items-center">
                 <label className="block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start">
                 Please select the chains <span className="text-red-500">*</span>
                 </label>
                 <img
                   src={editp}
                   className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
                   alt="edit"
                   onClick={() => handleEditClick("multi_chain_names")}
                 />
               </div>
           {edit.multi_chain_names ? (
                 <div>
            <ReactSelect
  isMulti
  menuPortalTarget={document.body}
  menuPosition={"fixed"}
  styles={getReactSelectStyles(errors?.multi_chain_names)}
  value={multiChainSelectedOptions}
  options={multiChainOptions}
  classNamePrefix="select"
  className="basic-multi-select w-full text-start"
  placeholder="Select a chain"
  name="multi_chain_names"
  onChange={(selectedOptions) => {
    if (selectedOptions && selectedOptions.length > 0) {
      setMultiChainSelectedOptions(selectedOptions);
      clearErrors("multi_chain_names");
      setValue(
        "multi_chain_names",
        selectedOptions.map((option) => option.value).join(", "),
        { shouldValidate: true }
      );
    } else {
      setMultiChainSelectedOptions([]);
      setValue("multi_chain_names", "", {
        shouldValidate: true,
      });
      setError("multi_chain_names", {
        type: "required",
        message: "At least one chain name required",
      });
    }
  }}
/>

            {errors.multi_chain_names && (
              <p className="mt-1 text-sm text-red-500 font-bold text-left">
                {errors.multi_chain_names.message}
              </p>
            )}
                 </div>
               ) : (
                 <div className="flex justify-between items-center cursor-pointer py-1">
                   <span className="mr-2 text-sm">
                   {multi_chain_names}
                   </span>
                 </div>
               )}
          
         </div>

        
        ) : (
          <>
            <div className="flex justify-between items-center cursor-pointer p-1">
              <span>{multi_chain_names}</span>
            </div>
            </>
        )}

        <div className="relative group hover:bg-slate-50 rounded p-1 mb-2">
          <div className="absolute right-2 top-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <img
              src={editp}
              className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
              alt="edit"
              onClick={() => handleEditClick("category_of_mentoring_service")}
            />
          </div>
          <label className="block mb-1 text-xs font-semibold text-gray-500">
            CATEGORIES OF MENTORING SERVICES
          </label>
          {edit.category_of_mentoring_service ? (
            <ReactSelect
              isMulti
              menuPortalTarget={document.body}
              menuPosition={"fixed"}
              styles={getReactSelectStyles(errors?.category_of_mentoring_service)}
              value={categoryOfMentoringServiceSelectedOptions}
              options={categoryOfMentoringServiceOptions}
              classNamePrefix="select"
              className="basic-multi-select w-full text-start"
              placeholder="Select a service"
              name="category_of_mentoring_service"
              onChange={(selectedOptions) => {
                if (selectedOptions && selectedOptions.length > 0) {
                  setCategoryOfMentoringServiceSelectedOptions(selectedOptions);
                  clearErrors("category_of_mentoring_service");
                  setValue(
                    "category_of_mentoring_service",
                    selectedOptions.map((option) => option.value).join(", "),
                    { shouldValidate: true }
                  );
                } else {
                  setCategoryOfMentoringServiceSelectedOptions([]);
                  setValue("category_of_mentoring_service", "", {
                    shouldValidate: true,
                  });
                  setError("category_of_mentoring_service", {
                    type: "required",
                    message: "Atleast one service name required",
                  });
                }
              }}
            />
          ) : (
            <div className="flex flex-wrap gap-2 cursor-pointer py-1">
            <div className="flex flex-wrap gap-2 cursor-pointer py-1">
  {category_of_mentoring_service &&
    category_of_mentoring_service.split(", ").map((service, index) => (
      <span
        key={index}
        className="border-2 border-gray-500 rounded-full text-gray-700 text-xs px-2 py-1"
      >
        {service}
      </span>
    ))}
</div>

          </div>
          
          )}
        </div>
        <div className="relative group hover:bg-slate-50 rounded p-1 mb-2">
          <div class="absolute right-2 top-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <img
              src={editp}
              class="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
              alt="edit"
              onClick={() => handleEditClick("reason_for_joining")}
            />
          </div>
          <label className="block mb-1 text-xs font-semibold text-gray-500">
            REASON FOR JOINING THIS PLATFORM
          </label>
          {edit.reason_for_joining ? (
             <ReactSelect
             isMulti
             menuPortalTarget={document.body}
             menuPosition={"fixed"}
             styles={getReactSelectStyles(errors?.reasons_to_join_platform)}
             value={reasonOfJoiningSelectedOptions}
             options={reasonOfJoiningOptions}
             classNamePrefix="select"
             className="basic-multi-select w-full text-start"
             placeholder="Select your reasons to join this platform"
             name="reasons_to_join_platform"
             onChange={(selectedOptions) => {
              if (selectedOptions && selectedOptions.length > 0) {
                setReasonOfJoiningSelectedOptions(selectedOptions);
                clearErrors("reasons_to_join_platform");
                setValue(
                  "reasons_to_join_platform",
                  selectedOptions.map((option) => option.value).join(", "),
                  { shouldValidate: true }
                );
              } else {
                setReasonOfJoiningSelectedOptions([]);
                setValue("reasons_to_join_platform", "", {
                  shouldValidate: true,
                });
                setError("reasons_to_join_platform", {
                  type: "required",
                  message: "Selecting a reason is required",
                });
              }
            }}
            
           />
          ) : (
            <div className="flex flex-wrap gap-2 cursor-pointer py-1">
            {reasons_to_join_platform && Array.isArray(reasons_to_join_platform) && reasons_to_join_platform.length > 0 &&
              reasons_to_join_platform[0].split(', ').map((reason, index) => (
                <span
                  key={index}
                  className="border-2 border-gray-500 rounded-full text-gray-700 text-xs px-2 py-1"
                >
                  {reason}
                </span>
              ))}
          </div>
          
          
          )}
        </div>

        <div className="my-1 relative group hover:bg-slate-50 rounded p-1 mb-2">
          <div className="absolute right-2 top-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <img
              src={editp}
              className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
              alt="edit"
              onClick={() => handleEditClick("icp_hub_or_spoke")}
            />
          </div>
          <label className="block mb-1 text-xs font-semibold text-gray-500">
            ARE YOU ICP HUB/SPOKE
          </label>
          {edit.icp_hub_or_spoke ? (
            <>
              <select
                {...register("icp_hub_or_spoke")}
                className={`bg-gray-50 border-2 ${
                  errors.icp_hub_or_spoke
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
              {errors.icp_hub_or_spoke && (
                <p className="mt-1 text-sm text-red-500 font-bold text-left">
                  {errors.icp_hub_or_spoke.message}
                </p>
              )}
            </>
          ) : (
            <div className="flex justify-between items-center cursor-pointer p-1">
              <span>{spoke}</span>
            </div>
          )}
        </div>

        {watch("icp_hub_or_spoke") === "true" ? (
          <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3 mb-2">
            <div className="flex justify-between items-center">
                  <label className="block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start">
                  Hub Owner <span className="text-red-500">*</span>
                  </label>
                  <img
                    src={editp}
                    className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
                    alt="edit"
                    onClick={() => handleEditClick("hub_owner")}
                  />
                </div>
            {edit.hub_owner ? (
                  <div>
                   <select
              {...register("hub_owner")}
              className={`bg-gray-50 border-2 ${
                errors.hub_owner
                  ? "border-red-500 placeholder:text-red-500"
                  : "border-[#737373]"
              } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
            >
              <option className="text-lg font-bold" value="">
                Select your ICP Hub
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
            {errors.hub_owner && (
              <p className="mt-1 text-sm text-red-500 font-bold text-left">
                {errors.hub_owner.message}
              </p>
            )}
                  </div>
                ) : (
                  <div className="flex justify-between items-center cursor-pointer py-1">
                    <span className="mr-2 text-sm">
                    {hub_owner}
                    </span>
                  </div>
                )}
           
          </div>
        ) : (
          <>
          </>
        )}

        <div className="my-1 relative group hover:bg-slate-50 rounded p-1 mb-2">
          <div className="absolute right-2 top-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <img
              src={editp}
              className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
              alt="edit"
              onClick={() => handleEditClick("website")}
            />
          </div>
          <label className="block mb-1 text-xs font-semibold text-gray-500">
            WEBSITE LINK
          </label>
          {edit.website ? (
            <>
              <input
                type="text"
                {...register("mentor_website_url")}
                className={`bg-gray-50 border-2 
                                                ${
                                                  errors?.mentor_website_url
                                                    ? "border-red-500 "
                                                    : "border-[#737373]"
                                                } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                placeholder="Enter your website url"
              />
              {errors?.mentor_website_url && (
                <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                  {errors?.mentor_website_url?.message}
                </span>
              )}
            </>
          ) : (
            <div className="flex justify-between items-center cursor-pointer p-1 text-sm">
              <span>{mentor_website_url}</span>
            </div>
          )}
        </div>

        <div className="my-1 relative group hover:bg-slate-50 rounded p-1 mb-2">
          <div className="absolute right-2 top-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <img
              src={editp}
              className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
              alt="edit"
              onClick={() => handleEditClick("years_of_mentoring")}
            />
          </div>
          <label className="block mb-1 text-xs font-semibold text-gray-500">
            YEARS OF MENTORING <span className="text-red-500 ml-2">*</span>
          </label>
          {edit.years_of_mentoring ? (
            <>
              <input
                type="number"
                {...register("years_of_mentoring")}
                className={`bg-gray-50 border-2 
                                                ${
                                                  errors?.years_of_mentoring
                                                    ? "border-red-500 "
                                                    : "border-[#737373]"
                                                } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                placeholder="Enter your mentoring experience years"
                onWheel={(e) => e.target.blur()}
                min={0}
              />
              {errors?.years_of_mentoring && (
                <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                  {errors?.years_of_mentoring?.message}
                </span>
              )}
            </>
          ) : (
            <div className="flex justify-between items-center cursor-pointer p-1">
              <span>{years_of_mentoring}</span>
            </div>
          )}
        </div>
        <h3 className="mb-2 text-xs text-gray-500 px-3">LINKS</h3>
          <div className="flex items-center gap-5 px-3">
            {/* Display existing links */}
            {console.log("Display existing links ", socialLinks)}
            {socialLinks &&
              Object.keys(socialLinks).map((key, index) => {
                const url = socialLinks[key];
                if (!url) {
                  return null;
                }

                const Icon = getIconForLink(url);
                return (
                  <div className="group relative flex items-center" key={index}>
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
                      onClick={() => handleLinkEditToggle(key)}
                    >
                      <img src={editp} alt="edit" />
                    </button>
                    {isEditingLink[key] && (
                      <input
                        type="text"
                        {...register(`social_links[${key}]`)}
                        value={url}
                        onChange={(e) => handleLinkChange(e, key)}
                        className="border p-1 rounded w-full ml-2 transition-all duration-300 ease-in-out transform"
                      />
                    )}
                  </div>
                );
              })}
          </div>
        {/* {Object.values(edit).some((value) => value) && ( */}
                          {(Object.values(edit).some((value) => value) || isLinkBeingEdited ) && (
          <div className="flex justify-end gap-4 mt-4">
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
              ) : edit ? (
                "Update"
              ) : (
                "Submit"
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default MentorEdit;

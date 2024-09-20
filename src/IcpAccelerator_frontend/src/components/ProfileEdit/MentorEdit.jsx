import React, { useEffect, useState, useRef } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import ReactSelect from "react-select";
import { FaPlus, FaTrash, FaSave } from "react-icons/fa";
import editp from "../../../assets/Logo/edit.png";
import { mentorRegisteredHandlerRequest } from "../StateManagement/Redux/Reducers/mentorRegisteredData";
import { allHubHandlerRequest } from "../StateManagement/Redux/Reducers/All_IcpHubReducer";
import { ThreeDots } from "react-loader-spinner";
import getReactSelectStyles from "../Utils/navigationHelper/getReactSelectStyles";
import { validationSchema } from "../Modals/Mentor-Signup-Model/mentorValidation";
import getPlatformFromHostname from "../Utils/navigationHelper/getPlatformFromHostname";
import getSocialLogo from "../Utils/navigationHelper/getSocialLogo";

const MentorEdit = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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

  });
  const reasonForJoining = watch("reasons_to_join_platform");
  const [isFormTouched, setIsFormTouched] = useState({
    reason_for_joining: false,
  });

  const handleFieldTouch = (fieldName) => {
    setIsFormTouched((prevState) => ({
      ...prevState,
      [fieldName]: true,
    }));
  };
  const [edit, setEdit] = useState({
    preferred_icp_hub: false,
    multi_chain: false,
    multichain: false,
    category_of_mentoring_service: false,
    icp_hub_or_spoke: false,
    hub_owner: false,
    years_of_mentoring: false,
    website: false,
    reasons_to_join_platform: false,
    area_of_expertise: false,
  });

  const handleEditClick = (field) => {
    setEdit({ ...edit, [field]: true });
  };

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

  const onSubmitHandler = async (data) => {
    console.log("my submit data on submit", data);

    const updatedSocialLinks = Object.entries(socialLinks).map(
      ([key, url]) => ({
        link: url ? [url] : [],
      })
    );

    const mentorData = {
      preferred_icp_hub: [data?.preferred_icp_hub || ""],
      icp_hub_or_spoke: data?.icp_hub_or_spoke === "true",
      hub_owner: [
        data?.icp_hub_or_spoke === "true" && data?.hub_owner
          ? data?.hub_owner
          : "",
      ],
      category_of_mentoring_service: data?.category_of_mentoring_service,
      years_of_mentoring: data.years_of_mentoring.toString(),
      multichain: Array.isArray(data.multi_chain_names)
        ? data.multi_chain_names
        : [],
      website: [data?.mentor_website_url || ""],
      existing_icp_mentor: false,
      existing_icp_project_porfolio: data.existing_icp_project_porfolio
        ? [data.existing_icp_project_porfolio]
        : [],
      area_of_expertise: Array.isArray(data.area_of_expertise)
        ? data.area_of_expertise
        : [data.area_of_expertise || ""],
      links: updatedSocialLinks.length > 0 ? [updatedSocialLinks] : [],

      reason_for_joining: data.reasons_to_join_platform
        ? [data.reasons_to_join_platform]
        : [],
    };

    console.log("my submit mentorData on submit", mentorData);

    try {
      const result = await actor.update_mentor(mentorData);
      console.log(
        "on submit mera result update data ja raha hai  ....",
        result
      );
      if (result) {
        toast.success("Update successfully");
        dispatch(mentorRegisteredHandlerRequest());
        navigate("/dashboard/profile");
      } else {
        toast.error(result);
        dispatch(mentorRegisteredHandlerRequest());
        navigate("/dashboard/profile");
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
    console.log("mera mentor data aa gya in val", val);
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
      setReasonOfJoiningSelectedOptionsHandler(
        val[0]?.profile?.reason_for_joining
      );
      setValue(
        "area_of_expertise",
        val[0]?.profile?.area_of_expertise[0]
          ? val[0]?.profile?.area_of_expertise[0]
          : ""
      );
      setInterestedDomainsSelectedOptionsHandler(
        val[0]?.profile?.area_of_expertise ?? null
      );
      setValue(
        "category_of_mentoring_service",
        val[0]?.profile?.category_of_mentoring_service ?? ""
      );
      setCategoryOfMentoringServiceSelectedOptionsHandler(
        val[0]?.profile?.category_of_mentoring_service ?? null
      );
      setValue(
        "existing_icp_mentor",
        val[0]?.profile?.existing_icp_mentor ?? ""
      );
      setValue(
        "existing_icp_project_porfolio",
        val[0]?.profile?.existing_icp_project_porfolio?.[0] ?? ""
      );
      setValue("icp_hub_or_spoke", val[0]?.profile?.icp_hub_or_spoke === true ? "true" : "false" );
     
      setValue(
        "hub_owner",
        val[0]?.profile?.hub_owner ? val[0]?.profile?.hub_owner?.[0] : ""
      );
      setValue("mentor_linkedin_url", val[0]?.profile?.linkedin_link ?? "");
      setValue(
        "multi_chain",
        val[0]?.profile?.multichain.length > 0 ? "true" : "false"
      );

      setValue(
        "multi_chain_names",
        val[0]?.profile?.multichain?.[0]
          ? val[0]?.profile?.multichain?.[0].join(", ")
          : ""
      );
      setMultiChainSelectedOptionsHandler(
        val[0]?.profile?.multichain?.[0] ?? null
      );
      setValue(
        "preferred_icp_hub",
        val[0]?.profile?.preferred_icp_hub
          ? val[0]?.profile?.preferred_icp_hub?.[0]
          : ""
      );
      setValue("mentor_website_url", val[0]?.profile?.website?.[0] ?? "");
      setValue("years_of_mentoring", val[0]?.profile?.years_of_mentoring ?? "");
      if (val[0]?.profile?.links?.length) {
        const links = {};
        // Iterate over the social_links array
        val[0]?.profile?.links.forEach((linkArray) => {
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
    console.log("errors", val);
    toast.error("Empty fields or invalid values, please recheck the form");
  };

  // default interests set function
  const setInterestedDomainsSelectedOptionsHandler = (val) => {
    setInterestedDomainsSelectedOptions(
      val
        ? val?.[0]
            .split(", ")
            .map((interset) => ({ value: interset, label: interset }))
        : []
    );
  };

  const setCategoryOfMentoringServiceSelectedOptionsHandler = (val) => {
    setCategoryOfMentoringServiceSelectedOptions(
      val
        ? val
            .split(", ")
            .map((reason) => ({ value: reason.trim(), label: reason }))
        : []
    );
  };
  const setMultiChainSelectedOptionsHandler = (val) => {
    setMultiChainSelectedOptions(
      val
        ? val?.[0].split(", ").map((chain) => ({ value: chain, label: chain }))
        : []
    );
  };

  useEffect(() => {
    dispatch(allHubHandlerRequest());
  }, [actor, dispatch]);

  useEffect(() => {
    if (mentorFullData) {
      setMentorValuesHandler(mentorFullData);
    }
  }, [mentorFullData]);
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
  const reasons_to_join_platform =
    mentorFullData[0]?.profile?.reason_for_joining ?? "";
  const area_of_expertise = mentorFullData[0]?.profile?.area_of_expertise ?? "";
  const category_of_mentoring_service =
    mentorFullData[0]?.profile?.category_of_mentoring_service ?? "";
  const existing_icp_mentor =
    mentorFullData[0]?.profile?.existing_icp_mentor ?? "";
  const existing_icp_project_porfolio =
    mentorFullData[0]?.profile?.existing_icp_project_porfolio?.[0] ?? "";
  const icp_hub_or_spoke = mentorFullData[0]?.profile?.icp_hub_or_spoke
    ? "Yes"
    : "No";
  const hub_owner = mentorFullData[0]?.profile?.hub_owner?.[0] ?? "";
  const multi_chain =
    mentorFullData[0]?.profile?.multichain.length > 0 ? "true" : "false";
  const multi_chain_names = mentorFullData[0]?.profile?.multichain[0] ?? "";
  const preferred_icp_hub =
    mentorFullData[0]?.profile?.preferred_icp_hub?.[0] ?? "";
  const mentor_website_url = mentorFullData[0]?.profile?.website?.[0] ?? "";
  const years_of_mentoring =
    mentorFullData[0]?.profile?.years_of_mentoring ?? "";
  const multichain = multi_chain  === true ? "Yes" : "No";
  console.log("domains_interested_in", area_of_expertise);
  return (
    <div ref={editableRef} className="bg-white p-2 ">
      <form onSubmit={handleSubmit(onSubmitHandler, onErrorHandler)}>
        <div className="my-1 relative group  hover:bg-gray-100 rounded-lg p-2 px-3">
        <div className="absolute right-2 top-1 visible lgx:invisible lgx:group-hover:visible transition-opacity duration-200  ">
        <img
              src={editp}
              className="visible lgx:invisible lgx:group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4 transition-opacity duration-300
              "               alt="edit"
              onClick={() => handleEditClick("preferred_icp_hub")}
              loading="lazy"
              draggable={false}
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
              } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1`}
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
            <p className="mt-1 text-sm text-red-500">
              {errors.preferred_icp_hub.message}
            </p>
          )}
        </div>
        <div className="my-1 group relative hover:bg-gray-100 rounded-lg p-2 px-3">
          <div className="flex justify-between">
            <h3 className="font-semibold mb-2 text-xs text-gray-500 uppercase">
              Area of Expertise
            </h3>
            <div>
              <button
                type="button"
                className="visible lgx:invisible lgx:group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4 transition-opacity duration-300
                "                onClick={() => handleEditClick("area_of_expertise")}
              >
                {edit.area_of_expertise ? (
                  ""
                ) : (
                  <img src={editp} loading="lazy" draggable={false} />
                )}
              </button>
            </div>
          </div>
          {edit.area_of_expertise ? (
            <>
              <ReactSelect
                isMulti
                menuPortalTarget={document.body}
                menuPosition={"fixed"}
                styles={getReactSelectStyles(errors?.area_of_expertise)}
                value={interestedDomainsSelectedOptions}
                options={interestedDomainsOptions}
                classNamePrefix="select"
                className="basic-multi-select w-full text-start"
                placeholder="Select domains you are interested in"
                name="area_of_expertise"
                onChange={(selectedOptions) => {
                  if (selectedOptions && selectedOptions.length > 0) {
                    setInterestedDomainsSelectedOptions(selectedOptions);
                    clearErrors("area_of_expertise");
                    setValue(
                      "area_of_expertise",
                      selectedOptions.map((option) => option.value).join(", "),
                      { shouldValidate: true }
                    );
                  } else {
                    setInterestedDomainsSelectedOptions([]);
                    setValue("area_of_expertise", "", {
                      shouldValidate: true,
                    });
                    setError("area_of_expertise", {
                      type: "required",
                      message: "Selecting an interest is required",
                    });
                  }
                }}
              />
            </>
          ) : (
            <div className="flex gap-2 overflow-x-auto">
              {area_of_expertise[0].split(",").map((interest, index) => (
                <span
                  key={index}
                  className="border-2 border-gray-500 rounded-full text-gray-700 text-xs px-2 py-1 break-words"
                >
                  {interest}
                </span>
              ))}
            </div>
          )}
          {errors.area_of_expertise && (
            <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
              {errors.area_of_expertise.message}
            </span>
          )}
        </div>
        <div className="my-1 relative group  hover:bg-gray-100 rounded-lg p-2 px-3">
        <div className="absolute right-2 top-1 visible lgx:invisible lgx:group-hover:visible transition-opacity duration-200  ">
        <img
              src={editp}
              className="visible lgx:invisible lgx:group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4 transition-opacity duration-300
              "               alt="edit"
              onClick={() => handleEditClick("multi_chain")}
              loading="lazy"
              draggable={false}
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
              } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1`}
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
          {errors.multi_chain && (
            <p className="mt-1 text-sm text-red-500 font-bold text-left">
              {errors.multi_chain.message}
            </p>
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
                className="visible lgx:invisible lgx:group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4 transition-opacity duration-300
                "                 alt="edit"
                onClick={() => handleEditClick("multi_chain_names")}
                loading="lazy"
                draggable={false}
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
                        selectedOptions
                          .map((option) => option.value)
                          .join(", "),
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
              </div>
            ) : (
              <div className="flex justify-between items-center cursor-pointer py-1">
                <div className="flex gap-2 overflow-x-auto">
                  {multi_chain_names.map((chain, index) => (
                    <span
                      key={index}
                      className="border-2 border-gray-500 rounded-full text-gray-700 text-xs px-2 py-1 break-words"
                    >
                      {chain}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {errors.multi_chain_names && (
              <p className="mt-1 text-sm text-red-500 font-bold text-left">
                {errors.multi_chain_names.message}
              </p>
            )}
          </div>
        ) : (
          ""
        )}

        <div className="relative group hover:bg-gray-100 rounded-lg p-2 px-3">
          <div className="absolute right-2 top-1 visible lgx:invisible lgx:group-hover:visible transition-opacity duration-200  ">
            <img
              src={editp}
              className="visible lgx:invisible lgx:group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4 transition-opacity duration-300
              "              alt="edit"
              onClick={() => handleEditClick("category_of_mentoring_service")}
              loading="lazy"
              draggable={false}
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
              styles={getReactSelectStyles(
                errors?.category_of_mentoring_service
              )}
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
            <div className="flex overflow-x-auto gap-2 cursor-pointer py-1">
              {category_of_mentoring_service &&
                category_of_mentoring_service
                  .split(", ")
                  .map((service, index) => (
                    <span
                      key={index}
                      className="border-2 border-gray-500 rounded-full text-gray-700 text-xs px-2 py-1"
                    >
                      {service}
                    </span>
                  ))}
            </div>
          )}
          {errors.category_of_mentoring_service && (
            <p className="mt-1 text-sm text-red-500 font-bold text-left">
              {errors.category_of_mentoring_service.message}
            </p>
          )}
        </div>
        <div className="relative group  hover:bg-gray-100 rounded-lg p-2 px-3">
        <div className="absolute right-2 top-1 visible lgx:invisible lgx:group-hover:visible transition-opacity duration-200  ">
        <img
              src={editp}
              className="visible lgx:invisible lgx:group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4 transition-opacity duration-300
              "               alt="edit"
              onClick={() => handleEditClick("reasons_to_join_platform")}
              loading="lazy"
              draggable={false}
            />
          </div>
          <label className="block mb-1 text-xs font-semibold text-gray-500">
            REASON FOR JOINING THIS PLATFORM
          </label>
          {edit.reasons_to_join_platform ? (
            <div>
              <ReactSelect
            isMulti
            menuPortalTarget={document.body}
            menuPosition={"fixed"}
            styles={getReactSelectStyles(errors?.reasons_to_join_platform
              &&
            isFormTouched.reasons_to_join_platform
            )}
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
              handleFieldTouch("reasons_to_join_platform");
            }}
          />
            </div>
          ) : (
            <div className="flex overflow-x-auto gap-2 cursor-pointer py-1">
              {reasons_to_join_platform &&
                Array.isArray(reasons_to_join_platform) &&
                reasons_to_join_platform.length > 0 &&
                reasons_to_join_platform[0].split(", ").map((reason, index) => (
                  <span
                    key={index}
                    className="border-2 border-gray-500 rounded-full text-gray-700 text-xs px-2 py-1"
                  >
                    {reason}
                  </span>
                ))}
            </div>
          )}
          {errors.reasons_to_join_platform && (
            <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
              {errors.reasons_to_join_platform.message}
            </span>
          )}
        </div>
        <div className="my-1 relative group  hover:bg-gray-100 rounded-lg p-2 px-3">
        <div className="absolute right-2 top-1 visible lgx:invisible lgx:group-hover:visible transition-opacity duration-200  ">
        <img
              src={editp}
              className="visible lgx:invisible lgx:group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4 transition-opacity duration-300
              "               alt="edit"
              onClick={() => handleEditClick("icp_hub_or_spoke")}
              loading="lazy"
              draggable={false}
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
                } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1`}
              >
                <option className="text-lg font-bold" value="false">
                  No
                </option>
                <option className="text-lg font-bold" value="true">
                  Yes
                </option>
              </select>
            </>
          ) : (
            <div className="flex justify-between items-center cursor-pointer p-1">
              <span>{icp_hub_or_spoke}</span>
            </div>
          )}
          {errors.icp_hub_or_spoke && (
            <p className="mt-1 text-sm text-red-500 font-bold text-left">
              {errors.icp_hub_or_spoke.message}
            </p>
          )}
        </div>

        {watch("icp_hub_or_spoke") === "true" ? (
          <div className="group relative  hover:bg-gray-100 rounded-lg p-2 px-3">
            <div className="flex justify-between items-center">
              <label className="block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start">
                Hub Owner <span className="text-red-500">*</span>
              </label>
              <img
                src={editp}
                className="visible lgx:invisible lgx:group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4 transition-opacity duration-300
                "                 alt="edit"
                onClick={() => handleEditClick("hub_owner")}
                loading="lazy"
                draggable={false}
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
                  } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1`}
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
              </div>
            ) : (
              <div className="flex justify-between items-center cursor-pointer py-1">
                <span className="mr-2 text-sm">{hub_owner}</span>
              </div>
            )}
            {errors.hub_owner && (
              <p className="mt-1 text-sm text-red-500 font-bold text-left">
                {errors.hub_owner.message}
              </p>
            )}
          </div>
        ) : (
          <></>
        )}

        <div className="my-1 relative group  hover:bg-gray-100 rounded-lg p-2 px-3">
        <div className="absolute right-2 top-1 visible lgx:invisible lgx:group-hover:visible transition-opacity duration-200  ">
        <img
              src={editp}
              className="visible lgx:invisible lgx:group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4 transition-opacity duration-300
              "               alt="edit"
              onClick={() => handleEditClick("website")}
              loading="lazy"
              draggable={false}
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
                                                } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1`}
                placeholder="Enter your website url"
              />
            </>
          ) : (
            <div className="flex justify-between items-center cursor-pointer p-1 text-sm">
              <span>{mentor_website_url}</span>
            </div>
          )}
          {errors?.mentor_website_url && (
            <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
              {errors?.mentor_website_url?.message}
            </span>
          )}
        </div>

        <div className="my-1 relative group  hover:bg-gray-100 rounded-lg p-2 px-3">
        <div className="absolute right-2 top-1 visible lgx:invisible lgx:group-hover:visible transition-opacity duration-200  ">
        <img
              src={editp}
              className="visible lgx:invisible lgx:group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4 transition-opacity duration-300
              "               alt="edit"
              onClick={() => handleEditClick("years_of_mentoring")}
              loading="lazy"
              draggable={false}
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
                                                } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1`}
                placeholder="Enter your mentoring experience years"
                onWheel={(e) => e.target.blur()}
                min={0}
              />
            </>
          ) : (
            <div className="flex justify-between items-center cursor-pointer p-1">
              <span>{years_of_mentoring}</span>
            </div>
          )}
          {errors?.years_of_mentoring && (
            <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
              {errors?.years_of_mentoring?.message}
            </span>
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
                          className="absolute right-0 p-1 text-gray-500 text-xs transition-all duration-300 translate-x-6 ease-in-out transform opacity-100 lgx:opacity-0 lgx:group-hover:opacity-100 md:group-hover:translate-x-6 h-10 w-7"
                          onClick={() => handleLinkEditToggle(key)} // Toggle editing mode for this link
                        >
                          <img
                            src={editp}
                            alt="edit"
                            loading="lazy"
                            draggable={false}
                          />
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
                        onClick={() => handleSaveNewLink(field.value, index)} // Save the new link
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
        {/* {Object.values(edit).some((value) => value) && ( */}
        {(Object.values(edit).some((value) => value) || isLinkBeingEdited) && (
          <div className="flex justify-end gap-4 mt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-300 text-gray-700 px-4 rounded mb-4"
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

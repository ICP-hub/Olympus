import React, { useEffect, useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ReactSelect from "react-select";
import editp from "../../../assets/Logo/edit.png";
import { mentorRegisteredHandlerRequest } from "../StateManagement/Redux/Reducers/mentorRegisteredData";
import { allHubHandlerRequest } from "../../components/StateManagement/Redux/Reducers/All_IcpHubReducer";

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

  // SELECTOR TO ACCESS AREA OF EXPERTISE DATA FROM REDUX STORE
  const areaOfExpertise = useSelector(
    (currState) => currState.expertiseIn.expertise
  );

  useEffect(() => {
    if (actor && isAuthenticated) {
      dispatch(mentorRegisteredHandlerRequest());
    }
  }, [dispatch, isAuthenticated, actor]);

  const validationSchema = yup.object().shape({
    preferred_icp_hub: yup.string().required("ICP Hub selection is required"),
    multi_chain: yup
      .string()
      .required("Required")
      .oneOf(["Yes", "No"], "Invalid value"),
    multichain: yup.string().when("multi_chain", (val, schema) =>
      val && val === "Yes"
        ? schema.required("At least one chain name required")
        : schema
    ),
    category_of_mentoring_service: yup
      .string()
      .required("Selecting a service is required"),
    icp_hub_or_spoke: yup
      .string()
      .required("Required")
      .oneOf(["Yes", "No"], "Invalid value"),
    hub_owner: yup.string().when("icp_hub_or_spoke", (val, schema) =>
      val && val === "Yes"
        ? schema.required("ICP Hub selection is required")
        : schema
    ),
    website: yup.string().url("Invalid URL"),
    years_of_mentoring: yup
      .number()
      .typeError("You must enter a number")
      .positive("Must be a positive number")
      .required("Years of experience mentoring startups is required"),
    mentor_linkedin_url: yup
      .string()
      .url("Invalid URL")
      .required("LinkedIn URL is required"),
  });

  const defaultValues = {
    preferred_icp_hub: mentorFullData?.profile?.preferred_icp_hub ?? "",
    multi_chain: mentorFullData?.profile?.multi_chain ?? null,
    multichain: mentorFullData?.profile?.multichain?.join(", "),
    category_of_mentoring_service: mentorFullData[0].profile?.category_of_mentoring_service ?? "",
   
    icp_hub_or_spoke: mentorFullData[0].profile?.icp_hub_or_spoke ?? null,
 hub_owner: mentorFullData[0].profile?.hub_owner ?? "",
 years_of_mentoring: mentorFullData[0].profile?.years_of_mentoring ?? 0,
 website: mentorFullData[0].profile?.website?.[0] ?? "",
    reason_for_joining:mentorFullData[0].profile?.reason_for_joining?.[0],
    preferred_icp_hub: mentorFullData[0].profile?.preferred_icp_hub?.[0] ?? " chiku sangwan",
    multichain: mentorFullData[0].profile?.multichain?.[0] ??"",
    area_of_expertise:mentorFullData[0].profile?.area_of_expertise?? "" ,
    // multichain: mentorFullData[0].profile?.multichain?.join(", ") ?? "",
   links: mentorFullData[0].profile?.links??"",
   existing_icp_project_porfolio: mentorFullData[0].profile?.existing_icp_project_porfolio??"",
  
  };
  console.log("defalult values",defaultValues)

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    setError,
    watch,
    formState: { errors },
    control,
    clearErrors,
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "all",
    defaultValues,
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
    area_of_expertise:false,
  });

  const handleEditClick = (field) => {
    setEdit({ ...edit, [field]: true });
  };

  const handleSave = async () => {
    if (Object.keys(errors).length === 0) {
      try {
        const linksValue = getValues("links");
        const mentorData = {
          preferred_icp_hub: getValues("preferred_icp_hub")
            ? [getValues("preferred_icp_hub")]
            : null,
          // multi_chain: getValues("multi_chain") === "Yes" ? "Yes" : null,
          multichain: getValues("multichain")
            ? getValues("multichain").split(", ")
            : null,
          category_of_mentoring_service: getValues("category_of_mentoring_service") || null,
          icp_hub_or_spoke: getValues("icp_hub_or_spoke") === "Yes",
          hub_owner: getValues("hub_owner")
          ? [getValues("hub_owner")]
          : null,
          years_of_mentoring: getValues("years_of_mentoring") || null,
          mentor_linkedin_url: getValues("mentor_linkedin_url") || null,
          website: getValues("website")
          ? [getValues("website")]
          : null,
          reason_for_joining: getValues("reason_for_joining")
            ? [getValues("reason_for_joining")]
            : null,
            links: linksValue?.links
          ? [linksValue.links.map((val) => ({ link: val?.link ? [val.link] : [] }))] // PREPARE LINKS DATA
          : [],
            existing_icp_mentor: false,
            area_of_expertise :getValues("area_of_expertise") || null,
            existing_icp_project_porfolio: getValues("existing_icp_project_porfolio") || null,
        };
        

        console.log("mentorData:", mentorData);

        const result = await actor.update_mentor(mentorData);
        if (result && result.includes("approval request is sent")) {
          toast.success("Approval request is sent");
          window.location.href = "/";
        } else {
          toast.error(result);
        }
      } catch (error) {
        toast.error("Error updating mentor data");
        console.error("Error:", error);
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

  useEffect(() => {
    dispatch(allHubHandlerRequest());
  }, [actor, dispatch]);

  return (
    <div ref={editableRef} className="bg-white p-4 rounded shadow">
      <form>
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
              value={getValues("preferred_icp_hub")}
              onChange={(e) =>
                setValue("preferred_icp_hub", e.target.value, {
                  shouldValidate: true,
                })
              }
              className={`shadow appearance-none border rounded w-full py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.preferred_icp_hub ? "border-red-500" : ""
              }`}
            >
              <option className="text-lg font-medium" value="">
                Select your ICP Hub
              </option>
              {getAllIcpHubs?.map((hub) => (
                <option
                  key={hub.id}
                  value={`${hub.name}, ${hub.region}`}
                  className="text-lg font-medium"
                >
                  {hub.name}, {hub.region}
                </option>
              ))}
            </select>
          ) : (
            <div className="flex justify-between items-center cursor-pointer text-sm">
              <span>{getValues("preferred_icp_hub")}</span>
            </div>
          )}
          {errors.preferred_icp_hub && (
            <p className="mt-1 text-sm text-red-500 font-bold text-left">
              {errors.preferred_icp_hub.message}
            </p>
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
              value={getValues("multi_chain")}
              onChange={(e) =>
                setValue("multi_chain", e.target.value, {
                  shouldValidate: true,
                })
              }
              className="shadow appearance-none border rounded w-full py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option className="text-lg" value="No">
                No
              </option>
              <option className="text-lg" value="Yes">
                Yes
              </option>
            </select>
          ) : (
            <div className="flex justify-between items-center cursor-pointer p-1">
              <span>{getValues("multi_chain")}</span>
            </div>
          )}
        </div>

        {watch("multi_chain") === "Yes" && (
        <div className="relative group hover:bg-slate-50 rounded p-1 mb-2">
            <div className="flex justify-between items-center">
              <label className="font-semibold  text-xs text-gray-500 uppercase mb-1">
                PLEASE SELECT CHAINS
              </label>
              <img
                src={editp}
                className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
                alt="edit"
                onClick={() => handleEditClick("multichain")}
              />
            </div>
            {edit.multichain ? (
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
                    border: errors.multichain
                      ? "2px solid #ef4444"
                      : "2px solid #737373",
                    backgroundColor: "rgb(249 250 251)",
                    "&::placeholder": {
                      color: errors.multichain
                        ? "#ef4444"
                        : "currentColor",
                    },
                    display: "flex",
                    overflowX: "auto",
                    maxHeight: "30px",
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
                    color: errors.multichain
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
                value={getValues("multichain")
                  .split(", ")
                  .map((chain) => ({
                    value: chain,
                    label: chain,
                  }))}
                options={multiChainNames.map((chain) => ({
                  value: chain,
                  label: chain,
                }))}
                classNamePrefix="select"
                className="basic-multi-select w-full text-start"
                placeholder="Select a chain"
                name="multichain"
                onChange={(selectedOptions) => {
                  if (selectedOptions && selectedOptions.length > 0) {
                    setValue(
                      "multichain",
                      selectedOptions.map((option) => option.value).join(", "),
                      { shouldValidate: true }
                    );
                  } else {
                    setValue("multichain", "", {
                      shouldValidate: true,
                    });
                    setError("multichain", {
                      type: "required",
                      message: "At least one chain name required",
                    });
                  }
                }}
              />
            ) : (
              <div className="flex flex-wrap gap-2 cursor-pointer py-1">
                {getValues("multichain") &&
                typeof getValues("multichain") === "string"
                  ? getValues("multichain")
                      .split(", ")
                      .map((category, index) => (
                        <span
                          key={index}
                          className="border-2 border-gray-500 rounded-full text-gray-700 text-xs px-2 py-1"
                        >
                          {category}
                        </span>
                      ))
                  : ""}
              </div>
            )}
          </div>
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
              styles={{
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                control: (provided, state) => ({
                  ...provided,
                  paddingBlock: "0px",
                  borderRadius: "8px",
                  border: errors.category_of_mentoring_service
                    ? "2px solid #ef4444"
                    : "2px solid #737373",
                  backgroundColor: "rgb(249 250 251)",
                  "&::placeholder": {
                    color: errors.category_of_mentoring_service
                      ? "#ef4444"
                      : "currentColor",
                  },
                  display: "flex",
                  alignItems: "start",
                  overflowX: "auto",
                  maxHeight: "33px",
                  "&::-webkit-scrollbar": {
                    display: "none",
                  },
                }),
                valueContainer: (provided, state) => ({
                  ...provided,
                  overflow: "scroll",
                  maxHeight: "43px",
                  scrollbarWidth: "none",
                }),
                placeholder: (provided, state) => ({
                  ...provided,
                  color: errors.category_of_mentoring_service
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
                }),
                multiValueRemove: (provided) => ({
                  ...provided,
                  display: "inline-flex",
                  alignItems: "center",
                }),
              }}
              value={getValues("category_of_mentoring_service")
                .split(", ")
                .map((service) => ({
                  value: service,
                  label: service,
                }))}
              options={[
                { value: "Incubation", label: "Incubation" },
                { value: "Tokenomics", label: "Tokenomics" },
                { value: "Branding", label: "Branding" },
                { value: "Listing", label: "Listing" },
                { value: "Raise", label: "Raise" },
              ]}
              classNamePrefix="select"
              className="basic-multi-select w-full text-start"
              placeholder="Select a service"
              name="category_of_mentoring_service"
              onChange={(selectedOptions) => {
                if (selectedOptions && selectedOptions.length > 0) {
                  setValue(
                    "category_of_mentoring_service",
                    selectedOptions.map((option) => option.value).join(", "),
                    { shouldValidate: true }
                  );
                } else {
                  setValue("category_of_mentoring_service", "", {
                    shouldValidate: true,
                  });
                  setError("category_of_mentoring_service", {
                    type: "required",
                    message: "At least one service name required",
                  });
                }
              }}
            />
          ) : (
            <div className="flex flex-wrap gap-2 cursor-pointer py-1">
              {getValues("category_of_mentoring_service") &&
              typeof getValues("category_of_mentoring_service") === "string"
                ? getValues("category_of_mentoring_service")
                    .split(", ")
                    .map((service, index) => (
                      <span
                        key={index}
                        className="border-2 border-gray-500 rounded-full text-gray-700 text-xs px-2 py-1"
                      >
                        {service}
                      </span>
                    ))
                : ""}
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
              styles={{
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                control: (provided, state) => ({
                  ...provided,
                  paddingBlock: "0px",
                  borderRadius: "8px",
                  border: errors.reason_for_joining
                    ? "2px solid #ef4444"
                    : "2px solid #737373",
                  backgroundColor: "rgb(249 250 251)",
                  "&::placeholder": {
                    color: errors.reason_for_joining
                      ? "#ef4444"
                      : "currentColor",
                  },
                  display: "flex",
                  alignItems: "start",
                  overflowX: "auto",
                  maxHeight: "33px",
                  "&::-webkit-scrollbar": {
                    display: "none",
                  },
                }),
                valueContainer: (provided, state) => ({
                  ...provided,
                  overflow: "scroll",
                  maxHeight: "43px",
                  scrollbarWidth: "none",
                }),
                placeholder: (provided, state) => ({
                  ...provided,
                  color: errors.reason_for_joining
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
                }),
                multiValueRemove: (provided) => ({
                  ...provided,
                  display: "inline-flex",
                  alignItems: "center",
                }),
              }}
              value={reasonOfJoiningSelectedOptions}
              options={reasonOfJoiningOptions}
              classNamePrefix="select"
              className="basic-multi-select w-full text-start"
              placeholder="Select your reasons to join this platform"
              name="reason_for_joining"
              onChange={(selectedOptions) => {
                if (selectedOptions && selectedOptions.length > 0) {
                  setReasonOfJoiningSelectedOptions(selectedOptions);
                  clearErrors("reason_for_joining");
                  setValue(
                    "reason_for_joining",
                    selectedOptions.map((option) => option.value).join(", "),
                    { shouldValidate: true }
                  );
                } else {
                  setReasonOfJoiningSelectedOptions([]);
                  setValue("reason_for_joining", "", {
                    shouldValidate: true,
                  });
                  setError("reason_for_joining", {
                    type: "required",
                    message: "Selecting a reason is required",
                  });
                }
              }}
            />
          ) : (
            <div className="flex flex-wrap gap-2 cursor-pointer py-1">
              {getValues("reason_for_joining") &&
              typeof getValues("reason_for_joining") === "string"
                ? getValues("reason_for_joining")
                    .split(", ")
                    .map((reason, index) => (
                      <span
                        key={index}
                        className="border-2 border-gray-500 rounded-full text-gray-700 text-xs px-2 py-1"
                      >
                        {reason}
                      </span>
                    ))
                : ""}
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
            <Controller
              name="icp_hub_or_spoke"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  id="icp_hub_or_spoke"
                  value={getValues("icp_hub_or_spoke")}
                  onChange={(e) =>
                    setValue("icp_hub_or_spoke", e.target.value, {
                      shouldValidate: true,
                    })
                  }
                  className="shadow appearance-none border rounded w-full py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option className="text-lg" value="No">
                    No
                  </option>
                  <option className="text-lg" value="Yes">
                    Yes
                  </option>
                </select>
              )}
            />
          ) : (
            <div className="flex justify-between items-center cursor-pointer p-1">
              <span>{getValues("icp_hub_or_spoke")}</span>
            </div>
          )}
        </div>

        {watch("icp_hub_or_spoke") === "Yes" && (
        <div className="relative group hover:bg-slate-50 rounded p-1 mb-2">
            <div className="flex justify-between items-center">
              <label className="font-semibold text-xs text-gray-500 uppercase mb-1">
                HUB OWNER
              </label>
              <img
                src={editp}
                className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
                alt="edit"
                onClick={() => handleEditClick("hub_owner")}
              />
            </div>
            {edit.hub_owner ? (
              <select
                {...register("hub_owner")}
                value={getValues("hub_owner")}
                onChange={(e) =>
                  setValue("hub_owner", e.target.value, {
                    shouldValidate: true,
                  })
                }
                className={`bg-gray-50 border ${
                  errors.hub_owner
                    ? "border-red-500 placeholder:text-red-500"
                    : "border-[#737373]"
                } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5`}
              >
                <option className="text-lg font-medium" value="">
                  Select your ICP Hub
                </option>
                {getAllIcpHubs?.map((hub) => (
                  <option
                    key={hub.id}
                    value={`${hub.name}, ${hub.region}`}
                    className="text-lg font-medium"
                  >
                    {hub.name}, {hub.region}
                  </option>
                ))}
              </select>
            ) : (
              <div className="flex justify-between items-center cursor-pointer py-1">
                <span className="mr-2 text-sm">{getValues("hub_owner")}</span>
              </div>
            )}
            {errors.hub_owner && (
              <p className="mt-1 text-sm text-red-500 font-bold text-left">
                {errors.hub_owner.message}
              </p>
            )}
          </div>
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
            <input
              {...register("website")}
              type="url"
              value={getValues("website")}
              onChange={(e) =>
                setValue("website", e.target.value, {
                  shouldValidate: true,
                })
              }
              placeholder="Enter your website URL"
              className="block w-full border border-gray-300 rounded-md p-[2px]"
            />
          ) : (
            <div className="flex justify-between items-center cursor-pointer p-1 text-sm">
              <span>{getValues("website")}</span>
            </div>
          )}
          {errors.website && (
            <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
              {errors.website.message}
            </span>
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
            <input
              {...register("years_of_mentoring")}
              type="number"
              value={getValues("years_of_mentoring")}
              onChange={(e) =>
                setValue("years_of_mentoring", e.target.value, {
                  shouldValidate: true,
                })
              }
              placeholder="Enter your years of mentoring"
              className="block w-full border border-gray-300 rounded-md p-[2px]"
              required
            />
          ) : (
            <div className="flex justify-between items-center cursor-pointer p-1">
              <span>{getValues("years_of_mentoring")}</span>
            </div>
          )}
          {errors.years_of_mentoring && (
            <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
              {errors.years_of_mentoring.message}
            </span>
          )}
        </div>

        <div className="my-1 relative group hover:bg-slate-50 rounded p-1 mb-2">
          <div className="absolute right-2 top-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <img
              src={editp}
              className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
              alt="edit"
              onClick={() => handleEditClick("mentor_linkedin_url")}
            />
          </div>
          <label className="block mb-1 text-xs font-semibold text-gray-500">
           LINKS <span className="text-red-500 ml-2">*</span>
          </label>
          {edit.mentor_linkedin_url ? (
            <input
              {...register("mentor_linkedin_url")}
              type="url"
              value={getValues("mentor_linkedin_url")}
              onChange={(e) =>
                setValue("mentor_linkedin_url", e.target.value, {
                  shouldValidate: true,
                })
              }
              placeholder="Enter your LinkedIn URL"
              className="block w-full border border-gray-300 rounded-md p-[2px]"
              required
            />
          ) : (
            <div className="flex justify-between items-center cursor-pointer p-1">
              <span>{getValues("mentor_linkedin_url")}</span>
            </div>
          )}
          {errors.mentor_linkedin_url && (
            <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
              {errors.mentor_linkedin_url.message}
            </span>
          )}
        </div>

        {Object.values(edit).some((value) => value) && (
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
      </form>
    </div>
  );
};

export default MentorEdit;

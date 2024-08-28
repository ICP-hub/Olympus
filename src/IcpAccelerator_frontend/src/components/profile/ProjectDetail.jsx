import React, { useEffect, useRef, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ReactSelect from "react-select";
import { useSelector, useDispatch } from "react-redux";
import { useCountries } from "react-countries";
import editp from "../../../assets/Logo/edit.png";
import { allHubHandlerRequest } from "../StateManagement/Redux/Reducers/All_IcpHubReducer";
import { toast } from "react-hot-toast";
import {
  FaLinkedin,
  FaTwitter,
  FaGithub,
  FaTelegram,
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaReddit,
  FaTiktok,
  FaSnapchat,
  FaWhatsapp,
  FaMedium,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
import { LanguageIcon } from "../UserRegistration/DefaultLink";
import { validationSchema } from "../Modals/ProjectRegisterModal/projectValidation";
import { founderRegisteredHandlerRequest } from "../StateManagement/Redux/Reducers/founderRegisteredData";

const ProjectDetail = () => {
  const { countries } = useCountries();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(
    (currState) => currState.internet.isAuthenticated
  );
  const [interestedDomainsOptions, setInterestedDomainsOptions] = useState([]);
  const [
    interestedDomainsSelectedOptions,
    setInterestedDomainsSelectedOptions,
  ] = useState([]);
  const actor = useSelector((currState) => currState.actors.actor);
  const multiChainNames = useSelector((currState) => currState.chains.chains);
  const getAllIcpHubs = useSelector((currState) => currState.hubs.allHubs);
  const projectFullData = useSelector(
    (currState) => currState.projectData.data
  );
  const projectId = projectFullData?.[0]?.[0]?.uid;


  const defaultValues = {
    preferred_icp_hub: projectFullData?.[0][0].params.preferred_icp_hub ?? "ICP Hub, Italia",
    project_name: projectFullData?.[0][0].params.project_name ?? "Name of the project",
    project_description: projectFullData?.[0][0].params.project_description?.[0] ?? "This is the description of the project",
    project_elevator_pitch: projectFullData?.[0][0].params.project_elevator_pitch?.[0] ?? "https://pitch.com",
    project_website: projectFullData?.[0][0].params.project_website?.[0] ?? "https://project.com",
    is_your_project_registered: projectFullData?.[0][0].params.is_your_project_registered === "true",
    supports_multichain: projectFullData?.[0][0].params.supports_multichain?.[0] ?? "Polygon",
    type_of_registration: projectFullData?.[0][0].params.type_of_registration?.[0] ?? "Company",
    country_of_registration: projectFullData?.[0][0].params.country_of_registration?.[0] ?? "Pakistan",
    live_on_icp_mainnet: projectFullData?.[0][0].params.live_on_icp_mainnet === "true",
    dapp_link: projectFullData?.[0][0].params.dapp_link?.[0] ?? "https://link.com",
    weekly_active_users: projectFullData?.[0][0].params.weekly_active_users ?? 5,
    revenue: projectFullData?.[0][0].params.revenue ?? 6,
    money_raised_till_now: projectFullData?.[0][0].params.money_raised_till_now === "true",
  money_raising: projectFullData?.[0][0].params.money_raising === "true",
    icp_grants: parseInt(projectFullData?.[0][0].params.money_raised?.[0]?.icp_grants) || 0,
    investors: parseInt(projectFullData?.[0][0].params.money_raised?.[0]?.investors) || 0,
    raised_from_other_ecosystem: parseInt(projectFullData?.[0][0].params.money_raised?.[0]?.raised_from_other_ecosystem) || 0,
    target_amount: parseInt(projectFullData?.[0][0].params.money_raised?.[0]?.target_amount) ?? 0,
    sns: parseInt(projectFullData?.[0][0].params.money_raised?.[0]?.sns) ?? 0,
    promotional_video: projectFullData?.[0][0].params.promotional_video?.[0] ?? "https://chikupromotion",
    links: projectFullData?.[0][0].params.links ?? [],
    reason_to_join_incubator: projectFullData?.[0][0].params?.reason_to_join_incubator ?? [],
    project_area_of_focus: projectFullData?.[0][0].params?.project_area_of_focus ?? [],
    token_economics: projectFullData?.[0][0].params?.token_economics?.[0] ?? "",
    long_term_goals: projectFullData?.[0][0].params.long_term_goals ?? "",
    private_docs: projectFullData?.[0][0].params.private_docs?.[0] ?? "",
    public_docs: projectFullData?.[0][0].params.public_docs?.[0] ?? "",
    upload_private_documents: projectFullData?.[0][0].params.upload_private_documents === "true",
    vc_assigned: projectFullData?.[0][0].params.vc_assigned ?? [],
    mentors_assigned: projectFullData?.[0][0].params.mentors_assigned ?? [],
    project_team: projectFullData?.[0][0].params.project_team ?? [],
    target_market: projectFullData?.[0][0].params.target_market ?? "",
    technical_docs: projectFullData?.[0][0].params.technical_docs ?? "",
    self_rating_of_project: projectFullData?.[0][0].params.self_rating_of_project ?? 0,
    project_cover: projectFullData?.[0][0].params.project_cover ?? [],
    project_logo: projectFullData?.[0][0].params.project_logo ?? [],
    multi_chain: projectFullData?.[0][0].params.multi_chain || "",
    upload_public_documents: projectFullData?.[0][0].params.upload_public_documents || "",
    valuation: projectFullData?.[0][0].params.valuation || 0,
    // links: projectFullData?.[0][0].params.links?.map(link => link.link) || [],
  };
  console.log("sara data",projectFullData?.[0][0])
console.log("token economics:", projectFullData?.[0][0].params.project_logo)


  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    clearErrors,
    setError,
    control,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues,
    mode: "all",
  });

  const onErrorHandler = (val) => {
    console.log("error", val);
    toast.error("Empty fields or invalid values, please recheck the form");
  };
 
console.log("default values ",defaultValues)

  const [editMode, setEditMode] = useState({});
  const [multiChainOptions, setMultiChainOptions] = useState([]);
  const [multiChainSelectedOptions, setMultiChainSelectedOptions] = useState(
    []
  );


  const [formData, setFormData] = useState(defaultValues);
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

  const areaOfExpertise = useSelector(
    (currState) => currState.expertiseIn.expertise
  );

 
  const { fields, append, remove } = useFieldArray({
    control,
    name: "links",
  });

  const getLogo = (url) => {
    try {
      const domain = new URL(url).hostname.split(".").slice(-2).join(".");
      const size = "size-8";
      const icons = {
        "linkedin.com": <FaLinkedin className={`text-blue-600 ${size}`} />,
        "twitter.com": <FaTwitter className={`text-blue-400 ${size}`} />,
        "github.com": <FaGithub className={`text-gray-700 ${size}`} />,
        "telegram.com": <FaTelegram className={`text-blue-400 ${size}`} />,
        "facebook.com": <FaFacebook className={`text-blue-400 ${size}`} />,
        "instagram.com": <FaInstagram className={`text-pink-950 ${size}`} />,
        "youtube.com": <FaYoutube className={`text-red-600 ${size}`} />,
        "reddit.com": <FaReddit className={`text-orange-500 ${size}`} />,
        "tiktok.com": <FaTiktok className={`text-black ${size}`} />,
        "snapchat.com": <FaSnapchat className={`text-yellow-400 ${size}`} />,
        "whatsapp.com": <FaWhatsapp className={`text-green-600 ${size}`} />,
        "medium.com": <FaMedium className={`text-black ${size}`} />,
      };
      return icons[domain] || <LanguageIcon />;
    } catch (error) {
      return <LanguageIcon />;
    }
  };

  useEffect(() => {
    dispatch(allHubHandlerRequest());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(founderRegisteredHandlerRequest());
    }
  }, [isAuthenticated, dispatch]);

  useEffect(() => {
    if (multiChainNames) {
      setMultiChainOptions(
        multiChainNames.map((chain) => ({
          value: chain,
          label: chain,
        }))
      );
    }
  }, [multiChainNames]);

  useEffect(() => {
    if (projectFullData) {
      setFormValues(defaultValues);
      setEditMode(true);
    }
  }, [projectFullData]);

  const setFormValues = (data) => {
    if (data) {
      Object.keys(data).forEach((key) => {
        setValue(key, data[key] || "");
      });
      setFormData(data);
    }
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
  const handleSave = async (data) => {
   console.log('save data',data)
    const projectData = {
        project_cover: [],
        project_logo:[],
        preferred_icp_hub: [data?.preferred_icp_hub || ""],
        project_name: data?.project_name || "",
        project_description: [data?.project_description || ""],
        project_elevator_pitch: [data?.project_elevator_pitch || ""],
        project_website: [data?.project_website || ""],
        is_your_project_registered: [
          data?.is_your_project_registered === "true" ? true : false,
        ],
        type_of_registration: [
          data?.is_your_project_registered === "true" &&
            data?.type_of_registration
            ? data?.type_of_registration
            : "",
        ],
        country_of_registration: [
          data?.is_your_project_registered === "true" &&
            data?.country_of_registration
            ? data?.country_of_registration
            : "",
        ],
        live_on_icp_mainnet: [
          data?.live_on_icp_mainnet === "true" ? true : false,
        ],
        dapp_link: [
          data?.live_on_icp_mainnet === "true" && data?.dapp_link
            ? data?.dapp_link.toString()
            : "",
        ],
        weekly_active_users: [
          data?.live_on_icp_mainnet === "true" && data?.weekly_active_users
            ? data?.weekly_active_users
            : 0,
        ],
        revenue: [
          data?.live_on_icp_mainnet === "true" && data?.revenue
            ? data?.revenue
            : 0,
        ],
        supports_multichain: [
          data?.multi_chain === "true" && data?.multi_chain_names
            ? data?.multi_chain_names
            : "",
        ],
        money_raised_till_now: [
          data?.money_raised_till_now === "true" ? true : false,
        ],
        money_raising: [data?.money_raising === "true" ? true : false],
        money_raised: [
          {
            icp_grants: [
              data?.money_raised_till_now === "true" && data?.icp_grants
                ? data?.icp_grants.toString()
                : "",
            ],
            investors: [
              data?.money_raised_till_now === "true" && data?.investors
                ? data?.investors.toString()
                : "",
            ],
            raised_from_other_ecosystem: [
              data?.money_raised_till_now === "true" &&
                data?.raised_from_other_ecosystem
                ? data?.raised_from_other_ecosystem.toString()
                : "",
            ],
            sns: [
              data?.money_raising === "true" && data?.valuation
                ? data?.valuation.toString()
                : "",
            ],
            target_amount:
              data?.money_raising === "true" && data?.target_amount
                ? [data?.target_amount]
                : [],
          },
        ],
        promotional_video: [data?.promotional_video || ""],
      
        token_economics: [data?.token_economics || ""],
        long_term_goals: [data?.white_paper || ""],
        private_docs:
          data?.upload_private_documents === "true" ? [data?.privateDocs] : [],
        public_docs:
          data?.upload_public_documents === "true" ? [data?.publicDocs] : [],
        upload_private_documents: [
          data?.upload_private_documents === "true" ? true : false,
        ],
        // Extra field at Project
        project_area_of_focus: "",
        reason_to_join_incubator: data?.reasons_to_join_platform || [""],
        vc_assigned: [],
        mentors_assigned: [],
        project_team: [],
        project_twitter: [""],
        target_market: [""],
        technical_docs: [""],
        self_rating_of_project: 0,
      };
      console.log('projectData  aagya oye',projectData)
      try {
        
        const result = await actor.update_project(projectId, projectData);
        if (result && result.includes("Profile updated successfully")) {
          toast.success("Project updated successfully");
        } else {
          toast.error(result);
        }
      } catch (error) {
        toast.error("Error updating project data");
        console.error("Error:", error);

      }
  };
  

  const handleCancel = () => {
    setEditMode(false);
    setFormValues(formData);
  };

  const handleEditClick = (field) => {
    setEditMode({ ...editMode, [field]: true });
  };

  const projectDetailRef = useRef(null);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (
      projectDetailRef.current &&
      !projectDetailRef.current.contains(event.target)
    ) {
      if (Object.values(editMode).some((isEditing) => isEditing)) {
        handleSubmit((data) => {
          handleSave(data);
          setEditMode({});
        })();
      } else {
        setEditMode({});
      }
    }
  };

  return (
    <div ref={projectDetailRef} className="px-1">
      <div className="px-1">
      <form onSubmit={handleSubmit(handleSave, onErrorHandler)}>
        {/* Preferred ICP Hub */}
        <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3">
          <div className="flex justify-between items-center">
            <label className="block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start">
              Preferred ICP Hub you would like to be associated with
            </label>
            <img
              src={editp}
              className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
              alt="edit"
              onClick={() => handleEditClick("preferred_icp_hub")}
            />
          </div>
          {editMode.preferred_icp_hub ? (
            <div>
              <select
                {...register("preferred_icp_hub")}
                defaultValue={getValues("preferred_icp_hub")}
                className={`bg-gray-50 border-2 ${
                  errors.preferred_icp_hub
                    ? "border-red-500 "
                    : "border-[#737373]"
                } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-1 px-1.5`}
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
              {errors.preferred_icp_hub && (
                <p className="mt-1 text-sm text-red-500 font-bold text-left">
                  {errors.preferred_icp_hub.message}
                </p>
              )}
            </div>
          ) : (
            <div className="flex justify-between items-center cursor-pointer py-1">
              <span className="mr-2 text-sm">
                {getValues("preferred_icp_hub")}
              </span>
            </div>
          )}
        </div>

        {/* Project Name */}
        <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3">
          <div className="flex justify-between items-center">
            <label className="block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start">
              Project Name
            </label>
            <img
              src={editp}
              className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
              alt="edit"
              onClick={() => handleEditClick("project_name")}
            />
          </div>
          {editMode.project_name ? (
            <div>
              <input
                type="text"
                {...register("project_name")}
                className={`bg-gray-50 border-2 ${
                  errors.project_name ? "border-red-500 " : "border-[#737373]"
                } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-1 px-1.5`}
                placeholder="Enter your Project name"
              />
              {errors.project_name && (
                <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                  {errors.project_name.message}
                </span>
              )}
            </div>
          ) : (
            <div className="flex justify-between items-center cursor-pointer py-1">
              <span className="mr-2 text-sm">{getValues("project_name")}</span>
            </div>
          )}
        </div>

        {/* Project Description */}
        <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3">
          <div className="flex justify-between items-center">
            <label className="block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start">
              Project Description
            </label>
            <img
              src={editp}
              className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
              alt="edit"
              onClick={() => handleEditClick("project_description")}
            />
          </div>
          {editMode.project_description ? (
            <div>
              <input
                type="text"
                {...register("project_description")}
                className={`bg-gray-50 border-2 ${
                  errors.project_description
                    ? "border-red-500 "
                    : "border-[#737373]"
                } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-1 px-1.5`}
                placeholder="Enter your Project description"
              />
              {errors.project_description && (
                <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                  {errors.project_description.message}
                </span>
              )}
            </div>
          ) : (
            <div className="flex justify-between items-center cursor-pointer py-1">
              <span className="mr-2 text-sm">
                {getValues("project_description")}
              </span>
            </div>
          )}
        </div>

        {/* Project Elevator Pitch */}
        <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3">
          <div className="flex justify-between items-center">
            <label className="block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start">
              Project Elevator Pitch
            </label>
            <img
              src={editp}
              className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
              alt="edit"
              onClick={() => handleEditClick("project_elevator_pitch")}
            />
          </div>
          {editMode.project_elevator_pitch ? (
            <div>
              <input
                type="text"
                {...register("project_elevator_pitch")}
                className={`bg-gray-50 border-2 ${
                  errors.project_elevator_pitch
                    ? "border-red-500 "
                    : "border-[#737373]"
                } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-1 px-1.5`}
                placeholder="Enter your Project elevator pitch"
              />
              {errors.project_elevator_pitch && (
                <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                  {errors.project_elevator_pitch.message}
                </span>
              )}
            </div>
          ) : (
            <div className="flex justify-between items-center cursor-pointer py-1">
              <span className="mr-2 text-sm">
                {getValues("project_elevator_pitch")}
              </span>
            </div>
          )}
        </div>

        {/* Project Website */}
        <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3">
          <div className="flex justify-between items-center">
            <label className="block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start">
              Project Website
            </label>
            <img
              src={editp}
              className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
              alt="edit"
              onClick={() => handleEditClick("project_website")}
            />
          </div>
          {editMode.project_website ? (
            <div>
              <input
                type="text"
                {...register("project_website")}
                className={`bg-gray-50 border-2 ${
                  errors.project_website
                    ? "border-red-500 "
                    : "border-[#737373]"
                } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-1 px-1.5`}
                placeholder="Enter your Project website"
              />
              {errors.project_website && (
                <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                  {errors.project_website.message}
                </span>
              )}
            </div>
          ) : (
            <div className="flex justify-between items-center cursor-pointer py-1">
              <span className="mr-2 text-sm">
                {getValues("project_website")}
              </span>
            </div>
          )}
        </div>

        {/* Is Your Project Registered */}
        <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3">
          <div className="flex justify-between items-center">
            <label className="block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start">
              Is Your Project Registered?
            </label>
            <img
              src={editp}
              className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
              alt="edit"
              onClick={() => handleEditClick("is_your_project_registered")}
            />
          </div>
          {editMode.is_your_project_registered ? (
            <div>
              <select
                {...register("is_your_project_registered")}
                defaultValue={getValues("is_your_project_registered")}
                className={`bg-gray-50 border-2 ${
                  errors.is_your_project_registered
                    ? "border-red-500 "
                    : "border-[#737373]"
                } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-1 px-1.5`}
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
              {errors.is_your_project_registered && (
                <p className="mt-1 text-sm text-red-500 font-bold text-left">
                  {errors.is_your_project_registered.message}
                </p>
              )}
            </div>
          ) : (
            <div className="flex justify-between items-center cursor-pointer py-1">
              <span className="mr-2 text-sm">
                {getValues("is_your_project_registered") ? "Yes" : "No"}
              </span>
            </div>
          )}
        </div>

        {watch("is_your_project_registered") === "true" && (
          <>
            {/* Type of Registration */}
            <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3">
              <div className="flex justify-between items-center">
                <label className="block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start">
                  Type of Registration
                </label>
                <img
                  src={editp}
                  className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
                  alt="edit"
                  onClick={() => handleEditClick("type_of_registration")}
                />
              </div>
              {editMode.type_of_registration ? (
                <div>
                  <select
                    {...register("type_of_registration")}
                    defaultValue={getValues("type_of_registration")}
                    className={`bg-gray-50 border-2 ${
                      errors.type_of_registration
                        ? "border-red-500 "
                        : "border-[#737373]"
                    } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-1 px-1.5`}
                  >
                    <option value="Company">Company</option>
                    <option value="DAO">DAO</option>
                  </select>
                  {errors.type_of_registration && (
                    <p className="mt-1 text-sm text-red-500 font-bold text-left">
                      {errors.type_of_registration.message}
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex justify-between items-center cursor-pointer py-1">
                  <span className="mr-2 text-sm">
                    {getValues("type_of_registration")}
                  </span>
                </div>
              )}
            </div>

            {/* Country of Registration */}
            <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3">
              <div className="flex justify-between items-center">
                <label className="block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start">
                  Country of Registration
                </label>
                <img
                  src={editp}
                  className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
                  alt="edit"
                  onClick={() => handleEditClick("country_of_registration")}
                />
              </div>
              {editMode.country_of_registration ? (
                <div>
                  <select
                    {...register("country_of_registration")}
                    defaultValue={getValues("country_of_registration")}
                    className={`bg-gray-50 border-2 ${
                      errors.country_of_registration
                        ? "border-red-500 "
                        : "border-[#737373]"
                    } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-1 px-1.5`}
                  >
                    {countries?.map((country) => (
                      <option key={country.name} value={country.name}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                  {errors.country_of_registration && (
                    <p className="mt-1 text-sm text-red-500 font-bold text-left">
                      {errors.country_of_registration.message}
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex justify-between items-center cursor-pointer py-1">
                  <span className="mr-2 text-sm">
                    {getValues("country_of_registration")}
                  </span>
                </div>
              )}
            </div>
          </>
        )}

        {/* Are you also multi-chain */}
        <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3">
          <div className="flex justify-between items-center">
            <label className="font-semibold text-xs text-gray-500 uppercase">
              Are you also multi-chain
            </label>
            <img
              src={editp}
              className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
              alt="edit"
              onClick={() => {
                handleEditClick("multi_chain");
                setValue("multi_chain", getValues("multi_chain"));
              }}
            />
          </div>
          {editMode.multi_chain ? (
            <div>
              <select
                {...register("multi_chain")}
                className={`bg-gray-50 border-2 ${
                  errors.multi_chain ? "border-red-500" : "border-[#737373]"
                } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-1 px-1.5`}
              >
                <option value="" disabled hidden>
                  Select..
                </option>
                <option className="text-lg font-bold" value="false">
                  No
                </option>
                <option className="text-lg font-bold" value="true">
                  Yes
                </option>
              </select>
              {errors.multi_chain && (
                <p className="mt-1 text-sm text-red-500 font-bold text-left">
                  {errors.multi_chain.message}
                </p>
              )}
            </div>
          ) : (
            <div className="flex justify-between items-center cursor-pointer py-1">
              <span className="mr-2 text-sm">
                {getValues("multi_chain") === "true" ? "Yes" : "No"}
              </span>
            </div>
          )}
        </div>

        {watch("multi_chain") === "true" && (
          <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3">
            <div className="flex justify-between items-center">
              <label className="font-semibold text-xs text-gray-500 uppercase mb-1 ">
                Please select the chains
              </label>
              <img
                src={editp}
                className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
                alt="edit"
                onClick={() => handleEditClick("multiChain")}
              />
            </div>
            {editMode.supports_multichain ? (
              <ReactSelect
                isMulti
                menuPortalTarget={document.body}
                menuPosition={"fixed"}
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  control: (provided) => ({
                    ...provided,
                    borderRadius: "8px",
                    border: errors.supports_multichain
                      ? "2px solid #ef4444"
                      : "2px solid #737373",
                    backgroundColor: "rgb(249 250 251)",
                    display: "flex",
                    overflowX: "auto",
                  }),
                  valueContainer: (provided) => ({
                    ...provided,
                    overflow: "scroll",
                    maxHeight: "40px",
                    scrollbarWidth: "none",
                  }),
                  placeholder: (provided) => ({
                    ...provided,
                    color: errors.supports_multichain
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
                value={multiChainSelectedOptions}
                options={multiChainOptions}
                classNamePrefix="select"
                className="basic-multi-select w-full text-start"
                placeholder="Select a chain"
                name="supports_multichain"
                onChange={(selectedOptions) => {
                  if (selectedOptions && selectedOptions.length > 0) {
                    setMultiChainSelectedOptions(selectedOptions);
                    clearErrors("supports_multichain");
                    setValue(
                      "supports_multichain",
                      selectedOptions.map((option) => option.value).join(", "),
                      { shouldValidate: true }
                    );
                  } else {
                    setMultiChainSelectedOptions([]);
                    setValue("supports_multichain", "", {
                      shouldValidate: true,
                    });
                    setError("supports_multichain", {
                      type: "required",
                      message: "At least one chain name required",
                    });
                  }
                }}
              />
            ) : (
              <div className="flex flex-wrap gap-2 cursor-pointer py-1">
                {getValues("supports_multichain") &&
                  typeof getValues("supports_multichain") === "string" &&
                  getValues("supports_multichain")
                    .split(", ")
                    .map((chain, index) => (
                      <span
                        key={index}
                        className="border-2 border-gray-500 rounded-full text-gray-700 text-xs px-2 py-1"
                      >
                        {chain}
                      </span>
                    ))}
              </div>
            )}
            {errors.supports_multichain && (
              <p className="mt-1 text-sm text-red-500 font-bold text-left">
                {errors.supports_multichain.message}
              </p>
            )}
          </div>
        )}

        {/* Reason for Joining This Platform */}
        <div className="relative group hover:bg-slate-50 rounded-lg p-2 mb-2">
          <div class="absolute right-2 top-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <img
              src={editp}
              class="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
              alt="edit"
              onClick={() => handleEditClick("reason_to_join_incubator")}
            />
          </div>
          <label className="block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start">
            Reason for Joining This Platform
          </label>
          {editMode.reason_to_join_incubator ? (
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
                  border: errors.reason_to_join_incubator
                    ? "2px solid #ef4444"
                    : "2px solid #737373",
                  backgroundColor: "rgb(249 250 251)",
                  "&::placeholder": {
                    color: errors.reason_to_join_incubator
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
                  color: errors.reason_to_join_incubator
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
              name="reason_to_join_incubator"
              onChange={(selectedOptions) => {
                if (selectedOptions && selectedOptions.length > 0) {
                  setReasonOfJoiningSelectedOptions(selectedOptions);
                  clearErrors("reason_to_join_incubator");
                  setValue(
                    "reason_to_join_incubator",
                    selectedOptions.map((option) => option.value).join(", "),
                    { shouldValidate: true }
                  );
                } else {
                  setReasonOfJoiningSelectedOptions([]);
                  setValue("reason_to_join_incubator", "", {
                    shouldValidate: true,
                  });
                  setError("reason_to_join_incubator", {
                    type: "required",
                    message: "Selecting a reason is required",
                  });
                }
              }}
            />
          ) : (
            <div className="flex flex-wrap gap-2 cursor-pointer py-1">
              {getValues("reason_to_join_incubator") &&
              typeof getValues("reason_to_join_incubator") === "string"
                ? getValues("reason_to_join_incubator")
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

        {/* Live on ICP Mainnet */}
        <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3">
          <div className="flex justify-between items-center">
            <label className="block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start">
              Live on ICP Mainnet?
            </label>
            <img
              src={editp}
              className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
              alt="edit"
              onClick={() => handleEditClick("live_on_icp_mainnet")}
            />
          </div>
          {editMode.live_on_icp_mainnet ? (
            <div>
              <select
                {...register("live_on_icp_mainnet")}
                defaultValue={getValues("live_on_icp_mainnet")}
                className={`bg-gray-50 border-2 ${
                  errors.live_on_icp_mainnet
                    ? "border-red-500 "
                    : "border-[#737373]"
                } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-1 px-1.5`}
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
              {errors.live_on_icp_mainnet && (
                <p className="mt-1 text-sm text-red-500 font-bold text-left">
                  {errors.live_on_icp_mainnet.message}
                </p>
              )}
            </div>
          ) : (
            <div className="flex justify-between items-center cursor-pointer py-1">
              <span className="mr-2 text-sm">
                {getValues("live_on_icp_mainnet") ? "Yes" : "No"}
              </span>
            </div>
          )}
        </div>

        {watch("live_on_icp_mainnet") === "true" && (
          <>
            {/* dApp Link */}
            <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3">
              <div className="flex justify-between items-center">
                <label className="block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start">
                  dApp Link
                </label>
                <img
                  src={editp}
                  className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
                  alt="edit"
                  onClick={() => handleEditClick("dapp_link")}
                />
              </div>
              {editMode.dapp_link ? (
                <div>
                  <input
                    type="text"
                    {...register("dapp_link")}
                    className={`bg-gray-50 border-2 ${
                      errors.dapp_link ? "border-red-500 " : "border-[#737373]"
                    } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-1 px-1.5`}
                    placeholder="Enter your dApp link"
                  />
                  {errors.dapp_link && (
                    <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                      {errors.dapp_link.message}
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex justify-between items-center cursor-pointer py-1">
                  <span className="mr-2 text-sm">{getValues("dapp_link")}</span>
                </div>
              )}
            </div>

            {/* Weekly Active Users */}
            <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3">
              <div className="flex justify-between items-center">
                <label className="block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start">
                  Weekly Active Users
                </label>
                <img
                  src={editp}
                  className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
                  alt="edit"
                  onClick={() => handleEditClick("weekly_active_users")}
                />
              </div>
              {editMode.weekly_active_users ? (
                <div>
                  <input
                    type="number"
                    {...register("weekly_active_users")}
                    className={`bg-gray-50 border-2 ${
                      errors.weekly_active_users
                        ? "border-red-500 "
                        : "border-[#737373]"
                    } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-1 px-1.5`}
                    placeholder="Enter Weekly Active Users"
                  />
                  {errors.weekly_active_users && (
                    <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                      {errors.weekly_active_users.message}
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex justify-between items-center cursor-pointer py-1">
                  <span className="mr-2 text-sm">
                    {getValues("weekly_active_users")}
                  </span>
                </div>
              )}
            </div>

            {/* Revenue */}
            <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3">
              <div className="flex justify-between items-center">
                <label className="block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start">
                  Revenue (in Million USD)
                </label>
                <img
                  src={editp}
                  className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
                  alt="edit"
                  onClick={() => handleEditClick("revenue")}
                />
              </div>
              {editMode.revenue ? (
                <div>
                  <input
                    type="number"
                    {...register("revenue")}
                    className={`bg-gray-50 border-2 ${
                      errors.revenue ? "border-red-500 " : "border-[#737373]"
                    } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-1 px-1.5`}
                    placeholder="Enter Revenue"
                  />
                  {errors.revenue && (
                    <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                      {errors.revenue.message}
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex justify-between items-center cursor-pointer py-1">
                  <span className="mr-2 text-sm">{getValues("revenue")}</span>
                </div>
              )}
            </div>
          </>
        )}

        {/* Money Raised Till Now */}
        <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3">
          <div className="flex justify-between items-center">
            <label className="block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start">
              Money Raised Till Now?
            </label>
            <img
              src={editp}
              className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
              alt="edit"
              onClick={() => handleEditClick("money_raised_till_now")}
            />
          </div>
          {editMode.money_raised_till_now ? (
            <div>
              <select
                {...register("money_raised_till_now")}
                defaultValue={getValues("money_raised_till_now")}
                className={`bg-gray-50 border-2 ${
                  errors.money_raised_till_now
                    ? "border-red-500 "
                    : "border-[#737373]"
                } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-1 px-1.5`}
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
              {errors.money_raised_till_now && (
                <p className="mt-1 text-sm text-red-500 font-bold text-left">
                  {errors.money_raised_till_now.message}
                </p>
              )}
            </div>
          ) : (
            <div className="flex justify-between items-center cursor-pointer py-1">
              <span className="mr-2 text-sm">
                {getValues("money_raised_till_now") ? "Yes" : "No"}
              </span>
            </div>
          )}
        </div>

        {watch("money_raised_till_now") === "true" && (
          <>
            {/* ICP Grants */}
            <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3">
              <div className="flex justify-between items-center">
                <label className="block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start">
                  ICP Grants
                </label>
                <img
                  src={editp}
                  className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
                  alt="edit"
                  onClick={() => handleEditClick("icp_grants")}
                />
              </div>
              {editMode.icp_grants ? (
                <div>
                  <input
                    type="number"
                    {...register("icp_grants")}
                    className={`bg-gray-50 border-2 ${
                      errors.icp_grants ? "border-red-500 " : "border-[#737373]"
                    } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-1 px-1.5`}
                    placeholder="Enter ICP Grants"
                  />
                  {errors.icp_grants && (
                    <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                      {errors.icp_grants.message}
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex justify-between items-center cursor-pointer py-1">
                  <span className="mr-2 text-sm">
                    {getValues("icp_grants")}
                  </span>
                </div>
              )}
            </div>

            {/* Investors */}
            <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3">
              <div className="flex justify-between items-center">
                <label className="block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start">
                  Investors
                </label>
                <img
                  src={editp}
                  className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
                  alt="edit"
                  onClick={() => handleEditClick("investors")}
                />
              </div>
              {editMode.investors ? (
                <div>
                  <input
                    type="number"
                    {...register("investors")}
                    className={`bg-gray-50 border-2 ${
                      errors.investors ? "border-red-500 " : "border-[#737373]"
                    } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-1 px-1.5`}
                    placeholder="Enter Investors"
                  />
                  {errors.investors && (
                    <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                      {errors.investors.message}
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex justify-between items-center cursor-pointer py-1">
                  <span className="mr-2 text-sm">{getValues("investors")}</span>
                </div>
              )}
            </div>

            {/* Raised from Other Ecosystem */}
            <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3">
              <div className="flex justify-between items-center">
                <label className="block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start">
                  Raised from Other Ecosystem
                </label>
                <img
                  src={editp}
                  className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
                  alt="edit"
                  onClick={() => handleEditClick("raised_from_other_ecosystem")}
                />
              </div>
              {editMode.raised_from_other_ecosystem ? (
                <div>
                  <input
                    type="number"
                    {...register("raised_from_other_ecosystem")}
                    className={`bg-gray-50 border-2 ${
                      errors.raised_from_other_ecosystem
                        ? "border-red-500 "
                        : "border-[#737373]"
                    } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-1 px-1.5`}
                    placeholder="Enter Raised from Other Ecosystem"
                  />
                  {errors.raised_from_other_ecosystem && (
                    <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                      {errors.raised_from_other_ecosystem.message}
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex justify-between items-center cursor-pointer py-1">
                  <span className="mr-2 text-sm">
                    {getValues("raised_from_other_ecosystem")}
                  </span>
                </div>
              )}
            </div>
          </>
        )}

        {/* Money Raising */}
        <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3">
          <div className="flex justify-between items-center">
            <label className="block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start">
              Money Raising?
            </label>
            <img
              src={editp}
              className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
              alt="edit"
              onClick={() => handleEditClick("money_raising")}
            />
          </div>
          {editMode.money_raising ? (
            <div>
              <select
                {...register("money_raising")}
                defaultValue={getValues("money_raising")}
                className={`bg-gray-50 border-2 ${
                  errors.money_raising ? "border-red-500 " : "border-[#737373]"
                } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-1 px-1.5`}
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
              {errors.money_raising && (
                <p className="mt-1 text-sm text-red-500 font-bold text-left">
                  {errors.money_raising.message}
                </p>
              )}
            </div>
          ) : (
            <div className="flex justify-between items-center cursor-pointer py-1">
              <span className="mr-2 text-sm">
                {getValues("money_raising") ? "Yes" : "No"}
              </span>
            </div>
          )}
        </div>

        {watch("money_raising") === "true" && (
          <>
            {/* Target Amount */}
            <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3">
              <div className="flex justify-between items-center">
                <label className="block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start">
                  Target Amount (in Million USD)
                </label>
                <img
                  src={editp}
                  className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
                  alt="edit"
                  onClick={() => handleEditClick("target_amount")}
                />
              </div>
              {editMode.target_amount ? (
                <div>
                  <input
                    type="number"
                    {...register("target_amount")}
                    className={`bg-gray-50 border-2 ${
                      errors.target_amount
                        ? "border-red-500 "
                        : "border-[#737373]"
                    } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-1 px-1.5`}
                    placeholder="Enter Target Amount"
                  />
                  {errors.target_amount && (
                    <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                      {errors.target_amount.message}
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex justify-between items-center cursor-pointer py-1">
                  <span className="mr-2 text-sm">
                    {getValues("target_amount")}
                  </span>
                </div>
              )}
            </div>

            {/* SNS */}
            <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3">
              <div className="flex justify-between items-center">
                <label className="block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start">
                  SNS
                </label>
                <img
                  src={editp}
                  className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
                  alt="edit"
                  onClick={() => handleEditClick("sns")}
                />
              </div>
              {editMode.sns ? (
                <div>
                  <input
                    type="number"
                    {...register("sns")}
                    className={`bg-gray-50 border-2 ${
                      errors.sns ? "border-red-500 " : "border-[#737373]"
                    } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-1 px-1.5`}
                    placeholder="Enter SNS"
                  />
                  {errors.sns && (
                    <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                      {errors.sns.message}
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex justify-between items-center cursor-pointer py-1">
                  <span className="mr-2 text-sm">{getValues("sns")}</span>
                </div>
              )}
            </div>
          </>
        )}

        <div className="mb-4 group relative hover:bg-gray-100 rounded-lg p-2 px-3">
          <div className="flex justify-between">
            <h3 className="font-semibold mb-2 text-xs text-gray-500 uppercase">
              Interests
            </h3>
            <div>
              <button
                type="button"
                className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
                onClick={() => handleEditClick("project_area_of_focus")}
              >
                <img src={editp} alt="edit" />
              </button>
            </div>
          </div>
          {editMode.project_area_of_focus ? (
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
               border: errors.domains_interested_in
                 ? "2px solid #ef4444"
                 : "2px solid #737373",
               backgroundColor: "rgb(249 250 251)",
               "&::placeholder": {
                 color: errors.domains_interested_in
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
               color: errors.domains_interested_in
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
           value={interestedDomainsSelectedOptions}
           options={interestedDomainsOptions}
           classNamePrefix="select"
           className="basic-multi-select w-full text-start"
           placeholder="Select domains you are interested in"
           name="project_area_of_focus"
           onChange={(selectedOptions) => {
             if (selectedOptions && selectedOptions.length > 0) {
               setInterestedDomainsSelectedOptions(selectedOptions);
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
               setValue("project_area_of_focus", "", {
                 shouldValidate: true,
               });
               setError("project_area_of_focus", {
                 type: "required",
                 message: "Selecting an interest is required",
               });
             }
           }}
         />
          ) : (
            <div className="flex flex-wrap gap-2">
              {getValues("project_area_of_focus") &&
                getValues("project_area_of_focus")
                  .split(", ")
                  .map((focus, index) => (
                    <span
                      key={index}
                      className="border-2 border-gray-500 rounded-full text-gray-700 text-xs px-2 py-1"
                    >
                      {focus}
                    </span>
                  ))}
            </div>
          )}
        </div>

        {/* Promotional Video */}
        <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3">
          <div className="flex justify-between items-center">
            <label className="block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start">
              Promotional Video
            </label>
            <img
              src={editp}
              className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
              alt="edit"
              onClick={() => handleEditClick("promotional_video")}
            />
          </div>
          {editMode.promotional_video ? (
            <div>
              <input
                type="text"
                {...register("promotional_video")}
                className={`bg-gray-50 border-2 ${
                  errors.promotional_video
                    ? "border-red-500 "
                    : "border-[#737373]"
                } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-1 px-1.5`}
                placeholder="Enter Promotional Video Link"
              />
              {errors.promotional_video && (
                <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                  {errors.promotional_video.message}
                </span>
              )}
            </div>
          ) : (
            <div className="flex justify-between items-center cursor-pointer py-1">
              <span className="mr-2 text-sm">
                {getValues("promotional_video")}
              </span>
            </div>
          )}
        </div>

        {/* Links */}
        <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3">
          <div className="flex justify-between items-center">
            <label className="block font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start">
              Links
            </label>
            <img
              src={editp}
              className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
              alt="edit"
              onClick={() => handleEditClick("links")}
            />
          </div>
          {editMode.links ? (
            <div className="relative">
              {fields.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center mb-4 border-b pb-2"
                >
                  <Controller
                    name={`links[${index}].link`}
                    control={control}
                    render={({ field, fieldState }) => (
                      <div className="flex items-center w-full">
                        <div className="flex items-center space-x-2 w-full">
                          <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full">
                            {field.value && getLogo(field.value)}
                          </div>
                          <input
                            type="text"
                            placeholder="Enter your social media URL"
                            className={`px-2 py-1 border ${
                              fieldState.error
                                ? "border-red-500"
                                : "border-gray-300"
                            } rounded-md w-full`}
                            {...field}
                          />
                        </div>
                      </div>
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => append({ link: "" })}
                className="flex items-center p-1 text-[#155EEF] font-semibold text-xs"
              >
                <FaPlus className="mr-1" /> Add Another Link
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {getValues("links") &&
                getValues("links").map((linkObj, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full">
                      {linkObj.link && getLogo(linkObj.link)}
                    </div>
                    <span className="text-sm text-gray-700">
                      {linkObj.link}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Buttons */}
        {Object.values(editMode).some((value) => value) && (
          <div className="flex justify-end gap-4 mt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-300 text-gray-700 py-2 px-4 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded"
            >
              Save
            </button>
          </div>
        )}
        </form>
      </div>
    </div>
  );
};

export default ProjectDetail;

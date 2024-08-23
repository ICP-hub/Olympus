import React, { useEffect, useRef, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ReactSelect from "react-select";
import { useSelector, useDispatch } from "react-redux";
import { useCountries } from "react-countries";
import editp from "../../../assets/Logo/edit.png";
import { allHubHandlerRequest } from "../StateManagement/Redux/Reducers/All_IcpHubReducer";
import { toast, Toaster } from "react-hot-toast";
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
import { LanguageIcon } from "../UserRegistration/DefaultLink"

const ProjectDetail = () => {
    const { countries } = useCountries();
    const dispatch = useDispatch();

      console.log("projectFullData in projectRejForm ===>", projectFullData);
    const actor = useSelector((currState) => currState.actors.actor);
    const areaOfExpertise = useSelector((currState) => currState.expertiseIn.expertise);
    const typeOfProfile = useSelector((currState) => currState.profileTypes.profiles);
    const getAllIcpHubs = useSelector((currState) => currState.hubs.allHubs);
    const multiChainNames = useSelector((currState) => currState.chains.chains);
    const projectFullData = useSelector((currState) => currState.projectData.data);
    const userFullData = useSelector((currState) => currState.userData.data.Ok);

    const validationSchema = yup.object().shape({
        full_name: yup.string().test("is-non-empty", "Full name is required", (value) => /\S/.test(value)).required("Full name is required"),
        email: yup.string().email("Invalid email").nullable(true).optional(),
        telegram_id: yup.string().nullable(true).optional().url("Invalid url"),
        twitter_url: yup.string().nullable(true).optional().url("Invalid url"),
        openchat_user_name: yup.string().nullable(true).test("is-valid-username", "Username must be between 5 and 20 characters, and cannot start or contain spaces", (value) => !value || (value.length >= 5 && value.length <= 20 && !/\s/.test(value))),
        bio: yup.string().optional().test("maxWords", "Bio must not exceed 50 words", (value) => !value || value.trim().split(/\s+/).filter(Boolean).length <= 50).test("no-leading-spaces", "Bio should not have leading spaces", (value) => !value || value.trimStart() === value).test("maxChars", "Bio must not exceed 500 characters", (value) => !value || value.length <= 500),
        country: yup.string().test("is-non-empty", "Country is required", (value) => /\S/.test(value)).required("Country is required"),
        domains_interested_in: yup.string().test("is-non-empty", "Selecting an interest is required", (value) => /\S/.test(value)).required("Selecting an interest is required"),
        type_of_profile: yup.string().test("is-non-empty", "Type of profile is required", (value) => /\S/.test(value)).required("Type of profile is required"),
        reasons_to_join_platform: yup.string().test("is-non-empty", "Selecting a reason is required", (value) => /\S/.test(value)).required("Selecting a reason is required"),
        preferred_icp_hub: yup.string().test("is-non-empty", "ICP Hub selection is required", (value) => /\S/.test(value)).required("ICP Hub selection is required"),
        project_name: yup.string().test("is-non-empty", "Project name is required", (value) => /\S/.test(value)).test("no-leading-spaces", "Project name should not have leading spaces", (value) => !value || value.trimStart() === value).required("Project name is required"),
        project_description: yup.string().test("maxWords", "Project Description must not exceed 50 words", (value) => !value || value.trim().split(/\s+/).filter(Boolean).length <= 50).test("maxChars", "Project Description must not exceed 500 characters", (value) => !value || value.length <= 500).optional(),
        project_elevator_pitch: yup.string().url("Invalid url").optional(),
        project_website: yup.string().nullable(true).optional().url("Invalid url"),
        is_your_project_registered: yup.string().required("Required").oneOf(["true", "false"], "Invalid value"),
        type_of_registration: yup.string().when("is_your_project_registered", (val, schema) => val && val[0] === "true" ? schema.test("is-non-empty", "Type of registration is required", (value) => /\S/.test(value)).required("Type of registration is required") : schema),
        country_of_registration: yup.string().when("is_your_project_registered", (val, schema) => val && val[0] === "true" ? schema.test("is-non-empty", "Country of registration is required", (value) => /\S/.test(value)).required("Country of registration is required") : schema),
        live_on_icp_mainnet: yup.string().required("Required").oneOf(["true", "false"], "Invalid value"),
        dapp_link: yup.string().when("live_on_icp_mainnet", (val, schema) => val && val[0] === "true" ? schema.test("is-non-empty", "dApp Link is required", (value) => /\S/.test(value)).url("Invalid url").required("dApp Link is required") : schema),
        weekly_active_users: yup.number().nullable(true).optional(),
        revenue: yup.number().nullable(true).optional(),
        money_raising: yup.string().required("Required").oneOf(["true", "false"], "Invalid value"),
        money_raised_till_now: yup.string().required("Required").oneOf(["true", "false"], "Invalid value"),
        icp_grants: yup.mixed().test("is-required-or-nullable", "You must enter a number", function (value) {
            const { money_raised_till_now } = this.parent;
            if (money_raised_till_now === "true") {
                return yup.number().min(0, "Must be a non-negative number").isValidSync(value);
            }
            return value === null || value === "" || value === 0;
        }),
        investors: yup.mixed().test("is-required-or-nullable", "You must enter a number", function (value) {
            const { money_raised_till_now } = this.parent;
            if (money_raised_till_now === "true") {
                return yup.number().min(0, "Must be a non-negative number").isValidSync(value);
            }
            return value === null || value === "" || value === 0;
        }),
        raised_from_other_ecosystem: yup.mixed().test("is-required-or-nullable", "You must enter a number", function (value) {
            const { money_raised_till_now } = this.parent;
            if (money_raised_till_now === "true") {
                return yup.number().min(0, "Must be a non-negative number").isValidSync(value);
            }
            return value === null || value === "" || value === 0;
        }),
        target_amount: yup.number().when("money_raising", (val, schema) => val && val[0] === "true" ? schema.typeError("You must enter a number").min(0, "Must be a non-negative number").required("Target Amount is required") : schema),
        valuation: yup.number().optional().transform((value, originalValue) => originalValue === "" || originalValue == null ? null : value).nullable(true).when("money_raising", (val, schema) => val && val[0] === "true" ? schema.test("is-zero-or-greater", "Must be a positive number", (value) => (!isNaN(value) ? value >= 0 : true)) : schema),
        multi_chain: yup.string().required("Required").oneOf(["true", "false"], "Invalid value"),
        multi_chain_names: yup.string().when("multi_chain", (val, schema) => val && val[0] === "true" ? schema.test("is-non-empty", "At least one chain name required", (value) => /\S/.test(value)).required("At least one chain name required") : schema),
        promotional_video: yup.string().nullable(true).optional().url("Invalid url"),
        project_discord: yup.string().nullable(true).optional().url("Invalid url"),
        project_linkedin: yup.string().nullable(true).optional().url("Invalid url"),
        github_link: yup.string().nullable(true).optional().url("Invalid url"),
        token_economics: yup.string().nullable(true).optional().url("Invalid url"),
        white_paper: yup.string().nullable(true).optional().url("Invalid url"),
        upload_public_documents: yup.string().required("Required").oneOf(["true", "false"], "Invalid value"),
        publicDocs: yup.array().of(
            yup.object().shape({
                title: yup.string().required("Title is required").test("no-leading-spaces", "Title should not have leading spaces", (value) => !value || value.trimStart() === value),
                link: yup.string().url("Must be a valid URL").required("Link is required"),
            })
        ),
        upload_private_documents: yup.string().required("Required").oneOf(["true", "false"], "Invalid value"),
        privateDocs: yup.array().of(
            yup.object().shape({
                title: yup.string().required("Title is required").test("no-leading-spaces", "Title should not have leading spaces", (value) => !value || value.trimStart() === value),
                link: yup.string().url("Must be a valid URL").required("Link is required"),
            })
        ),
    });

    const defaultValues = {

        preferred_icp_hub: "ICP Hub, Italia",
        project_name: "Name of the project",
        project_description: "This is the description of the project",
        project_elevator_pitch: "https://pitch.com",
        project_website: "https://projectwebsite.com",
        is_your_project_registered: "false",
        type_of_registration: "Company",
        country_of_registration: "India",
        live_on_icp_mainnet: "false",
        dapp_link: "https://dapplink.com",
        weekly_active_users: 0,
        revenue: 0,
        money_raising: "No",
        money_raised_till_now: "No",
        icp_grants: 0,
        investors: 0,
        raised_from_other_ecosystem: 0,
        target_amount: 0,
        valuation: 0,
        multi_chain: "No",
        multi_chain_names: "Polygon",
        promotional_video: "https://promotionalvideo.com",
        project_discord: "https://discord.com",
        project_linkedin: "https://linkedin.com",
        github_link: "https://githublink.com",
        token_economics: "",
        white_paper: "",
        upload_public_documents: "false",
        publicDocs: [],
        upload_private_documents: "false",
        privateDocs: [],
        link: "",
    };

    const [editMode, setEditMode] = useState({});
    const [multiChainOptions, setMultiChainOptions] = useState([]);
    const [multiChainSelectedOptions, setMultiChainSelectedOptions] = useState([]);
    const [formData, setFormData] = useState(defaultValues);

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
            setFormValues(projectFullData);
            setEditMode(true);
        } else if (userFullData) {
            setFormValues(userFullData);
        }
    }, [userFullData, projectFullData]);

    const setFormValues = (data) => {
        if (data) {
            Object.keys(data).forEach((key) => {
                setValue(key, data[key] || "");
            });
            setFormData(data);
        }
    };

    const handleSave = (data) => {
        setFormData(data);
        setEditMode(false);
        toast.success("Data saved successfully!");
    };


    const handleCancel = () => {
        setEditMode(false);
        setFormValues(formData);
    };

    const handleEditClick = (field) => {
        setEditMode({ ...editMode, [field]: true });
    };
    const editableRef = useRef(null);
    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    // const handleClickOutside = (event) => {
    //     if (editableRef.current && !editableRef.current.contains(event.target)) {
    //         setEdit({
    //             preferred_icp_hub: false,
    //             project_name: false,
    //             project_description: false,
    //             project_elevator_pitch: false,
    //             project_website: false,
    //             is_your_project_registered: false,
    //             type_of_registration: false,
    //             country_of_registration: false,
    //             live_on_icp_mainnet: false,
    //             dapp_link: false,
    //             weekly_active_users: false,
    //             revenue: false,
    //             money_raising: false,
    //             money_raised_till_now: false,
    //             icp_grants: false,
    //             investors: false,
    //             raised_from_other_ecosystem: false,
    //             target_amount: false,
    //             valuation: false,
    //             multi_chain: false,
    //             multi_chain_names: false,
    //             promotional_video: false,
    //             project_discord: false,
    //             project_linkedin: false,
    //             github_link: false,
    //             token_economics: false,
    //             white_paper: false,
    //             upload_public_documents: false,
    //             publicDocs: false,
    //             upload_private_documents: false,
    //             privateDocs: false,
    //             link: false,
    //         });
    //     }
    // };
    const projectDetailRef = useRef(null);
    const handleClickOutside = (event) => {
        if (projectDetailRef.current && !projectDetailRef.current.contains(event.target)) {
            // If any field is in edit mode, save the form and reset edit mode
            if (Object.values(editMode).some((isEditing) => isEditing)) {
                handleSubmit((data) => {
                    handleSave(data);
                    setEditMode({}); // Reset edit mode after saving
                })();
            } else {
                // Reset edit mode even if no changes were detected
                setEditMode({});
            }
        }
    };


    return (<div ref={projectDetailRef} className="px-1">
        <div className="px-1">
            {/* Preferred ICP Hub */}
            <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3">
                <div className="flex justify-between items-center">
                    <label className="block    hover:whitespace-normal font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start ">
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
                            className={`bg-gray-50 border-2 ${errors.preferred_icp_hub
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
                    <label className="font-semibold text-xs text-gray-500 uppercase ">
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
                            className={`bg-gray-50 border-2 ${errors.project_name
                                ? "border-red-500 "
                                : "border-[#737373]"
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
                        <span className="mr-2 text-sm">
                            {getValues("project_name")}
                        </span>
                    </div>
                )}
            </div>

            {/* Project Description */}
            <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3">
                <div className="flex justify-between items-center">
                    <label className="font-semibold text-xs text-gray-500 uppercase ">
                        Project Description (50 words)
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
                            className={`bg-gray-50 border-2 ${errors.project_description
                                ? "border-red-500 "
                                : "border-[#737373]"
                                } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-1 px-1.5`}
                            placeholder="Max 50 words"
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
                    <label className="font-semibold text-xs text-gray-500 uppercase">
                        Project Pitch Deck
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
                            className={`bg-gray-50 border-2 ${errors.project_elevator_pitch
                                ? "border-red-500"
                                : "border-[#737373]"
                                } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-1 px-1.5`}
                            style={{ wordBreak: 'break-word' }} // Ensure words break and wrap within the input
                        />
                        {errors.project_elevator_pitch && (
                            <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                                {errors.project_elevator_pitch.message}
                            </span>
                        )}
                    </div>
                ) : (
                    <div className="flex justify-between items-center cursor-pointer py-1">
                        <span className="mr-2 text-sm break-words" style={{ wordBreak: 'break-word' }}>
                            {getValues("project_elevator_pitch")}
                        </span>
                    </div>
                )}
            </div>


            {/* Project Website */}
            <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3">
                <div className="flex justify-between items-center">
                    <label className="font-semibold text-xs text-gray-500 uppercase ">
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
                    <>
                        <input
                            type="text"
                            {...register("project_website")}
                            className={`bg-gray-50 border-2 ${errors.project_website
                                ? "border-red-500 "
                                : "border-[#737373]"
                                } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-1 px-1.5`}
                            placeholder="https://"
                        />
                        {errors.project_website && (
                            <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                                {errors.project_website.message}
                            </span>
                        )}
                    </>
                ) : (
                    <div className="flex justify-between items-center cursor-pointer py-1">
                        <span className="mr-2 text-sm break-words" style={{ wordBreak: 'break-word' }}>
                            {getValues("project_website")}
                        </span>
                    </div>
                )}
            </div>

            {/* Is Your Project Registered */}
            <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3">
                <div className="flex justify-between items-center">
                    <label className="font-semibold text-xs text-gray-500 uppercase ">
                        Is your project registered
                    </label>
                    <img
                        src={editp}
                        className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
                        alt="edit"
                        onClick={() =>
                            handleEditClick("is_your_project_registered")
                        }
                    />
                </div>
                {editMode.is_your_project_registered ? (
                    <div>
                        <select
                            {...register("is_your_project_registered")}
                            className={`bg-gray-50 border-2 ${errors.is_your_project_registered
                                ? "border-red-500"
                                : "border-[#737373]"
                                } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-1 px-1.5`}
                        >
                            <option className="text-lg font-bold" value="false">
                                No
                            </option>
                            <option className="text-lg font-bold" value="true">
                                Yes
                            </option>
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
                            {getValues("is_your_project_registered")}
                        </span>
                    </div>
                )}
            </div>

            {watch("is_your_project_registered") === "true" && (
                <>
                    {/* Type of Registration */}
                    <div className="group relative hover:bg-gray-100 rounded-lg px-3 p-2 ">
                        <div className="flex justify-between items-center">
                            <label className="font-semibold text-xs text-gray-500 uppercase ">
                                Type of Registration
                            </label>
                            <img
                                src={editp}
                                className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
                                alt="edit"
                                onClick={() =>
                                    handleEditClick("type_of_registration")
                                }
                            />
                        </div>
                        {editMode.type_of_registration ? (
                            <div>
                                <select
                                    {...register("type_of_registration")}
                                    className={`bg-gray-50 border-2 ${errors.type_of_registration
                                        ? "border-red-500"
                                        : "border-[#737373]"
                                        } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-1 px-1.5`}
                                >
                                    <option
                                        className="text-lg font-bold"
                                        value=""
                                    >
                                        Select registration type
                                    </option>
                                    <option
                                        className="text-lg font-bold"
                                        value="Company"
                                    >
                                        Company
                                    </option>
                                    <option
                                        className="text-lg font-bold"
                                        value="DAO"
                                    >
                                        DAO
                                    </option>
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
                    <div className="group relative hover:bg-gray-100 rounded-lg px-3 p-2 ">
                        <div className="flex justify-between items-center">
                            <label className="font-semibold text-xs text-gray-500 uppercase ">
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
                                    className={`bg-gray-50 border-2 ${errors.country_of_registration
                                        ? "border-red-500 "
                                        : "border-[#737373]"
                                        } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-1 px-1.5`}
                                >
                                    <option className="text-lg font-bold" value="">
                                        Select your country
                                    </option>
                                    {countries?.map((expert) => (
                                        <option
                                            key={expert.name}
                                            value={expert.name}
                                            className="text-lg font-bold"
                                        >
                                            {expert.name}
                                        </option>
                                    ))}
                                </select>
                                {errors?.country_of_registration && (
                                    <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                                        {errors?.country_of_registration?.message}
                                    </span>
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


            {/* Multi-Chain */}
            {/* <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3">
                <div className="flex justify-between items-center">
                    <label className="font-semibold text-xs text-gray-500 uppercase ">
                        Are you also multi-chain
                    </label>
                    <img
                        src={editp}
                        className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
                        alt="edit"
                        onClick={() => {
                            handleEditClick("multi_chain");
                            // Set the current value in the form field when edit mode is activated
                            setValue("multi_chain", getValues("multi_chain"));
                        }}
                    />
                </div>
                {editMode.multi_chain ? (
                    <div>
                        <select
                            {...register("multi_chain")}
                            className={`bg-gray-50 border-2 ${errors.multi_chain
                                ? "border-red-500"
                                : "border-[#737373]"
                                } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-1 px-1.5`}
                            placeholder="Select.."
                        >
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
            </div> */}
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
                            // Set the current value in the form field when edit mode is activated
                            setValue("multi_chain", getValues("multi_chain"));
                        }}
                    />
                </div>
                {editMode.multi_chain ? (
                    <div>
                        <select
                            {...register("multi_chain")}
                            className={`bg-gray-50 border-2 ${errors.multi_chain
                                ? "border-red-500"
                                : "border-[#737373]"
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
                    {editMode.multiChain ? (
                        <ReactSelect
                            isMulti
                            menuPortalTarget={document.body}
                            menuPosition={"fixed"}
                            styles={{
                                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                control: (provided) => ({
                                    ...provided,
                                    borderRadius: "8px",
                                    border: errors.multi_chain_names
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
                                    color: errors.multi_chain_names
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
                    ) : (
                        <div className="flex flex-wrap gap-2 cursor-pointer py-1">
                            {getValues("multi_chain_names") &&
                                getValues("multi_chain_names")
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
                    {errors.multi_chain_names && (
                        <p className="mt-1 text-sm text-red-500 font-bold text-left">
                            {errors.multi_chain_names.message}
                        </p>
                    )}
                </div>

            )}

            {/* Live on ICP */}
            <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3">
                <div className="flex justify-between items-center">
                    <label className="font-semibold text-xs text-gray-500 uppercase ">
                        Live on ICP
                    </label>
                    <img
                        src={editp}
                        className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
                        alt="edit"
                        onClick={() =>
                            handleEditClick("live_on_icp_mainnet")
                        }
                    />
                </div>
                {editMode.live_on_icp_mainnet ? (
                    <div>
                        <select
                            {...register("live_on_icp_mainnet")}
                            className={`bg-gray-50 border-2 ${errors.live_on_icp_mainnet
                                ? "border-red-500"
                                : "border-[#737373]"
                                } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-1 px-1.5`}
                        >
                            <option className="text-lg font-bold" value="false">
                                No
                            </option>
                            <option className="text-lg font-bold" value="true">
                                Yes
                            </option>
                        </select>
                        {errors.live_on_icp_mainnet && (
                            <p className="mt-1 text-sm text-red-500 font-bold text-left">
                                {errors.live_on_icp_mainnet.message}
                            </p>
                        )}
                    </div>
                ) : (
                    <div className="flex justify-between items-center cursor-pointer">
                        <span className="mr-2 text-sm">
                            {getValues("live_on_icp_mainnet")}
                        </span>
                    </div>
                )}
            </div>

            {watch("live_on_icp_mainnet") === "true" && (
                <>
                    <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3">
                        <div className="flex justify-between items-center">
                            <label
                                htmlFor="dapp_link"
                                className="font-semibold text-xs text-gray-500 uppercase"
                            >
                                dApp Link <span className="text-red-500">*</span>
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
                                    className={`bg-gray-50 border-2 ${errors.dapp_link
                                        ? "border-red-500"
                                        : "border-[#737373]"
                                        } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-1 px-1.5`}
                                    placeholder="https://"
                                />
                                {errors.dapp_link && (
                                    <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                                        {errors.dapp_link.message}
                                    </span>
                                )}
                            </div>
                        ) : (
                            <div className="flex justify-between items-center cursor-pointer py-1">
                                <span className="mr-2 text-sm break-words" style={{ wordBreak: 'break-word' }}>

                                    {getValues("dapp_link")}
                                </span>
                            </div>
                        )}
                    </div>


                    <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3">
                        <div className="flex justify-between items-center">
                            <label
                                htmlFor="weekly_active_users"
                                className="font-semibold text-xs text-gray-500 uppercase"
                            >
                                Weekly active users
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
                                    className={`bg-gray-50 border-2 ${errors.weekly_active_users
                                        ? "border-red-500"
                                        : "border-[#737373]"
                                        } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-1 px-1.5`}
                                    placeholder="Enter Weekly active users"
                                    onWheel={(e) => e.target.blur()}
                                    min={0}
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


                    <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3">
                        <div className="flex justify-between items-center">
                            <label
                                htmlFor="revenue"
                                className="font-semibold text-xs text-gray-500 uppercase"
                            >
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
                                    className={`bg-gray-50 border-2 ${errors.revenue
                                        ? "border-red-500"
                                        : "border-[#737373]"
                                        } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-1 px-1.5`}
                                    placeholder="Enter Revenue"
                                    onWheel={(e) => e.target.blur()}
                                    min={0}
                                />
                                {errors.revenue && (
                                    <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                                        {errors.revenue.message}
                                    </span>
                                )}
                            </div>
                        ) : (
                            <div className="flex justify-between items-center cursor-pointer py-1">
                                <span className="mr-2 text-sm">
                                    {getValues("revenue")}
                                </span>
                            </div>
                        )}
                    </div>

                </>
            )}

            {/* Money Raised Till Now */}
            <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3">
                <div className="flex justify-between items-center">
                    <label className="font-semibold text-xs text-gray-500 uppercase ">
                        Have you raised any funds in past
                    </label>
                    <img
                        src={editp}
                        className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
                        alt="edit"
                        onClick={() =>
                            handleEditClick("money_raised_till_now")
                        }
                    />
                </div>
                {editMode.money_raised_till_now ? (
                    <div>
                        <select
                            {...register("money_raised_till_now")}
                            className={`bg-gray-50 border-2 ${errors.money_raised_till_now
                                ? "border-red-500"
                                : "border-[#737373]"
                                } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-1 px-1.5`}
                        >
                            <option className="text-lg font-bold" value="false">
                                No
                            </option>
                            <option className="text-lg font-bold" value="true">
                                Yes
                            </option>
                        </select>
                        {errors.money_raised_till_now && (
                            <p className="mt-1 text-sm text-red-500 font-bold text-left">
                                {errors.money_raised_till_now.message}
                            </p>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-2 cursor-pointer py-1">
                        {getValues("money_raised_till_now") &&
                            typeof getValues("money_raised_till_now") === "string"
                            ? getValues("money_raised_till_now")
                                .split(", ")
                                .map((category, index) => (
                                    <span
                                        key={index}
                                        className=" mr-2 text-sm"
                                    >
                                        {category}
                                    </span>
                                ))
                            : getValues("money_raised_till_now") === "true" ? (
                                <span className="border-2 border-gray-500 rounded-full text-gray-700 text-xs px-2 py-1">
                                    Yes
                                </span>
                            ) : (
                                <span className="border-2 border-gray-500 rounded-full text-gray-700 text-xs px-2 py-1">
                                    No funds raised
                                </span>
                            )}
                    </div>
                )}
            </div>

            {watch("money_raised_till_now") === "true" && (
                <>
                    <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3">
                        <div className="flex justify-between items-center">
                            <label
                                htmlFor="icp_grants"
                                className="block hover:whitespace-normal font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start"
                            >
                                How much funding have you raised in grants (USD)?
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
                                    className={`bg-gray-50 border-2 ${errors.icp_grants
                                        ? "border-red-500"
                                        : "border-[#737373]"
                                        } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-1 px-1.5`}
                                    placeholder="Enter your Grants"
                                    onWheel={(e) => e.target.blur()}
                                    min={0}
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


                    <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3">
                        <div className="flex justify-between items-center">
                            <label
                                htmlFor="investors"
                                className="block hover:whitespace-normal font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start"
                            >
                                How much funding have you received from Investors (USD)?
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
                                    className={`bg-gray-50 border-2 ${errors.investors
                                        ? "border-red-500"
                                        : "border-[#737373]"
                                        } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-1 px-1.5`}
                                    placeholder="Enter Investors"
                                    onWheel={(e) => e.target.blur()}
                                    min={0}
                                />
                                {errors.investors && (
                                    <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                                        {errors.investors.message}
                                    </span>
                                )}
                            </div>
                        ) : (
                            <div className="flex justify-between items-center cursor-pointer py-1">
                                <span className="mr-2 text-sm">
                                    {getValues("investors")}
                                </span>
                            </div>
                        )}
                    </div>


                    <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3">
                        <div className="flex justify-between items-center">
                            <label
                                htmlFor="raised_from_other_ecosystem"
                                className="block hover:whitespace-normal font-semibold text-xs text-gray-500 uppercase truncate overflow-hidden text-start"
                            >
                                How much funding has been provided through the launchpad program (USD)?
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
                                    className={`bg-gray-50 border-2 ${errors.raised_from_other_ecosystem
                                        ? "border-red-500"
                                        : "border-[#737373]"
                                        } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-1 px-1.5`}
                                    placeholder="Enter Launchpad"
                                    onWheel={(e) => e.target.blur()}
                                    min={0}
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
                    <label className="font-semibold text-xs text-gray-500 uppercase ">
                        Are you currently raising money
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
                            className={`bg-gray-50 border-2 ${errors.money_raising
                                ? "border-red-500"
                                : "border-[#737373]"
                                } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-1 px-1.5`}
                        >
                            <option className="text-lg font-bold" value="false">
                                No
                            </option>
                            <option className="text-lg font-bold" value="true">
                                Yes
                            </option>
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
                            {getValues("money_raising")}
                        </span>
                    </div>
                )}
            </div>

            {watch("money_raising") === "true" && (
                <>
                    <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3">
                        <div className="flex justify-between items-center">
                            <label
                                htmlFor="target_amount"
                                className="font-semibold text-xs text-gray-500 uppercase"
                            >
                                Target Amount (in Millions USD)
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
                                    className={`bg-gray-50 border-2 ${errors.target_amount
                                        ? "border-red-500"
                                        : "border-[#737373]"
                                        } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-1 px-1.5`}
                                    placeholder="Enter your Target Amount"
                                    onWheel={(e) => e.target.blur()}
                                    min={0}
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


                    <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3">
                        <div className="flex justify-between items-center">
                            <label
                                htmlFor="valuation"
                                className="font-semibold text-xs text-gray-500 uppercase"
                            >
                                Valuation (USD)
                            </label>
                            <img
                                src={editp}
                                className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
                                alt="edit"
                                onClick={() => handleEditClick("valuation")}
                            />
                        </div>
                        {editMode.valuation ? (
                            <div>
                                <input
                                    type="number"
                                    {...register("valuation")}
                                    className={`bg-gray-50 border-2 ${errors.valuation
                                        ? "border-red-500"
                                        : "border-[#737373]"
                                        } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-1 px-1.5`}
                                    placeholder="Enter valuation (In million)"
                                    onWheel={(e) => e.target.blur()}
                                    min={0}
                                />
                                {errors.valuation && (
                                    <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                                        {errors.valuation.message}
                                    </span>
                                )}
                            </div>
                        ) : (
                            <div className="flex justify-between items-center cursor-pointer py-1">
                                <span className="mr-2 text-sm">
                                    {getValues("valuation")}
                                </span>
                            </div>
                        )}
                    </div>

                </>
            )}

            {/* Promotional Video */}
            <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3">
                <div className="flex justify-between items-center">
                    <label className="font-semibold text-xs text-gray-500 uppercase ">
                        Promotion video link
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
                            className={`bg-gray-50 border-2 ${errors.promotional_video
                                ? "border-red-500 "
                                : "border-[#737373]"
                                } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-1 px-1.5`}
                            placeholder="https://"
                        />
                        {errors.promotional_video && (
                            <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                                {errors.promotional_video.message}
                            </span>
                        )}
                    </div>
                ) : (
                    <div className="flex justify-between items-center cursor-pointer py-1">
                        <span className="mr-2 text-sm break-words line-clamp-1 hover:line-clamp-3" style={{ wordBreak: 'break-word' }}>

                            {getValues("promotional_video")}
                        </span>
                    </div>
                )}
            </div>

            {/* Project Discord */}
            {/* <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3">
                <div className="flex justify-between items-center">
                    <label className="font-semibold text-xs text-gray-500 uppercase ">
                        Project Discord
                    </label>
                    <img
                        src={editp}
                        className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
                        alt="edit"
                        onClick={() => handleEditClick("project_discord")}
                    />
                </div>
                {editMode.project_discord ? (
                    <div>
                        <input
                            type="text"
                            {...register("project_discord")}
                            className={`bg-gray-50 border-2 ${errors.project_discord
                                ? "border-red-500 "
                                : "border-[#737373]"
                                } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-1 px-1.5`}
                            placeholder="https://"
                        />
                        {errors.project_discord && (
                            <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                                {errors.project_discord.message}
                            </span>
                        )}
                    </div>
                ) : (
                    <div className="flex justify-between items-center cursor-pointer py-1">
                        <span className="mr-2 text-sm">
                            {getValues("project_discord")}
                        </span>
                    </div>
                )}
            </div> */}

            {/* Project LinkedIn */}
            {/* <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3">
                <div className="flex justify-between items-center">
                    <label className="font-semibold text-xs text-gray-500 uppercase ">
                        Project LinkedIn
                    </label>
                    <img
                        src={editp}
                        className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
                        alt="edit"
                        onClick={() => handleEditClick("project_linkedin")}
                    />
                </div>
                {editMode.project_linkedin ? (
                    <div>
                        <input
                            type="text"
                            {...register("project_linkedin")}
                            className={`bg-gray-50 border-2 ${errors.project_linkedin
                                ? "border-red-500 "
                                : "border-[#737373]"
                                } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-1 px-1.5`}
                            placeholder="https://"
                        />
                        {errors.project_linkedin && (
                            <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                                {errors.project_linkedin.message}
                            </span>
                        )}
                    </div>
                ) : (
                    <div className="flex justify-between items-center cursor-pointer py-1">
                        <span className="mr-2 text-sm">
                            {getValues("project_linkedin")}
                        </span>
                    </div>
                )}
            </div> */}

            {/* Github */}
            {/* <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3">
                <div className="flex justify-between items-center">
                    <label className="font-semibold text-xs text-gray-500 uppercase ">
                        Project Github
                    </label>
                    <img
                        src={editp}
                        className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
                        alt="edit"
                        onClick={() => handleEditClick("github_link")}
                    />
                </div>
                {editMode.github_link ? (
                    <div>
                        <input
                            type="text"
                            {...register("github_link")}
                            className={`bg-gray-50 border-2 ${errors.github_link
                                ? "border-red-500 "
                                : "border-[#737373]"
                                } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-1 px-1.5`}
                            placeholder="https://"
                        />
                        {errors.github_link && (
                            <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                                {errors.github_link.message}
                            </span>
                        )}
                    </div>
                ) : (
                    <div className="flex justify-between items-center cursor-pointer py-1">
                        <span className="mr-2 text-sm">
                            {getValues("github_link")}
                        </span>
                    </div>
                )}
            </div> */}
            {/* <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3">
                <div className="flex justify-between items-center">
                    <label className="font-semibold text-xs text-gray-500 uppercase ">
                        Links
                    </label>
                    <div className="relative">
                        {fields.map((item, index) => (
                            <div key={item.id} className="flex items-center mb-4 border-b pb-2">
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
                                                    className={`p-2 border ${fieldState.error
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
                </div>
            </div> */}
            <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3">
                <div className="flex justify-between items-center">
                    <label className="font-semibold text-xs text-gray-500 uppercase mb-2">
                        Links
                    </label>
                    <img
                        src={editp}
                        className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4 cursor-pointer"
                        alt="edit"
                        onClick={() => handleEditClick("links")}
                    />
                </div>
                {editMode.links ? (
                    <div className="relative">
                        {fields.map((item, index) => (
                            <div key={item.id} className="flex items-center mb-4 border-b pb-2">
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
                                                    className={`px-2 py-1 border ${fieldState.error
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
                                        {/* {linkObj.link} */}
                                    </span>
                                </div>
                            ))}
                    </div>
                )}
            </div>


            {(Object.values(editMode).some((value) => value)) && (
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
                        onClick={handleSave}
                        className="bg-blue-600 text-white py-2 px-4 rounded"
                    >
                        Save
                    </button>
                </div>
            )}
        </div>
    </div>
    )
}




export default ProjectDetail;
{/* Token Economics */ }
{/* <div className="group relative hover:bg-gray-100 rounded-lg p-2 px-3">
                <div className="flex justify-between items-center">
                    <label className="font-semibold text-xs text-gray-500 uppercase ">
                        Tokenomics
                    </label>
                    <img
                        src={editp}
                        className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
                        alt="edit"
                        onClick={() => handleEditClick("token_economics")}
                    />
                </div>
                {editMode.token_economics ? (
                    <div>
                        <input
                            type="text"
                            {...register("token_economics")}
                            className={`bg-gray-50 border-2 ${
                                errors.token_economics
                                    ? "border-red-500 "
                                    : "border-[#737373]"
                            } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w/full py-1 px-1.5`}
                            placeholder="https://"
                        />
                        {errors.token_economics && (
                            <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                                {errors.token_economics.message}
                            </span>
                        )}
                    </div>
                ) : (
                    <div className="flex justify-between items-center cursor-pointer py-1">
                        <span className="mr-2 text-sm">
                            {getValues("token_economics")}
                        </span>
                    </div>
                )}
            </div> */}




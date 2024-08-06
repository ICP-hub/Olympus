import React, { useState, useEffect } from "react";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ProjectRegister1 from "./ProjectRegister1";
import ProjectRegister2 from "./ProjectRegister2";
import ProjectRegister3 from "./ProjectRegister3";
import ProjectRegister4 from "./ProjectRegister4";
import ProjectRegister5 from "./ProjectRegister5";
// import Layer1 from "../../../assets/Logo/Layer1.png";
// import Aboutcard from "../UserRegistration/Aboutcard";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// import AboutcardSkeleton from "../LatestSkeleton/AbourcardSkeleton";
import { useNavigate } from "react-router-dom";

import {
    useForm,
    Controller,
    FormProvider,
    useFieldArray,
} from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
// import DetailHeroSection from "../Common/DetailHeroSection";
import { ThreeDots } from "react-loader-spinner";
import { useCountries } from "react-countries";

import { Principal } from "@dfinity/principal";
import { allHubHandlerRequest } from "../../StateManagement/Redux/Reducers/All_IcpHubReducer";

const ProjectRegisterMain = () => {

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
    const projectFullData = useSelector(
        (currState) => currState.projectData.data
    );
    console.log("projectFullData in projectRejForm ===>", projectFullData);
    const userCurrentRoleStatusActiveRole = useSelector(
        (currState) => currState.currentRoleStatus.activeRole
    );
    // STATES

    const [privateDocs, setPrivateDocs] = useState([]);
    const [publicDocs, setPublicDocs] = useState([]);
    const [disableButton, setDisableButton] = useState(false);
    // user image states
    const [imagePreview, setImagePreview] = useState(null);
    const [imageData, setImageData] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);
    const [logoData, setLogoData] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);
    const [coverData, setCoverData] = useState(null);
    const [editMode, setEditMode] = useState(null);

    // default & static options states
    const [interestedDomainsOptions, setInterestedDomainsOptions] = useState([]);
    const [
        interestedDomainsSelectedOptions,
        setInterestedDomainsSelectedOptions,
    ] = useState([]);
    const [typeOfProfileOptions, setTypeOfProfileOptions] = useState([]);

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
    const [reasonOfJoiningSelectedOptions, setReasonOfJoiningSelectedOptions] =
        useState([]);
    // Mentor from states
    const [multiChainOptions, setMultiChainOptions] = useState([]);
    const [multiChainSelectedOptions, setMultiChainSelectedOptions] = useState(
        []
    );
    // Function to generate dynamic fields based on count
    // const generateDynamicFields = (count) => {
    //   const dynamicFields = {};

    //   for (let i = 0; i < count; i++) {
    //     dynamicFields[`private_title${i + 1}`] = yup
    //       .string("Invalid")
    //       .test("is-non-empty", "Required", (value) => /\S/.test(value))
    //       .required("Title isRequied");
    //     dynamicFields[`private_link${i + 1}`] = yup
    //       .string("Invalid")
    //       .url("Invalid url")
    //       .required("Link is Requied");
    //   }
    //   return yup.object().shape(dynamicFields);
    // };
    // const generateDynamicPublicFields = (count) => {
    //   const dynamicFields = {};

    //   for (let i = 0; i < count; i++) {
    //     dynamicFields[`public_title${i + 1}`] = yup
    //       .string("Invalid")
    //       .test("is-non-empty", "Required", (value) => /\S/.test(value))
    //       .required("Title isRequied");
    //     dynamicFields[`public_link${i + 1}`] = yup
    //       .string("Invalid")
    //       .url("Invalid url")
    //       .required("Link is Requied");
    //   }
    //   return yup.object().shape(dynamicFields);
    // };

    // user reg form validation schema
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
            logo: yup
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
            cover: yup
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
            preferred_icp_hub: yup
                .string()
                .test("is-non-empty", "ICP Hub selection is required", (value) =>
                    /\S/.test(value)
                )
                .required("ICP Hub selection is required"),
            project_name: yup
                .string()
                .test("is-non-empty", "Project name is required", (value) =>
                    /\S/.test(value)
                )
                .test(
                    "no-leading-spaces",
                    "Project name should not have leading spaces",
                    (value) => !value || value.trimStart() === value
                )
                .required("Project name is required"),
            project_description: yup
                .string()
                .test(
                    "maxWords",
                    "Project Description must not exceed 50 words",
                    (value) =>
                        !value || value.trim().split(/\s+/).filter(Boolean).length <= 50
                )
                .test(
                    "maxChars",
                    "Project Description must not exceed 500 characters",
                    (value) => !value || value.length <= 500
                )
                .optional(),
            // .required("Project Description is required"),
            project_elevator_pitch: yup.string().url("Invalid url").optional(),
            // .required("Project Pitch deck is required"),
            project_website: yup
                .string()
                .nullable(true)
                .optional()
                .url("Invalid url"),
            is_your_project_registered: yup
                .string()
                .required("Required")
                .oneOf(["true", "false"], "Invalid value"),
            type_of_registration: yup
                .string()
                .when("is_your_project_registered", (val, schema) =>
                    val && val[0] === "true"
                        ? schema
                            .test(
                                "is-non-empty",
                                "Type of registration is required",
                                (value) => /\S/.test(value)
                            )
                            .required("Type of registration is required")
                        : schema
                ),
            country_of_registration: yup
                .string()
                .when("is_your_project_registered", (val, schema) =>
                    val && val[0] === "true"
                        ? schema
                            .test(
                                "is-non-empty",
                                "Country of registration is required",
                                (value) => /\S/.test(value)
                            )
                            .required("Country of registration is required")
                        : schema
                ),
            live_on_icp_mainnet: yup
                .string()
                .required("Required")
                .oneOf(["true", "false"], "Invalid value"),
            dapp_link: yup.string().when("live_on_icp_mainnet", (val, schema) =>
                val && val[0] === "true"
                    ? schema
                        .test("is-non-empty", "dApp Link is required", (value) =>
                            /\S/.test(value)
                        )
                        .url("Invalid url")
                        .required("dApp Link is required")
                    : schema
            ),
            weekly_active_users: yup.number().nullable(true).optional(),
            revenue: yup.number().nullable(true).optional(),

            money_raising: yup
                .string()
                .required("Required")
                .oneOf(["true", "false"], "Invalid value"),
            money_raised_till_now: yup
                .string()
                .required("Required")
                .oneOf(["true", "false"], "Invalid value"),

            icp_grants: yup
                .mixed()
                .test(
                    "is-required-or-nullable",
                    "You must enter a number",
                    function (value) {
                        const { money_raised_till_now } = this.parent;
                        if (money_raised_till_now === "true") {
                            return yup
                                .number()
                                .min(0, "Must be a non-negative number")
                                .isValidSync(value);
                        }
                        return value === null || value === "" || value === 0;
                    }
                ),
            investors: yup
                .mixed()
                .test(
                    "is-required-or-nullable",
                    "You must enter a number",
                    function (value) {
                        const { money_raised_till_now } = this.parent;
                        if (money_raised_till_now === "true") {
                            return yup
                                .number()
                                .min(0, "Must be a non-negative number")
                                .isValidSync(value);
                        }
                        return value === null || value === "" || value === 0;
                    }
                ),

            raised_from_other_ecosystem: yup
                .mixed()
                .test(
                    "is-required-or-nullable",
                    "You must enter a number",
                    function (value) {
                        const { money_raised_till_now } = this.parent;
                        if (money_raised_till_now === "true") {
                            return yup
                                .number()
                                .min(0, "Must be a non-negative number")
                                .isValidSync(value);
                        }
                        return value === null || value === "" || value === 0;
                    }
                ),
            target_amount: yup
                .number()
                .when("money_raising", (val, schema) =>
                    val && val[0] === "true"
                        ? schema
                            .typeError("You must enter a number")
                            .min(0, "Must be a non-negative number")
                            .required("Target Amount is required")
                        : schema
                ),
            valuation: yup
                .number()
                .optional()
                .transform((value, originalValue) =>
                    originalValue === "" || originalValue == null ? null : value
                )
                .nullable(true)
                .when("money_raising", (val, schema) =>
                    val && val[0] === "true"
                        ? schema.test(
                            "is-zero-or-greater",
                            "Must be a positive number",
                            (value) => (!isNaN(value) ? value >= 0 : true)
                        )
                        : schema
                ),
            multi_chain: yup
                .string()
                .required("Required")
                .oneOf(["true", "false"], "Invalid value"),
            multi_chain_names: yup
                .string()
                .when("multi_chain", (val, schema) =>
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
            promotional_video: yup
                .string()
                .nullable(true)
                .optional()
                .url("Invalid url"),
            project_discord: yup
                .string()
                .nullable(true)
                .optional()
                // .test("is-valid-discord", "Invalid Discord URL", (value) => {
                //   if (!value) return true;
                //   const hasValidChars =
                //     /^(https?:\/\/)?(www\.)?(discord\.(gg|com)\/(invite\/)?[a-zA-Z0-9\-_]+|discordapp\.com\/invite\/[a-zA-Z0-9\-_]+)$/.test(
                //       value
                //     );
                //   return hasValidChars;
                // })
                .url("Invalid url"),
            project_linkedin: yup
                .string()
                .nullable(true)
                .optional()
                // .test("is-valid-linkedin", "Invalid LinkedIn URL", (value) => {
                //   if (!value) return true;
                //   const hasValidChars =
                //     /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/.test(
                //       value
                //     );
                //   return hasValidChars;
                // })
                .url("Invalid url"),
            github_link: yup
                .string()
                .nullable(true)
                .optional()
                // .test("is-valid-github", "Invalid GitHub URL", (value) => {
                //   if (!value) return true;
                //   const hasValidChars =
                //     /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_\-]+(\/[a-zA-Z0-9_\-]+)?(\/)?$/.test(
                //       value
                //     );
                //   return hasValidChars;
                // })
                .url("Invalid url"),
            token_economics: yup
                .string()
                .nullable(true)
                .optional()
                .url("Invalid url"),
            white_paper: yup.string().nullable(true).optional().url("Invalid url"),
            upload_public_documents: yup
                .string()
                .required("Required")
                .oneOf(["true", "false"], "Invalid value"),
            publicDocs: yup.array().of(
                yup.object().shape({
                    title: yup
                        .string()
                        .required("Title is required")
                        .test(
                            "no-leading-spaces",
                            "Title should not have leading spaces",
                            (value) => !value || value.trimStart() === value
                        ),
                    link: yup
                        .string()
                        .url("Must be a valid URL")
                        .required("Link is required"),
                })
            ),
            upload_private_documents: yup
                .string()
                .required("Required")
                .oneOf(["true", "false"], "Invalid value"),
            privateDocs: yup.array().of(
                yup.object().shape({
                    title: yup
                        .string()
                        .required("Title is required")
                        .test(
                            "no-leading-spaces",
                            "Title should not have leading spaces",
                            (value) => !value || value.trimStart() === value
                        ),
                    link: yup
                        .string()
                        .url("Must be a valid URL")
                        .required("Link is required"),
                })
            ),
        })
        .required();
    const defaultValues = {
        upload_public_documents: "false",
        publicDocs: [],
        upload_private_documents: "false",
        privateDocs: [],
        weekly_active_users: 0,
        revenue: 0,
        money_raised_till_now: "false",
        icp_grants: 0,
        investors: 0,
        raised_from_other_ecosystem: 0,
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
        defaultValues,
    });
    const [selectedTypeOfProfile, setSelectedTypeOfProfile] = useState(
        watch("type_of_profile")
    );

    console.log("defaultValues", defaultValues);
    // Add Private Docs

    const {
        fields: fieldsPrivate,
        append: appendPrivate,
        remove: removePrivate,
    } = useFieldArray({
        control,
        name: "privateDocs",
    });

    const uploadPrivateDocuments = watch("upload_private_documents");
    React.useEffect(() => {
        if (uploadPrivateDocuments === "true" && fieldsPrivate.length === 0) {
            appendPrivate({ title: "", link: "" });
        } else if (uploadPrivateDocuments === "false") {
            removePrivate({ title: "", link: "" });
        }
    }, [
        uploadPrivateDocuments,
        appendPrivate,
        removePrivate,
        fieldsPrivate.length,
    ]);

    const { fields, append, remove } = useFieldArray({
        control,
        name: "publicDocs",
    });

    const uploadPublicDocuments = watch("upload_public_documents");

    React.useEffect(() => {
        if (uploadPublicDocuments === "true" && fields.length === 0) {
            append({ title: "", link: "" });
        } else if (uploadPublicDocuments === "false") {
            remove({ title: "", link: "" });
        }
    }, [uploadPublicDocuments, append, remove, fields.length]);

    const removePublic = (index) => {
        if (index === 0) {
            setValue("upload_public_documents", "false");
            remove(index);
        } else {
            remove(index);
        }
    };
    const handleremovePrivate = (index) => {
        if (index === 0) {
            setValue("upload_private_documents", "false");
            removePrivate(index);
        } else {
            removePrivate(index);
        }
    };

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
                // console.log("byteArray Image ==>", byteArray);
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
    // logo creation function compression and uintarray creator
    const logoCreationFunc = async (file) => {
        const result = await trigger("logo");
        if (result) {
            try {
                const compressedFile = await CompressedImage(file);
                const reader = new FileReader();
                reader.onloadend = () => {
                    setLogoPreview(reader.result);
                };
                reader.onerror = (error) => {
                    console.error("FileReader error: ", error);
                    setError("logo", {
                        type: "manual",
                        message: "Failed to load the compressed logo.",
                    });
                };
                reader.readAsDataURL(compressedFile);

                const byteArray = new Uint8Array(await compressedFile.arrayBuffer());
                setLogoData(byteArray);
            } catch (error) {
                setError("logo", {
                    type: "manual",
                    message: "Could not process logo, please try another.",
                });
            }
        } else {
            console.log("ERROR--logoCreationFunc-file", file);
        }
    };
    // cover creation function compression and uintarray creator
    const coverCreationFunc = async (file) => {
        const result = await trigger("cover");
        if (result) {
            try {
                const compressedFile = await CompressedImage(file);
                const reader = new FileReader();
                reader.onloadend = () => {
                    setCoverPreview(reader.result);
                };
                reader.onerror = (error) => {
                    console.error("FileReader error: ", error);
                    setError("cover", {
                        type: "manual",
                        message: "Failed to load the compressed cover.",
                    });
                };
                reader.readAsDataURL(compressedFile);

                const byteArray = new Uint8Array(await compressedFile.arrayBuffer());
                setCoverData(byteArray);
            } catch (error) {
                setError("cover", {
                    type: "manual",
                    message: "Could not process cover, please try another.",
                });
            }
        } else {
            console.log("ERROR--coverCreationFunc-file", file);
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
    // clear logo func
    const clearLogoFunc = (value) => {
        let fields_id = value;
        setValue(fields_id, null);
        clearErrors(fields_id);
        setLogoData(null);
        setLogoPreview(null);
    };
    // clear cover func
    const clearCoverFunc = (val) => {
        let field_ids = val;
        setValue(field_ids, null);
        clearErrors(field_ids);
        setCoverData(null);
        setCoverPreview(null);
    };

    // form submit handler func
    const onSubmitHandler = async (data) => {
        if (actor) {
            const projectData = {
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
                // project data
                project_cover: coverData ? [coverData] : [],
                project_logo: logoData ? [logoData] : [],
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
                project_discord: [data?.project_discord || ""],
                project_linkedin: [data?.project_linkedin || ""],
                github_link: [data?.github_link || ""],
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

            console.log("projectData ==>", projectData);
            console.log("projectData ==>", logoData);
            try {
                if (userCurrentRoleStatusActiveRole === "project") {
                    let id = projectFullData?.uid;
                    await actor.update_project(id, projectData).then((result) => {
                        console.log("result in project to check update call==>", result);
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
                    userCurrentRoleStatusActiveRole === "mentor" ||
                    userCurrentRoleStatusActiveRole === "vc"
                ) {
                    await actor.register_project(projectData).then((result) => {
                        if (result && result.includes("approval request is sent")) {
                            toast.success("Approval request is sent");
                            window.location.href = "/";
                        } else {
                            toast.error(result);
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
        console.log("error", val);
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
    const setMultiChainSelectedOptionsHandler = (val) => {
        setMultiChainSelectedOptions(
            val
                ? val?.[0].split(", ").map((chain) => ({ value: chain, label: chain }))
                : []
        );
    };

    async function convertBufferToImageBlob(buffer) {
        try {
            // Assuming bufferToImageBlob returns a Promise
            const blob = await bufferToImageBlob(buffer);
            return blob;
        } catch (error) {
            console.error("Error converting buffer to image blob:", error);
            throw error; // Re-throw the error to be handled by the caller
        }
    }

    // Usage:
    async function handleProfilePicture(profilePicture) {
        try {
            const blob = await convertBufferToImageBlob(profilePicture);
            setImagePreview(blob);
        } catch (error) {
            // Handle any errors
            console.error("Error handling profile picture:", error);
        }
    }

    // set users values handler
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
            setValue("type_of_profile", val?.type_of_profile?.[0]);
            setValue(
                "reasons_to_join_platform",
                val?.reason_to_join ? val?.reason_to_join.join(", ") : ""
            );
            setReasonOfJoiningSelectedOptionsHandler(val?.reason_to_join);
        }
    };
    // set project values handler
    const setProjectValuesHandler = (val) => {
        console.log("val", val);
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
            setLogoPreview(
                val?.project_logo?.[0] instanceof Uint8Array
                    ? uint8ArrayToBase64(val?.project_logo?.[0])
                    : ""
            );
            setCoverPreview(
                val?.project_cover?.[0] instanceof Uint8Array
                    ? uint8ArrayToBase64(val?.project_cover?.[0])
                    : ""
            );
            setValue("preferred_icp_hub", val?.preferred_icp_hub?.[0]);
            setValue("project_name", val?.project_name ?? "");
            setValue("project_description", val?.project_description?.[0] ?? "");
            setValue(
                "project_elevator_pitch",
                val?.project_elevator_pitch?.[0] ?? ""
            );
            setValue("project_website", val?.project_website?.[0] ?? "");
            setValue(
                "is_your_project_registered",
                val?.is_your_project_registered ?? ""
            );
            setValue(
                "is_your_project_registered",
                val?.is_your_project_registered?.[0] ?? ""
            );
            if (val?.is_your_project_registered?.[0] === true) {
                setValue("is_your_project_registered", "true");
            } else {
                setValue("is_your_project_registered", "false");
            }
            setValue("type_of_registration", val?.type_of_registration?.[0] ?? "");
            setValue(
                "country_of_registration",
                val?.country_of_registration?.[0] ?? ""
            );
            setValue("live_on_icp_mainnet", val?.live_on_icp_mainnet?.[0] ?? "");
            if (val?.live_on_icp_mainnet?.[0] === true) {
                setValue("live_on_icp_mainnet", "true");
            } else {
                setValue("live_on_icp_mainnet", "false");
            }
            setValue("dapp_link", val?.dapp_link?.[0] ?? "");
            setValue("weekly_active_users", val?.weekly_active_users?.[0] ?? 0);
            setValue("revenue", val?.revenue?.[0] ?? 0);
            if (val?.supports_multichain?.[0]) {
                setValue("multi_chain", "true");
            } else {
                setValue("multi_chain", "false");
            }
            setValue(
                "multi_chain_names",
                val?.supports_multichain ? val?.supports_multichain.join(", ") : ""
            );
            setMultiChainSelectedOptionsHandler(val?.supports_multichain ?? null);
            if (val?.money_raised_till_now?.[0] === true) {
                setValue("money_raised_till_now", "true");
            } else {
                setValue("money_raised_till_now", "false");
            }
            if (
                val?.money_raised?.[0]?.target_amount?.[0] &&
                val?.money_raised?.[0]?.sns?.[0]
            ) {
                setValue("money_raising", "true");
            } else {
                setValue("money_raising", "false");
            }
            setValue("icp_grants", val?.money_raised?.[0]?.icp_grants?.[0] || 0);
            setValue("investors", val?.money_raised?.[0]?.investors?.[0] || 0);
            setValue(
                "raised_from_other_ecosystem",
                val?.money_raised?.[0]?.raised_from_other_ecosystem?.[0] || 0
            );
            setValue("valuation", val?.money_raised?.[0]?.sns?.[0] ?? "");
            setValue(
                "target_amount",
                val?.money_raised?.[0]?.target_amount?.[0] ?? 0
            );
            setValue(
                "target_amount",
                val?.money_raised?.[0]?.target_amount?.[0] ?? 0
            );

            setValue("promotional_video", val?.promotional_video?.[0] ?? "");
            setValue("project_discord", val?.project_discord?.[0] ?? "");
            setValue("project_linkedin", val?.project_linkedin?.[0] ?? "");
            setValue("github_link", val?.github_link?.[0] ?? "");
            setValue("token_economics", val?.token_economics?.[0] ?? "");
            setValue("white_paper", val?.long_term_goals?.[0] ?? "");
            setValue(
                "upload_private_documents",
                val?.upload_private_documents?.[0] ?? ""
            );
            if (val?.upload_private_documents?.[0] === true) {
                setValue("upload_private_documents", "true");
            } else {
                setValue("upload_private_documents", "false");
            }
            if (val && val?.public_docs?.[0] && val?.public_docs?.[0].length) {
                setValue("upload_public_documents", "true");
            } else {
                setValue("upload_public_documents", "false");
            }
            setValue("privateDocs", val?.private_docs?.[0] ?? []);
            setValue("publicDocs", val?.public_docs?.[0] ?? []);
        }
    };
    console.log("imagePreview", imagePreview);
    console.log("logoPreview", logoPreview);
    console.log("coverPreview", coverPreview);

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
        if (projectFullData && projectFullData.params) {
            // console.log("Project full data ==>", projectFullData);
            setProjectValuesHandler(projectFullData.params);
            setEditMode(true);
        } else if (userFullData) {
            setValuesHandler(userFullData);
        }
    }, [userFullData, projectFullData]);

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

    useEffect(() => {
        dispatch(allHubHandlerRequest());
    }, [actor, dispatch]);

    useEffect(() => {
        if (actor) {
            (async () => {
                if (userCurrentRoleStatusActiveRole === "project") {
                    const result = await actor.get_my_project();
                    if (result) {
                        console.log("result", result);
                        setImageData(
                            result?.params?.user_data?.profile_picture?.[0] ?? null
                        );
                        setLogoData(result?.params?.project_logo?.[0] ?? []);
                        setCoverData(result?.params?.project_cover?.[0] ?? []);
                        setValue(
                            "type_of_profile",
                            result?.params?.user_data?.type_of_profile?.[0]
                                ? result?.params?.user_data?.type_of_profile?.[0]
                                : ""
                        );
                        setValue(
                            "preferred_icp_hub",
                            result?.params?.preferred_icp_hub?.[0]
                                ? result?.params?.preferred_icp_hub?.[0]
                                : ""
                        );
                    } else {
                        setImageData(null);
                        setLogoData(null);
                        setCoverData(null);
                        setValue("type_of_profile", "");
                        setValue("preferred_icp_hub", "");
                    }
                } else if (
                    userCurrentRoleStatusActiveRole === null ||
                    userCurrentRoleStatusActiveRole === "user" ||
                    userCurrentRoleStatusActiveRole === "mentor" ||
                    userCurrentRoleStatusActiveRole === "vc"
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

    const [index, setIndex] = useState(0);
    const handleNext = async () => {
        const isValid = await trigger(formFields[index]);
        if (isValid) {
            console.log("Current Form Data:", getValues(formFields[index]));
            setIndex((prevIndex) => prevIndex + 1);
        }
    };

    const handleBack = () => {
        if (index > 0) {
            setIndex((prevIndex) => prevIndex - 1);
        }
    };
    const renderComponent = () => {
        let component;
        switch (index) {
            case 0:
                component = <ProjectRegister1 modalOpen={modalOpen} />;
                break;
            case 1:
                component = <ProjectRegister2 />;
                break;
            case 2:
                component = <ProjectRegister3 />;
                break;
            case 3:
                component = <ProjectRegister4 />;
                break;
            case 4:
                component = <ProjectRegister5 />;
                break;
            default:
                component = <ProjectRegister1 />;
        }

        return component;
    };
    const formFields = {
        0: [
            "logo",
            "preferred_icp_hub",
            "project_name",
            "project_description",
            "project_elevator_pitch",
        ],
        1: [
            "cover",
            "project_website",
            "is_your_project_registered",
            "type_of_registration",
            "country_of_registration",
        ],
        2: [
            "supports_multichain",
            "multi_chain_names",
            "live_on_icp_mainnet",
            "dapp_link",
            "weekly_active_users",
            "revenue",
        ],
        3: [
            "money_raised_till_now",
            "icp_grants",
            "investors",
            "raised_from_other_ecosystem",
            "valuation",
            "target_amount",
        ],
        4: [
            "promotional_video",
            "project_discord",
            "project_linkedin",
            "github_link",
            "token_economics",
        ],
    };
    const [modalOpen, setModalOpen] = useState(true);

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${modalOpen ? 'block' : 'hidden'}`}>
            <div className="bg-white rounded-lg shadow-lg w-[500px] p-6 pt-4 overflow-y-auto">
                <div className="flex justify-end mr-4">
                    <button
                        className="text-2xl text-[#121926]"
                        onClick={() => setModalOpen(!modalOpen)}
                    >
                        &times;
                    </button>
                </div>
                <h2 className="text-xs text-[#364152] mb-3">Step {index + 1} of 5</h2>
                <FormProvider
                    {...{
                        ...{
                            register,
                            handleSubmit,
                            reset,
                            clearErrors,
                            setValue,
                            getValues,
                            setError,
                            watch,
                            control,
                            getAllIcpHubs,
                            logoCreationFunc,
                            clearLogoFunc,
                            trigger,
                            countries,
                            formState: { errors, isSubmitting },
                        },
                    }}
                >
                    <form onSubmit={handleSubmit(onSubmitHandler, onErrorHandler)}>
                        {renderComponent()}
                        <div
                            className={`flex mt-4 ${index === 0 ? "justify-end" : "justify-between"
                                }`}
                        >
                            {index > 0 && (
                                <button
                                    type="button"
                                    className="py-2 px-4 text-gray-600 rounded border border-[#CDD5DF] hover:text-black"
                                    onClick={handleBack}
                                    disabled={index === 0}
                                >
                                    <ArrowBackIcon fontSize="medium" />   Back
                                </button>
                            )}
                            {index === 4 ? (
                                <button
                                    type="submit"
                                    className="py-2 px-4 bg-[#D1E0FF] text-white rounded hover:bg-blue-600 border-2 border-[#B2CCFF]"
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
                                        />
                                    ) : (
                                        "Submit"
                                    )}
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    className="py-2 px-4 bg-[#D1E0FF] text-white rounded hover:bg-blue-600 border-2 border-[#B2CCFF] flex items-center"
                                    onClick={handleNext}
                                >
                                    Continue
                                    <ArrowForwardIcon fontSize="medium" className="ml-2" />
                                </button>
                            )}
                        </div>
                    </form>
                </FormProvider>
            </div>
        </div>
    );
};

export default ProjectRegisterMain;

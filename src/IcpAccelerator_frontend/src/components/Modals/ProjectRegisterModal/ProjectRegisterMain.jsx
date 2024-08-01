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

import { useForm, Controller, FormProvider } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
// import DetailHeroSection from "../Common/DetailHeroSection";
import { ThreeDots } from "react-loader-spinner";

import { Principal } from "@dfinity/principal";

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

const ProjectRegisterMain = () => {

    const navigate = useNavigate();
    const formFields = {
        0: ["image", "logo", "preferred_icp_hub", "project_name", "project_description", "project_elevator_pitch"],
        1: ["cover", "project_website", "is_your_project_registered", "type_of_registration", "country_of_registration"],
        2: ["multi_chain", "multi_chain_names", "live_on_icp_mainnet", "dapp_link", "weekly_active_users", "revenue",],
        3: ["money_raised_till_now", "icp_grants", "investors", "raised_from_other_ecosystem", "valuation", "target_amount", "project_discord"],
        4: ["promotional_video", "project_linkedin", "github_link", "token_economics", "white_paper"],
    };

    const methods = useForm({
        resolver: yupResolver(validationSchema),
        mode: "all",
    });
    const {
        handleSubmit,
        setValue,
        trigger,
        formState: { isSubmitting },
    } = methods;
    const [index, setIndex] = useState(0);
    const handleNext = async () => {
        const isValid = await trigger(formFields[index]);
        if (isValid) {
            setIndex((prevIndex) => prevIndex + 1);
        }
    };

    const handleBack = () => {
        if (index > 0) {
            setIndex((prevIndex) => prevIndex - 1);
        }
    };

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
    const onErrorHandler = (val) => {
        console.log("error", val);
        toast.error("Empty fields or invalid values, please recheck the form");
    };
    const renderComponent = () => {
        let component;
        switch (index) {
            case 0:
                component = <ProjectRegister1 />;
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
    }
    // const [modalOpen, setModalOpen] = useState(isOpen || true);
    // useEffect(() => {
    //     if (modalOpen) {
    //         document.body.style.overflow = 'hidden';
    //     } else {
    //         document.body.style.overflow = 'auto';
    //     }

    //     return () => {
    //         document.body.style.overflow = 'auto';
    //     };
    // }, [modalOpen]);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ">

            <div className="bg-white rounded-lg shadow-lg w-[500px] p-6 pt-4 overflow-y-auto">
                <div className="flex justify-end mr-4">
                    <button
                        className="text-2xl text-[#121926]"
                    // onClick={() => setModalOpen(false)}
                    >
                        &times;
                    </button>
                </div>
                <h2 className="text-xs text-[#364152] mb-3">Step {index + 1} of 5</h2>
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmitHandler, onErrorHandler)}>
                        {renderComponent()}
                        <div className={`flex mt-4 ${index === 0 ? "justify-end" : "justify-between"}`}>
                            {index > 0 && (
                                <button
                                    type="button"
                                    className="py-2 px-4 text-gray-600 rounded hover:text-black"
                                    onClick={handleBack}
                                    disabled={index === 0}
                                >

                                    Back
                                </button>
                            )}
                            {index === 5 ? (
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

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import DetailHeroSection from "../Common/DetailHeroSection";
import { ThreeDots } from "react-loader-spinner";
import { useCountries } from "react-countries";
import ReactSelect from "react-select";
import CompressedImage from "../ImageCompressed/CompressedImage";
import { allHubHandlerRequest } from "../StateManagement/Redux/Reducers/All_IcpHubReducer";
import { bufferToImageBlob } from "../Utils/formatter/bufferToImageBlob";

function ProjectRegForm() {
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
        .test("is-valid-telegram", "Invalid Telegram ID", (value) => {
          if (!value) return true;
          const hasValidChars = /^[a-zA-Z0-9_]{5,32}$/.test(value);
          return hasValidChars;
        }),
      twitter_url: yup
        .string()
        .nullable(true)
        .optional()
        .test("is-valid-twitter", "Invalid Twitter ID", (value) => {
          if (!value) return true;
          const hasValidChars =
            /^(https?:\/\/)?(www\.)?twitter\.com\/[a-zA-Z0-9_]{1,15}$/.test(
              value
            );
          return hasValidChars;
        }),
      openchat_user_name: yup
        .string()
        .nullable(true)
        .test(
          "is-valid-username",
          "Username must be between 6 and 20 characters and can only contain letters, numbers, and underscores",
          (value) => {
            if (!value) return true;
            const isValidLength = value.length >= 6 && value.length <= 20;
            const hasValidChars = /^(?=.*[A-Z0-9_])[a-zA-Z0-9_]+$/.test(value);
            return isValidLength && hasValidChars;
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
        .required("Project Description is required"),
      project_elevator_pitch: yup
        .string()
        .url("Invalid url")
        .required("Project Pitch deck is required"),
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
      weekly_active_users: yup
        .number()
        .when("live_on_icp_mainnet", (val, schema) =>
          val && val[0] === "true"
            ? schema
                .typeError("You must enter a number")
                .positive("Must be a positive number")
                .required("Weekly active users is required")
            : schema
        ),
      revenue: yup
        .number()
        .when("live_on_icp_mainnet", (val, schema) =>
          val && val[0] === "true"
            ? schema
                .typeError("You must enter a number")
                .positive("Must be a positive number")
                .required("Revenue is required")
            : schema
        ),
      money_raised_till_now: yup
        .string()
        .required("Required")
        .oneOf(["true", "false"], "Invalid value"),
      money_raising: yup
        .string()
        .required("Required")
        .oneOf(["true", "false"], "Invalid value"),
      icp_grants: yup
        .number()
        .when("money_raised_till_now", (val, schema) =>
          val && val[0] === "true"
            ? schema
                .typeError("You must enter a number")
                .positive("Must be a positive number")
                .required("Grants is required")
            : schema
        ),
      investors: yup
        .number()
        .when("money_raised_till_now", (val, schema) =>
          val && val[0] === "true"
            ? schema
                .typeError("You must enter a number")
                .positive("Must be a positive number")
                .required("Investors is required")
            : schema
        ),
      raised_from_other_ecosystem: yup
        .number()
        .when("money_raised_till_now", (val, schema) =>
          val && val[0] === "true"
            ? schema
                .typeError("You must enter a number")
                .positive("Must be a positive number")
                .required("Launchpad is required")
            : schema
        ),
      target_amount: yup
        .number()
        .when("money_raising", (val, schema) =>
          val && val[0] === "true"
            ? schema
                .typeError("You must enter a number")
                .positive("Must be a positive number")
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
        .test("is-valid-discord", "Invalid Discord URL", (value) => {
          if (!value) return true;
          const hasValidChars =
            /^(https?:\/\/)?(www\.)?(discord\.(gg|com)\/(invite\/)?[a-zA-Z0-9\-_]+|discordapp\.com\/invite\/[a-zA-Z0-9\-_]+)$/.test(
              value
            );
          return hasValidChars;
        }),
      project_linkedin: yup
        .string()
        .nullable(true)
        .optional()
        .test("is-valid-linkedin", "Invalid LinkedIn URL", (value) => {
          if (!value) return true;
          const hasValidChars =
            /^(https?:\/\/)?(www\.)?linkedin\.com\/(in\/[a-zA-Z0-9_-]+|company\/[a-zA-Z0-9_-]+|groups\/[a-zA-Z0-9_-]+)$/.test(
              value
            );
          return hasValidChars;
        }),
      github_link: yup
        .string()
        .nullable(true)
        .optional()
        .test("is-valid-github", "Invalid GitHub URL", (value) => {
          if (!value) return true;
          const hasValidChars =
            /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_\-]+(\/[a-zA-Z0-9_\-]+)?(\/)?$/.test(
              value
            );
          return hasValidChars;
        }),
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
          title: yup.string().required("Title is required"),
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
          title: yup.string().required("Title is required"),
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
  const clearCoverFunc = (values) => {
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
        project_cover: coverData ? coverData : [],
        project_logo: logoData ? logoData : [],
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
        handleProfilePicture(val?.user_data?.profile_picture?.[0]) ?? ""
      );
      setValue("type_of_profile", val?.user_data?.type_of_profile?.[0]);
      setValue(
        "reasons_to_join_platform",
        val?.user_data?.reason_to_join
          ? val?.user_data?.reason_to_join.join(", ")
          : ""
      );
      setReasonOfJoiningSelectedOptionsHandler(val?.user_data?.reason_to_join);
      //Project Data
      setLogoPreview(val?.project_logo ?? "");
      setCoverPreview(val?.project_cover ?? "");
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
      setValue("weekly_active_users", val?.weekly_active_users?.[0] ?? "");
      setValue("revenue", val?.revenue?.[0] ?? "");
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
      console.log("Project full data ==>", projectFullData);
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
        const result = await actor.get_user_information();
        if (result) {
          setImageData(result?.Ok?.profile_picture?.[0] ?? null);
        } else {
          setImageData(null);
        }
      })();
    }
  }, [actor]);
  return (
    <>
      <DetailHeroSection />
      <section className="w-full h-fit px-[6%] lg1:px-[4%] py-[6%] lg1:py-[4%] bg-gray-100">
        <div className="w-full h-full bg-gray-100 pt-8">
          <div className="bg-gradient-to-r from-purple-800 to-blue-500 text-transparent bg-clip-text text-[30px]  sm:text-[25px] md1:text-[30px] md2:text-[35px] font-black font-fontUse dxl:text-[40px] p-8">
            Project Information
          </div>
          <div className="text-sm font-medium text-center text-gray-200 ">
            {/* START OF USER REGISTRATION FORM */}
            <form
              onSubmit={handleSubmit(onSubmitHandler, onErrorHandler)}
              className="w-full px-4"
            >
              <div className="flex flex-col">
                <div className="flex-row w-full flex justify-start gap-4 items-center">
                  <div className="mb-3 ml-6 h-24 w-24 rounded-full border-2 border-gray-300 flex items-center justify-center overflow-hidden">
                    {imagePreview && !errors.image ? (
                      <img
                        src={imagePreview}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <svg
                        width="35"
                        height="37"
                        viewBox="0 0 35 37"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="bg-no-repeat"
                      >
                        <path
                          d="M8.53049 8.62583C8.5304 13.3783 12.3575 17.2449 17.0605 17.2438C21.7634 17.2428 25.5907 13.3744 25.5908 8.62196C25.5909 3.8695 21.7638 0.00287764 17.0608 0.00394405C12.3579 0.00501045 8.53058 3.87336 8.53049 8.62583ZM32.2249 36.3959L34.1204 36.3954L34.1205 34.4799C34.1206 27.0878 28.1667 21.0724 20.8516 21.0741L13.2692 21.0758C5.95224 21.0775 -3.41468e-05 27.0955 -0.000176714 34.4876L-0.000213659 36.4032L32.2249 36.3959Z"
                          fill="#BBBBBB"
                        />
                      </svg>
                    )}
                  </div>

                  <Controller
                    name="image"
                    control={control}
                    render={({ field }) => (
                      <>
                        <input
                          type="file"
                          className="hidden"
                          id="image"
                          name="image"
                          onChange={(e) => {
                            field.onChange(e.target.files[0]);
                            imageCreationFunc(e.target.files[0]);
                          }}
                          accept=".jpg, .jpeg, .png"
                        />
                        <label
                          htmlFor="image"
                          className="p-2 border-2 border-blue-800 items-center rounded-md text-md bg-transparent text-blue-800 cursor-pointer font-semibold"
                        >
                          {imagePreview && !errors.image
                            ? "Change profile picture"
                            : "Upload profile picture"}
                        </label>
                        {imagePreview || errors.image ? (
                          <button
                            className="p-2 border-2 border-red-500 items-center rounded-md text-md bg-transparent text-red-500 cursor-pointer font-semibold capitalize"
                            onClick={() => clearImageFunc("image")}
                          >
                            clear
                          </button>
                        ) : (
                          ""
                        )}
                      </>
                    )}
                  />
                </div>
                {errors.image && (
                  <span className="mt-1 text-sm text-red-500 font-bold text-start px-4">
                    {errors?.image?.message}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* User Details */}

                <div className="relative z-0 group mb-6">
                  <label
                    htmlFor="full_name"
                    className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                  >
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("full_name")}
                    className={`bg-gray-50 border-2 
                                              ${
                                                errors?.full_name
                                                  ? "border-red-500"
                                                  : "border-[#737373]"
                                              } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                    placeholder="Enter your full name"
                  />
                  {errors?.full_name && (
                    <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                      {errors?.full_name?.message}
                    </span>
                  )}
                </div>
                <div className="relative z-0 group mb-6">
                  <label
                    htmlFor="email"
                    className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    {...register("email")}
                    className={`bg-gray-50 border-2 
                                              ${
                                                errors?.email
                                                  ? "border-red-500"
                                                  : "border-[#737373]"
                                              } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                    placeholder="Enter your email"
                  />
                  {errors?.email && (
                    <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                      {errors?.email?.message}
                    </span>
                  )}
                </div>
                <div className="relative z-0 group mb-6">
                  <label
                    htmlFor="telegram_id"
                    className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                  >
                    Telegram ID
                  </label>
                  <input
                    type="text"
                    {...register("telegram_id")}
                    className={`bg-gray-50 border-2 
                                              ${
                                                errors?.telegram_id
                                                  ? "border-red-500 "
                                                  : "border-[#737373]"
                                              } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                    placeholder="Enter your telegram id"
                  />
                  {errors?.telegram_id && (
                    <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                      {errors?.telegram_id?.message}
                    </span>
                  )}
                </div>
                <div className="relative z-0 group mb-6">
                  <label
                    htmlFor="twitter_url"
                    className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                  >
                    Twitter URL
                  </label>
                  <input
                    type="text"
                    {...register("twitter_url")}
                    className={`bg-gray-50 border-2 
                                              ${
                                                errors?.twitter_url
                                                  ? "border-red-500 "
                                                  : "border-[#737373]"
                                              } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                    placeholder="Enter your twitter url"
                  />
                  {errors?.twitter_url && (
                    <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                      {errors?.twitter_url?.message}
                    </span>
                  )}
                </div>
                <div className="relative z-0 group mb-6">
                  <label
                    htmlFor="openchat_user_name"
                    className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                  >
                    OpenChat username
                  </label>
                  <input
                    type="text"
                    {...register("openchat_user_name")}
                    className={`bg-gray-50 border-2 
                                              ${
                                                errors?.openchat_user_name
                                                  ? "border-red-500 "
                                                  : "border-[#737373]"
                                              } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                    placeholder="Enter your openchat username"
                  />
                  {errors?.openchat_user_name && (
                    <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                      {errors?.openchat_user_name?.message}
                    </span>
                  )}
                </div>
                <div className="relative z-0 group mb-6">
                  <label
                    htmlFor="bio"
                    className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                  >
                    Bio (50 words)
                  </label>
                  <textarea
                    {...register("bio")}
                    className={`bg-gray-50 border-2 ${
                      errors?.bio ? "border-red-500 " : "border-[#737373]"
                    } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                    placeholder="Enter your bio"
                    rows={1}
                  ></textarea>
                  {errors?.bio && (
                    <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                      {errors?.bio?.message}
                    </span>
                  )}
                </div>
                <div className="relative z-0 group mb-6">
                  <label
                    htmlFor="country"
                    className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                  >
                    Country <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("country")}
                    className={`bg-gray-50 border-2 ${
                      errors.country ? "border-red-500 " : "border-[#737373]"
                    } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
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

                  {errors?.country && (
                    <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                      {errors?.country?.message}
                    </span>
                  )}
                </div>
                <div className="relative z-0 group mb-6">
                  <label
                    htmlFor="domains_interested_in"
                    className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                  >
                    Domains you are interested in{" "}
                    <span className="text-red-500">*</span>
                  </label>
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
                      }),
                    }}
                    value={interestedDomainsSelectedOptions}
                    options={interestedDomainsOptions}
                    classNamePrefix="select"
                    className="basic-multi-select w-full text-start"
                    placeholder="Select domains you are interested in"
                    name="domains_interested_in"
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
                        setValue("domains_interested_in", "", {
                          shouldValidate: true,
                        });
                        setError("domains_interested_in", {
                          type: "required",
                          message: "Selecting an interest is required",
                        });
                      }
                    }}
                  />
                  {errors.domains_interested_in && (
                    <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                      {errors.domains_interested_in.message}
                    </span>
                  )}
                </div>
                <div className="relative z-0 group mb-6">
                  <label
                    htmlFor="type_of_profile"
                    className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                  >
                    Type of profile <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("type_of_profile")}
                    className={`bg-gray-50 border-2 ${
                      errors.type_of_profile
                        ? "border-red-500 "
                        : "border-[#737373]"
                    } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                  >
                    <option className="text-lg font-bold" value="">
                      Select profile type
                    </option>
                    {typeOfProfileOptions &&
                      typeOfProfileOptions.map((val, index) => {
                        return (
                          <option
                            className="text-lg font-bold"
                            key={index}
                            value={val?.value}
                          >
                            {val?.label}
                          </option>
                        );
                      })}
                  </select>
                  {errors.type_of_profile && (
                    <p className="mt-1 text-sm text-red-500 font-bold text-left">
                      {errors.type_of_profile.message}
                    </p>
                  )}
                </div>
                <div className="relative z-0 group mb-6">
                  <label
                    htmlFor="reasons_to_join_platform"
                    className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                  >
                    Why do you want to join this platform ?{" "}
                    <span className="text-red-500">*</span>
                  </label>
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
                        border: errors.reasons_to_join_platform
                          ? "2px solid #ef4444"
                          : "2px solid #737373",
                        backgroundColor: "rgb(249 250 251)",
                        "&::placeholder": {
                          color: errors.reasons_to_join_platform
                            ? "#ef4444"
                            : "currentColor",
                        },
                      }),
                    }}
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
                          selectedOptions
                            .map((option) => option.value)
                            .join(", "),
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
                  {errors.reasons_to_join_platform && (
                    <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                      {errors.reasons_to_join_platform.message}
                    </span>
                  )}
                </div>

                {/* END OF USER REGISTRATION FORM */}

                {/* START OF PROJECT REGISTRATION FORM */}
                <div className="flex flex-col">
                  <div className="flex-row w-full flex justify-start gap-4 items-center">
                    <div className="mb-3 ml-6 h-24 w-24 rounded-full border-2 border-gray-300 flex items-center justify-center overflow-hidden">
                      {logoPreview && !errors.logo ? (
                        <img
                          src={logoPreview}
                          alt="Logo"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <svg
                          width="35"
                          height="37"
                          viewBox="0 0 35 37"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="bg-no-repeat"
                        >
                          <path
                            d="M8.53049 8.62583C8.5304 13.3783 12.3575 17.2449 17.0605 17.2438C21.7634 17.2428 25.5907 13.3744 25.5908 8.62196C25.5909 3.8695 21.7638 0.00287764 17.0608 0.00394405C12.3579 0.00501045 8.53058 3.87336 8.53049 8.62583ZM32.2249 36.3959L34.1204 36.3954L34.1205 34.4799C34.1206 27.0878 28.1667 21.0724 20.8516 21.0741L13.2692 21.0758C5.95224 21.0775 -3.41468e-05 27.0955 -0.000176714 34.4876L-0.000213659 36.4032L32.2249 36.3959Z"
                            fill="#BBBBBB"
                          />
                        </svg>
                      )}
                    </div>

                    <Controller
                      name="logo"
                      control={control}
                      render={({ field }) => (
                        <>
                          <input
                            type="file"
                            className="hidden"
                            id="logo"
                            name="logo"
                            onChange={(e) => {
                              field.onChange(e.target.files[0]);
                              logoCreationFunc(e.target.files[0]);
                            }}
                            accept=".jpg, .jpeg, .png"
                          />
                          <label
                            htmlFor="logo"
                            className="p-2 border-2 border-blue-800 items-center rounded-md text-md bg-transparent text-blue-800 cursor-pointer font-semibold"
                          >
                            {logoPreview && !errors.logo
                              ? "Change logo"
                              : "Upload logo"}
                          </label>
                          {logoPreview || errors.logo ? (
                            <button
                              className="p-2 border-2 border-red-500 items-center rounded-md text-md bg-transparent text-red-500 cursor-pointer font-semibold capitalize"
                              onClick={() => clearLogoFunc("logo")}
                            >
                              clear
                            </button>
                          ) : (
                            ""
                          )}
                        </>
                      )}
                    />
                  </div>
                  {errors.logo && (
                    <span className="mt-1 text-sm text-red-500 font-bold text-start px-4">
                      {errors?.logo?.message}
                    </span>
                  )}
                </div>
                <div className="flex flex-col">
                  <div className="flex-row w-full flex justify-start gap-4 items-center">
                    <div className="mb-3 ml-6 h-24 w-24 rounded-full border-2 border-gray-300 flex items-center justify-center overflow-hidden">
                      {coverPreview && !errors.cover ? (
                        <img
                          src={coverPreview}
                          alt="cover"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <svg
                          width="35"
                          height="37"
                          viewBox="0 0 35 37"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="bg-no-repeat"
                        >
                          <path
                            d="M8.53049 8.62583C8.5304 13.3783 12.3575 17.2449 17.0605 17.2438C21.7634 17.2428 25.5907 13.3744 25.5908 8.62196C25.5909 3.8695 21.7638 0.00287764 17.0608 0.00394405C12.3579 0.00501045 8.53058 3.87336 8.53049 8.62583ZM32.2249 36.3959L34.1204 36.3954L34.1205 34.4799C34.1206 27.0878 28.1667 21.0724 20.8516 21.0741L13.2692 21.0758C5.95224 21.0775 -3.41468e-05 27.0955 -0.000176714 34.4876L-0.000213659 36.4032L32.2249 36.3959Z"
                            fill="#BBBBBB"
                          />
                        </svg>
                      )}
                    </div>

                    <Controller
                      name="cover"
                      control={control}
                      render={({ field }) => (
                        <>
                          <input
                            type="file"
                            className="hidden"
                            id="cover"
                            name="cover"
                            onChange={(e) => {
                              field.onChange(e.target.files[0]);
                              coverCreationFunc(e.target.files[0]);
                            }}
                            accept=".jpg, .jpeg, .png"
                          />
                          <label
                            htmlFor="cover"
                            className="p-2 border-2 border-blue-800 items-center rounded-md text-md bg-transparent text-blue-800 cursor-pointer font-semibold"
                          >
                            {coverPreview && !errors.cover
                              ? "Change cover picture"
                              : "Upload cover picture"}
                          </label>
                          {coverPreview || errors.cover ? (
                            <button
                              className="p-2 border-2 border-red-500 items-center rounded-md text-md bg-transparent text-red-500 cursor-pointer font-semibold capitalize"
                              onClick={() => clearCoverFunc("cover")}
                            >
                              clear
                            </button>
                          ) : (
                            ""
                          )}
                        </>
                      )}
                    />
                  </div>
                  {errors.cover && (
                    <span className="mt-1 text-sm text-red-500 font-bold text-start px-4">
                      {errors?.cover?.message}
                    </span>
                  )}
                </div>

                <div className="relative z-0 group mb-6">
                  <label
                    htmlFor="preferred_icp_hub"
                    className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                  >
                    Preferred ICP Hub you would like to be associated with{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("preferred_icp_hub")}
                    defaultValue={getValues("preferred_icp_hub")}
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
                  {errors.preferred_icp_hub && (
                    <p className="mt-1 text-sm text-red-500 font-bold text-left">
                      {errors.preferred_icp_hub.message}
                    </p>
                  )}
                </div>
                <div className="relative z-0 group mb-6">
                  <label
                    htmlFor="project_name"
                    className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                  >
                    Project Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("project_name")}
                    className={`bg-gray-50 border-2 
                                             ${
                                               errors?.project_name
                                                 ? "border-red-500 "
                                                 : "border-[#737373]"
                                             } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                    placeholder="Enter your Project name"
                  />
                  {errors?.project_name && (
                    <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                      {errors?.project_name?.message}
                    </span>
                  )}
                </div>
                <div className="relative z-0 group mb-6">
                  <label
                    htmlFor="project_description"
                    className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                  >
                    Project Description (50 words){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("project_description")}
                    className={`bg-gray-50 border-2 
                                             ${
                                               errors?.project_description
                                                 ? "border-red-500 "
                                                 : "border-[#737373]"
                                             } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                    placeholder="Max 50 words"
                  />
                  {errors?.project_description && (
                    <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                      {errors?.project_description?.message}
                    </span>
                  )}
                </div>
                <div className="relative z-0 group mb-6">
                  <label
                    htmlFor="project_elevator_pitch"
                    className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                  >
                    Project pitch deck <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("project_elevator_pitch")}
                    className={`bg-gray-50 border-2 
                                             ${
                                               errors?.project_elevator_pitch
                                                 ? "border-red-500 "
                                                 : "border-[#737373]"
                                             } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                    placeholder="https://"
                  />
                  {errors?.project_elevator_pitch && (
                    <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                      {errors?.project_elevator_pitch?.message}
                    </span>
                  )}
                </div>
                <div className="relative z-0 group mb-6">
                  <label
                    htmlFor="project_website"
                    className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                  >
                    Project Website
                  </label>
                  <input
                    type="text"
                    {...register("project_website")}
                    className={`bg-gray-50 border-2 
                                             ${
                                               errors?.project_website
                                                 ? "border-red-500 "
                                                 : "border-[#737373]"
                                             } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                    placeholder="https://"
                  />
                  {errors?.project_website && (
                    <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                      {errors?.project_website?.message}
                    </span>
                  )}
                </div>
                {/* Is your project registered  */}
                <div className="relative z-0 group mb-6">
                  <label
                    htmlFor="is_your_project_registered"
                    className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                  >
                    Is your project registered{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("is_your_project_registered")}
                    className={`bg-gray-50 border-2 ${
                      errors.is_your_project_registered
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
                  {errors.is_your_project_registered && (
                    <p className="mt-1 text-sm text-red-500 font-bold text-left">
                      {errors.is_your_project_registered.message}
                    </p>
                  )}
                </div>
                {watch("is_your_project_registered") === "true" ? (
                  <>
                    <div className="relative z-0 group mb-6">
                      <label
                        htmlFor="type_of_registration"
                        className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                      >
                        Type of registration{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <select
                        {...register("type_of_registration")}
                        className={`bg-gray-50 border-2 ${
                          errors.type_of_registration
                            ? "border-red-500"
                            : "border-[#737373]"
                        } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                      >
                        <option className="text-lg font-bold" value="">
                          Select registration type
                        </option>
                        <option className="text-lg font-bold" value="Comapany">
                          Comapany
                        </option>
                        <option className="text-lg font-bold" value="DAO">
                          DAO
                        </option>
                      </select>
                      {errors.type_of_registration && (
                        <p className="mt-1 text-sm text-red-500 font-bold text-left">
                          {errors.type_of_registration.message}
                        </p>
                      )}
                    </div>
                    <div className="relative z-0 group mb-6">
                      <label
                        htmlFor="country_of_registration"
                        className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                      >
                        Country of registration
                        <span className="text-red-500">*</span>
                      </label>
                      <select
                        {...register("country_of_registration")}
                        className={`bg-gray-50 border-2 ${
                          errors.country_of_registration
                            ? "border-red-500 "
                            : "border-[#737373]"
                        } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
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
                  </>
                ) : (
                  <></>
                )}

                {/* Are you also multi-chain */}
                <div className="relative z-0 group mb-6">
                  <label
                    htmlFor="multi_chain"
                    className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                  >
                    Are you also multi-chain{" "}
                    <span className="text-red-500">*</span>
                  </label>
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
                  {errors.multi_chain && (
                    <p className="mt-1 text-sm text-red-500 font-bold text-left">
                      {errors.multi_chain.message}
                    </p>
                  )}
                </div>
                {watch("multi_chain") === "true" ? (
                  <div className="relative z-0 group mb-6">
                    <label
                      htmlFor="multi_chain_names"
                      className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                    >
                      Please select the chains{" "}
                      <span className="text-red-500">*</span>
                    </label>
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
                          border: errors.multi_chain_names
                            ? "2px solid #ef4444"
                            : "2px solid #737373",
                          backgroundColor: "rgb(249 250 251)",
                          "&::placeholder": {
                            color: errors.multi_chain_names
                              ? "#ef4444"
                              : "currentColor",
                          },
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
                            message: "Atleast one chain name required",
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
                  <></>
                )}

                {/* Live on ICP */}
                <div className="relative z-0 group mb-6">
                  <label
                    htmlFor="live_on_icp_mainnet"
                    className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                  >
                    Live on ICP <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("live_on_icp_mainnet")}
                    className={`bg-gray-50 border-2 ${
                      errors.live_on_icp_mainnet
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
                  {errors.live_on_icp_mainnet && (
                    <p className="mt-1 text-sm text-red-500 font-bold text-left">
                      {errors.live_on_icp_mainnet.message}
                    </p>
                  )}
                </div>
                {watch("live_on_icp_mainnet") === "true" ? (
                  <>
                    <div className="relative z-0 group mb-6">
                      <label
                        htmlFor="dapp_link"
                        className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                      >
                        dApp Link <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        {...register("dapp_link")}
                        className={`bg-gray-50 border-2 
                                             ${
                                               errors?.dapp_link
                                                 ? "border-red-500 "
                                                 : "border-[#737373]"
                                             } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                        placeholder="Enter your dApp Link"
                      />
                      {errors?.dapp_link && (
                        <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                          {errors?.dapp_link?.message}
                        </span>
                      )}
                    </div>
                    <div className="relative z-0 group mb-6">
                      <label
                        htmlFor="weekly_active_users"
                        className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                      >
                        Weekly active users{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        {...register("weekly_active_users")}
                        className={`bg-gray-50 border-2 
                                             ${
                                               errors?.weekly_active_users
                                                 ? "border-red-500 "
                                                 : "border-[#737373]"
                                             } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                        placeholder="Enter Weekly active users"
                        onWheel={(e) => e.target.blur()}
                        min={0}
                      />
                      {errors?.weekly_active_users && (
                        <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                          {errors?.weekly_active_users?.message}
                        </span>
                      )}
                    </div>
                    <div className="relative z-0 group mb-6">
                      <label
                        htmlFor="revenue"
                        className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                      >
                        Revenue (in Million USD){" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        {...register("revenue")}
                        className={`bg-gray-50 border-2 
                                             ${
                                               errors?.revenue
                                                 ? "border-red-500 "
                                                 : "border-[#737373]"
                                             } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                        placeholder="Enter Revenue"
                        onWheel={(e) => e.target.blur()}
                        min={0}
                      />
                      {errors?.revenue && (
                        <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                          {errors?.revenue?.message}
                        </span>
                      )}
                    </div>
                  </>
                ) : (
                  <></>
                )}

                {/* Have you raised any funds in past */}
                <div className="relative z-0 group mb-6">
                  <label
                    htmlFor="money_raised_till_now"
                    className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                  >
                    Have you raised any funds in past{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("money_raised_till_now")}
                    className={`bg-gray-50 border-2 ${
                      errors.money_raised_till_now
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
                  {errors.money_raised_till_now && (
                    <p className="mt-1 text-sm text-red-500 font-bold text-left">
                      {errors.money_raised_till_now.message}
                    </p>
                  )}
                </div>
                {watch("money_raised_till_now") === "true" ? (
                  <>
                    <div className="relative z-0 group mb-6">
                      <label
                        htmlFor="icp_grants"
                        className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                      >
                        Grants <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        {...register("icp_grants")}
                        className={`bg-gray-50 border-2 
                                             ${
                                               errors?.icp_grants
                                                 ? "border-red-500 "
                                                 : "border-[#737373]"
                                             } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                        placeholder="Enter your Grants"
                        onWheel={(e) => e.target.blur()}
                        min={0}
                      />
                      {errors?.icp_grants && (
                        <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                          {errors?.icp_grants?.message}
                        </span>
                      )}
                    </div>
                    <div className="relative z-0 group mb-6">
                      <label
                        htmlFor="investors"
                        className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                      >
                        Investors <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        {...register("investors")}
                        className={`bg-gray-50 border-2 
                                             ${
                                               errors?.investors
                                                 ? "border-red-500 "
                                                 : "border-[#737373]"
                                             } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                        placeholder="Enter Investors"
                        onWheel={(e) => e.target.blur()}
                        min={0}
                      />
                      {errors?.investors && (
                        <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                          {errors?.investors?.message}
                        </span>
                      )}
                    </div>
                    <div className="relative z-0 group mb-6">
                      <label
                        htmlFor="raised_from_other_ecosystem"
                        className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                      >
                        Launchpad <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        {...register("raised_from_other_ecosystem")}
                        className={`bg-gray-50 border-2 
                                             ${
                                               errors?.raised_from_other_ecosystem
                                                 ? "border-red-500 "
                                                 : "border-[#737373]"
                                             } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                        placeholder="Enter Launchpad"
                        onWheel={(e) => e.target.blur()}
                        min={0}
                      />
                      {errors?.raised_from_other_ecosystem && (
                        <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                          {errors?.raised_from_other_ecosystem?.message}
                        </span>
                      )}
                    </div>
                  </>
                ) : (
                  <></>
                )}

                {/* Are you currently raising money  */}
                <div className="relative z-0 group mb-6">
                  <label
                    htmlFor="money_raising"
                    className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                  >
                    Are you currently raising money{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("money_raising")}
                    className={`bg-gray-50 border-2 ${
                      errors.money_raising
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
                  {errors.money_raising && (
                    <p className="mt-1 text-sm text-red-500 font-bold text-left">
                      {errors.money_raising.message}
                    </p>
                  )}
                </div>
                {watch("money_raising") === "true" ? (
                  <>
                    <div className="relative z-0 group mb-6">
                      <label
                        htmlFor="target_amount"
                        className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                      >
                        Target Amount (USD){" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        {...register("target_amount")}
                        className={`bg-gray-50 border-2 
                                             ${
                                               errors?.target_amount
                                                 ? "border-red-500 "
                                                 : "border-[#737373]"
                                             } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                        placeholder="Enter your Target Amount"
                        onWheel={(e) => e.target.blur()}
                        min={0}
                      />
                      {errors?.target_amount && (
                        <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                          {errors?.target_amount?.message}
                        </span>
                      )}
                    </div>
                    <div className="relative z-0 group mb-6">
                      <label
                        htmlFor="valuation"
                        className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                      >
                        Valuation (USD)
                      </label>
                      <input
                        type="number"
                        {...register("valuation")}
                        className={`bg-gray-50 border-2 
                                             ${
                                               errors?.valuation
                                                 ? "border-red-500 "
                                                 : "border-[#737373]"
                                             } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                        placeholder="Enter valuation (In million)"
                        onWheel={(e) => e.target.blur()}
                        min={0}
                      />
                      {errors?.valuation && (
                        <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                          {errors?.valuation?.message}
                        </span>
                      )}
                    </div>
                  </>
                ) : (
                  <></>
                )}

                <div className="relative z-0 group mb-6">
                  <label
                    htmlFor="promotional_video"
                    className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                  >
                    Promotion video link
                  </label>
                  <input
                    type="text"
                    {...register("promotional_video")}
                    className={`bg-gray-50 border-2 
                                             ${
                                               errors?.promotional_video
                                                 ? "border-red-500 "
                                                 : "border-[#737373]"
                                             } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                    placeholder="https://"
                  />
                  {errors?.promotional_video && (
                    <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                      {errors?.promotional_video?.message}
                    </span>
                  )}
                </div>
                <div className="relative z-0 group mb-6">
                  <label
                    htmlFor="project_discord"
                    className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                  >
                    Project Discord
                  </label>
                  <input
                    type="text"
                    {...register("project_discord")}
                    className={`bg-gray-50 border-2 
                                             ${
                                               errors?.project_discord
                                                 ? "border-red-500 "
                                                 : "border-[#737373]"
                                             } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                    placeholder="https://"
                  />
                  {errors?.project_discord && (
                    <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                      {errors?.project_discord?.message}
                    </span>
                  )}
                </div>
                <div className="relative z-0 group mb-6">
                  <label
                    htmlFor="project_linkedin"
                    className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                  >
                    Project LinkedIn
                  </label>
                  <input
                    type="text"
                    {...register("project_linkedin")}
                    className={`bg-gray-50 border-2 
                                             ${
                                               errors?.project_linkedin
                                                 ? "border-red-500 "
                                                 : "border-[#737373]"
                                             } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                    placeholder="https://"
                  />
                  {errors?.project_linkedin && (
                    <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                      {errors?.project_linkedin?.message}
                    </span>
                  )}
                </div>
                <div className="relative z-0 group mb-6">
                  <label
                    htmlFor="github_link"
                    className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                  >
                    Project GitHub
                  </label>
                  <input
                    type="text"
                    {...register("github_link")}
                    className={`bg-gray-50 border-2 
                                             ${
                                               errors?.github_link
                                                 ? "border-red-500 "
                                                 : "border-[#737373]"
                                             } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                    placeholder="https://"
                  />
                  {errors?.github_link && (
                    <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                      {errors?.github_link?.message}
                    </span>
                  )}
                </div>
                <div className="relative z-0 group mb-6">
                  <label
                    htmlFor="token_economics"
                    className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                  >
                    Tokenomics
                  </label>
                  <input
                    type="text"
                    {...register("token_economics")}
                    className={`bg-gray-50 border-2 
                                             ${
                                               errors?.token_economics
                                                 ? "border-red-500 "
                                                 : "border-[#737373]"
                                             } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                    placeholder="https://"
                  />
                  {errors?.token_economics && (
                    <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                      {errors?.token_economics?.message}
                    </span>
                  )}
                </div>
                <div className="relative z-0 group mb-6">
                  <label
                    htmlFor="white_paper"
                    className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                  >
                    Whitepaper
                  </label>
                  <input
                    type="text"
                    {...register("white_paper")}
                    className={`bg-gray-50 border-2 
                                             ${
                                               errors?.white_paper
                                                 ? "border-red-500 "
                                                 : "border-[#737373]"
                                             } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                    placeholder="https://"
                  />
                  {errors?.white_paper && (
                    <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                      {errors?.white_paper?.message}
                    </span>
                  )}
                </div>

                {/* Uploading Private Document */}
                <div className="relative z-0 group mb-6">
                  <label
                    htmlFor="upload_private_documents"
                    className="block mb-2 text-lg font-medium text-gray-500 hover:text-black text-start"
                  >
                    Upload due diligence documents{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("upload_private_documents")}
                    className="bg-gray-50 border-2 border-[#737373] text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  >
                    <option className="text-lg font-bold" value="false">
                      No
                    </option>
                    <option className="text-lg font-bold" value="true">
                      Yes
                    </option>
                  </select>
                  {errors.upload_private_documents && (
                    <p className="mt-1 text-sm text-red-500 font-bold text-left">
                      {errors.upload_private_documents.message}
                    </p>
                  )}
                </div>
                <div className="relative z-0 group mb-6">
                  {uploadPrivateDocuments === "true" &&
                    fieldsPrivate.map((field, index) => (
                      <React.Fragment key={field.id}>
                        <div className="flex flex-row mt-2 items-center">
                          <div className="w-full">
                            <label className="block mb-2 text-lg font-medium text-gray-500 text-start">
                              Title {index + 1}
                            </label>
                            <input
                              {...register(`privateDocs.${index}.title`)}
                              className="bg-gray-50 border-2 border-black rounded-lg block w-full p-2.5 text-black"
                              type="text"
                            />
                            {errors.privateDocs?.[index]?.title && (
                              <p className="mt-1 text-sm text-red-500 font-bold text-left">
                                {errors.privateDocs[index].title.message}
                              </p>
                            )}
                          </div>
                          <div className="w-full ml-2">
                            <label className="block mb-2 text-lg font-medium text-gray-500 text-start">
                              Link {index + 1}
                            </label>
                            <input
                              {...register(`privateDocs.${index}.link`)}
                              className="bg-gray-50 border-2 border-black rounded-lg block w-full p-2.5 text-black"
                              type="text"
                            />
                            {errors.privateDocs?.[index]?.link && (
                              <p className="mt-1 text-sm text-red-500 font-bold text-left">
                                {errors.privateDocs[index].link.message}
                              </p>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleremovePrivate(index)}
                            className="self-end bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-3 ml-2"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 384 512"
                              fill="white"
                              className="w-5 h-5"
                            >
                              <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                            </svg>
                          </button>
                        </div>
                      </React.Fragment>
                    ))}

                  {uploadPrivateDocuments === "true" && (
                    <div className="flex justify-end items-center">
                      <button
                        type="button"
                        onClick={() => appendPrivate({ title: "", link: "" })}
                        className="text-white bg-blue-800 rounded-md px-5 py-2 mt-4"
                      >
                        Add Private Docs
                      </button>
                    </div>
                  )}
                </div>
                {/* Uploading Public Document */}
                <div className="relative z-0 mb-6">
                  <label
                    htmlFor="upload_public_documents"
                    className="block mb-2 text-lg font-medium text-gray-500 text-start"
                  >
                    Upload Public documents{" "}
                    <span className="text-red-600">*</span>
                  </label>
                  <select
                    {...register("upload_public_documents")}
                    className="bg-gray-50  border-2 border-[#737373] text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                  >
                    <option className="text-lg font-bold" value="false">
                      No
                    </option>
                    <option className="text-lg font-bold" value="true">
                      Yes
                    </option>
                  </select>
                  {errors.upload_public_documents && (
                    <p className="mt-1 text-sm text-red-600 font-medium">
                      {errors.upload_public_documents.message}
                    </p>
                  )}
                </div>
                <div className="relative z-0 group mb-6">
                  {uploadPublicDocuments === "true" &&
                    fields.map((field, index) => (
                      <div
                        className="flex flex-row gap-4 mt-4 items-center"
                        key={field.id}
                      >
                        <div className="flex-1">
                          <label className="block mb-2 text-lg font-medium text-gray-700 text-start">
                            Title {index + 1}
                          </label>
                          <input
                            {...register(`publicDocs.${index}.title`)}
                            className="bg-gray-50 border-2 border-[#737373] rounded-lg block w-full p-3 text-black"
                            type="text"
                          />
                          {errors.publicDocs?.[index]?.title && (
                            <p className="mt-1 text-sm text-red-600 font-medium">
                              {errors.publicDocs[index].title.message}
                            </p>
                          )}
                        </div>
                        <div className="flex-1">
                          <label className="block mb-2 text-lg font-medium text-gray-700 text-start">
                            Link {index + 1}
                          </label>
                          <input
                            {...register(`publicDocs.${index}.link`)}
                            className="bg-gray-50 border-2 border-[#737373] rounded-lg block w-full p-3 text-black"
                            type="text"
                          />
                          {errors.publicDocs?.[index]?.link && (
                            <p className="mt-1 text-sm text-red-600 font-medium">
                              {errors.publicDocs[index].link.message}
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removePublic(index)}
                          className="self-end bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-3 ml-2"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 384 512"
                            fill="white"
                            className="w-5 h-5"
                          >
                            <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  {uploadPublicDocuments === "true" && (
                    <div className="flex justify-end items-center mt-4">
                      <button
                        type="button"
                        onClick={() => append({ title: "", link: "" })}
                        className="bg-blue-800 hover:bg-blue-900 text-white rounded-lg px-5 py-3"
                      >
                        Add Public Docs
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end mt-4">
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
                  ) : editMode ? (
                    "Update"
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            </form>

            {/* END OF MENTOR REGISTRATION FORM */}
          </div>
        </div>
      </section>
      <Toaster />
    </>
  );
}

export default ProjectRegForm;

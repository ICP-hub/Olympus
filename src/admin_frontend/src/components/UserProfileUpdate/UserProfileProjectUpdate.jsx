import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  numberToDate,
  uint8ArrayToBase64,
} from "../Utils/AdminData/saga_function/blobImageToUrl";
import { projectApprovedRequest } from "../AdminStateManagement/Redux/Reducers/projectApproved";
import { projectDeclinedRequest } from "../AdminStateManagement/Redux/Reducers/projectDeclined";
import { Principal } from "@dfinity/principal";
import { ThreeDots } from "react-loader-spinner";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ReactSelect from "react-select";
import CompressedImage from "../../../../IcpAccelerator_frontend/src/components/ImageCompressed/CompressedImage";
import { noDataPresentSvg, place } from "../Utils/AdminData/SvgData";
import pdfSvg from "../../../assets/image/pdfimage.png";
import openchat_username from "../../../assets/image/spinner.png";
import { useCountries } from "react-countries";
import toast, { Toaster } from "react-hot-toast";
import { blobToArrayBuffer } from "../../../../IcpAccelerator_frontend/src/components/Utils/formatter/blobToArrayBuffer";

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
      .test("is-non-empty", "Country is required", (value) => /\S/.test(value))
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
      .test("fileType", "Only jpeg, jpg & png file format allowed", (value) => {
        return (
          !value ||
          (value &&
            ["image/jpeg", "image/jpg", "image/png"].includes(value.type))
        );
      }),
    logo: yup
      .mixed()
      .nullable(true)
      .test("fileSize", "File size max 10MB allowed", (value) => {
        return !value || (value && value.size <= 10 * 1024 * 1024); // 10 MB limit
      })
      .test("fileType", "Only jpeg, jpg & png file format allowed", (value) => {
        return (
          !value ||
          (value &&
            ["image/jpeg", "image/jpg", "image/png"].includes(value.type))
        );
      }),
    cover: yup
      .mixed()
      .nullable(true)
      .test("fileSize", "File size max 10MB allowed", (value) => {
        return !value || (value && value.size <= 10 * 1024 * 1024); // 10 MB limit
      })
      .test("fileType", "Only jpeg, jpg & png file format allowed", (value) => {
        return (
          !value ||
          (value &&
            ["image/jpeg", "image/jpg", "image/png"].includes(value.type))
        );
      }),
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
    project_website: yup.string().nullable(true).optional().url("Invalid url"),
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
      // .matches(
      //   /^(https?:\/\/)?(www\.)?(discord\.(gg|com)\/(invite\/)?[a-zA-Z0-9\-_]+|discordapp\.com\/invite\/[a-zA-Z0-9\-_]+)$/,
      //   "Invalid Discord URL"
      // ),
      .url("Invalid url"),
    project_linkedin: yup
      .string()
      .nullable(true)
      .optional()
      // .matches(
      //   /^(https?:\/\/)?(www\.)?linkedin\.com\/(in\/[a-zA-Z0-9_-]+|company\/[a-zA-Z0-9_-]+|groups\/[a-zA-Z0-9_-]+)$/,
      //   "Invalid LinkedIn URL"
      // ),
      .url("Invalid url"),
    github_link: yup
      .string()
      .nullable(true)
      .optional()
      // .matches(
      //   /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_\-]+(\/[a-zA-Z0-9_\-]+)?(\/)?$/,
      //   "Invalid GitHub URL"
      // ),
      .url("Invalid url"),
    token_economics: yup.string().nullable(true).optional().url("Invalid url"),
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

const UserProfileProjectUpdate = () => {
  const { countries } = useCountries();

  const actor = useSelector((currState) => currState.actors.actor);
  const areaOfExpertise = useSelector(
    (currState) => currState.expertise.expertise
  );
  const typeOfProfile = useSelector(
    (currState) => currState.profileTypes.profiles
  );
  const multiChainNames = useSelector((currState) => currState.chains.chains);

  const [orignalData, setOrignalData] = useState(null);
  const [updatedData, setUpdatedData] = useState(null);
  const [percent, setPercent] = useState(0);
  const [current, setCurrent] = useState("user");
  const [isAccepting, setIsAccepting] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);
  const [userData, setUserData] = useState([]);
  const [showOriginalBioAndDescription, setshowOriginalBioAndDescription] =
    useState(true);
  const [showOriginalBio, setshowOriginalBio] = useState(true);
  const [showOriginalDescription, setshowOriginalDescription] = useState(true);
  const [showOriginalLogoAndCover, setshowOriginalLogoAndCover] =
    useState(true);
  const [showOriginalProfile, setShowOriginalProfile] = useState(true);
  const [showOriginalLogo, setshowOriginalLogo] = useState(true);
  const [showOriginalCover, setshowOriginalCover] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoData, setLogoData] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [coverData, setCoverData] = useState(null);
  const getAllIcpHubs = useSelector((currState) => currState.hubs.allHubs);
  const [interestedDomainsOptions, setInterestedDomainsOptions] = useState([]);
  const [typeOfProfileOptions, setTypeOfProfileOptions] = useState([]);
  const [
    interestedDomainsSelectedOptions,
    setInterestedDomainsSelectedOptions,
  ] = useState([]);
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
  const [multiChainOptions, setMultiChainOptions] = useState([]);
  const [multiChainSelectedOptions, setMultiChainSelectedOptions] = useState(
    []
  );
  const [projectId, setProjectId] = useState("");
  const handleToggleChange = () => {
    setshowOriginalLogoAndCover(!showOriginalLogoAndCover);
  };

  const handleToggleChangeDescription = () => {
    setshowOriginalBioAndDescription(!showOriginalBioAndDescription);
  };

  function convertBlobToArray(val) {
    fetch(val)
      .then((response) => {
        if (response.ok) return response.blob();
        throw new Error("Network response was not ok.");
      })
      .then((blob) => {
        blobToArrayBuffer(blob)
          .then((arrayBuffer) => {
            console.log(arrayBuffer);
          })
          .catch((error) => {
            console.error("Error converting blob to ArrayBuffer:", error);
          });
      })
      .catch((error) => {
        console.error("Error fetching the Blob:", error);
      });
  }
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const ProjectId =location.state
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
  const {
    fields: fieldsPrivate,
    append: appendPrivate,
    remove: removePrivate,
  } = useFieldArray({
    control,
    name: "privateDocs",
  });

  const uploadPrivateDocuments = watch("upload_private_documents");
  // console.log('uploadPrivateDocuments',uploadPrivateDocuments)
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
    if (uploadPublicDocuments === "true" && fields && fields.length === 0) {
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

  const imageCreationFunc = async (file) => {
    const result = await trigger("image");
    if (result) {
      try {
        const compressedFile = await CompressedImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
          setImageData(reader.result);
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

  const logoCreationFunc = async (file) => {
    const result = await trigger("logo");
    if (result) {
      try {
        const compressedFile = await CompressedImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setLogoPreview(reader.result);
          setLogoData(reader.result);
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

  const coverCreationFunc = async (file) => {
    const result = await trigger("cover");
    if (result) {
      try {
        const compressedFile = await CompressedImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setCoverPreview(reader.result);
          setCoverData(reader.result);
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
        console.log("byteArray", byteArray);
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

  const clearImageFunc = (val) => {
    let field_id = val;
    setValue(field_id, null);
    clearErrors(field_id);
    setImageData(null);
    setImagePreview(null);
  };

  const clearLogoFunc = (value) => {
    let fields_id = value;
    setValue(fields_id, null);
    clearErrors(fields_id);
    setLogoData(null);
    setLogoPreview(null);
  };

  const clearCoverFunc = (val) => {
    let field_ids = val;
    setValue(field_ids, null);
    clearErrors(field_ids);
    setCoverData(null);
    setCoverPreview(null);
  };

  useEffect(() => {
    const fetchProjectData = async () => {
    const covertedPrincipal = await Principal.fromText(ProjectId);
      try {
        // const data = await actor.project_update_awaiting_approval();
         const data = await actor.get_project_info_using_principal(covertedPrincipal);
        console.log("Received data from actor:", data);
        if (
          data &&
          data.length > 0
          //  &&
          // data[0].length > 1 &&
          // data[0][1].original_info
        ) {
          const originalInfo = data[0]?.params
          const updatedInfo = data[0]?.params

          console.log("data:", data);
          console.log("Original Info:", originalInfo);
          console.log("updated Info:", updatedInfo);

          setOrignalData({
            projectId: data[0][0],
            projectName: originalInfo?.project_name ?? "No Name",
            projectLogo:
              originalInfo?.project_logo &&
              originalInfo?.project_logo.length > 0
                ? uint8ArrayToBase64(originalInfo.project_logo[0])
                : null,
            projectCover:
              originalInfo?.project_cover &&
              originalInfo?.project_cover.length > 0
                ? uint8ArrayToBase64(originalInfo.project_cover[0])
                : null,
            projectDescription:
              originalInfo?.project_description?.[0] ?? "No Description",
            projectWebsite: originalInfo?.project_website?.[0],
            projectDiscord: originalInfo?.project_discord?.[0],
            projectLinkedin: originalInfo?.project_linkedin?.[0],
            userTwitter: originalInfo?.user_data.twitter_id?.[0],
            dappLink: originalInfo?.dapp_link?.[0],
            privateDocs: originalInfo?.private_docs?.[0] ?? [],
            publicDocs: originalInfo?.public_docs?.[0] ?? [],
            countryOfRegistration: originalInfo?.country_of_registration?.[0],
            promotionalVideo: originalInfo?.promotional_video?.[0],
            tokenEconomics: originalInfo?.token_economics?.[0],
            projectTeams: originalInfo?.project_team?.[0],
            technicalDocs: originalInfo?.technical_docs?.[0] ?? [],
            projectElevatorPitch: originalInfo?.project_elevator_pitch?.[0],
            longTermGoals: originalInfo?.long_term_goals?.[0],
            revenue: originalInfo?.revenue?.[0],
            weeklyActiveUsers: originalInfo?.weekly_active_users?.[0],
            icpGrants: originalInfo?.money_raised?.[0]?.icp_grants?.[0],
            investors: originalInfo?.money_raised?.[0]?.investors?.[0],
            raisedFromOtherEcosystem:
              originalInfo?.money_raised?.[0]?.raised_from_other_ecosystem?.[0],
            snsGrants: originalInfo?.money_raised?.[0]?.sns?.[0],
            targetAmount: originalInfo.money_raised?.[0]?.target_amount?.[0],
            moneyRaisedTillNow: originalInfo?.money_raised_till_now?.[0],
            preferredIcpHub: originalInfo?.preferred_icp_hub?.[0],
            supportsMultichain: originalInfo?.supports_multichain?.[0],
            typeOfRegistration: originalInfo?.type_of_registration?.[0],
            uploadPrivateDocuments: originalInfo?.upload_private_documents?.[0],
            uploadPublicDocuments:
              originalInfo?.public_docs?.[0] &&
              originalInfo?.public_docs?.[0].length > 0
                ? true
                : false,
            projectAreaOfFocus: originalInfo?.project_area_of_focus,
            mentorsAssigned: originalInfo?.mentors_assigned[0],
            vcsAssigned: originalInfo?.vc_assigned[0],
            targetMarket: originalInfo?.target_market[0],
            githubLink: originalInfo?.github_link[0],
            reasonToJoinIncubator: originalInfo?.reason_to_join_incubator,
            reasonToJoin: originalInfo?.user_data.reason_to_join[0],
            liveOnIcpMainnet: originalInfo?.live_on_icp_mainnet?.[0],
            areaOfInterest: originalInfo?.user_data?.area_of_interest,
            userCountry: originalInfo?.user_data?.country,
            userFullName: originalInfo?.user_data?.full_name,
            isYourProjectRegistered:
              originalInfo?.is_your_project_registered[0],
            userEmail: originalInfo?.user_data?.email,
            userProfilePicture:
              originalInfo?.user_data.profile_picture &&
              originalInfo?.user_data.profile_picture[0].length > 0
                ? uint8ArrayToBase64(originalInfo.user_data.profile_picture[0])
                : null,
            openchatUsername: originalInfo?.user_data.openchat_username?.[0],
            userTelegram: originalInfo?.user_data.telegram_id?.[0],
            userBio: originalInfo?.user_data.bio?.[0],
            userProfileType: originalInfo?.user_data.type_of_profile?.[0],
          });

          setUpdatedData({
            projectId: data[0][0],
            projectName: updatedInfo?.project_name ?? "No Name",
            projectLogo:
              updatedInfo?.project_logo && updatedInfo?.project_logo.length > 0
                ? uint8ArrayToBase64(updatedInfo.project_logo[0])
                : null,
            projectCover:
              updatedInfo?.project_cover && updatedInfo?.project_cover.length > 0
                ? uint8ArrayToBase64(updatedInfo.project_cover[0])
                : null,
            projectDescription:
              updatedInfo?.project_description?.[0] ?? "No Description",
            projectWebsite: updatedInfo?.project_website?.[0],
            projectDiscord: updatedInfo?.project_discord?.[0],
            projectLinkedin: updatedInfo?.project_linkedin?.[0],
            userTwitter: originalInfo?.user_data.twitter_id?.[0],
            dappLink: updatedInfo?.dapp_link?.[0],
            privateDocs: updatedInfo?.private_docs?.[0] ?? [],
            publicDocs: updatedInfo?.public_docs?.[0] ?? [],
            countryOfRegistration: updatedInfo?.country_of_registration?.[0],
            promotionalVideo: updatedInfo?.promotional_video?.[0],
            tokenEconomics: updatedInfo?.token_economics?.[0],
            projectTeams: updatedInfo?.project_team?.[0],
            technicalDocs: updatedInfo?.technical_docs?.[0] ?? [],
            githubLink: updatedInfo?.github_link?.[0] ?? [],
            projectElevatorPitch: updatedInfo?.project_elevator_pitch?.[0],
            longTermGoals: updatedInfo?.long_term_goals?.[0],
            revenue: updatedInfo?.revenue?.[0],
            weeklyActiveUsers: updatedInfo?.weekly_active_users?.[0],
            icpGrants: updatedInfo?.money_raised?.[0]?.icp_grants?.[0],
            investors: updatedInfo?.money_raised?.[0]?.investors?.[0],
            raisedFromOtherEcosystem:
              updatedInfo?.money_raised?.[0]?.raised_from_other_ecosystem?.[0],
            snsGrants: updatedInfo?.money_raised?.[0]?.sns?.[0],
            targetAmount: updatedInfo.money_raised?.[0]?.target_amount?.[0],
            moneyRaisedTillNow: updatedInfo?.money_raised_till_now?.[0],
            preferredIcpHub: updatedInfo?.preferred_icp_hub?.[0],
            supportsMultichain: updatedInfo?.supports_multichain?.[0],
            typeOfRegistration: updatedInfo?.type_of_registration?.[0],
            isYourProjectRegistered:
              updatedInfo?.is_your_project_registered?.[0],
            uploadPrivateDocuments: updatedInfo?.upload_private_documents?.[0],
            uploadPublicDocuments:
              updatedInfo?.public_docs?.[0] &&
              updatedInfo?.public_docs?.[0].length > 0
                ? true
                : false,
            projectAreaOfFocus: updatedInfo?.project_area_of_focus,
            mentorsAssigned: updatedInfo?.mentors_assigned[0],
            vcsAssigned: updatedInfo?.vc_assigned[0],
            targetMarket: updatedInfo?.target_market[0],
            reasonToJoinIncubator: updatedInfo?.reason_to_join_incubator,
            reasonToJoin: updatedInfo?.user_data.reason_to_join[0],
            liveOnIcpMainnet: updatedInfo?.live_on_icp_mainnet?.[0],
            areaOfInterest: updatedInfo?.user_data?.area_of_interest,
            userCountry: updatedInfo?.user_data?.country,
            userFullName: updatedInfo?.user_data?.full_name,
            userEmail: updatedInfo?.user_data?.email,
            userProfilePicture:
              updatedInfo?.user_data.profile_picture &&
              updatedInfo?.user_data.profile_picture[0].length > 0
                ? uint8ArrayToBase64(updatedInfo.user_data.profile_picture[0])
                : null,
            openchatUsername: updatedInfo?.user_data.openchat_username?.[0],
            userTelegram: updatedInfo?.user_data.telegram_id?.[0],
            userBio: updatedInfo?.user_data.bio?.[0],
            userProfileType: updatedInfo?.user_data.type_of_profile?.[0],
          });
        } else {
          console.error("Unexpected data structure:", data);
          setOrignalData({});
          setUpdatedData({});
        }
      } catch (error) {
        console.error("Error fetching project data:", error);
      }
    };

    fetchProjectData();
  }, [actor]);

  useEffect(() => {
    if (updatedData) {
      // console.log("Project full data ==>", updatedData);
      setProjectValuesHandler(updatedData);
    } else {
      setProjectValuesHandler("");
    }
  }, [updatedData]);

  const setProjectValuesHandler = (val) => {
    console.log("setval", val);
    if (val) {
      setProjectId(val?.projectId ?? "");
      setValue("full_name", val?.userFullName ?? "");
      setValue("email", val?.userEmail[0] ?? "");
      setValue("telegram_id", val?.userTelegram ?? "");
      setValue("twitter_url", val?.userTwitter ?? "");
      setValue("openchat_user_name", val?.openchatUsername ?? "");
      setValue("bio", val?.userBio ?? "");
      setValue("country", val?.userCountry ?? "");
      setValue("domains_interested_in", val?.areaOfInterest ?? "");
      setInterestedDomainsSelectedOptionsHandler(val?.areaOfInterest ?? null);
      setImagePreview(val?.userProfilePicture ?? "");
      setImageData(
        val?.userProfilePicture
          ? convertBlobToArray(val?.userProfilePicture)
          : null
      );
      setValue("type_of_profile", val?.userProfileType);
      setValue(
        "reasons_to_join_platform",
        val?.reasonToJoin ? val?.reasonToJoin.join(", ") : ""
      );
      setReasonOfJoiningSelectedOptionsHandler(val?.reasonToJoin);
      setLogoPreview(val?.projectLogo ?? "");
      setLogoData(
        val?.projectLogo ? convertBlobToArray(val?.projectLogo) : null
      );
      setCoverPreview(val?.projectCover ?? "");
      setCoverData(
        val?.projectCover ? convertBlobToArray(val?.projectCover) : null
      );
      setValue("preferred_icp_hub", val?.preferredIcpHub);
      setValue("project_name", val?.projectName ?? "");
      setValue("project_description", val?.projectDescription ?? "");
      setValue("project_elevator_pitch", val?.projectElevatorPitch ?? "");
      setValue("project_website", val?.projectWebsite ?? "");
      setValue(
        "is_your_project_registered",
        val?.isYourProjectRegistered ?? ""
      );
      if (val?.isYourProjectRegistered === true) {
        setValue("is_your_project_registered", "true");
      } else {
        setValue("is_your_project_registered", "false");
      }
      setValue("type_of_registration", val?.typeOfRegistration ? val?.typeOfRegistration : "");
      setValue("country_of_registration", val?.countryOfRegistration ?? "");
      setValue("live_on_icp_mainnet", val?.liveOnIcpMainnet ?? "");
      if (val?.liveOnIcpMainnet === true) {
        setValue("live_on_icp_mainnet", "true");
      } else {
        setValue("live_on_icp_mainnet", "false");
      }
      setValue("dapp_link", val?.dappLink ?? "");
      setValue("weekly_active_users", val?.weeklyActiveUsers ?? "");
      setValue("revenue", val?.revenue ?? "");
      if (val?.supportsMultichain) {
        setValue("multi_chain", "true");
      } else {
        setValue("multi_chain", "false");
      }
      setValue(
        "multi_chain_names",
        val?.supportsMultichain ? val?.supportsMultichain : ""
      );
      setMultiChainSelectedOptionsHandler(val?.supportsMultichain ?? null);
      if (val?.moneyRaisedTillNow === true) {
        setValue("money_raised_till_now", "true");
      } else {
        setValue("money_raised_till_now", "false");
      }
      if (val?.targetAmount && val?.snsGrants) {
        setValue("money_raising", "true");
      } else {
        setValue("money_raising", "false");
      }
      setValue("icp_grants", val?.icpGrants ?? 0);
      setValue("investors", val?.investors ?? 0);
      setValue(
        "raised_from_other_ecosystem",
        val?.raisedFromOtherEcosystem ?? 0
      );
      setValue("valuation", val?.snsGrants ?? "");
      setValue("target_amount", val?.targetAmount ?? 0);
      setValue("promotional_video", val?.promotionalVideo ?? "");
      setValue("project_discord", val?.projectDiscord ?? "");
      setValue("project_linkedin", val?.projectLinkedin ?? "");
      setValue("github_link", val?.githubLink ?? "No Available");
      setValue("token_economics", val?.tokenEconomics ?? "");
      setValue("white_paper", val?.longTermGoals ?? "");
      setValue("upload_private_documents", val?.uploadPrivateDocuments ?? "");
      if (val?.uploadPrivateDocuments === true) {
        setValue("upload_private_documents", "true");
      } else {
        setValue("upload_private_documents", "false");
      }
      setValue("upload_public_documents", val?.uploadPublicDocuments ?? "");
      if (val?.uploadPublicDocuments === true) {
        setValue("upload_public_documents", "true");
      } else {
        setValue("upload_public_documents", "false");
      }
      setValue("privateDocs", val?.privateDocs ?? []);
      setValue("publicDocs", val?.publicDocs ?? []);
    }
  };

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
      val && val.length > 0
        ? val.map((reason) => ({ value: reason, label: reason }))
        : []
    );
  };

  const setMultiChainSelectedOptionsHandler = (val) => {
    setMultiChainSelectedOptions(
      val
        ? val?.split(", ").map((chain) => ({ value: chain, label: chain }))
        : []
    );
  };

  // useEffect(() => {
  //   const requestedRole = Allrole?.role?.find(
  //     (role) => role.status === "requested"
  //   );
  //   if (requestedRole) {
  //     setCurrent(requestedRole.name.toLowerCase());
  //   } else {
  //     setCurrent("user");
  //   }
  // }, [Allrole.role]);

  const declineUserRoleHandler = async (
    principal,
    boolean,
    state,
    category
  ) => {
    setIsDeclining(true);
    try {
      const covertedPrincipal = await Principal.fromText(principal);
      switch (category) {
        case "project":
          if (state === "Pending") {
            await actor.decline_project_creation_request(covertedPrincipal);
            await dispatch(projectDeclinedRequest());
          }
          break;
        default:
          console.warn("Unhandled category:", category);
      }
    } catch (error) {
      console.error("Error processing request:", error);
    } finally {
      setIsDeclining(false);
      window.location.reload();
    }
  };

  const allowUserRoleHandler = async (principal, boolean, state, category) => {
    setIsAccepting(true);
    try {
      const covertedPrincipal = await Principal.fromText(principal);
      switch (category) {
        case "project":
          if (state === "Pending") {
            await actor.approve_project_creation_request(covertedPrincipal);
            await dispatch(projectApprovedRequest());
          }
          break;
        default:
          console.warn("Unhandled category:", category);
      }
    } catch (error) {
      console.error("Error processing request:", error);
    } finally {
      setIsAccepting(false);
      window.location.reload();
    }
  };

  const handleSwitchEditMode = () => {
    setEditMode(true);
    setShowOriginalProfile(false);
    setshowOriginalLogo(false);
    setshowOriginalCover(false);
    setshowOriginalDescription(false);
    setshowOriginalBio(false);
  };
  // const getButtonClass = (status) => {
  //   switch (status) {
  //     case "active":
  //       return "bg-[#A7943A]";
  //     case "requested":
  //       return "bg-[#e55711]";
  //     case "approved":
  //       return "bg-[#0071FF]";
  //     default:
  //       return "bg-[#FF3A41]";
  //   }
  // };

  // function constructMessage(role) {
  //   let baseMessage = `This User's ${
  //     role.name.charAt(0).toUpperCase() + role.name.slice(1)
  //   } Profile `;

  //   if (
  //     role.status === "active" &&
  //     role.approved_on &&
  //     role.approved_on.length > 0
  //   ) {
  //     baseMessage += `was approved on ${numberToDate(role.approved_on[0])}`;
  //   } else if (
  //     role.status === "approved" &&
  //     role.approved_on &&
  //     role.approved_on.length > 0
  //   ) {
  //     baseMessage += `was approved on ${numberToDate(role.approved_on[0])}`;
  //   } else if (
  //     role.status === "requested" &&
  //     role.requested_on &&
  //     role.requested_on.length > 0
  //   ) {
  //     baseMessage += `request was made on ${numberToDate(
  //       role.requested_on[0]
  //     )}`;
  //   } else if (
  //     role.status === "rejected" &&
  //     role.rejected_on &&
  //     role.rejected_on.length > 0
  //   ) {
  //     baseMessage += `was rejected on ${numberToDate(role.rejected_on[0])}`;
  //   } else {
  //     baseMessage += `is currently in the '${role.status}' status without a specific date.`;
  //   }

  //   return baseMessage;
  // }

  const date = numberToDate(orignalData?.creation_date);

  const weeklyUsers = Number(orignalData?.weeklyActiveUsers);
  const revenueNum = Number(orignalData?.revenue);
  const icpGrants = Number(orignalData?.icpGrants);
  const investorInvest = Number(orignalData?.investors);
  const otherEcosystem = Number(orignalData?.raisedFromOtherEcosystem);
  const snsGrants = Number(orignalData?.snsGrants);
  const targetAmount = orignalData?.targetAmount
    ? Number(orignalData?.targetAmount)
    : 0;
  const updateddate = numberToDate(updatedData?.creation_date);

  const updatedweeklyUsers = Number(updatedData?.weeklyActiveUsers);
  const updatedRevenueNum = Number(updatedData?.revenue);
  const updatedIcpGrants = Number(updatedData?.icpGrants);
  const updatedInvestorInvest = Number(updatedData?.investors);
  const updatedOtherEcosystem = Number(updatedData?.raisedFromOtherEcosystem);
  const updatedSnsGrants = Number(updatedData?.snsGrants);
  const updatedTargetAmount = updatedData?.targetAmount
    ? Number(updatedData?.targetAmount)
    : 0;

  if (!orignalData) {
    return <div>Loading...</div>;
  }

  // form submit handler func
  const onSubmitHandler = async (data) => {
    console.log("update data", data);
    console.log("coverData", coverData);
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
          type_of_profile: [data?.type_of_profile ?? ""],
          reason_to_join: [
            data?.reasons_to_join_platform
              .split(",")
              .map((val) => val.trim()) ?? [""],
          ],
          profile_picture: imageData ? [imageData] : [],
        },
        // project data
        project_cover: coverData ? [coverData] : [],
        project_logo: logoData ? [logoData] : [],
        preferred_icp_hub: [data?.preferred_icp_hub ?? ""],
        project_name: data?.project_name ?? "",
        project_description: [data?.project_description ?? ""],
        project_elevator_pitch: [data?.project_elevator_pitch ?? ""],
        project_website: [data?.project_website ?? ""],
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
        promotional_video: [data?.promotional_video ?? ""],
        project_discord: [data?.project_discord ?? ""],
        project_linkedin: [data?.project_linkedin ?? ""],
        github_link: [data?.github_link ?? ""],
        token_economics: [data?.token_economics ?? ""],
        long_term_goals: [data?.white_paper ?? ""],
        private_docs:
          data?.upload_private_documents === "true" ? [data?.privateDocs] : [],
        public_docs:
          data?.upload_public_documents === "true" ? [data?.publicDocs] : [],
        upload_private_documents: [
          data?.upload_private_documents === "true" ? true : false,
        ],
        // Extra field at Project
        project_area_of_focus: data?.domains_interested_in ?? "",
        reason_to_join_incubator: data?.reasons_to_join_platform ?? [""],
        vc_assigned: [],
        mentors_assigned: [],
        project_team: [],
        project_twitter: [""],
        target_market: [""],
        technical_docs: [""],
        self_rating_of_project: 0,
      };
      try {
        console.log("projectData", projectData);
        // console.log('imagedata ==>>> 1261',imageData)

        let id = projectId;
        console.log("data 1277 ====>>>", data);
        await actor.update_project(id, projectData).then((result) => {
          console.log("result in project to check update call==>", result);
          if (result && result.includes("approval request is sent")) {
            toast.success("Approval request is sent");
            window.location.href = "/";
          } else {
            toast.error(result);
          }
        });
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

  return (
    <>
      <form onSubmit={handleSubmit(onSubmitHandler, onErrorHandler)}>
        <div className="w-full px-[4%] py-[4%]">
          <div className="flex sm:flex-row justify-between  mb-4 sxxs:flex-col">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-black to-gray-800 text-transparent bg-clip-text">
              Project Profile
            </h1>
            <div className="flex text-white text-sm flex-row font-semibold h-auto items-center bg-customBlue rounded-lg p-3 justify-around">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className="size-4"
                fill="currentColor"
                onClick={handleSwitchEditMode}
              >
                <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z" />
              </svg>
            </div>
          </div>
          <div className="w-full flex gap-4  md:flex-row flex-col mt-4">
            <div className=" bg-[#D2D5F2]  shadow-md shadow-gray-400 p-6 rounded-lg md:w-1/4 w-full">
              <div className="div">
                {showOriginalProfile ? (
                  <div className="justify-center flex items-center">
                    <div
                      className="size-fit  rounded-full bg-no-repeat bg-center bg-cover relative p-1 bg-blend-overlay border-2 border-gray-300"
                      style={{
                        backgroundImage: `url(${orignalData?.userProfilePicture}), linear-gradient(168deg, rgba(255, 255, 255, 0.25) -0.86%, rgba(255, 255, 255, 0) 103.57%)`,
                        backdropFilter: "blur(20px)",
                      }}
                    >
                      <img
                        className="object-cover size-44 max-h-44 rounded-full"
                        src={orignalData?.userProfilePicture}
                        alt=""
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    {editMode ? (
                      <div className="flex flex-col">
                        <div className="flex-col w-full flex justify-start gap-4 items-center">
                          <div className=" size-28 rounded-full border-2 border-gray-300 flex items-center justify-center overflow-hidden">
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
                                <div className="flex">
                                  {console.log(
                                    "imagePreview 1373 ===>>>>s",
                                    imagePreview
                                  )}
                                  {imagePreview && !errors.image ? (
                                    <label
                                      htmlFor="image"
                                      className="p-2 border-2 border-blue-800 items-center rounded-md text-xs bg-transparent text-blue-800 cursor-pointer font-semibold flex"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 448 512"
                                        className="size-4"
                                        fill="currentColor"
                                        style={{ transform: "rotate(135deg)" }}
                                      >
                                        <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
                                      </svg>
                                      <span className="ml-2">
                                        Change profile picture
                                      </span>
                                    </label>
                                  ) : (
                                    <label
                                      htmlFor="image"
                                      className="p-2 border-2 border-blue-800 items-center rounded-md text-xs bg-transparent text-blue-800 cursor-pointer font-semibold flex"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 512 512"
                                        className="size-4"
                                        fill="currentColor"
                                      >
                                        <path d="M288 109.3V352c0 17.7-14.3 32-32 32s-32-14.3-32-32V109.3l-73.4 73.4c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l128-128c12.5-12.5 32.8-12.5 45.3 0l128 128c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L288 109.3zM64 352H192c0 35.3 28.7 64 64 64s64-28.7 64-64H448c35.3 0 64 28.7 64 64v32c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V416c0-35.3 28.7-64 64-64zM432 456a24 24 0 1 0 0-48 24 24 0 1 0 0 48z" />
                                      </svg>
                                      <span className="ml-2">
                                        Upload profile picture
                                      </span>
                                    </label>
                                  )}
                                  {imagePreview || errors.image ? (
                                    <button
                                      className=" ml-2 p-2 border-2 border-red-500 items-center rounded-md text-xs bg-transparent text-red-500 cursor-pointer font-semibold capitalize"
                                      onClick={() => clearImageFunc("image")}
                                    >
                                      clear
                                    </button>
                                  ) : (
                                    ""
                                  )}
                                </div>
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
                    ) : (
                      <div className="justify-center flex items-center">
                        <div
                          className="size-fit  rounded-full bg-no-repeat bg-center bg-cover relative p-1 bg-blend-overlay border-2 border-gray-300"
                          style={{
                            backgroundImage: `url(${updatedData?.userProfilePicture}), linear-gradient(168deg, rgba(255, 255, 255, 0.25) -0.86%, rgba(255, 255, 255, 0) 103.57%)`,
                            backdropFilter: "blur(20px)",
                          }}
                        >
                          <img
                            className="object-cover size-44 max-h-44 rounded-full"
                            src={updatedData?.userProfilePicture}
                            alt=""
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <div className="flex justify-center p-2 gap-2">
                  <span
                    className="w-2 h-2 bg-red-700 rounded-full"
                    onClick={() => setShowOriginalProfile(true)}
                  ></span>
                  <span
                    className="w-2 h-2 bg-green-700 rounded-full"
                    onClick={() => setShowOriginalProfile(false)}
                  ></span>
                </div>
              </div>
              <div className="flex flex-col ml-4 w-auto justify-start md:mb-0 mb-6">
                <div className="flex flex-col mb-2">
                  <div className="flex space-x-2 items-center flex-row">
                    <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                    <h1 className="md:text-3xl text-xl md:font-extrabold font-bold  bg-black text-transparent bg-clip-text">
                      {orignalData?.userFullName}
                    </h1>
                  </div>
                  <div className="flex space-x-2 items-center flex-row mt-1">
                    <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                    {editMode ? (
                      <div className="flex flex-col mb-3">
                        <input
                          type="text"
                          {...register("full_name")}
                          className={`bg-gray-50 border-2 
                                              ${
                                                errors?.full_name
                                                  ? "border-red-500"
                                                  : "border-[#737373]"
                                              } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1`}
                          placeholder="Enter your full name"
                        />
                        {errors?.full_name && (
                          <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                            {errors?.full_name?.message}
                          </span>
                        )}
                      </div>
                    ) : (
                      <h1 className="md:text-3xl text-xl md:font-extrabold font-bold  bg-black text-transparent bg-clip-text">
                        {updatedData?.userFullName}
                      </h1>
                    )}
                  </div>
                </div>
                <div className="text-gray-500 md:text-md text-sm font-normal flex mb-2">
                  <div className="flex flex-col mb-2">
                    <div className="flex space-x-2 items-center flex-row">
                      <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        className="size-4 "
                        fill="currentColor"
                      >
                        <path d="M256 64C150 64 64 150 64 256s86 192 192 192c17.7 0 32 14.3 32 32s-14.3 32-32 32C114.6 512 0 397.4 0 256S114.6 0 256 0S512 114.6 512 256v32c0 53-43 96-96 96c-29.3 0-55.6-13.2-73.2-33.9C320 371.1 289.5 384 256 384c-70.7 0-128-57.3-128-128s57.3-128 128-128c27.9 0 53.7 8.9 74.7 24.1c5.7-5 13.1-8.1 21.3-8.1c17.7 0 32 14.3 32 32v80 32c0 17.7 14.3 32 32 32s32-14.3 32-32V256c0-106-86-192-192-192zm64 192a64 64 0 1 0 -128 0 64 64 0 1 0 128 0z" />
                      </svg>
                      <span className="ml-2 truncate">
                        {orignalData?.userEmail}
                      </span>
                    </div>
                    <div className="flex space-x-2 items-center flex-row mt-1">
                      <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                      {editMode ? (
                        <div className="flex flex-col mt-1">
                          <input
                            type="email"
                            {...register("email")}
                            className={`bg-gray-50 border-2 
                                              ${
                                                errors?.email
                                                  ? "border-red-500"
                                                  : "border-[#737373]"
                                              } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1`}
                            placeholder="Enter your email"
                          />
                          {errors?.email && (
                            <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                              {errors?.email?.message}
                            </span>
                          )}
                        </div>
                      ) : (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512"
                            className="size-4 "
                            fill="currentColor"
                          >
                            <path d="M256 64C150 64 64 150 64 256s86 192 192 192c17.7 0 32 14.3 32 32s-14.3 32-32 32C114.6 512 0 397.4 0 256S114.6 0 256 0S512 114.6 512 256v32c0 53-43 96-96 96c-29.3 0-55.6-13.2-73.2-33.9C320 371.1 289.5 384 256 384c-70.7 0-128-57.3-128-128s57.3-128 128-128c27.9 0 53.7 8.9 74.7 24.1c5.7-5 13.1-8.1 21.3-8.1c17.7 0 32 14.3 32 32v80 32c0 17.7 14.3 32 32 32s32-14.3 32-32V256c0-106-86-192-192-192zm64 192a64 64 0 1 0 -128 0 64 64 0 1 0 128 0z" />
                          </svg>
                          <span className="ml-2 truncate">
                            {updatedData?.userEmail}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-start text-sm">
                  <div className="flex flex-col mb-2">
                    <div className="flex flex-row  text-gray-600 space-x-2 items-center">
                      <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                      {place}
                      <div className="underline ">
                        {orignalData?.userCountry}
                      </div>
                    </div>
                    <div className="flex space-x-2 items-center flex-row text-gray-600">
                      <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                      {editMode ? (
                        <div className="flex flex-col mt-1">
                          <select
                            {...register("country")}
                            className={`bg-gray-50 border-2 ${
                              errors.country
                                ? "border-red-500 "
                                : "border-[#737373]"
                            } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1`}
                          >
                            <option className="text-sm font-bold" value="">
                              Select your country
                            </option>
                            {countries?.map((expert) => (
                              <option
                                key={expert.name}
                                value={expert.name}
                                className="text-sm font-bold "
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
                      ) : (
                        <>
                          {place}
                          <div className="underline ">
                            {updatedData?.userCountry}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  {/* <div className="flex flex-col mb-2">
                <div className="flex flex-row  text-gray-600 space-x-2 items-center">
                  <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                    className="size-4"
                    fill="currentColor"
                  >
                    <path d="M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H64C28.7 64 0 92.7 0 128v16 48V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V192 144 128c0-35.3-28.7-64-64-64H344V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H152V24zM48 192H400V448c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192z" />
                  </svg>
                  <div className="ml-2">{date}</div>
                </div>
                <div className="flex space-x-2 items-center flex-row text-gray-600 mt-1">
                  <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                  {editMode ? (
                    <>
                      <select
                        {...register("country")}
                        className={`bg-gray-50 border-2 ${
                          errors.country
                            ? "border-red-500 "
                            : "border-[#737373]"
                        } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1`}
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
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512"
                        className="size-4"
                        fill="currentColor"
                      >
                        <path d="M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H64C28.7 64 0 92.7 0 128v16 48V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V192 144 128c0-35.3-28.7-64-64-64H344V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H152V24zM48 192H400V448c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192z" />
                      </svg>
                      <div className="ml-2">{updateddate}</div>
                    </>
                  )}
                </div>
              </div> */}
                  <div className="flex flex-col mb-2">
                    <div className="flex flex-row  text-gray-600 space-x-2 items-center">
                      <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                      <img
                        src={openchat_username}
                        alt="openchat_username"
                        className="size-5"
                      />
                      <div className="ml-2">
                        {orignalData?.openchatUsername}
                      </div>
                    </div>
                    <div className="flex space-x-2 items-center flex-row text-gray-600 mt-1">
                      <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                      {editMode ? (
                        <div className="flex flex-col mt-1">
                          <input
                            type="text"
                            {...register("openchat_user_name")}
                            className={`bg-gray-50 border-2 
                                              ${
                                                errors?.openchat_user_name
                                                  ? "border-red-500 "
                                                  : "border-[#737373]"
                                              } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1`}
                            placeholder="Enter openchat username"
                          />
                          {errors?.openchat_user_name && (
                            <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                              {errors?.openchat_user_name?.message}
                            </span>
                          )}
                        </div>
                      ) : (
                        <>
                          <img
                            src={openchat_username}
                            alt="openchat_username"
                            className="size-5"
                          />
                          <div className="ml-2">
                            {updatedData?.openchatUsername}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col mb-2">
                    <div className="flex flex-col  text-gray-600 space-x-2">
                      <div className="flex flex-row  text-gray-600 space-x-2 items-center">
                        <span className="w-2 h-2 bg-red-700 rounded-full"></span>

                        <div className="text-black font-semibold">Skill :</div>
                      </div>
                      <div className="flex gap-2 text-xs items-center flex-wrap">
                        {orignalData?.areaOfInterest &&
                          orignalData?.areaOfInterest
                            .split(",")
                            .slice(0, 3)
                            .map((tag, index) => (
                              <div
                                key={index}
                                className="text-xs border-2 rounded-2xl px-2 py-1 font-bold bg-[#c9c5c5]"
                              >
                                {tag.trim()}
                              </div>
                            ))}
                      </div>
                    </div>
                    <div className="flex space-x-2 items-center flex-row text-gray-600 mt-1">
                      <div className="flex flex-row  text-gray-600 space-x-2 items-center">
                        {editMode ? (
                          <div className="flex flex-row mt-1 items-center">
                            <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                            <div className="flex flex-col">
                              <ReactSelect
                                isMulti
                                menuPortalTarget={document.body}
                                menuPosition={"fixed"}
                                styles={{
                                  menuPortal: (base) => ({
                                    ...base,
                                    zIndex: 9999,
                                    maxHeight: "38px",
                                  }),
                                  control: (provided, state) => ({
                                    ...provided,
                                    paddingBlock: "0px",
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
                                className="basic-multi-select w-full text-start text-nowrap p-1"
                                placeholder="Select domains you are interested in"
                                name="domains_interested_in"
                                onChange={(selectedOptions) => {
                                  if (
                                    selectedOptions &&
                                    selectedOptions.length > 0
                                  ) {
                                    setInterestedDomainsSelectedOptions(
                                      selectedOptions
                                    );
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
                                      message:
                                        "Selecting an interest is required",
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
                          </div>
                        ) : (
                          <div className="flex flex-col space-x-2 text-gray-600">
                            <div className="flex flex-row  text-gray-600 space-x-2 items-center">
                              <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                              <div className="text-black font-semibold">
                                Skill :
                              </div>
                            </div>
                            <div className="flex gap-2 text-xs items-center flex-wrap">
                              {updatedData?.areaOfInterest &&
                                updatedData?.areaOfInterest
                                  .split(",")
                                  .slice(0, 3)
                                  .map((tag, index) => (
                                    <div
                                      key={index}
                                      className="text-xs border-2 rounded-2xl px-2 py-1 font-bold bg-[#c9c5c5]"
                                    >
                                      {tag.trim()}
                                    </div>
                                  ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col mb-2">
                  <div className="flex flex-col  text-gray-600 space-x-2">
                    <div className="flex flex-row  text-gray-600 space-x-2 items-center">
                      <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                      <div className=" text-black mb-2 font-semibold">
                        Reason to join:
                      </div>
                    </div>
                    <div className="flex gap-2 text-xs items-center flex-wrap">
                      <div className="flex text-gray-700 flex-row gap-2 flex-wrap text-xs">
                        {orignalData?.reasonToJoin?.map((reason, index) => (
                          <div
                            key={index}
                            className="text-xs border-2 rounded-2xl px-2 py-1 font-bold bg-[#c9c5c5]"
                          >
                            {reason.replace(/_/g, " ")}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2 items-center flex-row text-gray-600 mt-1">
                    <div className="flex flex-row  text-gray-600 space-x-2 items-center">
                      {editMode ? (
                        <div className="flex flex-row mt-1 items-center">
                          <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                          <div className="flex flex-col">
                            <ReactSelect
                              isMulti
                              menuPortalTarget={document.body}
                              menuPosition={"fixed"}
                              styles={{
                                menuPortal: (base) => ({
                                  ...base,
                                  zIndex: 9999,
                                }),
                                control: (provided, state) => ({
                                  ...provided,
                                  paddingBlock: "0px",
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
                              className="basic-multi-select w-full text-start text-nowrap p-1 text-xs"
                              placeholder="Select your reasons to join this platform"
                              name="reasons_to_join_platform"
                              onChange={(selectedOptions) => {
                                if (
                                  selectedOptions &&
                                  selectedOptions.length > 0
                                ) {
                                  setReasonOfJoiningSelectedOptions(
                                    selectedOptions
                                  );
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
                        </div>
                      ) : (
                        <div className="flex flex-col space-x-2 text-gray-600">
                          <div className="flex flex-row  text-gray-600 space-x-2 items-center">
                            <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                            <div className=" text-black mb-2 font-semibold">
                              Reason to join:
                            </div>
                          </div>
                          <div className="flex text-gray-700 flex-row gap-2 flex-wrap text-xs">
                            {updatedData?.reasonToJoin?.map((reason, index) => (
                              <div
                                key={index}
                                className="text-xs border-2 rounded-2xl px-2 py-1 font-bold bg-[#c9c5c5]"
                              >
                                {reason.replace(/_/g, " ")}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className=" bg-[#D2D5F2]  shadow-md shadow-gray-400 pb-6 pt-4 rounded-lg md:w-3/4 w-full">
              <div className="w-full flex flex-col  justify-around px-[4%] py-4">
                <div className="w-full flex flex-row justify-between items-center">
                  {showOriginalBioAndDescription ? (
                    <>
                      <h1 className="md:text-lg text-sm font-bold text-gray-800 truncate">
                        Project Description
                      </h1>
                      <div className="flex justify-center p-2 gap-2">
                        <span
                          className="w-2 h-2 bg-red-700 rounded-full"
                          onClick={() => setshowOriginalDescription(true)}
                        ></span>
                        <span
                          className="w-2 h-2 bg-green-700 rounded-full"
                          onClick={() => setshowOriginalDescription(false)}
                        ></span>
                      </div>
                    </>
                  ) : (
                    <>
                      <h1 className="md:text-lg text-sm font-bold text-gray-800 truncate">
                        User Bio
                      </h1>
                      <div className="flex justify-center p-2 gap-2">
                        <span
                          className="w-2 h-2 bg-red-700 rounded-full"
                          onClick={() => setshowOriginalBio(true)}
                        ></span>
                        <span
                          className="w-2 h-2 bg-green-700 rounded-full"
                          onClick={() => setshowOriginalBio(false)}
                        ></span>
                      </div>
                    </>
                  )}
                </div>
                <div className="flex justify-end mr-1">
                  <label
                    htmlFor="project_description"
                    className={`flex items-center cursor-pointer`}
                  >
                    <div className="relative">
                      <input
                        type="checkbox"
                        id="project_description"
                        className="sr-only"
                        checked={showOriginalBioAndDescription}
                        onChange={handleToggleChangeDescription}
                      />
                      <div className="block border-2 w-8 h-4 rounded-full"></div>

                      <div
                        className={`dot absolute left-1 top-1 bg-white w-3 h-2 rounded-full flex items-center justify-center transition-transform duration-300 ease-in-out ${
                          showOriginalBioAndDescription
                            ? ""
                            : "transform translate-x-full"
                        }`}
                      ></div>
                    </div>
                  </label>
                </div>
                <div className="flex md:flex-row flex-col w-full mt-3 items-start">
                  <div className="flex flex-col items-center">
                    <div className=" md:w-[5.5rem] md:flex-shrink-0 w-full justify-start">
                      <span className="text-xs font-semibold">
                        {showOriginalLogoAndCover
                          ? "Project Logo"
                          : "Project Cover"}
                      </span>
                      {showOriginalLogoAndCover ? (
                        <div className="flex flex-col">
                          {showOriginalLogo ? (
                            <img
                              className="md:w-20 object-fill md:h-20 w-16 h-16 border border-white bg-gray-300 justify-center rounded-md"
                              src={orignalData.projectLogo}
                              alt="projectLogo"
                            />
                          ) : (
                            <div>
                              {editMode ? (
                                <div className="flex flex-col mt-1">
                                  <div className="flex-col w-full flex justify-start gap-1 items-center">
                                    <div className="size-16 rounded-full border-2 border-gray-300 flex items-center justify-center overflow-hidden">
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
                                              logoCreationFunc(
                                                e.target.files[0]
                                              );
                                            }}
                                            accept=".jpg, .jpeg, .png"
                                          />
                                          {logoPreview && !errors.logo ? (
                                            <label
                                              htmlFor="logo"
                                              className="p-1 border-2 border-blue-800 items-center rounded-md text-[9px] bg-transparent text-blue-800 cursor-pointer font-semibold flex"
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 448 512"
                                                className="size-3"
                                                fill="currentColor"
                                                style={{
                                                  transform: "rotate(135deg)",
                                                }}
                                              >
                                                <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
                                              </svg>
                                              <span className="ml-2">
                                                Change logo
                                              </span>
                                            </label>
                                          ) : (
                                            <label
                                              htmlFor="logo"
                                              className="p-1 border-2 border-blue-800 items-center rounded-md text-[9px] bg-transparent text-blue-800 cursor-pointer font-semibold flex"
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 512 512"
                                                className="size-3"
                                                fill="currentColor"
                                              >
                                                <path d="M288 109.3V352c0 17.7-14.3 32-32 32s-32-14.3-32-32V109.3l-73.4 73.4c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l128-128c12.5-12.5 32.8-12.5 45.3 0l128 128c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L288 109.3zM64 352H192c0 35.3 28.7 64 64 64s64-28.7 64-64H448c35.3 0 64 28.7 64 64v32c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V416c0-35.3 28.7-64 64-64zM432 456a24 24 0 1 0 0-48 24 24 0 1 0 0 48z" />
                                              </svg>
                                              <span className="ml-2 text-nowrap">
                                                Upload logo
                                              </span>
                                            </label>
                                          )}
                                          {logoPreview || errors.logo ? (
                                            <button
                                              className=" w-full p-1 border-2 border-red-500 items-center rounded-md text-[9px] bg-transparent text-red-500 cursor-pointer font-semibold capitalize"
                                              onClick={() =>
                                                clearLogoFunc("logo")
                                              }
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
                              ) : (
                                <img
                                  className="md:w-20 object-fill md:h-20 w-16 h-16 border border-white bg-gray-300 justify-center rounded-md"
                                  src={updatedData.projectLogo}
                                  alt="projectLogo"
                                />
                              )}
                            </div>
                          )}
                          <div className="flex justify-center p-2 gap-2">
                            <span
                              className="w-2 h-2 bg-red-700 rounded-full"
                              onClick={() => setshowOriginalLogo(true)}
                            ></span>
                            <span
                              className="w-2 h-2 bg-green-700 rounded-full"
                              onClick={() => setshowOriginalLogo(false)}
                            ></span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col">
                          {showOriginalCover ? (
                            <img
                              className="md:w-20 object-fill md:h-20 w-16 h-16 border border-white bg-gray-300 justify-center rounded-md"
                              src={orignalData.projectCover}
                              alt="projectCover"
                            />
                          ) : (
                            <div>
                              {editMode ? (
                                <div className="flex flex-col">
                                  <div className="flex-col w-full flex justify-start gap-1 items-center">
                                    <div className="size-16 rounded-full border-2 border-gray-300 flex items-center justify-center overflow-hidden">
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
                                              coverCreationFunc(
                                                e.target.files[0]
                                              );
                                            }}
                                            accept=".jpg, .jpeg, .png"
                                          />
                                          {coverPreview && !errors.cover ? (
                                            <label
                                              htmlFor="cover"
                                              className="p-1 border-2 border-blue-800 items-center rounded-md text-[9px] bg-transparent text-blue-800 cursor-pointer font-semibold flex"
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 448 512"
                                                className="size-3"
                                                fill="currentColor"
                                                style={{
                                                  transform: "rotate(135deg)",
                                                }}
                                              >
                                                <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
                                              </svg>
                                              <span className="ml-2">
                                                Change cover picture
                                              </span>
                                            </label>
                                          ) : (
                                            <label
                                              htmlFor="cover"
                                              className="p-1 border-2 border-blue-800 items-center rounded-md text-[9px] bg-transparent text-blue-800 cursor-pointer font-semibold flex"
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 512 512"
                                                className="size-5"
                                                fill="currentColor"
                                              >
                                                <path d="M288 109.3V352c0 17.7-14.3 32-32 32s-32-14.3-32-32V109.3l-73.4 73.4c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l128-128c12.5-12.5 32.8-12.5 45.3 0l128 128c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L288 109.3zM64 352H192c0 35.3 28.7 64 64 64s64-28.7 64-64H448c35.3 0 64 28.7 64 64v32c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V416c0-35.3 28.7-64 64-64zM432 456a24 24 0 1 0 0-48 24 24 0 1 0 0 48z" />
                                              </svg>
                                              <span className="ml-2">
                                                Upload cover picture
                                              </span>
                                            </label>
                                          )}
                                          {coverPreview || errors.cover ? (
                                            <button
                                              className="w-full p-1 border-2 border-red-500 items-center rounded-md text-[9px] bg-transparent text-red-500 cursor-pointer font-semibold capitalize"
                                              onClick={() =>
                                                clearCoverFunc("cover")
                                              }
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
                              ) : (
                                <img
                                  className="md:w-20 object-fill md:h-20 w-16 h-16 border border-white bg-gray-300 justify-center rounded-md"
                                  src={updatedData.projectCover}
                                  alt="projectLogo"
                                />
                              )}
                            </div>
                          )}
                          <div className="flex justify-center p-2 gap-2">
                            <span
                              className="w-2 h-2 bg-red-700 rounded-full"
                              onClick={() => setshowOriginalCover(true)}
                            ></span>
                            <span
                              className="w-2 h-2 bg-green-700 rounded-full"
                              onClick={() => setshowOriginalCover(false)}
                            ></span>
                          </div>
                        </div>
                      )}
                    </div>
                    <label
                      htmlFor="toggle"
                      className={`flex items-center cursor-pointer ml-1`}
                    >
                      <div className="relative">
                        <input
                          type="checkbox"
                          id="toggle"
                          className="sr-only"
                          checked={showOriginalLogoAndCover}
                          onChange={handleToggleChange}
                        />
                        <div className="block border-2 w-8 h-4 rounded-full"></div>

                        <div
                          className={`dot absolute left-1 top-1 bg-white w-3 h-2 rounded-full flex items-center justify-center transition-transform duration-300 ease-in-out ${
                            showOriginalLogoAndCover
                              ? ""
                              : "transform translate-x-full"
                          }`}
                        ></div>
                      </div>
                    </label>
                  </div>
                  <div className="flex flex-col md:flex-grow md:w-5/6 w-full justify-start md:ml-4 md:mb-0 mb-6">
                    <div className="flex flex-row  gap-4 items-center">
                      {showOriginalBioAndDescription ? (
                        <>
                          {showOriginalDescription ? (
                            <h1 className="md:text-base md:h-[8rem] h-[12rem] flex-wrap text-sm bg-black break-all text-transparent bg-clip-text">
                              {orignalData.projectDescription}
                            </h1>
                          ) : (
                            <div className="w-full">
                              {editMode ? (
                                <div className="flex flex-col mt-1">
                                  <textarea
                                    type="text"
                                    {...register("project_description")}
                                    className={`bg-gray-50 border-2 
                                             ${
                                               errors?.project_description
                                                 ? "border-red-500 "
                                                 : "border-[#737373]"
                                             } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1 h-32 resize-none`}
                                    placeholder="Max 50 words"
                                  />
                                  {errors?.project_description && (
                                    <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                                      {errors?.project_description?.message}
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <h1 className="md:text-base md:h-[8rem] h-[12rem] flex-wrap text-sm bg-black break-all text-transparent bg-clip-text">
                                  {updatedData.projectDescription}
                                </h1>
                              )}
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          {showOriginalBio ? (
                            <h1 className="md:text-base md:h-[8rem] h-[12rem] flex-wrap text-sm bg-black break-all text-transparent bg-clip-text">
                              {orignalData.userBio}
                            </h1>
                          ) : (
                            <div className="w-full">
                              {editMode ? (
                                <div className="flex flex-col mt-1">
                                  <textarea
                                    {...register("bio")}
                                    className={`bg-gray-50 border-2 ${
                                      errors?.bio
                                        ? "border-red-500 "
                                        : "border-[#737373]"
                                    } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1 h-32 resize-none`}
                                    placeholder="Enter your bio"
                                  ></textarea>
                                  {errors?.bio && (
                                    <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                                      {errors?.bio?.message}
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <h1 className="md:text-base md:h-[8rem] h-[12rem] flex-wrap text-sm bg-black break-all text-transparent bg-clip-text">
                                  {updatedData.userBio}
                                </h1>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    <div className="border border-gray-400 w-full mt-2 mb-4 relative " />

                    <div className="grid md:grid-cols-2 gap-3 text-sm w-full">
                      <div className="flex flex-col w-full md:w-4/5">
                        <div className="flex flex-col mb-4 md:mb-6">
                          <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">
                            {" "}
                            Project Name:
                          </h2>
                          <div className="flex space-x-2 items-center  flex-row ml-3">
                            <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                            <div className="text-[#7283EA] text-xs font-semibold md:text-sm truncate px-4">
                              {orignalData?.project_name ?? "Not available"}
                            </div>
                          </div>
                          <div className="flex space-x-2 items-center flex-row ml-3">
                            <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                            {editMode ? (
                              <div className="flex flex-col mt-1">
                                <input
                                  type="text"
                                  {...register("project_name")}
                                  className={`bg-gray-50 border-2 
                                             ${
                                               errors?.project_name
                                                 ? "border-red-500 "
                                                 : "border-[#737373]"
                                             } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1`}
                                  placeholder="Enter your Project name"
                                />
                                {errors?.project_name && (
                                  <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                                    {errors?.project_name?.message}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <div className="text-[#7283EA] text-xs font-semibold md:text-sm truncate px-4">
                                {updatedData?.project_name ?? "Not available"}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col mb-4 md:mb-6">
                          <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">
                            {" "}
                            Linkedin:
                          </h2>
                          <div className="flex space-x-2 items-center  flex-row ml-3">
                            <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                            <div className="text-[#7283EA] text-xs font-semibold md:text-sm truncate px-4">
                              {orignalData?.projectLinkedin ?orignalData?.projectLinkedin : "Not available"}
                            </div>
                          </div>
                          <div className="flex space-x-2 items-center flex-row ml-3">
                            <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                            {editMode ? (
                              <div className="flex flex-col mt-1">
                                <input
                                  type="text"
                                  {...register("project_linkedin")}
                                  className={`bg-gray-50 border-2 
                                                    ${
                                                      errors?.project_linkedin
                                                        ? "border-red-500 "
                                                        : "border-[#737373]"
                                                    } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1`}
                                  placeholder="https://"
                                />
                                {errors?.project_linkedin && (
                                  <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                                    {errors?.project_linkedin?.message}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <div className="text-[#7283EA] text-xs font-semibold md:text-sm truncate px-4">
                                {updatedData?.projectLinkedin ?updatedData?.projectLinkedin:
                                  "Not available"}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col mb-4 md:mb-6">
                          <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">
                            Twitter:
                          </h2>
                          <div className="flex space-x-2 items-center  flex-row ml-3">
                            <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                            <div className="text-[#7283EA] text-xs font-semibold md:text-sm truncate px-4">
                              {orignalData?.userTwitter ? orignalData?.userTwitter :"Not available"}
                            </div>
                          </div>
                          <div className="flex space-x-2 items-center flex-row ml-3">
                            <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                            {editMode ? (
                              <div className="flex flex-col mt-1">
                                <input
                                  type="text"
                                  {...register("twitter_url")}
                                  className={`bg-gray-50 border-2 
                                              ${
                                                errors?.twitter_url
                                                  ? "border-red-500 "
                                                  : "border-[#737373]"
                                              } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1`}
                                  placeholder="Enter your twitter url"
                                />
                                {errors?.twitter_url && (
                                  <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                                    {errors?.twitter_url?.message}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <div className="text-[#7283EA] text-xs font-semibold md:text-sm truncate px-4">
                                {updatedData?.userTwitter ?updatedData?.userTwitter: "Not available"}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col mb-4 md:mb-6">
                          <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">
                            Project Pitch Deck:
                          </h2>
                          <div className="flex space-x-2 items-center  flex-row ml-3">
                            <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                            <div className="text-[#7283EA] text-xs font-semibold md:text-sm truncate px-4">
                              {orignalData?.projectElevatorPitch ?orignalData?.projectElevatorPitch:
                                "Not available"}
                            </div>
                          </div>
                          <div className="flex space-x-2 items-center flex-row ml-3">
                            <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                            {editMode ? (
                              <div className="flex flex-col mt-1">
                                <input
                                  type="text"
                                  {...register("project_elevator_pitch")}
                                  className={`bg-gray-50 border-2 
                                             ${
                                               errors?.project_elevator_pitch
                                                 ? "border-red-500 "
                                                 : "border-[#737373]"
                                             } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1`}
                                  placeholder="https://"
                                />
                                {errors?.project_elevator_pitch && (
                                  <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                                    {errors?.project_elevator_pitch?.message}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <div className="text-[#7283EA] text-xs font-semibold md:text-sm truncate px-4">
                                {updatedData?.projectElevatorPitch ?updatedData?.projectElevatorPitch:
                                  "Not available"}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col mb-4 md:mb-6">
                          <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">
                            Promotional Video:
                          </h2>
                          <div className="flex space-x-2 items-center  flex-row ml-3">
                            <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                            <div className="text-[#7283EA] text-xs font-semibold md:text-sm truncate px-4">
                              {orignalData?.promotionalVideo ?orignalData?.promotionalVideo: "Not available"}
                            </div>
                          </div>
                          <div className="flex space-x-2 items-center flex-row ml-3">
                            <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                            {editMode ? (
                              <div className="flex flex-col mt-1">
                                <input
                                  type="text"
                                  {...register("promotional_video")}
                                  className={`bg-gray-50 border-2 
                                             ${
                                               errors?.promotional_video
                                                 ? "border-red-500 "
                                                 : "border-[#737373]"
                                             } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1`}
                                  placeholder="https://"
                                />
                                {errors?.promotional_video && (
                                  <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                                    {errors?.promotional_video?.message}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <div className="text-[#7283EA] text-xs font-semibold md:text-sm truncate px-4">
                                {updatedData?.promotionalVideo ?updatedData?.promotionalVideo:
                                  "Not available"}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col md:w-4/5 w-full">
                        <div className="flex flex-col mb-4 md:mb-6">
                          <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">
                            Github:
                          </h2>
                          <div className="flex space-x-2 items-center  flex-row ml-3">
                            <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                            <div className="text-[#7283EA] text-xs font-semibold md:text-sm truncate px-4">
                              {orignalData?.githubLink ? orignalData?.githubLink :"Not available"}
                            </div>
                          </div>
                          <div className="flex space-x-2 items-center flex-row ml-3">
                            <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                            {editMode ? (
                              <div className="flex flex-col mt-1">
                                <input
                                  type="text"
                                  {...register("github_link")}
                                  className={`bg-gray-50 border-2 
                                             ${
                                               errors?.github_link
                                                 ? "border-red-500 "
                                                 : "border-[#737373]"
                                             } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1`}
                                  placeholder="https://"
                                />
                                {errors?.github_link && (
                                  <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                                    {errors?.github_link?.message}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <div className="text-[#7283EA] text-xs font-semibold md:text-sm truncate px-4">
                                {updatedData?.githubLink ?updatedData?.githubLink : "Not available"}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col mb-4 md:mb-6">
                          <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">
                            Discord:
                          </h2>
                          <div className="flex space-x-2 items-center  flex-row ml-3">
                            <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                            <div className="text-[#7283EA] text-xs font-semibold md:text-sm truncate px-4">
                              {orignalData?.projectDiscord ?orignalData?.projectDiscord :"Not available"}
                            </div>
                          </div>
                          <div className="flex space-x-2 items-center flex-row ml-3">
                            <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                            {editMode ? (
                              <div className="flex flex-col mt-1">
                                <input
                                  type="text"
                                  {...register("project_discord")}
                                  className={`bg-gray-50 border-2 
                                             ${
                                               errors?.project_discord
                                                 ? "border-red-500 "
                                                 : "border-[#737373]"
                                             } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1`}
                                  placeholder="https://"
                                />
                                {errors?.project_discord && (
                                  <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                                    {errors?.project_discord?.message}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <div className="text-[#7283EA] text-xs font-semibold md:text-sm truncate px-4">
                                {updatedData?.projectDiscord ?updatedData?.projectDiscord: "Not available"}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col mb-4 md:mb-6">
                          <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">
                            Website:
                          </h2>
                          <div className="flex space-x-2 items-center  flex-row ml-3">
                            <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                            <div className="text-[#7283EA] text-xs font-semibold md:text-sm truncate px-4">
                              {orignalData?.projectWebsite ?orignalData?.projectWebsite : "Not available"}
                            </div>
                          </div>
                          <div className="flex space-x-2 items-center flex-row ml-3">
                            <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                            {editMode ? (
                              <div className="flex flex-col mt-1">
                                <input
                                  type="text"
                                  {...register("project_website")}
                                  className={`bg-gray-50 border-2 
                                             ${
                                               errors?.project_website
                                                 ? "border-red-500 "
                                                 : "border-[#737373]"
                                             } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1`}
                                  placeholder="https://"
                                />
                                {errors?.project_website && (
                                  <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                                    {errors?.project_website?.message}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <div className="text-[#7283EA] text-xs font-semibold md:text-sm truncate px-4">
                                {updatedData?.projectWebsite ?updatedData?.projectWebsite :"Not available"}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col mb-4 md:mb-6">
                          <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">
                            WhitePaper :
                          </h2>
                          <div className="flex space-x-2 items-center  flex-row ml-3">
                            <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                            <div className="text-[#7283EA] text-xs font-semibold md:text-sm truncate px-4">
                              {orignalData?.longTermGoals ?orignalData?.longTermGoals: "Not available"}
                            </div>
                          </div>
                          <div className="flex space-x-2 items-center flex-row ml-3">
                            <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                            {editMode ? (
                              <div className="flex flex-col mt-1">
                                <input
                                  type="text"
                                  {...register("white_paper")}
                                  className={`bg-gray-50 border-2 
                                             ${
                                               errors?.white_paper
                                                 ? "border-red-500 "
                                                 : "border-[#737373]"
                                             } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1`}
                                  placeholder="https://"
                                />
                                {errors?.white_paper && (
                                  <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                                    {errors?.white_paper?.message}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <div className="text-[#7283EA] text-xs font-semibold md:text-sm truncate px-4">
                          {updatedData?.longTermGoals ?updatedData?.longTermGoals: "Not available"}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col mb-4 md:mb-6">
                          <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">
                            Token Economics:
                          </h2>
                          <div className="flex space-x-2 items-center  flex-row ml-3">
                            <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                            <div className="text-[#7283EA] text-xs font-semibold md:text-sm truncate px-4">
                              {orignalData?.tokenEconomics ?orignalData?.tokenEconomics:"Not available"}
                            </div>
                          </div>
                          <div className="flex space-x-2 items-center flex-row ml-3">
                            <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                            {editMode ? (
                              <div className="flex flex-col mt-1">
                                <input
                                  type="text"
                                  {...register("token_economics")}
                                  className={`bg-gray-50 border-2 
                                             ${
                                               errors?.token_economics
                                                 ? "border-red-500 "
                                                 : "border-[#737373]"
                                             } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1`}
                                  placeholder="https://"
                                />
                                {errors?.token_economics && (
                                  <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                                    {errors?.token_economics?.message}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <div className="text-[#7283EA] text-xs font-semibold md:text-sm truncate px-4">
                                {updatedData?.tokenEconomics ?updatedData?.tokenEconomics :"Not available"}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 
          <div className="flex flex-col gap-2 h-[275px] bg-gray-100 px-[1%] rounded-md mt-2  overflow-y-auto py-2">
            {Allrole &&
              Allrole.length > 0 &&
              Allrole.filter(
                (role) =>
                  role.approved_on[0] ||
                  role.rejected_on[0] ||
                  role.requested_on[0]
              ).map((role, index) => (
                <div key={index} className="flex justify-around items-center">
                  <button
                    className={`flex px-4 items-center md:w-[400px] w-full h-[90px] ${getButtonClass(
                      role.status
                    )} rounded-md `}
                  >
                    <div className="xl:lg:ml-4">{Profile2}</div>
                    <div className="flex justify-center items-center text-white p-2 text-sm">
                      {constructMessage(role)}
                    </div>
                  </button>
                </div>
              ))}
          </div> */}
              </div>
            </div>
          </div>

          <div className="w-full flex gap-4  md:flex-row flex-col mt-4">
            <div className="flex flex-col md:w-1/4 w-full">
              <div className=" bg-[#D2D5F2] flex  flex-col h-[310px] overflow-y-auto shadow-md shadow-gray-400 p-6 rounded-lg  w-full mb-4">
                <div className="flex flex-col md:pl-0 pl-4 mb-3">
                  <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">
                    Uploaded Private Docs :
                  </h2>
                  <div className="flex space-x-2 items-center  flex-row ml-3">
                    <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                    <div className="text-md  font-normal text-gray-600  break-all flex-wrap">
                      {orignalData?.uploadPrivateDocuments ? (
                        "Yes"
                      ) : "No" ? (
                        <span>
                          {orignalData?.uploadPrivateDocuments ? "Yes" : "No"}
                        </span>
                      ) : (
                        <span className="flex items-center">
                          {noDataPresentSvg}
                          Data Not Available
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2 items-center flex-row ml-3">
                    <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                    {editMode ? (
                      <div className="flex flex-col mt-1 w-11/12">
                        <select
                          {...register("upload_private_documents")}
                          className="bg-gray-50 border-2 text-sm border-[#737373] text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1"
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
                    ) : (
                      <div className="text-md font-normal text-gray-600 break-all flex-wrap">
                        {updatedData?.uploadPrivateDocuments ? (
                          "Yes"
                        ) : "No" ? (
                          <span>
                            {updatedData?.uploadPrivateDocuments ? "Yes" : "No"}
                          </span>
                        ) : (
                          <span className="flex items-center">
                            {noDataPresentSvg}
                            Data Not Available
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <h1 className="text-xl font-bold text-gray-800">
                    Private Documents
                  </h1>
                  {editMode ? (
                    <button
                      type="button"
                      onClick={() => appendPrivate({ title: "", link: "" })}
                      className=" p-1"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512"
                        className="size-4"
                        fill="currentColor"
                      >
                        <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
                      </svg>
                    </button>
                  ) : (
                    ""
                  )}
                </div>
                <div className="flex flex-col space-y-2">
                  <div className="overflow-hidden space-y-2 ">
                    {orignalData?.privateDocs?.map((doc, index) => (
                      <div
                        className="flex flex-row  p-2 items-center border-2 rounded-xl"
                        key={index}
                      >
                        <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                        <img
                          src={pdfSvg}
                          alt="PDF Icon"
                          className="w-10 h-12 ml-2"
                        />
                        <div className="truncate flex flex-col ml-2">
                          <div className="flex-grow">
                            <a
                              href={doc.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-800 text-xs truncate font-medium justify-self-end"
                              title={doc.title}
                            >
                              {doc.title}
                            </a>
                          </div>
                          <div className="flex justify-end">
                            <div className="text-gray-600 text-sm mt-2 break-words">
                              <a
                                href={doc.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 underline"
                              >
                                CLICK HERE
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="div">
                    {watch("upload_private_documents") === "true" &&
                    editMode ? (
                      <div className="flex flex-col space-y-2">
                        {fieldsPrivate.map((field, index) => (
                          <React.Fragment key={field.id}>
                            <div className="flex flex-row gap-2  p-2 items-center border-2 rounded-xl">
                              <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                              <img
                                src={pdfSvg}
                                alt="PDF Icon"
                                className="w-10 h-12"
                              />
                              <div className="overflow-hidden">
                                <div className="flex flex-row items-center">
                                  <div className="flex flex-col space-y-1">
                                    <div className="w-full">
                                      <input
                                        {...register(
                                          `privateDocs.${index}.title`
                                        )}
                                        className="bg-gray-50 border-2 border-black rounded-lg block w-full p-1 text-black text-xs"
                                        type="text"
                                      />
                                      {errors.privateDocs?.[index]?.title && (
                                        <p className="mt-1 text-xs text-red-500 font-bold text-left">
                                          {
                                            errors.privateDocs[index].title
                                              .message
                                          }
                                        </p>
                                      )}
                                    </div>
                                    <div className="w-full">
                                      <input
                                        {...register(
                                          `privateDocs.${index}.link`
                                        )}
                                        className="bg-gray-50 border-2 border-black rounded-lg block w-full p-1 text-xs text-black"
                                        type="text"
                                      />
                                      {errors.privateDocs?.[index]?.link && (
                                        <p className="mt-1 text-xs text-red-500 font-bold text-left">
                                          {
                                            errors.privateDocs[index].link
                                              .message
                                          }
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleremovePrivate(index)}
                                    className="p-2 ml-2"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 448 512"
                                      className="size-4 "
                                      fill="red"
                                    >
                                      <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </React.Fragment>
                        ))}
                      </div>
                    ) : (
                      <div className="overflow-hidden space-y-2">
                        {updatedData?.privateDocs?.map((doc, index) => (
                          <div
                            className="flex flex-row gap-2  p-2 items-center border-2 rounded-xl"
                            key={index}
                          >
                            <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                            <img
                              src={pdfSvg}
                              alt="PDF Icon"
                              className="w-10 h-12"
                            />
                            <div className="truncate flex flex-col ml-2">
                              <div className="flex-grow">
                                <a
                                  href={doc.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-gray-800 text-xs truncate font-medium justify-self-end"
                                  title={doc.title}
                                >
                                  {doc.title}
                                </a>
                              </div>
                              <div className="flex justify-end">
                                <div className="text-gray-600 text-sm mt-2 break-words">
                                  <a
                                    href={doc.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 underline"
                                  >
                                    CLICK HERE
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className=" bg-[#D2D5F2] flex  flex-col h-[310px] overflow-y-auto shadow-md shadow-gray-400 p-6 rounded-lg  w-full mb-4">
                <div className="flex flex-col md:pl-0 pl-4 mb-3">
                  <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">
                    Uploaded Public Docs :
                  </h2>
                  <div className="flex space-x-2 items-center  flex-row ml-3">
                    <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                    <div className="text-md  font-normal text-gray-600  break-all flex-wrap">
                      {orignalData?.uploadPublicDocuments ? (
                        "Yes"
                      ) : "No" ? (
                        <span>
                          {orignalData?.uploadPublicDocuments ? "Yes" : "No"}
                        </span>
                      ) : (
                        <span className="flex items-center">
                          {noDataPresentSvg}
                          Data Not Available
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2 items-center flex-row ml-3">
                    <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                    {editMode ? (
                      <div className="flex flex-col mt-1 w-11/12">
                        <select
                          {...register("upload_public_documents")}
                          className="bg-gray-50 border-2 text-sm border-[#737373] text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1"
                        >
                          <option className="text-lg font-bold" value="false">
                            No
                          </option>
                          <option className="text-lg font-bold" value="true">
                            Yes
                          </option>
                        </select>
                        {errors.upload_public_documents && (
                          <p className="mt-1 text-sm text-red-500 font-bold text-left">
                            {errors.upload_public_documents.message}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="text-md font-normal text-gray-600 break-all flex-wrap">
                        {updatedData?.uploadPublicDocuments ? (
                          "Yes"
                        ) : "No" ? (
                          <span>
                            {updatedData?.uploadPublicDocuments ? "Yes" : "No"}
                          </span>
                        ) : (
                          <span className="flex items-center">
                            {noDataPresentSvg}
                            Data Not Available
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <h1 className="text-xl font-bold text-gray-800">
                    Public Documents
                  </h1>
                  {editMode ? (
                    <button
                      type="button"
                      onClick={() => append({ title: "", link: "" })}
                      className=" p-1"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512"
                        className="size-4"
                        fill="currentColor"
                      >
                        <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
                      </svg>
                    </button>
                  ) : (
                    ""
                  )}
                </div>
                <div className="flex flex-col space-y-2">
                  <div className="overflow-hidden space-y-2">
                    {orignalData?.publicDocs?.map((doc, index) => (
                      <div
                        className="flex flex-row gap-2  p-2 items-center border-2 rounded-xl"
                        key={index}
                      >
                        <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                        <img
                          src={pdfSvg}
                          alt="PDF Icon"
                          className="w-10 h-12 ml-2"
                        />
                        <div className="truncate flex flex-col ml-2">
                          <div className="flex-grow">
                            <a
                              href={doc.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-800 text-xs truncate font-medium justify-self-end"
                              title={doc.title}
                            >
                              {doc.title}
                            </a>
                          </div>
                          <div className="flex justify-end">
                            <div className="text-gray-600 text-sm mt-2 break-words">
                              <a
                                href={doc.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 underline"
                              >
                                CLICK HERE
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="div">
                    {watch("upload_public_documents") === "true" && editMode ? (
                      <div className="flex flex-col space-y-2">
                        {fields.map((field, index) => (
                          <React.Fragment key={field.id}>
                            <div className="flex flex-row gap-2  p-2 items-center border-2 rounded-xl">
                              <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                              <img
                                src={pdfSvg}
                                alt="PDF Icon"
                                className="w-10 h-12"
                              />
                              <div className="overflow-hidden">
                                <div className="flex flex-row items-center">
                                  <div className="flex flex-col space-y-1">
                                    <div className="w-full">
                                      <input
                                        {...register(
                                          `publicDocs.${index}.title`
                                        )}
                                        className="bg-gray-50 border-2 border-black rounded-lg block w-full p-1 text-black text-xs"
                                        type="text"
                                      />
                                      {errors.publicDocs?.[index]?.title && (
                                        <p className="mt-1 text-xs text-red-500 font-bold text-left">
                                          {
                                            errors.publicDocs[index].title
                                              .message
                                          }
                                        </p>
                                      )}
                                    </div>
                                    <div className="w-full">
                                      <input
                                        {...register(
                                          `publicDocs.${index}.link`
                                        )}
                                        className="bg-gray-50 border-2 border-black rounded-lg block w-full p-1 text-xs text-black"
                                        type="text"
                                      />
                                      {errors.publicDocs?.[index]?.link && (
                                        <p className="mt-1 text-xs text-red-500 font-bold text-left">
                                          {
                                            errors.publicDocs[index].link
                                              .message
                                          }
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => removePublic(index)}
                                    className="p-2 ml-2"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 448 512"
                                      className="size-4 "
                                      fill="red"
                                    >
                                      <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </React.Fragment>
                        ))}
                      </div>
                    ) : (
                      <div className="overflow-hidden space-y-2">
                        {updatedData?.publicDocs?.map((doc, index) => (
                          <div
                            className="flex flex-row gap-2  p-2 items-center border-2 rounded-xl"
                            key={index}
                          >
                            <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                            <img
                              src={pdfSvg}
                              alt="PDF Icon"
                              className="w-10 h-12 ml-2"
                            />
                            <div className="truncate flex flex-col ml-2">
                              <div className="flex-grow">
                                <a
                                  href={doc.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-gray-800 text-xs truncate font-medium justify-self-end"
                                  title={doc.title}
                                >
                                  {doc.title}
                                </a>
                              </div>
                              <div className="flex justify-end">
                                <div className="text-gray-600 text-sm mt-2 break-words">
                                  <a
                                    href={doc.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 underline"
                                  >
                                    CLICK HERE
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className=" bg-[#D2D5F2] md:px-[4%] flex md:flex-row flex-col shadow-md shadow-gray-400 pb-6 pt-4 rounded-lg md:w-3/4 w-full">
              <div className="grid md:grid-cols-2 w-full">
                <div className="flex flex-col mb-4 md:mb-6 md:pl-0 pl-4">
                  <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">
                    Preferred ICP Hub :
                  </h2>
                  <div className="flex space-x-2 items-center  flex-row ml-3">
                    <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                    <div className="text-md  font-normal text-gray-600  break-all flex-wrap">
                      {orignalData?.preferredIcpHub ? (
                        <span>{orignalData?.preferredIcpHub}</span>
                      ) : (
                        <span className="flex items-center">
                          {noDataPresentSvg}
                          Data Not Available
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2 items-center flex-row ml-3">
                    <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                    {editMode ? (
                      <div className="flex flex-col mt-1 w-3/4">
                        <select
                          {...register("preferred_icp_hub")}
                          defaultValue={getValues("preferred_icp_hub")}
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
                        {errors.preferred_icp_hub && (
                          <p className="mt-1 text-sm text-red-500 font-bold text-left">
                            {errors.preferred_icp_hub.message}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="text-md font-normal text-gray-600 break-all flex-wrap">
                        {updatedData?.preferredIcpHub ? (
                          <span>{updatedData?.preferredIcpHub}</span>
                        ) : (
                          <span className="flex items-center">
                            {noDataPresentSvg}
                            Data Not Available
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col mb-4 md:mb-6 md:pl-0 pl-4">
                  <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">
                    Project Registered :
                  </h2>
                  <div className="flex space-x-2 items-center  flex-row ml-3">
                    <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                    <div className="text-md  font-normal text-gray-600  break-all flex-wrap">
                      {orignalData?.isYourProjectRegistered ? (
                        "Yes"
                      ) : "No" ? (
                        <span>
                          {orignalData?.isYourProjectRegistered ? "Yes" : "No"}
                        </span>
                      ) : (
                        <span className="flex items-center">
                          {noDataPresentSvg}
                          Data Not Available
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2 items-center  flex-row ml-3">
                    <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                    {editMode ? (
                      <div className="flex flex-col mt-1 w-3/4">
                        <select
                          {...register("is_your_project_registered")}
                          className={`bg-gray-50 border-2 ${
                            errors.is_your_project_registered
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
                        {errors.is_your_project_registered && (
                          <p className="mt-1 text-sm text-red-500 font-bold text-left">
                            {errors.is_your_project_registered.message}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="text-md  font-normal text-gray-600  break-all flex-wrap">
                        {updatedData?.isYourProjectRegistered ? (
                          "Yes"
                        ) : "No" ? (
                          <span>
                            {updatedData?.isYourProjectRegistered
                              ? "Yes"
                              : "No"}
                          </span>
                        ) : (
                          <span className="flex items-center">
                            {noDataPresentSvg}
                            Data Not Available
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col mb-4 md:mb-6 md:pl-0 pl-4">
                  <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">
                    Type of Registration :
                  </h2>
                  <div className="flex space-x-2 items-center  flex-row ml-3">
                    <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                    <div className="text-md  font-normal text-gray-600  break-all flex-wrap">
                      {orignalData?.typeOfRegistration ? (
                        <span>{orignalData?.typeOfRegistration}</span>
                      ) : (
                        <span className="flex items-center">
                          {noDataPresentSvg}
                          Data Not Available
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2 items-center  flex-row ml-3">
                    <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                    {watch("is_your_project_registered") === "true" &&
                    editMode ? (
                      <div className="flex flex-col mt-1 w-3/4">
                        <select
                          {...register("type_of_registration")}
                          className={`bg-gray-50 border-2 ${
                            errors.type_of_registration
                              ? "border-red-500"
                              : "border-[#737373]"
                          } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1`}
                        >
                          <option className="text-lg font-bold" value="">
                            Select registration type
                          </option>
                          <option
                            className="text-lg font-bold"
                            value="Comapany"
                          >
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
                    ) : (
                      <div className="text-md  font-normal text-gray-600  break-all flex-wrap">
                        {updatedData?.typeOfRegistration ? (
                          <span>{updatedData?.typeOfRegistration}</span>
                        ) : (
                          <span className="flex items-center">
                            {noDataPresentSvg}
                            Data Not Available
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col mb-4 md:mb-6 md:pl-0 pl-4">
                  <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">
                    Country of Registration:
                  </h2>
                  <div className="flex space-x-2 items-center  flex-row ml-3">
                    <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                    <div className="text-md  font-normal text-gray-600  break-all flex-wrap">
                      {orignalData?.countryOfRegistration ? (
                        <span>{orignalData?.countryOfRegistration}</span>
                      ) : (
                        <span className="flex items-center">
                          {noDataPresentSvg}
                          Data Not Available
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2 items-center flex-row ml-3">
                    <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                    {watch("is_your_project_registered") === "true" &&
                    editMode ? (
                      <div className="flex flex-col mt-1 w-3/4">
                        <select
                          {...register("country_of_registration")}
                          className={`bg-gray-50 border-2 ${
                            errors.country_of_registration
                              ? "border-red-500 "
                              : "border-[#737373]"
                          } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1`}
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
                      <div className="text-md font-normal text-gray-600 break-all flex-wrap">
                        {updatedData?.countryOfRegistration ? (
                          <span>{updatedData?.countryOfRegistration}</span>
                        ) : (
                          <span className="flex items-center">
                            {noDataPresentSvg}
                            Data Not Available
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col mb-4 md:mb-6 md:pl-0 pl-4">
                  <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">
                    Support Multichain :
                  </h2>
                  <div className="flex space-x-2 items-center  flex-row ml-3">
                    <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                    <div className="text-md  font-normal text-gray-600  break-all flex-wrap">
                      {orignalData?.supports_multichain ? (
                        "Yes"
                      ) : "No" ? (
                        <span>
                          {orignalData?.supports_multichain ? "Yes" : "No"}
                        </span>
                      ) : (
                        <span className="flex items-center">
                          {noDataPresentSvg}
                          Data Not Available
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2 items-center  flex-row ml-3">
                    <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                    {editMode ? (
                      <div className="flex flex-col mt-1 w-3/4">
                        <select
                          {...register("multi_chain")}
                          className={`bg-gray-50 border-2 ${
                            errors.multi_chain
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
                        {errors.multi_chain && (
                          <p className="mt-1 text-sm text-red-500 font-bold text-left">
                            {errors.multi_chain.message}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="text-md  font-normal text-gray-600  break-all flex-wrap">
                        {updatedData?.supports_multichain ? (
                          "Yes"
                        ) : "No" ? (
                          <span>
                            {updatedData?.supports_multichain ? "Yes" : "No"}
                          </span>
                        ) : (
                          <span className="flex items-center">
                            {noDataPresentSvg}
                            Data Not Available
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col mb-4 md:mb-6 md:pl-0 pl-4">
                  <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">
                    Support Multichain :
                  </h2>
                  <div className="flex space-x-2 items-center  flex-row ml-3">
                    <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                    <div className="text-md  font-normal text-gray-600  break-all flex-wrap">
                      {orignalData?.supportsMultichain ? (
                        <span className="flex flex-wrap gap-2 mb-1">
                          {orignalData?.supportsMultichain &&
                            orignalData?.supportsMultichain
                              .split(",")
                              .slice(0, 3)
                              .map((tag, index) => (
                                <div
                                  key={index}
                                  className="text-xs border-2 rounded-2xl px-2 py-1 font-bold bg-[#c9c5c5]"
                                >
                                  {tag.trim()}
                                </div>
                              ))}
                        </span>
                      ) : (
                        <span className="flex items-center">
                          {noDataPresentSvg}
                          Data Not Available
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2 items-center  flex-row ml-3">
                    <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                    {watch("multi_chain") === "true" && editMode ? (
                      <div className="flex flex-col mt-1 w-3/4">
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
                          className="basic-multi-select w-full text-start text-nowrap"
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
                      <div className="text-md  font-normal text-gray-600  break-all flex-wrap">
                        {updatedData?.supportsMultichain ? (
                          <span className="flex flex-wrap gap-2">
                            {updatedData?.supportsMultichain &&
                              updatedData?.supportsMultichain
                                .split(",")
                                .slice(0, 3)
                                .map((tag, index) => (
                                  <div
                                    key={index}
                                    className="text-xs border-2 rounded-2xl px-2 py-1 font-bold bg-[#c9c5c5]"
                                  >
                                    {tag.trim()}
                                  </div>
                                ))}
                          </span>
                        ) : (
                          <span className="flex items-center">
                            {noDataPresentSvg}
                            Data Not Available
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col mb-4 md:mb-6 md:pl-0 pl-4">
                  <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">
                    Live On Mainnet :
                  </h2>
                  <div className="flex space-x-2 items-center  flex-row ml-3">
                    <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                    <div className="text-md  font-normal text-gray-600  break-all flex-wrap">
                      {orignalData?.liveOnIcpMainnet ? (
                        "Yes"
                      ) : "No" ? (
                        <span>
                          {orignalData?.liveOnIcpMainnet ? "Yes" : "No"}
                        </span>
                      ) : (
                        <span className="flex items-center">
                          {noDataPresentSvg}
                          Data Not Available
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2 items-center flex-row ml-3">
                    <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                    {editMode ? (
                      <div className="flex flex-col mt-1 w-3/4">
                        <select
                          {...register("live_on_icp_mainnet")}
                          className={`bg-gray-50 border-2 ${
                            errors.live_on_icp_mainnet
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
                        {errors.live_on_icp_mainnet && (
                          <p className="mt-1 text-sm text-red-500 font-bold text-left">
                            {errors.live_on_icp_mainnet.message}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="text-md  font-normal text-gray-600  break-all flex-wrap">
                        {updatedData?.liveOnIcpMainnet ? (
                          "Yes"
                        ) : "No" ? (
                          <span>
                            {updatedData?.liveOnIcpMainnet ? "Yes" : "No"}
                          </span>
                        ) : (
                          <span className="flex items-center">
                            {noDataPresentSvg}
                            Data Not Available
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col mb-4 md:mb-6">
                  <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">
                    Daap Link:
                  </h2>
                  <div className="flex space-x-2 items-center  flex-row ml-3">
                    <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                    <div className="text-[#7283EA] text-xs font-semibold md:text-sm truncate px-4">
                      {orignalData?.dappLink ?orignalData?.dappLink: "Not available"}
                    </div>
                  </div>
                  <div className="flex space-x-2 items-center flex-row ml-3">
                    <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                    {watch("live_on_icp_mainnet") === "true" && editMode ? (
                      <div className="flex flex-col mt-1 w-3/4">
                        <input
                          type="text"
                          {...register("dapp_link")}
                          placeholder="Enter your dApp Link"
                          className={`bg-gray-50 border-2 ${
                            errors.dapp_link
                              ? "border-red-500"
                              : "border-[#737373]"
                          } text-gray-900 placeholder-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1`}
                        />
                        {errors.dapp_link && (
                          <div className="mt-1 text-sm text-red-500 font-bold">
                            {errors.dapp_link.message}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-[#7283EA] text-xs font-semibold md:text-sm truncate px-4">
                        {updatedData?.dappLink ?updatedData?.dappLink :"Not available"}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col mb-4 md:mb-6 md:pl-0 pl-4">
                  <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">
                    Weekly Active:
                  </h2>
                  <div className="flex space-x-2 items-center  flex-row ml-3">
                    <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                    <div className="text-md  font-normal text-gray-600  break-all flex-wrap">
                      {weeklyUsers ? (
                        <span>{weeklyUsers}</span>
                      ) : (
                        <span className="flex items-center">
                          {noDataPresentSvg}
                          Data Not Available
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2 items-center  flex-row ml-3">
                    <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                    {watch("live_on_icp_mainnet") === "true" && editMode ? (
                      <div className="flex flex-col mt-1 w-3/4">
                        <input
                          type="number"
                          {...register("weekly_active_users")}
                          className={`bg-gray-50 border-2 
                                             ${
                                               errors?.weekly_active_users
                                                 ? "border-red-500 "
                                                 : "border-[#737373]"
                                             } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1`}
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
                    ) : (
                      <div className="text-md  font-normal text-gray-600  break-all flex-wrap">
                        {updatedweeklyUsers ? (
                          <span>{updatedweeklyUsers}</span>
                        ) : (
                          <span className="flex items-center">
                            {noDataPresentSvg}
                            Data Not Available
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col mb-4 md:mb-6 md:pl-0 pl-4">
                  <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">
                    Revenue:
                  </h2>
                  <div className="flex space-x-2 items-center  flex-row ml-3">
                    <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                    <div className="text-md  font-normal text-gray-600  break-all flex-wrap">
                      {revenueNum ? (
                        <span>{revenueNum}</span>
                      ) : (
                        <span className="flex items-center">
                          {noDataPresentSvg}
                          Data Not Available
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2 items-center  flex-row ml-3">
                    <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                    {watch("live_on_icp_mainnet") === "true" && editMode ? (
                      <div className="flex flex-col mt-1 w-3/4">
                        <input
                          type="number"
                          {...register("revenue")}
                          className={`bg-gray-50 border-2 
                                             ${
                                               errors?.revenue
                                                 ? "border-red-500 "
                                                 : "border-[#737373]"
                                             } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1`}
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
                    ) : (
                      <div className="text-md  font-normal text-gray-600  break-all flex-wrap">
                        {updatedRevenueNum ? (
                          <span>{updatedRevenueNum}</span>
                        ) : (
                          <span className="flex items-center">
                            {noDataPresentSvg}
                            Data Not Available
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col mb-4 md:mb-6 md:pl-0 pl-4">
                  <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">
                    Have you raised any funds in past :
                  </h2>
                  <div className="flex space-x-2 items-center  flex-row ml-3">
                    <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                    <div className="text-md  font-normal text-gray-600  break-all flex-wrap">
                      {orignalData?.moneyRaisedTillNow ? (
                        "Yes"
                      ) : "No" ? (
                        <span>
                          {orignalData?.moneyRaisedTillNow ? "Yes" : "No"}
                        </span>
                      ) : (
                        <span className="flex items-center">
                          {noDataPresentSvg}
                          Data Not Available
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2 items-center  flex-row ml-3">
                    <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                    {editMode ? (
                      <div className="flex flex-col mt-1 w-3/4">
                        <select
                          {...register("money_raised_till_now")}
                          className={`bg-gray-50 border-2 ${
                            errors.money_raised_till_now
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
                        {errors.money_raised_till_now && (
                          <p className="mt-1 text-sm text-red-500 font-bold text-left">
                            {errors.money_raised_till_now.message}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="text-md  font-normal text-gray-600  break-all flex-wrap">
                        {updatedData?.moneyRaisedTillNow ? (
                          "Yes"
                        ) : "No" ? (
                          <span>
                            {updatedData?.moneyRaisedTillNow ? "Yes" : "No"}
                          </span>
                        ) : (
                          <span className="flex items-center">
                            {noDataPresentSvg}
                            Data Not Available
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col mb-4 md:mb-6 md:pl-0 pl-4">
                  <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">
                    ICP Grants:
                  </h2>
                  <div className="flex space-x-2 items-center  flex-row ml-3">
                    <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                    <div className="text-md  font-normal text-gray-600  break-all flex-wrap">
                      {icpGrants ? (
                        <span>{icpGrants}</span>
                      ) : (
                        <span className="flex items-center">
                          {noDataPresentSvg}
                          Data Not Available
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2 items-center  flex-row ml-3">
                    <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                    {watch("money_raised_till_now") === "true" && editMode ? (
                      <div className="flex flex-col mt-1 w-3/4">
                        <input
                          type="number"
                          {...register("icp_grants")}
                          className={`bg-gray-50 border-2 
                                       ${
                                         errors?.icp_grants
                                           ? "border-red-500 "
                                           : "border-[#737373]"
                                       } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1`}
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
                    ) : (
                      <div className="text-md  font-normal text-gray-600  break-all flex-wrap">
                        {updatedIcpGrants ? (
                          <span>{updatedIcpGrants}</span>
                        ) : (
                          <span className="flex items-center">
                            {noDataPresentSvg}
                            Data Not Available
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col mb-4 md:mb-6 md:pl-0 pl-4">
                  <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">
                    Investors :
                  </h2>
                  <div className="flex space-x-2 items-center  flex-row ml-3">
                    <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                    <div className="text-md  font-normal text-gray-600  break-all flex-wrap">
                      {investorInvest ? (
                        <span>{investorInvest}</span>
                      ) : (
                        <span className="flex items-center">
                          {noDataPresentSvg}
                          Data Not Available
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2 items-center  flex-row ml-3">
                    <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                    {watch("money_raised_till_now") === "true" && editMode ? (
                      <div className="flex flex-col mt-1 w-3/4">
                        <input
                          type="number"
                          {...register("investors")}
                          className={`bg-gray-50 border-2 
                                             ${
                                               errors?.investors
                                                 ? "border-red-500 "
                                                 : "border-[#737373]"
                                             } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1`}
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
                    ) : (
                      <div className="text-md  font-normal text-gray-600  break-all flex-wrap">
                        {updatedInvestorInvest ? (
                          <span>{updatedInvestorInvest}</span>
                        ) : (
                          <span className="flex items-center">
                            {noDataPresentSvg}
                            Data Not Available
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col mb-4 md:mb-6 md:pl-0 pl-4">
                  <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">
                    Launchpad :
                  </h2>
                  <div className="flex space-x-2 items-center  flex-row ml-3">
                    <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                    <div className="text-md  font-normal text-gray-600  break-all flex-wrap">
                      {otherEcosystem ? (
                        <span>{otherEcosystem}</span>
                      ) : (
                        <span className="flex items-center">
                          {noDataPresentSvg}
                          Data Not Available
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2 items-center  flex-row ml-3">
                    <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                    {watch("money_raised_till_now") === "true" && editMode ? (
                      <div className="flex flex-col mt-1 w-3/4">
                        <input
                          type="number"
                          {...register("raised_from_other_ecosystem")}
                          className={`bg-gray-50 border-2 
                                             ${
                                               errors?.raised_from_other_ecosystem
                                                 ? "border-red-500 "
                                                 : "border-[#737373]"
                                             } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1`}
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
                    ) : (
                      <div className="text-md  font-normal text-gray-600  break-all flex-wrap">
                        {updatedOtherEcosystem ? (
                          <span>{updatedOtherEcosystem}</span>
                        ) : (
                          <span className="flex items-center">
                            {noDataPresentSvg}
                            Data Not Available
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col mb-4 md:mb-6 md:pl-0 pl-4">
                  <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">
                    Are you currently raising money :
                  </h2>
                  <div className="flex space-x-2 items-center  flex-row ml-3">
                    <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                    <div className="text-md  font-normal text-gray-600  break-all flex-wrap">
                      {orignalData.money_raised && orignalData?.money_raised ? (
                        "Yes"
                      ) : "No" ? (
                        <span>
                          {orignalData.money_raised && orignalData?.money_raised
                            ? "Yes"
                            : "No"}
                        </span>
                      ) : (
                        <span className="flex items-center">
                          {noDataPresentSvg}
                          Data Not Available
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2 items-center  flex-row ml-3">
                    <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                    {editMode ? (
                      <div className="flex flex-col mt-1 w-3/4">
                        <select
                          {...register("money_raising")}
                          className={`bg-gray-50 border-2 ${
                            errors.money_raising
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
                        {errors.money_raising && (
                          <p className="mt-1 text-sm text-red-500 font-bold text-left">
                            {errors.money_raising.message}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="text-md  font-normal text-gray-600  break-all flex-wrap">
                        {updatedData?.money_raised &&
                        updatedData?.money_raised ? (
                          "Yes"
                        ) : "No" ? (
                          <span>
                            {updatedData?.money_raised &&
                            updatedData?.money_raised
                              ? "Yes"
                              : "No"}
                          </span>
                        ) : (
                          <span className="flex items-center">
                            {noDataPresentSvg}
                            Data Not Available
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col mb-4 md:mb-6 md:pl-0 pl-4">
                  <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">
                    Targeted Amount:
                  </h2>
                  <div className="flex space-x-2 items-center  flex-row ml-3">
                    <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                    <div className="text-md  font-normal text-gray-600  break-all flex-wrap">
                      {targetAmount ? (
                        <span>{targetAmount}</span>
                      ) : (
                        <span className="flex items-center">
                          {noDataPresentSvg}
                          Data Not Available
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2 items-center  flex-row ml-3">
                    <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                    {watch("money_raising") === "true" && editMode ? (
                      <div className="flex flex-col mt-1 w-3/4">
                        <input
                          type="number"
                          {...register("target_amount")}
                          className={`bg-gray-50 border-2 
                                             ${
                                               errors?.target_amount
                                                 ? "border-red-500 "
                                                 : "border-[#737373]"
                                             } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1`}
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
                    ) : (
                      <div className="text-md  font-normal text-gray-600  break-all flex-wrap">
                        {updatedTargetAmount ? (
                          <span>{updatedTargetAmount}</span>
                        ) : (
                          <span className="flex items-center">
                            {noDataPresentSvg}
                            Data Not Available
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col mb-4 md:mb-6 md:pl-0 pl-4">
                  <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">
                    Valuation :
                  </h2>
                  <div className="flex space-x-2 items-center  flex-row ml-3">
                    <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                    <div className="text-md  font-normal text-gray-600  break-all flex-wrap">
                      {snsGrants ? (
                        <span>{snsGrants}</span>
                      ) : (
                        <span className="flex items-center">
                          {noDataPresentSvg}
                          Data Not Available
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2 items-center  flex-row ml-3">
                    <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                    {watch("money_raising") === "true" && editMode ? (
                      <div className="flex flex-col mt-1 w-3/4">
                        <input
                          type="number"
                          {...register("valuation")}
                          className={`bg-gray-50 border-2 
                                             ${
                                               errors?.valuation
                                                 ? "border-red-500 "
                                                 : "border-[#737373]"
                                             } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1`}
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
                    ) : (
                      <div className="text-md  font-normal text-gray-600  break-all flex-wrap">
                        {updatedSnsGrants ? (
                          <span>{updatedSnsGrants}</span>
                        ) : (
                          <span className="flex items-center">
                            {noDataPresentSvg}
                            Data Not Available
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col mb-4 md:mb-6 md:pl-0 pl-4">
                  <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">
                    What type of profile are you referring to?
                  </h2>
                  <div className="flex space-x-2 items-center  flex-row ml-3">
                    <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                    <div className="text-md  font-normal text-gray-600  break-all flex-wrap">
                      {orignalData?.type_of_profile ? (
                        <span>{orignalData?.type_of_profile}</span>
                      ) : (
                        <span className="flex items-center">
                          {noDataPresentSvg}
                          Data Not Available
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2 items-center flex-row ml-3">
                    <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                    {editMode ? (
                      <div className="flex flex-col mt-1 w-3/4">
                        <select
                          {...register("type_of_profile")}
                          defaultValue={getValues("type_of_profile")}
                          className={`bg-gray-50 border-2 ${
                            errors.type_of_profile
                              ? "border-red-500 "
                              : "border-[#737373]"
                          } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1`}
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
                        {errors.typeOfProfile && (
                          <p className="mt-1 text-sm text-red-500 font-bold text-left">
                            {errors.typeOfProfile.message}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="text-md font-normal text-gray-600 break-all flex-wrap">
                        {updatedData?.typeOfProfile ? (
                          <span>{updatedData?.typeOfProfile}</span>
                        ) : (
                          <span className="flex items-center">
                            {noDataPresentSvg}
                            Data Not Available
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {editMode ? (
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
                ) : (
                  "Update"
                )}
              </button>
            </div>
          ) : (
            ""
          )}
        </div>
      </form>
      <Toaster />
    </>
  );
};

export default UserProfileProjectUpdate;

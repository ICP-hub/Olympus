import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  numberToDate,
  uint8ArrayToBase64,
} from "../../Utils/AdminData/saga_function/blobImageToUrl";
import { projectApprovedRequest } from "../../AdminStateManagement/Redux/Reducers/projectApproved";
import { projectDeclinedRequest } from "../../AdminStateManagement/Redux/Reducers/projectDeclined";
import { Principal } from "@dfinity/principal";
import { ThreeDots } from "react-loader-spinner";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Select from 'react-select';

import {
  discordSvg,
  githubSvgBig,
  discordSvgBig,
  linkedInSvgBig,
  twitterSvgBig,
} from "../../../../../IcpAccelerator_frontend/src/components/Utils/Data/SvgData";
import {
  openWebsiteIcon,
  noDataPresentSvg,
  openchat_username,
  place,
  star,
  tick,
} from "../../Utils/AdminData/SvgData";
import pdfSvg from "../../../../assets/image/pdfimage.png";
import { useCountries } from "react-countries";
import { allHubHandlerRequest } from "../../AdminStateManagement/Redux/Reducers/All_IcpHubReducer";


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
      telegram_id:  yup.string().nullable(true).matches(/^[a-zA-Z0-9_]{5,32}$/, "Invalid Telegram ID").optional(),
      twitter_url: yup.string().nullable(true).optional().matches(/^(https?:\/\/)?(www\.)?twitter\.com\/[a-zA-Z0-9_]{1,15}$/,"Invalid Twitter URL"),
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
          (value) => !value || value.trim().split(/\s+/).filter(Boolean).length <= 50
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
          (value) => !value || value.trim().split(/\s+/).filter(Boolean).length <= 50
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
        project_discord: yup.string()
        .nullable(true)
        .optional()
        .matches(
          /^(https?:\/\/)?(www\.)?(discord\.(gg|com)\/(invite\/)?[a-zA-Z0-9\-_]+|discordapp\.com\/invite\/[a-zA-Z0-9\-_]+)$/,
          "Invalid Discord URL"
        ),
        project_linkedin: yup.string()
        .nullable(true)
        .optional()
        .matches(
          /^(https?:\/\/)?(www\.)?linkedin\.com\/(in\/[a-zA-Z0-9_-]+|company\/[a-zA-Z0-9_-]+|groups\/[a-zA-Z0-9_-]+)$/,
          "Invalid LinkedIn URL"
        ),
        github_link: yup.string()
        .nullable(true)
        .optional()
        .matches(
          /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_\-]+(\/[a-zA-Z0-9_\-]+)?(\/)?$/
          ,
          "Invalid GitHub URL"
        ),
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


const ProjectUpdate = () => {
  const { countries } = useCountries();

  const actor = useSelector((currState) => currState.actors.actor);

  const [orignalData, setOrignalData] = useState(null);
  const [updatedData, setUpdatedData] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [percent, setPercent] = useState(0);
  const [current, setCurrent] = useState("user");
  const [isAccepting, setIsAccepting] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);
  const [userData, setUserData] = useState([]);
  const [showOriginalCover, setShowOriginalCover] = useState(true);
  const [showOriginalLogo, setShowOriginalLogo] = useState(true);
  const [showOriginalProfile, setShowOriginalProfile] = useState(true);
  const [editMode, setEditMode] = useState(false);
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
  const getAllIcpHubs = useSelector((currState) => currState.hubs.allHubs);

  const tm = useRef(null);
  const percentage = 0;
  const [currentStep, setCurrentStep] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  // const projectData = location.state?.projectData;

  // console.log("userdata =>>>>>>> ", orignalData);
  // console.log("Allrole =>>>>>>> ", Allrole);
  // console.log("principal =>>>>>>> ", principal);

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

  // const [selectedTypeOfProfile, setSelectedTypeOfProfile] = useState(
  //   watch("type_of_profile")
  // );

  // Add Private Docs

  // const {
  //   fields: fieldsPrivate,
  //   append: appendPrivate,
  //   remove: removePrivate,
  // } = useFieldArray({
  //   control,
  //   name: "privateDocs",
  // });

  // const uploadPrivateDocuments = watch("upload_private_documents");
  // React.useEffect(() => {
  //   if (uploadPrivateDocuments === "true" && fieldsPrivate.length === 0) {
  //     appendPrivate({ title: "", link: "" });
  //   } else if (uploadPrivateDocuments === "false") {
  //     removePrivate({title: "", link: ""})
  //   }
  // }, [
  //   uploadPrivateDocuments,
  //   appendPrivate,
  //   removePrivate,
  //   fieldsPrivate.length,
  // ]);

  // const { fields, append, remove } = useFieldArray({
  //   control,
  //   name: "publicDocs",
  // });

  // const uploadPublicDocuments = watch("upload_public_documents");

  // React.useEffect(() => {
  //   if (uploadPublicDocuments === "true" && fields.length === 0) {
  //     append({ title: "", link: "" });
  //   } else if (uploadPublicDocuments === "false") {
  //      remove({ title: "", link: ""})
  //   }
  // }, [uploadPublicDocuments, append, remove, fields.length]);

  // const removePublic = (index) => {
  //   if (index === 0){
  //     setValue('upload_public_documents','false')
  //     remove(index)
  //   }
  //   else{
  //   remove(index);
  //   }
  // };
  // const handleremovePrivate = (index) => {
  //   if (index === 0){
  //     setValue('upload_private_documents','false')
  //     removePrivate(index)
  //   }
  //   else{
  //     removePrivate(index);
  //   }
  // };
  
 
 
  // const imageCreationFunc = async (file) => {
  //   const result = await trigger("image");
  //   if (result) {
  //     try {
  //       const compressedFile = await CompressedImage(file);
  //       const reader = new FileReader();
  //       reader.onloadend = () => {
  //         setImagePreview(reader.result);
  //       };
  //       reader.readAsDataURL(compressedFile);
  //       const byteArray = await compressedFile.arrayBuffer();
  //       // console.log("byteArray Image ==>", byteArray);
  //       setImageData(Array.from(new Uint8Array(byteArray)));
  //     } catch (error) {
  //       setError("image", {
  //         type: "manual",
  //         message: "Could not process image, please try another.",
  //       });
  //     }
  //   } else {
  //     console.log("ERROR--imageCreationFunc-file", file);
  //   }
  // };

  
  // const logoCreationFunc = async (file) => {
  //   const result = await trigger("logo");
  //   if (result) {
  //     try {
  //       const compressedFile = await CompressedImage(file);
  //       const reader = new FileReader();
  //       reader.onloadend = () => {
  //         setLogoPreview(reader.result);
  //       };
  //       reader.onerror = (error) => {
  //         console.error("FileReader error: ", error);
  //         setError("logo", {
  //           type: "manual",
  //           message: "Failed to load the compressed logo.",
  //         });
  //       };
  //       reader.readAsDataURL(compressedFile);

  //       const byteArray = new Uint8Array(await compressedFile.arrayBuffer());
  //       setLogoData(byteArray);
  //     } catch (error) {
  //       setError("logo", {
  //         type: "manual",
  //         message: "Could not process logo, please try another.",
  //       });
  //     }
  //   } else {
  //     console.log("ERROR--logoCreationFunc-file", file);
  //   }
  // };


  // const coverCreationFunc = async (file) => {
  //   const result = await trigger("cover");
  //   if (result) {
  //     try {
  //       const compressedFile = await CompressedImage(file);
  //       const reader = new FileReader();
  //       reader.onloadend = () => {
  //         setCoverPreview(reader.result);
  //       };
  //       reader.onerror = (error) => {
  //         console.error("FileReader error: ", error);
  //         setError("cover", {
  //           type: "manual",
  //           message: "Failed to load the compressed cover.",
  //         });
  //       };
  //       reader.readAsDataURL(compressedFile);

  //       const byteArray = new Uint8Array(await compressedFile.arrayBuffer());
  //       setCoverData(byteArray);
  //     } catch (error) {
  //       setError("cover", {
  //         type: "manual",
  //         message: "Could not process cover, please try another.",
  //       });
  //     }
  //   } else {
  //     console.log("ERROR--coverCreationFunc-file", file);
  //   }
  // };

  // const clearImageFunc = (val) => {
  //   let field_id = val;
  //   setValue(field_id, null);
  //   clearErrors(field_id);
  //   setImageData(null);
  //   setImagePreview(null);
  // };

  // const clearLogoFunc = (value) => {
  //   let fields_id = value;
  //   setValue(fields_id, null);
  //   clearErrors(fields_id);
  //   setLogoData(null);
  //   setLogoPreview(null);
  // };

  // const clearCoverFunc = (values) => {
  //   let field_ids = val;
  //   setValue(field_ids, null);
  //   clearErrors(field_ids);
  //   setCoverData(null);
  //   setCoverPreview(null);
  // };


  

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const data = await actor.project_update_awaiting_approval();
        console.log("Received data from actor:", data);
        if (
          data &&
          data.length > 0 &&
          data[0].length > 1 &&
          data[0][1].original_info
        ) {
          const originalInfo = data[0][1].original_info;
          const updatedInfo = data[0][1].updated_info;

          console.log("Original Info:", originalInfo);
          console.log("updated Info:", updatedInfo);

          setOrignalData({
            projectName: originalInfo?.project_name || "No Name",
            projectLogo:
              originalInfo?.project_logo.length > 0
                ? uint8ArrayToBase64(originalInfo.project_logo)
                : null,
            projectCover:
              originalInfo?.project_cover.length > 0
                ? uint8ArrayToBase64(originalInfo.project_cover)
                : null,
            projectDescription:
              originalInfo?.project_description?.[0] || "No Description",
            projectWebsite: originalInfo?.project_website?.[0],
            projectDiscord: originalInfo?.project_discord?.[0],
            projectLinkedin: originalInfo?.project_linkedin?.[0],
            projectTwitter: originalInfo?.project_twitter?.[0],
            dappLink: originalInfo?.dapp_link?.[0],
            privateDocs: originalInfo?.private_docs?.[0] || [],
            publicDocs: originalInfo?.public_docs?.[0] || [],
            countryOfRegistration: originalInfo?.country_of_registration?.[0],
            promotionalVideo: originalInfo?.promotional_video?.[0],
            tokenEconomics: originalInfo?.token_economics?.[0],
            projectTeams: originalInfo?.project_team?.[0],
            technicalDocs: originalInfo?.technical_docs?.[0] || [],
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
              originalInfo?.user_data.profile_picture[0].length > 0
                ? uint8ArrayToBase64(originalInfo.user_data.profile_picture[0])
                : null,
            openchatUsername: originalInfo?.user_data.openchat_username?.[0],
          });

          setUpdatedData({
            projectName: updatedInfo?.project_name || "No Name",
            projectLogo:
              updatedInfo?.project_logo.length > 0
                ? uint8ArrayToBase64(updatedInfo.project_logo)
                : null,
            projectCover:
              updatedInfo?.project_cover.length > 0
                ? uint8ArrayToBase64(updatedInfo.project_cover)
                : null,
            projectDescription:
              updatedInfo?.project_description?.[0] || "No Description",
            projectWebsite: updatedInfo?.project_website?.[0],
            projectDiscord: updatedInfo?.project_discord?.[0],
            projectLinkedin: updatedInfo?.project_linkedin?.[0],
            projectTwitter: updatedInfo?.project_twitter?.[0],
            dappLink: updatedInfo?.dapp_link?.[0],
            privateDocs: updatedInfo?.private_docs?.[0] || [],
            publicDocs: updatedInfo?.public_docs?.[0] || [],
            countryOfRegistration: updatedInfo?.country_of_registration?.[0],
            promotionalVideo: updatedInfo?.promotional_video?.[0],
            tokenEconomics: updatedInfo?.token_economics?.[0],
            projectTeams: updatedInfo?.project_team?.[0],
            technicalDocs: updatedInfo?.technical_docs?.[0] || [],
            githubLink: updatedInfo?.github_link?.[0] || [],
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
              updatedInfo?.user_data.profile_picture[0].length > 0
                ? uint8ArrayToBase64(updatedInfo.user_data.profile_picture[0])
                : null,
            openchatUsername: updatedInfo?.user_data.openchat_username?.[0],
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

  function compareValues(key) {
    if (JSON.stringify(orignalData[key]) === JSON.stringify(updatedData[key])) {
      return "text-green-500"; // Data matches, use green
    } else {
      return "text-red-500"; // Data differs, use red
    }
  }

  const [sliderValuesProgress, setSliderValuesProgress] = useState({
    Team: 0,
    ProblemAndVision: 0,
    ValueProp: 0,
    Product: 0,
    Market: 0,
    BusinessModel: 0,

    Scale: 0,
    Exit: 0,
  });
  const [sliderValues, setSliderValues] = useState({
    Team: 0,
    ProblemAndVision: 0,
    ValueProp: 0,
    Product: 0,
    Market: 0,
    BusinessModel: 0,
    Scale: 0,
    Exit: 0,
  });
  // const sliderKeys = [
  //   "Team",
  //   "ProblemAndVision",
  //   "ValueProp",
  //   "Product",
  //   "Market",
  //   "BusinessModel",
  //   "Scale",
  //   "Exit",
  // ];
  //   const customStyles = `
  //   .slider-mark::after {
  //     content: attr(data-label);
  //     position: absolute;
  //     top: -2rem;
  //     left: 50%;
  //     transform: translateX(-50%);
  //     text-align: center;
  //     white-space: nowrap;
  //     font-size: 0.75rem;
  //     color: #fff;
  //     padding: 0.2rem 0.4rem;
  //     border-radius: 0.25rem;
  //   }
  // `;

  // const handleSliderChange = (index, value) => {
  //   const key = sliderKeys[index];
  //   const newSliderValues = { ...sliderValues, [key]: value };
  //   setSliderValues(newSliderValues);
  //   const newSliderValuesProgress = {
  //     ...sliderValuesProgress,
  //     [key]: value === 9 ? 100 : Math.floor((value / 9) * 100),
  //   };
  //   setSliderValuesProgress(newSliderValuesProgress);
  // };


  useEffect(()=>{
    if(actor){
    dispatch(allHubHandlerRequest())
    }
  },[actor])

  const increase = () => {
    setPercent((prevPercent) => {
      if (prevPercent >= 100) {
        clearTimeout(tm.current);
        return 100; // Ensure we don't exceed 100%
      }
      return prevPercent + 1;
    });
  };

  useEffect(() => {
    if (percent < 100) {
      tm.current = setTimeout(increase, 10);
    }
    return () => clearTimeout(tm.current);
  }, [percent]);
  useEffect(() => {
    if (percent < 100) {
      tm.current = setTimeout(increase, 10);
    }
    return () => clearTimeout(tm.current);
  }, [percent]);

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
            await actor.decline_project_profile_update_request(covertedPrincipal);
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
      // switch (category) {
      //   case "project":
      //     if (state === "Pending") {
            await actor.approve_project_update(covertedPrincipal);
            await dispatch(projectApprovedRequest());
        //   }
        //   break;
        // default:
          console.warn("Unhandled category:", category);
      
    } catch (error) {
      console.error("Error processing request:", error);
    } finally {
      setIsAccepting(false);
      window.location.reload();
    }
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

  const handleUpdatedDataChange = (field, value) => {
    setUpdatedData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  return (
    // <form onSubmit={handleSubmit(onSubmit)}>
    <div className="w-full px-[4%] py-[4%]">
      <div className="w-full flex gap-4  md:flex-row flex-col mt-4">
        <div className=" bg-[#D2D5F2]  shadow-md shadow-gray-400 p-6 rounded-lg md:w-1/4 w-full">
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
          <div className="flex flex-col ml-4  mt-2 w-auto justify-start md:mb-0 mb-6">
            <div className="flex flex-row  gap-4 items-center">
              <h1 className="md:text-3xl text-xl md:font-extrabold font-bold  bg-black text-transparent bg-clip-text">
                {orignalData.userFullName}
              </h1>
            </div>
            <p className="text-gray-500 md:text-md text-sm font-normal flex mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className="size-4 "
                fill="currentColor"
              >
                <path d="M256 64C150 64 64 150 64 256s86 192 192 192c17.7 0 32 14.3 32 32s-14.3 32-32 32C114.6 512 0 397.4 0 256S114.6 0 256 0S512 114.6 512 256v32c0 53-43 96-96 96c-29.3 0-55.6-13.2-73.2-33.9C320 371.1 289.5 384 256 384c-70.7 0-128-57.3-128-128s57.3-128 128-128c27.9 0 53.7 8.9 74.7 24.1c5.7-5 13.1-8.1 21.3-8.1c17.7 0 32 14.3 32 32v80 32c0 17.7 14.3 32 32 32s32-14.3 32-32V256c0-106-86-192-192-192zm64 192a64 64 0 1 0 -128 0 64 64 0 1 0 128 0z" />
              </svg>
              <span className="ml-2 truncate">{orignalData.userEmail}</span>
            </p>
            <div className="flex flex-col items-start gap-3 text-sm">
              <div className="flex flex-row  text-gray-600 space-x-2">
                {place}
                <p className="underline ">{orignalData?.userCountry}</p>
              </div>
              <div className=" flex flex-row space-x-2 text-gray-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  className="size-4"
                  fill="currentColor"
                >
                  <path d="M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H64C28.7 64 0 92.7 0 128v16 48V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V192 144 128c0-35.3-28.7-64-64-64H344V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H152V24zM48 192H400V448c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192z" />
                </svg>
                <p className="ml-2">{date}</p>
              </div>
              <div className="flex flex-row space-x-2 text-gray-600">
                <img
                  src={openchat_username}
                  alt="openchat_username"
                  className="size-5"
                />
                <p className="ml-2">{orignalData?.openchatUsername}</p>
              </div>
              {orignalData?.areaOfInterest && (
                <div className="flex gap-2 mt-2 text-xs items-center flex-wrap">
                  {orignalData?.areaOfInterest
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
              )}
            </div>

            {orignalData?.reasonToJoin && (
              <p className="mt-8 text-black mb-2">Reason to join</p>
            )}
            <div className="flex text-gray-700 flex-row gap-2 flex-wrap text-xs">
              {orignalData?.reasonToJoin?.map((reason, index) => (
                <p
                  key={index}
                  className="bg-[#c9c5c5] py-0.5 rounded-full px-3"
                >
                  {reason.replace(/_/g, " ")}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className=" bg-[#D2D5F2]  shadow-md shadow-gray-400 pb-6 pt-4 rounded-lg md:w-3/4 w-full">
          <div className="w-full flex flex-col  justify-around px-[4%] py-4">
            <div className="w-full flex flex-row justify-between">
              <h1 className="text-xl font-bold text-black mb-2">
                About Project
              </h1>
              <div className="flex flex-row space-x-2">
                <svg
                  onClick={() => setEditMode(false)}
                  xmlns="http://www.w3.org/2000/svg"
                  className={`dot bg-white w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-300 ease-in-out`}
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                >
                  <g fill="#B91C1C">
                    <circle cx="18" cy="12" r="2" fill="#B91C1C" />
                    <path d="M5 12l7-7v4h4v6h-4v4l-7-7z" />
                  </g>
                </svg>

                <svg
                  onClick={() => setEditMode(true)}
                  xmlns="http://www.w3.org/2000/svg"
                  className={`dot bg-white w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-300 ease-in-out`}
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                >
                  <g fill="#15803D">
                    <circle cx="6" cy="12" r="2" fill="#15803D" />
                    <path d="M19 12l-7-7v4H8v6h4v4l7-7z" />
                  </g>
                </svg>
              </div>
            </div>

            <div className="flex md:flex-row flex-col w-full mt-3 items-start">
              <div className=" md:w-[5.5rem] md:flex-shrink-0 w-full justify-start">
                <img
                  className="md:w-20 object-fill md:h-20 w-16 h-16 border border-white bg-gray-300 justify-center rounded-md"
                  src={
                    showOriginalLogo
                      ? orignalData.projectLogo
                      : updatedData.projectLogo
                  }
                  alt="projectLogo"
                />
                <label
                  htmlFor="toggle"
                  className="flex items-center cursor-pointer"
                >
                  <div className="relative">
                    <input
                      type="checkbox"
                      id="toggle"
                      className="sr-only"
                      checked={!showOriginalLogo}
                      onChange={() => setShowOriginalLogo(!showOriginalLogo)}
                    />
                    <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-300 ease-in-out">
                      {showOriginalLogo ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="24"
                          height="24"
                        >
                          <g fill="#FF6B6B">
                            <circle cx="6" cy="12" r="2" />
                            <path d="M19 12l-7-7v4H8v6h4v4l7-7z" />
                          </g>
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="24"
                          height="24"
                        >
                          <g fill="#4CAF50">
                            <circle cx="18" cy="12" r="2" />
                            <path d="M5 12l7-7v4h4v6h-4v4l-7-7z" />
                          </g>
                        </svg>
                      )}
                    </div>
                  </div>
                </label>
              </div>
              <div className="flex flex-col md:flex-grow md:w-5/6 w-full justify-start md:ml-4 md:mb-0 mb-6">
                <div className="flex flex-row  gap-4 items-center">
                  <h1 className="md:text-base md:h-[8rem] h-[12rem] flex-wrap text-sm bg-black break-all text-transparent bg-clip-text">
                    {orignalData?.projectDescription}
                  </h1>
                </div>

                <div className="border border-gray-400 w-full mt-2 mb-4 relative " />

                <div className="flex flex-col md:flex-row justify-between  items-start gap-3 text-sm w-full">
                  <div className="flex flex-col md:w-1/2 w-full">
                    <div className="flex flex-col mb-4 md:mb-6">
                      <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">
                        {" "}
                        Linkedin:
                      </h2>
                      <div className="flex space-x-2 items-center  flex-row ml-3">
                        <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                        <p className="text-[#7283EA] text-xs font-semibold md:text-sm truncate px-4">
                          {orignalData?.projectLinkedin || "Not available"}
                        </p>
                      </div>
                      <div className="flex space-x-2 items-center flex-row ml-3">
                        <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                        {editMode ? (
                          <input
                            type="text"
                            value={updatedData?.projectLinkedin || ""}
                            className="text-[#7283EA] text-xs font-semibold md:text-sm px-4"
                            onChange={(e) =>
                              handleUpdatedDataChange(
                                "projectLinkedin",
                                e.target.value
                              )
                            }
                          />
                        ) : (
                          <p className="text-[#7283EA] text-xs font-semibold md:text-sm truncate px-4">
                            {updatedData?.projectLinkedin || "Not available"}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col mb-4 md:mb-6">
                      <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">
                        Twitter:
                      </h2>
                      <div className="flex space-x-2 items-center  flex-row ml-3">
                        <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                        <p className="text-[#7283EA] text-xs font-semibold md:text-sm truncate px-4">
                          {orignalData?.projectTwitter || "Not available"}
                        </p>
                      </div>
                      <div className="flex space-x-2 items-center flex-row ml-3">
                        <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                        {editMode ? (
                          <input
                            type="text"
                            value={updatedData?.projectTwitter || ""}
                            className="text-[#7283EA] text-xs font-semibold md:text-sm px-4"
                            onChange={(e) =>
                              handleUpdatedDataChange(
                                "projectTwitter",
                                e.target.value
                              )
                            }
                          />
                        ) : (
                          <p className="text-[#7283EA] text-xs font-semibold md:text-sm truncate px-4">
                            {updatedData?.projectTwitter || "Not available"}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col mb-4 md:mb-6">
                      <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">
                        Daap Link:
                      </h2>
                      <div className="flex space-x-2 items-center  flex-row ml-3">
                        <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                        <p className="text-[#7283EA] text-xs font-semibold md:text-sm truncate px-4">
                          {orignalData?.dappLink || "Not available"}
                        </p>
                      </div>
                      <div className="flex space-x-2 items-center flex-row ml-3">
                        <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                        {editMode ? (
                          <input
                            type="text"
                            value={updatedData?.dappLink || ""}
                            className="text-[#7283EA] text-xs font-semibold md:text-sm px-4"
                            onChange={(e) =>
                              handleUpdatedDataChange(
                                "dappLink",
                                e.target.value
                              )
                            }
                          />
                        ) : (
                          <p className="text-[#7283EA] text-xs font-semibold md:text-sm truncate px-4">
                            {updatedData?.dappLink || "Not available"}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col mb-4 md:mb-6">
                      <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">
                        Project Elevator Pitch:
                      </h2>
                      <div className="flex space-x-2 items-center  flex-row ml-3">
                        <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                        <p className="text-[#7283EA] text-xs font-semibold md:text-sm truncate px-4">
                          {orignalData?.projectElevatorPitch || "Not available"}
                        </p>
                      </div>
                      <div className="flex space-x-2 items-center flex-row ml-3">
                        <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                        {editMode ? (
                          <input
                            type="text"
                            value={updatedData?.projectElevatorPitch || ""}
                            className="text-[#7283EA] text-xs font-semibold md:text-sm px-4"
                            onChange={(e) =>
                              handleUpdatedDataChange(
                                "projectElevatorPitch",
                                e.target.value
                              )
                            }
                          />
                        ) : (
                          <p className="text-[#7283EA] text-xs font-semibold md:text-sm truncate px-4">
                            {updatedData?.projectElevatorPitch ||
                              "Not available"}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col mb-4 md:mb-6">
                      <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">
                        Promotional Video:
                      </h2>
                      <div className="flex space-x-2 items-center  flex-row ml-3">
                        <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                        <p className="text-[#7283EA] text-xs font-semibold md:text-sm truncate px-4">
                          {orignalData?.promotionalVideo || "Not available"}
                        </p>
                      </div>
                      <div className="flex space-x-2 items-center flex-row ml-3">
                        <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                        {editMode ? (
                          <input
                            type="text"
                            value={updatedData?.promotionalVideo || ""}
                            className="text-[#7283EA] text-xs font-semibold md:text-sm px-4"
                            onChange={(e) =>
                              handleUpdatedDataChange(
                                "promotionalVideo",
                                e.target.value
                              )
                            }
                          />
                        ) : (
                          <p className="text-[#7283EA] text-xs font-semibold md:text-sm truncate px-4">
                            {updatedData?.promotionalVideo || "Not available"}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:w-1/2 w-full">
                    <div className="flex flex-col mb-4 md:mb-6">
                      <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">
                        Github:
                      </h2>
                      <div className="flex space-x-2 items-center  flex-row ml-3">
                        <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                        <p className="text-[#7283EA] text-xs font-semibold md:text-sm truncate px-4">
                          {orignalData?.githubLink || "Not available"}
                        </p>
                      </div>
                      <div className="flex space-x-2 items-center flex-row ml-3">
                        <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                        {editMode ? (
                          <input
                            type="text"
                            value={updatedData?.githubLink || ""}
                            className="text-[#7283EA] text-xs font-semibold md:text-sm px-4"
                            onChange={(e) =>
                              handleUpdatedDataChange(
                                "githubLink",
                                e.target.value
                              )
                            }
                          />
                        ) : (
                          <p className="text-[#7283EA] text-xs font-semibold md:text-sm truncate px-4">
                            {updatedData?.githubLink || "Not available"}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col mb-4 md:mb-6">
                      <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">
                        Discord:
                      </h2>
                      <div className="flex space-x-2 items-center  flex-row ml-3">
                        <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                        <p className="text-[#7283EA] text-xs font-semibold md:text-sm truncate px-4">
                          {orignalData?.projectDiscord || "Not available"}
                        </p>
                      </div>
                      <div className="flex space-x-2 items-center flex-row ml-3">
                        <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                        {editMode ? (
                          <input
                            type="text"
                            value={updatedData?.projectDiscord || ""}
                            className="text-[#7283EA] text-xs font-semibold md:text-sm px-4"
                            onChange={(e) =>
                              handleUpdatedDataChange(
                                "projectDiscord",
                                e.target.value
                              )
                            }
                          />
                        ) : (
                          <p className="text-[#7283EA] text-xs font-semibold md:text-sm truncate px-4">
                            {updatedData?.projectDiscord || "Not available"}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col mb-4 md:mb-6">
                      <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">
                        Website:
                      </h2>
                      <div className="flex space-x-2 items-center  flex-row ml-3">
                        <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                        <p className="text-[#7283EA] text-xs font-semibold md:text-sm truncate px-4">
                          {orignalData?.projectWebsite || "Not available"}
                        </p>
                      </div>
                      <div className="flex space-x-2 items-center flex-row ml-3">
                        <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                        {editMode ? (
                          <input
                            type="text"
                            value={updatedData?.projectWebsite || ""}
                            className="text-[#7283EA] text-xs font-semibold md:text-sm px-4"
                            onChange={(e) =>
                              handleUpdatedDataChange(
                                "projectWebsite",
                                e.target.value
                              )
                            }
                          />
                        ) : (
                          <p className="text-[#7283EA] text-xs font-semibold md:text-sm truncate px-4">
                            {updatedData?.projectWebsite || "Not available"}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col mb-4 md:mb-6">
                      <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">
                        Long Term Goal:
                      </h2>
                      <div className="flex space-x-2 items-center  flex-row ml-3">
                        <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                        <p className="text-[#7283EA] text-xs font-semibold md:text-sm truncate px-4">
                          {orignalData?.longTermGoals || "Not available"}
                        </p>
                      </div>
                      <div className="flex space-x-2 items-center flex-row ml-3">
                        <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                        {editMode ? (
                          <input
                            type="text"
                            value={updatedData?.longTermGoals || ""}
                            className="text-[#7283EA] text-xs font-semibold md:text-sm px-4"
                            onChange={(e) =>
                              handleUpdatedDataChange(
                                "longTermGoals",
                                e.target.value
                              )
                            }
                          />
                        ) : (
                          <p className="text-[#7283EA] text-xs font-semibold md:text-sm truncate px-4">
                            {updatedData?.longTermGoals || "Not available"}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col mb-4 md:mb-6">
                      <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">
                        Token Economics:
                      </h2>
                      <div className="flex space-x-2 items-center  flex-row ml-3">
                        <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                        <p className="text-[#7283EA] text-xs font-semibold md:text-sm truncate px-4">
                          {orignalData?.tokenEconomics || "Not available"}
                        </p>
                      </div>
                      <div className="flex space-x-2 items-center flex-row ml-3">
                        <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                        {editMode ? (
                          <input
                            type="text"
                            value={updatedData?.tokenEconomics || ""}
                            className="text-[#7283EA] text-xs font-semibold md:text-sm px-4"
                            onChange={(e) =>
                              handleUpdatedDataChange(
                                "tokenEconomics",
                                e.target.value
                              )
                            }
                          />
                        ) : (
                          <p className="text-[#7283EA] text-xs font-semibold md:text-sm truncate px-4">
                            {updatedData?.tokenEconomics || "Not available"}
                          </p>
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
                    <p className="flex justify-center items-center text-white p-2 text-sm">
                      {constructMessage(role)}
                    </p>
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
            <h1 className="text-xl font-bold text-gray-800  mb-2">
              Private Documents
            </h1>
            <div className="flex flex-row gap-2  px-2 py-1 items-center">
              <img src={pdfSvg} alt="PDF Icon" className="w-10 h-12" />
              <div className="overflow-hidden">
                <div className="space-y-4 w-full">
                  {orignalData?.privateDocs.map((doc, index) => (
                    <div
                      key={index}
                      className="truncate flex flex-col items-start"
                    >
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
                        <p className="text-gray-600 text-sm mt-2 break-words">
                          <a
                            href={doc.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline"
                          >
                            CLICK HERE
                          </a>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className=" bg-[#D2D5F2] flex h-[310px] overflow-y-auto   flex-col shadow-md shadow-gray-400 p-6 rounded-lg  w-full mb-4">
            <h1 className="text-xl font-bold text-gray-800  mb-2">
              Public Documents
            </h1>
            <div className="flex flex-row gap-2  px-2 py-1 items-center">
              <img src={pdfSvg} alt="PDF Icon" className="w-10 h-12" />
              <div className="overflow-hidden">
                <div className="space-y-4 w-full">
                  {orignalData?.publicDocs.map((doc, index) => (
                    <div
                      key={index}
                      className="truncate flex flex-col items-start"
                    >
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
                        <p className="text-gray-600 text-sm mt-2 break-words">
                          <a
                            href={doc.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline"
                          >
                            CLICK HERE
                          </a>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className=" bg-[#D2D5F2] md:px-[4%] flex md:flex-row flex-col shadow-md shadow-gray-400 pb-6 pt-4 rounded-lg md:w-3/4 w-full">
          <div className="flex flex-col md:w-1/2 w-full">
            <div className="flex flex-col mb-4 md:mb-6 md:pl-0 pl-4">
              <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">
                Country of Registration:
              </h2>
              <div className="flex space-x-2 items-center  flex-row ml-3">
                <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                <p className="text-md  font-normal text-gray-600  break-all flex-wrap">
                  {orignalData?.countryOfRegistration ? (
                    <span>{orignalData?.countryOfRegistration}</span>
                  ) : (
                    <span className="flex items-center">
                      {noDataPresentSvg}
                      Data Not Available
                    </span>
                  )}
                </p>
              </div>
              <div className="flex space-x-2 items-center flex-row ml-3">
  <span className="w-2 h-2 bg-green-700 rounded-full"></span>
  {editMode ? (
    <select
      value={updatedData?.countryOfRegistration || ""}
      onChange={(e) => handleUpdatedDataChange("countryOfRegistration", e.target.value)}
      className="bg-gray-50 border-2 border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
    >
      <option disabled value="">Select your country</option>
      {countries?.map((country) => (
        <option key={country.name} value={country.name}>
          {country.name}
        </option>
      ))}
    </select>
  ) : (
    <p className="text-md font-normal text-gray-600 break-all flex-wrap">
      {updatedData?.countryOfRegistration ? (
        <span>{updatedData?.countryOfRegistration}</span>
      ) : (
        <span className="flex items-center">
          {noDataPresentSvg}
          Data Not Available
        </span>
      )}
    </p>
  )}
</div>

            </div>

            <div className="flex flex-col mb-4 md:mb-6 md:pl-0 pl-4">
              <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">
                Uploaded Private Docs :
              </h2>
              <div className="flex space-x-2 items-center  flex-row ml-3">
                <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                <p className="text-md  font-normal text-gray-600  break-all flex-wrap">
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
                </p>
              </div>
              <div className="flex space-x-2 items-center flex-row ml-3">
                <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                {editMode ? (
                  <input
                    type="checkbox"
                    checked={updatedData?.uploadPrivateDocuments === "Yes"}
                    onChange={(e) =>
                      handleUpdatedDataChange(
                        "uploadPrivateDocuments",
                        e.target.checked ? "Yes" : "No"
                      )
                    }
                    className="text-md font-normal text-gray-600 break-all flex-wrap"
                  />
                ) : (
                  <p className="text-md font-normal text-gray-600 break-all flex-wrap">
                    {updatedData?.uploadPrivateDocuments ? (
                      <span>{updatedData?.uploadPrivateDocuments}</span>
                    ) : (
                      <span className="flex items-center">
                        {noDataPresentSvg}
                        Data Not Available
                      </span>
                    )}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col mb-4 md:mb-6 md:pl-0 pl-4">
              <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">
                Money Raised Till Now :
              </h2>
              <div className="flex space-x-2 items-center  flex-row ml-3">
                <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                <p className="text-md  font-normal text-gray-600  break-all flex-wrap">
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
                </p>
              </div>
              <div className="flex space-x-2 items-center  flex-row ml-3">
                <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                <p className="text-md  font-normal text-gray-600  break-all flex-wrap">
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
                </p>
              </div>
            </div>

            <div className="flex flex-col mb-4 md:mb-6 md:pl-0 pl-4">
              <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">
                Project Area Of Focus :
              </h2>
              <div className="flex space-x-2 items-center  flex-row ml-3">
                <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                <p className="text-md  font-normal text-gray-600  break-all flex-wrap">
                  {orignalData?.projectAreaOfFocus ? (
                    <span>{orignalData?.projectAreaOfFocus}</span>
                  ) : (
                    <span className="flex items-center">
                      {noDataPresentSvg}
                      Data Not Available
                    </span>
                  )}
                </p>
              </div>
              <div className="flex space-x-2 items-center  flex-row ml-3">
                <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                <p className="text-md  font-normal text-gray-600  break-all flex-wrap">
                  {updatedData?.projectAreaOfFocus ? (
                    <span>{updatedData?.projectAreaOfFocus}</span>
                  ) : (
                    <span className="flex items-center">
                      {noDataPresentSvg}
                      Data Not Available
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex flex-col mb-4 md:mb-6 md:pl-0 pl-4">
              <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">
                Area Of Interest :
              </h2>
              <div className="flex space-x-2 items-center  flex-row ml-3">
                <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                <p className="text-md  font-normal text-gray-600  break-all flex-wrap">
                  {orignalData?.areaOfInterest ? (
                    <span>{orignalData?.areaOfInterest}</span>
                  ) : (
                    <span className="flex items-center">
                      {noDataPresentSvg}
                      Data Not Available
                    </span>
                  )}
                </p>
              </div>
              <div className="flex space-x-2 items-center  flex-row ml-3">
                <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                <p className="text-md  font-normal text-gray-600  break-all flex-wrap">
                  {updatedData?.areaOfInterest ? (
                    <span>{updatedData?.areaOfInterest}</span>
                  ) : (
                    <span className="flex items-center">
                      {noDataPresentSvg}
                      Data Not Available
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex flex-col mb-4 md:mb-6 md:pl-0 pl-4">
              <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">
                Live On Mainnet :
              </h2>
              <div className="flex space-x-2 items-center  flex-row ml-3">
                <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                <p className="text-md  font-normal text-gray-600  break-all flex-wrap">
                  {orignalData?.liveOnIcpMainnet ? (
                    "Yes"
                  ) : "No" ? (
                    <span>{orignalData?.liveOnIcpMainnet ? "Yes" : "No"}</span>
                  ) : (
                    <span className="flex items-center">
                      {noDataPresentSvg}
                      Data Not Available
                    </span>
                  )}
                </p>
              </div>
              <div className="flex space-x-2 items-center flex-row ml-3">
  <span className="w-2 h-2 bg-green-700 rounded-full"></span>
  {editMode ? (
    <>
      <select
        {...register("live_on_icp_mainnet")}
        value={updatedData?.liveOnIcpMainnet || "false"}
        onChange={(e) => handleUpdatedDataChange("liveOnIcpMainnet", e.target.value)}
        className={`bg-gray-50 border-2 ${
          errors.live_on_icp_mainnet ? "border-red-500" : "border-[#737373]"
        } text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
      >
        <option className="text-md" value="false">No</option>
        <option className="text-md" value="true">Yes</option>
      </select>
      {errors.live_on_icp_mainnet && (
        <p className="mt-1 text-sm text-red-500 font-bold">{errors.live_on_icp_mainnet.message}</p>
      )}
      {watch("live_on_icp_mainnet") === "true" && (
        <>
          <input
            type="text"
            {...register("dapp_link")}
            placeholder="Enter your dApp Link"
            className={`bg-gray-50 border-2 ${
              errors.dapp_link ? "border-red-500" : "border-[#737373]"
            } text-gray-900 placeholder-gray-500 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
          />
          {errors.dapp_link && (
            <p className="mt-1 text-sm text-red-500 font-bold">{errors.dapp_link.message}</p>
          )}
          <input
            type="number"
            {...register("weekly_active_users")}
            placeholder="Enter Weekly active users"
            className={`bg-gray-50 border-2 ${
              errors.weekly_active_users ? "border-red-500" : "border-[#737373]"
            } text-gray-900 placeholder-gray-500 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
            onWheel={(e) => e.target.blur()}
            min={0}
          />
          {errors.weekly_active_users && (
            <p className="mt-1 text-sm text-red-500 font-bold">{errors.weekly_active_users.message}</p>
          )}
          <input
            type="number"
            {...register("revenue")}
            placeholder="Enter Revenue (in Million USD)"
            className={`bg-gray-50 border-2 ${
              errors.revenue ? "border-red-500" : "border-[#737373]"
            } text-gray-900 placeholder-gray-500 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
            onWheel={(e) => e.target.blur()}
            min={0}
          />
          {errors.revenue && (
            <p className="mt-1 text-sm text-red-500 font-bold">{errors.revenue.message}</p>
          )}
        </>
      )}
    </>
  ) : (
    <p className="text-md font-normal text-gray-600 break-all flex-wrap">
      {updatedData?.liveOnIcpMainnet ? (
        <span>{updatedData?.liveOnIcpMainnet === "true" ? "Yes" : "No"}</span>
      ) : (
        <span className="flex items-center">
          {noDataPresentSvg}
          Data Not Available
        </span>
      )}
    </p>
  )}
</div>

            </div>

            <div className="flex flex-col mb-4 md:mb-6 md:pl-0 pl-4">
              <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">
                Type of Registration :
              </h2>
              <div className="flex space-x-2 items-center  flex-row ml-3">
                <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                <p className="text-md  font-normal text-gray-600  break-all flex-wrap">
                  {orignalData?.typeOfRegistration ? (
                    <span>{orignalData?.typeOfRegistration}</span>
                  ) : (
                    <span className="flex items-center">
                      {noDataPresentSvg}
                      Data Not Available
                    </span>
                  )}
                </p>
              </div>
              <div className="flex space-x-2 items-center  flex-row ml-3">
                <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                <p className="text-md  font-normal text-gray-600  break-all flex-wrap">
                  {updatedData?.typeOfRegistration ? (
                    <span>{updatedData?.typeOfRegistration}</span>
                  ) : (
                    <span className="flex items-center">
                      {noDataPresentSvg}
                      Data Not Available
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex flex-col mb-4 md:mb-6 md:pl-0 pl-4">
              <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">
                Reason to join Incubator :
              </h2>
              <div className="flex space-x-2 items-center  flex-row ml-3">
                <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                <p className="text-md  font-normal text-gray-600  break-all flex-wrap">
                  {orignalData?.reasonToJoinIncubator ? (
                    <span>{orignalData?.reasonToJoinIncubator}</span>
                  ) : (
                    <span className="flex items-center">
                      {noDataPresentSvg}
                      Data Not Available
                    </span>
                  )}
                </p>
              </div>
              <div className="flex space-x-2 items-center  flex-row ml-3">
                <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                <p className="text-md  font-normal text-gray-600  break-all flex-wrap">
                  {updatedData?.reasonToJoinIncubator ? (
                    <span>{updatedData?.reasonToJoinIncubator}</span>
                  ) : (
                    <span className="flex items-center">
                      {noDataPresentSvg}
                      Data Not Available
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex flex-col mb-4 md:mb-6 md:pl-0 pl-4">
              <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">
                Revenue:
              </h2>
              <div className="flex space-x-2 items-center  flex-row ml-3">
                <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                <p className="text-md  font-normal text-gray-600  break-all flex-wrap">
                  {revenueNum ? (
                    <span>{revenueNum}</span>
                  ) : (
                    <span className="flex items-center">
                      {noDataPresentSvg}
                      Data Not Available
                    </span>
                  )}
                </p>
              </div>
              <div className="flex space-x-2 items-center  flex-row ml-3">
                <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                <p className="text-md  font-normal text-gray-600  break-all flex-wrap">
                  {updatedRevenueNum ? (
                    <span>{updatedRevenueNum}</span>
                  ) : (
                    <span className="flex items-center">
                      {noDataPresentSvg}
                      Data Not Available
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex flex-col mb-4 md:mb-6 md:pl-0 pl-4">
              <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">
                ICP Grants:
              </h2>
              <div className="flex space-x-2 items-center  flex-row ml-3">
                <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                <p className="text-md  font-normal text-gray-600  break-all flex-wrap">
                  {icpGrants ? (
                    <span>{icpGrants}</span>
                  ) : (
                    <span className="flex items-center">
                      {noDataPresentSvg}
                      Data Not Available
                    </span>
                  )}
                </p>
              </div>
              <div className="flex space-x-2 items-center  flex-row ml-3">
                <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                <p className="text-md  font-normal text-gray-600  break-all flex-wrap">
                  {updatedIcpGrants ? (
                    <span>{updatedIcpGrants}</span>
                  ) : (
                    <span className="flex items-center">
                      {noDataPresentSvg}
                      Data Not Available
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex flex-col mb-4 md:mb-6 md:pl-0 pl-4">
              <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">
                Investors :
              </h2>
              <div className="flex space-x-2 items-center  flex-row ml-3">
                <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                <p className="text-md  font-normal text-gray-600  break-all flex-wrap">
                  {investorInvest ? (
                    <span>{investorInvest}</span>
                  ) : (
                    <span className="flex items-center">
                      {noDataPresentSvg}
                      Data Not Available
                    </span>
                  )}
                </p>
              </div>
              <div className="flex space-x-2 items-center  flex-row ml-3">
                <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                <p className="text-md  font-normal text-gray-600  break-all flex-wrap">
                  {updatedInvestorInvest ? (
                    <span>{updatedInvestorInvest}</span>
                  ) : (
                    <span className="flex items-center">
                      {noDataPresentSvg}
                      Data Not Available
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:w-1/2 w-full">
            <div className="flex flex-col mb-4 md:mb-6 md:pl-0 pl-4">
              <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">
                Project Registered :
              </h2>
              <div className="flex space-x-2 items-center  flex-row ml-3">
                <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                <p className="text-md  font-normal text-gray-600  break-all flex-wrap">
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
                </p>
              </div>
              <div className="flex space-x-2 items-center  flex-row ml-3">
                <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                <p className="text-md  font-normal text-gray-600  break-all flex-wrap">
                  {updatedData?.isYourProjectRegistered ? (
                    "Yes"
                  ) : "No" ? (
                    <span>
                      {updatedData?.isYourProjectRegistered ? "Yes" : "No"}
                    </span>
                  ) : (
                    <span className="flex items-center">
                      {noDataPresentSvg}
                      Data Not Available
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex flex-col mb-4 md:mb-6 md:pl-0 pl-4">
              <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">
                Support Multichain :
              </h2>
              <div className="flex space-x-2 items-center  flex-row ml-3">
                <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                <p className="text-md  font-normal text-gray-600  break-all flex-wrap">
                  {orignalData?.supportsMultichain ? (
                    <span>{orignalData?.supportsMultichain}</span>
                  ) : (
                    <span className="flex items-center">
                      {noDataPresentSvg}
                      Data Not Available
                    </span>
                  )}
                </p>
              </div>
              <div className="flex space-x-2 items-center  flex-row ml-3">
                <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                <p className="text-md  font-normal text-gray-600  break-all flex-wrap">
                  {updatedData?.supportsMultichain ? (
                    <span>{updatedData?.supportsMultichain}</span>
                  ) : (
                    <span className="flex items-center">
                      {noDataPresentSvg}
                      Data Not Available
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex flex-col mb-4 md:mb-6 md:pl-0 pl-4">
              <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">
                Preferred ICP Hub :
              </h2>
              <div className="flex space-x-2 items-center  flex-row ml-3">
                <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                <p className="text-md  font-normal text-gray-600  break-all flex-wrap">
                  {orignalData?.preferredIcpHub ? (
                    <span>{orignalData?.preferredIcpHub}</span>
                  ) : (
                    <span className="flex items-center">
                      {noDataPresentSvg}
                      Data Not Available
                    </span>
                  )}
                </p>
              </div>
              <div className="flex space-x-2 items-center flex-row ml-3">
  <span className="w-2 h-2 bg-green-700 rounded-full"></span>
  {editMode ? (
    <select
      value={updatedData?.preferredIcpHub || ""}
      onChange={(e) => handleUpdatedDataChange("preferredIcpHub", e.target.value)}
      className="bg-gray-50 border-2 border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
    >
      <option value="">Select your ICP Hub</option>
      {getAllIcpHubs?.map((hub) => (
        <option key={hub.id} value={`${hub.name}, ${hub.region}`}>
          {hub.name}, {hub.region}
        </option>
      ))}
    </select>
  ) : (
    <p className="text-md font-normal text-gray-600 break-all flex-wrap">
      {updatedData?.preferredIcpHub ? (
        <span>{updatedData?.preferredIcpHub}</span>
      ) : (
        <span className="flex items-center">
          {noDataPresentSvg}
          Data Not Available
        </span>
      )}
    </p>
  )}
</div>

            </div>
            <div className="flex flex-col mb-4 md:mb-6 md:pl-0 pl-4">
              <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">
                Mentor Assigned :
              </h2>
              <div className="flex space-x-2 items-center  flex-row ml-3">
                <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                <p className="text-md  font-normal text-gray-600  break-all flex-wrap">
                  {orignalData?.mentorsAssigned ? (
                    <span>{orignalData?.mentorsAssigned}</span>
                  ) : (
                    <span className="flex items-center">
                      {noDataPresentSvg}
                      Data Not Available
                    </span>
                  )}
                </p>
              </div>
              <div className="flex space-x-2 items-center  flex-row ml-3">
                <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                <p className="text-md  font-normal text-gray-600  break-all flex-wrap">
                  {updatedData?.mentorsAssigned ? (
                    <span>{updatedData?.mentorsAssigned}</span>
                  ) : (
                    <span className="flex items-center">
                      {noDataPresentSvg}
                      Data Not Available
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex flex-col mb-4 md:mb-6 md:pl-0 pl-4">
              <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">
                Project Team :
              </h2>
              <div className="flex space-x-2 items-center  flex-row ml-3">
                <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                <p className="text-md  font-normal text-gray-600  break-all flex-wrap">
                  {orignalData?.projectTeams ? (
                    "Yes"
                  ) : "No" ? (
                    <span>{orignalData?.projectTeams ? "Yes" : "No"}</span>
                  ) : (
                    <span className="flex items-center">
                      {noDataPresentSvg}
                      Data Not Available
                    </span>
                  )}
                </p>
              </div>
              <div className="flex space-x-2 items-center  flex-row ml-3">
                <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                <p className="text-md  font-normal text-gray-600  break-all flex-wrap">
                  {updatedData?.projectTeams ? (
                    "Yes"
                  ) : "No" ? (
                    <span>{updatedData?.projectTeams ? "Yes" : "No"}</span>
                  ) : (
                    <span className="flex items-center">
                      {noDataPresentSvg}
                      Data Not Available
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex flex-col mb-4 md:mb-6 md:pl-0 pl-4">
              <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">
                Target Market :
              </h2>
              <div className="flex space-x-2 items-center  flex-row ml-3">
                <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                <p className="text-md  font-normal text-gray-600  break-all flex-wrap">
                  {orignalData?.targetMarket ? (
                    <span>{orignalData?.targetMarket}</span>
                  ) : (
                    <span className="flex items-center">
                      {noDataPresentSvg}
                      Data Not Available
                    </span>
                  )}
                </p>
              </div>
              <div className="flex space-x-2 items-center  flex-row ml-3">
                <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                <p className="text-md  font-normal text-gray-600  break-all flex-wrap">
                  {updatedData?.targetMarket ? (
                    <span>{updatedData?.targetMarket}</span>
                  ) : (
                    <span className="flex items-center">
                      {noDataPresentSvg}
                      Data Not Available
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex flex-col mb-4 md:mb-6 md:pl-0 pl-4">
              <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">
                VC's assigned :
              </h2>
              <div className="flex space-x-2 items-center  flex-row ml-3">
                <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                <p className="text-md  font-normal text-gray-600  break-all flex-wrap">
                  {orignalData?.vcsAssigned ? (
                    <span>{orignalData?.vcsAssigned}</span>
                  ) : (
                    <span className="flex items-center">
                      {noDataPresentSvg}
                      Data Not Available
                    </span>
                  )}
                </p>
              </div>
              <div className="flex space-x-2 items-center  flex-row ml-3">
                <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                <p className="text-md  font-normal text-gray-600  break-all flex-wrap">
                  {updatedData?.vcsAssigned ? (
                    <span>{updatedData?.vcsAssigned}</span>
                  ) : (
                    <span className="flex items-center">
                      {noDataPresentSvg}
                      Data Not Available
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex flex-col mb-4 md:mb-6 md:pl-0 pl-4">
              <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">
                Weekly Active:
              </h2>
              <div className="flex space-x-2 items-center  flex-row ml-3">
                <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                <p className="text-md  font-normal text-gray-600  break-all flex-wrap">
                  {weeklyUsers ? (
                    <span>{weeklyUsers}</span>
                  ) : (
                    <span className="flex items-center">
                      {noDataPresentSvg}
                      Data Not Available
                    </span>
                  )}
                </p>
              </div>
              <div className="flex space-x-2 items-center  flex-row ml-3">
                <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                <p className="text-md  font-normal text-gray-600  break-all flex-wrap">
                  {updatedweeklyUsers ? (
                    <span>{updatedweeklyUsers}</span>
                  ) : (
                    <span className="flex items-center">
                      {noDataPresentSvg}
                      Data Not Available
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex flex-col mb-4 md:mb-6 md:pl-0 pl-4">
              <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">
                Raised from Other Ecosysytem:
              </h2>
              <div className="flex space-x-2 items-center  flex-row ml-3">
                <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                <p className="text-md  font-normal text-gray-600  break-all flex-wrap">
                  {otherEcosystem ? (
                    <span>{otherEcosystem}</span>
                  ) : (
                    <span className="flex items-center">
                      {noDataPresentSvg}
                      Data Not Available
                    </span>
                  )}
                </p>
              </div>
              <div className="flex space-x-2 items-center  flex-row ml-3">
                <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                <p className="text-md  font-normal text-gray-600  break-all flex-wrap">
                  {updatedOtherEcosystem ? (
                    <span>{updatedOtherEcosystem}</span>
                  ) : (
                    <span className="flex items-center">
                      {noDataPresentSvg}
                      Data Not Available
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex flex-col mb-4 md:mb-6 md:pl-0 pl-4">
              <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">
                Targeted Amount:
              </h2>
              <div className="flex space-x-2 items-center  flex-row ml-3">
                <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                <p className="text-md  font-normal text-gray-600  break-all flex-wrap">
                  {targetAmount ? (
                    <span>{targetAmount}</span>
                  ) : (
                    <span className="flex items-center">
                      {noDataPresentSvg}
                      Data Not Available
                    </span>
                  )}
                </p>
              </div>
              <div className="flex space-x-2 items-center  flex-row ml-3">
                <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                <p className="text-md  font-normal text-gray-600  break-all flex-wrap">
                  {updatedTargetAmount ? (
                    <span>{updatedTargetAmount}</span>
                  ) : (
                    <span className="flex items-center">
                      {noDataPresentSvg}
                      Data Not Available
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex flex-col mb-4 md:mb-6 md:pl-0 pl-4">
              <h2 className="text-xl sm:text-xl font-extrabold text-gray-800 mb-2 sm:mb-0 mr-2">
                Sns:
              </h2>
              <div className="flex space-x-2 items-center  flex-row ml-3">
                <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                <p className="text-md  font-normal text-gray-600  break-all flex-wrap">
                  {snsGrants ? (
                    <span>{snsGrants}</span>
                  ) : (
                    <span className="flex items-center">
                      {noDataPresentSvg}
                      Data Not Available
                    </span>
                  )}
                </p>
              </div>
              <div className="flex space-x-2 items-center  flex-row ml-3">
                <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                <p className="text-md  font-normal text-gray-600  break-all flex-wrap">
                  {updatedSnsGrants ? (
                    <span>{updatedSnsGrants}</span>
                  ) : (
                    <span className="flex items-center">
                      {noDataPresentSvg}
                      Data Not Available
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    // </form>
  );
};

export default ProjectUpdate;

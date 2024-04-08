import React, { useEffect, useCallback, useState, useMemo } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDropzone } from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";
import { allHubHandlerRequest } from "../../StateManagement/Redux/Reducers/All_IcpHubReducer";
import CompressedImage from "../../ImageCompressed/CompressedImage";
import { projectRegistration } from "../../Utils/Data/AllDetailFormData";
import {
  projectPersonalInformation,
  projectDetails,
  additionalDetails,
} from "../../Utils/Data/createFormData";
import { Tooltip as ReactTooltip } from "react-tooltip";
import toast, { Toaster } from "react-hot-toast";
import CreateProjectPersonalInformation from "../CreateProjectPersonalInformation";
import { useCountries } from "react-countries";
import { userRegisteredHandlerRequest } from "../../StateManagement/Redux/Reducers/userRegisteredData";
import CreateProjectsDetails from "./CreateProjectsDetails";
import { bufferToImageBlob } from "../../Utils/formatter/bufferToImageBlob";
import CreateProjectsAdditionalDetails from "./CreateProjectsAdditionalDetails";
import ReactSelect from "react-select";
import { useNavigate, useLocation } from "react-router-dom";

const validationSchema = {
  personalDetails: yup.object().shape({
    full_name: yup
      .string()
      .required()
      .test("is-non-empty", null, (value) => value && value.trim().length > 0),
    openchat_username: yup
      .string()
      .nullable(true) // Allows the value to be null
      .test(
        "is-valid-username",
        "Username must be between 6 and 20 characters and can only contain letters, numbers, and underscores",
        (value) => {
          // If no value is provided, consider it valid (since it's optional)
          if (!value) return true;

          // Check length
          const isValidLength = value.length >= 6 && value.length <= 20;
          // Check allowed characters (including at least one uppercase letter or number)
          const hasValidChars = /^(?=.*[A-Z0-9_])[a-zA-Z0-9_]+$/.test(value);

          return isValidLength && hasValidChars;
        }
      ),
    bio: yup.string().optional(),
    email: yup.string().email().optional(),
    telegram_id: yup.string().optional().url(),
    twitter_id: yup.string().optional().url(),
    country: yup
      .string()
      .test("is-non-empty", "ICP Hub selection is required", (value) =>
        /\S/.test(value)
      )
      .required("Selecting an interest is required."),
    area_of_interest: yup.string().required("Selecting an interest is required."),
    imageData: yup.mixed(),
  }),
  projectDetails: yup.object().shape({
    project_elevator_pitch: yup
      .string()
      .test("wordCount", "Project Pitch must be 50 words or fewer", (value) => {
        if (typeof value === "string") {
          const words = value.trim().split(/\s+/); // Split by any whitespace
          return words.length <= 50;
        }
        return false; // Fails validation if not a string
      })
      .required("Project elevator pitch is Required"),
    reason_to_join_incubator: yup
      .string()
      .test("is-non-empty", "Reason is required", (value) => /\S/.test(value))
      .required("Reason is required"),
    money_raised_till_now: yup.string(),
    target_amount: yup
      .string()
      .test(
        "is-integer",
        "Target Amount value must be an integer",
        (value) =>
          value === "" ||
          (!isNaN(value) && parseInt(value, 10).toString() === value)
      ),
    icp_grants: yup
      .string()
      .test(
        "is-integer",
        "ICP Grants value must be an integer",
        (value) =>
          value === "" ||
          (!isNaN(value) && parseInt(value, 10).toString() === value)
      ),
    investors: yup
      .string()
      .test(
        "is-integer",
        "ICP Grants value must be an integer",
        (value) =>
          value === "" ||
          (!isNaN(value) && parseInt(value, 10).toString() === value)
      ),
    sns: yup
      .string()
      .test(
        "is-integer",
        "ICP Grants value must be an integer",
        (value) =>
          value === "" ||
          (!isNaN(value) && parseInt(value, 10).toString() === value)
      ),
    raised_from_other_ecosystem: yup
      .string()
      .test(
        "is-integer",
        "ICP Grants value must be an integer",
        (value) =>
          value === "" ||
          (!isNaN(value) && parseInt(value, 10).toString() === value)
      ),
    project_name: yup.string().required("Project name is required"),
    live_on_icp_mainnet: yup.string(),
    upload_private_documents: yup.string(),
    // title1: yup.string(),
    // link1: yup.string().url(),
    private_docs: yup.array().of(
      yup.object().shape({
        title: yup.string().optional("Title is required"),
        link: yup
          .string()
          .url("Must be a valid URL")
          .optional("Link is required"),
      })
    ),
    project_area_of_focus: yup.string().required("Area of focus is required"),
    self_rating_of_project: yup.string().optional(),
    weekly_active_users: yup
      // .string().required("Weekly active users is required"),
      .string().test(
        "is-integer",
        "ICP Grants value must be an integer",
        (value) =>
          value === "" ||
          (!isNaN(value) && parseInt(value, 10).toString() === value)
      ),
    revenue: yup
      // .string().required("Revenue is required"),
      .string().test(
        "is-integer",
        "ICP Grants value must be an integer",
        (value) =>
          value === "" ||
          (!isNaN(value) && parseInt(value, 10).toString() === value)
      ),
    preferred_icp_hub: yup.string().required("ICP hub is required"),
    supports_multichain: yup.string(),
    promotional_video: yup.string().url("Must be a valid URL").optional(),
    dapp_link: yup.string().url("Must be a valid URL").when('live_on_icp_mainnet', (val, schema) => val && val === 'true' ? schema.test('is-non-empty', 'Required', (value) => /\S/.test(value)).required("Required") : schema),

    // location: yup.string().when('hackathon_mode', (val, schema) => val && (val[0] === 'offline' || val[0] === 'hybrid') ? schema.test('is-non-empty', 'Required', (value) => /\S/.test(value)).required("Required") : schema),

    project_website: yup.string().url("Must be a valid URL").optional(),
    project_twitter: yup.string().url("Must be a valid URL").optional(),
    project_discord: yup.string().url("Must be a valid URL").optional(),
    project_linkedin: yup.string().url("Must be a valid URL").optional(),
    github_link: yup.string().url("Must be a valid URL").optional(),
    logoData: yup.mixed().optional(),
  }),
  additionalDetails: yup.object().shape({
    project_description: yup
      .string()
      .trim()
      .required("Textarea is required")
      .matches(/^[^\s].*$/, "Cannot start with a space")
      .test(
        "wordCount",
        "Project description must be 300 words or fewer",
        (value) => {
          if (typeof value === "string") {
            const words = value.trim().split(/\s+/); // Split by any whitespace
            return words.length <= 300;
          }
          return false; // Fails validation if not a string
        }
      ),
    title2: yup.string(),
    link2: yup.string().url(),
    token_economics: yup.string().url("Must be a valid URL").optional(),
    target_market: yup.string().url("Must be a valid URL").optional(),
    long_term_goals: yup.string().url("Must be a valid URL").optional(),
    technical_docs: yup.string().url("Must be a valid URL").optional(),
    coverData: yup.mixed().optional(),
  }),
};

const CreateProjectRegistration = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const projectId = location.state?.projectId;
  // console.log("id is here ===>", projectId);

  const actor = useSelector((currState) => currState.actors.actor);
  const getAllIcpHubs = useSelector((currState) => currState.hubs.allHubs);
  const areaOfExpertise = useSelector(
    (currState) => currState.expertiseIn.expertise
  );
  const specificRole = useSelector(
    (currState) => currState.currentRoleStatus.activeRole
  );
  console.log("specificRole is Here===>", specificRole);
  const multiChain = useSelector((currState) => currState.chains.chains);

  const userData = useSelector((currState) => currState.userData.data.Ok);
  const userActualFullData = useSelector((currState) => currState.userData.data.Ok);
  
  const projectFullData = useSelector(
    (currState) => currState.projectData.data
  );
  console.log("projectFullData", projectFullData);
  const dispatch = useDispatch();
  const { countries } = useCountries();
  const [activeTab, setActiveTab] = useState(projectRegistration[0].id);
  const [formData, setFormData] = useState({});
  const [step, setStep] = useState(0);
  const [isCurrentStepValid, setIsCurrentStepValid] = useState(false);
  const [userHasInteracted, setUserHasInteracted] = useState(false);
  const [imageData, setImageData] = useState(null);
  const [imageActualData, setImageActualData] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [logoData, setLogoData] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [coverData, setCoverData] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [projectDataObject, setProjectDataObject] = useState({});
  // Form Updates Changes in enable and diabled
  const [isLiveOnICP, setIsLiveOnICP] = useState(false);
  const [isProjectRegistered, setIsProjectRegistered] = useState(false);
  const [isMoneyRaised, setIsMoneyRaised] = useState(false);
  const [isMulti_Chain, setIsMulti_Chain] = useState(false);
  const [isPrivateDocument, setIsPrivateDocuments] = useState(false);

  // Used to convert strings to Uint8Array
  function stringToUint8Array(str) {
    const encoder = new TextEncoder();
    return encoder.encode(str);
  }

  const getTabClassName = (tab) => {
    return `inline-block p-2 font-bold ${activeTab === tab
      ? "text-black border-b-2 border-black"
      : "text-gray-400  border-transparent hover:text-black"
      } rounded-t-lg`;
  };

  // useEffect(() => {
  //   dispatch(userRegisteredHandlerRequest());
  // }, [actor, dispatch]);
  useEffect(() => {
    dispatch(allHubHandlerRequest());
  }, [actor, dispatch]);
  const steps = [
    // { id: "personalDetails", fields: projectPersonalInformation },
    { id: "projectDetails", fields: projectDetails },
    { id: "additionalDetails", fields: additionalDetails },
  ];

  const currentValidationSchema = validationSchema[steps[step].id];

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    trigger,
    watch,
    setError,
    clearErrors,
    getValues,
    setValue,
    reset,
    control,
  } = useForm({
    defaultValues: {
      private_docs: [{ title: "", link: "" }],
      public_docs: [{ title: "", link: "" }],
    },
    resolver: yupResolver(currentValidationSchema),
    mode: "all",
  });
  const { fields, append } = useFieldArray({
    control,
    name: "private_docs",
    name: "public_docs",
  });

  // console.log("private", getValues("private_docs"));
  // console.log("public", getValues("public_docs"));

  const handleTabClick = async (tab) => {
    const targetStep = projectRegistration.findIndex(
      (header) => header.id === tab
    );
    setUserHasInteracted(true);

    if (step === targetStep) {
      return;
    }
    if (targetStep < step || isCurrentStepValid) {
      setActiveTab(tab);
      setStep(targetStep);
    } else {
    }
  };

  const liveOnICPMainnetValue = watch("live_on_icp_mainnet");
  // console.log('liveOnICPMainnetValue=========>>>', liveOnICPMainnetValue)
  // console.log('liveOnICPMainnetValue=========>>>', typeof liveOnICPMainnetValue)
  // console.log('liveOnICPMainnetValue=========>>>', watch('dapp_link'))
  // console.log('liveOnICPMainnetValue=========>>>', typeof watch('dapp_link'))
  const isyourProjectRegistered = watch("is_your_project_registered");
  const MoneyRaisedTillNow = watch("money_raised_till_now");
  const IsMultiChain = watch("multi_chain");
  const IsPrivateDocument = watch("upload_private_documents");

  const checkTotal = (event) => {
    // Prevent default form submission behavior
    const targetAmount = watch(Number("target_amount"));
    const icpGrants = watch(Number("icp_grants"));
    const investors = watch(Number("investors"));
    const sns = watch(Number("sns"));
    const raisedFromOtherEcosystem = watch(
      Number("raised_from_other_ecosystem")
    );

    const total = icpGrants + investors + sns + raisedFromOtherEcosystem;

    if (total > targetAmount) {
      setError(
        "The total amount exceeds the target amount. Please adjust the values."
      );
    } else {
      setError(""); // Clear error if condition is met
    }
  };

  useEffect(() => {
    // Update isLiveOnICP based on live_on_icp_mainnet field value
    setIsPrivateDocuments(IsPrivateDocument === "true");

    setIsLiveOnICP(liveOnICPMainnetValue === "true");
    if (liveOnICPMainnetValue !== "true") {
      setValue("dapp_link", "");
      setValue("weekly_active_users", "");
      setValue("revenue", "");
    }
    setIsProjectRegistered(isyourProjectRegistered === "true");
    if (isyourProjectRegistered !== "true") {
      setValue("type_of_registration", "");
      setValue("country_of_registration", "");
    }
    setIsMoneyRaised(MoneyRaisedTillNow === "true");
    // if(MoneyRaisedTillNow === "true"){
    //   checkTotal();
    // }
    if (MoneyRaisedTillNow !== "true") {
      setValue("target_amount", "");
      setValue("icp_grants", "");
      setValue("investors", "");
      setValue("sns", "");
      setValue("raised_from_other_ecosystem", "");
      setValue("upload_private_documents", "false");
    }
    setIsMulti_Chain(IsMultiChain === "true");
    if (IsMultiChain !== "true") {
      setValue("supports_multichain", "");
    }
  }, [
    liveOnICPMainnetValue,
    MoneyRaisedTillNow,
    isyourProjectRegistered,
    IsMultiChain,
    IsPrivateDocument,
    setValue,
  ]);

  useEffect(() => {
    if (!userHasInteracted) return;
    const validateStep = async () => {
      const fieldsToValidate = steps[step].fields.map((field) => field.name);
      const result = await trigger(fieldsToValidate);
      setIsCurrentStepValid(result);
    };
    validateStep();
  }, [step, trigger, userHasInteracted]);
  // Adding Project_image Here
  const addImageHandler = useCallback(
    async (file) => {
      clearErrors("imageData");
      // if (!file)
      //   return setError("imageData", {
      //     type: "manual",
      //     message: "An image is required",
      //   });
      if (!["image/jpeg", "image/png", "image/gif"].includes(file.type))
        return setError("imageData", {
          type: "manual",
          message: "Unsupported file format",
        });
      if (file.size > 10240 * 10240)
        // 10MB
        return setError("imageData", {
          type: "manual",
          message: "The file should be under 10 mb",
        });

      setIsLoading(true);
      try {
        const compressedFile = await CompressedImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
          setIsLoading(false);
        };
        reader.readAsDataURL(compressedFile);

        const byteArray = await compressedFile.arrayBuffer();
        setImageData(Array.from(new Uint8Array(byteArray)));
        setValue("imageData", Array.from(new Uint8Array(byteArray)), {
          shouldValidate: true,
        });
        clearErrors("imageData");
      } catch (error) {
        console.error("Error processing the image:", error);
        setError("imageData", {
          type: "manual",
          message: "Could not process image, please try another.",
        });
        setIsLoading(false);
      }
    },
    [
      setError,
      clearErrors,
      setValue,
      setIsLoading,
      setImagePreview,
      setImageData,
    ]
  );
  // Adding Project_Logo image Here
  const addLogoHandler = useCallback(
    async (file) => {
      clearErrors("logoData");
      if (!["image/jpeg", "image/png", "image/gif"].includes(file.type))
        return setError("logoData", {
          type: "manual",
          message: "Unsupported file format",
        });
      if (file.size > 1024 * 1024)
        // 1MB
        return setError("logoData", {
          type: "manual",
          message: "The file is too large",
        });

      setIsLoading(true);
      try {
        const compressedFile = await CompressedImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setLogoPreview(reader.result);
          setIsLoading(false);
        };
        reader.readAsDataURL(compressedFile);

        const byteArray = await compressedFile.arrayBuffer();
        const logoDataArray = new Uint8Array(byteArray);
        setLogoData(logoDataArray);
        setValue("logoData", logoDataArray, { shouldValidate: true });
      } catch (error) {
        console.error("Error processing the logo:", error);
        setError("logoData", {
          type: "manual",
          message: "Could not process logo, please try another.",
        });
        setIsLoading(false);
      }
    },
    [setError, clearErrors, setValue, setIsLoading, setLogoPreview, setLogoData]
  );
  // Adding Project_cover image Here
  const addImageCoverHandler = useCallback(
    async (file) => {
      clearErrors("coverData");
      if (!["image/jpeg", "image/png", "image/gif"].includes(file.type))
        return setError("coverData", {
          type: "manual",
          message: "Unsupported file format",
        });
      if (file.size > 1024 * 1024)
        // 1MB
        return setError("coverData", {
          type: "manual",
          message: "The file is too large",
        });

      setIsLoading(true);
      try {
        const compressedFile = await CompressedImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setCoverPreview(reader.result);
          setIsLoading(false);
        };
        reader.readAsDataURL(compressedFile);

        const byteArray = await compressedFile.arrayBuffer();
        const coverDataArray = new Uint8Array(byteArray);
        setCoverData(coverDataArray);
        setValue("coverData", coverDataArray, { shouldValidate: true });
        clearErrors("coverData");
      } catch (error) {
        console.error("Error processing the CoverImage:", error);
        setError("coverData", {
          type: "manual",
          message: "Could not process Cover Image, please try another.",
        });
        setIsLoading(false);
      }
    },
    [
      setError,
      setValue,
      clearErrors,
      setIsLoading,
      setCoverPreview,
      setCoverData,
    ]
  );
  const handleNext = async () => {
    const fieldsToValidate = steps[step].fields.map((field) => field.name);
    // console.log('fieldsToValidate', fieldsToValidate)
    // console.log('watch===live_on_icp_mainnet===>>', watch('live_on_icp_mainnet'))
    const result = await trigger(
      watch('live_on_icp_mainnet') === "true"
        ? [...fieldsToValidate, 'reason_to_join_incubator', 'preferred_icp_hub', 'project_area_of_focus', 'dapp_link']
        : [...fieldsToValidate, 'reason_to_join_incubator', 'preferred_icp_hub', 'project_area_of_focus']
    );
    if (result) {
      setStep((prevStep) => prevStep + 1);
      setActiveTab(projectRegistration[step + 1]?.id);
    }
  };
  const saveFormData = (val) => {
    localStorage.setItem("formData", JSON.stringify(val));
  };
  const handleSaveStep = () => {
    const updatedFormData = { ...formData };
    saveFormData(updatedFormData);
  };
  const imageUrlToByteArray = async (imageUrl) => {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    return Array.from(new Uint8Array(arrayBuffer));
  };
  const handlePrevious = () => {
    if (step > 0) {
      setStep((prevStep) => prevStep - 1);
      setActiveTab(projectRegistration[step - 1]?.id);
    }
  };
  useEffect(() => {
    const preventScroll = (e) => {
      if (e.target.type === "number") {
        e.preventDefault();
      }
    };

    window.addEventListener("wheel", preventScroll, { passive: false });

    return () => {
      window.removeEventListener("wheel", preventScroll);
    };
  }, []);
  useEffect(() => {
    if (projectFullData && projectFullData.params) {
      const data = projectFullData.params;
      const formattedData = Object.keys(data).reduce((acc, key) => {
        acc[key] = Array.isArray(data[key]) ? data[key][0] : data[key];
        return acc;
      }, {});
      reset(formattedData);
      setFormData(formattedData);
      console.log("formattedData341", formattedData);
      console.log("342 data", data);
      if (formattedData.user_data.profile_picture) {
        imageUrlToByteArray(formattedData.user_data.profile_picture[0])
          .then((imageUrl) => {
            // setImageData(imageUrl);

            console.log("i am here Working ===>", imageUrl);
          })
          .catch((error) => console.error("Error converting image:", error));
      }
    } else {
      if (userData) {
        // Create an object that matches the form fields structure
        const formData = {
          full_name: userData.full_name || "",
          email: userData.email?.[0] || "",
          telegram_id: userData.telegram_id?.[0] || "",
          twitter_id: userData.twitter_id?.[0] || "",
          openchat_username: userData.openchat_username?.[0] || "",
          bio: userData.bio?.[0] || "",
          country: userData.country || "",
          area_of_interest: userData.area_of_interest || "",
        };

        // If there is a mentor_image, handle its conversion and set it separately if needed
        if (userData?.profile_picture) {
          bufferToImageBlob(userData?.profile_picture)
            .then((imageUrl) => {
              setImagePreview(imageUrl);
              setFormData({ imageData: userData.profile_picture[0] });
              setValue("imageData", userData.profile_picture[0], {
                shouldValidate: true,
              });
              // You might also need to handle setting the image for display if required

              // console.log(
              //   "kya scene hai profile_picture ka ===>",
              //   userData.profile_picture[0]
              // );
            })
            .catch((error) => console.error("Error converting image:", error));
        }
        reset(formData);
      }
    }
  }, [projectFullData, reset, setValue, userData]);

  const errorFunc = (val) => {
    console.log("val", val);
  };
  const sendingProjectData = async (val) => {
    // console.log("run sendingProjectData =========");
    val.project_cover = val.project_cover[0] || [];
    val.project_logo = val.project_logo[0] || [];
    // console.log("sendingProjectData ==>> ", val);

    let result;
    let id = projectFullData?.uid;
    try {
      if (specificRole === "project") {
        console.log("update project functn k pass reached");
        result = await actor.update_project(id, val).then((result) => {
          console.log("register register_project functn ka result ", result);
          if (result) {
            toast.success(result);
            navigate("/");
            window.location.href = "/";
          } else {
            toast.error(result);
          }
        });
      } else if (
        specificRole === null ||
        specificRole === "user" ||
        specificRole === "vc" ||
        specificRole === "mentor"
      ) {
        console.log("register register_project functn k pass reached");
        await actor.register_project(val).then((result) => {
          console.log("register register_project functn ka result ", result);
          if (result === "approval request is sent") {
            toast.success(result);
            navigate("/");
            window.location.href = "/";
          } else {
            toast.error(result);
          }
        });
      }
      // await dispatch(userRoleHandler());
      // await navigate("/");
    } catch (error) {
      toast.error(error);
      console.log(error.message);
    }
  };
  const onSubmit = async (data) => {
    console.log("CreateProjectRegistration data after Submit ===>", data);

    const updatedFormData = { ...formData, ...data };
    setFormData(updatedFormData);

    console.log("updatedFormData", updatedFormData);
    if (step < steps.length - 1) {
      handleNext();
    } else if (
      specificRole === "project" ||
      (undefined && step > steps.length - 1)
    ) {
      // console.log("exisiting user visit ");

      const updateMoneyRaisedTillNow =
        MoneyRaisedTillNow === "true" ? true : false;
      const updateIsPrivateDocument =
        IsPrivateDocument === "true" ? true : false;
      const updateliveOnICPMainnetValue =
        liveOnICPMainnetValue === "true" ? true : false;
      const privateDocs = updatedFormData?.private_docs?.map((doc) => ({
        title: doc.title,
        link: doc.link,
      }));
      const publicDocs = updatedFormData?.public_docs?.map((doc) => ({
        title: doc.title,
        link: doc.link,
      }));
      const moneyRaised = {
        target_amount: [
          updatedFormData.target_amount
            ? parseFloat(updatedFormData.target_amount)
            : 0,
        ],
        icp_grants: [updatedFormData.icp_grants || ""],
        investors: [updatedFormData.investors || ""],
        sns: [updatedFormData.sns || ""],
        raised_from_other_ecosystem: [
          updatedFormData.raised_from_other_ecosystem || "",
        ],
      };
      let tempObj2 = {
        user_data: {
          profile_picture: imageData ? [imageData] : [],
          full_name: updatedFormData.full_name || "",
          country: updatedFormData.country || "",
          email: [updatedFormData.email] || [],
          telegram_id: [updatedFormData.telegram_id],
          twitter_id: [updatedFormData.twitter_id],
          openchat_username: [updatedFormData.openchat_username] || [],
          bio: [updatedFormData.bio] || [],
          area_of_interest: updatedFormData.area_of_interest || [],
          type_of_profile: updatedFormData.type_of_profile || [],
          reason_to_join:updatedFormData.type_of_profile || []

        },
        upload_private_documents: [updateIsPrivateDocument],
        project_elevator_pitch: [updatedFormData.project_elevator_pitch],
        public_docs: publicDocs ? [publicDocs] : [],
        private_docs: updateIsPrivateDocument === true ? [privateDocs] : [],
        technical_docs: [updatedFormData.technical_docs],
        reason_to_join_incubator:
          updatedFormData.reason_to_join_incubator || "",
        money_raised: updateMoneyRaisedTillNow === true ? [moneyRaised] : [],
        promotional_video: [updatedFormData.promotional_video],
        project_area_of_focus: updatedFormData.project_area_of_focus || "",
        money_raised_till_now: [updateMoneyRaisedTillNow],
        supports_multichain: [updatedFormData.supports_multichain || ""],
        project_name: updatedFormData.project_name || "",
        live_on_icp_mainnet: [updateliveOnICPMainnetValue],
        preferred_icp_hub: [updatedFormData.preferred_icp_hub],
        dapp_link: [updatedFormData.dapp_link || ""],
        project_website: [updatedFormData.project_website],
        project_twitter: [updatedFormData.project_twitter],
        project_discord: [updatedFormData.project_discord],
        project_linkedin: [updatedFormData.project_linkedin],
        project_logo: [updatedFormData.logoData],
        vc_assigned: [],
        mentors_assigned: [],
        project_team: [],
        project_description: updatedFormData.project_description || "",
        token_economics: [updatedFormData.token_economics || ""],
        self_rating_of_project: updatedFormData.self_rating_of_project
          ? parseFloat(updatedFormData.self_rating_of_project)
          : 0,
        weekly_active_users: updatedFormData.weekly_active_users
          ? [parseInt(updatedFormData.weekly_active_users)]
          : [],
        revenue: updatedFormData.weekly_active_users
          ? [parseInt(updatedFormData.weekly_active_users)]
          : [],
        target_market: [updatedFormData.target_market || ""],
        long_term_goals: [updatedFormData.long_term_goals || ""],
        technical_docs: [updatedFormData.technical_docs || ""],
        github_link: [updatedFormData.github_link],
        project_cover: [updatedFormData.coverData],
      };

      console.log("tempObj2 kaam kia ????? ", tempObj2); // work kia
      setProjectDataObject(tempObj2);
      await sendingProjectData(tempObj2);
    } else if (
      specificRole === null ||
      specificRole === "user" ||
      specificRole === "vc" ||
      specificRole === "mentor" ||
      step > steps.length - 1
    ) {
      // console.log("first time visit ");
      const updateMoneyRaisedTillNow =
        MoneyRaisedTillNow === "true" ? true : false;
      const updateIsPrivateDocument =
        IsPrivateDocument === "true" ? true : false;
      const updateliveOnICPMainnetValue =
        liveOnICPMainnetValue === "true" ? true : false;
      const privateDocs = updatedFormData?.private_docs?.map((doc) => ({
        title: doc.title,
        link: doc.link,
      }));
      const publicDocs = updatedFormData?.public_docs?.map((doc) => ({
        title: doc.title,
        link: doc.link,
      }));
      const moneyRaised = {
        target_amount: [
          updatedFormData.target_amount
            ? parseFloat(updatedFormData.target_amount)
            : 0,
        ],
        icp_grants: [updatedFormData.icp_grants || ""],
        investors: [updatedFormData.investors || ""],
        sns: [updatedFormData.sns || ""],
        raised_from_other_ecosystem: [
          updatedFormData.raised_from_other_ecosystem || "",
        ],
      };
      console.log('imageActualData==========>>>', imageActualData)
      let tempObj = {
        user_data: {
          profile_picture: imageActualData ? [imageActualData] : [],
          full_name: userActualFullData.full_name || "",
          country: userActualFullData.country || "",
          email: [userActualFullData.email?.[0] || ""],
          telegram_id: [userActualFullData.telegram_id?.[0] || ""],
          twitter_id: [userActualFullData.twitter_id?.[0] || ""],
          openchat_username: [userActualFullData.openchat_username?.[0] || ""],
          bio: [userActualFullData?.bio?.[0] || ""],
          area_of_interest: userActualFullData.area_of_interest || "",
          type_of_profile: [userActualFullData.type_of_profile?.[0] || ""],
          reason_to_join: [userActualFullData?.reason_to_join?.[0] || [""]]
        },
        upload_private_documents: [updateIsPrivateDocument],
        project_elevator_pitch: [updatedFormData.project_elevator_pitch],
        public_docs: publicDocs ? [publicDocs] : [],
        private_docs: updateIsPrivateDocument === true ? [privateDocs] : [],
        technical_docs: [updatedFormData.technical_docs],
        reason_to_join_incubator:
          updatedFormData.reason_to_join_incubator || "",
        money_raised: updateMoneyRaisedTillNow === true ? [moneyRaised] : [],
        promotional_video: [updatedFormData.promotional_video],
        project_area_of_focus: updatedFormData.project_area_of_focus || "",
        money_raised_till_now: [updateMoneyRaisedTillNow],
        supports_multichain: [updatedFormData.supports_multichain || ""],
        project_name: updatedFormData.project_name || "",
        live_on_icp_mainnet: [updateliveOnICPMainnetValue],
        preferred_icp_hub: [updatedFormData.preferred_icp_hub],
        dapp_link: [updatedFormData.dapp_link || ""],
        project_website: [updatedFormData.project_website],
        project_twitter: [updatedFormData.project_twitter],
        project_discord: [updatedFormData.project_discord],
        project_linkedin: [updatedFormData.project_linkedin],
        project_logo: [updatedFormData.logoData],
        vc_assigned: [],
        mentors_assigned: [],
        project_team: [],
        project_description: [updatedFormData.project_description || ""],
        token_economics: [updatedFormData.token_economics || ""],
        self_rating_of_project: updatedFormData.self_rating_of_project
          ? parseFloat(updatedFormData.self_rating_of_project)
          : 0,
        weekly_active_users: updatedFormData.weekly_active_users
          ? [parseInt(updatedFormData.weekly_active_users)]
          : [],
        revenue: updatedFormData.weekly_active_users
          ? [parseInt(updatedFormData.weekly_active_users)]
          : [],
        target_market: [updatedFormData.target_market || ""],
        long_term_goals: [updatedFormData.long_term_goals || ""],
        technical_docs: [updatedFormData.technical_docs || ""],
        github_link: [updatedFormData.github_link],
        project_cover: [updatedFormData.coverData],
        country_of_registration: [updatedFormData?.country_of_registration || ""],
        is_your_project_registered: [updatedFormData?.is_your_project_registered === "true" ? true : false],
        type_of_registration: [updatedFormData?.type_of_registration || ""]
      };

      // console.log("tempObj kaam kia ????? ", tempObj); // work kia

      setProjectDataObject(tempObj);
      await sendingProjectData(tempObj);
    }
  };
  // const { getRootProps, getInputProps } = useDropzone({
  //   accept: "image/jpeg, image/png, image/gif",
  //   onDrop: addMultipleImageHandler,
  //   multiple: true,
  // });

  const stepFields = steps[step].fields;
  let StepComponent;
  // if (step === 0) {
  //   StepComponent = <CreateProjectPersonalInformation />;
  // } else
  if (step === 0) {
    StepComponent = <CreateProjectsDetails />;
  } else if (step === 1) {
    StepComponent = (
      <CreateProjectsAdditionalDetails isSubmitting={isSubmitting} />
    );
  }


  useEffect(() => {
    if(actor){
      (async() => {
        const result = await actor.get_user_information()
        if(result){
          setImageActualData(result?.Ok?.profile_picture?.[0] ?? null)
        }else{
          setImageActualData(null);
        }
      })();
    }
  },[actor])
  return (
    <section className="w-full h-fit px-[6%] lg1:px-[4%] py-[6%] lg1:py-[4%] bg-gray-100">
      <div className="w-full h-full bg-gray-100 pt-8">
        <div className="bg-gradient-to-r from-purple-800 to-blue-500 text-transparent bg-clip-text text-[30px]  sm:text-[25px] md1:text-[30px] md2:text-[35px] font-black font-fontUse dxl:text-[40px] p-8">
          Project Information
        </div>
        <div className="text-sm font-medium text-center text-gray-200 ">
          <ul className="flex flex-wrap mb-4 text-sxxs:text-[7px] sxs:text-[7.5px] sxs1:text-[8px] sxs2:text-[8.5px] sxs3:text-[9px] ss:text-[9.5px] ss1:text-[10px] ss2:text-[10.5px] ss3:text-[11px] ss4:text-[11.5px] dxs:text-[12px] xxs:text-[12.5px] xxs1:text-[13px] sm1:text-[13.5px] sm4:text-[14px] sm2:text-[14.5px] sm3:text-[13px] sm:text-[11.5px] md:text-[14px.3] md1:text-[13px] md2:text-[13px] md3:text-[13px] lg:text-[14.5px] dlg:text-[15px] lg1:text-[16.5px] lgx:text-[16px] dxl:text-[16.5px] xl:text-[19px] xl2:text-[19.5px] cursor-pointer justify-around">
            {projectRegistration?.map((header, index) => (
              <li key={header.id} className="me-2 relative group">
                <button
                  className={`${getTabClassName(header.id)} ${index > step && !isCurrentStepValid
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer"
                    }`}
                  onClick={() => handleTabClick(header.id)}
                  disabled={index > step && !isCurrentStepValid}
                >
                  <div className="hidden md:block">{header.label}</div>

                  <div className="flex md:hidden items-center">
                    {header.icon}
                  </div>
                </button>
                <div className="md:hidden">
                  {index > step && !isCurrentStepValid && (
                    <ReactTooltip
                      id={header.id}
                      place="bottom"
                      content="Complete current step to proceed"
                      className="z-10"
                    />
                  )}
                </div>
              </li>
            ))}
          </ul>
          {/* {step === 0 && (
            <>
              <div className="flex flex-col">
                <div className="flex-row w-full flex justify-start gap-4 items-center">
                  <div className="mb-3 ml-6 h-24 w-24 rounded-full border-2 border-gray-300 flex items-center justify-center overflow-hidden">
                    {isLoading ? (
                      <svg
                        width="35"
                        height="37"
                        viewBox="0 0 35 37"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="bg-no-repeat animate-pulse"
                      >
                        <path
                          d="M8.53049 8.62583C8.5304 13.3783 12.3575 17.2449 17.0605 17.2438C21.7634 17.2428 25.5907 13.3744 25.5908 8.62196C25.5909 3.8695 21.7638 0.00287764 17.0608 0.00394405C12.3579 0.00501045 8.53058 3.87336 8.53049 8.62583ZM32.2249 36.3959L34.1204 36.3954L34.1205 34.4799C34.1206 27.0878 28.1667 21.0724 20.8516 21.0741L13.2692 21.0758C5.95224 21.0775 -3.41468e-05 27.0955 -0.000176714 34.4876L-0.000213659 36.4032L32.2249 36.3959Z"
                          fill="#BBBBBB"
                        />
                      </svg>
                    ) : imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : projectPersonalInformation.imageData ? (
                      <img
                        src={projectPersonalInformation?.imageData}
                        alt="User"
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
                    name="imageData"
                    control={control}
                    render={({ field }) => (
                      <>
                        <input
                          id="images"
                          type="file"
                          name="images"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            addImageHandler(file);
                          }}
                        />
                        <label
                          htmlFor="images"
                          className="p-2 border-2 border-blue-800 items-center rounded-md text-md bg-transparent text-blue-800 cursor-pointer font-extrabold"
                        >
                          Upload Image
                        </label>
                      </>
                    )}
                  />
                </div>
                {errors.imageData && (
                  <span className="mt-1 text-sm text-red-500 font-bold text-start px-4">
                    {errors.imageData.message}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-3 px-4">
                <div className="z-0 w-full mb-3 group">
                  <label
                    htmlFor="country"
                    className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                  >
                    Country *
                  </label>
                  <select
                    {...register("country")}
                    className={`bg-gray-50 border-2 ${
                      errors.country
                        ? "border-red-500 placeholder:text-red-500"
                        : "border-[#737373]"
                    } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                    required
                  >
                    <option className="text-lg font-bold" value="">
                      Select your country
                    </option>
                    {countries?.map((expert) => (
                      <option
                        key={expert.name}
                        value={`${expert.name}`}
                        className="text-lg font-bold"
                      >
                        {expert.name}
                      </option>
                    ))}
                  </select>

                  {errors.country && (
                    <p className="mt-1 text-sm text-red-500 font-bold text-left">
                      {errors.country.message}
                    </p>
                  )}
                </div>
                <div className="z-0 w-full group">
                  <label
                    htmlFor="area_of_interest"
                    className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                  >
                    Domains you are interested in?
                  </label>
                  <ReactSelect
                    isMulti
                    options={areaOfExpertise.map((expert) => ({
                      value: expert.name,
                      label: expert.name,
                    }))}
                    menuPortalTarget={document.body}
                    menuPosition={"fixed"}
                    styles={{
                      menuPortal: (base) => ({
                        ...base,
                        zIndex: 9999, // Set the desired z-index value
                      }),
                      control: (provided, state) => ({
                        ...provided,
                        color: "black", // Initial color of the label
                        // Add other control styles if needed
                        paddingBlock: "2px",
                        borderRadius: "8px",
                        border: errors.area_of_interest
                          ? "2px solid #ef4444"
                          : "2px solid #737373",
                        backgroundColor: "rgb(249 250 251)",
                        // Additional conditional placeholder color if needed
                        "&::placeholder": {
                          color: errors.area_of_interest
                            ? "#ef4444"
                            : "currentColor", // Adjust the placeholder color conditionally
                        },
                      }),
                    }}
                    classNamePrefix="select"
                    className="basic-multi-select"
                    placeholder="Interests"
                    name="area_of_interest"
                    {...register("area_of_interest")}
                    onChange={(selectedOptions) => {
                      // You might need to adapt this part to fit how you handle form data
                      const selectedValues = selectedOptions
                        .map((option) => option.value)
                        .join(", ");
                      setValue("area_of_interest", selectedValues);
                    }}
                  />
                  {errors.area_of_interest && (
                    <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                      {errors.area_of_interest.message}
                    </span>
                  )}
                </div>
              </div>
            </>
          )} */}
          {step === 0 && (
            <>
              <div className="flex flex-col">
                <div className="flex-row w-full flex justify-start gap-4 items-center">
                  <div className="mb-3 ml-6 h-24 w-24 rounded-full border-2 border-gray-300 flex items-center justify-center overflow-hidden">
                    {isLoading ? (
                      <svg
                        width="35"
                        height="37"
                        viewBox="0 0 35 37"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="bg-no-repeat animate-pulse"
                      >
                        <path
                          d="M8.53049 8.62583C8.5304 13.3783 12.3575 17.2449 17.0605 17.2438C21.7634 17.2428 25.5907 13.3744 25.5908 8.62196C25.5909 3.8695 21.7638 0.00287764 17.0608 0.00394405C12.3579 0.00501045 8.53058 3.87336 8.53049 8.62583ZM32.2249 36.3959L34.1204 36.3954L34.1205 34.4799C34.1206 27.0878 28.1667 21.0724 20.8516 21.0741L13.2692 21.0758C5.95224 21.0775 -3.41468e-05 27.0955 -0.000176714 34.4876L-0.000213659 36.4032L32.2249 36.3959Z"
                          fill="#BBBBBB"
                        />
                      </svg>
                    ) : logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Logo"
                        className="h-full w-full object-cover"
                      />
                    ) : projectDetails.logoData ? (
                      <img
                        src={projectDetails?.logoData}
                        alt="User"
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
                    name="logoData"
                    control={control}
                    render={({ field }) => (
                      <>
                        <input
                          id="logo"
                          type="file"
                          name="logo"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            addLogoHandler(file);
                          }}
                        />
                        <label
                          htmlFor="logo"
                          className="p-2 border-2 border-blue-800 items-center rounded-md text-md bg-transparent text-blue-800 cursor-pointer font-extrabold"
                        >
                          Upload logo
                        </label>
                      </>
                    )}
                  />
                </div>
                {errors.logoData && (
                  <span className="mt-1 text-sm text-red-500 font-bold text-start px-4">
                    {errors.logoData.message}
                  </span>
                )}
              </div>
              <div className="z-0 w-full mb-5 group px-4">
                <label
                  htmlFor="reason_to_join_incubator"
                  className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                >
                  Why do you want to join? <span className="text-red-600">*</span>
                </label>
                <select
                  {...register("reason_to_join_incubator")}
                  className={`bg-gray-50 border-2 ${errors.reason_to_join_incubator
                    ? "border-red-500 placeholder:text-red-500"
                    : "border-[#737373]"
                    } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                  required={true}
                >
                  <option className="text-lg font-bold" value="">
                    Select reason
                  </option>
                  <option
                    className="text-lg font-bold"
                    value="listing_and_promotion"
                  >
                    Project listing and promotion
                  </option>
                  <option className="text-lg font-bold" value="Funding">
                    Funding
                  </option>
                  <option className="text-lg font-bold" value="Mentoring">
                    Mentoring
                  </option>
                  <option className="text-lg font-bold" value="Incubation">
                    Incubation
                  </option>
                  <option
                    className="text-lg font-bold"
                    value="Engaging_and_building_community"
                  >
                    Engaging and building community
                  </option>
                </select>
                {errors.reason_to_join_incubator && (
                  <p className="mt-1 text-sm text-red-500 font-bold text-left">
                    {errors.reason_to_join_incubator.message}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3 px-4">
                <div className="z-0 w-full mb-3 group">
                  <label
                    htmlFor="preferred_icp_hub"
                    className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                  >
                    Are you associated with a ICP HUB <span className="text-red-600">*</span>
                  </label>
                  <select
                    {...register("preferred_icp_hub")}
                    className={`bg-gray-50 border-2 ${errors.preferred_icp_hub
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
                  {errors.preferred_icp_hub && (
                    <p className="mt-1 text-sm text-red-500 font-bold text-left">
                      {errors.preferred_icp_hub.message}
                    </p>
                  )}
                </div>
                <div className="z-0 w-full mb-3 group">
                  <label
                    htmlFor="project_area_of_focus"
                    className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                  >
                    Area of focus <span className="text-red-600">*</span>
                  </label>
                  <ReactSelect
                    isMulti
                    options={areaOfExpertise.map((expert) => ({
                      value: expert.name,
                      label: expert.name,
                    }))}
                    menuPortalTarget={document.body}
                    menuPosition={"fixed"}
                    required={"true"}
                    styles={{
                      menuPortal: (base) => ({
                        ...base,
                        zIndex: 9999, // Set the desired z-index value
                      }),
                      control: (provided, state) => ({
                        ...provided,
                        color: "black", // Initial color of the label
                        // Add other control styles if needed
                        paddingBlock: "2px",
                        border: errors.project_area_of_focus
                          ? "2px solid #ef4444"
                          : "2px solid #737373",
                        backgroundColor: "rgb(249 250 251)",
                        // Additional conditional placeholder color if needed
                        "&::placeholder": {
                          color: errors.project_area_of_focus
                            ? "#ef4444"
                            : "currentColor", // Adjust the placeholder color conditionally
                        },
                      }),
                    }}
                    classNamePrefix="select"
                    className="basic-multi-select text-left"
                    placeholder="Select your areas of expertise"
                    name="project_area_of_focus"
                    {...register("project_area_of_focus")}
                    onChange={(selectedOptions) => {
                      // You might need to adapt this part to fit how you handle form data
                      if (selectedOptions && selectedOptions.length > 0) {
                        clearErrors('project_area_of_focus');
                        setValue('project_area_of_focus', selectedOptions
                          .map((option) => option.value)
                          .join(", "))
                      } else {
                        setError('project_area_of_focus', { type: 'required', message: 'Area of focus is required' })
                      }
                    }}
                  />
                  {errors.project_area_of_focus && (
                    <p className="mt-1 text-sm text-red-500 font-bold text-left">
                      {errors.project_area_of_focus.message}
                    </p>
                  )}
                </div>
                <div className="z-0 w-full mb-3 group">
                  <label
                    htmlFor="live_on_icp_mainnet"
                    className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                  >
                    Live on ICP <span className="text-red-600">*</span>
                  </label>
                  <select
                    {...register("live_on_icp_mainnet")}
                    className={`bg-gray-50 border-2 ${errors.live_on_icp_mainnet
                      ? "border-red-500 placeholder:text-red-500"
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
                {isLiveOnICP && (
                  <>
                    <div className="z-0 w-full mb-3 group">
                      <label
                        htmlFor="dapp_link"
                        className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                      >
                        dApp Link <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        name="dapp_link"
                        id="dapp_link"
                        {...register("dapp_link")}
                        className={`bg-gray-50 border-2 ${errors.dapp_link
                          ? "border-red-500 placeholder:text-red-500"
                          : "border-[#737373]"
                          } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                        placeholder="https://"
                      />
                      {errors.dapp_link && (
                        <p className="mt-1 text-sm text-red-500 font-bold text-left">
                          {errors.dapp_link.message}
                        </p>
                      )}
                    </div>
                    <div className="z-0 w-full mb-3 group">
                      <label
                        htmlFor="weekly_active_users"
                        className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                      >
                        Weekly active users <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="number"
                        name="weekly_active_users"
                        id="weekly_active_users"
                        {...register("weekly_active_users")}
                        className={`bg-gray-50 border-2 ${errors.weekly_active_users
                          ? "border-red-500 placeholder:text-red-500"
                          : "border-[#737373]"
                          } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                      />
                      {errors.weekly_active_users && (
                        <p className="mt-1 text-sm text-red-500 font-bold text-left">
                          {errors.weekly_active_users.message}
                        </p>
                      )}
                    </div>
                    <div className="z-0 w-full mb-3 group">
                      <label
                        htmlFor="revenue"
                        className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                      >
                        Revenue (USD) <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="number"
                        name="revenue"
                        id="revenue"
                        {...register("revenue")}
                        className={`bg-gray-50 border-2 ${errors.revenue
                          ? "border-red-500 placeholder:text-red-500"
                          : "border-[#737373]"
                          } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                        placeholder="$"
                      />
                      {errors.revenue && (
                        <p className="mt-1 text-sm text-red-500 font-bold text-left">
                          {errors.revenue.message}
                        </p>
                      )}
                    </div>
                  </>
                )}
                <div className="z-0 w-full mb-3 group">
                  <label
                    htmlFor="multi_chain"
                    className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                  >
                    Are you also multi-chain
                  </label>
                  <select
                    {...register("multi_chain")}
                    className={`bg-gray-50 border-2 ${errors.multi_chain
                      ? "border-red-500 placeholder:text-red-500"
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
                  {errors.multi_chain && (
                    <p className="mt-1 text-sm text-red-500 font-bold text-left">
                      {errors.multi_chain.message}
                    </p>
                  )}
                </div>
                {isMulti_Chain && (
                  <div className="z-0 w-full mb-3 group">
                    <label
                      htmlFor="supports_multichain"
                      className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                    >
                      Please select the chains<span className="text-red-600">*</span>
                    </label>
                    <select
                      {...register("supports_multichain")}
                      className={`bg-gray-50 border-2 ${errors.supports_multichain
                        ? "border-red-500 placeholder:text-red-500"
                        : "border-[#737373]"
                        } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                    >
                      <option className="text-lg font-bold" value="">
                        Select
                      </option>
                      {multiChain?.map((chain, i) => (
                        <option
                          key={i}
                          value={`${chain}`}
                          className="text-lg font-bold"
                        >
                          {chain}
                        </option>
                      ))}
                    </select>
                    {errors.supports_multichain && (
                      <p className="mt-1 text-sm text-red-500 font-bold text-left">
                        {errors.supports_multichain.message}
                      </p>
                    )}
                  </div>
                )}
                <div className="z-0 w-full mb-3 group">
                  <label
                    htmlFor="money_raised_till_now"
                    className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                  >
                    Have you raised any funds in past
                  </label>
                  <select
                    {...register("money_raised_till_now")}
                    className={`bg-gray-50 border-2 ${errors.money_raised_till_now
                      ? "border-red-500 placeholder:text-red-500"
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
                {isMoneyRaised && (
                  <>
                    <div className="z-0 w-full mb-3 group">
                      <label
                        htmlFor="icp_grants"
                        className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                      >
                        Grants <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="number"
                        name="icp_grants"
                        id="icp_grants"
                        {...register("icp_grants")}
                        className={`bg-gray-50 border-2 ${errors.icp_grants
                          ? "border-red-500 placeholder:text-red-500"
                          : "border-[#737373]"
                          } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                        placeholder="$"
                      />
                      {errors.icp_grants && (
                        <p className="mt-1 text-sm text-red-500 font-bold text-left">
                          {errors.icp_grants.message}
                        </p>
                      )}
                    </div>
                    <div className="z-0 w-full mb-3 group">
                      <label
                        htmlFor="investors"
                        className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                      >
                        Investors <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="number"
                        name="investors"
                        id="investors"
                        {...register("investors")}
                        className={`bg-gray-50 border-2 ${errors.investors
                          ? "border-red-500 placeholder:text-red-500"
                          : "border-[#737373]"
                          } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                        placeholder="$"
                      />
                      {errors.investors && (
                        <p className="mt-1 text-sm text-red-500 font-bold text-left">
                          {errors.investors.message}
                        </p>
                      )}
                    </div>
                    <div className="z-0 w-full mb-3 group">
                      <label
                        htmlFor="sns"
                        className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                      >
                        Launchpad <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="number"
                        name="sns"
                        id="sns"
                        {...register("sns")}
                        className={`bg-gray-50 border-2 ${errors.sns
                          ? "border-red-500 placeholder:text-red-500"
                          : "border-[#737373]"
                          } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                        placeholder="$"
                      />
                      {errors.sns && (
                        <p className="mt-1 text-sm text-red-500 font-bold text-left">
                          {errors.sns.message}
                        </p>
                      )}
                    </div>
                    <div className="z-0 w-full mb-3 group">
                      <label
                        htmlFor="money_raised_now"
                        className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                      >
                        Are you currently raising money
                      </label>
                      <select
                        {...register("money_raised_now")}
                        className={`bg-gray-50 border-2 ${errors.money_raised_now
                          ? "border-red-500 placeholder:text-red-500"
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
                      {errors.money_raised_now && (
                        <p className="mt-1 text-sm text-red-500 font-bold text-left">
                          {errors.money_raised_now.message}
                        </p>
                      )}
                    </div>
                    <div className="z-0 w-full mb-3 group">
                      <label
                        htmlFor="target_amount"
                        className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                      >
                        Target Amount (USD) <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="number"
                        name="target_amount"
                        id="target_amount"
                        {...register("target_amount")}
                        className={`bg-gray-50 border-2 ${errors.target_amount
                          ? "border-red-500 placeholder:text-red-500"
                          : "border-[#737373]"
                          } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                        placeholder="$"
                      />
                      {errors.target_amount && (
                        <p className="mt-1 text-sm text-red-500 font-bold text-left">
                          {errors.target_amount.message}
                        </p>
                      )}
                    </div>
                    <div className="z-0 w-full mb-3 group">
                      <label
                        htmlFor="raised_from_other_ecosystem"
                        className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                      >
                        Valuation (USD) <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="number"
                        name="raised_from_other_ecosystem"
                        id="raised_from_other_ecosystem"
                        {...register("raised_from_other_ecosystem")}
                        className={`bg-gray-50 border-2 ${errors.raised_from_other_ecosystem
                          ? "border-red-500 placeholder:text-red-500"
                          : "border-[#737373]"
                          } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                        placeholder="Million"
                      />
                      {errors.raised_from_other_ecosystem && (
                        <p className="mt-1 text-sm text-red-500 font-bold text-left">
                          {errors.raised_from_other_ecosystem.message}
                        </p>
                      )}
                    </div>
                    <div className="z-0 w-full mb-3 group">
                      <label
                        htmlFor="upload_private_documents"
                        className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                      >
                        Upload due diligence documents <span className="text-red-600">*</span>
                      </label>
                      <select
                        {...register("upload_private_documents")}
                        className={`bg-gray-50 border-2 ${errors.upload_private_documents
                          ? "border-red-500 placeholder:text-red-500"
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
                      {errors.upload_private_documents && (
                        <p className="mt-1 text-sm text-red-500 font-bold text-left">
                          {errors.upload_private_documents.message}
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>
              {isPrivateDocument && (
                <>
                  {fields.map((item, index) => (
                    <div key={item.id}>
                      <div className="z-0 w-full mb-3 group px-4">
                        <label
                          htmlFor="title"
                          className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                        >
                          Doc title <span className="text-red-600">*</span>
                        </label>
                        <input
                          {...register(`private_docs.${index}.title`)}
                          className={`bg-gray-50 border-2 ${errors.title1
                            ? "border-red-500 placeholder:text-red-500"
                            : "border-[#737373]"
                            } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                        />
                        {errors.private_docs &&
                          errors.private_docs[index]?.title && (
                            <p>{errors.private_docs[index].title.message}</p>
                          )}
                        <label
                          htmlFor="link"
                          className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                        >
                          Link <span className="text-red-600">*</span>
                        </label>
                        <input
                          {...register(`private_docs.${index}.link`)}
                          className={`bg-gray-50 border-2 ${errors.link
                            ? "border-red-500 placeholder:text-red-500"
                            : "border-[#737373]"
                            } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                        />
                        {errors.private_docs &&
                          errors.private_docs[index]?.link && (
                            <p>{errors.private_docs[index].link.message}</p>
                          )}
                      </div>
                    </div>
                  ))}
                  <div>
                    <button
                      type="button"
                      className="bg-blue-500 rounded-lg text-white p-2"
                      onClick={() => append({ title: "", link: "" })}
                    >
                      Add More
                    </button>
                  </div>
                </>
              )}
              <div>
                <h2 className="block mb-2 px-4 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start">
                  Public Docs
                </h2>
                {fields.map((item, index) => (
                  <div key={item.id}>
                    <div className="z-0 w-full mb-3 group px-4">
                      <label
                        htmlFor="title"
                        className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                      >
                        Title <span className="text-red-600">*</span>
                      </label>
                      <input
                        {...register(`public_docs.${index}.title`)}
                        className={`bg-gray-50 border-2 ${errors.title1
                          ? "border-red-500 placeholder:text-red-500"
                          : "border-[#737373]"
                          } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                      />
                      {errors.public_docs &&
                        errors.public_docs[index]?.title && (
                          <p>{errors.public_docs[index].title.message}</p>
                        )}
                      <label
                        htmlFor="link"
                        className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                      >
                        Link <span className="text-red-600">*</span>
                      </label>
                      <input
                        {...register(`public_docs.${index}.link`)}
                        className={`bg-gray-50 border-2 ${errors.link
                          ? "border-red-500 placeholder:text-red-500"
                          : "border-[#737373]"
                          } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                      />
                      {errors.public_docs &&
                        errors.public_docs[index]?.link && (
                          <p>{errors.public_docs[index].link.message}</p>
                        )}
                    </div>
                  </div>
                ))}
                <div>
                  <button
                    type="button"
                    className="bg-blue-500 rounded-lg text-white p-2"
                    onClick={() => append({ title: "", link: "" })}
                  >
                    Add More
                  </button>
                </div>
              </div>
            </>
          )}
          {step === 1 && (
            <>
              <div className="flex flex-col">
                <div className="flex-row w-full flex justify-start gap-4 items-center">
                  <div className="mb-3 ml-6 h-24 w-24 rounded-full border-2 border-gray-300 flex items-center justify-center overflow-hidden">
                    {isLoading ? (
                      <svg
                        width="35"
                        height="37"
                        viewBox="0 0 35 37"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="bg-no-repeat animate-pulse"
                      >
                        <path
                          d="M8.53049 8.62583C8.5304 13.3783 12.3575 17.2449 17.0605 17.2438C21.7634 17.2428 25.5907 13.3744 25.5908 8.62196C25.5909 3.8695 21.7638 0.00287764 17.0608 0.00394405C12.3579 0.00501045 8.53058 3.87336 8.53049 8.62583ZM32.2249 36.3959L34.1204 36.3954L34.1205 34.4799C34.1206 27.0878 28.1667 21.0724 20.8516 21.0741L13.2692 21.0758C5.95224 21.0775 -3.41468e-05 27.0955 -0.000176714 34.4876L-0.000213659 36.4032L32.2249 36.3959Z"
                          fill="#BBBBBB"
                        />
                      </svg>
                    ) : coverPreview ? (
                      <img
                        src={coverPreview}
                        alt="CoverImage"
                        className="h-full w-full object-cover"
                      />
                    ) : additionalDetails.coverData ? (
                      <img
                        src={additionalDetails?.coverData}
                        alt="User"
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
                    name="coverData"
                    control={control}
                    render={({ field }) => (
                      <>
                        <input
                          id="cover"
                          type="file"
                          name="cover"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            addImageCoverHandler(file);
                          }}
                        />
                        <label
                          htmlFor="cover"
                          className="p-2 border-2 border-blue-800 items-center rounded-md text-md bg-transparent text-blue-800 cursor-pointer font-extrabold"
                        >
                          Upload cover image
                        </label>
                      </>
                    )}
                  />
                </div>
                {errors.coverData && (
                  <span className="mt-1 text-sm text-red-500 font-bold text-start px-4">
                    {errors.coverData.message}
                  </span>
                )}
              </div>
              <div className="z-0 w-full mb-3 group px-4">
                <label
                  htmlFor="is_your_project_registered"
                  className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                >
                  Is your project registered <span className="text-red-600">*</span>
                </label>
                <select
                  {...register("is_your_project_registered")}
                  className={`bg-gray-50 border-2 ${errors.is_your_project_registered
                    ? "border-red-500 placeholder:text-red-500"
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3 px-4">
                {isProjectRegistered && (
                  <>
                    <div className="z-0 w-full mb-3 group">
                      <label
                        htmlFor="type_of_registration"
                        className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                      >
                        Type of registration <span className="text-red-600">*</span>
                      </label>
                      <select
                        {...register("type_of_registration")}
                        className={`bg-gray-50 border-2 ${errors.type_of_registration
                          ? "border-red-500 placeholder:text-red-500"
                          : "border-[#737373]"
                          } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                      >
                        <option className="text-lg font-bold" value="Company">
                          Company
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
                    <div className="z-0 w-full mb-3 group">
                      <label
                        htmlFor="country_of_registration"
                        className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                      >
                        Country of registration <span className="text-red-600">*</span>
                      </label>
                      <select
                        {...register("country_of_registration")}
                        className={`bg-gray-50 border-2 ${errors.country_of_registration
                          ? "border-red-500 placeholder:text-red-500"
                          : "border-[#737373]"
                          } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                        required
                      >
                        <option className="text-lg font-bold" value="">
                          Select your registered country
                        </option>
                        {countries?.map((expert) => (
                          <option
                            key={expert.name}
                            value={`${expert.name}`}
                            className="text-lg font-bold"
                          >
                            {expert.name}
                          </option>
                        ))}
                      </select>

                      {errors.country_of_registration && (
                        <p className="mt-1 text-sm text-red-500 font-bold text-left">
                          {errors.country_of_registration.message}
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </>
          )}
          {StepComponent &&
            React.cloneElement(StepComponent, {
              onSubmit: handleSubmit(onSubmit, errorFunc),
              register,
              errors,
              fields: stepFields,
              toSave: handleSaveStep,
              goToPrevious: handlePrevious,
              goToNext: handleNext,
            })}
          <Toaster />
        </div>
      </div>
    </section>
  );
};

export default CreateProjectRegistration;

import EditIcon from "@mui/icons-material/Edit";
import React, {
  useCallback,
  useRef,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useForm, Controller } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import DetailHeroSection from "../Common/DetailHeroSection";
import { ThreeDots } from "react-loader-spinner";
import { useCountries } from "react-countries";
import ReactSelect from "react-select";
import CompressedImage from "../ImageCompressed/CompressedImage";
import { allHubHandlerRequest } from "../../components/StateManagement/Redux/Reducers/All_IcpHubReducer";
import { uint8ArrayToBase64 } from "../../../../admin_frontend/src/components/Utils/AdminData/saga_function/blobImageToUrl";
import editp from "../../../assets/Logo/edit.png";

const MentorEdit = () => {
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
  const mentorFullData = useSelector(
    (currState) => currState.mentorData.data[0]
  );
  const userCurrentRoleStatusActiveRole = useSelector(
    (currState) => currState.currentRoleStatus.activeRole
  );
  console.log(userFullData)
  // STATES

  // user image states
  const [imagePreview, setImagePreview] = useState(null);
  const [imageData, setImageData] = useState(null);
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
      preferred_icp_hub: yup
        .string()
        .test("is-non-empty", "ICP Hub selection is required", (value) =>
          /\S/.test(value)
        )
        .required("ICP Hub selection is required"),
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
      category_of_mentoring_service: yup
        .string()
        .test("is-non-empty", "Selecting a service is required", (value) =>
          /\S/.test(value)
        )
        .required("Selecting a service is required"),
      icp_hub_or_spoke: yup
        .string()
        .required("Required")
        .oneOf(["true", "false"], "Invalid value"),
      hub_owner: yup
        .string()
        .when("icp_hub_or_spoke", (val, schema) =>
          val && val[0] === "true"
            ? schema
                .test(
                  "is-non-empty",
                  "ICP Hub selection is required",
                  (value) => /\S/.test(value)
                )
                .required("ICP Hub selection is required")
            : schema
        ),
      mentor_website_url: yup
        .string()
        .nullable(true)
        .optional()
        .url("Invalid url"),
      years_of_mentoring: yup
        .number()
        .typeError("You must enter a number")
        .positive("Must be a positive number")
        .required("Years of experience mentoring startups is required"),
      mentor_linkedin_url: yup
        .string()
        // .test("is-non-empty", "LinkedIn url is required", (value) =>
        //   /\S/.test(value)
        // )
        // .matches(
        //   /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/,
        //   "Invalid LinkedIn URL"
        // )
        .url("Invalid url")
        .required("LinkedIn url is required"),
    })
    .required();

  const defaultValues = {
    preferred_icp_hub: "ICP Hub, India",
    multi_chain: "No",
    multi_chain_names: ["Base", "Solana"],
    category_of_mentoring_service: ["Branding ", " Listing"],
    icp_hub_or_spoke: "No",
    hub_owner: "ICP Hub, India",
    mentor_website_url: "https://website.com",
    years_of_mentoring: "1",
    mentor_linkedin_url: "https://website.com",
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

  // clear image func
  const clearImageFunc = (val) => {
    let field_id = val;
    setValue(field_id, null);
    clearErrors(field_id);
    setImageData(null);
    setImagePreview(null);
  };

  // form submit handler func
  const onSubmitHandler = async (data) => {
    if (actor) {
      const mentorData = {
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
        // mentor data
        preferred_icp_hub: [data?.preferred_icp_hub || ""],
        icp_hub_or_spoke: data?.icp_hub_or_spoke === "true" ? true : false,
        hub_owner: [
          data?.icp_hub_or_spoke === "true" && data?.hub_owner
            ? data?.hub_owner
            : "",
        ],
        hub_owner: [data?.hub_owner || ""],
        category_of_mentoring_service: data?.category_of_mentoring_service,
        years_of_mentoring: data.years_of_mentoring.toString(),
        linkedin_link: data?.mentor_linkedin_url,
        multichain: [
          data?.multi_chain === "true" && data?.multi_chain_names
            ? data?.multi_chain_names
            : "",
        ],
        website: [data?.mentor_website_url || ""],
        // mentor data not exiting on frontend or raw variables
        existing_icp_mentor: false,
        existing_icp_project_porfolio: [
          data?.existing_icp_project_porfolio || "",
        ],
        area_of_expertise: "",
        reason_for_joining: [""],
      };
      try {
        if (userCurrentRoleStatusActiveRole === "mentor") {
          await actor.update_mentor(mentorData).then((result) => {
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
          userCurrentRoleStatusActiveRole === "project" ||
          userCurrentRoleStatusActiveRole === "vc"
        ) {
          await actor.register_mentor_candid(mentorData).then((result) => {
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
  const setCategoryOfMentoringServiceSelectedOptionsHandler = (val) => {
    setCategoryOfMentoringServiceSelectedOptions(
      val
        ? val.split(", ").map((reason) => ({ value: reason, label: reason }))
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
      setValue(
        "type_of_profile",
        val?.user_data?.type_of_profile?.[0]
          ? val?.user_data?.type_of_profile?.[0]
          : ""
      );
      setValue(
        "reasons_to_join_platform",
        val?.reason_to_join ? val?.reason_to_join.join(", ") : ""
      );
      setReasonOfJoiningSelectedOptionsHandler(val?.reason_to_join);
    }
  };
  // set mentor values handler
  const setMentorValuesHandler = (val) => {
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
      // setImagePreview(val?.user_data?.profile_picture?.[0] ?? "");
      setImagePreview(
        val?.user_data?.profile_picture?.[0] instanceof Uint8Array
          ? uint8ArrayToBase64(val?.user_data?.profile_picture?.[0])
          : ""
      );
      setValue(
        "type_of_profile",
        val?.user_data?.type_of_profile?.[0]
          ? val?.user_data?.type_of_profile?.[0]
          : ""
      );
      setValue(
        "reasons_to_join_platform",
        val?.user_data?.reason_to_join
          ? val?.user_data?.reason_to_join.join(", ")
          : ""
      );
      setReasonOfJoiningSelectedOptionsHandler(val?.user_data?.reason_to_join);
      setValue("area_of_expertise", val?.area_of_expertise?.[0] ?? "");
      setValue(
        "category_of_mentoring_service",
        val?.category_of_mentoring_service ?? ""
      );
      setCategoryOfMentoringServiceSelectedOptionsHandler(
        val?.category_of_mentoring_service ?? null
      );
      setValue("existing_icp_mentor", val?.existing_icp_mentor ?? "");
      setValue(
        "existing_icp_project_porfolio",
        val?.existing_icp_project_porfolio?.[0] ?? ""
      );
      setValue("icp_hub_or_spoke", val?.icp_hub_or_spoke ?? "");
      if (val?.icp_hub_or_spoke === true) {
        setValue("icp_hub_or_spoke", "true");
      } else {
        setValue("icp_hub_or_spoke", "false");
      }
      setValue("hub_owner", val?.hub_owner ? val?.hub_owner?.[0] : "");
      setValue("mentor_linkedin_url", val?.linkedin_link ?? "");
      if (val?.multichain?.[0]) {
        setValue("multi_chain", "true");
      } else {
        setValue("multi_chain", "false");
      }
      setValue(
        "multi_chain_names",
        val?.multichain?.[0] ? val?.multichain?.[0] : ""
      );
      setMultiChainSelectedOptionsHandler(val?.multichain ?? null);
      setValue(
        "preferred_icp_hub",
        val?.preferred_icp_hub ? val?.preferred_icp_hub?.[0] : ""
      );
      setValue("mentor_website_url", val?.website?.[0] ?? "");
      setValue("years_of_mentoring", val?.years_of_mentoring ?? "");
    }
  };

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
    if (mentorFullData) {
      console.log("Mentor full data ==>", mentorFullData);
      setMentorValuesHandler(mentorFullData);
      setEditMode(true);
    } else if (userFullData) {
      setValuesHandler(userFullData);
    }
  }, [userFullData, mentorFullData]);

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
        if (userCurrentRoleStatusActiveRole === "mentor") {
          const result = await actor.get_mentor();
          if (result) {
            console.log("result", result?.[0]);
            setImageData(result?.[0]?.user_data?.profile_picture?.[0] ?? null);
            setValue(
              "type_of_profile",
              result?.[0]?.user_data?.type_of_profile?.[0]
                ? result?.[0]?.user_data?.type_of_profile?.[0]
                : ""
            );
            setValue(
              "hub_owner",
              result?.[0]?.hub_owner?.[0] ? result?.[0]?.hub_owner?.[0] : ""
            );
            setValue(
              "preferred_icp_hub",
              result?.[0]?.preferred_icp_hub?.[0]
                ? result?.[0]?.preferred_icp_hub?.[0]
                : ""
            );
          } else {
            setImageData(null);
            setValue("type_of_profile", "");
            setValue("hub_owner", "");
            setValue("preferred_icp_hub", "");
          }
        } else if (
          userCurrentRoleStatusActiveRole === null ||
          userCurrentRoleStatusActiveRole === "user" ||
          userCurrentRoleStatusActiveRole === "project" ||
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

  console.log("Mentor full data ==>", mentorFullData);
  console.log("userFullData" ,userFullData )

  const [mentorData, setMentorData] = useState(defaultValues);
  const [tempData, setTempData] = useState(mentorData);

  const [edit, setEdit] = useState({
    preferedIcpHub: false,
    multipleEcosystem: false,
    mentorCategory: false,
    icpHubOrSpoke: false,
    websiteLink: false,
    mentoringYears: false,
    linkedinLink: false,
  });

  const handleEditClick = (field) => {
    setEdit({ ...edit, [field]: true });
  };

  const handleSave = () => {
    // Validate form and update the main state
    const isFormValid = Object.keys(errors).length === 0;

    if (isFormValid) {
      setMentorData(tempData); // Update the main mentor data state
      setEdit({
        preferedIcpHub: false,
        multipleEcosystem: false,
        mentorCategory: false,
        icpHubOrSpoke: false,
        websiteLink: false,
        mentoringYears: false,
        linkedinLink: false,
      });
    } else {
      console.log("Validation failed:", errors);
    }
  };
  const handleCancel = () => {
    setEdit({
      preferedIcpHub: false,
      multipleEcosystem: false,
      mentorCategory: false,
      icpHubOrSpoke: false,
      websiteLink: false,
      mentoringYears: false,
      linkedinLink: false,
    });
    setTempData(mentorData);
  };

  const editableRef = useRef(null);

  const handleClickOutside = (event) => {
    if (editableRef.current && !editableRef.current.contains(event.target)) {
      setEdit({
        preferedIcpHub: false,
        multipleEcosystem: false,
        mentorCategory: false,
        icpHubOrSpoke: false,
        websiteLink: false,
        mentoringYears: false,
        linkedinLink: false,
      });
    }
  };

  const handleInputChange = (e, field) => {
    setValue(field, e.target.value, { shouldValidate: true });
    setTempData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // const [mentorData,setMentorValue]=useState(defaultValues);

  return (
    <div ref={editableRef} className=" bg-white">
      <form>
        <div className="my-1 relative group hover:bg-slate-50 rounded p-1 mb-1">
          <div className="absolute right-0 top-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <img
              src={editp}
              className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
              alt="edit"
              onClick={() => handleEditClick("preferedIcpHub")}
            />
          </div>
          <label className="block mb-2 text-xs font-semibold text-gray-500">
            ICP HUB YOU WILL LIKE TO BE ASSOCIATED{" "}
          </label>
          {edit.preferedIcpHub ? (
            <div className="">
              <select
                {...register("preferred_icp_hub")}
                value={tempData.preferred_icp_hub}
                onChange={(e) => handleInputChange(e, "preferred_icp_hub")}
                className="shadow appearance-none border rounded w-full py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option className="text-lg font-medium" value="">
                  Select your ICP Hub
                </option>
                {getAllIcpHubs?.map((hub) => (
                  <option
                    key={hub.id}
                    value={`${hub.name} ,${hub.region}`}
                    className="text-lg font-medium"
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
            <div className="flex justify-between items-center cursor-pointer p-1">
              <span>{getValues("preferred_icp_hub")} </span>
            </div>
          )}
        </div>

        <div className="my-1 relative group hover:bg-slate-50 rounded p-1 mb-1">
          <div className="absolute right-1 top-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <img
              src={editp}
              className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
              alt="edit"
              onClick={() => handleEditClick("multipleEcosystem")}
            />
          </div>
          <label className="block mb-2 text-xs font-semibold text-gray-500">
            {" "}
            DO YOU MENTOR MULTIPLE ECOSYSTEMS{" "}
          </label>
          {edit.multipleEcosystem ? (
            <div>
              <select
                {...register("multi_chain")}
                value={tempData.multi_chain}
                onChange={(e) => handleInputChange(e, "multi_chain")}
                className="shadow appearance-none border rounded w-full py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option className="text-lg" value="No">
                  No
                </option>
                <option className="text-lg" value="Yes">
                  Yes
                </option>
              </select>
            </div>
          ) : (
            <div className="flex justify-between items-center cursor-pointer p-1">
              <span>{getValues("multi_chain")}</span>
            </div>
          )}
        </div>
        {watch("multi_chain") === "Yes" && (
          <div className="relative z-0 group mb-4">
            <div className="flex justify-between items-center">
              <label className="font-semibold  text-xs text-gray-500 uppercase mb-1">
                PLEASE SELECT CHAINS
              </label>
              <img
                src={editp}
                className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
                alt="edit"
                onClick={() => handleEditClick("multi_chain_names")}
              />
            </div>
            {edit.multi_chain_names ? (
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
                      selectedOptions.map((option) => option.value).join(", "),
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
            ) : (
              <div className="flex flex-wrap gap-2 cursor-pointer py-1">
                {getValues("multi_chain_names") &&
                typeof getValues("multi_chain_names") === "string" ? (
                  getValues("multi_chain_names")
                    .split(", ")
                    .map((category, index) => (
                      <span
                        key={index}
                        className="border-2 border-gray-500 rounded-full text-gray-700 text-xs px-2 py-1"
                      >
                        {category}
                      </span>
                    ))
                ) : (
                  <span className="border-2 border-gray-500 rounded-full text-gray-700 text-xs px-2 py-1">
                    Solana
                  </span>
                )}
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
              onClick={() => handleEditClick("mentorCategory")}
            />
          </div>
          <label className="block mb-2 text-xs font-semibold text-gray-500">
            CATEGORIES OF MENTORING SERVICES
          </label>
          {edit.mentorCategory ? (
            <div className="">
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
                value={categoryOfMentoringServiceSelectedOptions}
                options={categoryOfMentoringServiceOptions}
                classNamePrefix="select"
                className="basic-multi-select w-full text-start"
                placeholder="Select a service"
                name="category_of_mentoring_service"
                onChange={(selectedOptions) => {
                  if (selectedOptions && selectedOptions.length > 0) {
                    setCategoryOfMentoringServiceSelectedOptions(
                      selectedOptions
                    );
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
              {errors.category_of_mentoring_service && (
                <p className="mt-1 text-sm text-red-500 font-bold text-left">
                  {errors.category_of_mentoring_service.message}
                </p>
              )}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 cursor-pointer py-1">
              {getValues("category_of_mentoring_service") &&
              typeof getValues("category_of_mentoring_service") === "string" ? (
                getValues("category_of_mentoring_service")
                  .split(", ")
                  .map((category, index) => (
                    <span
                      key={index}
                      className="border-2 border-gray-500 rounded-full text-gray-700 text-xs px-2 py-1"
                    >
                      {category}
                    </span>
                  ))
              ) : (
                <span className="border-2 border-gray-500 rounded-full text-gray-700 text-xs px-2 py-1">
                  Branding
                </span>
              )}
            </div>
          )}
        </div>

        <div className="my-1 relative group hover:bg-slate-50 rounded p-1 mb-2">
          <div className="absolute right-2 top-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <img
              src={editp}
              className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
              alt="edit"
              onClick={() => handleEditClick("icpHubOrSpoke")}
            />
          </div>
          <label className="block mb-2 text-xs font-semibold text-gray-500">
            ARE YOU ICP HUB/SPOKE{" "}
          </label>
          {edit.icpHubOrSpoke ? (
            <div>
              <select
                {...register("icp_hub_or_spoke")}
                value={tempData.icp_hub_or_spoke}
                onChange={(e) => handleInputChange(e, "icp_hub_or_spoke")}
                className="shadow appearance-none border rounded w-full py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option className="text-lg" value="No">
                  No
                </option>
                <option className="text-lg" value="Yes">
                  Yes
                </option>
              </select>
            </div>
          ) : (
            <div className="flex justify-between items-center cursor-pointer p-1">
              <span>{getValues("icp_hub_or_spoke")} </span>
            </div>
          )}
        </div>
        {watch("icp_hub_or_spoke") === "Yes" && (
          <div className="relative z-0 group mb-6">
            <div className="flex justify-between items-center">
              <label className="font-semibold text-xs text-gray-500 uppercase mb-1">
                HUB OWNER{" "}
              </label>
              <img
                src={editp}
                className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
                alt="edit"
                onClick={() => handleEditClick("hub_owner")}
              />
            </div>
            {edit.hub_owner ? (
              <div>
                <select
                  {...register("hub_owner")}
                  value={tempData.hub_owner}
                  onChange={(e) => handleInputChange(e, "hub_owner")}
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
                      value={`${hub.name} ,${hub.region}`}
                      className="text-lg font-medium"
                    >
                      {hub.name}, {hub.region}
                    </option>
                  ))}
                </select>
                {errors.hub_owner && (
                  <p className="mt-1 text-sm text-red-500 font-bold text-left">
                    {errors.hub_owner.message}
                  </p>
                )}
              </div>
            ) : (
              <div className="flex justify-between items-center cursor-pointer py-1">
                <span className="mr-2 text-sm">{getValues("hub_owner")} </span>
              </div>
            )}
          </div>
        )}

        <div className="my-1 relative group hover:bg-slate-50 rounded p-1 mb-2">
          <div className="absolute right-2 top-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <img
              src={editp}
              className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
              alt="edit"
              onClick={() => handleEditClick("websiteLink")}
            />
          </div>

          <label className="block mb-2 text-xs font-semibold text-gray-500">
            WEBSITE LINK
          </label>
          {edit.websiteLink ? (
            <div>
              <input
                {...register("mentor_website_url")}
                type="url"
                value={tempData.mentor_website_url}
                onChange={(e) => handleInputChange(e, "mentor_website_url")}
                name="mentor_website_url"
                placeholder="Enter your website url"
                className="block w-full border border-gray-300 rounded-md p-[2px]"
              />
              {errors?.mentor_website_url && (
                <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                  {errors?.mentor_website_url?.message}
                </span>
              )}
            </div>
          ) : (
            <div className="flex justify-between items-center cursor-pointer p-1">
              <span>{getValues("mentor_website_url")} </span>
            </div>
          )}
        </div>

        <div className="my-1 relative group hover:bg-slate-50 rounded p-1 mb-2">
          <div className="absolute right-2 top-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <img
              src={editp}
              className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
              alt="edit"
              onClick={() => handleEditClick("mentoringYears")}
            />
          </div>

          <label className="block mb-2 text-xs font-semibold text-gray-500">
            YEARS OF MENTORING <span className="text-red-500 ml-2">*</span>{" "}
          </label>
          {edit.mentoringYears ? (
            <div>
              <input
                {...register("years_of_mentoring")}
                type="number"
                name="years_of_mentoring"
                placeholder="Enter your linkedin url"
                value={tempData.years_of_mentoring}
                onChange={(e) => handleInputChange(e, "years_of_mentoring")}
                className="block w-full border border-gray-300 rounded-md p-[2px]"
                required
              />
              {errors?.years_of_mentoring && (
                <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                  {errors?.years_of_mentoring?.message}
                </span>
              )}
            </div>
          ) : (
            <div className="flex justify-between items-center cursor-pointer p-1">
              <span>{getValues("years_of_mentoring")} </span>
            </div>
          )}
        </div>

        <div className="my-1 relative group hover:bg-slate-50 rounded p-1 mb-2">
          <div className="absolute right-2 top-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <img
              src={editp}
              className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
              alt="edit"
              onClick={() => handleEditClick("linkedinLink")}
            />
          </div>

          <label className="block mb-2 text-xs font-semibold text-gray-500">
            LINKEDIN LINK <span className="text-red-500 ml-2">*</span>
          </label>
          {edit.linkedinLink ? (
            <div>
              <input
                {...register("mentor_linkedin_url")}
                type="url"
                value={tempData.mentor_linkedin_url}
                onChange={(e) => handleInputChange(e, "mentor_linkedin_url")}
                name="mentor_linkedin_url"
                placeholder="Enter your linkedin url"
                className="block w-full border border-gray-300 rounded-md p-[2px]"
                required
              />
              {errors?.mentor_linkedin_url && (
                <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                  {errors?.mentor_linkedin_url?.message}
                </span>
              )}
            </div>
          ) : (
            <div className="flex justify-between items-center cursor-pointer p-1">
              <span>{getValues("mentor_linkedin_url")} </span>
            </div>
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

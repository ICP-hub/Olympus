import React, { useState, useRef, useEffect } from "react";
import ProfileImages from "../../../assets/Logo/ProfileImage.png";
import edit from "../../../assets/Logo/edit.png";
import VerifiedIcon from "@mui/icons-material/Verified";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import ArrowOutwardOutlinedIcon from "@mui/icons-material/ArrowOutwardOutlined";
import Select from "react-select";
import toast, { Toaster } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useCountries } from "react-countries";
import { useSelector } from "react-redux";
import { LinkedIn, GitHub, Telegram, Language } from "@mui/icons-material";
import InvestorDetail from "./InvestorDetail";
import MentorEdit from "../../component/Mentors/MentorEdit";
import { FaEdit, FaPlus } from "react-icons/fa";
import ProjectDetail from "./ProjectDetail";
import { Principal } from "@dfinity/principal";
import { ThreeDots } from "react-loader-spinner";
import ReactSelect from "react-select";
import uint8ArrayToBase64 from "../Utils/uint8ArrayToBase64";
const ProfileDetail = () => {
  const principal = useSelector((currState) => currState.internet.principal);
  const { countries } = useCountries();
  const userFullData = useSelector((currState) => currState.userData.data.Ok);
  console.log("User aa raha hai", userFullData);
  const actor = useSelector((currState) => currState.actors.actor);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [defaultValues, setDefaultValues] = useState({
    email: "",
    bio: "",
    area_of_interest: [],
    country: "Select your country",
    area_of_interest: [],
    reason_to_join: [],
    country: [],
    full_name: "",
    type_of_profile: "",
    profile_picture: null,
  });
  const [interestedDomainsOptions, setInterestedDomainsOptions] = useState([]);
  const [
    interestedDomainsSelectedOptions,
    setInterestedDomainsSelectedOptions,
  ] = useState([]);
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
  const typeOfProfile = useSelector(
    (currState) => currState.profileTypes.profiles
  );
  const [reasonOfJoiningSelectedOptions, setReasonOfJoiningSelectedOptions] =
    useState([]);
  const [typeOfProfileOptions, setTypeOfProfileOptions] = useState([]);
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
  const validationSchema = yup
    .object()
    .shape({
      full_name: yup
        .string()
        .test("is-non-empty", "Full name is required", (value) =>
          /\S/.test(value)
        )
        .required("Full name is required"),
      email: yup
        .string()
        .email("Invalid email")
        .nullable(true)
        .optional()
        .test(
          "no-leading-trailing-spaces",
          "Email should not have leading or trailing spaces",
          function (value) {
            if (value !== undefined && value !== null) {
              return value.trim() === value;
            }
            return true;
          }
        ),
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
      area_of_interest: yup
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
      reason_to_join: yup
        .array()
        .of(yup.string().required("Selecting a reason is required")),
      // .min(1, "Selecting at least one reason is required"),
      // .required("Selecting a reason is required"),

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
    })
    .required();

  const [socialLinks, setSocialLinks] = useState({});

  useEffect(() => {
    console.log("userFullData:", userFullData); // Ensure data is correct
    if (userFullData?.social_links?.length) {
      const links = {};
      userFullData.social_links.forEach((linkData, index) => {
        console.log(`Processing link #${index + 1}:`, linkData); // Debugging each link

        // Since linkData is an array with a 'link' key, we extract the URL like this:
        const url = linkData[0].link[0];

        // Determine the type of link (e.g., LinkedIn, GitHub) based on the URL
        if (url.includes("linkedin.com")) {
          links["LinkedIn"] = url;
        } else if (url.includes("github.com")) {
          links["GitHub"] = url;
        } else if (url.includes("t.me") || url.includes("telegram")) {
          links["Telegram"] = url;
        } else {
          links[`Link${index + 1}`] = url; // Default case, just to handle other links
        }
      });
      setSocialLinks(links);
      console.log("Final socialLinks object:", links); // Verify final state
    }
  }, [userFullData]);

  const [isEditingLink, setIsEditingLink] = useState({});

  const handleLinkEditToggle = (link) => {
    setIsEditingLink((prev) => ({
      ...prev,
      [link]: !prev[link],
    }));
  };

  const handleLinkChange = (e, link) => {
    setSocialLinks((prev) => ({
      ...prev,
      [link]: e.target.value,
    }));
  };

  const handleSaveLinks = () => {
    console.log("Links saved:", socialLinks);
    setIsEditingLink({});
  };

  const getIconForLink = (url) => {
    console.log("URL being checked:", url); // Add this line for debugging
    if (url.includes("linkedin.com")) {
      console.log("LinkedIn detected");
      return LinkedIn;
    } else if (url.includes("github.com")) {
      console.log("GitHub detected");
      return GitHub;
    } else if (url.includes("t.me") || url.includes("telegram")) {
      console.log("Telegram detected");
      return Telegram;
    } else {
      console.log("Generic link detected");
      return Language;
    }
  };

  const {
    register,
    handleSubmit,
    clearErrors,
    setValue,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "all",
    defaultValues,
  });

  console.log("Form Errors:", errors); // Log form errors
  console.log("Is Form Valid:", isValid); // Check if form is valid

  useEffect(() => {
    if (userFullData) {
      const defaultValues = {
        email: userFullData.email?.[0] ?? "",
        bio: userFullData.bio?.[0] ?? "",
        area_of_interest: userFullData.area_of_interest ?? [],
        country: userFullData.country ?? "Select your country", // Ensure a default value is set
        type_of_profile: userFullData.type_of_profile ?? [],
        reasonToJoin: userFullData?.reason_to_join?.[0],
        full_name: userFullData?.full_name,
        openchat_username: userFullData.openchat_username?.[0],
        profilePicture:
          userFullData?.profile_picture?.[0].length > 0
            ? uint8ArrayToBase64(userFullData?.profile_picture[0])
            : null,
      };

      Object.entries(defaultValues).forEach(([key, value]) => {
        setValue(key, value); // Set the form values
      });
      setDefaultValues(defaultValues); // Update the state
    }
  }, [userFullData, setValue]);

  const [isEditing, setIsEditing] = useState({
    email: false,
    tagline: false,
    bio: false,
    area_of_interest: false,
    country: false,
    reason_to_join: false,
  });

  const [profileData, setProfileData] = useState(defaultValues);
  const [tempData, setTempData] = useState(profileData);
  const containerRef = useRef(null);

  const handleEditToggle = (field) => {
    setIsEditing({ ...isEditing, [field]: !isEditing[field] });
  };

  // Function to handle image upload and conversion
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const compressedFile = await CompressedImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result); // Display the image preview
        };
        reader.readAsDataURL(compressedFile);

        // Convert the file to Uint8Array
        const byteArray = await compressedFile.arrayBuffer();
        setImageData(Array.from(new Uint8Array(byteArray))); // Store Uint8Array in state
      } catch (error) {
        setError("image", {
          type: "manual",
          message: "Could not process image, please try another.",
        });
      }
    }
  };
  const areaOfExpertise = useSelector(
    (currState) => currState.expertiseIn.expertise
  );

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

  const handleInputChange = (e, field) => {
    setValue(field, e.target.value, { shouldValidate: true });
    setTempData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  // const handleSave = () => {
  //   const isFormValid = Object.keys(errors).length === 0;

  //   if (isFormValid) {
  //     setProfileData(tempData);
  //     setIsEditing({
  //       email: false,
  //       tagline: false,
  //       bio: false,
  //       area_of_interest: false,
  //       location: false,
  //       reason_to_join: false,
  //     });
  //   } else {
  //     console.log("Validation failed:", errors);
  //   }
  // };
  const handleSave = async (data) => {
    console.log("data", data); // Debugging line

    try {
      const convertedPrincipal = await Principal.fromText(principal);

      const user_data = {
        bio: data?.bio ? [data.bio] : [""],
        full_name: data?.full_name,
        email: [data?.email],
        openchat_username: [data?.openchat_user_name],
        country: data?.country,
        area_of_interest: data?.area_of_interest,
        type_of_profile: [data?.type_of_profile || ""],
        reason_to_join: data.reason_to_join || [],
        profile_picture: userFullData.profile_picture
          ? [userFullData.profile_picture]
          : null,
        social_links: Object.entries(socialLinks).map(([key, value]) => ({
          platform: key,
          link: [value],
        })),
      };

      console.log("Sending user_data to backend:", user_data); // Debugging line

      const result = await actor.update_user_data(
        convertedPrincipal,
        user_data
      );

      if ("Ok" in result) {
        toast.success("User profile updated successfully");
        setTimeout(() => {
          window.country.href = "/";
        }, 500);
      } else {
        console.log("Error:", result);
        toast.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error sending data to the backend:", error);
      toast.error("Failed to update profile");
    }
  };

  const handleCancel = () => {
    setIsEditing({
      email: false,
      tagline: false,
      bio: false,
      area_of_interest: false,
      country: false,
      reason_to_join: false,
    });
    setTempData(profileData);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const isAnyFieldEditing = Object.values({
        ...isEditing,
        ...isEditingLink,
      }).some((value) => value);

      if (
        isAnyFieldEditing &&
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        handleSave();
        setIsEditingLink({});
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditing, isEditingLink]);

  const [activeTab, setActiveTab] = useState("general");

  const handleChange = (tab) => {
    setActiveTab(tab);
  };

  const userRole = useSelector(
    (currState) => currState.currentRoleStatus.activeRole
  );
  const tabs = [
    { role: "general", label: "General" },
    userRole === "vc" && { role: "vc", label: "Investor" },
    userRole === "mentor" && { role: "mentor", label: "Mentor" },
    userRole === "project" && { role: "project", label: "Project" },
  ].filter(Boolean);

  const fileInputRef = useRef(null);

  const handleEditClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // set values handler
  const setValuesHandler = (val) => {
    if (val) {
      setValue("full_name", val?.full_name ?? "");
      setValue("email", val?.email?.[0] ?? "");
      setValue("openchat_user_name", val?.openchat_username?.[0] ?? "");
      setValue("bio", val?.bio?.[0] ?? "");
      setValue("country", val?.country ?? "");
      setValue("domains_interested_in", val?.area_of_interest ?? "");
      setInterestedDomainsSelectedOptionsHandler(val?.area_of_interest ?? null);
      setImagePreview(val?.profile_picture?.[0] ?? null);
      setValue("type_of_profile", val?.type_of_profile?.[0]);
      setValue(
        "reasons_to_join_platform",
        val?.reason_to_join ? val?.reason_to_join.join(", ") : ""
      );
      setReasonOfJoiningSelectedOptionsHandler(val?.reason_to_join);
    }
  };
  const onErrorHandler = (val) => {
    console.log("Validation errors:", val); // Add this to log validation errors
    toast.error("Empty fields or invalid values, please recheck the form");
  };
  const handleReasonToJoinChange = (selectedOptions) => {
    const selectedValues = selectedOptions.map((option) => option.value);

    console.log("Selected Options:", selectedOptions); // Check what is being selected
    console.log("Selected Values:", selectedValues); // Check the values

    setReasonOfJoiningSelectedOptions(selectedOptions);
    setValue("reason_to_join", selectedValues, { shouldValidate: true });
    setReasonOfJoiningSelectedOptionsHandler((prev) => ({
      ...prev,
      reason_to_join: selectedValues,
    }));
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
  const ProfileImage = userFullData?.profile_picture[0];
  const full_name = userFullData?.full_name;
  const openchat_username = userFullData?.openchat_username[0];
  const email = userFullData?.email[0];
  const bio = userFullData?.bio[0];
  const country = userFullData?.country;
  const type_of_profile = userFullData?.type_of_profile;
  const area_of_interest = userFullData?.area_of_interest;

  useEffect(() => {
    if (userFullData) {
      setValuesHandler(userFullData);
      setIsEditing(true);
    }
  }, [userFullData]);
  return (
    <div
      ref={containerRef}
      className="container bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden w-full max-w-[400px]"
    >
      <div className="relative h-1 bg-gray-200">
        <div className="absolute left-0 top-0 h-full bg-green-500 w-1/3"></div>
      </div>
      {activeTab === "general" && (
        <div className="p-6 bg-gray-50">
          <div className="relative w-24 h-24 mx-auto rounded-full mb-4 group">
            <img
              src={ProfileImage}
              alt={full_name}
              className="w-full h-full rounded-full object-cover"
            />
            <div className="absolute inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <FaPlus className="text-white text-xl" />
              <input
                id="file-upload"
                type="file"
                onChange={handleImageUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
                accept="image/*"
              />
            </div>
          </div>

          <div className="flex items-center justify-center mb-1">
            <VerifiedIcon className="text-blue-500 mr-1" fontSize="small" />
            <h2 className="text-xl font-semibold">{full_name}</h2>
          </div>
          <p className="text-gray-600 text-center mb-4">{openchat_username}</p>
          <button
            type="button"
            className="w-full h-[#155EEF] bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 mb-6 flex items-center justify-center"
          >
            Get in touch
            <ArrowOutwardOutlinedIcon className="ml-1" fontSize="small" />
          </button>
        </div>
      )}
      {userRole === "vc" && activeTab === "vc" && (
        <div
          className="p-6 bg-gray-50 relative cursor-pointer"
          style={{
            backgroundImage: `url(${ProfileImages})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute top-0 right-0 p-2  cursor-pointer">
            <FaEdit className="text-white text-xl cursor-pointer" />
            <input
              id="file-upload"
              type="file"
              className="absolute inset-0 opacity-0 cursor-pointer"
              accept="image/*"
            />
          </div>
          <div className="relative w-24 h-24 mx-auto rounded-full mb-4 group">
            <img
              src={ProfileImages}
              alt={full_name}
              className="w-full h-full rounded-full object-cover"
            />
            <div className="absolute inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <FaPlus className="text-white text-xl" />
              <input
                id="file-upload"
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer"
                accept="image/*"
              />
            </div>
          </div>

          <div className="flex items-center justify-center mb-1">
            <VerifiedIcon className="text-blue-500 mr-1" fontSize="small" />
            <h2 className="text-xl font-semibold">{full_name}</h2>
          </div>
          <p className="text-gray-600 text-center mb-4">{openchat_username}</p>
          <button
            type="button"
            className="w-full h-[#155EEF] bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 mb-6 flex items-center justify-center"
          >
            Get in touch
            <ArrowOutwardOutlinedIcon className="ml-1" fontSize="small" />
          </button>
        </div>
      )}
      {userRole === "mentor" && activeTab === "mentor" && (
        <div
          className="p-6 bg-gray-50 relative cursor-pointer"
          style={{
            backgroundImage: `url(${ProfileImages})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute top-0 right-0 p-2  cursor-pointer">
            <FaEdit className="text-white text-xl cursor-pointer" />
            <input
              id="file-upload"
              type="file"
              className="absolute inset-0 opacity-0 cursor-pointer"
              accept="image/*"
            />
          </div>
          <div className="relative w-24 h-24 mx-auto rounded-full mb-4 group">
            <img
              src={ProfileImages}
              alt={full_name}
              className="w-full h-full rounded-full object-cover"
            />
            <div className="absolute inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <FaPlus className="text-white text-xl" />
              <input
                id="file-upload"
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer"
                accept="image/*"
              />
            </div>
          </div>

          <div className="flex items-center justify-center mb-1">
            <VerifiedIcon className="text-blue-500 mr-1" fontSize="small" />
            <h2 className="text-xl font-semibold">{full_name}</h2>
          </div>
          <p className="text-gray-600 text-center mb-4">{openchat_username}</p>
          <button
            type="button"
            className="w-full h-[#155EEF] bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 mb-6 flex items-center justify-center"
          >
            Get in touch
            <ArrowOutwardOutlinedIcon className="ml-1" fontSize="small" />
          </button>
        </div>
      )}
      {userRole === "project" && activeTab === "project" && (
        <div
          className="p-6 bg-gray-50 relative cursor-pointer"
          style={{
            backgroundImage: `url(${ProfileImages})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute top-0 right-0 p-2  cursor-pointer">
            <FaEdit className="text-white text-xl cursor-pointer" />
            <input
              id="file-upload"
              type="file"
              className="absolute inset-0 opacity-0 cursor-pointer"
              accept="image/*"
            />
          </div>
          <div className="relative w-24 h-24 mx-auto rounded-full mb-4 group">
            <img
              src={ProfileImages}
              alt={full_name}
              className="w-full h-full rounded-full object-cover"
            />
            <div className="absolute inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <FaPlus className="text-white text-xl" />
              <input
                id="file-upload"
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer"
                accept="image/*"
              />
            </div>
          </div>

          <div className="flex items-center justify-center mb-1">
            <VerifiedIcon className="text-blue-500 mr-1" fontSize="small" />
            <h2 className="text-xl font-semibold">{full_name}</h2>
          </div>
          <p className="text-gray-600 text-center mb-4">{openchat_username}</p>
          <button
            type="button"
            className="w-full h-[#155EEF] bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 mb-6 flex items-center justify-center"
          >
            Get in touch
            <ArrowOutwardOutlinedIcon className="ml-1" fontSize="small" />
          </button>
        </div>
      )}
      <div className="p-6 bg-white">
        <div className="mb-4">
          <h3 className="font-semibold mb-2 text-xs text-gray-500 uppercase">
            Roles
          </h3>
          <div className="flex space-x-2">
            <span className="bg-[#F0F9FF] border border-[#B9E6FE] text-[#026AA2] px-3 py-1 rounded-md text-xs font-medium">
              OLYMPIAN
            </span>
          </div>
        </div>
        <div className="flex justify-start border-b">
          {tabs.map(
            (tab) =>
              (tab.role === "general" || userRole === tab.role) && (
                <button
                  type="button"
                  key={tab.role}
                  className={`px-4 py-2 focus:outline-none font-medium ${
                    activeTab === tab.role
                      ? "border-b-2 border-blue-500 text-blue-500 font-medium"
                      : "text-gray-400"
                  }`}
                  onClick={() => handleChange(tab.role)}
                >
                  {tab.label}
                </button>
              )
          )}
        </div>

        {/* General Tab Content */}
        {activeTab === "general" && (
          <form onSubmit={handleSubmit(handleSave, onErrorHandler)}>
            <div className="px-1">
              {/* email  */}
              <div className="mb-4 group relative hover:bg-gray-100 rounded-lg p-2 px-3">
                <div className="flex justify-between">
                  <h3 className="font-semibold mb-2 text-xs text-gray-500 uppercase">
                    full_name
                  </h3>
                  <div>
                    <button
                      type="button"
                      className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
                      onClick={() => handleEditToggle("full_name")}
                    >
                      {isEditing.full_name ? "" : <img src={edit} />}
                    </button>
                  </div>
                </div>
                {isEditing.full_name ? (
                  <>
                    <input
                      type="text"
                      {...register("full_name")}
                      value={tempData.full_name || ""}
                      onChange={(e) => handleInputChange(e, "full_name")}
                    />

                    {errors?.full_name && (
                      <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                        {errors?.full_name?.message}
                      </span>
                    )}
                  </>
                ) : (
                  <div className="flex items-center">
                    <p className="mr-2 text-sm">{full_name}</p>
                    <VerifiedIcon
                      className="text-blue-500 mr-2 w-2 h-2"
                      fontSize="small"
                    />
                  </div>
                )}
              </div>
              {/* email  */}
              <div className="mb-4 group relative hover:bg-gray-100 rounded-lg p-2 px-3">
                <div className="flex justify-between">
                  <h3 className="font-semibold mb-2 text-xs text-gray-500 uppercase">
                    Email
                  </h3>
                  <div>
                    <button
                      type="button"
                      className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
                      onClick={() => handleEditToggle("email")}
                    >
                      {isEditing.email ? "" : <img src={edit} />}
                    </button>
                  </div>
                </div>
                {isEditing.email ? (
                  <>
                    <input
                      type="text"
                      {...register("email")}
                      value={tempData.email}
                      onChange={(e) => handleInputChange(e, "email")}
                    />

                    {errors?.email && (
                      <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                        {errors?.email?.message}
                      </span>
                    )}
                  </>
                ) : (
                  <div className="flex items-center">
                    <p className="mr-2 text-sm">{email}</p>
                    <VerifiedIcon
                      className="text-blue-500 mr-2 w-2 h-2"
                      fontSize="small"
                    />
                    <span className="bg-[#F8FAFC] border border-[#E3E8EF] text-[#364152] px-2 py-0.5 rounded text-xs">
                      HIDDEN
                    </span>
                  </div>
                )}
              </div>
              {/* About Section */}
              <div className="mb-4 group relative hover:bg-gray-100 rounded-lg p-2 px-3">
                <div className="flex justify-between">
                  <h3 className="font-semibold mb-2 text-xs text-gray-500 uppercase">
                    About
                  </h3>
                  <div>
                    <button
                      type="button"
                      className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
                      onClick={() => handleEditToggle("bio")}
                    >
                      {isEditing.bio ? "" : <img src={edit} />}
                    </button>
                  </div>
                </div>
                {isEditing.bio ? (
                  <textarea
                    {...register("bio")}
                    value={tempData.bio}
                    onChange={(e) => handleInputChange(e, "bio")}
                    className={`bg-gray-50 border-2 ${
                      errors?.bio ? "border-red-500" : "border-[#737373]"
                    } text-gray-900 placeholder-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                    placeholder="Tell us bio yourself"
                  />
                ) : (
                  <p className="text-sm">{bio}</p>
                )}
              </div>

              {/* Location Section */}
              <div className="mb-4 group relative hover:bg-gray-100 rounded-lg p-2 px-3">
                <div className="flex justify-between">
                  <h3 className="font-semibold mb-2 text-xs text-gray-500 uppercase">
                    Location
                  </h3>
                  <div>
                    <button
                      type="button"
                      className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
                      onClick={() => handleEditToggle("country")}
                    >
                      {isEditing.country ? "" : <img src={edit} />}
                    </button>
                  </div>
                </div>
                {isEditing.country ? (
                  <select
                    {...register("country")}
                    value={tempData.country}
                    onChange={(e) => handleInputChange(e, "country")}
                  >
                    <option value="">Select your country</option>
                    {countries.map((country) => (
                      <option key={country.name} value={country.name}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="flex items-center">
                    <PlaceOutlinedIcon
                      className="text-gray-500 mr-1"
                      fontSize="small"
                    />
                    <p className="text-sm">{country}</p>
                  </div>
                )}
              </div>
              {/* Location Section */}
              <div className="mb-4 group relative hover:bg-gray-100 rounded-lg p-2 px-3">
                <div className="flex justify-between">
                  <h3 className="font-semibold mb-2 text-xs text-gray-500 uppercase">
                    Type of profile
                  </h3>
                  <div>
                    <button
                      type="button"
                      className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
                      onClick={() => handleEditToggle("type_of_profile")}
                    >
                      {isEditing.type_of_profile ? "" : <img src={edit} />}
                    </button>
                  </div>
                </div>
                {isEditing.type_of_profile ? (
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
                ) : (
                  <div className="flex items-center">
                    <p className="text-sm">{type_of_profile}</p>
                  </div>
                )}
              </div>
              {/* Reasons to Join Platform Section */}
              <div className="mb-4 group relative hover:bg-gray-100 rounded-lg p-2 px-3">
                <div className="flex justify-between">
                  <h3 className="font-semibold mb-2 text-xs text-gray-500 uppercase">
                    Reasons to Join Platform
                  </h3>
                  <div>
                    <button
                      type="button"
                      className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
                      onClick={() => handleEditToggle("reason_to_join")}
                    >
                      {isEditing.reason_to_join ? "" : <img src={edit} />}
                    </button>
                  </div>
                </div>
                {isEditing.reason_to_join ? (
                  <ReactSelect
                    isMulti
                    menuPortalTarget={document.body}
                    menuPosition={"fixed"}
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                      control: (provided) => ({
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
                        color: errors.reasons_to_join_platform
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
                    value={reasonOfJoiningSelectedOptions}
                    options={reasonOfJoiningOptions}
                    classNamePrefix="select"
                    className="basic-multi-select mt-2"
                    placeholder="Select your reasons to join this platform"
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
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {(userFullData?.reason_to_join || [])
                      .flat()
                      .map((reason, index) => (
                        <span
                          key={`${reason}-${index}`}
                          className="border-2 border-gray-500 rounded-full text-gray-700 text-xs px-2 py-1"
                        >
                          {reason}
                        </span>
                      ))}
                  </div>
                )}
              </div>

              {/* Interests Section */}
              <div className="mb-4 group relative hover:bg-gray-100 rounded-lg p-2 px-3">
                <div className="flex justify-between">
                  <h3 className="font-semibold mb-2 text-xs text-gray-500 uppercase">
                    Interests
                  </h3>
                  <div>
                    <button
                      type="button"
                      className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
                      onClick={() => handleEditToggle("area_of_interest")}
                    >
                      {isEditing.area_of_interest ? "" : <img src={edit} />}
                    </button>
                  </div>
                </div>
                {isEditing.area_of_interest ? (
                  <Select
                    isMulti
                    options={interestedDomainsOptions}
                    value={interestedDomainsSelectedOptions}
                    onChange={(selectedOptions) => {
                      setInterestedDomainsSelectedOptions(selectedOptions);
                      setTempData((prev) => ({
                        ...prev,
                        area_of_interest: selectedOptions.map(
                          (option) => option.value
                        ),
                      }));
                    }}
                    className="basic-single"
                    classNamePrefix="select"
                  />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    <span className="border-2 border-gray-500 rounded-full text-gray-700 text-xs px-2 py-1">
                      {area_of_interest}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <h3 className="mb-2 text-xs text-gray-500 px-3">LINKS</h3>
                <div className="flex items-center px-3">
                  {Object.keys(socialLinks).map((key) => {
                    const url = socialLinks[key];
                    const Icon = getIconForLink(url);
                    return (
                      <div
                        className="group relative flex items-center"
                        key={key}
                      >
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center"
                        >
                          <Icon className="text-gray-400 hover:text-gray-600 cursor-pointer transform transition-all duration-300 hover:scale-110" />
                        </a>
                        <button
                          type="button"
                          className="absolute right-0 p-1 text-gray-500 text-xs transition-all duration-300 ease-in-out transform opacity-0 group-hover:opacity-100 group-hover:translate-x-8  h-10 w-7"
                          onClick={() => handleLinkEditToggle(key)}
                        >
                          <img src={edit} alt="edit" />
                        </button>
                        {isEditingLink[key] && (
                          <input
                            type="text"
                            value={url}
                            onChange={(e) => handleLinkChange(e, key)}
                            className="border p-1 rounded w-full ml-2 transition-all duration-300 ease-in-out transform"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Save/Cancel Section */}
                {Object.values(isEditing).some((value) => value) && (
                  <div className="flex justify-end gap-4 mt-4">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="bg-gray-300 text-gray-700 py-2 px-4 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      disabled={isSubmitting}
                      type="submit"
                      className="bg-blue-600 text-white py-2 px-4 rounded"
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
                      ) : isEditing ? (
                        "Update"
                      ) : (
                        "Submit"
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </form>
        )}

        {/* Investor Tab Content */}
        {userRole === "vc" && activeTab === "vc" && <InvestorDetail />}

        {/* Mentor Tab Content */}
        {userRole === "mentor" && activeTab === "mentor" && <MentorEdit />}

        {/* Founder Tab Content */}
        {userRole === "project" && activeTab === "project" && <ProjectDetail />}
      </div>
      <Toaster />
    </div>
  );
};

export default ProfileDetail;

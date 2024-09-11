import React, { useState, useRef, useEffect } from "react";
import edit from "../../../assets/Logo/edit.png";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import VerifiedIcon from "@mui/icons-material/Verified";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import ArrowOutwardOutlinedIcon from "@mui/icons-material/ArrowOutwardOutlined";
import toast, { Toaster } from "react-hot-toast";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCountries } from "react-countries";
import { useSelector } from "react-redux";
import { FaEdit, FaPlus } from "react-icons/fa";
import { Principal } from "@dfinity/principal";
import { ThreeDots } from "react-loader-spinner";
import ReactSelect from "react-select";
import {useNavigate} from "react-router-dom"
import images from "../../../assets/images/coverImage.jpg";
import CompressedImage from "../ImageCompressed/CompressedImage";
import InvestorDetail from "./InvestorDetail";
import ProjectDetail from "./ProjectDetail";
import MentorEdit from "./MentorEdit";
import { validationSchema } from "../UserRegistration/userValidation";
import getSocialLogo from "../Utils/navigationHelper/getSocialLogo";
const ProfileDetail = () => {
  const navigate = useNavigate()
  const [isImageEditing, setIsImageEditing] = useState(false);
  const principal = useSelector((currState) => currState.internet.principal);
  const { countries } = useCountries();
  const userFullData = useSelector((currState) => currState.userData.data.Ok);
  console.log("User aa raha hai", userFullData);
  const actor = useSelector((currState) => currState.actors.actor);
  const [imagePreview, setImagePreview] = useState(null);
  console.log("......./image ......../", imagePreview)
  const [imageData, setImageData] = useState(null);
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

  const [socialLinks, setSocialLinks] = useState({});
  console.log("mere link aa rahe hai ", socialLinks);
  const [isEditingLink, setIsEditingLink] = useState({});
  const [isLinkBeingEdited, setIsLinkBeingEdited] = useState(false);
  const handleLinkEditToggle = (link) => {
    setIsEditingLink((prev) => ({
      ...prev,
      [link]: !prev[link],
    }));
    setIsLinkBeingEdited(!isLinkBeingEdited);
  };

  const handleLinkChange = (e, link) => {
    setSocialLinks((prev) => ({
      ...prev,
      [link]: e.target.value,
    }));
  };

  const {
    register,
    handleSubmit,
    clearErrors,
    setValue,
    control,
    setError,
    trigger,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "all",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "links",
  });
  console.log("Form Errors:", errors); // Log form errors
  console.log("Is Form Valid:", isValid); // Check if form is valid

  const [isEditing, setIsEditing] = useState({
    email: false,
    tagline: false,
    bio: false,
    area_of_interest: false,
    country: false,
    reason_to_join: false,
  });

  const containerRef = useRef(null);

  const handleEditToggle = (field) => {
    setIsEditing({ ...isEditing, [field]: !isEditing[field] });
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

  const imageCreationFunc = async (file) => {

    setIsImageEditing(true);
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




  const handleSave = async (data) => {
    console.log("data", data); 

    try {
     
      const convertedPrincipal = await Principal.fromText(principal);
      const updatedSocialLinks = Object.entries(socialLinks).map(([key, value]) => ({
        link: value ? [value] : [],
      }));
      const user_data = {
        bio: [data?.bio],
        full_name: data?.full_name,
        email: [data?.email],
        openchat_username: [data?.openchat_user_name],
        country: data?.country,
        area_of_interest: data?.domains_interested_in,
        type_of_profile: [data?.type_of_profile || ""],
        reason_to_join: [
          data?.reasons_to_join_platform
            .split(",")
            .map((val) => val.trim()) || [""],
        ],
        profile_picture: imageData ? [imageData] : [],
        //   social_links: Object.entries(socialLinks).map(([key, value]) => ({
        //     link: value ? [value] : [],
        // })),
        social_links: [updatedSocialLinks], 
      };

      console.log("Sending user_data to backend:", user_data); // Debugging line

      const result = await actor.update_user_data(
        convertedPrincipal,
        user_data
      );
      console.log("Sending user_data to backend using api:", result);
      if ("Ok" in result) {
        toast.success("User profile updated successfully");
        setTimeout(() => {
          // window.location.reload();
          navigate("/dashboard")
        }, 500);
      } else {
        console.log("Error:", result);
        toast.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error sending data to the backend:", error);
      toast.error("Failed to update profile");
    }
    setIsLinkBeingEdited(false);
    setIsEditingLink({})
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
    // setTempData(profileData);
    setIsLinkBeingEdited(false);
    setIsEditingLink(false)
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
      // Trigger validation manually before saving
      trigger().then((isValid) => {
        if (isValid) {
          handleSubmit(handleSave, onErrorHandler)();
        } else {
          toast.error("Form contains errors, please correct them before saving.");
        }
      });

      // Close the editing state
      setIsEditingLink({});
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [isEditing, isEditingLink, trigger, handleSubmit]);


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


  // const setValuesHandler = (val) => {
    
  //   if (val) {
  //     setValue("full_name", val?.full_name ?? "");
  //     setValue("email", val?.email?.[0] ?? "");
  //     setValue("openchat_user_name", val?.openchat_username?.[0] ?? "");
  //     setValue("bio", val?.bio?.[0] ?? "");
  //     setValue("country", val?.country ?? "");
  //     setValue("domains_interested_in", val?.area_of_interest ?? "");
  //     setInterestedDomainsSelectedOptionsHandler(val?.area_of_interest ?? null);
  //     setImagePreview(val?.profile_picture?.[0] ?? "");
  //     setValue("type_of_profile", val?.type_of_profile?.[0]);
  //     setValue(
  //       "reasons_to_join_platform",
  //       val?.reason_to_join ? val?.reason_to_join.join(", ") : ""
  //     );
  //     setReasonOfJoiningSelectedOptionsHandler(val?.reason_to_join);
  //     console.log("mere link aa gye ", val?.social_links);
  //     // Set social links
  //     if (val?.social_links?.length) {
  //       const links = {};
  
  //       val.social_links.forEach((linkArray) => {
  //         linkArray.forEach((linkData) => {
  //           const url = linkData.link[0];
  //           console.log("Found URL: ", url);
  
  //           if (url && typeof url === "string") {
  //             if (url.includes("linkedin.com")) {
  //               links["LinkedIn"] = url;
  //             } else if (url.includes("github.com")) {
  //               links["GitHub"] = url;
  //             } else if (url.includes("t.me") || url.includes("telegram")) {
  //               links["Telegram"] = url;
  //             } else {
  //               // Use the domain as the key to avoid overwriting
  //               const domainKey = new URL(url).hostname.replace("www.", "");
  //               links[domainKey] = url;
  //             }
  //           }
  //         });
  //       });
  
  //       console.log("Final links object:", links);
  //       setSocialLinks(links);
  //     } else {
  //       console.log("No social_links array or it's empty");
  //       setSocialLinks({});
  //     }
  //   }
  // };
const setValuesHandler = (val) => {
  if (val) {
    setValue("full_name", val?.full_name ?? "");
    setValue("email", val?.email?.[0] ?? "");
    setValue("openchat_user_name", val?.openchat_username?.[0] ?? "");
    setValue("bio", val?.bio?.[0] ?? "");
    setValue("country", val?.country ?? "");
    setValue("domains_interested_in", val?.area_of_interest ?? "");
    setInterestedDomainsSelectedOptionsHandler(val?.area_of_interest ?? null);
    setImagePreview(val?.profile_picture?.[0] ?? "");
    setValue("type_of_profile", val?.type_of_profile?.[0]);
    setValue(
      "reasons_to_join_platform",
      val?.reason_to_join ? val.reason_to_join.join(", ") : ""
    );
    setReasonOfJoiningSelectedOptionsHandler(val?.reason_to_join);

    // Set social links
    if (val?.social_links?.length) {
      const links = {};

      val.social_links.forEach((linkArray) => {
        linkArray.forEach((linkData) => {
          const url = linkData.link[0];
          console.log("Found URL: ", url);

          if (url && typeof url === "string") {
            try {
              const parsedUrl = new URL(url);
              const hostname = parsedUrl.hostname.replace("www.", "");
              if (hostname.includes("linkedin.com")) {
                links["LinkedIn"] = url;
              } else if (hostname.includes("github.com")) {
                links["GitHub"] = url;
              } else if (hostname.includes("t.me") || hostname.includes("telegram")) {
                links["Telegram"] = url;
              } else {
                // Use the domain as the key to avoid overwriting
                links[hostname] = url;
              }
            } catch (error) {
              console.error("Invalid URL:", url, error);
            }
          }
        });
      });

      console.log("Final links object:", links);
      setSocialLinks(links);
    } else {
      console.log("No social_links array or it's empty");
      setSocialLinks({});
    }
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
      className="container bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden w-full "
    >
      <div className="relative h-1 bg-gray-200">
        <div className="absolute left-0 top-0 h-full bg-green-500 w-1/3"></div>
      </div>
      {activeTab === "general" && (
        <div className="p-6 bg-gray-50">
          <div className="relative w-24 h-24 mx-auto rounded-full mb-4 group">
            {/* <img
              src={ProfileImage}
              alt={full_name}
              className="w-full h-full rounded-full object-cover"
            /> */}
            {imagePreview && !errors.image ? (
              <img
                src={imagePreview}
                alt="Profile"
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <img
                src={ProfileImage}
                alt={full_name}
                className="w-full h-full rounded-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
                      className="p-2  items-center rounded-md text-md bg-transparent cursor-pointer font-semibold"
                    >
                      <FaPlus className="text-white text-xl" />
                    </label>
                  </>
                )}
              />
            </div>
          </div>

          <div className="flex items-center justify-center mb-1">
            <VerifiedIcon className="text-blue-500 mr-1" fontSize="small" />
            <h2 className="text-xl font-semibold truncate break-all">{full_name}</h2>
          </div>
          <p className="text-gray-600 text-center mb-4 truncate break-all">{openchat_username}</p>
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
            backgroundImage: `url(${images})`,
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
              src={ProfileImage}
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
            backgroundImage: `url(${images})`,
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
              src={ProfileImage}
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
            <h2 className="text-xl font-semibold truncate break-all">{full_name}</h2>
          </div>
          <p className="text-gray-600 text-center mb-4 truncate break-all">{openchat_username}</p>
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
            backgroundImage: `url(${images})`,
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
              src={ProfileImage}
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
            <h2 className="text-xl font-semibold truncate break-all">{full_name}</h2>
          </div>
          <p className="text-gray-600 text-center mb-4 truncate break-all">{openchat_username}</p>
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
            <div className="px-1 py-4">
              {/* full name  */}
              <div className="mb-4 group relative hover:bg-gray-100 rounded-lg p-2 px-3">
                <div className="flex justify-between">
                  <h3 className="font-semibold mb-2 text-xs text-gray-500 uppercase">
                    full name
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
                  </>
                ) : (
                  <div className="flex items-center">
                    <p className="mr-2 text-sm truncate">{full_name}</p>
                    
                  </div>
                )}
              </div>
              {/* full name  */}
              <div className="mb-4 group relative hover:bg-gray-100 rounded-lg p-2 px-3">
                <div className="flex justify-between">
                  <h3 className="font-semibold mb-2 text-xs text-gray-500 uppercase">
                    openchat_username
                  </h3>
                  <div>
                    <button
                      type="button"
                      className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
                      onClick={() => handleEditToggle("openchat_user_name")}
                    >
                      {isEditing.openchat_user_name ? "" : <img src={edit} />}
                    </button>
                  </div>
                </div>
                {isEditing.openchat_user_name ? (
                  <>
                    <input
                      type="text"
                      {...register("openchat_user_name")}
                      className={`bg-gray-50 border-2 
                                                ${
                                                  errors?.openchat_user_name
                                                    ? "border-red-500 "
                                                    : "border-[#737373]"
                                                } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1`}
                      placeholder="Enter your openchat username"
                    />
                    {errors?.openchat_user_name && (
                      <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                        {errors?.openchat_user_name?.message}
                      </span>
                    )}
                  </>
                ) : (
                  <div className="flex items-center">
                    <p className="mr-2 text-sm truncate break-all">{openchat_username}</p>
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
                  </>
                ) : (
                  <div className="flex items-center">
                    <p className="mr-2 text-sm truncate break-all">{email}</p>
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
                    className={`bg-gray-50 border-2 ${
                      errors?.bio ? "border-red-500 " : "border-[#737373]"
                    } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1`}
                    placeholder="Enter your bio"
                    rows={1}
                  ></textarea>
                ) : (
                  <p className="text-sm truncate break-all">{bio}</p>
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
                    className={`bg-gray-50 border-2 ${
                      errors.country ? "border-red-500 " : "border-[#737373]"
                    } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1`}
                  >
                    <option className="text-lg font-bold" value="">
                      Select your country
                    </option>
                    {countries?.map((expert) => (
                      <option
                        key={expert.name}
                        value={expert.name}
                        className="text-lg font-normal"
                      >
                        {expert.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="flex items-center">
                    <PlaceOutlinedIcon
                      className="text-gray-500 mr-1"
                      fontSize="small"
                    />
                    <p className="text-sm truncate break-all">{country}</p>
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
                    } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1`}
                  >
                    <option className="text-lg font-normal" value="">
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
                    <p className="text-smtruncate break-all ">{type_of_profile}</p>
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
                        display: "flex",
                        overflowX: "auto",
                        maxHeight: "25px",
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
                ) : (
                  <div className="flex gap-2 overflow-x-auto">
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
                  <>
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
                  </>
                ) : (
                  <div className="flex gap-2 overflow-x-auto">
    {area_of_interest.split(', ').map((interest, index) => (
      <span 
        key={index} 
        className="border-2 border-gray-500 rounded-full text-gray-700 text-xs px-2 py-1 break-words"
      >
        {interest}
      </span>
    ))}
  </div>
                )}
              </div>
              <div>
                <h3 className="mb-2 text-xs text-gray-500 px-3">LINKS</h3>
              <div className="flex flex-col items-center gap-5 px-3">
  {console.log("Display existing links ", socialLinks)}
  {socialLinks &&
    Object.keys(socialLinks).map((key, index) => {
      const url = socialLinks[key];
      if (!url) return null;

      const Icon = getSocialLogo(url);
      return (
        <div className="group relative flex items-center" key={index}>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center"
          >
          {Icon}
          </a>
          <button
            type="button"
            className="absolute right-0 p-1 text-gray-500 text-xs transition-all duration-300 ease-in-out transform opacity-0 group-hover:opacity-100 group-hover:translate-x-6 h-10 w-7"
            onClick={() => handleLinkEditToggle(key)}
          >
            <img src={edit} alt="edit" />
          </button>
          {isEditingLink[key] && (
            <div className="flex flex-col w-full mt-2">
              <input
                type="text"
                value={url}
                onChange={(e) => handleLinkChange(e, key)}
                className="border p-2 rounded-md w-full"
                placeholder="Enter your social media URL"
              />
            </div>
          )}
        </div>
      );
    })}

  {fields.map((field, index) => (
    <div key={field.id} className="flex items-center space-x-3">
      <input
        type="text"
        {...register(`links.${index}.url`)}
        placeholder="Enter your social media URL"
        className="border p-2 rounded-md w-full"
      />
      <button
        type="button"
        className="text-red-500"
        onClick={() => remove(index)}
      >
        Remove
      </button>
    </div>
  ))}

  <button
    type="button"
    className="p-2 bg-blue-500 text-white rounded-md"
    onClick={() => append({ url: "" })}
  >
    Add Another Link
  </button>

  <button type="submit" className="mt-3 p-2 bg-green-500 text-white rounded-md">
    Save Links
  </button>
</div>


                {/* Save/Cancel Section */}
                {/* {Object.values(isEditing).some((value) => value) && ( */}
                  {(Object.values(isEditing).some((value) => value) || isLinkBeingEdited || isImageEditing) && (
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

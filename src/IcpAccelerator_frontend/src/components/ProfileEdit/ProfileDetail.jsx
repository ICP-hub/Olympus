import React, { useState, useRef, useEffect } from "react";
import edit from "../../../assets/Logo/edit.png";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import VerifiedIcon from "@mui/icons-material/Verified";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import ArrowOutwardOutlinedIcon from "@mui/icons-material/ArrowOutwardOutlined";
import toast, { Toaster } from "react-hot-toast";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCountries } from "react-countries";
import { useSelector,useDispatch } from "react-redux";
import { FaEdit, FaPlus, FaSave, FaTrash } from "react-icons/fa";
import { Principal } from "@dfinity/principal";
import { ThreeDots } from "react-loader-spinner";
import ReactSelect from "react-select";
import { useNavigate } from "react-router-dom";
import images from "../../../assets/images/coverImage.jpg";
import CompressedImage from "../ImageCompressed/CompressedImage";
import InvestorDetail from "./InvestorDetail";
import ProjectDetail from "./ProjectDetail";
import MentorEdit from "./MentorEdit";
import { validationSchema } from "../UserRegistration/userValidation";
import getSocialLogo from "../Utils/navigationHelper/getSocialLogo";
import getPlatformFromHostname from "../Utils/navigationHelper/getPlatformFromHostname";
import { FaChevronDown, FaChevronUp } from "react-icons/fa"; // Icons for dropdown
import getReactSelectStyles from "../Utils/navigationHelper/getReactSelectStyles";
import { userRegisteredHandlerRequest } from "../StateManagement/Redux/Reducers/userRegisteredData";


const ProfileDetail = () => {
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

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userCurrentRoleStatusActiveRole = useSelector(
    (currState) => currState.currentRoleStatus.activeRole
  );
  const isAuthenticated = useSelector(
    (currState) => currState.internet.isAuthenticated
  );
  const [isImageEditing, setIsImageEditing] = useState(false);
  const principal = useSelector((currState) => currState.internet.principal);
  const { countries } = useCountries();
  const userFullData = useSelector((currState) => currState.userData.data.Ok);
  // console.log("User aa raha hai", userFullData);
  const actor = useSelector((currState) => currState.actors.actor);
  const [imagePreview, setImagePreview] = useState(null);
//  const [dispatchCompleted, setDispatchCompleted] = useState(false);
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
  // useEffect(()=>{
  //   if( isAuthenticated){
  //     dispatch(userRegisteredHandlerRequest());
  //   }
  // },[isAuthenticated,dispatch])
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
  const [isEditingLink, setIsEditingLink] = useState({});
  const [isLinkBeingEdited, setIsLinkBeingEdited] = useState(false);
  const { fields, append, remove } = useFieldArray({
    control,
    name: "links",
  });

  const handleSaveLink = (key) => {
    setIsEditingLink((prev) => ({
      ...prev,
      [key]: false, // Exit editing mode for the saved link
    }));
  };

  // Handle adding new link from form field
  const handleSaveNewLink = (data, index) => {
    const linkKey = `custom-link-${Date.now()}-${index}`; // Generate unique key
    setSocialLinks((prevLinks) => ({
      ...prevLinks,
      [linkKey]: data, // Add new link to socialLinks state
    }));
    remove(index); // Remove the field after saving
  };

  // Toggle the editing of individual links
  const handleLinkEditToggle = (key) => {
    setIsEditingLink((prev) => ({
      ...prev,
      [key]: !prev[key], // Toggle the edit state for each link
    }));
    setIsLinkBeingEdited(!isLinkBeingEdited);
  };

  // Handle changes to individual links
  const handleLinkChange = (e, key) => {
    setSocialLinks((prev) => ({
      ...prev,
      [key]: e.target.value, // Update the specific link's value
    }));
  };

  // Handle deletion of existing links
  const handleLinkDelete = (key) => {
    setSocialLinks((prev) => {
      const updatedLinks = { ...prev };
      delete updatedLinks[key]; // Remove the link
      return updatedLinks;
    });
  };

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
  // useEffect(() => {
  //   console.log("dispatchCompleted value:", dispatchCompleted);
  //   if (dispatchCompleted) {
  //     console.log("Navigation triggered: /dashboard/profile");
     
  //   }
  // }, [dispatchCompleted, navigate]);

  const handleSave = async (data) => {
    console.log("data", data);

    try {
      const convertedPrincipal = await Principal.fromText(principal);
      const updatedSocialLinks = Object.entries(socialLinks).map(
        ([key, value]) => ({
          link: value ? [value] : [],
        })
      );
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
        social_links: [updatedSocialLinks],
      };

      // console.log("Sending user_data to backend:", user_data); // Debugging line

      const result = await actor.update_user_data(
        convertedPrincipal,
        user_data
      );
      console.log("Sending user_data to backend using api:", result);
      if ("Ok" in result) {
        toast.success("User profile updated successfully");
      dispatch(userRegisteredHandlerRequest());
      navigate("/dashboard/profile");
      } else {
        console.log("Error:", result);
      dispatch(userRegisteredHandlerRequest());
      navigate("/dashboard/profile");
        toast.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error sending data to the backend:", error);
      toast.error("Failed to update profile");
    }
    setIsLinkBeingEdited(false);
    setIsEditingLink({});
  };

  const handleCancel = () => {
    setIsEditing({
      email: false,
      tagline: false,
      bio: false,
      area_of_interest: false,
      country: false,
      reason_to_join: false,
      links:false
    });
    // setTempData(profileData);
    setIsLinkBeingEdited(false);
    setIsEditingLink(false);
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
            toast.error(
              "Form contains errors, please correct them before saving."
            );
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

  const setValuesHandler = (val) => {
    console.log('val',val);
    if (val) {
      setValue("full_name", val?.full_name ?? "");
      setValue("email", val?.email?.[0] ?? "");
      setValue("openchat_user_name", val?.openchat_username?.[0] ?? "");
      setValue("bio", val?.bio?.[0] ?? "");
      setValue("country", val?.country ?? "");
      setValue("domains_interested_in", val?.area_of_interest ?? "");
      setInterestedDomainsSelectedOptionsHandler(val?.area_of_interest ?? null);
      setImagePreview(val?.profile_picture?.[0] ?? "");
// setImageData(val?.profile_picture?.[0] ?? "")
      setValue("type_of_profile", val?.type_of_profile?.[0]);
      setValue(
        "reasons_to_join_platform",
        val?.reason_to_join ? val.reason_to_join.join(", ") : ""
      );
      setReasonOfJoiningSelectedOptionsHandler(val?.reason_to_join);

      // Set social links
      if (val?.social_links?.length) {
        const links = {};

        val?.social_links?.forEach((linkArray) => {
          if (Array.isArray(linkArray)) {
            linkArray.forEach((linkData) => {
              const url = linkData.link?.[0];
              if (url && typeof url === "string") {
                try {
                  const parsedUrl = new URL(url);
                  const hostname = parsedUrl.hostname.replace("www.", "");
                  const platform = getPlatformFromHostname(hostname);
                  links[platform] = url;
                } catch (error) {
                  console.error("Invalid URL:", url, error);
                }
              }
            });
          }
        });
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
  // const handleReasonToJoinChange = (selectedOptions) => {
  //   const selectedValues = selectedOptions.map((option) => option.value);

  //   console.log("Selected Options:", selectedOptions); // Check what is being selected
  //   console.log("Selected Values:", selectedValues); // Check the values

  //   setReasonOfJoiningSelectedOptions(selectedOptions);
  //   setValue("reason_to_join", selectedValues, { shouldValidate: true });
  //   setReasonOfJoiningSelectedOptionsHandler((prev) => ({
  //     ...prev,
  //     reason_to_join: selectedValues,
  //   }));
  // };

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

  const [showDetails, setShowDetails] = useState(false);

  const handleToggle = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div
      ref={containerRef}
      className="container bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden w-full "
    >
      <div className="relative h-1 bg-gray-200">
        <div className="absolute left-0 top-0 h-full bg-green-500 w-1/3"></div>
      </div>
      {activeTab === "general" && (
        <div className=" px-6 py-2 md:p-6 bg-gray-50">
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
                loading="lazy"
                draggable={false}
              />
            ) : (
              <img
                src={ProfileImage}
                alt={full_name}
                className="w-full h-full rounded-full object-cover"
                loading="lazy"
                draggable={false}
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
            <h2 className="text-xl font-semibold truncate break-all">
              {full_name}
            </h2>
          </div>
          <p className="text-gray-600 text-center mb-4 truncate break-all">
            {openchat_username}
          </p>
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
          className="px-6  py-2 md:p-6 bg-gray-50 relative cursor-pointer"
          style={{
            backgroundImage: `url(${images})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="relative w-24 h-24 mx-auto rounded-full mb-4 group">
            <img
              src={ProfileImage}
              alt={full_name}
              className="w-full h-full rounded-full object-cover"
              loading="lazy"
              draggable={false}
            />
          </div>
          <div className="flex items-center justify-center mb-1">
            <VerifiedIcon className="text-blue-500 mr-1" fontSize="small" />
            <h2 className="text-xl font-semibold truncate break-all">
              {full_name}
            </h2>
          </div>
          <p className="text-gray-600 text-center mb-4 truncate break-all">
            {openchat_username}
          </p>
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
          className="px-6 py-2 md:p-6 bg-gray-50 relative cursor-pointer"
          style={{
            backgroundImage: `url(${images})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="relative w-24 h-24 mx-auto rounded-full mb-4 group">
            <img
              src={ProfileImage}
              alt={full_name}
              className="w-full h-full rounded-full object-cover"
              loading="lazy"
              draggable={false}
            />
          </div>

          <div className="flex items-center justify-center mb-1">
            <VerifiedIcon className="text-blue-500 mr-1" fontSize="small" />
            <h2 className="text-xl font-semibold truncate break-all">
              {full_name}
            </h2>
          </div>
          <p className="text-gray-600 text-center mb-4 truncate break-all">
            {openchat_username}
          </p>
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
          className=" px-6 py-2 md:p-6 bg-gray-50 relative cursor-pointer"
          style={{
            backgroundImage: `url(${images})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute top-0 right-0 p-2  cursor-pointer">
            <img src={edit} className="size-4"    loading="lazy"
                    draggable={false}/>
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
              loading="lazy"
              draggable={false}
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
            <h2 className="text-xl font-semibold truncate break-all">
              {full_name}
            </h2>
          </div>
          <p className="text-gray-600 text-center mb-4 truncate break-all">
            {openchat_username}
          </p>
          <button
            type="button"
            className="w-full h-[#155EEF] bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 mb-6 flex items-center justify-center"
          >
            Get in touch
            <ArrowOutwardOutlinedIcon className="ml-1" fontSize="small" />
          </button>
        </div>
      )}

      {/* mobile screen  */}
      <div className="px-4 py-2 bg-white md:hidden">
        {!showDetails ? (
          <button
            onClick={handleToggle}
            className=" font-bold py-2 px-4 rounded w-full flex justify-center items-center "
          >
            Show details
            <FaChevronDown className="ml-2" />
          </button>
        ) : (
          <>
            <div className="mb-4 ">
              <h3 className="font-semibold mb-2 text-xs text-gray-500 uppercase">
                Roles
              </h3>
              <div className="flex space-x-2">
                <span className="bg-[#F0F9FF] border border-[#B9E6FE] text-[#026AA2] px-3 py-1 rounded-md text-xs font-medium">
                  OLYMPIAN
                </span>
                <span className="bg-[#F0F9FF] border border-[#B9E6FE] text-[#026AA2] px-3 py-1 rounded-md text-xs font-medium uppercase">
                  {userCurrentRoleStatusActiveRole === "vc"
                    ? "INVESTOR"
                    : userCurrentRoleStatusActiveRole}
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
                          className="visible md:invisible md:group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4 transition-opacity duration-300"
                          onClick={() => handleEditToggle("full_name")}
                        >
                          {isEditing.full_name ? "" : <img src={edit}    loading="lazy"
                    draggable={false}/>}
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
                          className="visible md:invisible md:group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4 transition-opacity duration-300"
                          onClick={() => handleEditToggle("openchat_user_name")}
                        >
                          {isEditing.openchat_user_name ? (
                            ""
                          ) : (
                            <img src={edit}    loading="lazy"
                            draggable={false}/>
                          )}
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
                        <p className="mr-2 text-sm truncate break-all">
                          {openchat_username}
                        </p>
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
                          className="visible md:invisible md:group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4 transition-opacity duration-300"
                          onClick={() => handleEditToggle("email")}
                        >
                          {isEditing.email ? "" : <img src={edit}    loading="lazy"
                    draggable={false}/>}
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
                        <p className="mr-2 text-sm truncate break-all">
                          {email}
                        </p>
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
                          className="visible md:invisible md:group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4 transition-opacity duration-300"
                          onClick={() => handleEditToggle("bio")}
                        >
                          {isEditing.bio ? "" : <img src={edit}    loading="lazy"
                    draggable={false}/>}
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
                          className="visible md:invisible md:group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4 transition-opacity duration-300"
                          onClick={() => handleEditToggle("country")}
                        >
                          {isEditing.country ? "" : <img src={edit}    loading="lazy"
                    draggable={false}/>}
                        </button>
                      </div>
                    </div>
                    {isEditing.country ? (
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
                          className="visible md:invisible md:group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4 transition-opacity duration-300"
                          onClick={() => handleEditToggle("type_of_profile")}
                        >
                          {isEditing.type_of_profile ? "" : <img src={edit}    loading="lazy"
                    draggable={false}/>}
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
                        <p className="text-smtruncate break-all ">
                          {type_of_profile}
                        </p>
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
                          className="visible md:invisible md:group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4 transition-opacity duration-300"
                          onClick={() => handleEditToggle("reason_to_join")}
                        >
                          {isEditing.reason_to_join ? "" : <img src={edit}    loading="lazy"
                    draggable={false}/>}
                        </button>
                      </div>
                    </div>
                    {isEditing.reason_to_join ? (
                      <ReactSelect
                        isMulti
                        menuPortalTarget={document.body}
                        menuPosition={"fixed"}
                        styles={getReactSelectStyles(
                          errors?.reasons_to_join_platform
                        )}
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
                          className="visible md:invisible md:group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4 transition-opacity duration-300"
                          onClick={() => handleEditToggle("area_of_interest")}
                        >
                          {isEditing.area_of_interest ? "" : <img src={edit}    loading="lazy"
                    draggable={false}/>}
                        </button>
                      </div>
                    </div>
                    {isEditing.area_of_interest ? (
                      <>
                        <ReactSelect
                          isMulti
                          menuPortalTarget={document.body}
                          menuPosition={"fixed"}
                          styles={getReactSelectStyles(
                            errors?.domains_interested_in
                          )}
                          value={interestedDomainsSelectedOptions}
                          options={interestedDomainsOptions}
                          classNamePrefix="select"
                          className="basic-multi-select w-full text-start"
                          placeholder="Select domains you are interested in"
                          name="domains_interested_in"
                          onChange={(selectedOptions) => {
                            if (selectedOptions && selectedOptions.length > 0) {
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
                        {area_of_interest.split(", ").map((interest, index) => (
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
                    <h3 className="mb-2 text-xs text-gray-500 px-3 font-semibold">
                      LINKS
                    </h3>
                    <div className="relative px-3">
                      <div className="flex flex-wrap gap-5">
                        {Object.keys(socialLinks)
                          .filter((key) => socialLinks[key]) // Only show links with valid URLs
                          .map((key, index) => {
                            const url = socialLinks[key];
                            const Icon = getSocialLogo(url); // Get the corresponding social icon
                            return (
                              <div
                                className="group relative flex items-center mb-3"
                                key={key}
                              >
                                {isEditingLink[key] ? (
                                  <div className="flex w-full">
                                    <div className="flex items-center w-full">
                                      <div className="flex items-center space-x-2 w-full">
                                        <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full">
                                          {Icon} {/* Display the icon */}
                                        </div>
                                        <input
                                          type="text"
                                          value={url}
                                          onChange={(e) =>
                                            handleLinkChange(e, key)
                                          }
                                          className="border p-2 rounded-md w-full"
                                          placeholder="Enter your social media URL"
                                        />
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => handleSaveLink(key)} // Save the link
                                        className="ml-2 text-green-500 hover:text-green-700"
                                      >
                                        <FaSave />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleLinkDelete(key)} // Delete the link
                                        className="ml-2 text-red-500 hover:text-red-700"
                                      >
                                        <FaTrash />
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    <a
                                      href={url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center"
                                    >
                                      {Icon} {/* Display the icon */}
                                    </a>
                                    <button
                                      type="button"
                                      className="absolute right-0 p-1 text-gray-500 text-xs transition-all duration-300 translate-x-6 ease-in-out transform opacity-100 md:opacity-0 md:group-hover:opacity-100 md:group-hover:translate-x-6 h-10 w-7"
                                      onClick={() => handleLinkEditToggle(key)} // Toggle editing mode for this link
                                    >
                                      <img src={edit} alt="edit"    loading="lazy"
                    draggable={false}/>
                                    </button>
                                  </>
                                )}
                              </div>
                            );
                          })}
                      </div>
                      {fields.map((item, index) => (
                        <div key={item.id} className="flex flex-col">
                          <div className="flex items-center mb-2 pb-1">
                            <Controller
                              name={`links[${index}].link`}
                              control={control}
                              render={({ field, fieldState }) => (
                                <div className="flex items-center w-full">
                                  <div className="flex items-center space-x-2 w-full">
                                    <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full">
                                      {field.value &&
                                        getSocialLogo(field.value)}{" "}
                                      {/* Display logo for new link */}
                                    </div>
                                    <input
                                      type="text"
                                      placeholder="Enter your social media URL"
                                      className={`p-2 border ${
                                        fieldState.error
                                          ? "border-red-500"
                                          : "border-[#737373]"
                                      } rounded-md w-full bg-gray-50 border-2 border-[#D1D5DB]`}
                                      {...field}
                                    />
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleSaveNewLink(field.value, index)
                                    } // Save the new link
                                    className="ml-2 text-green-500 hover:text-green-700"
                                  >
                                    <FaSave />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => remove(index)} // Remove link field
                                    className="ml-2 text-red-500 hover:text-red-700"
                                  >
                                    <FaTrash />
                                  </button>
                                </div>
                              )}
                            />
                          </div>
                        </div>
                      ))}
                      {fields.length < 10 && (
                        <button
                          type="button"
                          onClick={() => {
                            if (fields.length < 10) {
                              append({ link: "" });
                            }
                          }}
                          className="flex items-center p-1 text-[#155EEF]"
                        >
                          <FaPlus className="mr-1" /> Add Another Link
                        </button>
                      )}
                    </div>

                    {/* Save/Cancel Section */}
                    {/* {Object.values(isEditing).some((value) => value) && ( */}
                    {(Object.values(isEditing).some((value) => value) ||
                      isLinkBeingEdited ||
                      isImageEditing) && (
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
            {userRole === "project" && activeTab === "project" && (
              <ProjectDetail />
            )}
            <button
              onClick={handleToggle}
              className="font-bold py-2 px-4 rounded w-full flex justify-center items-center mt-4 "
            >
              Hide details <FaChevronUp className="ml-2" />
            </button>
          </>
        )}
      </div>

      {/* laptop screen  */}
      <div className="p-6 bg-white hidden md:block">
        <div className="mb-4">
          <h3 className="font-semibold mb-2 text-xs text-gray-500 uppercase">
            Roles
          </h3>
          <div className="flex space-x-2">
            <span className="bg-[#F0F9FF] border border-[#B9E6FE] text-[#026AA2] px-3 py-1 rounded-md text-xs font-medium">
              OLYMPIAN
            </span>
            <span className="bg-[#F0F9FF] border border-[#B9E6FE] text-[#026AA2] px-3 py-1 rounded-md text-xs font-medium uppercase">
              {userCurrentRoleStatusActiveRole === "vc"
                ? "INVESTOR"
                : userCurrentRoleStatusActiveRole}
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
                      className="visible md:invisible md:group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4 transition-opacity duration-300"
                      onClick={() => handleEditToggle("full_name")}
                    >
                      {isEditing.full_name ? "" : <img src={edit}    loading="lazy"
                    draggable={false}/>}
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
                      className="visible md:invisible md:group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4 transition-opacity duration-300"
                      onClick={() => handleEditToggle("openchat_user_name")}
                    >
                      {isEditing.openchat_user_name ? "" : <img src={edit}    loading="lazy"
                    draggable={false}/>}
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
                    <p className="mr-2 text-sm truncate break-all">
                      {openchat_username}
                    </p>
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
                      className="visible md:invisible md:group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4 transition-opacity duration-300"
                      onClick={() => handleEditToggle("email")}
                    >
                      {isEditing.email ? "" : <img src={edit}    loading="lazy"
                    draggable={false}/>}
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
                      className="visible md:invisible md:group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4 transition-opacity duration-300"
                      onClick={() => handleEditToggle("bio")}
                    >
                      {isEditing.bio ? "" : <img src={edit}    loading="lazy"
                    draggable={false}/>}
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
                      className="visible md:invisible md:group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4 transition-opacity duration-300"
                      onClick={() => handleEditToggle("country")}
                    >
                      {isEditing.country ? "" : <img src={edit}    loading="lazy"
                    draggable={false}/>}
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
                      className="visible md:invisible md:group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4 transition-opacity duration-300"
                      onClick={() => handleEditToggle("type_of_profile")}
                    >
                      {isEditing.type_of_profile ? "" : <img src={edit}    loading="lazy"
                    draggable={false}/>}
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
                    <p className="text-smtruncate break-all ">
                      {type_of_profile}
                    </p>
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
                      className="visible md:invisible md:group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4 transition-opacity duration-300"
                      onClick={() => handleEditToggle("reason_to_join")}
                    >
                      {isEditing.reason_to_join ? "" : <img src={edit}    loading="lazy"
                    draggable={false}/>}
                    </button>
                  </div>
                </div>
                {isEditing.reason_to_join ? (
                  <ReactSelect
                    isMulti
                    menuPortalTarget={document.body}
                    menuPosition={"fixed"}
                    styles={getReactSelectStyles(
                      errors?.reasons_to_join_platform
                    )}
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
                      className="visible md:invisible md:group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4 transition-opacity duration-300"
                      onClick={() => handleEditToggle("area_of_interest")}
                    >
                      {isEditing.area_of_interest ? "" : <img src={edit}    loading="lazy"
                    draggable={false}/>}
                    </button>
                  </div>
                </div>
                {isEditing.area_of_interest ? (
                  <>
                    <ReactSelect
                      isMulti
                      menuPortalTarget={document.body}
                      menuPosition={"fixed"}
                      styles={getReactSelectStyles(
                        errors?.domains_interested_in
                      )}
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
                    {area_of_interest.split(", ").map((interest, index) => (
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
                <h3 className="mb-2 text-xs text-gray-500 px-3 font-semibold">
                  LINKS
                </h3>
                <div className="relative px-3">
                  <div className="flex flex-wrap gap-5">
                    {Object.keys(socialLinks)
                      .filter((key) => socialLinks[key]) // Only show links with valid URLs
                      .map((key, index) => {
                        const url = socialLinks[key];
                        const Icon = getSocialLogo(url); // Get the corresponding social icon
                        return (
                          <div
                            className="group relative flex items-center mb-3"
                            key={key}
                          >
                            {isEditingLink[key] ? (
                              <div className="flex w-full">
                                <div className="flex items-center w-full">
                                  <div className="flex items-center space-x-2 w-full">
                                    <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full">
                                      {Icon} {/* Display the icon */}
                                    </div>
                                    <input
                                      type="text"
                                      value={url}
                                      onChange={(e) => handleLinkChange(e, key)}
                                      className="border p-2 rounded-md w-full"
                                      placeholder="Enter your social media URL"
                                    />
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleSaveLink(key)} // Save the link
                                    className="ml-2 text-green-500 hover:text-green-700"
                                  >
                                    <FaSave />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleLinkDelete(key)} // Delete the link
                                    className="ml-2 text-red-500 hover:text-red-700"
                                  >
                                    <FaTrash />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <a
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center"
                                >
                                  {Icon} {/* Display the icon */}
                                </a>
                                <button
                                  type="button"
                                  className="absolute right-0 p-1 text-gray-500 text-xs transition-all duration-300 ease-in-out transform opacity-0 group-hover:opacity-100 group-hover:translate-x-6 h-10 w-7"
                                  onClick={() => handleLinkEditToggle(key)} // Toggle editing mode for this link
                                >
                                  <img src={edit} alt="edit"   loading="lazy"
                    draggable={false} />
                                </button>
                              </>
                            )}
                          </div>
                        );
                      })}
                  </div>
                  {fields.map((item, index) => (
                    <div key={item.id} className="flex flex-col">
                      <div className="flex items-center mb-2 pb-1">
                        <Controller
                          name={`links[${index}].link`}
                          control={control}
                          render={({ field, fieldState }) => (
                            <div className="flex items-center w-full">
                              <div className="flex items-center space-x-2 w-full">
                                <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full">
                                  {field.value && getSocialLogo(field.value)}{" "}
                                  {/* Display logo for new link */}
                                </div>
                                <input
                                  type="text"
                                  placeholder="Enter your social media URL"
                                  className={`p-2 border ${
                                    fieldState.error
                                      ? "border-red-500"
                                      : "border-[#737373]"
                                  } rounded-md w-full bg-gray-50 border-2 border-[#D1D5DB]`}
                                  {...field}
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  handleSaveNewLink(field.value, index)
                                } // Save the new link
                                className="ml-2 text-green-500 hover:text-green-700"
                              >
                                <FaSave />
                              </button>
                              <button
                                type="button"
                                onClick={() => remove(index)} // Remove link field
                                className="ml-2 text-red-500 hover:text-red-700"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          )}
                        />
                      </div>
                    </div>
                  ))}
                  {fields.length < 10 && (
                    <button
                      type="button"
                      onClick={() => {
                        if (fields.length < 10) {
                          append({ link: "" });
                        }
                      }}
                      className="flex items-center p-1 text-[#155EEF]"
                    >
                      <FaPlus className="mr-1" /> Add Another Link
                    </button>
                  )}
                </div>

                {/* Save/Cancel Section */}
                {/* {Object.values(isEditing).some((value) => value) && ( */}
                {(Object.values(isEditing).some((value) => value) ||
                  isLinkBeingEdited ||
                  isImageEditing) && (
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

import React, { useState, useRef, useEffect } from "react";
import edit from "../../../assets/Logo/edit.png";
import VerifiedIcon from "@mui/icons-material/Verified";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import { LinkedIn, GitHub, Telegram } from "@mui/icons-material";
import Select from "react-select";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCountries } from "react-countries";
import { useSelector } from "react-redux";
import { validationSchema } from './UserValidation';
export default function UserGeneralDetail() {
  const { countries } = useCountries();
  const userFullData = useSelector((currState) => currState.userData.data.Ok);
  console.log("User aa raha hai", userFullData);

  const [defaultValues, setDefaultValues] = useState({
    email: "",
    tagline: "",
    about: "",
    interests: [],
    location: "",
    domains_interested_in: [],
    reasons_to_join_platform: [],
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
  const [reasonOfJoiningSelectedOptions, setReasonOfJoiningSelectedOptions] =
    useState([]);


  const [socialLinks, setSocialLinks] = useState({
    LinkedIn: "https://www.linkedin.com/in/mattbowers",
    GitHub: "https://github.com/mattbowers",
    Telegram: "https://t.me/mattbowers",
  });

  const [isEditingLink, setIsEditingLink] = useState({
    LinkedIn: false,
    GitHub: false,
    Telegram: false,
  });

  const handleLinkEditToggle = (link) => {
    setIsEditingLink((prev) => {
      const newState = {
        LinkedIn: false,
        GitHub: false,
        Telegram: false,
      };
      newState[link] = !prev[link];
      return newState;
    });
  };

  const handleLinkChange = (e, link) => {
    setSocialLinks((prev) => ({
      ...prev,
      [link]: e.target.value,
    }));
  };

  const handleSaveLinks = () => {
    console.log("Links saved:", socialLinks);
    setIsEditingLink({
      LinkedIn: false,
      GitHub: false,
      Telegram: false,
    });
  };

  const {
    register,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "all",
    defaultValues,
  });

  useEffect(() => {
    if (userFullData) {
      const defaultValues = {
        email: userFullData.email?.[0] ?? 'mail@email.com',
        tagline: userFullData.tagline ?? 'Founder & CEO at Cypherpunk Labs',
        about: userFullData.bio?.[0] ?? 'Est malesuada ac elit gravida vel aliquam nec. Arcu pelle ntesque convallis quam feugiat non viverra massa fringilla.',
        interests: userFullData.interests ?? ['Web3', 'Cryptography'],
        location: userFullData.country ?? 'Austria',
        domains_interested_in: userFullData.type_of_profile ?? ['Web3', 'Blockchain'],
        reasons_to_join_platform: userFullData.reason_to_join?.flat() ?? ['Funding', 'Mentoring'],
      };

      Object.entries(defaultValues).forEach(([key, value]) => {
        setValue(key, value);
      });
      setDefaultValues(defaultValues);
    }
  }, [userFullData, setValue]);

  const [isEditing, setIsEditing] = useState({
    email: false,
    tagline: false,
    about: false,
    interests: false,
    location: false,
    reasons_to_join_platform: false,
  });

  const [profileData, setProfileData] = useState(defaultValues);
  const [tempData, setTempData] = useState(profileData);


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

  const handleInputChange = (e, field) => {
    setValue(field, e.target.value, { shouldValidate: true });
    setTempData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = () => {
    const isFormValid = Object.keys(errors).length === 0;

    if (isFormValid) {
      setProfileData(tempData);
      setIsEditing({
        email: false,
        tagline: false,
        about: false,
        interests: false,
        location: false,
        reasons_to_join_platform: false,
      });
    } else {
      console.log("Validation failed:", errors);
    }
  };

  const handleCancel = () => {
    setIsEditing({
      email: false,
      tagline: false,
      about: false,
      interests: false,
      location: false,
      reasons_to_join_platform: false,
    });
    setTempData(profileData);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const isAnyFieldEditing = Object.values({ ...isEditing, ...isEditingLink }).some((value) => value);

      if (
        isAnyFieldEditing &&
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        handleSave();
        setIsEditingLink({
          LinkedIn: false,
          GitHub: false,
          Telegram: false,
        });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditing, isEditingLink]);

    const fileInputRef = useRef(null);

  const handleEditClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };


  const containerRef = useRef(null);
 // User data map 
 const email = userFullData?.email[0];
 const bio = userFullData?.bio[0];
 const country = userFullData?.country;
 const area_of_interest = userFullData?.area_of_interest;
  return (

    
   <>
       <div className="px-1"  ref={containerRef}>
            <div className="mb-4 group relative hover:bg-gray-100 rounded-lg p-2 px-3">
              <div className="flex justify-between">
                <h3 className="font-semibold mb-2 text-xs text-gray-500 uppercase">
                  Email
                </h3>
                <div>
                  <button
                    className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
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
                    onChange={(e) => handleInputChange(e, "email")}
                    className={`bg-gray-50 border-1 ${errors?.email
                        ? "border-red-500"
                        : "border-gray-500"
                      } text-gray-900 placeholder-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2 py-1`}
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

            {/* Tagline Section */}
            {/* <div className="mb-4 group relative hover:bg-gray-100 rounded-lg p-2 px-3">
              <div className="flex justify-between">
                <h3 className="font-semibold mb-2 text-xs text-gray-500 uppercase">
                  Tagline
                </h3>
                <div>
                  <button
                    className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
                    onClick={() => handleEditToggle("tagline")}
                  >
                    {isEditing.tagline ? "" : <img src={edit} />}
                  </button>
                </div>
              </div>
              {isEditing.tagline ? (
                <>
                  <input
                    type="text"
                    value={tempData.tagline}
                    onChange={(e) => handleInputChange(e, "tagline")}
                    className={`bg-gray-50 border-1 ${errors?.tagline
                        ? "border-red-500"
                        : "border-gray-500"
                      } text-gray-900 placeholder-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2 py-1`}
                    placeholder="Enter your tagline"
                  />
                  {errors?.tagline && (
                    <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                      {errors?.tagline?.message}
                    </span>
                  )}
                </>
              ) : (
                <p className="text-sm">{profileData.tagline}</p>
              )}
            </div> */}

            {/* About Section */}
            <div className="mb-4 group relative hover:bg-gray-100 rounded-lg p-2 px-3">
              <div className="flex justify-between">
                <h3 className="font-semibold mb-2 text-xs text-gray-500 uppercase">
                  About
                </h3>
                <div>
                  <button
                    className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
                    onClick={() => handleEditToggle("about")}
                  >
                    {isEditing.about ? "" : <img src={edit}    loading="lazy"
                    draggable={false}/>}
                  </button>
                </div>
              </div>
              {isEditing.about ? (
                <textarea
                  {...register("about")}
                  value={tempData.about}
                  onChange={(e) => handleInputChange(e, "about")}
                  className={`bg-gray-50 border-2 ${errors?.about ? "border-red-500" : "border-[#737373]"
                    } text-gray-900 placeholder-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                  placeholder="Tell us about yourself"
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
                    className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
                    onClick={() => handleEditToggle("location")}
                  >
                    {isEditing.location ? "" : <img src={edit}    loading="lazy"
                    draggable={false}/>}
                  </button>
                </div>
              </div>
              {isEditing.location ? (
                <select
                  {...register("location")}
                  value={tempData.location}
                  onChange={(e) => {
                    handleInputChange(e, "location");
                  }}
                  className={`bg-gray-50 border-2 ${errors.location ? "border-red-500" : "border-[#737373]"
                    } text-gray-900 placeholder-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2 py-1`}
                >
                  <option value="" className="text-sm font-bold">
                    Select your country
                  </option>
                  {countries.map((country) => (
                    <option
                      key={country.name}
                      value={country.name}
                      className="text-sm font-bold"
                    >
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

            {/* Reasons to Join Platform Section */}
            <div className="mb-4 group relative hover:bg-gray-100 rounded-lg p-2 px-3">
              <div className="flex justify-between">
                <h3 className="font-semibold mb-2 text-xs text-gray-500 uppercase">
                  Reasons to Join Platform
                </h3>
                <div>
                  <button
                    className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
                    onClick={() => handleEditToggle("reasons_to_join_platform")}
                  >
                    {isEditing.reasons_to_join_platform ? "" : <img src={edit}    loading="lazy"
                    draggable={false}/>}
                  </button>
                </div>
              </div>
              {isEditing.reasons_to_join_platform ? (
                <Select
                  isMulti
                  options={reasonOfJoiningOptions}
                  value={reasonOfJoiningSelectedOptions}
                  onChange={(selectedOptions) => {
                    setReasonOfJoiningSelectedOptions(selectedOptions);
                    setTempData((prev) => ({
                      ...prev,
                      reasons_to_join_platform: selectedOptions.map(
                        (option) => option.value
                      ),
                    }));
                  }}
                  className="basic-single"
                  classNamePrefix="select"
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
                    className="invisible group-hover:visible text-gray-500 hover:underline text-xs h-4 w-4"
                    onClick={() => handleEditToggle("interests")}
                  >
                    {isEditing.interests ? "" : <img src={edit}    loading="lazy"
                    draggable={false}/>}
                  </button>
                </div>
              </div>
              {isEditing.interests ? (
                <Select
                  isMulti
                  options={interestedDomainsOptions}
                  value={interestedDomainsSelectedOptions}
                  onChange={(selectedOptions) => {
                    setInterestedDomainsSelectedOptions(selectedOptions);
                    setTempData((prev) => ({
                      ...prev,
                      domains_interested_in: selectedOptions.map(
                        (option) => option.value
                      ),
                    }));
                  }}
                  className="basic-single"
                  classNamePrefix="select"
                />
              ) : (
                <div className="flex flex-wrap gap-2">

                  <span

                    className="border-2 border-gray-500 rounded-full text-gray-700 text-xs px-2 py-1"
                  >
                    {area_of_interest}
                  </span>

                </div>
              )}
            </div>
            <div>
              <h3 className="mb-2 text-xs text-gray-500 px-3">LINKS</h3>
              <div className="flex items-center px-3">
                {/* LinkedIn */}
                <div className="group relative flex items-center">
                  <a
                    href={socialLinks.LinkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center"
                  >
                    <LinkedIn className="text-gray-400 hover:text-gray-600 cursor-pointer transform transition-all duration-300 hover:scale-110" />
                  </a>
                  <button
                    className="absolute right-0 p-1 text-gray-500 text-xs transition-all duration-300 ease-in-out transform opacity-0 group-hover:opacity-100 group-hover:translate-x-8  h-10 w-7"
                    onClick={() => handleLinkEditToggle("LinkedIn")}
                  >
                    <img src={edit}    loading="lazy"
                    draggable={false}/>
                  </button>
                  {isEditingLink.LinkedIn && (
                    <input
                      type="text"
                      value={socialLinks.LinkedIn}
                      onChange={(e) => handleLinkChange(e, "LinkedIn")}
                      className="border p-1 rounded w-full ml-2 transition-all duration-300 ease-in-out transform"
                    />
                  )}
                </div>

                {/* GitHub */}
                <div className="group relative flex items-center ml-8 group-hover:ml-8">
                  <a
                    href={socialLinks.GitHub}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center"
                  >
                    <GitHub className="text-gray-400 hover:text-gray-600 cursor-pointer transform transition-all duration-300 hover:scale-110" />
                  </a>
                  <button
                    className="absolute right-0 p-1 text-gray-500 text-xs transition-all duration-300 ease-in-out transform opacity-0 group-hover:opacity-100 group-hover:translate-x-8  h-10 w-7"
                    onClick={() => handleLinkEditToggle("GitHub")}
                  >
                    <img src={edit}   loading="lazy"
                    draggable={false} />
                  </button>
                  {isEditingLink.GitHub && (
                    <input
                      type="text"
                      value={socialLinks.GitHub}
                      onChange={(e) => handleLinkChange(e, "GitHub")}
                      className="border p-1 rounded w-full ml-2 transition-all duration-300 ease-in-out transform"
                    />
                  )}
                </div>

                {/* Telegram */}
                <div className="group relative flex items-center ml-8 group-hover:ml-8">
                  <a
                    href={socialLinks.Telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center"
                  >
                    <Telegram className="text-gray-400 hover:text-gray-600 cursor-pointer transform transition-all duration-300 hover:scale-110" />
                  </a>
                  <button
                    className="absolute right-0 p-1 text-gray-500 text-xs transition-all duration-300 ease-in-out transform opacity-0 group-hover:opacity-100 group-hover:translate-x-8  h-10 w-7"
                    onClick={() => handleLinkEditToggle("Telegram")}
                  >
                    <img src={edit}    loading="lazy"
                    draggable={false}/>
                  </button>
                  {isEditingLink.Telegram && (
                    <input
                      type="text"
                      value={socialLinks.Telegram}
                      onChange={(e) => handleLinkChange(e, "Telegram")}
                      className="border p-1 rounded w-full ml-2 transition-all duration-300 ease-in-out transform"
                    />
                  )}
                </div>
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
                    type="button"
                    onClick={handleSave}
                    className="bg-blue-600 text-white py-2 px-4 rounded"
                  >
                    Save
                  </button>
                </div>
              )}
            </div>
         
          </div>
   </>
  )
}

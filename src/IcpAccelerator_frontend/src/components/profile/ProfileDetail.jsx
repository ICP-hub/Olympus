import React, { useState, useRef, useEffect } from 'react';
import ProfileImage from "../../../assets/Logo/ProfileImage.png";
import edit from "../../../assets/Logo/edit.png";

import VerifiedIcon from "@mui/icons-material/Verified";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import ArrowOutwardOutlinedIcon from '@mui/icons-material/ArrowOutwardOutlined';
import Select from "react-select";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useCountries } from "react-countries";
import { useSelector } from 'react-redux';
import {
  LinkedIn,
  GitHub,
  Telegram,
} from "@mui/icons-material";
import InvestorDetail from './InvestorDetail';

const ProfileDetail = () => {
  const { countries } = useCountries();
  const [interestedDomainsOptions, setInterestedDomainsOptions] = useState([]);
  const [interestedDomainsSelectedOptions, setInterestedDomainsSelectedOptions] = useState([]);
  const [reasonOfJoiningOptions, setReasonOfJoiningOptions] = useState([
    { value: "listing_and_promotion", label: "Project listing and promotion" },
    { value: "Funding", label: "Funding" },
    { value: "Mentoring", label: "Mentoring" },
    { value: "Incubation", label: "Incubation" },
    { value: "Engaging_and_building_community", label: "Engaging and building community" },
    { value: "Jobs", label: "Jobs" },
  ]);
  const [reasonOfJoiningSelectedOptions, setReasonOfJoiningSelectedOptions] = useState([]);

  const validationSchema = yup.object().shape({
    full_name: yup.string().required("Full name is required"),
    email: yup.string().email("Invalid email").nullable(true).optional(),
    bio: yup.string().optional().test(
      "maxWords",
      "Bio must not exceed 50 words",
      (value) => !value || value.trim().split(/\s+/).filter(Boolean).length <= 50
    ).test(
      "maxChars",
      "Bio must not exceed 500 characters",
      (value) => !value || value.length <= 500
    ),
    location: yup.string().required("Location is required"), // Changed to location instead of country
    domains_interested_in: yup.string().required("Selecting an interest is required"),
    type_of_profile: yup.string().required("Type of profile is required"),
    reasons_to_join_platform: yup.string().required("Selecting a reason is required"),
  }).required();

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
        Telegram: false
      };
      newState[link] = !prev[link];
      return newState;
    });
  };

  const handleLinkChange = (e, link) => {
    setSocialLinks((prev) => ({
      ...prev,
      [link]: e.target.value
    }));
  };

  const handleSaveLinks = () => {
    console.log('Links saved:', socialLinks);
    setIsEditingLink({
      LinkedIn: false,
      GitHub: false,
      Telegram: false
    });
  };

  const defaultValues = {
    email: 'mail@email.com',
    tagline: 'Founder & CEO at Cypherpunk Labs',
    about: 'Est malesuada ac elit gravida vel aliquam nec. Arcu pelle ntesque convallis quam feugiat non viverra massa fringilla.',
    interests: ['Web3', 'Cryptography'],
    location: 'Austria',
    domains_interested_in: ['Web3', 'Blockchain'], // Default interests
    reasons_to_join_platform: ['Funding', 'Mentoring'], // Default reasons
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
  const containerRef = useRef(null);

  const handleEditToggle = (field) => {
    setIsEditing({ ...isEditing, [field]: !isEditing[field] });
  };

  const areaOfExpertise = useSelector((currState) => currState.expertiseIn.expertise);

  useEffect(() => {
    if (areaOfExpertise) {
      setInterestedDomainsOptions(areaOfExpertise.map((expert) => ({
        value: expert.name,
        label: expert.name,
      })));
    } else {
      setInterestedDomainsOptions([]);
    }
  }, [areaOfExpertise]);

  const handleInputChange = (e, field) => {
    setValue(field, e.target.value, { shouldValidate: true });
    setTempData(prev => ({ ...prev, [field]: e.target.value }));
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
      console.log('Validation failed:', errors);
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
      const isAnyFieldEditing = Object.values(isEditing).some((value) => value);

      if (isAnyFieldEditing && containerRef.current && !containerRef.current.contains(event.target)) {
        handleSave();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEditing]);

  const handleChange = (tab) => {
    setActiveTab(tab)
  }
  const [activeTab, setActiveTab] = useState("general");


  return (
    <div ref={containerRef} className="container bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden w-full max-w-[400px]">
      <div className="relative h-1 bg-gray-200">
        <div className="absolute left-0 top-0 h-full bg-green-500 w-1/3"></div>
      </div>
      <div className="p-6 bg-gray-50">
        <img src={ProfileImage} alt="Matt Bowers" className="w-24 h-24 mx-auto rounded-full mb-4" />
        <div className="flex items-center justify-center mb-1">
          <VerifiedIcon className="text-blue-500 mr-1" fontSize="small" />
          <h2 className="text-xl font-semibold">Matt Bowers</h2>
        </div>
        <p className="text-gray-600 text-center mb-4">@mattbowers</p>
        <button className="w-full h-[#155EEF] bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 mb-6 flex items-center justify-center">
          Get in touch
          <ArrowOutwardOutlinedIcon className="ml-1" fontSize="small" />
        </button>
      </div>

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
            <button
              className={`px-4 py-2 focus:outline-none font-medium  ${activeTab === "general"
                ? "border-b-2 border-blue-500 text-blue-500 font-medium"
                : "text-gray-400"
                }`}
              onClick={() => handleChange("general")}
            >
              General
            </button>
            <button
              className={`px-4 py-2 focus:outline-none font-medium  ${activeTab === "investor"
                ? "border-b-2 border-blue-500 text-blue-500 font-medium"
                : "text-gray-400"
                }`}
              onClick={() => handleChange("investor")}
            >
              Investor
            </button>
            
          </div>

        {/* <div className="mb-4">
          <div className="flex border-b">
            <button className="text-blue-600 border-b-2 border-blue-600 pb-2 mr-4 font-medium">
              General
            </button>
            
          </div>
        </div> */}

        {/* Email Section */}
        {activeTab=== "general" ? 
        <div className=' px-1'>
          <div className="mb-4  group relative hover:bg-[#E3E8EF] rounded-lg p-2 px-3">
            <div className='flex justify-between'>
              <h3 className="font-semibold mb-2 text-xs text-gray-500 uppercase">Email</h3>
              <div>
                <button
                  className=" invisible group-hover:visible text-gray-500  hover:underline text-xs h-4 w-4"
                  onClick={() => handleEditToggle('email')}
                >
                  {isEditing.email ? '' : < img src={edit} />}
                </button>
              </div>
            </div>
            {isEditing.email ? (
              <>
                <input
                  type="email"
                  {...register("email")}
                  onChange={(e) => handleInputChange(e, 'email')}
                  className={`bg-gray-50 border-1 ${errors?.email ? "border-red-500" : "border-gray-500"} text-gray-900 placeholder-gray-500  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2 py-1`}
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
                <p className="mr-2 text-sm">{profileData.email}</p>
                <VerifiedIcon className="text-blue-500 mr-2 w-2 h-2" fontSize="small" />
                <span className="bg-[#F8FAFC] border border-[#E3E8EF] text-[#364152] px-2 py-0.5 rounded text-xs">
                  HIDDEN
                </span>
              </div>
            )}

          </div>

          {/* Tagline Section */}
          <div className="mb-4 group relative hover:bg-[#E3E8EF] rounded-lg p-1 px-3">
            {/* <h3 className="font-semibold mb-2 text-xs text-gray-500 uppercase">Tagline</h3> */}
            <div className='flex justify-between'>
              <h3 className="font-semibold mb-2 text-xs text-gray-500 uppercase">Tagline</h3>
              <div>
                <button
                  className=" invisible group-hover:visible text-gray-500  hover:underline text-xs h-4 w-4"
                  onClick={() => handleEditToggle('tagline')}
                >
                  {isEditing.email ? '' : < img src={edit} />}
                </button>
              </div>
            </div>
            {isEditing.tagline ? (
              <input
                type="text"
                value={tempData.tagline}
                onChange={(e) => handleInputChange(e, 'tagline')}
                className=" px-2 py-1 w-full bg-[#F8FAFC] border border-[#E3E8EF] text-[#364152] rounded text-sm"
              />
            ) : (
              <p className="text-sm">{profileData.tagline}</p>
            )}

          </div>

          {/* About Section */}
          <div className="mb-4 group relative hover:bg-[#E3E8EF] rounded-lg p-1 px-3">
            <div className='flex justify-between'>
              <h3 className="font-semibold mb-2 text-xs text-gray-500 uppercase">About</h3>
              <div>
                <button
                  className=" invisible group-hover:visible text-gray-500  hover:underline text-xs h-4 w-4"
                  onClick={() => handleEditToggle('about')}
                >
                  {isEditing.email ? '' : < img src={edit} />}
                </button>
              </div>
            </div>
            {isEditing.about ? (
              <textarea
                {...register("about")}
                value={tempData.about}
                onChange={(e) => handleInputChange(e, 'about')}
                className={`bg-gray-50 border-2 ${errors?.about ? "border-red-500" : "border-[#737373]"} text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                placeholder="Tell us about yourself"
              />
            ) : (
              <p className="text-sm">{profileData.about}</p>
            )}

          </div>

          {/* Location Section */}
          <div className="mb-4 group relative hover:bg-[#E3E8EF] rounded-lg p-1 px-3">
            <div className='flex justify-between'>
              <h3 className="font-semibold mb-2 text-xs text-gray-500 uppercase">Location</h3>
              <div>
                <button
                  className=" invisible group-hover:visible text-gray-500  hover:underline text-xs h-4 w-4"
                  onClick={() => handleEditToggle('location')}
                >
                  {isEditing.location ? '' : < img src={edit} />}
                </button>
              </div>
            </div>

            {isEditing.location ? (
              <select
                {...register("location")}
                value={tempData.location}
                onChange={(e) => {
                  handleInputChange(e, 'location');
                }}
                className={`bg-gray-50 border-2 ${errors.location ? "border-red-500" : "border-[#737373]"} text-gray-900 placeholder-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2 py-1`}
              >
                <option value="" className="text-sm font-bold">Select your country</option>
                {countries.map((country) => (
                  <option key={country.name} value={country.name} className="text-sm font-bold">
                    {country.name}
                  </option>
                ))}
              </select>
            ) : (
              <div className="flex items-center">
                <PlaceOutlinedIcon className="text-gray-500 mr-1" fontSize="small" />
                <p className="text-sm">{profileData.location}</p>
              </div>
            )}

          </div>

          {/* Reasons to Join Platform Section */}
          <div className="mb-4 group relative hover:bg-[#E3E8EF] rounded-lg p-1 px-3">
            <div className='flex justify-between'>
              <h3 className="font-semibold mb-2 text-xs text-gray-500 uppercase">Reasons to Join Platform</h3>
              <div>
                <button
                  className=" invisible group-hover:visible text-gray-500  hover:underline text-xs h-4 w-4"
                  onClick={() => handleEditToggle('reasons_to_join_platform')}
                >
                  {isEditing.reasons_to_join_platform ? '' : < img src={edit} />}
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
                  setTempData(prev => ({
                    ...prev,
                    reasons_to_join_platform: selectedOptions.map(option => option.value),
                  }));
                }}
                className="basic-single"
                classNamePrefix="select"
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {profileData.reasons_to_join_platform.map((reason) => (
                  <span key={reason} className="border-2 border-gray-500 rounded-full text-gray-700 text-xs px-2 py-1 ">
                    {reason}
                  </span>
                ))}
              </div>
            )}

          </div>

          {/* Interests Section */}
          <div className="mb-4 group relative hover:bg-[#E3E8EF] rounded-lg p-1 px-3">
            <div className='flex justify-between'>
              <h3 className="font-semibold mb-2 text-xs text-gray-500 uppercase">Interests</h3>
              <div>
                <button
                  className=" invisible group-hover:visible text-gray-500  hover:underline text-xs h-4 w-4"
                  onClick={() => handleEditToggle('interests')}
                >
                  {isEditing.interests ? '' : < img src={edit} />}
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
                  setTempData(prev => ({
                    ...prev,
                    domains_interested_in: selectedOptions.map(option => option.value),
                  }));
                }}
                className="basic-single"
                classNamePrefix="select"
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {profileData.domains_interested_in.map((interest) => (
                  <span key={interest} className="border-2 border-gray-500 rounded-full text-gray-700 text-xs px-2 py-1 ">
                    {interest}
                  </span>
                ))}
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
                  <img src={edit} />
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
                  <img src={edit} />
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
                  <img src={edit} />
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

            {/* Save Section */}
            {Object.values(isEditingLink).some((value) => value) && (
              <div className="flex justify-end gap-4 mt-4">
                <button
                  type="button"
                  onClick={handleSaveLinks}
                  className="bg-blue-600 text-white py-2 px-4 rounded transition-all duration-300 ease-in-out transform hover:bg-blue-700 hover:scale-105"
                >
                  Save
                </button>
              </div>
            )}
          </div>

          {/* Save/Cancel Section */}
          {(Object.values(isEditing).some(value => value)) && (
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
        </div> : <InvestorDetail /> }
      </div>
    </div>
  );
};

export default ProfileDetail;

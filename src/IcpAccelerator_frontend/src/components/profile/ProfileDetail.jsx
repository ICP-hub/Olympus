import React, { useState, useRef, useEffect } from 'react';
import ProfileImage from "../../../assets/Logo/ProfileImage.png";
import VerifiedIcon from "@mui/icons-material/Verified";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import ArrowOutwardOutlinedIcon from '@mui/icons-material/ArrowOutwardOutlined';
import EditIcon from '@mui/icons-material/Edit';
import Select from "react-select";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSelector } from 'react-redux';
import {
  ArrowForward,
  LinkedIn,
  GitHub,
  Telegram,
  Add,
} from "@mui/icons-material";

const ProfileDetail = () => {
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
    country: yup.string().required("Country is required"),
    domains_interested_in: yup.string().required("Selecting an interest is required"),
    type_of_profile: yup.string().required("Type of profile is required"),
    reasons_to_join_platform: yup.string().required("Selecting a reason is required"),
  }).required();

  const defaultValues = {
    email: 'mail@email.com',
    tagline: 'Founder & CEO at Cypherpunk Labs',
    about: 'Est malesuada ac elit gravida vel aliquam nec. Arcu pelle ntesque convallis quam feugiat non viverra massa fringilla.',
    interests: ['Web3', 'Cryptography'],
    location: 'San Diego, CA',
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
    setProfileData(tempData);
    setIsEditing({
      email: false,
      tagline: false,
      about: false,
      interests: false,
      location: false,
      reasons_to_join_platform: false,
    });
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
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        handleCancel();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
          <h3 className="font-normal mb-2 text-xs text-gray-500 uppercase">
            Roles
          </h3>
          <div className="flex space-x-2">
            <span className="bg-[#F0F9FF] border border-[#B9E6FE] text-[#026AA2] px-3 py-1 rounded-md text-xs font-medium">
              OLYMPIAN
            </span>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex border-b">
            <button className="text-blue-600 border-b-2 border-blue-600 pb-2 mr-4 font-medium">
              General
            </button>
            {/* <button className="text-gray-400 pb-2 font-medium">
                Expertise
              </button> */}
          </div>
        </div>

        {/* Email Section */}
        <div className=' px-1'>
          <div className="mb-4 group relative hover:bg-[#E3E8EF] rounded-lg p-1">
            <h3 className="font-normal mb-2 text-xs text-gray-500 uppercase">Email</h3>
            {isEditing.email ? (
              <>
                <input
                  type="email"
                  {...register("email")}
                  onChange={(e) => handleInputChange(e, 'email')}
                  className={`bg-gray-50 border-2 ${errors?.email ? "border-red-500" : "border-[#737373]"} text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
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
            <button
              className="absolute right-0 top-0 invisible group-hover:visible text-black p-1 hover:underline text-xs"
              onClick={() => handleEditToggle('email')}
            >
              {isEditing.email ? '' : <EditIcon />}
            </button>
          </div>

          {/* Tagline Section */}
          <div className="mb-4 group relative hover:bg-[#E3E8EF] rounded-lg p-1">
            <h3 className="font-normal mb-2 text-xs text-gray-500 uppercase">Tagline</h3>
            {isEditing.tagline ? (
              <input
                type="text"
                value={tempData.tagline}
                onChange={(e) => handleInputChange(e, 'tagline')}
                className="border p-1 w-full rounded"
              />
            ) : (
              <p className="text-sm">{profileData.tagline}</p>
            )}
            <button
              className="absolute right-0 top-0 invisible group-hover:visible p-1 text-black hover:underline text-xs"
              onClick={() => handleEditToggle('tagline')}
            >
              {isEditing.tagline ? '' : <EditIcon />}
            </button>
          </div>

          {/* About Section */}
          <div className="mb-4 group relative hover:bg-[#E3E8EF] rounded-lg p-1">
            <h3 className="font-normal mb-2 text-xs text-gray-500 uppercase">About</h3>
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
            <button
              className="absolute right-0 top-0 invisible group-hover:visible text-black p-1 hover:underline text-xs"
              onClick={() => handleEditToggle('about')}
            >
              {isEditing.about ? '' : <EditIcon />}
            </button>
          </div>

          {/* Location Section */}
          <div className="mb-4 group relative hover:bg-[#E3E8EF] rounded-lg p-1">
            <h3 className="font-normal mb-2 text-xs text-gray-500 uppercase">Location</h3>
            {isEditing.location ? (
              <input
                type="text"
                value={tempData.location}
                onChange={(e) => handleInputChange(e, 'location')}
                className="border p-1 w-full rounded"
              />
            ) : (
              <div className="flex items-center">
                <PlaceOutlinedIcon className="text-gray-500 mr-1" fontSize="small" />
                <p className="text-sm">{profileData.location}</p>
              </div>
            )}
            <button
              className="absolute right-0 top-0 invisible group-hover:visible p-1 text-black hover:underline text-xs"
              onClick={() => handleEditToggle('location')}
            >
              {isEditing.location ? '' : <EditIcon />}
            </button>
          </div>

          {/* Reasons to Join Platform Section */}
          <div className="mb-4 group relative hover:bg-[#E3E8EF] rounded-lg p-1">
            <h3 className="font-normal mb-2 text-xs text-gray-500 uppercase">Reasons to Join Platform</h3>
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
            <button
              className="absolute right-0 top-0 invisible group-hover:visible p-1 text-black hover:underline text-xs"
              onClick={() => handleEditToggle('reasons_to_join_platform')}
            >
              {isEditing.reasons_to_join_platform ? '' : <EditIcon />}
            </button>
          </div>

          {/* Interests Section */}
          <div className="mb-4 group relative hover:bg-[#E3E8EF] rounded-lg p-1">
            <h3 className="font-normal mb-2 text-xs text-gray-500 uppercase">Interests</h3>
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
            <button
              className="absolute right-0 top-0 invisible group-hover:visible p-1 text-black hover:underline text-xs"
              onClick={() => handleEditToggle('interests')}
            >
              {isEditing.interests ? '' : <EditIcon />}
            </button>
          </div>
          <div>
            <h3 className="mb-2 text-xs text-gray-500">LINKS</h3>
            <div className="flex space-x-2">
              <LinkedIn className="text-gray-400 hover:text-gray-600 cursor-pointer" />
              <GitHub className="text-gray-400 hover:text-gray-600 cursor-pointer" />
              <Telegram className="text-gray-400 hover:text-gray-600 cursor-pointer" />
            </div>
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
        </div>
      </div>
    </div>
  );
};

export default ProfileDetail;

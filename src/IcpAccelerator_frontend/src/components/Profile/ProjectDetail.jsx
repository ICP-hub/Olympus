import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useCountries } from "react-countries";
import { useSelector } from "react-redux";
import ProfileSection from "./ProfileSection";
import SocialLinks from "./SocialLinks";
import InvestorDetail from "./InvestorDetail";
import MentorEdit from "../../component/Mentors/MentorEdit";
import ProjectDetail from "./ProjectDetail";
import ProfileHeader from "./ProjectHeader";

const ProfileDetail = () => {
  const { countries } = useCountries();
  const userFullData = useSelector((currState) => currState.userData.data.Ok);

  const [defaultValues, setDefaultValues] = useState({
    email: "",
    tagline: "",
    about: "",
    interests: [],
    location: "",
    domains_interested_in: [],
    reasons_to_join_platform: [],
  });

  const [isEditing, setIsEditing] = useState({
    email: false,
    tagline: false,
    about: false,
    interests: false,
    location: false,
    reasons_to_join_platform: false,
  });

  const [isEditingLink, setIsEditingLink] = useState({
    LinkedIn: false,
    GitHub: false,
    Telegram: false,
  });

  const [socialLinks, setSocialLinks] = useState({
    LinkedIn: "https://www.linkedin.com/in/mattbowers",
    GitHub: "https://github.com/mattbowers",
    Telegram: "https://t.me/mattbowers",
  });

  const [tempData, setTempData] = useState(defaultValues);
  const [profileData, setProfileData] = useState(defaultValues);

  const validationSchema = yup
    .object()
    .shape({
      full_name: yup.string().required("Full name is required"),
      email: yup.string().email("Invalid email").nullable(true).optional(),
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
      location: yup.string().required("Location is required"),
      domains_interested_in: yup
        .string()
        .required("Selecting an interest is required"),
      type_of_profile: yup.string().required("Type of profile is required"),
      reasons_to_join_platform: yup
        .string()
        .required("Selecting a reason is required"),
    })
    .required();

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
      setTempData(defaultValues);
      setProfileData(defaultValues);
    }
  }, [userFullData, setValue]);

  const handleEditToggle = (field) => {
    setIsEditing({ ...isEditing, [field]: !isEditing[field] });
  };

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

  const handleInputChange = (e, field, isSelect = false) => {
    const value = isSelect ? e : e.target.value;
    setValue(field, value, { shouldValidate: true });
    setTempData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLinkChange = (e, link) => {
    setSocialLinks((prev) => ({
      ...prev,
      [link]: e.target.value,
    }));
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
      setIsEditingLink({
        LinkedIn: false,
        GitHub: false,
        Telegram: false,
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

  return (
    <div className="container bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden w-full max-w-[400px]">
      <div className="relative h-1 bg-gray-200">
        <div className="absolute left-0 top-0 h-full bg-green-500 w-1/3"></div>
      </div>

      {activeTab === "general" && (
        <ProfileHeader
          ProfileImage={userFullData?.profile_picture[0]}
          Fullname={userFullData?.full_name}
          openchat_username={userFullData?.openchat_username[0]}
        />
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
          <>
            <ProfileSection
              label="Email"
              field="email"
              isEditing={isEditing.email}
              errors={errors}
              register={register}
              handleEditToggle={handleEditToggle}
              handleInputChange={handleInputChange}
              value={tempData.email}
            />
            <ProfileSection
              label="About"
              field="about"
              type="textarea"
              isEditing={isEditing.about}
              errors={errors}
              register={register}
              handleEditToggle={handleEditToggle}
              handleInputChange={handleInputChange}
              value={tempData.about}
            />
            <ProfileSection
              label="Location"
              field="location"
              type="select"
              isEditing={isEditing.location}
              errors={errors}
              register={register}
              handleEditToggle={handleEditToggle}
              handleInputChange={handleInputChange}
              value={tempData.location}
              countries={countries}
            />
            <ProfileSection
              label="Reasons to Join Platform"
              field="reasons_to_join_platform"
              isEditing={isEditing.reasons_to_join_platform}
              errors={errors}
              register={register}
              handleEditToggle={handleEditToggle}
              handleInputChange={handleInputChange}
              options={reasonOfJoiningOptions}
              value={reasonOfJoiningSelectedOptions}
            />
            <ProfileSection
              label="Interests"
              field="interests"
              isEditing={isEditing.interests}
              errors={errors}
              register={register}
              handleEditToggle={handleEditToggle}
              handleInputChange={handleInputChange}
              options={interestedDomainsOptions}
              value={interestedDomainsSelectedOptions}
            />
            <SocialLinks
              socialLinks={socialLinks}
              isEditingLink={isEditingLink}
              handleLinkEditToggle={handleLinkEditToggle}
              handleLinkChange={handleLinkChange}
            />
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
          </>
        )}

        {/* Investor Tab Content */}
        {userRole === "investor" && activeTab === "investor" && (
          <InvestorDetail />
        )}

        {/* Mentor Tab Content */}
        {userRole === "mentor" && activeTab === "mentor" && (
          <MentorEdit />
        )}

        {/* Project Tab Content */}
        {userRole === "project" && activeTab === "project" && (
          <ProjectDetail />
        )}
      </div>
    </div>
  );
};

export default ProfileDetail;


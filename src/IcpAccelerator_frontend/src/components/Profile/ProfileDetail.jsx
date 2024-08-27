import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useCountries } from "react-countries";
import { useDispatch, useSelector } from "react-redux";
import ProfileHeader from "./ProjectHeader";
import ProfileSection from "./ProfileSection";
import SocialLinks from "./SocialLinks";
import InvestorDetail from "./InvestorDetail";
import MentorEdit from "../../component/Mentors/MentorEdit";
import ProjectDetail from "./ProjectDetail";
import { founderRegisteredHandlerRequest } from "../StateManagement/Redux/Reducers/founderRegisteredData";
import { mentorRegisteredHandlerRequest } from "../StateManagement/Redux/Reducers/mentorRegisteredData";
import { investorRegisteredHandlerRequest } from "../StateManagement/Redux/Reducers/investorRegisteredData";
import { validationSchema } from "./UserValidation";
import { Principal } from "@dfinity/principal";
import uint8ArrayToBase64 from "../Utils/uint8ArrayToBase64";
import toast, { Toaster } from "react-hot-toast";

const ProfileDetail = () => {
  const { countries } = useCountries();
  const [imageData, setImageData] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const userFullData = useSelector((currState) => currState.userData.data.Ok);
  const userRole = useSelector(
    (currState) => currState.currentRoleStatus.activeRole
  );
  const principal = useSelector((currState) => currState.internet.principal);
  const isAuthenticated = useSelector(
    (currState) => currState.internet.isAuthenticated
  );
  const actor = useSelector((currState) => currState.actors.actor);
  const dispatch = useDispatch();
  const [reasonOfJoiningSelectedOptions, setReasonOfJoiningSelectedOptions] = useState([]);
  const [reasonOfJoiningOptions] = useState([
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
    LinkedIn: "",
    GitHub: "",
    Telegram: "",
  });

  const [formValues, setFormValues] = useState({
    email: "",
    tagline: "",
    about: "",
    location: "",
    domains_interested_in: [],
    reasons_to_join_platform: [],
  });

  const [activeTab, setActiveTab] = useState("general");
  const [interestedDomainsOptions, setInterestedDomainsOptions] = useState([]);
  const [
    interestedDomainsSelectedOptions,
    setInterestedDomainsSelectedOptions,
  ] = useState([]);

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "all",
  });

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

  const setUserValuesHandler = (val) => {
    console.log("val", val);
    if (val) {
      setValue("full_name", val?.fullName ?? "");
      setValue("email", val?.email ?? "");
      setValue("openchat_user_name", val?.openchatUsername ?? "");
      setValue("bio", val?.bio ?? "");
      setValue("country", val?.country ?? "");
      setValue("domains_interested_in", val?.areaOfInterest ?? "");
      setInterestedDomainsSelectedOptionsHandler(val?.areaOfInterest ?? null);
      setImagePreview(val?.profilePicture ?? "");
      setImageData(
        val?.profile_picture instanceof Uint8Array
          ? uint8ArrayToBase64(val?.profile_picture)
          : ""
      );
      setValue("type_of_profile", val?.typeOfProfile);
      setValue(
        "reasons_to_join_platform",
        val?.reasonToJoin ? val?.reasonToJoin.join(", ") : ""
      );
      setReasonOfJoiningSelectedOptionsHandler(val?.reasonToJoin);

      // Set social links
      setSocialLinks({
        LinkedIn: val?.social_links?.[0]?.link?.[0] || "",
        GitHub: val?.social_links?.[0]?.link?.[1] || "",
        Telegram: val?.social_links?.[0]?.link?.[2] || "",
      });
    }
  };

  const setInterestedDomainsSelectedOptionsHandler = (val) => {
    setInterestedDomainsSelectedOptions(
      val
        ? val
            ?.split(", ")
            ?.map((interest) => ({ value: interest, label: interest }))
        : []
    );
  };

  const setReasonOfJoiningSelectedOptionsHandler = (val) => {
    setReasonOfJoiningSelectedOptions(
      val && val.length > 0
        ? val?.map((reason) => ({ value: reason, label: reason }))
        : []
    );
  };

  useEffect(() => {
    if (userFullData) {
      setUserValuesHandler(userFullData);
    }
  }, [userFullData]);

  const handleEditToggle = (field) => {
    setIsEditing({ ...isEditing, [field]: !isEditing[field] });
  };

  const handleLinkEditToggle = (link) => {
    setIsEditingLink({ ...isEditingLink, [link]: !isEditingLink[link] });
  };

  const handleInputChange = (e, field) => {
    setFormValues({ ...formValues, [field]: e.target.value });
  };

  const handleLinkChange = (e, link) => {
    setSocialLinks({ ...socialLinks, [link]: e.target.value });
  };

  const handleSave = async () => {
    const convertedPrincipal = await Principal.fromText(principal);

    if (actor) {
      const user_data = {
        bio: formValues.about ? [formValues.about] : [""],
        full_name: formValues.full_name,
        email: [formValues.email],
        social_links: Object.entries(socialLinks).map(([platform, link]) => ({
          platform,
          link,
        })),
        openchat_username: [formValues.openchat_username || ""],
        country: formValues.location || "Unknown",
        area_of_interest: formValues.domains_interested_in || "",
        type_of_profile: [formValues.type_of_profile || ""],
        reason_to_join: [
          formValues.reasons_to_join_platform
            .split(",")
            .map((val) => val.trim()) || [""],
        ],
        profile_picture: imageData ? [imageData] : [],
      };

      try {
        await actor.update_user_data(convertedPrincipal, user_data).then((result) => {
          if ("Ok" in result) {
            toast.success("User profile updated successfully");
            setTimeout(() => {
              window.location.href = "/";
            }, 500);
          } else {
            toast.error("Error updating user profile");
          }
        });
      } catch (error) {
        toast.error("Error sending data to the backend:", error);
      }
    } else {
      toast.error("Please signup with internet identity first");
      window.location.href = "/";
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
    setUserValuesHandler(userFullData); // Reset form to original values
  };

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
                  onClick={() => setActiveTab(tab.role)}
                >
                  {tab.label}
                </button>
              )
          )}
        </div>

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
              type="text"
              value={formValues.email}
            />

            <ProfileSection
              label="Bio"
              field="about"
              isEditing={isEditing.about}
              errors={errors}
              register={register}
              handleEditToggle={handleEditToggle}
              handleInputChange={handleInputChange}
              type="textarea"
              value={formValues.about}
            />

            <ProfileSection
              label="Location"
              field="location"
              isEditing={isEditing.location}
              errors={errors}
              register={register}
              handleEditToggle={handleEditToggle}
              handleInputChange={handleInputChange}
              type="select"
              value={formValues.location}
              countries={countries}
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
              type="select"
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
              type="select"
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
                  onClick={handleSubmit(handleSave)}
                  className="bg-blue-600 text-white py-2 px-4 rounded"
                >
                  Save
                </button>
              </div>
            )}
          </>
        )}

        {userRole === "investor" && activeTab === "investor" && (
          <InvestorDetail />
        )}

        {userRole === "mentor" && activeTab === "mentor" && <MentorEdit />}

        {userRole === "project" && activeTab === "project" && <ProjectDetail />}
      </div>
      <Toaster />
    </div>
  );
};

export default ProfileDetail;

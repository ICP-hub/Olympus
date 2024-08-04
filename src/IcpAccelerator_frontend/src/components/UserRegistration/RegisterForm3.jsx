import React, { useState, useEffect } from "react";
import Aboutcard from "./Aboutcard";
import Layer1 from "../../../assets/Logo/Layer1.png";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ReactSelect from "react-select";
import { useSelector } from "react-redux";
import { useCountries } from "react-countries";

import DoneIcon from "@mui/icons-material/Done";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";
import { useFormContext, Controller } from "react-hook-form";
import {
  FaLinkedin,
  FaTwitter,
  FaGithub,
  FaTelegram,
  FaFacebook,
  FaInstagram,
} from "react-icons/fa";
import CompressedImage from "../../component/ImageCompressed/CompressedImage";





const RegisterForm3 = () => {
  const { countries } = useCountries();
  const areaOfExpertise = useSelector(
    (currState) => currState.expertiseIn.expertise
  );
  const typeOfProfile = useSelector(
    (currState) => currState.profileTypes.profiles
  );
  const userFullData = useSelector((currState) => currState.userData.data.Ok);
  const userCurrentRoleStatusActiveRole = useSelector(
    (currState) => currState.currentRoleStatus.activeRole
  );
  const principal = useSelector((currState) => currState.internet.principal);
  const [
    interestedDomainsSelectedOptions,
    setInterestedDomainsSelectedOptions,
  ] = useState([]);
  const [reasonOfJoiningSelectedOptions, setReasonOfJoiningSelectedOptions] =
    useState([]);
  const [interestedDomainsOptions, setInterestedDomainsOptions] = useState([]);
  const [typeOfProfileOptions, setTypeOfProfileOptions] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageData, setImageData] = useState(null);
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

  const {
    register,
    formState: { errors },
    trigger,
    setValue,
    clearErrors,
    setError,
    control,
  } = useFormContext();

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

  const handleLinkChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      links: {
        ...formData.links,
        [name]: value,
      },
    });
  };

  const getLogo = (url) => {
    if (url.includes("linkedin.com")) {
      return <FaLinkedin className="text-blue-600" />;
    } else if (url.includes("twitter.com")) {
      return <FaTwitter className="text-blue-400" />;
    } else if (url.includes("github.com")) {
      return <FaGithub className="text-gray-700" />;
    } else if (url.includes("telegram.com")) {
      return <FaTelegram className="text-blue-400" />;
    } else if (url.includes("facebook.com")) {
      return <FaFacebook className="text-blue-400" />;
    } else if (url.includes("instagram.com")) {
      return <FaInstagram className="text-pink-950" />;
    } else {
      return null;
    }
  };

  return (

    <div className="">

      <h2 className="text-3xl font-bold mb-4">Tell about yourself</h2>
      <label className="block text-sm font-medium mb-2">
        Upload a photo<span className="text-[#155EEF]">*</span>
      </label>


      <div className="flex gap-2 mb-3">
        <div className="h-24 w-24 rounded-2xl border-2 border-dashed border-gray-300 items-center justify-center overflow-hidden flex">
          {imagePreview && !errors.image ? (
            <img
              src={imagePreview}
              alt="Profile"
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
        <div className="flex gap-1 items-center justify-center">
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
                  className="font-medium text-gray-700 border border-[#CDD5DF] px-4 py-1 cursor-pointer rounded"
                ><ControlPointIcon
                    fontSize="small"
                    className="items-center -mt-1 mr-2"
                  />
                  {imagePreview && !errors.image
                    ? "Change profile picture"
                    : "Upload profile picture"}
                </label>
                {imagePreview || errors.image ? (
                  <button
                    className="font-medium px-4 py-1 cursor-pointer rounded border border-red-500 items-center text-md bg-transparent text-red-500  capitalize ml-1 sm0:ml-0"
                    onClick={() => clearImageFunc("image")}
                  >
                    clear
                  </button>
                ) : (
                  ""
                )}
              </>
            )}
          />
        </div>
        {errors.image && (
          <span className="mt-1 text-sm text-red-500 font-bold text-start px-4">
            {errors?.image?.message}
          </span>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">

          Why do you want to join this platform ?{" "}
          <span className="text-[#155EEF]">*</span>
        </label>
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

              backgroundColor: "white",
              border: "2px solid #E3E3E3"

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
                selectedOptions.map((option) => option.value).join(", "),
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
        {errors.reasons_to_join_platform && (
          <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
            {errors.reasons_to_join_platform.message}
          </span>
        )}
      </div>
      <div className="mb-4">
        <label
          htmlFor="bio"
          className="block text-sm font-medium text-gray-700"
        >
          About <span className="text-[#155EEF]">*</span>
        </label>
        <textarea
          {...register("bio")}

          className={`bg-gray-50 border-2 ${errors?.bio ? "border-red-500 " : "border-[#737373]"
            } mt-2 p-2 border border-gray-300 rounded-md w-full h-24`}

          placeholder="Enter your bio"
          rows={1}
        ></textarea>
        {errors?.bio && (
          <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
            {errors?.bio?.message}
          </span>
        )}
      </div>
      <div className="mb-4">
        <label
          htmlFor="domains_interested_in"

          className="block text-sm font-medium text-gray-700 mb-2"

        >
          Interests <span className="text-[#155EEF]">*</span>
        </label>
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

              backgroundColor: "white",
              border: "2px solid #E3E3E3"

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
                selectedOptions.map((option) => option.value).join(", "),
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
      </div>
      <div className="mb-4">
        <label
          htmlFor="type_of_profile"

          className="block text-sm font-medium text-gray-700 mb-2"

        >
          Type of Profile<span className="text-[#155EEF]">*</span>
        </label>
        <select
          {...register("type_of_profile")}

          className={`bg-gray-50 border-2 ${errors.type_of_profile ? "border-red-500 " : "border-[#737373]"
            }mt-2 p-2 border border-gray-300 rounded-md w-full`}

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
        {errors.type_of_profile && (
          <p className="mt-1 text-sm text-red-500 font-bold text-left">
            {errors.type_of_profile.message}
          </p>
        )}
      </div>
      <div className="mb-4">
        <label
          htmlFor="country"

          className="block text-sm font-medium text-gray-700 mb-2"

        >
          Location <span className="text-[#155EEF]">*</span>
        </label>
        <select
          {...register("country")}

          className={`bg-gray-50 border-2 ${errors.country ? "border-red-500 " : "border-[#737373]"
            }  p-2 border border-gray-300 rounded-md w-full`}

        >
          <option className="text-lg font-bold" value="">
            Select your country
          </option>
          {countries?.map((expert) => (
            <option
              key={expert.name}
              value={expert.name}
              className="text-lg font-bold"
            >
              {expert.name}
            </option>
          ))}
        </select>

        {errors?.country && (
          <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
            {errors?.country?.message}
          </span>
        )}
      </div>
      <div className="mb-4">

        <label className="block text-sm font-medium text-gray-700 mb-2">
          Links{" "}
        </label>
        <div className=" relative ">

          <input
            type="text"
            name="linkedin"
            placeholder="Enter your URL"
            // value={formData.links.linkedin}
            onChange={handleLinkChange}

            className=" p-2 border border-gray-300 rounded-md w-full"

          />
          {/* <div className="absolute right-2 top-1/2 transform -translate-y-1/2  ">{getLogo(formData.links.linkedin)}</div> */}
        </div>
        {/* <div className="flex items-center">
                                <input
                                    type="text"
                                    name="twitter"
                                    placeholder="Twitter URL"
                                    value={formData.links.twitter}
                                    onChange={handleLinkChange}
                                    className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                                /> */}
        {/* <div className="ml-2">{getLogo(formData.links.twitter)}</div> */}
        {/* </div> */}
        {/* <div className="flex items-center">
                                <input
                                    type="text"
                                    name="github"
                                    placeholder="GitHub URL"
                                    value={formData.links.github}
                                    onChange={handleLinkChange}
                                    className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                                />
                                <div className="ml-2">{getLogo(formData.links.github)}</div>
                            </div> */}
      </div>
    </div>
  );
};

export default RegisterForm3;

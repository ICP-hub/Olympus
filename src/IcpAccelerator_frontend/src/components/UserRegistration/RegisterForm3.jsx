import React, { useState, useEffect } from "react";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import ReactSelect from "react-select";
import { useSelector } from "react-redux";
import { useCountries } from "react-countries";
import { useFormContext, Controller, useFieldArray } from "react-hook-form";
import {
  FaLinkedin,
  FaTwitter,
  FaGithub,
  FaTelegram,
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaReddit,
  FaTiktok,
  FaSnapchat,
  FaWhatsapp,
  FaMedium,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
import { LanguageIcon } from "./DefaultLink";
// const LanguageIcon = () => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     width="24"
//     height="24"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//     className="feather feather-globe"
//   >
//     <circle cx="12" cy="12" r="10"></circle>
//     <line x1="2" y1="12" x2="22" y2="12"></line>
//     <path d="M12 2a15.3 15.3 0 0 1 4 10.9c0 4.8-1.7 8.7-4 10.9"></path>
//     <path d="M12 2C9.7 2 7 5.9 7 10.9c0 4.8 1.7 8.7 4 10.9"></path>
//   </svg>
// );
// import CompressedImage from "../../component/ImageCompressed/CompressedImage";

const RegisterForm3 = ({ setImageData }) => {
  const { countries } = useCountries();
  const areaOfExpertise = useSelector(
    (currState) => currState.expertiseIn.expertise || []
  );
  const typeOfProfile = useSelector(
    (currState) => currState.profileTypes.profiles || []
  );
  // const userFullData = useSelector((currState) => currState.userData.data.Ok);
  // const userCurrentRoleStatusActiveRole = useSelector(
  //   (currState) => currState.currentRoleStatus.activeRole
  // );
  // const principal = useSelector((currState) => currState.internet.principal);
  const [
    interestedDomainsSelectedOptions,
    setInterestedDomainsSelectedOptions,
  ] = useState([]);
  const [reasonOfJoiningSelectedOptions, setReasonOfJoiningSelectedOptions] =
    useState([]);
  const [interestedDomainsOptions, setInterestedDomainsOptions] = useState([]);
  const [typeOfProfileOptions, setTypeOfProfileOptions] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
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
  const [formData, setFormData] = useState([]);

  const {
    register,
    formState: { errors },
    trigger,
    setValue,
    clearErrors,
    setError,
    control,
    watch,
  } = useFormContext();

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

  const { fields, append, remove } = useFieldArray({
    control,
    name: "links",
  });

  // const getLogo = (url) => {
  //   try {
  //     const domain = new URL(url).hostname.split(".").slice(-2).join(".");
  //     const size = "size-8";
  //     const icons = {
  //       "linkedin.com": <FaLinkedin className={`text-blue-600 ${size}`} />,
  //       "twitter.com": <FaTwitter className={`text-blue-400 ${size}`} />,
  //       "github.com": <FaGithub className={`text-gray-700 ${size}`} />,
  //       "telegram.com": <FaTelegram className={`text-blue-400 ${size}`} />,
  //       "facebook.com": <FaFacebook className={`text-blue-400 ${size}`} />,
  //       "instagram.com": <FaInstagram className={`text-pink-950 ${size}`} />,
  //       "youtube.com": <FaYoutube className={`text-red-600 ${size}`} />,
  //       "reddit.com": <FaReddit className={`text-orange-500 ${size}`} />,
  //       "tiktok.com": <FaTiktok className={`text-black ${size}`} />,
  //       "snapchat.com": <FaSnapchat className={`text-yellow-400 ${size}`} />,
  //       "whatsapp.com": <FaWhatsapp className={`text-green-600 ${size}`} />,
  //       "medium.com": <FaMedium className={`text-black ${size}`} />,
  //     };
  //     return icons[domain] || null;
  //   } catch (error) {
  //     return null;
  //   }
  // };
  const getLogo = (url) => {
    try {
      const domain = new URL(url).hostname.split(".").slice(-2).join(".");
      const size = "size-8";
      const icons = {
        "linkedin.com": <FaLinkedin className={`text-blue-600 ${size}`} />,
        "twitter.com": <FaTwitter className={`text-blue-400 ${size}`} />,
        "github.com": <FaGithub className={`text-gray-700 ${size}`} />,
        "telegram.com": <FaTelegram className={`text-blue-400 ${size}`} />,
        "facebook.com": <FaFacebook className={`text-blue-400 ${size}`} />,
        "instagram.com": <FaInstagram className={`text-pink-950 ${size}`} />,
        "youtube.com": <FaYoutube className={`text-red-600 ${size}`} />,
        "reddit.com": <FaReddit className={`text-orange-500 ${size}`} />,
        "tiktok.com": <FaTiktok className={`text-black ${size}`} />,
        "snapchat.com": <FaSnapchat className={`text-yellow-400 ${size}`} />,
        "whatsapp.com": <FaWhatsapp className={`text-green-600 ${size}`} />,
        "medium.com": <FaMedium className={`text-black ${size}`} />,
      };
      return icons[domain] || <LanguageIcon />;
    } catch (error) {
      return <LanguageIcon />;
    }
  };

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
                >
                  <ControlPointIcon
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
                ? "2px solid #737373"
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
              border: "2px solid #E3E3E3",
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
              border: "2px solid #E3E3E3",
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
        {/* {errors.domains_interested_in && (
          <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
            {errors.domains_interested_in.message}
          </span>
        )} */}
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
        {/* {errors.type_of_profile && (
          <p className="mt-1 text-sm text-red-500 font-bold text-left">
            {errors.type_of_profile.message}
          </p>
        )} */}
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
          Links
        </label>
        <div className="relative">
          {fields.map((item, index) => (
            <div key={item.id} className="flex items-center mb-4 border-b pb-2">
              <Controller
                name={`links[${index}].link`}
                control={control}
                render={({ field, fieldState }) => (
                  <div className="flex items-center w-full">
                    <div className="flex items-center space-x-2 w-full">
                      <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full">
                        {field.value && getLogo(field.value)}
                      </div>
                      <input
                        type="text"
                        placeholder="Enter your social media URL"
                        className={`p-2 border ${fieldState.error
                          ? "border-red-500"
                          : "border-gray-300"
                          } rounded-md w-full`}
                        {...field}
                      />
                    </div>
                  </div>
                )}
              />
              <button
                type="button"
                onClick={() => remove(index)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                <FaTrash />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => append({ link: "" })}
            className="flex items-center p-1 text-[#155EEF]"
          >
            <FaPlus className="mr-1" /> Add Another Link
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm3;

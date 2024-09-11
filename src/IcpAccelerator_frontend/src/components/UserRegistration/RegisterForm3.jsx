import React, { useState, useEffect } from "react";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import ReactSelect from "react-select";
import { useSelector } from "react-redux";
import { useCountries } from "react-countries";
import { useFormContext, Controller, useFieldArray } from "react-hook-form";
import { FaTrash, FaPlus } from "react-icons/fa";
import CompressedImage from "../../components/ImageCompressed/CompressedImage";
import getSocialLogo from "../Utils/navigationHelper/getSocialLogo";
import getReactSelectStyles from "../Utils/navigationHelper/getReactSelectStyles";

const RegisterForm3 = React.memo(({ setImageData }) => {
  const { countries } = useCountries();
  const areaOfExpertise = useSelector(
    (currState) => currState.expertiseIn.expertise || []
  );
  const typeOfProfile = useSelector(
    (currState) => currState.profileTypes.profiles || []
  );
  const actor = useSelector((currState) => currState.actors.actor);

  const [
    interestedDomainsSelectedOptions,
    setInterestedDomainsSelectedOptions,
  ] = useState([]);
  const [reasonOfJoiningSelectedOptions, setReasonOfJoiningSelectedOptions] =
    useState([]);
  const [interestedDomainsOptions, setInterestedDomainsOptions] = useState([]);
  const [typeOfProfileOptions, setTypeOfProfileOptions] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
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
  const [isFormTouched, setIsFormTouched] = useState({
    reasons_to_join_platform: false,
    bio: false,
    domains_interested_in: false,
    type_of_profile: false,
    country: false,
  });

  const handleFieldTouch = (fieldName) => {
    setIsFormTouched((prevState) => ({
      ...prevState,
      [fieldName]: true,
    }));
  };
  const {
    register,
    formState: { errors },
    trigger,
    setValue,
    clearErrors,
    setError,
    control,
    watch,
  } = useFormContext({
    mode: "all",
    defaultValues: {
      reasons_to_join_platform: "",
      domains_interested_in: "",
      bio: "",
      type_of_profile: "",
      country: "",
    },
  });

  const allFields = watch(); // Watching all fields

  useEffect(() => {
    console.log("Form Data:", allFields); // Logging all field data on every change
  }, [allFields]);

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

  const clearImageFunc = (val) => {
    setValue(val, null);
    clearErrors(val);
    setImageData(null);
    setImagePreview(null);
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: "links",
  });

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
    <div className="overflow-y-auto px-4">
      <h2 className="text-xl sm1:text-2xl md:text-3xl font-bold mb-4">Tell about yourself</h2>
      <label className="block text-sm font-medium mb-2">Upload a photo</label>
      <div className="flex flex-wrap justify-center sm0:justify-start gap-2 mb-3">
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
        <div className="flex flex-col gap-1 items-center justify-center">
          <div className="flex gap-3">
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
                      className="font-medium px-2 sm0:px-4 py-0.5 sm0:py-1 cursor-pointer rounded border border-red-500 items-center text-md bg-transparent text-red-500  capitalize ml-1 sm0:ml-0"
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
        </div>
      </div>
      {errors.image && (
        <div className="my-3 text-sm text-red-500 font-bold text-start px-4">
          {errors?.image?.message}
        </div>
      )}
      {/* <div className="h-[30vh] dxs:h-[35vh] xxs1:h-[40vh]  sm0:h-[45vh] md:max-h-[50vh] overflow-hidden overflow-y-scroll "> */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Why do you want to join this platform ?{" "}
            <span className="text-[red] ml-1">*</span>
          </label>
          <ReactSelect
            isMulti
            menuPortalTarget={document.body}
            menuPosition={"fixed"}
            styles={getReactSelectStyles(errors?.reasons_to_join_platform)}
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
              handleFieldTouch("reasons_to_join_platform");
            }}
          />
          {errors.reasons_to_join_platform &&
            isFormTouched.reasons_to_join_platform && (
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
            About <span className="text-[red] ml-1">*</span>
          </label>
          <textarea
            {...register("bio", { required: "This field is required" })}
            className={`bg-gray-50 border-2 ${
              errors?.bio && isFormTouched.bio
                ? "border-red-500 "
                : "border-[#737373]"
            } mt-2 p-2 border border-gray-300 rounded-md w-full h-24`}
            onChange={(e) => {
              register("bio").onChange(e);
              handleFieldTouch("bio");
            }}
            placeholder="Enter your bio"
            rows={1}
          ></textarea>
          {errors?.bio && isFormTouched.bio && (
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
            Interests <span className="text-[red] ml-1">*</span>
          </label>
          <ReactSelect
            isMulti
            menuPortalTarget={document.body}
            menuPosition={"fixed"}
            styles={getReactSelectStyles(errors?.domains_interested_in)}
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
              handleFieldTouch("domains_interested_in");
            }}
          />

          {errors.domains_interested_in &&
            isFormTouched.domains_interested_in && (
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
            Type of Profile<span className="text-[red] ml-1">*</span>
          </label>
          <select
            {...register("type_of_profile", {
              required: "You must select at least one option",
            })}
            onChange={(e) => {
              register("type_of_profile").onChange(e);
              handleFieldTouch("type_of_profile");
            }}
            className={`bg-gray-50 border-2 ${
              errors.type_of_profile && isFormTouched.type_of_profile
                ? "border-red-500 "
                : "border-[#737373]"
            } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg border-gray-300 block w-full p-2.5`}
          >
            <option className="text-lg font-bold" value="">
              Select profile type
            </option>
            {typeOfProfileOptions &&
              typeOfProfileOptions.map((val, index) => (
                <option
                  className="text-lg font-bold"
                  key={index}
                  value={val?.value}
                >
                  {val?.label}
                </option>
              ))}
          </select>
          {errors?.type_of_profile && isFormTouched.type_of_profile && (
            <p className="mt-1 text-sm text-red-500 font-bold text-left">
              {errors?.type_of_profile?.message}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="country"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Location <span className="text-[red] ml-1">*</span>
          </label>
          <Controller
            name="country"
            control={control}
            defaultValue="" // Set the initial default value
            rules={{ required: "You must select at least one option" }}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <select
                {...{ ref, value, onChange, onBlur }}
                onChange={(e) => {
                  onChange(e);
                  handleFieldTouch("country");
                }}
                className={`bg-gray-50 border-2 ${
                  errors?.country && isFormTouched.country
                    ? "border-red-500 "
                    : "border-[#737373]"
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
            )}
          />
          {errors?.country && isFormTouched.country && (
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
              <div key={item.id} className="flex flex-col ">
                <div className="flex items-center mb-2  pb-1">
                  <Controller
                    name={`links[${index}].link`}
                    control={control}
                    render={({ field, fieldState }) => (
                      <div className="flex items-center w-full">
                        <div className="flex items-center space-x-2 w-full">
                          <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full">
                            {field.value && getSocialLogo(field.value)}
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
                <div className="mb-4 border-b pb-2">
                  {errors.links &&
                    errors.links[index] &&
                    errors.links[index].link && (
                      <span className="mt-1 text-sm text-red-500 font-bold">
                        {errors.links[index].link.message}
                      </span>
                    )}
                </div>
              </div>
            ))}

            {fields.length < 10 && (
              <button
                type="button"
                onClick={() => append({ links: "" })}
                className="flex items-center p-1 text-[#155EEF]"
              >
                <FaPlus className="mr-1" /> Add Another Link
              </button>
            )}
          </div>
        </div>
      {/* </div> */}
    </div>
  );
});

export default RegisterForm3;

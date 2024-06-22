import React, { useCallback, useEffect, useState } from "react";
import { formFields } from "../../../components/Utils/Data/EventFormData";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import CompressedImage from "../../ImageCompressed/CompressedImage";
import { useDispatch, useSelector } from "react-redux";
// import { allHubHandlerRequest } from "../../StateManagement/Redux/Reducers/All_IcpHubReducer";
// import { AuthClient } from "@dfinity/auth-client";
import { ThreeDots } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import DetailHeroSection from "../../Common/DetailHeroSection";
import Founder from "../../../../assets/images/founderRegistration.png";
// import { getCurrentRoleStatusRequestHandler } from "../StateManagement/Redux/Reducers/userCurrentRoleStatusReducer";
import { format, startOfToday } from "date-fns";
import ReactSelect from "react-select";
import { useCountries } from "react-countries";

const today = new Date();
const startDate = new Date("1900-01-01");

const schema = yup.object({
  title: yup
    .string()
    .required("Required")
    .test("is-non-empty", null, (value) => value && value.trim().length > 0),
  description: yup
    .string()
    .trim()
    .required("Description is required")
    .matches(/^[^\s].*$/, "Cannot start with a space"),
  cohort_launch_date: yup
    .date()
    .required()
    .typeError("Must be a date")
    .min(startOfToday(), "Cohort Launch date cannot be before today"),
  cohort_end_date: yup
    .date()
    .required()
    .typeError("Must be a date")
    .min(
      yup.ref("cohort_launch_date"),
      "Cohort End date cannot be before Cohort launch date"
    ),
  tags: yup
    .string()
    .test("is-non-empty", "Selecting an interest is required", (value) =>
      /\S/.test(value)
    )
    .required("Selecting an interest is required"),

  deadline: yup
    .date()
    .required("Must be a date")
    .typeError("Must be a valid date")
    .max(
      yup.ref("cohort_launch_date"),
      "Application Deadline must be before the Cohort Launch date"
      // )
      // .test(
      //   "is-before-today",
      //   "Application Deadline must be before today",
      //   function (value) {
      //     return value < startOfToday();
      // }
    ),
  eligibility: yup
    .string()
    .typeError("You must enter a eligibility")
    .required(),
  rubric_eligibility: yup
    .string()
    // .number()
    // .min(1, "level 1 - 9 allowed only")
    // .max(9, "level 1 - 9 allowed only")
    // .typeError("You must enter a number")
    .required("Required"),
  // area: yup.string().typeError("You must select area").required(),
  no_of_seats: yup.number().typeError("You must enter a number").required(),
});

const EventForm = () => {
  const actor = useSelector((currState) => currState.actors.actor);
  const areaOfExpertise = useSelector(
    (currState) => currState.expertiseIn.expertise
  );

  const [inputType, setInputType] = useState("date");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");

  const [interestedDomainsOptions, setInterestedDomainsOptions] = useState([]);
  const [
    interestedDomainsSelectedOptions,
    setInterestedDomainsSelectedOptions,
  ] = useState([]);
  const [rubricEligibilityOptions, setRubricEligibilityOptions] = useState([
    {
      value: "1",
      label: "One (1)",
    },
    {
      value: "2",
      label: "Two (2)",
    },
    {
      value: "3",
      label: "Three (3)",
    },
    {
      value: "4",
      label: "Four (4)",
    },
    {
      value: "5",
      label: "Five (5)",
    },
    {
      value: "6",
      label: "Six (6)",
    },
    {
      value: "7",
      label: "Seven (7)",
    },
    {
      value: "8",
      label: "Eight (8)",
    },
    {
      value: "9",
      label: "Nine (9)",
    },
  ]);
  const [
    rubricEligibilitySelectedOptions,
    setRubricEligibilitySelectedOptions,
  ] = useState([]);
  const [interestedFundingTypeOptions, setInterestedFundingTypeOptions] =
    useState([
      {
        value: "Grants",
        label: "Grants",
      },
      { value: "Investments", label: "Investments" },
    ]);
  const [
    interestedFundingTypeSelectedOptions,
    setInterestedFundingTypeSelectedOptions,
  ] = useState([]);
  const { countries } = useCountries();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
  const [imageData, setImageData] = useState(null);

  // const {
  //   register,
  //   handleSubmit,
  //   clearErrors,

  //   formState: { errors, isSubmitting },
  // } = useForm({
  //   resolver: yupResolver(schema),
  //   mode: "all",
  // });

  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    setValue,
    getValues,
    setError,
    watch,
    control,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
  });

  // image creation function compression and uintarray creator
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

  // console.log("imageData", imageData);
  // console.log("imagePreview", imagePreview);
  const onSubmitHandler = async (data) => {
    const areaValue = selectedArea === "global" ? "global" : selectedCountry;
    console.log("data aaya data aaya ", data);
    // title: String,
    // description: String,
    // tags: String,
    // criteria: Eligibility,
    // no_of_seats: u8,
    // deadline: String,
    // cohort_launch_date: String,
    // cohort_end_date: String,
    const eventData = {
      title: data.title,
      country: areaValue,
      funding_amount: data.funding_amount,
      funding_type: data.funding_type,
      description: data.description,
      cohort_launch_date: format(
        new Date(data.cohort_launch_date),
        "yyyy-MM-dd"
      ),
      start_date: format(new Date(data.cohort_launch_date), "yyyy-MM-dd"),
      cohort_end_date: format(new Date(data.cohort_end_date), "yyyy-MM-dd"),
      deadline: format(new Date(data.deadline), "yyyy-MM-dd"),
      tags: data.tags,
      criteria: {
        eligibility: [data.eligibility],
        level_on_rubric: parseFloat(data.rubric_eligibility),
      },
      no_of_seats: parseInt(data.no_of_seats),
    };
    console.log("eventData ===>>>", eventData);
    try {
      await actor.create_cohort(eventData).then((result) => {
        if (result && result.Ok) {
          toast.success("Cohort creation request has been sent to admin");
          console.log("Event Created", result);
          navigate("/");
        } else {
          toast.error("Some went wrong");
          console.log("Event Created", result);
        }
      });
    } catch (error) {
      toast.error(error);
      console.error("Error sending data to the backend:", error);
    }
  };

  const handleFocus = (field) => {
    if (field.onFocus) {
      setInputType(field.onFocus);
    }
  };

  const handleBlur = (field) => {
    if (field.onBlur) {
      setInputType(field.onBlur);
    }
  };
  useEffect(() => {
    const preventScroll = (e) => {
      if (e.target.type === "number") {
        e.preventDefault();
      }
    };

    window.addEventListener("wheel", preventScroll, { passive: false });

    return () => {
      window.removeEventListener("wheel", preventScroll);
    };
  }, []);
  const HeroImage = (
    <img
      src={Founder}
      alt="Astronaut"
      className={`z-20 w-[500px] md:w-[300px] sm:w-[250px] sxs:w-[260px] md:h-56 relative  sxs:-right-3 right-16 md:right-0 sm:right-0 top-10`}
    />
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
  const errorsFunc = (val) => {
    console.log("val", val);
  };

  console.log(selectedArea);

  return (
    <>
      <DetailHeroSection HeroImage={HeroImage} />
      <section className="w-full h-fit px-[6%] lg1:px-[4%] py-[6%] lg1:py-[4%] bg-gray-100">
        <div className="w-full h-full bg-gray-100 pt-8">
          <div className="bg-gradient-to-r from-purple-800 to-blue-500 text-transparent bg-clip-text text-[30px]  sm:text-[25px] md1:text-[30px] md2:text-[35px] font-black font-fontUse dxl:text-[40px] p-8">
            Cohort Information
          </div>
          <div className="text-sm font-medium text-center text-gray-200 ">
            <form
              onSubmit={handleSubmit(onSubmitHandler, errorsFunc)}
              className="w-full px-4"
            >
              <div className="flex flex-col mb-4">
                <div className="flex-col w-full sm3:flex block justify-start gap-4 items-start">
                  <div className="sm:mb-4 mb-6 sm:ml-6 h-40 sm:w-1/3 dlg:w-1/4 rounded-3xl w-full border-2 border-gray-300 flex items-center justify-center overflow-hidden">
                    {imagePreview && !errors.image ? (
                      <img
                        src={imagePreview}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="size-11"
                      >
                        <path
                          fill="#BBBBBB"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
                        />
                      </svg>
                    )}
                  </div>

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
                        <div className="flex">
                          <label
                            htmlFor="image"
                            className="p-2 border-2 border-blue-800 items-center sm:ml-6 rounded-md text-md bg-transparent text-blue-800 cursor-pointer font-semibold"
                          >
                            {imagePreview && !errors.image
                              ? "Change banner picture"
                              : "Upload banner picture"}
                          </label>
                          {imagePreview || errors.image ? (
                            <button
                              className="p-2 border-2 border-red-500 ml-2 items-center rounded-md text-md bg-transparent text-red-500 cursor-pointer font-semibold capitalize"
                              onClick={() => clearImageFunc("image")}
                            >
                              clear
                            </button>
                          ) : (
                            ""
                          )}
                        </div>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {formFields?.map((field) => (
                  <div key={field.id} className="relative z-0 group mb-6">
                    <label
                      htmlFor={field.id}
                      className="flex gap-2 mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                    >
                      {field.label}{" "}
                      <span
                        className={`${
                          field.label === "Eligibility Cirteria"
                            ? "hidden"
                            : "flex"
                        } text-red-500`}
                      >
                        *
                      </span>
                    </label>
                    {field.type === "textarea" ? (
                      <textarea
                        name={field.name}
                        id={field.id}
                        {...register(field.name)}
                        className={`bg-gray-50 border-2 ${
                          errors[field.name]
                            ? "border-red-500 placeholder:text-red-500"
                            : "border-[#737373]"
                        } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                        placeholder={field.placeholder}
                        onFocus={() => handleFocus(field)}
                        onBlur={() => handleBlur(field)}
                      ></textarea>
                    ) : (
                      // ) : field.type === "select" ? (
                      //   <select
                      //     name={field.name}
                      //     id={field.id}
                      //     {...register(field.name)}
                      //     className={`bg-gray-50 border-2 ${
                      //       errors[field.name]
                      //         ? "border-red-500"
                      //         : "border-[#737373]"
                      //     } text-gray-900 placeholder-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                      //     onFocus={() => handleFocus(field)}
                      //     onBlur={() => handleBlur(field)}
                      //   >
                      //     {[
                      //       "One",
                      //       "Two",
                      //       "Three",
                      //       "Four",
                      //       "Five",
                      //       "Six",
                      //       "Seven",
                      //       "Eight",
                      //       "Nine",
                      //     ].map((word, index) => (
                      //       <option key={index} value={index + 1}>
                      //         {index + 1} ({word})
                      //       </option>
                      //     ))}
                      //   </select>
                      <input
                        type={
                          field.id === "date_of_birth" ? inputType : field.type
                        }
                        name={field.name}
                        id={field.id}
                        {...register(field.name)}
                        className={`bg-gray-50 border-2 ${
                          errors[field.name]
                            ? "border-red-500 placeholder:text-red-500"
                            : "border-[#737373]"
                        } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                        placeholder={field.placeholder}
                        onFocus={() => handleFocus(field)}
                        onBlur={() => handleBlur(field)}
                      />
                    )}
                    {errors[field.name] && (
                      <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                        {errors[field.name].message}
                      </span>
                    )}
                  </div>
                ))}
                <div className="relative z-0 group mb-6">
                  <label
                    htmlFor="area"
                    className="flex gap-2 mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                  >
                    Select area <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="area"
                    id="area"
                    {...register("area")}
                    className={`bg-gray-50 border-2 ${
                      errors.area ? "border-red-500" : "border-[#737373]"
                    } text-gray-900 placeholder-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                    onFocus={() => handleFocus({ name: "area" })}
                    onBlur={() => handleBlur({ name: "area" })}
                    onChange={(e) => setSelectedArea(e.target.value)}
                  >
                    <option value="">Select Area</option>
                    <option value="global">Global</option>
                    <option value="country">Country</option>
                  </select>
                </div>
                {selectedArea === "country" ? (
                  <div className="relative z-0 group mb-6">
                    <label
                      htmlFor="country"
                      className="flex gap-2 mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                    >
                      Select Country <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="country"
                      id="country"
                      {...register("country")}
                      className={`bg-gray-50 border-2 ${
                        errors.country ? "border-red-500" : "border-[#737373]"
                      } text-gray-900 placeholder-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                      onFocus={() => handleFocus("country")}
                      onBlur={() => handleBlur("country")}
                      onChange={(e) => setSelectedCountry(e.target.value)}
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
                  </div>
                ) : (
                  ""
                )}
                <div className="relative z-0 group mb-6">
                  <label
                    htmlFor="rubric_eligibility"
                    className="flex gap-2 mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                  >
                    Level on rubric required for eligibility{" "}
                    <span className="text-red-500">*</span>
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
                        border: errors.rubric_eligibility
                          ? "2px solid #ef4444"
                          : "2px solid #737373",
                        backgroundColor: "rgb(249 250 251)",
                        "&::placeholder": {
                          color: errors.rubric_eligibility
                            ? "#ef4444"
                            : "currentColor",
                        },
                      }),
                    }}
                    value={rubricEligibilitySelectedOptions}
                    options={rubricEligibilityOptions}
                    classNamePrefix="select"
                    className="basic-multi-select w-full text-start"
                    placeholder="Select a tag"
                    name="rubric_eligibility"
                    onChange={(selectedOptions) => {
                      if (selectedOptions && selectedOptions.length > 0) {
                        setRubricEligibilitySelectedOptions(selectedOptions);
                        clearErrors("rubric_eligibility");
                        setValue(
                          "rubric_eligibility",
                          selectedOptions
                            .map((option) => option.value)
                            .join(", "),
                          { shouldValidate: true }
                        );
                      } else {
                        setRubricEligibilitySelectedOptions([]);
                        setValue("rubric_eligibility", "", {
                          shouldValidate: true,
                        });
                        setError("rubric_eligibility", {
                          type: "required",
                          message: "Selecting a rubric eligibility is required",
                        });
                      }
                    }}
                  />
                  {errors.rubric_eligibility && (
                    <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                      {errors.rubric_eligibility.message}
                    </span>
                  )}
                </div>
                <div className="relative z-0 group mb-6">
                  <label
                    htmlFor="tags"
                    className="flex gap-2 mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                  >
                    Tags <span className="text-red-500">*</span>
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
                        border: errors.tags
                          ? "2px solid #ef4444"
                          : "2px solid #737373",
                        backgroundColor: "rgb(249 250 251)",
                        "&::placeholder": {
                          color: errors.tags ? "#ef4444" : "currentColor",
                        },
                      }),
                    }}
                    value={interestedDomainsSelectedOptions}
                    options={interestedDomainsOptions}
                    classNamePrefix="select"
                    className="basic-multi-select w-full text-start"
                    placeholder="Select a tag"
                    name="tags"
                    onChange={(selectedOptions) => {
                      if (selectedOptions && selectedOptions.length > 0) {
                        setInterestedDomainsSelectedOptions(selectedOptions);
                        clearErrors("tags");
                        setValue(
                          "tags",
                          selectedOptions
                            .map((option) => option.value)
                            .join(", "),
                          { shouldValidate: true }
                        );
                      } else {
                        setInterestedDomainsSelectedOptions([]);
                        setValue("tags", "", { shouldValidate: true });
                        setError("tags", {
                          type: "required",
                          message: "Selecting a tag is required",
                        });
                      }
                    }}
                  />
                  {errors.tags && (
                    <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                      {errors.tags.message}
                    </span>
                  )}
                </div>
                <div className="relative z-0 group mb-6">
                  <label
                    htmlFor="funding_type"
                    className="flex gap-2 mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                  >
                    Funding type <span className="text-red-500">*</span>
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
                        border: errors.funding_type
                          ? "2px solid #ef4444"
                          : "2px solid #737373",
                        backgroundColor: "rgb(249 250 251)",
                        "&::placeholder": {
                          color: errors.funding_type
                            ? "#ef4444"
                            : "currentColor",
                        },
                      }),
                    }}
                    value={interestedFundingTypeSelectedOptions}
                    options={interestedFundingTypeOptions}
                    classNamePrefix="select"
                    className="basic-multi-select w-full text-start"
                    placeholder="Select funding type"
                    name="funding_type"
                    onChange={(selectedOptions) => {
                      if (selectedOptions && selectedOptions.length > 0) {
                        setInterestedFundingTypeSelectedOptions(
                          selectedOptions
                        );
                        clearErrors("funding_type");
                        setValue(
                          "funding_type",
                          selectedOptions
                            .map((option) => option.value)
                            .join(", "),
                          { shouldValidate: true }
                        );
                      } else {
                        setInterestedFundingTypeSelectedOptions([]);
                        setValue("funding_type", "", { shouldValidate: true });
                        setError("funding_type", {
                          type: "required",
                          message: "Selecting a type is required",
                        });
                      }
                    }}
                  />
                  {errors.funding_type && (
                    <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                      {errors.funding_type.message}
                    </span>
                  )}
                </div>
                <div className="relative z-0 group mb-6">
                  <label
                    htmlFor="funding_amount"
                    className="flex gap-2 mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                  >
                    Select funding amount{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="funding_amount"
                    id="funding_amount"
                    {...register("funding_amount")}
                    className={`bg-gray-50 border-2 ${
                      errors.funding_amount
                        ? "border-red-500"
                        : "border-[#737373]"
                    } text-gray-900 placeholder-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                    onFocus={() => handleFocus("funding_amount")}
                    onBlur={() => handleBlur("funding_amount")}
                  >
                    <option className="text-lg font-bold" value="">
                      Select Amount of Funding
                    </option>
                    <option value="1k-5k" className="text-lg font-bold">
                      1k-5k
                    </option>
                    <option value="5k-25k" className="text-lg font-bold">
                      5k-25k
                    </option>
                    <option value="25k- 100k" className="text-lg font-bold">
                      25k-100k
                    </option>
                    <option value="100k+" className="text-lg font-bold">
                      100k+
                    </option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="text-white font-bold bg-blue-800 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-md w-auto sm:w-auto px-5 py-2 text-center mb-4"
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
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
      <Toaster />
    </>
  );
};

export default EventForm;

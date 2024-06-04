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
    .min(startOfToday(), "Launch date cannot be before today"),
  cohort_end_date: yup
    .date()
    .required()
    .typeError("Must be a date")
    .min(
      yup.ref("cohort_launch_date"),
      "End date cannot be before launch date"
    ),
  tags: yup
    .string()
    .test("is-non-empty", "Selecting an interest is required", (value) =>
      /\S/.test(value)
    )
    .required("Selecting an interest is required"),

  deadline: yup
    .date()
    .required()
    .typeError("Must be a date")
    .min(yup.ref("cohort_launch_date"), "Deadline cannot be before Launch date")
    .max(yup.ref("cohort_end_date"), "Deadline cannot be after end date"),
  eligibility: yup
    .string()
    .typeError("You must enter a eligibility")
    .required(),
  rubric_eligibility: yup
    .number()
    .min(1, "level 1 - 9 allowed only")
    .max(9, "level 1 - 9 allowed only")
    .typeError("You must enter a number")
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

  //   async (file) => {
  //     clearErrors("imageData");
  //     if (!["image/jpeg", "image/png", "image/gif"].includes(file.type))
  //       return setError("imageData", {
  //         type: "manual",
  //         message: "Unsupported file format",
  //       });
  //     if (file.size > 1024 * 1024)
  //       // 1MB
  //       return setError("imageData", {
  //         type: "manual",
  //         message: "The file is too large",
  //       });

  //     setIsLoading(true);
  //     try {
  //       const compressedFile = await CompressedImage(file);
  //       const reader = new FileReader();
  //       reader.onloadend = () => {
  //         setImagePreview(reader.result);
  //         setIsLoading(false);
  //       };
  //       reader.readAsDataURL(compressedFile);

  //       const byteArray = await compressedFile.arrayBuffer();
  //       setImageData(Array.from(new Uint8Array(byteArray)));
  //       console.log("imageData", Array.from(new Uint8Array(byteArray)));
  //       clearErrors("imageData");
  //     } catch (error) {
  //       console.error("Error processing the image:", error);
  //       setError("imageData", {
  //         type: "manual",
  //         message: "Could not process image, please try another.",
  //       });
  //       setIsLoading(false);
  //     }
  //   },
  //   [setError, clearErrors, setIsLoading, setImagePreview, setImageData]
  // );
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
      start_date: format(new Date(data.cohort_start_date), "yyyy-MM-dd"),
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
                    ) : field.type === "select" ? (
                      <select
                        name={field.name}
                        id={field.id}
                        {...register(field.name)}
                        className={`bg-gray-50 border-2 ${
                          errors[field.name]
                            ? "border-red-500"
                            : "border-[#737373]"
                        } text-gray-900 placeholder-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                        onFocus={() => handleFocus(field)}
                        onBlur={() => handleBlur(field)}
                      >
                        {[
                          "One",
                          "Two",
                          "Three",
                          "Four",
                          "Five",
                          "Six",
                          "Seven",
                          "Eight",
                          "Nine",
                        ].map((word, index) => (
                          <option key={index} value={index + 1}>
                            {index + 1} ({word})
                          </option>
                        ))}
                      </select>
                    ) : (
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

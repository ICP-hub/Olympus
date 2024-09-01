import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { LanguageIcon } from "../../UserRegistration/DefaultLink";
import { useFormContext, useFieldArray, Controller } from "react-hook-form";

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

// COMPONENT DEFINITION FOR THE INVESTOR MODAL
const InvestorModal2 = ({ formData }) => {
  // SELECTOR TO ACCESS THE ACTOR OBJECT FROM REDUX STORE
  const actor = useSelector((currState) => currState.actors.actor);

  // SELECTOR TO ACCESS AREA OF EXPERTISE DATA FROM REDUX STORE
  const areaOfExpertise = useSelector(
    (currState) => currState.expertiseIn.expertise
  );

  // FORM HOOKS TO HANDLE FORM FUNCTIONALITIES
  const {
    register, // HOOK FOR REGISTERING INPUTS
    clearErrors, // HOOK FOR CLEARING FORM ERRORS
    watch, // HOOK FOR WATCHING INPUT VALUES
    formState: { errors }, // ACCESS TO FORM ERRORS
    setValue, // SETS FORM FIELD VALUES
    trigger, // TRIGGERS VALIDATION
    control, // CONTROL FOR NESTED FORMS AND COMPONENTS
  } = useFormContext();

  // USE useFieldArray HOOK FOR DYNAMICALLY ADDING/REMOVING LINKS
  const { fields, append, remove } = useFieldArray({
    control,
    name: "links",
  });

  // FUNCTION TO DETERMINE AND RETURN THE APPROPRIATE LOGO BASED ON THE URL
  const getLogo = (url) => {
    try {
      const domain = new URL(url).hostname.split(".").slice(-2).join(".");
      const size = "size-8"; // SIZE FOR ICONS
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
      return icons[domain] || <LanguageIcon />; // RETURNING CORRESPONDING ICON OR DEFAULT ICON
    } catch (error) {
      return <LanguageIcon />; // RETURNING DEFAULT ICON IN CASE OF ERROR
    }
  };

  // USE EFFECT TO SET INVESTMENT CATEGORIES OPTIONS BASED ON AREA OF EXPERTISE DATA
  useEffect(() => {
    if (areaOfExpertise) {
      setInvestmentCategoriesOptions(
        areaOfExpertise.map((expert) => ({
          value: expert.name,
          label: expert.name,
        }))
      );
    } else {
      setInvestmentCategoriesOptions([]);
    }
  }, [areaOfExpertise]);

  // STATES FOR VARIOUS FORM FIELDS
  const [investmentCategoriesOptions, setInvestmentCategoriesOptions] =
    useState([]);
  const [
    investmentCategoriesSelectedOptions,
    setInvestmentCategoriesSelectedOptions,
  ] = useState([]);

  const [investStageOptions, setInvestStageOptions] = useState([]);
  const [investStageSelectedOptions, setInvestStageSelectedOptions] = useState(
    []
  );
  const [investStageRangeOptions, setInvestStageRangeOptions] = useState([]);
  const [investStageRangeSelectedOptions, setInvestStageRangeSelectedOptions] =
    useState([]);

  // USE EFFECT TO FETCH INVESTMENT STAGES OPTIONS FROM ACTOR AND SET THE STATE
  useEffect(() => {
    if (actor) {
      (async () => {
        try {
          const result = await actor.get_investment_stage();
          if (result && result.length > 0) {
            let mapped_arr = result.map((val, index) => ({
              value: val.toLowerCase(),
              label: val,
            }));
            setInvestStageOptions(mapped_arr);
          } else {
            setInvestStageOptions([]);
          }
        } catch (error) {
          setInvestStageOptions([]);
        }
      })();
    }
  }, [actor]);

  // USE EFFECT TO FETCH INVESTMENT STAGE RANGE OPTIONS FROM ACTOR AND SET THE STATE
  useEffect(() => {
    if (actor) {
      (async () => {
        try {
          const result = await actor.get_range_of_check_size();
          if (result && result.length > 0) {
            let mapped_arr = result.map((val, index) => ({
              value: val.toLowerCase(),
              label: val,
            }));
            setInvestStageRangeOptions(mapped_arr);
          } else {
            setInvestStageRangeOptions([]);
          }
        } catch (error) {
          setInvestStageRangeOptions([]);
        }
      })();
    }
  }, [actor]);

  // FUNCTION TO HANDLE SELECTION OF INVESTMENT CATEGORIES
  const setInvestmentCategoriesSelectedOptionsHandler = (val) => {
    setInvestmentCategoriesSelectedOptions(
      val
        ? val
            .split(", ")
            .map((investment) => ({ value: investment, label: investment }))
        : []
    );
  };

  // FUNCTION TO HANDLE SELECTION OF INVESTMENT STAGES
  const setInvestStageSelectedOptionsHandler = (val) => {
    setInvestStageSelectedOptions(
      val
        ? val
            .split(", ")
            .map((investment) => ({ value: investment, label: investment }))
        : []
    );
  };

  // FUNCTION TO HANDLE SELECTION OF INVESTMENT STAGE RANGE
  const setInvestStageRangeSelectedOptionsHandler = (val) => {
    setInvestStageRangeSelectedOptions(
      val
        ? val
            .split(", ")
            .map((investment) => ({ value: investment, label: investment }))
        : []
    );
  };

  // USE EFFECT TO SET INITIAL FORM VALUES BASED ON PROVIDED FORM DATA
  useEffect(() => {
    if (formData) {
      setInvestorValuesHandler(formData);
    }
  }, [formData]);

  // FUNCTION TO SET INITIAL FORM VALUES BASED ON PROVIDED FORM DATA
  const setInvestorValuesHandler = (val) => {
    console.log("val", val);
    if (val) {
      setValue(
        "investment_categories",
        val.investment_categories ? val?.investment_categories : ""
      );
      setValue(
        "investment_stage_range",
        val?.investment_stage_range ? val?.investment_stage_range : ""
      );
      setValue(
        "investment_stage",
        val?.investment_stage ? val?.investment_stage : ""
      );
      setInvestmentCategoriesSelectedOptionsHandler(
        val?.investment_categories ?? null
      );
      setInvestStageRangeSelectedOptionsHandler(
        val?.investment_stage_range ?? null
      );
      setInvestStageSelectedOptionsHandler(val?.investment_stage ?? null);
    }
  };

  return (
    <>
    
      <div className="max-h-[80vh] overflow-y-auto ">
       <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Category of investment <span className="text-[red] ml-1">*</span>
        </label>
        <Select
          isMulti
          menuPortalTarget={document.body}
          menuPosition={"fixed"}
          styles={{
            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
            control: (provided) => ({
              ...provided,
              paddingBlock: "2px",
              borderRadius: "8px",
              border: errors.investment_categories
                ? "2px solid #ef4444"
                : "2px solid #737373",
                backgroundColor: "rgb(249 250 251)",
                display: "flex",
                overflowX: "auto",
                maxHeight: "43px",
                "&::-webkit-scrollbar": { display: "none" },
              }),
              valueContainer: (provided) => ({
                ...provided,
                overflow: "scroll",
                maxHeight: "40px",
                scrollbarWidth: "none",
              }),
              placeholder: (provided) => ({
                ...provided,
              color: errors.investment_categories
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
                border: "2px solid #CDD5DF",
              }),
              multiValueRemove: (provided) => ({
                ...provided,
                display: "inline-flex",
                alignItems: "center",
              }),
            }}
          value={investmentCategoriesSelectedOptions}
          options={investmentCategoriesOptions}
          classNamePrefix="select"
          className="basic-multi-select w-full text-start"
          placeholder="Select categories of investment"
          name="investment_categories"
          onChange={(selectedOptions) => {
            if (selectedOptions && selectedOptions.length > 0) {
              setInvestmentCategoriesSelectedOptions(selectedOptions);
              clearErrors("investment_categories");
              setValue(
                "investment_categories",
                selectedOptions.map((option) => option.value).join(", "),
                { shouldValidate: true }
              );
            } else {
              setInvestmentCategoriesSelectedOptions([]);
              setValue("investment_categories", "", {
                shouldValidate: true,
              });
              setError("investment_categories", {
                type: "required",
                message: "Selecting a category is required",
              });
            }
          }}
        />
        {/* ERROR MESSAGE FOR INVESTMENT CATEGORIES */}
        {errors.investment_categories && (
          <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
            {errors.investment_categories.message}
          </span>
        )}
      </div>

      {/* INVESTMENT STAGE SELECTION FIELD */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Which stage(s) do you invest at ?{" "}
          <span className="text-[red] ml-1">*</span>
        </label>
        <Select
          isMulti
          menuPortalTarget={document.body}
          menuPosition={"fixed"}
          styles={{
            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
            control: (provided, state) => ({
              ...provided,
              paddingBlock: "2px",
              borderRadius: "8px",
              border: errors.investment_stage
                ? "2px solid #ef4444"
                : "2px solid #737373",
              backgroundColor: "rgb(249 250 251)",
              "&::placeholder": {
                color: errors.investment_stage ? "#ef4444" : "currentColor",
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
              color: errors.investment_stage ? "#ef4444" : "rgb(107 114 128)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }),
            multiValue: (provided) => ({
              ...provided,
              display: "inline-flex",
              alignItems: "center",
              backgroundColor: "white",
              border: "2px solid #CDD5DF",
            }),
            multiValueRemove: (provided) => ({
              ...provided,
              display: "inline-flex",
              alignItems: "center",
            }),
          }}
          value={investStageSelectedOptions}
          options={investStageOptions}
          classNamePrefix="select"
          className="basic-multi-select w-full text-start"
          placeholder="Select a stage"
          name="investment_stage"
          onChange={(selectedOptions) => {
            if (selectedOptions && selectedOptions.length > 0) {
              setInvestStageSelectedOptions(selectedOptions);
              clearErrors("investment_stage");
              setValue(
                "investment_stage",
                selectedOptions.map((option) => option.value).join(", "),
                { shouldValidate: true }
              );
            } else {
              setInvestStageSelectedOptions([]);
              setValue("investment_stage", "", {
                shouldValidate: true,
              });
              setError("investment_stage", {
                type: "required",
                message: "Atleast one stage required",
              });
            }
          }}
        />
        {/* ERROR MESSAGE FOR INVESTMENT STAGE */}
        {errors.investment_stage && (
          <p className="mt-1 text-sm text-red-500 font-bold text-left">
            {errors.investment_stage.message}
          </p>
        )}
      </div>

      {/* INVESTMENT STAGE RANGE SELECTION FIELD */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          What is the range of your check size ?{" "}
          <span className="text-[red] ml-1">*</span>
        </label>
        <Select
          isMulti
          menuPortalTarget={document.body}
          menuPosition={"fixed"}
          styles={{
            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
            control: (provided, state) => ({
              ...provided,
              paddingBlock: "2px",
              borderRadius: "8px",
              border: errors.investment_stage_range
                ? "2px solid #ef4444"
                : "2px solid #737373",
              backgroundColor: "rgb(249 250 251)",
              "&::placeholder": {
                color: errors.investment_stage_range
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
              color: errors.investment_stage_range
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
                border: "2px solid #CDD5DF",
              }),
              multiValueRemove: (provided) => ({
                ...provided,
                display: "inline-flex",
                alignItems: "center",
              }),
            }}
          value={investStageRangeSelectedOptions}
          options={investStageRangeOptions}
          classNamePrefix="select"
          className="basic-multi-select w-full text-start"
          placeholder="Select a range"
          name="investment_stage_range"
          onChange={(selectedOptions) => {
            if (selectedOptions && selectedOptions.length > 0) {
              setInvestStageRangeSelectedOptions(selectedOptions);
              clearErrors("investment_stage_range");
              setValue(
                "investment_stage_range",
                selectedOptions.map((option) => option.value).join(", "),
                { shouldValidate: true }
              );
            } else {
              setInvestStageRangeSelectedOptions([]);
              setValue("investment_stage_range", "", {
                shouldValidate: true,
              });
              setError("investment_stage_range", {
                type: "required",
                message: "Atleast one stage required",
              });
            }
          }}
        />
        {/* ERROR MESSAGE FOR INVESTMENT STAGE RANGE */}
        {errors.investment_stage_range && (
          <p className="mt-1 text-sm text-red-500 font-bold text-left">
            {errors.investment_stage_range.message}
          </p>
        )}
      </div>

      {/* WEBSITE LINK INPUT FIELD */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Website link 
          {/* <span className="text-[red] ml-1">*</span> */}
        </label>
        <input
          {...register("investor_website_url")}
          type="url"
          name="investor_website_url"
          placeholder="Enter your website url"
          className="block w-full border border-gray-300 rounded-md p-2"
        />
        {/* ERROR MESSAGE FOR WEBSITE LINK */}
        {errors?.investor_website_url && (
          <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
            {errors?.investor_website_url?.message}
          </span>
        )}
      </div>

      {/* DYNAMICALLY ADDING SOCIAL MEDIA LINKS */}
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">Links</label>
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
                       {field.value && getLogo(field.value)}
                     </div>
                     <input
                       type="text"
                       placeholder="Enter your social media URL"
                       className={`p-2 border ${
                         fieldState.error
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
          {/* ADD ANOTHER LINK BUTTON */}
          <button
            type="button"
            onClick={() => append({ links: "" })}
            className="flex items-center p-1 text-[#155EEF]"
          >
            <FaPlus className="mr-1" /> Add Another Link
          </button>
        </div>
      </div>
   </div> </>
  );
};

export default InvestorModal2;

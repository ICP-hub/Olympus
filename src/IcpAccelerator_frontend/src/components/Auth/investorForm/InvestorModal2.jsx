import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { useNavigate } from "react-router-dom"
import EastIcon from '@mui/icons-material/East';
import { useDispatch, useSelector } from 'react-redux';
import { LanguageIcon } from '../../UserRegistration/DefaultLink';
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


const InvestorModal2 = ({ isOpen, onClose, onBack }) => {
    const actor = useSelector((currState) => currState.actors.actor);

    const areaOfExpertise = useSelector(
        (currState) => currState.expertiseIn.expertise
    );


    const { register, clearErrors, watch, formState: { errors }, setValue, trigger,control } = useFormContext();
     // USE useFieldArray HOOK FOR DYNAMICALLY ADDING/REMOVING LINKS
  const { fields, append, remove } = useFieldArray({
    control,
    name: "links",
  });

  // FUNCTION TO DETERMINE AND RETURN THE APPROPRIATE LOGO BASED ON THE URL
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

    const navigate = useNavigate()
    const [modalOpen, setModalOpen] = useState(isOpen || true);
    const selectStyles = {
        control: (provided) => ({
            ...provided,
            borderColor: '#CDD5DF',
            borderRadius: '0.375rem',
        }),
        controlIsFocused: (provided) => ({
            ...provided,
            borderColor: 'black',
            boxShadow: 'none',
        }),
        multiValue: (provided) => ({
            ...provided,
            borderColor: '#CDD5DF',
        }),
        multiValueLabel: (provided) => ({
            ...provided,
            color: '#1f2937',
        }),
    };

    useEffect(() => {
        if (modalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [modalOpen]);

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

    // INVESTOR FORM STATES
    const [typeOfInvestSelectedOptions, setTypeOfInvestSelectedOptions] =
        useState([]);
    const [typeOfInvestOptions, setTypeOfInvestOptions] = useState([
        { value: "Direct", label: "Direct" },
        { value: "SNS", label: "SNS" },
        { value: "both", label: "both" },
    ]);
    const [investedInmultiChainOptions, setInvestedInMultiChainOptions] =
        useState([]);
    const [
        investedInMultiChainSelectedOptions,
        setInvestedInMultiChainSelectedOptions,
    ] = useState([]);
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
    return (


        <>

            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Category of investment <span className='text-[red] ml-1'>*</span></label>
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
                            border: errors.investment_categories
                                ? "2px solid #ef4444"
                                : "2px solid #737373",
                            backgroundColor: "rgb(249 250 251)",
                            "&::placeholder": {
                                color: errors.investment_categories
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
                            border: "1px solid gray",
                            borderRadius: "5px"
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
                                selectedOptions
                                    .map((option) => option.value)
                                    .join(", "),
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
                {errors.investment_categories && (
                    <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                        {errors.investment_categories.message}
                    </span>
                )}
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Which stage(s) do you invest at ?  <span className='text-[red] ml-1'>*</span></label>
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
                                color: errors.investment_stage
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
                            color: errors.investment_stage
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
                            border: "1px solid gray",
                            borderRadius: "5px"
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
                                selectedOptions
                                    .map((option) => option.value)
                                    .join(", "),
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
                {errors.investment_stage && (
                    <p className="mt-1 text-sm text-red-500 font-bold text-left">
                        {errors.investment_stage.message}
                    </p>
                )}
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">What is the range of your check size ?  <span className='text-[red] ml-1'>*</span></label>
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
                            border: "1px solid gray",
                            borderRadius: "5px"
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
                                selectedOptions
                                    .map((option) => option.value)
                                    .join(", "),
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
                {errors.investment_stage_range && (
                    <p className="mt-1 text-sm text-red-500 font-bold text-left">
                        {errors.investment_stage_range.message}
                    </p>
                )}
            </div>


            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Website link <span className='text-[red] ml-1'>*</span></label>
                <input
                    {...register("investor_website_url")}
                    type="url"
                    name="investor_website_url"
                    placeholder="Enter your website url"
                    className="block w-full border border-gray-300 rounded-md p-2"
                />
                {errors?.investor_website_url && (
                    <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                        {errors?.investor_website_url?.message}
                    </span>
                )}
            </div>

            <div className="mb-2">
        <label className="block text-sm font-medium mb-1">
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
                        {...register("links")}
                        type="text"
                        placeholder="Enter your social media URL"
                        className={`p-2 border ${fieldState.error ? "border-red-500" : "border-gray-300"} rounded-md w-full`}
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
            onClick={() => append({ links: "" })}
            className="flex items-center p-1 text-[#155EEF]"
          >
            <FaPlus className="mr-1" /> Add Another Link
          </button>
        </div>
      </div>


        </>

    );
};

export default InvestorModal2;

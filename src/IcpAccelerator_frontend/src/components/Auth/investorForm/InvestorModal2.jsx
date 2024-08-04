import React, { useState, useEffect } from 'react';
import createprojectabc from "../../../../assets/Logo/createprojectabc.png";
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import Dropdown from "../../../../assets/Logo/Dropdown.png"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckIcon from '@mui/icons-material/Check';
import CreateProjectModal from "../../Home/modal2";
import Select from 'react-select';
import { useNavigate } from "react-router-dom"
import EastIcon from '@mui/icons-material/East';
import { useFormContext } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux';



const InvestorModal2 = ({ isOpen, onClose, onBack }) => {


    const areaOfExpertise = useSelector(
        (currState) => currState.expertiseIn.expertise
    );


    const { register, clearErrors, watch, formState: { errors }, setValue, trigger } = useFormContext();

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


    return (


        <>

            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Category of investment <span className='text-[#155EEF]'>*</span></label>
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
                <label className="block text-sm font-medium mb-1">Which stage(s) do you invest at ?  <span className='text-[#155EEF]'>*</span></label>
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
                <label className="block text-sm font-medium mb-1">What is the range of your check size ?  <span className='text-[#155EEF]'>*</span></label>
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
                <label className="block text-sm font-medium mb-1">Website link <span className='text-[#155EEF]'>*</span></label>
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

            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">LinkedIn link <span className='text-[#155EEF]'>*</span></label>
                <input
                    {...register("investor_linkedin_url")}
                    type="url"
                    name="investor_linkedin_url"
                    placeholder="Enter your linkedin url"
                    className="block w-full border border-gray-300 rounded-md p-2"
                    required
                />
                {errors?.investor_linkedin_url && (
                    <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                        {errors?.investor_linkedin_url?.message}
                    </span>
                )}
            </div>

        </>

    );
};

export default InvestorModal2;

import React, { useState, useEffect } from 'react';
import createprojectabc from "../../../../assets/Logo/createprojectabc.png";
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import Dropdown from "../../../../assets/Logo/Dropdown.png"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckIcon from '@mui/icons-material/Check';

import ReactSelect from 'react-select';
import Select from 'react-select';
import { useNavigate } from "react-router-dom"
import EastIcon from '@mui/icons-material/East';
import { useFormContext } from "react-hook-form";
import { useCountries } from "react-countries";
import { useSelector } from 'react-redux';



const InvestorModal1 = ({ isOpen, onClose, onBack }) => {
    const multiChainNames = useSelector((currState) => currState.chains.chains);

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
    // const { countries } = useCountries();
    const { getValues, register, clearErrors, watch, countries, formState: { errors }, setValue, setError, invested_in_multi_chain_names, trigger } = useFormContext();
    console.log(getValues)
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
    // React.useEffect(() => {
    //   getAllIcpHubs();
    // }, [getAllIcpHubs]);
    // Mentor form states
    // Mentor from states
    const [multiChainOptions, setMultiChainOptions] = useState([]);
    const [multiChainSelectedOptions, setMultiChainSelectedOptions] = useState(
        []
    );
    useEffect(() => {
        if (multiChainNames) {
            setMultiChainOptions(
                multiChainNames.map((chain) => ({
                    value: chain,
                    label: chain,
                }))
            );
        } else {
            setMultiChainOptions([]);
        }
    }, [multiChainNames]);

    useEffect(() => {
        if (multiChainNames) {
            setInvestedInMultiChainOptions(
                multiChainNames.map((chain) => ({
                    value: chain,
                    label: chain,
                }))
            );
        } else {
            setInvestedInMultiChainOptions([]);
        }
    }, [multiChainNames]);

    return (
        <>
            <h1 className="text-3xl text-[#121926] font-bold mb-3">
                Create a Investor
            </h1>
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Are you Registered ?<span className='text-[red] ml-1'>*</span></label>
                <select
                    {...register("investor_registered")}
                    // value={getValues("investor_registered")}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                    <option className="text-lg" value="false">
                        No
                    </option>
                    <option className="text-lg" value="true">
                        Yes
                    </option>
                </select>
                {errors.investor_registered && (
                    <p className="mt-1 text-sm text-red-500 font-bold text-left">
                        {errors.investor_registered.message}
                    </p>
                )}
            </div>
            {watch("investor_registered") === "true" && (
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Registered Country<span className='text-[red]'>*</span></label>
                    <select
                        {...register("registered_country")}
                        name="registered_country"
                        // value={getValues("registered_country")}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                        <option value="">Please choose an option </option>/
                        {countries?.map((country) => (
                            <option
                                key={country.name}
                                value={`${country.name}`}
                                className="text-lg"
                            >
                                {country.name}
                            </option>
                        ))}
                    </select>
                    {errors.registered_country && (
                        <p className="mt-1 text-sm text-red-500 font-bold text-left">
                            {errors.registered_country.message}
                        </p>
                    )}
                </div>
            )}

            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Are you an existing ICP investor ?</label>
                <select
                    {...register("existing_icp_investor")}
                    // value={getValues("existing_icp_investor")}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                    <option className="text-lg" value="false">
                        No
                    </option>
                    <option className="text-lg" value="true">
                        Yes
                    </option>
                </select>
                {errors.existing_icp_investor && (
                    <p className="mt-1 text-sm text-red-500 font-bold text-left">
                        {errors.existing_icp_investor.message}
                    </p>
                )}
            </div>
            {watch("existing_icp_investor") === 'true' && (
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Type of investment<span className='text-[red] ml-1'>*</span></label>
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
                                border: errors.investment_type
                                    ? "2px solid #ef4444"
                                    : "2px solid #737373",
                                backgroundColor: "rgb(249 250 251)",
                                "&::placeholder": {
                                    color: errors.investment_type
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
                                color: errors.investment_type
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
                        value={typeOfInvestSelectedOptions}
                        options={typeOfInvestOptions}
                        classNamePrefix="select"
                        className="basic-multi-select w-full text-start"
                        placeholder="Select a investment type"
                        name="investment_type"
                        onChange={(selectedOptions) => {
                            if (selectedOptions && selectedOptions.length > 0) {
                                setTypeOfInvestSelectedOptions(selectedOptions);
                                clearErrors("investment_type");
                                setValue(
                                    "investment_type",
                                    selectedOptions
                                        .map((option) => option.value)
                                        .join(", "),
                                    { shouldValidate: true }
                                );
                            } else {
                                setTypeOfInvestSelectedOptions([]);
                                setValue("investment_type", "", {
                                    shouldValidate: true,
                                });
                                setError("investment_type", {
                                    type: "required",
                                    message: "Atleast one investment type required",
                                });
                            }
                        }}
                    />
                    {errors.investment_type && (
                        <p className="mt-1 text-sm text-red-500 font-bold text-left">
                            {errors.investment_type.message}
                        </p>
                    )}
                </div>
            )}

            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Do you invest in multiple ecosystems ?<span className='text-[red] ml-1'>*</span></label>
                <select
                    {...register("invested_in_multi_chain")}
                    // value={getValues("invested_in_multi_chain")}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                    <option className="text-lg" value="false">
                        No
                    </option>
                    <option className="text-lg" value="true">
                        Yes
                    </option>
                </select>
                {errors.invested_in_multi_chain && (
                    <p className="mt-1 text-sm text-red-500 font-bold text-left">
                        {errors.invested_in_multi_chain.message}
                    </p>
                )}
            </div>
            {watch("invested_in_multi_chain") === 'true' && (
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Please select the chains <span className='text-[red] ml-1'>*</span></label>
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
                                border: errors.invested_in_multi_chain_names
                                    ? "2px solid #ef4444"
                                    : "2px solid #737373",
                                backgroundColor: "rgb(249 250 251)",
                                "&::placeholder": {
                                    color: errors.invested_in_multi_chain_names
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
                                color: errors.invested_in_multi_chain_names
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
                        value={investedInMultiChainSelectedOptions}
                        options={investedInmultiChainOptions}
                        classNamePrefix="select"
                        className="basic-multi-select w-full text-start"
                        placeholder="Select a chain"
                        name="invested_in_multi_chain_names"
                        onChange={(selectedOptions) => {
                            if (selectedOptions && selectedOptions.length > 0) {
                                setInvestedInMultiChainSelectedOptions(
                                    selectedOptions
                                );
                                clearErrors("invested_in_multi_chain_names");
                                setValue(
                                    "invested_in_multi_chain_names",
                                    selectedOptions
                                        .map((option) => option.value)
                                        .join(", "),
                                    { shouldValidate: true }
                                );
                            } else {
                                setInvestedInMultiChainSelectedOptions([]);
                                setValue("invested_in_multi_chain_names", "", {
                                    shouldValidate: true,
                                });
                                setError("invested_in_multi_chain_names", {
                                    type: "required",
                                    message: "Atleast one chain name required",
                                });
                            }
                        }}
                    />
                    {errors.invested_in_multi_chain_names && (
                        <p className="mt-1 text-sm text-red-500 font-bold text-left">
                            {errors.invested_in_multi_chain_names.message}
                        </p>
                    )}
                </div>
            )}
        </>
    );
};

export default InvestorModal1;

import React, { useState, useEffect } from "react";
import createprojectabc from "../../../../assets/Logo/createprojectabc.png";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Select from "react-select";
import { useFormContext } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";

const ProjectRegister3 = ({ formData }) => {
    const {
        register,
        formState: { errors },
        setValue,
        setError,
        watch,
        clearErrors,
    } = useFormContext();

    // STATE TO STORE OPTIONS FOR MULTI-CHAIN SELECTION
    const [multiChainOptions, setMultiChainOptions] = useState([]);
    // STATE TO STORE SELECTED OPTIONS FOR MULTI-CHAIN SELECTION
    const [multiChainSelectedOptions, setMultiChainSelectedOptions] = useState([]);

    // SELECTING MULTI-CHAIN NAMES FROM REDUX STORE
    const multiChainNames = useSelector((currState) => currState.chains.chains);

    // EFFECT TO UPDATE MULTI-CHAIN OPTIONS WHEN multiChainNames CHANGES
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
        if (formData) {
            setProjectValuesHandler(formData);
        }
    }, [formData]);

    const setProjectValuesHandler = (val) => {
        console.log('val', val)
        if (val) {
            setValue("multi_chain", val?.multi_chain === true || val?.multi_chain === 'true' ? 'true' : 'false');
            setValue("multi_chain_names", val?.multi_chain_names ? val?.multi_chain_names : "");
            setMultiChainSelectedOptionsHandler(val.multi_chain_names ?? null);

        }
    };
    const setMultiChainSelectedOptionsHandler = (val) => {
        setMultiChainSelectedOptions(
            val ? val.split(", ").map((chain) => ({ value: chain, label: chain })) : []
        );
    };

    return (
        <>
            {/* MULTI-CHAIN TOGGLE DROPDOWN */}
            <div className="mb-2">
                <label className="block text-sm font-medium mb-1">
                    Are you also multi-chain<span className="text-red-500">*</span>
                </label>
                <select
                    {...register("multi_chain")}
                    className={`border border-[#CDD5DF] rounded-md shadow-sm ${errors.multi_chain ? "border-red-500" : "border-[#737373]"
                        } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                >
                    <option className="text-lg font-bold" value="false">
                        No
                    </option>
                    <option className="text-lg font-bold" value="true">
                        Yes
                    </option>
                </select>
                {/* DISPLAY ERROR MESSAGE FOR MULTI-CHAIN FIELD */}
                {errors.multi_chain && (
                    <p className="mt-1 text-sm text-red-500 font-bold text-left">
                        {errors.multi_chain.message}
                    </p>
                )}
            </div>

            {/* CONDITIONAL RENDERING OF MULTI-CHAIN SELECTION IF MULTI-CHAIN IS ENABLED */}
            {watch("multi_chain") === "true" ? (
                <div className="mb-2">
                    <label className="block text-sm font-medium mb-1">
                        Please select the chains<span className="text-red-500">*</span>
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
                                border: errors.multi_chain_names
                                    ? "2px solid #ef4444"
                                    : "2px solid #737373",
                                backgroundColor: "rgb(249 250 251)",
                                "&::placeholder": {
                                    color: errors.multi_chain_names ? "#ef4444" : "currentColor",
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
                                color: errors.multi_chain_names
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
                                border: "2px solid #CDD5DF"

                            }),
                            multiValueRemove: (provided) => ({
                                ...provided,
                                display: "inline-flex",
                                alignItems: "center",
                            }),
                        }}
                        value={multiChainSelectedOptions}
                        options={multiChainOptions}
                        classNamePrefix="select"
                        className="basic-multi-select w-full text-start"
                        placeholder="Select a chain"
                        name="multi_chain_names"
                        onChange={(selectedOptions) => {
                            if (selectedOptions && selectedOptions.length > 0) {
                                setMultiChainSelectedOptions(selectedOptions);
                                clearErrors("multi_chain_names");
                                setValue(
                                    "multi_chain_names",
                                    selectedOptions.map((option) => option.value).join(", "),
                                    { shouldValidate: true }
                                );
                            } else {
                                setMultiChainSelectedOptions([]);
                                setValue("multi_chain_names", "", {
                                    shouldValidate: true,
                                });
                                setError("multi_chain_names", {
                                    type: "required",
                                    message: "Atleast one chain name required",
                                });
                            }
                        }}
                    />
                    {/* DISPLAY ERROR MESSAGE FOR MULTI-CHAIN NAMES FIELD */}
                    {errors.multi_chain_names && (
                        <p className="mt-1 text-sm text-red-500 font-bold text-left">
                            {errors.multi_chain_names.message}
                        </p>
                    )}
                </div>
            ) : (
                <></>
            )}

            {/* ICP MAINNET TOGGLE DROPDOWN */}
            <div className="mb-2">
                <label className="block text-sm font-medium mb-1">
                    Live on ICP<span className="text-red-500">*</span>
                </label>
                <select
                    {...register("live_on_icp_mainnet")}
                    className={`border border-[#CDD5DF] rounded-md shadow-sm ${errors.live_on_icp_mainnet ? "border-red-500" : "border-[#737373]"
                        } text-gray-900 placeholder-gray-500  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                >
                    <option className="text-lg font-bold" value="false">
                        No
                    </option>
                    <option className="text-lg font-bold" value="true">
                        Yes
                    </option>
                </select>
                {/* DISPLAY ERROR MESSAGE FOR ICP MAINNET FIELD */}
                {errors.live_on_icp_mainnet && (
                    <p className="mt-1 text-sm text-red-500 font-bold text-left">
                        {errors.live_on_icp_mainnet.message}
                    </p>
                )}
            </div>

            {/* CONDITIONAL RENDERING OF ADDITIONAL FIELDS IF LIVE ON ICP MAINNET IS ENABLED */}
            {watch("live_on_icp_mainnet") === "true" ? (
                <>
                    {/* DAPP LINK INPUT FIELD */}
                    <div className="mb-2">
                        <label className="block text-sm font-medium mb-1">
                            dApp Link<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            {...register("dapp_link")}
                            className={`border border-[#CDD5DF] rounded-md shadow-sm
                                             ${errors?.dapp_link
                                    ? "border-red-500 "
                                    : "border-[#737373]"
                                } text-gray-900 placeholder-gray-500  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                            placeholder="https://"
                        />
                        {/* DISPLAY ERROR MESSAGE FOR DAPP LINK FIELD */}
                        {errors?.dapp_link && (
                            <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                                {errors?.dapp_link?.message}
                            </span>
                        )}
                    </div>

                    {/* WEEKLY ACTIVE USERS INPUT FIELD */}
                    <div className="mb-2">
                        <label className="block text-sm font-medium mb-1">
                            Weekly active user<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            {...register("weekly_active_users")}
                            className={`border border-[#CDD5DF] rounded-md shadow-sm
                                             ${errors?.weekly_active_users
                                    ? "border-red-500 "
                                    : "border-[#737373]"
                                } text-gray-900 placeholder-gray-500  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                            placeholder="Enter Weekly active users"
                            onWheel={(e) => e.target.blur()}
                            min={0}
                        />
                        {/* DISPLAY ERROR MESSAGE FOR WEEKLY ACTIVE USERS FIELD */}
                        {errors?.weekly_active_users && (
                            <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                                {errors?.weekly_active_users?.message}
                            </span>
                        )}
                    </div>

                    {/* REVENUE INPUT FIELD */}
                    <div className="mb-2">
                        <label className="block text-sm font-medium mb-1">
                            Revenue (in Million USD)<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            {...register("revenue")}
                            className={`border border-[#CDD5DF] rounded-md shadow-sm
                                             ${errors?.revenue
                                    ? "border-red-500 "
                                    : "border-[#737373]"
                                } text-gray-900 placeholder-gray-500  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                            placeholder="Enter Revenue"
                            onWheel={(e) => e.target.blur()}
                            min={0}
                        />
                        {/* DISPLAY ERROR MESSAGE FOR REVENUE FIELD */}
                        {errors?.revenue && (
                            <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                                {errors?.revenue?.message}
                            </span>
                        )}
                    </div>
                </>
            ) : (
                <></>
            )}
        </>
    );
};

export default ProjectRegister3;

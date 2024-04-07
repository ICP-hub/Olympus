import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm, Controller } from "react-hook-form";
import toast, { Toaster } from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import DetailHeroSection from '../Common/DetailHeroSection';
import { ThreeDots } from "react-loader-spinner";
import { useCountries } from "react-countries";
import ReactSelect from "react-select";
import CompressedImage from '../ImageCompressed/CompressedImage';

const UserRegForm = () => {
    const { countries } = useCountries();
    const actor = useSelector((currState) => currState.actors.actor);
    const areaOfExpertise = useSelector((currState) => currState.expertiseIn.expertise);
    const typeOfProfile = useSelector((currState) => currState.profileTypes.profiles);
    const userFullData = useSelector((currState) => currState.userData.data.Ok);

    // STATES

    // user image states
    const [imagePreview, setImagePreview] = useState(null);
    const [imageData, setImageData] = useState(null);
    const [editMode, setEditMode] = useState(null);

    // default & static options states
    const [interestedDomainsOptions, setInterestedDomainsOptions] = useState([]);
    const [interestedDomainsSelectedOptions, setInterestedDomainsSelectedOptions] = useState([]);
    const [typeOfProfileOptions, setTypeOfProfileOptions] = useState([]);
    const [reasonOfJoiningOptions, setReasonOfJoiningOptions] = useState([
        { value: "listing_and_promotion", label: "Project listing and promotion" },
        { value: "Funding", label: "Funding" },
        { value: "Mentoring", label: "Mentoring" },
        { value: "Incubation", label: "Incubation" },
        { value: "Engaging_and_building_community", label: "Engaging and building community" },
        { value: "Jobs", label: "Jobs" },
    ]);
    const [reasonOfJoiningSelectedOptions, setReasonOfJoiningSelectedOptions] = useState([]);

    // user reg form validation schema
    const validationSchema = yup.object().shape(
        {
            full_name: yup.string().test('is-non-empty', 'Full name is required',
                (value) => /\S/.test(value)).required("Full name is required"),
            email: yup.string().email("Invalid email").nullable(true).optional(),
            telegram_id: yup.string().nullable(true).optional(),
            twitter_url: yup.string().nullable(true).optional().url("Invalid url"),
            openchat_user_name: yup.string().nullable(true).test("is-valid-username",
                "Username must be between 6 and 20 characters and can only contain letters, numbers, and underscores",
                (value) => {
                    if (!value) return true;
                    const isValidLength = value.length >= 6 && value.length <= 20;
                    const hasValidChars = /^(?=.*[A-Z0-9_])[a-zA-Z0-9_]+$/.test(value);
                    return isValidLength && hasValidChars;
                }),
            bio: yup.string().optional().test("maxWords", "Bio must not exceed 50 words",
                (value) => value ? value.split(/\s+/).filter(Boolean).length <= 50 : true),
            country: yup.string().test('is-non-empty', 'Country is required',
                (value) => /\S/.test(value)).required("Country is required"),
            domains_interested_in: yup.string().test('is-non-empty', 'Selecting an interest is required',
                (value) => /\S/.test(value)).required("Selecting an interest is required"),
            type_of_profile: yup.string().test('is-non-empty', 'Type of profile is required',
                (value) => /\S/.test(value)).required("Type of profile is required"),
            reasons_to_join_platform: yup.string().test('is-non-empty', 'Selecting a reason is required',
                (value) => /\S/.test(value)).required("Selecting a reason is required"),

            image: yup
                .mixed()
                .nullable(true)
                .test('fileSize', 'File size max 10MB allowed', (value) => {
                    return !value || (value && value.size <= 10 * 1024 * 1024); // 10 MB limit
                })
                .test('fileType', 'Only jpeg, jpg & png file format allowed', (value) => {
                    return !value || (value && ['image/jpeg', 'image/jpg', 'image/png'].includes(value.type));
                }),

        }).required();


    const { register, handleSubmit, reset, clearErrors, setValue, getValues, setError, watch, control, trigger, formState: { errors, isSubmitting } } = useForm({
        resolver: yupResolver(validationSchema),
        mode: "all",
    });

    // image creation function compression and uintarray creator
    const imageCreationFunc = async (file) => {
        const result = await trigger('image')
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
            console.log('ERROR--imageCreationFunc-file', file)
        }

    }

    // clear image func
    const clearImageFunc = (val) => {
        let field_id = val
        setValue(field_id, null);
        clearErrors(field_id);
        setImageData(null);
        setImagePreview(null);
    }

    // form submit handler func
    const onSubmitHandler = async (data) => {
        if (actor) {
            const userData = {
                full_name: data?.full_name,
                email: [data?.email],
                telegram_id: [data?.telegram_id.toString()],
                twitter_id: [data?.twitter_url.toString()],
                openchat_username: [data?.openchat_user_name],
                bio: [data?.bio],
                country: data?.country,
                area_of_interest: data?.domains_interested_in,
                type_of_profile: [data?.type_of_profile || ""],
                reason_to_join: [data?.reasons_to_join_platform.split(", ") || [""]],
                profile_picture: imageData ? [imageData] : [],
            };
            try {
                await actor.register_user(userData).then((result) => {
                    if (result && result.includes('User registered successfully')) {
                        toast.success("Registered as a User");
                        window.location.href = "/";
                    } else {
                        toast.error('Something got wrong')
                    }
                });
            } catch (error) {
                toast.error(error);
                console.error("Error sending data to the backend:", error);
            }
        } else {
            toast.error('Please signup with internet identity first');
            window.location.href = "/";
        }
    };

    // form error handler func
    const onErrorHandler = (val) => {
        toast.error('Empty fields or invalid values, please recheck the form');
    }

    // default interests set function 
    const setInterestedDomainsSelectedOptionsHandler = (val) => {
        setInterestedDomainsSelectedOptions(val
            ? val.split(", ").map((interest) =>
                ({ value: interest, label: interest }))
            : [])
    }

    // default reasons set function 
    const setReasonOfJoiningSelectedOptionsHandler = (val) => {
        setReasonOfJoiningSelectedOptions(
            val && val.length > 0 && val[0].length > 0
                ? val[0].map((reason) =>
                    ({ value: reason, label: reason }))
                :
                [])
    }


    // set values handler
    const setValuesHandler = (val) => {
        if (val) {
            setValue('full_name', val?.full_name ?? "");
            setValue('email', val?.email?.[0] ?? "");
            setValue('telegram_id', val?.telegram_id?.[0] ?? "");
            setValue('twitter_url', val?.twitter_id?.[0] ?? "");
            setValue('openchat_user_name', val?.openchat_username?.[0] ?? "");
            setValue('bio', val?.bio?.[0] ?? "");
            setValue('country', val?.country ?? "");
            setValue('domains_interested_in', val?.area_of_interest ?? "");
            setInterestedDomainsSelectedOptionsHandler(val?.area_of_interest ?? null)
            setImagePreview(val?.profile_picture?.[0] ?? "");
            setValue('type_of_profile', val?.type_of_profile?.[0])
            setValue('reasons_to_join_platform', val?.reason_to_join ? val?.reason_to_join.join(", ") : "");
            setReasonOfJoiningSelectedOptionsHandler(val?.reason_to_join);
        }
    }

    // Get data from redux useEffect
    useEffect(() => {
        if (areaOfExpertise) {
            setInterestedDomainsOptions(areaOfExpertise.map((expert) => ({
                value: expert.name,
                label: expert.name,
            })))
        } else {
            setInterestedDomainsOptions([]);
        }
    }, [areaOfExpertise])

    useEffect(() => {
        if (typeOfProfile) {
            setTypeOfProfileOptions(typeOfProfile.map((type) => ({
                value: type.role_type.toLowerCase(),
                label: type.role_type,
            })))
        } else {
            setTypeOfProfileOptions([]);
        }
    }, [typeOfProfile])

    useEffect(() => {
        if (userFullData) {
            setValuesHandler(userFullData)
            setEditMode(true)
        }

    }, [userFullData])

    return (
        <>
            <DetailHeroSection />
            <section className="w-full h-fit px-[6%] lg1:px-[4%] py-[6%] lg1:py-[4%] bg-gray-100">
                <div className="w-full h-full bg-gray-100 pt-8">
                    <div className="bg-gradient-to-r from-purple-800 to-blue-500 text-transparent bg-clip-text text-[30px]  sm:text-[25px] md1:text-[30px] md2:text-[35px] font-black font-fontUse dxl:text-[40px] p-8">
                        User Information
                    </div>
                    <div className="text-sm font-medium text-center text-gray-200 ">
                        {/* START OF USER REGISTRATION FORM */}

                        <form
                            onSubmit={handleSubmit(onSubmitHandler, onErrorHandler)}
                            className="w-full px-4" >
                            <div className="flex flex-col">
                                <div className="flex-row w-full flex justify-start gap-4 items-center">
                                    <div className="mb-3 ml-6 h-24 w-24 rounded-full border-2 border-gray-300 flex items-center justify-center overflow-hidden">
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

                                    <Controller
                                        name="image"
                                        control={control}
                                        render={({ field }) => (
                                            <>
                                                <input
                                                    type="file"
                                                    className='hidden'
                                                    id='image'
                                                    name="image"
                                                    onChange={(e) => {
                                                        field.onChange(e.target.files[0]);
                                                        imageCreationFunc(e.target.files[0]);
                                                    }}
                                                    accept=".jpg, .jpeg, .png"

                                                />
                                                <label
                                                    htmlFor="image"
                                                    className="p-2 border-2 border-blue-800 items-center rounded-md text-md bg-transparent text-blue-800 cursor-pointer font-semibold"
                                                >
                                                    {imagePreview && !errors.image ? 'Change profile picture' : 'Upload profile picture'}
                                                </label>
                                                {imagePreview || errors.image ? (
                                                    <button
                                                        className="p-2 border-2 border-red-500 items-center rounded-md text-md bg-transparent text-red-500 cursor-pointer font-semibold capitalize"
                                                        onClick={() => clearImageFunc('image')}
                                                    >
                                                        clear
                                                    </button>) : ''}
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
                                <div className="relative z-0 group mb-6">
                                    <label htmlFor="full_name"
                                        className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start">
                                        Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        {...register("full_name")}
                                        className={`bg-gray-50 border-2 
                                                ${errors?.full_name
                                                ? "border-red-500"
                                                : "border-[#737373]"
                                            } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                                        placeholder="Enter your full name"
                                    />
                                    {errors?.full_name && (
                                        <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                                            {errors?.full_name?.message}
                                        </span>
                                    )}
                                </div>
                                <div className="relative z-0 group mb-6">
                                    <label htmlFor="email"
                                        className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        {...register("email")}
                                        className={`bg-gray-50 border-2 
                                                ${errors?.email
                                                ? "border-red-500"
                                                : "border-[#737373]"
                                            } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                                        placeholder="Enter your email"
                                    />
                                    {errors?.email && (
                                        <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                                            {errors?.email?.message}
                                        </span>
                                    )}
                                </div>
                                <div className="relative z-0 group mb-6">
                                    <label htmlFor="telegram_id"
                                        className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start">
                                        Telegram ID
                                    </label>
                                    <input
                                        type="text"
                                        {...register("telegram_id")}
                                        className={`bg-gray-50 border-2 
                                                ${errors?.telegram_id
                                                ? "border-red-500 "
                                                : "border-[#737373]"
                                            } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                                        placeholder="Enter your telegram id"
                                    />
                                    {errors?.telegram_id && (
                                        <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                                            {errors?.telegram_id?.message}
                                        </span>
                                    )}
                                </div>
                                <div className="relative z-0 group mb-6">
                                    <label htmlFor="twitter_url"
                                        className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start">
                                        Twitter URL
                                    </label>
                                    <input
                                        type="text"
                                        {...register("twitter_url")}
                                        className={`bg-gray-50 border-2 
                                                ${errors?.twitter_url
                                                ? "border-red-500 "
                                                : "border-[#737373]"
                                            } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                                        placeholder="Enter your twitter url"
                                    />
                                    {errors?.twitter_url && (
                                        <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                                            {errors?.twitter_url?.message}
                                        </span>
                                    )}
                                </div>
                                <div className="relative z-0 group mb-6">
                                    <label htmlFor="openchat_user_name"
                                        className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start">
                                        OpenChat username
                                    </label>
                                    <input
                                        type="text"
                                        {...register("openchat_user_name")}
                                        className={`bg-gray-50 border-2 
                                                ${errors?.openchat_user_name
                                                ? "border-red-500 "
                                                : "border-[#737373]"
                                            } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                                        placeholder="Enter your openchat username"
                                    />
                                    {errors?.openchat_user_name && (
                                        <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                                            {errors?.openchat_user_name?.message}
                                        </span>
                                    )}
                                </div>
                                <div className="relative z-0 group mb-6">
                                    <label htmlFor="bio"
                                        className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start">
                                        Bio (50 words)
                                    </label>
                                    <textarea
                                        {...register("bio")}
                                        className={`bg-gray-50 border-2 ${errors?.bio
                                            ? "border-red-500 "
                                            : "border-[#737373]"
                                            } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                                        placeholder="Enter your bio"
                                        rows={1}
                                    ></textarea>
                                    {errors?.bio && (
                                        <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
                                            {errors?.bio?.message}
                                        </span>
                                    )}
                                </div>
                                <div className="relative z-0 group mb-6">
                                    <label htmlFor="country"
                                        className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start">
                                        Country <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        {...register("country")}
                                        className={`bg-gray-50 border-2 ${errors.country
                                            ? "border-red-500 "
                                            : "border-[#737373]"
                                            } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
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
                                <div className="relative z-0 group mb-6">
                                    <label htmlFor="domains_interested_in"
                                        className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start">
                                        Domains you are interested in <span className="text-red-500">*</span>
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
                                                setInterestedDomainsSelectedOptions(selectedOptions)
                                                clearErrors("domains_interested_in");
                                                setValue("domains_interested_in",
                                                    selectedOptions.map((option) => option.value).join(", "),
                                                    { shouldValidate: true });
                                            } else {
                                                setInterestedDomainsSelectedOptions([])
                                                setValue("domains_interested_in", "",
                                                    { shouldValidate: true });
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
                                <div className="relative z-0 group mb-6">
                                    <label htmlFor="type_of_profile"
                                        className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start" >
                                        Type of profile <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        {...register("type_of_profile")}
                                        className={`bg-gray-50 border-2 ${errors.type_of_profile
                                            ? "border-red-500 "
                                            : "border-[#737373]"
                                            } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                                    >

                                        <option className="text-lg font-bold" value="">
                                            Select profile type
                                        </option>
                                        {typeOfProfileOptions && typeOfProfileOptions.map((val, index) => {
                                            return (
                                                <option className="text-lg font-bold" key={index} value={val?.value}>
                                                    {val?.label}
                                                </option>
                                            )
                                        })}
                                    </select>
                                    {errors.type_of_profile && (
                                        <p className="mt-1 text-sm text-red-500 font-bold text-left">
                                            {errors.type_of_profile.message}
                                        </p>
                                    )}
                                </div>
                                <div className="relative z-0 group mb-6">
                                    <label htmlFor="reasons_to_join_platform"
                                        className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start" >
                                        Why do you want to join this platform ? <span className="text-red-500">*</span>
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
                                                setReasonOfJoiningSelectedOptions(selectedOptions)
                                                clearErrors("reasons_to_join_platform");
                                                setValue("reasons_to_join_platform", selectedOptions.map((option) => option.value).join(", "),
                                                    { shouldValidate: true });
                                            } else {
                                                setReasonOfJoiningSelectedOptions([]);
                                                setValue("reasons_to_join_platform", "",
                                                    { shouldValidate: true });
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
                                        editMode ? "Update" : "Submit"
                                    )}
                                </button>
                            </div>
                        </form>

                        {/* END OF USER REGISTRATION FORM */}
                    </div>
                </div >
            </section >
            <Toaster />
        </>
    );
}

export default UserRegForm;
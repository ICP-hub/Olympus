import React, { useState, useCallback, useEffect } from "react";
import { investorRegistration } from "../../Utils/Data/AllDetailFormData";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  investorRegistrationAdditionalInfo,
  investorRegistrationUserDetailsDetails,
  investorRegistrationDetails,
} from "../../Utils/Data/InvestorFormData";
import { useCountries } from "react-countries";
import InvestorDetails from "./InvestorDetails";
import InvestorAdditionalInformation from "./InvestorAdditionalInformation";
import InvestorPersonalInformation from "./InvestorPersonalInformation";
import { useSelector } from "react-redux";
import { allHubHandlerRequest } from "../../StateManagement/Redux/Reducers/All_IcpHubReducer";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { userRoleHandler } from "../../StateManagement/Redux/Reducers/userRoleReducer";
import CompressedImage from "../../ImageCompressed/CompressedImage";
import DetailHeroSection from "../../Common/DetailHeroSection";
import Mentor from "../../../../assets/images/mentorRegistration.png";
import { bufferToImageBlob } from "../../Utils/formatter/bufferToImageBlob";

const validationSchema = {
  userDetails: yup.object().shape({
    full_name: yup
      .string()
      .required()
      .test("is-non-empty", null, (value) => value && value.trim().length > 0),
    openchat_username: yup
      .string()
      .nullable(true) // Allows the value to be null
      .test(
        "is-valid-username",
        "Username must be between 6 and 20 characters and can only contain letters, numbers, and underscores",
        (value) => {
          // If no value is provided, consider it valid (since it's optional)
          if (!value) return true;

          // Check length
          const isValidLength = value.length >= 6 && value.length <= 20;
          // Check allowed characters (including at least one uppercase letter or number)
          const hasValidChars = /^(?=.*[A-Z0-9_])[a-zA-Z0-9_]+$/.test(value);

          return isValidLength && hasValidChars;
        }
      ),
    bio: yup.string().optional(),
    email: yup.string().email().optional(),
    telegram_id: yup.string().optional().url(),
    twitter_id: yup.string().optional().url(),
    country: yup
      .string()
      .test("is-non-empty", "ICP Hub selection is required", (value) =>
        /\S/.test(value)
      )
      .required("Selecting a interest is required."),
    area_of_intrest: yup.string().required("Selecting a interest is required."),
  }),
  investorDetails: yup.object().shape({
    registered: yup.string().required().required("Field is required"),
    registered_country: yup
      .string()
      .required()
      .required("Registered Country is required"),
    preferred_icp_hub: yup
      .string()
      .required()
      .test("is-non-empty", "ICP Hub selection is required", (value) =>
        /\S/.test(value)
      )
      .required("ICP Hub selection is required"),
    existing_icp_investor: yup
      .boolean()
      .required("Are you an existing ICP investor")
      .test("is-non-empty", "Data is required", (value) => /\S/.test(value)),
    existing_icp_portfolio: yup
      .string()
      .optional()
      .test("is-non-empty", "icp protfolio required", (value) =>
        /\S/.test(value)
      ),
    investor_type: yup
      .string()
      .optional()
      .test("is-non-empty", "Investor type is required", (value) =>
        /\S/.test(value)
      ),
    money_invested: yup
      .number()
      .typeError("You must enter a number")
      .positive("Must be a positive number")
      .optional()
      .test("is-non-empty", "Money invested is required", (value) =>
        /\S/.test(value)
      ),
    registered_under_any_hub: yup
      .boolean()
      .optional()
      .test("is-non-empty", "registered under any hub required", (value) =>
        /\S/.test(value)
      ),
    assets_under_management: yup
      .string()
      .required("Assets under management required")
      .test("is-non-empty", "assets_under_management is required", (value) =>
        /\S/.test(value)
      ),
    name_of_fund: yup
      .string()
      .required("Name of fund is required")
      .test("is-non-empty", "Name of fund required", (value) =>
        /\S/.test(value)
      ),
    fund_size: yup
      .number()
      .typeError("You must enter a number")
      .positive("Must be a positive number")
      .required("Size of fund is required")
      .test("is-non-empty", "Size of fund is required", (value) =>
        /\S/.test(value)
      ),
    // preferred_investment_sectors: yup
    //   .string()
    //   .required("Preferred investment sectors are required")
    //   .test(
    //     "is-non-empty",
    //     "Preferred investment sectors are required",
    //     (value) => /\S/.test(value)
    //   ),
    average_check_size: yup
      .number()
      .typeError("You must enter a number")
      .required("Size of managed fund is required")
      .positive("Must be a positive number")
      .test(
        "is-float",
        "Size of managed fund must be a positive number",
        (value) => value && /^\d+(\.\d{1,2})?$/.test(value)
      ),
    portfolio_link: yup
      .string()
      .required("Portfolio required")
      .test("is-non-empty", "portfolio is required", (value) =>
        /\S/.test(value)
      ),
  }),
  additionalInfo: yup.object().shape({
    project_on_multichain: yup.string().optional(),
    reason_for_joining: yup
      .string()
      .required("Reason for joining is required")
      .test("is-non-empty", "Reason for joining is required", (value) =>
        /\S/.test(value)
      ),
    number_of_portfolio_companies: yup
      .number()
      .typeError("You must enter a number")
      .positive("Must be a positive number")
      .integer("Must be an integer")
      .required("Number of portfolio companies is required")
      .test(
        "is-non-empty",
        "Number of portfolio companies is required",
        (value) => /\S/.test(value)
      ),
    type_of_investment: yup
      .string()
      .required("type of icp investment required")
      .test(
        "is-non-empty",
        "Preferred investment sectors are required",
        (value) => /\S/.test(value)
      ),
    category_of_investment: yup
      .string()
      .required("Category of investment is required")
      .test("is-non-empty", "Category of investment required", (value) =>
        /\S/.test(value)
      ),
    announcement_details: yup.string().optional(),
    website_link: yup
      .string()
      .required("Portfolio required")
      .test("is-non-empty", "portfolio is required", (value) =>
        /\S/.test(value)
      ),
    linkedin_link: yup
      .string()
      .required("LinkedIn required")
      .test("is-non-empty", "portfolio is required", (value) =>
        /\S/.test(value)
      ),
  }),
};

const InvestorRegistration = () => {
  const getAllIcpHubs = useSelector((currState) => currState.hubs.allHubs);
  const actor = useSelector((currState) => currState.actors.actor);
  const specificRole = useSelector(
    (currState) => currState.current.specificRole
  );
  const areaOfExpertise = useSelector(
    (currState) => currState.expertiseIn.expertise
  );
  const activeRole = useSelector(
    (currState) => currState.currentRoleStatus.activeRole
  );
  const multiChain = useSelector((currState) => currState.chains.chains);

  const investorFullData = useSelector(
    (currState) => currState.investorData.data
  );

  console.log("activeRole in vc reg ", activeRole);
  console.log("investorFullData in vc reg ", investorFullData);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { countries } = useCountries();

  const [activeTab, setActiveTab] = useState(investorRegistration[0].id);
  const [formData, setFormData] = useState({});
  const [step, setStep] = useState(0);
  const [isCurrentStepValid, setIsCurrentStepValid] = useState(false);
  const [userHasInteracted, setUserHasInteracted] = useState(false);
  const [investorDataObject, setInvestorDataObject] = useState({});
  const [image, setImage] = useState(null);
  const [logoData, setLogoData] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [venture_image, setVenture_image] = useState(null);
  // Form Updates Changes in enable and diabled
  const [isExistingICPInvestor, setExistingICPInvestor] = useState(false);
  const [isMulti_Chain, setIsMulti_Chain] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const userData = useSelector((currState) => currState.userData.data.Ok);

  useEffect(() => {
    if (userData) {
      // Create an object that matches the form fields structure
      const formData = {
        full_name: userData.full_name || "",
        email: userData.email?.[0] || "",
        telegram_id: userData.telegram_id?.[0] || "",
        twitter_id: userData.twitter_id?.[0] || "",
        openchat_username: userData.openchat_username?.[0] || "",
        bio: userData.bio?.[0] || "",
        country: userData.country || "",
        area_of_intrest: userData.area_of_intrest || "",
      };

      // If there is a mentor_image, handle its conversion and set it separately if needed
      if (userData.profile_picture) {
        bufferToImageBlob(userData?.profile_picture)
          .then((imageUrl) => {
            setImage(imageUrl);
            setFormData({ profileImage: userData.profile_picture[0] });
            // You might also need to handle setting the image for display if required
          })
          .catch((error) => console.error("Error converting image:", error));
      }

      // Use the reset function to populate the form
      reset(formData);
    }
  }, [userData]);

  const getTabClassName = (tab) => {
    return `inline-block p-2 font-bold ${
      activeTab === tab
        ? "text-black border-b-2 border-black"
        : "text-gray-400  border-transparent hover:text-black"
    } rounded-t-lg`;
  };
  const steps = [
    { id: "userDetails", fields: investorRegistrationUserDetailsDetails },
    { id: "investorDetails", fields: investorRegistrationDetails },
    { id: "additionalInfo", fields: investorRegistrationAdditionalInfo },
  ];

  const currentValidationSchema = validationSchema[steps[step].id];

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    trigger,
    watch,
    setError,
    clearErrors,
    setValue,
    reset,
    control,
  } = useForm({
    resolver: yupResolver(currentValidationSchema),
    mode: "all",
  });

  const handleTabClick = async (tab) => {
    const targetStep = investorRegistration.findIndex(
      (header) => header.id === tab
    );
    setUserHasInteracted(true);

    if (step === targetStep) {
      return;
    }
    if (targetStep < step || isCurrentStepValid) {
      setActiveTab(tab);
      setStep(targetStep);
    } else {
    }
  };
  // Watch the value of existing_icp_investor to update ExistingICPInvestor state
  const ExistingICPInvestor = watch("existing_icp_investor");
  const IsMultiChain = watch("multi_chain");
  const IsRegistered = watch("registered");

  useEffect(() => {
    // Update ExistingICPInvestor based on existing_icp_investor field value
    setExistingICPInvestor(ExistingICPInvestor === "true");
    if (ExistingICPInvestor !== "true") {
      setValue("investor_type", "");
      setValue("money_invested", "");
      setValue("existing_icp_portfolio", "");
    }
    setIsRegistered(IsRegistered === "true");
    if (IsRegistered !== "true") {
      setValue("registered_country", "");
    }
    setIsMulti_Chain(IsMultiChain === "true");
    if (IsMultiChain !== "true") {
      setValue("project_on_multichain", "");
    }
  }, [ExistingICPInvestor, IsMultiChain, IsRegistered, setValue]);

  useEffect(() => {
    if (!userHasInteracted) return;
    const validateStep = async () => {
      const fieldsToValidate = steps[step].fields.map((field) => field.name);
      const result = await trigger(fieldsToValidate);
      setIsCurrentStepValid(result);
    };

    validateStep();
  }, [step, trigger, userHasInteracted]);

  useEffect(() => {
    dispatch(allHubHandlerRequest());
  }, [actor, dispatch]);

  const handleNext = async () => {
    const fieldsToValidate = steps[step].fields.map((field) => field.name);
    const result = await trigger(fieldsToValidate);
    if (result) {
      setStep((prevStep) => prevStep + 1);
      setActiveTab(investorRegistration[step + 1]?.id);
    }
  };

  const addImageHandler = async (e) => {
    const selectedImages = e.target.files[0];
    if (selectedImages) {
      try {
        // 1) image ko phle compress kia
        const compressedFile = await CompressedImage(selectedImages);

        // 2) frontend pr display k lie
        const reader = new FileReader();
        reader.readAsDataURL(compressedFile); // Convert the compressed blob to a Data URL for display
        reader.onloadend = () => {
          setImage(reader.result);
        };

        // 3) image ko backend mai bhejne k lie
        const byteArray = await compressedFile.arrayBuffer(); // Convert krega Blob ko ArrayBuffer mai
        const imageBytes = Array.from(new Uint8Array(byteArray)); // Convert ArrayBuffer ko array of bytes mai
        setProfileImage(imageBytes);
        // console.log("imageBytes", imageBytes);
      } catch (error) {
        console.error("Error compressing the image:", error);
      }
    }
  };
  // Adding Project_Logo image Here
  const addLogoHandler = useCallback(
    async (file) => {
      clearErrors("logoData");
      // if (!file)
      //   return setError("logoData", {
      //     type: "manual",
      //     message: "An logo is required",
      //   });
      if (!["image/jpeg", "image/png", "image/gif"].includes(file.type))
        return setError("logoData", {
          type: "manual",
          message: "Unsupported file format",
        });
      if (file.size > 1024 * 1024)
        // 1MB
        return setError("logoData", {
          type: "manual",
          message: "The file is too large",
        });

      setIsLoading(true);
      try {
        const compressedFile = await CompressedImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setLogoPreview(reader.result);
          setIsLoading(false);
        };
        reader.readAsDataURL(compressedFile);

        const byteArray = await compressedFile.arrayBuffer();
        const logoDataArray = new Uint8Array(byteArray);
        setLogoData(logoDataArray);
        console.log("logoData", logoDataArray);
        setValue("logoData", logoDataArray, { shouldValidate: true });
      } catch (error) {
        console.error("Error processing the logo:", error);
        setError("logoData", {
          type: "manual",
          message: "Could not process logo, please try another.",
        });
        setIsLoading(false);
      }
    },
    [setError, clearErrors, setValue, setIsLoading, setLogoPreview, setLogoData]
  );
  const imageUrlToByteArray = async (imageUrl) => {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    return Array.from(new Uint8Array(arrayBuffer));
  };

  const handlePrevious = () => {
    if (step > 0) {
      setStep((prevStep) => prevStep - 1);
      setActiveTab(investorRegistration[step - 1]?.id);
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

  useEffect(() => {
    if (investorFullData && investorFullData.length > 0) {
      const data = investorFullData[0];
      const formattedData = Object.keys(data).reduce((acc, key) => {
        acc[key] = Array.isArray(data[key]) ? data[key][0] : data[key];
        return acc;
      }, {});
      console.log("data jo aaya reset mai ", formattedData);
      reset(formattedData);
      setFormData(formattedData);

      if (formattedData.profileImage) {
        imageUrlToByteArray(formattedData.profil)
          .then((imageBytes) => {
            setProfileImage(imageBytes);
          })
          .catch((error) => console.error("Error converting image:", error));
      }
    }
  }, [investorFullData, reset]);

  const stepFields = steps[step].fields;
  let StepComponent;

  const sendingInvestorData = async (val) => {
    console.log("data jo jaega backend mai =>", val);
    // val.logo = val.logo[0] || [];
    let result;
    try {
      // if (specificRole !== null || undefined) {
      // result = await actor.update_venture_capitalist(val);
      // } else if (specificRole === null || specificRole === undefined) {
      await actor.register_venture_capitalist(val).then((result) => {
        toast.success(result);
        // console.log('result', result)
        // navigate('/');
        window.location.href = "/";
      });
      // }

      console.log("investor data registered in backend");
      // await dispatch(userRoleHandler());
      await navigate("/dashboard");
    } catch (error) {
      toast.error(error);
      console.log(error.message);
    }
  };

  const onSubmit = async (data) => {
    console.log("data of investor =>", data);

    const updatedFormData = { ...formData, ...data };
    setFormData(updatedFormData);

    if (step < steps.length - 1) {
      handleNext();
    }
    // else if (
    //   specificRole !== null ||
    //   (undefined && step > steps.length - 1)
    // ) {
    // console.log("exisiting user visit ");

    //   const interestInBoardPosition =
    //     updatedFormData.existing_icp_investor === "true" ? true : false;
    //   const updatedregisteredUnderAnyHub =
    //     updatedFormData.registered_under_any_hub === "true" ? true : false;

    //   // const updatedMultiChain =
    //   //   updatedFormData.project_on_multichain === "true" ? true : false;

    //   let tempObj2 = {
    //     average_check_size: Number(updatedFormData.average_check_size),
    //     email: [updatedFormData.email] || [],
    //     full_name: updatedFormData.full_name || "",
    //     openchat_username: [updatedFormData.openchat_username] || [],

    //     existing_icp_investor: interestInBoardPosition,
    //     money_invested: Number(updatedFormData.money_invested),
    //     project_on_multichain: [updatedFormData.project_on_multichain] || [],

    //     reason_for_joining: updatedFormData.reason_for_joining || "",
    //     country: updatedFormData.country || "",
    //     announcement_details: updatedFormData.announcement_details || "",
    //     name_of_fund: updatedFormData.name_of_fund || "",
    //     bio: [updatedFormData.bio] || [],
    //     existing_icp_portfolio: updatedFormData.existing_icp_portfolio || "",
    //     registered_under_any_hub: [updatedregisteredUnderAnyHub] || [],
    //     number_of_portfolio_companies:
    //       updatedFormData.number_of_portfolio_companies || 0,
    //     area_of_intrest: updatedFormData.area_of_intrest || [],

    //     portfolio_link: updatedFormData.portfolio_link || "",
    //     preferred_icp_hub: updatedFormData.preferred_icp_hub,
    //     type_of_investment: updatedFormData.type_of_investment || "",
    //     category_of_investment: updatedFormData.category_of_investment || "",

    //     preferred_investment_sectors:
    //       [updatedFormData.preferred_investment_sectors] || [],
    //     investor_type: updatedFormData.investor_type ||"",
    //     fund_size: Number(updatedFormData.fund_size) || "",
    //     telegram_id: [updatedFormData.telegram_id] || [],
    //     assets_under_management: updatedFormData.assets_under_management || "",
    //     logo: [logo] || [],
    //   };

    //   setInvestorDataObject(tempObj2);
    //   await sendingInvestorData(tempObj2);
    // }
    //  (
    // specificRole === null ||
    // (step > steps.length - 1)
    // )
    else {
      console.log("first time visit ");

      const updatedregisteredUnderAnyHub =
        updatedFormData.registered_under_any_hub === "true" ? true : false;
      const updatedexisting_icp_investor =
        ExistingICPInvestor === "true" ? true : false;
      const updatedIsRegistered = IsRegistered === "true" ? true : false;
      // const updatedMultiChain =
      //   updatedFormData.project_on_multichain === "true" ? true : false;
      const parsedMoneyInvested = parseFloat(updatedFormData.money_invested);
      let tempObj = {
        user_data: {
          bio: [updatedFormData.bio],
          country: updatedFormData.country,
          area_of_intrest: updatedFormData.area_of_intrest,
          telegram_id: [updatedFormData.telegram_id],
          twitter_id: [updatedFormData.twitter_id],
          openchat_username: [updatedFormData.openchat_username],
          email: [updatedFormData.email],
          full_name: updatedFormData.full_name,
          profile_picture: [updatedFormData.profileImage] || [],
        },
        preferred_icp_hub: updatedFormData.preferred_icp_hub,
        existing_icp_investor: updatedexisting_icp_investor,
        existing_icp_portfolio: [updatedFormData.existing_icp_portfolio],
        investor_type: updatedFormData.investor_type,
        money_invested: [parsedMoneyInvested],
        registered: updatedIsRegistered,
        registered_under_any_hub: [updatedregisteredUnderAnyHub],
        assets_under_management: updatedFormData.assets_under_management,
        registered_country: updatedFormData.registered_country
          ? [updatedFormData.registered_country]
          : [],
        name_of_fund: updatedFormData.name_of_fund,
        fund_size: Number(updatedFormData.fund_size),
        average_check_size: Number(updatedFormData.average_check_size),
        project_on_multichain: updatedFormData.project_on_multichain
          ? [updatedFormData.project_on_multichain]
          : [],
        reason_for_joining: updatedFormData.reason_for_joining,
        number_of_portfolio_companies:
          updatedFormData.number_of_portfolio_companies,
        type_of_investment: updatedFormData.type_of_investment,
        category_of_investment: updatedFormData.category_of_investment,
        announcement_details: [updatedFormData.announcement_details],
        portfolio_link: updatedFormData.portfolio_link,
        website_link: updatedFormData.website_link,
        linkedin_link: updatedFormData.linkedin_link,
        // preferred_investment_sectors: [
        //   updatedFormData.preferred_investment_sectors,
        // ],
        logo: logoData ? [logoData] : [],
      };
      console.log("eh rha tempObj agya hai investor pr ===>", tempObj);
      setInvestorDataObject(tempObj);
      await sendingInvestorData(tempObj);
    }
  };

  if (step === 0) {
    StepComponent = <InvestorPersonalInformation />;
  } else if (step === 1) {
    StepComponent = <InvestorDetails />;
  } else if (step === 2) {
    StepComponent = (
      <InvestorAdditionalInformation isSubmitting={isSubmitting} />
    );
  }
  const HeroImage = (
    <img
      src={Mentor}
      alt="Astronaut"
      className={`z-20 w-[500px] md:w-[300px] sm:w-[250px] sxs:w-[260px] md:h-56 relative  sxs:-right-3 right-16 md:right-0 sm:right-0 top-10`}
    />
  );
  return (
    <>
      <DetailHeroSection HeroImage={HeroImage} />
      <section className="w-full h-fit px-[6%] lg1:px-[4%] py-[6%] lg1:py-[4%] bg-gray-100">
        <div className="w-full h-full bg-gray-100 pt-8">
          <div className="bg-gradient-to-r from-purple-800 to-blue-500 text-transparent bg-clip-text text-[30px]  sm:text-[25px] md1:text-[30px] md2:text-[35px] font-black font-fontUse dxl:text-[40px] p-8">
            Investor's Information
          </div>
          <div className="text-sm font-medium text-center text-gray-200 ">
            <ul className="flex flex-wrap mb-4 text-sxxs:text-[7px] sxs:text-[7.5px] sxs1:text-[8px] sxs2:text-[8.5px] sxs3:text-[9px] ss:text-[9.5px] ss1:text-[10px] ss2:text-[10.5px] ss3:text-[11px] ss4:text-[11.5px] dxs:text-[12px] xxs:text-[12.5px] xxs1:text-[13px] sm1:text-[13.5px] sm4:text-[14px] sm2:text-[14.5px] sm3:text-[13px] sm:text-[11.5px] md:text-[14px.3] md1:text-[13px] md2:text-[13px] md3:text-[13px] lg:text-[14.5px] dlg:text-[15px] lg1:text-[16.5px] lgx:text-[16px] dxl:text-[16.5px] xl:text-[19px] xl2:text-[19.5px] cursor-pointer justify-around">
              {investorRegistration.map((header, index) => (
                <li key={header.id} className="me-2 relative group">
                  <button
                    className={`${getTabClassName(header.id)} ${
                      index > step && !isCurrentStepValid
                        ? "cursor-not-allowed opacity-50"
                        : "cursor-pointer"
                    }`}
                    onClick={() => handleTabClick(header.id)}
                    disabled={index > step && !isCurrentStepValid}
                  >
                    <div className="hidden md:block">{header.label}</div>

                    <div className="flex md:hidden items-center">
                      {header.icon}
                    </div>
                  </button>
                  <div className="md:hidden">
                    {index > step && !isCurrentStepValid && (
                      <ReactTooltip
                        id={header.id}
                        place="bottom"
                        content="Complete current step to proceed"
                        className="z-10"
                      />
                    )}
                  </div>
                </li>
              ))}
            </ul>

            {step == 0 && (
              <div className="flex flex-col">
                <div className="flex-row w-full flex justify-start gap-4 items-center">
                  <div className="mb-3 ml-6 h-24 w-24 rounded-full border-2 border-gray-300 flex items-center justify-center overflow-hidden">
                    {image ? (
                      <img
                        src={image}
                        alt="New profile"
                        className="h-full w-full object-cover"
                      />
                    ) : formData.profileImage ? (
                      <img
                        src={formData?.profileImage}
                        alt="User"
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
                    <input
                      id="imagess"
                      type="file"
                      name="imagess"
                      onChange={(e) => addImageHandler(e)}
                      className="hidden"
                    />
                  </div>

                  <label
                    htmlFor="imagess"
                    className="p-2 border-2 border-blue-800 items-center rounded-md text-md bg-transparent text-blue-800 cursor-pointer font-extrabold"
                  >
                    Upload image
                  </label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-3 px-4">
                  <div className="z-0 w-full mb-3 group">
                    <label
                      htmlFor="country"
                      className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                    >
                      Country*
                    </label>
                    <select
                      {...register("country")}
                      className={`bg-gray-50 border-2 ${
                        errors.country
                          ? "border-red-500 placeholder:text-red-500"
                          : "border-[#737373]"
                      } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                    >
                      <option className="text-lg font-bold" value="">
                        select your country
                      </option>
                      {countries?.map((expert) => (
                        <option
                          key={expert.name}
                          value={`${expert.name}`}
                          className="text-lg font-bold"
                        >
                          {expert.name}
                        </option>
                      ))}
                    </select>

                    {errors.country && (
                      <p className="mt-1 text-sm text-red-500 font-bold text-left">
                        {errors.country.message}
                      </p>
                    )}
                  </div>
                  <div className="z-0 w-full mb-3 group">
                    <label
                      htmlFor="area_of_intrest"
                      className="block mb-2 text-lg font-medium  text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                    >
                      interest*
                    </label>
                    <select
                      {...register("area_of_intrest")}
                      // id="area_of_intrest"
                      className={`bg-gray-50 border-2 ${
                        errors.area_of_intrest
                          ? "border-red-500 placeholder:text-red-500"
                          : "border-[#737373]"
                      } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                    >
                      <option className="text-lg font-bold" value="">
                        select your interest
                      </option>
                      {areaOfExpertise?.map((intrest) => (
                        <option
                          key={intrest.id}
                          value={`${intrest.name}`}
                          className="text-lg font-bold"
                        >
                          {intrest.name}
                        </option>
                      ))}
                    </select>
                    {errors.area_of_intrest && (
                      <span className="mt-1 text-sm text-red-500 font-bold">
                        {errors.area_of_intrest.message}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {step == 1 && (
              <div className="flex flex-col">
                <div className="flex-row w-full flex justify-start gap-4 items-center">
                  <div className="mb-3 ml-6 h-24 w-24 rounded-full border-2 border-gray-300 flex items-center justify-center overflow-hidden">
                    {isLoading ? (
                      <svg
                        width="35"
                        height="37"
                        viewBox="0 0 35 37"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="bg-no-repeat animate-pulse"
                      >
                        <path
                          d="M8.53049 8.62583C8.5304 13.3783 12.3575 17.2449 17.0605 17.2438C21.7634 17.2428 25.5907 13.3744 25.5908 8.62196C25.5909 3.8695 21.7638 0.00287764 17.0608 0.00394405C12.3579 0.00501045 8.53058 3.87336 8.53049 8.62583ZM32.2249 36.3959L34.1204 36.3954L34.1205 34.4799C34.1206 27.0878 28.1667 21.0724 20.8516 21.0741L13.2692 21.0758C5.95224 21.0775 -3.41468e-05 27.0955 -0.000176714 34.4876L-0.000213659 36.4032L32.2249 36.3959Z"
                          fill="#BBBBBB"
                        />
                      </svg>
                    ) : logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Logo"
                        className="h-full w-full object-cover"
                      />
                    ) : formData.logoData ? (
                      <img
                        src={formData?.logoData}
                        alt="User"
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

                  <input
                    id="logo"
                    type="file"
                    name="logo"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      addLogoHandler(file);
                    }}
                  />
                  <label
                    htmlFor="logo"
                    className="p-2 border-2 border-blue-800 items-center rounded-md text-md bg-transparent text-blue-800 cursor-pointer font-extrabold"
                  >
                    Upload Logo
                  </label>
                </div>
                {errors.logoData && (
                  <span className="mt-1 text-sm text-red-500 font-bold text-start px-4">
                    {errors.logoData.message}
                  </span>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-3 px-4">
                  <div className="z-0 w-full mb-3 group">
                    <label
                      htmlFor="registered"
                      className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                    >
                      Are you Registered ?*
                    </label>
                    <select
                      {...register("registered")}
                      className={`bg-gray-50 border-2 ${
                        errors.registered
                          ? "border-red-500 placeholder:text-red-500"
                          : "border-[#737373]"
                      } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                    >
                      <option className="text-lg font-bold" value="false">
                        No
                      </option>
                      <option className="text-lg font-bold" value="true">
                        Yes
                      </option>
                    </select>
                    {errors.registered && (
                      <p className="mt-1 text-sm text-red-500 font-bold text-left">
                        {errors.registered.message}
                      </p>
                    )}
                  </div>
                  {isRegistered && (
                    <div className="z-0 w-full mb-3 group">
                      <label
                        htmlFor="registered_country"
                        className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                      >
                        Registered Country*
                      </label>
                      <select
                        {...register("registered_country")}
                        className={`bg-gray-50 border-2 ${
                          errors.registered_country
                            ? "border-red-500 placeholder:text-red-500"
                            : "border-[#737373]"
                        } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                      >
                        <option className="text-lg font-bold" value="">
                          select your Registered Country
                        </option>
                        {countries?.map((expert) => (
                          <option
                            key={expert.name}
                            value={`${expert.name}`}
                            className="text-lg font-bold"
                          >
                            {expert.name}
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
                  <div className="z-0 w-full mb-3 group">
                    <label
                      htmlFor="preferred_icp_hub"
                      className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                    >
                      Preferred ICP Hub *
                    </label>
                    <select
                      {...register("preferred_icp_hub")}
                      className={`bg-gray-50 border-2 ${
                        errors.preferred_icp_hub
                          ? "border-red-500 placeholder:text-red-500"
                          : "border-[#737373]"
                      } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                    >
                      <option className="text-lg font-bold" value="">
                        Select ⌄
                      </option>
                      {getAllIcpHubs?.map((hub) => (
                        <option
                          key={hub.id}
                          value={`${hub.name} ,${hub.region}`}
                          className="text-lg font-bold"
                        >
                          {hub.name} , {hub.region}
                        </option>
                      ))}
                    </select>
                    {errors.preferred_icp_hub && (
                      <p className="mt-1 text-sm text-red-500 font-bold text-left">
                        {errors.preferred_icp_hub.message}
                      </p>
                    )}
                  </div>
                  <div className="z-0 w-full mb-3 group">
                    <label
                      htmlFor="existing_icp_investor"
                      className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                    >
                      Are you an existing ICP Investor ?*
                    </label>
                    <select
                      {...register("existing_icp_investor")}
                      className={`bg-gray-50 border-2 ${
                        errors.existing_icp_investor
                          ? "border-red-500 placeholder:text-red-500"
                          : "border-[#737373]"
                      } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                    >
                      <option className="text-lg font-bold" value="false">
                        No
                      </option>
                      <option className="text-lg font-bold" value="true">
                        Yes
                      </option>
                    </select>
                    {errors.existing_icp_investor && (
                      <p className="mt-1 text-sm text-red-500 font-bold text-left">
                        {errors.existing_icp_investor.message}
                      </p>
                    )}
                  </div>
                  {isExistingICPInvestor && (
                    <>
                      <div className="z-0 w-full mb-3 group">
                        <label
                          htmlFor="investor_type"
                          className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                        >
                          Type of investment*
                        </label>
                        <select
                          {...register("investor_type")}
                          className={`bg-gray-50 border-2 ${
                            errors.investor_type
                              ? "border-red-500 placeholder:text-red-500"
                              : "border-[#737373]"
                          } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                        >
                          <option className="text-lg font-bold" value="">
                            Select
                          </option>
                          <option className="text-lg font-bold" value="Direct">
                            Direct
                          </option>
                          <option className="text-lg font-bold" value="SNS">
                            SNS
                          </option>
                          <option className="text-lg font-bold" value="both">
                            both
                          </option>
                        </select>
                        {errors.investor_type && (
                          <p className="mt-1 text-sm text-red-500 font-bold text-left">
                            {errors.investor_type.message}
                          </p>
                        )}
                      </div>
                      <div className="z-0 w-full mb-3 group">
                        <label
                          htmlFor="money_invested"
                          className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                        >
                          How much money you invested ?
                        </label>
                        <input
                          type="number"
                          name="money_invested"
                          id="money_invested"
                          {...register("money_invested")}
                          className={`bg-gray-50 border-2 ${
                            errors.money_invested
                              ? "border-red-500 placeholder:text-red-500"
                              : "border-[#737373]"
                          } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                          placeholder="$"
                        />
                        {errors.money_invested && (
                          <p className="mt-1 text-sm text-red-500 font-bold text-left">
                            {errors.money_invested.message}
                          </p>
                        )}
                      </div>
                      <div className="z-0 w-full mb-3 group">
                        <label
                          htmlFor="existing_icp_portfolio"
                          className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                        >
                          Existing ICP Portfolio
                        </label>
                        <input
                          type="text"
                          name="existing_icp_portfolio"
                          id="existing_icp_portfolio"
                          {...register("existing_icp_portfolio")}
                          className={`bg-gray-50 border-2${
                            errors.existing_icp_portfolio
                              ? "border-red-500 placeholder:text-red-500"
                              : "border-[#737373]"
                          } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                        />
                        {errors.existing_icp_portfolio && (
                          <p className="mt-1 text-sm text-red-500 font-bold text-left">
                            {errors.existing_icp_portfolio.message}
                          </p>
                        )}
                      </div>
                    </>
                  )}
                  <div className="z-0 w-full mb-3 group">
                    <label
                      htmlFor="registered_under_any_hub"
                      className="block mb-2 text-lg font-medium text-gray-500 hover:text-black  truncate overflow-hidden text-start"
                    >
                      Are you an under any hub ?
                    </label>
                    <select
                      {...register("registered_under_any_hub")}
                      className={`bg-gray-50 border-2 ${
                        errors.registered_under_any_hub
                          ? "border-red-500 placeholder:text-red-500"
                          : "border-[#737373]"
                      } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                    >
                      <option className="text-lg font-bold" value="false">
                        No
                      </option>
                      <option className="text-lg font-bold" value="true">
                        Yes
                      </option>
                    </select>

                    {errors.registered_under_any_hub && (
                      <span className="mt-1 text-sm text-red-500 font-bold">
                        {errors.registered_under_any_hub.message}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {step == 2 && (
              <div className="flex flex-col">
                <div className="z-0 w-full mb-3 group px-4">
                  <label
                    htmlFor="reason_for_joining"
                    className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                  >
                    Why do you want to join ICP ?*
                  </label>
                  <select
                    {...register("reason_for_joining")}
                    className={`bg-gray-50 border-2 ${
                      errors.reason_for_joining
                        ? "border-red-500 placeholder:text-red-500"
                        : "border-[#737373]"
                    } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                  >
                    <option className="text-lg font-bold" value="">
                      Select reason ⌄
                    </option>
                    <option
                      className="text-lg font-bold"
                      value="listing_and_promotion"
                    >
                      Project listing and promotion
                    </option>
                    <option className="text-lg font-bold" value="Funding">
                      Funding
                    </option>
                    <option className="text-lg font-bold" value="Mentoring">
                      Mentoring
                    </option>
                    <option className="text-lg font-bold" value="Incubation">
                      Incubation
                    </option>
                    <option
                      className="text-lg font-bold"
                      value="Engaging_and_building_community"
                    >
                      Engaging and building community
                    </option>
                  </select>
                  {errors.reason_for_joining && (
                    <p className="mt-1 text-sm text-red-500 font-bold text-left">
                      {errors.reason_for_joining.message}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-3 px-4">
                  <div className="z-0 w-full mb-3 group">
                    <label
                      htmlFor="multi_chain"
                      className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                    >
                      Are you on multi-chain
                    </label>
                    <select
                      {...register("multi_chain")}
                      className={`bg-gray-50 border-2 ${
                        errors.multi_chain
                          ? "border-red-500 placeholder:text-red-500"
                          : "border-[#737373]"
                      } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                    >
                      <option className="text-lg font-bold" value="false">
                        No
                      </option>
                      <option className="text-lg font-bold" value="true">
                        Yes
                      </option>
                    </select>
                    {errors.multi_chain && (
                      <p className="mt-1 text-sm text-red-500 font-bold text-left">
                        {errors.multi_chain.message}
                      </p>
                    )}
                  </div>
                  <div className="z-0 w-full mb-3 group">
                    <label
                      htmlFor="project_on_multichain"
                      className="block mb-2 text-lg font-medium text-gray-500 hover:text-black hover:whitespace-normal truncate overflow-hidden text-start"
                    >
                      Multi-chain options
                    </label>
                    <select
                      {...register("project_on_multichain")}
                      className={`bg-gray-50 border-2 ${
                        errors.project_on_multichain
                          ? "border-red-500 placeholder:text-red-500"
                          : "border-[#737373]"
                      } text-gray-900 placeholder-gray-500 placeholder:font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                      disabled={!isMulti_Chain}
                    >
                      <option className="text-lg font-bold" value="">
                        Select ⌄
                      </option>
                      {multiChain?.map((chain, i) => (
                        <option
                          key={i}
                          value={`${chain}`}
                          className="text-lg font-bold"
                        >
                          {chain}
                        </option>
                      ))}
                    </select>
                    {errors.project_on_multichain && (
                      <p className="mt-1 text-sm text-red-500 font-bold text-left">
                        {errors.project_on_multichain.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          {StepComponent &&
            React.cloneElement(StepComponent, {
              onSubmit: handleSubmit(onSubmit),
              register,
              errors,
              fields: stepFields,
              goToPrevious: handlePrevious,
              goToNext: handleNext,
            })}
          <Toaster />
        </div>
      </section>
    </>
  );
};

export default InvestorRegistration;

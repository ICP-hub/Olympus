import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ThreeDots } from "react-loader-spinner";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useCountries } from "react-countries";
import { useSelector, useDispatch } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { allHubHandlerRequest } from "../../StateManagement/Redux/Reducers/All_IcpHubReducer";
import MentorSignup4 from "./MentorSignup4";
import MentorSignup1 from "./MentoSignup1";
import MentorSignup3 from "./MentorSignUp3";
import MentorSignup2 from "./MentorSignup2";

const MentorSignupMain = () => {
  const { countries } = useCountries();
  const dispatch = useDispatch();
  const actor = useSelector((state) => state.actors.actor);
  const areaOfExpertise = useSelector((state) => state.expertiseIn.expertise);
  const typeOfProfile = useSelector((state) => state.profileTypes.profiles);

  const userFullData = useSelector((state) => state.userData.data.Ok);
  const mentorFullData = useSelector((state) => state.mentorData.data[0]);
  const userCurrentRoleStatusActiveRole = useSelector(
    (state) => state.currentRoleStatus.activeRole
  );

  // STATES
  const [imagePreview, setImagePreview] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [editMode, setEditMode] = useState(null);
  const [index, setIndex] = useState(0);

  const [interestedDomainsOptions, setInterestedDomainsOptions] = useState([]);
  const [interestedDomainsSelectedOptions, setInterestedDomainsSelectedOptions] = useState([]);
  const [typeOfProfileOptions, setTypeOfProfileOptions] = useState([]);
  const [reasonOfJoiningSelectedOptions, setReasonOfJoiningSelectedOptions] = useState([]);
  const [multiChainOptions, setMultiChainOptions] = useState([]);
  const [multiChainSelectedOptions, setMultiChainSelectedOptions] = useState([]);
  const [categoryOfMentoringServiceSelectedOptions, setCategoryOfMentoringServiceSelectedOptions] = useState([]);
  const getAllIcpHubs = useSelector((currState) => currState.hubs.allHubs);
  const multiChainNames = useSelector((currState) => currState.chains.chains);
  const reasonOfJoiningOptions = [
    { value: "listing_and_promotion", label: "Project listing and promotion" },
    { value: "Funding", label: "Funding" },
    { value: "Mentoring", label: "Mentoring" },
    { value: "Incubation", label: "Incubation" },
    { value: "Engaging_and_building_community", label: "Engaging and building community" },
    { value: "Jobs", label: "Jobs" },
  ];

  const categoryOfMentoringServiceOptions = [
    { value: "Incubation", label: "Incubation" },
    { value: "Tokenomics", label: "Tokenomics" },
    { value: "Branding", label: "Branding" },
    { value: "Listing", label: "Listing" },
    { value: "Raise", label: "Raise" },
  ];

  // Validation Schema
  const validationSchema = yup.object().shape({
    full_name: yup.string().required("Full name is required"),
    email: yup.string().email("Invalid email").nullable(true).optional(),
    telegram_id: yup.string().nullable(true).optional().url("Invalid url"),
    twitter_url: yup.string().nullable(true).optional().url("Invalid url"),
    openchat_user_name: yup
      .string()
      .nullable(true)
      .test("is-valid-username", "Username must be between 5 and 20 characters, and cannot start or contain spaces", (value) => {
        if (!value) return true;
        const isValidLength = value.length >= 5 && value.length <= 20;
        const hasNoSpaces = !/\s/.test(value) && !value.startsWith(" ");
        return isValidLength && hasNoSpaces;
      }),
    bio: yup
      .string()
      .optional()
      .test("maxWords", "Bio must not exceed 50 words", (value) => !value || value.trim().split(/\s+/).filter(Boolean).length <= 50)
      .test("no-leading-spaces", "Bio should not have leading spaces", (value) => !value || value.trimStart() === value)
      .test("maxChars", "Bio must not exceed 500 characters", (value) => !value || value.length <= 500),
    country: yup.string().required("Country is required"),
    domains_interested_in: yup.string().required("Selecting an interest is required"),
    type_of_profile: yup.string().required("Type of profile is required"),
    reasons_to_join_platform: yup.string().required("Selecting a reason is required"),
    image: yup.mixed().nullable(true).test("fileSize", "File size max 10MB allowed", (value) => !value || (value && value.size <= 10 * 1024 * 1024)).test("fileType", "Only jpeg, jpg & png file format allowed", (value) => !value || (value && ["image/jpeg", "image/jpg", "image/png"].includes(value.type))),
    preferred_icp_hub: yup.string().required("ICP Hub selection is required"),
    multi_chain: yup.string().required("Required").oneOf(["true", "false"], "Invalid value"),
    multi_chain_names: yup.string().when("multi_chain", (val, schema) => (val && val[0] === "true" ? schema.required("At least one chain name required") : schema)),
    category_of_mentoring_service: yup.string().required("Selecting a service is required"),
    icp_hub_or_spoke: yup.string().required("Required").oneOf(["true", "false"], "Invalid value"),
    hub_owner: yup.string().when("icp_hub_or_spoke", (val, schema) => (val && val[0] === "true" ? schema.required("ICP Hub selection is required") : schema)),
    mentor_website_url: yup.string().nullable(true).optional().url("Invalid url"),
    years_of_mentoring: yup.number().typeError("You must enter a number").positive("Must be a positive number").required("Years of experience mentoring startups is required"),
    mentor_linkedin_url: yup.string().url("Invalid url").required("LinkedIn url is required"),
  });

  const methods = useForm({
    resolver: yupResolver(validationSchema),
    mode: "all",
  });

  const { handleSubmit, trigger, setValue, clearErrors, setError, watch } = methods;

  const formFields = {
    // 0: ["full_name", "email", "telegram_id", "twitter_id", "openchat_user_name"],
    // 1: ["bio", "country", "domains_interested_in", "type_of_profile", "reasons_to_join_platform"],
    0: ["preferred_icp_hub", "category_of_mentoring_service", "multi_chain", "multi_chain_names"],
    1: ["icp_hub_or_spoke", "hub_owner", "mentor_website_url", "years_of_mentoring", "mentor_linkedin_url"],
  };

  const handleNext = async () => {
    const isValid = await trigger(formFields[index]);
    if (isValid) {
      setIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handleBack = () => {
    if (index > 0) {
      setIndex((prevIndex) => prevIndex - 1);
    }
  };

  const renderComponent = () => {
    switch (index) {
      case 0:
        return <MentorSignup3 />;
      case 1:
        return (
          // <MentorSignup2
          //   countries={countries}
          //   typeOfProfileOptions={typeOfProfile.map(type => ({ value: type.role_type.toLowerCase(), label: type.role_type }))}
          //   reasonOfJoiningOptions={reasonOfJoiningOptions}
          //   interestedDomainsOptions={areaOfExpertise.map(expert => ({ value: expert.name, label: expert.name }))}
          //   interestedDomainsSelectedOptions={interestedDomainsSelectedOptions}
          //   setInterestedDomainsSelectedOptions={setInterestedDomainsSelectedOptions}
          //   reasonOfJoiningSelectedOptions={reasonOfJoiningSelectedOptions}
          //   setReasonOfJoiningSelectedOptions={setReasonOfJoiningSelectedOptions}
          //   clearErrors={clearErrors}
          //   setValue={setValue}
          //   setError={setError}
          // />
          <MentorSignup4  />
        );
      // case 2:
      //   return (
      //     <MentorSignup3
      //       clearErrors={clearErrors}
      //       setValue={setValue}
      //       setError={setError}
      //     />
      //   );
      // case 3:
      //   return <MentorSignup4  />;
      default:
        return <MentorSignup3 />;
    }
  };

  

  useEffect(() => {
    dispatch(allHubHandlerRequest());
  }, [actor, dispatch]);

  useEffect(() => {
    if (areaOfExpertise) {
      setInterestedDomainsOptions(areaOfExpertise.map((expert) => ({ value: expert.name, label: expert.name })));
    } else {
      setInterestedDomainsOptions([]);
    }
  }, [areaOfExpertise]);

  useEffect(() => {
    if (typeOfProfile) {
      setTypeOfProfileOptions(typeOfProfile.map((type) => ({ value: type.role_type.toLowerCase(), label: type.role_type })));
    } else {
      setTypeOfProfileOptions([]);
    }
  }, [typeOfProfile]);

  useEffect(() => {
    if (multiChainNames) {
      setMultiChainOptions(multiChainNames.map((chain) => ({ value: chain, label: chain })));
    } else {
      setMultiChainOptions([]);
    }
  }, [multiChainNames]);

  useEffect(() => {
    dispatch(allHubHandlerRequest());
  }, [dispatch]);

  const onSubmitHandler = async (data) => {
    // Process form data submission
  };

  const onErrorHandler = (errors) => {
    toast.error("Empty fields or invalid values, please recheck the form");
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-lg w-[500px] p-6 pt-4 overflow-y-auto">
          <h2 className="text-xs text-[#364152] mb-3">Step {index + 1} of 2</h2>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmitHandler, onErrorHandler)}>
              {renderComponent()}
              <div className={`flex mt-4 ${index === 0 ? "justify-end" : "justify-between"}`}>
                {index > 0 && (
                  <button
                    type="button"
                    className="py-2 px-4 text-gray-600 rounded hover:text-black"
                    onClick={handleBack}
                  >
                    Back
                  </button>
                )}
                {index === 3 ? (
                  <button
                    type="submit"
                    className="py-2 px-4 bg-[#D1E0FF] text-white rounded hover:bg-blue-600 border-2 border-[#B2CCFF]"
                  >
                    {isSubmitting ? (
                      <ThreeDots
                        visible={true}
                        height="35"
                        width="35"
                        color="#FFFEFF"
                        radius="9"
                        ariaLabel="three-dots-loading"
                      />
                    ) : (
                      "Submit"
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="py-2 px-4 bg-[#D1E0FF] text-white rounded hover:bg-blue-600 border-2 border-[#B2CCFF] flex items-center"
                    onClick={handleNext}
                  >
                    Continue
                    <ArrowForwardIcon fontSize="medium" className="ml-2" />
                  </button>
                )}
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default MentorSignupMain;

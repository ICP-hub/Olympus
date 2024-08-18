import React, { useState, useEffect } from "react";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ProjectRegister1 from "./ProjectRegister1";
import ProjectRegister2 from "./ProjectRegister2";
import ProjectRegister3 from "./ProjectRegister3";
import ProjectRegister4 from "./ProjectRegister4";
import ProjectRegister5 from "./ProjectRegister5";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { useNavigate } from "react-router-dom";

import {
  useForm,
  Controller,
  FormProvider,
  useFieldArray,
} from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";

// import DetailHeroSection from "../Common/DetailHeroSection";
import { ThreeDots } from "react-loader-spinner";
import { validationSchema } from "./projectValidation";

import { Principal } from "@dfinity/principal";
import { allHubHandlerRequest } from "../../StateManagement/Redux/Reducers/All_IcpHubReducer";
import ProjectRegister6 from "./ProjectRegister6";

const ProjectRegisterMain = ({isopen }) => {
  const dispatch = useDispatch();
  const actor = useSelector((currState) => currState.actors.actor);
  const areaOfExpertise = useSelector(
    (currState) => currState.expertiseIn.expertise
  );
  const typeOfProfile = useSelector(
    (currState) => currState.profileTypes.profiles
  );

  const multiChainNames = useSelector((currState) => currState.chains.chains);

  const userFullData = useSelector((currState) => currState.userData.data.Ok);
  const projectFullData = useSelector(
    (currState) => currState.projectData.data
  );
  // console.log("projectFullData in projectRejForm ===>", projectFullData);
  const userCurrentRoleStatusActiveRole = useSelector(
    (currState) => currState.currentRoleStatus.activeRole
  );
  // STATES

  // user image states
  const [imagePreview, setImagePreview] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoData, setLogoData] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [coverData, setCoverData] = useState(null);
  const [editMode, setEditMode] = useState(null);

  // default & static options states
  const [interestedDomainsOptions, setInterestedDomainsOptions] = useState([]);
  const [
    interestedDomainsSelectedOptions,
    setInterestedDomainsSelectedOptions,
  ] = useState([]);
  const [typeOfProfileOptions, setTypeOfProfileOptions] = useState([]);

  const [reasonOfJoiningOptions, setReasonOfJoiningOptions] = useState([
    { value: "listing_and_promotion", label: "Project listing and promotion" },
    { value: "Funding", label: "Funding" },
    { value: "Mentoring", label: "Mentoring" },
    { value: "Incubation", label: "Incubation" },
    {
      value: "Engaging_and_building_community",
      label: "Engaging and building community",
    },
    { value: "Jobs", label: "Jobs" },
  ]);
  const [reasonOfJoiningSelectedOptions, setReasonOfJoiningSelectedOptions] =
    useState([]);
  // Mentor from states
  const [multiChainOptions, setMultiChainOptions] = useState([]);
  const [multiChainSelectedOptions, setMultiChainSelectedOptions] = useState(
    []
  );
  

  const methods = useForm({
    resolver: yupResolver(validationSchema),
    mode: "all",
    defaultValues: {
      upload_public_documents: "false",
      publicDocs: [],
      upload_private_documents: "false",
      privateDocs: [],
      weekly_active_users: 0,
      revenue: 0,
      money_raised_till_now: "false",
      icp_grants: 0,
      investors: 0,
      raised_from_other_ecosystem: 0,
    },
  });
  const {
    handleSubmit,
    getValues,
    trigger,
    formState: { isSubmitting },
  } = methods;

 
  
  // form submit handler func
  const onSubmitHandler = async (data) => {
    console.log("data", data);
    if (actor) {
      const projectData = {
        // project data
        project_cover: coverData ? [coverData] : [],
        project_logo: logoData ? [logoData] : [],
        preferred_icp_hub: [data?.preferred_icp_hub ?? ""],
        project_name: data?.project_name ?? "",
        project_description: [data?.project_description ?? ""],
        project_elevator_pitch: [data?.project_elevator_pitch ?? ""],
        project_website: [data?.project_website ?? ""],
        is_your_project_registered: [
          data?.is_your_project_registered === "true" ? true : false,
        ],
        type_of_registration: [
          data?.is_your_project_registered === "true" &&
          data?.type_of_registration
            ? data?.type_of_registration
            : "",
        ],
        country_of_registration: [
          data?.is_your_project_registered === "true" &&
          data?.country_of_registration
            ? data?.country_of_registration
            : "",
        ],
        live_on_icp_mainnet: [
          data?.live_on_icp_mainnet === "true" ? true : false,
        ],
        dapp_link: [
          data?.live_on_icp_mainnet === "true" && data?.dapp_link
            ? data?.dapp_link.toString()
            : "",
        ],
        weekly_active_users: [
          data?.live_on_icp_mainnet === "true" && data?.weekly_active_users
            ? data?.weekly_active_users
            : 0,
        ],
        revenue: [
          data?.live_on_icp_mainnet === "true" && data?.revenue
            ? data?.revenue
            : 0,
        ],
        supports_multichain: [
          data?.multi_chain === "true" && data?.multi_chain_names
            ? data?.multi_chain_names
            : "",
        ],
        money_raised_till_now: [
          data?.money_raised_till_now === "true" ? true : false,
        ],
        money_raising: [data?.money_raising === "true" ? true : false],
        money_raised: [
          {
            icp_grants: [
              data?.money_raised_till_now === "true" && data?.icp_grants
                ? data?.icp_grants.toString()
                : "",
            ],
            investors: [
              data?.money_raised_till_now === "true" && data?.investors
                ? data?.investors.toString()
                : "",
            ],
            raised_from_other_ecosystem: [
              data?.money_raised_till_now === "true" &&
              data?.raised_from_other_ecosystem
                ? data?.raised_from_other_ecosystem.toString()
                : "",
            ],
            sns: [
              data?.money_raising === "true" && data?.valuation
                ? data?.valuation.toString()
                : "",
            ],
            target_amount:
              data?.money_raising === "true" && data?.target_amount
                ? [data?.target_amount]
                : [],
          },
        ],
        promotional_video: [data?.promotional_video ?? ""],
        links: data?.links
          ? [data.links.map((val) => ({ link: val?.link ? [val.link] : [] }))]
          : [],
        token_economics: [data?.token_economics ?? ""],
        long_term_goals: [data?.white_paper ?? ""],
        private_docs:
          data?.upload_private_documents === "true" ? [data?.privateDocs] : [],
        public_docs:
          data?.upload_public_documents === "true" ? [data?.publicDocs] : [],
        upload_private_documents: [
          data?.upload_private_documents === "true" ? true : false,
        ],

        project_area_of_focus: "",
        reason_to_join_incubator:
          data?.reasons_to_join_platform &&
          data?.reasons_to_join_platform.length > 0
            ? data?.reasons_to_join_platform.join(", ")
            : "",
        vc_assigned: [],
        mentors_assigned: [],
        project_team: [],
        project_twitter: [""],
        target_market: [""],
        technical_docs: [""],
        self_rating_of_project: 0,
      };

      console.log("projectData ==>", projectData);
      console.log("projectData ==>", logoData);

      await actor
        .register_project(projectData)
        .then((result) => {
          if (result) {
            toast.success("Project Created Successfully");
          } else {
            toast.error(result);
          }
        })
        .catch((error) => {
          toast.error(`Error: ${error.message}`);
        });
    } else {
      toast.error("Please signup with internet identity first");
      window.location.href = "/";
    }
  };

  // form error handler func
  const onErrorHandler = (val) => {
    console.log("error", val);
    toast.error("Empty fields or invalid values, please recheck the form");
  };

  // default interests set function
  const setInterestedDomainsSelectedOptionsHandler = (val) => {
    setInterestedDomainsSelectedOptions(
      val
        ? val
          .split(", ")
          .map((interest) => ({ value: interest, label: interest }))
        : []
    );
  };

  // default reasons set function
  const setReasonOfJoiningSelectedOptionsHandler = (val) => {
    setReasonOfJoiningSelectedOptions(
      val && val.length > 0 && val[0].length > 0
        ? val[0].map((reason) => ({ value: reason, label: reason }))
        : []
    );
  };
  const setMultiChainSelectedOptionsHandler = (val) => {
    setMultiChainSelectedOptions(
      val
        ? val?.[0].split(", ").map((chain) => ({ value: chain, label: chain }))
        : []
    );
  };

  
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

  useEffect(() => {
    if (typeOfProfile) {
      setTypeOfProfileOptions(
        typeOfProfile.map((type) => ({
          value: type.role_type.toLowerCase(),
          label: type.role_type,
        }))
      );
    } else {
      setTypeOfProfileOptions([]);
    }
  }, [typeOfProfile]);

  // Mentor form states
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
    dispatch(allHubHandlerRequest());
  }, [actor, dispatch]);

  const [index, setIndex] = useState(0);
  const handleNext = async () => {
    const isValid = await trigger(formFields[index]);
    if (isValid) {
      console.log("Current Form Data:", getValues(formFields[index]));
      setIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handleBack = () => {
    if (index > 0) {
      setIndex((prevIndex) => prevIndex - 1);
    }
  };
  const renderComponent = () => {
    let component;
    switch (index) {
      case 0:
        component = <ProjectRegister1 modalOpen={modalOpen} />;
        break;
      case 1:
        component = <ProjectRegister2 />;
        break;
      case 2:
        component = <ProjectRegister3 />;
        break;
      case 3:
        component = <ProjectRegister4 />;
        break;
      case 4:
        component = <ProjectRegister5 />;
        break;
      case 5:
        component = <ProjectRegister6 />;
        break;
      default:
        component = <ProjectRegister1 />;
    }

    return component;
  };
  const formFields = {
    0: ["logo", "preferred_icp_hub", "project_name", "project_elevator_pitch"],
    1: [
      "cover",
      "project_website",
      "is_your_project_registered",
      "type_of_registration",
      "country_of_registration",
    ],
    2: [
      "supports_multichain",
      "multi_chain_names",
      "live_on_icp_mainnet",
      "dapp_link",
      "weekly_active_users",
      "revenue",
    ],
    3: [
      "money_raised_till_now",
      "icp_grants",
      "investors",
      "raised_from_other_ecosystem",
      "valuation",
      "target_amount",
    ],
    4: ["promotional_video", "links", "token_economics"],
    5: ["project_description"],
  };
  const [modalOpen, setModalOpen] = useState(isopen || true);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${
        modalOpen ? "block" : "hidden"
      }`}
    >
      <div className="bg-white rounded-lg shadow-lg w-[500px] p-6 pt-4 overflow-y-auto">
        <div className="flex justify-endz mr-4">
          <button
            className="text-2xl text-[#121926]"
            onClick={() => setModalOpen(!modalOpen)}
          >
            &times;
          </button>
        </div>
        <h2 className="text-xs text-[#364152] mb-3">Step {index + 1} of 6</h2>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmitHandler, onErrorHandler)}>
            {renderComponent()}
            <div
              className={`flex mt-4 ${
                index === 0 ? "justify-end" : "justify-between"
              }`}
            >
              {index > 0 && (
                <button
                  type="button"
                  className="py-2 px-4 text-gray-600 rounded border border-[#CDD5DF] hover:text-black"
                  onClick={handleBack}
                  disabled={index === 0}
                >
                  <ArrowBackIcon fontSize="medium" /> Back
                </button>
              )}
              {index === 5 ? (
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
                      wrapperStyle={{}}
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
  );
};

export default ProjectRegisterMain;

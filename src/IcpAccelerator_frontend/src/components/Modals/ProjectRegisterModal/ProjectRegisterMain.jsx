import React, { useState } from "react";
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
import { useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import { ThreeDots } from "react-loader-spinner";
import { validationSchema } from "./projectValidation";
import ProjectRegister6 from "./ProjectRegister6";

const ProjectRegisterMain = ({ isopen }) => {
  const actor = useSelector((currState) => currState.actors.actor);
  const [index, setIndex] = useState(0); // TRACKS THE CURRENT FORM PAGE
  const [logoData, setLogoData] = useState(null); // STORES LOGO FILE DATA
  const [coverData, setCoverData] = useState(null); // STORES COVER IMAGE FILE DATA
  const [isSubmitting, setSubmitting] = useState(false); // TRACKS SUBMISSION STATE
  const [modalOpen, setModalOpen] = useState(isopen || true); // TRACKS MODAL OPEN/CLOSE STATE
  const [formData, setFormData] = useState({}); // STORES ACCUMULATED FORM DATA

  // INITIALIZE REACT HOOK FORM WITH VALIDATION SCHEMA
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

  const { handleSubmit, trigger, getValues } = methods;

  // MAP FORM FIELDS TO DIFFERENT STEPS
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
    4: ["promotional_video", "token_economics", "links"],
    5: ["project_description"],
  };

  // HANDLE FORM VALIDATION ERROR
  const onErrorHandler = (val) => {
    console.log("error", val);
    toast.error("Empty fields or invalid values, please recheck the form");
  };

  // HANDLE NEXT BUTTON CLICK
  const handleNext = async () => {
    const isValid = await trigger(formFields[index]); // VALIDATE CURRENT STEP
    console.log('isValid', isValid)
    if (isValid) {
      setFormData((prevData) => ({
        ...prevData,
        ...getValues(), // MERGE CURRENT STEP DATA WITH PREVIOUS DATA
      }));
      setIndex((prevIndex) => prevIndex + 1); // GO TO NEXT STEP
    }
  };

  // HANDLE BACK BUTTON CLICK
  const handleBack = () => {
    if (index > 0) {
      setIndex((prevIndex) => prevIndex - 1); // GO TO PREVIOUS STEP
    }
  };

  // RENDER COMPONENT BASED ON CURRENT STEP
  const renderComponent = () => {
    let component;
    switch (index) {
      case 0:
        component = (
          <ProjectRegister1 formData={formData} setFormData={setFormData} />
        );
        break;
      case 1:
        component = (
          <ProjectRegister2 formData={formData} setFormData={setFormData} />
        );
        break;
      case 2:
        component = (
          <ProjectRegister3 formData={formData} setFormData={setFormData} />
        );
        break;
      case 3:
        component = (
          <ProjectRegister4 formData={formData} setFormData={setFormData} />
        );
        break;
      case 4:
        component = (
          <ProjectRegister5 formData={formData} setFormData={setFormData} />
        );
        break;
      case 5:
        component = (
          <ProjectRegister6 formData={formData} setFormData={setFormData} />
        );
        break;
      default:
        component = <ProjectRegister1 />;
    }

    return component;
  };

  // HANDLE FORM SUBMISSION
  const onSubmitHandler = async (data) => {
    if (actor) {
      const projectData = {
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
      console.log("projectData", projectData);
      try {
        setSubmitting(true); // START SUBMISSION
        const result = await actor.register_project(projectData); // SUBMIT FORM DATA
        console.log("result", result);
        if (
          result.startsWith(
            "You can't create more than one project" ||
            "You are not eligible for this role because you have 2 or more roles" ||
            "Cannot set private documents unless upload private docs has been set to true"
          )
        ) {
          toast.success(result); // Show success toast with the returned message
        } else {
          toast.error(result); // Show error toast with the returned message
        }
      } catch (error) {
        toast.error(`Error: ${error.message}`);
      } finally {
        setSubmitting(false); // END SUBMISSION
      }
    } else {
      toast.error("Please signup with internet identity first");
      window.location.href = "/";
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${modalOpen ? "block" : "hidden"
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
              className={`flex mt-4 ${index === 0 ? "justify-end" : "justify-between"
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
                  disabled={isSubmitting} // DISABLE BUTTON WHILE SUBMITTING
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

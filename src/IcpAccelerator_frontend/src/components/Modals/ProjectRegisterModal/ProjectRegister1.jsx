import React, { useState, useEffect } from "react"; // IMPORTING REACT HOOKS
import ControlPointIcon from "@mui/icons-material/ControlPoint"; // IMPORTING ICON COMPONENT FROM MUI
import { useFormContext, Controller } from "react-hook-form"; // IMPORTING FUNCTIONS AND CONTROLLER FROM REACT-HOOK-FORM
import CompressedImage from "../../../components/ImageCompressed/CompressedImage"; // IMPORTING IMAGE COMPRESSION COMPONENT
import { useSelector, useDispatch } from "react-redux"; // IMPORTING REDUX HOOKS FOR STATE MANAGEMENT
import { allHubHandlerRequest } from "../../StateManagement/Redux/Reducers/All_IcpHubReducer"; // IMPORTING REDUX ACTION FOR FETCHING ICP HUB DATA

const ProjectRegister1 = ({ formData,setFormData,logoData,setLogoData }) => { // MAIN COMPONENT FUNCTION
  console.log("formData", formData);
  const {
    register,
    formState: { errors },
    trigger,
    setError,
    clearErrors,
    setValue,
    getValues,
    control,
  } = useFormContext(); // DESTRUCTURING REACT-HOOK-FORM METHODS FOR FORM HANDLING

  const getAllIcpHubs = useSelector((currState) => currState.hubs.allHubs); // SELECTING ICP HUBS DATA FROM REDUX STORE
  const dispatch = useDispatch(); // INITIALIZING DISPATCH FUNCTION FOR REDUX ACTIONS
  const [logoPreview, setLogoPreview] = useState(null); // STATE TO HOLD LOGO PREVIEW IMAGE URL

  useEffect(() => {
    // USE EFFECT HOOK TO SET FORM FIELDS WITH EXISTING FORM DATA ON COMPONENT MOUNT
    if (formData) {
      if (formData?.logo) {
        // IF LOGO IS AVAILABLE IN FORM DATA, SET LOGO PREVIEW AND LOGO DATA
        setLogoPreview(URL.createObjectURL(formData?.logo));
        setLogoData(formData?.logo);
      }
    }
  }, [formData]); // DEPENDENCY ARRAY LISTENING FOR CHANGES IN formData

  const logoCreationFunc = async (file) => {
    // FUNCTION TO HANDLE LOGO CREATION, INCLUDING COMPRESSION AND CONVERSION TO UINT8ARRAY
    const result = await trigger("logo"); // TRIGGERING VALIDATION FOR LOGO FIELD
    if (result) {
      try {
        const compressedFile = await CompressedImage(file); // COMPRESSING IMAGE
        const reader = new FileReader(); // INITIALIZING FILE READER TO PREVIEW IMAGE
        reader.onloadend = () => {
          setLogoPreview(reader.result); // SETTING LOGO PREVIEW
        };
        reader.onerror = (error) => {
          console.error("FileReader error: ", error); // HANDLING FILE READER ERROR
          setError("logo", {
            type: "manual",
            message: "Failed to load the compressed logo.", // SETTING ERROR MESSAGE FOR LOGO
          });
        };
        reader.readAsDataURL(compressedFile); // READING COMPRESSED IMAGE AS DATA URL

        const byteArray = new Uint8Array(await compressedFile.arrayBuffer()); // CONVERTING COMPRESSED IMAGE TO UINT8ARRAY
        setLogoData(byteArray); // SETTING LOGO DATA
      } catch (error) {
        setError("logo", {
          type: "manual",
          message: "Could not process logo, please try another.", // HANDLING IMAGE COMPRESSION ERROR
        });
      }
    } else {
      console.log("ERROR--logoCreationFunc-file", file); // LOGGING ERROR IF VALIDATION FAILS
    }
  };

  const clearLogoFunc = (value) => {
    // FUNCTION TO CLEAR LOGO DATA AND PREVIEW
    let fields_id = value;
    setValue(fields_id, null); // RESETTING FORM VALUE FOR LOGO FIELD
    clearErrors(fields_id); // CLEARING ERRORS FOR LOGO FIELD
    setLogoData(null); // RESETTING LOGO DATA
    setLogoPreview(null); // RESETTING LOGO PREVIEW
  };

  useEffect(() => {
    dispatch(allHubHandlerRequest()); // DISPATCHING ACTION TO FETCH ALL ICP HUBS
  }, [dispatch]); // DEPENDENCY ARRAY LISTENING FOR CHANGES IN DISPATCH

  return (
    <>
      <h1 className="text-3xl text-[#121926] font-bold mb-3">
        Create a project
      </h1>
      {/* HEADING FOR THE PROJECT REGISTRATION FORM */}
      <div className="mb-2">
        <label className="block mb-1">
          Upload a logo
          {/* <span className="text-red-500">*</span> */}
        </label>
        {/* LABEL FOR LOGO UPLOAD FIELD */}
        <div className="flex gap-2 mb-3 ">
          <div className=" h-24 w-24 rounded-2xl border-2 border-dashed border-gray-300 items-center justify-center overflow-hidden flex  ">
            {logoPreview && !errors.logo ? (
              <img
                src={logoPreview}
                alt="Logo"
                className="h-full w-full object-cover"
                loading="lazy"
                draggable={false}
              />
              // DISPLAYING LOGO PREVIEW IF LOGO DATA EXISTS
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
              // DISPLAYING DEFAULT SVG IF NO LOGO DATA EXISTS
            )}
          </div>
          <div className="flex gap-1 items-center justify-center">
            <Controller
              name="logo"
              control={control}
              defaultValue=''
              render={({ field }) => (
                <>
                  <input
                    type="file"
                    className="hidden"
                    id="logo"
                    name="logo"
                    onChange={(e) => {
                      field.onChange(e.target.files[0]);
                      logoCreationFunc(e.target.files[0]);
                    }}
                    accept=".jpg, .jpeg, .png"
                  />
                  {/* INPUT FOR LOGO FILE UPLOAD */}
                  <label
                    htmlFor="logo"
                    className=" font-medium text-gray-700 border border-[#CDD5DF] px-4 py-1 cursor-pointer rounded  "
                  >
                    <ControlPointIcon
                      fontSize="small"
                      className="items-center -mt-1 mr-2"
                    />
                    {logoPreview && !errors.logo ? "Change logo" : "Upload"}
                    {/* BUTTON TO UPLOAD OR CHANGE LOGO */}
                  </label>
                  {logoPreview || errors.logo ? (
                    <button
                      className="font-medium px-4 py-1 cursor-pointer rounded border border-red-500 items-center text-md bg-transparent text-red-500  capitalize ml-1 sm0:ml-0"
                      onClick={() => clearLogoFunc("logo")}
                    >
                      clear
                      {/* BUTTON TO CLEAR LOGO DATA */}
                    </button>
                  ) : (
                    ""
                  )}
                </>
              )}
            />
          </div>
        </div>
      </div>
      {errors.logo && (
        <span className="mt-1 text-sm text-red-500 font-bold text-start px-4">
          {errors?.logo?.message}
        </span>
        // DISPLAYING LOGO FIELD ERROR MESSAGE IF ANY
      )}

      <div className="mb-2 ">
        <label className="block mb-1">
          Preferred ICP Hub you would like to be associated with
          <span className="text-red-500">*</span>
        </label>
        {/* LABEL FOR PREFERRED ICP HUB DROPDOWN */}
        <select
          {...register("preferred_icp_hub")}
          defaultValue={getValues("preferred_icp_hub")}
          className={`border border-[#CDD5DF] rounded-md shadow-sm ${errors.preferred_icp_hub ? "border-red-500 " : "border-[#737373]"
            } text-gray-900 placeholder-gray-500  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
        >
          <option className="text-lg font-bold" value="">
            Select your ICP Hub
          </option>
          {/* DEFAULT OPTION FOR ICP HUB SELECTION */}
          {getAllIcpHubs?.map((hub) => (
            <option
              key={hub.id}
              value={`${hub.name} ,${hub.region}`}
              className="text-lg font-normal "
              defaultValue=''
            >
              {hub.name}, {hub.region}
              {/* POPULATING ICP HUB OPTIONS DYNAMICALLY */}
            </option>
          ))}
        </select>
        {errors.preferred_icp_hub && (
          <p className="mt-1 text-sm text-red-500 font-bold text-left">
            {errors.preferred_icp_hub.message}
          </p>
          // DISPLAYING ERROR MESSAGE FOR PREFERRED ICP HUB FIELD IF ANY
        )}
      </div>
      <div className="mb-2">
        <label className="block mb-1">
          Project Name<span className="text-red-500">*</span>
        </label>
        {/* LABEL FOR PROJECT NAME INPUT FIELD */}

        <input
          type="text"
          {...register("project_name")}
          defaultValue=''
          className={`border border-[#CDD5DF] rounded-md shadow-sm 
                                             ${errors?.project_name
              ? "border-red-500 "
              : "border-[#737373]"
            } text-gray-900 placeholder-gray-500  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
          placeholder="Enter your Project name"
        />
        {errors?.project_name && (
          <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
            {errors?.project_name?.message}
          </span>
          // DISPLAYING ERROR MESSAGE FOR PROJECT NAME FIELD IF ANY
        )}
      </div>

      <div className="mb-2">
        <label className="block mb-1">
          Project pitch deck
        </label>
        {/* LABEL FOR PROJECT PITCH DECK INPUT FIELD */}

        <input
          type="text"
          {...register("project_elevator_pitch")}
          defaultValue=''
          className={`border border-[#CDD5DF] rounded-md shadow-sm 
                                             ${errors?.project_elevator_pitch
              ? "border-red-500 "
              : "border-[#737373]"
            } text-gray-900 placeholder-gray-500  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
          placeholder="https://"
        />
        {errors?.project_elevator_pitch && (
          <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
            {errors?.project_elevator_pitch?.message}
          </span>
          // DISPLAYING ERROR MESSAGE FOR PROJECT PITCH DECK FIELD IF ANY
        )}
      </div>
    </>
  );
};

export default ProjectRegister1;

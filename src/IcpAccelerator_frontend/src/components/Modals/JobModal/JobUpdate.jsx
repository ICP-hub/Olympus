import React, { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast, Toaster } from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { ThreeDots } from "react-loader-spinner";
import Select from "react-select";
import { jobCategoryHandlerRequest } from "../../../components/StateManagement/Redux/Reducers/getJobCategory";
import { Controller } from "react-hook-form";
import ReactQuill from "react-quill"; // IMPORT REACT QUILL FOR RICH TEXT EDITING
import "react-quill/dist/quill.snow.css";
const schema = yup
  .object({
    jobTitle: yup
      .string()
      .required("Job Title is required")
      .min(5, "Title must be at least 5 characters")
      .test(
        "no-leading-spaces",
        "Job Title should not have leading spaces",
        (value) => !value || value.trimStart() === value
      ),
    jobLocation: yup
      .object()
      .shape({
        label: yup.string().required("Location is required"),
        value: yup.string().required("Location is required"),
      })
      .nullable()
      .required("Job Location is required"),
    job_type: yup
      .object()
      .shape({
        value: yup.string().required("Job Type is required"),
        label: yup.string().required("Job Type is required"),
      })
      .nullable()
      .required("Job Type is required"),
    jobLink: yup
      .string()
      .url("Invalid website URL")
      .test("is-non-empty", "website URL is required", (value) =>
        /\S/.test(value)
      ),
    jobCategory: yup
      .string()
      .test("is-non-empty", "Category are required", (value) =>
        /\S/.test(value)
      ),
    jobDescription: yup
      .string()
      .required("Job Description is required")
      .test(
        "maxWords",
        "Job description must not exceed 50 words",
        (value) =>
          !value || value.trim().split(/\s+/).filter(Boolean).length <= 50
      )
      .test(
        "maxChars",
        "Job description must not exceed 500 characters",
        (value) => !value || value.length <= 500
      )
      .test(
        "no-leading-spaces",
        "Job description should not have leading spaces",
        (value) => !value || value.trimStart() === value
      ),
  })
  .required();
const JobUpdate = ({
  onJobsClose,
  onSubmitHandler,
  isSubmitting,
  jobtitle,
  jobbutton,
  isJobsModalOpen,
  data,
}) => {
  const dispatch = useDispatch();
  const actor = useSelector((currState) => currState.actors.actor);
  const jobCategoryData = useSelector(
    (currState) => currState.jobsCategory.jobCategory
  );
  console.log("job update krne k lye data aa raha hai", data);
  useEffect(() => {
    dispatch(jobCategoryHandlerRequest());
  }, [actor, dispatch]);
  const [jobTypes, setJobTypes] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
  });

  useEffect(() => {
    if (data) {
      setValue("jobTitle", data?.job_data?.title ?? "");
      setValue("jobLocation", data?.job_data?.location ?? "");
      setValue("job_type", data?.job_data?.job_type ?? ""); // Fixed typo here
      setValue("jobLink", data?.job_data?.link ?? "");
      setValue("jobCategory", data?.job_data?.category ?? "");
      setValue("jobDescription", data?.job_data?.description ?? "");
    }
  }, [data, setValue]);

  const onSubmit = (data) => {
    console.log(data);
    onSubmitHandler(data);
  };

  const [locations, setLocations] = useState([]);

  useEffect(() => {
    fetchLocations().then((data) => {
      setLocations(data.map((loc) => ({ label: loc.name, value: loc.id })));
    });
  }, []);

  const fetchLocations = async () => {
    return [
      { id: "On-site", name: "On-site" },
      { id: "Hybrid", name: "Hybrid" },
      { id: "Remote", name: "Remote" },
    ];
  };

  //fet type of job
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  //   useEffect(() => {
  //     const fetchJobTypes = async () => {
  //       setLoading(true);
  //       setError(null);
  //       try {
  //         const result = await actor.type_of_job();
  //         setJobTypes(result.map((type) => ({ value: type, label: type })));
  //       } catch (err) {
  //         setError(err.message);
  //       }
  //       setLoading(false);
  //     };

  //     fetchJobTypes();
  //   }, []);
// Fetch job types
useEffect(() => {
    const fetchJobTypes = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await actor.type_of_job();
        setJobTypes(result.map((type) => ({ value: type, label: type })));
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    };
  
    fetchJobTypes();
  }, [actor]);

  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: "1" }, { header: "2" }, { font: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        ["bold", "italic", "underline"],
        [{ align: [] }],
        ["link"],
        ["clean"],
      ],
    }),
    []
  );

  const formats = [
    "header",
    "font",
    "list",
    "bullet",
    "bold",
    "italic",
    "underline",
    "align",
    "link",
  ];
  return (
    <>
      <div
        className={`fixed inset-0  z-50 flex items-center justify-center bg-black bg-opacity-50 ${
          isJobsModalOpen ? "block" : "hidden"
        }`}
      >
        <div className="bg-white rounded-lg shadow-lg w-[500px] p-6 pt-4 max-h-[100vh] overflow-y-auto">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t ">
            <h3 className="text-xl font-semibold text-gray-900 ">{jobtitle}</h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center "
              onClick={onJobsClose}
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <div className="">
                <label
                  htmlFor="jobTitle"
                  className="block text-sm font-medium mb-1 mt-2"
                >
                  Job Title
                  <span
                    className="text-red-500
                    "
                  >
                    *
                  </span>
                </label>

                <input
                  type="text"
                  {...register("jobTitle")}
                  className={`border border-[#CDD5DF] rounded-md shadow-sm ${
                    errors.jobTitle ? "border-red-500 " : "border-[#737373]"
                  } text-gray-900 placeholder-gray-500  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                  placeholder="Job Title"
                />
                {errors.jobTitle && (
                  <span className="mt-1 text-sm text-red-500 font-bold">
                    {errors.jobTitle.message}
                  </span>
                )}
              </div>
              {/* job location  */}
              <div className="">
                <label
                  htmlFor="jobLocation"
                  className="block text-sm font-medium mb-1 mt-2"
                >
                  Job Location
                  <span
                    className="text-red-500
                    "
                  >
                    *
                  </span>
                </label>
                <Controller
                  name="jobLocation"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={locations}
                      onChange={(selectedOption) =>
                        field.onChange(selectedOption)
                      }
                      value={field.value}
                      placeholder="Select Job Location"
                      styles={{
                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        control: (provided) => ({
                          ...provided,
                          paddingBlock: "2px",
                          borderRadius: "8px",
                          border: errors.jobLocation
                            ? "1px solid #ef4444"
                            : "1px solid #CDD5DF",
                          backgroundColor: "white",
                          display: "flex",
                          overflowX: "auto",
                          maxHeight: "43px",
                          "&::-webkit-scrollbar": { display: "none" },
                        }),
                        valueContainer: (provided) => ({
                          ...provided,
                          overflow: "scroll",
                          maxHeight: "40px",
                          scrollbarWidth: "none",
                        }),
                        placeholder: (provided) => ({
                          ...provided,
                          color: errors.jobLocation
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
                          border: "2px solid #CDD5DF",
                        }),
                      }}
                    />
                  )}
                />
                {errors.jobLocation && (
                  <span className="mt-1 text-sm text-red-500 font-bold">
                    {errors.jobLocation.message}
                  </span>
                )}
              </div>
              {/* //job type  */}
              <div className="">
                <label
                  htmlFor="job_type"
                  className="block text-sm font-medium mb-1 mt-2"
                >
                  Job Type
                  <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="job_type"
                  control={control}
                  render={({ field }) => (
                    <Select
                      options={jobTypes.map((type) => ({
                        label: type.label.job_type, // Extract the job type string
                        value: type.value.job_type, // Extract the job type string
                      }))}
                      {...field}
                      className={`${
                        errors.job_type ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                  )}
                />

                {errors.job_type && (
                  <span className="mt-1 text-sm text-red-500 font-bold">
                    {errors.job_type.message}
                  </span>
                )}
              </div>
              {/* job link  */}
              <div className="">
                <label
                  htmlFor="jobLink"
                  className="block text-sm font-medium mb-1 mt-2"
                >
                  Job Link
                  <span
                    className="text-red-500
                    "
                  >
                    *
                  </span>
                </label>
                <input
                  type="text"
                  {...register("jobLink")}
                  className={`border border-[#CDD5DF] rounded-md shadow-sm ${
                    errors.jobLink ? "border-red-500 " : "border-[#737373]"
                  } text-gray-900 placeholder-gray-500  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                  placeholder="Job Link"
                />
                {errors.jobLink && (
                  <span className="mt-1 text-sm text-red-500 font-bold">
                    {errors.jobLink.message}
                  </span>
                )}
              </div>
              <div className="">
                <label
                  htmlFor="jobCategory"
                  className="block text-sm font-medium mb-1 mt-2"
                >
                  Jobs Category
                  <span
                    className="text-red-500
                    "
                  >
                    *
                  </span>
                </label>
                <select
                  {...register("jobCategory")}
                  className={`border border-[#CDD5DF] rounded-md shadow-sm ${
                    errors.jobCategory ? "border-red-500 " : "border-[#737373]"
                  } text-gray-900 placeholder-gray-500  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                >
                  <option className="text-lg font-bold" value="">
                    Select any one Category
                    <span
                      className="text-red-500
                    "
                    >
                      *
                    </span>
                  </option>
                  {jobCategoryData?.map((job) => (
                    <option
                      key={job.id}
                      value={`${job.name}`}
                      className="text-lg font-bold"
                    >
                      {job.name}
                    </option>
                  ))}
                </select>
                {errors.jobCategory && (
                  <p className="mt-1 text-sm text-red-500 font-bold text-left">
                    {errors.jobCategory.message}
                  </p>
                )}
              </div>
              <div className="">
                <label
                  htmlFor="jobDescription"
                  className="block text-sm font-medium mb-1 mt-2"
                >
                  Job Description
                  <span
                    className="text-red-500
                    "
                  >
                    *
                  </span>
                </label>
                <Controller
                  name="jobDescription" // FORM FIELD NAME
                  control={control} // CONTROL PROP PASSED FROM REACT HOOK FORM
                  defaultValue="" // DEFAULT VALUE FOR THE FIELD
                  render={({ field: { onChange, value } }) => (
                    <ReactQuill
                      value={value} // CURRENT VALUE FOR THE EDITOR
                      onChange={onChange} // UPDATE FIELD VALUE ON CHANGE EVENT
                      modules={modules} // EDITOR MODULES CONFIGURATION
                      formats={formats} // EDITOR FORMATS CONFIGURATION
                      placeholder="Enter your description here..." // PLACEHOLDER TEXT
                    />
                  )}
                />
                {errors.jobDescription && (
                  <span className="mt-1 text-sm text-red-500 font-bold">
                    {errors.jobDescription.message}
                  </span>
                )}
              </div>
            </div>
            <button
              type="submit"
              className="bg-[#2C5FC3] w-full text-white mt-2 font-semibold py-2 rounded-md flex justify-center items-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ThreeDots
                  height="30"
                  width="40"
                  radius="9"
                  color="#ffffff"
                  ariaLabel="three-dots-loading"
                  visible={true}
                />
              ) : (
                <span>{jobbutton || "Submit"}</span>
              )}
            </button>
          </form>
        </div>
      </div>
      <Toaster />
      {/* </div> */}
    </>
  );
};

export default JobUpdate;

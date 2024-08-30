import React, { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast, Toaster } from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { ThreeDots } from "react-loader-spinner";
import Select from "react-select";
import { jobCategoryHandlerRequest } from "../../../components/StateManagement/Redux/Reducers/getJobCategory";
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
      .test("is-non-empty", "Website URL is required", (value) =>
        /\S/.test(value)
      ),
    jobCategory: yup
      .string()
      .test("is-non-empty", "Category is required", (value) =>
        /\S/.test(value)
      ),
    jobDescription: yup
      .string()
      .required("Job Description is required")
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

  // State for loading and error handling
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    dispatch(jobCategoryHandlerRequest());
  }, [actor, dispatch]);

  const [jobTypes, setJobTypes] = useState([]);
  const [locations, setLocations] = useState([]);

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
      setValue("jobLocation", {
        label: data?.job_data?.location,
        value: data?.job_data?.location,
      });
      setValue("job_type", {
        label: data?.job_data?.job_type,
        value: data?.job_data?.job_type,
      });
      setValue("jobLink", data?.job_data?.link ?? "");
      setValue("jobCategory", data?.job_data?.category ?? "");
      setValue("jobDescription", data?.job_data?.description ?? "");
    }
  }, [data, setValue]);

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

  useEffect(() => {
    const fetchJobTypes = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await actor.type_of_job();
        setJobTypes(
          result.map((type) => ({
            value: type.job_type, // Assuming job_type is the correct field
            label: type.job_type, // Assuming job_type is the correct field
          }))
        );
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

  const onSubmit = (data) => {
    const formattedData = {
      ...data,
      jobLocation: data.jobLocation?.value ?? "", // Extract value from jobLocation
      job_type: data.job_type?.value ?? "", // Extract value from job_type
    };

    console.log("Formatted data to submit:", formattedData);
    onSubmitHandler(formattedData);
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${
          isJobsModalOpen ? "block" : "hidden"
        }`}
      >
        <div className="bg-white rounded-lg shadow-lg w-[500px] p-6 pt-4 max-h-[100vh] overflow-y-auto">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
            <h3 className="text-xl font-semibold text-gray-900">{jobtitle}</h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
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
                  <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  {...register("jobTitle")}
                  className={`border border-[#CDD5DF] rounded-md shadow-sm ${
                    errors.jobTitle ? "border-red-500 " : "border-[#737373]"
                  } text-gray-900 placeholder-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                  placeholder="Job Title"
                />
                {errors.jobTitle && (
                  <span className="mt-1 text-sm text-red-500 font-bold">
                    {errors.jobTitle.message}
                  </span>
                )}
              </div>

              {/* Job Location */}
              <div className="">
                <label
                  htmlFor="jobLocation"
                  className="block text-sm font-medium mb-1 mt-2"
                >
                  Job Location
                  <span className="text-red-500">*</span>
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

              {/* Job Type */}
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
                      options={jobTypes}
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

              {/* Job Link */}
              <div className="">
                <label
                  htmlFor="jobLink"
                  className="block text-sm font-medium mb-1 mt-2"
                >
                  Job Link
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("jobLink")}
                  className={`border border-[#CDD5DF] rounded-md shadow-sm ${
                    errors.jobLink ? "border-red-500 " : "border-[#737373]"
                  } text-gray-900 placeholder-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                  placeholder="Job Link"
                />
                {errors.jobLink && (
                  <span className="mt-1 text-sm text-red-500 font-bold">
                    {errors.jobLink.message}
                  </span>
                )}
              </div>

              {/* Job Category */}
              <div className="">
                <label
                  htmlFor="jobCategory"
                  className="block text-sm font-medium mb-1 mt-2"
                >
                  Jobs Category
                  <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("jobCategory")}
                  className={`border border-[#CDD5DF] rounded-md shadow-sm ${
                    errors.jobCategory ? "border-red-500 " : "border-[#737373]"
                  } text-gray-900 placeholder-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                >
                  <option className="text-lg font-bold" value="">
                    Select any one Category
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

              {/* Job Description */}
              <div className="">
                <label
                  htmlFor="jobDescription"
                  className="block text-sm font-medium mb-1 mt-2"
                >
                  Job Description
                  <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="jobDescription"
                  control={control}
                  defaultValue=""
                  render={({ field: { onChange, value } }) => (
                    <ReactQuill
                      value={value}
                      onChange={onChange}
                      modules={modules}
                      formats={formats}
                      placeholder="Enter your description here..."
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
    </>
  );
};

export default JobUpdate;

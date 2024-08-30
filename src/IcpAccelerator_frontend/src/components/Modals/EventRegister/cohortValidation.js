import * as yup from "yup";
import { startOfToday } from 'date-fns';
export const validationSchema = yup.object({
    title: yup
      .string()
      .required("Required")
      .test(
        "is-non-empty",
        "Title cannot be empty",
        (value) => value && value.trim().length > 0
      ),
    description: yup
      .string()
      .trim()
      .required("Description is required")
      .matches(/^[^\s].*$/, "Cannot start with a space")
      .test(
        "no-leading-spaces",
        "Description should not have leading spaces",
        (value) => !value || value.trimStart() === value
      ),
    cohort_launch_date: yup
      .date()
      .required()
      .typeError("Must be a date")
      .min(startOfToday(), "Cohort Launch date cannot be before today"),
    cohort_end_date: yup
      .date()
      .required()
      .typeError("Must be a date")
      .min(
        yup.ref("cohort_launch_date"),
        "Cohort End date cannot be before Cohort launch date"
      ),
    tags: yup
      .string()
      .test("is-non-empty", "Selecting an interest is required", (value) =>
        /\S/.test(value)
      )
      .required("Selecting an interest is required"),
    deadline: yup
      .date()
      .required("Must be a date")
      .typeError("Must be a valid date")
      .max(
        yup.ref("cohort_launch_date"),
        "Application Deadline must be before the Cohort Launch date"
      ),
    eligibility: yup
      .string()
      .typeError("You must enter eligibility")
      .required(),
    no_of_seats: yup
      .number()
      .typeError("You must enter a number")
      .required("Number of seats is required")
      .min(0, "The number of seats cannot be negative"),
  
    funding_type: yup
      .string()
      .typeError("You must enter a funding type")
      .required("Required"),
    funding_amount: yup
      .string()
      .typeError("You must enter a funding amount")
      .required("Required"),
      cohort_banner: yup
      .mixed()
      .nullable(true)
      .test("fileSize", "File size max 10MB allowed", (value) => {
        return !value || (value && value.size <= 10 * 1024 * 1024); // 10 MB limit
      })
      .test("fileType", "Only jpeg, jpg & png file format allowed", (value) => {
        return (
          !value ||
          (value &&
            ["image/jpeg", "image/jpg", "image/png"].includes(value.type))
        );
      }),
  });
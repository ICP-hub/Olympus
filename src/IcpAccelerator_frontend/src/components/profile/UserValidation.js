import * as yup from "yup";

export const validationSchema = yup
  .object({
    full_name: yup
      .string()
      .required("Full name is required")
      .matches(/\S/, "Full name cannot be empty"),
    email: yup.string().email("Invalid email").nullable(),
    telegram_id: yup.string().nullable().url("Invalid URL"),
    twitter_url: yup.string().nullable().url("Invalid URL"),
    openchat_user_name: yup
      .string()
      .nullable()
      .matches(
        /^[^\s]{5,20}$/,
        "Username must be between 5 and 20 characters, and cannot contain spaces"
      ),
    bio: yup
      .string()
      .max(500, "Bio must not exceed 500 characters")
      .test(
        "maxWords",
        "Bio must not exceed 50 words",
        (value) => !value || value.split(/\s+/).length <= 50
      ),
    country: yup.string().required("Country is required"),
    domains_interested_in: yup
      .string()
      .required("Selecting an interest is required"),
    type_of_profile: yup.string().required("Type of profile is required"),
    reasons_to_join_platform: yup
      .string()
      .required("Selecting a reason is required"),
    image: yup
      .mixed()
      .nullable()
      .test(
        "fileSize",
        "File size max 10MB allowed",
        (value) => !value || value.size <= 10 * 1024 * 1024
      )
      .test(
        "fileType",
        "Only jpeg, jpg & png formats allowed",
        (value) =>
          !value ||
          ["image/jpeg", "image/jpg", "image/png"].includes(value.type)
      ),
  })
  .required();

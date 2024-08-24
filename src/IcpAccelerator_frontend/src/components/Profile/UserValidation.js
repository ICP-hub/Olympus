import * as yup from "yup";

export const validationSchema = yup
.object()
.shape({
  full_name: yup.string().required("Full name is required"),
  email: yup.string().email("Invalid email").nullable(true).optional(),
  bio: yup
    .string()
    .optional()
    .test(
      "maxWords",
      "Bio must not exceed 50 words",
      (value) =>
        !value || value.trim().split(/\s+/).filter(Boolean).length <= 50
    )
    .test(
      "maxChars",
      "Bio must not exceed 500 characters",
      (value) => !value || value.length <= 500
    ),
  location: yup.string().required("Location is required"), // Changed to location instead of country
  domains_interested_in: yup
    .string()
    .required("Selecting an interest is required"),
  type_of_profile: yup.string().required("Type of profile is required"),
  reasons_to_join_platform: yup
    .string()
    .required("Selecting a reason is required"),
})
.required();
import * as yup from "yup";

export const validationSchema = yup
.object()
.shape({
  full_name: yup
    .string()
    .test("is-non-empty", "Full name is required", (value) =>
      /\S/.test(value)
    )
    .required("Full name is required"),
  email: yup
    .string()
    .email("Invalid email")
    .nullable(true)
    .optional()
    .test(
      "no-leading-trailing-spaces",
      "Email should not have leading or trailing spaces",
      function (value) {
        if (value !== undefined && value !== null) {
          return value.trim() === value;
        }
        return true;
      }
    ),
    links: yup.array().of(
      yup.object().shape({
        url: yup.string().url("Invalid URL").nullable(true).optional(),
      })
    ),
  openchat_user_name: yup
    .string()
    .nullable(true)
    .test(
      "is-valid-username",
      "Username must be between 5 and 20 characters, and cannot start or contain spaces",
      (value) => {
        if (!value) return true;
        const isValidLength = value.length >= 5 && value.length <= 20;
        const hasNoSpaces = !/\s/.test(value) && !value.startsWith(" ");
        return isValidLength && hasNoSpaces;
      }
    ),
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
      "no-leading-spaces",
      "Bio should not have leading spaces",
      (value) => !value || value.trimStart() === value
    )
    .test(
      "maxChars",
      "Bio must not exceed 500 characters",
      (value) => !value || value.length <= 500
    ),
  country: yup
    .string()
    .test("is-non-empty", "Country is required", (value) => /\S/.test(value))
    .required("Country is required"),
  domains_interested_in: yup
    .string()
    // .test("is-non-empty", "Selecting an interest is required", (value) =>
    //   /\S/.test(value)
    // )
    // .required("Selecting an interest is required")
    ,
  type_of_profile: yup
    .string()
    // .test("is-non-empty", "Type of profile is required", (value) =>
    //   /\S/.test(value)
    // )
    // .required("Type of profile is required")
    ,
  reasons_to_join_platform: yup
    .string()
    .test("is-non-empty", "Selecting a reason is required", (value) =>
      /\S/.test(value)
    )
    .required("Selecting a reason is required"),

  image: yup
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
})
.required();
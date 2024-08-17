
import * as yup from 'yup';

export const validationSchema = yup
.object()
.shape({
  full_name: yup
    .string()
    .test("is-non-empty", "Full name is required", (value) =>
      /\S/.test(value)
    )
    .required("Full name is required"),
  email: yup.string().email("Invalid email").nullable(true).optional(),
  telegram_id: yup
    .string()
    .nullable(true)
    .optional()
    // .test("is-valid-telegram", "Invalid Telegram link", (value) => {
    //   if (!value) return true;
    //   const hasValidChars = /^[a-zA-Z0-9_]{5,32}$/.test(value);
    //   return hasValidChars;
    // })
    .url("Invalid url"),
  twitter_url: yup
    .string()
    .nullable(true)
    .optional()
    // .test("is-valid-twitter", "Invalid Twitter ID", (value) => {
    //   if (!value) return true;
    //   const hasValidChars =
    //   /^(https?:\/\/)?(www\.)?(twitter\.com|x\.com)\/[a-zA-Z0-9_]{1,15}$/.test(
    //       value
    //     );
    //   return hasValidChars;
    // })
    .url("Invalid url"),
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
    .test("is-non-empty", "Country is required", (value) =>
      /\S/.test(value)
    )
    .required("Country is required"),
  domains_interested_in: yup
    .string()
    .test("is-non-empty", "Selecting an interest is required", (value) =>
      /\S/.test(value)
    )
    .required("Selecting an interest is required"),
  type_of_profile: yup
    .string()
    .test("is-non-empty", "Type of profile is required", (value) =>
      /\S/.test(value)
    )
    .required("Type of profile is required"),
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
    .test(
      "fileType",
      "Only jpeg, jpg & png file format allowed",
      (value) => {
        return (
          !value ||
          (value &&
            ["image/jpeg", "image/jpg", "image/png"].includes(value.type))
        );
      }
    ),
  logo: yup
    .mixed()
    .nullable(true)
    .test("fileSize", "File size max 10MB allowed", (value) => {
      return !value || (value && value.size <= 10 * 1024 * 1024); // 10 MB limit
    })
    .test(
      "fileType",
      "Only jpeg, jpg & png file format allowed",
      (value) => {
        return (
          !value ||
          (value &&
            ["image/jpeg", "image/jpg", "image/png"].includes(value.type))
        );
      }
    ),
  cover: yup
    .mixed()
    .nullable(true)
    .test("fileSize", "File size max 10MB allowed", (value) => {
      return !value || (value && value.size <= 10 * 1024 * 1024); // 10 MB limit
    })
    .test(
      "fileType",
      "Only jpeg, jpg & png file format allowed",
      (value) => {
        return (
          !value ||
          (value &&
            ["image/jpeg", "image/jpg", "image/png"].includes(value.type))
        );
      }
    ),
  preferred_icp_hub: yup
    .string()
    .test("is-non-empty", "ICP Hub selection is required", (value) =>
      /\S/.test(value)
    )
    .required("ICP Hub selection is required"),
  project_name: yup
    .string()
    .test("is-non-empty", "Project name is required", (value) =>
      /\S/.test(value)
    )
    .test(
      "no-leading-spaces",
      "Project name should not have leading spaces",
      (value) => !value || value.trimStart() === value
    )
    .required("Project name is required"),
  project_description: yup
    .string()
    .test(
      "maxWords",
      "Project Description must not exceed 50 words",
      (value) =>
        !value || value.trim().split(/\s+/).filter(Boolean).length <= 50
    )
    .test(
      "maxChars",
      "Project Description must not exceed 500 characters",
      (value) => !value || value.length <= 500
    )
    .optional(),
  // .required("Project Description is required"),
  project_elevator_pitch: yup.string().url("Invalid url").optional(),
  // .required("Project Pitch deck is required"),
  project_website: yup
    .string()
    .nullable(true)
    .optional()
    .url("Invalid url"),
  is_your_project_registered: yup
    .string()
    .required("Required")
    .oneOf(["true", "false"], "Invalid value"),
  type_of_registration: yup
    .string()
    .when("is_your_project_registered", (val, schema) =>
      val && val[0] === "true"
        ? schema
            .test(
              "is-non-empty",
              "Type of registration is required",
              (value) => /\S/.test(value)
            )
            .required("Type of registration is required")
        : schema
    ),
  country_of_registration: yup
    .string()
    .when("is_your_project_registered", (val, schema) =>
      val && val[0] === "true"
        ? schema
            .test(
              "is-non-empty",
              "Country of registration is required",
              (value) => /\S/.test(value)
            )
            .required("Country of registration is required")
        : schema
    ),
  live_on_icp_mainnet: yup
    .string()
    .required("Required")
    .oneOf(["true", "false"], "Invalid value"),
  dapp_link: yup.string().when("live_on_icp_mainnet", (val, schema) =>
    val && val[0] === "true"
      ? schema
          .test("is-non-empty", "dApp Link is required", (value) =>
            /\S/.test(value)
          )
          .url("Invalid url")
          .required("dApp Link is required")
      : schema
  ),
  weekly_active_users: yup.number().nullable(true).optional(),
  revenue: yup.number().nullable(true).optional(),

  money_raising: yup
    .string()
    .required("Required")
    .oneOf(["true", "false"], "Invalid value"),
  money_raised_till_now: yup
    .string()
    .required("Required")
    .oneOf(["true", "false"], "Invalid value"),

  icp_grants: yup
    .mixed()
    .test(
      "is-required-or-nullable",
      "You must enter a number",
      function (value) {
        const { money_raised_till_now } = this.parent;
        if (money_raised_till_now === "true") {
          return yup
            .number()
            .min(0, "Must be a non-negative number")
            .isValidSync(value);
        }
        return value === null || value === "" || value === 0;
      }
    ),
  investors: yup
    .mixed()
    .test(
      "is-required-or-nullable",
      "You must enter a number",
      function (value) {
        const { money_raised_till_now } = this.parent;
        if (money_raised_till_now === "true") {
          return yup
            .number()
            .min(0, "Must be a non-negative number")
            .isValidSync(value);
        }
        return value === null || value === "" || value === 0;
      }
    ),

  raised_from_other_ecosystem: yup
    .mixed()
    .test(
      "is-required-or-nullable",
      "You must enter a number",
      function (value) {
        const { money_raised_till_now } = this.parent;
        if (money_raised_till_now === "true") {
          return yup
            .number()
            .min(0, "Must be a non-negative number")
            .isValidSync(value);
        }
        return value === null || value === "" || value === 0;
      }
    ),
  target_amount: yup
    .number()
    .when("money_raising", (val, schema) =>
      val && val[0] === "true"
        ? schema
            .typeError("You must enter a number")
            .min(0, "Must be a non-negative number")
            .required("Target Amount is required")
        : schema
    ),
  valuation: yup
    .number()
    .optional()
    .transform((value, originalValue) =>
      originalValue === "" || originalValue == null ? null : value
    )
    .nullable(true)
    .when("money_raising", (val, schema) =>
      val && val[0] === "true"
        ? schema.test(
            "is-zero-or-greater",
            "Must be a positive number",
            (value) => (!isNaN(value) ? value >= 0 : true)
          )
        : schema
    ),
  multi_chain: yup
    .string()
    .required("Required")
    .oneOf(["true", "false"], "Invalid value"),
  multi_chain_names: yup
    .string()
    .when("multi_chain", (val, schema) =>
      val && val[0] === "true"
        ? schema
            .test(
              "is-non-empty",
              "Atleast one chain name required",
              (value) => /\S/.test(value)
            )
            .required("Atleast one chain name required")
        : schema
    ),
  promotional_video: yup
    .string()
    .nullable(true)
    .optional()
    .url("Invalid url"),
  project_discord: yup
    .string()
    .nullable(true)
    .optional()
    // .test("is-valid-discord", "Invalid Discord URL", (value) => {
    //   if (!value) return true;
    //   const hasValidChars =
    //     /^(https?:\/\/)?(www\.)?(discord\.(gg|com)\/(invite\/)?[a-zA-Z0-9\-_]+|discordapp\.com\/invite\/[a-zA-Z0-9\-_]+)$/.test(
    //       value
    //     );
    //   return hasValidChars;
    // })
    .url("Invalid url"),
  project_linkedin: yup
    .string()
    .nullable(true)
    .optional()
    // .test("is-valid-linkedin", "Invalid LinkedIn URL", (value) => {
    //   if (!value) return true;
    //   const hasValidChars =
    //     /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/.test(
    //       value
    //     );
    //   return hasValidChars;
    // })
    .url("Invalid url"),
  github_link: yup
    .string()
    .nullable(true)
    .optional()
    // .test("is-valid-github", "Invalid GitHub URL", (value) => {
    //   if (!value) return true;
    //   const hasValidChars =
    //     /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_\-]+(\/[a-zA-Z0-9_\-]+)?(\/)?$/.test(
    //       value
    //     );
    //   return hasValidChars;
    // })
    .url("Invalid url"),
  token_economics: yup
    .string()
    .nullable(true)
    .optional()
    .url("Invalid url"),
  white_paper: yup.string().nullable(true).optional().url("Invalid url"),
  upload_public_documents: yup
    .string()
    .required("Required")
    .oneOf(["true", "false"], "Invalid value"),
  publicDocs: yup.array().of(
    yup.object().shape({
      title: yup
        .string()
        .required("Title is required")
        .test(
          "no-leading-spaces",
          "Title should not have leading spaces",
          (value) => !value || value.trimStart() === value
        ),
      link: yup
        .string()
        .url("Must be a valid URL")
        .required("Link is required"),
    })
  ),
  upload_private_documents: yup
    .string()
    .required("Required")
    .oneOf(["true", "false"], "Invalid value"),
  privateDocs: yup.array().of(
    yup.object().shape({
      title: yup
        .string()
        .required("Title is required")
        .test(
          "no-leading-spaces",
          "Title should not have leading spaces",
          (value) => !value || value.trimStart() === value
        ),
      link: yup
        .string()
        .url("Must be a valid URL")
        .required("Link is required"),
    })
  ),
})
.required();

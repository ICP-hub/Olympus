import * as yup from "yup";

export const validationSchema = yup
  .object()
  .shape({
    logo: yup
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
    cover: yup
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
    project_website: yup.string().nullable(true).optional().url("Invalid url"),
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
      .required("Required")
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
      .required("Required")
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
      .required("Required")
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
      .required("Required")
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
      .required("Required")
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
    links: yup.array().of(
      yup.object().shape({
        url: yup.string().url("Invalid URL").nullable(true).optional(),
      })
    ),
    token_economics: yup.string().nullable(true).optional().url("Invalid url"),
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

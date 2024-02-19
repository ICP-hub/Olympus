export const formFields = [
  {
    id: "full_name",
    type: "text",
    name: "full_name",
    label: "Hello there! Can we get your full name *?",
    onFocus: null,
    onBlur: null,
  },
  {
    id: "date_of_birth",
    type: "date",
    name: "date_of_birth",
    label: "Can you please give us your date of birth *",
    onFocus: "date",
    onBlur: "date",
  },

  {
    id: "email",
    type: "email",
    name: "email",
    label: "What is the best email address to contact you on?",
    onFocus: null,
    onBlur: null,
  },
  {
    id: "phone_number",
    type: "text",
    name: "phone_number",
    label: "Can we also have a phone number, please?",
    onFocus: null,
    onBlur: null,
  },
  {
    id: "linked_in_profile",
    type: "text",
    name: "linked_in_profile",
    label: "Please paste the link to your LinkedIn profile *",
  },

  {
    id: "telegram_id",
    type: "text",
    name: "telegram_id",
    label: "Please paste the link of your Telegram ID.",
    onFocus: null,
    onBlur: null,
  },
  {
    id: "twitter_id",
    type: "text",
    name: "twitter_id",
    label: "Please paste the link of your Twitter ID.",
    onFocus: null,
    onBlur: null,
  },
];

export const TeamDetailsField = [
  {
    id: "founderNumber",
    type: "number",
    name: "founderNumber",
    label: "How many co-founders do you have? *",
  },
  {
    id: "url",
    type: "url",
    name: "url",
    label: "Please give us your co-founder(s) LinkedIn profile(s)",
  },
  {
    id: "partnershipDuration",
    type: "text",
    name: "partnershipDuration",
    label: "How long have you known each other?",
  },
  {
    id: "workingTime",
    type: "text",
    name: "workingTime",
    label: "Is the team working full time on this project? *",
  },
  {
    id: "ownershipEquity",
    type: "text",
    name: "ownershipEquity",
    label:
      "Please outline the equity ownership of your company and any other relevant information regarding its structure. *",
  },
  {
    id: "details",
    type: "text",
    name: "details",
    label:
      "If you have anything else you would like to share regarding your venture, please elaborate.",
  },
];

export const companyMetricsFormFields = [
  {
    id: "userNumber",
    type: "number",
    name: "userNumber",
    label: "How many users do you currently have?",
  },
  {
    id: "monthlySpending",
    type: "number",
    name: "monthlySpending",
    label: "What is your average monthly spending? (Amount in $)",
  },
  {
    id: "monthlyRevenue",
    type: "number",
    name: "monthlyRevenue",
    label: "What is your average monthly revenue? (Amount in $)",
  },
  {
    id: "debt",
    type: "text",
    name: "debt",
    label: "Does your company currently have any debt?",
  },
  {
    id: "capital",
    type: "text",
    name: "capital",
    label: "Have you raised any capital for your business?",
  },
  {
    id: "existingUser",
    type: "text",
    name: "existingUser",
    label:
      "Have you previously participated in an incubator, accelerator, or pre-accelerator program?",
  },
];

export const companyInfoFormFields = [
  {
    id: "companyName",
    type: "text",
    name: "companyName",
    label: "Company name - What is the legal name of your venture? *",
  },
  {
    id: "dob",
    type: "date",
    name: "dob",
    label: "Creation date - When did you begin building this? *",
  },
  {
    id: "companyWebsite",
    type: "url",
    name: "companyWebsite",
    label: "If your company has a website, please share the link",
  },
  {
    id: "describe",
    type: "text",
    name: "describe",
    label:
      "Briefly describe your company. What is your value proposition? What sector do you operate in? Etc. *",
  },
  {
    id: "telegram",
    type: "url",
    name: "telegram",
    label: "Please share your Telegram ID.",
  },
  {
    id: "employeeNum",
    type: "number",
    name: "employeeNum",
    label: "Employee count: How many employees do you have?",
  },
  {
    id: "companyLevel",
    type: "text",
    name: "companyLevel",
    label: "What stage is your company currently in *",
  },
];


export const additionalInfoFormFields = [
  {
    id: "reasonForJoin",
    name: "reasonForJoin",
    label: "Why are you applying to our accelerator program? Choose as many as you like *",
    placeholder: "",
    type: "text",
  },
  {
    id: "agreeToCommit",
    name: "agreeToCommit",
    label: "Are you committed to working exclusively on this project during the course of the accelerator program?",
    placeholder: "",
    type: "text",
  },
  {
    id: "referrer",
    name: "referrer",
    label: "Referrer",
    placeholder: "",
    type: "text",
  }
];

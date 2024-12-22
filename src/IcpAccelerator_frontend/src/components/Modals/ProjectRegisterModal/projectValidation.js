import * as yup from 'yup';

export const validationSchema = yup
  .object()
  .shape({
    logo: yup
      .mixed()
      .nullable(true)
      .test('fileSize', 'File size max 10MB allowed', (value) => {
        return !value || (value && value.size <= 10 * 1024 * 1024); // 10 MB limit
      })
      .test('fileType', 'Only jpeg, jpg & png file format allowed', (value) => {
        return (
          !value ||
          (value &&
            ['image/jpeg', 'image/jpg', 'image/png'].includes(value.type))
        );
      }),
    cover: yup
      .mixed()
      .nullable(true)
      .test('fileSize', 'File size max 10MB allowed', (value) => {
        return !value || (value && value.size <= 10 * 1024 * 1024); // 10 MB limit
      })
      .test('fileType', 'Only jpeg, jpg & png file format allowed', (value) => {
        return (
          !value ||
          (value &&
            ['image/jpeg', 'image/jpg', 'image/png'].includes(value.type))
        );
      }),
    preferred_icp_hub: yup
      .string()
      .test('is-non-empty', 'ICP Hub selection is required', (value) =>
        /\S/.test(value)
      )
      .required('ICP Hub selection is required'),

    project_name: yup
      .string()
      .test('is-non-empty', 'Project name is required', (value) =>
        /\S/.test(value)
      )
      .test(
        'no-leading-spaces',
        'Project name should not have leading spaces',
        (value) => !value || value.trimStart() === value
      )
      .matches(/^[a-zA-Z0-9\s,]+$/, 'Please enter valid Project name')
      .min(3, 'Project name must be at least 3 characters long')
      .max(100, 'Project name cannot be more than 100 characters long')
      .required('Project name is required'),

    project_description: yup
      .string()
      .test(
        'maxWords',
        'Project Description must not exceed 50 words',
        (value) =>
          !value || value.trim().split(/\s+/).filter(Boolean).length <= 50
      )
      .test(
        'maxChars',
        'Project Description must not exceed 500 characters',
        (value) => !value || value.length <= 500
      )
      .test(
        'notEmpty',
        'Project Description must contain non-space characters',
        (value) => !!value && value.trim().length > 0
      )
      .required('Project description is required'),
    project_elevator_pitch: yup
      .string()
      .nullable()
      .notRequired()
      .test(
        'is-valid-url',
        'Project elevator pitch is not valid ',
        (value) => !value || /^[a-zA-Z0-9@.\-:/]+$/.test(value)
      )
      .test(
        'is-url',
        'Invalid URL',
        (value) => !value || yup.string().url().isValidSync(value)
      ),

    // .required("Project Pitch deck is required"),
    project_website: yup
      .string()
      .nullable()
      .notRequired()
      .test(
        'is-valid-url',
        'Please enter valid url',
        (value) => !value || /^[a-zA-Z0-9@.\-:/]+$/.test(value)
      )
      .test(
        'is-url',
        'Invalid URL',
        (value) => !value || yup.string().url().isValidSync(value)
      ),

    is_your_project_registered: yup
      .string()
      .required('Required')
      .oneOf(['true', 'false'], 'Invalid value'),

    type_of_registration: yup
      .string()
      .when('is_your_project_registered', (val, schema) =>
        val && val[0] === 'true'
          ? schema
              .test(
                'is-non-empty',
                'Type of registration is required',
                (value) => /\S/.test(value)
              )
              .required('Type of registration is required')
          : schema
      ),
    country_of_registration: yup
      .string()
      .when('is_your_project_registered', (val, schema) =>
        val && val[0] === 'true'
          ? schema
              .test(
                'is-non-empty',
                'Country of registration is required',
                (value) => /\S/.test(value)
              )
              .required('Country of registration is required')
          : schema
      ),

    live_on_icp_mainnet: yup
      .string()
      .required('Required')
      .oneOf(['true', 'false'], 'Invalid value'),
    dapp_link: yup.string().when('live_on_icp_mainnet', (val, schema) =>
      val && val[0] === 'true'
        ? schema
            .test('is-non-empty', 'dApp Link is required', (value) =>
              /\S/.test(value)
            )
            .matches(/^[a-zA-Z0-9@.\/:\-]+$/, 'dApp Link should be valid')
            .url('Invalid URL')
            .required('dApp Link is required')
        : schema
    ),
    weekly_active_users: yup
      .number()
      .nullable(false)
      .test(
        'is-required-when-live',
        'Weekly active users is required and must be a valid number when the project is live on ICP mainnet',
        function (value) {
          const { live_on_icp_mainnet } = this.parent;
          if (live_on_icp_mainnet === 'true') {
            if (value === undefined || value === null || value === '') {
              return this.createError({
                message:
                  'Weekly active users is required when the project is live on ICP mainnet',
              });
            }
            if (typeof value !== 'number') {
              return this.createError({
                message: 'Weekly active users must be a number',
              });
            }
            if (value < 0) {
              return this.createError({
                message: 'Weekly active users cannot be a negative number',
              });
            }
            if (Object.is(value, -0)) {
              return this.createError({
                message:
                  'Negative zero (-0) is not allowed for weekly active users',
              });
            }
          }
          return true;
        }
      ),
    revenue: yup
      .number()
      .nullable(true)
      .optional()
      .min(0, 'Revenue cannot be a negative number')
      .max(999999999, 'Revenue must be less than 1 billion') // Maximum limit less than 1 billion
      .test(
        'not-negative-zero',
        'Negative zero (-0) is not allowed',
        (value) => Object.is(value, -0) === false
      ),

    money_raising: yup
      .string()
      .required('Required')
      .oneOf(['true', 'false'], 'Invalid value'),
    money_raised_till_now: yup
      .string()
      .required('Required')
      .oneOf(['true', 'false'], 'Invalid value'),

    icp_grants: yup
      .number()
      .nullable(false)
      .test(
        'is-required-or-nullable',
        'You must enter a number',
        function (value) {
          const { money_raised_till_now } = this.parent;
          if (money_raised_till_now === 'true') {
            return yup
              .number()
              .min(0, 'Must be a non-negative number')
              .required('This is a required field')
              .test(
                'not-negative-zero',
                'Negative zero (-0) is not allowed',
                (value) => Object.is(value, -0) === false
              )
              .isValidSync(value);
          }
          return value === null || value === '' || value === 0;
        }
      ),
    investors: yup
      .number()
      .nullable(false)
      .test(
        'is-required-or-nullable',
        'You must enter a number',
        function (value) {
          const { money_raised_till_now } = this.parent;
          if (money_raised_till_now === 'true') {
            return (
              yup
                .number()
                .min(0, 'Must be a non-negative number')
                // .nullable(false)
                .required('This is a required field')
                .test(
                  'not-negative-zero',
                  'Negative zero (-0) is not allowed',
                  (value) => Object.is(value, -0) === false
                )
                .isValidSync(value)
            );
          }
          return value === null || value === '' || value === 0;
        }
      ),
    raised_from_other_ecosystem: yup
      .number()
      .nullable(false)
      .test(
        'is-required-or-nullable',
        'You must enter a number',
        function (value) {
          const { money_raised_till_now } = this.parent;
          if (money_raised_till_now === 'true') {
            return yup
              .number()
              .min(0, 'Must be a non-negative number')
              .required('This is a required field')
              .test(
                'not-negative-zero',
                'Negative zero (-0) is not allowed',
                (value) => Object.is(value, -0) === false
              )
              .isValidSync(value);
          }
          return value === null || value === '' || value === 0;
        }
      ),
    target_amount: yup
      .number()
      .test(
        'not-negative-zero',
        'Negative zero (-0) is not allowed',
        (value) => Object.is(value, -0) === false
      )
      .when('money_raising', (val, schema) =>
        val && val[0] === 'true'
          ? schema
              .typeError('You must enter a number')
              .min(0, 'Must be a non-negative number')
              .required('Target Amount is required')
          : schema
      ),
    valuation: yup
      .number()
      .test(
        'not-negative-zero',
        'Negative zero (-0) is not allowed',
        (value) => Object.is(value, -0) === false
      )
      .when('money_raising', (val, schema) =>
        val && val[0] === 'true'
          ? schema
              .typeError('You must enter a number')
              .min(0, 'Must be a non-negative number')
              .required('Target Amount is required')
          : schema
      ),
    reason_to_join_incubator: yup
      .string()
      .transform((value) => {
        if (Array.isArray(value)) {
          return value.map((item) => item.value).join(', ');
        }
        return value;
      })
      .required('Selecting a reason is required')
      .test(
        'at-least-one',
        'You must select at least one reason',
        (value) => value && value.split(', ').length > 0
      ),
    project_area_of_focus: yup
      .string()
      .required('Selecting a category is required')
      .test(
        'at-least-one',
        'You must select at least one category',
        (value) => value && value.split(', ').length > 0
      ),
    multi_chain: yup
      .string()
      .required('Required')
      .oneOf(['true', 'false'], 'Invalid value'),
    multi_chain_names: yup
      .string()
      .when('multi_chain', (val, schema) =>
        val && val[0] === 'true'
          ? schema
              .test(
                'is-non-empty',
                'Atleast one chain name required',
                (value) => /\S/.test(value)
              )
              .required('Atleast one chain name required')
          : schema
      ),
    promotional_video: yup
      .string()
      .nullable(true)
      .optional()
      .url('Invalid url'),
    token_economics: yup.string().nullable(true).optional().url('Invalid url'),
    links: yup
      .array()
      .of(
        yup.object().shape({
          link: yup
            .string()
            .test(
              'no-leading-trailing-spaces',
              'URL should not have leading or trailing spaces',
              (value) => {
                return value === value?.trim();
              }
            )
            .test(
              'no-invalid-extensions',
              'URL should not end with .php, .js, or .txt',
              (value) => {
                const invalidExtensions = ['.php', '.js', '.txt'];
                return value
                  ? !invalidExtensions.some((ext) => value.endsWith(ext))
                  : true;
              }
            )
            .test('is-website', 'Only website links are allowed', (value) => {
              if (value) {
                try {
                  const url = new URL(value);
                  const hostname = url.hostname.toLowerCase();
                  const validExtensions = [
                    '.com',
                    '.org',
                    '.net',
                    '.in',
                    '.co',
                    '.io',
                    '.gov',
                  ];
                  const hasValidExtension = validExtensions.some((ext) =>
                    hostname.endsWith(ext)
                  );
                  return hasValidExtension;
                } catch (err) {
                  return false;
                }
              }
              return true;
            })
            .url('Invalid URL')
            .nullable(true)
            .optional(),
        })
      )
      .max(10, 'You can only add up to 10 links') // Restrict the array to a maximum of 10 links
      .optional(),
  })
  .required();

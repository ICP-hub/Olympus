import * as yup from 'yup';

export const validationSchema = yup
  .object()
  .shape({
    investor_registered: yup
      .string()
      .required('Required')
      .oneOf(['true', 'false'], 'Invalid value'),
    registered_country: yup
      .string()
      .when('investor_registered', (val, schema) =>
        val && val[0] === 'true'
          ? schema
              .test(
                'is-non-empty',
                'Registered country name required',
                (value) => /\S/.test(value)
              )
              .required('Registered country name required')
          : schema
      ),

    preferred_icp_hub: yup
      .string()
      .test('is-non-empty', 'ICP Hub selection is required', (value) =>
        /\S/.test(value)
      )
      .required('ICP Hub selection is required'),
    existing_icp_investor: yup
      .string()
      .oneOf(['true', 'false'], 'Invalid value'),
    investment_type: yup
      .string()
      .when('existing_icp_investor', (val, schema) =>
        val && val[0] === 'true'
          ? schema
              .test(
                'is-non-empty',
                'Atleast one investment type required',
                (value) => /\S/.test(value)
              )
              .required('Atleast one investment type required')
          : schema
      ),
    investor_portfolio_link: yup
      .string()
      .required('Portfolio link is required')
      .matches(/^[a-zA-Z0-9@.\/:\-]*$/, 'Portfolio Link should be valid')
      .test(
        'is-url-valid',
        'Invalid URL',
        (value) => !value || yup.string().url().isValidSync(value)
      ),

    investor_fund_name: yup
      .string()
      .test('is-non-empty', 'Fund name is required', (value) =>
        /\S/.test(value)
      )
      .test(
        'no-leading-spaces',
        'Fund name should not have leading spaces',
        (value) => !value || value.trimStart() === value
      )
      .matches(/^[a-zA-Z0-9\s,]+$/, 'Please enter valid Fund name')
      .min(3, 'Fund name must be at least 3 characters long')
      .max(50, 'Fund name cannot be more than 50 characters long')
      .required('Fund name is required'),

    investor_fund_size: yup
      .number()
      .min(0, 'Must be a non-negative number')
      .max(1_000_000, 'Fund Size must be in millions (up to 1 million)')
      .required('Fund is required')
      .typeError('You must enter a number')
      .test(
        'not-negative-zero',
        'Negative zero (-0) is not allowed',
        (value) => Object.is(value, -0) === false
      ),

    invested_in_multi_chain: yup
      .string()
      .required('Required')
      .oneOf(['true', 'false'], 'Invalid value'),
    invested_in_multi_chain_names: yup
      .string()
      .when('invested_in_multi_chain', (val, schema) =>
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
    investment_categories: yup
      .string()
      .test('is-non-empty', 'Selecting a category is required', (value) =>
        /\S/.test(value)
      )
      .required('Selecting an category is required'),
    investor_website_url: yup
      .string()
      .nullable(true)
      .optional()
      .matches(/^[a-zA-Z0-9@.\/:\-]*$/, 'Website Link should be valid')
      .test(
        'is-url-valid',
        'Invalid URL',
        (value) => !value || yup.string().url().isValidSync(value)
      ),

    investment_stage: yup
      .string()
      .test('is-non-empty', 'Investment stage is required', (value) =>
        /\S/.test(value)
      )
      .required('Investment stage is required'),
    investment_stage_range: yup
      .string()
      .when('investment_stage', (val, schema) =>
        val && val !== 'we do not currently invest'
          ? schema
              .test('is-non-empty', 'Atleast one range required', (value) =>
                /\S/.test(value)
              )
              .required('Atleast one range required')
          : schema
      ),

    links: yup.array().of(
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
    ),
  })
  .required();

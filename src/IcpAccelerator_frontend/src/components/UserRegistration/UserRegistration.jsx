import React, { useState, useEffect, useRef } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ThreeDots } from 'react-loader-spinner';
import toast, { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import Layer1 from '../../../assets/Logo/Layer1.png';
import AboutcardSkeleton from '../LatestSkeleton/AbourcardSkeleton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import RegisterForm1 from './RegisterForm1';
import RegisterForm2 from './RegisterForm2';
import RegisterForm3 from './RegisterForm3';
import { validationSchema } from './userValidation';
import CustomCaptcha from '../Common/ToogleSwitch/CustomCaptcha';
import { FaArrowRotateLeft } from 'react-icons/fa6';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

const UserRegistration = () => {
  const [index, setIndex] = useState(0);
  const [imageData, setImageData] = useState(null);
  const [getAllData, setGetAllData] = useState([]);
  const actor = useSelector((currState) => currState.actors.actor);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmititng] = useState(false);
  const [captchaVisible, setCaptchaVisible] = useState(false);
  const [captcha, setCaptcha] = useState('');
  const [rotating, setRotating] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [captchaError, setCaptchaError] = useState('');
  const [iscaptchaSuccess, setCaptchaSuccess] = useState(false);
  const [isCaptchaLoading, setIsCaptchaLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [isInitialSubmit, setIsInitialSubmit] = useState(false);
  const [isCaptchaFilled, setIsCaptchaFilled] = useState(false);

  const captchaRef = useRef(null);

  const methods = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'all',
    defaultValues: {
      full_name: '',
      email: '',
      links: [{ link: '' }],
      openchat_user_name: '',
      bio: '',
      country: '',
      domains_interested_in: '',
      type_of_profile: '',
      reasons_to_join_platform: '',
      image: null,
    },
  });

  const { handleSubmit, trigger, getValues, formState, watch, resetField } =
    methods;
  const { errors } = formState;

  const formFields = {
    0: ['full_name', 'openchat_user_name'],
    1: ['email'],
    2: [
      'image',
      'reasons_to_join_platform',
      'bio',
      'domains_interested_in',
      'type_of_profile',
      'country',
      'links',
    ],
  };

  const handleNext = async () => {
    const fieldsToValidate =
      index < 2 ? formFields[index] : [...formFields[2], 'captcha'];
    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handleBack = () => {
    if (index > 0 && !isInitialSubmit) {
      setIndex((prevIndex) => prevIndex - 1);
    }
  };

  const startCooldown = () => {
    setCooldown(20);
    const interval = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleCheckboxChange = async () => {
    const newCheckedState = !isChecked;
    setIsChecked(newCheckedState);
    setCaptchaSuccess(false);
    setCaptchaVisible(false);
    if (newCheckedState) {
      setIsCaptchaLoading(true);
      setRotating(true);
      setCaptchaVisible(true);
      try {
        const result = await actor.generate_captcha_with_id();
        if (result) {
          setCaptcha(result);
          setCaptchaSuccess(true);
          startCooldown();
        }
      } catch (error) {
        toast.error('Failed to generate captcha. Please try again.');
        setCaptchaSuccess(false);
      } finally {
        setRotating(false);
        setIsCaptchaLoading(false);
      }
    }
  };

  const refreshCaptcha = async () => {
    if (cooldown > 0) return;
    setIsCaptchaLoading(true);
    try {
      const result = await actor.generate_captcha_with_id();
      if (result) {
        setCaptcha(result);
        captchaRef.current.value = '';
        setCaptchaError('');
        startCooldown();
      }
    } catch (error) {
      toast.error('Failed to generate captcha. Please try again.');
    } finally {
      setIsCaptchaLoading(false);
      setRotating(false);
    }
  };

  useEffect(() => {
    const subscription = watch((value) => {
      setGetAllData(value);
    });
    return () => subscription.unsubscribe();
  }, [watch, setGetAllData]);

  const onSubmitHandler = async () => {
    const data = { ...formData, ...getValues() };
    setFormData(data);
    setCaptchaVisible(true);
    setIsInitialSubmit(true);
  };

  const onFinalSubmit = async () => {
    const data = { ...formData, ...getValues() };
    const captchaInputValue = captchaRef.current.value;

    if (!captchaInputValue) {
      setCaptchaError('Captcha is required. Please enter the captcha.');
      return;
    }

    if (captchaInputValue !== captcha[1]) {
      setCaptchaError('Captcha does not match. Please try again.');
      return;
    }

    setIsSubmititng(true);

    if (actor) {
      const userData = {
        full_name: data?.full_name ?? '',
        email: data?.email ? [data.email] : [],
        social_links: data?.links
          ? [data.links.map((val) => ({ link: val?.link ? [val.link] : [] }))]
          : [],
        openchat_username: data?.openchat_user_name
          ? [data.openchat_user_name]
          : [],
        bio: data?.bio ? [data.bio] : [],
        country: data?.country ?? '',
        area_of_interest: data?.domains_interested_in ?? '',
        type_of_profile: data?.type_of_profile ? [data.type_of_profile] : [],
        reason_to_join: data?.reasons_to_join_platform
          ? [data.reasons_to_join_platform.split(',').map((val) => val.trim())]
          : [],
        profile_picture: imageData ? [imageData] : [],
      };

      try {
        await actor
          .register_user(captcha[0], captchaInputValue, userData)
          .then((result) => {
            if (result.Ok) {
              if (result.Ok.includes('User registered successfully with ID')) {
                toast.success('User registered successfully!');
                setIsSubmititng(false);
                window.location.href = '/dashboard';
              } else {
                toast.success(result.Ok);
                setIsSubmititng(false);
                window.location.href = '/dashboard';
              }
            } else if (result.Err) {
              toast.error(result.Err);
              setIsSubmititng(false);
            } else {
              toast.error('Unknown response from server');
            }
          });
      } catch (error) {
        toast.error(error.message);
        setIsSubmititng(false);
      } finally {
        setIsSubmititng(false);
      }
    } else {
      toast.error('Please signup with internet identity first');
    }
  };

  const onErrorHandler = (val) => {
    console.log('error', val);
  };

  return (
    <>
      <FormProvider {...methods}>
        <div className='bg-[#FFF4ED] px-[5%] min-h-screen flex lg:flex-row items-center justify-center gap-[2%] align-items-stretch'>
          <div className='py-6 w-full flex items-center justify-center rounded-xl lg:max-w-[50%] h-full'>
            <div className='bg-white shadow-xl w-full rounded-2xl flex max-w-6xl h-full'>
              <div className='flex-1 w-full pb-8 p-[5%]  lg:h-[89vh] overflow-y-scroll'>
                {/* <img
                  src={Layer1}
                  alt='logo'
                  className=' text-start w-1/3 lg:w-1/3'
                  loading='lazy'
                  draggable={false}
                /> */}
                <div className='sticky top-0 bg-white z-10 py-2'>
                  <img
                    src={Layer1}
                    alt='logo'
                    className='text-start w-1/3 lg:w-1/3'
                    loading='lazy'
                    draggable={false}
                  />

                  <h2 className='text-[#364152] px-4 mb-3 text-sm font-semibold mt-8 text-start md:text-left'>
                    Step {index + 1} of 3
                  </h2>
                </div>
                <div className='overflow-hidden max-h-[75vh] overflow-y-scroll'>
                  <form
                    onSubmit={handleSubmit(onSubmitHandler, onErrorHandler)}
                    className='w-full '
                  >
                    {index === 0 && <RegisterForm1 />}
                    {index === 1 && <RegisterForm2 />}
                    {index === 2 && (
                      <RegisterForm3 setImageData={setImageData} />
                    )}

                    {captchaVisible && index === 2 && (
                      <div className='ml-4 flex flex-col items-start'>
                        <FormControlLabel
                          required
                          control={
                            <Checkbox
                              checked={isChecked}
                              onChange={handleCheckboxChange}
                              required
                            />
                          }
                          label='Verify that you are not a robot'
                        />
                        <div className='flex flex-col md:flex-row px-4 items-center mt-2'>
                          <div className='flex-1'>
                            <CustomCaptcha
                              text={captcha[1]}
                              isCaptchaLoading={isCaptchaLoading}
                            />
                          </div>
                          {iscaptchaSuccess && (
                            <div className='flex items-center mt-2 md:mt-0 md:ml-4'>
                              <button
                                id='refresh-icon'
                                className='text-blue-600'
                                onClick={refreshCaptcha}
                                disabled={cooldown > 0}
                              >
                                <FaArrowRotateLeft />
                              </button>
                              {cooldown > 0 && (
                                <span className='text-sm text-gray-500 ml-2'>
                                  (Retry After {cooldown}s)
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {iscaptchaSuccess && (
                          <div className='mt-4 w-11/12'>
                            <input
                              ref={captchaRef}
                              type='text'
                              placeholder='Enter captcha'
                              className='border border-gray-300 rounded p-2 w-full'
                              onChange={() => setIsCaptchaFilled(true)}
                            />
                            {captchaError && (
                              <span className='mt-1 text-sm text-red-500 font-bold flex justify-start'>
                                {captchaError}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    <div className='flex pb-2 px-4 mb-4 justify-between mt-8'>
                      <button
                        type='button'
                        className='py-2 px-2 pr-3 text-sm sm:text-sm md:text-base text-gray-600 rounded hover:text-black border-gray-300 border-2'
                        onClick={handleBack}
                        style={{
                          visibility: isInitialSubmit ? 'hidden' : 'visible',
                        }}
                        disabled={index === 0 || isInitialSubmit}
                      >
                        <ArrowBackIcon fontSize='small' className='mr-1 ' />
                        Back
                      </button>

                      {captchaVisible ? (
                        <button
                          type='button'
                          className='py-2 px-3 md:px-4 text-sm sm:text-sm md:text-base disabled:bg-[#D1E0FF] text-white rounded bg-blue-600 border-2 border-[#B2CCFF] flex items-center'
                          onClick={onFinalSubmit}
                          disabled={!isCaptchaFilled}
                        >
                          {isSubmitting ? (
                            <ThreeDots
                              visible={true}
                              height='35'
                              width='35'
                              color='#FFFEFF'
                              radius='9'
                              ariaLabel='three-dots-loading'
                              wrapperStyle={{}}
                            />
                          ) : (
                            'Submit'
                          )}
                        </button>
                      ) : (
                        <>
                          {index === 2 ? (
                            <button
                              type='submit'
                              className='py-2 px-5 md:px-4 bg-[#D1E0FF] text-white rounded hover:bg-blue-600 border-2 border-[#B2CCFF] flex items-center'
                            >
                              {isSubmitting ? (
                                <ThreeDots
                                  visible={true}
                                  height='35'
                                  width='35'
                                  color='#FFFEFF'
                                  radius='9'
                                  ariaLabel='three-dots-loading'
                                  wrapperStyle={{}}
                                />
                              ) : (
                                'Next'
                              )}
                            </button>
                          ) : (
                            <button
                              type='button'
                              className='py-2 px-2 md:px-4 text-sm sm:text-sm md:text-base bg-[#D1E0FF] text-white rounded hover:bg-blue-600 border-2 border-[#B2CCFF] flex items-center'
                              onClick={handleNext}
                            >
                              Continue
                              <ArrowForwardIcon
                                fontSize='small'
                                className='ml-2 '
                              />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className='hidden w-1/2 justify-center lg:flex lg:max-w-[50%] lg:h-[89vh] items-center'>
            <div className='bg-[#EDEAFF]  shadow-xl w-full rounded-2xl flex max-w-6xl h-full'>
              <AboutcardSkeleton getAllData={getAllData} />
            </div>
          </div>
        </div>
      </FormProvider>
      <Toaster />
    </>
  );
};

export default UserRegistration;

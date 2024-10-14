import React, { useState } from 'react';

const LoginModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [heading, setHeading] = useState('Log in');

  // // Function to open the modal
  // const openModal = () => {
  //   setIsModalOpen(true);
  // };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      {/* Modal toggle */}
      {/* <button
          onClick={openModal}
          className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          type="button"
        >
          Toggle modal
        </button> */}

      {/* {isModalOpen && ( */}
      <div className='fixed inset-0 flex items-center justify-center z-10'>
        <div className='relative p-4 w-full max-w-lg'>
          {/* Modal content */}
          <div className='relative bg-white rounded-lg shadow-2xl'>
            {/* Modal header */}
            <div className='flex  text-center p-4 md:p-5 rounded-t '>
              <button
                onClick={closeModal}
                type='button'
                className='end-2.5 bg-transparent hover:text-black rounded-lg text-2xl  ms-auto inline-flex justify-center items-center text-black'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='26'
                  height='8'
                  viewBox='0 0 20 8'
                  fill='none'
                >
                  <path
                    d='M19.2556 4.7793C19.5317 4.77946 19.7557 4.55574 19.7559 4.2796C19.756 4.00346 19.5323 3.77946 19.2562 3.7793L19.2556 4.7793ZM0.902522 3.91471C0.707143 4.10985 0.706953 4.42643 0.902096 4.62181L4.08216 7.80571C4.27731 8.00109 4.59389 8.00128 4.78927 7.80613C4.98465 7.61099 4.98484 7.2944 4.78969 7.09902L1.96297 4.2689L4.7931 1.44217C4.98848 1.24703 4.98867 0.930444 4.79352 0.735065C4.59838 0.539685 4.2818 0.539495 4.08642 0.734639L0.902522 3.91471ZM19.2562 3.7793L1.25616 3.76847L1.25556 4.76847L19.2556 4.7793L19.2562 3.7793Z'
                    fill='#B3B3B3'
                  />
                </svg>
                <span className='sr-only'>Close modal</span>
              </button>
              <h3 className='text-3xl  md:text-4xl font-semibold text-gray-900  flex-grow'>
                {heading}
              </h3>
            </div>
            {/* Modal body */}
            <div className='p-4 md:p-5'>
              <form className='space-y-4' action='#'>
                {heading != 'Sign Up' && (
                  <div className='flex flex-row justify-between text-gray-500 mb-10 font-normal text-sxxs:text-[7px] sxs:text-[7.5px] sxs1:text-[8px] sxs2:text-[8.5px] sxs3:text-[9px] ss:text-[9.5px] ss1:text-[10px] ss2:text-[10.5px] ss3:text-[11px] ss4:text-[11.5px] dxs:text-[12px] xxs:text-[12.5px] xxs1:text-[13px] sm1:text-[13.5px] sm4:text-[14px] sm2:text-[14.5px] sm3:text-[13px] sm:text-[13.5px] md:text-[14px.3] md1:text-[15px] md2:text-[15px] md3:text-[15px] lg:text-[16.5px] dlg:text-[17px] lg1:text-[15.5px] lgx:text-[16px] dxl:text-[16.5px] xl:text-[19px] xl2:text-[19.5px] cursor-pointer'>
                    <p>ADMIN</p>
                    <p>HUB ORGANISERS</p>
                    <p>VC</p>
                    <p>MENTORS</p>
                    <p>PROJECTS</p>
                  </div>
                )}
                {heading === 'Sign Up' && (
                  <>
                    <h1 className=' text-2xl md:text-3xl md  text-center  text-gray-500'>
                      Ready to get Started?
                    </h1>

                    <p className='text-xs md:text-sm text-center pb-6 text-gray-500'>
                      Fill out this form to begin your journey.
                    </p>

                    <p className='text-xs md:text-sm text-center text-gray-500'>
                      What are you?
                    </p>

                    <div className='flex flex-row justify-between text-gray-500 font-semibold  pt-6 text-sxxs:text-[7px] sxs:text-[7.5px] sxs1:text-[8px] sxs2:text-[8.5px] sxs3:text-[9px] ss:text-[9.5px] ss1:text-[10px] ss2:text-[10.5px] ss3:text-[11px] ss4:text-[11.5px] dxs:text-[12px] xxs:text-[12.5px] xxs1:text-[13px] sm1:text-[13.5px] sm4:text-[14px] sm2:text-[14.5px] sm3:text-[13px] sm:text-[13.5px] md:text-[14px.3] md1:text-[15px] md2:text-[15px] md3:text-[15px] lg:text-[16.5px] dlg:text-[17px] lg1:text-[15.5px] lgx:text-[16px] dxl:text-[16.5px] xl:text-[19px] xl2:text-[19.5px] cursor-pointer'>
                      {[
                        'ADMIN',
                        'HUB ORGANISERS',
                        'VC',
                        'MENTORS',
                        'PROJECTS',
                      ].map((role, index) => (
                        <div key={index} className='text-center'>
                          <p>{role}</p>
                          <input
                            type='radio'
                            name='role'
                            value={role}
                            id={role}
                            className='accent-indigo-600'
                          />
                          <label htmlFor={role} className='sr-only'>
                            {role}
                          </label>
                        </div>
                      ))}
                    </div>

                    <button className='w-auto mx-auto block bg-gradient-to-r from-purple-600 via-blue-600 to-blue-800 text-white hover:text-black font-medium rounded-sm text-sm px-8 py-2 text-center'>
                      Continue
                    </button>
                  </>
                )}
                {heading === 'Forget password' && (
                  <p className='text-sm text-center text-gray-500'>
                    Enter the Email ID your account is connected to
                  </p>
                )}
                {heading != 'Sign Up' && (
                  <div>
                    <input
                      type='email'
                      name='email'
                      id='email'
                      className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                      placeholder='Email ID'
                      required
                    />
                  </div>
                )}
                {heading == 'Log in' && (
                  <div>
                    <input
                      type='password'
                      name='password'
                      id='password'
                      placeholder='••••••••'
                      className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm  block w-full p-2.5 required'
                    />
                  </div>
                )}
                {heading != 'Sign Up' && (
                  <button
                    type='submit'
                    className='w-auto mx-auto block bg-gradient-to-r from-purple-600 via-blue-600 to-blue-800 text-white hover:text-black font-medium rounded-md text-sm px-5 py-2 text-center'
                  >
                    Login
                  </button>
                )}
                {heading != 'Sign Up' && (
                  <>
                    <div className='text-sm font-medium text-gray-500 dark:text-gray-300'>
                      <p
                        onClick={() => setHeading('Sign Up')}
                        className='text-blue-700 mx-auto block w-auto text-center cursor-pointer border  py-1 rounded-md border-indigo-700 text-sxxs:text-[7px] sxs:text-[7.5px] sxs1:text-[8px] sxs2:text-[8.5px] sxs3:text-[9px] ss:text-[9.5px] ss1:text-[10px] ss2:text-[10.5px] ss3:text-[11px] ss4:text-[11.5px] dxs:text-[12px] xxs:text-[12.5px] xxs1:text-[13px] sm1:text-[13.5px] sm4:text-[14px] sm2:text-[14.5px] sm3:text-[15px] sm:text-[15.5px] md:text-[13px.3] md1:text-[13px] md2:text-[13.5px] md3:text-[13px] lg:text-[16.5px] dlg:text-[16px] lg1:text-[14.5px] lgx:text-[15px] dxl:text-[17.5px] xl:text-[18px] xl2:text-[18.5px]'
                      >
                        Don't have an account? SIGN UP NOW
                      </p>
                    </div>
                    <p
                      onClick={() => setHeading('Forget password')}
                      className='text-sm text-gray-400 text-center cursor-pointer hover:underline'
                    >
                      Forget password?
                    </p>
                  </>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* )} */}
    </div>
  );
};

export default LoginModal;

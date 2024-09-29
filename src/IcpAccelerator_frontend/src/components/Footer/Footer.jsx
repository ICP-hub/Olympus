import React from 'react';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import XIcon from '@mui/icons-material/X';
import FacebookIcon from '@mui/icons-material/Facebook';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { homepagedata } from '../Utils/jsondata/data/homepageData';

const Footer = () => {
  const { footer } = homepagedata;

  return (
    <div className='w-full mx-auto bg-[rgb(254,246,238)]'>
      <footer className='bg-[rgb(254,246,238)] py-10 px-4 md:px-8 '>
        <div className='max-w-6xl mx-auto'>
          {/* Header section */}
          <div className='flex flex-col md:flex-row justify-between items-center mb-8'>
            <h2 className='text-2xl font-semibold text-center md:text-left mb-4 md:mb-0'>
              {footer.headline}
            </h2>
            <button className='bg-blue-700 text-white text-lg py-3 px-6 rounded-[4px] w-[90%] md:w-auto'>
              {footer.buttonText}
            </button>
          </div>

          {/* Main Content */}
          <div className='border-t border-[#bd10e0bf] pt-8'>
            <div className='flex flex-wrap justify-between'>
              {/* Logo and description */}
              <div
                className='w-full md:w-1/4 mb-8 md:mb-0 
            text-left'
              >
                <h3 className='text-xl font-semibold mb-4'>
                  <img
                    src={footer.logo.logo}
                    alt='logo'
                    className='inline-block'
                    loading='lazy'
                    draggable={false}
                  />
                </h3>
                <p className='text-gray-600 text-sm font-semibold'>
                  {footer.description}
                </p>
              </div>

              {/* Explore, Company, and Resources Section */}
              {['explore', 'company', 'resources'].map((section) => (
                <div key={section}>
                  <h4 className='text-base font-semibold mb-2 text-gray-800'>
                    {footer[section].title}
                  </h4>
                  <ul className='text-gray-600 font-bold'>
                    {footer[section].items.map((item, index) => (
                      <li className='mb-2' key={index}>
                        <a href='/'>{item}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* Newsletter Section */}
              <div className='w-full md:w-auto mt-8 md:mt-0'>
                <h4 className='text-base font-semibold mb-2 text-gray-800'>
                  {footer.newsletter.title}
                </h4>
                <form>
                  <div className='relative w-full mb-4'>
                    <MailOutlineIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
                    <input
                      type='email'
                      placeholder='Enter your email'
                      className='w-full pl-10 p-2 border border-gray-400 rounded-lg'
                    />
                  </div>
                  <button
                    type='submit'
                    className='text-white bg-blue-700 text-lg py-2 px-6 rounded-lg w-full'
                  >
                    {footer.newsletter.buttonText}
                  </button>
                </form>
              </div>
            </div>

            {/* Footer bottom section */}
            <div className='border-t border-gray-200 mt-2 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-600 text-sm'>
              {' '}
              {/* Policies and Social Links for Mobile (vertical alignment) */}
              <div className='flex flex-col md:flex-row w-full md:w-auto justify-between items-start md:items-center space-y-4 md:space-y-0 md:space-x-5'>
                {/* On mobile screens, policies and social icons aligned vertically */}
                {homepagedata.footer.policies.map((policy, index) => (
                  <div
                    key={index}
                    className='flex justify-between w-full md:w-auto items-center'
                  >
                    <a href='/' className='font-bold'>
                      {policy === 'COPYRIGHT_YEAR' ? (
                        <>
                          © {new Date().getFullYear()} Olympus Inc.
                          <br className='md:hidden block' />
                          All Rights Reserved
                        </>
                      ) : (
                        policy
                      )}
                    </a>
                    {/* Social icon next to each policy on mobile */}
                    <div className='mr-2 md:hidden block'>
                      {index === 0 && (
                        <a href='/' aria-label='XIcon'>
                          <XIcon
                            fontSize='medium'
                            style={{ color: 'gray' }}
                            className='md:hidden'
                          />
                        </a>
                      )}
                      {index === 1 && (
                        <a href='/' aria-label='LinkedInIcon'>
                          <LinkedInIcon
                            fontSize='medium'
                            style={{ color: 'gray' }}
                          />
                        </a>
                      )}
                      {index === 2 && (
                        <a href='/' aria-label='FacebookIcon'>
                          <FacebookIcon
                            fontSize='medium'
                            style={{ color: 'gray' }}
                          />
                        </a>
                      )}
                      {index === 3 && (
                        <a href='/' aria-label='GitHubIcon'>
                          <GitHubIcon
                            fontSize='medium'
                            style={{ color: 'gray' }}
                          />
                        </a>
                      )}
                    </div>

                    {/* Policy Text */}
                  </div>
                ))}
              </div>
              {/* Social Links for Medium and Larger Screens */}
              <div className='hidden md:flex space-x-4 mt-4 md:mt-0 justify-center'>
                <a href='/' aria-label='XIcon'>
                  <XIcon fontSize='medium' style={{ color: 'gray' }} />{' '}
                </a>
                <a href='/' aria-label='LinkedInIcon'>
                  <LinkedInIcon fontSize='medium' style={{ color: 'gray' }} />
                </a>
                <a href='/' aria-label='FacebookIcon'>
                  <FacebookIcon fontSize='medium' style={{ color: 'gray' }} />
                </a>
                <a href='/' aria-label='GitHubIcon'>
                  <GitHubIcon fontSize='medium' style={{ color: 'gray' }} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;

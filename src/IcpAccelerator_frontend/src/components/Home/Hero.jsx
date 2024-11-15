import React from 'react';
import { ConnectWallet } from '@nfid/identitykit/react';

const SplineViewerComponent = React.lazy(
  () => import('./SplineViewerComponent')
);

// Inside the main component

import { homepagedata } from '../Utils/jsondata/data/homepageData';

const HeroSection = () => {
  const ConnectBtn = ({ onClick }) => (
    <button
      className='inline-flex items-center px-6 py-3 text-white bg-blue-600 rounded-[4px] hover:bg-blue-700 transition duration-300'
      onClick={onClick}
    >
      {homepagedata.section1.content.buttonText}{' '}
      <homepagedata.section1.arrowForwardIcon.ArrowForwardIcon className='ml-2' />
    </button>
  );
  return (
    <>
      <section
        className={`bg-[${homepagedata.section1.backgroundColor}] relative overflow-hidden`}
      >
        <div className='container mx-auto z-10 relative'>
          <div className='max-w-7xl w-full py-12 px-4 sm:px-6 lg:px-8 mx-auto'>
            <div className='flex flex-col md:flex-row items-start'>
              <div className='w-full md:w-1/2 mb-8 md:mb-0 pt-16'>
                <div className='max-w-[640px]'>
                  <div className='flex items-center gap-2 mb-4'>
                    <span className='text-[#121926] text-xl font-normal'>
                      {homepagedata.section1.content.backedByText}
                    </span>
                    <img
                      src={homepagedata.section1.df_logo.df_logo}
                      alt='Backed by Dfinity'
                      className='h-6'
                      loading='lazy'
                      draggable={false}
                    />
                  </div>
                  <h1 className='text-[2.5rem] sm0:text-[3.5rem] sm3:text-7xl font-bold text-[#121926] leading-tight mb-4'>
                    {homepagedata.section1.content.mainHeading
                      .split(' ')
                      .map((word, index) => {
                        const isHighlighted = word === 'Web3';

                        return isHighlighted ? (
                          <span
                            key={index}
                            className='text-transparent bg-clip-text'
                            style={{
                              backgroundImage:
                                'linear-gradient(to right, #f59e0b, #ec4899, #8b5cf6)',
                              WebkitBackgroundClip: 'text',
                              color: 'transparent',
                            }}
                          >
                            {word}{' '}
                          </span>
                        ) : (
                          <span key={index}>{word} </span>
                        );
                      })}
                  </h1>

                  <p className='text-xl font-medium text-[#364152] mb-6'>
                    {homepagedata.section1.content.description}
                  </p>
                  <button className='inline-flex items-center px-6 py-3 text-white bg-blue-600 rounded-[4px] hover:bg-blue-700 transition duration-300'>
                    {homepagedata.section1.content.buttonText}{' '}
                    <homepagedata.section1.arrowForwardIcon.ArrowForwardIcon className='ml-2' />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='absolute inset-0 z-0 hidden md:block'>
          <React.Suspense fallback={<div>Loading...</div>}>
            <SplineViewerComponent />
          </React.Suspense>
        </div>
        <div className='absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent'></div>
      </section>
      <ConnectWallet connectButtonComponent={ConnectBtn} />
    </>
  );
};

export default HeroSection;

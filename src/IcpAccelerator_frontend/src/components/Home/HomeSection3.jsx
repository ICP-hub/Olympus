import React from 'react';
import { homepagedata } from '../Utils/jsondata/data/homepageData';

export default function HomeSection3() {
  const { homepagesection3 } = homepagedata;

  return (
    <>
      <div className='bg-white  md:pb-40'>
        <div className='container mx-auto'>
          <div className='max-w-6xl w-full md:px-4 sm:px-6 lg:px-8 mx-auto'>
            <div className='p-4 md:p-6'>
              <p className='text-[#121926] text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium mb-5 leading-8 sm:leading-10 md:leading-[50px] lg:leading-[60px] max-w-4xl'>
                {homepagesection3.paragraph1.text}
                <span className='bg-blue-700 font-bold text-white'>
                  {homepagesection3.paragraph1.highlightedText.text}
                </span>{' '}
                {homepagesection3.paragraph2.text}
                <span className='bg-orange-700 font-bold text-white'>
                  {homepagesection3.paragraph2.highlightedText2.text}
                </span>{' '}
                {homepagesection3.paragraph3.text}
                <span className='bg-red-700 font-bold text-white'>
                  {homepagesection3.paragraph3.highlightedText3.text}
                </span>{' '}
                {homepagesection3.paragraph4.text}
                <span className='bg-green-700 font-bold text-white'>
                  {homepagesection3.paragraph4.highlightedText4.text}
                </span>{' '}
                {homepagesection3.paragraph5.text}
              </p>
              <p className='text-[#121926] text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium mb-5 leading-8 sm:leading-10 md:leading-[50px] lg:leading-[60px] max-w-4xl'>
                {homepagesection3.paragraph6.text}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

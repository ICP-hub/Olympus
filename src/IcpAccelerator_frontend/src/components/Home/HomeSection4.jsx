// src/App.js
import React from 'react';
import hubs from '../../../assets/images/hubs.png';
import sec41 from '../../../assets/images/sec41.png';
import sec42 from '../../../assets/images/sec42.png';
import sec43 from '../../../assets/images/sec43.png';
import sec46 from '../../../assets/images/sec46.png';
import sec47 from '../../../assets/images/sec47.png';
import sec48 from '../../../assets/images/sec48.png';
import sec49 from '../../../assets/images/sec49.png';
import sec50 from '../../../assets/images/sec50.png';
import sec51 from '../../../assets/images/sec51.png';
import multichain from '../../../assets/images/multichain.png';
import reputation from '../../../assets/images/reputation.png';
import incubation from '../../../assets/images/incubation.png';
import globalevent from '../../../assets/images/globalevent.png';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
// import "./home.css"
import { homepagedata } from '../Utils/jsondata/data/homepageData';

function HomeSection4() {
  const { homepagesection4 } = homepagedata;
  return (
    <div className='bg-white md:bg-[#FEF6EE] py-10 '>
      <div className='container mx-auto'>
        <div className='max-w-6xl w-full py-8 px-4 sm:px-6 lg:px-8  mx-auto bg-white rounded-lg'>
          <section className='max-w-xl mx-auto'>
            <h1 className='text-3xl font-bold text-center mb-6'>
              {homepagesection4.header.title}
            </h1>
            <p className='text-center text-gray-600 mb-10'>
              {homepagesection4.header.description}
            </p>
          </section>

          <div className='flex flex-col gap-5'>
            {/* 1st flex card start  */}
            <div className=' flex flex-col dlg:flex-row gap-6 mx-1 md:mx-12'>
              {/* left card  */}
              <div className='dlg:basis-[946px] flex flex-col sm5:flex-row rounded-lg shadow-lg overflow-hidden bg-[#EEF2F6]'>
                <div className='px-5'>
                  <div className='max-w-[379px] h-full flex flex-col sm5:justify-between py-4'>
                    <div>
                      <h1 className='text-3xl font-custom text-[#121926] pb-2'>
                        {homepagesection4.card2.content.title}
                      </h1>
                      <p className='pb-6 text-xs font-normal text-[#4B5565]'>
                        {homepagesection4.card2.content.description}
                      </p>
                      {/* <p className='text-xs font-normal text-[#4B5565] mb-2'>
                        {homepagesection4.card1.content.description2}
                      </p> */}
                      <ul className='list-disc pl-5 text-xs text-gray-700 space-y-2 mb-2'>
                        {(homepagesection4.card2.content.listItems || []).map(
                          (item, index) => (
                            <li key={index} className='mb-1.5'>
                              {item}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                    <div className='flex gap-1 flex-wrap '>
                      <span className='bg-white text-xs font-normal text-[#364152] px-3 py-1 rounded-md border-2'>
                        {homepagesection4.card2.content.tags[0]}
                      </span>
                      <span className='bg-white text-xs font-normal text-[#364152] px-3 py-1 rounded-md border-2'>
                        {homepagesection4.card2.content.tags[1]}
                      </span>
                      <span className='bg-white text-xs font-normal text-[#364152] px-3 py-1 rounded-md border-2'>
                        {homepagesection4.card2.content.tags[2]}
                      </span>
                    </div>
                  </div>
                </div>
                <div className='flex justify-center sm5:flex-none'>
                  <img
                    src={homepagesection4.card2.imageSrc.sec47}
                    alt=''
                    className='py-4 object-cover object-center max-w-[241px] max-h-[407px]'
                    loading='lazy'
                    draggable={false}
                  />
                </div>
              </div>
              {/* right card  */}
              <div className='rounded-lg shadow-lg overflow-hidden bg-[#FCE7F6] p-6 pr-0'>
                <div className='flex flex-col lg:flex-row justify-between gap-2 mb-4'>
                  {/* Left Section: Title, Description, and List */}
                  <div className='flex flex-col justify-start'>
                    <h1 className='text-3xl font-custom text-[#121926] pb-2'>
                      {homepagesection4.card1.content.title}
                    </h1>
                    <p className='pb-4 text-sm font-normal text-[#4B5565]'>
                      {homepagesection4.card1.content.description}
                    </p>
                    <ul className='list-disc pl-5 text-sm text-gray-700 space-y-1'>
                      {(homepagesection4.card1.content.listItems || []).map(
                        (item, index) => (
                          <li key={index} className='mb-2'>
                            {item}
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  {/* Right Section: Image */}
                  <div className='flex justify-center items-center'>
                    <img
                      src={homepagesection4.card1.imageSrc.globalevent}
                      alt='Global Event'
                      className='w-[250px] h-auto sm5:h-[280px] rounded-lg object-cover'
                    />
                  </div>
                </div>

                {/* Tags Section */}
                <div className='flex gap-2 flex-wrap justify-center lg:justify-start mt-4 px-5'>
                  {(homepagesection4.card1.content.tags || []).map(
                    (tag, index) => (
                      <span
                        key={index}
                        className='bg-white text-xs font-normal text-[#364152] px-3 py-1 rounded-md border border-gray-300'
                      >
                        {tag}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
            {/* 2nd  flex card start  */}
            <div className='flex flex-col dlg:flex-row gap-6 mx-1 md:mx-12 '>
              {/* left card  */}
              <div className='rounded-lg shadow-lg overflow-hidden bg-[#FFFACD]'>
                <div className='h-full flex flex-col justify-between py-4'>
                  {/* Content Section */}
                  <div className='px-5'>
                    <h1 className='text-3xl font-bold text-[#121926] pb-2'>
                      {homepagesection4.card3.content.title}
                    </h1>
                    <p className='pb-4 text-sm font-normal text-[#4B5565]'>
                      {homepagesection4.card3.content.description}
                    </p>
                    <div className='flex flex-col sm:flex-row gap-2 items-start'>
                      {/* List Section */}
                      <ul className='list-disc pl-5 text-sm text-gray-700 space-y-1 flex-1'>
                        {(homepagesection4.card3.content.listItems || []).map(
                          (item, index) => (
                            <li key={index}>{item}</li>
                          )
                        )}
                      </ul>

                      {/* Image Section */}
                      <div className='flex justify-center items-center '>
                        <img
                          src={homepagesection4.card3.imageSrc.incubation}
                          alt='Incubation'
                          className='w-full h-[150px] object-cover  rounded-lg'
                          // style={{ marginBottom: "20px" }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Tags Section */}
                  <div className='flex gap-2 flex-wrap px-5 mt-3'>
                    {homepagesection4.card3.content.tags.map((tag, index) => (
                      <span
                        key={index}
                        className='bg-white text-xs font-normal text-[#364152] px-3 py-1 rounded-md border'
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* right card  */}
              <div className='dlg:basis-[946px] flex flex-col sm5:flex-row rounded-lg shadow-lg overflow-hidden bg-[#FFF4ED]'>
                <div className='flex justify-center sm5:flex-none'>
                  <img
                    src={homepagesection4.card4.imageSrc.hubs}
                    alt=''
                    className='pt-4 object-cover object-center max-w-[241px] max-h-[324px]'
                    loading='lazy'
                    draggable={false}
                  />
                </div>
                <div className='px-5'>
                  <div className='max-w-[379px] h-full flex flex-col sm5:justify-between py-4'>
                    <div>
                      <h1 className='text-3xl font-custom text-[#121926] pb-2'>
                        {homepagesection4.card4.content.title}
                      </h1>
                      {/* <p className='pb-6 text-xs font-normal text-[#4B5565]'>
                        {homepagesection4.card4.content.description}
                      </p> */}
                      <p className='pb-6 text-xs font-normal text-[#4B5565]'>
                        {homepagesection4.card4.content.description
                          .split('ICP HUBS Network')
                          .map((part, index) => (
                            <>
                              {part}
                              {index <
                                homepagesection4.card4.content.description.split(
                                  'ICP HUBS Network'
                                ).length -
                                  1 && (
                                <span className='underline'>
                                  ICP HUBS Network
                                </span>
                              )}
                            </>
                          ))}
                      </p>
                    </div>
                    <div className='flex gap-1 flex-wrap'>
                      <span className='bg-white text-xs font-normal text-[#364152] px-3 py-1 rounded-md border-2'>
                        {homepagesection4.card4.content.tags[0]}
                      </span>
                      <span className='bg-white text-xs font-normal text-[#364152] px-3 py-1 rounded-md border-2'>
                        {homepagesection4.card4.content.tags[1]}
                      </span>
                      <span className='bg-white text-xs font-normal text-[#364152] px-3 py-1 rounded-md border-2'>
                        {homepagesection4.card4.content.tags[2]}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* 3rd flex card start  */}
            <div className='flex flex-col dlg:flex-row gap-6 mx-1 md:mx-12'>
              {/* left card  */}
              <div className='dlg:basis-[946px] flex flex-col sm5:flex-row rounded-lg shadow-lg overflow-hidden bg-[#FDF4FF]'>
                <div className='flex justify-center sm5:flex-none'>
                  <img
                    src={homepagesection4.card5.imageSrc.multichain}
                    alt=''
                    className='pt-8 object-cover object-center max-w-[241px] max-h-[350px]'
                    loading='lazy'
                    draggable={false}
                  />
                </div>
                <div className='px-5'>
                  <div className='max-w-[379px] h-full flex flex-col sm5:justify-between py-4'>
                    <div>
                      <h1 className='text-3xl font-custom text-[#121926] pb-2'>
                        {homepagesection4.card5.content.title}
                      </h1>
                      <p className='pb-6 text-xs font-normal text-[#4B5565]'>
                        {homepagesection4.card5.content.description
                          .split('Chain Fusion')
                          .map((part, index) => (
                            <>
                              {part}
                              {index <
                                homepagesection4.card5.content.description.split(
                                  'Chain Fusion'
                                ).length -
                                  1 && (
                                <span className='underline'>Chain Fusion</span>
                              )}
                            </>
                          ))}
                      </p>
                    </div>
                    <div className='flex gap-1 flex-wrap'>
                      <span className='bg-white text-xs font-normal text-[#364152] px-3 py-1 rounded-md border-2'>
                        {homepagesection4.card5.content.tags[0]}
                      </span>
                      <span className='bg-white text-xs font-normal text-[#364152] px-3 py-1 rounded-md border-2'>
                        {homepagesection4.card5.content.tags[1]}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {/* right card  */}
              <div className=' rounded-lg shadow-lg overflow-hidden bg-[#F3FEE7] '>
                <div className=' h-full flex flex-col justify-between  py-4 '>
                  {/* mobile screen image  */}
                  <div className=' h-[227px]  block sm5:hidden    '>
                    <div
                      className='h-full sm4:w-[393px] '
                      style={{
                        backgroundImage: `url(${homepagesection4.card3.imageSrc.sec42})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        // width: "393px",
                        marginBottom: '31px',
                        marginTop: '-43px',
                      }}
                    ></div>
                  </div>

                  <div className='relative flex flex-col items-start px-5 pb-2 bg-[#F3FEE7] rounded-lg'>
                    {/* Title */}
                    <h1 className='text-2xl font-bold text-[#121926] pb-3 text-start'>
                      {homepagesection4.card6.content.title}
                    </h1>

                    {/* Description */}
                    <p className='text-sm font-medium text-[#4B5565] pb-6 text-start leading-relaxed z-10'>
                      {homepagesection4.card6.content.description}
                    </p>

                    {/* Tags */}
                    <div className='flex gap-2 flex-wrap justify-center pb-6 absolute -bottom-48'>
                      {homepagesection4.card6.content.tags.map((tag, index) => (
                        <span
                          key={index}
                          className='bg-white text-xs text-[#364152] px-3 py-1 rounded-md border border-[#DDE1E7]'
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Image */}
                    <div
                      className='absolute -bottom-44 right-0 h-52 w-60 bg-cover bg-center'
                      style={{
                        backgroundImage: `url(${homepagesection4.card6.imageSrc.reputation})`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            {/* 4rth  flex card start  */}
            <div className='grid md:grid-col-3 sm:grid-col-2 lg:grid-cols-3 gap-6 mx-1 md:mx-12'>
              {/* left card  */}

              <div className='rounded-lg shadow-lg overflow-hidden bg-[#EFF4FF]'>
                <div className='h-full flex flex-col justify-between pt-4'>
                  {/* Content Section */}
                  <div className='h-fit px-5'>
                    <h1 className='text-3xl font-custom text-[#121926] pb-2'>
                      {homepagesection4.card7.content.title}
                    </h1>
                    <p className='pb-6 text-xs font-normal text-[#4B5565]'>
                      {homepagesection4.card7.content.description}
                    </p>
                  </div>

                  {/* Image Section */}
                  <div
                    className='h-[150px] w-full'
                    style={{
                      backgroundImage: `url(${homepagesection4.card7.imageSrc.sec51})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  ></div>

                  {/* Tags Section */}
                  <div className='py-4 flex items-end px-5'>
                    <div className='flex gap-1 flex-wrap'>
                      <span className='bg-white text-xs font-normal text-[#364152] px-3 py-1 rounded-md border-2'>
                        {homepagesection4.card7.content.tags[0]}
                      </span>
                      <span className='bg-white text-xs font-normal text-[#364152] px-3 py-1 rounded-md border-2'>
                        {homepagesection4.card7.content.tags[1]}
                      </span>
                      <span className='bg-white text-xs font-normal text-[#364152] px-3 py-1 rounded-md border-2'>
                        {homepagesection4.card7.content.tags[2]}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className=' rounded-lg shadow-lg overflow-hidden bg-[#FAFAFA] '>
                <div className=' h-full flex flex-col justify-between  pt-4 '>
                  <div className='h-fit px-5'>
                    <h1 className='text-3xl font-custom text-[#121926] pb-2'>
                      {homepagesection4.card8.content.title}
                    </h1>
                    <p className='pb-6 text-xs font-normal text-[#4B5565]'>
                      {homepagesection4.card8.content.description}
                    </p>
                  </div>
                  <div
                    className=' h-full  py-4 flex items-end px-5'
                    style={{
                      backgroundImage: `url(${homepagesection4.card8.imageSrc.sec48})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      height: '150px',
                      overflow: 'visible',
                    }}
                  >
                    <div className='flex gap-1 flex-wrap'>
                      <span className='bg-white text-xs font-normal text-[#364152] px-3 py-1 rounded-md border-2'>
                        {homepagesection4.card8.content.tags[0]}
                      </span>
                      <span className='bg-white text-xs font-normal text-[#364152] px-3 py-1 rounded-md border-2'>
                        {homepagesection4.card8.content.tags[1]}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className='rounded-lg shadow-lg overflow-hidden bg-[#E3E8EF]'>
                <div className='h-full flex flex-col justify-between pt-4 md:hidden'>
                  {/* Content Section for screens < 975px */}
                  <div className='px-5'>
                    <h1 className='text-3xl font-bold text-[#121926] pb-2'>
                      {homepagesection4.card9.content.title}
                    </h1>

                    <div className='flex flex-col sm:flex-row gap-2 items-start'>
                      {/* List Section */}
                      <ul className='list-disc pl-5 text-sm text-gray-700 space-y-1 flex-1'>
                        {(homepagesection4.card9.content.listItems || []).map(
                          (item, index) => (
                            <li key={index}>{item}</li>
                          )
                        )}
                      </ul>

                      {/* Image Section */}
                      <div className='flex justify-center items-center'>
                        <img
                          src={homepagesection4.card9.imageSrc.sec50}
                          alt='Section Image'
                          className='w-full   sm:h-[150px] object-cover rounded-lg'
                        />
                      </div>
                    </div>
                  </div>

                  {/* Tags Section */}
                  <div className='flex gap-2 flex-wrap px-5 my-3'>
                    {homepagesection4.card9.content.tags.map((tag, index) => (
                      <span
                        key={index}
                        className=' bg-white text-xs font-normal text-[#364152] px-3 py-1 rounded-md border-2'
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Content Section for screens > 975px */}
                <div className='h-full flex flex-col justify-between pt-4 hidden md:flex'>
                  <div className='h-fit px-5'>
                    <h1 className='text-3xl font-custom text-[#121926] pb-2'>
                      {homepagesection4.card9.content.title}
                    </h1>

                    <ul className='list-disc pl-5 text-xs text-gray-700 space-y-2'>
                      {(homepagesection4.card9.content.listItems || []).map(
                        (item, index) => (
                          <li key={index} className='mb-2'>
                            {item}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                  <div
                    className='h-full py-2 flex items-end px-5'
                    style={{
                      backgroundImage: `url(${homepagesection4.card9.imageSrc.sec50})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      overflow: 'visible',
                      height: '150px',
                    }}
                  >
                    <div className='flex gap-1 flex-wrap'>
                      {homepagesection4.card9.content.tags.map((tag, index) => (
                        <span
                          key={index}
                          className='bg-white text-xs font-md text-[#364152] px-3 py-1 rounded-md border-2'
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='mt-10 text-center '>
            <button className='bg-blue-700 text-white px-6 py-3 rounded-[4px] border-2 w-full md:w-auto'>
              {homepagesection4.button.text}
              <homepagesection4.arrowForwardIcon.ArrowForwardIcon className='ml-1' />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeSection4;

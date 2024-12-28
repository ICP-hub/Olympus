// import React from 'react';
// import { homepagedata } from '../Utils/jsondata/data/homepageData';

// export default function HomeSection3() {
//   const { homepagesection3 } = homepagedata;

//   return (
//     <>
//       <div className='bg-white  md:pb-40'>
//         <div className='container mx-auto'>
//           <div className='max-w-6xl w-full md:px-4 sm:px-6 lg:px-8 mx-auto'>
//             <div className='p-4 md:p-6'>
//               <p className='text-[#121926] text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium mb-2  max-w-4xl'>
//                 {homepagesection3.paragraph1.text}
//                 <span className='bg-blue-700 font-bold text-white'>
//                   {homepagesection3.paragraph1.highlightedText.text}
//                 </span>{' '}
//                 {homepagesection3.paragraph2.text}
//                 <span className='bg-orange-700 font-bold text-white'>
//                   {homepagesection3.paragraph2.highlightedText2.text}
//                 </span>{' '}
//                 {homepagesection3.paragraph3.text}
//                 <span className='bg-red-700 font-bold text-white'>
//                   {homepagesection3.paragraph3.highlightedText3.text}
//                 </span>{' '}
//                 {homepagesection3.paragraph4.text}
//                 <span className='bg-green-700 font-bold text-white'>
//                   {homepagesection3.paragraph4.highlightedText4.text}
//                 </span>{' '}
//                 {homepagesection3.paragraph5.text}
//               </p>
//               <p className='text-[#121926] text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium mb-2  max-w-4xl'>
//                 {homepagesection3.paragraph6.text}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
import React from 'react';

export default function HomeSection3() {
  return (
    <div className='bg-white md:pb-40'>
      <div className='container mx-auto'>
        <div className='max-w-6xl w-full md:px-4 sm:px-6 lg:px-8 mx-auto'>
          {/* Mission Statement - Wider Div */}
          <div className='text-center p-4 md:p-6'>
            <p className='text-[#121926] text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium mb-2 max-w-5xl mx-auto'>
              Our mission is to drive{' '}
              <span className='bg-[#F15623] text-white  px-1 rounded'>
                permissionless
              </span>{' '}
              acceleration of Web3.
            </p>
          </div>

          {/* Main Content - Narrower Div */}
          <div className='text-center px-4 md:px-6 max-w-4xl mx-auto py-0 '>
            <p className='text-[#121926] text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium mb-4'>
              We bring{' '}
              <span className='bg-black text-white px-1 rounded'>
                bold ideas
              </span>{' '}
              to the market, add value for key
            </p>
            <p className='text-[#121926] text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium mb-4'>
              stakeholders to{' '}
              <span className='bg-[#6EF1B4] text-black px-1 rounded'>
                co-create
              </span>{' '}
              the next unicorns together.
            </p>

            <div className='mt-6 space-y-4'>
              <p className='text-[#121926] text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium mb-2'>
                <span className='bg-[#155EEF] text-white px-2 rounded'>
                  Founders
                </span>{' '}
                access the resources and network needed.
              </p>
              <p className='text-[#121926] text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium mb-2'>
                <span className='bg-[#FDC74B] text-black px-2 rounded'>
                  Investors
                </span>{' '}
                discover and engage with projects at scale.
              </p>
              <p className='text-[#121926] text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium mb-2'>
                <span className='bg-[#17B26A] text-white px-2 rounded'>
                  Mentors
                </span>{' '}
                elevate projects' potential.
              </p>
            </div>
          </div>

          {/* Community and Talent - Wider Div */}
          <div className='text-center p-4 md:p-6'>
            <p className='text-[#121926] text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium mb-2 max-w-5xl mx-auto'>
              <span className='bg-[#924740] text-white px-2 rounded'>
                Community
              </span>{' '}
              and{' '}
              <span className='bg-[#995FDD] text-white px-2 rounded'>
                Talent
              </span>{' '}
              fuels the heart of decentralized growth.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

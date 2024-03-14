import React from 'react';
import  Frame from "../../../../assets/images/Frame.png";
import girl from "../../../../assets/images/girl.jpeg";
const Announcement = () => {
  return (
    <div className='py-[4%] '>
    <div className='flex justify-between items-end py-2'>
        <h1 className='text-[#3505B2] font-bold text-xl'>Announcement</h1>
        <button className='px-2 bg-blue-900 text-white text-xs rounded-md py-2'>Add announcement</button>
    </div>
    <div className='text-black font-bold text-xl py-2 '>
    <p>New Feature</p>
    </div>
    <div className='flex flex-row flex-wrap'>
 
  <div className='w-full lg:w-1/2'>
    <p className='py-2'>
      The Student Side Dashboard provides students with access to the assigned tests and assessments created by their respective teachers. Students can log in to their accounts, view a list of available tests, and choose the tests they want to attempt. The dashboard allows them to navigate through the tests, answer questions, and submit their responses within the specified time limit. Upon completing a test, students can view their scores and performance summary. The platform provides immediate feedback, highlighting correct and incorrect answers, helping students identify areas that require improvement. They can also access their historical test results and track their progress over time.
    </p>
  </div>
  <div className='w-full lg:w-1/2 flex flex-col justify-center items-center relative '>
    <img className='w-[342.7px] h-[194.92px]' src={Frame} alt='gdvuj' />
    <div className="absolute h-24 w-24 rounded-full ml-[210px] dxs:ml-[270px] mt-32" style={{ backgroundImage: 'linear-gradient(to bottom, #7283EA, white)' }}></div>

    <img className="absolute h-20 w-20 rounded-full flex ml-[210px] dxs:ml-[270px] mt-32 justify-center items-center"src={girl} alt="h" />



    <p className='text-[#7283EA] mr-auto dxs:mr-0 font-bold'>Announced by MS.Lucy</p>
  </div>
</div>

</div>

  )
}

export default Announcement;
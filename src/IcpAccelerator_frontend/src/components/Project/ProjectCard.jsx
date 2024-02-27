import React from 'react'
import ment from '../../../assets/images/ment.jpg';

function ProjectCard() {
  return (
    <div className='p-3 flex items-center bg-[#FFFFFF4D] border-[#E9E9E9] border-1 drop-shadow-[#0000000D] rounded-[10px]'>
        <div className='p-4'><img src={ment} alt='ment' className='w-12 aspect-square object-cover rounded-md' /></div>
        <div className='flex justify-between items-center w-full'>
            <div className='px-2'>
                <div className='flex items-center'>
                    <p className="font-[950] text-2xl pr-2">builder.fi</p>
                    <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.4735 1.54094C9.02098 0.64994 7.75319 1.009 6.99159 1.58095C6.67932 1.81546 6.52318 1.93272 6.43132 1.93272C6.33945 1.93272 6.18331 1.81546 5.87104 1.58095C5.10944 1.009 3.84165 0.64994 2.38909 1.54094C0.482769 2.71028 0.0514138 6.56799 4.44856 9.82259C5.28608 10.4425 5.70484 10.7524 6.43132 10.7524C7.15779 10.7524 7.57655 10.4425 8.41407 9.82259C12.8112 6.56799 12.3799 2.71028 10.4735 1.54094Z" stroke="#7283EA" strokeLinecap="round"/>
                    </svg>
                </div>
                <div className='flex text-sm text-[#737373]'>
                    <p className='flex font-[450]'>Proposer: <span className='font-normal pl-2'>fine_web3</span></p>
                    <p className='flex items-center pl-4'>Categories: <span className='bg-[#B5B5B54D] mx-1 px-2 rounded-full'>Infrastructure</span><span className='bg-[#B5B5B54D] mx-1 px-2 rounded-full'>Tooling</span></p>
                </div>
                <div className='flex items-center text-[#737373]'>
                    <p className='flex items-center'>Chains:</p>
                    <p className='text-[10px] font-[450] pl-1'>+6 more</p>
                </div>
            </div>
            <div className='w-full text-right pr-4'>
                <button className='font-[950] border text-[#3505B2] py-[7px] px-[9px] rounded-md border-[#C7C7C7] bg-[#FFFFFF] text-nowrap'>Visit</button>
            </div>
        </div>
    </div>
  )
}

export default ProjectCard

import React from 'react'
import inv from "../../../assets/images/inv.jpeg"



const InvestedProjects = () => {
  return (
    <div className="flex flex-wrap rounded-3xl h-auto justify-between ">
    <div className="w-full  p-4">
        <div className=" shadow-md rounded-lg  overflow-hidden border-2 drop-shadow-2xl gap-4 bg-white">
            <img className='h-26 w-full  mx-auto rounded-3xl p-4' src={inv} alt='not found' />
            <div className='flex justify-end mr-2'>
                <p className='text-gray-300 font-bold text-md '>project 2</p>
            </div>

            <div className='ml-2'>

                <div className='text-2xl text-black flex flex-row space-x-2'>
                    <div></div>
                    <img className=' w-14 h-14 rounded-md' src={ment} alt='No img' />
                    <div className='flex flex-col text-[15px]'>
                        <h3 className='font-bold'>Dirac Finance</h3>
                        <p className='mt-[-2px]'>DeFi</p>
                    </div>
                </div>
                <div className='p-4'>
                    <p className="text-[#6B7280] mt-2 ">Dirac Finance is an institutional-grade decentralized Options Vault (DOV) that...</p>

                </div>
                <div className='flex justify-center mb-2'>
                    <p className='font-extrabold text-black text-xl'>Amount Invested</p>
                </div>
                <div className='bg-[#B8B8B8] rounded-md flex justify-center mr-2'>
                    <button className='text-extrabold flex justify-center px-2 py-2 text-[#4E5999] font-bold '>$ 10000 USD</button>
                </div>
                <div className='flex   mt-4 text-sm bg-[#3505B2]  rounded-md justify-center mr-2 '>
                    {/* <button className=" flex justify-center items-center text-white px-4 py-2 font-bold ">See projects</button> */}
                </div>
            </div>

        </div>
    </div>

</div>
  )
}

export default InvestedProjects

import React, { useState } from 'react';
import { time } from '../Utils/Data/SvgData';


const Roadmap = () => {
    const [activeWord, setActiveWord] = useState('');

    const handleMouseEnter = (word) => {
        setActiveWord(word);
    };

    const handleMouseLeave = () => {
        setActiveWord('');
    };

    return (
        <div className='p-4'>
            <div className="flex flex-wrap justify-start gap-4  text-[#737373]">
                <div
                    className={`cursor-pointer group font-bold ${activeWord === 'Roadmap' && 'border-b-2 border-black pb-1'
                        }`}
                    onMouseEnter={() => handleMouseEnter('Roadmap')}
                    onMouseLeave={handleMouseLeave}
                >
                    Roadmap
                </div>
                <div
                    className={`cursor-pointer group font-bold ${activeWord === 'Feedback' && 'border-b-2 border-black pb-1 '
                        }`}
                    onMouseEnter={() => handleMouseEnter('Feedback')}
                    onMouseLeave={handleMouseLeave}
                >
                    Feedback
                </div>
            </div>
            <div>
                <h1 className='bg-gradient-to-r from-purple-800 to-blue-500 text-transparent bg-clip-text font-extrabold mt-2 text-2xl'>Boards</h1>
            </div>
            <div className="flex flex-wrap justify-start gap-4  text-[#3505B2] mt-2">
                <div
                    className="cursor-pointer group font-bold  border-2 border-[#737373] rounded-lg px-2 py-2 "
                >
                    <h1 className='font-bold'>Request a feature <span className='text-[#3505B2] ml-14 '>5</span></h1>
                </div>
                <div
                    className="cursor-pointer group font-bold border-2 border-[#737373]  rounded-lg px-2 py-2 " >
                    <h1 className='font-bold'> Request a suggestion<span className='text-[#3505B2] ml-14'>1</span></h1>
                </div>
            </div>
            <div>
                <h1 className='bg-gradient-to-r from-purple-800 to-blue-500 text-transparent bg-clip-text font-extrabold mt-4 text-2xl'>Roadmap</h1>
            </div>
            <div className='flex flex-wrap mt-4 gap-4 '>
                <div>
                    <div class='flex bg-gray-300 w-[300px] text-2xl items-center rounded-md rounded-b-none'>
                        <span class='rounded-full bg-[#49A500] w-[17px] h-[17px] ml-10 '></span>
                        <p class='ml-2 py-4 px-4 bg-gradient-to-r from-purple-800 to-blue-500 text-transparent bg-clip-text font-bold '>Planned</p>
                    </div>

                    <div className='flex-row h-[300px] bg-[#E9E9E9] w-[300px] rounded-md rounded-t-none overflow-y-auto'>
                        <div className='flex-col flex justify-between ml-16 '>
                            <h1 className='text-black font-bold mt-4'>Video in project ptofile </h1>
                            <p className='text-[#737373]'>Request a feature</p>
                        </div>

                    </div>
                </div>
                <div>
                    <div class='flex bg-gray-300 w-[300px] text-2xl items-center rounded-md rounded-b-none '>
                        <span class='rounded-full bg-[#9747FF] w-[17px] h-[17px] ml-10 '></span>
                        <p class='ml-2 py-4 px-4 bg-gradient-to-r from-purple-800 to-blue-500 text-transparent bg-clip-text font-bold '>In Progress</p>
                    </div>

                    <div className='flex-row h-[300px] bg-[#E9E9E9] w-[300px] rounded-md rounded-t-none overflow-y-auto'>
                        <div className='flex-col flex justify-between  '>
                            <p className='text-black font-bold flex justify-center mt-[100px]'> {time}</p>
                            <h1 className='text-black font-bold  flex justify-center'>Share your feedback</h1>
                            <p className='text-[#737373] flex justify-center'>Check back here for updates</p>
                        </div>
                    </div>
                </div>
                <div>
                    <div class='flex bg-gray-300 w-[300px] text-2xl items-center rounded-md rounded-b-none '>
                        <span class='rounded-full bg-[#49A500] w-[17px] h-[17px] ml-10 '></span>
                        <p class='ml-2 py-4 px-4 bg-gradient-to-r from-purple-800 to-blue-500 text-transparent bg-clip-text font-bold '>Complete</p>
                    </div>

                    <div className='flex-row h-[300px] bg-[#E9E9E9] w-[300px] rounded-md rounded-t-none overflow-y-auto'>
                        <div className='flex-col flex justify-between ml-16 '>
                            <h1 className='text-black font-bold mt-4'>Starknet </h1>
                            <p className='text-[#737373]'>Request a feature</p>
                        </div>
                    </div>
                </div>

            </div>

        </div>

    )
}

export default Roadmap;
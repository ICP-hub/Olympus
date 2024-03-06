import React from 'react'
import { paper1, paper2, paper3, paper4, rectangle, Vector } from "../Utils/Data/SvgData";

const Hubcards = () => {
    return (

        <div className="w-full flex drop-shadow-xl flex-row justify-center rounded-lg  text-[#737373]  h-[300px] md:lg:mt:0 mt-8 md:lg:mb:0 mb-8 ">
            <div className="flex-row flex flex-wrap gap-4 justify-center">
                <div className="rounded-lg flex justify-center items-center flex-col
                 h-36 w-52 bg-[#FFFFFF] hover:text-white drop-shadow-xl border-2 hover:bg-[#3505B2]">
                    <div className="bg-[#A995E6] h-11 w-14 rounded-md flex justify-center items-center mr-36">
                        {paper1}
                    </div>
                    <div className="font-bold text-lg">
                        <p className="">Live Projects</p>
                    </div>
                    <p className="font-extrabold w-[59px] h-[62px] text-[#000000] flex justify-center text-5xl hover:text-white">20</p>
                </div>
                <div className="rounded-lg flex justify-center items-center flex-col  h-36 w-52 bg-[#FFFFFF] hover:text-white drop-shadow-xl border-2 hover:bg-[#3505B2]">
                    <div className="bg-[#E1B18F] h-11 w-14 rounded-md flex justify-center items-center mr-36">
                        {paper2}
                    </div>
                    <div className="font-bold text-lg">
                        <p className="">Listed Projects</p>
                    </div>
                    <p className="font-extrabold w-[59px] h-[62px] text-[#000000] flex justify-center text-5xl hover:text-white">20</p>
                </div>
                <div className="rounded-lg flex justify-center items-center flex-col h-36   w-52 bg-[#FFFFFF] hover:text-white hover:bg-[#3505B2] drop-shadow-xl border-2">
                    <div className="h-11 w-14 rounded-md flex justify-center items-center bg-[#BCFFCF] mr-36">
                        {paper3}
                    </div>
                    <div className="flex justify-center flex-col items-center font-bold text-lg">
                        <p className="">Approved project</p>
                        <p className="font-extrabold w-[59px] h-[62px] text-[#000000] flex justify-center text-5xl hover:text-white">35</p>
                    </div>
                </div>
                <div className="rounded-lg flex justify-center items-center flex-col h-36 w-52 hover:text-white hover:bg-[#3505B2] drop-shadow-xl border-2">
                    <div className="h-11 w-14 rounded-md flex justify-center items-center bg-[#FEA0A0] mr-36">
                        {paper4}
                    </div>
                    <div className="flex justify-center flex-col items-center font-bold text-lg  ">
                        <p className="">Decline Projects</p>
                        <p className="font-extrabold w-[59px] h-[62px] text-[#000000] flex justify-center text-5xl hover:text-white ">35</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Hubcards;
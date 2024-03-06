import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import Hubdashboardlive from "../Hubdashboardlive/Hubdashboardlive";

import ApexChart from "react-apexcharts";
import { paper1, paper2, paper3, paper4, rectangle, Vector } from "../Utils/Data/SvgData";

const Board = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState("DASHBOARD");
  const [donutOptions, setDonutOptions] = useState({});
  const [donutSeries, setDonutSeries] = useState([44, 55, 41, 17, 15,20]);
  const [donutLabels, setDonutLabels] = useState(['']);

  const options = {
    series: [{
      name: 'Website Blog',
      type: 'column',
      data: [440, 505, 414, 671, 227, 413, 201, 352, 752, 320, 257, 160]
    }],
    chart: {
      height: 350,
      type: 'bar',
    },
    stroke: {
      width: [0, 4]
    },
    title: {
      text: 'All projects from past 1 year'
    },
    dataLabels: {
      enabled: true,
      enabledOnSeries: [1]
    },
    labels: ['01 Jan 2001', '02 Jan 2001', '03 Jan 2001', '04 Jan 2001', '05 Jan 2001', '06 Jan 2001', '07 Jan 2001', '08 Jan 2001', '09 Jan 2001', '10 Jan 2001', '11 Jan 2001', '12 Jan 2001'],
    xaxis: {
      type: 'datetime'
    },
    yaxis: [{
      title: {
        text: 'Website Blog',
      },
    }]
  };
  
  const handleLiveProjectsClick = () => {
    navigate('/');
  };
  
  return (
    <div className='flex flex-col p-4'>
      <div className="left-4 lg:left-auto bg-gradient-to-r from-purple-900 to-blue-500 text-transparent bg-clip-text text-2xl font-extrabold ml-8">
        {selectedOption}
      </div>

      <div className="flex lg:flex-row flex-col  w-full flex-wrap lg:flex-nowrap space-x-2 px-[4%] justify-center items-center  ">

        <div className="ml-8 w-full md:w-1/2 flex h-[320px] flex-col md:flex-row  mt-4 ">

          <div className="bg-[#FFFFFF] drop-shadow-2xl p-4 md:h-auto rounded-lg text-[#737373] font-bold border-2 flex flex-col md:flex-row md:items-center">
            <div className="flex flex-col md:flex-grow md:mr-4">

              <p>Average of<span className="text-[#4B1FD5] text-4xl font-extrabold">20</span></p>
              <p>Projects per month</p>
              <div className="border-b border-2 border-[#000000] mt-2 w-36"></div>

              <div className="mt-4">
                {Vector}

                <p>Increment of<span className="text-[#4B1FD5] text-4xl font-extrabold">7</span>Projects</p>
                <p>from last month</p>
              </div>
            </div>
            <div className="mt-2 md:mt-0 flex justify-center items-center flex-wrap bg-gradient-to-r from-indigo-400 to-purple-400 rounded-lg ">
              <div className="overflow-x-auto">
                <ApexChart options={options} series={options.series} type="bar" width="350" />
              </div>
            </div>
          </div>
        </div>

        <div  className="md:w-1/2 w-full flex  justify-center drop-shadow-xl items-center  rounded-lg  text-[#737373]  h-[300px] md:lg:mt:0 mt-52 lg:mt-8 md:lg:mb:0 mb-8 ">
          <div className="p-4 flex-row space-y-8">
            <div onClick={handleLiveProjectsClick} className="rounded-lg flex justify-center items-center  flex-col lg-ml-0 ml-4 h-36  w-52 bg-[#FFFFFF] drop-shadow-xl border-2  ">
              <div className="bg-[#A995E6] h-11 w-14 rounded-md flex justify-center items-center mr-36">
                {paper1}
              </div>
              <div className="font-bold text-lg">
                <p>Live Projects</p>
              </div>
              <p className="font-extrabold  w-[59px] h-[62px] text-[#000000] flex justify-center text-5xl">20</p>
            </div>
            <div onClick={handleLiveProjectsClick} className="rounded-lg flex justify-center items-center  flex-col lg-ml-0 ml-4  h-36  w-52 bg-[#FFFFFF] drop-shadow-xl border-2  ">
              <div className="bg-[#E1B18F] h-11 w-14 rounded-md flex justify-center items-center mr-36 ">
                {paper2}
              </div>
              <div className="font-bold text-lg">
                <p>Listed Projects</p>
              </div>
              <p className="font-extrabold  w-[59px] h-[62px] text-[#000000] flex justify-center text-5xl">20</p>
            </div>
          </div>
          <div className="p-4 flex-row space-y-8 ">
            <div onClick={handleLiveProjectsClick} className="rounded-lg flex justify-center items-center flex-col h-36  w-52 bg-[#FFFFFF] drop-shadow-xl border-2  ">
              <div className=" h-11 w-14 rounded-md flex justify-center items-center  bg-[#BCFFCF] mr-36">
                {paper3}
              </div>
              <div className="flex justify-center flex-col items-center font-bold text-lg">
                <p>Approved project</p>
                <p className="font-extrabold -[59px] h-[62px] text-[#000000] flex justify-center text-5xl">35</p>
              </div>
            </div>

            <div  onClick={handleLiveProjectsClick} className="rounded-lg flex justify-center items-center flex-col h-36  w-52 bg-[#FFFFFF] drop-shadow-xl border-2  ">
              <div className=" h-11 w-14 rounded-md flex justify-center items-center  bg-[#FEA0A0] mr-36">
                {paper4}
              </div>
              <div className="flex justify-center flex-col items-center font-bold text-lg">
                <p>Decline Projects</p>
                <p className="font-extrabold  w-[59px] h-[62px] text-[#000000] flex justify-center text-5xl">35</p>
              </div>
            </div>
          </div>
        </div>
      </div>













      <div className="flex flex-row w-full flex-wrap md:flex-nowrap px-[4%] py-[2%] h-[400px]  justify-between items-center gap-4  ">
       
          <div className="bg-[#FFFFFF] md:w-1/2 w-full drop-shadow-2xl h-full py-[4%] px-[2%]  rounded-lg text-[#737373] font-bold border-2 flex flex-col md:flex-row md:items-center">
          
            <div>
              <div className='donut overflow-x-auto text-md'>
              <p className="p-4 ">Total leveled Project past week</p>
                <ApexChart options={donutOptions} series={donutSeries} type="donut" width="380"/>
               
              </div>
            </div>
        
          </div>
        {/* </div> */}

        <div className="md:w-1/2 py-[4%]   w-full justify-  items-start h-full  rounded-lg  overflow-y-auto bg-[#FFFFFF] drop-shadow-2xl   text-[#15192C] font-bold border-2 ">
          <div className="flex flex-col text-xl text-[#737373] ">
            <div className="p-4 text-[#15192C]">
              <p>Project Category</p>
            </div>
            <div className="p-4 flex flex-row justify-around">
              <div className="flex-row flex gap-4">
                 <div className="mt-1">
                {rectangle}
              </div>  
              <p>Infrastructure</p>
              </div>
              <p className="text-[#4B1FD5]">15</p>
            </div>
            <div className="p-4 flex flex-row justify-around">
              <div className="flex-row flex gap-4">
                 <div className="mt-1">
                {rectangle}
              </div>  
              <p>Infrastructure</p>
              </div>
              <p className="text-[#4B1FD5]">15</p>
            </div>
            <div className="p-4 flex flex-row justify-around">
              <div className="flex-row flex gap-4">
                 <div className="mt-1">
                {rectangle}
              </div>  
              <p>Infrastructure</p>
              </div>
              <p className="text-[#4B1FD5] ">15</p>
            </div>
            <div className="p-4 flex flex-row justify-around">
              <div className="flex-row flex gap-4">
                 <div className="mt-1">
                {rectangle}
              </div>  
              <p>Infrastructure</p>
              </div>
              <p className="text-[#4B1FD5] ">15</p>
            </div>
            <div className="p-4 flex flex-row justify-around">
              <div className="flex-row flex gap-4">
                 <div className="mt-1">
                {rectangle}
              </div>  
              <p>Infrastructure</p>
              </div>
              <p className="text-[#4B1FD5] ">15</p>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
};

export default Board;

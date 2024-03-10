import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Hubdashboardlive from "../Hubdashboardlive/Hubdashboardlive";
import { Memberssvg } from "../Utils/Data/SvgData";
import founder from "../../../assets/images/founder.png";
import hub from "../../../assets/images/hub.png";
import vc from "../../../assets/images/vc.png";
import mentor from "../../../assets/images/mentor.png";



import ApexChart from "react-apexcharts";
import ReactApexChart from 'react-apexcharts';

import { rectangle } from "../Utils/Data/SvgData";

const Admingraph = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState("DASHBOARD");
  const [donutOptions, setDonutOptions] = useState({});
  const [donutSeries, setDonutSeries] = useState([44, 55, 41]);
  const [donutLabels, setDonutLabels] = useState(['']);
  const seriesData = [{
    name: 'Sales',
    data: [30, 40, 35, 50, 49, 60, 70, 91, 125]
  }];



  const icp = {
    series: [{
      name: 'Sales',
      data: [4, 3, 10, 9, 29, 19, 22, 9, 12, 7, 19, 5, 13, 9, 17, 2, 7, 5]
    }],
    chart: {
      height: 350,
      type: 'line',
    },
    forecastDataPoints: {
      count: 7
    },
    stroke: {
      width: 5,
      curve: 'smooth'
    },
    xaxis: {
      type: 'datetime',
      categories: ['1/11/2000', '2/11/2000', '3/11/2000', '4/11/2000', '5/11/2000', '6/11/2000', '7/11/2000', '8/11/2000', '9/11/2000', '10/11/2000', '11/11/2000', '12/11/2000', '1/11/2001', '2/11/2001', '3/11/2001', '4/11/2001', '5/11/2001', '6/11/2001'],
      tickAmount: 5,
      labels: {
        formatter: function (value, timestamp, opts) {
          return opts.dateFormatter(new Date(timestamp), '')
        }
      }
    },
    title: {
      text: '',
      align: 'left',
      style: {
        fontSize: "16px",
        color: '#666'
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        gradientToColors: ['#FDD835'],
        shadeIntensity: 1,
        type: 'horizontal',
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100, 100, 100]
      },
    },
    yaxis: {
      min: 10,
      max: 100,
      mid: 400
    }
  };













  const options = {
    series: [{
      name: 'Website Blog',
      type: 'column',
      data: [440, 505, 414, 671, 227, 413, 201, 352, 752, 320]
    }],
    chart: {
      height: 350,
      type: 'bar',
    },
    stroke: {
      width: [0] 
    },
    title: {
      text: 'Total Users '
    },
    dataLabels: {
      enabled: true,
      enabledOnSeries: [1]
    },
    labels: ['jan', 'Feb', 'Mar', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],

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
    <div className='p-4 h-auto'>
      <div className="left-4 lg:left-auto bg-gradient-to-r from-purple-900 to-blue-500 text-transparent bg-clip-text text-lg font-extrabold ml-8">
        {selectedOption}
      </div>

      <div className="flex lg:flex-row flex-col  w-full flex-wrap lg:flex-nowrap space-x-2 px-[4%] justify-start item-start gap-16  ">


        <div className="flex flex-col md:flex-row gap-12">
          <div className="rounded-lg flex justify-center  flex-col h-[190px] w-[395px] bg-[#B9C0F2] drop-shadow-xl border-2  ">
            <div className="absolute bottom-0 left-0 w-36 h-40 bg-gradient-to-r from-purple-300 via-purple-400 to-purple-600 ellipse-quarter-left rounded-md"></div>
            <div className="absolute top-0 right-0 bg-gradient-to-br from-indigo-100 to-purple-600 w-28 h-28 ellipse-quarter-right rounded-md"></div>

            <div className="flex  flex-col items-center justify-start font-bold text-lg text-white z-10">
              <p className="flex justify-start">Total Revenue</p>
              <p className="font-extrabold -[59px] h-[62px] text-white flex justify-center text-5xl">$1005.095</p>
            </div>
          </div>
          <div className="rounded-lg flex justify-center items-center flex-col h-[190px] w-[395px]  bg-[#B9C0F2]  drop-shadow-xl border-2  ">
            <div className="absolute bottom-0 left-0 w-36 h-40 bg-gradient-to-r from-purple-300 via-purple-400 to-purple-600 ellipse-quarter-left rounded-md"></div>
            <div className="absolute top-0 right-0 bg-gradient-to-br from-indigo-100 to-purple-600 w-28 h-28 ellipse-quarter-right rounded-md"></div>

            <div className="flex  flex-col items-start justify-start font-bold text-lg text-white z-10">
              <p className="flex justify-start">Total Revenue</p>
              <p className="font-extrabold -[59px] h-[62px] text-white flex justify-center text-5xl">$1005.095</p>
            </div>
          </div>
        </div>





        <div className="rounded-lg flex justify-start items-center flex-col h-[285px] lg:md:w-[279px] w-[370px] drop-shadow-xl bg-gray-200 drop- border-2  ">

          <div className="flex justify-center flex-col items-center font-bold text-lg">
            <p>Top Countries</p>

          </div>
        </div>


      </div>
























      <div className="flex flex-row w-full flex-wrap md:flex-nowrap px-[4%] py-[5%] h-[100px]  lg:mt-[-130px] gap-8  ">
        <div className="flex flex-col gap-4 ">
          <div className="rounded-lg flex justify-center items-center h-[80px] w-[236px] bg-[#B9C0F2]  drop-shadow-xl border-2   ">

            <div className="flex  flex-row items-center justify-start font-bold text-lg text-black gap-8">
              <img src={founder} alt="founder" />
              <p className="flex justify-start">vipul</p>
              <p className="font-extrabold w-[59px] h-[62px] flex  text-2xl justify-center items-center">125</p>
            </div>
          </div>

          <div className="rounded-lg flex justify-center items-center flex-col h-[80px] w-[236px] bg-[#B9C0F2]  drop-shadow-xl border-2  ">
            <div className="flex  flex-row items-center justify-start font-bold text-lg text-black gap-8">
              <img src={hub} alt="founder" />
              <p className="flex justify-start">taneja</p>
              <p className="font-extrabold -[59px] h-[62px] flex  text-2xl justify-center items-center">125</p>
            </div>
          </div>
        </div>



        <div className="flex flex-col gap-4">
          <div className="rounded-lg flex justify-center items-center h-[80px] w-[236px] bg-[#B9C0F2]  drop-shadow-xl border-2   ">

            <div className="flex  flex-row items-center justify-start font-bold text-lg text-black gap-8">
              <img src={mentor} alt="founder" />
              <p className="flex justify-start">vipul</p>
              <p className="font-extrabold w-[59px] h-[62px] flex  text-2xl justify-center items-center">125</p>
            </div>
          </div>

          <div className="rounded-lg flex justify-center items-center flex-col h-[80px] w-[236px] bg-[#B9C0F2]  drop-shadow-xl border-2  ">
            <div className="flex  flex-row items-center justify-start font-bold text-md text-black gap-4 ">
              <img src={vc} alt="founder" />
              <p className="flex justify-start">Hub Organizer</p>
              <p className="font-extrabold w-[59px] h-[62px] flex  text-2xl justify-center items-center">125</p>
            </div>
          </div>
        </div>









        <div className="rounded-lg flex justify-center items-center flex-col h-[140px] w-[303px] bg-[#B9C0F2]  drop-shadow-xl border-2  ">
          <div className="mt-6">
            <ReactApexChart options={icp} series={seriesData} type="line" height={150} />
          </div>
        </div>
      </div>











      <div className="flex lg:flex-row flex-col gap-2  w-full flex-wrap lg:flex-nowrap space-x-[-70px] px-[4%] py-[8%] justify-start item-start  ">

        <div className="rounded-lg flex justify-center items-center mr-32 flex-col h-[300px] lg:w-[860px] w-[350px] mt-[480px] lg:mt-2 md:mt-4 bg-[#B9C0F2]  drop-shadow-xl border-2 overflow-x-auto  ">


          <div className="flex  flex-col items-start justify-start font-bold text-lg text-white z-10 ">
            <div className=" flex justify-center">
              <ApexChart className="" options={options} series={options.series} type="bar" width="750" height="280px" />
            </div>
          </div>
        </div>
        <div className="rounded-lg flex justify-center items-center mt-[2px]  flex-col h-[400px] lg:md:w-[345px] w-[400px] drop-shadow-xl bg-gray-200 drop- border-2   ">

          <div className="flex justify-center flex-col items-center font-bold text-lg">
            <div className='donut overflow-x-auto text-md flex justify-center items-center'>

              <ApexChart options={donutOptions} series={donutSeries} type="donut" width="380" />

            </div>

          </div>
        </div>


      </div>





    </div>
  );
};

export default Admingraph;

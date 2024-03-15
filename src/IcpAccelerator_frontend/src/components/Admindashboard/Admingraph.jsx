import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Hubdashboardlive from "../../../../IcpAccelerator_frontend/src/components/Hubdashboardlive/Hubdashboardlive";
import { Memberssvg } from "../../../../IcpAccelerator_frontend/src/components/Utils/Data/SvgData";

import founder from "../../../../IcpAccelerator_frontend/assets/images/founder.png"
import hub from "../../../../IcpAccelerator_frontend/assets/images/hub.png";
import vc from "../../../../IcpAccelerator_frontend/assets/images/vc.png";
import mentor from "../../../../IcpAccelerator_frontend/assets/images/mentor.png";



import ApexChart from "react-apexcharts";
import ReactApexChart from 'react-apexcharts';

import { rectangle } from "../../../../IcpAccelerator_frontend/src/components/Utils/Data/SvgData";

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
    <div className='p-[4%] sm:p-6 lg:p-8'>
      <div className="left-4 lg:left-auto bg-gradient-to-r from-purple-900 to-blue-500 text-transparent bg-clip-text text-lg font-extrabold ml-8">
        {selectedOption}
      </div>

      <div className="flex lg:flex-row flex-col w-full flex-wrap lg:flex-nowrap px-[4%] justify-evenly items-center gap-2">

  <div className="rounded-lg flex justify-between flex-col lg:h-[190px] lg:w-[45%] w-full bg-[#B9C0F2] drop-shadow-xl border-2">
    <div className="absolute bottom-0 left-0 w-36 h-40 bg-gradient-to-r from-purple-300 via-purple-400 to-purple-600 ellipse-quarter-left rounded-md"></div>
    <div className="absolute top-0 right-0 bg-gradient-to-br from-indigo-100 to-purple-600 w-28 h-28 ellipse-quarter-right rounded-md"></div>

    <div className="flex flex-col items-center justify-start p-4 font-bold text-lg text-white z-10">
      <p className="flex justify-start text-xl lg:text-lg xl:text-xl">Total Revenue</p>
      <p className="font-extrabold text-3xl lg:text-5xl xl:text-6xl">$1005.095</p>
    </div>
  </div>

  <div className="rounded-lg flex justify-between flex-col lg:h-[190px] lg:w-[45%] w-full bg-[#B9C0F2] drop-shadow-xl border-2">
    <div className="absolute bottom-0 left-0 w-36 h-40 bg-gradient-to-r from-purple-300 via-purple-400 to-purple-600 ellipse-quarter-left rounded-md"></div>
    <div className="absolute top-0 right-0 bg-gradient-to-br from-indigo-100 to-purple-600 w-28 h-28 ellipse-quarter-right rounded-md"></div>

    <div className="flex flex-col items-center justify-start p-4 font-bold text-lg text-white z-10">
      <p className="flex justify-start text-xl lg:text-lg xl:text-xl">Total Revenue</p>
      <p className="font-extrabold text-3xl lg:text-5xl xl:text-6xl">$1005.095</p>
    </div>
  </div>

  <div className="rounded-lg flex justify-start items-center p-2 flex-col lg:h-[285px] h-[200px] lg:w-[30%] w-full drop-shadow-xl bg-gray-200 border-2">
    <div className="flex justify-center flex-col items-center font-bold text-lg">
      <p>Top Countries</p>
    </div>
  </div>

</div>






























      
<div className="flex flex-row w-full flex-wrap px-[4%] py-[10%] h-[100px] lg:mt-[-130px] justify-between md:space-y-14">
  <div className="flex flex-row flex-wrap space-x-12">
    <div className="rounded-lg flex justify-center items-center h-[80px] lg:md:w-[236px] w-[340px] bg-[#B9C0F2] drop-shadow-xl border-2">
      <div className="flex flex-row items-center lg:justify-start justify-center font-bold text-lg text-black gap-8 object-cover">
        <img src={founder} alt="founder" />
        <p className="flex justify-start">vipul</p>
        <p className="font-extrabold w-[59px] h-[62px] flex text-2xl justify-center items-center">125</p>
      </div>
    </div>

    <div className="rounded-lg flex justify-center  items-center flex-col h-[80px] lg:md:w-[236px] w-[340px] bg-[#B9C0F2] drop-shadow-xl border-2">
      <div className="flex flex-row items-center font-bold text-lg text-black gap-8">
        <img src={hub} alt="hub" />
        <p className="flex justify-center items-center">taneja</p>
        <p className="font-extrabold w-[59px] h-[62px] flex text-2xl justify-center items-center">125</p>
      </div>
    </div>

    <div className="rounded-lg flex justify-end items-end flex-col h-[120px] lg:w-[260px] w-[340px] bg-[#B9C0F2] drop-shadow-xl border-2">
      {/* <div className="mt-6">
        <ReactApexChart options={icp} series={seriesData} type="line" height={150} />
      </div> */}
    </div>
  </div>

  <div className="flex flex-col py-4 justify-center lg:ml-36">
    <div className="flex flex-col space-x-8 px-[4%] mt-4">
      <div className="rounded-lg flex justify-center items-center h-[80px] lg:w-[236px] w-[340px] bg-[#B9C0F2] drop-shadow-xl border-2">
        <div className="flex flex-row items-center justify-start font-bold text-lg text-black gap-8">
          <img src={mentor} alt="mentor" />
          <p className="flex justify-start">QuadB</p>
          <p className="font-extrabold w-[59px] h-[62px] flex text-2xl justify-center items-center">125</p>
        </div>
      </div>
    </div>
  </div>
</div>

      
       
     










      <div className="flex lg:flex-row flex-col gap-2 mt-52 w-full flex-wrap lg:flex-nowrap space-x-[-70px] px-[4%] py-[8%] justify-start item-start  ">

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

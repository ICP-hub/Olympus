// src/App.js
import React from 'react';
import hubs from '../../../assets/images/hubs.png'
import sec41 from '../../../assets/images/sec41.png'
import sec42 from '../../../assets/images/sec42.png'
import sec43 from '../../../assets/images/sec43.png'
import sec46 from '../../../assets/images/sec46.png'
import sec47 from '../../../assets/images/sec47.png'
import sec48 from '../../../assets/images/sec48.png'
import sec49 from '../../../assets/images/sec49.png'
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import "./home.css"
function HomeSection4() {

  return (
    <div className=" bg-[#FEF6EE] py-10 ">
         <div className="container mx-auto">
         <div className="max-w-6xl w-full py-8 px-4 sm:px-6 lg:px-8  mx-auto bg-white rounded-lg">
        <section className='max-w-xl mx-auto'>
        <h1 className="text-3xl font-bold text-center mb-6">Loaded with value</h1>
        <p className="text-center text-gray-600 mb-10">
        Est malesuada ac elit gravida vel aliquam nec. Arcu pellentesque convallis quam feugiat non viverra massa fringilla. Malesuada blandit integer quis tellus. 
        </p>
        </section>
      
       <div className='flex flex-col gap-5'>
        {/* 1st flex card start  */}
        <div className="flex gap-6 mx-12">
            {/* left card  */}
         <div className='basis-[946px] flex rounded-lg shadow-lg overflow-hidden bg-[#EEF2F6]'>
           <div className=''><img src={sec41} alt="" className='py-4 object-cover object-center max-w-[241px] max-h-[407px]' /></div>
           <div className='px-5'>
           <div className='max-w-[379px] h-full flex flex-col justify-between py-4'>
              <div>
                <h1 className='text-3xl font-custom text-[#121926] pb-2'>Global events</h1>
                <p className='pb-6 text-xs font-normal text-[#4B5565]'>Commodo ut non aliquam nunc nulla velit et vulputate turpis. Erat rhoncus tristique ullamcorper sit.
                Erat rhoncus tristique ullamcorper sit.</p>
                <p className='text-xs font-normal text-[#4B5565]'>Erat rhoncus tristique ullamcorper sit.</p>
              </div>
              <div className="flex space-x-2 ">
        <span  className="bg-white text-xs font-normal text-[#4B5565] px-3 py-1 rounded-md border-2">#Accelerators</span>
        <span  className="bg-white text-xs font-normal text-[#4B5565] px-3 py-1 rounded-md border-2">#Meetups</span>
        <span  className="bg-white text-xs font-normal text-[#4B5565] px-3 py-1 rounded-md border-2">#Conferences</span>
    </div>
            </div>
           </div>
         </div>
         {/* right card  */}
         <div className=' rounded-lg shadow-lg overflow-hidden bg-[#FCE7F6] '>
         <div className=' h-full flex flex-col justify-between  py-4 ' >
              <div className='h-fit px-5'>
                <h1 className='text-3xl font-custom text-[#121926] pb-2'>Global events</h1>
                <p className='pb-6 text-xs font-normal text-[#4B5565]'>Commodo ut non aliquam nunc nulla velit et vulputate turpis. Erat rhoncus tristique ullamcorper sit.</p>
              </div>
              <div className=' h-full  py-4 ' >
                <div className='h-full' style={{ backgroundImage: `url(${sec42})`, backgroundSize: 'cover', backgroundPosition: 'center',width:"300px", marginBottom:"31px", marginTop:"-43px" }}>

                </div>
              <div className="flex space-x-2 px-5">
              <span  className="bg-white text-xs font-normal text-[#4B5565] px-3 py-1 rounded-md border-2">#Onboarding</span>
              <span  className="bg-white text-xs font-normal text-[#4B5565] px-3 py-1 rounded-md border-2">#Comms</span>
              <span  className="bg-white text-xs font-normal text-[#4B5565] px-3 py-1 rounded-md border-2">#Knowledge base</span>
     
    </div>
              </div>
            
            </div>
         </div>
        </div>
         {/* 2nd  flex card start  */}
        <div className="flex gap-6 mx-12 ">
            {/* left card  */}
            <div className=' rounded-lg shadow-lg overflow-hidden bg-[#FFFACD] '>
         <div className=' h-full flex flex-col justify-between  py-4 ' >
              <div className='h-fit px-5'>
                <h1 className='text-3xl font-custom text-[#121926] pb-2'>Global events</h1>
                <p className='pb-6 text-xs font-normal text-[#4B5565]'>Commodo ut non aliquam nunc nulla velit et vulputate turpis. Erat rhoncus tristique ullamcorper sit.</p>
              </div>
              <div className=' h-full  py-4 ' >
                <div className='h-full' style={{ backgroundImage: `url(${sec42})`, backgroundSize: 'cover', backgroundPosition: 'center',width:"300px", marginBottom:"31px", marginTop:"-43px" }}>

                </div>
              <div className="flex space-x-2 px-5">
              <span  className="bg-white text-xs font-normal text-[#4B5565] px-3 py-1 rounded-md border-2">#Onboarding</span>
              <span  className="bg-white text-xs font-normal text-[#4B5565] px-3 py-1 rounded-md border-2">#Comms</span>
              <span  className="bg-white text-xs font-normal text-[#4B5565] px-3 py-1 rounded-md border-2">#Knowledge base</span>
     
    </div>
              </div>
            
            </div>
         </div>
        
         {/* right card  */}
         <div className='basis-[946px] flex rounded-lg shadow-lg overflow-hidden bg-[#FFF4ED]'>
           <div className=''><img src={hubs} alt="" className='pt-4 object-cover object-center max-w-[241px] max-h-[324px]' /></div>
           <div className='px-5'>
           <div className='max-w-[379px] h-full flex flex-col justify-between py-4'>
              <div>
                <h1 className='text-3xl font-custom text-[#121926] pb-2'>Global events</h1>
                <p className='pb-6 text-xs font-normal text-[#4B5565]'>Commodo ut non aliquam nunc nulla velit et vulputate turpis. Erat rhoncus tristique ullamcorper sit.
                Erat rhoncus tristique ullamcorper sit.</p>
                <p className='text-xs font-normal text-[#4B5565]'>Erat rhoncus tristique ullamcorper sit.</p>
              </div>
              <div className="flex space-x-2 ">
        <span  className="bg-white text-xs font-normal text-[#4B5565] px-3 py-1 rounded-md border-2">#Accelerators</span>
        <span  className="bg-white text-xs font-normal text-[#4B5565] px-3 py-1 rounded-md border-2">#Meetups</span>
        <span  className="bg-white text-xs font-normal text-[#4B5565] px-3 py-1 rounded-md border-2">#Conferences</span>
    </div>
            </div>
           </div>
         </div>
        </div>
         {/* 3rd flex card start  */}
        <div className="flex gap-6 mx-12">
            {/* left card  */}
         <div className='basis-[946px] flex rounded-lg shadow-lg overflow-hidden bg-[#FDF4FF]'>
           <div className=''><img src={hubs} alt="" className='pt-4 object-cover object-center max-w-[241px] max-h-[324px]' /></div>
           <div className='px-5'>
           <div className='max-w-[379px] h-full flex flex-col justify-between py-4'>
              <div>
                <h1 className='text-3xl font-custom text-[#121926] pb-2'>Global events</h1>
                <p className='pb-6 text-xs font-normal text-[#4B5565]'>Commodo ut non aliquam nunc nulla velit et vulputate turpis. Erat rhoncus tristique ullamcorper sit.
                Erat rhoncus tristique ullamcorper sit.</p>
                <p className='text-xs font-normal text-[#4B5565]'>Erat rhoncus tristique ullamcorper sit.</p>
              </div>
              <div className="flex space-x-2 ">
        <span  className="bg-white text-xs font-normal text-[#4B5565] px-3 py-1 rounded-md border-2">#Accelerators</span>
        <span  className="bg-white text-xs font-normal text-[#4B5565] px-3 py-1 rounded-md border-2">#Meetups</span>
        <span  className="bg-white text-xs font-normal text-[#4B5565] px-3 py-1 rounded-md border-2">#Conferences</span>
    </div>
            </div>
           </div>
         </div>
         {/* right card  */}
         <div className=' rounded-lg shadow-lg overflow-hidden bg-[#F3FEE7] '>
         <div className=' h-full flex flex-col justify-between  py-4 ' >
              <div className='h-fit px-5'>
                <h1 className='text-3xl font-custom text-[#121926] pb-2'>Global events</h1>
                <p className='pb-6 text-xs font-normal text-[#4B5565]'>Commodo ut non aliquam nunc nulla velit et vulputate turpis. Erat rhoncus tristique ullamcorper sit.</p>
              </div>
              <div className=' h-full  py-4 ' >
                <div className='h-full' style={{ backgroundImage: `url(${sec42})`, backgroundSize: 'cover', backgroundPosition: 'center',width:"300px",marginBottom:"31px", marginTop:"-43px" }}>

                </div>
              <div className="flex space-x-2 px-5">
              <span  className="bg-white text-xs font-normal text-[#4B5565] px-3 py-1 rounded-md border-2">#Onboarding</span>
              <span  className="bg-white text-xs font-normal text-[#4B5565] px-3 py-1 rounded-md border-2">#Comms</span>
              <span  className="bg-white text-xs font-normal text-[#4B5565] px-3 py-1 rounded-md border-2">#Knowledge base</span>
     
    </div>
              </div>
            
            </div>
         </div>
        </div>
         {/* 4rth  flex card start  */}
         <div className="grid md:grid-col-3 sm:grid-col-2 lg:grid-cols-3 gap-6 mx-12">
            {/* left card  */}
            <div className=' rounded-lg shadow-lg overflow-hidden bg-[#EFF4FF] '>
         <div className=' h-full flex flex-col justify-between  pt-4 ' >
              <div className='h-fit px-5'>
                <h1 className='text-3xl font-custom text-[#121926] pb-2'>Global events</h1>
                <p className='pb-6 text-xs font-normal text-[#4B5565]'>Commodo ut non aliquam nunc nulla velit et vulputate turpis. Erat rhoncus tristique ullamcorper sit.</p>
              </div>
              <div className=' h-full  py-4 flex items-end' style={{ backgroundImage: `url(${sec47})`, backgroundSize: 'cover', backgroundPosition: 'center', height:"150px" ,overflow:"visible"}}>
               
              <div className="flex space-x-2 px-5">
              <span  className="bg-white text-xs font-normal text-[#4B5565] px-3 py-1 rounded-md border-2">#Onboarding</span>
              <span  className="bg-white text-xs font-normal text-[#4B5565] px-3 py-1 rounded-md border-2">#Comms</span>
             
     
    </div>
              </div>
            
            </div>
         </div>
         <div className=' rounded-lg shadow-lg overflow-hidden bg-[#FAFAFA] '>
         <div className=' h-full flex flex-col justify-between  pt-4 ' >
              <div className='h-fit px-5'>
                <h1 className='text-3xl font-custom text-[#121926] pb-2'>Global events</h1>
                <p className='pb-6 text-xs font-normal text-[#4B5565]'>Commodo ut non aliquam nunc nulla velit et vulputate turpis. Erat rhoncus tristique ullamcorper sit.</p>
              </div>
              <div className=' h-full  py-4 flex items-end' style={{ backgroundImage: `url(${sec48})`, backgroundSize: 'cover', backgroundPosition: 'center',height:"150px" ,overflow:"visible"}}>
               
              <div className="flex space-x-2 px-5">
              <span  className="bg-white text-xs font-normal text-[#4B5565] px-3 py-1 rounded-md border-2">#Onboarding</span>
              <span  className="bg-white text-xs font-normal text-[#4B5565] px-3 py-1 rounded-md border-2">#Comms</span>
              
     
    </div>
              </div>
            
            </div>
         </div>
         <div className=' rounded-lg shadow-lg overflow-hidden bg-[#E3E8EF] '>
         <div className=' h-full flex flex-col justify-between  pt-4 ' >
              <div className='h-fit px-5'>
                <h1 className='text-3xl font-custom text-[#121926] pb-2'>Global events</h1>
                <p className='pb-6 text-xs font-normal text-[#4B5565]'>Commodo ut non aliquam nunc nulla velit et vulputate turpis. Erat rhoncus tristique ullamcorper sit.</p>
              </div>
              <div className=' h-full  py-4 flex items-end' style={{ backgroundImage: `url(${sec49})`, backgroundSize: 'cover', backgroundPosition: 'center',overflow:"visible",height:"150px" }}>
              
              <div className="flex space-x-2 px-5">
              <span  className="bg-white text-xs font-normal text-[#4B5565] px-3 py-1 rounded-md border-2">#Onboarding</span>
              <span  className="bg-white text-xs font-normal text-[#4B5565] px-3 py-1 rounded-md border-2">#Comms</span>
             
     
    </div>
              </div>
            
            </div>
         </div>
        
        
        </div>
        </div>
        <div className="mt-10 text-center">
          <button className="bg-blue-500 text-white px-6 py-3 rounded-[4px]  border-2">Get started
            <ArrowForwardIcon />
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}

export default HomeSection4;



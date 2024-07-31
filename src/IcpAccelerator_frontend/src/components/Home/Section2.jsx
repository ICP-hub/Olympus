
import React from 'react'
import Founder from "../../../assets/images/Founder.png"
import Investor from "../../../assets/images/Investor.png"
// import Mentors from "../../../assets/images/Mentors.png"
import Talents from "../../../assets/images/Talents.png"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
export default function Section2() {
  return (
   <>
     <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white">
     <div className="flex flex-col items-center justify-center  bg-white mx-auto pb-20 pt-28">
      <div className="py-2 px-4 bg-white border border-blue-500 rounded-full text-blue-500 mb-4">
        About
      </div>
      <h1 className="text-3xl font-bold text-center mb-4">
        The <span className="">Web3</span> Ecosystems Launchpad
      </h1>
      <p className="text-center text-gray-600 max-w-3xl">
        Est malesuada ac elit gravida vel aliquam nec. Arcu pellentesque convallis quam feugiat non viverra massa fringilla. Malesuada blandit integer quis tellus. Sit dolor lorem molestie a facilisis a integer laoreet tortor.
      </p>
    </div>
     <div className="container mx-auto">
     <div className="max-w-7xl w-full py-8 px-4 sm:px-6 lg:px-8  mx-auto">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <div className="py-6  bg-[#E0F2FE] rounded-3xl overflow-hidden">
          <div className="flex items-center mb-4">
            <img src={Founder} alt="Founders" className="w-[230px] h-[350px] mr-4" />
            <div className='px-3'>
              <h2 className="text-2xl font-bold">Founders</h2>
              <p className="text-smfont-normal text-[#4B5565] pb-6">
                Est malesuada ac elit gravida vel aliquam nec. Arcu pellentesque convallis quam feugiat non viverra
                massa fringilla.
              </p>
              <ul className="list-disc list-inside text-sm font-normal text-[#4B5565] leading-loose">
            <li>Platea sit lacus pellentesque feugiat neque</li>
            <li>Blandit a mi dictumst placerat</li>
            <li>Tempus cursus enim eget ornare</li>
            <li>Cursus tristique in diam porta ut egestas</li>
          </ul>
            </div>
          </div>
          
        </div>
        <div className="py-6 bg-[#FEF0C7] rounded-3xl overflow-hidden">
          <div className="flex items-center mb-4">
            <img src={Investor} alt="Investors" className="w-[230px] h-[350px] mr-4" />
            <div className='px-3'>
              <h2 className="text-2xl font-bold">Investors</h2>
              <p className="text-smfont-normal text-[#4B5565] pb-6">
                Est malesuada ac elit gravida vel aliquam nec. Arcu pellentesque convallis quam feugiat non viverra
                massa fringilla.
              </p>
              <ul className="list-disc list-inside text-sm font-normal text-[#4B5565] leading-loose">
            <li>Platea sit lacus pellentesque feugiat neque</li>
            <li>Blandit a mi dictumst placerat</li>
            <li>Tempus cursus enim eget ornare</li>
            <li>Cursus tristique in diam porta ut egestas</li>
          </ul>
            </div>
          </div>
         
        </div >
        <div className="py-6 bg-[#FDEAD7] rounded-3xl overflow-hidden">
          <div className="flex items-center mb-4">
            <img src={Investor} alt="Mentors" className="w-[230px] h-[350px] mr-4" />
            <div className='px-3'> 
              <h2 className="text-2xl font-bold">Mentors</h2>
              <p className="text-smfont-normal text-[#4B5565] pb-6">
                Est malesuada ac elit gravida vel aliquam nec. Arcu pellentesque convallis quam feugiat non viverra
                massa fringilla.
              </p>
              <ul className="list-disc list-inside text-sm font-normal text-[#4B5565] leading-loose">
            <li>Platea sit lacus pellentesque feugiat neque</li>
            <li>Blandit a mi dictumst placerat</li>
            <li>Tempus cursus enim eget ornare</li>
            <li>Cursus tristique in diam porta ut egestas</li>
          </ul>
            </div>
          </div>
          
        </div>
        <div className="py-6 bg-[#CCFBEF] rounded-3xl overflow-hidden">
          <div className="flex items-center mb-4">
            <img src={Talents} alt="Talent" className="w-[230px] h-[350px] mr-4" />
            <div className='px-3'>
              <h2 className="text-2xl font-bold">Talent</h2>
              <p className="text-smfont-normal text-[#4B5565] pb-6">
                Est malesuada ac elit gravida vel aliquam nec. Arcu pellentesque convallis quam feugiat non viverra
                massa fringilla.
              </p>
              <ul className="list-disc list-inside text-sm font-normal text-[#4B5565] leading-loose">
            <li>Platea sit lacus pellentesque feugiat neque</li>
            <li>Blandit a mi dictumst placerat</li>
            <li>Tempus cursus enim eget ornare</li>
            <li>Cursus tristique in diam porta ut egestas</li>
          </ul>
            </div>
          </div>
         
        </div>
      </div>
      <div className="relative -top-[501px] flex items-center justify-center w-full mt-8">
        <div className='bg-white p-6 rounded-full'>
        <button className="px-6 py-3 text-white bg-blue-600 rounded-full">
          Get started
          <ArrowForwardIcon className="ml-2" />
        </button>
        </div>
      </div>
    </div>
    </div>
    </div>
   </>
  )
}



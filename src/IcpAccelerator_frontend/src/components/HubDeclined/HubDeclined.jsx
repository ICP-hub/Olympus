import React,{useState,useEffect,useRef} from 'react';
import ment from "../../../assets/images/ment.jpg";

const HubDeclined = () => {
    const [isHovered, setIsHovered] = useState(false);
  const [percent, setPercent] = useState(0);
  const tm = useRef(null); 
  const gradientStops = isHovered
  ? { stop1: "#4087BF", stop2: "#3C04BA" } // Hover gradient colors
  : { stop1: "#B5B5B5", stop2: "#5B5B5B" };
// Increase function is used to update the percent state
const increase = () => {
  setPercent((prevPercent) => {
    if (prevPercent >= 100) {
      clearTimeout(tm.current);
      return 100; // Ensure we don't exceed 100%
    }
    return prevPercent + 1;
  });
};

// Automatically start the increase function when the component mounts or percent changes, but not exceed 100%
useEffect(() => {
  if (percent < 100) {
    tm.current = setTimeout(increase, 10);
  }

  // Cleanup function to clear the timeout when the component unmounts or before re-running the effect
  return () => clearTimeout(tm.current);
}, [percent]);
  return (
    <div className='p-8 lg:mt-[-150px] md:mt-[-50px] mt-[270px]'>
    <div className="flex w-auto items-center p-4 flex-wrap justify-between bg-gray-200 rounded-lg mt-8 text-lg   hover:bg-blue-300">
    <div className="flex items-center">
      <img
        src={ment}
        alt="Mentor"
        className="w-6 h-6 lg:w-12 lg:h-12 object-cover rounded-md mb-4 lg:mb-0 hover:border-black hover:border-2 p-1"
      />
      <p className="font-extrabold ml-2">builder.fi</p>
    </div>
    <p className="line-clamp-1 w-48 font-fontUse">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo aut
      facere dolores et voluptates quibusdam quaerat! Eos iusto qui minima
      facilis quas blanditiis magnam! Quis reprehenderit animi eaque minus
      quo?
    </p>
    <p className="line-clamp-1 w-48 font-fontUse">
      {" "}
      DAO.infrastructure +1 more
    </p>
    <div className=" flex items-center">
      <svg
        width="100%"
        height="7"
        className="rounded-lg"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop
              offset="0%"
              style={{ stopColor: gradientStops.stop1, stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: gradientStops.stop2, stopOpacity: 1 }}
            />
          </linearGradient>
        </defs>
        <rect
          x="0"
          y="0"
          width={`${percent}%`}
          height="10"
          fill="url(#gradient1)"
        />
      </svg>
      <div className="text-gray-600 text-sm ml-2 font-fontUse text-nowrap">
        Level 9
      </div>
    </div>

    <div className="flex space-x-4 flex-wrap md:flex-nowrap">
      <button class="border text-[#737373] p-[5px] px-3 rounded-md border-[#C7C7C7] flex items-center">
        <svg
          width="15"
          height="15"
          viewBox="0 0 8 6"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform transform hover:scale-150"
        >
          <path
            d="M3.04007 0.934606C3.44005 0.449652 4.18299 0.449652 4.58298 0.934606L6.79207 3.61298C7.33002 4.26522 6.86608 5.24927 6.02061 5.24927H1.60244C0.756969 5.24927 0.293022 4.26522 0.830981 3.61298L3.04007 0.934606Z"
            fill="#737373"
          />
        </svg>
        <span class="ml-1"> 50</span>
      </button>
      <button className='bg-[#A62B41] text-white rounded-md px-4'>Declined</button>
</div>
</div>
</div>
  )
}

export default HubDeclined;
import React,{useState} from "react";
import { Star, colorStar } from '../../Utils/Data/SvgData';
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';


const ProjectDetailsCommunityRatings = ({ profile, type, name, role, socials, filter }) => {
  const [rating, setRating] = useState(4);

  const ratingPercentage = (rating / 5) * 100;

    const cardData = [
        {
            id: 1,
            type: 'vc',
            name: "SamyKarim",
            role: "Toshi, Managing Partner. Ex-Binance",
            imageUrl:
                "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ",
        },
        {
            id: 2,
            type: 'mentor',
            name: "SamyKarim",
            role: "Toshi, Managing Partner. Ex-Binance",
            imageUrl:
                "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ",
        },
        {
            id: 3,
            type: 'mentor',
            name: "SamyKarim",
            role: "Toshi, Managing Partner. Ex-Binance",
            imageUrl:
                "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ",
        },
        {
            id: 4,
            type: 'user',
            name: "SamyKarim",
            role: "Toshi, Managing Partner. Ex-Binance",
            imageUrl:
                "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ",
        },
    ];
    const filteredArray = filter === 'team' ? cardData : cardData.filter((val) => val.type === filter);
    return (
        <div className="md1:flex sm:flex flex-wrap ">

            {/* Overall circlular   part1 Cards  Start */}
            <div className="flex w-full sm:w/1/2 md:w-1/3 justify-between">
                <div className="w-full sm:w-full md:w-full p-4">
                    <div className="shadow-md rounded-lg overflow-hidden drop-shadow-2xl gap-2 bg-blue-200 p-4 h-full">
                        <div className='flex flex-row justify-between flex-wrap'>
                            <p className='text-lg text-black font-extrabold'>Overall Rating</p>
                            <p className='text-[#737373] text-sm flex items-center'>10 October, 2023</p>
                        </div>
                        <div className='flex flex-row gap-6 flex-wrap items-center'>
                            <div>
                                <svg style={{ position: 'absolute', width: 0, height: 0 }}>
                                    <defs>
                                        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#FF6347" />
                                            <stop offset="100%" stopColor="#32CD32" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <CircularProgressbar
                      value={ratingPercentage}
                      text={`${rating}/5`}
                      className="w-20 h-20 font-extrabold text-md"
                      strokeWidth={8}
                      styles={buildStyles({
                        strokeLinecap: "round",
                        pathTransitionDuration: 0.5,
                        pathColor: `#2247AF`,
                        trailColor: "#d6d6d6",
                        textColor: "#3505B2",
                      })}
                    />
                            </div>
                            <div className='flex flex-row justify-center items-center gap-2'>
                            <div className="flex items-center hover:text-blue-800 w-16 h-16">
                      {[...Array(5)].map((star, index) => {
                        index += 1;
                        return (
                          <button
                            key={index}
                            className={
                              index <= rating
                                ? "text-blue-800"
                                : "text-gray-300 dark:text-gray-500"
                            }
                            
                          >
                            <svg
                              className="w-6 h-6 ms-2"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 22 20"
                            >
                              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                            </svg>
                          </button>
                        );
                      })}
                    </div>
                            </div>
                        </div>
                        <p className='text-[#737373]'>On basis of all Community ratings</p>
                    </div>
                </div>
            </div>

            {/* Overall rating part1 Cards Ending */}
            {/* Overall rating part2 Cards Start */}


            {/* Overall rating part2 Cards Ending */}

            {filteredArray.map((data, index) => {
                console.log("index", index)
                let bg_color = ((index % 2) == 0) ? 'bg-white' : 'bg-blue-200';
                console.log("bg_color", bg_color)

                return (
                    <div className="flex flex-wrap justify-center sm:justify-between w-full sm:w/1/2 md:w-1/3" key={index}>
                        <div className="w-full p-4">
                            <div className={`shadow-md rounded-lg overflow-hidden drop-shadow-2xl gap-2 p-4 ${bg_color}`}>
                                <div className='flex flex-row justify-start sm:justify-start lg:justify-start flex-wrap gap-2 items-center'>
                                    <img className='h-14 object-cover w-14 rounded-full' src={data.imageUrl} alt='No img' />
                                    <div className='flex flex-col'>
                                        <p className='text-2xl text-black font-extrabold'>SamyKarim</p>
                                        <p className='text-[#737373] flex items-center'>10 October, 2023</p>
                                    </div>
                                    {colorStar}
                                    {colorStar}
                                    {colorStar}
                                    {colorStar}
                                </div>
                                <div className='flex flex-col sm:flex-row lg:flex-col ml-0 sm:ml-0 lg:ml-12'>
                                    <p className='font-bold text-xl'>“Great work”</p>
                                    <p className='text-[#737373]'>The Student Side Dashboard provides students with access to the assigned tests and assessments created by their respective teachers.</p>
                                </div>
                            </div>
                        </div>
                    </div>)
            })}
        </div>

    );
};

export default ProjectDetailsCommunityRatings;
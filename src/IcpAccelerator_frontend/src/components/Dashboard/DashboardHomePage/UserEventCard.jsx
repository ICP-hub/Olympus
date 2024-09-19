import React from 'react';
import bgImg from "../../../../assets/images/Image.png"
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';

const UserEventCard = () => {
    return (
        <div className="bg-white shadow-md border rounded-lg p-4  ">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Events</h2>
            <div className="relative ml-3">
                <div className="overflow-hidden rounded-lg">
                    <img
                        src={bgImg}
                        alt="Event"
                        className="w-full h-[180px] object-cover"
                        loading="lazy"
                        draggable={false}
                    />
                </div>
                <div className="p-2 flex bg-white rounded absolute top-2 left-2 z-10 justify-between items-start">
                    <div className=''>
                        <p className=" pb-2 rounded-md inline-block text-sm font-semibold ">
                            20 Jun – 22 Jun
                        </p>
                        <p className="text-sm text-gray-600">Start at 15:00 GMT+4</p>
                    </div>
                </div>
                <div className="mt-4">
                    <span className="border text-gray-700 text-xs font-medium px-2 py-1 rounded-xl">Workshop</span>
                </div>
                <h3 className="mt-2 text-lg font-bold text-gray-900">Masterclass: How to build a robust community</h3>
                <p className="mt-2 text-gray-600 text-sm">
                    Est malesuada ac elit gravida vel aliquam nec. Arcu pelle ntesque convallis quam feugiat non viverra massa fringilla.
                </p>
                <div className="mt-4 flex items-center space-x-4">
                    <span className="text-sm text-gray-600 flex items-center">
                        <span className="inline-block  mr-2"><PlaceOutlinedIcon sx={{fontSize:"medium",marginTop:"-2px"}} /> </span>
                        Online
                    </span>
                    <span className="text-sm text-gray-600">$100</span>
                    <div className="flex items-center -space-x-2">
                        <img
                            src="https://via.placeholder.com/32"
                            alt="User 1"
                            className="w-8 h-8 rounded-full border-2 border-white"
                            loading="lazy"
                            draggable={false}
                        />
                        <img
                            src="https://via.placeholder.com/32"
                            alt="User 2"
                            className="w-8 h-8 rounded-full border-2 border-white"
                            loading="lazy"
                            draggable={false}
                        />
                        <img
                            src="https://via.placeholder.com/32"
                            alt="User 3"
                            className="w-8 h-8 rounded-full border-2 border-white"
                            loading="lazy"
                            draggable={false}
                        />
                        <span className="text-sm text-gray-600">+152</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserEventCard;

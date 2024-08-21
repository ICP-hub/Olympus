// EventCard.js
import React, { useState } from "react";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import eventbg from "../../../../assets/images/bg.png";
import ProfileImage from "../../../../assets/Logo/ProfileImage.png";
import { FaFilter } from "react-icons/fa";

const EventRequestCard = ({ event }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false); // State to manage filter box visibility
  const [selectedCategory, setSelectedCategory] = useState(""); // State to manage selected category
  const [selectedType, setSelectedType] = useState(""); // State to manage selected type

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen); // Toggle the filter box
  };

  const handleApply = () => {
    console.log("Selected Category:", selectedCategory);
    console.log("Selected Type:", selectedType);
    setIsFilterOpen(false); // Close the filter box after applying
  };

  const events = [
    {
      date: "20 Jun – 22 Jun",
      time: "Start at 15:00 GMT+4",
      title: "Masterclass: How to build a robust community",
      description:
        "Est malesuada ac elit gravida vel aliquam nec. Arcu pelle ntesque convallis quam feugiat non viverra massa fringilla.",
      type: "Workshop",
      label: "Workshop",
      labelColor: "bg-blue-600",
      mode: "Online",
      price: "$100",
      attendees: [
        "https://via.placeholder.com/24",
        "https://via.placeholder.com/24",
        "https://via.placeholder.com/24",
        "https://via.placeholder.com/24",
      ],
      image: eventbg,
      profile:ProfileImage,
    },
    {
      date: "25 Jun",
      time: "Start at 15:00 GMT+4",
      title: "Aenean ultricies amet massa eu. Hendrerit a.",
      description:
        "Est malesuada ac elit gravida vel aliquam nec. Arcu pelle ntesque convallis quam feugiat non viverra massa fringilla.",
      type: "Masterclass",
      label: "Masterclass",
      labelColor: "bg-gray-800",
      mode: "Online",
      price: "Free",
      attendees: [
        "https://via.placeholder.com/24",
        "https://via.placeholder.com/24",
        "https://via.placeholder.com/24",
        "https://via.placeholder.com/24",
      ],
      image: eventbg,
      profile:ProfileImage,
    },

    {
      date: "25 Jun",
      time: "Start at 15:00 GMT+4",
      title: "Aenean ultricies amet massa eu. Hendrerit a.",
      description:
        "Est malesuada ac elit gravida vel aliquam nec. Arcu pelle ntesque convallis quam feugiat non viverra massa fringilla.",
      type: "Masterclass",
      label: "Masterclass",
      labelColor: "bg-gray-800",
      mode: "Online",
      price: "Free",
      attendees: [
        "https://via.placeholder.com/24",
        "https://via.placeholder.com/24",
        "https://via.placeholder.com/24",
        "https://via.placeholder.com/24",
      ],
      image: eventbg,
      profile:ProfileImage,
    },

    {
      date: "25 Jun",
      time: "Start at 15:00 GMT+4",
      title: "Aenean ultricies amet massa eu. Hendrerit a.",
      description:
        "Est malesuada ac elit gravida vel aliquam nec. Arcu pelle ntesque convallis quam feugiat non viverra massa fringilla.",
      type: "Masterclass",
      label: "Masterclass",
      labelColor: "bg-gray-800",
      mode: "Online",
      price: "Free",
      attendees: [
        "https://via.placeholder.com/24",
        "https://via.placeholder.com/24",
        "https://via.placeholder.com/24",
        "https://via.placeholder.com/24",
      ],
      image: eventbg,
      profile:ProfileImage,
    },
  ];
  return (
    <>
      <div className='flex gap-3 items-center py-2 justify-between'><div className="flex items-center border-2 border-gray-400 rounded-lg overflow-hidden w-full h-[50px]">
      <div className="flex items-center px-4">
        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103.5 3.5a7.5 7.5 0 0013.65 13.65z"></path>
        </svg>
      </div>
      <input
        type="text"
        placeholder="Search people, projects, jobs, events"
        className="w-full py-2 px-4 text-gray-700 focus:outline-none"
      />
      <div className="px-4">
        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6h18M3 12h18m-7 6h7"></path>
        </svg>
      </div>
    </div>
    {/* <FaFilter className="text-gray-400 text-2xl"/> */}
    <div>
          <FaFilter 
            className="text-gray-400 text-2xl cursor-pointer"
            onClick={toggleFilter} // Toggle the filter box on click
          />
        </div>

    </div>
    {isFilterOpen && (
            <div className="absolute  -mt-6 right-[6.9rem] w-52 bg-gray-100 border border-gray-300 p-4 rounded-lg shadow-lg z-50">
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
              <div className="mb-1">
                <span className="block text-sm font-medium text-gray-600 mb-2">Category</span>
                <label className="flex items-center text-sm text-gray-700 font-medium mb-2">
                  <input
                    type="radio"
                    name="category"
                    value="Project"
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="h-4 w-4 text-blue-600 form-radio checked:bg-blue-600 border border-black rounded-full cursor-pointer mr-2"
                  />
                  Project
                </label>
                <label className="flex items-center text-sm text-gray-700 font-medium mb-2">
                  <input
                    type="radio"
                    name="category"
                    value="Investor"
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="h-4 w-4 text-blue-600 form-radio checked:bg-blue-600 border border-black rounded-full cursor-pointer mr-2"
                  />
                  Investor
                </label>
                <label className="flex items-center text-sm text-gray-700 font-medium">
                  <input
                    type="radio"
                    name="category"
                    value="Mentor"
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="h-4 w-4 text-blue-600 form-radio checked:bg-blue-600 border border-black rounded-full cursor-pointer mr-2"
                  />
                  Mentor
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Types</label>
                <select 
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="block w-full bg-white border border-gray-300 rounded-md shadow-sm focus:border-gray-400 focus:ring  bg focus:ring-opacity-50 px-3 py-2">
                  <option value="">All</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
              <div className="flex justify-between mt-1">
                <button
                  type="button"
                  className="bg-gray-200 text-gray-700 px-4 py-1 rounded-md hover:bg-gray-300"
                  onClick={toggleFilter} // Close the filter box on cancel
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600"
                  onClick={handleApply}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
          
      )}
    {events.map((event, index) => (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
     
        <div className="flex justify-between items-center ">
          <div className="flex items-center gap-3 relative">
          <div className="w-[272px] h-[230px] ">
          <div className="max-w-[230px] w-[230px] bg-gray-100 rounded-lg flex flex-col justify-between h-full relative overflow-hidden ">
            <div className="group">
  <div
    className="absolute inset-0  blur-sm  "
    style={{
      backgroundImage: `url(${event.image})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      // Remove inline filter style
    }}
  ></div>
  <div className="absolute inset-0 flex items-center justify-center ">
    <img
      src={event.profile}
      alt={event.title}
      className="w-24 h-24 rounded-full object-cover"
    />
  </div>
</div>
</div>

        </div>
            {/* <img
              src={event.image}
              alt={event.title}
              className="w-[240px] !important  !important rounded-lg mr-4 object-cover"
            /> */}
            <div>
              <div>
                <p className="bg-white font-medium border-2 borer-[#CDD5DF] text-[#364152] w-[86px] px-2 py-1 rounded-full text-sm">
                  Workshop
                </p>
                <h3 className="text-lg font-semibold">{event.title}</h3>
                <p className="text-sm text-gray-500 overflow-hidden text-ellipsis max-h-12 line-clamp-2 ">{event.description}</p>
              </div>
              <div className="flex gap-3 items-center mt-4">
                <span className="text-sm text-[#121926]">
                  {" "}
                  <PlaceOutlinedIcon
                    className="text-[#364152]"
                    fontSize="small"
                  />
                  {event.mode}
                </span>
                <span className="text-sm text-gray-500">{event.price}</span>
                <div className="flex -space-x-1">
                  {event.attendees.map((attendee, index) => (
                    <img
                      key={index}
                      src={attendee}
                      alt="attendee"
                      className="w-6 h-6 rounded-full border-2 border-white"
                    />
                  ))}
                </div>
                
              </div>
              <div className="flex py-2">
                  <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2 font-normal text-sm">
                    Accept
                  </button>
                  <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded font-normal text-sm">
                    Reject
                  </button>
                </div>
            </div>
          </div>
        </div>
    
    </div>
))}
</>
  );
};

export default EventRequestCard;

import React from 'react';
import eventbg from "../../../../assets/images/bg.png"
import ProfileImage from "../../../../assets/Logo/ProfileImage.png"
const EventDetails = () => {
  return (
    <div className="flex flex-col gap-10 md:flex-row h-screen">
      {/* Left Side - Fixed */}
      {/* md:w-1/4 lg:w-1/4 */}
      <div className="w-[400px] bg-gray-100 p-4 sticky top-0 h-full rounded-2xl">
        <div className="text-center mb-4">

          <img src={ProfileImage} alt="Organizer" className="w-24 h-24 rounded-full mx-auto" />
          <h2 className="text-lg font-semibold mt-2">Matt Bowers</h2>
          <span className="text-sm text-green-600">ORGANIZER</span>
        </div>
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold">Event starts in</h3>
          <div className="flex justify-center mt-2 space-x-2">
            <div className="text-center">
              <div className="text-2xl font-bold">01</div>
              <div className="text-xs">Days</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">23</div>
              <div className="text-xs">Hours</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">44</div>
              <div className="text-xs">Minutes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">45</div>
              <div className="text-xs">Seconds</div>
            </div>
          </div>
          <button className="bg-blue-600 text-white py-2 px-4 rounded mt-4">Register</button>
          <button className="bg-gray-200 text-gray-700 py-2 px-4 rounded mt-2">Contact organizer</button>
          <div className="text-red-600 mt-2">10 spots left</div>
        </div>
        {/* Guests */}
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold">Guests</h3>
          <div className="flex justify-center mt-2">
            {/* Add guest images here */}
            <img src="/path/to/guest1.jpg" alt="Guest 1" className="w-8 h-8 rounded-full mx-1" />
            <img src="/path/to/guest2.jpg" alt="Guest 2" className="w-8 h-8 rounded-full mx-1" />
            {/* ...more guest images */}
          </div>
        </div>
        {/* Event Details */}
        <div>
          <div className="mb-2">
            <strong>Event Category:</strong> Masterclass
          </div>
          <div className="mb-2">
            <strong>Capacity:</strong> 25-50
          </div>
          <div className="mb-2">
            <strong>Start Date:</strong> July 15, 2024
          </div>
          <div className="mb-2">
            <strong>End Date:</strong> July 17, 2024
          </div>
          <div className="mb-2">
            <strong>Start Time:</strong> 15:00 GMT+4
          </div>
          <div className="mb-2">
            <strong>Price:</strong> $100
          </div>
          <div className="mb-2">
            <strong>Accepted Currencies:</strong> ICP, USD, ETH, BTC
          </div>
        </div>
      </div>

      {/* Right Side - Scrollable */}
      {/* md:pl-72 lg:pl-64 */}
      <div className="flex-1 ml-auto overflow-auto w-[652px]">
        <div className="p-4">
          <img src={eventbg} alt="Event" className="w-full rounded-lg h-[310px]" />
          <h1 className="text-3xl font-bold mt-4">Masterclass: How to build a robust community</h1>
          <div className="flex items-center mt-2 text-gray-600">
            <span className="mr-2">2 days</span>
            <span className="mr-2">•</span>
            <span>$100</span>
          </div>
          <div className="mt-4">
            <div className="border-b border-gray-300 mb-4">
              <button className="py-2 px-4 text-blue-600 border-b-2 border-blue-600">Summary</button>
              <button className="py-2 px-4 text-gray-600">Announcements</button>
              <button className="py-2 px-4 text-gray-600">Attendees</button>
              <button className="py-2 px-4 text-gray-600">Reviews</button>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-2">About</h2>
              <ul className="list-disc pl-5 text-gray-700">
                <li>A tortor laoreet at magna nibh. Bibendum augue neque malesuada aliquam venenatis.</li>
                <li>Feugiat nulla pellentesque eu augue dignissim.</li>
                <li>Diam gravida turpis fermentum ut est. Vulputate platea non ac elit massa.</li>
                {/* ...more list items */}
              </ul>
            </div>
            <div className="mt-4">
              <h2 className="text-2xl font-semibold mb-2">Topics covered</h2>
              <p className="text-gray-700">
                Est quis ornare proin quisque lacinia ac tincidunt massa
              </p>
              <p className="text-gray-700">
                Est malesuada ac elit gravida vel aliquam nec. Arcu velit netusque convallis quam feugiat non viverra massa fringilla.
              </p>
              {/* ...more paragraphs */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;

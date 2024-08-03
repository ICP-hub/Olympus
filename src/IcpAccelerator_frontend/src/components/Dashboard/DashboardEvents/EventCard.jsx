// EventCard.js
import React from 'react';
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";

const EventCard = ({ event }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1 relative">
          <div className="max-w-[160px] absolute top-1 left-1 bg-white p-2 rounded-[8px]">
            <p className="text-base font-bold">20 Jun – 22 Jun</p>
            <p className="text-sm font-normal">Start at 15:00 GMT+4</p>
          </div>
          <img
            src={event.image}
            alt={event.title}
            className="w-[240px] !important h-[172px] !important rounded-lg mr-4 object-cover" />
          <div>
            <div>
              <p className="bg-white font-medium border-2 borer-[#CDD5DF] text-[#364152] w-[86px] px-2 py-1 rounded-full text-sm">
                Workshop
              </p>
              <h3 className="text-lg font-semibold">{event.title}</h3>
              <p className="text-sm text-gray-500">{event.description}</p>
              {/* <div className="flex items-center mt-2"> */}
              {/* <span className="text-sm text-gray-500">{event.date}</span> */}
              {/* <span className="text-sm text-gray-500 ml-4">{event.time}</span> */}
              {/* <span className="text-sm text-gray-500 ml-4">{event.type}</span> */}
              {/* </div> */}
            </div>
            {/* <span
              className={`px-2 py-1 text-xs font-medium text-white rounded ${event.labelColor}`}
            >
              {event.label}
            </span> */}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;


// // EventCard.js
// import React from 'react';
// import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";

// const EventCard = ({ event }) => {
//   return (
//     <div className="bg-white mb-6 rounded-lg shadow-md overflow-hidden">
//       <div className="flex">
//         <div className="relative w-60 h-[172px] flex-shrink-0">
//           <img
//             src={event.image}
//             alt={event.title}
//             className="w-full h-full object-cover"
//           />
//           <div className="absolute top-2 left-2 bg-white p-2 rounded-lg shadow">
//             <p className="text-sm font-bold">20 Jun – 22 Jun</p>
//             <p className="text-xs">Start at 15:00 GMT+4</p>
//           </div>
//         </div>
//         <div className="p-4 flex flex-col justify-between flex-grow">
//           <div>
//             <span className="bg-white font-medium border-2 borer-[#CDD5DF] text-[#364152] w-[86px] px-2 py-1 rounded-full text-sm">
//               Workshop
//             </span>
//             <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
//             <p className="text-sm text-gray-600 mb-4">{event.description}</p>
//           </div>
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-4">
//               <span className="flex items-center text-sm text-gray-700">
//                 <PlaceOutlinedIcon className="text-gray-400 mr-1" fontSize="small" />
//                 {event.mode}
//               </span>
//               <span className="text-sm font-medium">{event.price}</span>
//             </div>
//             <div className="flex -space-x-2">
//               {event.attendees.slice(0, 4).map((attendee, index) => (
//                 <img
//                   key={index}
//                   src={attendee}
//                   alt={`attendee ${index + 1}`}
//                   className="w-8 h-8 rounded-full border-2 border-white object-cover"
//                 />
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EventCard;
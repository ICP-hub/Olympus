// import React, { useState } from 'react'
// // import bgImg from "../../../../assets/images/Image.png";
// import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
// // import uint8ArrayToBase64 from "../../Utils/uint8ArrayToBase64";

// const DiscoverMentorEvent = ({principal}) => {

//   console.log("principal in event ",principal)


//   // const [openDetail,setOpenDetail]=useState(false)
//   // const handleClick =()=>{
//   //     setOpenDetail(true)
//   // }
//   // const mentorDetails= projectData?.projectData?.[0]?.[0]?.params
//   // const userDetails= projectData?.projectData?.[0]?.[1]?.params

//   // console.log("Project Data in CHILD COMPONENT at 0 ", projectData?.projectData?.[0]?.[0]?.params)
//   // console.log("Project Data in CHILD COMPONENT at 1 ", projectData?.projectData?.[0]?.[1]?.params)

//   // const projectlogo =
//   // projectDetails?.project_logo && projectDetails?.project_logo[0]
//   //   ? uint8ArrayToBase64(projectDetails?.project_logo[0])
//   //   : "default-profile.png";

//   //   const projectcover =
//   //   projectDetails?.project_cover && projectDetails?.project_cover[0]
//   //   ? uint8ArrayToBase64(projectDetails?.project_cover[0])
//   //   : "default-profile.png";


//   return (
//     <div className="bg-white shadow-md border rounded-lg p-4  ">
//       <h2 className="text-lg font-semibold text-gray-800 mb-4">Events</h2>
//       <div  className="relative ml-3">
//         <div className="overflow-hidden rounded-lg">
//           <img
//             src={"bgImg"}
//             alt="Event"
//             className="w-full h-[180px] object-cover"
//           />
//         </div>
//         <div className="p-2 flex bg-white rounded absolute top-2 left-2 z-10 justify-between items-start">
//           <div className="">
//             <p className=" pb-2 rounded-md inline-block text-sm font-semibold ">
//               20 Jun – 22 Jun
//             </p>
//             <p className="text-sm text-gray-600">Start at 15:00 GMT+4</p>
//           </div>
//         </div>
//         <div className="mt-4">
//           <span className="border text-gray-700 text-xs font-medium px-2 py-1 rounded-xl">
//             Workshop
//           </span>
//         </div>
//         <h3 className="mt-2 text-lg font-bold text-gray-900">
//           Masterclass: How to build a robust community
//         </h3>
//         <p className="mt-2 text-gray-600 text-sm">
//           Est malesuada ac elit gravida vel aliquam nec. Arcu pelle ntesque
//           convallis quam feugiat non viverra massa fringilla.
//         </p>
//         <div className="mt-4 flex items-center space-x-4">
//           <span className="text-sm text-gray-600 flex items-center">
//             <span className="inline-block  mr-2">
//               <PlaceOutlinedIcon
//                 sx={{ fontSize: "medium", marginTop: "-2px" }}
//               />{" "}
//             </span>
//             Online
//           </span>
//           <span className="text-sm text-gray-600">$100</span>
//           <div className="flex items-center -space-x-2">
//             <img
//               src="https://via.placeholder.com/32"
//               alt="User 1"
//               className="w-8 h-8 rounded-full border-2 border-white"
//             />
//             <img
//               src="https://via.placeholder.com/32"
//               alt="User 2"
//               className="w-8 h-8 rounded-full border-2 border-white"
//             />
//             <img
//               src="https://via.placeholder.com/32"
//               alt="User 3"
//               className="w-8 h-8 rounded-full border-2 border-white"
//             />
//             <span className="text-sm text-gray-600">+152</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DiscoverMentorEvent;
import React, { useEffect, useState } from 'react';
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import { useSelector } from 'react-redux';
// import uint8ArrayToBase64 from '../../Utils/uint8ArrayToBase64';
import uint8ArrayToBase64 from '../../../Utils/uint8ArrayToBase64';

const DiscoverMentorEvent = ({ principal }) => {
  console.log("Principal in event:", principal);

  const [mentorEvents, setMentorEvents] = useState([]);
  const actor = useSelector((currState) => currState.actors.actor);

  useEffect(() => {
    const fetchCohorts = async () => {
      try {
        const data = await actor.get_cohorts_by_principal();

        if (data && Array.isArray(data) && data.length > 0) {
          const formattedEvents = data.map(cohort => {
            if (!cohort || !cohort.cohort || !cohort.cohort.cohort_banner) {
              return null;
            }

            return {
              title: cohort.cohort.title,
              cohort_banner: cohort.cohort.cohort_banner[0]
                ? uint8ArrayToBase64(cohort.cohort.cohort_banner[0])
                : [],
              cohort_launch_date: cohort.cohort.cohort_launch_date,
              cohort_end_date: cohort.cohort.cohort_end_date,
              start_date: cohort.cohort.start_date,
              no_of_seats: cohort.cohort.no_of_seats,
              tags: cohort.cohort.tags,
              country: cohort.cohort.country,
              description: cohort.cohort.description,
              funding_amount: cohort.cohort.funding_amount,
              cohort_id: cohort.cohort_id, // Include cohort_id here
            };
          }).filter(event => event !== null);

          setMentorEvents(formattedEvents);
          console.log("Formatted Mentor Events:", formattedEvents);
        } else {
          console.log("No data found or the structure is not as expected.");
        }
      } catch (error) {
        console.error('Error fetching cohort data:', error);
      }
    };

    fetchCohorts();
  }, [actor]);

  return (
    <div className="bg-white shadow-md border rounded-lg p-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Events</h2>
      {mentorEvents.length === 0 ? (
        <p>No events available for this mentor.</p>
      ) : (
        mentorEvents.map((event, index) => (
          <div key={index} className="relative ml-3 mb-4">
            <div className="overflow-hidden rounded-lg">
              <img
                src={event.cohort_banner || "default-image.png"} // Provide a default image if cohort_banner is not available
                alt="Event"
                className="w-full h-[180px] object-cover"
              />
            </div>
            <div className="p-2 flex bg-white rounded absolute top-2 left-2 z-10 justify-between items-start">
              <div className="">
                <p className="pb-2 rounded-md inline-block text-sm font-semibold ">
                  {event.start_date || 'N/A'}
                </p>
                <p className="text-sm text-gray-600">Start at 15:00 GMT+4</p>
              </div>
            </div>
            <div className="mt-4">
              <span className="border text-gray-700 text-xs font-medium px-2 py-1 rounded-xl">
                Workshop
              </span>
            </div>
            <h3 className="mt-2 text-lg font-bold text-gray-900">
              {event.title || 'Untitled Event'}
            </h3>
            <p className="mt-2 text-gray-600 text-sm">
              {event.description || 'No description available.'}
            </p>
            <div className="mt-4 flex items-center space-x-4">
              <span className="text-sm text-gray-600 flex items-center">
                <span className="inline-block mr-2">
                  <PlaceOutlinedIcon sx={{ fontSize: "medium", marginTop: "-2px" }} />
                </span>
                {event.country || 'Unknown Location'}
              </span>
              <span className="text-sm text-gray-600">${event.funding_amount || '0'}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default DiscoverMentorEvent;


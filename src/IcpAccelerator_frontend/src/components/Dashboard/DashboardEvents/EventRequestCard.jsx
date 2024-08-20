// EventCard.js
import React from "react";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import eventbg from "../../../../assets/images/bg.png";
import ProfileImage from "../../../../assets/Logo/ProfileImage.png";
const EventRequestCard = ({ event }) => {
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

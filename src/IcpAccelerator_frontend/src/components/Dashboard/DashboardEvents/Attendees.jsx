import React, { useState, useEffect } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import uint8ArrayToBase64 from "../../Utils/uint8ArrayToBase64";
import CloseIcon from '@mui/icons-material/Close';
const AttendeesCard = ({ member }) => {
  return (
    <div className="flex items-center  bg-white shadow-md rounded-lg mb-6 hover:shadow-lg transition-shadow duration-300 ease-in-out">
  <div className="flex-shrink-0 w-[100px] h-[100px] rounded-full overflow-hidden border-2 border-gray-200 bg-gray-200 p-1 mx-2">
    <img
      src={member.profile_picture}
      alt={member.full_name}
      className="w-full h-full rounded-full object-cover"
    />
  </div>
  <div className="ml-6 flex-1">
    <h4 className="text-lg font-bold text-gray-800">{member.full_name}</h4>
    <p className="text-sm text-gray-500">{member.username}</p>
    <p className="text-sm text-gray-600 mt-2">{member.bio}</p>

    {/* Container for Reason to Join and Area of Interest */}
    <div className="flex flex-wrap gap-2 mt-4">
      {/* Reason to Join */}
      {member.reason_to_join.map((reason, idx) => (
        <p
          key={idx}
          className="bg-gray-100 font-medium border border-gray-300 text-gray-700 px-3 py-1 rounded-full text-sm"
        >
          {reason}
        </p>
      ))}

      {/* Area of Interest */}
      <p className="bg-gray-100 font-medium border border-gray-300 text-gray-700 px-3 py-1 rounded-full text-sm">
        {member.area_of_interest}
      </p>
    </div>

    <div className="flex items-center mt-2">
      <PlaceOutlinedIcon
        className="text-gray-500 h-5 w-5 mr-2"
        fontSize="small"
      />
      <span className="text-gray-700 text-sm">{member.country}</span>
    </div>

    <div className="mt-3 space-x-2">
      {member.badges && member.badges.length > 0
        ? member.badges.map((badge, idx) => (
            <span
              key={idx}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                badge === "FOUNDER"
                  ? "bg-purple-100 text-purple-700"
                  : badge === "MENTOR"
                  ? "bg-pink-100 text-pink-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {badge}
            </span>
          ))
        : ""}
    </div>
  </div>
</div>
  );
};

const Attendees = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [appliedRole, setAppliedRole] = useState("");
  const [attendees, setAttendees] = useState([]);
  const [noData, setNoData] = useState(null);
  const actor = useSelector((currState) => currState.actors.actor);
  const location = useLocation();
  const { cohort_id } = location.state || {};

  useEffect(() => {
    if (!cohort_id) {
      console.error("Cohort ID is undefined.");
    }
  }, [cohort_id]);

  const toggleMenu = () => setShowMenu(!showMenu);

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  const handleApply = async () => {
    setShowMenu(false);
    setAppliedRole(selectedRole);

    if (!cohort_id) {
      toast.error("Cohort ID is not available.");
      return;
    }

    try {
      let data = [];
      let result = null;

      if (selectedRole === "Project") {
        result = await actor.get_projects_applied_for_cohort(cohort_id);
      } else if (selectedRole === "Mentor") {
        result = await actor.get_mentors_applied_for_cohort(cohort_id);
      } else if (selectedRole === "Investor") {
        result = await actor.get_vcs_applied_for_cohort(cohort_id);
      }

      if (result?.Ok && Array.isArray(result.Ok)) {
        data = result.Ok.map((item) => ({
          full_name: item[1].params.full_name,
          username: item[1].params.openchat_username[0],
          area_of_interest: item[1].params.area_of_interest,
          bio: item[1].params.bio,
          country: item[1].params.country,
          email: item[1].params.email[0],
          profile_picture: item[1].params.profile_picture[0]
            ? uint8ArrayToBase64(item[1].params.profile_picture[0])
            : [],
          reason_to_join: item[1].params.reason_to_join[0],
          social_links: item[1].params.social_links[0],
          badges: item[1].params.badges || [],
        }));
        setNoData(false);
      } else {
        toast.error(`Invalid data format received for ${selectedRole.toLowerCase()}`);
        setNoData(true);
      }

      setAttendees(data);
      if (data.length === 0) {
        setNoData(true);
        toast.error(`No ${selectedRole.toLowerCase()} data available`);
      }
    } catch (error) {
      console.error(`Error fetching ${selectedRole.toLowerCase()} data:`, error);
      toast.error(`Failed to fetch ${selectedRole.toLowerCase()} data`);
    }
  };

 

  return (
    <div >
      <div className="">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Attendees</h2>
          <MoreVertIcon onClick={toggleMenu} className="cursor-pointer" />
        </div>

        {showMenu && (
          <div className={`fixed top-0 right-0 inset-0 z-50 transition-opacity duration-700 ease-in-out ${showMenu ? 'opacity-100 bg-opacity-30' : 'opacity-0 bg-opacity-0'} bg-black backdrop-blur-xs`}>
            <div className={`transition-transform duration-300 ease-in-out transform ${showMenu ? 'translate-x-0' : 'translate-x-full'} mx-auto w-[25%] absolute right-0 top-0 z-10 bg-white h-screen flex flex-col`}>
              <div className="p-5 flex justify-start">
                <CloseIcon sx={{ cursor: 'pointer' }} onClick={toggleMenu} />

              </div>
              <div className="container p-5 flex-grow">
                <h3 className="mb-4 text-lg font-semibold">Filter</h3>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Role</label>
                  <div className="flex flex-col gap-2">
                    <label>
                      <input type="radio" name="role" value="Project" checked={selectedRole === "Project"} onChange={handleRoleChange} className="h-4 w-4 text-blue-600 form-radio checked:bg-blue-600 border border-black rounded-full cursor-pointer mr-2" />
                      Project
                    </label>
                    <label>
                      <input type="radio" name="role" value="Mentor" checked={selectedRole === "Mentor"} onChange={handleRoleChange} className="h-4 w-4 text-blue-600 form-radio checked:bg-blue-600 border border-black rounded-full cursor-pointer mr-2" />
                      Mentor
                    </label>
                    <label>
                      <input type="radio" name="role" value="Investor" checked={selectedRole === "Investor"} onChange={handleRoleChange} className="h-4 w-4 text-blue-600 form-radio checked:bg-blue-600 border border-black rounded-full cursor-pointer mr-2" />
                      Investor
                    </label>
                  </div>
                </div>

               

                  
                  
                </div>
                <div className="p-5">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            onClick={handleApply}
          >
            Apply
          </button>
        </div>
              
              </div>
             
          </div>
        )}

        {noData ? (
          <p>No attendees available for the selected role.</p>
        ) : (
          attendees.map((member, idx) => (
            <AttendeesCard key={idx} member={member} />
          ))
        )}
      </div>
    </div>
  );
};

export default Attendees;

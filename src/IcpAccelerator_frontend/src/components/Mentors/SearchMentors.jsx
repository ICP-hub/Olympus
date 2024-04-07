import React, { useEffect, useState } from "react";
import girlImage from "../../../assets/images/girl.jpeg";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import uint8ArrayToBase64 from "../Utils/uint8ArrayToBase64";
import { IcpAccelerator_backend } from "../../../../declarations/IcpAccelerator_backend/index";
import NoDataCard from "./Event/NoDataCard";
import MentorCard from "./MentorCard";

function SearchMentors() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [noData, setNoData] = useState(null);

  const actor = useSelector((currState) => currState.actors.actor);
  const getAllMentors = async (caller) => {
    await caller
      .get_all_mentors_candid()
      .then((result) => {
        console.log("result-in-get-all-mentors", result);
        if (result.length > 0) {
          setData(result);
          setNoData(false);
        } else {
          setData([]);
          setNoData(true);
        }
      })
      .catch((error) => {
        setData([]);
        setNoData(true);
        console.log("error-in-get-all-mentors", error);
      });
  };

  useEffect(() => {
    if (actor) {
      getAllMentors(actor);
    } else {
      getAllMentors(IcpAccelerator_backend);
    }
  }, [actor]);

  return (
    <div className="px-[4%] w-full bg-gray-100 h-screen overflow-y-scroll">
      <div className="py-8">
        <h2 className="text-[40px] font-black leading-10 bg-gradient-to-r from-[#7283EA] to-[#4087BF] bg-clip-text text-transparent transform text-center">
          Our{" "}
          <span className=" bg-gradient-to-r from-[#3C04BA] to-[#4087BF] bg-clip-text text-transparent transform">
            Mentors
          </span>
        </h2>
      </div>
      <div className="md:gap-4 md:grid md:grid-cols-4 max-md:flex max-md:flex-col justify-center mb-5">
        {noData ? <NoDataCard /> :
          data.map((mentor, index) => {

            let id = mentor[0]? mentor[0].toText() : '';
            let img = uint8ArrayToBase64(
              mentor[1]?.mentor_profile?.profile?.user_data?.profile_picture[0]
            );
            let name = mentor[1]?.mentor_profile?.profile?.user_data?.full_name;
            let bio = mentor[1]?.mentor_profile?.profile?.user_data?.bio[0];
            let skills = mentor[1]?.mentor_profile?.profile?.user_data?.area_of_interest;
            let role = "Mentor";
            let category_of_mentoring_service = mentor[1]?.mentor_profile?.profile?.category_of_mentoring_service;
            return (
              <MentorCard key={index} img={img} id={id} name={name} bio={bio} role={role} category_of_mentoring_service={category_of_mentoring_service} skills={skills}  />
            );
          })}
      </div>
    </div>
  );
}

export default SearchMentors;

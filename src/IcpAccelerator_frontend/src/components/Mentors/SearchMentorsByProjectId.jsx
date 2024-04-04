import React, { useEffect, useState } from "react";
import { Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import girlImage from "../../../assets/images/girl.jpeg";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import uint8ArrayToBase64 from "../Utils/uint8ArrayToBase64";
import { IcpAccelerator_backend } from "../../../../declarations/IcpAccelerator_backend/index";
import NoDataCard from "./Event/NoDataCard";
import AddAMentorRequestModal from "../../models/AddAMentorRequestModal";
import toast, { Toaster } from "react-hot-toast";
import { Principal } from '@dfinity/principal';


function SearchMentorsByProjectId() {
  const { id } = useParams();

  const navigate = useNavigate();
  const actor = useSelector((currState) => currState.actors.actor);
  const principal = useSelector((currState) => currState.internet.principal);
  const [data, setData] = useState([]);
  const [noData, setNoData] = useState(null);
  const [isAddMentorModalOpen, setIsAddMentorModalOpen] = useState(false);
  const [mentorId, setMentorId] = useState(null);

  const handleMentorCloseModal = () => {
    setMentorId(null)
    setIsAddMentorModalOpen(false);
  }
  const handleMentorOpenModal = (val) => {
    setMentorId(val);
    setIsAddMentorModalOpen(true);
  }

  const handleAddMentor = async ({ message }) => {
    console.log('add a mentor')
    if (actor && mentorId) {
      let mentor_id = Principal.fromText(mentorId)
      let msg = message
      let project_id = id;

      await actor.send_offer_to_mentor(mentor_id, msg, project_id)
        .then((result) => {
          console.log('result-in-send_offer_to_mentor', result)
          if (result) {
            handleMentorCloseModal();
            toast.success('offer sent to mentor successfully')
          } else {
            handleMentorCloseModal();
            toast.error('something got wrong')

          }
        })
        .catch((error) => {
          console.log('error-in-send_offer_to_mentor', error)
          handleMentorCloseModal();
          toast.error('something got wrong')

        })
    }
  }

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
    if (actor && principal) {
      getAllMentors(actor);
    } else {
      getAllMentors(IcpAccelerator_backend);
    }
  }, [actor, principal]);

  return (
    <div className="px-[4%] w-full bg-gray-100 h-screen overflow-y-scroll">
      <div className="flex flex-col text-center items-center justify-center">
        <h5 className="text-xl py-4">
          Learn a new skill, launch a project, land your dream career.
        </h5>
        <div className="py-8">
          <h2 className="text-[40px] font-black leading-10 bg-gradient-to-r from-[#7283EA] to-[#4087BF] bg-clip-text text-transparent transform">
            1-on-1{" "}
            <span className=" bg-gradient-to-r from-[#3C04BA] to-[#4087BF] bg-clip-text text-transparent transform">
              Marketing
            </span>
          </h2>
          <h2 className="text-[40px] font-black leading-10 text-[#7283EA]">
            Mentorship
          </h2>
        </div>
        {/* <div className="flex items-center relative md1:w-1/2 sm1:w-3/4 w-full p-2 mb-8 border border-[#737373] rounded-lg shadow-md">
          <input
            type="text"
            placeholder="Search by company, skills or role"
            className="flex-grow bg-transparent rounded focus:outline-none"
          />
          <button className="md1:block absolute hidden right-0 bg-[#3505B2] font-black text-xs text-white px-4 py-2 mr-1 rounded-md focus:outline-none">
            Search mentors
          </button>
          <button className="block absolute md1:hidden right-0 bg-transparent font-black text-xs text-[#3505B2] px-4 py-2 mr-1 rounded-md focus:outline-none">
            <svg
              className="w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </button>
        </div> */}
      </div>

      <div className="flex flex-wrap justify-center">
        {noData ? <NoDataCard /> :
          data.map((mentor, index) => {
          
              let  id = mentor[0] ? mentor[0].toText() : '';
              let  img = uint8ArrayToBase64(
                mentor[1]?.mentor_profile?.profile?.user_data?.profile_picture[0]
              );
              let  name = mentor[1]?.mentor_profile?.profile?.user_data?.full_name;
              let  skills = mentor[1]?.mentor_profile?.profile?.user_data?.bio[0];
              let  role = "Mentor";
              let mentor_id = mentor[0].toText();
            return (
              <div className="">
                <div className="w-full sm:w-full md:w-full lg:w-full xl:w-full p-4">
                  <div className="shadow-md rounded-lg overflow-hidden border-2 drop-shadow-2xl gap-2 bg-white">
                    <div className="flex flex-col sm:flex-row gap-6 p-2">
                      <img
                        className="w-full sm:w-[300.53px] rounded-md h-auto sm:h-[200.45px] flex lg:items-center lg:justify-center  "
                        src={img}
                        alt="alt"
                      />
                      <div className="flex flex-col justify-around w-full mt-4">
                        <h1 className="text-black text-2xl font-extrabold">
                          {name}
                        </h1>
                        <p className="text-[#737373]">{role}</p>
                        <div className="flex flex-wrap gap-4 mt-6 text-[#737373]">
                          <p className="rounded-full py-2 px-4">
                            {skills}
                          </p>
                          {/* <p className="bg-gray-200 rounded-full py-2 px-4">
                          observability
                        </p>
                        <p className="bg-gray-200 rounded-full py-2 px-4">
                          Kubernetes
                        </p> */}
                        </div>
                        <div className="w-100px border-2 text-gray-100 mt-2"></div>
                        <div className="flex justify-end mt-6 xl:mr-8">
                          {actor && principal ?
                            <button onClick={() => handleMentorOpenModal(mentor_id)} className="text-white font-bold py-2 px-4 bg-[#3505B2] rounded-md">
                              Reach Out
                            </button>
                            :
                            <button disabled={true} className="text-white font-bold py-2 px-4 bg-[#3505B2] rounded-md">
                              Sign Up To Reach Out
                            </button>
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
      {isAddMentorModalOpen && (
        <AddAMentorRequestModal
          title={'Associate Mentor'}
          onClose={handleMentorCloseModal}
          onSubmitHandler={handleAddMentor}
        />)}
      <Toaster />
    </div>
  );
}

export default SearchMentorsByProjectId;

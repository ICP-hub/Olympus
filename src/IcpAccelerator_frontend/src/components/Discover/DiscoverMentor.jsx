import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { IcpAccelerator_backend } from "../../../../declarations/IcpAccelerator_backend/index";
import { useSelector } from "react-redux";
import { FavoriteBorder, Star } from "@mui/icons-material";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import uint8ArrayToBase64 from "../Utils/uint8ArrayToBase64";
import DiscoverMentorMain from "../Dashboard/DashboardHomePage/discoverMentor/DiscoverMentorMain";

const DiscoverMentor = () => {
  const actor = useSelector((currState) => currState.actors.actor);
  const [allMentorData, setMentorData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const itemsPerPage = 50;
  const [currentPage, setCurrentPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const [sendprincipal,setSendprincipal]=useState(null)
  const [openDetail,setOpenDetail]=useState(false)


  const getAllMentor = async (caller, page) => {
    setIsFetching(true);
    try {
      const result = await caller.get_all_mentors_with_pagination({
        page_size: itemsPerPage,
        page: page,
      });
      
      {result?.data.map(val=>{
        setSendprincipal(val[0])
      })}
      console.log("result =>",result)

      if (result && result.data) {
        const mentorData = Object.values(result.data);
        const userData = Object.values(result.user_data || {});

        

        if (mentorData.length === 0) {
          setHasMore(false); // No more data to load
        } else {
          setMentorData((prevData) => [...prevData, ...mentorData]);
          setUserData((prevData) => [...prevData, ...userData]);

          // If fewer items than expected are returned, stop further requests
          if (mentorData.length < itemsPerPage) {
            setHasMore(false);
          }
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("error-in-get-all-mentor", error);
      setHasMore(false);
    } finally {
      setIsFetching(false);
    }
  };

  console.log('send',sendprincipal)
  
  useEffect(() => {
    if (!isFetching && hasMore) {
      if (actor) {
        getAllMentor(actor, currentPage);
      } else {
        getAllMentor(IcpAccelerator_backend, currentPage);
      }
    }
  }, [actor, currentPage, isFetching, hasMore]);

  const loadMore = () => {
    if (!isFetching && hasMore) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const tagColors = {
    mentor: "bg-[#EEF4FF] border-[#C7D7FE] border text-[#3538CD] rounded-md",
    project: "bg-[#F8FAFC] text-[#364152] border border-[#E3E8EF] rounded-md",
    vc: "bg-[#FFFAEB] border-[#FEDF89] border text-[#B54708] rounded-md",
    TALENT: "bg-[#ECFDF3] border-[#ABEFC6] border text-[#067647] rounded-md",
  };

  const tags = ["OLYMPIAN", "FOUNDER", "TALENT", "INVESTER", "PROJECT"];

  
  const getRandomTags = () => {
    const shuffledTags = tags.sort(() => 0.5 - Math.random());
    return shuffledTags.slice(0, 2);
  };

  const handleClick=()=>{
    setOpenDetail(true)
    
  }

  return (
    <div>
      {allMentorData.length > 0 && userData.length > 0 ? (
        <InfiniteScroll
          dataLength={allMentorData.length}
          next={loadMore}
          hasMore={hasMore}
          loader={<h4>Loading more...</h4>}
          endMessage={<p>No more data available</p>}
        >
          {allMentorData.map((mentorArray, index) => {
            const mentor = mentorArray[1];
            const user = userData[index][1];

            if (!mentor || !user) {
              return null;
            }

            const randomTags = getRandomTags();
            let profile = user?.profile_picture[0]
              ? uint8ArrayToBase64(user?.profile_picture[0])
              : "../../../assets/Logo/CypherpunkLabLogo.png";
            let full_name = user?.full_name;
            let openchat_name = user?.openchat_username;
            let country = user?.country;
            let bio = user?.bio[0];
            let email = user?.email[0];
            const randomSkills = user?.area_of_interest.split(",").map((skill) => skill.trim());
            const activeRole = mentor?.roles.find((role) => role.status === "approved");

            return (
              <div
                className="p-6 w-[750px] rounded-lg shadow-sm mb-4 flex"
                key={index}
              >
                <div onClick={()=>handleClick()} className="w-[272px]">
                  <div className="max-w-[250px] w-[250px] h-[254px] bg-gray-100 rounded-lg flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <img
                        src={profile}
                        alt={full_name ?? "Mentor"}
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    </div>

                    <div className="absolute bottom-0 right-[6px] flex items-center bg-gray-100 p-1">
                      <Star className="text-yellow-400 w-4 h-4" />
                      <span className="text-sm font-medium">5.0</span>
                    </div>
                  </div>
                </div>
                {openDetail && <DiscoverMentorMain openDetail={openDetail} setOpenDetail={setOpenDetail}  principal={sendprincipal} />}

                <div className="flex-grow ml-[25px] w-[544px]">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold">{full_name}</h3>
                      <p className="text-gray-500">@{openchat_name}</p>
                    </div>
                    <FavoriteBorder className="text-gray-400 cursor-pointer" />
                  </div>
                  <div className="mb-2">
                    {activeRole && (
                      <span
                        key={index}
                        className={`inline-block ${
                          tagColors[activeRole.name] || "bg-gray-100 text-gray-800"
                        } text-xs px-3 py-1 rounded-full mr-2 mb-2`}
                      >
                        {activeRole.name}
                      </span>
                    )}
                  </div>
                  <div className="border-t border-gray-200 my-3">
                    {email}
                  </div>

                  <p className="text-gray-600 mb-4">{bio}</p>
                  <div className="flex items-center text-sm text-gray-500 flex-wrap">
                    {randomSkills.map((skill, index) => (
                      <span
                        key={index}
                        className="mr-2 mb-2 border boder-[#CDD5DF] bg-white text-[#364152] px-3 py-1 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}

                    <span className="mr-2 mb-2 flex text-[#121926] items-center">
                      <PlaceOutlinedIcon className="text-[#364152] mr-1 w-4 h-4" />
                      {country}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </InfiniteScroll>
      ) : (
        <div>No Data Available</div>
      )}

    </div>
  );
};

export default DiscoverMentor;

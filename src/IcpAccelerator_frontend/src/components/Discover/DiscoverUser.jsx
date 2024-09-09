import React, { useState, useEffect } from "react";
// import { IcpAccelerator_backend } from "../../../../declarations/IcpAccelerator_backend/index";
import { IcpAccelerator_backend } from "../../../../declarations/IcpAccelerator_backend/index";
import { useSelector } from "react-redux";
import { FavoriteBorder, LocationOn, Star } from "@mui/icons-material";
import CypherpunkLabLogo from "../../../assets/Logo/CypherpunkLabLogo.png";
import uint8ArrayToBase64 from "../Utils/uint8ArrayToBase64";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import DiscoverUserModal from "../Dashboard/DashboardHomePage/discoverMentorPage/DiscoverUserModal";
import RatingCard from "../Common/RatingCard";
import RatingReview from "../Common/RatingReview";
import RatingModal from "../Common/RatingModal";
import InfiniteScroll from "react-infinite-scroll-component";
import NoData from "../NoDataCard/NoData";
const DiscoverUser = ({ onUserCountChange }) => {
  const actor = useSelector((currState) => currState.actors.actor);
  const [allUserData, setAllUserData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [userRatingDetail, setUserRatingDetail] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [currentPrincipal, setCurrentPrincipal] = useState([]);
  const [totalUsersFetched, setTotalUsersFetched] = useState(0); 
  console.log(".............USERS", allUserData);
  console.log(".............item per page", allUserData);
  console.log(".............currentPage  page", currentPage);
  // const getAllUser = async (caller, isMounted) => {
  //   setIsFetching(true);
  //   await caller
  //     .list_all_users({
  //       page_size: itemsPerPage,
  //       page: currentPage,
  //     })
  //     .then((result) => {
  //       if (isMounted) {
  //         console.log("result-in-get-all-user USERS", result);
  //         if (result) {
  //           // Log the exact structure of result.data to verify it
  //           console.log("Data received:", result.data);
  //           setAllUserData(result);
  //         } else {
  //           setAllUserData([]); // Set to an empty array if no data
  //         }
  //         setIsLoading(false);
  //       }
  //     })
  //     .catch((error) => {
  //       if (isMounted) {
  //         setAllUserData([]);
  //         setIsLoading(false);
  //         console.log("error-in-get-all-user", error);
  //       }
  //     });
  // };


 // Fetching the list of users with pagination
 const getAllUser = async (caller, page, isRefresh = false) => {
  console.log(`Fetching data for page: ${page}`);
  setIsFetching(true);

  try {
    const result = await caller.list_all_users({
      page_size: itemsPerPage,
      page: page,
    });
    console.log('result', result);
    console.log('result.length', result.length);

    if (result && result.length > 0) {
      console.log(`Fetched ${result.length} users for page ${page}`);

      // Append data to existing state without duplication
      setAllUserData((prevData) =>
        isRefresh ? result : [...new Set([...prevData, ...result])]
      );

      const newTotal = isRefresh ? result.length : totalUsersFetched + result.length;
      console.log('newTotal', newTotal);
      setTotalUsersFetched(newTotal);
      onUserCountChange(newTotal);

      // If fetched data is less than itemsPerPage, assume no more data
      if (result.length < itemsPerPage) {
        setHasMore(false);
      } else {
        setCurrentPage((prevPage) => prevPage + 1);
      }
    } else {
      // If no data is returned, stop loading
      setHasMore(false);
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    setHasMore(false);
  } finally {
    setIsFetching(false);
  }
};

  // useEffect(() => {
  //   if (actor && !isFetching && hasMore) {
  //     getAllUser(actor, currentPage);
  //   }
  // }, [actor, currentPage]);
  

  // const loadMore = () => {
  //   if (!isFetching && hasMore) {
  //     setCurrentPage((prevPage) => {
  //       const newPage = prevPage + 1;
  //       getAllUser(actor, newPage); // Fetch data for the next page
  //       return newPage;
  //     });
  //   }
  // };
  useEffect(() => {
    if (!isFetching && hasMore) {
      if (actor) {
        console.log(`Current page: ${currentPage}`);
        getAllUser(actor, currentPage); // Fetch data
      }
    }
  }, [actor, currentPage, hasMore]);
  // Load more data when scrolling
  const loadMore = () => {
    if (!isFetching && hasMore) {
      console.log(`Loading more... current page: ${currentPage}`);
      getAllUser(actor, currentPage); // Fetch next set of data
    }
  };
  
  
  // const refresh = () => {
  //   if (actor) {
  //     getAllUser(actor, 1); 
  //   }
  // };
  const refresh = () => {
    console.log("Refreshing data...");
    setAllUserData([]); // Clear current data
    setCurrentPage(1); // Reset to the first page
    setTotalUsersFetched(0); // Reset the total count before fetching new data
    setHasMore(true); // Reset "has more" flag
  
    // Fetch data for the first page again
    if (actor) {
      getAllUser(actor, 1, true); // Pass a flag to indicate it's a refresh
    }
  };
  /////////////////////////
  const tagColors = {
    OLYMPIAN: "bg-[#F0F9FF] border-[#B9E6FE] border text-[#026AA2] rounded-md",
    FOUNDER: "bg-[#EEF4FF] border-[#C7D7FE] border text-[#3538CD] rounded-md",
    PROJECT: "bg-[#F8FAFC] text-[#364152] border border-[#E3E8EF] rounded-md",
    INVESTER: "bg-[#FFFAEB] border-[#FEDF89] border text-[#B54708] rounded-md",
    TALENT: "bg-[#ECFDF3] border-[#ABEFC6] border text-[#067647] rounded-md",
  };

  const tags = ["OLYMPIAN", "FOUNDER", "TALENT", "INVESTOR", "PROJECT"];
  const getRandomTags = () => {
    const shuffledTags = tags.sort(() => 0.5 - Math.random());
    return shuffledTags.slice(0, 2);
  };

  const skills = [
    "Web3",
    "Cryptography",
    "MVP",
    "Infrastructure",
    "Web3",
    "Cryptography",
  ];
  const getRandomskills = () => {
    const shuffledTags = skills.sort(() => 0.5 - Math.random());
    return shuffledTags.slice(0, 2);
  };
  const [openDetail, setOpenDetail] = useState(false);
  const [cardDetail, setCadDetail] = useState(null);
  const handleClick = (user) => {
    setOpenDetail(true);
    setCadDetail(user);
    console.log("cardDetail => ", cardDetail);
  };

  const handleRating = (ratings, principalId) => {
    setShowRatingModal(true);
    setUserRatingDetail(ratings);
    setCurrentPrincipal(principalId);
  };
  console.log("userRatingDetail =>", userRatingDetail);

  return (
    <>
      <div>
        {allUserData.length > 0 ? (
          <InfiniteScroll
            dataLength={allUserData.length}
            next={loadMore}
            hasMore={hasMore}
            loader={<h4>Loading more...</h4>}
            endMessage={<p className="flex justify-center">No more data available</p>}
            refreshFunction={refresh}
            pullDownToRefresh
            pullDownToRefreshThreshold={50}
            pullDownToRefreshContent={
              <h3 style={{ textAlign: "center" }}>
                &#8595; Pull down to refresh
              </h3>
            }
            releaseToRefreshContent={
              <h3 style={{ textAlign: "center" }}>
                &#8593; Release to refresh
              </h3>
            }
          >
            {allUserData?.map(([principal, user], index) => {
              //   project card data
              const randomTags = getRandomTags();
              const randomSkills = getRandomskills();
              const logo =
                user.profile_picture && user.profile_picture[0]
                  ? uint8ArrayToBase64(user.profile_picture[0])
                  : "default-profile.png";

              const full_name = user.full_name || "Unknown User";
              
              const bio = user.bio[0] || "No bio available.";
              const area_of_interest = user.area_of_interest || "N/A";
              const location = user.country || "Unknown Location";
              const openchat_username = user.openchat_username[0] || "N/A";
              console.log("full_name.........", openchat_username);
              const principalId = principal;

              return (
                <>
                  {/* Render more fields as needed */}
                  <div
                    className=" p-6 w-[750px] rounded-lg shadow-sm mb-4 flex"
                    key={index}
                  >
                    <div className="w-[272px] relative ">
                      <div
                        onClick={() => handleClick(user)}
                        className="max-w-[250px] w-[250px] h-[254px] bg-gray-100 rounded-lg flex flex-col justify-between   overflow-hidden"
                      >
                        <div className="absolute inset-0 flex items-center justify-center">
                          <img
                            src={logo}
                            alt={full_name}
                            className="w-24 h-24 rounded-full object-cover"
                          />
                        </div>
                      </div>
                      <div
                        onClick={() => handleRating(user, principalId)}
                        className="absolute cursor-pointer bottom-0 right-[6px] flex items-center bg-gray-100 p-1"
                      >
                        <Star className="text-yellow-400 w-4 h-4" />
                        <span className="text-sm font-medium">
                          {/* {project_rating} */} start
                        </span>
                      </div>
                    </div>

                    <div className="flex-grow ml-[25px] w-[544px]">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-xl font-bold">{full_name}</h3>
                          <p className="text-gray-500">@{openchat_username}</p>
                        </div>
                        {/* <FavoriteBorder className="text-gray-400 cursor-pointer" /> */}
                      </div>
                      <div className="bg-[#fff0eb] border-[#f35454] border text-[#090907] rounded-md text-xs px-3 py-1 mr-2 mb-2 w-[3.4rem]">
USER
                        {/* {randomTags?.map((tag, index) => (
                          <span
                            key={index}
                            className={`inline-block ${
                              tagColors[tag] || "bg-gray-100 text-gray-800"
                            } text-xs px-3 py-1 rounded-full mr-2 mb-2`}
                          >
                            {tag}
                          </span>
                        ))} */}
                      </div>
                      <div className="border-t border-gray-200 my-1"></div>
                      {/* <p className="font-medium mb-2"> {area_of_interest}</p> */}

                      <p className="text-gray-600 mb-4 overflow-hidden text-ellipsis max-h-12 line-clamp-2 ">
                        {bio}
                      </p>

                      <div className="flex items-center text-sm text-gray-500 flex-wrap">
                        <div className="flex flex-wrap ">
                          {area_of_interest
                            .split(",")
                            .map((interest, index) => (
                              <div
                                key={index}
                                className="border-2 border-gray-500 rounded-full text-gray-700 text-xs px-2 py-1 inline-block mr-2 mb-2 mt-1"
                              >
                                <p className="font-medium">{interest.trim()}</p>
                              </div>
                            ))}
                        </div>
                        <span className="mr-2 mb-2 flex text-[#121926] items-center">
                          <PlaceOutlinedIcon className="text-[#364152] mr-1 w-4 h-4" />
                          {location}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              );
            })}
          </InfiniteScroll>
        ) : (
          <div className="flex justify-center"><NoData message={"No User Listed Yet"} /></div>
        )}
      </div>
      {showRatingModal && (
        <RatingModal
          showRating={showRatingModal}
          setShowRatingModal={setShowRatingModal}
          userRatingDetail={userRatingDetail}
          cardPrincipal={currentPrincipal}
        />
      )}
      {openDetail && (
        <DiscoverUserModal
          openDetail={openDetail}
          setOpenDetail={setOpenDetail}
          userData={cardDetail}
        />
      )}
    </>
  );
};

export default DiscoverUser;

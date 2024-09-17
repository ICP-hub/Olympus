import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import DiscoverMentorProfile from "./DiscoverMentorProfile";
import DiscoverMentorEvent from "./DiscoverMentorEvent";

const DiscoverMentorMain = ({ openDetail, setOpenDetail, principal }) => {
  const actor = useSelector((currState) => currState.actors.actor);
  console.log("principal in DiscoverMentorMain", principal);
  const [allMentorData, setAllMentorData] = useState(null);
  const [loaing, setIsLoading] = useState(true);

  const getAllUser = async (caller, isMounted) => {
    await caller
      .get_mentor_info_using_principal(principal)
      .then((result) => {
        if (isMounted) {
          console.log("Data received:", result?.[0]);
          if (result) {
            setAllMentorData(result?.[0]);
          } else {
            setAllMentorData([]);
          }
          setIsLoading(false);
        }
      })
      .catch((error) => {
        if (isMounted) {
          setAllMentorData([]);
          setIsLoading(false);
          console.log("error-in-get-all-user", error);
        }
      });
  };

  useEffect(() => {
    let isMounted = true;

    if (actor) {
      getAllUser(actor, isMounted);
    } else {
      getAllUser(IcpAccelerator_backend);
    }

    return () => {
      isMounted = false;
    };
  }, [actor, principal]);

  return (
    <div className="w-full bg-fixed lg1:h-screen fixed inset-0 bg-black bg-opacity-30 backdrop-blur-xs z-50">
      <div className="mx-auto w-full sm:w-[70%] absolute right-0 top-0 z-10 bg-white h-screen">
        <div className="p-2 mb-2">
          <CloseIcon
            sx={{ cursor: "pointer" }}
            onClick={() => setOpenDetail(false)}
          />
        </div>
        <div className="container mx-auto overflow-hidden overflow-y-scroll h-full pb-8">
          <div className="flex flex-col gap-4 lg1:py-3 lg1:gap-0 lg1:flex-row w-full lg1:justify-evenly h-full px-[1%]">
            <div className=" rounded-lg w-full lg1:overflow-y-scroll lg1:w-[32%] h-full">
              <DiscoverMentorProfile mentorData={allMentorData} />
            </div>
            <div className="px-3 py-4 lg1:py-0 w-full lg1:overflow-y-scroll lg1:w-[63%] h-full">
              <DiscoverMentorEvent mentorData={allMentorData} principal={principal} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscoverMentorMain;

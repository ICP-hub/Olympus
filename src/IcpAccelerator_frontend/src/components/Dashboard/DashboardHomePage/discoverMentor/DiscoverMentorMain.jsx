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
    <div className="w-full bg-fixed h-screen fixed inset-0 bg-black bg-opacity-30 backdrop-blur-xs z-50">
      <div className="mx-auto w-[70%] absolute right-0 top-0 z-10 bg-white h-screen">
        <div className="p-2 mb-2">
          <CloseIcon
            sx={{ cursor: "pointer" }}
            onClick={() => setOpenDetail(false)}
          />
        </div>
        <div className="container h-full ml-2 pb-8">
          <div className="flex justify-evenly h-full px-[1%]">
            <div className="border rounded-lg w-[32%] overflow-y-auto h-full">
              <DiscoverMentorProfile mentorData={allMentorData} />
            </div>
            <div className="px-3 w-[63%] overflow-y-auto h-full">
              <DiscoverMentorEvent mentorData={allMentorData} principal={principal} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscoverMentorMain;

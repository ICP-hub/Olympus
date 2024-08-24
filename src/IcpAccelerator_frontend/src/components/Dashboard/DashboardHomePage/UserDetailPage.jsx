import UserDetail from "./UserDetail";
import CloseIcon from "@mui/icons-material/Close";
import UserProjectCard from "./UserProjectCard";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const UserDetailPage = ({ openDetail, setOpenDetail, principal,userData }) => {
  const actor = useSelector((currState) => currState.actors.actor);
  console.log("principal in detailpage", principal);
  console.log("userdata in detailpage", userData);
  const [allProjectData, setAllProjectData] = useState(null);
  const [loaing, setIsLoading] = useState(true);

  const getAllUser = async (caller, isMounted) => {
    await caller
      .get_project_info_using_principal(principal)
      .then((result) => {
        if (isMounted) {
          console.log("API SE AAYA HUA DATA", result);
          if (result) {
            // Log the exact structure of result.data to verify it
            console.log("Data received:", result.data);
            setAllProjectData(result);
          } else {
            setAllProjectData([]); // Set to an empty array if no data
          }
          setIsLoading(false);
        }
      })
      .catch((error) => {
        if (isMounted) {
          setAllProjectData([]);
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
      <div className=" mx-auto w-[70%] absolute right-0 top-0 z-10 bg-white h-screen">
        <div className=" p-5 mb-5">
          <CloseIcon
            sx={{ cursor: "pointer" }}
            onClick={() => setOpenDetail(false)}
          />
        </div>
        <div className="container h-[calc(100%-50px)] ml-2 pb-8 overflow-y-auto">
          <div className="container">
            <div className="flex justify-evenly px-[1%] ">
              <div className="border h-fit rounded-lg w-[32%]">
                <UserDetail projectData={allProjectData} />
              </div>
              <div className=" px-3 w-[63%] overflow-y-auto h-[84vh] ">
                <div className="">
                  <UserProjectCard projectData={allProjectData}/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailPage;

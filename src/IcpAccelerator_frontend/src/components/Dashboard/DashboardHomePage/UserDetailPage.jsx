import UserDetail from "./UserDetail";
import CloseIcon from "@mui/icons-material/Close";
import UserProjectCard from "./UserProjectCard";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const UserDetailPage = ({ openDetail, setOpenDetail, principal,userData,email }) => {
  const actor = useSelector((currState) => currState.actors.actor);
  console.log("principal in detailpage", principal);
  console.log("userdata in detailpage", userData);
  const [allProjectData, setAllProjectData] = useState(null);
  const [loaing, setIsLoading] = useState(true);
  const [userDataToNext, setUserDataToNext] = useState(null);
  const [princiapToNext, setPrincipalToNext] = useState(null);

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
    <div className="w-full bg-fixed lg1:h-screen fixed inset-0 bg-black bg-opacity-30 backdrop-blur-xs z-50">
      <div className=" mx-auto w-full sm:w-[70%] absolute right-0 top-0 z-10 bg-white h-screen">
        <div className=" p-2 mb-2">
          <CloseIcon
            sx={{ cursor: "pointer" }}
            onClick={() => setOpenDetail(false)}
          />
        </div>
        {/* <div className="container h-[calc(100%-50px)] ml-2 pb-8 overflow-y-auto">
          <div className="container">
            <div className="flex justify-evenly px-[1%] ">
              <div className="border h-fit rounded-lg w-[32%]">
                <UserDetail projectData={allProjectData} />
              </div>
              <div className=" px-3 w-[63%] overflow-y-auto h-[84vh] ">
                <div className="">
                  <UserProjectCard projectData={allProjectData} principal={principal} userData={userData}/>
                </div>
              </div>
            </div>
          </div>
        </div> */}
        <div className="container mx-auto overflow-hidden overflow-y-scroll h-full px-[4%] sm:px-[2%] pb-8">
          <div className="flex flex-col gap-4 lg1:py-3 lg1:gap-0 lg1:flex-row w-full lg1:justify-evenly h-full ">
            <div className="rounded-lg w-full lg1:overflow-y-scroll lg1:w-[32%]">
            <UserDetail projectData={allProjectData} />
            </div>
            <div className="px-1 lg1:px-3 py-4 lg1:py-0 w-full lg1:mt-0 lg1:overflow-y-scroll lg1:w-[63%]">
            <UserProjectCard setOpenDetails={setOpenDetail} projectData={allProjectData} principal={principal} userData={userData}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailPage;

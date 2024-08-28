import CloseIcon from "@mui/icons-material/Close";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import DiscoverInvestorAbout from "./DiscoverInvestorAbout";
import DiscoverInvestorDetail from "./DiscoverInvestorDetail";
import { IcpAccelerator_backend } from "../../../../../../declarations/IcpAccelerator_backend/index";

const DiscoverInvestorPage = ({ openDetail, setOpenDetail, principal }) => {
  const actor = useSelector((currState) => currState.actors.actor);
  console.log("principal in DiscoverInvestor", principal);
  const [allInvestorData, setAllInvestorData] = useState(null);
  const [loading, setIsLoading] = useState(true); 
  console.log("openDetail", openDetail);
  
  const getAllUser = async (caller, isMounted) => {
    await caller
      .get_vc_info_using_principal(principal)
      .then((result) => {
        if (isMounted) {
          console.log("data from api", result);
          if (result) {
            // Log the exact structure of result.data to verify it
            console.log("Data received:", result?.[0]);
            setAllInvestorData(result?.[0]);
          } else {
            setAllInvestorData([]); 
          }
          setIsLoading(false);
        }
      })
      .catch((error) => {
        if (isMounted) {
          setAllInvestorData([]);
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
        <button onClick={() => setOpenDetail(false)}  className="p-2 mb-2">
          <CloseIcon
            sx={{ cursor: "pointer" }}
            
          />
        </button>
        
        <div className="container h-[calc(100%-50px)] ml-2 pb-8 overflow-y-auto">
          <div className="container">
            <div className="flex justify-evenly px-[1%] ">
              <div className="border h-fit rounded-lg w-[32%]">
                <DiscoverInvestorAbout investorData={allInvestorData} />
              </div>
              <div className="px-3 w-[63%] overflow-y-auto h-[84vh]">
                <div>
                  <DiscoverInvestorDetail investorData={allInvestorData} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscoverInvestorPage;

import React, { useState, useEffect, useRef } from "react";
import { projectFilterSvg } from "../../Utils/Data/SvgData";
import { OutSideClickHandler } from "../../hooks/OutSideClickHandler";
import { useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import uint8ArrayToBase64 from "../../Utils/uint8ArrayToBase64";

const RequestsPrivateDocument = () => {
  const actor = useSelector((currState) => currState.actors.actor);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [requestedData, setRequestedData] = useState([]);
  const dropdownRef = useRef(null);
  OutSideClickHandler(dropdownRef, () => setIsPopupOpen(false));

  const fetchPrivateDocumentsRequests = async (status) => {
    setSelectedOption(status);
    try {
      let result;
      switch (status) {
        case "Pending":
          result = await actor.get_all_pending_requests();
          break;
        case "Accepted":
          result = await actor.get_all_approved_requests();
          break;
        case "Declined":
          result = await actor.get_all_declined_requests();
          break;
        default:
          console.log("Unknown status");
      }

      console.log("result-private-docs", result);
      if (result) {
        toast.success(result);
        setRequestedData(result);
      } else {
        toast.error(result);
        setRequestedData([]);
      }
    } catch (error) {
      console.log("error-private-docs", error);
      toast.error("An error occurred");
    }
  };

  useEffect(() => {
    if (actor) {
      fetchPrivateDocumentsRequests("Pending");
    }
  }, [actor]);

  const approveAndRejectPrivateDocument = async (
    value,
    projectId,
    principal
  ) => {
    try {
      if (actor) {
        let result;
        let argument = {
          project_id: projectId,
          sender_id: principal,
        };
        switch (value) {
          case "Approve":
            result = await actor.Approve_private_docs_access_request(argument);
            break;
          case "Decline":
            result = await actor.Decline_private_docs_access_request(argument);
            break;
          default:
            console.log("Unknown status");
        }
        if (result) {
           toast.success(result);
        } else {
          toast.error(result);
        }
      }
    } catch (error) {
      console.log("error-error-in-docs", error);
      toast.error("An error occurred");
    }
  };
  return (
    <>
      <div className="px-[4%] py-[4%] w-full bg-gray-100 h-screen overflow-y-scroll">
        <div className="flex items-center justify-between mb-8">
          {selectedOption && (
            <div className="left-4 lg:left-auto bg-gradient-to-r from-purple-900 to-blue-500 text-transparent bg-clip-text text-2xl font-extrabold">
              {selectedOption}
            </div>
          )}

          <div className="flex justify-end gap-4 relative " ref={dropdownRef}>
            <div
              className="cursor-pointer"
              onClick={() => setIsPopupOpen(true)}
            >
              {projectFilterSvg}

              {isPopupOpen && (
                <div className="absolute w-[250px] top-full right-1 bg-white shadow-md rounded-lg border border-gray-200 p-3 z-10">
                  <ul className="flex flex-col">
                    <li>
                      <button
                        onClick={() => fetchPrivateDocumentsRequests("Pending")}
                        className="px-4 font-bold py-[18px] focus:outline-none text-xl flex justify-start"
                      >
                        Pending
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() =>
                          fetchPrivateDocumentsRequests("Accepted")
                        }
                        className="border-[#9C9C9C] py-[18px] w-[230px] font-bold px-4 focus:outline-none text-xl flex justify-start"
                      >
                        Accepted
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() =>
                          fetchPrivateDocumentsRequests("Declined")
                        }
                        className="border-[#9C9C9C] py-[18px] w-[230px] px-4 font-bold focus:outline-none text-xl flex justify-start"
                      >
                        Declined
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
        {requestedData &&
          requestedData.map((data, index) => {
            let image = uint8ArrayToBase64(
              data?.notification_type?.AccessRequest?.image
            );
            let name = data?.notification_type?.AccessRequest?.name;
            let principal =
              data?.notification_type?.AccessRequest?.sender.toText();
            let status = data?.notification_type?.AccessRequest?.status;
            let projectId = data?.notification_type?.AccessRequest?.project_id;
            return (
              <div
                className="flex w-auto items-center flex-wrap justify-between bg-gray-200 rounded-lg  text-lg p-4"
                key={index}
              >
                <div className="flex items-center">
                  <img
                    src={image}
                    alt="Mentor"
                    className="w-6 h-6 lg:w-12 lg:h-12 object-cover rounded-full mb-4 lg:mb-0 border-black border-2 p-1"
                  />
                  <p className="font-extrabold ml-2">{name}</p>
                  <p
                    className="line-clamp-1 w-48 font-fontUse text-base ml-12
                  "
                  >
                    {principal}
                  </p>
                </div>

                <div className="flex flex-wrap md:flex-nowrap">
                  <button className="px-4 py-1 bg-[#3505B2] text-white font-bold rounded-full uppercase text-base">
                    {status}
                  </button>
                  {status === "approved" || status === "declined" ? (
                    ""
                  ) : (
                    <>
                      <button
                        className="px-4 py-1 bg-white text-blue-800 font-bold rounded-lg border-2 border-blue-800 ml-12"
                        onClick={() =>
                          approveAndRejectPrivateDocument(
                            "Decline",
                            projectId,
                            principal
                          )
                        }
                      >
                        Reject
                      </button>
                      <button
                        className="px-4 py-1 bg-[#3505B2] text-white font-bold rounded-lg ml-3"
                        onClick={() =>
                          approveAndRejectPrivateDocument(
                            "Approve",
                            projectId,
                            principal
                          )
                        }
                      >
                        Accept
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
      </div>

      <Toaster />
    </>
  );
};

export default RequestsPrivateDocument;

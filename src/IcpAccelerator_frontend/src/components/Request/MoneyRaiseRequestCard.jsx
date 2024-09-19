import React from 'react'
import { Star, PlaceOutlined as PlaceOutlinedIcon } from "@mui/icons-material";
import timestampAgo from "../Utils/navigationHelper/timeStampAgo";
import uint8ArrayToBase64 from "../Utils/uint8ArrayToBase64";
import toast, { Toaster } from "react-hot-toast";
import { Principal } from "@dfinity/principal";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";


const MoneyRaiseRequestCard = ({user,index,activeTabData}) => {
    console.log('Data Money',activeTabData)
    const actor = useSelector((currState) => currState.actors.actor);
    const navigate = useNavigate();


    const approveAndRejectPrivateDocument = async (
        value,
        projectId,
        principal
      ) => {
        if (!actor) {
          console.log("Actor not found");
          return null;
        }
        try {
          let result;
          switch (value) {
            case "Approve":
              result = await actor.approve_money_access_request(
                projectId,
                Principal.fromText(principal)
              );
              break;
            case "Decline":
              result = await actor.decline_money_access_request(
                projectId,
                Principal.fromText(principal)
              );
              break;
            default:
              console.log("Unknown action");
              return;
          }
    console.log('result',result)
          if (result) {
            // Assuming result contains some success indication
            toast.success(`Request ${value.toLowerCase()}ed successfully.`);
            // navigate(0);
          } else {
            toast.error(`Failed to ${value.toLowerCase()} the request.`);
            // navigate(0);
          }
        } catch (error) {
          console.error("Error processing money request action:", error);
          toast.error("An error occurred during processing.");
        }
      };

    let notificationType = user?.notification_type?.AccessRequest
    let image = notificationType?.image
    ? uint8ArrayToBase64(notificationType?.image)
    : "../../../assets/Logo/CypherpunkLabLogo.png";
    let name = notificationType?.name ?? "Unnamed";
    let project_id = notificationType?.project_id ?? "default_project_id";
    let request_type = notificationType?.request_type ?? "default_request_type";
    let status = notificationType?.status ?? "pending";
    let timestamp = user?.timestamp ?? 0n;
    let principal = notificationType?.sender.toText();
  return (
    <div className="p-6 w-[650px] rounded-lg shadow-sm flex h-60" key={index}>
    <div className="w-[272px]">
      <div className="max-w-[250px] w-[250px] bg-gray-100 rounded-lg flex flex-col justify-between h-full relative overflow-hidden cursor-pointer">
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={image}
            alt="projectLogo"
            className="w-24 h-24 rounded-full object-cover"
            loading="lazy"
            draggable={false}
          />
        </div>
  
        <div className="absolute bottom-0 right-[6px] flex items-center bg-gray-100 p-1">
          {/* <Star className="text-yellow-400 w-4 h-4" />
          <span className="text-sm font-medium">9</span> */}
        </div>
      </div>
    </div>
  
    <div className="flex-grow ml-[25px] w-[544px] flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-xl font-bold">{name}</h3>
          </div>
          <span className="mr-2 mb-2 text-[#016AA2] px-3 py-1 rounded-full bg-gray-100 text-sm">
            {activeTabData === "pending" ? (
              <span className="font-semibold">{timestampAgo(timestamp)}</span>
            ) : activeTabData === "approved" ? (
              <span className="font-semibold">{timestampAgo(timestamp)}</span>
            ) : activeTabData === "declined" ? (
              <span className="font-semibold">{timestampAgo(timestamp)}</span>
            ) : null}
          </span>
        </div>
        <p className="text-gray-600 mt-3">
              This is the description which I am giving right now so please take
              this description
            </p>
      </div>
  
      <div>
        {activeTabData === "pending" ? (
          <div className="flex mt-auto">
        <div className="border-t border-gray-200 mt-3"></div>
  
            <button
              className="mr-2 mb-2 border border-[#097647] bg-[#EBFDF3] text-[#097647]  px-3 py-1 rounded-full"
              onClick={() =>
                approveAndRejectPrivateDocument("Approve", project_id, principal)
              }
            >
              Accept
            </button>
            <button
              className="mr-2 mb-2 border border-[#C11574] bg-[#FDF2FA] text-[#C11574]  px-3 py-1 rounded-full"
              onClick={() =>
                approveAndRejectPrivateDocument("Decline", project_id, principal)
              }
            >
              Reject
            </button>
          </div>
        ) : activeTabData === "approved" ? (
          <div className="py-2 flex justify-end">
            <span className="mr-2 mb-2 border border-[#097647] bg-[#EBFDF3] text-[#097647]  px-3 py-1 rounded-full capitalize">
              {status}
            </span>
          </div>
        ) : activeTabData === "declined" ? (
          <div className="py-2 flex justify-end">
            <span className="mr-2 mb-2 border border-[#C11574] bg-[#FDF2FA] text-[#C11574]  px-3 py-1 rounded-full capitalize">
              {status}
            </span>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  </div>
  )
}

export default MoneyRaiseRequestCard
import React, { useEffect, useState } from "react";
import { FaTelegramPlane, FaDiscord } from "react-icons/fa";
import XIcon from "@mui/icons-material/X";
import flag from "../../../assets/Logo/IT.png";
import { useSelector } from "react-redux";
import uint8ArrayToBase64 from "../Utils/uint8ArrayToBase64";

import RegionalHubModal from "./RegionalHubModal";

const DiscoverRegionalHubs = () => {
  const actor = useSelector((currState) => currState.actors.actor);
  const [allHubsData, setAllHubsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  const getAllHubs = async (caller, isMounted) => {
    await caller
      .get_icp_hub_details()
      .then((result) => {
        if (isMounted) {
          console.log("HUBS RESULT", result);
          if (result) {
            setAllHubsData(result);
          } else {
            setAllHubsData([]);
          }
          setIsLoading(false);
        }
      })
      .catch((error) => {
        if (isMounted) {
          setAllHubsData([]);
          setIsLoading(false);
          console.log("error-in-get-all-hubs", error);
        }
      });
  };

  console.log("HUBS DATA", allHubsData);
  useEffect(() => {
    let isMounted = true;

    if (actor) {
      getAllHubs(actor, isMounted);
    } else {
      getAllHubs(IcpAccelerator_backend);
    }

    return () => {
      isMounted = false;
    };
  }, [actor]);

  return (
    <div className="container mx-auto mb-5 bg-white">
      <div className="flex justify-start items-center h-11 bg-opacity-95 -top-[.60rem] p-10 px-0 sticky bg-white z-20">
        <div className="flex justify-between w-full">
          <h2 className="text-2xl font-bold">Discover Regional Hubs</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="border-2 px-2 border-black py-1"
          >
            Jai ho
          </button>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {allHubsData.map((hub, index) => {
          let name = hub.params.name[0] ?? "";
          let desc = hub.params.description[0] ?? "";
          let discord = hub.params.discord[0] ?? "";
          let telegram = hub.params.telegram[0] ?? "";
          let twitter = hub.params.twitter[0] ?? "";
          let website = hub.params.website[0] ?? "";
          let logo = hub.params?.flag[0]
            ? uint8ArrayToBase64(hub.params?.flag[0])
            : null;
          return (
            <div key={index} className="bg-white rounded-lg shadow-lg p-4">
              <div>
                <img
                  src={logo}
                  alt={name}
                  className="w-12 h-12 rounded-full mb-3"
                />
                <div>
                  <h3 className="text-lg font-semibold">{name}</h3>
                  <p className="text-sm text-gray-600">{desc}</p>
                </div>
              </div>
              <div className="items-center mt-4">
                <div className="flex items-center space-x-2 mb-3">
                  <a
                    href={twitter}
                    target="_blank"
                    className="text-gray-500 hover:text-red-500"
                  >
                    <XIcon />
                  </a>
                  <a
                    href={discord}
                    target="_blank"
                    className="text-gray-500 hover:text-blue-500"
                  >
                    <FaDiscord className="text-[2rem]" />
                  </a>
                  <a
                    href={telegram}
                    target="_blank"
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaTelegramPlane className="text-[2rem]" />
                  </a>
                </div>
                <hr />
                <div className="mt-3">
                  <a
                    href={website}
                    target="_blank"
                    className="bg-[#155EEF] shadow-[0px_1px_2px_0px_#1018280D,0px_-2px_0px_0px_#1018280D_inset,0px_0px_0px_1px_#1018282E_inset] block border-2 border-white text-white py-[10px] px-4 rounded-[4px] text-sm font-medium hover:bg-blue-700 my-4"
                  >
                    {website} &#8594;
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Render the modal when isModalOpen is true */}
      {isModalOpen && <RegionalHubModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default DiscoverRegionalHubs;

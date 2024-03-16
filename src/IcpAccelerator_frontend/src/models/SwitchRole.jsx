import React, { useRef } from "react";
import { closeSwitchModalSvg } from "../components/Utils/Data/SvgData";
import { useSelector } from "react-redux";
import TabsDiv from "../components/Layout/Tabs/TabsDiv";
import { OutSideClickHandler } from "../components/hooks/OutSideClickHandler";

const SwitchRole = ({ isModalOpen, onClose }) => {

    const userCurrentRoleStatus = useSelector(
        (currState) => currState.currentRoleStatus.rolesStatusArray
    );

    return (
        <>
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50">
                    <div className=" overflow-y-auto overflow-x-hidden top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full fixed flex">
                        <div className="relative bg-[B8B8B8] w-full max-w-md max-h-full">
                            <span className="p-2 cursor-pointer" onClick={onClose}>
                                {closeSwitchModalSvg}
                            </span>
                            <div className="relative bg-[#B8B8B8] rounded-[25px] shadow">
                                <div className="border border-[#B8B8B8] rounded-[25px]">
                                    <ul className="rounded-[25px] border border-[#B8B8B8] overflow-hidden cursor-pointer">
                                        {userCurrentRoleStatus && userCurrentRoleStatus.map((val, index) => {
                                            return (
                                                <TabsDiv key={index} role={val} onClose={onClose} />
                                            )
                                        }
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SwitchRole;

import React from "react";
import { closeModalSvg } from "../components/Utils/Data/SvgData";
import { useSelector } from "react-redux";
import TabsDiv from "../components/Layout/Tabs/TabsDiv";

const SwitchRole = ({ isModalOpen, onClose }) => {

    const userCurrentRoleStatus = useSelector(
        (currState) => currState.currentRoleStatus.rolesStatusArray
    );

    return (
        <>
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50">
                    <div className=" overflow-y-auto overflow-x-hidden  top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full fixed flex">
                        <div className="relative p-4 w-full max-w-md max-h-full">
                            <div className="relative bg-gray-300 rounded-lg shadow">
                                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                                    <button
                                        type="button"
                                        className="text-gray-400 bg-transparent hover:text-gray-900 rounded-lg text-sm h-8 w-8 inline-flex justify-center items-center"
                                        onClick={onClose}
                                    >
                                        {closeModalSvg}
                                    </button>
                                    <h3 className="text-lg font-semibold text-gray-900 grow text-center">
                                        Switch Role
                                    </h3>
                                </div>
                                <div className="p-4 md:p-5">
                                    <ul className="mb-4 space-y-3 cursor-pointer">
                                        {userCurrentRoleStatus && userCurrentRoleStatus.map((val, index) => {
                                            console.log(val)
                                            return(
                                            <TabsDiv key={index} role={val} onClose={onClose} />
                                        )}
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

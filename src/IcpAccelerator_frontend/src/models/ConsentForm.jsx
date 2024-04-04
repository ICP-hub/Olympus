import React from "react";
import { closeModalSvg } from "../components/Utils/Data/SvgData";
import { useSelector } from "react-redux";
import TabsDiv from "../components/Layout/Tabs/TabsDiv";

const ConsentForm = ({ isModalOpen, onClose, main_level, selected_level, onSubmitHandler }) => {

    const userCurrentRoleStatus = useSelector(
        (currState) => currState.currentRoleStatus.rolesStatusArray
    );

    const grey_tick_svg = (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
        >
            <path d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z" stroke="#C8C8C8" strokeWidth="1.5" />
            <path d="M8 12.75C8 12.75 9.6 13.6625 10.4 15C10.4 15 12.8 9.75 16 8"
                stroke="#C8C8C8"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )

    const green_tick_svg = (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="25"
            viewBox="0 0 24 25"
            fill="none"
        >
            <path d="M22 12.9589C22 7.43601 17.5228 2.95886 12 2.95886C6.47715 2.95886 2 7.43601 2 12.9589C2 18.4817 6.47715 22.9589 12 22.9589C17.5228 22.9589 22 18.4817 22 12.9589Z" stroke="#3B7A05" strokeWidth="1.5" />
            <path d="M8 13.7089C8 13.7089 9.6 14.6214 10.4 15.9589C10.4 15.9589 12.8 10.7089 16 8.95886"
                stroke="#3B7A05"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )

    console.log("main_level===============>>>>>", main_level)
    console.log("selected_level===========>>>>>", selected_level)
    const onSubmit = () => {
        onSubmitHandler(main_level.title, selected_level)
    }
    return (
        <>
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50">
                    <div className=" overflow-y-auto overflow-x-hidden  top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full fixed flex">
                        <div className="relative p-4 w-full max-w-2xl max-h-full">
                            <div className="relative bg-white rounded-lg shadow">
                                <div className="flex p-4 md:p-5 rounded-t">
                                    <h3 className="text-lg font-bold text-gray-900 grow uppercase  border-b">
                                        {main_level.title} ({selected_level + 1}/9)
                                    </h3>
                                </div>
                                <div className="px-4 mb-2 pt-0">
                                    <ul className="mb-4 space-y-1 cursor-pointer h-64 overflow-y-scroll">
                                        {main_level.levels.map((val, index) => {
                                            let li_css = ((index) <= (selected_level)) ? 'text-green-700' : 'text-gray-500';
                                            let li_svg = ((index) <= (selected_level)) ? green_tick_svg : grey_tick_svg;
                                            return (
                                                <li className="flex items-center" key={index}>
                                                    <div className="w-11/12">
                                                        <div className={`flex justify-between items-center w-full ${li_css}`}>
                                                            <div className="flex">
                                                                <span className="font-bold text-lg">{index + 1}.</span>
                                                                <p className="font-bold text-lg ml-1">{val?.title}</p>
                                                            </div>
                                                            <div className="text-end">
                                                                {li_svg}
                                                            </div>
                                                        </div>
                                                        <p className="text-sm text-gray-400 px-5">{val?.desc}</p>
                                                    </div>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </div>
                                <div className="px-4 pt-0">
                                    <div className="flex justify-end gap-2 border-t">
                                        <button
                                            type="button"
                                            className="font-bold rounded-md my-2 bg-indigo-600 font-fontUse text-center text-white uppercase text-[0.625rem] md:text-[0.64375rem] lg:text-[0.65625rem] xl:text-[0.78125rem] px-6 py-2 top-[6.5rem] sm4:top-[10.5rem] xxs1:top-[8.5rem] ss2:top-[7.5rem] text-wrap"
                                            onClick={onClose}
                                        >Change</button>
                                        <button
                                            type="button"
                                            className="font-bold rounded-md my-2 bg-indigo-600 font-fontUse text-center text-white uppercase text-[0.625rem] md:text-[0.64375rem] lg:text-[0.65625rem] xl:text-[0.78125rem] px-6 py-2 top-[6.5rem] sm4:top-[10.5rem] xxs1:top-[8.5rem] ss2:top-[7.5rem] text-wrap"
                                            onClick={onSubmit}>Agree ({selected_level + 1}/9)</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ConsentForm;

import React, { useState, useEffect } from 'react';
import { Memberssvg, Socialmedia } from '../Utils/Data/SvgData';

const Members = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const togglePopup = () => {
        setIsPopupOpen(!isPopupOpen);
    };

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (isPopupOpen && !event.target.closest('.max-w-sm')) {
                setIsPopupOpen(false);
            }
        };

        document.addEventListener('click', handleOutsideClick);

        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, [isPopupOpen]);

    return (
        <div className="flex flex-wrap justify-center">
            <div className="w-48 sm:w-1/4 lg:md:p-4 p-6 mx-2 mt-16 shadow-xl rounded-lg text-gray-900 bg-gray-500">
                <div onClick={togglePopup}>
                    {Memberssvg}
                </div>
                {isPopupOpen && (
                    <div className="fixed inset-0 flex items-center justify-center  w-full">
                        <div className=" bg-gray-200 shadow-md rounded-lg overflow-hidden">
                            <div className="px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <button className="px-2 py-2 text-black font-bold lg:text-2xl md:text-xl text-lg">Edit Profile</button>
                                </div>
                                <div className="mt-4">
                                    <img className="rounded-full mx-auto lg:md:h-28 lg:md:w-28 w-32 h-32 sm:w-20 sm:h-20" src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ" alt="User Avatar" />
                                </div>
                                <div className="mt-4">
                                    <input className="w-full border-2 border-gray-600 px-4 py-2 rounded-md focus:outline-none focus:border-blue-500" type="text" placeholder="Name" />
                                </div>
                                <div className="mt-4">
                                    <input className="w-full px-4 py-2 border-2 border-gray-600 rounded-lg focus:outline-none focus:border-blue-500" type="text" placeholder="Username" />
                                </div>
                                <div className="mt-4">
                                    <input className="w-full px-4 py-2 border-2 border-gray-600 rounded-lg focus:outline-none focus:border-blue-500" type="text" placeholder="Role in project" />
                                </div>
                                <div className="mt-8 flex justify-center">
                                    <button className="px-4 py-2 bg-blue-900 text-white rounded-lg focus:outline-none focus:bg-blue-800">Updates</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div className="">
                    <div className="relative w-32 h-32 overflow-hidden mt-[-40px]">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="absolute inset-0 border-2 border-transparent rounded-full backdrop-filter backdrop-blur-lg"></div>
                            <img
                                className="object-cover object-start h-32 w-32 rounded-full z-10"
                                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ"
                                alt="Woman looking front"
                            />
                        </div>
                    </div>


                    <div className="text-center mt-2 flex items-start">
                        <div className="">
                            <h2 className="font-bold flex justify-start text-xl">SamyKarim</h2>
                            <p className="text-gray-200">Toshi, Managing Partner. Ex-Binance</p>
                        </div>
                        {Socialmedia}
                    </div>
                </div>
            </div>
            <div className="w-48 sm:w-1/4 lg:md:p-4 p-6 mx-2 mt-16 shadow-xl rounded-lg text-gray-900 bg-gray-500">
                <div onClick={togglePopup}>
                    {Memberssvg}
                </div>
                {isPopupOpen && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 w-full">
                        <div className="max-w-lg bg-gray-200 shadow-md rounded-lg overflow-hidden">
                            <div className="px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <button className="px-2 py-2 text-black font-bold lg:text-2xl md:text-xl text-lg">Edit Profile</button>
                                </div>
                                <div className="mt-4">
                                    <img className="rounded-full mx-auto lg:md:h-28 lg:md:w-28 w-32 h-32 sm:w-20 sm:h-20" src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ" alt="User Avatar" />
                                </div>
                                <div className="mt-4">
                                    <input className="w-full border-2 border-gray-600 px-4 py-2 rounded-md focus:outline-none focus:border-blue-500" type="text" placeholder="Name" />
                                </div>
                                <div className="mt-4">
                                    <input className="w-full px-4 py-2 border-2 border-gray-600 rounded-lg focus:outline-none focus:border-blue-500" type="text" placeholder="Username" />
                                </div>
                                <div className="mt-4">
                                    <input className="w-full px-4 py-2 border-2 border-gray-600 rounded-lg focus:outline-none focus:border-blue-500" type="text" placeholder="Role in project" />
                                </div>
                                <div className="mt-8 flex justify-center">
                                    <button className="px-4 py-2 bg-blue-900 text-white rounded-lg focus:outline-none focus:bg-blue-800">Updates</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div className="">
                    <div className="relative w-32 h-32 overflow-hidden mt-[-40px]">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="absolute inset-0 border-2 border-transparent rounded-full backdrop-filter backdrop-blur-lg"></div>
                            <img
                                className="object-cover object-start h-32 w-32 rounded-full z-10"
                                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ"
                                alt="Woman looking front"
                            />
                        </div>
                    </div>


                    <div className="text-center mt-2 flex items-start">
                        <div className="">
                            <h2 className="font-bold flex justify-start text-xl">SamyKarim</h2>
                            <p className="text-gray-200">Toshi, Managing Partner. Ex-Binance</p>
                        </div>
                        {Socialmedia}
                    </div>
                </div>
            </div>
            <div className="w-48 sm:w-1/4 lg:md:p-4 p-6 mx-2 mt-16 shadow-xl rounded-lg text-gray-900 bg-gray-500">
                <div onClick={togglePopup}>
                    {Memberssvg}
                </div>
                {isPopupOpen && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 w-full">
                        <div className="max-w-lg bg-gray-200 shadow-md rounded-lg overflow-hidden">
                            <div className="px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <button className="px-2 py-2 text-black font-bold lg:text-2xl md:text-xl text-lg">Edit Profile</button>
                                </div>
                                <div className="mt-4">
                                    <img className="rounded-full mx-auto lg:md:h-28 lg:md:w-28 w-32 h-32 sm:w-20 sm:h-20" src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ" alt="User Avatar" />
                                </div>
                                <div className="mt-4">
                                    <input className="w-full border-2 border-gray-600 px-4 py-2 rounded-md focus:outline-none focus:border-blue-500" type="text" placeholder="Name" />
                                </div>
                                <div className="mt-4">
                                    <input className="w-full px-4 py-2 border-2 border-gray-600 rounded-lg focus:outline-none focus:border-blue-500" type="text" placeholder="Username" />
                                </div>
                                <div className="mt-4">
                                    <input className="w-full px-4 py-2 border-2 border-gray-600 rounded-lg focus:outline-none focus:border-blue-500" type="text" placeholder="Role in project" />
                                </div>
                                <div className="mt-8 flex justify-center">
                                    <button className="px-4 py-2 bg-blue-900 text-white rounded-lg focus:outline-none focus:bg-blue-800">Updates</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div className="">
                    <div className="relative w-32 h-32 overflow-hidden mt-[-40px]">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="absolute inset-0 border-2 border-transparent rounded-full backdrop-filter backdrop-blur-lg"></div>
                            <img
                                className="object-cover object-start h-32 w-32 rounded-full z-10"
                                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ"
                                alt="Woman looking front"
                            />
                        </div>
                    </div>


                    <div className="text-center mt-2 flex items-start">
                        <div className="">
                            <h2 className="font-bold flex justify-start text-xl">SamyKarim</h2>
                            <p className="text-gray-200">Toshi, Managing Partner. Ex-Binance</p>
                        </div>
                        {Socialmedia}
                    </div>
                </div>
            </div>
            <div className="w-48 sm:w-1/4 lg:md:p-4 p-6 mx-2 mt-16 shadow-xl rounded-lg text-gray-900 bg-gray-500">
                <div onClick={togglePopup}>
                    {Memberssvg}
                </div>
                {isPopupOpen && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 w-full">
                        <div className="max-w-lg bg-gray-200 shadow-md rounded-lg overflow-hidden">
                            <div className="px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <button className="px-2 py-2 text-black font-bold lg:text-2xl md:text-xl text-lg">Edit Profile</button>
                                </div>
                                <div className="mt-4">
                                    <img className="rounded-full mx-auto lg:md:h-28 lg:md:w-28 w-32 h-32 sm:w-20 sm:h-20" src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ" alt="User Avatar" />
                                </div>
                                <div className="mt-4">
                                    <input className="w-full border-2 border-gray-600 px-4 py-2 rounded-md focus:outline-none focus:border-blue-500" type="text" placeholder="Name" />
                                </div>
                                <div className="mt-4">
                                    <input className="w-full px-4 py-2 border-2 border-gray-600 rounded-lg focus:outline-none focus:border-blue-500" type="text" placeholder="Username" />
                                </div>
                                <div className="mt-4">
                                    <input className="w-full px-4 py-2 border-2 border-gray-600 rounded-lg focus:outline-none focus:border-blue-500" type="text" placeholder="Role in project" />
                                </div>
                                <div className="mt-8 flex justify-center">
                                    <button className="px-4 py-2 bg-blue-900 text-white rounded-lg focus:outline-none focus:bg-blue-800">Updates</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div className="">
                    <div className="relative w-32 h-32 overflow-hidden mt-[-40px]">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="absolute inset-0 border-2 border-transparent rounded-full backdrop-filter backdrop-blur-lg"></div>
                            <img
                                className="object-cover object-start h-32 w-32 rounded-full z-10"
                                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ"
                                alt="Woman looking front"
                            />
                        </div>
                    </div>


                    <div className="text-center mt-2 flex items-start">
                        <div className="">
                            <h2 className="font-bold flex justify-start text-xl">SamyKarim</h2>
                            <p className="text-gray-200">Toshi, Managing Partner. Ex-Binance</p>
                        </div>
                        {Socialmedia}
                    </div>
                </div>
            </div>
            <div className="w-48 sm:w-1/4 lg:md:p-4 p-6 mx-2 mt-16 shadow-xl rounded-lg text-gray-900 bg-gray-500">
                <div onClick={togglePopup}>
                    {Memberssvg}
                </div>
                {isPopupOpen && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 w-full">
                        <div className="max-w-lg bg-gray-200 shadow-md rounded-lg overflow-hidden">
                            <div className="px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <button className="px-2 py-2 text-black font-bold lg:text-2xl md:text-xl text-lg">Edit Profile</button>
                                </div>
                                <div className="mt-4">
                                    <img className="rounded-full mx-auto lg:md:h-28 lg:md:w-28 w-32 h-32 sm:w-20 sm:h-20" src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ" alt="User Avatar" />
                                </div>
                                <div className="mt-4">
                                    <input className="w-full border-2 border-gray-600 px-4 py-2 rounded-md focus:outline-none focus:border-blue-500" type="text" placeholder="Name" />
                                </div>
                                <div className="mt-4">
                                    <input className="w-full px-4 py-2 border-2 border-gray-600 rounded-lg focus:outline-none focus:border-blue-500" type="text" placeholder="Username" />
                                </div>
                                <div className="mt-4">
                                    <input className="w-full px-4 py-2 border-2 border-gray-600 rounded-lg focus:outline-none focus:border-blue-500" type="text" placeholder="Role in project" />
                                </div>
                                <div className="mt-8 flex justify-center">
                                    <button className="px-4 py-2 bg-blue-900 text-white rounded-lg focus:outline-none focus:bg-blue-800">Updates</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div className="">
                    <div className="relative w-32 h-32 overflow-hidden mt-[-40px]">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="absolute inset-0 border-2 border-transparent rounded-full backdrop-filter backdrop-blur-lg"></div>
                            <img
                                className="object-cover object-start h-32 w-32 rounded-full z-10"
                                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ"
                                alt="Woman looking front"
                            />
                        </div>
                    </div>


                    <div className="text-center mt-2 flex items-start">
                        <div className="">
                            <h2 className="font-bold flex justify-start text-xl">SamyKarim</h2>
                            <p className="text-gray-200">Toshi, Managing Partner. Ex-Binance</p>
                        </div>
                        {Socialmedia}
                    </div>
                </div>
            </div>
            <div className="w-48 sm:w-1/4 lg:md:p-4 p-6 mx-2 mt-16 shadow-xl rounded-lg text-gray-900 bg-gray-500">
                <div onClick={togglePopup}>
                    {Memberssvg}
                </div>
                {isPopupOpen && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 w-full">
                        <div className="max-w-lg bg-gray-200 shadow-md rounded-lg overflow-hidden">
                            <div className="px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <button className="px-2 py-2 text-black font-bold lg:text-2xl md:text-xl text-lg">Edit Profile</button>
                                </div>
                                <div className="mt-4">
                                    <img className="rounded-full mx-auto lg:md:h-28 lg:md:w-28 w-32 h-32 sm:w-20 sm:h-20" src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ" alt="User Avatar" />
                                </div>
                                <div className="mt-4">
                                    <input className="w-full border-2 border-gray-600 px-4 py-2 rounded-md focus:outline-none focus:border-blue-500" type="text" placeholder="Name" />
                                </div>
                                <div className="mt-4">
                                    <input className="w-full px-4 py-2 border-2 border-gray-600 rounded-lg focus:outline-none focus:border-blue-500" type="text" placeholder="Username" />
                                </div>
                                <div className="mt-4">
                                    <input className="w-full px-4 py-2 border-2 border-gray-600 rounded-lg focus:outline-none focus:border-blue-500" type="text" placeholder="Role in project" />
                                </div>
                                <div className="mt-8 flex justify-center">
                                    <button className="px-4 py-2 bg-blue-900 text-white rounded-lg focus:outline-none focus:bg-blue-800">Updates</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div className="">
                    <div className="relative w-32 h-32 overflow-hidden mt-[-40px]">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="absolute inset-0 border-2 border-transparent rounded-full backdrop-filter backdrop-blur-lg"></div>
                            <img
                                className="object-cover object-start h-32 w-32 rounded-full z-10"
                                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ"
                                alt="Woman looking front"
                            />
                        </div>
                    </div>


                    <div className="text-center mt-2 flex items-start">
                        <div className="">
                            <h2 className="font-bold flex justify-start text-xl">SamyKarim</h2>
                            <p className="text-gray-200">Toshi, Managing Partner. Ex-Binance</p>
                        </div>
                        {Socialmedia}
                    </div>
                </div>
            </div>


        </div>
    );
};

export default Members;

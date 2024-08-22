import React from 'react'
import org from "../../../../assets/images/Org.png"

const UserProjectCard = () => {
    return (
        <div className="bg-white shadow-md border rounded-lg p-4 ">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Projects</h2>
            <div className="flex items-center pl-3 gap-6">
                <div className="w-[300px] h-[120px] bg-gray-100 rounded-md flex items-center justify-center">
                    <img
                        src={org}
                        alt="Cypherpunk Labs Logo"
                        className="w-[90px] h-[90px] "
                    />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-gray-900">Cypherpunk Labs</h3>
                    <p className="text-gray-500">@cypherpunklabs</p>
                    <p className="text-gray-600 text-sm mt-2">
                        Est malesuada ac elit gravida vel aliquam nec. Arcu pelle ntesque convallis quam feugiat non viverra massa fringilla.
                    </p>
                </div>
            </div>
            <div className="flex pl-3 space-x-2 mt-4">
                <span className=" text-gray-700 text-xs font-medium px-2.5 py-0.5 border rounded-xl">MVP</span>
                <span className=" text-gray-700 text-xs font-medium px-2.5 py-0.5 border rounded-xl">Infrastructure</span>
            </div>
        </div>
    )
}

export default UserProjectCard
import React from 'react'
import { MoreVert, Star, PlaceOutlined as PlaceOutlinedIcon } from "@mui/icons-material";

const AssociationApprovedCard = ({user,index}) => {
  return (
    <div key={index} className="p-6 w-[650px] rounded-lg shadow-sm flex">
    <div className="w-[272px]">
      <div onClick={() => handleOpenDetail(user)} className="max-w-[250px] w-[250px] bg-gray-100 rounded-lg flex flex-col justify-between h-full relative overflow-hidden cursor-pointer">
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-24 h-24 rounded-full object-cover"
          />
        </div>
        {user.rating && (
          <div className="absolute bottom-0 right-[6px] flex items-center bg-gray-100 p-1">
            <Star className="text-yellow-400 w-4 h-4" />
            <span className="text-sm font-medium">{user.rating}</span>
          </div>
        )}
      </div>
    </div>

    <div className="flex-grow ml-[25px] w-[544px]">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-xl font-bold">{user.name}</h3>
          <p className="text-gray-500">@{user.username}</p>
        </div>
        <MoreVert className="text-gray-400 cursor-pointer" fontSize="small" />
      </div>

      <div className="border-t border-gray-200 my-3"></div>
      <p className="font-medium ">{user.role}</p>

      <p className="text-gray-600 mb-4 overflow-hidden line-clamp-1 text-ellipsis max-h-[1.75rem]">
        {user.description}
      </p>
      <div className="flex items-center text-sm text-gray-500 flex-wrap">
        {user.skills.map((skill, index) => (
          <span
            key={index}
            className="mr-2 mb-2 border boder-[#CDD5DF] bg-white text-[#364152] px-3 py-1 rounded-full"
          >
            {skill}
          </span>
        ))}
        {user.location && (
          <span className="mr-2 mb-2 flex text-[#121926] items-center">
            <PlaceOutlinedIcon className="text-[#364152] mr-1 w-4 h-4" /> {user.location}
          </span>
        )}
      </div>
      <div className="py-2 flex justify-end">
      <span
            className="mr-2 mb-2 border border-[#097647] bg-[#EBFDF3] text-[#097647]  px-3 py-1 rounded-full"
          >
            Accepted
          </span>
      </div>
    </div>
  </div>
  )
}

export default AssociationApprovedCard
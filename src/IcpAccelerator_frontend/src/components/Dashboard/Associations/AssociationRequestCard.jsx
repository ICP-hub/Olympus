import React, { useState, useMemo, useCallback } from 'react';
import { MoreVert, Star, FavoriteBorder, PlaceOutlined as PlaceOutlinedIcon } from "@mui/icons-material";
import ProfileImage from "../../../../assets/Logo/ProfileImage.png";
import NeilProfileImages from "../../../../assets/Logo/NeilProfileImages.png";
import LeonProfileImage from "../../../../assets/Logo/LeonProfileImage.png";
import BlancheProfileImage from "../../../../assets/Logo/BlancheProfileImage.png";
import CypherpunkLabLogo from "../../../../assets/Logo/CypherpunkLabLogo.png";
import { FaFilter } from "react-icons/fa";
import ProjectAssociationFilter from './ProjectAssociationFilter';
import { useSelector } from 'react-redux';
import { Principal } from "@dfinity/principal";
import AssociationPendingCard from './AssociationPendingCard';
import AssociationApprovedCard from './AssociationApprovedCard';
import AssociationDeclinedCard from './AssociationDeclinedCard';

const users = [
  {
    name: "Matt Bowers",
    username: "mattbowers",
    tags: ["OLYMPIAN", "FOUNDER"],
    role: "Founder & CEO at Cypherpunk Labs",
    description: "Est malesuada ac elit gravida vel aliquam nec. Arcu pelle ntesque convallis quam feugiat non viverra massa fringilla.",
    rating: "5.0",
    skills: ["Web3", "Cryptography"],
    location: "San Diego, CA",
    avatar: ProfileImage,
  },
  {
    name: "Cypherpunk Labs",
    username: "cypherpunklabs",
    tags: ["PROJECT"],
    role: "Bringing privacy back to users",
    description: "Est malesuada ac elit gravida vel aliquam nec. Arcu pelle ntesque convallis quam feugiat non viverra massa fringilla.",
    skills: ["MVP", "Infrastructure"],
    avatar: CypherpunkLabLogo,
  },
  {
    name: "Neil Prosacco",
    username: "username",
    tags: ["OLYMPIAN"],
    role: "Sollicitudin tellus a ac ac tempor est quis fringilla arcu.",
    description: "Est malesuada ac elit gravida vel aliquam nec. Arcu pelle ntesque convallis quam feugiat non viverra massa fringilla.",
    rating: "5.0",
    skills: ["Web3", "Cryptography"],
    location: "San Diego, CA",
    avatar: NeilProfileImages,
  },
  {
    name: "Blanche Zieme",
    username: "mattbowers",
    tags: ["OLYMPIAN", "INVESTOR"],
    role: "A a porttitor placerat egestas. Ut amet dignissim auctor rhoncus.",
    description: "Est malesuada ac elit gravida vel aliquam nec. Arcu pelle ntesque convallis quam feugiat non viverra massa fringilla.",
    rating: "5.0",
    skills: ["Web3", "Cryptography"],
    location: "San Diego, CA",
    avatar: BlancheProfileImage,
  },
  {
    name: "Leon Medhurst",
    username: "mattbowers",
    tags: ["OLYMPIAN", "TALENT"],
    role: "Fringilla tincidunt ornare curabitur sed sagittis etiam accumsan.",
    description: "Est malesuada ac elit gravida vel aliquam nec. Arcu pelle ntesque convallis quam feugiat non viverra massa fringilla.",
    rating: "5.0",
    skills: ["Web3", "Cryptography"],
    location: "San Diego, CA",
    avatar: LeonProfileImage,
  },
];

const AssociationRequestCard = () => {
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedType, setSelectedType] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [associateData,setAssociateData ]=useState([]);
  const projectFullData = useSelector(
    (currState) => currState.projectData.data
  );
  const userPrincipal = useSelector((currState) => currState.internet.principal);
  const convertedPrincipal =  Principal.fromText(userPrincipal);

  const projectId = projectFullData?.[0]?.[0]?.uid;
console.log('associateData',associateData)

  const tagColors = useMemo(() => ({
    OLYMPIAN: 'bg-[#F0F9FF] border-[#B9E6FE] border text-[#026AA2] rounded-md',
    FOUNDER: 'bg-[#EEF4FF] border-[#C7D7FE] border text-[#3538CD] rounded-md',
    PROJECT: 'bg-[#F8FAFC] text-[#364152] border border-[#E3E8EF] rounded-md',
    INVESTOR: 'bg-[#FFFAEB] border-[#FEDF89] border text-[#B54708] rounded-md',
    TALENT: 'bg-[#ECFDF3] border-[#ABEFC6] border text-[#067647] rounded-md',
  }), []);

  const handleOpenDetail = useCallback((user) => {
    setSelectedUser(user);
    setOpenDetail(true);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setOpenDetail(false);
    setSelectedUser(null);
  }, []);

  const toggleFilter = useCallback(() => {
    setFilterOpen((prev) => !prev);
  }, []);

  return (
    <div className="space-y-4 relative">
      <div className="flex gap-3 items-center p-6 w-[650px]">
        <div className="flex items-center border-2 border-gray-400 rounded-lg overflow-hidden w-full h-[50px]">
          <div className="flex items-center px-4">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103.5 3.5a7.5 7.5 0 0013.65 13.65z"></path>
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search people, projects, jobs, events"
            className="w-full py-2 px-4 text-gray-700 focus:outline-none"
          />
          <div className="px-4">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6h18M3 12h18m-7 6h7"></path>
            </svg>
          </div>
        </div>
        <FaFilter onClick={toggleFilter} className="text-gray-400 text-2xl cursor-pointer" />
      </div>

      {associateData.map((user, index) => (<>
        <AssociationPendingCard user={user} index={index} />
        {/* <AssociationApprovedCard user={user} index={index}/>
        <AssociationDeclinedCard user={user} index={index}/> */}

        
        </>
      ))}

      {filterOpen && (
        <ProjectAssociationFilter open={filterOpen} close={toggleFilter} projectId={projectId} userPrincipal={convertedPrincipal}associateData={associateData} setAssociateData={setAssociateData} />
      )}
    </div>
  );
};

export default AssociationRequestCard;

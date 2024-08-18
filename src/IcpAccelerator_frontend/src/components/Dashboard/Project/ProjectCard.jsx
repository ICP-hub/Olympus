import React, { useEffect, useState } from 'react';
import CypherpunkLabLogo from "../../../../assets/Logo/CypherpunkLabLogo.png";
import {  useLocation } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { Principal } from "@dfinity/principal";
import { 
    MoreVert
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import ProjectRegisterMain from '../../Modals/ProjectRegisterModal/ProjectRegisterMain';

import { useSelector } from 'react-redux';
const ProjectCard = () => {
    const [isopen, setModalOpen] = useState(false);
    const [cardData, setCardData] = useState([]); 
    const actor = useSelector((currState) => currState.actors.actor);
    const handleOpenModal = () => {
        setModalOpen(!isopen); 
    };
console.log("my card data .........",cardData)
// console.log("my card data uid.........",cardData.length > 0 ? cardData[0].uid : 'No UID available')
const location = useLocation();

const principal = useSelector((currState) => currState.internet.principal);
console.log("my card data principle.........",principal)
    useEffect(() => {
        const fetchProjectData = async () => {
            try {
                const convertedPrincipal = await Principal.fromText('2vxsx-fae');
                const data = await actor.get_project_info_using_principal(convertedPrincipal);
                console.log("Received data from actor:", data);
                setCardData(data);
            } catch (error) {
                console.error("Error fetching project data:", error);
            }
        };

        fetchProjectData();
    }, [actor, ]);
  

    const navigate = useNavigate();

    const handleNavigation = () => {
      const projectId = cardData.length > 0 ? cardData[0].uid : 'No UID available';
      navigate('/dashboard/document', { state: { projectId,cardData } });
    };
    return (
      <div className="pt-12">
      <div className="flex flex-col items-end mb-8">
        <button
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          onClick={handleOpenModal} 
        >
          + Add new project
        </button>
      </div>
<div className='mb-3'>
      {/* Progress bar */}
      <div className="bg-[#EEF2F6] rounded-t-2xl h-1.5 w-[200px] ml-[10px] -mb-[8px] dark:bg-[#EEF2F6] overflow-hidden">
        <div className="relative h-1 bg-gray-200">
          <div className="absolute left-0 top-0 h-full bg-green-500 w-1/3"></div>
        </div>
      </div>

    
      <Link to="/dashboard/document">
      <div className="flex items-center">
          <div className="w-[240px] h-[195px] bg-[#EEF2F6] flex justify-center items-center rounded-2xl">
            <img
              src={CypherpunkLabLogo}
              alt="Cypherpunk Labs"
              className="w-20 h-20 rounded-2xl border-4 border-[#FFFFFF]"
            />
          </div>

          <div className="ml-4 w-2/3 relative">
            {/* Three-dot menu button */}
            <button className="absolute right-0 text-gray-400 hover:text-gray-600">
              <MoreVert fontSize="small" />
            </button>
            <h2 className="text-xl font-semibold text-gray-900">Cypherpunk Labs</h2>
            <p className="text-sm text-gray-500 mb-4">@cypherpunklabs</p>
            <hr />
            <p className="mt-4 text-sm text-gray-700">
              Bringing privacy back to users
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Est malesuada ac elit gravida vel aliquam nec. Arcu pellentesque convallis quam feugiat non viverra massa fringilla.
            </p>
            <span className="inline-block px-2 py-1 mt-2 text-xs font-medium text-gray-800 bg-gray-100 rounded-full">
              Infrastructure
            </span>
          </div>
        </div>
        </Link>
        </div>
        {cardData && cardData.length > 0 ? (
  <div className='mb-3'>
    <div className="bg-[#EEF2F6] rounded-t-2xl h-1.5 w-[200px] ml-[10px] -mb-[8px] dark:bg-[#EEF2F6] overflow-hidden ">
      <div className="relative h-1 bg-gray-200">
        <div className="absolute left-0 top-0 h-full bg-green-500 w-1/3"></div>
      </div>
    </div>
    {cardData.map((data, index) => (
    
        <div className="flex items-center" onClick={handleNavigation}>
          <div className="w-[240px] h-[195px] bg-[#EEF2F6] flex justify-center items-center rounded-2xl">
            <img
              src={(data?.project_logo && data.project_logo.length > 0) ? data.project_logo[0] : CypherpunkLabLogo}
              alt={data?.projectName ?? 'ICP'}
            
              className="w-20 h-20 rounded-2xl border-4 border-[#FFFFFF]"
            />
          </div>

          <div className="ml-4 w-2/3 relative">
            <button className="absolute right-0 text-gray-400 hover:text-gray-600">
              <MoreVert fontSize="small" />
            </button>
            <h2 className="text-xl font-semibold text-gray-900">{data?.projectName ??'ICP'}</h2>
            <p className="text-sm text-gray-500 mb-4">@{data?.projectName ??'ICP'}</p>
            <hr />
            <p className="mt-4 text-sm text-gray-700">
              Bringing privacy back to users
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {data?.projectDescription ??'This is ICP'}
            </p>
            <span className="inline-block px-2 py-1 mt-2 text-xs font-medium text-gray-800 bg-gray-100 rounded-full">
              Infrastructure
            </span>
          </div>
        </div>
   
    ))}
  </div>
) : (
  <p className="text-center text-gray-500">No projects available</p>
)}

      {isopen && (
        <ProjectRegisterMain
        isopen={isopen}
        setModalOpen={setModalOpen} 
        />
      )}
    </div>
    );
};

export default ProjectCard;

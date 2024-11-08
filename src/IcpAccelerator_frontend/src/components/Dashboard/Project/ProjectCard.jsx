import React, { useEffect, useState } from 'react';
import CypherpunkLabLogo from '../../../../assets/Logo/CypherpunkLabLogo.png';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Principal } from '@dfinity/principal';
import { MoreVert } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import ProjectRegisterMain from '../../Modals/ProjectRegisterModal/ProjectRegisterMain';
import parse from 'html-react-parser';
import { useSelector } from 'react-redux';
import uint8ArrayToBase64 from '../../Utils/uint8ArrayToBase64';
import { FaChevronRight } from 'react-icons/fa';
import NoDataFound from '../DashboardEvents/NoDataFound';
import useTimeout from '../../hooks/TimeOutHook';
import ProjectCardSkeleton from './ProjectSkeleton/ProjectCardSkeleton';
const ProjectCard = () => {
  const [isopen, setModalOpen] = useState(false);
  const [cardData, setCardData] = useState([]);
  const actor = useSelector((currState) => currState.actors.actor);
  const navigate = useNavigate();
  const handleOpenModal = () => {
    setModalOpen(!isopen);
  };

  const location = useLocation();

  const principal = useSelector((currState) => currState.internet.principal);

  const fetchProjectData = async () => {
    try {
      const convertedPrincipal = await Principal.fromText(principal);
      const data =
        await actor.get_project_info_using_principal(convertedPrincipal);
      console.log('DATA FROM API', data);
      setCardData(data);
    } catch (error) {
      console.error('Error fetching project data:', error);
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, [actor]);

  const handleNavigation = () => {
    const projectId =
      cardData.length > 0 ? cardData[0][0].uid : 'No UID available';
    navigate('/dashboard/document', { state: { projectId, cardData } });
  };

  const [isLoading, setIsLoading] = useState(true);

  useTimeout(() => setIsLoading(false));

  return (
    <div className='pt-12'>
      <div className='hidden md:block'>
        <div className='flex flex-col items-end mb-8 '>
          <button
            className='px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700'
            onClick={handleOpenModal}
          >
            + Add new project
          </button>
        </div>
      </div>

      {isLoading ? (
        <ProjectCardSkeleton />
      ) : cardData && cardData.length > 0 ? (
        cardData.map((data, index) => {
          const projectDescription =
            data[0]?.params?.project_description[0] ??
            'No description available';
          const projectLogo = data[0]?.params?.project_logo?.[0]
            ? uint8ArrayToBase64(data[0]?.params?.project_logo?.[0])
            : '';
          const projectcover = data[0]?.params?.project_cover?.[0]
            ? uint8ArrayToBase64(data[0]?.params?.project_cover?.[0])
            : '';
          const projectName =
            data[0]?.params?.project_name || 'Unknown Project';
          const projectId = data.uid;
          const fullName = data[1]?.params?.full_name || 'No name provided';
          const areaOfInterest = data[1]?.params?.area_of_interest
            ? data[1].params.area_of_interest
                .split(',')
                .map((interest) => interest.trim())
            : ['No interest provided'];
          const country = data[1]?.params?.country || 'No country provided';
          return (
            <>
              <div className='mb-3 hidden md:block ' key={index}>
                {/* for desktop screen  */}
                <div
                  className='flex items-center flex-col sm2:flex-row'
                  onClick={handleNavigation}
                >
                  <div
                    className='w-full sm2:w-[240px] h-[195px] flex justify-center items-center rounded-2xl relative overflow-hidden'
                    style={{
                      backgroundImage: `url(${projectcover})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    <div
                      className='absolute inset-0 bg-white bg-opacity-30 backdrop-blur-sm'
                      style={{
                        borderRadius: 'inherit',
                      }}
                    ></div>
                    <img
                      src={projectLogo}
                      alt={projectName ?? 'ICP'}
                      className=' sm2:w-3/4 h-28 rounded-2xl border-4 border-[#FFFFFF] relative z-10 object-cover object-center'
                      loading='lazy'
                      draggable={false}
                    />
                  </div>
                  <div className='ml-4 w-full pt-4 sm2:pt-0 sm2:w-2/3 relative'>
                    <button className='absolute right-0 text-gray-400 hover:text-gray-600'>
                      {/* <MoreVert fontSize='small' /> */}
                    </button>
                    <h2 className='text-xl font-semibold text-gray-900'>
                      {projectName ?? 'ICP'}
                    </h2>
                    <p className='text-sm text-gray-500 mb-4'>
                      @{fullName ?? 'ICP'}
                    </p>
                    <hr />
                    <p className='mt-4 text-sm text-gray-700'>
                      Bringing privacy back to users
                    </p>
                    <p className='mt-1 text-sm text-gray-500 line-clamp-3'>
                      {parse(projectDescription) ?? 'This is ICP'}
                    </p>
                    {areaOfInterest.map((interest, i) => (
                      <span
                        key={i}
                        className='inline-block px-2 py-1 mt-2 text-xs font-medium text-gray-800 bg-gray-100 rounded-full'
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* for Mobile  screen  */}
              <div
                className='flex flex-col items-center  space-y-4  mx-auto pb-12'
                key={index}
              >
                <div className='bg-[#F8FAFC] rounded-lg shadow-lg w-full p-4 flex items-center mb-6 justify-between  md:hidden'>
                  <div className='sxs2:flex items-center'>
                    <div className='flex justify-center items-center'>
                      <img
                        src={projectLogo}
                        alt={projectName ?? 'ICP'}
                        className='w-12 h-12 rounded-lg'
                        loading='lazy'
                        draggable={false}
                      />
                    </div>
                    <div className='sxs2:ml-4 mt-2 sxs2:mt-0'>
                      <h3 className='text-lg font-bold line-clamp-1 break-all'>
                        {projectName ?? 'ICP'}
                      </h3>
                      <p className='text-gray-500 line-clamp-1 break-all'>
                        @{fullName ?? 'ICP'}
                      </p>
                    </div>
                  </div>
                  <div>
                    <FaChevronRight
                      className='text-blue-500'
                      size={20}
                      onClick={handleNavigation}
                    />
                  </div>
                </div>

                <button
                  className='bg-blue-500 text-white  px-4 py-2 w-full md:hidden '
                  onClick={handleOpenModal}
                >
                  + Add new project
                </button>
              </div>
            </>
          );
        })
      ) : (
        // <p className="text-center text-gray-500">No projects available</p>
        <NoDataFound message='No projects available' />
      )}

      {isopen && (
        <ProjectRegisterMain isopen={isopen} setModalOpen={setModalOpen} />
      )}
    </div>
  );
};

export default ProjectCard;

import React, { useEffect, useState } from 'react';
import CypherpunkLabLogo from '../../../../assets/Logo/CypherpunkLabLogo.png';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Principal } from '@dfinity/principal';
import { MoreVert } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import Nodatafound from '../../../../assets/Logo/Nodatafound.png';
import ProjectRegisterMain from '../../Modals/ProjectRegisterModal/ProjectRegisterMain';
import parse from 'html-react-parser';
import { useSelector } from 'react-redux';
import uint8ArrayToBase64 from '../../Utils/uint8ArrayToBase64';
const DashboardProjectCard = () => {
  const [cardData, setCardData] = useState([]);
  const actor = useSelector((currState) => currState.actors.actor);

  const location = useLocation();

  const principal = useSelector((currState) => currState.internet.principal);
  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const convertedPrincipal = await Principal.fromText(principal);
        const data =
          await actor.get_project_info_using_principal(convertedPrincipal);
        setCardData(data);
      } catch (error) {
        console.error('Error fetching project data:', error);
      }
    };

    fetchProjectData();
  }, [actor]);

  const navigate = useNavigate();

  const handleNavigation = () => {
    const projectId =
      cardData.length > 0 ? cardData[0][0].uid : 'No UID available';
    navigate('/dashboard/document', { state: { projectId, cardData } });
  };
  return (
    <div className=''>
      {cardData && cardData.length > 0 ? (
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
            <div
              className='bg-white w-full rounded-xl shadow-lg  p-6 mb-3'
              key={index}
            >
              <div
                className='  flex flex-col sm5:flex-row   w-full  '
                onClick={handleNavigation}
              >
                <div
                  className='w-full sm5:w-[240px] h-[192px] flex justify-center items-center rounded-2xl relative overflow-hidden'
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
                    className=' sm5:w-3/4 h-28 w-1/2 ss2:w-auto rounded-2xl border-4 border-[#FFFFFF] relative z-10'
                    loading='lazy'
                    draggable={false}
                  />
                </div>
                <div className='sm5:ml-4 w-full sm5:w-2/3 relative mt-6 sm5:mt-0'>
                  <div className='flex justify-between'>
                    <h2 className='xxs:text-xl font-semibold text-gray-900 line-clamp-1 break-all truncate'>
                      {projectName ?? 'ICP'}
                    </h2>
                    {/* <button className=' text-gray-400 hover:text-gray-600'>
                      <MoreVert fontSize='small' />
                    </button> */}
                  </div>

                  <p className='text-sm text-gray-500 mb-2 line-clamp-1 break-all truncate'>
                    @{fullName ?? 'ICP'}
                  </p>
                  <hr />

                  <p className='mt-1 text-sm text-gray-500 line-clamp-2 break-all sm:h-12 mb-2'>
                    {parse(projectDescription) ?? 'This is ICP'}
                  </p>

                  <div className='flex  gap-2  flex-wrap'>
                    {areaOfInterest.slice(0, 3).map((interest, index) => (
                      <span
                        key={index}
                        className='border-2 border-gray-500 rounded-full text-gray-700 text-xs px-3 py-1 bg-gray-100'
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className='bg-white rounded-lg shadow-sm p-6 mt-8'>
          <div className='border border-dashed border-gray-300 p-6 '>
            <div className='flex  items-center justify-center h-full text-center'>
              <img
                src={Nodatafound}
                alt=''
                className='h-full '
                loading='lazy'
                draggable={false}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardProjectCard;

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import uint8ArrayToBase64 from '../Utils/uint8ArrayToBase64';
import RegionalHubModal from './RegionalHubModal';
import NoData from '../NoDataCard/NoData';
import { MdArrowOutward } from 'react-icons/md';
import getSocialLogo from '../Utils/navigationHelper/getSocialLogo';
import RegionalHubSkeleton from './RegionalHubSkeleton/RegionalHubSkeleton';
import useTimeout from '../hooks/TimeOutHook';

const DiscoverRegionalHubs = () => {
  const actor = useSelector((currState) => currState.actors.actor);
  const [allHubsData, setAllHubsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  console.log('hub data ', allHubsData);
  const getAllHubs = async (caller, isMounted) => {
    try {
      const result = await caller.get_icp_hub_details();
      if (isMounted) {
        setAllHubsData(result || []);
        setIsLoading(false);
      }
    } catch (error) {
      if (isMounted) {
        setAllHubsData([]);
        setIsLoading(false);
      }
    }
  };

  useTimeout(() => setLoading(false));

  useEffect(() => {
    let isMounted = true;

    if (actor) {
      getAllHubs(actor, isMounted);
    } else {
      getAllHubs(IcpAccelerator_backend, isMounted);
    }

    return () => {
      isMounted = false;
    };
  }, [actor]);

  return (
    <div className='container mx-auto mb-5 px-6 bg-white'>
      <div className='flex justify-start items-center h-11 bg-opacity-95 -top-[.60rem] p-10 px-1 sticky bg-white z-20'>
        <div className='flex justify-between items-center gap-2 w-full'>
          <h2 className='text-2xl font-semibold sm:text-3xl sm:font-bold'>
            Discover Regional Hubs
          </h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className='border-2 px-2 min-w-[90px] max-h-[38px] border-black py-1'
          >
            Add Hub
          </button>
        </div>
      </div>
      {allHubsData.length === 0 ? (
        <div className='flex  items-center justify-center'>
          <NoData message={'No Hubs Data Available'} />
        </div>
      ) : loading ? (
        <div className='grid sm:grid-cols-2 dxl:grid-cols-3 gap-6'>
          {[...Array(allHubsData.length)].map((_, index) => (
            <RegionalHubSkeleton />
          ))}{' '}
        </div>
      ) : (
        <div className='grid sm:grid-cols-2 dxl:grid-cols-3 gap-6'>
          {allHubsData.map((hub, index) => {
            // Safely access the data from params[0]
            const hubParams = hub?.params?.[0] || {};

            const name = hubParams.name?.[0] || 'N/A';
            const desc = hubParams.description?.[0] || 'N/A';
            const website = hubParams.website?.[0] || 'N/A';
            const logo = hubParams.flag?.[0]
              ? uint8ArrayToBase64(hubParams.flag[0])
              : null;

            return (
              <div
                key={index}
                className='bg-white rounded-lg shadow-lg p-4 flex flex-col h-full'
              >
                <div>
                  {logo && (
                    <img
                      src={logo}
                      alt={name}
                      className='w-12 h-12 rounded-full mb-3'
                      loading='lazy'
                      draggable={false}
                    />
                  )}
                  <div>
                    <h3 className='text-lg font-semibold line-clamp-1 break-all'>
                      {name}
                    </h3>
                    <p className='text-sm text-gray-600 mt-2 line-clamp-2 break-all'>
                      {desc}
                    </p>
                  </div>
                </div>
                <div className='flex gap-3 mt-2 flex-wrap'>
                  {Array.isArray(hubParams.links?.[0]) &&
                    hubParams.links[0]?.map((linkObj, i) => {
                      const link = linkObj?.links?.[0];
                      if (!link) return null;
                      const icon = getSocialLogo(link);
                      return (
                        <a
                          key={i}
                          href={link}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='flex items-center space-x-2'
                        >
                          {icon}
                        </a>
                      );
                    })}
                </div>
                <div className='mt-auto pt-3 text-center'>
                  <a
                    href={website}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='bg-[#155EEF] flex items-center justify-center shadow-[0px_1px_2px_0px_#1018280D,0px_-2px_0px_0px_#1018280D_inset,0px_0px_0px_1px_#1018282E_inset] border-2 border-white text-white py-[10px] px-4 rounded-lg text-sm font-medium hover:bg-blue-700 w-full'
                  >
                    Join{' '}
                    <span className='px-2 flex items-center'>
                      <MdArrowOutward className='text-base font-bold' />
                    </span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {isModalOpen && (
        <RegionalHubModal
          onClose={() => setIsModalOpen(false)}
          getAllHubs={getAllHubs}
        />
      )}
    </div>
  );
};

export default DiscoverRegionalHubs;

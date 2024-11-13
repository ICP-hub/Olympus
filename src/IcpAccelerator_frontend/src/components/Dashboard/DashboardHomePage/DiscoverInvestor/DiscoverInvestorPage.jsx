import CloseIcon from '@mui/icons-material/Close';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import DiscoverInvestorAbout from './DiscoverInvestorAbout';
import DiscoverInvestorDetail from './DiscoverInvestorDetail';
import { IcpAccelerator_backend } from '../../../../../../declarations/IcpAccelerator_backend/index';

const DiscoverInvestorPage = ({ openDetail, setOpenDetail, principal }) => {
  const actor = useSelector((currState) => currState.actors.actor);
  console.log('principal in DiscoverInvestor', principal);
  const [allInvestorData, setAllInvestorData] = useState(null);
  const [loading, setIsLoading] = useState(true);
  console.log('openDetail', openDetail);

  const getAllUser = async (caller, isMounted) => {
    await caller
      .get_vc_info_using_principal(principal)
      .then((result) => {
        if (isMounted) {
          console.log('data from api', result);
          if (result) {
            // Log the exact structure of result.data to verify it
            console.log('Data received:', result?.[0]);
            setAllInvestorData(result?.[0]);
          } else {
            setAllInvestorData([]);
          }
          setIsLoading(false);
        }
      })
      .catch((error) => {
        if (isMounted) {
          setAllInvestorData([]);
          setIsLoading(false);
          console.log('error-in-get-all-user', error);
        }
      });
  };

  useEffect(() => {
    let isMounted = true;

    if (actor) {
      getAllUser(actor, isMounted);
    } else {
      getAllUser(IcpAccelerator_backend);
    }

    return () => {
      isMounted = false;
    };
  }, [actor, principal]);

  return (
    <div className='w-full bg-fixed lg1:h-screen fixed inset-0 bg-black bg-opacity-30 backdrop-blur-xs z-50'>
      <div className='mx-auto w-full sm:w-[70%] absolute right-0 top-0 z-10 bg-white h-screen'>
        <button onClick={() => setOpenDetail(false)} className='p-2 mb-2'>
          <CloseIcon sx={{ cursor: 'pointer' }} />
        </button>

        <div className='container mx-auto overflow-hidden overflow-y-scroll px-[4%] sm:px-[2%] h-full pb-8'>
          <div className='flex flex-col gap-4 lg1:py-3 lg1:gap-0 lg1:flex-row w-full lg1:justify-evenly h-full '>
            <div className=' rounded-lg w-full lg1:overflow-y-scroll lg1:w-[32%] '>
              <DiscoverInvestorAbout investorData={allInvestorData} />
            </div>
            <div className='px-3 py-4 lg1:py-0 w-full lg1:overflow-y-scroll lg1:w-[63%] '>
              <div className='border-2'>
                {' '}
                <DiscoverInvestorDetail investorData={allInvestorData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscoverInvestorPage;

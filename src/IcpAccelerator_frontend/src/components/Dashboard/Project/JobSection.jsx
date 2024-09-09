import React, { useEffect, useState } from 'react';
import { Folder } from '@mui/icons-material';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import JobRegister1 from '../../Modals/JobModal/JobRegister1';
import { useSelector } from 'react-redux';
import { IcpAccelerator_backend } from '../../../../../declarations/IcpAccelerator_backend/index';
import useFormatDateFromBigInt from "../../../components/hooks/useFormatDateFromBigInt";
import { formatFullDateFromBigInt } from "../../Utils/formatter/formatDateFromBigInt";
import NewEvent from '../DashboardEvents/NewEvent';
import NewJob from './LatestJob';

const JobSection = () => {
  const [modalOpen, setModalOpen] = useState(false); 

  const handleModalOpen = () => {
    setModalOpen(true); 
  };

  const actor = useSelector((currState) => currState.actors.actor);

  const [noData, setNoData] = useState(null);
  const [latestJobs, setLatestJobs] = useState([]);
  const [timeAgo] = useFormatDateFromBigInt();
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(0);
  const [openJobUid, setOpenJobUid] = useState(null);
  useEffect(() => {
      let isMounted = true;

      const fetchLatestJobs = async (caller) => {
          console.log('Inside Fetch Job Function');
          setIsLoading(true);

          try {
              const result = await caller.get_all_jobs(currentPage , itemsPerPage);
              console.log(" fetching when jobs",result)
              if (isMounted) {
                  if (result.length === 0) {
                      setNoData(true);
                      setLatestJobs([]);
                  } else {
                    console.log("else error fetching when jobs")
                      setLatestJobs(result);
                      setOpenJobUid(result[0]?.uid)
                      setNoData(false);
                  }
              }
          } catch (error) {
            console.log("catch error fetching when jobs",error)
              if (isMounted) {

                  setNoData(true);
                  setLatestJobs([]);
              }
          } finally {
              if (isMounted) {
                  setIsLoading(false);
              }
          }
      };

      if (actor) {
          fetchLatestJobs(actor);
      } else {
          fetchLatestJobs(IcpAccelerator_backend);
      }

      return () => {
          isMounted = false;
      };
  }, [actor, IcpAccelerator_backend, itemsPerPage, currentPage]);
  console.log("job latestJobs...............", latestJobs);
  return (
  <>
<NewJob latestJobs={latestJobs}/>

    </>
  );
};

export default JobSection;

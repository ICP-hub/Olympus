import React, { useCallback, useState, useEffect } from 'react';
import Filetype from '../../../../../assets/Logo/Filetype.png';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import NoDataFound from '../../DashboardEvents/NoDataFound';
import { ThreeDots } from 'react-loader-spinner';
import useTimeout from '../../../hooks/TimeOutHook';
import DiscoverDocumentSkeleton from './DiscoverMentorPageSkeleton/DiscoverDocumentSkeleton';

const DocumentCard = ({ doc, type }) => {
  // Safely access doc properties to avoid undefined errors
  const title = doc?.title ?? 'Document'; // Use optional chaining and fallback with ?? for undefined values
  const link = doc?.link ?? '';
  const description = doc?.description ?? 'No description available.';
  const isPrivate = type === 'private';

  return (
    <div
      className={`relative flex flex-col sm4:flex-row sm4:items-center p-4 rounded-lg mb-4 shadow-md bg-white transition-all duration-300 ${isPrivate ? 'blur-sm' : ''}`}
    >
      {/* Image Section with Background */}
      <div className='bg-gray-100 px-3 py-4 rounded-lg flex-shrink-0 flex flex-col items-center'>
        <img
          src={Filetype}
          alt='Document Thumbnail'
          className='w-[50px] h-[50px] rounded-lg object-cover mx-auto'
          loading='lazy'
          draggable={false}
        />
        <a
          href={link}
          target='_blank'
          rel='noopener noreferrer'
          className='hover:text-blue-800 line-clamp-1 break-all mt-2 text-sm'
        >
          {link || 'No link provided'}
        </a>
      </div>

      {/* Details Section */}
      <div className='ml-4 mt-3 sm4:mt-0 flex-grow transition-all duration-300'>
        <div className='flex justify-between flex-wrap'>
          <p
            className={`text:xs dsx:text-sm sm4:text-base font-semibold text-gray-900 ${isPrivate ? 'blur-sm' : ''}`}
          >
            {title}
          </p>
          <button
            className={`rounded-lg px-0.5 sm4:px-1 sm:px-2 text-xs ${
              isPrivate
                ? 'bg-[#FFFAEB] border-2 border-[#F5E1A4] text-[#A37E00]'
                : 'bg-[#ECFDF3] border-2 border-[#ABEFC6] text-[#067647]'
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        </div>
        <p className={`text-gray-600 mt-3 ${isPrivate ? 'blur-sm' : ''}`}>
          {description}
        </p>
      </div>
    </div>
  );
};

const DiscoverDocument = ({ projectDetails, projectId }) => {
  const actor = useSelector((currState) => currState.actors?.actor); // Optional chaining to avoid undefined errors
  const [loading, setLoading] = useState(false);
  const userCurrentRoleStatusActiveRole = useSelector(
    (currState) => currState.currentRoleStatus?.activeRole // Optional chaining
  );

  const sendPrivateDocumentRequest = useCallback(
    async (project_id) => {
      setLoading(true);
      try {
        const result =
          await actor?.send_private_docs_access_request(project_id); // Optional chaining
        if (result) {
          toast.success(result);
        } else {
          toast.error('No response from server');
        }
      } catch (error) {
        console.error('error-in-send-access-private-docs', error);
        toast.error('An error occurred while sending the request.');
      } finally {
        setLoading(false);
      }
    },
    [actor]
  );

  const renderDocuments = (docs, type) => {
    return isLoading ? (
      <>
        {[...Array(docs.length)].map((_, index) => (
          <DiscoverDocumentSkeleton key={index} />
        ))}
      </>
    ) : (
      docs.map((doc, index) => (
        <DocumentCard key={index} doc={doc} type={type} projectId={projectId} />
      ))
    );
  };

  const hasNoDocuments =
    !projectDetails?.private_docs?.length &&
    !projectDetails?.public_docs?.length; // Optional chaining for nested properties

  const getAllUser = async (caller, isMounted) => {
    await caller
      .access_private_docs(projectId)
      .then((result) => {
        console.log('result', result);
      })
      .catch((error) => {
        if (isMounted) {
          console.log('error-in-get-all-user', error);
        }
      });
  };

  useEffect(() => {
    let isMounted = true;

    if (actor) {
      getAllUser(actor, isMounted);
    }
    return () => {
      isMounted = false;
    };
  }, [actor]);

  const [isLoading, setIsLoading] = useState(true);
  useTimeout(() => setIsLoading(false));

  return (
    <>
      <div className='space-y-3 mt-[50px] relative'>
        {/* Permanent Request Access Button */}
        <div className='absolute -top-[2rem] right-4 z-20'>
          {userCurrentRoleStatusActiveRole === 'user'
            ? ''
            : projectDetails?.private_docs?.length > 0 && (
                <button
                  className='bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center'
                  onClick={() => sendPrivateDocumentRequest(projectId)}
                  disabled={loading}
                >
                  {loading ? (
                    <ThreeDots
                      visible={true}
                      height='24'
                      width='60'
                      color='#FFFFFF'
                      radius='9'
                      ariaLabel='three-dots-loading'
                    />
                  ) : (
                    'Request Access'
                  )}
                </button>
              )}
        </div>

        {hasNoDocuments ? (
          <div className='max-w-4xl rounded-lg'>
            <NoDataFound message='No Document Found' />
          </div>
        ) : (
          <>
            {/* Private Documents Section */}
            {projectDetails?.private_docs?.length > 0 && (
              <div className='max-w-4xl bg-white p-3 pb-0'>
                {renderDocuments(projectDetails.private_docs, 'private')}
              </div>
            )}

            {/* Public Documents Section */}
            {projectDetails?.public_docs?.length > 0 && (
              <div className='max-w-4xl bg-white p-3 pt-0'>
                {renderDocuments(projectDetails.public_docs, 'public')}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default DiscoverDocument;

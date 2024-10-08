import React, { useState } from 'react';
import Filetype from '../../../../assets/Logo/Filetype.png';
import { DocumentItem } from './DocumentUpload';
import DocumentModal from './DocumentModal';
import useTimeout from '../../hooks/TimeOutHook';
import DiscoverDocumentSkeleton from '../DashboardHomePage/discoverMentorPage/DiscoverMentorPageSkeleton/DiscoverDocumentSkeleton';

const NewDocument = ({ cardData }) => {
  const [selectedOption, setSelectedOption] = useState('file');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading,setIsLoading]=useState(true)

  useTimeout(()=>setIsLoading(false))

  const renderDocuments = (docs, type) => {
    return isLoading ? <>{[...Array(docs.length)].map((_,index)=><DiscoverDocumentSkeleton/>)}</> :docs.map((doc, index) => (
      <div
        key={index}
        className={`relative sm5:gap-3 flex flex-col sm5:flex-row sm5:items-center dlg:flex-col dxl0:flex-row p-4 rounded-lg mb-4 shadow-md bg-white transition-all duration-300 `}
      >
        {/* Image Section with Background */}
        <div className='bg-gray-100 w-full sm5:w-[180px] dlg:w-full dxl0:w-[180px] py-4 rounded-lg flex-shrink-0 text-center mb-2 sm5:mb-0'>
          <div className=' flex-grow flex flex-col items-center transition-all duration-300 '>
            <img
              src={Filetype}
              alt='Document Thumbnail'
              className='w-[50px] h-[50px] rounded-lg object-cover mx-auto'
              loading='lazy'
              draggable={false}
            />
            <a
              href={doc?.link}
              target='_blank'
              rel='noopener noreferrer'
              className='hover:text-blue-800 line-clamp-1 break-all mt-2  text-sm'
              // style={{ maxWidth: "100px" }}
            >
              {doc?.link || 'No link provided'}
            </a>
          </div>
        </div>
        {/* Details Section */}
        <div className=' flex-grow transition-all duration-300'>
          <div className='flex flex-wrap justify-between'>
            <p className='text:xs dsx:text-sm sm4:text-base font-semibold text-gray-900'>
              {doc?.title || `Document ${index + 1}`}
            </p>
            <button
              className={`rounded-lg px-0.5 sm5:px-2 text-sm ${
                type === 'public'
                  ? 'bg-[#ECFDF3] border-2 border-[#ABEFC6] text-[#067647]'
                  : 'bg-[#FFFAEB] border-2 border-[#F5E1A4] text-[#A37E00]'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          </div>
          <p className='text-gray-600 mt-3'>
            This is the description which I am giving right now so please take
            this description
          </p>
        </div>
      </div>
    ));
  };

  if (!cardData || !cardData.length || !cardData[0]?.length) {
    return <p className='text-gray-500 mt-2'>No documents available.</p>;
  }

  const privateDocs = cardData[0][0]?.params?.private_docs || [];
  const publicDocs = cardData[0][0]?.params?.public_docs || [];
  const hasDocuments = privateDocs.length > 0 || publicDocs.length > 0;

  return (
    <div className='space-y-6'>
      {hasDocuments && (
        <div className='flex justify-end mb-6'>
          <button
            className='px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700'
            onClick={() => setIsOpen(true)}
          >
            + Add new Document
          </button>
        </div>
      )}

      {/* Private Documents Section */}
      <div className='max-w-4xl bg-white'>
        {privateDocs.length > 0 ? (
          <div>{renderDocuments(privateDocs[0], 'private')}</div>
        ) : null}
      </div>

      {/* Public Documents Section */}
      <div className='max-w-4xl bg-white'>
        {publicDocs.length > 0 ? (
          <div>{renderDocuments(publicDocs[0], 'public')}</div>
        ) : null}
      </div>

      {privateDocs.length === 0 && publicDocs.length === 0 && (
        <DocumentItem
          title='Demo video'
          description='Est malesuada ac elit gravida vel aliquam nec. Arcu pelle ntesque convallis quam feugiat non viverra massa fringilla.'
          buttonText='Upload a file'
          visibility='Visible to public'
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
        />
      )}
      {isOpen && <DocumentModal setIsOpen={setIsOpen} isOpen={isOpen} />}
    </div>
  );
};

export default NewDocument;

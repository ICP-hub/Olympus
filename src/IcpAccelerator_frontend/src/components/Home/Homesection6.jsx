import React, { useState, useRef, useEffect } from 'react';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { homepagedata } from '../Utils/jsondata/data/homepageData';

const AccordionItem = ({ title, content, isOpen, onClick }) => {
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setHeight(contentRef.current.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [isOpen]);

  return (
    <div className='border-b border-gray-200'>
      <button
        className='w-full flex justify-between items-start md:items-center p-4 focus:outline-none'
        onClick={onClick}
      >
        <span className='text-[#4B5565] text-base font-medium text-left'>
          {title}
        </span>
        <div className='transition-transform duration-300 ease-in-out'>
          {isOpen ? (
            <RemoveCircleOutlineOutlinedIcon className='text-gray-500' />
          ) : (
            <AddCircleOutlineOutlinedIcon className='text-gray-500' />
          )}
        </div>
      </button>
      <div
        ref={contentRef}
        style={{ height: `${height}px` }}
        className='overflow-hidden transition-all duration-300 ease-in-out'
      >
        <p className='p-4 text-[#4B5565] text-xs font-normal'>{content}</p>
      </div>
    </div>
  );
};

function HomeSection6() {
  const [openIndex, setOpenIndex] = useState(null);

  const { accordionData } = homepagedata;

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className='flex items-center justify-center bg-white pt-20 px-4 pb-40'>
      <div className='container mx-auto'>
        <div className='w-full max-w-6xl bg-white mx-auto'>
          {homepagedata.accordionData.map((item, index) => (
            <AccordionItem
              key={index}
              title={item.title}
              content={item.content}
              isOpen={openIndex === index}
              onClick={() => handleToggle(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomeSection6;

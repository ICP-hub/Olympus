import React, { useState, useRef, useEffect } from 'react';
import RemoveCircleOutlineOutlinedIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";

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
    <div className="border-b border-gray-200">
      <button
        className="w-full flex justify-between items-center p-4 focus:outline-none"
        onClick={onClick}
      >
        <span className="text-[#4B5565] text-base font-medium">{title}</span>
        <div className="transition-transform duration-300 ease-in-out">
          {isOpen ? (
            <RemoveCircleOutlineOutlinedIcon className="text-gray-500" />
          ) : (
            <AddCircleOutlineOutlinedIcon className="text-gray-500" />
          )}
        </div>
      </button>
      <div 
        ref={contentRef}
        style={{ height: `${height}px` }}
        className="overflow-hidden transition-all duration-300 ease-in-out"
      >
        <p className="p-4 text-[#4B5565] text-xs font-normal">
          {content}
        </p>
      </div>
    </div>
  );
};

function HomeSection6() {
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = index => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const accordionData = [
    {
      title: 'Arweave stellar klaytn siacoin shiba-inu fantom terra terra elrond.',
      content: 'Kadena binance harmony helium aave revain hive dai nexo. Bitcoin fantom horizen cosmos golem gala harmony USD. Amp golem terra hedera litecoin aave audius harmony cosmos monero.'
    },
    {
      title: 'Tether secret helium BitTorrent BitTorrent quant.',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ac dolor non ligula gravida.'
    },
    {
      title: 'ECash golem elrond THETA horizen.',
      content: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    },
    {
      title: 'Ox helium horizen fantom ren enjin EOS aave.',
      content: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.'
    },
    {
      title: 'Secret holo THETA kadena decentraland IOTA.',
      content: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
    },
    {
      title: 'Digibyte compound PancakeSwap enjin PancakeSwap zcash bitcoin.',
      content: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
    }
  ];

  return (
    <div className="flex items-center justify-center bg-white pt-20 px-4 pb-40">
      <div className="container mx-auto">
        <div className="w-full max-w-4xl bg-white mx-auto">
          {accordionData.map((item, index) => (
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
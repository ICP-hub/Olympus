import React, { useState } from 'react';
import docu1 from '../../../../assets/images/docu.png';
import docu2 from '../../../../assets/images/docu.png';
import docu3 from '../../../../assets/images/docu.png';
import docu4 from '../../../../assets/images/docu.png';
import docu5 from '../../../../assets/images/docu.png';
import useTimeout from '../../hooks/TimeOutHook';
import MoneyRaisedCardSkeleton from './ProjectSkeleton/MoneyRaisedCardSkeleton';

const FundingCard = ({ title, value, imageSrc, isPrivate }) => {
  return (
    <div className='relative flex flex-col xxs:flex-row items-center p-4 rounded-lg mb-4 shadow-md bg-white transition-all duration-300'>
      {/* Image Section */}
      <div className={`flex-shrink-0 w-full xxs:w-[180px]`}>
        <img
          src={imageSrc}
          alt={`${title} Thumbnail`}
          className='xxs:w-[150px] xxs:h-[100px] w-full object-cover rounded-lg'
          loading='lazy'
          draggable={false}
        />
      </div>

      {/* Details Section */}
      <div
        className={`w-full mt-2 xxs:mt-0 flex-grow flex justify-between xxs:flex-col xxs:justify-center  transition-all duration-300 `}
      >
        <div className='flex justify-between items-center'>
          <p className='text-xs xxs:text-base sm5:text-lg font-semibold text-gray-900'>
            {title}
          </p>
        </div>
        <p className='text-xs xxs:text-sm text-gray-500 mt-1'>
          <span className='font-semibold'>{value}</span>
        </p>
      </div>

      {/* Request Access Button for Private Documents */}
      {/* {isPrivate && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-lg">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                        Request Access
                    </button>
                </div>
            )} */}
    </div>
  );
};

const MoneyRaisedCard = ({ data }) => {
  const {
    icp_grants,
    investors,
    raised_from_other_ecosystem,
    sns,
    target_amount,
  } = data[0].params.money_raised[0]; // Destructure the necessary fields
  console.log('data kya kya aa rha h', data);

  const [isLoading, setIsLoading] = useState(true);

  useTimeout(() => setIsLoading(false));

  return isLoading ? (
    <>
      {[...Array(5)].map((_, index) => (
        <MoneyRaisedCardSkeleton />
      ))}{' '}
    </>
  ) : (
    <div className='space-y-4'>
      <FundingCard
        title='ICP Grants'
        value={icp_grants}
        imageSrc={docu1}
        // isPrivate={false}
      />
      <FundingCard
        title='Investors'
        value={investors}
        imageSrc={docu2}
        // isPrivate={false}
      />
      <FundingCard
        title='Launchpad'
        value={raised_from_other_ecosystem}
        imageSrc={docu3}
        // isPrivate={false}
      />
      <FundingCard
        title='Valuation'
        value={sns}
        imageSrc={docu4}
        isPrivate={false}
      />
      <FundingCard
        title='Target Amount'
        value={target_amount}
        imageSrc={docu5}
        // isPrivate={false}
      />
    </div>
  );
};

export default MoneyRaisedCard;

import React from 'react';
import SkeletonThemeMain from './SkeletonTheme';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
export default function RatingReviewSkeleton() {
  return (
    <SkeletonThemeMain>
      <div className='bg-gray-100 max-h-[250px] h-[230px] rounded-lg p-4 flex flex-col gap-4 '>
        <div className='flex gap-4 flex-shrink-0'>
          <Skeleton circle={true} height={64} width={64} />
          <div className='flex-grow'>
            <h2 className='text-base font-semibold text-gray-800 mb-1'>
              Floyd Abernathy-Hamil
            </h2>
            <div className='flex gap-1 mb-2'>
              {[...Array(5)].map((_, index) => (
                <svg
                  key={index}
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  className='w-4 h-4 text-yellow-400'
                  fill='currentColor'
                >
                  <path d='M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z' />
                </svg>
              ))}
            </div>
          </div>
        </div>

        <div className='text-gray-600 text-xs'>
          <p>
            <Skeleton count={3} />
          </p>
        </div>
      </div>
    </SkeletonThemeMain>
  );
}

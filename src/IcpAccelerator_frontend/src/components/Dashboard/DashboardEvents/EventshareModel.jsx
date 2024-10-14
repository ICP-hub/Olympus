import React, { useState } from 'react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { ShareSocial } from 'react-share-social';
const ShareModal = ({ onClose, shareUrl }) => {
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='bg-white rounded-lg overflow-hidden shadow-lg w-[500px]'>
        <div className='flex justify-end mr-4 mt-1'>
          <button className='text-3xl text-[#121926]' onClick={onClose}>
            &times;
          </button>
        </div>
        <div className='p-6 pt-0'>
          <ShareSocial
            url={shareUrl}
            socialTypes={[
              'whatsapp',
              'facebook',
              'twitter',
              'reddit',
              'linkedin',
              'email',
              'telegram',
            ]}
            onSocialButtonClicked={(data) => console.log(data)}
            style={{
              root: { background: 'white' },
              copyContainer: {
                border: '1px solid blue',
                background: 'rgb(0,0,0,0.7)',
              },
              title: { color: 'black', fontStyle: 'normal' },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ShareModal;

import React from 'react';
import {
  LinkedIn,
  GitHub,
  Telegram,
  Facebook,
  Twitter,
  Instagram,
} from '@mui/icons-material';
import edit from '../../../assets/Logo/edit.png';

const getSocialIcon = (url) => {
  if (typeof url === 'string') {
    if (url.includes('linkedin.com'))
      return <LinkedIn className='text-blue-700' />;
    if (url.includes('github.com')) return <GitHub className='text-gray-800' />;
    if (url.includes('telegram.me') || url.includes('t.me'))
      return <Telegram className='text-blue-500' />;
    if (url.includes('facebook.com'))
      return <Facebook className='text-blue-600' />;
    if (url.includes('twitter.com'))
      return <Twitter className='text-blue-500' />;
    if (url.includes('instagram.com'))
      return <Instagram className='text-pink-500' />;
  }
  return null;
};

const SocialLinks = ({
  socialLinks,
  isEditingLink,
  handleLinkEditToggle,
  handleLinkChange,
}) => {
  // Ensure socialLinks is an array of objects with a 'platform' key
  if (!Array.isArray(socialLinks) || socialLinks.length === 0) {
    console.error(
      "Expected socialLinks to be an array of objects with a 'platform' key, but got:",
      socialLinks
    );
    return null;
  }

  console.log('Rendering SocialLinks with data:', socialLinks);

  return (
    <div>
      <h3 className='mb-2 text-xs text-gray-500 px-3'>Social Links</h3>
      <div className='flex flex-wrap items-center px-3'>
        {socialLinks.map((linkObj, index) => {
          const url = linkObj?.platform;
          return (
            typeof url === 'string' &&
            url && (
              <div
                key={index}
                className='group relative flex items-center ml-4 mb-2'
              >
                <a
                  href={url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center'
                >
                  {getSocialIcon(url)}
                </a>
                <button
                  className='absolute right-0 p-1 text-gray-500 text-xs transition-all duration-300 ease-in-out transform opacity-0 group-hover:opacity-100 group-hover:translate-x-8  h-10 w-7'
                  onClick={() => handleLinkEditToggle(index)}
                >
                  <img src={edit} alt='Edit' loading='lazy' draggable={false} />
                </button>
                {isEditingLink[index] && (
                  <input
                    type='text'
                    value={url}
                    onChange={(e) => handleLinkChange(e, index)}
                    className='border p-1 rounded w-full ml-2 transition-all duration-300 ease-in-out transform'
                  />
                )}
              </div>
            )
          );
        })}
      </div>
    </div>
  );
};

export default SocialLinks;

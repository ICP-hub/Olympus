  import React from 'react'
  
  const LanguageIcon = () => {
    return (
        <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="feather feather-globe"
    >
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <path d="M12 2a15.3 15.3 0 0 1 4 10.9c0 4.8-1.7 8.7-4 10.9"></path>
        <path d="M12 2C9.7 2 7 5.9 7 10.9c0 4.8 1.7 8.7 4 10.9"></path>
    </svg>
    )
  }
  
  export default LanguageIcon
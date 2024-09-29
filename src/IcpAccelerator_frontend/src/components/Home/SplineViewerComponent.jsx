import React, { useState, useEffect } from 'react';
import Spline from '@splinetool/react-spline';

function SplineViewerComponent() {
  const [loaded, setLoaded] = useState(false);

  const onSceneLoad = () => {
    setLoaded(true);
  };

  useEffect(() => {
    const splineElement = document.querySelector('canvas'); // Or target your Spline component
    console.log(splineElement?.offsetWidth, splineElement?.offsetHeight);
  }, []);
  return (
    <div className='w-full h-full absolute top-0 right-0 overflow-hidden'>
      {!loaded && (
        <div className='absolute inset-0 flex items-center justify-center bg-[#FEF5EE]'>
          <div className='animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500'></div>
        </div>
      )}
      <div className='w-full h-full absolute top-0 right-0 left-0 overflow-hidden '>
        <Spline
          scene='https://prod.spline.design/JhrdO2mGId5b5RrS/scene.splinecode'
          onLoad={onSceneLoad}
          className={`w-full h-full ${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500 translate-x-[10%] translate-y-[-10%] scale-125`}
        />
      </div>
    </div>
  );
}

export default SplineViewerComponent;

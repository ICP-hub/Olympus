import React, { useState, useEffect } from 'react';
import Spline from '@splinetool/react-spline';

function SplineViewerComponent() {
  const [loaded, setLoaded] = useState(false);

  // Function to handle the scene load
  const onSceneLoad = () => {
    setLoaded(true);
  };

  return (
    <div style={{ width: '100%', height: '400px', overflow: 'hidden' }}>
      {!loaded && <div>Loading...</div>}
      <Spline 
        scene="https://prod.spline.design/JhrdO2mGId5b5RrS/scene.splinecode" 
        onLoad={onSceneLoad}
        style={{
          visibility: loaded ? 'visible' : 'hidden',
          width: '100%',
          height: '100%'
        }}
      />
    </div>
  );
}

export default SplineViewerComponent;

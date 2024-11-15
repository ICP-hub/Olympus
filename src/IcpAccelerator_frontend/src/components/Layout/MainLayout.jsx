import React, { useState, useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Header/Navbar';
import Footer from '../Footer/Footer';
import { ConnectWallet } from '@nfid/identitykit/react';

const MainLayout = () => {
  return (
    <>
      <div className='layout'>
        <Navbar />
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default MainLayout;

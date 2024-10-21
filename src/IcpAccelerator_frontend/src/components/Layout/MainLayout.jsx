import React, { useState, useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Header/Navbar';
import Footer from '../Footer/Footer';
import ConnectWallet from '../../models/ConnectWallet';

const MainLayout = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const modalRef = useRef(null);
  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setModalOpen(false);
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isModalOpen]);

  return (
    <>
      <div className='layout'>
        <Navbar setModalOpen={setModalOpen} />
        <main className=''>
          <Outlet context={{ setModalOpen }} />
        </main>
        <Footer />
      </div>
      {isModalOpen && (
        <>
          <div className='fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50'></div>

          <ConnectWallet
            isModalOpen={isModalOpen}
            onClose={() => setModalOpen(false)}
            modalRef={modalRef}
          />
        </>
      )}
    </>
  );
};

export default MainLayout;

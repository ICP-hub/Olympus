import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Header/Navbar';
import Footer from '../Footer/Footer';
import ConnectWallet from '../../models/ConnectWallet';

const MainLayout = () => {
  const [isModalOpen, setModalOpen] = useState(false);
    return (
        <div className="layout">
            <Navbar setModalOpen={setModalOpen}/>
            <main className=''>
            <ConnectWallet
            isModalOpen={isModalOpen}
            onClose={() => setModalOpen(false)}
          />
                <Outlet context={{ setModalOpen }}/>
            </main>
            <Footer/>
        </div>
    );
};

export default MainLayout;

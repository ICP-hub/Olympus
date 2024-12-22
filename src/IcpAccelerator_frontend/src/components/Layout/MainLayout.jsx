import React from 'react';
import Navbar from './Header/Navbar';
import Footer from '../Footer/Footer';
import Home from '../Home/Home';
import { Outlet } from 'react-router-dom';
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

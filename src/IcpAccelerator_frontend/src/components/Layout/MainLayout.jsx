import React from 'react';
import Navbar from './Header/Navbar';
import Footer from '../Footer/Footer';
import Home from '../Home/Home';

const MainLayout = () => {
  return (
    <>
      <div className='layout'>
        <Navbar />
        <main>
          <Home />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default MainLayout;

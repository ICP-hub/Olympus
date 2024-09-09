import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Header/Navbar';
import Footer from '../Footer/Footer';
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import ConnectWallet from '../../models/ConnectWallet';
import { handleActorRequest } from '../StateManagement/Redux/Reducers/actorBindReducer';
import { multiChainHandlerRequest } from '../StateManagement/Redux/Reducers/getMultiChainList';
import { areaOfExpertiseHandlerRequest } from '../StateManagement/Redux/Reducers/getAreaOfExpertise';
import { typeOfProfileSliceHandlerRequest } from '../StateManagement/Redux/Reducers/getTypeOfProfile';
import { userRegisteredHandlerRequest } from '../StateManagement/Redux/Reducers/userRegisteredData';
import Loader from '../Loader/Loader';
import { mentorRegisteredHandlerRequest } from '../StateManagement/Redux/Reducers/mentorRegisteredData';
import { useAuth } from '../StateManagement/useContext/useAuth';
const MainLayout = () => {
  const [isModalOpen, setModalOpen] = useState(false);







    return (
        <div className="layout">

            <Navbar setModalOpen={setModalOpen}/>
           
            <main className='container mx-auto'>
         
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

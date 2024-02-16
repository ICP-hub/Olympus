import React, { useEffect } from "react";
import Home from "./components/Home/Home";
// import AllDetailsForm from "./components/ProjectForm/AllDetailsForm";
// import ProgressCard from "./components/Common/ProgressCard";
// import Sidebar from "./components/Layout/SidePanel/Sidebar";
import DashBoard from "./components/Dashboard/DashBoard";
// import ProjectDetails from "./components/Project/ProjectDetails";
// import UserProfile from "./components/UserProfile/UserProfile";
import ConnectWallet from "./models/ConnectWallet";
import RoleSelector from "./components/RoleSelector/RoleSelector";
import { useState } from "react";
import { useSelector } from "react-redux";
import Header from "./components/Layout/Header/Header";
import AllDetailsForm from "./components/Registration/AllDetailsForm";
import { useDispatch } from "react-redux";
import { setActor } from "./components/Redux/Reducers/actorBindReducer";
import { initActor } from "./components/Redux/ActorManager";
import AppRoutes from "./AppRoutes";

const App = () => {

  const identity =useSelector((currState)=> currState.internet.identity)
  const [isModalOpen, setModalOpen] = useState(false);

  const dispatch =useDispatch()

useEffect(() => {
  const initializeActor = async () => {
    if (identity) { 
      const actor = await initActor(identity);
      dispatch(setActor(actor));
    }
  };
  initializeActor();
}, [dispatch, identity]);


  return (
    <>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50"></div>
      )}
      <Header setModalOpen={setModalOpen} gradient={"bg-violet-800"} />
      <ConnectWallet
        isModalOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
      />
      {/* <DashBoard/> */}
      {/* <ProgressCard/> */}
      {/* <AllDetailsForm/> */}
      {/* <ProjectDetails/> */}
      {/* <Home/> */}
      {/* <UserProfile/> */}
      {/* <RoleSelector /> */}
      <AppRoutes/>
    </>
  );
};

export default App;

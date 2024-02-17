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
import { handleActorRequest } from "./components/Redux/Reducers/actorBindReducer";
import { checkLoginOnStart, logoutStart } from "./components/Redux/Reducers/InternetIdentityReducer";

const App = () => {

  const identity =useSelector((currState)=> currState.internet.identity)
  const isAuthenticated =useSelector((currState)=> currState.internet.isAuthenticated)
  // const actor =  useSelector((currState)=> currState.actors.actor)

  const [isModalOpen, setModalOpen] = useState(false);

  const dispatch =useDispatch()

  // console.log('identity in app.jsx =>', identity)
  // console.log('actor in app.jsx =>', actor)


  useEffect(()=>{
    dispatch(checkLoginOnStart())
  },[])

  useEffect(() => {
    if (isAuthenticated && identity) {
      dispatch(handleActorRequest());
    }
  }, [isAuthenticated, identity, dispatch]);
  

// const checkActorWorking = async() =>{
//   const fetchAllHubs = await actor.get_icp_hubs_candid()
//   console.log("app.jsx mai actor working check =>", fetchAllHubs)
// }

// const logoutHandler =()=>{
//   console.log('logout done')
//   dispatch(logoutStart())
// }

  return (
    <>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50"></div>
      )}
      <Header setModalOpen={setModalOpen} gradient={"bg-violet-800"} />
      {/* <button onClick={checkActorWorking} className="bg-red-400 justify-center flex w-full z-1000">check actor</button>
      <button onClick={logoutHandler} className="bg-red-400 justify-center flex w-full z-1000">logout</button> */}

      <ConnectWallet
        isModalOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
      />
      {/* <DashBoard/> */}
      {/* <ProgressCard/> */}
      <AllDetailsForm/>
      {/* <ProjectDetails/> */}
      {/* <Home/> */}
      {/* <UserProfile/> */}
      {/* <RoleSelector /> */}
    </>
  );
};

export default App;

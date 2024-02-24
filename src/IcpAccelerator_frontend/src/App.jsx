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
import {
  checkLoginOnStart,
  logoutStart,
} from "./components/Redux/Reducers/InternetIdentityReducer";
import AppRoutes from "./AppRoutes";
import Footer from "./components/Footer/Footer";
import { userRoleHandler } from "./components/Redux/Reducers/userRoleReducer";

const App = () => {
  const identity = useSelector((currState) => currState.internet.identity);
  const isAuthenticated = useSelector(
    (currState) => currState.internet.isAuthenticated
  );
  // const actor = useSelector((currState) => currState.actors.actor);
  const userRole = useSelector((currState) => currState.current.specificRole);

  const [isModalOpen, setModalOpen] = useState(false);

  const dispatch = useDispatch();

  // console.log('identity in app.jsx =>', identity)
  // console.log('isAuthenticated & other =>', isAuthenticated, identity,)
  console.log("user specific role after registration", userRole);

  useEffect(() => {
    dispatch(checkLoginOnStart());
  }, []);

  useEffect(() => {
    if (isAuthenticated && identity) {
      dispatch(handleActorRequest());
    }
  }, [isAuthenticated, identity, dispatch]);

  useEffect(() => {
    dispatch(userRoleHandler());
  }, [isAuthenticated, identity, dispatch]);

  return (
    <>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50"></div>
      )}
      <Header setModalOpen={setModalOpen} gradient={"bg-gray-100"} />
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
      <AppRoutes />
      <Footer />
    </>
  );
};

export default App;

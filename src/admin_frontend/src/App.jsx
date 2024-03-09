import React, { useEffect } from "react";
import ConnectWallet from "./components/models/ConnectWallet";
import { useState } from "react";
import { useSelector } from "react-redux";
import Header from "./components/Layout/Header/Header";
import { useDispatch } from "react-redux";
import Home from "./components/Home/Home";
// import { handleActorRequest } from "./components/StateManagement/Redux/Reducers/actorBindReducer";
import Footer from "./components/Footer/Footer";
// import { userRoleHandler } from "./components/StateManagement/Redux/Reducers/userRoleReducer";
// import { mentorRegisteredHandlerRequest } from "./components/StateManagement/Redux/Reducers/mentorRegisteredData";
// import { investorRegisteredHandlerRequest } from "./components/StateManagement/Redux/Reducers/investorRegisteredData";
// import { hubRegisteredHandlerRequest } from "./components/StateManagement/Redux/Reducers/hubRegisteredData";
// import { founderRegisteredHandlerRequest } from "./components/StateManagement/Redux/Reducers/founderRegisteredData";
import { useAuth } from "./components/StateManagement/useContext/useAuth";
// import { areaOfExpertiseHandlerRequest } from "./components/StateManagement/Redux/Reducers/getAreaOfExpertise";

const App = () => {

  const identity = useSelector((currState) => currState.internet.identity);
  const isAuthenticated = useSelector(
    (currState) => currState.internet.isAuthenticated
  );
//   const specificRole = useSelector(
//     (currState) => currState.current.specificRole
//   );

  const { reloadLogin } = useAuth();

  console.log("specificRole in app.jsx", specificRole);

  const [isModalOpen, setModalOpen] = useState(false);

  const dispatch = useDispatch();

  // console.log('identity in app.jsx =>', identity)

  useEffect(() => {
    reloadLogin();
  }, []);

//   useEffect(() => {
//     if (isAuthenticated && identity) {
//       dispatch(handleActorRequest());
//     }
//   }, [isAuthenticated, identity, dispatch]);

//   useEffect(() => {
//     dispatch(userRoleHandler());
//   }, [isAuthenticated, identity, dispatch]);

//   useEffect(() => {
//     dispatch(areaOfExpertiseHandlerRequest());
//   }, [isAuthenticated, identity, dispatch]);
 
//   useEffect(() => {
//     // console.log("specific role inside effect of app 1", specificRole);
//     switch (specificRole) {
//       case "Project":
//         dispatch(founderRegisteredHandlerRequest());
//         break;
//       case "Mentor":
//         dispatch(mentorRegisteredHandlerRequest());
//         break;
//       case "ICPHubOrganizer":
//         dispatch(hubRegisteredHandlerRequest());
//         break;
//       case "VC":
//         dispatch(investorRegisteredHandlerRequest());
//         break;
//       default:
//         return null;
//     }
//   }, [specificRole, isAuthenticated, dispatch]);

//   useEffect(() => {
//     dispatch(areaOfExpertiseHandlerRequest());
//   }, [isAuthenticated, identity, dispatch]);

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
      <Home/>
      {/* <Hubcards /> */}
      {/* <Hubdashboard /> */}
      {/* <Hubdashboard /> */}
      {/* <Hubapproved /> */}
      {/* <HubDeclined /> */}
      {/* <Mentors /> */}
      {/* <Hublisten /> */}
      {/* <ListedProjects /> */}
      {/* <Hubdashboardlive /> */}
      {/* <DashBoard /> */}
      {/* <UserProfile/> */}
      {/* <RoleSelector /> */}
      {/* <AppRoutes /> */}
      <Footer />
    </>
  );
};

export default App;

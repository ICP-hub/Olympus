import React, { useEffect } from "react";
import ConnectWallet from "./components/models/ConnectWallet";
import { useState } from "react";
import { useSelector } from "react-redux";
import Header from "./components/Layout/Header/Header";
import { useDispatch } from "react-redux";
import Footer from "./components/Footer/Footer";
import { useAuth } from "./components/AdminStateManagement/useContext/useAuth";
// import AdminDashboard from "./components/Admindashboard/AdminDashboard";
import Request from "./components/Request/Request";
import RequestCheck from "./components/Request/RequestCheck";
import AppRoutes from "./AdminRoute";
import ConfirmationModal from "./components/models/ConfirmationModal";
import { mentorApprovedRequest } from "./components/AdminStateManagement/Redux/Reducers/mentorApproved";
import { mentorPendingRequest } from "./components/AdminStateManagement/Redux/Reducers/mentorPending";
import { mentorDeclinedRequest } from "./components/AdminStateManagement/Redux/Reducers/mentorDeclined";

const App = () => {

  // const identity = useSelector((currState) => currState.internet.identity);
  const isAuthenticated = useSelector(
    (currState) => currState.internet.isAuthenticated
  );


  const { reloadLogin } = useAuth();
  const [isModalOpen, setModalOpen] = useState(false);

  const dispatch = useDispatch();
  

  useEffect(()=>{
    dispatch(mentorApprovedRequest())
  },[isAuthenticated, dispatch])

  useEffect(()=>{
    dispatch(mentorPendingRequest())
  },[isAuthenticated, dispatch])

  useEffect(()=>{
    dispatch(mentorDeclinedRequest())
  },[isAuthenticated, dispatch])


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
    
    <div className="bg-gray-100">
        <div className="container mx-auto">
      {/* {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50"></div>
      )} */}

      
     
      <Header setModalOpen={setModalOpen} gradient={"bg-gray-100"} />
      <ConnectWallet
        isModalOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
      />
      {/* <Home/> */}
      {/* <HomeSection3/> */}
      {/* <AdminDashboard/> */}
      {/* <AppRoutes /> */}
      {/* <Request/> */}
      <RequestCheck/>
      {/* <ConfirmationModal/> */}
      </div>
      </div>
      
      <Footer />
      </>
  );
};


export default App;

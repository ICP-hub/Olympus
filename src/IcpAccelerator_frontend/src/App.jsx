import React, { useEffect } from "react";
import Home from "./components/Home/Home";
// import AllDetailsForm from "./components/ProjectForm/AllDetailsForm";
// import ProgressCard from "./components/Common/ProgressCard";
// import Sidebar from "./components/Layout/SidePanel/Sidebar";
import DashBoard from "./components/Dashboard/DashBoard";
// import ProjectDetails from "./components/Project/ProjectDetails";
import UserProfile from "./components/UserProfile/UserProfile";
import ConnectWallet from "./models/ConnectWallet";
import RoleSelector from "./components/RoleSelector/RoleSelector";
import { useState } from "react";
import { useSelector } from "react-redux";
import Header from "./components/Layout/Header/Header";
import AllDetailsForm from "./components/Registration/AllDetailsForm";
import { useDispatch } from "react-redux";
import { handleActorRequest } from "./components/StateManagement/Redux/Reducers/actorBindReducer";
import { checkLoginOnStart } from "./components/StateManagement/Redux/Reducers/InternetIdentityReducer";
import AppRoutes from "./AppRoutes";
import Footer from "./components/Footer/Footer";
import { userRoleHandler } from "./components/StateManagement/Redux/Reducers/userRoleReducer";
import { mentorRegisteredHandlerRequest } from "./components/StateManagement/Redux/Reducers/mentorRegisteredData";
import { investorRegisteredHandlerRequest } from "./components/StateManagement/Redux/Reducers/investorRegisteredData";
import { hubRegisteredHandlerRequest } from "./components/StateManagement/Redux/Reducers/hubRegisteredData";
import { founderRegisteredHandlerRequest } from "./components/StateManagement/Redux/Reducers/founderRegisteredData";
import { useAuth } from "./components/StateManagement/useContext/useAuth";
import ProjectDetails from "./components/Project/ProjectDetails";
import Hubdashboardlive from "./components/Hubdashboardlive/Hubdashboardlive";
import Hubcards from "./components/Hubcards/Hubcards";
import ListedProjects from "./components/Dashboard/ListedProjects";
import Hublisten from "./components/Hublisten/Hublisten";
import Hubapproved from "./components/Hubapproved/Hubapproved";
import Hubdashboard from "./components/Hubdashboard/Hubdashboard";
import Mentors from "./components/Mentors/Mentors";
import HubDeclined from "./components/HubDeclined/HubDeclined";

import { areaOfExpertiseHandlerRequest } from "./components/StateManagement/Redux/Reducers/getAreaOfExpertise";
import NormalUser from "./components/RoleSelector/NormalUser";
import MentorRegistration from "./components/Registration/MentorRegistration/MentorRegistration";
import {
  getCurrentRoleStatusFailureHandler,
  getCurrentRoleStatusRequestHandler,
  setCurrentActiveRole,
  setCurrentRoleStatus,
} from "./components/StateManagement/Redux/Reducers/userCurrentRoleStatusReducer";
import { userRegisteredHandlerRequest } from "./components/StateManagement/Redux/Reducers/userRegisteredData";
import InvestorRegistration from "./components/Registration/InvestorRegistration/InvestorRegistration";
import CreateProjectRegistration from "./components/Project/CreateProject/CreateProjectRegistration";
import { multiChainHandlerRequest } from "./components/StateManagement/Redux/Reducers/getMultiChainList";

const App = () => {
  const actor = useSelector((currState) => currState.actors.actor);
  const identity = useSelector((currState) => currState.internet.identity);
  const isAuthenticated = useSelector(
    (currState) => currState.internet.isAuthenticated
  );
  const specificRole = useSelector(
    (currState) => currState.current.specificRole
  );

  const { reloadLogin } = useAuth();
  // const actor = useSelector((currState) => currState.actors.actor);
  // const userRole = useSelector((currState) => currState.current.specificRole);

  // console.log("specificRole in app.jsx", specificRole);

  const [isModalOpen, setModalOpen] = useState(false);

  const dispatch = useDispatch();

  // console.log('identity in app.jsx =>', identity)
  // console.log('isAuthenticated & other =>', isAuthenticated, identity,)

  useEffect(() => {
    // dispatch(checkLoginOnStart());
    if (actor) {
      dispatch(mentorRegisteredHandlerRequest());
    }
    reloadLogin();
  }, []);

  // useEffect(() => {
  //   if (isAuthenticated && identity) {
  //     dispatch(handleActorRequest());
  //   }
  // }, [isAuthenticated, identity, dispatch]);
  // useEffect(() => {
  //   if (isAuthenticated && identity) {
  //     dispatch(multiChainHandlerRequest());
  //   }
  // }, [isAuthenticated, identity, dispatch]);

  // useEffect(() => {
  //   dispatch(userRoleHandler());
  // }, [isAuthenticated, identity, dispatch]);

  // useEffect(() => {
  //   dispatch(areaOfExpertiseHandlerRequest());
  // }, [isAuthenticated, identity, dispatch]);

  // useEffect(() => {
  //   dispatch(userRegisteredHandlerRequest());
  // }, [isAuthenticated, dispatch]);

  // check if any role have status current ??
  function getNameOfCurrentStatus(rolesStatusArray) {
    const currentStatus = rolesStatusArray.find(
      (role) => role.status === "active"
    );
    return currentStatus ? currentStatus.name : null;
  }

  const initialApi = async () => {
    try {
      const currentRoleArray = await actor.get_role_status();
      console.log('currentRoleArray',currentRoleArray)
      if (currentRoleArray && currentRoleArray.length !== 0) {
        const currentActiveRole = getNameOfCurrentStatus(currentRoleArray);
        console.log('currentActiveRole', currentActiveRole)
        dispatch(setCurrentRoleStatus(currentRoleArray));
        dispatch(setCurrentActiveRole(currentActiveRole));
      } else {
        dispatch(
          getCurrentRoleStatusFailureHandler(
            "error-in-fetching-role-at-dashboard"
          )
        );
        dispatch(setCurrentActiveRole(null));
      }
    } catch (error) {
      dispatch(getCurrentRoleStatusFailureHandler(error.toString()));
      dispatch(setCurrentActiveRole(null));
    }
  };

  useEffect(() => {
    if (actor && isAuthenticated && identity) {
      initialApi();
    }
  }, [actor, isAuthenticated, identity, dispatch]);

  console.log("actor---in---dashboard", actor);

  // useEffect(() => {
  //   // console.log("specific role inside effect of app 1", specificRole);

  //   switch (specificRole) {
  //     case "Project":
  //       dispatch(founderRegisteredHandlerRequest());
  //       break;
  //     case "Mentor":
  //       dispatch(mentorRegisteredHandlerRequest());
  //       break;
  //     case "ICPHubOrganizer":
  //       dispatch(hubRegisteredHandlerRequest());
  //       break;
  //     case "VC":
  //       dispatch(investorRegisteredHandlerRequest());
  //       break;
  //     default:
  //       return null;
  //   }
  // }, [specificRole, isAuthenticated, dispatch]);

  // useEffect(() => {
  //   dispatch(areaOfExpertiseHandlerRequest());
  // }, [isAuthenticated, identity, dispatch]);

  useEffect(() => {
    if (isAuthenticated && identity) {
      dispatch(handleActorRequest());
      dispatch(multiChainHandlerRequest());
      dispatch(areaOfExpertiseHandlerRequest());
      dispatch(userRegisteredHandlerRequest());
    }
  }, [isAuthenticated, identity, dispatch]);

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
          {/* <DashBoard/> */}
          {/* <ProgressCard/> */}
          {/* <AllDetailsForm/> */}
          {/* <ProjectDetails/> */}
          {/* <Home/> */}
          {/* <Adminoption /> */}
          {/* <Admingraph /> */}
          {/* <AdminDashboard /> */}
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
          {/* <NormalUser /> */}
          {/* <InvestorRegistration/> */}
          {/* <CreateProjectRegistration /> */}
          <AppRoutes />
        </div>
      </div>
      {/* <MentorRegistration /> */}
      <Footer />
    </>
  );
};

export default App;

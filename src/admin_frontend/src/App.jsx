import React, { useEffect } from "react";
import ConnectWallet from "./components/models/ConnectWallet";
import { useState } from "react";
import { useSelector } from "react-redux";
import Header from "./components/Layout/Header/Header";
import { useDispatch } from "react-redux";
import Footer from "./components/Footer/Footer";
import { useAuth } from "./components/AdminStateManagement/useContext/useAuth";
import { mentorApprovedRequest } from "./components/AdminStateManagement/Redux/Reducers/mentorApproved";
import { mentorPendingRequest } from "./components/AdminStateManagement/Redux/Reducers/mentorPending";
import { mentorDeclinedRequest } from "./components/AdminStateManagement/Redux/Reducers/mentorDeclined";
import { investorApprovedRequest } from "./components/AdminStateManagement/Redux/Reducers/investorApproved";
import { investorPendingRequest } from "./components/AdminStateManagement/Redux/Reducers/investorPending";
import { investorDeclinedRequest } from "./components/AdminStateManagement/Redux/Reducers/investorDecline";
import { projectApprovedRequest } from "./components/AdminStateManagement/Redux/Reducers/projectApproved";
import { projectDeclinedRequest } from "./components/AdminStateManagement/Redux/Reducers/projectDeclined";
import { projectPendingRequest } from "./components/AdminStateManagement/Redux/Reducers/projectPending";
import AdminRoute from "./AdminRoute";
import { checkCountStart } from "./components/AdminStateManagement/Redux/Reducers/CountReducer";
import { checkCycleStart } from "./components/AdminStateManagement/Redux/Reducers/cyclePendingReducer";
import { checkTotalPendingStart } from "./components/AdminStateManagement/Redux/Reducers/totalPendingRequestReducer";
import { notificationHandlerRequest } from "./components/AdminStateManagement/Redux/Reducers/notificationReducer";
import AdminProjectdetails from "./components/Admindashboard/AdminProjectdetails";
import Projectdetails from "./components/Admindashboard/Projectdetails";
import Projectprofile from "./components/Admindashboard/Profile/Projectprofile";
import AllProject from "./components/Admindashboard/AllProject";
import Projectrequest from "./components/Admindashboard/Projectrequest";
import Allusers from "./components/Admindashboard/Allusers";
import Adminalluser from "./components/Admindashboard/Adminalluser";
import UserProfile from "./components/Admindashboard/Profile/UserProfile";
import UserAllProfile from "./components/Admindashboard/Profile/UserAllProfile";
import { checkTotalLiveStart } from "./components/AdminStateManagement/Redux/Reducers/TotalLiveReducer";
const App = () => {
  const actor = useSelector((currState) => currState.actors.actor);
  const isAuthenticated = useSelector(
    (currState) => currState.internet.isAuthenticated
  );

  const { reloadLogin } = useAuth();
  const [isModalOpen, setModalOpen] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    reloadLogin();
  }, []);

  useEffect(() => {
    if (actor && isAuthenticated) {
      dispatch(mentorApprovedRequest());
      dispatch(mentorPendingRequest());
      dispatch(mentorDeclinedRequest());
      dispatch(investorApprovedRequest());
      dispatch(investorPendingRequest());
      dispatch(investorDeclinedRequest());
      dispatch(projectApprovedRequest());
      dispatch(projectDeclinedRequest());
      dispatch(projectPendingRequest());
      dispatch(checkCountStart());
      dispatch(checkCycleStart());
      dispatch(checkTotalPendingStart())
      dispatch(notificationHandlerRequest())
      dispatch(checkTotalLiveStart())
    }
  }, [isAuthenticated, actor, dispatch]);

  return (
    <>
      <div className="bg-gray-100">
        <div className="container mx-auto">
          <Header setModalOpen={setModalOpen} gradient={"bg-gray-100"} />
          <ConnectWallet
            isModalOpen={isModalOpen}
            onClose={() => setModalOpen(false)}
          />
          <AdminRoute setModalOpen={setModalOpen} />
          {/* <Projectdetails/> */}
          {/* <Projectprofile/> */}
         {/* <AllProject/> */}
          {/* <Projectrequest/> */}
          {/* <Allusers/> */}
          {/* <Adminalluser/> */}
          {/* <CommonUserProfile/> */}
          {/* <AllProfile/> */}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default App;

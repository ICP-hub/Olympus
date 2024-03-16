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
import { investorApprovedRequest } from "./components/AdminStateManagement/Redux/Reducers/investorApproved";
import { investorPendingRequest } from "./components/AdminStateManagement/Redux/Reducers/investorPending";
import { investorDeclinedRequest } from "./components/AdminStateManagement/Redux/Reducers/investorDecline";
import { projectApprovedRequest } from "./components/AdminStateManagement/Redux/Reducers/projectApproved";
import { projectDeclinedRequest } from "./components/AdminStateManagement/Redux/Reducers/projectDeclined";
import { projectPendingRequest } from "./components/AdminStateManagement/Redux/Reducers/projectPending";
import AdminRoute from "./AdminRoute";

const App = () => {
  // const actor = useSelector((currState) => currState.actors.actor);
  const isAuthenticated = useSelector(
    (currState) => currState.internet.isAuthenticated
  );

  const { reloadLogin } = useAuth();
  const [isModalOpen, setModalOpen] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(mentorApprovedRequest());
  }, [isAuthenticated, dispatch]);

  useEffect(() => {
    dispatch(mentorPendingRequest());
  }, [isAuthenticated, dispatch]);

  useEffect(() => {
    dispatch(mentorDeclinedRequest());
  }, [isAuthenticated, dispatch]);

  useEffect(() => {
    dispatch(investorApprovedRequest());
  }, [isAuthenticated, dispatch]);

  useEffect(() => {
    dispatch(investorPendingRequest());
  }, [isAuthenticated, dispatch]);

  useEffect(() => {
    dispatch(investorDeclinedRequest());
  }, [isAuthenticated, dispatch]);

  useEffect(() => {
    dispatch(projectApprovedRequest());
  }, [isAuthenticated, dispatch]);

  useEffect(() => {
    dispatch(projectDeclinedRequest());
  }, [isAuthenticated, dispatch]);

  useEffect(() => {
    dispatch(projectPendingRequest());
  }, [isAuthenticated, dispatch]);

  useEffect(() => {
    reloadLogin();
  }, []);

  return (
    <>
      <div className="bg-gray-100">
        <div className="container mx-auto">
          <Header setModalOpen={setModalOpen} gradient={"bg-gray-100"} />
          <ConnectWallet
            isModalOpen={isModalOpen}
            onClose={() => setModalOpen(false)}
          />
          <AdminRoute />
        </div>
      </div>

      <Footer />
    </>
  );
};

export default App;

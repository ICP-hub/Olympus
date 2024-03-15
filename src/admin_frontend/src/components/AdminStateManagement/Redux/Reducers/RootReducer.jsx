import { combineReducers } from "@reduxjs/toolkit";
// import RoleReducer from "./RoleReducer";
// import AllHubReducer from "./All_IcpHubReducer";
import actorReducer from "./adminActor";
import internetIdentityReducer from "./adminInternetIdentity";
import mentorApprovedReducer from "./mentorApproved";
import mentorDeclinedReducer  from "./mentorDeclined";
import mentorPendingReducer  from "./mentorPending";
import investorApprovedReducer  from "./investorApproved";
import investorDeclineReducer  from "./investorDecline";
import investorPendingReducer  from "./investorPending";
import projectApprovedReducer  from "./projectApproved";
import projectDeclinedReducer  from "./projectDeclined";
import projectPendingReducer  from "./projectPending";


const rootReducer = combineReducers({
  actors: actorReducer,
  internet: internetIdentityReducer,
  investor_declined :investorDeclineReducer,
  investor_approved :investorApprovedReducer,
  investor_pending :investorPendingReducer,
  project_declined : projectDeclinedReducer,
  project_approved : projectApprovedReducer,
  project_pending : projectPendingReducer,
  mentor_declined :mentorDeclinedReducer,
  mentor_approved: mentorApprovedReducer,
  mentor_pending :mentorPendingReducer
});

export default rootReducer;

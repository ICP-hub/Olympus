import { combineReducers } from "@reduxjs/toolkit";
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
import CountReducer from "./CountReducer";
import cyclePendingReducer from "./cyclePendingReducer";
import totalPendingRequestReducer from "./totalPendingRequestReducer";
import notificationReducer from "./notificationReducer";

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
  mentor_pending :mentorPendingReducer,
  count:CountReducer,
  cyclePending: cyclePendingReducer,
  totpending : totalPendingRequestReducer,
  notification : notificationReducer
});

export default rootReducer;

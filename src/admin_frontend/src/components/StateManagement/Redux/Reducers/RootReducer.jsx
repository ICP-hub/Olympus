import { combineReducers } from "@reduxjs/toolkit";
// import RoleReducer from "./RoleReducer";
// import AllHubReducer from "./All_IcpHubReducer";
import actorReducer from "./adminActor";
import internetIdentityReducer from "./adminInternetIdentity";
// import userReducer from "./userRoleReducer";
// import mentorReducer from "./mentorRegisteredData";
// import hubReducer from "./hubRegisteredData";
// import investorReducer from "./investorRegisteredData";
// import projectReducer from "./founderRegisteredData";
// import areaOfExpertiseReducer from "./getAreaOfExpertise";
// import latestListedReducer from "./latestListed";
// import latestLiveReducer from "./latestLive";
// import popularListedReducer from "./popularListed";


const rootReducer = combineReducers({
  // role: RoleReducer,
  // hubs: AllHubReducer,
  actors: actorReducer,
  internet: internetIdentityReducer,
  // current: userReducer,
  // mentorData: mentorReducer,
  // projectData: projectReducer,
  // hubData: hubReducer,
  // investorData: investorReducer,
  // expertiseIn: areaOfExpertiseReducer,
  // latestListed: latestListedReducer,
  // latestLive: latestLiveReducer,
  // popularListed: popularListedReducer,
});

export default rootReducer;

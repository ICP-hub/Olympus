import { combineReducers } from "@reduxjs/toolkit";
import RoleReducer from "./RoleReducer";
import AllHubReducer from "./All_IcpHubReducer";
import actorReducer from "./actorBindReducer";
import internetIdentityReducer from "./InternetIdentityReducer";
import userReducer from "./userRoleReducer";
import mentorReducer from "./mentorRegisteredData";
import hubReducer from "./hubRegisteredData";
import investorReducer from "./investorRegisteredData";
import projectReducer from "./founderRegisteredData";
import areaOfExpertiseReducer from "./getAreaOfExpertise";
import latestListedReducer from "./latestListed";
import latestLiveReducer from "./latestLive";
import popularListedReducer from "./popularListed";
import userCurrentRoleStatusReducer from "./userCurrentRoleStatusReducer";


const rootReducer = combineReducers({
  role: RoleReducer,
  hubs: AllHubReducer,
  actors: actorReducer,
  internet: internetIdentityReducer,
  current: userReducer,
  mentorData: mentorReducer,
  projectData: projectReducer,
  hubData: hubReducer,
  investorData: investorReducer,
  expertiseIn: areaOfExpertiseReducer,
  latestListed: latestListedReducer,
  latestLive: latestLiveReducer,
  popularListed: popularListedReducer,
  currentRoleStatus: userCurrentRoleStatusReducer
});

export default rootReducer;

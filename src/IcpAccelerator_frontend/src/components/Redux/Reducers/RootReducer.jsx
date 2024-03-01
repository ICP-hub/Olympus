import { combineReducers } from '@reduxjs/toolkit';
import WalletReducer from './WalletAuth';
import RoleReducer from './RoleReducer';
import AllHubReducer from './All_IcpHubReducer';
import actorReducer from './actorBindReducer';
import internetIdentityReducer from './InternetIdentityReducer';
import userReducer from './userRoleReducer';
import mentorReducer from './mentorRegisteredData';
import hubReducer from './hubRegisteredData';
import investorReducer from './investorRegisteredData';
import projectReducer from './founderRegisteredData';



const rootReducer = combineReducers({
  auth: WalletReducer,
  role: RoleReducer,
  hubs: AllHubReducer,
  actors:actorReducer,
  internet: internetIdentityReducer,
  current :userReducer,
  mentorData: mentorReducer,
  projectData:projectReducer,
  hubData :hubReducer,
  investorData :investorReducer
});

export default rootReducer;

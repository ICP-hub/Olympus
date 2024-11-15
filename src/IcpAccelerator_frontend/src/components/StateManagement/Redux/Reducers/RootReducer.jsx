import { combineReducers } from '@reduxjs/toolkit';
import RoleReducer from './RoleReducer';
import AllHubReducer from './All_IcpHubReducer';
import actorReducer from './actorBindReducer';
import internetIdentityReducer from './InternetIdentityReducer';
import userReducer from './userRegisteredData';
import mentorReducer from './mentorRegisteredData';
import hubReducer from './hubRegisteredData';
import investorReducer from './investorRegisteredData';
import projectReducer from './founderRegisteredData';
import areaOfExpertiseReducer from './getAreaOfExpertise';
import typeOfProfileSlice from './getTypeOfProfile';
import multiChainReducer from './getMultiChainList';
import userCurrentRoleStatusReducer from './userCurrentRoleStatusReducer';
import getJobCategory from './getJobCategory';

const rootReducer = combineReducers({
  role: RoleReducer,
  hubs: AllHubReducer,
  actors: actorReducer,
  internet: internetIdentityReducer,
  mentorData: mentorReducer,
  projectData: projectReducer,
  userData: userReducer,
  hubData: hubReducer,
  investorData: investorReducer,
  expertiseIn: areaOfExpertiseReducer,
  profileTypes: typeOfProfileSlice,
  chains: multiChainReducer,
  currentRoleStatus: userCurrentRoleStatusReducer,
  jobsCategory: getJobCategory,
});

export default rootReducer;

import { combineReducers } from '@reduxjs/toolkit';
import WalletReducer from './WalletAuth';
import RoleReducer from './RoleReducer';
import AllHubReducer from './All_IcpHubReducer';
import actorReducer from './actorBindReducer';
import internetIdentityReducer from './InternetIdentityReducer';
import userRoleReducer from './userRoleReducer';

const rootReducer = combineReducers({
  auth: WalletReducer,
  role: RoleReducer,
  hubs: AllHubReducer,
  actors:actorReducer,
  internet: internetIdentityReducer,
  current :userRoleReducer
});

export default rootReducer;

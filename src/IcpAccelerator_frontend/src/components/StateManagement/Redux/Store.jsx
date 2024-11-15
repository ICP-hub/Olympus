import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './Reducers/RootReducer'; // Combine all reducers here
import rootSaga from './Saga/RootSaga';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { encryptTransform } from 'redux-persist-transform-encrypt';

const encryptor = encryptTransform({
  secretKey: process.env.REACT_APP_ENCRYPTION_KEY || 'defaultSecretKey',
  onError: function (error) {
    console.error('Encryption Error:', error);
  },
});

const sagaMiddleware = createSagaMiddleware();

const persistConfig = {
  key: 'root',
  storage,
  transforms: [encryptor],
};
const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.DFX_NETWORK !== 'ic',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'actors/setActor',
          'internet/loginSuccess',
          'internet/loginFailure',
        ],
        ignoredPaths: ['actors.actor', 'internet.identity'],
        ignoredActionPaths: ['payload.identity', 'payload.actor'],
      },
    }).concat(sagaMiddleware), // Add sagaMiddleware
});

// Run the root saga
sagaMiddleware.run(rootSaga);

// Export the store and persistor
export const persistor = persistStore(store);
export default store;

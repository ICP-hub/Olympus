import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import '../assets/main.css';
import { Provider } from 'react-redux';
import store, { persistor } from './components/StateManagement/Redux/Store';
import { PersistGate } from 'redux-persist/integration/react';
import { AuthProvider } from './components/StateManagement/useContext/useAuthentication';
import '@nfid/identitykit/react/styles.css';
import {
  IdentityKitAuthType,
  NFIDW,
  Plug,
  InternetIdentity,
} from '@nfid/identitykit';
import { IdentityKitProvider, IdentityKitTheme } from '@nfid/identitykit/react';
const container = document.getElementById('root');
const root = createRoot(container);
const singers = [NFIDW, Plug, InternetIdentity];
const canisterID = process.env.CANISTER_ID_ICPACCELERATOR_BACKEND;

root.render(
  <IdentityKitProvider
    onConnectSuccess={(res) => {
      console.log('logged in successfully', res);
    }}
    onDisconnect={(res) => {
      console.log('logged out successfully', res);
    }}
    signers={singers}
    theme={IdentityKitTheme.SYSTEM}
    authType={IdentityKitAuthType.DELEGATION}
    signerClientOptions={{
      targets: [canisterID],
    }}
  >
    <Provider store={store}>
      <AuthProvider>
        <BrowserRouter>
          <PersistGate loading={null} persistor={persistor}>
            <App />
          </PersistGate>
        </BrowserRouter>
      </AuthProvider>
    </Provider>
  </IdentityKitProvider>
);

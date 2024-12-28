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
import { IdentityKitAuthType, NFIDW, Plug } from '@nfid/identitykit';
import { IdentityKitProvider, IdentityKitTheme } from '@nfid/identitykit/react';
const container = document.getElementById('root');
const root = createRoot(container);
const singers = [NFIDW, Plug];
const canisterID = process.env.CANISTER_ID_ICPACCELERATOR_BACKEND;

const signerClientOptions = {
  targets: [canisterID],
  maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000), // 1 week in nanoseconds
  idleOptions: {
    idleTimeout: 4 * 60 * 60 * 1000, // 4 hours in milliseconds
    disableIdle: false, // Enable logout on idle timeout
  },
  keyType: 'Ed25519', // Use Ed25519 key type for compatibility
  allowInternetIdentityPinAuthentication: true, // Enable PIN authentication
};
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
    signerClientOptions={signerClientOptions}
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

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import '../assets/main.css';
import { Provider } from 'react-redux';
import store, { persistor } from './components/StateManagement/Redux/Store';
import { PersistGate } from 'redux-persist/integration/react';
import { AuthProvider } from './components/StateManagement/useContext/useAuth';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <AuthProvider>
      <BrowserRouter>
        <PersistGate loading={null} persistor={persistor}>
          <App />
        </PersistGate>
      </BrowserRouter>
    </AuthProvider>
  </Provider>
);

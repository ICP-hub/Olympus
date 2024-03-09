import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

import { BrowserRouter } from "react-router-dom";
import "../assets/main.css";
import { Provider } from "react-redux";
import store,{persistor} from "./components/AdminStateManagement/Redux/Store";
import { PersistGate } from "redux-persist/integration/react";
// import { persistStore } from "redux-persist";
import { AuthProvider } from "./components/AdminStateManagement/useContext/useAuth";
// let persistor = persistStore(store);

ReactDOM.render(
  <Provider store={store}>
    <AuthProvider>
      <BrowserRouter>
        <PersistGate loading={null} persistor={persistor}>
          <App />
        </PersistGate>
      </BrowserRouter>
    </AuthProvider>
  </Provider>,

  document.getElementById("root")
);

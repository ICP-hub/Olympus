import React from "react";
import ReactDOM from "react-dom";
import App from "../admin_frontend/src/App";
import { BrowserRouter } from "react-router-dom";
import "../assets/main.css";
import { Provider } from "react-redux";
import store,{persistor} from "../admin_frontend/src/components/AdminStateManagement/Redux/Store";
import { PersistGate } from "redux-persist/integration/react";
import { AuthProvider } from "../admin_frontend/src/components/AdminStateManagement/useContext/useAuth";

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

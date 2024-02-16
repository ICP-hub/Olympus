import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

import { BrowserRouter } from "react-router-dom";
import "../assets/main.css";
import { Provider } from "react-redux";
import store,{persistor} from "./components/Redux/Store";
import { PersistGate } from "redux-persist/integration/react"; 
// import { persistStore } from "redux-persist";

// let persistor = persistStore(store);

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
    <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);

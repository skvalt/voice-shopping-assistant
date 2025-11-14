import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import { ListProvider } from "./contexts/ListContext";

import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ListProvider>
          <App />
        </ListProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

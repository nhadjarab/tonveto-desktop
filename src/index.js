import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { HashRouter as Router } from "react-router-dom";
import AuthProvider from "./context/AuthProvider";
import DownloadProvider from "./context/DownloadProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <DownloadProvider>
        <Router>
          <App />
        </Router>
      </DownloadProvider>
    </AuthProvider>
  </React.StrictMode>
);

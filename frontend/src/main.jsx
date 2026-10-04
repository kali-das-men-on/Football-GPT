import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// Mounts the whole React app into the <div id="root"> from index.html.
// This is the React equivalent of what your old script.js did by hand
// with document.getElementById and appendChild -- React manages the DOM
// updates for you from here on.
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

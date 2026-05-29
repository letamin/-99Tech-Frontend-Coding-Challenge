import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./style/index.css";

const container = document.getElementById("root");

if (!container) {
  throw new Error("Failed to find the root element. Application cannot mount.");
}

const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

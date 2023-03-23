import React from "react";
import * as ReactDOMClient from "react-dom/client";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import "./main.css";

const container = document.getElementById("app");
const root = ReactDOMClient.createRoot(container);

root.render(<App />);

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { IndexRouters } from "./router";
import "./index.css";
import App from "./App.jsx";

const router = createBrowserRouter([...IndexRouters], '/');

createRoot(document.getElementById("root")).render(
  <StrictMode>
      <App>
        <RouterProvider router={router}></RouterProvider>
      </App>
  </StrictMode>
);

import { createBrowserRouter } from "react-router-dom";
import { NotFound } from "./NoutFound";
import { Home } from "./Home";

export const routers = createBrowserRouter([
  {
    path: "*",
    element: <NotFound />,
  },
  {
    path: "/",
    element: <Home />,
  },
]);

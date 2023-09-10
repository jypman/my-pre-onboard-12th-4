import { createBrowserRouter } from "react-router-dom";
import { NotFound } from "./NoutFound";
import { Chart } from "./Chart";

export const routers = createBrowserRouter([
  {
    path: "*",
    element: <NotFound />,
  },
  {
    path: "/",
    element: <Chart />,
  },
]);

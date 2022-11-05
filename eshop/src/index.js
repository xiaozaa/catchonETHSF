import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { LandPage } from "./routes/landing";
import { AppList, loader as AppListLoader } from "./routes/applist";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppView, loader as appViewLoader } from "./routes/app_view/appView";
import { Overview, loader as overViewLoader } from "./routes/app_view/overview";
import { Support } from "./routes/app_view/support";
import { Index } from "./routes/app_view/index";
import { AppCreate } from "./routes/appcreate";
import { Lab } from "./routes/lab";
import { ProductDetail } from "./routes/app_view/productDetail";
import { EditProduct } from "./routes/app_view/editProduct";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandPage />,
    // element: <Lab />,
  },
  {
    path: "/lab",
    //element: <LandPage />,
    element: <Lab />,
  },
  {
    path: "/applist",
    element: <AppList />,
    loader: AppListLoader,
  },
  {
    path: "/app-create",
    element: <AppCreate />,
    // action: createAction,
  },
  {
    path: "/appview/:proxyAddress",
    element: <AppView />,
    loader: appViewLoader,
    children: [
      { index: true, element: <Index /> },
      {
        path: "overview",
        element: <Overview />,
        loader: overViewLoader,
      },
      {
        path: "detail/:id",
        element: <ProductDetail />,
      },

      {
        path: "edit/:id",
        element: <EditProduct />,
      },

      /*
      {
        path: "config",
        element: <Config />,
        loader: configLoader,
      },
      {
        path: "allowlist",
        element: <DataView />,
        loader: allowlistLoader,
      },
      */
      {
        path: "support",
        element: <Support />,
      },
    ],
  },
]);
ReactDOM.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { LandPage } from "./routes/landing";
import { App, loader as AppLoader } from "./routes/app";
import { AppList, loader as AppListLoader } from "./routes/applist";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppView, loader as appViewLoader } from "./routes/app_view/appView";
import { Overview, loader as overViewLoader } from "./routes/app_view/overview";
import { Support, loader as SupportLoader } from "./routes/app_view/support";
import { Index } from "./routes/app_view/index";
import { AppCreate } from "./routes/appcreate";
import { Lab, action as LabAction } from "./routes/lab";
import { ProductDetail } from "./routes/app_view/productDetail";
import { EditProduct } from "./routes/app_view/editProduct";
import {
  AddProduct,
  action as addProductAction,
} from "./routes/app_view/addProduct";
import { Shipping, loader as ShippingLoader } from "./routes/app_view/shipping";
import { Integration } from "./routes/app_view/integration";

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
    action: LabAction,
  },
  {
    path: "/app",
    element: <App />,
    loader: AppLoader,
    children: [
      {
        path: "view/:proxyAddress",
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

          {
            path: "addProduct",
            element: <AddProduct />,
            action: addProductAction,
          },

          {
            path: "support",
            element: <Support />,
          },
          {
            path: "shipping",
            element: <Shipping />,
            loader: ShippingLoader,
          },
          {
            path: "integration",
            element: <Integration />,
          },
        ],
      },
    ],
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

      {
        path: "addProduct",
        element: <AddProduct />,
        action: addProductAction,
      },

      {
        path: "support",
        element: <Support />,
      },
      {
        path: "shipping",
        element: <Shipping />,
        loader: ShippingLoader,
      },

      {
        path: "integration",
        element: <Integration />,
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

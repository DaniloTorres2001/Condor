/** @format */

import { Navigate, useRoutes, Outlet } from "react-router-dom";

// layouts
import DashboardLayout from "./layouts/dashboard";
//
import Login from "./pages/login/Login";
import ForgetPassword from "./pages/login/forgotPassword";
import ResetPassword from "./pages/login/resetPassword";
import Dashboard from "./pages/dashboard/Dashboard";

// Groups

import Groups from "./pages/group/Groups";
import GroupCreate from "./pages/group/create";
import GroupUpdate from "./pages/group/Update";

// User
import User from "./pages/User/User";
import UserCreate from "./pages/User/Create";
import UserUpdate from "./pages/User/Update";

// Organization

import Organization from "./pages/organization/Organization";
import OrganizationCreate from "./pages/organization/Create";
import OrganizationUpdate from "./pages/organization/Update";

// Profile

import Profile from "./pages/profile/profile";

// Profile

import Pagos from "./pages/carreras/pagos";

export default function Router() {
  return useRoutes([
    {
      path: "/dashboard",
      element: <DashboardLayout />,
      children: [
        { path: "home", element: <Dashboard /> },
        {
          path: "users",
          element: <Outlet />,
          children: [
            { path: "", element: <User /> },
            { path: "create", element: <UserCreate /> },
            { path: "update/:id", element: <UserUpdate /> },
          ],
        },
        {
          path: "groups",
          element: <Outlet />,
          children: [
            { path: "", element: <Groups /> },
            { path: "create", element: <GroupCreate /> },
            { path: "update/:id", element: <GroupUpdate /> },
          ],
        },
        {
          path: "organizations",
          element: <Outlet />,
          children: [
            { path: "", element: <Organization /> }, // Organization
            { path: "create", element: <OrganizationCreate /> },
            { path: "update/:id", element: <OrganizationUpdate /> },
          ],
        },
        { path: "profile", element: <Profile /> },
        { path: "pagos", element: <Pagos /> },
      ],
    },

    { path: "login", element: <Login /> },
    { path: "forget-password", element: <ForgetPassword /> },
    { path: "reset-password", element: <ResetPassword /> },
    { path: "/", element: <Navigate to="/dashboard/home" /> },
    { path: "*", element: <Navigate to="/dashboard/home" replace /> },
  ]);
}

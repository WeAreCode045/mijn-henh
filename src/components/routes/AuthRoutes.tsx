
import React, { lazy } from "react";
import { Route } from "react-router-dom";
import { LoadingSpinner } from "../common/LoadingSpinner";
import PublicRoute from "../PublicRoute";

// Lazy-loaded components
const Auth = lazy(() => import("../../pages/Auth"));

export const AuthRoutes = [
  <Route 
    key="auth"
    path="/auth" 
    element={
      <PublicRoute>
        <React.Suspense fallback={<LoadingSpinner />}>
          <Auth />
        </React.Suspense>
      </PublicRoute>
    } 
  />
];

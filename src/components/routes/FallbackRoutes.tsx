
import React, { lazy } from "react";
import { Route } from "react-router-dom";
import { LoadingSpinner } from "../common/LoadingSpinner";

// Lazy-loaded components
const NotFound = lazy(() => import("../../pages/NotFound"));

export const FallbackRoutes = [
  <Route 
    key="not-found"
    path="*" 
    element={
      <React.Suspense fallback={<LoadingSpinner />}>
        <NotFound />
      </React.Suspense>
    } 
  />
];

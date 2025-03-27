
import { lazy } from "react";
import { Route } from "react-router-dom";
import { LoadingSpinner } from "../common/LoadingSpinner";

// Lazy-loaded components
const Auth = lazy(() => import("../../pages/Auth"));

export const AuthRoutes = [
  <Route 
    key="auth"
    path="/auth" 
    element={
      <React.Suspense fallback={<LoadingSpinner />}>
        <Auth />
      </React.Suspense>
    } 
  />
];

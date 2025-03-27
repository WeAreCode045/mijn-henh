
import { Suspense } from "react";
import { Route } from "react-router-dom";
import { ProtectedRoute } from "../ProtectedRoute";
import { PropertyLayout } from "../PropertyLayout";

// Import lazy components that are shared among protected routes
import { LoadingSpinner } from "./LoadingSpinner";

// Lazy-imported pages
const Index = React.lazy(() => import("../../pages/index"));
const Properties = React.lazy(() => import("../../pages/Properties"));
const PropertyFormPage = React.lazy(() => import("../../pages/PropertyFormPage"));
const Settings = React.lazy(() => import("../../pages/Settings"));
const Users = React.lazy(() => import("../../pages/Users"));
const Import = React.lazy(() => import("../../pages/Import"));

export function ProtectedRoutes() {
  return (
    <>
      <Route path="/" element={
        <ProtectedRoute>
          <PropertyLayout>
            <Suspense fallback={<LoadingSpinner />}>
              <Index />
            </Suspense>
          </PropertyLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/properties" element={
        <ProtectedRoute>
          <PropertyLayout>
            <Suspense fallback={<LoadingSpinner />}>
              <Properties />
            </Suspense>
          </PropertyLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/import" element={
        <ProtectedRoute>
          <PropertyLayout>
            <Suspense fallback={<LoadingSpinner />}>
              <Import />
            </Suspense>
          </PropertyLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/property/new" element={
        <ProtectedRoute>
          <PropertyLayout>
            <Suspense fallback={<LoadingSpinner />}>
              <PropertyFormPage />
            </Suspense>
          </PropertyLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/settings" element={
        <ProtectedRoute>
          <PropertyLayout>
            <Suspense fallback={<LoadingSpinner />}>
              <Settings />
            </Suspense>
          </PropertyLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/users" element={
        <ProtectedRoute>
          <PropertyLayout>
            <Suspense fallback={<LoadingSpinner />}>
              <Users />
            </Suspense>
          </PropertyLayout>
        </ProtectedRoute>
      } />
    </>
  );
}

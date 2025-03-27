
import { Suspense } from "react";
import { Route, Navigate, useParams } from "react-router-dom";
import { ProtectedRoute } from "../ProtectedRoute";
import { PropertyLayout } from "../PropertyLayout";
import { LoadingSpinner } from "./LoadingSpinner";

// Lazy-loaded component
const PropertyFormPage = React.lazy(() => import("../../pages/PropertyFormPage"));

// Redirect components
function PropertyDashboardRedirect() {
  const { id } = useParams();
  return <Navigate to={`/property/${id}/dashboard`} replace />;
}

function PropertyEditRedirect() {
  const { id } = useParams();
  return <Navigate to={`/property/${id}/dashboard`} replace />;
}

function PropertyContentRedirect() {
  const { id } = useParams();
  return <Navigate to={`/property/${id}/content/general`} replace />;
}

export function PropertyRoutes() {
  return (
    <>
      <Route path="/property/:id" element={
        <ProtectedRoute>
          <PropertyDashboardRedirect />
        </ProtectedRoute>
      } />
      
      <Route path="/property/:id/dashboard" element={
        <ProtectedRoute>
          <PropertyLayout>
            <Suspense fallback={<LoadingSpinner />}>
              <PropertyFormPage />
            </Suspense>
          </PropertyLayout>
        </ProtectedRoute>
      } />
      
      {/* Content tab routes */}
      <Route path="/property/:id/content" element={
        <ProtectedRoute>
          <PropertyContentRedirect />
        </ProtectedRoute>
      } />
      
      {/* Content step routes */}
      <Route path="/property/:id/content/:step" element={
        <ProtectedRoute>
          <PropertyLayout>
            <Suspense fallback={<LoadingSpinner />}>
              <PropertyFormPage />
            </Suspense>
          </PropertyLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/property/:id/media" element={
        <ProtectedRoute>
          <PropertyLayout>
            <Suspense fallback={<LoadingSpinner />}>
              <PropertyFormPage />
            </Suspense>
          </PropertyLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/property/:id/communications" element={
        <ProtectedRoute>
          <PropertyLayout>
            <Suspense fallback={<LoadingSpinner />}>
              <PropertyFormPage />
            </Suspense>
          </PropertyLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/property/:id/edit" element={
        <ProtectedRoute>
          <PropertyEditRedirect />
        </ProtectedRoute>
      } />
    </>
  );
}

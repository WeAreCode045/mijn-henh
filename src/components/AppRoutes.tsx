
import { Suspense, lazy } from "react";
import { Route, Routes, Navigate, useParams } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { PropertyLayout } from "./PropertyLayout";

// Lazy-loaded components
const Index = lazy(() => import("../pages/Index"));
const Properties = lazy(() => import("../pages/Properties"));
const PropertyFormPage = lazy(() => import("../pages/PropertyFormPage"));
const Settings = lazy(() => import("../pages/Settings"));
const NotFound = lazy(() => import("../pages/NotFound"));
const Auth = lazy(() => import("../pages/Auth"));
const PropertyWebView = lazy(() => import("./property/PropertyWebView").then(module => ({ default: module.PropertyWebView })));
const Users = lazy(() => import("../pages/Users"));
const Import = lazy(() => import("../pages/Import"));

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-estate-800"></div>
  </div>
);

// This component handles the redirect from /edit to /dashboard
function PropertyEditRedirect() {
  const { id } = useParams();
  return <Navigate to={`/property/${id}/dashboard`} replace />;
}

// This component handles the redirect from /property/:id to /property/:id/dashboard
function PropertyDashboardRedirect() {
  const { id } = useParams();
  return <Navigate to={`/property/${id}/dashboard`} replace />;
}

// This component handles the redirect to the default content tab
function PropertyContentRedirect() {
  const { id } = useParams();
  return <Navigate to={`/property/${id}/content/general`} replace />;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/auth" element={
        <Suspense fallback={<LoadingSpinner />}>
          <Auth />
        </Suspense>
      } />
      
      {/* Public webview routes - accessible without login */}
      <Route path="/property/:id/webview" element={
        <Suspense fallback={<LoadingSpinner />}>
          <PropertyWebView />
        </Suspense>
      } />
      
      {/* Simplified public route for webviews */}
      <Route path="/:id/webview" element={
        <Suspense fallback={<LoadingSpinner />}>
          <PropertyWebView />
        </Suspense>
      } />
      
      <Route path="/share/:id" element={
        <Suspense fallback={<LoadingSpinner />}>
          <PropertyWebView />
        </Suspense>
      } />
      
      {/* Legacy view route - maintained for backward compatibility */}
      <Route path="/property/view/:id" element={
        <Suspense fallback={<LoadingSpinner />}>
          <PropertyWebView />
        </Suspense>
      } />
      
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
      
      <Route path="*" element={
        <Suspense fallback={<LoadingSpinner />}>
          <NotFound />
        </Suspense>
      } />
    </Routes>
  );
}

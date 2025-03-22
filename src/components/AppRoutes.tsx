
import { Suspense } from "react";
import { Route, Routes, Navigate, useParams } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { PropertyLayout } from "./PropertyLayout";

// Directly import instead of lazy-loading
import Index from "../pages/Index";
import Properties from "../pages/Properties";
import PropertyFormPage from "../pages/PropertyFormPage";
import Settings from "../pages/Settings";
import NotFound from "../pages/NotFound";
import Auth from "../pages/Auth";
import { PropertyWebView } from "./property/PropertyWebView";
import Users from "../pages/Users";
import Import from "../pages/Import";

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
            <Index />
          </PropertyLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/properties" element={
        <ProtectedRoute>
          <PropertyLayout>
            <Properties />
          </PropertyLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/import" element={
        <ProtectedRoute>
          <PropertyLayout>
            <Import />
          </PropertyLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/property/new" element={
        <ProtectedRoute>
          <PropertyLayout>
            <PropertyFormPage />
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
            <PropertyFormPage />
          </PropertyLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/property/:id/content" element={
        <ProtectedRoute>
          <PropertyLayout>
            <PropertyFormPage />
          </PropertyLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/property/:id/media" element={
        <ProtectedRoute>
          <PropertyLayout>
            <PropertyFormPage />
          </PropertyLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/property/:id/communications" element={
        <ProtectedRoute>
          <PropertyLayout>
            <PropertyFormPage />
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
            <Settings />
          </PropertyLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/users" element={
        <ProtectedRoute>
          <PropertyLayout>
            <Users />
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

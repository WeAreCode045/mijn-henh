
import React from "react";
import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { PropertyLayout } from "../components/PropertyLayout";
import { Suspense } from "react";
import { LoadingSpinner } from "./routes/LoadingSpinner";

// Lazy-loaded components
const Auth = React.lazy(() => import("../pages/Auth"));
const PropertyWebView = React.lazy(() => import("./property/PropertyWebView").then(module => ({ default: module.PropertyWebView })));
const NotFound = React.lazy(() => import("../pages/NotFound"));
const Index = React.lazy(() => import("../pages/index"));
const Properties = React.lazy(() => import("../pages/Properties"));
const PropertyFormPage = React.lazy(() => import("../pages/PropertyFormPage"));
const Settings = React.lazy(() => import("../pages/Settings"));
const Users = React.lazy(() => import("../pages/Users"));
const Import = React.lazy(() => import("../pages/Import"));

export function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/auth" element={
        <Suspense fallback={<LoadingSpinner />}>
          <Auth />
        </Suspense>
      } />
      
      <Route path="/property/:id/webview" element={
        <Suspense fallback={<LoadingSpinner />}>
          <PropertyWebView />
        </Suspense>
      } />
      
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
      
      <Route path="/property/view/:id" element={
        <Suspense fallback={<LoadingSpinner />}>
          <PropertyWebView />
        </Suspense>
      } />
      
      {/* Protected routes */}
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
      
      {/* Property routes */}
      <Route path="/property/:id" element={
        <ProtectedRoute>
          <PropertyLayout>
            <Suspense fallback={<LoadingSpinner />}>
              <PropertyFormPage />
            </Suspense>
          </PropertyLayout>
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
      
      {/* Catch-all route */}
      <Route path="*" element={
        <Suspense fallback={<LoadingSpinner />}>
          <NotFound />
        </Suspense>
      } />
    </Routes>
  );
}

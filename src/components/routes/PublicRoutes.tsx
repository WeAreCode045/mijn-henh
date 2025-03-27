
import React, { Suspense } from "react";
import { Route } from "react-router-dom";
import { LoadingSpinner } from "./LoadingSpinner";

// Lazy-loaded components
const Auth = React.lazy(() => import("../../pages/Auth"));
const PropertyWebView = React.lazy(() => import("../property/PropertyWebView").then(module => ({ default: module.PropertyWebView })));
const NotFound = React.lazy(() => import("../../pages/NotFound"));

export function PublicRoutes() {
  return (
    <>
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
      
      <Route path="*" element={
        <Suspense fallback={<LoadingSpinner />}>
          <NotFound />
        </Suspense>
      } />
    </>
  );
}

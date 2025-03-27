
import React, { lazy } from "react";
import { Route } from "react-router-dom";
import { LoadingSpinner } from "../common/LoadingSpinner";

// Lazy-loaded components
const PropertyWebView = lazy(() => import("../property/PropertyWebView").then(module => ({ default: module.PropertyWebView })));

export const WebViewRoutes = [
  <Route 
    key="property-webview"
    path="/property/:id/webview" 
    element={
      <React.Suspense fallback={<LoadingSpinner />}>
        <PropertyWebView />
      </React.Suspense>
    } 
  />,
  
  <Route 
    key="id-webview"
    path="/:id/webview" 
    element={
      <React.Suspense fallback={<LoadingSpinner />}>
        <PropertyWebView />
      </React.Suspense>
    } 
  />,
  
  <Route 
    key="share-webview"
    path="/share/:id" 
    element={
      <React.Suspense fallback={<LoadingSpinner />}>
        <PropertyWebView />
      </React.Suspense>
    } 
  />,
  
  <Route 
    key="property-view-legacy"
    path="/property/view/:id" 
    element={
      <React.Suspense fallback={<LoadingSpinner />}>
        <PropertyWebView />
      </React.Suspense>
    } 
  />
];

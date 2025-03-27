
import React, { lazy } from "react";
import { Route } from "react-router-dom";
import { ProtectedRoute } from "../ProtectedRoute";
import { PropertyLayout } from "../PropertyLayout";
import { LoadingSpinner } from "../common/LoadingSpinner";

// Lazy-loaded components
const Index = lazy(() => import("../../pages/index"));
const Properties = lazy(() => import("../../pages/Properties"));
const PropertyFormPage = lazy(() => import("../../pages/PropertyFormPage"));
const Settings = lazy(() => import("../../pages/Settings"));
const Users = lazy(() => import("../../pages/Users"));
const Import = lazy(() => import("../../pages/Import"));

export const MainRoutes = [
  <Route 
    key="index"
    path="/" 
    element={
      <ProtectedRoute>
        <PropertyLayout>
          <React.Suspense fallback={<LoadingSpinner />}>
            <Index />
          </React.Suspense>
        </PropertyLayout>
      </ProtectedRoute>
    } 
  />,
  
  <Route 
    key="properties"
    path="/properties" 
    element={
      <ProtectedRoute>
        <PropertyLayout>
          <React.Suspense fallback={<LoadingSpinner />}>
            <Properties />
          </React.Suspense>
        </PropertyLayout>
      </ProtectedRoute>
    } 
  />,
  
  <Route 
    key="import"
    path="/import" 
    element={
      <ProtectedRoute>
        <PropertyLayout>
          <React.Suspense fallback={<LoadingSpinner />}>
            <Import />
          </React.Suspense>
        </PropertyLayout>
      </ProtectedRoute>
    } 
  />,
  
  <Route 
    key="property-new"
    path="/property/new" 
    element={
      <ProtectedRoute>
        <PropertyLayout>
          <React.Suspense fallback={<LoadingSpinner />}>
            <PropertyFormPage />
          </React.Suspense>
        </PropertyLayout>
      </ProtectedRoute>
    } 
  />,
  
  <Route 
    key="property-content-step"
    path="/property/:id/content/:step" 
    element={
      <ProtectedRoute>
        <PropertyLayout>
          <React.Suspense fallback={<LoadingSpinner />}>
            <PropertyFormPage />
          </React.Suspense>
        </PropertyLayout>
      </ProtectedRoute>
    } 
  />,
  
  <Route 
    key="property-edit"
    path="/property/:id/edit" 
    element={
      <ProtectedRoute>
        <PropertyLayout>
          <React.Suspense fallback={<LoadingSpinner />}>
            <PropertyFormPage />
          </React.Suspense>
        </PropertyLayout>
      </ProtectedRoute>
    } 
  />,
  
  <Route 
    key="property-dashboard"
    path="/property/:id/dashboard" 
    element={
      <ProtectedRoute>
        <PropertyLayout>
          <React.Suspense fallback={<LoadingSpinner />}>
            <PropertyFormPage />
          </React.Suspense>
        </PropertyLayout>
      </ProtectedRoute>
    } 
  />,
  
  <Route 
    key="property-media"
    path="/property/:id/media" 
    element={
      <ProtectedRoute>
        <PropertyLayout>
          <React.Suspense fallback={<LoadingSpinner />}>
            <PropertyFormPage />
          </React.Suspense>
        </PropertyLayout>
      </ProtectedRoute>
    } 
  />,
  
  <Route 
    key="property-communications"
    path="/property/:id/communications" 
    element={
      <ProtectedRoute>
        <PropertyLayout>
          <React.Suspense fallback={<LoadingSpinner />}>
            <PropertyFormPage />
          </React.Suspense>
        </PropertyLayout>
      </ProtectedRoute>
    } 
  />,
  
  <Route 
    key="settings"
    path="/settings" 
    element={
      <ProtectedRoute>
        <PropertyLayout>
          <React.Suspense fallback={<LoadingSpinner />}>
            <Settings />
          </React.Suspense>
        </PropertyLayout>
      </ProtectedRoute>
    } 
  />,
  
  <Route 
    key="users"
    path="/users" 
    element={
      <ProtectedRoute>
        <PropertyLayout>
          <React.Suspense fallback={<LoadingSpinner />}>
            <Users />
          </React.Suspense>
        </PropertyLayout>
      </ProtectedRoute>
    } 
  />
];

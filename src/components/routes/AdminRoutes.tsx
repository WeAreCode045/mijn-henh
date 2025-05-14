
import React, { lazy } from "react";
import { Route } from "react-router-dom";
import { ProtectedRoute } from "../ProtectedRoute";
import { PropertyLayout } from "../PropertyLayout";
import { LoadingSpinner } from "../common/LoadingSpinner";

// Lazy-loaded components
const Dashboard = lazy(() => import("../../pages/index"));
const Properties = lazy(() => import("../../pages/Properties"));
const PropertyFormPage = lazy(() => import("../../pages/PropertyFormPage"));
const PropertyFormContainer = lazy(() => import("../../pages/property/PropertyFormContainer").then(module => ({ default: module.PropertyFormContainer })));
const Import = lazy(() => import("../../pages/Import"));
const Settings = lazy(() => import("../../pages/Settings"));
const Users = lazy(() => import("../../pages/Users"));
const GlobalFeaturesPage = lazy(() => import("../../pages/properties/GlobalFeaturesPage"));
const WebviewsPage = lazy(() => import("../../pages/properties/WebviewsPage"));
const Participants = lazy(() => import("../../pages/Participants"));

export const AdminRoutes = [
  <Route 
    key="home-admin"
    path="/" 
    element={
      <ProtectedRoute>
        <PropertyLayout>
          <React.Suspense fallback={<LoadingSpinner />}>
            <Dashboard />
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
    key="properties-add"
    path="/properties/add" 
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
    key="properties-id"
    path="/properties/:id" 
    element={
      <ProtectedRoute>
        <PropertyLayout>
          <React.Suspense fallback={<LoadingSpinner />}>
            <PropertyFormContainer />
          </React.Suspense>
        </PropertyLayout>
      </ProtectedRoute>
    } 
  />,
  
  <Route 
    key="properties-global-features"
    path="/properties/global-features" 
    element={
      <ProtectedRoute>
        <PropertyLayout>
          <React.Suspense fallback={<LoadingSpinner />}>
            <GlobalFeaturesPage />
          </React.Suspense>
        </PropertyLayout>
      </ProtectedRoute>
    } 
  />,
  
  <Route 
    key="properties-webviews"
    path="/properties/webviews" 
    element={
      <ProtectedRoute>
        <PropertyLayout>
          <React.Suspense fallback={<LoadingSpinner />}>
            <WebviewsPage />
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
    key="participants"
    path="/participants" 
    element={
      <ProtectedRoute>
        <PropertyLayout>
          <React.Suspense fallback={<LoadingSpinner />}>
            <Participants />
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
  />,
  
  <Route 
    key="employees"
    path="/employees" 
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

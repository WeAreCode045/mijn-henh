
import React, { lazy } from "react";
import { Route } from "react-router-dom";
import { ProtectedRoute } from "../ProtectedRoute";
import { PropertyLayout } from "../PropertyLayout";
import { LoadingSpinner } from "../common/LoadingSpinner";

// Lazy-loaded components
const ParticipantDashboard = lazy(() => import("../../pages/ParticipantDashboard"));
const ParticipantProfile = lazy(() => import("../../pages/ParticipantProfile"));

export const ParticipantRoutes = [
  <Route
    key="home-participant"
    path="/"
    element={
      <ProtectedRoute>
        <PropertyLayout>
          <React.Suspense fallback={<LoadingSpinner />}>
            <ParticipantDashboard />
          </React.Suspense>
        </PropertyLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="participant"
    path="/participant"
    element={
      <ProtectedRoute>
        <PropertyLayout>
          <React.Suspense fallback={<LoadingSpinner />}>
            <ParticipantDashboard />
          </React.Suspense>
        </PropertyLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="participant-profile"
    path="/participant/profile"
    element={
      <ProtectedRoute>
        <PropertyLayout>
          <React.Suspense fallback={<LoadingSpinner />}>
            <ParticipantProfile />
          </React.Suspense>
        </PropertyLayout>
      </ProtectedRoute>
    }
  />
];

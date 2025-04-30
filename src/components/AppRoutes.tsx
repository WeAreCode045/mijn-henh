
import React from "react";
import { Routes, Route } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import Properties from "@/pages/Properties";
import PropertyFormPage from "@/pages/PropertyFormPage";
import { PropertyFormContainer } from "@/pages/property/PropertyFormContainer";
import Dashboard from "@/pages/index";
import Auth from "@/pages/Auth";
import Import from "@/pages/Import";
import NotFound from "@/pages/NotFound";
import Settings from "@/pages/Settings";
import Users from "@/pages/Users";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import PublicRoute from "@/components/PublicRoute";
import GlobalFeaturesPage from "@/pages/properties/GlobalFeaturesPage";
import WebviewsPage from "@/pages/properties/WebviewsPage";
import ParticipantDashboard from "@/pages/ParticipantDashboard";
import ParticipantProfile from "@/pages/ParticipantProfile";
import Participants from "@/pages/Participants";

export default function AppRoutes() {
  const { isAdmin, isAgent, userRole } = useAuth();
  const isParticipant = userRole === 'buyer' || userRole === 'seller';

  // Debug information
  console.log("AppRoutes - isAdmin:", isAdmin);
  console.log("AppRoutes - isAgent:", isAgent);
  console.log("AppRoutes - userRole:", userRole);
  console.log("AppRoutes - isParticipant:", isParticipant);

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/auth"
        element={
          <PublicRoute>
            <Auth />
          </PublicRoute>
        }
      />

      {/* Protected Routes */}
      {isParticipant ? (
        <>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <ParticipantDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/participant"
            element={
              <ProtectedRoute>
                <ParticipantDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/participant/profile"
            element={
              <ProtectedRoute>
                <ParticipantProfile />
              </ProtectedRoute>
            }
          />
        </>
      ) : (
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      )}

      {/* Agent Routes */}
      {(isAgent || isAdmin) && (
        <>
          <Route
            path="/properties"
            element={
              <ProtectedRoute>
                <Properties />
              </ProtectedRoute>
            }
          />
          <Route
            path="/properties/add"
            element={
              <ProtectedRoute>
                <PropertyFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/properties/:id"
            element={
              <ProtectedRoute>
                <PropertyFormContainer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/properties/global-features"
            element={
              <ProtectedRoute>
                <GlobalFeaturesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/properties/webviews"
            element={
              <ProtectedRoute>
                <WebviewsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/import"
            element={
              <ProtectedRoute>
                <Import />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
        </>
      )}

      {/* Admin Routes */}
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <Users />
          </ProtectedRoute>
        }
      />
      <Route
        path="/participants"
        element={
          <ProtectedRoute>
            <Participants />
          </ProtectedRoute>
        }
      />

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}


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
import { PropertyLayout } from "@/components/PropertyLayout";

export default function AppRoutes() {
  // Debug info for authentication state
  console.log("AppRoutes - Initializing and checking auth context");
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

      {/* Protected Routes with PropertyLayout */}
      {isParticipant ? (
        <>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <PropertyLayout>
                  <ParticipantDashboard />
                </PropertyLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/participant"
            element={
              <ProtectedRoute>
                <PropertyLayout>
                  <ParticipantDashboard />
                </PropertyLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/participant/profile"
            element={
              <ProtectedRoute>
                <PropertyLayout>
                  <ParticipantProfile />
                </PropertyLayout>
              </ProtectedRoute>
            }
          />
        </>
      ) : (
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <PropertyLayout>
                <Dashboard />
              </PropertyLayout>
            </ProtectedRoute>
          }
        />
      )}

      {/* Agent Routes with PropertyLayout */}
      {(isAgent || isAdmin) && (
        <>
          <Route
            path="/properties"
            element={
              <ProtectedRoute>
                <PropertyLayout>
                  <Properties />
                </PropertyLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/properties/add"
            element={
              <ProtectedRoute>
                <PropertyLayout>
                  <PropertyFormPage />
                </PropertyLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/properties/:id"
            element={
              <ProtectedRoute>
                <PropertyLayout>
                  <PropertyFormContainer />
                </PropertyLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/properties/global-features"
            element={
              <ProtectedRoute>
                <PropertyLayout>
                  <GlobalFeaturesPage />
                </PropertyLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/properties/webviews"
            element={
              <ProtectedRoute>
                <PropertyLayout>
                  <WebviewsPage />
                </PropertyLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/import"
            element={
              <ProtectedRoute>
                <PropertyLayout>
                  <Import />
                </PropertyLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <PropertyLayout>
                  <Settings />
                </PropertyLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/participants"
            element={
              <ProtectedRoute>
                <PropertyLayout>
                  <Participants />
                </PropertyLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <PropertyLayout>
                  <Users />
                </PropertyLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/employees"
            element={
              <ProtectedRoute>
                <PropertyLayout>
                  <Users />
                </PropertyLayout>
              </ProtectedRoute>
            }
          />
        </>
      )}

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

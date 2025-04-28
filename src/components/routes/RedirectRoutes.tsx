
import React from "react";
import { Route, Navigate, useParams, useSearchParams } from "react-router-dom";

// This component handles the redirect from /property/:id to dashboard with tab=property
function PropertyTabRedirect() {
  const { id } = useParams();
  return <Navigate to={`/?tab=property&propertyId=${id}`} replace />;
}

// This component handles the redirect from /property/:id/dashboard to dashboard with tab=property
function PropertyDashboardRedirect() {
  const { id } = useParams();
  return <Navigate to={`/?tab=property&propertyId=${id}`} replace />;
}

// This component handles the redirect to the default content tab
function PropertyContentRedirect() {
  const { id } = useParams();
  return <Navigate to={`/property/${id}/content/general`} replace />;
}

// This component securely redirects from auth to participant dashboard
function AuthParticipantRedirect() {
  // Remove the dependency on searchParams which might be causing the loop
  // Use a static path instead to prevent any possibility of infinite redirects
  return <Navigate to="/" replace />;
}

export const RedirectRoutes = [
  <Route 
    key="property-redirect"
    path="/property/:id" 
    element={<PropertyTabRedirect />} 
  />,
  
  <Route 
    key="property-dashboard-redirect"
    path="/property/:id/dashboard" 
    element={<PropertyDashboardRedirect />} 
  />,
  
  <Route 
    key="property-content-redirect"
    path="/property/:id/content" 
    element={<PropertyContentRedirect />} 
  />,

  <Route
    key="auth-participant-redirect"
    path="/auth" 
    element={<AuthParticipantRedirect />}
  />
];

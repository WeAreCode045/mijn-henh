
import React from "react";
import { Route, Navigate, useParams, useLocation } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";

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

// This component handles redirects for the home route based on authentication status
function HomeRedirect() {
  const { user, initialized, userRole } = useAuth();
  const location = useLocation();
  
  console.log("HomeRedirect - Current path:", location.pathname);
  console.log("HomeRedirect - Auth state:", { user: !!user, initialized, userRole });
  
  // Only redirect if we're sure about the auth state
  if (initialized) {
    if (!user) {
      console.log("HomeRedirect - No user, redirecting to /auth");
      return <Navigate to="/auth" replace />;
    }
    
    // For participants, redirect to participant dashboard
    if (userRole === 'buyer' || userRole === 'seller') {
      console.log("HomeRedirect - User is participant, redirecting to /participant");
      return <Navigate to="/participant" replace />;
    }
  }
  
  // Don't redirect, let the route render normally
  console.log("HomeRedirect - No redirect needed");
  return null;
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
  />
];

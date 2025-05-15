
import React from "react";
import { Routes } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { AdminRoutes } from "./routes/AdminRoutes";
import { ParticipantRoutes } from "./routes/ParticipantRoutes";
import { AuthRoutes } from "./routes/AuthRoutes";
import { FallbackRoutes } from "./routes/FallbackRoutes";
import { WebViewRoutes } from "./routes/WebViewRoutes";
import { RedirectRoutes } from "./routes/RedirectRoutes";

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
      {AuthRoutes}
      
      {/* Webview Routes - Always available */}
      {WebViewRoutes}
      
      {/* Redirect Routes - Always available */}
      {RedirectRoutes}
      
      {/* Participant Routes */}
      {isParticipant && ParticipantRoutes}
      
      {/* Agent/Admin Routes */}
      {(isAgent || isAdmin) && AdminRoutes}
      
      {/* 404 Route */}
      {FallbackRoutes}
    </Routes>
  );
}

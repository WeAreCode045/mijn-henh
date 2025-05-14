
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
      {/* RedirectRoutes First - These handle redirection logic */}
      {RedirectRoutes}
      
      {/* Auth Routes - Handle login/signup */}
      {AuthRoutes}
      
      {/* Webview Routes - Always available */}
      {WebViewRoutes}
      
      {/* Participant Routes - Only visible to buyers/sellers */}
      {isParticipant && ParticipantRoutes}
      
      {/* Agent/Admin Routes - Only visible to agents/admins */}
      {(isAgent || isAdmin) && AdminRoutes}
      
      {/* 404 Route - Always last */}
      {FallbackRoutes}
    </Routes>
  );
}

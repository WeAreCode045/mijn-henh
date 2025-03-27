
import React from "react";
import { Routes } from "react-router-dom";
import { ProtectedRoutes } from "./routes/ProtectedRoutes";
import { PropertyRoutes } from "./routes/PropertyRoutes";
import { PublicRoutes } from "./routes/PublicRoutes";

export function AppRoutes() {
  return (
    <Routes>
      {/* Public routes (auth, webview) */}
      <PublicRoutes />
      
      {/* Protected routes (dashboard, properties, etc.) */}
      <ProtectedRoutes />
      
      {/* Property-specific routes */}
      <PropertyRoutes />
    </Routes>
  );
}

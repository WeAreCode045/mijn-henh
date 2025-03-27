
import { Routes } from "react-router-dom";
import { AuthRoutes } from "./routes/AuthRoutes";
import { WebViewRoutes } from "./routes/WebViewRoutes";
import { RedirectRoutes } from "./routes/RedirectRoutes";
import { MainRoutes } from "./routes/MainRoutes";
import { FallbackRoutes } from "./routes/FallbackRoutes";

export function AppRoutes() {
  return (
    <Routes>
      {/* Authentication routes */}
      {AuthRoutes}
      
      {/* Public webview routes - accessible without login */}
      {WebViewRoutes}
      
      {/* Redirect routes for property pages */}
      {RedirectRoutes}
      
      {/* Main protected routes */}
      {MainRoutes}
      
      {/* Fallback route for 404 */}
      {FallbackRoutes}
    </Routes>
  );
}

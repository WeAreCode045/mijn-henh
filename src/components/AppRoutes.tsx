
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Index from "@/pages/index";
import Users from "@/pages/Users";
import Properties from "@/pages/Properties";
import Property from "@/pages/Property";
import Settings from "@/pages/Settings";
import SignIn from "@/pages/SignIn";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import PublicRoute from "@/components/PublicRoute";
import PropertyWebView from "@/components/property/webview/PropertyWebView";
import ContactSubmissions from "@/pages/ContactSubmissions";
import Agenda from "@/pages/Agenda";
import ParticipantDashboard from "@/pages/ParticipantDashboard";
import ParticipantProfile from '@/pages/ParticipantProfile';

const router = createBrowserRouter([
  {
    path: "/auth",
    element: (
      <PublicRoute>
        <SignIn />
      </PublicRoute>
    )
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Index />
      </ProtectedRoute>
    )
  },
  {
    path: "/users",
    element: (
      <ProtectedRoute>
        <Users />
      </ProtectedRoute>
    )
  },
  {
    path: "/properties",
    element: (
      <ProtectedRoute>
        <Properties />
      </ProtectedRoute>
    )
  },
  {
    path: "/properties/:propertyId",
    element: (
      <ProtectedRoute>
        <Property />
      </ProtectedRoute>
    )
  },
  {
    path: "/settings",
    element: (
      <ProtectedRoute>
        <Settings />
      </ProtectedRoute>
    )
  },
  {
    path: "/contact-submissions",
    element: (
      <ProtectedRoute>
        <ContactSubmissions />
      </ProtectedRoute>
    )
  },
  {
    path: "/agenda",
    element: (
      <ProtectedRoute>
        <Agenda />
      </ProtectedRoute>
    )
  },
  {
    path: "/webview/:propertyId",
    element: <PropertyWebView />
  },
  {
    path: "/participant",
    element: (
      <ProtectedRoute>
        <ParticipantDashboard />
      </ProtectedRoute>
    )
  },
  {
    path: "/participant/profile",
    element: (
      <ProtectedRoute>
        <ParticipantProfile />
      </ProtectedRoute>
    )
  }
]);

export default router;

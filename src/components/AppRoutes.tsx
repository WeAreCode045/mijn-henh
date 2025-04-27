
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Index from "@/pages/index";
import Users from "@/pages/Users";
import Properties from "@/pages/Properties";
import Settings from "@/pages/Settings";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import ParticipantDashboard from "@/pages/ParticipantDashboard";
import ParticipantProfile from '@/pages/ParticipantProfile';

// Create the router with existing routes only
const router = createBrowserRouter([
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
    path: "/settings",
    element: (
      <ProtectedRoute>
        <Settings />
      </ProtectedRoute>
    )
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

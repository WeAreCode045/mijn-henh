import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from "react-router-dom";
import Index from "@/pages/index";
import Users from "@/pages/Users";
import Properties from "@/pages/Properties";
import Property from "@/pages/Property";
import Settings from "@/pages/Settings";
import SignIn from "@/pages/SignIn";
import ProtectedRoute from "@/components/ProtectedRoute";
import PublicRoute from "@/components/PublicRoute";
import PropertyWebView from "@/components/property/webview/PropertyWebView";
import ContactSubmissions from "@/pages/ContactSubmissions";
import Agenda from "@/pages/Agenda";
import ParticipantDashboard from "@/pages/ParticipantDashboard";
import ParticipantProfile from '@/pages/ParticipantProfile';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route
        path="/auth"
        element={
          <PublicRoute>
            <SignIn />
          </PublicRoute>
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Index />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <Users />
          </ProtectedRoute>
        }
      />
      <Route
        path="/properties"
        element={
          <ProtectedRoute>
            <Properties />
          </ProtectedRoute>
        }
      />
      <Route
        path="/properties/:propertyId"
        element={
          <ProtectedRoute>
            <Property />
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
      <Route
        path="/contact-submissions"
        element={
          <ProtectedRoute>
            <ContactSubmissions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/agenda"
        element={
          <ProtectedRoute>
            <Agenda />
          </ProtectedRoute>
        }
      />
      <Route
        path="/webview/:propertyId"
        element={<PropertyWebView />}
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
  )
);

export default router;


import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Route, Routes, Navigate, useParams } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AuthProvider } from "@/providers/AuthProvider";
import { AppSidebar } from "./components/AppSidebar";
import { useAuth } from "@/providers/AuthProvider";

const Index = lazy(() => import("./pages/Index"));
const Properties = lazy(() => import("./pages/Properties"));
const PropertyFormPage = lazy(() => import("./pages/PropertyFormPage"));
const Settings = lazy(() => import("./pages/Settings"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Auth = lazy(() => import("./pages/Auth"));
const Templates = lazy(() => import("./pages/Templates"));
const PropertyWebView = lazy(() => import("./components/property/PropertyWebView").then(module => ({ default: module.PropertyWebView })));
const Users = lazy(() => import("./pages/Users"));

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-estate-800"></div>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
    },
  },
});

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/auth" />;
  }

  return children;
}

// This component handles the redirect from /edit to /content
function PropertyEditRedirect() {
  const { id } = useParams();
  return <Navigate to={`/property/${id}/content`} replace />;
}

const PropertyLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex w-full">
    <AppSidebar />
    <main className="flex-1 p-4">
      <Suspense fallback={<LoadingSpinner />}>
        {children}
      </Suspense>
    </main>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Router>
          <SidebarProvider>
            <Routes>
              <Route path="/auth" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <Auth />
                </Suspense>
              } />
              
              <Route path="/property/view/:id" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <PropertyWebView />
                </Suspense>
              } />
              
              <Route path="/" element={
                <ProtectedRoute>
                  <PropertyLayout>
                    <Index />
                  </PropertyLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/properties" element={
                <ProtectedRoute>
                  <PropertyLayout>
                    <Properties />
                  </PropertyLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/property/new" element={
                <ProtectedRoute>
                  <PropertyLayout>
                    <PropertyFormPage />
                  </PropertyLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/property/:id/dashboard" element={
                <ProtectedRoute>
                  <PropertyLayout>
                    <PropertyFormPage />
                  </PropertyLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/property/:id/content" element={
                <ProtectedRoute>
                  <PropertyLayout>
                    <PropertyFormPage />
                  </PropertyLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/property/:id/media" element={
                <ProtectedRoute>
                  <PropertyLayout>
                    <PropertyFormPage />
                  </PropertyLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/property/:id/communications" element={
                <ProtectedRoute>
                  <PropertyLayout>
                    <PropertyFormPage />
                  </PropertyLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/property/:id/webview" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <PropertyWebView />
                </Suspense>
              } />
              
              <Route path="/property/:id/edit" element={
                <ProtectedRoute>
                  <PropertyEditRedirect />
                </ProtectedRoute>
              } />
              
              <Route path="/settings" element={
                <ProtectedRoute>
                  <PropertyLayout>
                    <Settings />
                  </PropertyLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/users" element={
                <ProtectedRoute>
                  <PropertyLayout>
                    <Users />
                  </PropertyLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/templates" element={
                <ProtectedRoute>
                  <PropertyLayout>
                    <Templates />
                  </PropertyLayout>
                </ProtectedRoute>
              } />
              
              <Route path="*" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <NotFound />
                </Suspense>
              } />
            </Routes>
          </SidebarProvider>
        </Router>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

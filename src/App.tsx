
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AuthProvider } from "@/providers/AuthProvider";
import { AppSidebar } from "./components/AppSidebar";
import { useAuth } from "@/providers/AuthProvider";

// Lazy load pages
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
      staleTime: 60 * 1000, // Data remains fresh for 1 minute
      retry: 1, // Only retry failed requests once
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

// Layout wrapper for property routes
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
              {/* Auth route */}
              <Route path="/auth" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <Auth />
                </Suspense>
              } />
              
              {/* Public property webview route */}
              <Route path="/property/view/:id" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <PropertyWebView />
                </Suspense>
              } />
              
              {/* Main Dashboard */}
              <Route path="/" element={
                <ProtectedRoute>
                  <PropertyLayout>
                    <Index />
                  </PropertyLayout>
                </ProtectedRoute>
              } />
              
              {/* Properties List */}
              <Route path="/properties" element={
                <ProtectedRoute>
                  <PropertyLayout>
                    <Properties />
                  </PropertyLayout>
                </ProtectedRoute>
              } />
              
              {/* New Property Form */}
              <Route path="/property/new" element={
                <ProtectedRoute>
                  <PropertyLayout>
                    <PropertyFormPage />
                  </PropertyLayout>
                </ProtectedRoute>
              } />
              
              {/* Property Tabs Routes - New URL Structure */}
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
              
              {/* Property WebView - New URL Structure */}
              <Route path="/property/:id/webview" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <PropertyWebView />
                </Suspense>
              } />
              
              {/* Legacy route for backward compatibility */}
              <Route path="/property/:id/edit" element={
                <ProtectedRoute>
                  <Navigate to="/property/:id/dashboard" replace />
                </ProtectedRoute>
              } />
              
              {/* Settings */}
              <Route path="/settings" element={
                <ProtectedRoute>
                  <PropertyLayout>
                    <Settings />
                  </PropertyLayout>
                </ProtectedRoute>
              } />
              
              {/* Users */}
              <Route path="/users" element={
                <ProtectedRoute>
                  <PropertyLayout>
                    <Users />
                  </PropertyLayout>
                </ProtectedRoute>
              } />
              
              {/* Templates */}
              <Route path="/templates" element={
                <ProtectedRoute>
                  <PropertyLayout>
                    <Templates />
                  </PropertyLayout>
                </ProtectedRoute>
              } />
              
              {/* 404 route */}
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

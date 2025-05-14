
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { AuthProvider } from "@/providers/AuthProvider";
import { supabase } from "@/integrations/supabase/client"; 
import { SidebarProvider } from "@/components/ui/sidebar";
import { BrowserRouter } from "react-router-dom";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import AppRoutes from "@/components/AppRoutes";

// Create a QueryClient instance with default options - we're adding more error logging
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
      meta: {
        onError: (error: Error) => {
          console.log("Query error (non-fatal):", error);
        }
      }
    },
    mutations: {
      meta: {
        onError: (error: Error) => {
          console.log('Mutation error (non-fatal):', error);
        }
      }
    }
  },
});

const AppContent = () => {
  // Simple state to ensure we at least show loading for a minimal time
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    console.log("App initializing...");
    // Ensure loading spinner shows for at least 500ms to prevent flash
    const timer = setTimeout(() => {
      setIsReady(true);
      console.log("App ready to render");
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // If not ready, show loading spinner
  if (!isReady) {
    return <LoadingSpinner />;
  }

  // Move BrowserRouter to wrap both AuthProvider and AppRoutes
  return (
    <BrowserRouter>
      <AuthProvider>
        <SidebarProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <AppRoutes />
          </TooltipProvider>
        </SidebarProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SessionContextProvider supabaseClient={supabase}>
      <AppContent />
    </SessionContextProvider>
  </QueryClientProvider>
);

export default App;

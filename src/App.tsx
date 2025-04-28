
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, RouterProvider, createBrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { AuthProvider } from "@/providers/AuthProvider";
import { supabase } from "@/integrations/supabase/client"; 
import { MainRoutes } from "@/components/routes/MainRoutes";
import { RedirectRoutes } from "@/components/routes/RedirectRoutes";
import { FallbackRoutes } from "@/components/routes/FallbackRoutes";

// Create a QueryClient instance with default options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
    },
  },
});

// Create a custom router that includes all routes from different sources
const router = createBrowserRouter([
  ...MainRoutes,
  ...RedirectRoutes,
  ...FallbackRoutes
]);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SessionContextProvider supabaseClient={supabase}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <RouterProvider router={router} />
        </TooltipProvider>
      </AuthProvider>
    </SessionContextProvider>
  </QueryClientProvider>
);

export default App;

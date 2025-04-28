
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { AuthProvider } from "@/providers/AuthProvider";
import { supabase } from "@/integrations/supabase/client"; 
import { SidebarProvider } from "@/components/ui/sidebar";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
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

// Create a custom router that includes all routes
// Convert the JSX route elements to route objects that createBrowserRouter expects
const router = createBrowserRouter([
  ...MainRoutes.map(route => ({
    path: route.props.path,
    element: route.props.element
  })),
  ...RedirectRoutes.map(route => ({
    path: route.props.path,
    element: route.props.element
  })),
  ...FallbackRoutes.map(route => ({
    path: route.props.path,
    element: route.props.element
  }))
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

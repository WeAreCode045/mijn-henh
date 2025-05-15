
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { AuthProvider } from "@/providers/AuthProvider";
import { supabase } from "@/integrations/supabase/client"; 
import { SidebarProvider } from "@/components/ui/sidebar";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "@/components/AppRoutes";

// Add error boundary component for better error handling
const ErrorFallback = () => (
  <div className="min-h-screen flex items-center justify-center flex-col p-4">
    <h2 className="text-xl font-semibold mb-4">Something went wrong</h2>
    <p className="mb-4">The application encountered an error. Please try refreshing the page.</p>
    <button 
      onClick={() => window.location.reload()} 
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      Refresh Page
    </button>
  </div>
);

// Create a QueryClient instance with default options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
    },
    mutations: {
      // Add proper error handling in the mutations options
      onError: (error) => {
        console.error('Mutation error:', error);
      }
    }
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SessionContextProvider supabaseClient={supabase}>
      <AuthProvider>
        <SidebarProvider>
          <BrowserRouter>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <AppRoutes />
            </TooltipProvider>
          </BrowserRouter>
        </SidebarProvider>
      </AuthProvider>
    </SessionContextProvider>
  </QueryClientProvider>
);

export default App;

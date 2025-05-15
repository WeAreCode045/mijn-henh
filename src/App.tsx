
import { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from './providers/AuthProvider';
import AppRoutes from './components/AppRoutes';
import { debugEnvironmentVariables } from './utils/envDebugger';
import './App.css';

const App = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Create a client with proper error handling
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        meta: {
          onError: (error: Error) => {
            console.error("Query error:", error);
          }
        }
      }
    }
  });
  
  useEffect(() => {
    console.log("App initializing...");
    
    // Debug environment variables during initialization
    const envStatus = debugEnvironmentVariables();
    console.log("Environment status checked:", !!envStatus);
    
    setIsLoaded(true);
  }, []);

  // Early return with error message if critical env vars are missing
  if (import.meta.env.DEV && (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-red-50 text-red-800">
        <h1 className="text-2xl font-bold mb-4">Environment Error</h1>
        <p className="mb-4 text-center">
          Missing Supabase environment variables. Please ensure you have properly set up:
        </p>
        <ul className="list-disc pl-8 mb-4">
          <li>VITE_SUPABASE_URL</li>
          <li>VITE_SUPABASE_ANON_KEY</li>
        </ul>
        <p className="text-sm text-gray-700 mt-4">
          These should be defined in your .env file or environment variables.
        </p>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
          <Toaster />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;

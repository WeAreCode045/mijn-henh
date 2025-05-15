
import { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from './providers/AuthProvider';
import AppRoutes from './components/AppRoutes';
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
    setIsLoaded(true);
  }, []);

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

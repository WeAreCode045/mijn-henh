
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { 
  getSupabaseClient, 
  syncSupabaseClients 
} from "@/integrations/supabase/clientManager";
import { AlertCircle, CheckCircle } from "lucide-react";

export default function Auth() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [clientStatus, setClientStatus] = useState<'checking' | 'available' | 'backup' | 'unavailable'>('checking');
  const { toast } = useToast();
  const navigate = useNavigate();
  const { session, isUsingBackupClient } = useAuth();
  
  useEffect(() => {
    // Check client availability
    const checkClient = async () => {
      try {
        setClientStatus('checking');
        const client = await getSupabaseClient();
        
        if (!client) {
          setClientStatus('unavailable');
          return;
        }
        
        setClientStatus(isUsingBackupClient ? 'backup' : 'available');
      } catch (error) {
        console.error("Error checking client:", error);
        setClientStatus('unavailable');
      }
    };
    
    checkClient();
    
    // Check periodically
    const interval = setInterval(checkClient, 10000);
    return () => clearInterval(interval);
  }, [isUsingBackupClient]);
  
  // Redirect if already logged in
  useEffect(() => {
    if (session) {
      console.log("User already authenticated, redirecting to index page");
      navigate('/');
    }
  }, [session, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Get the best available client
      const client = await getSupabaseClient();
      
      if (!client || !client.auth) {
        throw new Error("No Supabase auth client available");
      }

      if (isSignUp) {
        console.log("Attempting sign up with email:", email);
        const { data, error } = await client.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });
        
        if (error) throw error;
        
        // Sync the session to all clients
        await syncSupabaseClients();
        
        toast({
          title: "Success",
          description: "Please check your email to confirm your account",
        });
        console.log("Sign up successful:", data);
      } else {
        console.log("Attempting sign in with email:", email);
        const { data, error } = await client.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        // Sync the session to all clients
        await syncSupabaseClients();
        
        toast({
          title: "Success",
          description: "Successfully logged in",
        });
        
        console.log("Login successful, navigating to index page");
        navigate('/');
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      toast({
        title: "Error",
        description: error.message || "Authentication failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Development helper function (only uncomment during development)
  /*
  const handleDevLogin = async () => {
    setIsLoading(true);
    try {
      const client = await getSupabaseClient();
      if (!client || !client.auth) {
        throw new Error("No Supabase auth client available");
      }
      
      const { data, error } = await client.auth.signInWithPassword({
        email: "maurice@devtig-online.nl",
        password: "your-dev-password-here", // Use a real password
      });
      
      if (error) throw error;
      
      await syncSupabaseClients();
      navigate('/');
    } catch (error: any) {
      console.error("Dev login error:", error);
      toast({
        title: "Dev Login Failed",
        description: error.message || "Authentication failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  */

  return (
    <div className="min-h-screen flex items-center justify-center bg-estate-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isSignUp ? "Create Account" : "Sign In"}</CardTitle>
          <div className="flex items-center gap-2 text-sm mt-2">
            {clientStatus === 'checking' && (
              <div className="flex items-center text-amber-500">
                <AlertCircle className="h-4 w-4 mr-1" />
                Checking connection...
              </div>
            )}
            {clientStatus === 'available' && (
              <div className="flex items-center text-green-500">
                <CheckCircle className="h-4 w-4 mr-1" />
                Connected to main server
              </div>
            )}
            {clientStatus === 'backup' && (
              <div className="flex items-center text-amber-500">
                <AlertCircle className="h-4 w-4 mr-1" />
                Using backup connection
              </div>
            )}
            {clientStatus === 'unavailable' && (
              <div className="flex items-center text-red-500">
                <AlertCircle className="h-4 w-4 mr-1" />
                No connection available
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || clientStatus === 'unavailable'}
            >
              {isLoading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? "Already have an account? Sign In" : "Need an account? Sign Up"}
            </Button>
            
            {/* Development helper button - only uncomment during development
            <Button
              type="button"
              variant="outline"
              className="w-full mt-4"
              onClick={handleDevLogin}
              disabled={isLoading || clientStatus === 'unavailable'}
            >
              Dev Login (maurice@devtig-online.nl)
            </Button>
            */}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

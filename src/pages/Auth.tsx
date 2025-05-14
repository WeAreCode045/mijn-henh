
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";

// Helper function to clean up auth state
const cleanupAuthState = () => {
  // Remove standard auth tokens
  localStorage.removeItem('supabase.auth.token');
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  // Remove from sessionStorage if in use
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
};

export default function Auth() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, initialized } = useAuth();
  
  // Debug auth state
  console.log("Auth page: Auth state:", { user, initialized });

  // Redirect if already authenticated
  useEffect(() => {
    if (initialized && user) {
      console.log("Auth page: User already authenticated, redirecting to /");
      navigate('/', { replace: true });
    }
  }, [user, initialized, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Clean up any existing auth state first
      cleanupAuthState();
      
      // Attempt global sign out to ensure clean slate
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        console.error("Error during pre-auth logout:", err);
        // Continue even if this fails
      }

      const names = fullName.trim().split(' ');
      const firstName = names[0] || '';
      const lastName = names.slice(1).join(' ') || '';
      
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              first_name: firstName,
              last_name: lastName
            },
          },
        });
        
        if (error) throw error;
        
        if (data.user) {
          // Create the employer profile explicitly
          const { error: profileError } = await supabase
            .from('employer_profiles')
            .insert({
              id: data.user.id,
              email: email,
              first_name: firstName,
              last_name: lastName
            });
            
          if (profileError) {
            console.error("Error creating profile:", profileError);
          }
        }
        
        toast({
          title: "Success",
          description: "Please check your email to confirm your account",
        });
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        // Navigate to dashboard on successful login
        if (data.session) {
          toast({
            title: "Success",
            description: "Logged in successfully",
          });
          
          // Use replace to prevent back navigation to login page
          navigate('/', { replace: true });
        }
      }
    } catch (error) {
      // Use type assertion with a more specific error type
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-estate-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isSignUp ? "Create Account" : "Sign In"}</CardTitle>
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
            <Button type="submit" className="w-full" disabled={isLoading}>
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
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

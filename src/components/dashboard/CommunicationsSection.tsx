
import { useState, useEffect } from "react";
import { CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Submission {
  id: string;
  created_at: string;
  property_id: string;
  property: {
    title: string;
  };
  name: string;
  email: string;
  message: string;
  read: boolean;
}

export function CommunicationsSection() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const { data, error } = await supabase
          .from('property_contact_submissions')
          .select(`
            id,
            created_at,
            property_id,
            property:property_id (title),
            name,
            email,
            message,
            is_read as read
          `)
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) throw error;
        setSubmissions(data || []);
      } catch (error: any) {
        console.error('Error fetching submissions:', error);
        toast({
          title: "Error",
          description: "Failed to load submissions",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubmissions();
  }, [toast]);

  return (
    <CardContent>
      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : submissions.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-muted-foreground">
          No communications found
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map(submission => (
            <div 
              key={submission.id}
              className={`p-4 border rounded-lg ${submission.read ? 'bg-background' : 'bg-accent'}`}
            >
              <div className="flex justify-between mb-2">
                <h3 className="font-medium">{submission.name}</h3>
                <span className="text-sm text-muted-foreground">
                  {new Date(submission.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm mb-2 line-clamp-2">{submission.message}</p>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{submission.email}</span>
                <span>Property: {submission.property?.title || 'Unknown'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </CardContent>
  );
}

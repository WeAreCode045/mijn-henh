
import { CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Submission } from "@/types/submission";

interface CommunicationsTabContentProps {
  propertyId: string;
}

export function CommunicationsTabContent({ propertyId }: CommunicationsTabContentProps) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!propertyId) return;
      
      setIsLoading(true);
      console.log("CommunicationsTabContent - Fetching submissions for property:", propertyId);
      
      try {
        const { data, error } = await supabase
          .from('property_contact_submissions')
          .select('*')
          .eq('property_id', propertyId)
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error("Error fetching property submissions:", error);
          return;
        }
        
        if (data) {
          console.log(`CommunicationsTabContent - Loaded ${data.length} submissions`);
          const formattedSubmissions: Submission[] = data.map(item => ({
            id: item.id,
            property_id: item.property_id,
            name: item.name,
            email: item.email,
            phone: item.phone,
            message: item.message || "",
            inquiry_type: item.inquiry_type,
            is_read: !!item.is_read,
            created_at: item.created_at,
            updated_at: item.updated_at,
            agent_id: item.agent_id,
          }));
          
          setSubmissions(formattedSubmissions);
        }
      } catch (error) {
        console.error("Error loading submissions:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSubmissions();
  }, [propertyId]);

  return (
    <CardContent className="p-6">
      <h2 className="text-2xl font-bold mb-6">Communications</h2>
      
      {isLoading ? (
        <div className="py-8 text-center">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-estate-600 rounded-full" role="status" aria-label="loading">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : submissions.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-gray-500">No communications found for this property</p>
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map(submission => (
            <div key={submission.id} className={`p-4 border rounded-md ${submission.is_read ? 'bg-white' : 'bg-blue-50'}`}>
              <div className="flex justify-between">
                <h3 className="font-semibold">{submission.name}</h3>
                <span className="text-sm text-gray-500">
                  {new Date(submission.created_at).toLocaleString()}
                </span>
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {submission.email} • {submission.phone}
              </div>
              <div className="mt-2">
                <span className="inline-block px-2 py-1 text-xs bg-gray-100 rounded">
                  {submission.inquiry_type}
                </span>
              </div>
              <p className="mt-2 text-gray-700">{submission.message}</p>
            </div>
          ))}
        </div>
      )}
    </CardContent>
  );
}

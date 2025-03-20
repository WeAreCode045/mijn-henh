
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Submission } from "@/types/submission";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface SubmissionsCardProps {
  propertyId: string;
}

export function SubmissionsCard({ propertyId }: SubmissionsCardProps) {
  const navigate = useNavigate();
  
  const { data: submissions, isLoading } = useQuery<Submission[]>({
    queryKey: ["property-submissions", propertyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("property_contact_submissions")
        .select("*")
        .eq("property_id", propertyId)
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      return data || [];
    },
  });

  const goToCommunications = () => {
    navigate(`/property/${propertyId}/communications`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Submissions</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-sm text-gray-500 animate-pulse">Loading submissions...</div>
        ) : submissions && submissions.length > 0 ? (
          <div className="space-y-3">
            {submissions.map((submission) => (
              <div 
                key={submission.id}
                className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer"
                onClick={goToCommunications}
              >
                <div className="flex justify-between items-center">
                  <div className="font-medium">{submission.name}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(submission.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-sm text-gray-500 mt-1">{submission.inquiry_type}</div>
                <div className="text-sm truncate mt-1">{submission.message}</div>
              </div>
            ))}
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-2"
              onClick={goToCommunications}
            >
              View All Submissions
            </Button>
          </div>
        ) : (
          <div className="text-sm text-gray-500 italic">
            No submissions received yet.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

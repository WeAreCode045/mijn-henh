
import React, { useState, useEffect } from "react";
import { PropertyData } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSubmissions } from "../communications/useSubmissions";
import { Submission } from "../communications/types";
import { SubmissionsList } from "../communications/SubmissionsList";
import { SubmissionDetail } from "../communications/SubmissionDetail";

interface CommunicationsTabContentProps {
  property: PropertyData;
}

export function CommunicationsTabContent({ property }: CommunicationsTabContentProps) {
  const { submissions, loading, error, fetchSubmissions } = useSubmissions(property.id);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  // Fetch submissions when component mounts or property changes
  useEffect(() => {
    fetchSubmissions();
  }, [property.id]);

  // Handle selecting a submission
  const handleSelectSubmission = (submission: Submission) => {
    setSelectedSubmission(submission);
  };

  const handleBackToList = () => {
    setSelectedSubmission(null);
    // Refresh submissions in case they were updated
    fetchSubmissions();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Communications</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-sm text-muted-foreground">Loading submissions...</p>
            </div>
          ) : error ? (
            <div className="py-8 text-center">
              <p className="text-red-500">{error}</p>
            </div>
          ) : (
            <div>
              {selectedSubmission ? (
                <SubmissionDetail 
                  submission={selectedSubmission} 
                  onBack={handleBackToList}
                />
              ) : (
                <SubmissionsList 
                  submissions={submissions} 
                  onSelectSubmission={handleSelectSubmission}
                  selectedSubmission={selectedSubmission}
                />
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

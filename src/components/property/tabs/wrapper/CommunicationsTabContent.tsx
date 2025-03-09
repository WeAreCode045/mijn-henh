
import { useState, useEffect } from "react";
import { PropertyTabProps } from "./types/PropertyTabTypes";
import { useSubmissions } from "../communications/useSubmissions";
import { SubmissionsList } from "../communications/SubmissionsList";
import { SubmissionDetail } from "../communications/SubmissionDetail";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";
import { Submission } from "../communications/types";

interface CommunicationsTabContentProps {
  property: PropertyTabProps["property"];
}

export function CommunicationsTabContent({ property }: CommunicationsTabContentProps) {
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  
  const {
    submissions,
    isLoading,
    refreshSubmissions,
    handleMarkAsRead,
    handleSendResponse,
    isSending
  } = useSubmissions(property.id);

  useEffect(() => {
    refreshSubmissions();
  }, [refreshSubmissions]);

  const handleSubmissionClick = (submission: Submission) => {
    setSelectedSubmission(submission);
    
    // Mark as read when selected
    if (submission && !submission.is_read) {
      handleMarkAsRead(submission.id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Communications</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={refreshSubmissions}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Submissions</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <SubmissionsList 
                submissions={submissions} 
                isLoading={isLoading}
                selectedSubmission={selectedSubmission} 
                onSubmissionClick={handleSubmissionClick}
              />
            </CardContent>
          </Card>
        </div>
        
        <div className="col-span-1 md:col-span-2">
          {selectedSubmission ? (
            <SubmissionDetail 
              submission={selectedSubmission}
              onSendResponse={handleSendResponse}
              isSending={isSending}
            />
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">Select a submission to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}


import React, { useState, useEffect } from "react";
import { PropertyData, PropertyAgent } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSubmissions } from "../communications/useSubmissions";
import { Submission } from "../communications/types";
import { SubmissionsList } from "../communications/SubmissionsList";
import { SubmissionDetail } from "../communications/SubmissionDetail";

interface CommunicationsTabContentProps {
  property: PropertyData;
}

// Create a combined type that satisfies both interfaces
interface CombinedSubmission {
  id: string;
  property_id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
  updated_at: string;
  is_read: boolean;
  propertyId?: string;
  inquiryType?: string;
  createdAt?: string;
  isRead?: boolean;
  property?: PropertyData;
  inquiry_type?: string;
  replies?: any[];
}

export function CommunicationsTabContent({ property }: CommunicationsTabContentProps) {
  const { submissions, loading, error, fetchSubmissions } = useSubmissions(property.id);
  const [selectedSubmission, setSelectedSubmission] = useState<CombinedSubmission | null>(null);

  // Function to normalize submissions to the expected format
  const normalizeSubmissions = (subs: any[]): CombinedSubmission[] => {
    return subs.map(sub => ({
      ...sub,
      propertyId: sub.property_id,
      inquiryType: sub.inquiry_type || "contact",
      createdAt: sub.created_at,
      isRead: sub.is_read,
      property: property,
      replies: sub.replies || []
    }));
  };

  // Fetch submissions when component mounts or property changes
  useEffect(() => {
    fetchSubmissions();
  }, [property.id]);

  // Handle selecting a submission
  const handleSelectSubmission = (submission: CombinedSubmission) => {
    setSelectedSubmission(submission);
  };

  const handleBackToList = () => {
    setSelectedSubmission(null);
  };

  // Convert submissions to the expected format
  const normalizedSubmissions = normalizeSubmissions(submissions);

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
                  submission={selectedSubmission as any} 
                  onBack={handleBackToList}
                />
              ) : (
                <SubmissionsList 
                  submissions={normalizedSubmissions as any[]} 
                  onSelectSubmission={handleSelectSubmission}
                />
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

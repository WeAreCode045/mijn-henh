
import React from "react";
import { SubmissionItem } from "./SubmissionItem";
import { Submission } from "./types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";

export interface SubmissionsListProps {
  submissions: Submission[];
  isLoading: boolean;
  selectedSubmission: Submission | null;
  onSubmissionClick: (submission: Submission) => void;
}

export function SubmissionsList({
  submissions,
  isLoading,
  selectedSubmission,
  onSubmissionClick
}: SubmissionsListProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Inquiries ({submissions.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : submissions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <MessageCircle className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No inquiries yet</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
            {submissions.map(submission => (
              <SubmissionItem
                key={submission.id}
                submission={submission}
                isSelected={selectedSubmission?.id === submission.id}
                onClick={() => onSubmissionClick(submission)}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}


import { Submission } from "./useSubmissions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SubmissionItem } from "./SubmissionItem";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SubmissionsListProps {
  submissions: Submission[];
  isLoading: boolean;
  selectedSubmission: Submission | null;
  onSubmissionSelect: (submission: Submission) => void;
  onMarkAsRead: (id: string) => void;
}

export function SubmissionsList({
  submissions,
  isLoading,
  selectedSubmission,
  onSubmissionSelect,
  onMarkAsRead
}: SubmissionsListProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-6">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[calc(100vh-280px)]">
      <CardHeader>
        <CardTitle>Messages ({submissions.length})</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-350px)]">
          {submissions.length === 0 ? (
            <p className="text-center py-6 text-muted-foreground">No messages yet</p>
          ) : (
            <div className="divide-y">
              {submissions.map((submission) => (
                <SubmissionItem 
                  key={submission.id} 
                  submission={submission} 
                  isSelected={selectedSubmission?.id === submission.id} 
                  onClick={() => onSubmissionSelect(submission)} 
                  onMarkAsRead={onMarkAsRead}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

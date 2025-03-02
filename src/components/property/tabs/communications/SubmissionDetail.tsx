
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SubmissionResponse } from "./SubmissionResponse";

type Submission = {
  id: string;
  name: string;
  email: string;
  phone: string;
  inquiry_type: string;
  message: string;
  created_at: string;
  is_read: boolean;
  response?: string;
  response_date?: string;
};

interface SubmissionDetailProps {
  submission: Submission | null;
  onMarkAsRead: (id: string) => void;
  onSendResponse: (responseText: string) => Promise<void>;
}

export function SubmissionDetail({ submission, onMarkAsRead, onSendResponse }: SubmissionDetailProps) {
  if (!submission) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8 border rounded-lg">
        <p className="text-center">Select a submission to view details and respond</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{submission.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <SubmissionResponse 
          submission={submission} 
          onMarkAsRead={onMarkAsRead} 
          onSendResponse={onSendResponse} 
        />
      </CardContent>
    </Card>
  );
}

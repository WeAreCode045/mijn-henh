
import { format } from "date-fns";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Phone } from "lucide-react";
import { SubmissionReplyForm } from "./SubmissionReplyForm";
import { SubmissionReplies } from "./SubmissionReplies";
import { useState } from "react";

export interface SubmissionDetailProps {
  submission: {
    id: string;
    name: string;
    email: string;
    phone: string;
    inquiry_type: string;
    message: string;
    created_at: string;
    is_read: boolean;
  };
}

export function SubmissionDetail({ submission }: SubmissionDetailProps) {
  const [refreshCounter, setRefreshCounter] = useState(0);
  
  // Format the date
  const formattedDate = format(new Date(submission.created_at), "PPP 'at' p");
  
  // Handler when a reply is sent successfully
  const handleReplySent = () => {
    setRefreshCounter(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{submission.name}</CardTitle>
              <CardDescription>{formattedDate}</CardDescription>
            </div>
            <Badge variant="outline">{submission.inquiry_type}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <a href={`mailto:${submission.email}`} className="text-sm hover:underline">
                {submission.email}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <a href={`tel:${submission.phone}`} className="text-sm hover:underline">
                {submission.phone}
              </a>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <p className="text-sm whitespace-pre-wrap">{submission.message}</p>
          </div>
        </CardContent>
      </Card>
      
      {/* Display existing replies */}
      <SubmissionReplies submissionId={submission.id} key={`replies-${refreshCounter}`} />
      
      {/* Reply form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Send a Reply</CardTitle>
          <CardDescription>Your reply will be sent by email to the inquirer</CardDescription>
        </CardHeader>
        <CardContent>
          <SubmissionReplyForm 
            submissionId={submission.id} 
            onReplySent={handleReplySent} 
          />
        </CardContent>
      </Card>
    </div>
  );
}

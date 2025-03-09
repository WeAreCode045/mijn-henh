
import { format } from "date-fns";
import { Mail, Phone, Calendar, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Submission } from "./useSubmissions";
import { SubmissionReplies } from "./SubmissionReplies";
import { SubmissionResponse } from "./SubmissionResponse";
import { Badge } from "@/components/ui/badge";

interface SubmissionDetailProps {
  submission: Submission;
  onSendResponse: (responseText: string) => Promise<void>;
  isSending: boolean;
}

export function SubmissionDetail({
  submission,
  onSendResponse,
  isSending
}: SubmissionDetailProps) {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM d, yyyy 'at' h:mm a");
  };

  const getInquiryTypeLabel = (type: string) => {
    switch (type) {
      case "viewing":
        return "Viewing Request";
      case "information":
        return "Information Request";
      case "offer":
        return "Offer";
      default:
        return type;
    }
  };

  const getInquiryTypeColor = (type: string) => {
    switch (type) {
      case "viewing":
        return "bg-blue-100 text-blue-800";
      case "information":
        return "bg-green-100 text-green-800";
      case "offer":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl">{submission.name}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Regarding: {submission.property.title}
              </p>
            </div>
            <Badge className={getInquiryTypeColor(submission.inquiry_type)}>
              {getInquiryTypeLabel(submission.inquiry_type)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a
                  href={`mailto:${submission.email}`}
                  className="text-sm hover:underline"
                >
                  {submission.email}
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a
                  href={`tel:${submission.phone}`}
                  className="text-sm hover:underline"
                >
                  {submission.phone}
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                Received on {formatDate(submission.created_at)}
              </span>
            </div>

            <div className="pt-4 border-t">
              <h3 className="text-sm font-medium flex items-center mb-2">
                <Info className="h-4 w-4 mr-2" />
                Message
              </h3>
              <p className="text-sm bg-gray-50 p-4 rounded-md">
                {submission.message}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Replies section */}
      {submission.replies && submission.replies.length > 0 && (
        <SubmissionReplies replies={submission.replies} />
      )}

      {/* Reply form */}
      <SubmissionResponse
        onSendResponse={onSendResponse}
        isSending={isSending}
      />
    </div>
  );
}

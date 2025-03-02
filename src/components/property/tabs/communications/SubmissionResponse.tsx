
import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { CheckCircle, Send } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";

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

interface SubmissionResponseProps {
  submission: Submission;
  onMarkAsRead: (id: string) => void;
  onSendResponse: (responseText: string) => Promise<void>;
}

export function SubmissionResponse({ submission, onMarkAsRead, onSendResponse }: SubmissionResponseProps) {
  const [responseText, setResponseText] = useState("");
  const [isSending, setIsSending] = useState(false);

  const getInquiryTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      'information': 'Meer informatie',
      'viewing': 'Bezichtiging',
      'offer': 'Bod'
    };
    return types[type] || type;
  };

  const handleSendResponse = async () => {
    if (!responseText.trim()) return;
    
    setIsSending(true);
    try {
      await onSendResponse(responseText);
      setResponseText("");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div className="flex flex-col text-sm">
          <div className="text-gray-600">
            <span className="font-medium">Type:</span> {getInquiryTypeLabel(submission.inquiry_type)}
          </div>
          <div className="text-gray-600">
            <span className="font-medium">Email:</span>{" "}
            <a href={`mailto:${submission.email}`} className="text-blue-600 hover:underline">
              {submission.email}
            </a>
          </div>
          <div className="text-gray-600">
            <span className="font-medium">Phone:</span>{" "}
            <a href={`tel:${submission.phone}`} className="text-blue-600 hover:underline">
              {submission.phone}
            </a>
          </div>
          <div className="text-gray-600">
            <span className="font-medium">Date:</span>{" "}
            {format(new Date(submission.created_at), 'dd MMMM yyyy, HH:mm')}
          </div>
        </div>
        {!submission.is_read && (
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => onMarkAsRead(submission.id)}
          >
            <CheckCircle className="h-4 w-4" />
            <span>Mark as read</span>
          </Button>
        )}
      </div>

      {submission.message && (
        <div>
          <h3 className="text-sm font-medium mb-2">Message from client:</h3>
          <div className="bg-gray-50 p-4 rounded-lg border">{submission.message}</div>
        </div>
      )}

      {submission.response && (
        <div>
          <h3 className="text-sm font-medium mb-2">Your response:</h3>
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <p className="whitespace-pre-wrap">{submission.response}</p>
            {submission.response_date && (
              <p className="text-xs text-gray-500 mt-2">
                Sent on {format(new Date(submission.response_date), 'dd MMMM yyyy, HH:mm')}
              </p>
            )}
          </div>
        </div>
      )}

      {!submission.response && (
        <div>
          <h3 className="text-sm font-medium mb-2">Send a response:</h3>
          <Textarea
            placeholder="Type your response here..."
            value={responseText}
            onChange={(e) => setResponseText(e.target.value)}
            className="mb-2"
            rows={6}
          />
          <Button 
            onClick={handleSendResponse} 
            disabled={!responseText.trim() || isSending}
            className="flex items-center gap-2"
          >
            {isSending ? (
              <>
                <Spinner className="h-4 w-4" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>Send Response</span>
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

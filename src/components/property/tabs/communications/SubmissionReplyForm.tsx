
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";

interface SubmissionReplyFormProps {
  onSendResponse: (responseText: string) => Promise<void>;
}

export function SubmissionReplyForm({ onSendResponse }: SubmissionReplyFormProps) {
  const [replyText, setReplyText] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!replyText.trim()) return;
    
    setIsSending(true);
    try {
      await onSendResponse(replyText);
      setReplyText(""); // Clear the text area after successful send
    } catch (error) {
      console.error("Error sending response:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="space-y-2">
        <Textarea
          placeholder="Write your reply here..."
          className="min-h-[120px] resize-y"
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          disabled={isSending}
        />
        <Button 
          type="submit" 
          className="w-full" 
          disabled={!replyText.trim() || isSending}
        >
          {isSending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Send Reply
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

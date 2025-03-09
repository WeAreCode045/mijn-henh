
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

interface SubmissionReplyFormProps {
  onSend: (replyText: string) => Promise<void>;
  isSubmitting: boolean;
}

export function SubmissionReplyForm({ onSend, isSubmitting }: SubmissionReplyFormProps) {
  const [replyText, setReplyText] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    
    try {
      await onSend(replyText);
      setReplyText(""); // Clear on success
    } catch (error) {
      console.error("Error sending reply:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
        placeholder="Type your reply here..."
        className="min-h-[120px]"
        disabled={isSubmitting}
      />
      
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={!replyText.trim() || isSubmitting}
          className="flex items-center gap-2"
        >
          <Send className="h-4 w-4" />
          {isSubmitting ? "Sending..." : "Send Reply"}
        </Button>
      </div>
    </form>
  );
}


import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

export interface SubmissionReplyFormProps {
  onSendResponse: (text: string) => Promise<void>;
  isSending: boolean;
}

export function SubmissionReplyForm({
  onSendResponse,
  isSending
}: SubmissionReplyFormProps) {
  const [responseText, setResponseText] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!responseText.trim()) return;
    
    try {
      await onSendResponse(responseText);
      setResponseText("");
    } catch (error) {
      console.error("Error sending response:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        placeholder="Type your response..."
        value={responseText}
        onChange={(e) => setResponseText(e.target.value)}
        className="min-h-24"
        required
      />
      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={isSending || !responseText.trim()}
          className="flex items-center"
        >
          <Send className="h-4 w-4 mr-2" />
          {isSending ? "Sending..." : "Send Response"}
        </Button>
      </div>
    </form>
  );
}

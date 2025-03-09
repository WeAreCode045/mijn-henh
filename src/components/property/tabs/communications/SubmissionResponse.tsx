
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

interface SubmissionResponseProps {
  onSendResponse: (responseText: string) => Promise<void>;
  isSending: boolean;
}

export function SubmissionResponse({ 
  onSendResponse,
  isSending
}: SubmissionResponseProps) {
  const [responseText, setResponseText] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!responseText.trim()) return;
    
    await onSendResponse(responseText);
    setResponseText("");
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="text-lg">Send Response</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Type your response here..."
            value={responseText}
            onChange={(e) => setResponseText(e.target.value)}
            rows={4}
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            type="submit" 
            disabled={!responseText.trim() || isSending}
          >
            {isSending ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Response
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

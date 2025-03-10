
import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

export interface SubmissionResponseProps {
  responseText: string;
  setResponseText: React.Dispatch<React.SetStateAction<string>>;
  isSending: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export function SubmissionResponse({ 
  responseText, 
  setResponseText, 
  isSending, 
  onSubmit 
}: SubmissionResponseProps) {
  return (
    <form onSubmit={onSubmit} className="w-full">
      <div className="space-y-4 w-full">
        <Textarea
          placeholder="Type your response here..."
          value={responseText}
          onChange={(e) => setResponseText(e.target.value)}
          className="min-h-[120px] w-full"
          disabled={isSending}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={isSending || !responseText.trim()}>
            {isSending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Response"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}

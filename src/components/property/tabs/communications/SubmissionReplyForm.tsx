
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, SendHorizonal } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/providers/AuthProvider";

interface SubmissionReplyFormProps {
  submissionId: string;
  onReplySent: () => void;
}

export function SubmissionReplyForm({ submissionId, onReplySent }: SubmissionReplyFormProps) {
  const [replyText, setReplyText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  const { profile } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!replyText.trim()) {
      toast({
        title: "Error",
        description: "Please enter a reply",
        variant: "destructive",
      });
      return;
    }
    
    setIsSending(true);
    
    try {
      // First save the reply to the database
      const { error } = await supabase
        .from('property_submission_replies')
        .insert({
          submission_id: submissionId,
          agent_id: profile.id,
          reply_text: replyText
        });
      
      if (error) throw error;
      
      // Call the edge function to send the reply via email
      const { error: functionError } = await supabase.functions.invoke('send-submission-reply', {
        body: {
          submissionId,
          replyText,
          agentId: profile.id
        }
      });
      
      if (functionError) throw functionError;
      
      toast({
        title: "Success",
        description: "Reply sent successfully",
      });
      
      // Clear the form
      setReplyText("");
      
      // Notify parent to refresh
      onReplySent();
      
    } catch (error) {
      console.error("Error sending reply:", error);
      toast({
        title: "Error",
        description: "Failed to send reply",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      <Textarea
        placeholder="Write your reply here..."
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
        rows={4}
        className="resize-none"
      />
      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={isSending || !replyText.trim()}
          className="flex items-center gap-2"
        >
          {isSending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <SendHorizonal className="h-4 w-4" />
              Send Reply
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

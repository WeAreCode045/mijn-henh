
import { useState, useEffect } from "react";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Reply, Archive, AlertCircle, Trash2, X } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";

interface PropertyTitle {
  title: string;
}

interface Submission {
  id: string;
  created_at: string;
  property_id: string;
  property: PropertyTitle; // Single object with title
  name: string;
  email: string;
  message: string;
  is_read: boolean;
}

interface ReplyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (message: string) => Promise<void>;
  isSending: boolean;
}

function ReplyDialog({ isOpen, onClose, onSave, isSending }: ReplyDialogProps) {
  const [message, setMessage] = useState("");
  
  const handleSend = async () => {
    if (message.trim()) {
      await onSave(message);
      setMessage("");
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reply to Inquiry</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your reply here..."
            rows={6}
          />
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSend} disabled={!message.trim() || isSending}>
            {isSending ? "Sending..." : "Send Reply"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isProcessing: boolean;
  title: string;
  message: string;
}

function ConfirmDialog({ isOpen, onClose, onConfirm, isProcessing, title, message }: ConfirmDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>{message}</p>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            type="button" 
            variant="destructive" 
            onClick={onConfirm} 
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function CommunicationsSection() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { user, profile } = useAuth();

  const fetchSubmissions = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('property_contact_submissions')
        .select(`
          id,
          created_at,
          property_id,
          property:properties(title),
          name,
          email,
          message,
          is_read
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      
      // Transform the data to match the Submission type
      const formattedData = data?.map(item => {
        // Ensure property is correctly handled as a single object
        let propertyData: PropertyTitle = { title: 'Unknown' };
        
        // Check if property exists and has the expected structure
        if (item.property && typeof item.property === 'object') {
          // If it's a single object directly
          if ('title' in item.property) {
            propertyData = { title: item.property.title || 'Unknown' };
          } 
          // If it's potentially an array with one item (from the join)
          else if (Array.isArray(item.property) && item.property.length > 0 && 'title' in item.property[0]) {
            propertyData = { title: item.property[0].title || 'Unknown' };
          }
        }
        
        return {
          id: item.id,
          created_at: item.created_at,
          property_id: item.property_id,
          property: propertyData,
          name: item.name,
          email: item.email,
          message: item.message,
          is_read: item.is_read
        };
      }) || [];
      
      setSubmissions(formattedData);
    } catch (error: any) {
      console.error('Error fetching submissions:', error);
      toast({
        title: "Error",
        description: "Failed to load submissions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [toast]);

  const handleReply = (submission: Submission) => {
    setSelectedSubmission(submission);
    setReplyDialogOpen(true);
  };

  const handleDelete = (submission: Submission) => {
    setSelectedSubmission(submission);
    setDeleteDialogOpen(true);
  };

  const handleArchive = (submission: Submission) => {
    setSelectedSubmission(submission);
    setArchiveDialogOpen(true);
  };

  const sendReply = async (message: string) => {
    if (!selectedSubmission || !user || !profile) return;
    
    setIsSending(true);
    try {
      // First, save the reply in the database
      const { error: dbError } = await supabase
        .from('property_submission_replies')
        .insert({
          submission_id: selectedSubmission.id,
          reply_text: message,
          agent_id: profile.id,
        });

      if (dbError) throw dbError;
      
      // Send email via Edge Function
      try {
        const { error: fnError } = await supabase.functions.invoke('send-submission-reply', {
          body: {
            submissionId: selectedSubmission.id,
            replyText: message,
            propertyId: selectedSubmission.property_id
          }
        });
        
        if (fnError) {
          console.warn('Edge function error (continuing):', fnError);
        }
      } catch (edgeFnError) {
        console.warn('Edge function error (continuing):', edgeFnError);
      }
      
      // Mark as read
      await supabase
        .from('property_contact_submissions')
        .update({ is_read: true })
        .eq('id', selectedSubmission.id);
      
      toast({
        title: "Success",
        description: "Reply sent successfully",
      });
      
      setReplyDialogOpen(false);
      fetchSubmissions();
    } catch (error: any) {
      console.error('Error sending reply:', error);
      toast({
        title: "Error",
        description: "Failed to send reply",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedSubmission) return;
    
    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from('property_contact_submissions')
        .delete()
        .eq('id', selectedSubmission.id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Submission deleted successfully",
      });
      
      setDeleteDialogOpen(false);
      fetchSubmissions();
    } catch (error: any) {
      console.error('Error deleting submission:', error);
      toast({
        title: "Error",
        description: "Failed to delete submission",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const confirmArchive = async () => {
    if (!selectedSubmission) return;
    
    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from('property_contact_submissions')
        .update({ is_read: true })
        .eq('id', selectedSubmission.id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Submission archived successfully",
      });
      
      setArchiveDialogOpen(false);
      fetchSubmissions();
    } catch (error: any) {
      console.error('Error archiving submission:', error);
      toast({
        title: "Error",
        description: "Failed to archive submission",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [toast]);

  return (
    <CardContent>
      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : submissions.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-muted-foreground">
          No communications found
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map(submission => (
            <div 
              key={submission.id}
              className={`p-4 border rounded-lg ${submission.is_read ? 'bg-background' : 'bg-accent'}`}
            >
              <div className="flex justify-between mb-2">
                <h3 className="font-medium">{submission.name}</h3>
                <span className="text-sm text-muted-foreground">
                  {new Date(submission.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm mb-2 line-clamp-2">{submission.message}</p>
              <div className="flex justify-between items-center">
                <div className="text-xs text-muted-foreground">
                  <span>{submission.email}</span>
                  <span className="mx-2">•</span>
                  <span>Property: {submission.property.title}</span>
                </div>
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8" 
                    onClick={() => handleReply(submission)}
                    title="Reply"
                  >
                    <Reply className="h-4 w-4" />
                  </Button>
                  {!submission.is_read && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8" 
                      onClick={() => handleArchive(submission)}
                      title="Archive"
                    >
                      <Archive className="h-4 w-4" />
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-destructive" 
                    onClick={() => handleDelete(submission)}
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {selectedSubmission && (
        <>
          <ReplyDialog 
            isOpen={replyDialogOpen} 
            onClose={() => setReplyDialogOpen(false)} 
            onSave={sendReply}
            isSending={isSending}
          />
          
          <ConfirmDialog
            isOpen={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
            onConfirm={confirmDelete}
            isProcessing={isProcessing}
            title="Delete Submission"
            message="Are you sure you want to delete this submission? This action cannot be undone."
          />
          
          <ConfirmDialog
            isOpen={archiveDialogOpen}
            onClose={() => setArchiveDialogOpen(false)}
            onConfirm={confirmArchive}
            isProcessing={isProcessing}
            title="Archive Submission"
            message="Are you sure you want to archive this submission? It will be marked as read."
          />
        </>
      )}
    </CardContent>
  );
}

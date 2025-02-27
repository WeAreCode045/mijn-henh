
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { PropertySubmissionsDialog } from "@/components/property/PropertySubmissionsDialog";
import { FileDown, Globe, Share2, Save, Trash2, Mailbox } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Code } from "@/components/ui/code";

interface Submission {
  id: string;
  name: string;
  email: string;
  phone: string;
  inquiry_type: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

interface PropertyDashboardTabProps {
  id: string;
  objectId?: string;
  title: string;
  agentId?: string;
  agentName?: string;
  templateId?: string;
  templateName?: string;
  createdAt?: string;
  updatedAt?: string;
  onSave: () => void;
  onDelete: () => void;
  onGeneratePDF: () => void;
  onWebView: () => void;
}

export function PropertyDashboardTab({
  id,
  objectId,
  title,
  agentId,
  agentName,
  templateId,
  templateName,
  createdAt,
  updatedAt,
  onSave,
  onDelete,
  onGeneratePDF,
  onWebView,
}: PropertyDashboardTabProps) {
  const [notes, setNotes] = useState<string>("");
  const [isSubmissionsOpen, setIsSubmissionsOpen] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const { toast } = useToast();
  const apiEndpoint = `${window.location.origin}/api/properties/${id}`;

  // Fetch submissions when opening the dialog
  const handleOpenSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('property_contact_submissions')
        .select('*')
        .eq('property_id', id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setSubmissions(data || []);
      setIsSubmissionsOpen(true);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast({
        title: "Error",
        description: "Failed to load contact submissions",
        variant: "destructive",
      });
    }
  };

  const handleMarkAsRead = async (submissionId: string) => {
    try {
      const { error } = await supabase
        .from('property_contact_submissions')
        .update({ is_read: true })
        .eq('id', submissionId);
      
      if (error) throw error;
      
      // Update local state
      setSubmissions(prev => 
        prev.map(sub => sub.id === submissionId ? {...sub, is_read: true} : sub)
      );
      
      toast({
        description: "Marked as read",
      });
    } catch (error) {
      console.error('Error marking submission as read:', error);
      toast({
        title: "Error",
        description: "Failed to update submission",
        variant: "destructive",
      });
    }
  };

  const handleSaveNotes = async () => {
    try {
      // TODO: Save notes to the database
      toast({
        description: "Notes saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save notes",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={onSave} title="Save">
            <Save className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={onWebView} title="Web View">
            <Globe className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={onGeneratePDF} title="Generate PDF">
            <FileDown className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            asChild
            title="Share Link"
          >
            <a href={`/share/${id}`} target="_blank" rel="noopener noreferrer">
              <Share2 className="h-4 w-4" />
            </a>
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleOpenSubmissions}
            title="Contact Submissions"
          >
            <Mailbox className="h-4 w-4" />
          </Button>
          <Button 
            variant="destructive" 
            size="icon" 
            onClick={onDelete}
            title="Delete Property"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Property Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <span className="text-sm font-medium">ID:</span>
              <p className="text-sm font-mono">{id}</p>
            </div>
            
            <div>
              <span className="text-sm font-medium">Object ID:</span>
              <p className="text-sm font-mono">{objectId || 'Not set'}</p>
            </div>
            
            <div>
              <span className="text-sm font-medium">API Endpoint:</span>
              <Code className="text-xs mt-1">{apiEndpoint}</Code>
            </div>
            
            {agentName && (
              <div>
                <span className="text-sm font-medium">Assigned Agent:</span>
                <p className="text-sm">{agentName}</p>
              </div>
            )}
            
            {templateName && (
              <div>
                <span className="text-sm font-medium">Brochure Template:</span>
                <p className="text-sm">{templateName}</p>
              </div>
            )}
            
            {createdAt && (
              <div>
                <span className="text-sm font-medium">Created:</span>
                <p className="text-sm">{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</p>
              </div>
            )}
            
            {updatedAt && (
              <div>
                <span className="text-sm font-medium">Last Modified:</span>
                <p className="text-sm">{formatDistanceToNow(new Date(updatedAt), { addSuffix: true })}</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-500 italic">
              No recent activity to display.
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes about this property..."
            className="min-h-32"
          />
          <Button 
            className="mt-4" 
            onClick={handleSaveNotes}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Notes
          </Button>
        </CardContent>
      </Card>
      
      <PropertySubmissionsDialog 
        open={isSubmissionsOpen}
        onOpenChange={setIsSubmissionsOpen}
        propertyTitle={title}
        submissions={submissions}
        onMarkAsRead={handleMarkAsRead}
      />
    </div>
  );
}

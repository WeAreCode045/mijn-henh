
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle, Search, Send } from "lucide-react";

interface CommunicationsTabContentProps {
  id: string;
  title: string;
}

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
};

export function CommunicationsTabContent({ id, title }: CommunicationsTabContentProps) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [responseText, setResponseText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchSubmissions();
  }, [id]);

  const fetchSubmissions = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('property_contact_submissions')
        .select('*')
        .eq('property_id', id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load contact submissions',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (submissionId: string) => {
    try {
      await supabase
        .from('property_contact_submissions')
        .update({ is_read: true })
        .eq('id', submissionId);

      // Update local state
      setSubmissions(subs => 
        subs.map(sub => sub.id === submissionId ? { ...sub, is_read: true } : sub)
      );
      
      // Update selected submission if it's the current one
      if (selectedSubmission?.id === submissionId) {
        setSelectedSubmission(prev => prev ? { ...prev, is_read: true } : null);
      }

      toast({
        title: 'Marked as read',
        description: 'The submission has been marked as read',
      });
    } catch (error) {
      console.error('Error marking submission as read:', error);
      toast({
        title: 'Error',
        description: 'Failed to mark submission as read',
        variant: 'destructive',
      });
    }
  };

  const handleSendResponse = async () => {
    if (!selectedSubmission || !responseText.trim()) return;
    
    try {
      // Here you'd implement the actual email sending logic
      // For now, we'll just update the submission with the response
      await supabase
        .from('property_contact_submissions')
        .update({ 
          response: responseText,
          is_read: true
        })
        .eq('id', selectedSubmission.id);

      toast({
        title: 'Response sent',
        description: 'Your response has been sent successfully',
      });

      // Update local state
      setSubmissions(subs => 
        subs.map(sub => sub.id === selectedSubmission.id 
          ? { ...sub, response: responseText, is_read: true } 
          : sub)
      );
      
      // Clear form
      setResponseText("");
      setSelectedSubmission(prev => prev ? { ...prev, response: responseText, is_read: true } : null);
      
    } catch (error) {
      console.error('Error sending response:', error);
      toast({
        title: 'Error',
        description: 'Failed to send your response',
        variant: 'destructive',
      });
    }
  };

  const filteredSubmissions = submissions.filter(submission =>
    submission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.message?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInquiryTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      'information': 'Meer informatie',
      'viewing': 'Bezichtiging',
      'offer': 'Bod'
    };
    return types[type] || type;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Contact Submissions</span>
              <span className="text-sm font-normal text-muted-foreground">
                {submissions.length} total
              </span>
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search submissions..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Spinner />
              </div>
            ) : filteredSubmissions.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                {searchTerm ? "No matching submissions found" : "No submissions yet"}
              </p>
            ) : (
              <div className="space-y-2">
                {filteredSubmissions.map((submission) => (
                  <div
                    key={submission.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors
                      ${submission.is_read ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'}
                      ${selectedSubmission?.id === submission.id ? 'ring-2 ring-primary' : ''}
                    `}
                    onClick={() => setSelectedSubmission(submission)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{submission.name}</h4>
                        <p className="text-sm text-gray-600">
                          {getInquiryTypeLabel(submission.inquiry_type)}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {format(new Date(submission.created_at), 'dd/MM/yyyy')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-2">
        {selectedSubmission ? (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>{selectedSubmission.name}</CardTitle>
                {!selectedSubmission.is_read && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => handleMarkAsRead(selectedSubmission.id)}
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Mark as read</span>
                  </Button>
                )}
              </div>
              <div className="flex flex-col text-sm">
                <div className="text-gray-600">
                  <span className="font-medium">Type:</span> {getInquiryTypeLabel(selectedSubmission.inquiry_type)}
                </div>
                <div className="text-gray-600">
                  <span className="font-medium">Email:</span>{" "}
                  <a href={`mailto:${selectedSubmission.email}`} className="text-blue-600 hover:underline">
                    {selectedSubmission.email}
                  </a>
                </div>
                <div className="text-gray-600">
                  <span className="font-medium">Phone:</span>{" "}
                  <a href={`tel:${selectedSubmission.phone}`} className="text-blue-600 hover:underline">
                    {selectedSubmission.phone}
                  </a>
                </div>
                <div className="text-gray-600">
                  <span className="font-medium">Date:</span>{" "}
                  {format(new Date(selectedSubmission.created_at), 'dd MMMM yyyy, HH:mm')}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {selectedSubmission.message && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Message from client:</h3>
                  <div className="bg-gray-50 p-4 rounded-lg border">{selectedSubmission.message}</div>
                </div>
              )}

              {selectedSubmission.response && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Your response:</h3>
                  <div className="bg-gray-50 p-4 rounded-lg border">{selectedSubmission.response}</div>
                </div>
              )}

              {!selectedSubmission.response && (
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
                    disabled={!responseText.trim()}
                    className="flex items-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    <span>Send Response</span>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8 border rounded-lg">
            <p className="text-center">Select a submission to view details and respond</p>
          </div>
        )}
      </div>
    </div>
  );
}


import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Upload, Download, Trash, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DocumentManagementProps {
  propertyId: string;
}

interface Document {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  created_at: string;
}

export function DocumentManagement({ propertyId }: DocumentManagementProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showAddDocumentDialog, setShowAddDocumentDialog] = useState(false);
  const [documentName, setDocumentName] = useState("");
  const { toast } = useToast();

  // This is a placeholder for actual document fetching from Supabase
  // In a real implementation, you would fetch documents from storage bucket
  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      // Implementation would fetch from supabase storage
      // For now, return empty array as this is a demo
      setDocuments([]);
    } catch (error) {
      console.error("Error fetching documents:", error);
      toast({
        title: "Error",
        description: "Failed to load documents",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!documentName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a document name",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      // This would upload to Supabase storage
      // Example implementation (not active):
      /*
      const { data, error } = await supabase.storage
        .from("property_documents")
        .upload(`${propertyId}/${documentName}`, file);

      if (error) throw error;
      */

      toast({
        title: "Success",
        description: "Document uploaded successfully",
      });

      setShowAddDocumentDialog(false);
      setDocumentName("");
      // Refresh documents list
      fetchDocuments();
    } catch (error) {
      console.error("Error uploading document:", error);
      toast({
        title: "Error",
        description: "Failed to upload document",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    try {
      // This would delete from Supabase storage
      // Example implementation (not active):
      /*
      const { error } = await supabase.storage
        .from("property_documents")
        .remove([`${propertyId}/${documentId}`]);

      if (error) throw error;
      */

      toast({
        title: "Success",
        description: "Document deleted successfully",
      });

      // Refresh documents list
      fetchDocuments();
    } catch (error) {
      console.error("Error deleting document:", error);
      toast({
        title: "Error",
        description: "Failed to delete document",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Property Documents</CardTitle>
        <Dialog open={showAddDocumentDialog} onOpenChange={setShowAddDocumentDialog}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Document
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Document</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="documentName">Document Name</Label>
                <Input
                  id="documentName"
                  value={documentName}
                  onChange={(e) => setDocumentName(e.target.value)}
                  placeholder="Enter document name"
                />
              </div>
              <div>
                <Label htmlFor="documentFile">Select File</Label>
                <Input
                  id="documentFile"
                  type="file"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                />
              </div>
              <Button 
                className="w-full" 
                onClick={() => document.getElementById('documentFile')?.click()}
                disabled={isUploading || !documentName.trim()}
              >
                {isUploading ? "Uploading..." : "Upload Document"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center p-4">Loading documents...</div>
        ) : documents.length === 0 ? (
          <div className="text-center text-muted-foreground p-8">
            <FileText className="mx-auto h-10 w-10 mb-2" />
            <p>No documents available</p>
            <p className="text-sm">Upload documents to share with participants</p>
          </div>
        ) : (
          <div className="divide-y">
            {documents.map((doc) => (
              <div key={doc.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-blue-500" />
                  <div>
                    <p className="font-medium">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(doc.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon" title="Download">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    title="Delete"
                    onClick={() => handleDeleteDocument(doc.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

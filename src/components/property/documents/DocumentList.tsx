
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Document } from "@/types/document";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { DocumentUploadDialog } from "./DocumentUploadDialog";
import { useDocuments } from "@/hooks/useDocuments";
import { FileIcon, Pencil, Trash2, UserCheck, UserX } from "lucide-react";
import { DocumentViewDialog } from "./DocumentViewDialog";

interface DocumentListProps {
  propertyId?: string;
  isGlobal?: boolean;
  canManage?: boolean;
  showSignatureStatus?: boolean;
}

export function DocumentList({ 
  propertyId, 
  isGlobal = false,
  canManage = false,
  showSignatureStatus = false
}: DocumentListProps) {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  
  const { 
    documents, 
    isLoading, 
    deleteDocument 
  } = useDocuments(propertyId, isGlobal);
  
  const handleViewDocument = (document: Document) => {
    setSelectedDocument(document);
    setViewDialogOpen(true);
  };

  const getSignatureStatus = (document: Document) => {
    if (!document.requires_signature || !document.signatures || document.signatures.length === 0) {
      return null;
    }

    const totalSignatures = document.signatures.length;
    const signedCount = document.signatures.filter(s => s.status === 'signed').length;
    const pendingCount = document.signatures.filter(s => s.status === 'pending').length;
    const declinedCount = document.signatures.filter(s => s.status === 'declined').length;

    if (declinedCount > 0) {
      return <Badge variant="destructive" className="flex items-center gap-1">
        <UserX className="h-3 w-3" />
        {signedCount}/{totalSignatures} Signed ({declinedCount} Declined)
      </Badge>;
    }

    if (pendingCount > 0) {
      return <Badge variant="outline" className="flex items-center gap-1 bg-amber-100">
        <Pencil className="h-3 w-3" />
        {signedCount}/{totalSignatures} Signed
      </Badge>;
    }

    return <Badge variant="outline" className="flex items-center gap-1 bg-green-100">
      <UserCheck className="h-3 w-3" />
      All Signed
    </Badge>;
  };

  return (
    <div className="space-y-4">
      {canManage && (
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">{isGlobal ? 'Global Documents' : 'Property Documents'}</h3>
          <Button 
            size="sm" 
            onClick={() => setUploadDialogOpen(true)}
          >
            Upload Document
          </Button>
        </div>
      )}
      
      {isLoading ? (
        <div className="flex justify-center p-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
        </div>
      ) : documents && documents.length > 0 ? (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document</TableHead>
                <TableHead>Type</TableHead>
                {showSignatureStatus && <TableHead>Signatures</TableHead>}
                <TableHead>Uploaded By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((document) => (
                <TableRow key={document.id} className="cursor-pointer" onClick={() => handleViewDocument(document)}>
                  <TableCell className="font-medium flex items-center gap-2">
                    <FileIcon className="h-4 w-4" />
                    {document.title}
                  </TableCell>
                  <TableCell className="capitalize">{document.document_type}</TableCell>
                  {showSignatureStatus && <TableCell>{getSignatureStatus(document)}</TableCell>}
                  <TableCell>{document.creator?.full_name || 'Unknown'}</TableCell>
                  <TableCell>{new Date(document.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                      <a 
                        href={document.file_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        View
                      </a>
                      {canManage && (
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteDocument(document.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="bg-gray-50 p-4 rounded-md text-center text-gray-500">
          No documents available.
        </div>
      )}
      
      {canManage && (
        <DocumentUploadDialog 
          open={uploadDialogOpen} 
          onOpenChange={setUploadDialogOpen}
          propertyId={propertyId}
          isGlobal={isGlobal}
        />
      )}

      <DocumentViewDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        document={selectedDocument}
      />
    </div>
  );
}

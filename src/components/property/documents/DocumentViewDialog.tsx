
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Document } from "@/types/document";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { useDocuments } from "@/hooks/useDocuments";
import { useState } from "react";
import { Check, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface DocumentViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: Document | null;
}

export function DocumentViewDialog({
  open,
  onOpenChange,
  document,
}: DocumentViewDialogProps) {
  const { user } = useAuth();
  const [signatureData, setSignatureData] = useState("");
  const { signDocument } = useDocuments(document?.property_id);

  if (!document) return null;

  // Find if current user has a pending signature for this document
  const userSignature = user && document.signatures?.find(
    sig => sig.user_id === user.id
  );

  const needsSignature = userSignature && userSignature.status === 'pending';

  const handleSign = async (status: 'signed' | 'declined') => {
    if (!userSignature) return;
    
    await signDocument({
      signatureId: userSignature.id,
      status,
      signatureData: status === 'signed' ? signatureData : undefined
    });
    
    onOpenChange(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{document.title}</span>
            <Badge className="capitalize">{document.document_type}</Badge>
          </DialogTitle>
          <DialogDescription>
            {document.description || "No description provided."}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-4 border rounded-md bg-slate-50">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-500">Uploaded by</span>
              <span>{document.creator?.full_name || "Unknown"}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-500">Date uploaded</span>
              <span>{formatDate(document.created_at)}</span>
            </div>
            {document.requires_signature && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Requires signature</span>
                <Badge>Yes</Badge>
              </div>
            )}
          </div>

          <div className="aspect-[16/9] relative">
            <iframe
              src={document.file_url}
              className="absolute inset-0 w-full h-full border rounded-md"
              title={document.title}
            />
          </div>

          {document.signatures && document.signatures.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Signatures</h4>
              <div className="border rounded-md divide-y">
                {document.signatures.map(signature => (
                  <div key={signature.id} className="flex justify-between items-center p-2">
                    <span>{signature.user?.full_name || 'Unknown'}</span>
                    <div className="flex items-center">
                      {signature.status === 'pending' ? (
                        <Badge variant="outline" className="bg-amber-100">Pending</Badge>
                      ) : signature.status === 'signed' ? (
                        <Badge variant="outline" className="bg-green-100">Signed</Badge>
                      ) : (
                        <Badge variant="destructive">Declined</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {needsSignature && (
            <>
              <Separator />
              <div className="space-y-4">
                <h4 className="font-medium">Your signature is required</h4>
                <div>
                  <label htmlFor="signature" className="block text-sm mb-2">
                    Type your full name to sign:
                  </label>
                  <input
                    id="signature"
                    type="text"
                    value={signatureData}
                    onChange={e => setSignatureData(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    placeholder="Your full name"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="destructive"
                    onClick={() => handleSign('declined')}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Decline
                  </Button>
                  <Button
                    onClick={() => handleSign('signed')}
                    disabled={!signatureData.trim()}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Sign Document
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}


import { format } from "date-fns";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Submission } from "@/types/submission";

interface PropertySubmissionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  propertyTitle: string;
  submissions: Submission[];
  onMarkAsRead: (id: string) => void;
}

export const PropertySubmissionsDialog = ({
  open,
  onOpenChange,
  propertyTitle,
  submissions,
  onMarkAsRead
}: PropertySubmissionsDialogProps) => {
  const getInquiryTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      'information': 'Meer informatie',
      'viewing': 'Bezichtiging',
      'offer': 'Bod'
    };
    return types[type] || type;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Berichten voor {propertyTitle}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {submissions.length === 0 ? (
            <p className="text-center text-gray-500 py-4">Geen berichten gevonden</p>
          ) : (
            submissions.map((submission) => (
              <div 
                key={submission.id} 
                className={`p-4 rounded-lg border ${submission.is_read ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">{submission.name}</h4>
                    <p className="text-sm text-gray-600">{getInquiryTypeLabel(submission.inquiry_type)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                      {format(new Date(submission.created_at), 'dd/MM/yyyy HH:mm')}
                    </span>
                    {!submission.is_read && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => onMarkAsRead(submission.id)}
                        className="h-8"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Markeer als gelezen
                      </Button>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm mb-2">
                  <p>
                    <span className="text-gray-600">E-mail:</span>{" "}
                    <a href={`mailto:${submission.email}`} className="text-blue-600 hover:underline">
                      {submission.email}
                    </a>
                  </p>
                  <p>
                    <span className="text-gray-600">Telefoon:</span>{" "}
                    <a href={`tel:${submission.phone}`} className="text-blue-600 hover:underline">
                      {submission.phone}
                    </a>
                  </p>
                </div>
                {submission.message && (
                  <p className="text-sm mt-2 text-gray-700">{submission.message}</p>
                )}
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

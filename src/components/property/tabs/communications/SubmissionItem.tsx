
import { format } from "date-fns";
import { CheckCircle } from "lucide-react";

type SubmissionItemProps = {
  submission: Submission;
  isSelected: boolean;
  onClick: () => void;
  onMarkAsRead: (id: string) => void;
};

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
  response_date?: string;
};

export function SubmissionItem({ submission, isSelected, onClick, onMarkAsRead }: SubmissionItemProps) {
  const getInquiryTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      'information': 'Meer informatie',
      'viewing': 'Bezichtiging',
      'offer': 'Bod'
    };
    return types[type] || type;
  };

  return (
    <div
      className={`p-3 rounded-lg border cursor-pointer transition-colors
        ${submission.is_read ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'}
        ${isSelected ? 'ring-2 ring-primary' : ''}
        ${submission.response ? 'border-l-4 border-l-green-500' : ''}
      `}
      onClick={onClick}
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
  );
}


import { format } from "date-fns";

interface PropertyDatesProps {
  createdAt?: string;
  updatedAt?: string;
}

export function PropertyDates({ createdAt, updatedAt }: PropertyDatesProps) {
  // Format date properly
  const formatDateString = (dateString?: string) => {
    if (!dateString) return "N/A";
    
    try {
      const date = new Date(dateString);
      return format(date, "dd/MM/yyyy HH:mm");
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  return (
    <div className="space-y-2">
      <div>
        <p className="text-sm font-medium">Created</p>
        <p className="text-sm">{createdAt ? formatDateString(createdAt) : "N/A"}</p>
      </div>
      <div>
        <p className="text-sm font-medium">Last Updated</p>
        <p className="text-sm">{updatedAt ? formatDateString(updatedAt) : "N/A"}</p>
      </div>
    </div>
  );
}

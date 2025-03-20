
import { format } from "date-fns";

interface PropertyDatesProps {
  createdAt?: string;
  updatedAt?: string;
}

export function PropertyDates({ createdAt, updatedAt }: PropertyDatesProps) {
  // Format dates or show placeholder
  const formattedCreatedAt = createdAt ? format(new Date(createdAt), "MMM d, yyyy HH:mm") : "Not available";
  const formattedUpdatedAt = updatedAt ? format(new Date(updatedAt), "MMM d, yyyy HH:mm") : "Not yet saved";

  return (
    <div className="space-y-1 text-sm">
      <div>
        <span className="font-medium text-muted-foreground">Created:</span>{" "}
        <span>{formattedCreatedAt}</span>
      </div>
      <div>
        <span className="font-medium text-muted-foreground">Last Updated:</span>{" "}
        <span>{formattedUpdatedAt}</span>
      </div>
    </div>
  );
}

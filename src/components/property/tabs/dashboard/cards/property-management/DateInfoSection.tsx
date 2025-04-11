
import { formatDate } from "@/utils/dateUtils";

interface DateInfoSectionProps {
  createdAt?: string;
  updatedAt?: string;
}

export function DateInfoSection({ createdAt, updatedAt }: DateInfoSectionProps) {
  if (!createdAt && !updatedAt) return null;

  return (
    <div className="space-y-2 text-sm text-muted-foreground">
      {createdAt && (
        <p>Created: {formatDate(createdAt)}</p>
      )}
      {updatedAt && (
        <p>Last updated: {formatDate(updatedAt)}</p>
      )}
    </div>
  );
}


import { format, parseISO } from "date-fns";

/**
 * Formats a date string to a more readable format
 * @param dateString - ISO date string
 * @param formatPattern - Optional custom format pattern 
 * @returns Formatted date string
 */
export function formatDate(dateString: string, formatPattern: string = "MMM d, yyyy 'at' h:mm a"): string {
  if (!dateString) return "Unknown date";
  
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString);
    return format(date, formatPattern);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
}

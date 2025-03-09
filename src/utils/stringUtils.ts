
/**
 * Safely converts a value to string, handling null, undefined, or objects without toString
 * @param value The value to convert to string
 * @returns A string representation of the value or an empty string if conversion isn't possible
 */
export function safeToString(value: any): string {
  if (value === null || value === undefined) {
    return '';
  }
  
  try {
    return String(value);
  } catch (error) {
    console.error("Error converting value to string:", error);
    return '';
  }
}

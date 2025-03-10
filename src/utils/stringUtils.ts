
/**
 * Safely converts any value to a string
 * Handles undefined and null values by returning an empty string
 */
export const safeToString = (value: any): string => {
  if (value === undefined || value === null) {
    return '';
  }
  return String(value);
};
